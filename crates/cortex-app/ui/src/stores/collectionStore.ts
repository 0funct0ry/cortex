import { create } from 'zustand'
import { commands } from '../bindings'
import type { Collection } from '../bindings'

interface CollectionState {
  collections: Record<string, Collection>
  loadingCollections: Record<string, boolean>
  errors: Record<string, string | null>
  expansionState: Record<string, boolean>
  searchQuery: string
  isCreatingInline: boolean
  selectedPath: string | null
  renamingPath: string | null

  loadCollection: (path: string) => Promise<void>
  clearCollection: (path: string) => void
  toggleExpansion: (path: string) => void
  setExpanded: (path: string, expanded: boolean) => void
  setSearchQuery: (query: string) => void
  setCreatingInline: (val: boolean) => void
  setSelectedPath: (path: string | null) => void
  setRenamingPath: (path: string | null) => void
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: {},
  loadingCollections: {},
  errors: {},
  expansionState: {},
  searchQuery: '',
  isCreatingInline: false,
  selectedPath: null,
  renamingPath: null,

  setCreatingInline: (val: boolean) => {
    set({ isCreatingInline: val })
  },

  setSelectedPath: (path: string | null) => {
    set({ selectedPath: path })
  },

  setRenamingPath: (path: string | null) => {
    set({ renamingPath: path })
  },

  loadCollection: async (path: string) => {
    // If already loading or already loaded, don't reload unless needed?
    // For now, let's allow reloading if requested, but check if it's already loading.
    if (get().loadingCollections[path]) return

    set((state) => ({
      loadingCollections: { ...state.loadingCollections, [path]: true },
      errors: { ...state.errors, [path]: null },
    }))

    try {
      const result = await commands.loadCollection(path)
      if (result.status === 'ok') {
        set((state) => ({
          collections: { ...state.collections, [path]: result.data },
          loadingCollections: { ...state.loadingCollections, [path]: false },
        }))
      } else {
        set((state) => ({
          errors: { ...state.errors, [path]: result.error },
          loadingCollections: { ...state.loadingCollections, [path]: false },
        }))
      }
    } catch (e) {
      set((state) => ({
        errors: { ...state.errors, [path]: e instanceof Error ? e.message : String(e) },
        loadingCollections: { ...state.loadingCollections, [path]: false },
      }))
    }
  },

  clearCollection: (path: string) => {
    set((state) => {
      const collections = { ...state.collections }
      const loadingCollections = { ...state.loadingCollections }
      const errors = { ...state.errors }
      const expansionState = { ...state.expansionState }
      delete collections[path]
      delete loadingCollections[path]
      delete errors[path]
      delete expansionState[path]
      return { collections, loadingCollections, errors, expansionState }
    })
  },

  toggleExpansion: (path: string) => {
    set((state) => ({
      expansionState: {
        ...state.expansionState,
        [path]: !state.expansionState[path],
      },
    }))
  },

  setExpanded: (path: string, expanded: boolean) => {
    set((state) => ({
      expansionState: {
        ...state.expansionState,
        [path]: expanded,
      },
    }))
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
  },
}))
