import { create } from 'zustand'
import { commands } from '../bindings'
import type { Collection } from '../bindings'

interface CollectionState {
  collections: Record<string, Collection>
  loadingCollections: Record<string, boolean>
  errors: Record<string, string | null>
  expansionState: Record<string, boolean>
  searchQuery: string

  loadCollection: (path: string) => Promise<void>
  toggleExpansion: (path: string) => void
  setExpanded: (path: string, expanded: boolean) => void
  setSearchQuery: (query: string) => void
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: {},
  loadingCollections: {},
  errors: {},
  expansionState: {},
  searchQuery: '',

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
