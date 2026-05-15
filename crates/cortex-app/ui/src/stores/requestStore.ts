import { create } from 'zustand'
import type { HeaderEntry } from '../bindings'

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
}

const DEFAULT_REQUEST_STATE: RequestData = {
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
}))
