import React, { useMemo } from 'react'
import type { ResponsePayload } from '../../stores/responseStore'

interface ResponsePreviewTabProps {
  response: ResponsePayload
}

const ResponsePreviewTab: React.FC<ResponsePreviewTabProps> = ({ response }) => {
  const contentType = (
    response.headers['content-type'] ||
    response.headers['Content-Type'] ||
    ''
  ).toLowerCase()
  const isHtml = contentType.includes('text/html')
  const isImage = contentType.includes('image/')

  const previewUrl = useMemo(() => {
    if (isImage) {
      // In a real app, you might need to handle base64 or blob for images
      // For now, if body is a URL or base64 data URI it might work
      return response.body
    }
    if (isHtml) {
      const blob = new Blob([response.body], { type: 'text/html' })
      return URL.createObjectURL(blob)
    }
    return null
  }, [response.body, isHtml, isImage])

  if (!isHtml && !isImage) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
        No preview available for this content type
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white h-full">
      {isImage ? (
        <div className="flex items-center justify-center h-full p-4">
          <img
            src={previewUrl || ''}
            alt="Response preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ) : (
        <iframe
          src={previewUrl || ''}
          title="Response preview"
          className="w-full h-full border-none"
          sandbox="allow-same-origin"
        />
      )}
    </div>
  )
}

export default ResponsePreviewTab
