import { create } from 'zustand'

interface NewRequestDialogState {
  isOpen: boolean
  collectionPath: string | null
  folderPath: string | null
}

interface ImportFolderDialogState {
  isOpen: boolean
  targetPath: string | null
  targetType: 'collection' | 'folder' | null
  collectionPath: string | null
}

interface ShareModalState {
  isOpen: boolean
  collectionPath: string | null
  collectionName: string | null
}

interface ImportCollectionDialogState {
  isOpen: boolean
  format: 'zip' | 'bundle' | null
}

interface GenerateDocsModalState {
  isOpen: boolean
  collectionPath: string | null
  collectionName: string | null
}

interface GenerateCodeModalState {
  isOpen: boolean
  requestPath: string | null
  requestName: string | null
}

interface UIState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  newRequestDialog: NewRequestDialogState
  dialogResetKey: number
  openNewRequestDialog: (collectionPath?: string | null, folderPath?: string | null) => void
  closeNewRequestDialog: () => void
  isNewTransientDialogOpen: boolean
  newTransientDialogResetKey: number
  openNewTransientDialog: () => void
  closeNewTransientDialog: () => void
  isSaveToCollectionDialogOpen: boolean
  saveToCollectionTabId: string | null
  saveToCollectionResetKey: number
  openSaveToCollectionDialog: (tabId: string) => void
  closeSaveToCollectionDialog: () => void
  importFolderDialog: ImportFolderDialogState
  importFolderResetKey: number
  openImportFolderDialog: (
    targetPath: string,
    targetType: 'collection' | 'folder',
    collectionPath: string
  ) => void
  closeImportFolderDialog: () => void
  shareModal: ShareModalState
  openShareModal: (collectionPath: string, collectionName: string) => void
  closeShareModal: () => void
  importCollectionDialog: ImportCollectionDialogState
  openImportCollectionDialog: (format: 'zip' | 'bundle') => void
  closeImportCollectionDialog: () => void
  generateDocsModal: GenerateDocsModalState
  openGenerateDocsModal: (collectionPath: string, collectionName: string) => void
  closeGenerateDocsModal: () => void
  generateCodeModal: GenerateCodeModalState
  openGenerateCodeModal: (requestPath: string, requestName: string) => void
  closeGenerateCodeModal: () => void
  createExampleModal: { isOpen: boolean; requestPath: string | null; resetKey: number }
  openCreateExampleModal: (requestPath: string) => void
  closeCreateExampleModal: () => void
  layout: 'horizontal' | 'vertical'
  toggleLayout: () => void
  setLayout: (layout: 'horizontal' | 'vertical') => void
  isCommandPaletteOpen: boolean
  openCommandPalette: () => void
  closeCommandPalette: () => void
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
    isNewTransientDialogOpen: false,
    newTransientDialogResetKey: 0,
    openNewTransientDialog: () =>
      set((state) => ({
        isNewTransientDialogOpen: true,
        newTransientDialogResetKey: state.newTransientDialogResetKey + 1,
      })),
    closeNewTransientDialog: () => set({ isNewTransientDialogOpen: false }),
    isSaveToCollectionDialogOpen: false,
    saveToCollectionTabId: null,
    saveToCollectionResetKey: 0,
    openSaveToCollectionDialog: (tabId: string) =>
      set((state) => ({
        isSaveToCollectionDialogOpen: true,
        saveToCollectionTabId: tabId,
        saveToCollectionResetKey: state.saveToCollectionResetKey + 1,
      })),
    closeSaveToCollectionDialog: () =>
      set({ isSaveToCollectionDialogOpen: false, saveToCollectionTabId: null }),
    importFolderDialog: { isOpen: false, targetPath: null, targetType: null, collectionPath: null },
    importFolderResetKey: 0,
    openImportFolderDialog: (targetPath, targetType, collectionPath) =>
      set((state) => ({
        importFolderDialog: { isOpen: true, targetPath, targetType, collectionPath },
        importFolderResetKey: state.importFolderResetKey + 1,
      })),
    closeImportFolderDialog: () =>
      set({
        importFolderDialog: {
          isOpen: false,
          targetPath: null,
          targetType: null,
          collectionPath: null,
        },
      }),
    shareModal: { isOpen: false, collectionPath: null, collectionName: null },
    openShareModal: (collectionPath, collectionName) =>
      set({ shareModal: { isOpen: true, collectionPath, collectionName } }),
    closeShareModal: () =>
      set({ shareModal: { isOpen: false, collectionPath: null, collectionName: null } }),
    importCollectionDialog: { isOpen: false, format: null },
    openImportCollectionDialog: (format) =>
      set({ importCollectionDialog: { isOpen: true, format } }),
    closeImportCollectionDialog: () =>
      set({ importCollectionDialog: { isOpen: false, format: null } }),
    generateDocsModal: { isOpen: false, collectionPath: null, collectionName: null },
    openGenerateDocsModal: (collectionPath, collectionName) =>
      set({ generateDocsModal: { isOpen: true, collectionPath, collectionName } }),
    closeGenerateDocsModal: () =>
      set({ generateDocsModal: { isOpen: false, collectionPath: null, collectionName: null } }),
    generateCodeModal: { isOpen: false, requestPath: null, requestName: null },
    openGenerateCodeModal: (requestPath, requestName) =>
      set({ generateCodeModal: { isOpen: true, requestPath, requestName } }),
    closeGenerateCodeModal: () =>
      set({ generateCodeModal: { isOpen: false, requestPath: null, requestName: null } }),
    createExampleModal: { isOpen: false, requestPath: null, resetKey: 0 },
    openCreateExampleModal: (requestPath) =>
      set((state) => ({
        createExampleModal: {
          isOpen: true,
          requestPath,
          resetKey: state.createExampleModal.resetKey + 1,
        },
      })),
    closeCreateExampleModal: () =>
      set((state) => ({
        createExampleModal: { ...state.createExampleModal, isOpen: false, requestPath: null },
      })),
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
    isCommandPaletteOpen: false,
    openCommandPalette: () => set({ isCommandPaletteOpen: true }),
    closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
  }
})
