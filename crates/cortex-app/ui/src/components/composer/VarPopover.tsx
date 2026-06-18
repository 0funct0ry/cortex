import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import * as Icons from '../ui/Icons'
import { DYNAMIC_VARS_DESC } from './useVariablePicker'
import { valueToString, type PopoverState } from './varBadges'

/** The hover card shown over a `{{variable}}` token. Manages its own reveal/copy state. */
export const VarPopover: React.FC<{
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
          {DYNAMIC_VARS_DESC[varName] ?? 'Generates a value when the request is sent.'}
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

export default VarPopover
