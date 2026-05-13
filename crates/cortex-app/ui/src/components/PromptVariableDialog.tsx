import React, { useState, useEffect, useRef } from 'react'
import { Terminal, X, AlertCircle, Play } from 'lucide-react'
import { type Variable } from '../bindings'
import { cn } from '../lib/utils'

interface PromptVariableDialogProps {
  variables: Variable[]
  onConfirm: (values: Record<string, string>) => void
  onCancel: () => void
}

export const PromptVariableDialog: React.FC<PromptVariableDialogProps> = ({
  variables,
  onConfirm,
  onCancel,
}) => {
  const getValStr = (val: unknown) =>
    typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val ?? '')

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const v of variables) {
      init[v.name] = getValStr(v.value)
    }
    return init
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the first input when the dialog mounts
    firstInputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    for (const v of variables) {
      const val = (values[v.name] ?? '').trim()
      if (val === '' && getValStr(v.value) === '') {
        newErrors[v.name] = 'This variable is required — please enter a value.'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirm = () => {
    if (!validate()) return
    // Trim whitespace from all values before passing upstream
    const trimmed: Record<string, string> = {}
    for (const [k, val] of Object.entries(values)) {
      trimmed[k] = val.trim()
    }
    onConfirm(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleConfirm()
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/15 border border-indigo-500/30 rounded-xl">
              <Terminal className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Prompt Variables</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Values used for this run only
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info banner */}
        <div className="mx-6 mt-4 flex items-start gap-3 px-4 py-3 bg-indigo-500/8 border border-indigo-500/20 rounded-2xl">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-indigo-400/80 leading-relaxed">
            These values will be used <strong>for this run only</strong> and are{' '}
            <strong>never saved to disk</strong>. They override all other variable scopes during the
            run.
          </p>
        </div>

        {/* Variable inputs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {variables.map((v, idx) => {
            const defaultStr = getValStr(v.value)
            return (
              <div key={v.name} className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <span className="font-mono text-indigo-300">{v.name}</span>
                  {defaultStr !== '' && (
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                      has default
                    </span>
                  )}
                </label>
                {v.description && (
                  <p className="text-[11px] text-slate-500 leading-relaxed">{v.description}</p>
                )}
                <input
                  ref={idx === 0 ? firstInputRef : undefined}
                  type={v.secret ? 'password' : 'text'}
                  className={cn(
                    'w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 transition-all',
                    errors[v.name]
                      ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/60'
                      : 'border-slate-800 focus:ring-indigo-500/40 focus:border-indigo-600/50'
                  )}
                  placeholder={
                    defaultStr !== ''
                      ? `default: ${v.secret ? '••••••••' : defaultStr}`
                      : 'Enter value…'
                  }
                  value={values[v.name] ?? ''}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, [v.name]: e.target.value }))
                    if (errors[v.name]) {
                      setErrors((prev) => {
                        const next = { ...prev }
                        delete next[v.name]
                        return next
                      })
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
                {errors[v.name] && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-150">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors[v.name]}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-900/50">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-8 py-2.5 text-xs font-bold text-white rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5" />
            Start Run
          </button>
        </div>
      </div>
    </div>
  )
}
