import { create } from 'zustand'
import { commands } from '../bindings'
import type { Collection, TagDefinition } from '../bindings'

export type { TagDefinition }

/** Returns all distinct tags across all loaded collections, deduped by name. */
export function getAllTagsFromCollections(
  collections: Record<string, Collection | undefined>
): TagDefinition[] {
  const seen = new Map<string, TagDefinition>()
  for (const col of Object.values(collections)) {
    if (!col) continue
    for (const tag of col.manifest.tag_registry ?? []) {
      if (!seen.has(tag.name)) seen.set(tag.name, tag)
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export interface DndUndoEntry {
  movedToPath: string
  originalParentPath: string
}

export interface DropIndicator {
  targetPath: string
  position: 'before' | 'after' | 'inside'
}

interface CollectionState {
  collections: Record<string, Collection>
  loadingCollections: Record<string, boolean>
  errors: Record<string, string | null>
  expansionState: Record<string, boolean>
  searchQuery: string
  isCreatingInline: boolean
  selectedPath: string | null
  renamingPath: string | null
  clipboardPath: string | null
  clipboardType: 'folder' | 'request' | null
  dropIndicator: DropIndicator | null
  dndUndoStack: DndUndoEntry[]
  activeTagFilters: string[]
  tagFilterMode: 'and' | 'or'
  showTagFilterBar: boolean

  loadCollection: (path: string) => Promise<void>
  clearCollection: (path: string) => void
  toggleExpansion: (path: string) => void
  setExpanded: (path: string, expanded: boolean) => void
  setSearchQuery: (query: string) => void
  setCreatingInline: (val: boolean) => void
  setSelectedPath: (path: string | null) => void
  setRenamingPath: (path: string | null) => void
  setClipboard: (path: string, type: 'folder' | 'request') => void
  clearClipboard: () => void
  setDropIndicator: (indicator: DropIndicator) => void
  clearDropIndicator: () => void
  pushDndUndo: (entry: DndUndoEntry) => void
  popDndUndo: () => DndUndoEntry | undefined
  toggleTagFilter: (tagName: string) => void
  setTagFilterMode: (mode: 'and' | 'or') => void
  clearTagFilters: () => void
  toggleTagFilterBar: () => void
  updateTagRegistry: (collectionPath: string, tags: TagDefinition[]) => Promise<void>
}

export function resetCollectionStore() {
  useCollectionStore.setState({
    collections: {},
    loadingCollections: {},
    errors: {},
    expansionState: {},
    searchQuery: '',
    isCreatingInline: false,
    selectedPath: null,
    renamingPath: null,
    clipboardPath: null,
    clipboardType: null,
    dropIndicator: null,
    dndUndoStack: [],
    activeTagFilters: [],
    tagFilterMode: 'and',
    showTagFilterBar: false,
  })
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
  clipboardPath: null,
  clipboardType: null,
  dropIndicator: null,
  dndUndoStack: [],
  activeTagFilters: [],
  tagFilterMode: 'and',
  showTagFilterBar: false,

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
    // If a load is already in-flight, skip — the in-flight load will return the
    // latest on-disk state by the time it resolves.
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

  setClipboard: (path: string, type: 'folder' | 'request') => {
    set({ clipboardPath: path, clipboardType: type })
  },

  clearClipboard: () => {
    set({ clipboardPath: null, clipboardType: null })
  },

  setDropIndicator: (indicator: DropIndicator) => {
    set({ dropIndicator: indicator })
  },

  clearDropIndicator: () => {
    set({ dropIndicator: null })
  },

  pushDndUndo: (entry: DndUndoEntry) => {
    set((state) => ({
      dndUndoStack: [entry, ...state.dndUndoStack].slice(0, 10),
    }))
  },

  popDndUndo: () => {
    const stack = get().dndUndoStack
    if (stack.length === 0) return undefined
    const [top, ...rest] = stack
    set({ dndUndoStack: rest })
    return top
  },

  toggleTagFilter: (tagName: string) => {
    set((state) => {
      const already = state.activeTagFilters.includes(tagName)
      const next = already
        ? state.activeTagFilters.filter((t) => t !== tagName)
        : [...state.activeTagFilters, tagName]
      return {
        activeTagFilters: next,
        showTagFilterBar: next.length > 0 ? state.showTagFilterBar : false,
      }
    })
  },

  setTagFilterMode: (mode: 'and' | 'or') => {
    set({ tagFilterMode: mode })
  },

  clearTagFilters: () => {
    set({ activeTagFilters: [], showTagFilterBar: false })
  },

  toggleTagFilterBar: () => {
    set((state) => ({ showTagFilterBar: !state.showTagFilterBar }))
  },

  updateTagRegistry: async (collectionPath: string, tags: TagDefinition[]) => {
    const result = await commands.saveTagRegistry(collectionPath, tags)
    if (result.status === 'error') {
      console.error('Failed to save tag registry', result.error)
      return
    }
    // Optimistically update the in-memory collection manifest
    set((state) => {
      const col = state.collections[collectionPath]
      if (!col) return {}
      return {
        collections: {
          ...state.collections,
          [collectionPath]: {
            ...col,
            manifest: { ...col.manifest, tag_registry: tags.length > 0 ? tags : null },
          },
        },
      }
    })
  },
}))
