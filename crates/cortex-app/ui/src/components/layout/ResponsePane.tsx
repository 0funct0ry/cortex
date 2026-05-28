import React from 'react'
import { useTabs } from '../../contexts/TabsContext'
import { useRequestStore } from '../../stores/requestStore'
import { useResponseStore } from '../../stores/responseStore'
import * as Icons from '../ui/Icons'
import ResponseMetaBar from './ResponseMetaBar'
import ResponseTabs from './ResponseTabs'
import ResponsePrettyTab from './ResponsePrettyTab'
import ResponseRawTab from './ResponseRawTab'
import ResponsePreviewTab from './ResponsePreviewTab'
import ResponseHeadersTab from './ResponseHeadersTab'

const ResponsePane: React.FC = () => {
  const { activeTabId } = useTabs()
  const { getRequestState } = useRequestStore()
  const { getResponse, getActiveTab } = useResponseStore()

  if (!activeTabId) return null

  const requestData = getRequestState(activeTabId)
  const response = getResponse(activeTabId)
  const activeTab = getActiveTab(activeTabId)

  const renderContent = () => {
    if (requestData.inFlight) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent/20 overflow-hidden">
            <div className="h-full bg-accent animate-progress-indeterminate" />
          </div>

          <div className="relative">
            <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
          </div>
          <span className="mt-4 text-sm text-text-muted animate-pulse">Sending request...</span>
        </div>
      )
    }

    if (response?.error) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-error-muted/10">
          <div className="bg-error/10 p-4 rounded-full mb-4">
            <Icons.AlertCircle size={40} className="text-error" />
          </div>
          <h3 className="text-text-primary font-medium mb-2 text-lg">Request Failed</h3>
          <p className="text-error font-mono text-sm max-w-md bg-bg-panel p-4 border border-border-subtle rounded-md break-all">
            {response.error}
          </p>
          <p className="mt-4 text-text-muted text-sm max-w-sm">
            Check your internet connection, the URL syntax, or the server status.
          </p>
        </div>
      )
    }

    if (!response) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 select-none">
          <div className="opacity-20 mb-6">
            <Icons.Rocket size={80} strokeWidth={1} className="rotate-45" />
          </div>
          <div className="text-center">
            <div className="text-text-secondary text-sm grid grid-cols-2 gap-x-8 gap-y-2">
              <span className="text-right">Send Request</span>
              <span className="text-left font-mono bg-bg-muted px-1.5 py-0.5 rounded text-xs">
                Cmd + Enter
              </span>
              <span className="text-right">New Request</span>
              <span className="text-left font-mono bg-bg-muted px-1.5 py-0.5 rounded text-xs">
                Cmd + B
              </span>
              <span className="text-right">Edit Environments</span>
              <span className="text-left font-mono bg-bg-muted px-1.5 py-0.5 rounded text-xs">
                Cmd + E
              </span>
            </div>
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case 'pretty':
        return <ResponsePrettyTab response={response} />
      case 'raw':
        return <ResponseRawTab response={response} />
      case 'preview':
        return <ResponsePreviewTab response={response} />
      case 'headers':
        return <ResponseHeadersTab response={response} />
      case 'timeline':
        return (
          <div className="p-4 text-sm text-text-muted italic">
            Timeline view is not yet implemented
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-bg-panel overflow-hidden">
      <ResponseMetaBar
        response={response}
        inFlight={requestData.inFlight}
        requestId={activeTabId}
      />
      {!requestData.inFlight && <ResponseTabs requestId={activeTabId} />}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-bg-surface">
        {renderContent()}
      </div>
    </div>
  )
}

export default ResponsePane
