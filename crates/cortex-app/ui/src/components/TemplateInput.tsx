import React, { useState, useEffect, useRef } from 'react'
import { AlertTriangle, AlertCircle, Sparkles } from 'lucide-react'
import {
  commands,
  type ResolvedVariable,
  type TemplateSyntaxError,
  type VariableScope,
} from '../bindings'
import { VariablePreview } from './VariablePreview'
import { cn } from '../lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TemplateInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  workspacePath?: string | null
  collectionPath?: string | null
  environmentName?: string | null
  /**
   * Increment this counter whenever variables are saved so the component
   * re-resolves even if the template text itself has not changed.
   */
  variableRevision?: number
  /** Optional icon to show on the left side of the input. */
  icon?: React.ReactNode
  className?: string
  inputClassName?: string
}

/** A parsed segment of the raw template string — produced client-side. */
type Segment =
  | { kind: 'literal'; text: string }
  | { kind: 'variable'; name: string; raw: string }
  | { kind: 'syntax-error'; raw: string }

// ---------------------------------------------------------------------------
// Client-side template splitter
// ---------------------------------------------------------------------------

function splitSegments(text: string): Segment[] {
  const segments: Segment[] = []
  let rest = text

  while (rest.length > 0) {
    const openIdx = rest.indexOf('{{')
    if (openIdx === -1) {
      if (rest) segments.push({ kind: 'literal', text: rest })
      break
    }

    if (openIdx > 0) {
      segments.push({ kind: 'literal', text: rest.slice(0, openIdx) })
    }

    const afterOpen = rest.slice(openIdx + 2)
    const closeIdx = afterOpen.indexOf('}}')

    if (closeIdx === -1) {
      // Unclosed — remainder is a syntax error.
      segments.push({ kind: 'syntax-error', raw: `{{${afterOpen}` })
      break
    }

    const inner = afterOpen.slice(0, closeIdx)
    // Extract variable name (everything before a `|`).
    const pipePosInInner = inner.indexOf('|')
    const name = (pipePosInInner === -1 ? inner : inner.slice(0, pipePosInInner)).trim()
    const raw = `{{${inner}}}`

    segments.push({ kind: 'variable', name, raw })
    rest = afterOpen.slice(closeIdx + 2)
  }

  return segments
}

