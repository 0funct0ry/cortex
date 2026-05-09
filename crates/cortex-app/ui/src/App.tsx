import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { commands, type Collection } from './bindings'
import { CollectionExplorer } from './components/CollectionExplorer'
import { FolderOpen, RefreshCcw } from 'lucide-react'

function App() {
  const [collectionPath, setCollectionPath] = useState('')
  const [collection, setCollection] = useState<Collection | null>(null)
  const [collectionError, setCollectionError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function loadCollection(pathOverride?: string) {
    const path = pathOverride || collectionPath
    if (!path) return

    setIsLoading(true)
    try {
      setCollectionError(null)
      const result = await commands.loadCollection(path)
      if (result.status === 'ok') {
        setCollection(result.data)
      } else {
        setCollectionError(result.error)
        setCollection(null)
      }
    } catch (e) {
      setCollectionError(String(e))
      setCollection(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-start p-8 space-y-8 overflow-y-auto font-sans">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            CORTEX
          </h1>
          <p className="text-slate-400 text-lg">Collection FS Layer Verification</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl space-y-6 text-left">
          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Open Collection
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="collection-input"
                  className="w-full bg-slate-950 border border-slate-800 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                  value={collectionPath}
                  onChange={(e) => setCollectionPath(e.currentTarget.value)}
                  placeholder="Enter absolute path to collection folder..."
                />
              </div>
              <Button
                onClick={() => loadCollection()}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 min-w-[120px]"
              >
                {isLoading ? 'Loading...' : 'Load'}
              </Button>
            </div>
          </div>

          {collectionError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md animate-in fade-in slide-in-from-top-1 duration-200">
              <p className="text-red-400 text-sm font-medium">Error loading collection</p>
              <p className="text-red-500/80 text-xs font-mono mt-1">{collectionError}</p>
            </div>
          )}

          {collection && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">{collection.manifest.name}</h2>
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-300 font-mono">
                      v{collection.manifest.version}
                    </span>
                  </div>
                  {collection.manifest.description && (
                    <p className="text-slate-400 text-sm mt-1">{collection.manifest.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadCollection()}
                  className="text-slate-400 hover:text-white"
                >
                  <RefreshCcw className="w-3 h-3 mr-2" /> Refresh
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Explorer
                  </h3>
                  <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 min-h-[400px]">
                    <CollectionExplorer
                      rootPath={collection.path}
                      items={collection.items}
                      onRefresh={() => loadCollection()}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Environments
                  </h3>
                  <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 min-h-[400px]">
                    {collection.environments.length === 0 ? (
                      <p className="text-slate-600 text-[10px] italic">No environments found</p>
                    ) : (
                      <div className="space-y-3">
                        {collection.environments.map((env, i) => (
                          <div
                            key={i}
                            className="p-3 bg-slate-900 border border-slate-800 rounded-md"
                          >
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">
                              {env.name}
                            </p>
                            <div className="mt-2 space-y-1">
                              {env.variables.map((v, j) => (
                                <div key={j} className="flex justify-between text-[10px] font-mono">
                                  <span className="text-slate-500">{v.name}:</span>
                                  <span className={v.secret ? 'text-purple-400' : 'text-slate-300'}>
                                    {v.secret ? '••••••••' : v.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Reload App
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
