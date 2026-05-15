import React from 'react'
import type { ResponsePayload } from '../../stores/responseStore'

interface ResponseRawTabProps {
  response: ResponsePayload
}

const ResponseRawTab: React.FC<ResponseRawTabProps> = ({ response }) => {
  return (
    <div className="flex-1 overflow-auto bg-bg-surface p-3 font-mono text-[12px] whitespace-pre-wrap select-text selection:bg-accent/30">
      {response.body}
    </div>
  )
}

export default ResponseRawTab