const scopeColors: Record<VariableScope, string> = {
  global: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  collection: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  environment: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  runtime: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  dynamic: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TemplateInput: React.FC<TemplateInputProps> = ({
  value,
  onChange,
  placeholder,
  workspacePath,
  collectionPath,
  environmentName,
  variableRevision,
  icon,
  className,
  inputClassName,
}) => {
  const [resolvedText, setResolvedText] = useState('')
  const [warnNames, setWarnNames] = useState<Set<string>>(new Set())
  const [syntaxErrors, setSyntaxErrors] = useState<TemplateSyntaxError[]>([])
  const [resolvedVars, setResolvedVars] = useState<Record<string, ResolvedVariable>>({})
  const [hoveredVar, setHoveredVar] = useState<{
    name: string
    x: number
    y: number
  } | null>(null)

  // Autocomplete Picker State
  const [showPicker, setShowPicker] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced backend call whenever value or context changes.
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!value) {
        setResolvedText('')
        setWarnNames(new Set())
        setSyntaxErrors([])
      } else {
        try {
          const res = await commands.previewTemplate(
            value,
            workspacePath ?? null,
            collectionPath ?? null,
            environmentName ?? null
          )
          if (res.status === 'ok') {
            setResolvedText(res.data.text)
            setWarnNames(new Set(res.data.warnings.map((w) => w.name)))
            setSyntaxErrors(res.data.syntax_errors)
          }
        } catch (e) {
          console.error('[TemplateInput] preview error:', e)
        }
      }

      // Always fetch available resolved variables to populate autocomplete picker
      try {
        const varsRes = await commands.getResolvedVariables(
          workspacePath ?? null,
          collectionPath ?? null,
          environmentName ?? null
        )
        if (varsRes.status === 'ok') {
          setResolvedVars(varsRes.data)
        }
      } catch (e) {
        console.error('[TemplateInput] vars error:', e)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [value, workspacePath, collectionPath, environmentName, variableRevision])

  const segments = splitSegments(value)

  // Cursor tracking for autocomplete picker trigger
  const updateCursorState = () => {
    if (!inputRef.current) return
    const cursor = inputRef.current.selectionStart || 0
    const text = value || ''

    const lastOpen = text.lastIndexOf('{{', cursor - 1)
    const lastClose = text.lastIndexOf('}}', cursor - 1)

    if (lastOpen !== -1 && lastOpen > lastClose) {
      // Cursor is actively inside an unclosed {{ block
      const prefix = text.slice(lastOpen + 2, cursor).trim()
      setFilterText(prefix)
      setShowPicker(true)
      setSelectedIndex(0)
    } else {
      setShowPicker(false)
    }
  }

  // Filter available variables for picker dropdown
  const filteredVars = Object.entries(resolvedVars)
    .map(([name, resolved]) => ({ name, ...resolved }))
    .filter((v) => v.name.toLowerCase().includes(filterText.toLowerCase()))

  // Variable insertion logic
  const insertVariable = (varName: string) => {
    if (!inputRef.current) return
    const cursor = inputRef.current.selectionStart || 0
    const text = value || ''

    const openIdx = text.lastIndexOf('{{', cursor - 1)
    if (openIdx !== -1) {
      const nextCloseIdx = text.indexOf('}}', cursor)
      const nextOpenIdx = text.indexOf('{{', cursor)

      let endIdx = cursor
      if (nextCloseIdx !== -1 && (nextOpenIdx === -1 || nextCloseIdx < nextOpenIdx)) {
        endIdx = nextCloseIdx + 2
      }

      const before = text.slice(0, openIdx)
      const after = text.slice(endIdx)
      const newValue = `${before}{{${varName}}}${after}`
      onChange(newValue)

      const newCursor = before.length + varName.length + 4
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.setSelectionRange(newCursor, newCursor)
        }
      }, 0)
    } else {
      onChange(text + `{{${varName}}}`)
    }

    setShowPicker(false)
  }

  // Keyboard Navigation inside input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showPicker || filteredVars.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filteredVars.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredVars.length) % filteredVars.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      insertVariable(filteredVars[selectedIndex].name)
    } else if (e.key === 'Escape') {
      setShowPicker(false)
    }
  }

  // Close picker on outside clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hasWarnings = warnNames.size > 0
  const hasSyntaxErrors = syntaxErrors.length > 0

  return (
    <div ref={containerRef} className={cn('relative flex-1', className)}>
      {/* ── Input ── */}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>
        )}
        <input
          ref={inputRef}
          className={cn(
            'w-full bg-slate-900 border border-slate-800 rounded-xl py-3 text-sm text-white font-mono',
            'placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50',
            'focus:border-blue-500 transition-all shadow-2xl',
            icon ? 'pl-11 pr-4' : 'px-4',
            inputClassName
          )}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setTimeout(updateCursorState, 0)
          }}
          onClick={updateCursorState}
          onKeyUp={updateCursorState}
          onKeyDown={handleKeyDown}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />

        {/* ── Autocomplete Picker Dropdown ── */}
        {showPicker && filteredVars.length > 0 && (
          <div className="absolute z-50 left-0 top-full mt-2 w-full max-h-64 overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-1.5 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-800/50">
            <div className="px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-rose-400 animate-pulse" />
              <span>Available Variables Context</span>
            </div>
            <div className="pt-1">
              {filteredVars.map((v, idx) => {
                const isSelected = idx === selectedIndex
                return (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => insertVariable(v.name)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all group/item',
                      isSelected
                        ? 'bg-blue-600/10 text-white'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-xs font-mono font-bold truncate">{v.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono text-slate-500 max-w-[120px] truncate group-hover/item:text-slate-400">
                        {v.secret ? '********' : v.value}
                      </span>
                      <span
                        className={cn(
                          'text-[9px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-full border',
                          scopeColors[v.scope]
                        )}
                      >
                        {v.scope}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Preview row ── */}
      {value && (
        <div className="mt-2 px-4 py-3 bg-slate-900/30 border border-slate-800/50 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              Resolved Preview
            </span>
            {(hasWarnings || hasSyntaxErrors) && (
              <div className="flex items-center gap-1.5 text-amber-500">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  {warnNames.size > 0
                    ? `${warnNames.size} Unresolved ${warnNames.size === 1 ? 'Variable' : 'Variables'}`
                    : `${syntaxErrors.length} Syntax ${syntaxErrors.length === 1 ? 'Error' : 'Errors'}`}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1 items-baseline leading-relaxed">
            {segments.map((seg, i) => {
              if (seg.kind === 'literal') {
                return (
                  <span key={i} className="text-xs font-mono text-slate-400 break-all">
                    {seg.text}
                  </span>
                )
              }

              if (seg.kind === 'syntax-error') {
                return (
                  <span
                    key={i}
                    className="text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded"
                    title="Syntax error"
                  >
                    {seg.raw}
                  </span>
                )
              }

              const isUnresolved = warnNames.has(seg.name)
              return (
                <span
                  key={i}
                  className={cn(
                    'relative text-xs font-mono px-1.5 py-0.5 rounded border cursor-default',
                    isUnresolved
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 underline decoration-wavy decoration-red-500'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  )}
                  onMouseEnter={(e) => {
                    setHoveredVar({ name: seg.name, x: e.clientX, y: e.clientY })
                  }}
                  onMouseLeave={() => setHoveredVar(null)}
                >
                  {seg.raw}

                  {hoveredVar?.name === seg.name && (
                    <div className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none">
                      <VariablePreview name={seg.name} resolved={resolvedVars[seg.name]} />
                    </div>
                  )}
                </span>
              )
            })}
          </div>

          {resolvedText && resolvedText !== value && (
            <p className="text-[10px] font-mono text-slate-500 break-all leading-relaxed pt-1 border-t border-slate-800/50">
              {resolvedText}
            </p>
          )}

          {hasSyntaxErrors && (
            <div className="space-y-1 pt-1 border-t border-slate-800/50">
              {syntaxErrors.map((err, i) => (
                <div key={i} className="flex items-start gap-1.5 text-red-400">
                  <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                  <span className="text-[10px] font-mono leading-snug">{err.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
