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

const UrlBar: React.FC = () => {
  const { activeTab, activeTabId } = useTabs()
  const { activeWorkspacePath } = useWorkspaceStore()
  const { getRequestState, updateRequest, setInFlight } = useRequestStore()
  const { setResponse } = useResponseStore()
  const tabState = activeTabId ? getRequestState(activeTabId) : null

  // Initialize state from tab if not present
  useEffect(() => {
    if (activeTabId && activeTab && !tabState) {
      updateRequest(activeTabId, {
        url: '',
        method: activeTab.method,
      })
    }
  }, [activeTabId, activeTab, updateRequest, tabState])

  const handleSend = useCallback(async () => {
    if (!activeTabId || !activeTab || !tabState || tabState.inFlight) return

    const url = tabState.url.trim()
    if (!url) return

    setInFlight(activeTabId, true, 'pending')

    const startTime = Date.now()

    try {
      // Gathers all fields from the store
      const payload = {
        request_name: activeTab.name,
        method: tabState.method,
        url: url,
        headers: tabState.headers.filter((h) => h.enabled),
        body: tabState.body.type !== 'none' ? tabState.body.text : null,
      }

      const result = await commands.sendRequest(
        payload,
        activeWorkspacePath,
        activeTab.collectionId || null,
        null, // environment
        activeTab.requestPath
      )

      if (result.status === 'ok') {
        const durationMs = Date.now() - startTime
        const data = result.data

        setResponse(activeTabId, {
          requestId: activeTabId,
          status: data.status_code || 200,
          statusText: data.status_code === 200 ? 'OK' : 'Unknown', // In real app, this comes from backend
          headers: data.headers || {},
          body: data.response_body || '',
          durationMs: durationMs,
          bodySize: data.response_body ? new Blob([data.response_body]).size : 0,
        })
      } else {
        console.error('Request failed:', result.error)
      }
    } catch (err) {
      console.error('IPC Error:', err)
    } finally {
      setInFlight(activeTabId, false, null)
    }
  }, [activeTabId, activeTab, tabState, setInFlight, activeWorkspacePath, setResponse])

  const handleCancel = useCallback(() => {
    if (!activeTabId || !tabState?.requestId) return
    // TODO: invoke("cancel_request", { requestId: tabState.requestId })
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
