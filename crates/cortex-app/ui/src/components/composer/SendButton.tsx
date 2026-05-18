import React from 'react'
import * as Icons from '../ui/Icons'
import Tooltip from '../ui/Tooltip'

interface SendButtonProps {
  inFlight: boolean
  onSend: () => void
  onCancel: () => void
  disabled?: boolean
  disabledReason?: string
}

const SendButton: React.FC<SendButtonProps> = ({
  inFlight,
  onSend,
  onCancel,
  disabled = false,
  disabledReason = '',
}) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const shortcutHint = isMac ? '⌘ + Enter' : 'Ctrl + Enter'

  if (inFlight) {
    return (
      <Tooltip content="Cancel Request" position="bottom" align="end">
        <button
          onClick={onCancel}
          className="h-8 px-4 rounded-md bg-error text-white font-semibold text-sm hover:bg-error/90 transition-colors flex items-center gap-2"
        >
          <Icons.X size={14} />
          Cancel
        </button>
      </Tooltip>
    )
  }

  return (
    <Tooltip
      content={disabled && disabledReason ? disabledReason : `Send Request (${shortcutHint})`}
      position="bottom"
      align="end"
    >
      <button
        onClick={disabled ? undefined : onSend}
        disabled={disabled}
        className={`h-8 px-5 rounded-md bg-accent text-accent-fg font-semibold text-sm transition-colors shadow-sm select-none ${
          disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-accent-hover'
        }`}
      >
        Send
      </button>
    </Tooltip>
  )
}

export default SendButton
