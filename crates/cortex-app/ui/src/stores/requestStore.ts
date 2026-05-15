import { create } from 'zustand'

interface RequestState {
  // tabId -> state
  requestStates: Record<
    string,
    {
      url: string
      method: string
      inFlight: boolean
      requestId: string | null
    }
  >
  updateRequest: (tabId: string, data: Partial<{ url: string; method: string }>) => void
  setInFlight: (tabId: string, inFlight: boolean, requestId: string | null) => void
  getRequestState: (tabId: string) => {
    url: string
    method: string
    inFlight: boolean
    requestId: string | null
  }
}

export const useRequestStore = create<RequestState>((set, get) => ({
  requestStates: {},

  updateRequest: (tabId, data) =>
    set((state) => ({
      requestStates: {
        ...state.requestStates,
        [tabId]: {
          ...(state.requestStates[tabId] || {
            url: '',
            method: 'GET',
            inFlight: false,
            requestId: null,
          }),
          ...data,
        },
      },
    })),

  setInFlight: (tabId, inFlight, requestId) =>
    set((state) => ({
      requestStates: {
        ...state.requestStates,
        [tabId]: {
          ...(state.requestStates[tabId] || {
            url: '',
            method: 'GET',
            inFlight: false,
            requestId: null,
          }),
          inFlight,
          requestId,
        },
      },
    })),

  getRequestState: (tabId) => {
    return (
      get().requestStates[tabId] || { url: '', method: 'GET', inFlight: false, requestId: null }
    )
  },
}))
