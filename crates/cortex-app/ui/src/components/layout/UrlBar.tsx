import React, { useEffect, useCallback, useMemo } from 'react'
import * as Icons from '../ui/Icons'
import MethodSelector from '../composer/MethodSelector'
import UrlInput from '../composer/UrlInput'
import SendButton from '../composer/SendButton'
import Tooltip from '../ui/Tooltip'
import { useTabs } from '../../contexts/TabsContext'
import { useRequestStore } from '../../stores/requestStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useResponseStore, type ResponsePayload } from '../../stores/responseStore'
import { runPostResponseScript } from '../../utils/scriptRunner'
import { commands } from '../../bindings'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { useCollectionEnvironmentStore } from '../../stores/collectionEnvironmentStore'
import { toast } from '../../stores/toastStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useUIStore } from '../../stores/uiStore'
import { getEffectiveAuth } from '../composer/AuthTab'

const UrlBar: React.FC = () => {
  const { tabs, activeTab, activeTabId, updateTab } = useTabs()
  const { openSaveToCollectionDialog, openGenerateCodeModal } = useUIStore()
  const { activeWorkspacePath } = useWorkspaceStore()
  const { updateRequest, setInFlight } = useRequestStore()
  const { setResponse, setVisualization, clearVisualization } = useResponseStore()
  const tabState = useRequestStore((s) =>
    activeTabId ? s.requestStates[activeTabId] || s.getRequestState(activeTabId) : null
  )
  const { collections } = useCollectionStore()

  const { disabled, disabledReason } = useMemo(() => {
    if (!activeTabId || !tabState) return { disabled: false }
    const localAuth = tabState.auth || { type: 'none', config: {} }
    const { auth: effectiveAuth } = getEffectiveAuth(activeTabId, tabs, collections, localAuth)
    const effectiveConfig = (effectiveAuth.config || {}) as Record<string, string>

    if (effectiveAuth.type === 'bearer_token') {
      const token = effectiveConfig.token || ''
      if (!token.trim()) {
        return { disabled: true, disabledReason: 'Bearer Token is empty' }
      }
    } else if (effectiveAuth.type === 'api_key') {
      const key = effectiveConfig.key || ''
      const value = effectiveConfig.value || ''
      if (!key.trim() || !value.trim()) {
        return { disabled: true, disabledReason: 'API Key auth is incomplete' }
      }
    }
    return { disabled: false }
  }, [activeTabId, tabState, tabs, collections])

  const handleSend = useCallback(async () => {
    if (!activeTabId || !activeTab || !tabState || tabState.inFlight) return

    const url = tabState.url.trim()
    if (!url) return

    try {
      const { activeEnvironmentName } = useEnvironmentStore.getState()
      const collectionPathForEnv = activeTab.collectionId || null
      const collectionEnvironmentName = collectionPathForEnv
        ? (useCollectionEnvironmentStore.getState().activeCollectionEnvName[collectionPathForEnv] ??
          null)
        : null
      const requestId = crypto.randomUUID()
      setInFlight(activeTabId, true, requestId)
      clearVisualization(activeTabId)

      // Normalize body type: frontend uses kebab-case, backend executor expects snake_case
      const normalizeBodyType = (t: string) =>
        t === 'form-data' ? 'form_data' : t === 'url-encoded' ? 'url_encoded' : t

      // Flatten nested UI store auth configuration to the flat AuthRef expected by backend
      let authPayload = null
      if (tabState.auth && tabState.auth.type !== 'none') {
        authPayload = {
          type: tabState.auth.type,
          ...tabState.auth.config,
        }
      }

      // Gathers all fields from the store
      const payload = {
        request_id: requestId,
        request_name: activeTab.name,
        method: tabState.method,
        url: url,
        headers: tabState.headers.filter(
          (h) => h.enabled && (h.key.trim() !== '' || h.value.trim() !== '')
        ),
        auth: authPayload,
        body:
          tabState.body.type !== 'none'
            ? {
                active_type: normalizeBodyType(tabState.body.type),
                json: tabState.body.type === 'json' ? tabState.body.json : null,
                raw_text: tabState.body.type === 'raw' ? tabState.body.rawText : null,
                raw_subtype: tabState.body.type === 'raw' ? tabState.body.rawSubtype : null,
                form_data:
                  tabState.body.type === 'form-data'
                    ? tabState.body.formFields.map((f) => ({
                        key: f.key,
                        value: f.value,
                        is_file: f.isFile,
                        file_path: f.filePath,
                        enabled: f.enabled,
                      }))
                    : null,
                url_encoded:
                  tabState.body.type === 'url-encoded'
                    ? tabState.body.urlEncodedFields.map((f) => ({
                        key: f.key,
                        value: f.value,
                        enabled: f.enabled,
                      }))
                    : null,
                file_path: tabState.body.type === 'file' ? tabState.body.filePath : null,
                file_filter: tabState.body.type === 'file' ? tabState.body.fileFilter : null,
                text: null,
                form: null,
              }
            : null,
        settings: {
          timeout: tabState.settings?.timeout || null,
          redirect_behavior:
            tabState.settings?.redirectBehavior === 'default'
              ? null
              : tabState.settings?.redirectBehavior || null,
        },
      }

      const metadata = {
        workspace_path: activeWorkspacePath,
        collection_path: activeTab.collectionId || null,
        environment_name: activeEnvironmentName,
        collection_environment_name: collectionEnvironmentName,
        request_path: activeTab.requestPath,
      }

      const result = await commands.sendRequest(payload, metadata)

      const runVisualization = (payload: ResponsePayload) => {
        const postScript = tabState.scripts.post.trim()
        if (postScript) {
          setVisualization(activeTabId, runPostResponseScript(postScript, payload))
        }
      }

      if (result.status === 'ok') {
        const data = result.data

        const responsePayload: ResponsePayload = {
          requestId: activeTabId,
          status: data.status_code || 0,
          statusText: data.status_text || (data.error ? 'Error' : 'Unknown'),
          headers: data.headers || {},
          body: data.response_body || '',
          durationMs: data.duration_ms || 0,
          bodySize: data.response_body ? new Blob([data.response_body]).size : 0,
          error: data.error || undefined,
          redirectChain: data.redirect_chain || undefined,
        }
        setResponse(activeTabId, responsePayload)
        runVisualization(responsePayload)

        if (tabState.method.toUpperCase() === 'HEAD') {
          useResponseStore.getState().setActiveTab(activeTabId, 'headers')
        }
      } else {
        const errorPayload: ResponsePayload = {
          requestId: activeTabId,
          status: 0,
          statusText: 'Error',
          headers: {},
          body: '',
          durationMs: 0,
          bodySize: 0,
          error: result.error,
        }
        setResponse(activeTabId, errorPayload)
        runVisualization(errorPayload)
      }
    } catch (err) {
      toast.error(`IPC Error: ${String(err)}`)
    } finally {
      setInFlight(activeTabId, false, null)
    }
  }, [
    activeTabId,
    activeTab,
    tabState,
    setInFlight,
    activeWorkspacePath,
    setResponse,
    setVisualization,
    clearVisualization,
  ])

  const handleCancel = useCallback(() => {
    if (!activeTabId || !tabState?.requestId) return
    commands.cancelRequest(tabState.requestId).catch(console.error)
    setInFlight(activeTabId, false, null)
  }, [activeTabId, tabState, setInFlight])

  const handleCopyUrl = () => {
    if (tabState?.url) {
      navigator.clipboard.writeText(tabState.url)
    }
  }

  // Keyboard shortcuts + command-palette "Send Request" action
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSend()
      }
    }
    const handleSendEvent = () => handleSend()
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('cortex:send-request', handleSendEvent)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('cortex:send-request', handleSendEvent)
    }
  }, [handleSend])

  if (!activeTabId || !tabState) return null

  return (
    <div className="min-h-11 border-b border-border-subtle flex items-center px-2 gap-2 shrink-0 bg-bg-panel py-1.5">
      <MethodSelector
        method={tabState.method}
        onChange={(m) => {
          updateRequest(activeTabId, { method: m })
          updateTab(activeTabId, { method: m })
        }}
      />

      <UrlInput
        value={tabState.url}
        onChange={(v) => updateRequest(activeTabId, { url: v })}
        onEnter={handleSend}
      />

      <div className="flex items-center gap-1">
        {activeTab?.type === 'request' && !activeTab.requestPath && (
          <Tooltip content="Save to collection">
            <button
              onClick={() => activeTabId && openSaveToCollectionDialog(activeTabId)}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors"
            >
              <Icons.Folder size={14} />
            </button>
          </Tooltip>
        )}
        <Tooltip content="Generate code snippet">
          <button
            onClick={() =>
              activeTab?.requestPath &&
              openGenerateCodeModal(
                activeTab.requestPath,
                activeTab.name || '',
                activeTab.collectionId ?? null
              )
            }
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors"
          >
            <Icons.Code size={14} />
          </button>
        </Tooltip>
        <Tooltip content="Copy URL">
          <button
            onClick={handleCopyUrl}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors"
          >
            <Icons.Copy size={14} />
          </button>
        </Tooltip>
      </div>

      <SendButton
        inFlight={tabState.inFlight}
        onSend={handleSend}
        onCancel={handleCancel}
        disabled={disabled}
        disabledReason={disabledReason}
      />
    </div>
  )
}

export default UrlBar
