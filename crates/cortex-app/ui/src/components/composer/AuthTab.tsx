/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react'
import { useRequestStore } from '../../stores/requestStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { useTabs } from '../../contexts/TabsContext'
import { VariableInput } from './VariableInput'
import * as Icons from '../ui/Icons'

import type { CollectionItem, Folder } from '../../bindings'

interface AuthTabProps {
  requestId: string
}

// Client-side helper to find effective auth
export function getEffectiveAuth(
  requestId: string,
  tabs: any[],
  collections: any,
  localAuth: any
): { auth: any; source: 'local' | 'folder' | 'collection' | 'none'; sourceName?: string } {
  if (localAuth && localAuth.type && localAuth.type !== 'none') {
    return { auth: localAuth, source: 'local' }
  }

  const tab = tabs.find((t) => t.id === requestId)
  if (!tab || !tab.collectionId) {
    return { auth: { type: 'none', config: {} }, source: 'none' }
  }

  const collection = collections[tab.collectionId]
  if (!collection) {
    return { auth: { type: 'none', config: {} }, source: 'none' }
  }

  const requestPath = tab.requestPath || ''
  const colPath = collection.path

  const ancestors: Folder[] = []
  const parts = requestPath.split('/')
  parts.pop() // remove request filename

  const findFolderByPath = (items: CollectionItem[], path: string): Folder | null => {
    for (const item of items) {
      if (item.type === 'Folder') {
        if (item.data.path === path) return item.data
        const found = findFolderByPath(item.data.items || [], path)
        if (found) return found
      }
    }
    return null
  }

  let currentPath = parts.join('/')
  while (currentPath.startsWith(colPath) && currentPath !== colPath) {
    const folder = findFolderByPath(collection.items || [], currentPath)
    if (folder) {
      ancestors.push(folder)
    }
    const p = currentPath.split('/')
    p.pop()
    currentPath = p.join('/')
  }

  for (const folder of ancestors) {
    if (
      folder.manifest &&
      folder.manifest.auth &&
      folder.manifest.auth.type &&
      folder.manifest.auth.type !== 'none'
    ) {
      return {
        auth: {
          type: folder.manifest.auth.type,
          config: { ...folder.manifest.auth },
        },
        source: 'folder',
        sourceName: folder.name,
      }
    }
  }

  if (
    collection.manifest &&
    collection.manifest.auth &&
    collection.manifest.auth.type &&
    collection.manifest.auth.type !== 'none'
  ) {
    return {
      auth: {
        type: collection.manifest.auth.type,
        config: { ...collection.manifest.auth },
      },
      source: 'collection',
      sourceName: collection.name,
    }
  }

  return { auth: { type: 'none', config: {} }, source: 'none' }
}

