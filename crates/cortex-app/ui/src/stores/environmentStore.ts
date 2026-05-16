import { create } from 'zustand'
import { commands, type EnvironmentFile, type Variable } from '../bindings'
import { useWorkspaceStore } from './workspaceStore'

interface EnvironmentState {
  environments: EnvironmentFile[]
  activeEnvironmentName: string | null
  editingEnvironmentName: string | null
  isLoading: boolean
  error: string | null

  // Actions
  loadEnvironments: (environments: EnvironmentFile[]) => void
  setActiveEnvironment: (name: string | null) => void
  setEditingEnvironment: (name: string | null) => void
  saveEnvironment: (environment: EnvironmentFile) => Promise<void>
  deleteEnvironment: (name: string) => Promise<void>
  updateVariables: (name: string, variables: Variable[]) => Promise<void>
}

const STORAGE_KEY_ACTIVE = 'cortex.active-environment'

export const useEnvironmentStore = create<EnvironmentState>((set, get) => {
  const savedActive = localStorage.getItem(STORAGE_KEY_ACTIVE)

  return {
    environments: [],
    activeEnvironmentName: savedActive,
    editingEnvironmentName: null,
    isLoading: false,
    error: null,

    loadEnvironments: (environments) => {
      set({ environments })
      // Ensure active environment still exists
      const { activeEnvironmentName } = get()
      if (activeEnvironmentName && !environments.find((e) => e.name === activeEnvironmentName)) {
        set({ activeEnvironmentName: null })
        localStorage.removeItem(STORAGE_KEY_ACTIVE)
      }
    },

    setActiveEnvironment: (name) => {
      set({ activeEnvironmentName: name })
      if (name) {
        localStorage.setItem(STORAGE_KEY_ACTIVE, name)
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE)
      }
      // Persist to backend
      commands.setActiveEnvironment(name).catch((err: unknown) => {
        console.error('Failed to persist active environment', err)
      })
    },

    setEditingEnvironment: (name) => set({ editingEnvironmentName: name }),

    saveEnvironment: async (environment) => {
      const workspacePath = useWorkspaceStore.getState().activeWorkspacePath
      if (!workspacePath) return

      set({ isLoading: true, error: null })
      try {
        const result = await commands.updateEnvironmentVariables(
          workspacePath,
          environment.name,
          environment.variables
        )
        if (result.status === 'error') throw new Error(result.error)

        set((state) => ({
          environments: state.environments.map((e) =>
            e.name === environment.name ? environment : e
          ),
          isLoading: false,
        }))
      } catch (err) {
        set({ error: String(err), isLoading: false })
        throw err
      }
    },

    deleteEnvironment: async (name) => {
      const workspacePath = useWorkspaceStore.getState().activeWorkspacePath
      if (!workspacePath) return

      set({ isLoading: true, error: null })
      try {
        const result = await commands.deleteEnvironment(workspacePath, name)
        if (result.status === 'error') throw new Error(result.error)

        set((state) => ({
          environments: state.environments.filter((e) => e.name !== name),
          activeEnvironmentName:
            state.activeEnvironmentName === name ? null : state.activeEnvironmentName,
          editingEnvironmentName:
            state.editingEnvironmentName === name ? null : state.editingEnvironmentName,
          isLoading: false,
        }))

        if (get().activeEnvironmentName === null) {
          localStorage.removeItem(STORAGE_KEY_ACTIVE)
        }
      } catch (err) {
        set({ error: String(err), isLoading: false })
        throw err
      }
    },

    updateVariables: async (name, variables) => {
      const workspacePath = useWorkspaceStore.getState().activeWorkspacePath
      if (!workspacePath) return

      set({ isLoading: true, error: null })
      try {
        const result = await commands.updateEnvironmentVariables(workspacePath, name, variables)
        if (result.status === 'error') throw new Error(result.error)

        set((state) => ({
          environments: state.environments.map((e) => (e.name === name ? { ...e, variables } : e)),
          isLoading: false,
        }))
      } catch (err) {
        set({ error: String(err), isLoading: false })
        throw err
      }
    },
  }
})
