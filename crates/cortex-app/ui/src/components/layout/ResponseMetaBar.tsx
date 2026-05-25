import React from 'react'
import * as Icons from '../ui/Icons'
import Tooltip from '../ui/Tooltip'
import type { ResponsePayload } from '../../stores/responseStore'
import { commands } from '../../bindings'

interface ResponseMetaBarProps {
  response: ResponsePayload | null
  inFlight: boolean
  requestId: string
}

const ResponseMetaBar: React.FC<ResponseMetaBarProps> = ({ response, inFlight }) => {
  const [showRedirects, setShowRedirects] = React.useState(false)
  const popoverRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowRedirects(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-success-muted text-success border-success/20'
    if (status >= 300 && status < 400) return 'bg-warning-muted text-warning border-warning/20'
    return 'bg-error-muted text-error border-error/20'
  }

  const getTimeColor = (ms: number) => {
    if (ms <= 200) return 'text-success'
    if (ms <= 1000) return 'text-warning'
    return 'text-error'
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleCopy = () => {
    if (response?.body) {
      navigator.clipboard.writeText(response.body)
    }
  }

  const handleSave = async () => {
    if (!response) return
    try {
      const result = await commands.saveFile('Save Response Body', 'All Files', '*', null)
      if (result.status === 'ok' && result.data) {
        // TODO: Backend should handle writing the file
        console.log('Save to:', result.data)
      }
    } catch (err) {
      console.error('Failed to save response:', err)
    }
  }

  return (
    <div className="h-9 border-b border-border-subtle flex items-center px-3 gap-4 shrink-0 bg-bg-panel">
      {inFlight ? (
        <div className="flex items-center gap-3 w-full">
          <div className="h-5 w-16 bg-bg-muted rounded animate-pulse" />
          <div className="h-4 w-12 bg-bg-muted rounded animate-pulse" />
          <div className="h-4 w-12 bg-bg-muted rounded animate-pulse" />
        </div>
      ) : response ? (
        <>
          <div className="flex items-center gap-2 relative" ref={popoverRef}>
            {response.redirectChain && response.redirectChain.length > 0 ? (
              <>
                <button
                  onClick={() => setShowRedirects(!showRedirects)}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11px] font-semibold border bg-warning/10 text-warning border-warning/20 hover:bg-warning/20 transition-colors select-none"
                >
                  <span>
                    {response.redirectChain.length}{' '}
                    {response.redirectChain.length === 1 ? 'redirect' : 'redirects'}
                  </span>
                  <Icons.ChevronDown
                    size={10}
                    className={`transform transition-transform ${showRedirects ? 'rotate-180' : ''}`}
                  />
                  <span>→</span>
                  <span
                    className={`font-extrabold px-1.5 py-0.2 rounded-sm border ${getStatusColor(response.status)}`}
                  >
                    {response.status}
                  </span>
                </button>

                {showRedirects && (
                  <div className="absolute top-full left-0 mt-1 w-80 bg-bg-overlay border border-border-subtle rounded-md shadow-lg z-50 p-3 flex flex-col gap-2 font-sans text-xs">
                    <div className="font-semibold text-text-primary border-b border-border-subtle pb-1">
                      Redirect History
                    </div>
                    <div className="max-h-60 overflow-y-auto flex flex-col gap-1.5 no-scrollbar">
                      {response.redirectChain.map((hop, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 py-1 border-b border-border-subtle/30 last:border-b-0 font-mono text-[11px]"
                        >
                          <span className="text-[10px] text-text-muted shrink-0">#{i + 1}</span>
                          <span className="text-[10px] font-bold uppercase px-1 py-0.2 bg-bg-muted rounded text-accent shrink-0">
                            {hop.method}
                          </span>
                          <span
                            className="truncate text-text-primary flex-1 max-w-[150px]"
                            title={hop.url}
                          >
                            {hop.url}
                          </span>
                          <span
                            className={`font-bold shrink-0 text-[11px] ${
                              hop.status_code >= 200 && hop.status_code < 300
                                ? 'text-success'
                                : hop.status_code >= 300 && hop.status_code < 400
                                  ? 'text-warning'
                                  : 'text-error'
                            }`}
                          >
                            {hop.status_code}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <span
                className={`px-1.5 py-0.5 rounded-sm text-[11px] font-bold border ${getStatusColor(response.status)}`}
              >
                {response.status}
              </span>
            )}
            <span className="text-sm text-text-secondary font-medium">{response.statusText}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span
                className={`text-[11px] font-mono leading-tight ${getTimeColor(response.durationMs)}`}
              >
                {response.durationMs} ms
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-mono leading-tight text-text-muted">
                {formatSize(response.bodySize)}
              </span>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            <Tooltip content="Copy raw response" position="left">
              <button
                onClick={handleCopy}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors"
              >
                <Icons.Copy size={14} />
              </button>
            </Tooltip>
            <Tooltip content="Save response body" position="left">
              <button
                onClick={handleSave}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors"
              >
                <Icons.Download size={14} />
              </button>
            </Tooltip>
          </div>
        </>
      ) : (
        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
          Response
        </span>
      )}
    </div>
  )
}

export default ResponseMetaBar
