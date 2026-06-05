import React from 'react'

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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEnter?.()
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center min-w-0">
      {/* Single native input — correct caret hit-testing, native keyboard shortcuts */}
      <div className="relative flex items-center h-[30px] bg-bg-surface border border-border-default rounded-md transition-all duration-150 focus-within:border-border-strong focus-within:ring-2 focus-within:ring-accent/20">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter URL or paste text"
          className="w-full h-full bg-transparent border-none outline-none px-3 font-mono text-sm text-text-primary caret-accent placeholder:text-text-muted"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}

export default UrlInput
