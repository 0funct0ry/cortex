import React from 'react'
import { Sparkles, Terminal } from 'lucide-react'
import { type Tab } from './TabBar'
import { getMethodColor } from '../../lib/methods'
import { cn } from '../../lib/utils'

interface ComposerProps {
  tab?: Tab
}

export const Composer: React.FC<ComposerProps> = ({ tab }) => {
  if (!tab) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#020617] relative overflow-hidden">
        {/* Background glow */}
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
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] font-mono text-slate-500 shadow-xl">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-sans shadow-sm">
                ⌘
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-sans shadow-sm">
                B
              </kbd>
              <span className="ml-1">Toggle Sidebar</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] font-mono text-slate-500 shadow-xl">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-sans shadow-sm">
                ⌘
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-sans shadow-sm">
                T
              </kbd>
              <span className="ml-1">New Scratch Tab</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[#020617] overflow-hidden animate-in fade-in duration-500">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
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

        <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] border border-slate-800 border-dashed rounded-3xl bg-slate-900/10 group hover:bg-slate-900/20 transition-all duration-500">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700 group-hover:border-slate-600 group-hover:scale-110 transition-all">
            <Terminal className="w-6 h-6 text-slate-500 group-hover:text-slate-300" />
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-tight">
            Request Composer implementation coming soon...
          </p>
          <div className="mt-4 flex flex-col items-center gap-1">
            <p className="text-[10px] text-slate-600 font-mono">ID: {tab.id}</p>
            {tab.path && (
              <p className="text-[10px] text-slate-700 font-mono truncate max-w-md">
                Path: {tab.path}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
