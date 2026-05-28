import { create } from 'zustand'
import type { RedirectHop } from '../bindings'

export type ResponseTabId = 'pretty' | 'raw' | 'preview' | 'headers' | 'timeline'

export interface ResponsePayload {
  requestId: string
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  durationMs: number
  bodySize: number
  error?: string
  redirectChain?: RedirectHop[]
}

const ACTIVE_TABS_STORAGE_KEY = 'cortex.response.activeTabs'

function loadActiveTabs(): Record<string, ResponseTabId> {
  try {
    const saved = localStorage.getItem(ACTIVE_TABS_STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // ignore parse errors
  }
  return {}
}

interface ResponseState {
  // requestId (tabId) -> payload
  responses: Record<string, ResponsePayload>
  // requestId (tabId) -> active tab
  activeTabs: Record<string, ResponseTabId>

  setResponse: (requestId: string, payload: ResponsePayload) => void
  clearResponse: (requestId: string) => void
  setActiveTab: (requestId: string, tabId: ResponseTabId) => void
  getResponse: (requestId: string) => ResponsePayload | null
  getActiveTab: (requestId: string) => ResponseTabId
}

export const useResponseStore = create<ResponseState>((set, get) => ({
  responses: {},
  activeTabs: loadActiveTabs(),

  setResponse: (requestId, payload) =>
    set((state) => ({
      responses: {
        ...state.responses,
        [requestId]: payload,
      },
    })),

  clearResponse: (requestId) =>
    set((state) => {
      const newResponses = { ...state.responses }
      delete newResponses[requestId]
      return { responses: newResponses }
    }),

  setActiveTab: (requestId, tabId) =>
    set((state) => {
      const newActiveTabs = { ...state.activeTabs, [requestId]: tabId }
      localStorage.setItem(ACTIVE_TABS_STORAGE_KEY, JSON.stringify(newActiveTabs))
      return { activeTabs: newActiveTabs }
    }),

  getResponse: (requestId) => get().responses[requestId] || null,

  getActiveTab: (requestId) => get().activeTabs[requestId] || 'pretty',
}))
