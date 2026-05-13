import React from 'react'
import { Sparkles, Terminal, Send, Globe } from 'lucide-react'
import { type Tab } from './TabBar'
import { getMethodColor } from '../../lib/methods'
import { cn } from '../../lib/utils'
import { TemplateInput } from '../TemplateInput'

interface ComposerProps {
  tab?: Tab
  workspacePath?: string
  collectionPath?: string
  environmentName?: string
  /** Incremented by App whenever variables are saved so TemplateInput re-resolves. */
  variableRevision?: number
}

export const Composer: React.FC<ComposerProps> = ({
  tab,
  workspacePath,
  collectionPath,
  environmentName,
  variableRevision,
}) => {
  const [url, setUrl] = React.useState('')

  if (!tab) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <div className="w-20 h-20 bg-slate-900/50 rounded-3xl flex items-center justify-center mb-8 border border-slate-800 shadow-2xl mx-auto group hover:border-blue-500/50 transition-all duration-500">
            <Sparkles className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Welcome to Cortex</h2>
          <p className="text-slate-500 text-sm max-w-sm leading-relaxed mx-auto">
            The next-generation API client for agentic workflows. Select a request from the sidebar
            or start with a scratch tab.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[#020617] overflow-hidden animate-in fade-in duration-500 relative">
      <div className="p-8 space-y-8">
        {/* Method + Name */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'text-xs font-black uppercase px-2 py-0.5 rounded-md shadow-sm',
              getMethodColor(tab.method)
            )}
          >
            {tab.method}
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight">{tab.name}</h1>
        </div>

        {/* URL Bar */}
        <div className="flex items-start gap-2">
          <TemplateInput
            value={url}
            onChange={setUrl}
            placeholder="https://api.example.com/v1/{{resource}}"
            workspacePath={workspacePath}
            collectionPath={collectionPath}
            environmentName={environmentName}
            variableRevision={variableRevision}
            icon={
              <Globe className="w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            }
          />
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-95 transition-all shrink-0">
            <Send className="w-4 h-4" /> Send
          </button>
        </div>

        {/* Placeholder for headers / body / params */}
        <div className="flex flex-col items-center justify-center h-64 border border-slate-800 border-dashed rounded-3xl bg-slate-900/10 group hover:bg-slate-900/20 transition-all duration-500">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700 group-hover:border-slate-600 group-hover:scale-110 transition-all">
            <Terminal className="w-6 h-6 text-slate-500 group-hover:text-slate-300" />
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-tight">
            Headers, Body, and Scripts coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
