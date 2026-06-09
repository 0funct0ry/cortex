import React, { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import * as Icons from '../ui/Icons'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { toast } from '../../stores/toastStore'
import { commands } from '../../bindings'
import VariableEditor from '../composer/VariableEditor'
import Dialog from '../ui/Dialog'
import type { Variable } from '../../bindings'

// ─────────────────────────────────────────────────────────────────────────────
// CreateEnvironmentModal
// ─────────────────────────────────────────────────────────────────────────────

interface CreateEnvironmentModalProps {
  isOpen: boolean
  existingNames: string[]
  onClose: () => void
  onCreate: (name: string) => Promise<void>
}

const CreateEnvironmentModal: React.FC<CreateEnvironmentModalProps> = ({
  isOpen,
  existingNames,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus the input when the modal opens.
  // State resets are handled by incrementing the key in the parent, which
  // remounts this component fresh each time so initial useState values apply.
  useEffect(() => {
    if (!isOpen) return
    const id = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(id)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const trimmed = name.trim()
  const isDuplicate = existingNames.includes(trimmed)
  const canCreate = trimmed.length > 0 && !isDuplicate && !isSubmitting

  const handleSubmit = async () => {
    if (!canCreate) return
    setIsSubmitting(true)
    try {
      await onCreate(trimmed)
      onClose()
    } catch {
      /* errors are toasted by the caller */
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-sm bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="New Environment"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border-subtle">
          <h3 className="text-sm font-semibold text-text-primary">New Environment</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-muted transition-colors"
          >
            <Icons.X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
            Name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="e.g. staging, production"
            className={`w-full h-9 bg-bg-surface border rounded-md px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted ${
              isDuplicate
                ? 'border-error focus:border-error'
                : 'border-border-default focus:border-accent'
            }`}
          />
          {isDuplicate && (
            <p className="mt-1.5 text-xs text-error">
              An environment named &ldquo;{trimmed}&rdquo; already exists.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border-subtle">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canCreate}
            className="h-8 px-4 text-sm font-semibold bg-accent hover:bg-accent-hover text-accent-fg rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Sentinel key used to indicate the global environment is being edited
const GLOBAL_KEY = '__global__'

// ─────────────────────────────────────────────────────────────────────────────
// EnvironmentEditor — right panel
// ─────────────────────────────────────────────────────────────────────────────

interface EnvironmentEditorProps {
  name: string
  envKey: string
  variables: Variable[]
  isGlobal?: boolean
  readOnly?: boolean
  onSave: (variables: Variable[]) => Promise<void>
  onDelete?: (name: string) => Promise<void>
  onRename?: (newName: string) => Promise<void>
  onDirtyChange: (dirty: boolean) => void
}

const EnvironmentEditor: React.FC<EnvironmentEditorProps> = ({
  name,
  envKey,
  variables,
  isGlobal = false,
  readOnly = false,
  onSave,
  onDelete,
  onRename,
  onDirtyChange,
}) => {
  const { varSearchQueries, setVarSearchQuery } = useEnvironmentStore()
  const varSearch = varSearchQueries[envKey] ?? ''
  const setVarSearch = (q: string) => setVarSearchQuery(envKey, q)

  const [localVariables, setLocalVariables] = useState<Variable[]>(variables)
  const [isDirty, setIsDirty] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(name)
  const renameInputRef = useRef<HTMLInputElement>(null)

  // Propagate dirty state upward whenever it changes.
  // Note: onDirtyChange is intentionally in the deps. The loop-safety comes
  // from setDirty's no-op guard in the store (returns the same state object
  // when the value hasn't changed), which prevents Zustand from notifying
  // subscribers and avoids triggering a re-render cascade.
  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  // Focus rename input when entering rename mode
  useEffect(() => {
    if (isRenaming) renameInputRef.current?.select()
  }, [isRenaming])

  const handleSave = async () => {
    try {
      await onSave(localVariables)
      setIsDirty(false)
    } catch (err) {
      toast.error(`Save failed: ${String(err)}`)
    }
  }

  const handleReset = () => {
    setLocalVariables(variables)
    setIsDirty(false)
  }

  const handleVariablesChange = (vars: Variable[]) => {
    setLocalVariables(vars)
    setIsDirty(true)
  }

  const commitRename = async () => {
    const trimmed = renameValue.trim()
    if (!trimmed || trimmed === name) {
      setIsRenaming(false)
      setRenameValue(name)
      return
    }
    try {
      await onRename!(trimmed)
      // Parent will update `name` prop; useEffect above clears isRenaming
    } catch (err) {
      toast.error(`Rename failed: ${String(err)}`)
      setIsRenaming(false)
      setRenameValue(name)
    }
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitRename()
    else if (e.key === 'Escape') {
      setIsRenaming(false)
      setRenameValue(name)
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-bg-surface">
      {/* Toolbar */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-border-subtle shrink-0 bg-bg-base/30">
        <div className="flex items-center gap-2 min-w-0">
          {isGlobal ? (
            <div className="flex items-center gap-1.5 text-text-primary">
              <Icons.Globe size={13} className="text-accent shrink-0" />
              <span className="text-sm font-semibold">Global</span>
            </div>
          ) : isRenaming ? (
            <input
              ref={renameInputRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={handleRenameKeyDown}
              onBlur={commitRename}
              className="text-sm font-semibold text-text-primary bg-bg-highlight border border-accent rounded px-1 focus:outline-none min-w-0 w-48"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          ) : (
            <>
              <span className="text-sm font-semibold text-text-primary truncate">{name}</span>
              {onRename && (
                <button
                  onClick={() => setIsRenaming(true)}
                  className="p-0.5 text-text-muted hover:text-text-primary transition-colors shrink-0"
                  title="Rename environment"
                >
                  <Icons.Edit size={12} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Right-side toolbar actions */}
        {!readOnly && onDelete && !isGlobal && (
          <button
            onClick={() => onDelete(name)}
            className="p-1.5 hover:bg-bg-muted rounded-md text-text-muted hover:text-error transition-colors"
            title="Delete environment"
          >
            <Icons.Trash size={14} />
          </button>
        )}
      </div>

      {/* Variable search bar */}
      <div className="px-3 py-2 border-b border-border-subtle shrink-0">
        <div className="relative">
          <Icons.Search
            size={11}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search variables…"
            value={varSearch}
            onChange={(e) => setVarSearch(e.target.value)}
            className="w-full h-7 pl-7 pr-7 bg-bg-surface border border-border-default rounded text-xs focus:border-accent focus:outline-none transition-colors placeholder:text-text-muted"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
          {varSearch && (
            <button
              onClick={() => setVarSearch('')}
              tabIndex={-1}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-text-muted hover:text-text-primary rounded transition-colors"
              title="Clear search"
            >
              <Icons.X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Variable Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <VariableEditor
          variables={localVariables}
          onChange={handleVariablesChange}
          title=""
          readOnly={readOnly}
          searchQuery={varSearch}
        />
      </div>

      {/* Save / Reset footer */}
      {!readOnly && (
        <div className="h-12 px-4 border-t border-border-subtle flex items-center gap-3 bg-bg-base/30 shrink-0">
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all shadow-sm ${
              isDirty
                ? 'bg-accent text-accent-fg hover:bg-accent-hover ring-2 ring-accent/30'
                : 'bg-bg-muted text-text-muted cursor-not-allowed opacity-50'
            }`}
          >
            Save
          </button>
          <button
            onClick={handleReset}
            disabled={!isDirty}
            className={`text-sm font-medium transition-colors ${
              isDirty
                ? 'text-text-secondary hover:text-text-primary'
                : 'text-text-muted cursor-not-allowed'
            }`}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EnvironmentsTab — main component
// ─────────────────────────────────────────────────────────────────────────────

const EnvironmentsTab: React.FC = () => {
  const {
    environments,
    editingEnvironmentName,
    setEditingEnvironment,
    activeEnvironmentName,
    setActiveEnvironment,
    dirtyEnvironments,
    setDirty,
    updateVariables,
    deleteEnvironment,
    renameEnvironment,
    dotEnvFiles,
    addDotEnvFile,
    removeDotEnvFile,
    globalEnvironment,
    updateGlobalEnvironment,
  } = useEnvironmentStore()

  const { activeWorkspacePath } = useWorkspaceStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [dotEnvExpanded, setDotEnvExpanded] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createModalKey, setCreateModalKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const selectedEnv = useMemo(() => {
    if (editingEnvironmentName === GLOBAL_KEY) return null
    return environments.find((e) => e.name === editingEnvironmentName) ?? null
  }, [environments, editingEnvironmentName])

  const isEditingGlobal = editingEnvironmentName === GLOBAL_KEY

  const filteredEnvironments = environments.filter((env) =>
    env.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Compute conflict keys per dot-env file vs. currently selected environment
  const selectedEnvKeys = useMemo(() => {
    const env = selectedEnv ?? (isEditingGlobal ? globalEnvironment : null)
    return new Set((env?.variables ?? []).map((v) => v.name))
  }, [selectedEnv, isEditingGlobal, globalEnvironment])

  const dotEnvConflicts = useMemo(() => {
    return new Map(
      dotEnvFiles.map((f) => [f.path, f.variables.some((v) => selectedEnvKeys.has(v.name))])
    )
  }, [dotEnvFiles, selectedEnvKeys])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreate = () => {
    setCreateModalKey((k) => k + 1)
    setCreateModalOpen(true)
  }

  const handleCreateConfirm = async (name: string) => {
    try {
      await updateVariables(name, [])
      setEditingEnvironment(name)
    } catch (err) {
      toast.error(`Failed to create environment: ${String(err)}`)
      throw err
    }
  }

  const handleDelete = async (name: string) => {
    setDeleteTarget(name)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteEnvironment(deleteTarget)
      toast.success(`Environment "${deleteTarget}" deleted`)
    } catch (err) {
      toast.error(`Failed to delete: ${String(err)}`)
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleRename = async (newName: string) => {
    const oldName = editingEnvironmentName
    if (!oldName || oldName === GLOBAL_KEY) return
    if (environments.find((e) => e.name === newName)) {
      throw new Error(`Environment "${newName}" already exists`)
    }
    await renameEnvironment(oldName, newName)
  }

  const handleSave = async (variables: Variable[]) => {
    if (!editingEnvironmentName || editingEnvironmentName === GLOBAL_KEY) return
    await updateVariables(editingEnvironmentName, variables)
    setDirty(editingEnvironmentName, false)
    toast.success('Saved')
  }

  const handleSaveGlobal = async (variables: Variable[]) => {
    await updateGlobalEnvironment(variables)
    setDirty(GLOBAL_KEY, false)
    toast.success('Global environment saved')
  }

  const handleImport = async () => {
    if (!activeWorkspacePath) return
    try {
      const pathResult = await commands.pickFile('Import Environment', 'YAML', 'yaml')
      if (pathResult.status === 'error' || !pathResult.data) return

      // Read and parse the YAML file (backend decrypts any secrets)
      const fileResult = await commands.readEnvironmentFile(pathResult.data)
      if (fileResult.status === 'error') throw new Error(fileResult.error)

      // Derive a unique name from the filename (without extension)
      const rawName =
        pathResult.data
          .split('/')
          .pop()
          ?.replace(/\.ya?ml$/i, '') ?? 'imported'
      const envName = environments.find((e) => e.name === rawName) ? `${rawName}-imported` : rawName

      // Save with the actual variables from the file
      await updateVariables(envName, fileResult.data.variables)
      setEditingEnvironment(envName)
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

      // Build a minimal YAML representation
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

  const handleAddDotEnvFile = async () => {
    if (!activeWorkspacePath) return
    try {
      const pathResult = await commands.pickFile('Select .env file', 'Env Files', 'env')
      if (pathResult.status === 'error' || !pathResult.data) return
      await addDotEnvFile(pathResult.data)
      toast.success(`Added ${pathResult.data.split('/').pop()}`)
    } catch (err) {
      toast.error(`Failed to add .env file: ${String(err)}`)
    }
  }

  const handleRemoveDotEnvFile = async (path: string) => {
    try {
      await removeDotEnvFile(path)
    } catch (err) {
      toast.error(`Failed to remove .env file: ${String(err)}`)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const renderRightPanel = () => {
    if (isEditingGlobal) {
      return (
        <EnvironmentEditor
          key="__global__"
          name="Global"
          envKey={GLOBAL_KEY}
          variables={globalEnvironment?.variables ?? []}
          isGlobal
          onSave={handleSaveGlobal}
          onDirtyChange={(dirty) => setDirty(GLOBAL_KEY, dirty)}
        />
      )
    }

    // Check if a dot-env file is being viewed
    const dotEnvEntry = dotEnvFiles.find((d) => `__dotenv__${d.path}` === editingEnvironmentName)
    if (dotEnvEntry) {
      const dotEnvKey = `__dotenv__${dotEnvEntry.path}`
      return (
        <EnvironmentEditor
          key={dotEnvEntry.path}
          name={dotEnvEntry.path.split('/').pop() ?? dotEnvEntry.path}
          envKey={dotEnvKey}
          variables={dotEnvEntry.variables}
          readOnly
          onSave={async () => {}}
          onDirtyChange={() => {}}
        />
      )
    }

    if (selectedEnv) {
      return (
        <EnvironmentEditor
          key={selectedEnv.name}
          name={selectedEnv.name}
          envKey={selectedEnv.name}
          variables={selectedEnv.variables}
          onSave={handleSave}
          onDelete={handleDelete}
          onRename={handleRename}
          onDirtyChange={(dirty) => setDirty(selectedEnv.name, dirty)}
        />
      )
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center select-none p-8">
        <div className="text-text-muted opacity-10 mb-4">
          <Icons.Globe size={80} strokeWidth={1} />
        </div>
        <h3 className="text-text-secondary text-sm font-medium mb-1">No environment selected</h3>
        <p className="text-text-muted text-xs max-w-[240px]">
          Select an environment from the sidebar or create a new one to manage variables.
        </p>
        <button
          onClick={handleCreate}
          className="mt-6 h-8 px-4 flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-fg text-sm font-medium rounded-md transition-colors shadow-sm"
        >
          <Icons.Plus size={14} />
          Create environment
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-bg-base overflow-hidden">
      {/* ── Left sidebar ── */}
      <div className="w-52 border-r border-border-subtle flex flex-col shrink-0 bg-bg-panel/50">
        {/* Section header */}
        <div className="h-10 px-3 flex items-center justify-between border-b border-border-subtle shrink-0">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Environments
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleCreate}
              className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
              title="New environment"
            >
              <Icons.Plus size={13} />
            </button>
            <button
              onClick={handleImport}
              className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
              title="Import environment"
            >
              <Icons.Download size={13} />
            </button>
            <button
              onClick={handleExport}
              className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
              title="Export selected environment"
            >
              <Icons.Upload size={13} />
            </button>
          </div>
        </div>

        {/* Global Environment fixed entry */}
        <div
          onClick={() => setEditingEnvironment(GLOBAL_KEY)}
          className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors border-b border-border-subtle shrink-0 ${
            isEditingGlobal ? 'bg-bg-muted' : 'hover:bg-bg-muted/50'
          }`}
        >
          <Icons.Globe size={13} className={isEditingGlobal ? 'text-accent' : 'text-text-muted'} />
          <span
            className={`text-sm flex-1 truncate ${
              isEditingGlobal ? 'text-text-primary font-medium' : 'text-text-secondary'
            }`}
          >
            Global
          </span>
          {dirtyEnvironments[GLOBAL_KEY] && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" title="Unsaved changes" />
          )}
        </div>

        {/* Search */}
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

        {/* Environment list */}
        <div className="flex-1 overflow-y-auto py-1 min-h-0">
          {filteredEnvironments.map((env) => (
            <div
              key={env.name}
              onClick={() => setEditingEnvironment(env.name)}
              className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${
                editingEnvironmentName === env.name ? 'bg-bg-muted' : 'hover:bg-bg-muted/50'
              }`}
            >
              <span
                className={`text-sm truncate flex-1 min-w-0 ${
                  editingEnvironmentName === env.name
                    ? 'text-text-primary font-medium'
                    : 'text-text-secondary'
                }`}
              >
                {env.name}
              </span>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {/* Dirty indicator */}
                {dirtyEnvironments[env.name] && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" title="Unsaved changes" />
                )}
                {/* Active checkmark */}
                {activeEnvironmentName === env.name && (
                  <Icons.Check size={13} className="text-success" />
                )}
                {/* Activate on click (separate from row select) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveEnvironment(activeEnvironmentName === env.name ? null : env.name)
                  }}
                  className={`p-0.5 opacity-0 group-hover:opacity-100 transition-all rounded text-text-muted hover:text-success`}
                  title={
                    activeEnvironmentName === env.name
                      ? 'Deactivate environment'
                      : 'Set as active environment'
                  }
                >
                  <Icons.Check size={11} />
                </button>
              </div>
            </div>
          ))}
          {filteredEnvironments.length === 0 && (
            <div className="px-3 py-6 text-center text-xs text-text-muted">
              {searchQuery ? 'No matches' : 'No environments yet'}
            </div>
          )}
        </div>

        {/* .ENV FILES collapsible section */}
        <div className="border-t border-border-subtle shrink-0">
          <div
            className="h-8 px-3 flex items-center justify-between cursor-pointer hover:bg-bg-muted/30 transition-colors"
            onClick={() => setDotEnvExpanded((v) => !v)}
          >
            <div className="flex items-center gap-1.5">
              <Icons.ChevronDown
                size={11}
                className={`text-text-muted transition-transform ${dotEnvExpanded ? '' : '-rotate-90'}`}
              />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                .ENV Files
              </span>
              <span className="text-[10px] font-medium text-text-muted bg-bg-muted rounded px-1">
                {dotEnvFiles.length}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleAddDotEnvFile()
              }}
              className="p-0.5 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
              title="Add .env file"
            >
              <Icons.Plus size={11} />
            </button>
          </div>

          {dotEnvExpanded && (
            <div className="pb-1">
              {dotEnvFiles.map((f) => {
                const filename = f.path.split('/').pop() ?? f.path
                const hasConflict = dotEnvConflicts.get(f.path) ?? false
                const editKey = `__dotenv__${f.path}`
                return (
                  <div
                    key={f.path}
                    onClick={() => setEditingEnvironment(editKey)}
                    className={`group flex items-center gap-1.5 px-3 py-1 cursor-pointer transition-colors text-xs ${
                      editingEnvironmentName === editKey
                        ? 'bg-bg-muted text-text-primary'
                        : 'text-text-secondary hover:bg-bg-muted/50'
                    }`}
                    title={f.path}
                  >
                    <Icons.FileText size={11} className="text-text-muted shrink-0" />
                    <span className="truncate flex-1 min-w-0 font-mono">{filename}</span>
                    {hasConflict && (
                      <span
                        className="text-warning shrink-0"
                        title="Key conflict with selected environment"
                      >
                        <Icons.AlertCircle size={11} />
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveDotEnvFile(f.path)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-text-muted hover:text-error transition-all"
                      title="Remove"
                    >
                      <Icons.X size={11} />
                    </button>
                  </div>
                )
              })}
              {dotEnvFiles.length === 0 && (
                <div className="px-3 py-1.5 text-[10px] text-text-muted">No .env files added</div>
              )}
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
        existingNames={environments.map((e) => e.name)}
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

export default EnvironmentsTab
