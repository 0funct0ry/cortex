import { useState, useEffect, useCallback } from 'react'
import {
  commands,
  type WorkspaceResponse,
  type Collection,
  type RequestFileWrapper,
} from './bindings'
import { CollectionExplorer, SuccessToast } from './components/CollectionExplorer'
import { ErrorToast } from './components/CollectionExplorer'
import { AlertCircle, Loader2, X, Plus, ChevronRight, ChevronDown } from 'lucide-react'
import { Shell } from './components/shell/Shell'
import { TopBar } from './components/shell/TopBar'
import { Sidebar } from './components/shell/Sidebar'
import { TabBar, type Tab } from './components/shell/TabBar'
import { Composer } from './components/shell/Composer'
import { VariablePanel } from './components/VariablePanel'
import { Database } from 'lucide-react'
import { type EnvironmentFile, type Variable } from './bindings'

// Simple modal for workspace name
const NameModal: React.FC<{
  isOpen: boolean
  title: string
  label: string
  onClose: () => void
  onConfirm: (name: string) => void
}> = ({ isOpen, title, label, onClose, onConfirm }) => {
  const [name, setName] = useState('')
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-bold">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {label}
          </label>
          <input
            autoFocus
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. My Projects"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) onConfirm(name.trim())
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-2"
          >
            <Plus className="w-3 h-3" /> Continue
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null)
  const [workspacePath, setWorkspacePath] = useState<string | null>(null)
  const [loadedCollections, setLoadedCollections] = useState<Record<string, Collection>>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [modalType, setModalType] = useState<'workspace' | 'collection' | null>(null)

  // Shell & Tab State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'scratch-1', name: 'Untitled', method: 'GET', isScratch: true },
  ])
  const [activeTabId, setActiveTabId] = useState<string | null>('scratch-1')
  const [showVariablePanel, setShowVariablePanel] = useState(false)
  const [variablePanelTab, setVariablePanelTab] = useState<'global' | 'collection' | 'environment'>(
    'global'
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        setIsSidebarOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelectRequest = (req: RequestFileWrapper) => {
    const existingTab = tabs.find((t) => t.path === req.path)
    if (existingTab) {
      setActiveTabId(existingTab.id)
    } else {
      const newTab: Tab = {
        id: crypto.randomUUID(),
        name: req.name,
        method: req.content?.method || 'GET',
        path: req.path,
      }
      setTabs((prev) => [...prev, newTab])
      setActiveTabId(newTab.id)
    }
  }

  const handleCloseTab = (id: string) => {
    const newTabs = tabs.filter((t) => t.id !== id)
    setTabs(newTabs)
    if (activeTabId === id) {
      setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null)
    }
  }

  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({})

  const toggleCollection = async (path: string) => {
    const isExpanding =
      expandedCollections[path] === false || expandedCollections[path] === undefined
    setExpandedCollections((prev) => ({
      ...prev,
      [path]: isExpanding,
    }))

    if (isExpanding && !loadedCollections[path]) {
      handleRefreshCollection(path)
    }
  }

  const loadWorkspace = useCallback(async (path: string) => {
    setError(null)
    try {
      const res = await commands.loadWorkspace(path)
      if (res.status === 'ok') {
        setWorkspace(res.data)
        setWorkspacePath(path)
      } else {
        setError(`Failed to load workspace: ${res.error}`)
      }
    } catch (e) {
      setError(`IPC Error: ${e}`)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      const lastPath = await commands.getLastWorkspacePath()
      if (lastPath) {
        loadWorkspace(lastPath)
      }
    }
    init()
  }, [loadWorkspace])

  const handleOpenWorkspace = async () => {
    const res = await commands.pickFile('Open Cortex Workspace', 'Cortex Workspace', 'yaml')
    if (res.status === 'ok' && res.data) {
      loadWorkspace(res.data)
    } else if (res.status === 'error') {
      setError(`File picker error: ${res.error}`)
    }
  }

  const handleCreateWorkspace = (name: string) => {
    setModalType(null)
    const run = async () => {
      const resDir = await commands.pickDirectory('Select Workspace Directory')
      if (resDir.status === 'ok' && resDir.data) {
        const res = await commands.createWorkspace(name, resDir.data)
        if (res.status === 'ok') {
          loadWorkspace(res.data)
          setSuccess(`Workspace created and .gitignore initialized in ${resDir.data}`)
        } else {
          setError(`Failed to create workspace: ${res.error}`)
        }
      } else if (resDir.status === 'error') {
        setError(`Directory picker error: ${resDir.error}`)
      }
    }
    run()
  }

  const handleCreateCollection = (name: string) => {
    setModalType(null)
    const run = async () => {
      if (!workspacePath) return
      const resDir = await commands.pickDirectory('Select New Collection Directory')
      if (resDir.status === 'ok' && resDir.data) {
        const res = await commands.createCollection(name, resDir.data)
        if (res.status === 'ok') {
          // Now add it to the workspace
          const addRes = await commands.addCollectionToWorkspace(workspacePath, res.data)
          if (addRes.status === 'ok') {
            loadWorkspace(workspacePath)
            setSuccess(`Collection created and .gitignore initialized in ${resDir.data}`)
          } else {
            setError(`Failed to add new collection to workspace: ${addRes.error}`)
          }
        } else {
          setError(`Failed to create collection: ${res.error}`)
        }
      } else if (resDir.status === 'error') {
        setError(`Directory picker error: ${resDir.error}`)
      }
    }
    run()
  }

  const handleAddCollection = async () => {
    if (!workspacePath) return
    const resDir = await commands.pickDirectory('Select Collection Directory')
    if (resDir.status === 'ok' && resDir.data) {
      const res = await commands.addCollectionToWorkspace(workspacePath, resDir.data)
      if (res.status === 'ok') {
        loadWorkspace(workspacePath)
      } else {
        setError(`Failed to add collection: ${res.error}`)
      }
    } else if (resDir.status === 'error') {
      setError(`Directory picker error: ${resDir.error}`)
    }
  }

  const handleRemoveCollection = async (path: string) => {
    if (!workspacePath) return
    const res = await commands.removeCollectionFromWorkspace(workspacePath, path)
    if (res.status === 'ok') {
      loadWorkspace(workspacePath)
    } else {
      setError(`Failed to remove collection: ${res.error}`)
    }
  }

  const handleRefreshCollection = async (path: string) => {
    const res = await commands.loadCollection(path)
    if (res.status === 'ok') {
      setLoadedCollections((prev) => ({ ...prev, [path]: res.data }))
    } else {
      setError(`Failed to refresh collection: ${res.error}`)
    }
  }

  const handleUpdateVariables = () => {
    // Refresh data after variable updates
    if (workspacePath) {
      // Just reload the manifest, not the whole tree
      const run = async () => {
        const res = await commands.loadWorkspaceManifest(workspacePath)
        if (res.status === 'ok') {
          setWorkspace((prev) => {
            if (!prev) return res.data
            // Preserve collection names if possible
            return {
              ...res.data,
              collections: res.data.collections.map((c) => {
                const existing = prev.collections.find((ec) => ec.path === c.path)
                return existing ? { ...c, name: existing.name || c.name } : c
              }),
            }
          })
        }
      }
      run()
    }
  }

  const activeTab = tabs.find((t) => t.id === activeTabId)

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-blue-500/30">
      <Shell
        isSidebarOpen={isSidebarOpen}
        topBar={
          <TopBar
            workspaceName={workspace?.name || 'Cortex'}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onOpenVariables={() => {
              setVariablePanelTab('environment')
              setShowVariablePanel(true)
            }}
          />
        }
        sidebar={
          <Sidebar onAddCollection={workspace ? () => setModalType('collection') : undefined}>
            <div className="space-y-6">
              {workspace && (
                <div
                  className="flex items-center justify-between group px-2 py-1 hover:bg-slate-800/30 rounded-md transition-colors cursor-pointer"
                  onClick={() => {
                    setVariablePanelTab('global')
                    setShowVariablePanel(true)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                      Variables
                    </h3>
                  </div>
                </div>
              )}

              {workspace ? (
                <>
                  {workspace.collections.map((c) => {
                    const isExpanded = expandedCollections[c.path] !== false
                    return (
                      <div key={c.path} className="space-y-1">
                        <div
                          className="flex items-center justify-between group px-2 py-1 hover:bg-slate-800/30 rounded-md transition-colors cursor-pointer"
                          onClick={() => toggleCollection(c.path)}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {isExpanded ? (
                              <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                            )}
                            <div
                              className={`w-1 h-1 rounded-full ${c.error ? 'bg-red-500' : 'bg-emerald-500'} shadow-lg ${c.error ? 'shadow-red-500/40' : 'shadow-emerald-500/40'}`}
                            />
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate group-hover:text-slate-200 transition-colors">
                              {c.name || 'Unknown'}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setVariablePanelTab('collection')
                                setShowVariablePanel(true)
                              }}
                              className="text-slate-600 hover:text-blue-400 p-1 rounded"
                              title="Collection Variables"
                            >
                              <Database className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveCollection(c.path)
                              }}
                              className="text-slate-600 hover:text-red-400 p-1 rounded"
                              title="Remove from Workspace"
                            >
                              <AlertCircle className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="animate-in slide-in-from-top-1 duration-200">
                            {c.error ? (
                              <div className="px-2 pt-1">
                                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                                  <p className="text-[10px] text-red-400 leading-relaxed italic">
                                    Error: {c.error}
                                  </p>
                                </div>
                              </div>
                            ) : loadedCollections[c.path] ? (
                              <CollectionExplorer
                                rootPath={c.path}
                                items={loadedCollections[c.path].items}
                                onRefresh={() => handleRefreshCollection(c.path)}
                                onSelectRequest={handleSelectRequest}
                              />
                            ) : (
                              <div className="py-4 text-center">
                                <Loader2 className="w-4 h-4 animate-spin text-slate-800 mx-auto" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {workspace.collections.length === 0 && (
                    <div className="py-12 text-center space-y-4 px-4">
                      <p className="text-[10px] text-slate-600 italic uppercase tracking-widest">
                        No collections
                      </p>
                      <button
                        onClick={handleAddCollection}
                        className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
                      >
                        + Add Collection
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-20 text-center space-y-6 px-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                      Workspace
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      No workspace open. Start by opening or creating one.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleOpenWorkspace}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-semibold text-white transition-all"
                    >
                      Open Existing
                    </button>
                    <button
                      onClick={() => setModalType('workspace')}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-lg shadow-blue-600/10"
                    >
                      Create New
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Sidebar>
        }
        main={
          <div className="flex flex-col h-full overflow-hidden">
            <TabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onSelectTab={setActiveTabId}
              onCloseTab={handleCloseTab}
            />
            <div className="flex-1 overflow-hidden flex flex-col">
              <Composer
                tab={activeTab}
                workspacePath={workspacePath || undefined}
                collectionPath={
                  activeTab?.path && workspace
                    ? workspace.collections.find((c) => {
                        if (!c.path) return false
                        // Robust prefix check
                        const reqPath = activeTab.path!.replace(/\\/g, '/')
                        const colPath = c.path.replace(/\\/g, '/')
                        return (
                          reqPath.startsWith(colPath) &&
                          (reqPath.length === colPath.length || reqPath[colPath.length] === '/')
                        )
                      })?.path
                    : undefined
                }
              />
            </div>
          </div>
        }
      />

      <NameModal
        isOpen={modalType !== null}
        title={modalType === 'workspace' ? 'New Workspace' : 'New Collection'}
        label={modalType === 'workspace' ? 'Workspace Name' : 'Collection Name'}
        onClose={() => setModalType(null)}
        onConfirm={modalType === 'workspace' ? handleCreateWorkspace : handleCreateCollection}
      />

      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
      {success && <SuccessToast message={success} onClose={() => setSuccess(null)} />}

      {showVariablePanel && workspacePath && (
        <VariablePanel
          workspacePath={workspacePath}
          workspaceName={workspace?.name || 'Workspace'}
          globalVariables={workspace?.variables || []}
          loadedCollections={Object.entries(loadedCollections).reduce(
            (acc, [path, col]) => {
              acc[path] = {
                name: col.manifest.name,
                path: path,
                variables: col.manifest.variables || [],
                environments: col.environments,
              }
              return acc
            },
            {} as Record<
              string,
              { name: string; path: string; variables: Variable[]; environments: EnvironmentFile[] }
            >
          )}
          initialTab={variablePanelTab}
          onClose={() => setShowVariablePanel(false)}
          onUpdate={handleUpdateVariables}
        />
      )}
    </div>
  )
}
export default App
