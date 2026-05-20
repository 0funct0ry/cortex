import React from 'react'
import { createPortal } from 'react-dom'
import * as Icons from './Icons'
import { toast } from '../../stores/toastStore'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const handleImportOption = (format: string) => {
    toast.info(`Importing from ${format} (Epic 10) is coming soon!`)
  }

  const importOptions = [
    {
      name: 'Postman Collection',
      description: 'Import collections exported from Postman (v2/v2.1 JSON)',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z" />
          <path d="M12 6a6 6 0 0 1 6 6c0 3.314-2.686 6-6 6s-6-2.686-6-6a6 6 0 0 1 6-6z" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'Insomnia Collection',
      description: 'Import Insomnia exports (JSON/YAML format)',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="9" x2="15" y2="15" />
          <line x1="15" y1="9" x2="9" y2="15" />
        </svg>
      ),
    },
    {
      name: 'OpenAPI Specification',
      description: 'Import OpenAPI v3.0 / v3.1 Specifications (JSON/YAML)',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
  ]

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-text-primary">Import Collection</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
          >
            <Icons.X size={16} />
          </button>
        </div>

        <p className="text-xs text-text-muted mb-4">
          Select the format of the collection you want to import into your workspace.
        </p>

        <div className="space-y-3">
          {importOptions.map((opt) => (
            <button
              key={opt.name}
              onClick={() => handleImportOption(opt.name)}
              className="w-full flex items-start gap-4 p-3.5 rounded-lg border border-border-subtle bg-bg-surface hover:bg-bg-muted hover:border-border-default hover:scale-[1.01] text-left transition-all active:scale-[0.99] group"
            >
              <div className="p-2 bg-bg-muted group-hover:bg-accent/10 rounded-md text-text-secondary group-hover:text-accent transition-colors shrink-0">
                <opt.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {opt.name}
                </div>
                <div className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  {opt.description}
                </div>
              </div>
              <Icons.ChevronRight
                size={14}
                className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all self-center"
              />
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ImportModal
