import React from 'react'
import { useToastStore } from '../../stores/toastStore'
import Toast from './Toast'

const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast id={toast.id} type={toast.type} message={toast.message} />
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
