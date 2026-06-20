import { create } from 'zustand'
import { commands } from '../bindings'
import type {
  Collection,
  Variable,
  HeaderEntry,
  Scripts,
  CollectionPreset,
  CollectionProxy,
  CollectionClientCertificate,
  CollectionProtobuf,
} from '../bindings'
import { useCollectionStore } from './collectionStore'

export interface CollectionDraft {
  name: string
  description: string
  headers: HeaderEntry[]
  variables: Variable[]
  auth: { type: string; config: Record<string, unknown> }
  scripts: { pre: string; post: string }
  tests: string
  activeSubTab:
    | 'overview'
    | 'headers'
    | 'vars'
    | 'auth'
    | 'script'
    | 'tests'
    | 'presets'
    | 'proxy'
    | 'certificates'
    | 'secrets'
    | 'protobuf'
  presets: CollectionPreset[]
  proxy: CollectionProxy
  clientCertificates: CollectionClientCertificate[]
  protobuf: CollectionProtobuf
}

interface CollectionViewState {
  drafts: Record<string, CollectionDraft>
  /** Monotonically-increasing counter per collection path, incremented on each successful saveDraft(). */
  savedRevisions: Record<string, number>
  initDraft: (collectionPath: string, collection: Collection) => void
  updateDraft: (collectionPath: string, updates: Partial<CollectionDraft>) => void
  saveDraft: (collectionPath: string) => Promise<void>
  clearDraft: (collectionPath: string) => void
  getDraft: (collectionPath: string) => CollectionDraft | null
}

function collectionToHeaderEntries(
  headers: Record<string, string> | null | undefined
): HeaderEntry[] {
  if (!headers) return []
  return Object.entries(headers).map(([key, value]) => ({ key, value, enabled: true }))
}

function headerEntriesToMap(entries: HeaderEntry[]): Record<string, string> | null {
  const filtered = entries.filter((e) => e.enabled && e.key.trim())
  if (filtered.length === 0) return null
  return Object.fromEntries(filtered.map((e) => [e.key, e.value]))
}

function parseAuth(manifest: Collection['manifest']): CollectionDraft['auth'] {
  if (!manifest.auth) return { type: 'none', config: {} }
  const { type, ...rest } = manifest.auth as Record<string, unknown>
  return { type: String(type ?? 'none'), config: rest as Record<string, unknown> }
}

function authToRef(auth: CollectionDraft['auth']): Record<string, unknown> | null {
  if (!auth.type || auth.type === 'none') return null
  return { type: auth.type, ...auth.config }
}

export function resetCollectionViewStore() {
  useCollectionViewStore.setState({ drafts: {}, savedRevisions: {} })
}

export const useCollectionViewStore = create<CollectionViewState>((set, get) => ({
  drafts: {},
  savedRevisions: {},

  initDraft: (collectionPath, collection) => {
    const existing = get().drafts[collectionPath]
    if (existing) return
    const manifest = collection.manifest
    set((state) => ({
      drafts: {
        ...state.drafts,
        [collectionPath]: {
          name: manifest.name,
          description: manifest.description ?? '',
          headers: collectionToHeaderEntries(manifest.headers),
          variables: manifest.variables ?? [],
          auth: parseAuth(manifest),
          scripts: {
            pre: manifest.scripts?.pre ?? '',
            post: manifest.scripts?.post ?? '',
          },
          tests: manifest.tests ?? '',
          activeSubTab: 'overview',
          presets: manifest.presets ?? [],
          proxy: manifest.proxy ?? {
            enabled: false,
            url: '',
            bypass_list: null,
            username: null,
            password: null,
          },
          clientCertificates: manifest.client_certificates ?? [],
          protobuf: manifest.protobuf ?? { proto_files: [], import_paths: [] },
        },
      },
    }))
  },

  updateDraft: (collectionPath, updates) => {
    set((state) => {
      const existing = state.drafts[collectionPath]
      if (!existing) return state
      return {
        drafts: {
          ...state.drafts,
          [collectionPath]: { ...existing, ...updates },
        },
      }
    })
  },

  saveDraft: async (collectionPath) => {
    const draft = get().drafts[collectionPath]
    if (!draft) return

    const headersMap = headerEntriesToMap(draft.headers)
    const authRef = authToRef(draft.auth)

    const scriptsPayload: Scripts | null =
      draft.scripts.pre || draft.scripts.post
        ? { pre: draft.scripts.pre || null, post: draft.scripts.post || null }
        : null

    // Single atomic read-modify-write: avoids concurrent fs::write races that
    // produced corrupt YAML (e.g. "ame:" instead of "name:") when six separate
    // update_collection_* commands all read the same file simultaneously.
    await commands.saveCollection(collectionPath, {
      name: draft.name,
      description: draft.description || null,
      headers: headersMap,
      variables: draft.variables,
      auth: authRef as never,
      scripts: scriptsPayload,
      tests: draft.tests || null,
      presets: draft.presets,
      proxy: draft.proxy,
      client_certificates: draft.clientCertificates,
      protobuf: draft.protobuf,
    })

    // Refresh the collection in the tree so sidebar reflects name/desc changes
    await useCollectionStore.getState().loadCollection(collectionPath)

    // Bump the revision counter so Composer.tsx re-fetches resolved variables
    set((state) => ({
      savedRevisions: {
        ...state.savedRevisions,
        [collectionPath]: (state.savedRevisions[collectionPath] ?? 0) + 1,
      },
    }))
  },

  clearDraft: (collectionPath) => {
    set((state) => {
      const { [collectionPath]: _, ...rest } = state.drafts
      return { drafts: rest }
    })
  },

  getDraft: (collectionPath) => {
    return get().drafts[collectionPath] ?? null
  },
}))
