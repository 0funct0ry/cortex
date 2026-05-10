import React from 'react'
import { type ResolvedVariable, type VariableScope } from '../bindings'
import { cn } from '../lib/utils'

interface VariablePreviewProps {
  name: string
  resolved?: ResolvedVariable
  onClose: () => void
}

const scopeColors: Record<VariableScope, string> = {
  global: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  collection: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  environment: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  runtime: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

export const VariablePreview: React.FC<VariablePreviewProps> = ({ name, resolved }) => {
  return (
    <div className="absolute z-[60] bottom-full left-0 mb-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-1 duration-200">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
            Variable
          </span>
          <span className="text-xs font-mono text-white font-bold">
            {'{{'}
            {name}
            {'}}'}
          </span>
        </div>
        {resolved && (
          <span
            className={cn(
              'text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded border',
              scopeColors[resolved.scope]
            )}
          >
            {resolved.scope}
          </span>
        )}
      </div>
      <div className="p-3 bg-slate-950/50">
        <span className="text-[10px] font-mono text-slate-600 block mb-1">Resolved Value</span>
        {resolved ? (
          <p className="text-sm text-slate-200 font-mono break-all leading-relaxed">
            {resolved.value}
          </p>
        ) : (
          <p className="text-sm text-red-400 italic">Unresolved variable</p>
        )}
      </div>
    </div>
  )
}
