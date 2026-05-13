import React, { useState, useEffect, useRef } from 'react'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import { commands, type ResolvedVariable, type TemplateSyntaxError } from '../bindings'
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

/**
 * Split `text` into `Segment[]` using the same `{{...}}` rules as the Rust
 * parser — but without filter awareness (the preview row doesn't need to
 * distinguish name from filter for display purposes).
 *
 * We do NOT call the backend for this; we have all the information we need
 * locally (the `warnings` and `syntax_errors` sets from the last
 * `previewTemplate` response tell us which names are unresolved / broken).
 */
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
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounced backend call whenever value or context changes.
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!value) {
        setResolvedText('')
        setWarnNames(new Set())
        setSyntaxErrors([])
        return
      }

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

        const varsRes = await commands.getResolvedVariables(
          workspacePath ?? null,
          collectionPath ?? null,
          environmentName ?? null
        )
        if (varsRes.status === 'ok') {
          setResolvedVars(varsRes.data)
        }
      } catch (e) {
        console.error('[TemplateInput] resolution error:', e)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [value, workspacePath, collectionPath, environmentName, variableRevision])

  const segments = splitSegments(value)

  // Are there any unresolved vars or syntax errors we should surface?
  const hasWarnings = warnNames.size > 0
  const hasSyntaxErrors = syntaxErrors.length > 0

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div ref={containerRef} className={cn('relative flex-1', className)}>
      {/* ── Input ── */}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>
        )}
        <input
          className={cn(
            'w-full bg-slate-900 border border-slate-800 rounded-xl py-3 text-sm text-white font-mono',
            'placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50',
            'focus:border-blue-500 transition-all shadow-2xl',
            icon ? 'pl-11 pr-4' : 'px-4',
            inputClassName
          )}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      {/* ── Preview row (only shown when input is non-empty) ── */}
      {value && (
        <div className="mt-2 px-4 py-3 bg-slate-900/30 border border-slate-800/50 rounded-xl space-y-2">
          {/* Header row */}
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

          {/* Segment chips */}
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

              // Variable segment
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

                  {/* Tooltip anchored relative to chip */}
                  {hoveredVar?.name === seg.name && (
                    <div className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none">
                      <VariablePreview name={seg.name} resolved={resolvedVars[seg.name]} />
                    </div>
                  )}
                </span>
              )
            })}
          </div>

          {/* Resolved full text (for copy / inspection) */}
          {resolvedText && resolvedText !== value && (
            <p className="text-[10px] font-mono text-slate-500 break-all leading-relaxed pt-1 border-t border-slate-800/50">
              {resolvedText}
            </p>
          )}

          {/* Syntax error banner */}
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
