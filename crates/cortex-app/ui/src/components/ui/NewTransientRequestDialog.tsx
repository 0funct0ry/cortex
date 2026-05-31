import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import * as Icons from './Icons'
import { useTabs } from '../../contexts/TabsContext'
import { useRequestStore } from '../../stores/requestStore'

// ─── Types ───────────────────────────────────────────────────────────────────

type Protocol = 'HTTP' | 'GraphQL' | 'gRPC' | 'WebSocket' | 'SSE'

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

const METHOD_COLOR: Record<string, string> = {
  GET: 'text-method-get',
  POST: 'text-method-post',
  PUT: 'text-method-put',
  PATCH: 'text-method-patch',
  DELETE: 'text-method-delete',
  HEAD: 'text-method-head',
  OPTIONS: 'text-method-options',
}

const PROTOCOL_DEFAULT_METHOD: Record<Protocol, string> = {
  HTTP: 'GET',
  GraphQL: 'GraphQL',
  gRPC: 'gRPC',
  WebSocket: 'WS',
  SSE: 'SSE',
}

const PROTOCOL_PLACEHOLDER: Record<Protocol, string> = {
  HTTP: 'https://',
  GraphQL: 'https://',
  gRPC: 'grpc://',
  WebSocket: 'ws://',
  SSE: 'https://',
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface ProtocolOptionProps {
  label: string
  value: Protocol
  selected: Protocol
  onSelect: (v: Protocol) => void
}

const ProtocolOption: React.FC<ProtocolOptionProps> = ({ label, value, selected, onSelect }) => {
  const isSelected = selected === value
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none group">
      <div
        onClick={() => onSelect(value)}
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
          isSelected
            ? 'border-accent bg-accent'
            : 'border-border-strong bg-transparent group-hover:border-accent/60'
        }`}
      >
        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-accent-fg" />}
      </div>
      <span
        onClick={() => onSelect(value)}
        className={`text-sm ${isSelected ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}
      >
        {label}
      </span>
    </label>
  )
}

interface MethodDropdownProps {
  value: string
  onChange: (m: string) => void
}

const MethodDropdown: React.FC<MethodDropdownProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`h-[34px] px-2.5 flex items-center gap-1 rounded-l-md border border-r-0 border-border-default bg-bg-surface text-xs font-bold transition-colors hover:bg-bg-muted ${METHOD_COLOR[value] ?? 'text-text-secondary'}`}
      >
        <span>{value}</span>
        <Icons.ChevronDown size={10} className="text-text-muted" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-[300] w-28 bg-bg-overlay border border-border-subtle rounded-md shadow-lg py-1">
          {HTTP_METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                onChange(m)
                setOpen(false)
              }}
              className={`w-full text-left px-3 py-1 text-xs font-semibold hover:bg-bg-highlight transition-colors ${METHOD_COLOR[m] ?? 'text-text-secondary'}`}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Dialog ─────────────────────────────────────────────────────────────

interface NewTransientRequestDialogProps {
  isOpen: boolean
  onClose: () => void
}

const NewTransientRequestDialog: React.FC<NewTransientRequestDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { openTab } = useTabs()

  const [protocol, setProtocol] = useState<Protocol>('HTTP')
  const [httpMethod, setHttpMethod] = useState('GET')
  const [url, setUrl] = useState('')

  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => urlInputRef.current?.focus(), 50)
      return () => clearTimeout(id)
    }
  }, [isOpen])

  // Reset state when dialog opens
  const reset = useCallback(() => {
    setProtocol('HTTP')
    setHttpMethod('GET')
    setUrl('')
  }, [])

  useEffect(() => {
    if (!isOpen) {
      // Use a small timeout or microtask to avoid "set-state-in-effect"
      // while still resetting the dialog for the next time it opens.
      const id = setTimeout(reset, 0)
      return () => clearTimeout(id)
    }
  }, [isOpen, reset])

  const handleProtocolChange = (p: Protocol) => {
    setProtocol(p)
    if (p !== 'HTTP') setHttpMethod(PROTOCOL_DEFAULT_METHOD[p])
    else setHttpMethod('GET')
  }

  const handleCreate = useCallback(() => {
    const effectiveMethod = protocol === 'HTTP' ? httpMethod : PROTOCOL_DEFAULT_METHOD[protocol]

    const tabId = openTab({
      type: 'request',
      requestPath: null,
      collectionId: null,
      collectionPath: null,
      folderPath: null,
      name: 'Untitled',
      method: effectiveMethod,
    })

    if (url.trim()) {
      useRequestStore.getState().updateRequest(tabId, { url: url.trim(), method: effectiveMethod })
    }

    onClose()
  }, [protocol, httpMethod, url, openTab, onClose])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        handleCreate()
      }
    },
    [onClose, handleCreate]
  )

  if (!isOpen) return null

  const showHttpMethod = protocol === 'HTTP'
  const placeholder = PROTOCOL_PLACEHOLDER[protocol]

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-[480px] bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="New Transient Request"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border-subtle">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">New Transient Request</h3>
            <p className="text-xs text-text-muted mt-0.5">
              Opens without saving — use "Save to Collection" later to persist it.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-muted transition-colors"
          >
            <Icons.X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Protocol selector */}
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2.5">
              Protocol
            </p>
            <div className="grid grid-cols-3 gap-x-6 gap-y-2.5">
              <ProtocolOption
                label="HTTP"
                value="HTTP"
                selected={protocol}
                onSelect={handleProtocolChange}
              />
              <ProtocolOption
                label="GraphQL"
                value="GraphQL"
                selected={protocol}
                onSelect={handleProtocolChange}
              />
              <ProtocolOption
                label="gRPC"
                value="gRPC"
                selected={protocol}
                onSelect={handleProtocolChange}
              />
              <ProtocolOption
                label="WebSocket"
                value="WebSocket"
                selected={protocol}
                onSelect={handleProtocolChange}
              />
              <ProtocolOption
                label="SSE"
                value="SSE"
                selected={protocol}
                onSelect={handleProtocolChange}
              />
            </div>
          </div>

          {/* URL row */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              URL <span className="normal-case font-normal text-text-muted">(optional)</span>
            </label>
            {showHttpMethod ? (
              <div className="flex">
                <MethodDropdown value={httpMethod} onChange={setHttpMethod} />
                <input
                  ref={urlInputRef}
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={placeholder}
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="flex-1 h-[34px] bg-bg-surface border border-border-default focus:border-accent rounded-r-md px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted"
                />
              </div>
            ) : (
              <input
                ref={urlInputRef}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={placeholder}
                autoCapitalize="off"
                autoCorrect="off"
                className="w-full h-9 bg-bg-surface border border-border-default focus:border-accent rounded-md px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border-subtle">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="h-8 px-4 text-sm font-semibold bg-accent hover:bg-accent-hover text-accent-fg rounded-md transition-colors"
          >
            Open
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default NewTransientRequestDialog
