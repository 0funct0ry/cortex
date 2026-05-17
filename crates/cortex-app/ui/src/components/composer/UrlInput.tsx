import React, { useState } from 'react'

interface UrlInputProps {
  value: string
  onChange: (value: string) => void
  onEnter?: () => void
}

/**
 * URL input bar.
 *
 * We deliberately use a single native <input> element instead of the
 * overlay-div-over-transparent-input pattern.  The overlay approach breaks
 * native cursor hit-testing: the browser positions the caret inside the
 * transparent input using its own internal scroll offset, while the
 * overlay div has an independent (and diverging) scroll offset.  The result
 * is that clicking near the end of a long URL lands the caret ~2 characters
 * short of where you clicked, and End/Cmd+Right cannot fully scroll the
 * overlay to match.
 *
 * Using a single visible input gives us correct caret positioning, native
 * Cmd+A / End / Home / arrow key behaviour, and proper click-to-cursor
 * placement for free.  Variable highlighting is shown in a compact
 * resolved-preview strip below the input when focused – the same UX pattern
 * used by Postman and Insomnia.
 */
const UrlInput: React.FC<UrlInputProps> = ({ value, onChange, onEnter }) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEnter?.()
    }
  }

  // Detect {{variable}} tokens for the preview strip
  const hasVariables = /\{\{[^{}]+\}\}/.test(value)

  const renderPreviewStrip = () => {
    const parts = value.split(/(\{\{[^{}]*\}\})/)
    return parts.map((part, i) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        // Treat as dynamic if it starts with $
        const inner = part.slice(2, -2).trim()
        const isDynamic = inner.startsWith('$')
        return (
          <span
            key={i}
            className={
              isDynamic
                ? 'text-[color:var(--color-method-post)] font-semibold'
                : 'text-warning font-semibold'
            }
          >
            {part}
          </span>
        )
      }
      return (
        <span key={i} className="text-text-secondary">
          {part}
        </span>
      )
    })
  }

  return (
    <div className="flex-1 flex flex-col justify-center gap-0 min-w-0">
      {/* The single native input – text is fully visible, cursor works natively */}
      <div
        className={`relative flex items-center h-[30px] bg-bg-surface border rounded-md transition-all duration-150 ${
          isFocused ? 'border-border-strong ring-2 ring-accent/20' : 'border-border-default'
        }`}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter URL or paste text"
          className="w-full h-full bg-transparent border-none outline-none px-3 font-mono text-sm text-text-primary caret-accent placeholder:text-text-muted"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      {/* Variable preview strip – only visible when focused and URL has {{tokens}} */}
      {isFocused && hasVariables && (
        <div className="px-3 pt-0.5 font-mono text-xs whitespace-nowrap overflow-hidden text-ellipsis pointer-events-none select-none leading-none">
          {renderPreviewStrip()}
        </div>
      )}
    </div>
  )
}

export default UrlInput
