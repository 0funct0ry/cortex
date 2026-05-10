import { useState, useEffect, useCallback } from 'react'
import { commands, type WorkspaceResponse, type Collection } from './bindings'
import { CollectionExplorer, SuccessToast } from './components/CollectionExplorer'
import { WorkspaceHeader } from './components/WorkspaceHeader'
import { ErrorToast } from './components/CollectionExplorer'
import { AlertCircle, Loader2, X, Plus } from 'lucide-react'

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [modalType, setModalType] = useState<'workspace' | 'collection' | null>(null)

  const loadWorkspace = useCallback(async (path: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await commands.loadWorkspace(path)
      if (res.status === 'ok') {
        setWorkspace(res.data)
        setWorkspacePath(path)

        // Load all collections in parallel
        const collections: Record<string, Collection> = {}
        await Promise.all(
          res.data.collections.map(async (c) => {
            if (!c.error) {
              const cRes = await commands.loadCollection(c.path)
              if (cRes.status === 'ok') {
                collections[c.path] = cRes.data
              }
            }
          })
        )
        setLoadedCollections(collections)
      } else {
        setError(`Failed to load workspace: ${res.error}`)
      }
    } catch (e) {
      setError(`IPC Error: ${e}`)
    } finally {
      setIsLoading(false)
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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Top Banner / Navigation */}
      <div className="max-w-7xl mx-auto w-full px-8 pt-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              CORTEX
            </h1>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
              Agentic Development Platform
            </p>
          </div>
          <div className="flex gap-4">
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                <Loader2 className="w-3 h-3 animate-spin" />
                Updating...
              </div>
            )}
          </div>
        </div>

        {workspace ? (
          <WorkspaceHeader
            name={workspace.name}
            onOpen={handleOpenWorkspace}
            onCreate={() => setModalType('workspace')}
            onAddCollection={handleAddCollection}
            onCreateCollection={() => setModalType('collection')}
          />
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-12 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">No Workspace Open</h2>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Open an existing workspace or create a new one to start managing your agent
                collections.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleOpenWorkspace}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg"
              >
                Open Workspace
              </button>
              <button
                onClick={() => setModalType('workspace')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-600/20"
              >
                Create New
              </button>
            </div>
          </div>
        )}
      </div>

      <NameModal
        isOpen={modalType !== null}
        title={modalType === 'workspace' ? 'New Workspace' : 'New Collection'}
        label={modalType === 'workspace' ? 'Workspace Name' : 'Collection Name'}
        onClose={() => setModalType(null)}
        onConfirm={modalType === 'workspace' ? handleCreateWorkspace : handleCreateCollection}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 pb-12 overflow-hidden flex flex-col">
        {workspace && (
          <div className="grid grid-cols-12 gap-8 h-full overflow-hidden">
            {/* Sidebar Explorer */}
            <aside className="col-span-4 flex flex-col gap-6 overflow-hidden">
              <div className="flex-1 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 overflow-y-auto custom-scrollbar backdrop-blur-sm">
                <div className="space-y-8">
                  {workspace.collections.map((c) => (
                    <div key={c.path} className="space-y-3">
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${c.error ? 'bg-red-500' : 'bg-emerald-500'} shadow-lg ${c.error ? 'shadow-red-500/40' : 'shadow-emerald-500/40'}`}
                          />
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">
                            {c.name || 'Unknown Collection'}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleRemoveCollection(c.path)}
                          className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 p-1 rounded transition-all"
                          title="Remove from Workspace"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {c.error ? (
                        <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                          <p className="text-[10px] text-red-400 leading-relaxed italic">
                            Error: {c.error}
                          </p>
                        </div>
                      ) : loadedCollections[c.path] ? (
                        <CollectionExplorer
                          rootPath={c.path}
                          items={loadedCollections[c.path].items}
                          onRefresh={() => handleRefreshCollection(c.path)}
                        />
                      ) : (
                        <div className="py-4 text-center">
                          <Loader2 className="w-4 h-4 animate-spin text-slate-700 mx-auto" />
                        </div>
                      )}
                    </div>
                  ))}

                  {workspace.collections.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                      <p className="text-xs text-slate-600 italic">
                        No collections in this workspace
                      </p>
                      <button
                        onClick={handleAddCollection}
                        className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest"
                      >
                        + Add First Collection
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Main Stage */}
            <section className="col-span-8 flex flex-col gap-8 overflow-hidden">
              <div className="flex-1 bg-slate-900/20 border border-slate-800/40 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-12">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
                  <AlertCircle className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-400">
                  Select a request to view details
                </h3>
                <p className="text-sm text-slate-600 mt-2 max-w-xs">
                  Once you select a .crx file from the explorer, its configuration and environment
                  will appear here.
                </p>
              </div>
            </section>
          </div>
        )}
      </main>

      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
      {success && <SuccessToast message={success} onClose={() => setSuccess(null)} />}
    </div>
  )
}

export default App
