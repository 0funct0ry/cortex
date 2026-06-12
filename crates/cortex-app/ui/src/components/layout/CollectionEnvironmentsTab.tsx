import React, { useState, useMemo, useEffect } from 'react'
import * as Icons from '../ui/Icons'
import { useCollectionEnvironmentStore } from '../../stores/collectionEnvironmentStore'
import { toast } from '../../stores/toastStore'
import { EnvironmentEditor, CreateEnvironmentModal } from './EnvironmentsTab'
import Dialog from '../ui/Dialog'
import type { Variable } from '../../bindings'

interface CollectionEnvironmentsTabProps {
  collectionPath: string
}

const CollectionEnvironmentsTab: React.FC<CollectionEnvironmentsTabProps> = ({
  collectionPath,
}) => {
  const {
    collectionEnvironments,
    activeCollectionEnvName,
    editingCollectionEnvName,
    dirtyCollectionEnvs,
    loadCollectionEnvironments,
    setActiveCollectionEnvironment,
    setEditingCollectionEnvironment,
    setCollectionEnvDirty,
    updateCollectionEnvVariables,
    deleteCollectionEnv,
    renameCollectionEnv,
  } = useCollectionEnvironmentStore()

  const envs = useMemo(
    () => collectionEnvironments[collectionPath] ?? [],
    [collectionEnvironments, collectionPath]
  )
  const activeEnvName = activeCollectionEnvName[collectionPath] ?? null
  const editingEnvName = editingCollectionEnvName[collectionPath] ?? null

  const [searchQuery, setSearchQuery] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createModalKey, setCreateModalKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  useEffect(() => {
    loadCollectionEnvironments(collectionPath)
  }, [collectionPath, loadCollectionEnvironments])

  const filteredEnvs = useMemo(
    () => envs.filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [envs, searchQuery]
  )

  const selectedEnv = useMemo(
    () => (editingEnvName ? (envs.find((e) => e.name === editingEnvName) ?? null) : null),
    [envs, editingEnvName]
  )

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleCreate = () => {
    setCreateModalKey((k) => k + 1)
    setCreateModalOpen(true)
  }

  const handleCreateConfirm = async (name: string) => {
    try {
      await updateCollectionEnvVariables(collectionPath, name, [])
      setEditingCollectionEnvironment(collectionPath, name)
    } catch (err) {
      toast.error(`Failed to create environment: ${String(err)}`)
      throw err
    }
  }

  const handleSave = async (variables: Variable[]) => {
    if (!editingEnvName) return
    await updateCollectionEnvVariables(collectionPath, editingEnvName, variables)
    setCollectionEnvDirty(collectionPath, editingEnvName, false)
    toast.success('Saved')
  }

  const handleDelete = async (name: string) => {
    setDeleteTarget(name)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteCollectionEnv(collectionPath, deleteTarget)
      toast.success(`Environment "${deleteTarget}" deleted`)
    } catch (err) {
      toast.error(`Failed to delete: ${String(err)}`)
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleRename = async (newName: string) => {
    if (!editingEnvName) return
    if (envs.find((e) => e.name === newName)) {
      throw new Error(`Environment "${newName}" already exists`)
    }
    await renameCollectionEnv(collectionPath, editingEnvName, newName)
  }

  // ── Right panel ─────────────────────────────────────────────────────────────

  const renderRightPanel = () => {
    if (selectedEnv) {
      return (
        <EnvironmentEditor
          key={`col:${collectionPath}:${selectedEnv.name}`}
          name={selectedEnv.name}
          envKey={`col:${collectionPath}:${selectedEnv.name}`}
          variables={selectedEnv.variables}
          tamperedVariables={{}}
          onSave={handleSave}
          onDelete={handleDelete}
          onRename={handleRename}
          onDirtyChange={(dirty) => setCollectionEnvDirty(collectionPath, selectedEnv.name, dirty)}
        />
      )
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center select-none p-8">
        <div className="text-text-muted opacity-10 mb-4">
          <Icons.Layers size={80} strokeWidth={1} />
        </div>
        {envs.length === 0 ? (
          <>
            <h3 className="text-text-secondary text-sm font-medium mb-1">
              No collection environments yet
            </h3>
            <p className="text-text-muted text-xs max-w-[260px]">
              Collection environments let you define variables that apply only to requests in this
              collection.
            </p>
            <button
              onClick={handleCreate}
              className="mt-6 h-8 px-4 flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-fg text-sm font-medium rounded-md transition-colors shadow-sm"
            >
              <Icons.Plus size={14} />
              Create environment
            </button>
          </>
        ) : (
          <>
            <h3 className="text-text-secondary text-sm font-medium mb-1">
              No environment selected
            </h3>
            <p className="text-text-muted text-xs max-w-[240px]">
              Select an environment from the sidebar or create a new one.
            </p>
          </>
        )}
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full bg-bg-base overflow-hidden">
      {/* ── Left sidebar ── */}
      <div className="w-52 border-r border-border-subtle flex flex-col shrink-0 bg-bg-panel/50">
        {/* Section header */}
        <div className="h-10 px-3 flex items-center justify-between border-b border-border-subtle shrink-0">
          <div className="flex flex-col justify-center">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider leading-none">
              Environments
            </span>
            <span className="text-[9px] text-text-muted leading-tight mt-0.5">
              Scoped to this collection
            </span>
          </div>
          <button
            onClick={handleCreate}
            className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
            title="New environment"
          >
            <Icons.Plus size={13} />
          </button>
        </div>

        {/* Search */}
        {envs.length > 0 && (
          <div className="p-2 border-b border-border-subtle shrink-0">
            <div className="relative">
              <Icons.Search
                size={11}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-7 pl-7 pr-2 bg-bg-surface border border-border-default rounded text-xs focus:border-accent focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* Environment list */}
        <div className="flex-1 overflow-y-auto py-1 min-h-0">
          {filteredEnvs.length > 0 ? (
            filteredEnvs.map((env) => {
              const dk = `${collectionPath}\0${env.name}`
              const isDirty = dirtyCollectionEnvs[dk] ?? false
              return (
                <div
                  key={env.name}
                  onClick={() => setEditingCollectionEnvironment(collectionPath, env.name)}
                  className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${
                    editingEnvName === env.name ? 'bg-bg-muted' : 'hover:bg-bg-muted/50'
                  }`}
                >
                  <span
                    className={`text-sm truncate flex-1 min-w-0 ${
                      editingEnvName === env.name
                        ? 'text-text-primary font-medium'
                        : 'text-text-secondary'
                    }`}
                  >
                    {env.name}
                  </span>
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    {isDirty && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-accent"
                        title="Unsaved changes"
                      />
                    )}
                    {activeEnvName === env.name && (
                      <Icons.Check size={13} className="text-success" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveCollectionEnvironment(
                          collectionPath,
                          activeEnvName === env.name ? null : env.name
                        )
                      }}
                      className="p-0.5 opacity-0 group-hover:opacity-100 transition-all rounded text-text-muted hover:text-success"
                      title={
                        activeEnvName === env.name
                          ? 'Deactivate environment'
                          : 'Set as active environment'
                      }
                    >
                      <Icons.Check size={11} />
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="px-3 py-6 text-center text-xs text-text-muted">
              {searchQuery ? 'No matches' : 'No environments yet'}
            </div>
          )}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden">{renderRightPanel()}</div>

      {/* ── Modals ── */}
      <CreateEnvironmentModal
        key={createModalKey}
        isOpen={createModalOpen}
        existingNames={envs.map((e) => e.name)}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateConfirm}
      />
      <Dialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deleteTarget}"`}
        description="This will permanently remove the environment and its variables. This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  )
}

export default CollectionEnvironmentsTab
