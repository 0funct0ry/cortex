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
  Shield,
  Zap,
  Terminal,
  Code,
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
  initialTab?: VariableScope | 'session'
  globalVariables: Variable[]
  ephemeralVariables: Variable[]
  /**
   * Called whenever the user changes the active environment selection.
   * Both the owning collection path and the environment name are surfaced so
   * the caller can load environment variables even when no collection-specific
   * tab is active (e.g. a scratch tab).
   */
  onEnvironmentChange?: (collectionPath: string | null, envName: string | null) => void
}

type TabType = 'global' | 'collection' | 'environment' | 'session'

export const VariablePanel: React.FC<VariablePanelProps> = ({
  workspacePath,
  workspaceName,
  loadedCollections,
  onClose,
  onUpdate,
  initialTab = 'global',
  globalVariables,
  ephemeralVariables,
  onEnvironmentChange,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab as TabType)
  const [selectedCollectionPath, setSelectedCollectionPath] = useState<string | null>(
    Object.keys(loadedCollections)[0] || null
  )
  const [selectedEnvironmentName, setSelectedEnvironmentName] = useState<string | null>(null)

  const [variables, setVariables] = useState<Variable[]>([])
  const [dirtyScopes, setDirtyScopes] = useState<Record<string, Variable[]>>({})
  const [revealSecrets, setRevealSecrets] = useState<Record<number, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isCreatingEnv, setIsCreatingEnv] = useState(false)
  const [newEnvName, setNewEnvName] = useState('')

  const [jsonMode, setJsonMode] = useState<Record<number, boolean>>({})
  const [jsonBuffers, setJsonBuffers] = useState<Record<number, string>>({})
  const [jsonErrors, setJsonErrors] = useState<Record<number, string | null>>({})

  const getScopeKey = useCallback(() => {
    if (activeTab === 'global') return 'global'
    if (activeTab === 'collection') return `col:${selectedCollectionPath}`
    if (activeTab === 'environment')
      return `env:${selectedCollectionPath}:${selectedEnvironmentName}`
    if (activeTab === 'session') return 'session'
    return ''
  }, [activeTab, selectedCollectionPath, selectedEnvironmentName])

  // Sync selectedCollectionPath if it's null and loadedCollections is now available
  useEffect(() => {
    if (!selectedCollectionPath && Object.keys(loadedCollections).length > 0) {
      const firstPath = Object.keys(loadedCollections)[0]
      setTimeout(() => setSelectedCollectionPath(firstPath), 0)
    }
  }, [loadedCollections, selectedCollectionPath])

  // Notify parent whenever the effective active environment changes.
  // Selecting an environment in the Environment tab immediately activates it.
  useEffect(() => {
    if (!onEnvironmentChange) return
    if (activeTab === 'environment') {
      onEnvironmentChange(selectedCollectionPath ?? null, selectedEnvironmentName ?? null)
    }
  }, [activeTab, selectedCollectionPath, selectedEnvironmentName, onEnvironmentChange])

  // Helper to fetch/sync variables for the active scope
  const syncVariables = useCallback(async () => {
    const key = getScopeKey()
    if (dirtyScopes[key]) {
      setVariables(dirtyScopes[key])
      return
    }

    if (activeTab === 'global') {
      setVariables(globalVariables || [])
    } else if (activeTab === 'session') {
      setVariables(ephemeralVariables || [])
    } else if (activeTab === 'collection') {
      if (!selectedCollectionPath) {
        setVariables([])
      } else {
        const col = loadedCollections[selectedCollectionPath]
        if (col) {
          setVariables(col.variables || [])
        } else {
          const res = await commands.loadCollectionManifest(selectedCollectionPath)
          if (res.status === 'ok') {
            setVariables(res.data.manifest.variables || [])
          }
        }
      }
    } else if (activeTab === 'environment') {
      if (!selectedCollectionPath) {
        setVariables([])
        return
      }
      const col = loadedCollections[selectedCollectionPath]
      let envName = selectedEnvironmentName

      if (!envName && col && col.environments.length > 0) {
        envName = col.environments[0].name
        setSelectedEnvironmentName(envName)
      }

      if (envName) {
        if (col) {
          const env = col.environments.find((e) => e.name === envName)
          setVariables(env?.variables || [])
        } else {
          const res = await commands.loadCollectionManifest(selectedCollectionPath)
          if (res.status === 'ok') {
            const env = res.data.environments.find((e) => e.name === envName)
            setVariables(env?.variables || [])
          }
        }
      } else {
        setVariables([])
      }
    }
  }, [
    activeTab,
    globalVariables,
    ephemeralVariables,
    selectedCollectionPath,
    selectedEnvironmentName,
    loadedCollections,
    getScopeKey,
    dirtyScopes,
  ])

  useEffect(() => {
    let active = true
    const load = async () => {
      await syncVariables()
      if (active) {
        // loaded
      }
    }
    load()
    return () => {
      active = false
    }
  }, [syncVariables])

  const updateLocal = (newVars: Variable[]) => {
    setVariables(newVars)
    setDirtyScopes((prev) => ({
      ...prev,
      [getScopeKey()]: newVars,
    }))
  }

  const isPromptTab = activeTab === 'collection' || activeTab === 'environment'

  const handleAdd = () => {
    updateLocal([
      ...variables,
      { name: '', value: '', secret: false, enabled: true, prompt: false, description: null },
    ])
  }

  const handleRemove = (index: number) => {
    updateLocal(variables.filter((_, i) => i !== index))
  }

  const handleChange = <K extends keyof Variable>(index: number, field: K, val: Variable[K]) => {
    const newVars = [...variables]
    newVars[index] = { ...newVars[index], [field]: val }
    updateLocal(newVars)
  }

  const isRowJsonMode = (idx: number, val: unknown): boolean => {
    if (jsonMode[idx] !== undefined) {
      return jsonMode[idx]
    }
    return typeof val === 'object' && val !== null
  }

  const toggleJsonMode = (idx: number, val: unknown) => {
    const currentMode = isRowJsonMode(idx, val)
    const newMode = !currentMode
    setJsonMode((prev) => ({ ...prev, [idx]: newMode }))

    if (newMode) {
      const strVal =
        val === null ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)
      setJsonBuffers((prev) => ({ ...prev, [idx]: strVal }))
      try {
        if (strVal.trim()) {
          JSON.parse(strVal)
        }
        setJsonErrors((prev) => ({ ...prev, [idx]: null }))
      } catch (err) {
        setJsonErrors((prev) => ({ ...prev, [idx]: (err as Error).message }))
      }
    } else {
      const strVal =
        jsonBuffers[idx] !== undefined
          ? jsonBuffers[idx]
          : val === null
            ? ''
            : typeof val === 'object'
              ? JSON.stringify(val)
              : String(val)
      setJsonBuffers((prev) => {
        const next = { ...prev }
        delete next[idx]
        return next
      })
      setJsonErrors((prev) => {
        const next = { ...prev }
        delete next[idx]
        return next
      })
      handleChange(idx, 'value', strVal)
    }
  }

  const handleJsonBufferChange = (idx: number, newStr: string) => {
    setJsonBuffers((prev) => ({ ...prev, [idx]: newStr }))
    try {
      if (!newStr.trim()) {
        setJsonErrors((prev) => ({ ...prev, [idx]: null }))
        handleChange(idx, 'value', '')
        return
      }
      const parsed = JSON.parse(newStr)
      setJsonErrors((prev) => ({ ...prev, [idx]: null }))
      handleChange(idx, 'value', parsed)
    } catch (err) {
      setJsonErrors((prev) => ({ ...prev, [idx]: (err as Error).message }))
      handleChange(idx, 'value', newStr)
    }
  }

  const getDisplayValue = (idx: number, val: unknown): string => {
    if (jsonBuffers[idx] !== undefined) {
      return jsonBuffers[idx]
    }
    if (val === null) return ''
    if (typeof val === 'object') {
      return JSON.stringify(val, null, 2)
    }
    return String(val ?? '')
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    try {
      for (const [key, vars] of Object.entries(dirtyScopes)) {
        let res: { status: string; error?: unknown } | null = null

        if (key === 'global' && workspacePath) {
          res = await commands.updateWorkspaceVariables(workspacePath, vars)
        } else if (key === 'session') {
          // Ephemeral vars are pushed to Tauri managed state — never written to disk.
          await commands.setEphemeralVariables(vars)
        } else if (key.startsWith('col:')) {
          const path = key.substring(4)
          res = await commands.updateCollectionVariables(path, vars)
        } else if (key.startsWith('env:')) {
          // Split on the last colon so paths with colons (Windows) still work.
          const withoutPrefix = key.substring(4)
          const lastColon = withoutPrefix.lastIndexOf(':')
          if (lastColon === -1) continue
          const path = withoutPrefix.substring(0, lastColon)
          const envName = withoutPrefix.substring(lastColon + 1)
          res = await commands.updateEnvironmentVariables(path, envName, vars)
        } else {
          continue
        }

        if (res && res.status === 'error') {
          throw new Error(String(res.error))
        }
      }

      onUpdate()
      onClose()
    } catch (e) {
      console.error('Failed to save variables:', e)
      alert(`Failed to save: ${e}`)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleReveal = (index: number) => {
    setRevealSecrets((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  // Count of active (enabled) ephemeral variables for the badge
  const activeEphemeralCount = ephemeralVariables.filter((v) => v.enabled).length
  // Account for in-session edits not yet saved
  const dirtySessionVars = dirtyScopes['session']
  const displayEphemeralCount =
    dirtySessionVars !== undefined
      ? dirtySessionVars.filter((v) => v.enabled).length
      : activeEphemeralCount

  const isSessionTab = activeTab === 'session'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Variable Management
              {isSaving && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
              {displayEphemeralCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-full">
                  <Zap className="w-2.5 h-2.5" />
                  {displayEphemeralCount} session
                </span>
              )}
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
            <TabButton
              active={activeTab === 'session'}
              onClick={() => setActiveTab('session')}
              icon={<Zap className="w-3.5 h-3.5" />}
              label="Session"
              variant="session"
              badge={displayEphemeralCount > 0 ? displayEphemeralCount : undefined}
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
                onChange={(e) => {
                  setSelectedEnvironmentName(e.target.value)
                  onEnvironmentChange?.(selectedCollectionPath ?? null, e.target.value || null)
                }}
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

        {/* Session tab callout banner */}
        {isSessionTab && (
          <div className="mx-6 mt-4 flex items-start gap-3 px-4 py-3 bg-amber-500/8 border border-amber-500/20 rounded-2xl">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-400">Session Variables</p>
              <p className="text-[10px] text-amber-400/70 mt-0.5 leading-relaxed">
                These variables exist only for the current session and are{' '}
                <strong>never written to disk</strong>. They override all other scopes and disappear
                when Cortex is closed. Scripts can also create session variables at runtime.
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {variables.length === 0 ? (
            <div
              className={cn(
                'py-20 text-center border-2 border-dashed rounded-3xl group transition-colors',
                isSessionTab
                  ? 'border-amber-800/40 hover:border-amber-700/50'
                  : 'border-slate-800 hover:border-slate-700'
              )}
            >
              <AlertCircle
                className={cn(
                  'w-8 h-8 mx-auto mb-4 transition-colors',
                  isSessionTab
                    ? 'text-amber-800 group-hover:text-amber-700'
                    : 'text-slate-700 group-hover:text-slate-600'
                )}
              />
              <p className="text-sm text-slate-500 italic">
                {isSessionTab
                  ? 'No session variables active.'
                  : 'No variables defined in this scope.'}
              </p>
              <button
                onClick={handleAdd}
                className={cn(
                  'mt-4 text-xs font-bold uppercase tracking-widest transition-colors',
                  isSessionTab
                    ? 'text-amber-500 hover:text-amber-400'
                    : 'text-blue-500 hover:text-blue-400'
                )}
              >
                {isSessionTab ? 'Create your first session variable' : 'Create your first variable'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={cn(
                  'grid gap-4 px-4 pb-2 border-b border-slate-800/50',
                  isPromptTab
                    ? 'grid-cols-[1fr_2fr_80px_80px_60px_40px]'
                    : 'grid-cols-[1fr_2fr_80px_60px_40px]'
                )}
              >
                <HeaderLabel label="Key Name" />
                <HeaderLabel label="Current Value" />
                <HeaderLabel label="Secret" className="text-center" />
                {isPromptTab && <HeaderLabel label="Prompt" className="text-center" />}
                <HeaderLabel label="Enabled" className="text-center" />
                <div />
              </div>
              <div className="space-y-2">
                {variables.map((v, idx) => {
                  const isJson = isRowJsonMode(idx, v.value)
                  return (
                    <div
                      key={idx}
                      className={cn(
                        'grid gap-4 items-start group animate-in slide-in-from-left-2 duration-200',
                        isPromptTab
                          ? 'grid-cols-[1fr_2fr_80px_80px_60px_40px]'
                          : 'grid-cols-[1fr_2fr_80px_60px_40px]',
                        (isSessionTab || (isPromptTab && v.prompt)) && 'relative pl-2'
                      )}
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* Amber left stripe for session variables */}
                      {isSessionTab && (
                        <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-amber-500/50 rounded-full" />
                      )}
                      {/* Indigo left stripe for prompt variables */}
                      {isPromptTab && v.prompt && (
                        <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-indigo-500/60 rounded-full" />
                      )}
                      {/* Name cell — stacks description input below when prompt is active */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block h-4">
                            {/* Alignment spacer */}
                          </span>
                        </div>
                        <input
                          className={cn(
                            'w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-slate-700 focus:outline-none focus:ring-2 transition-all',
                            isSessionTab
                              ? 'border-amber-800/40 focus:ring-amber-500/30 focus:border-amber-600/50'
                              : isPromptTab && v.prompt
                                ? 'border-indigo-800/40 focus:ring-indigo-500/30 focus:border-indigo-600/50'
                                : 'border-slate-800 focus:ring-blue-500/50'
                          )}
                          placeholder="VAR_NAME"
                          value={v.name}
                          onChange={(e) => handleChange(idx, 'name', e.target.value)}
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                        />
                        {isPromptTab && v.prompt && (
                          <input
                            className="w-full bg-slate-950 border border-indigo-800/30 rounded-xl px-4 py-2 text-xs text-slate-400 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600/40 transition-all mt-0.5"
                            placeholder="Hint shown in prompt dialog (optional)"
                            value={v.description ?? ''}
                            onChange={(e) =>
                              handleChange(idx, 'description', e.target.value || null)
                            }
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                          />
                        )}
                      </div>
                      <div className="relative group/value flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block h-4 flex items-center">
                            Value {isJson ? '(JSON)' : '(String)'}
                          </span>
                          <button
                            onClick={() => toggleJsonMode(idx, v.value)}
                            className={cn(
                              'px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-all border flex items-center gap-1',
                              isJson
                                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20'
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                            )}
                            title={isJson ? 'Switch to String mode' : 'Switch to JSON mode'}
                          >
                            <Code className="w-3 h-3" />
                            {isJson ? 'JSON' : 'String'}
                          </button>
                        </div>
                        {isJson ? (
                          <div className="relative">
                            <textarea
                              className={cn(
                                'w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 transition-all custom-scrollbar resize-y min-h-[80px]',
                                jsonErrors[idx]
                                  ? 'border-red-500/50 focus:ring-red-500/20'
                                  : isSessionTab
                                    ? 'border-amber-800/40 focus:ring-amber-500/30'
                                    : isPromptTab && v.prompt
                                      ? 'border-indigo-800/40 focus:ring-indigo-500/30'
                                      : 'border-slate-800 focus:ring-purple-500/50'
                              )}
                              placeholder="{\n  &#34;key&#34;: &#34;value&#34;\n}"
                              value={getDisplayValue(idx, v.value)}
                              onChange={(e) => handleJsonBufferChange(idx, e.target.value)}
                              autoCapitalize="none"
                              autoCorrect="off"
                              spellCheck={false}
                            />
                            {jsonErrors[idx] && (
                              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span className="truncate">{jsonErrors[idx]}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="relative">
                            <input
                              type={v.secret && !revealSecrets[idx] ? 'password' : 'text'}
                              className={cn(
                                'w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm font-mono transition-all pr-10',
                                v.secret && !revealSecrets[idx]
                                  ? 'text-slate-500 tracking-[0.3em]'
                                  : 'text-white',
                                isSessionTab
                                  ? 'border-amber-800/40 focus:ring-amber-500/30 focus:border-amber-600/50 focus:outline-none focus:ring-2'
                                  : isPromptTab && v.prompt
                                    ? 'border-indigo-800/40 focus:ring-indigo-500/30 focus:border-indigo-600/50 focus:outline-none focus:ring-2'
                                    : 'border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                              )}
                              placeholder={
                                v.prompt ? 'default value (pre-filled in dialog)' : 'value'
                              }
                              value={getDisplayValue(idx, v.value)}
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
                        )}
                      </div>
                      <div className="flex justify-center pt-6">
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
                          <Shield className="w-4 h-4" />
                        </button>
                      </div>
                      {isPromptTab && (
                        <div className="flex justify-center pt-6">
                          <button
                            onClick={() => handleChange(idx, 'prompt', !v.prompt)}
                            className={cn(
                              'p-2 rounded-xl border transition-all',
                              v.prompt
                                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'
                            )}
                            title={
                              v.prompt
                                ? 'Remove prompt — value will not be asked at run time'
                                : 'Mark as prompt — user will be asked for a value before each run'
                            }
                          >
                            <Terminal className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <div className="flex justify-center pt-6">
                        <button
                          onClick={() => handleChange(idx, 'enabled', !v.enabled)}
                          className={cn(
                            'relative w-10 h-5 rounded-full transition-all duration-300',
                            v.enabled
                              ? isSessionTab
                                ? 'bg-amber-500'
                                : isPromptTab && v.prompt
                                  ? 'bg-indigo-600'
                                  : 'bg-blue-600'
                              : 'bg-slate-800'
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
                      <div className="pt-6">
                        <button
                          onClick={() => handleRemove(idx)}
                          className="p-2 text-slate-700 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            className={cn(
              'mt-6 flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl uppercase tracking-widest transition-all',
              isSessionTab
                ? 'text-amber-500 hover:text-amber-400 hover:bg-amber-500/5'
                : 'text-blue-500 hover:text-blue-400 hover:bg-blue-500/5'
            )}
          >
            <Plus className="w-3.5 h-3.5" /> Add{isSessionTab ? ' Session' : ' New'} Variable
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-900/50">
          {isSessionTab ? (
            <p className="text-[10px] text-amber-500/60 flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              Session variables are never saved to disk and clear on restart.
            </p>
          ) : (
            <div />
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className={cn(
                'px-8 py-2.5 text-xs font-bold text-white rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2',
                isSessionTab
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
              )}
            >
              {isSaving ? 'Saving...' : isSessionTab ? 'Apply to Session' : 'Save Changes'}
            </button>
          </div>
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
  variant?: 'default' | 'session'
  badge?: number
}> = ({ active, onClick, icon, label, variant = 'default', badge }) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all relative',
      active
        ? variant === 'session'
          ? 'bg-amber-500/15 text-amber-400 shadow-xl'
          : 'bg-slate-800 text-white shadow-xl'
        : variant === 'session'
          ? 'text-amber-600 hover:text-amber-400'
          : 'text-slate-500 hover:text-slate-300'
    )}
  >
    {icon}
    {label}
    {badge !== undefined && (
      <span className="ml-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-black bg-amber-500/30 text-amber-400 rounded-full">
        {badge}
      </span>
    )}
  </button>
)

const HeaderLabel: React.FC<{ label: string; className?: string }> = ({ label, className }) => (
  <span className={cn('text-[10px] font-bold text-slate-600 uppercase tracking-widest', className)}>
    {label}
  </span>
)
