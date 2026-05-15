import { create } from 'zustand'
import { commands } from '../bindings'
import type { WorkspaceResponse, RecentWorkspace } from '../bindings'
import { useEnvironmentStore } from './environmentStore'

interface WorkspaceState {
  activeWorkspace: WorkspaceResponse | null
  activeWorkspacePath: string | null
  recentWorkspaces: RecentWorkspace[]
  isLoading: boolean
  error: string | null
  init: () => Promise<void>
  loadWorkspace: (path: string) => Promise<void>
  loadLastWorkspace: () => Promise<void>
  createWorkspace: (name: string, path: string) => Promise<void>
  openWorkspace: () => Promise<void>
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
        // Load environments into environment store
        useEnvironmentStore.getState().loadEnvironments(result.data.environments)
        // Refresh recent list
        const recent = await commands.getRecentWorkspaces()
        set({ recentWorkspaces: recent })
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
        await get().loadWorkspace(result.data)
      } else {
        set({ error: result.error, isLoading: false })
      }
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e), isLoading: false })
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
}))
