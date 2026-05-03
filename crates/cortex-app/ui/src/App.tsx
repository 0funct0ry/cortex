import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            CORTEX
          </h1>
          <p className="text-slate-400 text-lg">
            Project Foundation & Toolchain
          </p>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-lg">
          <p className="text-blue-400 font-medium">
            Tailwind CSS is working if this box has a subtle blue tint.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="default">shadcn Button</Button>
          <Button variant="outline">Outline Variant</Button>
        </div>

        <div className="pt-8 text-sm text-slate-500">
          Edit <code className="bg-slate-900 px-1 py-0.5 rounded">src/App.tsx</code> to test HMR [working].
        </div>
      </div>
    </div>
  )
}

export default App
