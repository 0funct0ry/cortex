import { create } from 'zustand'
import { commands } from '../bindings'
import type { WorkspaceResponse } from '../bindings'

interface WorkspaceState {
  activeWorkspace: WorkspaceResponse | null
  isLoading: boolean
  error: string | null
  loadWorkspace: (path: string) => Promise<void>
  loadLastWorkspace: () => Promise<void>
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspace: null,
  isLoading: false,
  error: null,
  loadWorkspace: async (path: string) => {
    set({ isLoading: true, error: null })
    try {
      const result = await commands.loadWorkspace(path)
      if (result.status === 'ok') {
        set({ activeWorkspace: result.data, isLoading: false })
      } else {
        set({ error: result.error, isLoading: false })
      }
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e), isLoading: false })
    }
  },
  loadLastWorkspace: async () => {
    try {
      const path = await commands.getLastWorkspacePath()
      if (path) {
        const result = await commands.loadWorkspace(path)
        if (result.status === 'ok') {
          set({ activeWorkspace: result.data })
        }
      }
    } catch (e) {
      console.error('Failed to load last workspace', e)
    }
  },
}))
