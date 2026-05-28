import React, { useState, useMemo } from 'react'
import type { ResponsePayload } from '../../stores/responseStore'
import { parseMultipart } from '../../utils/multipart'
import * as Icons from '../ui/Icons'
import ResponsePrettyTab from './ResponsePrettyTab'
import ResponseRawTab from './ResponseRawTab'
import ResponsePreviewTab from './ResponsePreviewTab'
import ResponseHeadersTab from './ResponseHeadersTab'

interface ResponseMultipartViewProps {
  response: ResponsePayload
  globalActiveTab: string
}

const ResponseMultipartView: React.FC<ResponseMultipartViewProps> = ({
  response,
  globalActiveTab,
}) => {
  const [expandedParts, setExpandedParts] = useState<Record<number, boolean>>({ 0: true })
  const [partTabs, setPartTabs] = useState<
    Record<number, 'pretty' | 'raw' | 'preview' | 'headers'>
  >({})

  // Format byte size helper
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Parse the multipart content
  const { parts, parseError } = useMemo(() => {
    const contentType = response.headers['content-type'] || response.headers['Content-Type'] || ''
    try {
      const parsed = parseMultipart(response.body, contentType)
      return { parts: parsed, parseError: null }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      return { parts: [], parseError: errMsg }
    }
  }, [response.body, response.headers])

  const toggleExpand = (index: number) => {
    setExpandedParts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const setPartTab = (index: number, tab: 'pretty' | 'raw' | 'preview' | 'headers') => {
    setPartTabs((prev) => ({
      ...prev,
      [index]: tab,
    }))
  }

  // If parsing failed, render warning banner and fallback to raw response view.
  if (parseError) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-bg-surface h-full">
        <div className="m-3 p-4 bg-error/5 border border-error/20 rounded-md text-xs flex flex-col gap-2 animate-fade-in">
          <div className="flex items-center gap-2 text-error font-semibold uppercase tracking-wider text-[11px]">
            <Icons.AlertCircle size={14} />
            <span>Multipart Parsing Failed</span>
          </div>
          <div className="text-text-secondary leading-relaxed">
            Cortex failed to parse the multipart response body. The boundary parameter or structure
            may be malformed.
          </div>
          <div className="font-mono bg-bg-muted/50 p-2 rounded border border-border-subtle/50 text-[11px] text-error break-all">
            {parseError}
          </div>
          <div className="text-[10px] text-text-muted">Displaying the raw response body below.</div>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <ResponseRawTab response={response} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-bg-surface flex flex-col gap-3 h-full">
      {parts.map((part, index) => {
        const isExpanded = !!expandedParts[index]
        const partContentType =
          part.headers['content-type'] || part.headers['Content-Type'] || 'text/plain'
        const rawPartContentType = partContentType.split(';')[0].trim()
        const partBodyBytes = new Blob([part.body]).size

        // Determine default local tab matching global tab (pretty, raw, preview)
        const defaultLocalTab = ['pretty', 'raw', 'preview'].includes(globalActiveTab)
          ? (globalActiveTab as 'pretty' | 'raw' | 'preview')
          : 'pretty'

        const activeLocalTab = partTabs[index] || defaultLocalTab

        // Construct dummy ResponsePayload for reusing existing viewer components
        const partResponsePayload: ResponsePayload = {
          requestId: `${response.requestId}-part-${index}`,
          status: response.status,
          statusText: response.statusText,
          headers: part.headers,
          body: part.body,
          durationMs: 0,
          bodySize: partBodyBytes,
        }

        const renderPartContent = () => {
          switch (activeLocalTab) {
            case 'pretty':
              return <ResponsePrettyTab response={partResponsePayload} />
            case 'raw':
              return <ResponseRawTab response={partResponsePayload} />
            case 'preview':
              return <ResponsePreviewTab response={partResponsePayload} />
            case 'headers':
              return <ResponseHeadersTab response={partResponsePayload} />
            default:
              return null
          }
        }

        return (
          <div
            key={index}
            className="border border-border-subtle rounded-lg bg-bg-panel hover:border-border-subtle/80 transition-colors overflow-hidden flex flex-col shrink-0"
          >
            {/* Header / Accordion Trigger */}
            <div
              onClick={() => toggleExpand(index)}
              className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-bg-panel hover:bg-bg-highlight/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-semibold text-text-primary">Part {index + 1}</span>
                <span className="text-[10px] font-mono font-medium text-text-secondary bg-bg-surface border border-border-subtle/60 px-2 py-0.5 rounded-sm">
                  {rawPartContentType}
                </span>
                <span className="text-[10px] font-mono text-text-muted">
                  {formatSize(partBodyBytes)}
                </span>
              </div>
              <button className="text-text-muted hover:text-text-primary p-0.5 transition-colors">
                {isExpanded ? <Icons.ChevronUp size={14} /> : <Icons.ChevronDown size={14} />}
              </button>
            </div>

            {/* Expandable Section */}
            {isExpanded && (
              <div className="p-4 bg-bg-surface border-t border-border-subtle flex flex-col gap-3 animate-fade-in">
                {/* Local Tabs Switcher */}
                <div className="flex border-b border-border-subtle text-xs gap-4 shrink-0">
                  {(['pretty', 'raw', 'preview', 'headers'] as const).map((tabId) => {
                    const isActive = activeLocalTab === tabId
                    return (
                      <button
                        key={tabId}
                        onClick={(e) => {
                          e.stopPropagation()
                          setPartTab(index, tabId)
                        }}
                        className={`pb-1.5 text-[11px] font-medium transition-colors relative uppercase tracking-wider ${
                          isActive
                            ? 'text-accent font-semibold'
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {tabId}
                        {isActive && (
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Sub-pane viewer container (fixed height for editor/frames) */}
                <div className="h-[300px] border border-border-subtle/60 rounded-md overflow-hidden flex flex-col bg-bg-surface relative">
                  {renderPartContent()}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ResponseMultipartView
