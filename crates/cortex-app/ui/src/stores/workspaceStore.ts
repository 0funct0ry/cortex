import { create } from 'zustand'
import { commands } from '../bindings'
import type { WorkspaceResponse, RecentWorkspace } from '../bindings'
import { useEnvironmentStore } from './environmentStore'
import { toast } from './toastStore'

interface WorkspaceState {
  activeWorkspace: WorkspaceResponse | null
  activeWorkspacePath: string | null
  recentWorkspaces: RecentWorkspace[]
  isLoading: boolean
  error: string | null
  init: () => Promise<void>
  loadWorkspace: (path: string) => Promise<boolean>
  loadLastWorkspace: () => Promise<void>
  createWorkspace: (name: string, path: string) => Promise<boolean>
  openWorkspace: () => Promise<void>
  closeWorkspace: () => Promise<void>
}

const INITIAL_WORKSPACE_STATE = {
  activeWorkspace: null,
  activeWorkspacePath: null,
  recentWorkspaces: [] as WorkspaceState['recentWorkspaces'],
  isLoading: false,
  error: null,
}

export function resetWorkspaceStore() {
  useWorkspaceStore.setState(INITIAL_WORKSPACE_STATE)
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  activeWorkspace: null,
  activeWorkspacePath: null,
  recentWorkspaces: [],
  isLoading: false,
  error: null,

  init: async () => {
    const recent = await commands.getRecentWorkspaces()
    set({ recentWorkspaces: recent })
  },

  loadWorkspace: async (path: string) => {
    set({ isLoading: true, error: null })
    try {
      const result = await commands.loadWorkspace(path)
      if (result.status === 'ok') {
        set({
          activeWorkspace: result.data,
          activeWorkspacePath: path,
          isLoading: false,
        })
        // Load environments into environment store (pass env_files paths for re-parsing)
        useEnvironmentStore
          .getState()
          .loadEnvironments(
            result.data.environments,
            result.data.env_files,
            result.data.decrypt_failures
          )

        // Load the workspace-level global variables as the global environment
        useEnvironmentStore.getState().loadGlobalEnvironment(result.data.variables ?? [])

        // Refresh recent list
        const recent = await commands.getRecentWorkspaces()
        set({ recentWorkspaces: recent })
        return true
      } else {
        set({ error: result.error, isLoading: false })
        toast.error(`Failed to load workspace: ${result.error}`)
        return false
      }
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e), isLoading: false })
      return false
    }
  },

  loadLastWorkspace: async () => {
    try {
      const path = await commands.getLastWorkspacePath()
      if (path) {
        await get().loadWorkspace(path)
      }
      await get().init()
    } catch (e) {
      console.error('Failed to load last workspace', e)
    }
  },

  createWorkspace: async (name: string, path: string) => {
    set({ isLoading: true, error: null })
    try {
      const result = await commands.createWorkspace(name, path)
      if (result.status === 'ok') {
        const loaded = await get().loadWorkspace(result.data)
        if (loaded) {
          toast.success(`Workspace "${name}" created`)
          return true
        }
        return false
      } else {
        set({ error: result.error, isLoading: false })
        toast.error(`Failed to create workspace: ${result.error}`)
        return false
      }
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e), isLoading: false })
      toast.error(`Failed to create workspace: ${String(e)}`)
      return false
    }
  },

  openWorkspace: async () => {
    try {
      const result = await commands.pickDirectory('Select Workspace Directory')
      if (result.status === 'ok' && result.data) {
        await get().loadWorkspace(result.data)
      }
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e) })
    }
  },

  closeWorkspace: async () => {
    try {
      await commands.closeWorkspace()
      set({
        activeWorkspace: null,
        activeWorkspacePath: null,
      })
      // Refresh recent list to ensure it's up to date
      const recent = await commands.getRecentWorkspaces()
      set({ recentWorkspaces: recent })
    } catch (e) {
      console.error('Failed to close workspace', e)
    }
  },
}))
