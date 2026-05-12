import React from 'react'
import { type ResolvedVariable, type VariableScope } from '../bindings'
import { cn } from '../lib/utils'
import { AlertCircle } from 'lucide-react'

interface VariablePreviewProps {
  name: string
  resolved?: ResolvedVariable
  onClose?: () => void
}

const scopeColors: Record<VariableScope, string> = {
  global: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  collection: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  environment: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  runtime: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

export const VariablePreview: React.FC<VariablePreviewProps> = ({ name, resolved }) => {
  return (
    <div className="absolute z-[60] bottom-full left-0 mb-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Variable
          </span>
          <span className="text-sm font-mono text-blue-400 font-bold">
            {'{{'}
            {name}
            {'}}'}
          </span>
        </div>
        {resolved && (
          <span
            className={cn(
              'text-[9px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-full border',
              scopeColors[resolved.scope]
            )}
          >
            {resolved.scope}
          </span>
        )}
      </div>
      <div className="p-4 bg-slate-950/50">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-2">
          Resolved Value
        </span>
        {resolved ? (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-200 font-mono break-all leading-relaxed whitespace-pre-wrap">
              {resolved.secret ? '********' : resolved.value}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-400 py-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <p className="text-xs font-medium italic">Unresolved variable</p>
          </div>
        )}
      </div>
      <div className="px-4 py-2 bg-slate-900/30 border-t border-slate-800/50">
        <p className="text-[9px] text-slate-500 italic">
          Source: {resolved ? `${resolved.scope} scope` : 'None'}
        </p>
      </div>
    </div>
  )
}
