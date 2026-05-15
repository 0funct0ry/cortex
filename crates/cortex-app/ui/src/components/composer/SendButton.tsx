import React from 'react'
import * as Icons from '../ui/Icons'
import Tooltip from '../ui/Tooltip'

interface SendButtonProps {
  inFlight: boolean
  onSend: () => void
  onCancel: () => void
}

const SendButton: React.FC<SendButtonProps> = ({ inFlight, onSend, onCancel }) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const shortcutHint = isMac ? '⌘ + Enter' : 'Ctrl + Enter'

  if (inFlight) {
    return (
      <Tooltip content="Cancel Request" position="bottom">
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
    <Tooltip content={`Send Request (${shortcutHint})`} position="bottom">
      <button
        onClick={onSend}
        className="h-8 px-5 rounded-md bg-accent text-accent-fg font-semibold text-sm hover:bg-accent-hover transition-colors shadow-sm"
      >
        Send
      </button>
    </Tooltip>
  )
}

export default SendButton
