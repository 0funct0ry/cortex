import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import * as Icons from './Icons'
import { commands } from '../../bindings'
import type { CollectionItem, RequestFile } from '../../bindings'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useRequestStore } from '../../stores/requestStore'
import { useTabs } from '../../contexts/TabsContext'
import { toast } from '../../stores/toastStore'

// ─── Types ───────────────────────────────────────────────────────────────────

type RequestType = 'HTTP' | 'GraphQL' | 'gRPC' | 'WebSocket' | 'FromCURL'

interface FolderOption {
  label: string
  path: string
  depth: number
}

interface ParsedCurl {
  method: string
  url: string
  headers: Record<string, string>
  body: string | null
}

// ─── cURL Parser ─────────────────────────────────────────────────────────────

function tokenizeCurl(input: string): string[] {
  // Normalize line continuations then tokenize respecting single/double quotes
  const normalized = input.replace(/\\\n/g, ' ').trim()
  const tokens: string[] = []
  let i = 0

  while (i < normalized.length) {
    // Skip whitespace
    while (i < normalized.length && /\s/.test(normalized[i])) i++
    if (i >= normalized.length) break

    const ch = normalized[i]
    if (ch === '"') {
      // Double-quoted string
      i++
      let val = ''
      while (i < normalized.length && normalized[i] !== '"') {
        if (normalized[i] === '\\' && i + 1 < normalized.length) {
          i++
          val += normalized[i]
        } else {
          val += normalized[i]
        }
        i++
      }
      i++ // closing "
      tokens.push(val)
    } else if (ch === "'") {
      // Single-quoted string (no escaping inside)
      i++
      let val = ''
      while (i < normalized.length && normalized[i] !== "'") {
        val += normalized[i]
        i++
      }
      i++ // closing '
      tokens.push(val)
    } else {
      // Unquoted token
      let val = ''
      while (i < normalized.length && !/\s/.test(normalized[i])) {
        val += normalized[i]
        i++
      }
      tokens.push(val)
    }
  }

  return tokens
}

function parseCurl(input: string): ParsedCurl {
  const tokens = tokenizeCurl(input)
  let method: string | null = null
  let url = ''
  const headers: Record<string, string> = {}
  let body: string | null = null

  let i = 0
  // Skip leading 'curl' token
  if (tokens[0]?.toLowerCase() === 'curl') i++

  while (i < tokens.length) {
    const tok = tokens[i]

    if (tok === '-X' || tok === '--request') {
      method = tokens[++i] ?? method
    } else if (tok === '-H' || tok === '--header') {
      const hdr = tokens[++i] ?? ''
      const colonIdx = hdr.indexOf(':')
      if (colonIdx !== -1) {
        const name = hdr.slice(0, colonIdx).trim()
        const value = hdr.slice(colonIdx + 1).trim()
        headers[name] = value
      }
    } else if (
      tok === '-d' ||
      tok === '--data' ||
      tok === '--data-raw' ||
      tok === '--data-binary' ||
      tok === '--data-urlencode'
    ) {
      body = tokens[++i] ?? body
    } else if (tok === '-u' || tok === '--user') {
      const creds = tokens[++i] ?? ''
      headers['Authorization'] = 'Basic ' + btoa(creds)
    } else if (tok === '-b' || tok === '--cookie') {
      const cookie = tokens[++i] ?? ''
      headers['Cookie'] = cookie
    } else if (tok === '--url') {
      url = tokens[++i] ?? url
    } else if (
      !tok.startsWith('-') &&
      (tok.startsWith('http://') ||
        tok.startsWith('https://') ||
        tok.startsWith('http') ||
        tok.startsWith('ws://') ||
        tok.startsWith('grpc://'))
    ) {
      url = tok
    } else if (!tok.startsWith('-') && url === '' && tok !== 'curl') {
      // Bare argument that isn't a flag — treat as URL
      url = tok
    }
    // Ignore unknown flags (--compressed, --insecure, etc.)

    i++
  }

  if (!method) {
    method = body ? 'POST' : 'GET'
  }

  return { method, url, headers, body }
}

