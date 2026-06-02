import { create } from 'zustand'
import { commands } from '../bindings'
import type { CollectionItem, SendRequestPayload, RequestMetadata } from '../bindings'
import { useCollectionStore } from './collectionStore'
import { useWorkspaceStore } from './workspaceStore'
import { useEnvironmentStore } from './environmentStore'

export interface RunnerItem {
  path: string
  name: string
  method: string
}

export interface RequestRunResult {
  iteration: number
  status: number | null
  statusText: string | null
  durationMs: number | null
  error: string | null
}

export type RunStatus = 'idle' | 'running' | 'completed' | 'aborted'

interface RunnerScope {
  path: string
  type: 'collection' | 'folder'
  label: string
  collectionPath: string
}

interface CollectionRunnerState {
  isOpen: boolean
  scope: RunnerScope | null
  items: RunnerItem[]
  selected: Set<string>
  options: {
    iterations: number
    delayMs: number
    environmentName: string | null
  }
  results: Record<string, RequestRunResult[]>
  runStatus: RunStatus
  currentIndex: number
  _abortRequested: boolean

  open: (scope: RunnerScope, items: RunnerItem[]) => void
  close: () => void
  toggleSelected: (path: string) => void
  selectAll: () => void
  deselectAll: () => void
  setOption: <K extends keyof CollectionRunnerState['options']>(
    key: K,
    value: CollectionRunnerState['options'][K]
  ) => void
  startRun: () => Promise<void>
  abortRun: () => void
}

/** Recursively flatten CollectionItems to a list of RunnerItems in display order. */
function flattenRequests(items: CollectionItem[]): RunnerItem[] {
  const result: RunnerItem[] = []
  for (const item of items) {
    if (item.type === 'Request') {
      const w = item.data
      result.push({
        path: w.path,
        name: w.name,
        method: w.content?.method || 'GET',
      })
    } else if (item.type === 'Folder') {
      result.push(...flattenRequests(item.data.items))
    }
  }
  return result
}

/** Find a folder by path within a collection's item tree. */
function findFolder(
  items: CollectionItem[],
  folderPath: string
): (CollectionItem & { type: 'Folder' }) | null {
  for (const item of items) {
    if (item.type === 'Folder') {
      if (item.data.path === folderPath) return item as CollectionItem & { type: 'Folder' }
      const found = findFolder(item.data.items, folderPath)
      if (found) return found
    }
  }
  return null
}

/** Build RunnerItems for a collection or folder path from the store. */
export function buildRunnerItems(
  scopePath: string,
  scopeType: 'collection' | 'folder'
): RunnerItem[] {
  const { collections } = useCollectionStore.getState()

  if (scopeType === 'collection') {
    const col = collections[scopePath]
    if (!col) return []
    return flattenRequests(col.items)
  }

  // folder — find which collection contains it, then locate the folder
  for (const col of Object.values(collections)) {
    if (!col) continue
    if (!scopePath.startsWith(col.path)) continue
    const folder = findFolder(col.items, scopePath)
    if (folder) return flattenRequests(folder.data.items)
  }
  return []
}