const AuthTab: React.FC<AuthTabProps> = ({ requestId }) => {
  const { getRequestState, updateRequest } = useRequestStore()
  const { collections } = useCollectionStore()
  const { tabs } = useTabs()
  const activeEnvironmentName = useEnvironmentStore((s) => s.activeEnvironmentName)

  const requestData = getRequestState(requestId)
  const auth = useMemo(() => requestData?.auth || { type: 'none', config: {} }, [requestData?.auth])
  const config = useMemo(() => (auth.config || {}) as Record<string, string>, [auth.config])

  // Masking states
  const [isApiKeyMasked, setIsApiKeyMasked] = useState(true)
  const [isBearerMasked, setIsBearerMasked] = useState(true)
  const [isBasicPasswordMasked, setIsBasicPasswordMasked] = useState(true)
  const [isDigestPasswordMasked, setIsDigestPasswordMasked] = useState(true)

  // Switch warning states
  const [pendingType, setPendingType] = useState<string | null>(null)

  // Resolve effective auth
  const {
    auth: effectiveAuth,
    source,
    sourceName,
  } = useMemo(() => {
    return getEffectiveAuth(requestId, tabs, collections, auth)
  }, [requestId, tabs, collections, auth])

  const effectiveConfig = useMemo(
    () => (effectiveAuth.config || {}) as Record<string, string>,
    [effectiveAuth.config]
  )

  // Derived state to avoid synchronous state update in useEffect
  const bearerTokenVal = effectiveConfig.token || ''
  const showBearerPasteWarning =
    effectiveAuth.type === 'bearer_token' && bearerTokenVal.toLowerCase().startsWith('bearer ')

  // Detect conflicts with manually defined headers
  const headerConflictKey = useMemo(() => {
    const headers = requestData?.headers || []
    if (
      effectiveAuth.type === 'bearer_token' ||
      effectiveAuth.type === 'basic' ||
      effectiveAuth.type === 'digest'
    ) {
      const hasAuthHeader = headers.some(
        (h) => h.enabled && h.key.toLowerCase() === 'authorization'
      )
      return hasAuthHeader ? 'Authorization' : null
    }
    if (effectiveAuth.type === 'api_key') {
      const keyName = effectiveConfig.key || ''
      const placement = effectiveConfig.addTo || 'header'
      if (keyName && placement === 'header') {
        const hasConflict = headers.some(
          (h) => h.enabled && h.key.toLowerCase() === keyName.toLowerCase()
        )
        return hasConflict ? keyName : null
      }
    }
    return null
  }, [effectiveAuth, effectiveConfig, requestData])

  // Check for unresolved variables in active configuration
  const hasUnresolvedVariables = useMemo(() => {
    if (effectiveAuth.type === 'none') return false
    if (effectiveAuth.type === 'bearer_token') {
      const token = effectiveConfig.token || ''
      return token.includes('{{') && token.includes('}}')
    }
    if (effectiveAuth.type === 'api_key') {
      const key = effectiveConfig.key || ''
      const value = effectiveConfig.value || ''
      return (
        (key.includes('{{') && key.includes('}}')) || (value.includes('{{') && value.includes('}}'))
      )
    }
    if (effectiveAuth.type === 'basic' || effectiveAuth.type === 'digest') {
      const username = effectiveConfig.username || ''
      const password = effectiveConfig.password || ''
      return (
        (username.includes('{{') && username.includes('}}')) ||
        (password.includes('{{') && password.includes('}}'))
      )
    }
    return false
  }, [effectiveAuth, effectiveConfig])

  const handleTypeSelect = (type: string) => {
    if (type === auth.type) return

    // Guard if non-empty fields exist
    const hasFields =
      (auth.type === 'api_key' && (config.key || config.value)) ||
      (auth.type === 'bearer_token' && config.token) ||
      (auth.type === 'basic' && (config.username || config.password)) ||
      (auth.type === 'digest' && (config.username || config.password))

    if (hasFields) {
      setPendingType(type)
    } else {
      updateRequest(requestId, {
        auth: { type, config: type === 'api_key' ? { addTo: 'header' } : {} },
      })
    }
  }

  const confirmSwitch = () => {
    if (pendingType) {
      updateRequest(requestId, {
        auth: {
          type: pendingType,
          config: pendingType === 'api_key' ? { addTo: 'header' } : {},
        },
      })
      setPendingType(null)
    }
  }

  const handleConfigChange = (key: string, value: string) => {
    updateRequest(requestId, {
      auth: {
        ...auth,
        config: { ...config, [key]: value },
      },
    })
  }

  // Paste interceptor to catch "Bearer " prefix
  const handleBearerPaste = (_e: React.ClipboardEvent) => {
    // Handled automatically via derived state on token change
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
      {/* Visual Banners */}
      <div className="space-y-3">
        {/* Unresolved Variables Banner */}
        {hasUnresolvedVariables && !activeEnvironmentName && (
          <div className="bg-warning-muted/10 border border-warning/30 rounded p-3 flex items-start gap-2.5 animate-in fade-in duration-200">
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
            <div className="text-xs text-text-primary">
              Some auth values contain unresolved variables. Select an environment to resolve them.
            </div>
          </div>
        )}

        {/* Paste Warning Banner */}
        {showBearerPasteWarning && (
          <div className="bg-error-muted/10 border border-error/30 rounded p-3 flex items-start justify-between gap-2.5 animate-in fade-in duration-200">
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
                className="text-error mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="text-xs text-text-primary">
                Warning: Do not include the{' '}
                <code className="bg-bg-panel px-1 py-0.5 rounded font-mono text-[11px]">
                  Bearer{' '}
                </code>{' '}
                prefix manually in the Token field. Cortex handles this automatically when injecting
                the Authorization header.
              </div>
            </div>
            <button
              onClick={() => {
                const currentToken = effectiveConfig.token || ''
                if (currentToken.toLowerCase().startsWith('bearer ')) {
                  handleConfigChange('token', currentToken.substring(7).trim())
                }
              }}
              className="bg-error/15 hover:bg-error/25 text-error text-[10px] font-semibold uppercase px-2 py-1 rounded transition-colors shrink-0 select-none"
            >
              Clean Prefix
            </button>
          </div>
        )}

        {/* Header Conflict Banner */}
        {headerConflictKey && (
          <div className="bg-warning-muted/10 border border-warning/30 rounded p-3 flex items-start gap-2.5 animate-in fade-in duration-200">
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
            <div className="text-xs text-text-primary">
              A manually defined header/parameter{' '}
              <code className="bg-bg-panel px-1 py-0.5 rounded font-mono text-[11px]">
                {headerConflictKey}
              </code>{' '}
              conflicts with the active authentication configuration. The auth-managed value will
              take precedence.
            </div>
          </div>
        )}

        {/* Switch Confirm Prompt */}
        {pendingType && (
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
                {auth.type === 'api_key'
                  ? 'API Key'
                  : auth.type === 'bearer_token'
                    ? 'Bearer Token'
                    : auth.type === 'basic'
                      ? 'Basic Auth'
                      : auth.type === 'digest'
                        ? 'Digest Auth'
                        : 'No Auth'}{' '}
                configuration. Continue?
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setPendingType(null)}
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
      </div>

      {/* Inheritance Info Banner */}
      {source !== 'local' && source !== 'none' && (
        <div className="bg-bg-panel border border-border-subtle rounded p-3.5 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="bg-accent/10 text-accent font-semibold text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">
              Inherited
            </span>
            <span className="text-xs text-text-secondary">
              Using authentication config from {source === 'collection' ? 'Collection' : 'Folder'}:{' '}
              <strong className="text-text-primary">{sourceName}</strong>
            </span>
          </div>
          <button
            onClick={() => {
              // Override active: initialize local auth with the inherited config values
              updateRequest(requestId, {
                auth: {
                  type: effectiveAuth.type,
                  config: { ...effectiveConfig },
                },
              })
            }}
            className="text-[11px] text-accent hover:text-accent-hover font-semibold transition-colors"
          >
            Override local
          </button>
        </div>
      )}

      {/* Selector and fields */}
      <div className="max-w-lg space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Authentication Method
            </label>
            {source === 'local' && (
              <span className="text-[10px] bg-success/10 text-success font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
                Local Override
              </span>
            )}
          </div>
          <select
            value={auth.type}
            onChange={(e) => handleTypeSelect(e.target.value)}
            disabled={!!pendingType}
            className="w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors cursor-pointer"
          >
            <option value="none">
              {source !== 'local' && source !== 'none'
                ? `Inherit from ${source === 'collection' ? 'Collection' : 'Folder'} (${
                    effectiveAuth.type === 'api_key'
                      ? 'API Key'
                      : effectiveAuth.type === 'bearer_token'
                        ? 'Bearer Token'
                        : effectiveAuth.type === 'basic'
                          ? 'Basic Auth'
                          : effectiveAuth.type === 'digest'
                            ? 'Digest Auth'
                            : effectiveAuth.type
                  })`
                : 'No Auth'}
            </option>
            <option value="api_key">API Key</option>
            <option value="bearer_token">Bearer Token</option>
            <option value="basic">Basic Auth</option>
            <option value="digest">Digest Auth</option>
          </select>
        </div>

        {/* API Key Form */}
        {effectiveAuth.type === 'api_key' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Key Name
              </label>
              <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                <VariableInput
                  value={effectiveConfig.key || ''}
                  onChange={(val) => handleConfigChange('key', val)}
                  placeholder="e.g. X-API-Key"
                  readOnly={source !== 'local'}
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
                    value={effectiveConfig.value || ''}
                    onChange={(val) => handleConfigChange('value', val)}
                    placeholder="e.g. secret_value or {{my_key}}"
                    masked={isApiKeyMasked}
                    type={isApiKeyMasked ? 'password' : 'text'}
                    readOnly={source !== 'local'}
                  />
                </div>
                <button
                  onClick={() => setIsApiKeyMasked(!isApiKeyMasked)}
                  className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                  title={isApiKeyMasked ? 'Show value' : 'Hide value'}
                >
                  {isApiKeyMasked ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Add To
              </label>
              <select
                value={effectiveConfig.addTo || 'header'}
                onChange={(e) => handleConfigChange('addTo', e.target.value)}
                disabled={source !== 'local'}
                className="w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors cursor-pointer"
              >
                <option value="header">Header</option>
                <option value="query">Query Parameter</option>
              </select>
            </div>
          </div>
        )}

        {/* Bearer Token Form */}
        {effectiveAuth.type === 'bearer_token' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Token
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={effectiveConfig.token || ''}
                    onChange={(val) => handleConfigChange('token', val)}
                    onPaste={handleBearerPaste}
                    placeholder="e.g. secret_token or {{my_token}}"
                    masked={isBearerMasked}
                    type={isBearerMasked ? 'password' : 'text'}
                    readOnly={source !== 'local'}
                  />
                </div>
                <button
                  onClick={() => setIsBearerMasked(!isBearerMasked)}
                  className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                  title={isBearerMasked ? 'Show token' : 'Hide token'}
                >
                  {isBearerMasked ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Basic Auth Form */}
        {effectiveAuth.type === 'basic' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                <VariableInput
                  value={effectiveConfig.username || ''}
                  onChange={(val) => handleConfigChange('username', val)}
                  placeholder="Username or {{username_var}}"
                  readOnly={source !== 'local'}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={effectiveConfig.password || ''}
                    onChange={(val) => handleConfigChange('password', val)}
                    placeholder="Password or {{password_var}}"
                    masked={isBasicPasswordMasked}
                    type={isBasicPasswordMasked ? 'password' : 'text'}
                    readOnly={source !== 'local'}
                  />
                </div>
                <button
                  onClick={() => setIsBasicPasswordMasked(!isBasicPasswordMasked)}
                  className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                  title={isBasicPasswordMasked ? 'Show password' : 'Hide password'}
                >
                  {isBasicPasswordMasked ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Digest Auth Form */}
        {effectiveAuth.type === 'digest' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                <VariableInput
                  value={effectiveConfig.username || ''}
                  onChange={(val) => handleConfigChange('username', val)}
                  placeholder="Username or {{username_var}}"
                  readOnly={source !== 'local'}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={effectiveConfig.password || ''}
                    onChange={(val) => handleConfigChange('password', val)}
                    placeholder="Password or {{password_var}}"
                    masked={isDigestPasswordMasked}
                    type={isDigestPasswordMasked ? 'password' : 'text'}
                    readOnly={source !== 'local'}
                  />
                </div>
                <button
                  onClick={() => setIsDigestPasswordMasked(!isDigestPasswordMasked)}
                  className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                  title={isDigestPasswordMasked ? 'Show password' : 'Hide password'}
                >
                  {isDigestPasswordMasked ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {effectiveAuth.type === 'none' && (
          <div className="h-[120px] flex items-center justify-center border border-dashed border-border-subtle rounded-lg p-6 bg-bg-panel/10">
            <span className="text-xs text-text-muted text-center max-w-[280px]">
              No active authentication method configured. Choose an auth method above or configure
              settings on parent ancestors.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthTab
