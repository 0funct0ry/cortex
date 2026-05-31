import React, { useState, useEffect } from 'react'
import { commands } from '../../bindings'
import type { AuthRef, CollectionItem, Folder } from '../../bindings'
import { VariableInput } from '../composer/VariableInput'
import { useCollectionStore } from '../../stores/collectionStore'
import { toast } from '../../stores/toastStore'

interface FolderViewProps {
  folderPath: string
  collectionPath: string
  folderName: string
}

interface HeaderRow {
  key: string
  value: string
}

const FolderView: React.FC<FolderViewProps> = ({ folderPath, collectionPath, folderName }) => {
  const { collections, loadCollection } = useCollectionStore()

  const [activeTab, setActiveTab] = useState<'auth' | 'headers'>('auth')
  const [authType, setAuthType] = useState<'none' | 'api_key' | 'bearer_token'>('none')
  const [pendingAuthType, setPendingAuthType] = useState<
    'none' | 'api_key' | 'bearer_token' | null
  >(null)
  const [apiKeyName, setApiKeyName] = useState('')
  const [apiKeyValue, setApiKeyValue] = useState('')
  const [apiKeyAddTo, setApiKeyAddTo] = useState('header')
  const [bearerToken, setBearerToken] = useState('')
  const [isApiKeyMasked, setIsApiKeyMasked] = useState(true)
  const [isBearerMasked, setIsBearerMasked] = useState(true)
  const [headers, setHeaders] = useState<HeaderRow[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const col = collections[collectionPath]

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

  const folder = col ? findFolder(col.items || [], folderPath) : null
  const loadedAuth = folder?.manifest?.auth ?? null
  const loadedHeaders = folder?.manifest?.headers ?? null

  // Initial state synchronization
  const [lastLoadedAuth, setLastLoadedAuth] = useState<AuthRef | null>(null)
  const [lastLoadedHeaders, setLastLoadedHeaders] = useState<Record<string, string> | null>(null)

  if (loadedAuth !== lastLoadedAuth) {
    setLastLoadedAuth(loadedAuth)
    if (!loadedAuth) {
      setAuthType('none')
    } else {
      setAuthType(loadedAuth.type as 'none' | 'api_key' | 'bearer_token')
      if (loadedAuth.type === 'api_key') {
        setApiKeyName((loadedAuth as Record<string, string>).key || '')
        setApiKeyValue((loadedAuth as Record<string, string>).value || '')
        setApiKeyAddTo((loadedAuth as Record<string, string>).addTo || 'header')
      } else if (loadedAuth.type === 'bearer_token') {
        setBearerToken((loadedAuth as Record<string, string>).token || '')
      }
    }
  }

  if (loadedHeaders !== lastLoadedHeaders) {
    setLastLoadedHeaders(loadedHeaders)
    setHeaders(
      loadedHeaders ? Object.entries(loadedHeaders).map(([k, v]) => ({ key: k, value: v })) : []
    )
  }

  // Load existing manifest when the collection data is available
  useEffect(() => {
    if (!col) {
      loadCollection(collectionPath)
    }
  }, [col, collectionPath, loadCollection])

  const handleAuthTypeChange = (newType: 'none' | 'api_key' | 'bearer_token') => {
    if (newType === authType) return
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

  const handleSave = async () => {
    setIsSaving(true)
    try {
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

      const headersRecord: Record<string, string> = {}
      for (const h of headers) {
        if (h.key.trim()) headersRecord[h.key.trim()] = h.value
      }

      await commands.updateFolderAuth(folderPath, authRef)
      await commands.updateFolderHeaders(
        folderPath,
        Object.keys(headersRecord).length > 0 ? headersRecord : null
      )
      await loadCollection(collectionPath)
      toast.success('Folder settings saved')
    } catch (err) {
      toast.error(`Save failed: ${String(err)}`)
    } finally {
      setIsSaving(false)
    }
  }

  const TAB_BTN =
    'py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all'
  const TAB_ACTIVE = 'border-accent text-accent'
  const TAB_INACTIVE = 'border-transparent text-text-secondary hover:text-text-primary'

  return (
    <div className="h-full flex flex-col bg-bg-base">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border-subtle bg-bg-panel">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-text-primary">Folder Settings</h2>
          <p className="text-xs text-text-muted truncate mt-0.5">{folderName}</p>
        </div>
      </div>

      {/* Tab Strip */}
      <div className="flex px-6 border-b border-border-subtle bg-bg-panel/40">
        <button
          onClick={() => setActiveTab('auth')}
          className={`${TAB_BTN} ${activeTab === 'auth' ? TAB_ACTIVE : TAB_INACTIVE}`}
        >
          Authentication
        </button>
        <button
          onClick={() => setActiveTab('headers')}
          className={`${TAB_BTN} ${activeTab === 'headers' ? TAB_ACTIVE : TAB_INACTIVE}`}
        >
          Custom Headers
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        {activeTab === 'auth' && (
          <div className="space-y-5 max-w-lg">
            {pendingAuthType && (
              <div className="bg-warning-muted/10 border border-warning/30 rounded p-4 flex flex-col gap-3 animate-in fade-in duration-200">
                <div className="text-xs text-text-primary font-medium">
                  Switching auth type will clear the current{' '}
                  {authType === 'api_key' ? 'API Key' : 'Bearer Token'} configuration. Continue?
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setPendingAuthType(null)}
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
                disabled={!!pendingAuthType}
                className="w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors"
              >
                <option value="none">Inherit Auth (No Auth)</option>
                <option value="api_key">API Key</option>
                <option value="bearer_token">Bearer Token</option>
              </select>
            </div>

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
                      className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <EyeIcon masked={isApiKeyMasked} />
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
                      className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <EyeIcon masked={isBearerMasked} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-4 flex flex-col max-w-lg">
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
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Header
              </button>
            </div>

            {headers.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-dashed border-border-subtle rounded-lg p-6 bg-bg-panel/10 h-40">
                <span className="text-xs text-text-muted text-center max-w-[280px]">
                  No custom headers configured. These headers will automatically apply to all child
                  folders and requests.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {headers.map((h, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="flex-1 h-8 border border-border-default hover:border-border-strong focus-within:border-accent rounded bg-bg-surface overflow-hidden">
                      <VariableInput
                        value={h.key}
                        onChange={(k) => {
                          const next = [...headers]
                          next[i] = { ...next[i], key: k }
                          setHeaders(next)
                        }}
                        placeholder="Header Key"
                      />
                    </div>
                    <div className="flex-1 h-8 border border-border-default hover:border-border-strong focus-within:border-accent rounded bg-bg-surface overflow-hidden">
                      <VariableInput
                        value={h.value}
                        onChange={(v) => {
                          const next = [...headers]
                          next[i] = { ...next[i], value: v }
                          setHeaders(next)
                        }}
                        placeholder="Header Value"
                      />
                    </div>
                    <button
                      onClick={() => setHeaders(headers.filter((_, idx) => idx !== i))}
                      className="h-8 w-8 bg-bg-muted hover:bg-bg-highlight border border-border-default rounded flex items-center justify-center text-error hover:text-error/80 transition-colors"
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
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
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
          onClick={handleSave}
          disabled={isSaving}
          className="h-8 px-5 text-sm font-semibold bg-accent hover:bg-accent-hover text-accent-fg rounded transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

const EyeIcon: React.FC<{ masked: boolean }> = ({ masked }) =>
  masked ? (
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
  )

export default FolderView
