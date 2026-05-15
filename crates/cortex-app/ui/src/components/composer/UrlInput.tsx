import React, { useRef, useState } from 'react'

interface UrlInputProps {
  value: string
  onChange: (value: string) => void
  onEnter?: () => void
}

const UrlInput: React.FC<UrlInputProps> = ({ value, onChange, onEnter }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEnter?.()
    }
  }

  // Simple regex for variable highlighting
  // In a real scenario, we'd use a more robust parser or IPC feedback
  const renderHighlighted = (text: string) => {
    const parts = text.split(/(\{\{[^{}]*\}\})/)
    return parts.map((part, i) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        // Mocking resolution: if it contains "base", treat as resolved (amber)
        // Otherwise unresolved (red)
        const isResolved =
          part.toLowerCase().includes('base') || part.toLowerCase().includes('host')
        return (
          <span
            key={i}
            className={`${
              isResolved
                ? 'border-b border-warning text-warning'
                : 'border-b border-error text-error'
            }`}
          >
            {part}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="flex-1 relative group h-[30px]">
      <div
        className={`absolute inset-0 bg-bg-surface border rounded-md transition-all duration-150 ${
          isFocused ? 'border-border-strong ring-2 ring-accent/20' : 'border-border-default'
        }`}
      />

      {/* Highlighting Overlay */}
      <div className="absolute inset-0 flex items-center px-3 font-mono text-sm pointer-events-none overflow-hidden whitespace-nowrap select-none">
        <div className="text-text-primary">
          {value ? (
            renderHighlighted(value)
          ) : (
            <span className="text-text-muted">Enter URL or paste text</span>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={!value ? 'Enter URL or paste text' : ''}
        className="absolute inset-0 bg-transparent border-none outline-none px-3 font-mono text-sm text-transparent caret-accent w-full"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
      />
    </div>
  )
}

export default UrlInput
