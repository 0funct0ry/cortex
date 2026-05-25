import { create } from 'zustand'
import { commands, type EnvironmentFile, type Variable } from '../bindings'
import { useWorkspaceStore } from './workspaceStore'

export interface DotEnvFile {
  path: string
  variables: Variable[]
}

interface EnvironmentState {
  environments: EnvironmentFile[]
  activeEnvironmentName: string | null
  editingEnvironmentName: string | null
  dirtyEnvironments: Record<string, boolean>
  dotEnvFiles: DotEnvFile[]
  globalEnvironment: EnvironmentFile | null
  isLoading: boolean
  error: string | null

  // Actions
  loadEnvironments: (environments: EnvironmentFile[], envFilePaths?: string[]) => void
  setActiveEnvironment: (name: string | null) => void
  setEditingEnvironment: (name: string | null) => void
  setDirty: (name: string, dirty: boolean) => void
  saveEnvironment: (environment: EnvironmentFile) => Promise<void>
  deleteEnvironment: (name: string) => Promise<void>
  updateVariables: (name: string, variables: Variable[]) => Promise<void>
  renameEnvironment: (oldName: string, newName: string) => Promise<void>
  addDotEnvFile: (path: string) => Promise<void>
  removeDotEnvFile: (path: string) => Promise<void>
  loadGlobalEnvironment: () => Promise<void>
  updateGlobalEnvironment: (variables: Variable[]) => Promise<void>
}

function getActiveEnvKey(workspacePath: string | null): string {
  return workspacePath ? `cortex.active-environment.${workspacePath}` : 'cortex.active-environment'
}

function readActiveEnv(workspacePath: string | null): string | null {
  // Try workspace-scoped key first, fall back to legacy global key
  if (workspacePath) {
    const scoped = localStorage.getItem(getActiveEnvKey(workspacePath))
    if (scoped !== null) return scoped
  }
  return localStorage.getItem('cortex.active-environment')
}

