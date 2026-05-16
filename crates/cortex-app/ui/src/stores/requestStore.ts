import { create } from 'zustand'
import { commands, type HeaderEntry, type RequestFile, type AuthRef } from '../bindings'

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
  updateRequest: (tabId: string, data: Partial<RequestData>) => void
  setInFlight: (tabId: string, inFlight: boolean, requestId: string | null) => void
  getRequestState: (tabId: string) => RequestData
  saveRequest: (tabId: string, path: string) => Promise<void>
  populateRequest: (tabId: string, content: RequestFile) => void
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

export const useRequestStore = create<RequestState>((set, get) => ({
  requestStates: {},

  updateRequest: (tabId, data) =>
    set((state) => ({
      requestStates: {
        ...state.requestStates,
        [tabId]: {
          ...(state.requestStates[tabId] || DEFAULT_REQUEST_STATE),
          ...data,
        },
      },
    })),

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
      headers: data.headers.reduce((acc, h) => (h.key ? { ...acc, [h.key]: h.value } : acc), {}),
      params: data.params.reduce((acc, p) => (p.key ? { ...acc, [p.key]: p.value } : acc), {}),
      body:
        data.body.type === 'none'
          ? null
          : {
              text: data.body.type === 'text' ? data.body.text : undefined,
              json: data.body.type === 'json' ? data.body.text : undefined,
              form:
                data.body.type === 'form'
                  ? data.body.form.reduce(
                      (acc, f) => (f.key ? { ...acc, [f.key]: f.value } : acc),
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
}))
