import React, { useState, useMemo } from 'react'
import * as Icons from '../ui/Icons'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { toast } from '../../stores/toastStore'
import VariableEditor from '../composer/VariableEditor'
import type { Variable } from '../../bindings'

interface EnvironmentEditorProps {
  environment: { name: string; variables: Variable[] }
  onSave: (variables: Variable[]) => Promise<void>
  onDelete: (name: string) => Promise<void>
}

const EnvironmentEditor: React.FC<EnvironmentEditorProps> = ({ environment, onSave, onDelete }) => {
  const [localVariables, setLocalVariables] = useState<Variable[]>(environment.variables)
  const [isDirty, setIsDirty] = useState(false)

  const handleSave = async () => {
    await onSave(localVariables)
    setIsDirty(false)
  }

  const handleReset = () => {
    setLocalVariables(environment.variables)
    setIsDirty(false)
  }

  const handleVariablesChange = (vars: Variable[]) => {
    setLocalVariables(vars)
    setIsDirty(true)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-bg-surface">
      {/* Toolbar */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-border-subtle shrink-0 bg-bg-base/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">{environment.name}</span>
          <Icons.Edit
            size={12}
            className="text-text-muted cursor-pointer hover:text-text-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors">
            <Icons.Search size={14} />
          </button>
          <button className="p-1.5 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors">
            <Icons.Edit size={14} />
          </button>
          <button className="p-1.5 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors">
            <Icons.Copy size={14} />
          </button>
          <button
            onClick={() => onDelete(environment.name)}
            className="p-1.5 hover:bg-bg-muted rounded-md text-text-muted hover:text-error transition-colors"
          >
            <Icons.Trash size={14} />
          </button>
        </div>
      </div>

      {/* Variable Table Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <VariableEditor variables={localVariables} onChange={handleVariablesChange} title="" />
      </div>

      {/* Action Buttons */}
      <div className="h-12 px-4 border-t border-border-subtle flex items-center gap-3 bg-bg-base/30 shrink-0">
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all shadow-sm ${
            isDirty
              ? 'bg-accent text-accent-fg hover:bg-accent-hover'
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
    </div>
  )
}

const EnvironmentsTab: React.FC = () => {
  const {
    environments,
    editingEnvironmentName,
    setEditingEnvironment,
    activeEnvironmentName,
    updateVariables,
    deleteEnvironment,
  } = useEnvironmentStore()

  const [searchQuery, setSearchQuery] = useState('')

  const selectedEnv = useMemo(() => {
    return environments.find((e) => e.name === editingEnvironmentName)
  }, [environments, editingEnvironmentName])

  const filteredEnvironments = environments.filter((env) =>
    env.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = async () => {
    const name = window.prompt('Enter environment name:')
    if (name) {
      if (environments.find((e) => e.name === name)) {
        toast.error('Environment already exists')
        return
      }
      await updateVariables(name, [])
      setEditingEnvironment(name)
    }
  }

  const handleDelete = async (name: string) => {
    if (window.confirm(`Are you sure you want to delete environment "${name}"?`)) {
      await deleteEnvironment(name)
    }
  }

  return (
    <div className="flex h-full bg-bg-base overflow-hidden">
      {/* Left Pane - Environments List */}
      <div className="w-64 border-r border-border-subtle flex flex-col shrink-0 bg-bg-panel/50">
        <div className="h-10 px-4 flex items-center justify-between border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Icons.ChevronDown size={14} className="text-text-muted" />
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Environments
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCreate}
              className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
              title="Add Environment"
            >
              <Icons.Plus size={14} />
            </button>
            <button
              className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
              title="Import"
            >
              <Icons.Download size={14} />
            </button>
            <button
              className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
              title="Export"
            >
              <Icons.Upload size={14} />
            </button>
          </div>
        </div>

        <div className="p-2 border-b border-border-subtle">
          <div className="relative">
            <Icons.Search
              size={12}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search environments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-2 bg-bg-surface border border-border-default rounded-md text-sm focus:border-accent focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {filteredEnvironments.map((env) => (
            <div
              key={env.name}
              onClick={() => setEditingEnvironment(env.name)}
              className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${
                editingEnvironmentName === env.name ? 'bg-bg-muted' : 'hover:bg-bg-muted/50'
              }`}
            >
              <span
                className={`text-sm truncate ${
                  editingEnvironmentName === env.name
                    ? 'text-text-primary font-medium'
                    : 'text-text-secondary'
                }`}
              >
                {env.name}
              </span>
              <div className="flex items-center gap-1">
                {activeEnvironmentName === env.name && (
                  <Icons.Check size={14} className="text-success" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(env.name)
                  }}
                  className="p-1 opacity-0 group-hover:opacity-100 text-text-muted hover:text-error transition-all"
                >
                  <Icons.Trash size={12} />
                </button>
              </div>
            </div>
          ))}
          {filteredEnvironments.length === 0 && (
            <div className="px-4 py-8 text-center text-xs text-text-muted">
              No environments found
            </div>
          )}
        </div>
      </div>

      {/* Right Pane - Variables Editor */}
      <div className="flex-1 flex flex-col overflow-hidden bg-bg-surface">
        {selectedEnv ? (
          <EnvironmentEditor
            key={selectedEnv.name}
            environment={selectedEnv}
            onSave={(vars) => updateVariables(selectedEnv.name, vars)}
            onDelete={handleDelete}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center select-none p-8">
            <div className="text-text-muted opacity-10 mb-4">
              <Icons.Globe size={80} strokeWidth={1} />
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">
              No environment selected
            </h3>
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
        )}
      </div>
    </div>
  )
}

export default EnvironmentsTab
