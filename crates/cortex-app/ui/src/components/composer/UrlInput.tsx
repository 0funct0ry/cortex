import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import ReactDOM from 'react-dom'
import * as Icons from '../ui/Icons'
import { useRequestStore } from '../../stores/requestStore'
import { useTabs } from '../../contexts/TabsContext'
import { useCollectionEnvironmentStore } from '../../stores/collectionEnvironmentStore'
import type { ResolvedVariable } from '../../bindings'

interface UrlInputProps {
  value: string
  onChange: (value: string) => void
  onEnter?: () => void
}

const EMPTY_RESOLVED: Record<string, ResolvedVariable> = {}
const EMPTY_SET = new Set<string>()

interface BadgeInfo {
  label: string
  cls: string
}

const GLOBAL_BADGE: BadgeInfo = {
  label: 'Global',
  cls: 'bg-success/15 text-success border-success/30',
}
const COLLECTION_BADGE: BadgeInfo = {
  label: 'Collection',
  cls: 'bg-accent/15 text-accent border-accent/30',
}
const SESSION_BADGE: BadgeInfo = {
  label: 'Session',
  cls: 'bg-bg-muted text-text-secondary border-border-default',
}
const DYNAMIC_BADGE: BadgeInfo = {
  label: 'Dynamic',
  cls: 'bg-accent/15 text-accent border-accent/30',
}
const UNRESOLVED_BADGE: BadgeInfo = {
  label: 'Unresolved',
  cls: 'bg-error/15 text-error border-error/30',
}

/**
 * Determine the source badge for a variable.
 *
 * Note: both the active *global* environment (sent to the backend as
 * `environment_name`) and the active *collection* environment
 * (`collection_environment_name`) resolve to the same `environment` scope.
 * We disambiguate by checking whether the variable name belongs to the active
 * collection environment — if so it's Collection, otherwise Global.
 */
function computeBadge(
  varName: string,
  resolved: ResolvedVariable | null,
  isDynamic: boolean,
  collectionEnvVarNames: Set<string>
): BadgeInfo {
  if (isDynamic) return DYNAMIC_BADGE
  if (!resolved) return UNRESOLVED_BADGE
  switch (resolved.scope) {
    case 'environment':
      return collectionEnvVarNames.has(varName) ? COLLECTION_BADGE : GLOBAL_BADGE
    case 'collection':
      return COLLECTION_BADGE
    case 'global':
      return GLOBAL_BADGE
    case 'runtime':
      return SESSION_BADGE
    case 'dynamic':
      return DYNAMIC_BADGE
    default:
      return GLOBAL_BADGE
  }
}

const DYNAMIC_DESC: Record<string, string> = {
  $randomInt: 'Random integer between 0 and 1000.',
  $timestamp: 'Current Unix timestamp (seconds).',
  $isoTimestamp: 'Current ISO 8601 UTC timestamp.',
  $randomNanoId: 'Secure 21-character NanoID.',
  $uuid: 'Random v4 UUID.',
  $randomFirstName: 'Random first name.',
  $randomLastName: 'Random last name.',
  $randomEmail: 'Random email address.',
  $randomPhoneNumber: 'Random phone number.',
  $randomUrl: 'Random URL.',
  $randomIPv4: 'Random IPv4 address.',
  $randomBoolean: 'Random boolean value.',
  $randomLoremWord: 'Random lorem ipsum word.',
  $randomLoremSentence: 'Random lorem ipsum sentence.',
}

function valueToString(v: unknown): string {
  if (v === null || v === undefined) return ''
  return typeof v === 'string' ? v : JSON.stringify(v)
}

interface PopoverData {
  varName: string
  resolved: ResolvedVariable | null
  isDynamic: boolean
  badge: BadgeInfo
}

interface PopoverState extends PopoverData {
  visible: boolean
  x: number
  y: number
}

/** The hover card shown over a `{{variable}}` token. Manages its own reveal/copy state. */
const VarPopover: React.FC<{
  data: PopoverState
  onMouseEnter: () => void
  onMouseLeave: () => void
}> = ({ data, onMouseEnter, onMouseLeave }) => {
  const { varName, resolved, isDynamic, badge, x, y } = data
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const realValue = resolved ? valueToString(resolved.value) : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(realValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore clipboard errors */
    }
  }

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="w-[260px] bg-bg-overlay border border-border-subtle rounded-md shadow-xl p-2.5 text-xs flex flex-col gap-2 font-sans animate-fade-in"
    >
      {/* Header: variable name + scope badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono font-semibold text-text-primary truncate">{varName}</span>
        <span
          className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${badge.cls}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Body */}
      {isDynamic ? (
        <p className="text-[11px] text-text-secondary leading-relaxed">
          {DYNAMIC_DESC[varName] ?? 'Generates a value when the request is sent.'}
        </p>
      ) : resolved ? (
        <div className="flex items-center gap-1.5 bg-bg-muted/60 border border-border-subtle/60 rounded px-2 py-1.5">
          <span className="flex-1 font-mono text-[11px] text-text-primary break-all min-w-0">
            {resolved.secret && !revealed
              ? '••••••••'
              : realValue || <em className="text-text-muted not-italic">(empty)</em>}
          </span>
          {resolved.secret && (
            <button
              onClick={() => setRevealed((r) => !r)}
              className="shrink-0 p-0.5 rounded text-text-muted hover:text-text-primary transition-colors"
              title={revealed ? 'Hide value' : 'Reveal value'}
            >
              {revealed ? <Icons.EyeOff size={13} /> : <Icons.Eye size={13} />}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="shrink-0 p-0.5 rounded text-text-muted hover:text-text-primary transition-colors"
            title="Copy value"
          >
            {copied ? <Icons.Check size={13} className="text-success" /> : <Icons.Copy size={13} />}
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-text-secondary leading-relaxed">
          Not defined in any active scope. Define it in an environment or as a variable.
        </p>
      )}
    </div>,
    document.body
  )
}

