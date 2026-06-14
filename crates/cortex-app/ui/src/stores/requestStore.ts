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
import { useCollectionEnvironmentStore } from './collectionEnvironmentStore'
import { useCollectionStore } from './collectionStore'

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
    type: 'none' | 'json' | 'form-data' | 'url-encoded' | 'raw' | 'file'
    json: string
    rawText: string
    rawSubtype: 'text' | 'html' | 'xml' | 'javascript' | 'other'
    formFields: {
      key: string
      value: string
      isFile: boolean
      filePath: string
      enabled: boolean
    }[]
    urlEncodedFields: { key: string; value: string; enabled: boolean }[]
    filePath: string | null
    fileFilter: string
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
  settings: {
    timeout: string
    redirectBehavior: 'default' | 'follow' | 'manual'
  }
  tags: string[]
  activeComposerTab: ComposerTabId
  inFlight: boolean
  requestId: string | null
}

interface RequestState {
  // tabId -> state
  requestStates: Record<string, RequestData>
  resolvedVariables: Record<string, Record<string, ResolvedVariable>>
  /** Last (tabId, collectionId) passed to fetchResolvedVariables — used to re-resolve
   * after a global change (e.g. toggling the global environment active state). */
  _resolutionCtx: { tabId: string; collectionId: string | null } | null
  updateRequest: (tabId: string, data: Partial<RequestData>) => void
  setInFlight: (tabId: string, inFlight: boolean, requestId: string | null) => void
  getRequestState: (tabId: string) => RequestData
  saveRequest: (tabId: string, path: string) => Promise<void>
  populateRequest: (tabId: string, content: RequestFile) => void
  fetchResolvedVariables: (tabId: string, collectionId: string | null) => Promise<void>
  /** Re-run resolution for the most recent context. Safe to call when none exists. */
  refetchResolvedVariables: () => void
}

const DEFAULT_REQUEST_STATE: RequestData = {
  name: 'Untitled',
  url: '',
  method: 'GET',
  params: [],
  headers: [],
  body: {
    type: 'none',
    json: '',
    rawText: '',
    rawSubtype: 'text',
    formFields: [],
    urlEncodedFields: [],
    filePath: null,
    fileFilter: '',
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
  settings: {
    timeout: '',
    redirectBehavior: 'default',
  },
  tags: [],
  activeComposerTab: 'params',
  inFlight: false,
  requestId: null,
}

export function rfc3986Encode(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  )
}

export function encodeParamSegment(str: string): string {
  if (!str) return ''
  const regex = /(\{\{[^{}]+\}\})/g
  const parts = str.split(regex)
  return parts
    .map((part) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        return part
      }
      return rfc3986Encode(part)
    })
    .join('')
}

