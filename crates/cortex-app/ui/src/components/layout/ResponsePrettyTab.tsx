import React, { useMemo } from 'react'
import type { ResponsePayload } from '../../stores/responseStore'
import CodeEditor from '../ui/CodeEditor'
import * as Icons from '../ui/Icons'

interface ResponsePrettyTabProps {
  response: ResponsePayload
}

const MAX_BODY_SIZE = 5 * 1024 * 1024 // 5 MB

const ResponsePrettyTab: React.FC<ResponsePrettyTabProps> = ({ response }) => {
  const language = useMemo((): 'json' | 'xml' | 'javascript' => {
    const contentType = response.headers['content-type'] || response.headers['Content-Type'] || ''
    if (contentType.includes('application/json')) return 'json'
    if (contentType.includes('application/xml') || contentType.includes('text/xml')) return 'xml'
    if (contentType.includes('text/html')) return 'xml'
    if (contentType.includes('javascript')) return 'javascript'
    return 'json'
  }, [response.headers])

  const isTooLarge = response.bodySize > MAX_BODY_SIZE

  if (isTooLarge) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-bg-muted p-4 rounded-full mb-4">
          <Icons.Info size={32} className="text-text-muted" />
        </div>
        <h3 className="text-text-primary font-medium mb-2">Response body too large to display</h3>
        <p className="text-text-muted text-sm max-w-xs mb-6">
          The response body is {(response.bodySize / (1024 * 1024)).toFixed(1)} MB, which exceeds
          the display limit of 5 MB.
        </p>
        <button
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-accent-fg rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          onClick={() => {
            /* TODO: Download logic */
          }}
        >
          <Icons.Download size={16} />
          Download Response
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden h-full">
      <CodeEditor value={response.body} onChange={() => {}} language={language} readOnly={true} />
    </div>
  )
}

export default ResponsePrettyTab
