import { create } from 'zustand'
import {
  commands,
  type HeaderEntry,
  type RequestFile,
  type AuthRef,
  type ResolvedVariable,
} from '../bindings'
import { useWorkspaceStore } from './workspaceStore'
import { useEnvironmentStore } from './environmentStore'

export type ComposerTabId =
  | 'params'
  | 'body'
  | 'headers'
  | 'auth'
  | 'vars'
  | 'script'
  | 'assert'
  | 'tests'
  | 'docs'
  | 'file'
  | 'settings'

export interface RequestData {
  name: string
  url: string
  method: string
  params: HeaderEntry[]
  headers: HeaderEntry[]
  body: {
    type: string
    text: string
    form: HeaderEntry[]
    file: string | null
  }
  auth: {
    type: string
    config: Record<string, unknown>
  }
  scripts: {
    pre: string
    post: string
  }
  tests: string
  activeComposerTab: ComposerTabId
  inFlight: boolean
  requestId: string | null
}

interface RequestState {
  // tabId -> state
  requestStates: Record<string, RequestData>
  resolvedVariables: Record<string, Record<string, ResolvedVariable>>
  updateRequest: (tabId: string, data: Partial<RequestData>) => void
  setInFlight: (tabId: string, inFlight: boolean, requestId: string | null) => void
  getRequestState: (tabId: string) => RequestData
  saveRequest: (tabId: string, path: string) => Promise<void>
  populateRequest: (tabId: string, content: RequestFile) => void
  fetchResolvedVariables: (tabId: string, collectionId: string | null) => Promise<void>
}

const DEFAULT_REQUEST_STATE: RequestData = {
  name: 'Untitled',
  url: '',
  method: 'GET',
  params: [],
  headers: [],
  body: {
    type: 'none',
    text: '',
    form: [],
    file: null,
  },
  auth: {
    type: 'none',
    config: {},
  },
  scripts: {
    pre: '',
    post: '',
  },
  tests: '',
  activeComposerTab: 'params',
  inFlight: false,
  requestId: null,
}

function syncParamsFromUrl(url: string, currentParams: HeaderEntry[]): HeaderEntry[] {
  const queryIndex = url.indexOf('?')
  if (queryIndex === -1) {
    return currentParams
  }

  const fragmentIndex = url.indexOf('#')
  const queryEnd = fragmentIndex !== -1 ? fragmentIndex : url.length
  const queryString = url.slice(queryIndex + 1, queryEnd)

  const parsedParams: HeaderEntry[] = []
  if (queryString) {
    const pairs = queryString.split('&')
    pairs.forEach((pair) => {
      if (!pair) return
      const eqIdx = pair.indexOf('=')
      let key: string
      let value = ''
      try {
        if (eqIdx === -1) {
          key = decodeURIComponent(pair.replace(/\+/g, '%20'))
        } else {
          key = decodeURIComponent(pair.slice(0, eqIdx).replace(/\+/g, '%20'))
          value = decodeURIComponent(pair.slice(eqIdx + 1).replace(/\+/g, '%20'))
        }
      } catch (_e) {
        if (eqIdx === -1) {
          key = pair
        } else {
          key = pair.slice(0, eqIdx)
          value = pair.slice(eqIdx + 1)
        }
      }
      parsedParams.push({ key, value, enabled: true })
    })
  }

  const disabledParams = currentParams.filter((p) => !p.enabled)
  return [...parsedParams, ...disabledParams]
}

function syncUrlFromParams(url: string, params: HeaderEntry[]): string {
  const queryIndex = url.indexOf('?')
  const fragmentIndex = url.indexOf('#')
  let baseUrl = url
  let fragment = ''

  if (queryIndex !== -1) {
    baseUrl = url.slice(0, queryIndex)
  } else if (fragmentIndex !== -1) {
    baseUrl = url.slice(0, fragmentIndex)
  }

  if (fragmentIndex !== -1) {
    fragment = url.slice(fragmentIndex)
  }

  const enabledParams = params.filter(
    (p) => p.enabled && (p.key.trim() !== '' || p.value.trim() !== '')
  )

  if (enabledParams.length > 0) {
    const queryString = enabledParams
      .map((p) => {
        const k = encodeURIComponent(p.key)
        const v = encodeURIComponent(p.value)
        return `${k}=${v}`
      })
      .join('&')
    return `${baseUrl}?${queryString}${fragment}`
  } else {
    return `${baseUrl}${fragment}`
  }
}