export const useEnvironmentStore = create<EnvironmentState>((set, get) => {
  return {
    environments: [],
    activeEnvironmentName: null,
    editingEnvironmentName: null,
    dirtyEnvironments: {},
    dotEnvFiles: [],
    globalEnvironment: null,
    isLoading: false,
    error: null,

    loadEnvironments: (environments, envFilePaths) => {
      const workspacePath = useWorkspaceStore.getState().activeWorkspacePath
      const savedActive = readActiveEnv(workspacePath)

      set({ environments })

      // Ensure active environment still exists after reload
      const active =
        savedActive && environments.find((e) => e.name === savedActive) ? savedActive : null
      set({ activeEnvironmentName: active })
      if (!active && savedActive) {
        // Clean up stale key
        if (workspacePath) localStorage.removeItem(getActiveEnvKey(workspacePath))
        localStorage.removeItem('cortex.active-environment')
      }

      // Re-parse any .env file paths provided by the workspace response
      if (envFilePaths && envFilePaths.length > 0) {
        const existing = get().dotEnvFiles
        const newPaths = envFilePaths.filter((p) => !existing.some((d) => d.path === p))
        if (newPaths.length > 0) {
          Promise.all(
            newPaths.map(async (p) => {
              try {
                const result = await commands.parseEnvFile(p)
                if (result.status === 'ok') return { path: p, variables: result.data }
              } catch {
                /* skip unreadable .env files */
              }
              return { path: p, variables: [] }
            })
          ).then((newFiles) => {
            set((state) => ({
              dotEnvFiles: [
                ...state.dotEnvFiles.filter((d) => envFilePaths.includes(d.path)),
                ...newFiles.filter(Boolean),
              ] as DotEnvFile[],
            }))
          })
        }
      } else if (envFilePaths !== undefined) {
        // Empty list supplied — clear dot-env files
        set({ dotEnvFiles: [] })
      }
    },

    setActiveEnvironment: (name) => {
      const workspacePath = useWorkspaceStore.getState().activeWorkspacePath
      set({ activeEnvironmentName: name })
      const key = getActiveEnvKey(workspacePath)
      if (name) {
        localStorage.setItem(key, name)
      } else {
        localStorage.removeItem(key)
      }
      // Persist to backend (legacy global setting, still used by request executor)
      commands.setActiveEnvironment(name).catch((err: unknown) => {
        console.error('Failed to persist active environment', err)
      })
    },

    setEditingEnvironment: (name) => set({ editingEnvironmentName: name }),

    setDirty: (name, dirty) =>
      set((state) => {
        // Guard against no-op updates to prevent infinite re-render loops:
        // spreading always produces a new object reference which would notify
        // Zustand subscribers even when the value hasn't changed.
        if (state.dirtyEnvironments[name] === dirty) return state
        return { dirtyEnvironments: { ...state.dirtyEnvironments, [name]: dirty } }
      }),

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

        const newDirty = { ...get().dirtyEnvironments }
        delete newDirty[name]

        set((state) => ({
          environments: state.environments.filter((e) => e.name !== name),
          activeEnvironmentName:
            state.activeEnvironmentName === name ? null : state.activeEnvironmentName,
          editingEnvironmentName:
            state.editingEnvironmentName === name ? null : state.editingEnvironmentName,
          dirtyEnvironments: newDirty,
          isLoading: false,
        }))

        if (get().activeEnvironmentName === null) {
          const workspacePath = useWorkspaceStore.getState().activeWorkspacePath
          localStorage.removeItem(getActiveEnvKey(workspacePath))
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

        set((state) => {
          const exists = state.environments.some((e) => e.name === name)
          const newEnvironments = exists
            ? state.environments.map((e) => (e.name === name ? { ...e, variables } : e))
            : [...state.environments, { version: '1', name, variables }]
          return {
            environments: newEnvironments,
            isLoading: false,
          }
        })
      } catch (err) {
        set({ error: String(err), isLoading: false })
        throw err
      }
    },

    renameEnvironment: async (oldName, newName) => {
      const workspacePath = useWorkspaceStore.getState().activeWorkspacePath
      if (!workspacePath) return

      set({ isLoading: true, error: null })
      try {
        const result = await commands.renameEnvironment(workspacePath, oldName, newName)
        if (result.status === 'error') throw new Error(result.error)

        const oldDirty = get().dirtyEnvironments[oldName] ?? false
        const newDirty = { ...get().dirtyEnvironments }
        delete newDirty[oldName]

        set((state) => ({
          environments: state.environments.map((e) =>
            e.name === oldName ? { ...e, name: newName } : e
          ),
          activeEnvironmentName:
            state.activeEnvironmentName === oldName ? newName : state.activeEnvironmentName,
          editingEnvironmentName:
            state.editingEnvironmentName === oldName ? newName : state.editingEnvironmentName,
          dirtyEnvironments: { ...newDirty, [newName]: oldDirty },
          isLoading: false,
        }))

        // Update scoped active env key if needed
        if (get().activeEnvironmentName === newName) {
          const wp = useWorkspaceStore.getState().activeWorkspacePath
          const key = getActiveEnvKey(wp)
          localStorage.setItem(key, newName)
        }
      } catch (err) {
        set({ error: String(err), isLoading: false })
        throw err
      }
    },

    addDotEnvFile: async (path) => {
      const workspacePath = useWorkspaceStore.getState().activeWorkspacePath
      if (!workspacePath) return

      try {
        const [parseResult, addResult] = await Promise.all([
          commands.parseEnvFile(path),
          commands.addWorkspaceEnvFile(workspacePath, path),
        ])
        if (parseResult.status === 'error') throw new Error(parseResult.error)
        if (addResult.status === 'error') throw new Error(addResult.error)

        set((state) => ({
          dotEnvFiles: state.dotEnvFiles.some((d) => d.path === path)
            ? state.dotEnvFiles
            : [...state.dotEnvFiles, { path, variables: parseResult.data }],
        }))
      } catch (err) {
        set({ error: String(err) })
        throw err
      }
    },

    removeDotEnvFile: async (path) => {
      const workspacePath = useWorkspaceStore.getState().activeWorkspacePath
      if (!workspacePath) return

      try {
        const result = await commands.removeWorkspaceEnvFile(workspacePath, path)
        if (result.status === 'error') throw new Error(result.error)

        set((state) => ({
          dotEnvFiles: state.dotEnvFiles.filter((d) => d.path !== path),
        }))
      } catch (err) {
        set({ error: String(err) })
        throw err
      }
    },

    loadGlobalEnvironment: async () => {
      try {
        const result = await commands.loadGlobalEnvironment()
        if (result.status === 'error') throw new Error(result.error)
        set({ globalEnvironment: result.data })
      } catch (err) {
        set({ error: String(err) })
      }
    },

    updateGlobalEnvironment: async (variables) => {
      set({ isLoading: true, error: null })
      try {
        const result = await commands.saveGlobalEnvironment(variables)
        if (result.status === 'error') throw new Error(result.error)

        set((state) => ({
          globalEnvironment: state.globalEnvironment
            ? { ...state.globalEnvironment, variables }
            : { version: '1', name: 'Global', variables },
          isLoading: false,
        }))
      } catch (err) {
        set({ error: String(err), isLoading: false })
        throw err
      }
    },
  }
})
