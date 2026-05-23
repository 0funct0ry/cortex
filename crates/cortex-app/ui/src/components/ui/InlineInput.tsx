import React, { useEffect, useRef } from 'react'

interface InlineInputProps {
  initialValue: string
  onConfirm: (value: string) => void
  onCancel: () => void
  className?: string
}

const InlineInput: React.FC<InlineInputProps> = ({
  initialValue,
  onConfirm,
  onCancel,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onConfirm(inputRef.current?.value || initialValue)
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  const handleBlur = () => {
    onConfirm(inputRef.current?.value || initialValue)
  }

  return (
    <input
      ref={inputRef}
      defaultValue={initialValue}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      className={`bg-bg-surface border border-accent rounded px-1 outline-none text-sm w-full h-[22px] ${className}`}
      onClick={(e) => e.stopPropagation()}
    />
  )
}

export default InlineInput