// ─── Folder tree builder ─────────────────────────────────────────────────────

function buildFolderOptions(items: CollectionItem[], depth = 0): FolderOption[] {
  const result: FolderOption[] = []
  for (const item of items) {
    if (item.type === 'Folder') {
      result.push({ label: item.data.name, path: item.data.path, depth })
      result.push(...buildFolderOptions(item.data.items, depth + 1))
    }
  }
  return result
}

// ─── HTTP methods for the inline dropdown ────────────────────────────────────

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

// ─── Sub-components ──────────────────────────────────────────────────────────

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

// ─── Type Radio Button ────────────────────────────────────────────────────────

interface TypeOptionProps {
  label: string
  value: RequestType
  selected: RequestType
  onSelect: (v: RequestType) => void
}

const TypeOption: React.FC<TypeOptionProps> = ({ label, value, selected, onSelect }) => {
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

// ─── Main Dialog ─────────────────────────────────────────────────────────────

interface NewRequestDialogProps {
  isOpen: boolean
  onClose: () => void
  initialCollectionPath?: string | null
  initialFolderPath?: string | null
}

const NewRequestDialog: React.FC<NewRequestDialogProps> = ({
  isOpen,
  onClose,
  initialCollectionPath,
  initialFolderPath,
}) => {
  const { activeWorkspace } = useWorkspaceStore()
  const { collections, loadCollection } = useCollectionStore()
  const { openTab } = useTabs()

  // ── Form state — initialised fresh on each mount (parent passes a new key on open) ──
  const initCollectionPath = initialCollectionPath ?? activeWorkspace?.collections[0]?.path ?? ''

  const [requestType, setRequestType] = useState<RequestType>('HTTP')
  const [requestName, setRequestName] = useState('')
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [curlCommand, setCurlCommand] = useState('')
  const [curlParseAs, setCurlParseAs] = useState<'HTTP' | 'GraphQL'>('HTTP')
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [selectedCollectionPath, setSelectedCollectionPath] = useState<string>(initCollectionPath)
  const [selectedFolderPath, setSelectedFolderPath] = useState<string | null>(
    initialFolderPath ?? null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nameInputRef = useRef<HTMLInputElement>(null)

  // ── Auto-focus name field on mount ──────────────────────────────────────────
  useEffect(() => {
    const id = setTimeout(() => nameInputRef.current?.focus(), 50)
    return () => clearTimeout(id)
  }, [])

  // ── Load collection data when the selected collection changes ───────────────
  useEffect(() => {
    if (selectedCollectionPath && !collections[selectedCollectionPath]) {
      loadCollection(selectedCollectionPath)
    }
  }, [selectedCollectionPath, collections, loadCollection])

  // ── Derived values ──────────────────────────────────────────────────────────
  const showMethodAndUrl = requestType === 'HTTP' || requestType === 'GraphQL'
  const showCurl = requestType === 'FromCURL'
  const showUrlOnly = requestType === 'gRPC' || requestType === 'WebSocket'

  const urlPlaceholder =
    requestType === 'gRPC' ? 'grpc://' : requestType === 'WebSocket' ? 'ws://' : 'https://'

  const colData = collections[selectedCollectionPath]
  const folderOptions: FolderOption[] = colData ? buildFolderOptions(colData.items) : []

  const canCreate = requestName.trim() !== '' && !isSubmitting

  const allCollections = activeWorkspace?.collections ?? []

  // ── Keyboard handling ───────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    },
    [onClose]
  )

  const handleOverlayKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    },
    [onClose]
  )

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canCreate) {
      e.preventDefault()
      handleCreate()
    }
  }

  // ── Creation ────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!canCreate) return
    setIsSubmitting(true)

    try {
      const targetDir = selectedFolderPath ?? selectedCollectionPath
      const name = requestName.trim()

      let effectiveMethod = method
      let effectiveUrl = url
      let effectiveHeaders: Record<string, string> = {}
      let effectiveBody: string | null = null

      if (showCurl) {
        const parsed = parseCurl(curlCommand)
        effectiveMethod = curlParseAs === 'GraphQL' ? 'GraphQL' : parsed.method
        effectiveUrl = parsed.url
        effectiveHeaders = parsed.headers
        effectiveBody = parsed.body
      } else if (requestType === 'gRPC') {
        effectiveMethod = 'gRPC'
        effectiveUrl = url
      } else if (requestType === 'WebSocket') {
        effectiveMethod = 'WS'
        effectiveUrl = url
      } else if (requestType === 'GraphQL') {
        effectiveMethod = 'GraphQL'
        effectiveUrl = url
      }

      const res = await commands.createRequest(name, targetDir, effectiveMethod)
      if (res.status !== 'ok') {
        toast.error(`Failed to create request: ${res.error}`)
        return
      }

      const newRequestPath = res.data

      // Build default content
      const defaultContent: RequestFile = {
        version: '1',
        name,
        method: effectiveMethod,
        url: effectiveUrl,
        headers: Object.keys(effectiveHeaders).length > 0 ? effectiveHeaders : {},
        params: {},
        body: effectiveBody
          ? {
              text: null,
              json: null,
              form: null,
              active_type: 'raw',
              raw_text: effectiveBody,
              raw_subtype: 'text',
              form_data: null,
              url_encoded: null,
              file_path: null,
              file_filter: null,
            }
          : null,
      }

      // Reload the sidebar so the new node exists in the tree before we select it.
      await loadCollection(selectedCollectionPath)

      // openTab returns the new tab's UUID. The Composer reads request state
      // keyed by this UUID, so every subsequent store call must use it — not
      // the file path — as the tabId.
      const tabId = openTab({
        type: 'request',
        requestPath: newRequestPath,
        collectionId: selectedCollectionPath,
        collectionPath: null,
        name,
        method: effectiveMethod,
      })

      // Populate the in-memory store under the correct UUID key.  React batches
      // the setActiveTabId call inside openTab, so the Composer hasn't rendered
      // yet; writing here guarantees the state exists before the first render.
      useRequestStore.getState().populateRequest(tabId, defaultContent)

      // Highlight the new node in the sidebar immediately.
      useCollectionStore.getState().setSelectedPath(newRequestPath)

      // Persist the full content (url, headers, body) to disk.
      // saveRequest reads requestStates[tabId] (the UUID key), serialises it
      // and writes to newRequestPath via commands.saveRequest.
      await useRequestStore.getState().saveRequest(tabId, newRequestPath)

      onClose()
    } catch (e) {
      toast.error(`Error creating request: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onKeyDown={handleOverlayKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-[560px] bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="New Request"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border-subtle">
          <h3 className="text-sm font-semibold text-text-primary">New Request</h3>
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
          {/* Type selector */}
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2.5">
              Type
            </p>
            <div className="grid grid-cols-3 gap-x-6 gap-y-2.5">
              <TypeOption
                label="HTTP"
                value="HTTP"
                selected={requestType}
                onSelect={setRequestType}
              />
              <TypeOption
                label="gRPC"
                value="gRPC"
                selected={requestType}
                onSelect={setRequestType}
              />
              <TypeOption
                label="From cURL"
                value="FromCURL"
                selected={requestType}
                onSelect={setRequestType}
              />
              <TypeOption
                label="GraphQL"
                value="GraphQL"
                selected={requestType}
                onSelect={setRequestType}
              />
              <TypeOption
                label="WebSocket"
                value="WebSocket"
                selected={requestType}
                onSelect={setRequestType}
              />
            </div>
          </div>

          {/* Request Name */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Request Name
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              onKeyDown={handleNameKeyDown}
              autoCapitalize="off"
              autoCorrect="off"
              placeholder="Request Name"
              className="w-full h-9 bg-bg-surface border border-border-default focus:border-accent rounded-md px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted"
            />
          </div>

          {/* URL row (HTTP / GraphQL) */}
          {showMethodAndUrl && (
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                URL
              </label>
              <div className="flex">
                <MethodDropdown value={method} onChange={setMethod} />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Request URL"
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="flex-1 h-[34px] bg-bg-surface border border-border-default focus:border-accent rounded-r-md px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted"
                />
              </div>
            </div>
          )}

          {/* URL row (gRPC / WebSocket — no method dropdown) */}
          {showUrlOnly && (
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={urlPlaceholder}
                autoCapitalize="off"
                autoCorrect="off"
                className="w-full h-9 bg-bg-surface border border-border-default focus:border-accent rounded-md px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted"
              />
            </div>
          )}

          {/* cURL Command */}
          {showCurl && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  cURL Command
                </label>
                {/* Parse-as selector */}
                <div className="relative">
                  <select
                    value={curlParseAs}
                    onChange={(e) => setCurlParseAs(e.target.value as 'HTTP' | 'GraphQL')}
                    className="appearance-none h-6 pl-2 pr-6 bg-bg-surface border border-border-default rounded text-xs text-text-secondary outline-none cursor-pointer focus:border-accent"
                  >
                    <option value="HTTP">HTTP</option>
                    <option value="GraphQL">GraphQL</option>
                  </select>
                  <Icons.ChevronDown
                    size={10}
                    className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                </div>
              </div>
              <textarea
                value={curlCommand}
                onChange={(e) => setCurlCommand(e.target.value)}
                placeholder="Enter cURL request here.."
                rows={6}
                autoCapitalize="off"
                autoCorrect="off"
                className="w-full bg-bg-surface border border-border-default focus:border-accent rounded-md px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted resize-y font-mono"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border-subtle">
          {/* Options disclosure */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setIsOptionsOpen((v) => !v)}
              className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
            >
              <span>Options</span>
              <Icons.ChevronDown
                size={14}
                className={`transition-transform duration-150 ${isOptionsOpen ? 'rotate-0' : '-rotate-90'}`}
              />
            </button>

            {/* Expanded options */}
            {isOptionsOpen && (
              <div className="space-y-2 pb-1">
                {/* Collection selector — only when no initial collection is set */}
                {!initialCollectionPath && allCollections.length > 1 && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-text-secondary w-20 shrink-0">Collection</label>
                    <select
                      value={selectedCollectionPath}
                      onChange={(e) => {
                        setSelectedCollectionPath(e.target.value)
                        setSelectedFolderPath(null)
                      }}
                      className="flex-1 h-7 bg-bg-surface border border-border-default rounded px-2 text-xs text-text-primary outline-none focus:border-accent"
                    >
                      {allCollections.map((c) => (
                        <option key={c.path} value={c.path}>
                          {c.name ?? c.path.split('/').pop()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Folder selector */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-text-secondary w-20 shrink-0">
                    Save to folder
                  </label>
                  <select
                    value={selectedFolderPath ?? ''}
                    onChange={(e) => setSelectedFolderPath(e.target.value || null)}
                    className="flex-1 h-7 bg-bg-surface border border-border-default rounded px-2 text-xs text-text-primary outline-none focus:border-accent"
                  >
                    <option value="">— Collection root —</option>
                    {folderOptions.map((f) => (
                      <option key={f.path} value={f.path}>
                        {'  '.repeat(f.depth)}
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 self-start">
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
              disabled={!canCreate}
              className="h-8 px-4 text-sm font-semibold bg-accent hover:bg-accent-hover text-accent-fg rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default NewRequestDialog
