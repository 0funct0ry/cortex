import React from 'react'
import { createPortal } from 'react-dom'
import * as Icons from './Icons'
import { toast } from '../../stores/toastStore'
import { useUIStore } from '../../stores/uiStore'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const { openImportCollectionDialog } = useUIStore()

  if (!isOpen) return null

  const handleImportOption = (format: string) => {
    toast.info(`Importing from ${format} (Epic 10) is coming soon!`)
  }

  const cortexOptions = [
    {
      name: 'Cortex ZIP Archive',
      description: 'Import a Cortex collection exported as a .zip archive',
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
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      onClick: () => {
        onClose()
        openImportCollectionDialog('zip')
      },
    },
    {
      name: 'Cortex YAML Bundle',
      description: 'Import a portable Cortex bundle (.yaml file)',
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      onClick: () => {
        onClose()
        openImportCollectionDialog('bundle')
      },
    },
  ]

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
          {/* Cortex-native formats */}
          {cortexOptions.map((opt) => (
            <button
              key={opt.name}
              onClick={opt.onClick}
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

          {/* Third-party formats (coming soon) */}
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider pt-1">
            Third-party formats
          </p>
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