function decodeParamSegment(str: string): string {
  try {
    return decodeURIComponent(str.replace(/\+/g, '%20'))
  } catch (_e) {
    return str
  }
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
      let is_valueless = false

      if (eqIdx === -1) {
        key = decodeParamSegment(pair)
        is_valueless = true
      } else {
        key = decodeParamSegment(pair.slice(0, eqIdx))
        value = decodeParamSegment(pair.slice(eqIdx + 1))
      }

      parsedParams.push({ key, value, enabled: true, is_valueless })
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
        const k = encodeParamSegment(p.key)
        if (p.is_valueless) {
          return k
        }
        const v = encodeParamSegment(p.value)
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
  _resolutionCtx: null,

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
        const syncedUrl = syncUrlFromParams(updated.url, data.params)
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
    let bodyType: 'none' | 'json' | 'form-data' | 'url-encoded' | 'raw' | 'file' = 'none'
    let bodyJson = ''
    let bodyRawText = ''
    let bodyRawSubtype: 'text' | 'html' | 'xml' | 'javascript' | 'other' = 'text'
    let bodyFormFields: {
      key: string
      value: string
      isFile: boolean
      filePath: string
      enabled: boolean
    }[] = []
    let bodyUrlEncodedFields: { key: string; value: string; enabled: boolean }[] = []
    let bodyFilePath: string | null = null
    let bodyFileFilter = ''

    if (content.body) {
      if (content.body.active_type) {
        bodyType = (
          content.body.active_type === 'form_data'
            ? 'form-data'
            : content.body.active_type === 'url_encoded'
              ? 'url-encoded'
              : content.body.active_type
        ) as 'none' | 'json' | 'form-data' | 'url-encoded' | 'raw' | 'file'
        bodyJson = content.body.json || ''
        bodyRawText = content.body.raw_text || ''
        bodyRawSubtype = (content.body.raw_subtype || 'text') as
          | 'text'
          | 'html'
          | 'xml'
          | 'javascript'
          | 'other'
        bodyFormFields = (content.body.form_data || []).map((f) => ({
          key: f.key,
          value: f.value,
          isFile: f.is_file,
          filePath: f.file_path,
          enabled: f.enabled,
        }))
        bodyUrlEncodedFields = (content.body.url_encoded || []).map((f) => ({
          key: f.key,
          value: f.value,
          enabled: f.enabled,
        }))
        bodyFilePath = content.body.file_path || null
        bodyFileFilter = content.body.file_filter || ''
      } else {
        // Legacy file compatibility
        if (content.body.json) {
          bodyType = 'json'
          bodyJson = content.body.json
        } else if (content.body.text) {
          bodyType = 'raw'
          bodyRawText = content.body.text
          bodyRawSubtype = 'text'
        } else if (content.body.form) {
          bodyType = 'form-data'
          bodyFormFields = Object.entries(content.body.form).map(([key, value]) => ({
            key,
            value,
            isFile: false,
            filePath: '',
            enabled: true,
          }))
        }
      }
    }

    const settingsTimeout = content.settings?.timeout || ''
    let settingsRedirectBehavior: 'default' | 'follow' | 'manual' = 'default'
    if (content.settings?.redirect_behavior === 'follow') {
      settingsRedirectBehavior = 'follow'
    } else if (content.settings?.redirect_behavior === 'manual') {
      settingsRedirectBehavior = 'manual'
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
        json: bodyJson,
        rawText: bodyRawText,
        rawSubtype: bodyRawSubtype,
        formFields: bodyFormFields,
        urlEncodedFields: bodyUrlEncodedFields,
        filePath: bodyFilePath,
        fileFilter: bodyFileFilter,
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
      settings: {
        timeout: settingsTimeout,
        redirectBehavior: settingsRedirectBehavior,
      },
      tags: content.tags ?? [],
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
              active_type: data.body.type,
              json: data.body.type === 'json' ? data.body.json : undefined,
              raw_text: data.body.type === 'raw' ? data.body.rawText : undefined,
              raw_subtype: data.body.type === 'raw' ? data.body.rawSubtype : undefined,
              form_data:
                data.body.type === 'form-data'
                  ? data.body.formFields.map((f) => ({
                      key: f.key,
                      value: f.value,
                      is_file: f.isFile,
                      file_path: f.filePath,
                      enabled: f.enabled,
                    }))
                  : undefined,
              url_encoded:
                data.body.type === 'url-encoded'
                  ? data.body.urlEncodedFields.map((f) => ({
                      key: f.key,
                      value: f.value,
                      enabled: f.enabled,
                    }))
                  : undefined,
              file_path: data.body.type === 'file' ? data.body.filePath : undefined,
              file_filter: data.body.type === 'file' ? data.body.fileFilter : undefined,
            },
      auth:
        data.auth.type === 'none'
          ? null
          : (() => {
              const cleanConfig = { ...data.auth.config }
              delete cleanConfig.type
              return {
                type: data.auth.type,
                ...cleanConfig,
              } as unknown as AuthRef
            })(),
      scripts: { pre: data.scripts.pre, post: data.scripts.post },
      tests: data.tests,
      tags: data.tags.length > 0 ? data.tags : undefined,
      settings: {
        timeout: data.settings?.timeout || null,
        redirect_behavior:
          data.settings?.redirectBehavior === 'default'
            ? null
            : data.settings?.redirectBehavior || null,
      },
    }

    const result = await commands.saveRequest(requestFile, path)
    if (result.status === 'error') {
      console.error('Failed to save request', result.error)
      throw new Error(result.error)
    }

    // Reload the parent collection so the sidebar reflects updated name/method
    const { collections, loadCollection } = useCollectionStore.getState()
    const parentColPath = Object.keys(collections).find((cp) => path.startsWith(cp))
    if (parentColPath) {
      loadCollection(parentColPath)
    }
  },

  fetchResolvedVariables: async (tabId, collectionId) => {
    // Remember the context so a global change (e.g. toggling the global env) can
    // re-resolve without needing to know the active tab.
    set({ _resolutionCtx: { tabId, collectionId } })
    const workspacePath = useWorkspaceStore.getState().activeWorkspacePath
    const environmentName = useEnvironmentStore.getState().activeEnvironmentName
    const collectionEnvironmentName = collectionId
      ? (useCollectionEnvironmentStore.getState().activeCollectionEnvName[collectionId] ?? null)
      : null
    if (!workspacePath) return

    try {
      const result = await commands.getResolvedVariables(
        workspacePath,
        collectionId,
        environmentName,
        collectionEnvironmentName
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

  refetchResolvedVariables: () => {
    const ctx = get()._resolutionCtx
    if (ctx) {
      void get().fetchResolvedVariables(ctx.tabId, ctx.collectionId)
    }
  },
}))
