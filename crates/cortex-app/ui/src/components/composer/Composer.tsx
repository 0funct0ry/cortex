import React from 'react'
import UrlBar from '../layout/UrlBar'
import UrlPreviewBar from './UrlPreviewBar'
import ComposerTabs from './ComposerTabs'
import ParamsTab from './ParamsTab'
import HeadersTab from './HeadersTab'
import BodyTab from './BodyTab'
import AuthTab from './AuthTab'
import SettingsTab from './SettingsTab'
import CodeEditor from '../ui/CodeEditor'
import { useTabs } from '../../contexts/TabsContext'
import { useRequestStore } from '../../stores/requestStore'
import { useEnvironmentStore } from '../../stores/environmentStore'

const Composer: React.FC = () => {
  const { activeTabId, activeTab, setDirty } = useTabs()
  const { getRequestState, updateRequest, saveRequest, fetchResolvedVariables } = useRequestStore()

  const activeEnvironmentName = useEnvironmentStore((s) => s.activeEnvironmentName)
  const environments = useEnvironmentStore((s) => s.environments)
  const collectionId = activeTab?.collectionId || null

  React.useEffect(() => {
    if (activeTabId) {
      fetchResolvedVariables(activeTabId, collectionId)
    }
  }, [activeTabId, collectionId, activeEnvironmentName, environments, fetchResolvedVariables])

  const requestData = getRequestState(activeTabId || '')
  const activeComposerTab = requestData.activeComposerTab || 'params'
  const lastSavedData = React.useRef('')

  // Update lastSavedData when switching tabs
  React.useEffect(() => {
    if (!activeTabId) return
    const {
      activeComposerTab: _activeComposerTab,
      inFlight: _inFlight,
      requestId: _requestId,
      ...rest
    } = getRequestState(activeTabId)
    lastSavedData.current = JSON.stringify(rest)
  }, [activeTabId, getRequestState])

  // Set dirty state when request data changes
  React.useEffect(() => {
    if (!activeTabId) return
    const { activeComposerTab: _act, inFlight: _inf, requestId: _req, ...rest } = requestData
    const currentData = JSON.stringify(rest)

    if (lastSavedData.current && currentData !== lastSavedData.current) {
      if (activeTabId && activeTab && !activeTab.isDirty) {
        setDirty(activeTabId, true)
      }
    }
  }, [requestData, activeTabId, setDirty, activeTab])

  // Auto-save logic
  React.useEffect(() => {
    if (
      !activeTabId ||
      !activeTab ||
      !activeTab.requestPath ||
      activeTab.type !== 'request' ||
      !activeTab.isDirty
    )
      return

    const timer = setTimeout(async () => {
      try {
        await saveRequest(activeTabId, activeTab.requestPath!)
        const {
          activeComposerTab: _activeComposerTab,
          inFlight: _inFlight,
          requestId: _requestId,
          ...rest
        } = requestData
        lastSavedData.current = JSON.stringify(rest)
        setDirty(activeTabId, false)
      } catch (err) {
        console.error('Auto-save failed', err)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [requestData, activeTab, activeTabId, saveRequest, setDirty])

  const renderContent = () => {
    if (!activeTabId) return null

    switch (activeComposerTab) {
      case 'params':
        return <ParamsTab requestId={activeTabId} />
      case 'headers':
        return <HeadersTab requestId={activeTabId} />
      case 'body':
        return <BodyTab requestId={activeTabId} />
      case 'auth':
        return <AuthTab requestId={activeTabId} />
      case 'vars':
        return (
          <div className="p-4 text-sm text-text-muted italic">
            Variable overrides are not yet implemented
          </div>
        )
      case 'script':
        return (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="h-8 border-b border-border-subtle bg-bg-panel/50 px-4 flex items-center shrink-0">
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Pre-request Script
              </span>
            </div>
            <div className="flex-1 border-b border-border-subtle overflow-hidden">
              <CodeEditor
                value={requestData.scripts.pre}
                onChange={(pre) =>
                  updateRequest(activeTabId, { scripts: { ...requestData.scripts, pre } })
                }
                language="javascript"
              />
            </div>
            <div className="h-8 border-b border-border-subtle bg-bg-panel/50 px-4 flex items-center shrink-0">
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Post-response Script
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                value={requestData.scripts.post}
                onChange={(post) =>
                  updateRequest(activeTabId, { scripts: { ...requestData.scripts, post } })
                }
                language="javascript"
              />
            </div>
          </div>
        )
      case 'assert':
        return (
          <div className="p-4 text-sm text-text-muted italic">
            Assertions are not yet implemented
          </div>
        )
      case 'tests':
        return (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="h-8 border-b border-border-subtle bg-bg-panel/50 px-4 flex items-center shrink-0">
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Test Script
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                value={requestData.tests}
                onChange={(tests) => updateRequest(activeTabId, { tests })}
                language="javascript"
              />
            </div>
          </div>
        )
      case 'docs':
        return (
          <div className="p-4 text-sm text-text-muted italic">
            Documentation is not yet implemented
          </div>
        )
      case 'file':
        return (
          <div className="p-4 text-sm text-text-muted italic">
            File configuration is not yet implemented
          </div>
        )
      case 'settings':
        return <SettingsTab requestId={activeTabId} />
      default:
        return <div className="p-4">Content for {activeComposerTab}</div>
    }
  }

  if (!activeTabId) return null

  return (
    <div className="h-full flex flex-col">
      <UrlBar />
      <UrlPreviewBar requestId={activeTabId} />
      <ComposerTabs requestId={activeTabId} />
      <div className="flex-1 overflow-hidden bg-bg-surface">{renderContent()}</div>
    </div>
  )
}

export default Composer
