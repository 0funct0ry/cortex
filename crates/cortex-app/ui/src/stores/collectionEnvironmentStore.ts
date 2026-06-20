import { create } from 'zustand'
import { commands, type EnvironmentFile, type Variable } from '../bindings'

interface CollectionEnvironmentState {
  /** collectionPath → list of EnvironmentFile for that collection */
  collectionEnvironments: Record<string, EnvironmentFile[]>
  /** collectionPath → currently active env name (null = none selected) */
  activeCollectionEnvName: Record<string, string | null>
  /** collectionPath → env name being edited in the tab */
  editingCollectionEnvName: Record<string, string | null>
  /** "collPath\0envName" → dirty boolean */
  dirtyCollectionEnvs: Record<string, boolean>

  loadCollectionEnvironments: (collectionPath: string) => Promise<void>
  setActiveCollectionEnvironment: (collectionPath: string, name: string | null) => void
  setEditingCollectionEnvironment: (collectionPath: string, name: string | null) => void
  setCollectionEnvDirty: (collectionPath: string, envName: string, dirty: boolean) => void
  updateCollectionEnvVariables: (
    collectionPath: string,
    name: string,
    variables: Variable[]
  ) => Promise<void>
  deleteCollectionEnv: (collectionPath: string, name: string) => Promise<void>
  renameCollectionEnv: (collectionPath: string, oldName: string, newName: string) => Promise<void>
}

function activeEnvKey(collectionPath: string): string {
  return `cortex.collection-active-env.${collectionPath}`
}

function dirtyKey(collectionPath: string, envName: string): string {
  return `${collectionPath}\0${envName}`
}

export function resetCollectionEnvironmentStore() {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('cortex.collection-active-env.')) {
      localStorage.removeItem(key)
    }
  }
  useCollectionEnvironmentStore.setState({
    collectionEnvironments: {},
    activeCollectionEnvName: {},
    editingCollectionEnvName: {},
    dirtyCollectionEnvs: {},
  })
}

export const useCollectionEnvironmentStore = create<CollectionEnvironmentState>((set) => ({
  collectionEnvironments: {},
  activeCollectionEnvName: {},
  editingCollectionEnvName: {},
  dirtyCollectionEnvs: {},

  loadCollectionEnvironments: async (collectionPath) => {
    const result = await commands.loadCollectionEnvironments(collectionPath)
    if (result.status === 'error') {
      console.error('Failed to load collection environments:', result.error)
      return
    }
    const envs = result.data

    const stored = localStorage.getItem(activeEnvKey(collectionPath))
    const validActive = stored && envs.some((e) => e.name === stored) ? stored : null

    if (stored && !validActive) {
      localStorage.removeItem(activeEnvKey(collectionPath))
    }

    set((state) => ({
      collectionEnvironments: { ...state.collectionEnvironments, [collectionPath]: envs },
      activeCollectionEnvName: {
        ...state.activeCollectionEnvName,
        [collectionPath]: validActive,
      },
    }))
  },

  setActiveCollectionEnvironment: (collectionPath, name) => {
    set((state) => ({
      activeCollectionEnvName: { ...state.activeCollectionEnvName, [collectionPath]: name },
    }))
    if (name) {
      localStorage.setItem(activeEnvKey(collectionPath), name)
    } else {
      localStorage.removeItem(activeEnvKey(collectionPath))
    }
  },

  setEditingCollectionEnvironment: (collectionPath, name) => {
    set((state) => ({
      editingCollectionEnvName: { ...state.editingCollectionEnvName, [collectionPath]: name },
    }))
  },

  setCollectionEnvDirty: (collectionPath, envName, dirty) => {
    const key = dirtyKey(collectionPath, envName)
    set((state) => {
      if (state.dirtyCollectionEnvs[key] === dirty) return state
      return { dirtyCollectionEnvs: { ...state.dirtyCollectionEnvs, [key]: dirty } }
    })
  },

  updateCollectionEnvVariables: async (collectionPath, name, variables) => {
    const result = await commands.updateCollectionEnvironmentVariables(
      collectionPath,
      name,
      variables
    )
    if (result.status === 'error') throw new Error(result.error)

    set((state) => {
      const existing = state.collectionEnvironments[collectionPath] ?? []
      const found = existing.some((e) => e.name === name)
      const updated = found
        ? existing.map((e) => (e.name === name ? { ...e, variables } : e))
        : [...existing, { version: '1', name, variables }]
      return {
        collectionEnvironments: { ...state.collectionEnvironments, [collectionPath]: updated },
      }
    })
  },

  deleteCollectionEnv: async (collectionPath, name) => {
    const result = await commands.deleteCollectionEnvironment(collectionPath, name)
    if (result.status === 'error') throw new Error(result.error)

    set((state) => {
      const existing = state.collectionEnvironments[collectionPath] ?? []
      const currentActive = state.activeCollectionEnvName[collectionPath]
      const currentEditing = state.editingCollectionEnvName[collectionPath]

      const newActive = currentActive === name ? null : currentActive
      if (currentActive === name) localStorage.removeItem(activeEnvKey(collectionPath))

      const dk = dirtyKey(collectionPath, name)
      const newDirty = { ...state.dirtyCollectionEnvs }
      delete newDirty[dk]

      return {
        collectionEnvironments: {
          ...state.collectionEnvironments,
          [collectionPath]: existing.filter((e) => e.name !== name),
        },
        activeCollectionEnvName: { ...state.activeCollectionEnvName, [collectionPath]: newActive },
        editingCollectionEnvName: {
          ...state.editingCollectionEnvName,
          [collectionPath]: currentEditing === name ? null : currentEditing,
        },
        dirtyCollectionEnvs: newDirty,
      }
    })
  },

  renameCollectionEnv: async (collectionPath, oldName, newName) => {
    const result = await commands.renameCollectionEnvironment(collectionPath, oldName, newName)
    if (result.status === 'error') throw new Error(result.error)

    set((state) => {
      const existing = state.collectionEnvironments[collectionPath] ?? []
      const currentActive = state.activeCollectionEnvName[collectionPath]
      const currentEditing = state.editingCollectionEnvName[collectionPath]

      if (currentActive === oldName) localStorage.setItem(activeEnvKey(collectionPath), newName)

      const oldDk = dirtyKey(collectionPath, oldName)
      const newDk = dirtyKey(collectionPath, newName)
      const oldDirty = state.dirtyCollectionEnvs[oldDk] ?? false
      const newDirtyMap = { ...state.dirtyCollectionEnvs, [newDk]: oldDirty }
      delete newDirtyMap[oldDk]

      return {
        collectionEnvironments: {
          ...state.collectionEnvironments,
          [collectionPath]: existing.map((e) => (e.name === oldName ? { ...e, name: newName } : e)),
        },
        activeCollectionEnvName: {
          ...state.activeCollectionEnvName,
          [collectionPath]: currentActive === oldName ? newName : currentActive,
        },
        editingCollectionEnvName: {
          ...state.editingCollectionEnvName,
          [collectionPath]: currentEditing === oldName ? newName : currentEditing,
        },
        dirtyCollectionEnvs: newDirtyMap,
      }
    })
  },
}))
