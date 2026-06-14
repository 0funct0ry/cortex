import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import * as Icons from '../ui/Icons'
import { useCollectionEnvironmentStore } from '../../stores/collectionEnvironmentStore'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { toast } from '../../stores/toastStore'
import { EnvironmentEditor, CreateEnvironmentModal, HeaderMenu } from './EnvironmentsTab'
import Dialog from '../ui/Dialog'
import { commands } from '../../bindings'
import type { Variable } from '../../bindings'
import { getTagColor } from '../../utils/tagColors'

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

  const { envColors, setEnvironmentColor } = useEnvironmentStore()

  const envs = useMemo(
    () => collectionEnvironments[collectionPath] ?? [],
    [collectionEnvironments, collectionPath]
  )
  const activeEnvName = activeCollectionEnvName[collectionPath] ?? null
  const editingEnvName = editingCollectionEnvName[collectionPath] ?? null

  const collectionName =
    collectionPath
      .split('/')
      .pop()
      ?.replace(/\.collection\.json$/i, '') ?? collectionPath

  const [searchQuery, setSearchQuery] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createModalKey, setCreateModalKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const SIDEBAR_STORAGE_KEY = 'cortex:col-env-sidebar-width'
  const SIDEBAR_DEFAULT = 315
  const SIDEBAR_MIN = 180
  const SIDEBAR_MAX = 480
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    return stored ? parseInt(stored, 10) : SIDEBAR_DEFAULT
  })
  const isResizing = useRef(false)

  const startResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      isResizing.current = true
      const startX = e.clientX
      const startWidth = sidebarWidth

      const onMouseMove = (ev: MouseEvent) => {
        if (!isResizing.current) return
        const newWidth = Math.min(
          SIDEBAR_MAX,
          Math.max(SIDEBAR_MIN, startWidth + ev.clientX - startX)
        )
        setSidebarWidth(newWidth)
      }
      const onMouseUp = (ev: MouseEvent) => {
        isResizing.current = false
        const newWidth = Math.min(
          SIDEBAR_MAX,
          Math.max(SIDEBAR_MIN, startWidth + ev.clientX - startX)
        )
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(newWidth))
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [sidebarWidth]
  )

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

  const handleImport = async () => {
    try {
      const pathResult = await commands.pickFile('Import Environment', 'YAML', 'yaml')
      if (pathResult.status === 'error' || !pathResult.data) return

      const fileResult = await commands.readEnvironmentFile(pathResult.data)
      if (fileResult.status === 'error') throw new Error(fileResult.error)

      const rawName =
        pathResult.data
          .split('/')
          .pop()
          ?.replace(/\.ya?ml$/i, '') ?? 'imported'
      const envName = envs.find((e) => e.name === rawName) ? `${rawName}-imported` : rawName

      await updateCollectionEnvVariables(collectionPath, envName, fileResult.data.variables)
      setEditingCollectionEnvironment(collectionPath, envName)
      toast.success(`Imported "${envName}" with ${fileResult.data.variables.length} variable(s)`)
    } catch (err) {
      toast.error(`Import failed: ${String(err)}`)
    }
  }

  const handleExport = async () => {
    if (!selectedEnv) {
      toast.error('Select an environment to export')
      return
    }
    try {
      const pathResult = await commands.saveFile(
        'Export Environment',
        'YAML',
        'yaml',
        selectedEnv.name
      )
      if (pathResult.status === 'error' || !pathResult.data) return

      const varLines = selectedEnv.variables
        .map(
          (v) =>
            `  - name: ${v.name}\n    value: ${JSON.stringify(v.value)}\n    secret: ${v.secret ?? false}\n    enabled: ${v.enabled ?? true}\n    prompt: ${v.prompt ?? false}`
        )
        .join('\n')
      const yaml = `version: "1"\nname: ${selectedEnv.name}\nvariables:\n${varLines || '  []'}\n`

      const writeResult = await commands.writeTextFile(pathResult.data, yaml)
      if (writeResult.status === 'error') throw new Error(writeResult.error)

      toast.success(`Exported to ${pathResult.data.split('/').pop()}`)
    } catch (err) {
      toast.error(`Export failed: ${String(err)}`)
    }
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
          color={envColors[selectedEnv.name] ?? null}
          collectionName={collectionName}
          tamperedVariables={{}}
          onSave={handleSave}
          onDelete={handleDelete}
          onRename={handleRename}
          onColorChange={(c) => setEnvironmentColor(selectedEnv.name, c)}
          onDirtyChange={(dirty) => setCollectionEnvDirty(collectionPath, selectedEnv.name, dirty)}
        />
      )
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center select-none p-8">
        <div className="text-text-muted opacity-10 mb-4">
          <Icons.Layers size={80} strokeWidth={1} />
        </div>
        <p className="text-[11px] text-text-muted mb-4 font-medium tracking-wide uppercase">
          {collectionName}
        </p>
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
      <div
        className="border-r border-border-subtle flex flex-col shrink-0 bg-bg-panel/50 relative"
        style={{ width: sidebarWidth }}
      >
        {/* Section header */}
        <div className="h-10 px-3 flex items-center justify-between border-b border-border-subtle shrink-0">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider truncate mr-1">
            Collection Environments
          </span>
          <HeaderMenu
            items={[
              {
                label: 'New Environment',
                icon: <Icons.Plus size={13} />,
                onClick: handleCreate,
              },
              {
                label: 'Import',
                icon: <Icons.Download size={13} />,
                onClick: handleImport,
              },
              {
                label: 'Export',
                icon: <Icons.Upload size={13} />,
                onClick: handleExport,
                disabled: !selectedEnv,
              },
            ]}
          />
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
              const envColorBg = envColors[env.name] ? getTagColor(envColors[env.name]).bg : null
              return (
                <div
                  key={env.name}
                  onClick={() => setEditingCollectionEnvironment(collectionPath, env.name)}
                  className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${
                    editingEnvName === env.name ? 'bg-bg-muted' : 'hover:bg-bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    {envColorBg ? (
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: envColorBg }}
                      />
                    ) : (
                      <div className="w-2 shrink-0" />
                    )}
                    <span
                      className={`text-sm truncate flex-1 min-w-0 ${
                        editingEnvName === env.name
                          ? 'text-text-primary font-medium'
                          : 'text-text-secondary'
                      }`}
                    >
                      {env.name}
                    </span>
                  </div>
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

        {/* Resize handle */}
        <div
          onMouseDown={startResize}
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-accent/40 transition-colors z-10"
        />
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
