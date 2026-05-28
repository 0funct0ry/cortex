import { create } from 'zustand'

interface NewRequestDialogState {
  isOpen: boolean
  collectionPath: string | null
  folderPath: string | null
}

interface UIState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  newRequestDialog: NewRequestDialogState
  dialogResetKey: number
  openNewRequestDialog: (collectionPath?: string | null, folderPath?: string | null) => void
  closeNewRequestDialog: () => void
  layout: 'horizontal' | 'vertical'
  toggleLayout: () => void
  setLayout: (layout: 'horizontal' | 'vertical') => void
}

const STORAGE_KEY = 'cortex.sidebar-collapsed'
const LAYOUT_STORAGE_KEY = 'cortex.layout.direction'

export const useUIStore = create<UIState>((set) => {
  const saved = localStorage.getItem(STORAGE_KEY)
  const initialCollapsed = saved === 'true'

  const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY)
  const initialLayout =
    savedLayout === 'horizontal' || savedLayout === 'vertical' ? savedLayout : 'horizontal'

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
    newRequestDialog: { isOpen: false, collectionPath: null, folderPath: null },
    dialogResetKey: 0,
    openNewRequestDialog: (collectionPath = null, folderPath = null) =>
      set((state) => ({
        newRequestDialog: { isOpen: true, collectionPath, folderPath },
        dialogResetKey: state.dialogResetKey + 1,
      })),
    closeNewRequestDialog: () =>
      set({ newRequestDialog: { isOpen: false, collectionPath: null, folderPath: null } }),
    layout: initialLayout,
    toggleLayout: () =>
      set((state) => {
        const newLayout = state.layout === 'horizontal' ? 'vertical' : 'horizontal'
        localStorage.setItem(LAYOUT_STORAGE_KEY, newLayout)
        return { layout: newLayout }
      }),
    setLayout: (layout: 'horizontal' | 'vertical') => {
      localStorage.setItem(LAYOUT_STORAGE_KEY, layout)
      set({ layout })
    },
  }
})