/**
 * URL input bar with inline variable highlighting.
 *
 * A transparent <input> sits on top of a colour-coded overlay; the overlay's
 * horizontal scroll is kept in sync with the input. This keeps native caret
 * hit-testing, keyboard shortcuts and click-to-position fully intact (the
 * input owns all interaction) while showing `{{variable}}` tokens in colour:
 *   • green  — resolved
 *   • red    — unresolved
 *   • blue   — dynamic ($-prefixed) built-ins
 * Hovering a token reveals a popover with its scope, value (masked reveal for
 * secrets) and a copy action.
 */
const UrlInput: React.FC<UrlInputProps> = ({ value, onChange, onEnter }) => {
  const { activeTabId, activeTab } = useTabs()
  const resolvedVariables = useRequestStore((s) =>
    activeTabId ? s.resolvedVariables[activeTabId] || EMPTY_RESOLVED : EMPTY_RESOLVED
  )

  const collectionId = activeTab?.collectionId ?? null
  const loadCollectionEnvironments = useCollectionEnvironmentStore(
    (s) => s.loadCollectionEnvironments
  )
  const collectionEnvironments = useCollectionEnvironmentStore((s) => s.collectionEnvironments)
  const activeCollectionEnvName = useCollectionEnvironmentStore((s) => s.activeCollectionEnvName)

  // Ensure the active collection's environments are loaded so the tooltip can
  // tell Collection-env variables apart from Global-env ones (both share the
  // backend `environment` scope).
  useEffect(() => {
    if (collectionId) loadCollectionEnvironments(collectionId)
  }, [collectionId, loadCollectionEnvironments])

  // Names of variables defined in the active collection environment.
  const collectionEnvVarNames = useMemo(() => {
    const active = collectionId ? (activeCollectionEnvName[collectionId] ?? null) : null
    if (!collectionId || !active) return EMPTY_SET
    const envs = collectionEnvironments[collectionId] ?? []
    const env = envs.find((e) => e.name === active)
    return env ? new Set(env.variables.map((v) => v.name)) : EMPTY_SET
  }, [collectionId, activeCollectionEnvName, collectionEnvironments])

  const effectiveResolved = useCallback(
    (varName: string): ResolvedVariable | null => resolvedVariables[varName] ?? null,
    [resolvedVariables]
  )

  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<number | null>(null)

  const [popover, setPopover] = useState<PopoverState>({
    visible: false,
    x: 0,
    y: 0,
    varName: '',
    resolved: null,
    isDynamic: false,
    badge: UNRESOLVED_BADGE,
  })

  // Keep the overlay's scroll position aligned with the input's.
  const syncScroll = useCallback(() => {
    if (inputRef.current && overlayRef.current) {
      overlayRef.current.scrollLeft = inputRef.current.scrollLeft
    }
  }, [])

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    input.addEventListener('scroll', syncScroll)
    return () => input.removeEventListener('scroll', syncScroll)
  }, [syncScroll])

  useEffect(() => {
    syncScroll()
  }, [value, syncScroll])

  const clearHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
  }, [])

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setPopover((p) => ({ ...p, visible: false })), 140)
  }, [])

  const handleTokenEnter = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>, varName: string) => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current)
        hideTimer.current = null
      }
      const rect = e.currentTarget.getBoundingClientRect()
      const isDynamic = varName.startsWith('$')
      const resolved = isDynamic ? null : effectiveResolved(varName)
      setPopover({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.bottom + 6, // just below the token
        varName,
        resolved,
        isDynamic,
        badge: computeBadge(varName, resolved, isDynamic, collectionEnvVarNames),
      })
    },
    [effectiveResolved, collectionEnvVarNames]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onEnter?.()
  }

  const renderHighlighted = (text: string) => {
    const parts = text.split(/(\{\{[^{}]*\}\})/)
    return parts.map((part, i) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        const varName = part.slice(2, -2).trim()
        const isDynamic = varName.startsWith('$')
        const isResolved = !isDynamic && !!effectiveResolved(varName)

        let cls = 'text-error' // unresolved → red
        if (isDynamic) cls = 'text-accent'
        else if (isResolved) cls = 'text-success' // resolved → green

        return (
          <span
            key={i}
            className={`${cls} pointer-events-auto cursor-help font-medium`}
            onMouseEnter={(e) => handleTokenEnter(e, varName)}
            onMouseLeave={scheduleHide}
          >
            {part}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="flex-1 flex flex-col justify-center min-w-0">
      <div className="relative flex items-center h-[30px] bg-bg-surface border border-border-default rounded-md transition-all duration-150 focus-within:border-border-strong focus-within:ring-2 focus-within:ring-accent/20">
        {/* Colour-coded overlay (behind the transparent input text) */}
        <div
          ref={overlayRef}
          aria-hidden
          className={`absolute inset-0 flex items-center px-3 font-mono text-sm overflow-hidden whitespace-pre pointer-events-none ${
            value ? 'text-text-primary' : 'text-text-muted'
          }`}
        >
          {value ? (
            renderHighlighted(value)
          ) : (
            <span className="text-text-muted">Enter URL or paste text</span>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-transparent border-none outline-none px-3 font-mono text-sm text-transparent caret-accent selection:bg-accent/20"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      {popover.visible && (
        <VarPopover
          key={popover.varName}
          data={popover}
          onMouseEnter={clearHide}
          onMouseLeave={scheduleHide}
        />
      )}
    </div>
  )
}

export default UrlInput
