import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

const STORAGE_KEY = 'cortex.sidebar-collapsed'

export const useUIStore = create<UIState>((set) => {
  const saved = localStorage.getItem(STORAGE_KEY)
  const initialCollapsed = saved === 'true'

  return {
    sidebarCollapsed: initialCollapsed,
    toggleSidebar: () =>
      set((state) => {
        const newState = !state.sidebarCollapsed
        localStorage.setItem(STORAGE_KEY, String(newState))
        return { sidebarCollapsed: newState }
      }),
    setSidebarCollapsed: (collapsed: boolean) => {
      localStorage.setItem(STORAGE_KEY, String(collapsed))
      set({ sidebarCollapsed: collapsed })
    },
  }
})
