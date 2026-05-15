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
      const result = await commands.saveFile('Save Response Body', 'All Files', '*')
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
          <div className="flex items-center gap-2">
            <span
              className={`px-1.5 py-0.5 rounded-sm text-[11px] font-bold border ${getStatusColor(response.status)}`}
            >
              {response.status}
            </span>
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
