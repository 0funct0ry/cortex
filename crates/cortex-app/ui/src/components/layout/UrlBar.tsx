import React, { useEffect, useCallback } from 'react'
import * as Icons from '../ui/Icons'
import MethodSelector from '../composer/MethodSelector'
import UrlInput from '../composer/UrlInput'
import SendButton from '../composer/SendButton'
import Tooltip from '../ui/Tooltip'
import { useTabs } from '../../contexts/TabsContext'
import { useRequestStore } from '../../stores/requestStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useResponseStore } from '../../stores/responseStore'
import { commands } from '../../bindings'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { toast } from '../../stores/toastStore'

const UrlBar: React.FC = () => {
  const { activeTab, activeTabId } = useTabs()
  const { activeWorkspacePath } = useWorkspaceStore()
  const { updateRequest, setInFlight } = useRequestStore()
  const { setResponse } = useResponseStore()
  const tabState = useRequestStore((s) =>
    activeTabId ? s.requestStates[activeTabId] || s.getRequestState(activeTabId) : null
  )

  const handleSend = useCallback(async () => {
    if (!activeTabId || !activeTab || !tabState || tabState.inFlight) return

    const url = tabState.url.trim()
    if (!url) return

    try {
      const { activeEnvironmentName } = useEnvironmentStore.getState()
      const requestId = crypto.randomUUID()
      setInFlight(activeTabId, true, requestId)

      // Gathers all fields from the store
      const payload = {
        request_id: requestId,
        request_name: activeTab.name,
        method: tabState.method,
        url: url,
        headers: tabState.headers.filter((h) => h.enabled),
        body: tabState.body.type !== 'none' ? tabState.body.text : null,
      }

      const metadata = {
        workspace_path: activeWorkspacePath,
        collection_path: activeTab.collectionId || null,
        environment_name: activeEnvironmentName,
        request_path: activeTab.requestPath,
      }

      const result = await commands.sendRequest(payload, metadata)

      if (result.status === 'ok') {
        const data = result.data

        setResponse(activeTabId, {
          requestId: activeTabId,
          status: data.status_code || 0,
          statusText: data.status_text || (data.error ? 'Error' : 'Unknown'),
          headers: data.headers || {},
          body: data.response_body || '',
          durationMs: data.duration_ms || 0,
          bodySize: data.response_body ? new Blob([data.response_body]).size : 0,
          error: data.error || undefined,
        })
      } else {
        setResponse(activeTabId, {
          requestId: activeTabId,
          status: 0,
          statusText: 'Error',
          headers: {},
          body: '',
          durationMs: 0,
          bodySize: 0,
          error: result.error,
        })
      }
    } catch (err) {
      toast.error(`IPC Error: ${String(err)}`)
    } finally {
      setInFlight(activeTabId, false, null)
    }
  }, [activeTabId, activeTab, tabState, setInFlight, activeWorkspacePath, setResponse])

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSend()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSend])

  if (!activeTabId || !tabState) return null

  return (
    <div className="h-11 border-b border-border-subtle flex items-center px-2 gap-2 shrink-0 bg-bg-panel">
      <MethodSelector
        method={tabState.method}
        onChange={(m) => updateRequest(activeTabId, { method: m })}
      />

      <UrlInput
        value={tabState.url}
        onChange={(v) => updateRequest(activeTabId, { url: v })}
        onEnter={handleSend}
      />

      <div className="flex items-center gap-1">
        <Tooltip content="Generate code snippet">
          <button
            onClick={() => {}} // Story 03a.14
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

      <SendButton inFlight={tabState.inFlight} onSend={handleSend} onCancel={handleCancel} />
    </div>
  )
}

export default UrlBar
