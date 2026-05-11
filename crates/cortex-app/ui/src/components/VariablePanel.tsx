import React, { useState, useEffect } from 'react'
import {
  Plus,
  Trash2,
  X,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Monitor,
  AlertCircle,
  FilePlus,
} from 'lucide-react'
import { useCallback } from 'react'
import { commands, type Variable, type VariableScope, type EnvironmentFile } from '../bindings'
import { cn } from '../lib/utils'

interface VariablePanelProps {
  workspacePath: string | null
  workspaceName: string
  loadedCollections: Record<
    string,
    { name: string; path: string; variables: Variable[]; environments: EnvironmentFile[] }
  >
  onClose: () => void
  onUpdate: () => void
  initialTab?: VariableScope
}

type TabType = 'global' | 'collection' | 'environment'

export const VariablePanel: React.FC<VariablePanelProps> = ({
  workspacePath,
  workspaceName,
  loadedCollections,
  onClose,
  onUpdate,
  initialTab = 'global',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab as TabType)
  const [selectedCollectionPath, setSelectedCollectionPath] = useState<string | null>(
    Object.keys(loadedCollections)[0] || null
  )
  const [selectedEnvironmentName, setSelectedEnvironmentName] = useState<string | null>(null)

  const [variables, setVariables] = useState<Variable[]>([])
  const [revealSecrets, setRevealSecrets] = useState<Record<number, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isCreatingEnv, setIsCreatingEnv] = useState(false)
  const [newEnvName, setNewEnvName] = useState('')

  // Sync selectedCollectionPath if it's null and loadedCollections is now available
  useEffect(() => {
    if (!selectedCollectionPath && Object.keys(loadedCollections).length > 0) {
      const firstPath = Object.keys(loadedCollections)[0]
      setTimeout(() => setSelectedCollectionPath(firstPath), 0)
    }
  }, [loadedCollections, selectedCollectionPath])

  // Helper to fetch/sync variables
  const syncVariables = useCallback(async () => {
    if (activeTab === 'global' && workspacePath) {
      const res = await commands.loadWorkspace(workspacePath)
      if (res.status === 'ok') {
        setVariables(res.data.variables || [])
      }
    } else if (activeTab === 'collection' && selectedCollectionPath) {
      const res = await commands.loadCollection(selectedCollectionPath)
      if (res.status === 'ok') {
        setVariables(res.data.manifest.variables || [])
      }
    } else if (activeTab === 'environment' && selectedCollectionPath) {
      // If no environment is selected but some are available, select the first one
      let envName = selectedEnvironmentName
      if (!envName) {
        const environments = loadedCollections[selectedCollectionPath]?.environments || []
        if (environments.length > 0) {
          envName = environments[0].name
          setSelectedEnvironmentName(envName)
        }
      }

      if (envName) {
        const res = await commands.loadCollection(selectedCollectionPath)
        if (res.status === 'ok') {
          const env = res.data.environments.find((e) => e.name === envName)
          setVariables(env?.variables || [])
        }
      } else {
        setVariables([])
      }
    }
  }, [activeTab, workspacePath, selectedCollectionPath, selectedEnvironmentName, loadedCollections])

  useEffect(() => {
    let active = true
    const load = async () => {
      await syncVariables()
      if (active) {
        // We could set a loaded state here if we had one
      }
    }
    load()
    return () => {
      active = false
    }
  }, [syncVariables])

  const handleAdd = () => {
    setVariables([...variables, { name: '', value: '', secret: false, enabled: true }])
  }

  const handleRemove = (index: number) => {
    const newVars = variables.filter((_, i) => i !== index)
    setVariables(newVars)
    saveVariables(newVars)
  }

  const handleChange = (index: number, field: keyof Variable, val: string | boolean) => {
    const newVars = [...variables]
    newVars[index] = { ...newVars[index], [field]: val }
    setVariables(newVars)
    // Debounce save? The requirements say "immediately".
    saveVariables(newVars)
  }

  const saveVariables = async (varsToSave: Variable[]) => {
    setIsSaving(true)
    try {
      if (activeTab === 'global' && workspacePath) {
        await commands.updateWorkspaceVariables(workspacePath, varsToSave)
      } else if (activeTab === 'collection' && selectedCollectionPath) {
        await commands.updateCollectionVariables(selectedCollectionPath, varsToSave)
      } else if (activeTab === 'environment' && selectedCollectionPath && selectedEnvironmentName) {
        await commands.updateEnvironmentVariables(
          selectedCollectionPath,
          selectedEnvironmentName,
          varsToSave
        )
      }
      onUpdate()
    } catch (e) {
      console.error('Failed to save variables:', e)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleReveal = (index: number) => {
    setRevealSecrets((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Variable Management
              {isSaving && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              {workspaceName} • {activeTab} Scope
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation & Selection */}
        <div className="flex items-center gap-4 px-6 py-4 bg-slate-950/30 border-b border-slate-800/50">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <TabButton
              active={activeTab === 'global'}
              onClick={() => setActiveTab('global')}
              icon={<Globe className="w-3.5 h-3.5" />}
              label="Global"
            />
            <TabButton
              active={activeTab === 'collection'}
              onClick={() => setActiveTab('collection')}
              icon={<Layers className="w-3.5 h-3.5" />}
              label="Collection"
            />
            <TabButton
              active={activeTab === 'environment'}
              onClick={() => setActiveTab('environment')}
              icon={<Monitor className="w-3.5 h-3.5" />}
              label="Environment"
            />
          </div>

          {(activeTab === 'collection' || activeTab === 'environment') && (
            <select
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={selectedCollectionPath || ''}
              onChange={(e) => {
                setSelectedCollectionPath(e.target.value)
                setSelectedEnvironmentName(null)
              }}
            >
              {Object.keys(loadedCollections).length === 0 && (
                <option value="" disabled>
                  No collections loaded
                </option>
              )}
              {Object.values(loadedCollections).map((c) => (
                <option key={c.path} value={c.path}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {activeTab === 'environment' && selectedCollectionPath && (
            <div className="flex items-center gap-2">
              <select
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all min-w-[150px]"
                value={selectedEnvironmentName || ''}
                onChange={(e) => setSelectedEnvironmentName(e.target.value)}
              >
                <option value="" disabled>
                  {loadedCollections[selectedCollectionPath]?.environments?.length > 0
                    ? 'Select Environment'
                    : 'No Environments'}
                </option>
                {loadedCollections[selectedCollectionPath]?.environments?.map((e) => (
                  <option key={e.name} value={e.name}>
                    {e.name}
                  </option>
                ))}
              </select>
              {isCreatingEnv ? (
                <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
                  <input
                    autoFocus
                    className="bg-slate-950 border border-blue-500/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-32 shadow-lg shadow-blue-500/10"
                    placeholder="env name..."
                    value={newEnvName}
                    onChange={(e) => setNewEnvName(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        const name = newEnvName.trim()
                        if (name && selectedCollectionPath) {
                          try {
                            const res = await commands.updateEnvironmentVariables(
                              selectedCollectionPath,
                              name,
                              []
                            )
                            if (res.status === 'ok') {
                              setSelectedEnvironmentName(name)
                              setIsCreatingEnv(false)
                              setNewEnvName('')
                              onUpdate()
                            } else {
                              alert(`Failed to create environment: ${res.error}`)
                            }
                          } catch (err) {
                            alert(`IPC Error: ${err}`)
                          }
                        }
                      } else if (e.key === 'Escape') {
                        setIsCreatingEnv(false)
                        setNewEnvName('')
                      }
                    }}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <button
                    onClick={() => {
                      setIsCreatingEnv(false)
                      setNewEnvName('')
                    }}
                    className="p-1.5 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreatingEnv(true)}
                  className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                  title="Create New Environment"
                >
                  <FilePlus className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {variables.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl group hover:border-slate-700 transition-colors">
              <AlertCircle className="w-8 h-8 text-slate-700 mx-auto mb-4 group-hover:text-slate-600 transition-colors" />
              <p className="text-sm text-slate-500 italic">No variables defined in this scope.</p>
              <button
                onClick={handleAdd}
                className="mt-4 text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
              >
                Create your first variable
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_2fr_80px_60px_40px] gap-4 px-4 pb-2 border-b border-slate-800/50">
                <HeaderLabel label="Key Name" />
                <HeaderLabel label="Current Value" />
                <HeaderLabel label="Secret" className="text-center" />
                <HeaderLabel label="Enabled" className="text-center" />
                <div />
              </div>
              <div className="space-y-2">
                {variables.map((v, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1fr_2fr_80px_60px_40px] gap-4 items-center group animate-in slide-in-from-left-2 duration-200"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <input
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      placeholder="VAR_NAME"
                      value={v.name}
                      onChange={(e) => handleChange(idx, 'name', e.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                    <div className="relative group/value">
                      <input
                        type={v.secret && !revealSecrets[idx] ? 'password' : 'text'}
                        className={cn(
                          'w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono transition-all pr-10',
                          v.secret && !revealSecrets[idx]
                            ? 'text-slate-500 tracking-[0.3em]'
                            : 'text-white'
                        )}
                        placeholder="value"
                        value={v.value}
                        onChange={(e) => handleChange(idx, 'value', e.target.value)}
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                      {v.secret && (
                        <button
                          onClick={() => toggleReveal(idx)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-600 hover:text-slate-300 transition-colors"
                        >
                          {revealSecrets[idx] ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleChange(idx, 'secret', !v.secret)}
                        className={cn(
                          'p-2 rounded-xl border transition-all',
                          v.secret
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                            : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'
                        )}
                        title={v.secret ? 'Unmark as secret' : 'Mark as secret'}
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleChange(idx, 'enabled', !v.enabled)}
                        className={cn(
                          'relative w-10 h-5 rounded-full transition-all duration-300',
                          v.enabled ? 'bg-blue-600' : 'bg-slate-800'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300',
                            v.enabled ? 'translate-x-5' : 'translate-x-0'
                          )}
                        />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(idx)}
                      className="p-2 text-slate-700 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            className="mt-6 flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-500 hover:text-blue-400 hover:bg-blue-500/5 rounded-xl uppercase tracking-widest transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Variable
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all shadow-lg"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  )
}

const TabButton: React.FC<{
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
      active ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
    )}
  >
    {icon}
    {label}
  </button>
)

const HeaderLabel: React.FC<{ label: string; className?: string }> = ({ label, className }) => (
  <span className={cn('text-[10px] font-bold text-slate-600 uppercase tracking-widest', className)}>
    {label}
  </span>
)