export const useCollectionRunnerStore = create<CollectionRunnerState>((set, get) => ({
  isOpen: false,
  scope: null,
  items: [],
  selected: new Set(),
  options: {
    iterations: 1,
    delayMs: 0,
    environmentName: useEnvironmentStore.getState().activeEnvironmentName,
  },
  results: {},
  runStatus: 'idle',
  currentIndex: -1,
  _abortRequested: false,

  open: (scope, items) => {
    const { activeEnvironmentName } = useEnvironmentStore.getState()
    set({
      isOpen: true,
      scope,
      items,
      selected: new Set(items.map((i) => i.path)),
      options: {
        iterations: 1,
        delayMs: 0,
        environmentName: activeEnvironmentName,
      },
      results: {},
      runStatus: 'idle',
      currentIndex: -1,
      _abortRequested: false,
    })
  },

  close: () => {
    if (get().runStatus === 'running') get().abortRun()
    set({
      isOpen: false,
      scope: null,
      items: [],
      selected: new Set(),
      results: {},
      runStatus: 'idle',
      currentIndex: -1,
    })
  },

  toggleSelected: (path) => {
    set((state) => {
      const next = new Set(state.selected)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return { selected: next }
    })
  },

  selectAll: () => {
    set((state) => ({ selected: new Set(state.items.map((i) => i.path)) }))
  },

  deselectAll: () => {
    set({ selected: new Set() })
  },

  setOption: (key, value) => {
    set((state) => ({ options: { ...state.options, [key]: value } }))
  },

  abortRun: () => {
    set({ _abortRequested: true, runStatus: 'aborted' })
  },

  startRun: async () => {
    const state = get()
    if (state.runStatus === 'running') return

    const selectedItems = state.items.filter((i) => state.selected.has(i.path))
    if (selectedItems.length === 0) return

    set({ runStatus: 'running', results: {}, _abortRequested: false, currentIndex: 0 })

    const { activeWorkspacePath } = useWorkspaceStore.getState()
    const { scope, options } = get()

    for (let iter = 1; iter <= options.iterations; iter++) {
      for (let idx = 0; idx < selectedItems.length; idx++) {
        if (get()._abortRequested) {
          set({ runStatus: 'aborted', currentIndex: -1 })
          return
        }

        const item = selectedItems[idx]
        set({ currentIndex: idx })

        // Load the request file to get full content
        let payload: SendRequestPayload
        try {
          const res = await commands.loadRequest(item.path)
          if (res.status === 'error' || !res.data.content) {
            const errResult: RequestRunResult = {
              iteration: iter,
              status: null,
              statusText: null,
              durationMs: null,
              error: res.status === 'error' ? res.error : 'Request file has no content',
            }
            set((s) => ({
              results: {
                ...s.results,
                [item.path]: [...(s.results[item.path] ?? []), errResult],
              },
            }))
            continue
          }

          const content = res.data.content
          // Build headers array from object (RequestFile stores headers as Record)
          const headers = content.headers
            ? Object.entries(content.headers).map(([key, value]) => ({
                key,
                value,
                enabled: true,
              }))
            : []

          let authPayload = null
          if (content.auth && content.auth.type !== 'none') {
            authPayload = content.auth
          }

          payload = {
            request_id: crypto.randomUUID(),
            request_name: item.name,
            method: content.method,
            url: content.url,
            headers,
            auth: authPayload,
            body: content.body ?? null,
            settings: content.settings ?? null,
          }
        } catch (err) {
          const errResult: RequestRunResult = {
            iteration: iter,
            status: null,
            statusText: null,
            durationMs: null,
            error: String(err),
          }
          set((s) => ({
            results: {
              ...s.results,
              [item.path]: [...(s.results[item.path] ?? []), errResult],
            },
          }))
          continue
        }

        const metadata: RequestMetadata = {
          workspace_path: activeWorkspacePath,
          collection_path: scope?.collectionPath ?? null,
          environment_name: options.environmentName,
          request_path: item.path,
        }

        try {
          const res = await commands.sendRequest(payload, metadata)
          let result: RequestRunResult
          if (res.status === 'ok') {
            const data = res.data
            result = {
              iteration: iter,
              status: data.status_code,
              statusText: data.status_text,
              durationMs: data.duration_ms,
              error: data.error,
            }
          } else {
            result = {
              iteration: iter,
              status: null,
              statusText: null,
              durationMs: null,
              error: res.error,
            }
          }
          set((s) => ({
            results: {
              ...s.results,
              [item.path]: [...(s.results[item.path] ?? []), result],
            },
          }))
        } catch (err) {
          set((s) => ({
            results: {
              ...s.results,
              [item.path]: [
                ...(s.results[item.path] ?? []),
                {
                  iteration: iter,
                  status: null,
                  statusText: null,
                  durationMs: null,
                  error: String(err),
                },
              ],
            },
          }))
        }

        // Delay between requests (but not after the last one)
        if (options.delayMs > 0) {
          const isLast = idx === selectedItems.length - 1 && iter === options.iterations
          if (!isLast && !get()._abortRequested) {
            await new Promise<void>((resolve) => setTimeout(resolve, options.delayMs))
          }
        }
      }
    }

    if (!get()._abortRequested) {
      set({ runStatus: 'completed', currentIndex: -1 })
    }
  },
}))
