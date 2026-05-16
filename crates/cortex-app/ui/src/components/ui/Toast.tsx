import React from 'react'
import * as Icons from './Icons'
import { useToastStore, type ToastType } from '../../stores/toastStore'

interface ToastProps {
  id: string
  type: ToastType
  message: string
}

const Toast: React.FC<ToastProps> = ({ id, type, message }) => {
  const { removeToast } = useToastStore()

  const variants = {
    success: {
      border: 'border-l-[3px] border-l-success',
      icon: <Icons.Check className="text-success" />,
    },
    error: {
      border: 'border-l-[3px] border-l-error',
      icon: <Icons.X className="text-error" />,
    },
    info: {
      border: 'border-l-[3px] border-l-info',
      icon: <Icons.Info className="text-info" />,
    },
  }

  const variant = variants[type]

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 min-w-[300px] max-w-[450px] bg-bg-overlay ${variant.border} rounded-sm shadow-lg animate-slide-in`}
    >
      <div className="flex-shrink-0">{variant.icon}</div>
      <div className="flex-grow text-sm text-text-primary">{message}</div>
      <button
        onClick={() => removeToast(id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-bg-highlight text-text-muted hover:text-text-primary transition-colors"
      >
        <Icons.X size={14} />
      </button>
    </div>
  )
}

export default Toast
