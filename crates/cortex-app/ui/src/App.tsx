import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { commands, type CollectionManifest } from './bindings'

function App() {
  const [name, setName] = useState('')
  const [greetMsg, setGreetMsg] = useState('')

  const [collectionPath, setCollectionPath] = useState('')
  const [manifest, setManifest] = useState<CollectionManifest | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function greet() {
    const response = await commands.greet(name)
    setGreetMsg(response.message)
  }

  async function loadCollection() {
    try {
      setError(null)
      const result = await commands.loadCollection(collectionPath)
      if (result.status === 'ok') {
        setManifest(result.data)
      } else {
        setError(result.error)
        setManifest(null)
      }
    } catch (e) {
      setError(String(e))
      setManifest(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-start p-8 space-y-12 overflow-y-auto">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            CORTEX
          </h1>
          <p className="text-slate-400 text-lg">Core File Format & Collection Layer Verification</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Greet Demo */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl space-y-4 h-full">
            <h2 className="text-xl font-semibold text-blue-400">IPC Greet Demo</h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                greet()
              }}
            >
              <input
                id="greet-input"
                className="bg-slate-950 border border-slate-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                onChange={(e) => setName(e.currentTarget.value)}
                placeholder="Enter a name..."
              />
              <Button type="submit">Greet</Button>
            </form>
            {greetMsg && (
              <p className="text-emerald-400 font-medium animate-in fade-in slide-in-from-bottom-2 duration-300">
                {greetMsg}
              </p>
            )}
          </div>

          {/* Collection Load Demo */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl space-y-4 h-full">
            <h2 className="text-xl font-semibold text-emerald-400">Collection FS Layer</h2>
            <div className="flex flex-col gap-4">
              <input
                id="collection-input"
                className="bg-slate-950 border border-slate-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                value={collectionPath}
                onChange={(e) => setCollectionPath(e.currentTarget.value)}
                placeholder="Enter absolute path to collection folder..."
              />
              <Button onClick={loadCollection} className="bg-emerald-600 hover:bg-emerald-500">
                Load Collection
              </Button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="text-red-400 text-xs font-mono">{error}</p>
              </div>
            )}

            {manifest && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md space-y-2 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider">
                    Manifest Loaded
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-300">
                    v{manifest.version}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{manifest.name}</h3>
                {manifest.description && (
                  <p className="text-slate-400 text-xs">{manifest.description}</p>
                )}
                {manifest.variables && (
                  <div className="pt-2">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Variables</p>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {Object.entries(manifest.variables).map(([k, v]) => (
                        <div
                          key={k}
                          className="text-[10px] font-mono bg-slate-950 p-1 rounded border border-slate-800"
                        >
                          <span className="text-blue-400">{k}:</span> {v}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
