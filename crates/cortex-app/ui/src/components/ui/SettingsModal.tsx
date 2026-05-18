import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { commands } from '../../bindings'
import type { AuthRef, CollectionItem, Folder } from '../../bindings'
import { VariableInput } from '../composer/VariableInput'
import { useCollectionStore } from '../../stores/collectionStore'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'collection' | 'folder'
  path: string
  name: string
  collectionPath: string
}

interface HeaderRow {
  key: string
  value: string
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  type,
  path,
  name,
  collectionPath,
}) => {
  const { collections, loadCollection } = useCollectionStore()

  const [activeTab, setActiveTab] = useState<'auth' | 'headers'>('auth')
  const [authType, setAuthType] = useState<'none' | 'api_key' | 'bearer_token'>('none')
  const [pendingAuthType, setPendingAuthType] = useState<
    'none' | 'api_key' | 'bearer_token' | null
  >(null)

  // API Key Form
  const [apiKeyName, setApiKeyName] = useState('')
  const [apiKeyValue, setApiKeyValue] = useState('')
  const [apiKeyAddTo, setApiKeyAddTo] = useState('header')

  // Bearer Token Form
  const [bearerToken, setBearerToken] = useState('')

  // Masking toggles
  const [isApiKeyMasked, setIsApiKeyMasked] = useState(true)
  const [isBearerMasked, setIsBearerMasked] = useState(true)

  // Custom Headers
  const [headers, setHeaders] = useState<HeaderRow[]>([])

  // Load existing manifest on mount
  useEffect(() => {
    if (!isOpen) return

    let loadedAuth: AuthRef | null = null
    let loadedHeaders: Record<string, string> | null = null

    if (type === 'collection') {
      const col = collections[path]
      if (col && col.manifest) {
        loadedAuth = col.manifest.auth || null
        loadedHeaders = col.manifest.headers || null
      }
    } else {
      // Find folder recursively
      const findFolder = (items: CollectionItem[], targetPath: string): Folder | null => {
        for (const item of items) {
          if (item.type === 'Folder') {
            if (item.data.path === targetPath) return item.data
            const found = findFolder(item.data.items || [], targetPath)
            if (found) return found
          }
        }
        return null
      }
      const col = collections[collectionPath]
      if (col) {
        const folder = findFolder(col.items || [], path)
        if (folder && folder.manifest) {
          loadedAuth = folder.manifest.auth || null
          loadedHeaders = folder.manifest.headers || null
        }
      }
    }

    // Populate state deferred to next tick to avoid synchronous setState inside useEffect warning
    Promise.resolve().then(() => {
      if (loadedAuth) {
        setAuthType(loadedAuth.type as 'none' | 'api_key' | 'bearer_token')
        if (loadedAuth.type === 'api_key') {
          setApiKeyName(loadedAuth.key || '')
          setApiKeyValue(loadedAuth.value || '')
          setApiKeyAddTo(loadedAuth.addTo || 'header')
        } else if (loadedAuth.type === 'bearer_token') {
          setBearerToken(loadedAuth.token || '')
        }
      } else {
        setAuthType('none')
      }

      if (loadedHeaders) {
        setHeaders(
          Object.entries(loadedHeaders).map(([k, v]) => ({
            key: k,
            value: v,
          }))
        )
      } else {
        setHeaders([])
      }
    })
  }, [isOpen, type, path, collectionPath, collections])

  if (!isOpen) return null

  // Switch Auth Type handler with prompt/guard
  const handleAuthTypeChange = (newType: 'none' | 'api_key' | 'bearer_token') => {
    if (newType === authType) return

    // Check if current form has non-empty values
    const hasValues =
      (authType === 'api_key' && (apiKeyName || apiKeyValue)) ||
      (authType === 'bearer_token' && bearerToken)

    if (hasValues) {
      setPendingAuthType(newType)
    } else {
      setAuthType(newType)
    }
  }

  const confirmSwitch = () => {
    if (pendingAuthType) {
      // Clear previous type's state
      if (authType === 'api_key') {
        setApiKeyName('')
        setApiKeyValue('')
        setApiKeyAddTo('header')
      } else if (authType === 'bearer_token') {
        setBearerToken('')
      }
      setAuthType(pendingAuthType)
      setPendingAuthType(null)
    }
  }

  const cancelSwitch = () => {
    setPendingAuthType(null)
  }

  const handleSave = async () => {
    // 1. Prepare AuthRef object
    let authRef: AuthRef | null = null
    if (authType !== 'none') {
      authRef = {
        type: authType,
        key: authType === 'api_key' ? apiKeyName : undefined,
        value: authType === 'api_key' ? apiKeyValue : undefined,
        addTo: authType === 'api_key' ? apiKeyAddTo : undefined,
        token: authType === 'bearer_token' ? bearerToken : undefined,
      } as unknown as AuthRef
    }

    // 2. Prepare Headers Record
    const headersRecord: Record<string, string> = {}
    for (const h of headers) {
      if (h.key.trim()) {
        headersRecord[h.key.trim()] = h.value
      }
    }
    const hasHeaders = Object.keys(headersRecord).length > 0

    // 3. Save to Backend
    if (type === 'collection') {
      await commands.updateCollectionAuth(path, authRef)
      await commands.updateCollectionHeaders(path, hasHeaders ? headersRecord : null)
    } else {
      await commands.updateFolderAuth(path, authRef)
      await commands.updateFolderHeaders(path, hasHeaders ? headersRecord : null)
    }

    // 4. Reload Collection to sync tree in UI
    await loadCollection(collectionPath)

    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl flex flex-col h-[520px] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              {type === 'collection' ? 'Collection Settings' : 'Folder Settings'}
            </h3>
            <span className="text-xs text-text-muted mt-0.5 block truncate max-w-[360px]">
              {name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex px-6 border-b border-border-subtle bg-bg-panel/40">
          <button
            onClick={() => setActiveTab('auth')}
            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'auth'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Authentication
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'headers'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Custom Headers
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {activeTab === 'auth' && (
            <div className="space-y-5">
              {/* Switch Type Confirmation Prompt */}
              {pendingAuthType && (
                <div className="bg-warning-muted/10 border border-warning/30 rounded p-4 flex flex-col gap-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-warning mt-0.5"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <div className="text-xs text-text-primary font-medium">
                      Switching auth type will clear the current{' '}
                      {authType === 'api_key' ? 'API Key' : 'Bearer Token'} configuration. Continue?
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={cancelSwitch}
                      className="px-2.5 py-1 bg-bg-muted hover:bg-bg-highlight text-[11px] font-medium text-text-secondary rounded transition-colors"
                    >
                      Revert
                    </button>
                    <button
                      onClick={confirmSwitch}
                      className="px-2.5 py-1 bg-warning hover:bg-warning/80 text-[11px] font-medium text-text-inverse rounded transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Auth Type
                </label>
                <select
                  value={authType}
                  onChange={(e) =>
                    handleAuthTypeChange(e.target.value as 'none' | 'api_key' | 'bearer_token')
                  }
                  className="w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors"
                  disabled={!!pendingAuthType}
                >
                  <option value="none">
                    {type === 'folder' ? 'Inherit Auth (No Auth)' : 'No Auth'}
                  </option>
                  <option value="api_key">API Key</option>
                  <option value="bearer_token">Bearer Token</option>
                </select>
              </div>

              {/* API Key Form */}
              {authType === 'api_key' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Key Name
                    </label>
                    <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                      <VariableInput
                        value={apiKeyName}
                        onChange={setApiKeyName}
                        placeholder="e.g. X-API-Key"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Key Value
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                        <VariableInput
                          value={apiKeyValue}
                          onChange={setApiKeyValue}
                          placeholder="e.g. secret_value or {{my_key}}"
                          masked={isApiKeyMasked}
                          type={isApiKeyMasked ? 'password' : 'text'}
                        />
                      </div>
                      <button
                        onClick={() => setIsApiKeyMasked(!isApiKeyMasked)}
                        className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                        title={isApiKeyMasked ? 'Show key value' : 'Hide key value'}
                      >
                        {isApiKeyMasked ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                      Add To
                    </label>
                    <select
                      value={apiKeyAddTo}
                      onChange={(e) => setApiKeyAddTo(e.target.value)}
                      className="w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors"
                    >
                      <option value="header">Header</option>
                      <option value="query">Query Parameter</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Bearer Token Form */}
              {authType === 'bearer_token' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Bearer Token
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                        <VariableInput
                          value={bearerToken}
                          onChange={setBearerToken}
                          placeholder="e.g. your_token or {{my_token}}"
                          masked={isBearerMasked}
                          type={isBearerMasked ? 'password' : 'text'}
                        />
                      </div>
                      <button
                        onClick={() => setIsBearerMasked(!isBearerMasked)}
                        className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                        title={isBearerMasked ? 'Show token' : 'Hide token'}
                      >
                        {isBearerMasked ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'headers' && (
            <div className="space-y-4 flex flex-col h-full min-h-0">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Configured Headers
                </span>
                <button
                  onClick={() => setHeaders([...headers, { key: '', value: '' }])}
                  className="px-2.5 py-1 bg-bg-muted hover:bg-bg-highlight border border-border-default rounded text-[11px] font-medium text-text-primary transition-colors flex items-center gap-1.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Header
                </button>
              </div>

              {headers.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border-subtle rounded-lg p-6 bg-bg-panel/10">
                  <span className="text-xs text-text-muted text-center max-w-[280px]">
                    No custom headers configured. These headers will automatically apply to all
                    child folders and requests.
                  </span>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto border border-border-subtle rounded bg-bg-panel/20 p-2 space-y-2 max-h-[280px]">
                  {headers.map((h, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="flex-1 h-8 border border-border-default hover:border-border-strong focus-within:border-accent rounded bg-bg-surface overflow-hidden">
                        <VariableInput
                          value={h.key}
                          onChange={(k) => {
                            const newHeaders = [...headers]
                            newHeaders[i].key = k
                            setHeaders(newHeaders)
                          }}
                          placeholder="Header Key (e.g. X-Org-ID)"
                        />
                      </div>
                      <div className="flex-1 h-8 border border-border-default hover:border-border-strong focus-within:border-accent rounded bg-bg-surface overflow-hidden">
                        <VariableInput
                          value={h.value}
                          onChange={(v) => {
                            const newHeaders = [...headers]
                            newHeaders[i].value = v
                            setHeaders(newHeaders)
                          }}
                          placeholder="Header Value"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setHeaders(headers.filter((_, idx) => idx !== i))
                        }}
                        className="h-8 w-8 bg-bg-muted hover:bg-bg-highlight border border-border-default rounded flex items-center justify-center text-error hover:text-error/80 transition-colors"
                        title="Delete Header"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border-subtle bg-bg-panel/40">
          <button
            onClick={onClose}
            className="h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-8 px-5 text-sm font-semibold bg-accent hover:bg-accent-hover text-accent-fg rounded transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
