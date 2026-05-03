import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { commands } from './bindings'

function App() {
  const [name, setName] = useState('')
  const [greetMsg, setGreetMsg] = useState('')

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    const response = await commands.greet(name)
    setGreetMsg(response.message)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            CORTEX
          </h1>
          <p className="text-slate-400 text-lg">Type-Safe IPC Established</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl space-y-4">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              greet()
            }}
          >
            <input
              id="greet-input"
              className="bg-slate-950 border border-slate-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload App
          </Button>
        </div>

        <div className="pt-8 text-sm text-slate-500">
          Generated bindings located at{' '}
          <code className="bg-slate-900 px-1 py-0.5 rounded">ui/src/bindings.ts</code>
        </div>
      </div>
    </div>
  )
}

export default App
