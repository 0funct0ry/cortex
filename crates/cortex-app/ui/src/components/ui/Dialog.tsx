import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
}) => {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative w-full max-w-md bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded-md transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`h-8 px-4 text-sm font-medium rounded-md transition-colors ${
              variant === 'danger'
                ? 'bg-error text-text-inverse hover:bg-error/90'
                : 'bg-accent text-accent-fg hover:bg-accent-hover'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Dialog