export const useRequestStore = create<RequestState>((set, get) => ({
  requestStates: {},
  resolvedVariables: {},

  updateRequest: (tabId, data) =>
    set((state) => {
      const current = state.requestStates[tabId] || DEFAULT_REQUEST_STATE
      const updated = { ...current, ...data }

      // If URL is explicitly updated, sync params
      if (data.url !== undefined && data.url !== current.url) {
        const syncedParams = syncParamsFromUrl(data.url, current.params)
        if (JSON.stringify(syncedParams) !== JSON.stringify(current.params)) {
          updated.params = syncedParams
        }
      }

      // If Params are explicitly updated, sync URL
      if (
        data.params !== undefined &&
        JSON.stringify(data.params) !== JSON.stringify(current.params)
      ) {
        const syncedUrl = syncUrlFromParams(current.url, data.params)
        if (syncedUrl !== current.url) {
          updated.url = syncedUrl
        }
      }

      return {
        requestStates: {
          ...state.requestStates,
          [tabId]: updated,
        },
      }
    }),

  setInFlight: (tabId, inFlight, requestId) =>
    set((state) => ({
      requestStates: {
        ...state.requestStates,
        [tabId]: {
          ...(state.requestStates[tabId] || DEFAULT_REQUEST_STATE),
          inFlight,
          requestId,
        },
      },
    })),

  getRequestState: (tabId) => {
    return get().requestStates[tabId] || DEFAULT_REQUEST_STATE
  },

  populateRequest: (tabId, content) => {
    let bodyType: string = 'none'
    let bodyText: string = ''
    let bodyForm: HeaderEntry[] = []

    if (content.body) {
      if (content.body.json) {
        bodyType = 'json'
        bodyText = content.body.json
      } else if (content.body.text) {
        bodyType = 'text'
        bodyText = content.body.text
      } else if (content.body.form) {
        bodyType = 'form'
        bodyForm = Object.entries(content.body.form).map(([key, value]) => ({
          key,
          value,
          enabled: true,
        }))
      }
    }

    const data: Partial<RequestData> = {
      name: content.name,
      method: content.method,
      url: content.url,
      headers: Object.entries(content.headers || {}).map(([key, value]) => ({
        key,
        value,
        enabled: true,
      })),
      params: Object.entries(content.params || {}).map(([key, value]) => ({
        key,
        value,
        enabled: true,
      })),
      body: {
        type: bodyType,
        text: bodyText,
        form: bodyForm,
        file: null,
      },
      auth: content.auth
        ? {
            type: content.auth.type,
            config: { ...content.auth } as Record<string, string>,
          }
        : { type: 'none', config: {} },
      scripts: {
        pre: content.scripts?.pre || '',
        post: content.scripts?.post || '',
      },
      tests: content.tests || '',
    }
    get().updateRequest(tabId, data)
  },

  saveRequest: async (tabId, path) => {
    const data = get().requestStates[tabId]
    if (!data || !path) return

    const requestFile: RequestFile = {
      version: '1',
      name: data.name,
      method: data.method,
      url: data.url,
      headers: data.headers.reduce(
        (acc, h) => (h.key.trim() ? { ...acc, [h.key]: h.value } : acc),
        {}
      ),
      params: data.params.reduce(
        (acc, p) => (p.key.trim() ? { ...acc, [p.key]: p.value } : acc),
        {}
      ),
      body:
        data.body.type === 'none'
          ? null
          : {
              text: data.body.type === 'text' ? data.body.text : undefined,
              json: data.body.type === 'json' ? data.body.text : undefined,
              form:
                data.body.type === 'form'
                  ? data.body.form.reduce(
                      (acc, f) => (f.key.trim() ? { ...acc, [f.key]: f.value } : acc),
                      {}
                    )
                  : undefined,
            },
      auth: data.auth.type === 'none' ? null : (data.auth as unknown as AuthRef),
      scripts: { pre: data.scripts.pre, post: data.scripts.post },
      tests: data.tests,
    }

    const result = await commands.saveRequest(requestFile, path)
    if (result.status === 'error') {
      console.error('Failed to save request', result.error)
      throw new Error(result.error)
    }
  },

  fetchResolvedVariables: async (tabId, collectionId) => {
    const workspacePath = useWorkspaceStore.getState().activeWorkspacePath
    const environmentName = useEnvironmentStore.getState().activeEnvironmentName
    if (!workspacePath) return

    try {
      const result = await commands.getResolvedVariables(
        workspacePath,
        collectionId,
        environmentName
      )
      if (result.status === 'ok') {
        set((state) => ({
          resolvedVariables: {
            ...state.resolvedVariables,
            [tabId]: result.data,
          },
        }))
      }
    } catch (err) {
      console.error('Failed to fetch resolved variables', err)
    }
  },
}))
