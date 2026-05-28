import React, { useEffect } from 'react'
import type { ResponsePayload } from '../../stores/responseStore'

interface ResponsePreviewTabProps {
  response: ResponsePayload
}

const ResponsePreviewTab: React.FC<ResponsePreviewTabProps> = ({ response }) => {
  const rawContentType = response.headers['content-type'] || response.headers['Content-Type'] || ''
  const contentType = rawContentType.toLowerCase()

  const isHtml = contentType.includes('text/html')
  const isSvg =
    contentType.includes('image/svg+xml') ||
    (!contentType && response.body.trimStart().toLowerCase().startsWith('<svg'))
  // Excludes SVG so image/svg+xml is never treated as a raster image
  const isRasterImage = !isSvg && contentType.includes('image/')

  const needsBlobUrl = isHtml || isSvg
  const blobUrl = React.useMemo(() => {
    if (!needsBlobUrl) {
      return null
    }
    const mimeType = isSvg ? 'image/svg+xml' : 'text/html'
    const blob = new Blob([response.body], { type: mimeType })
    return URL.createObjectURL(blob)
  }, [response.body, needsBlobUrl, isSvg])

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [blobUrl])

  if (!isHtml && !isSvg && !isRasterImage) {
    const displayType = rawContentType || 'unknown'
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-sm gap-2 p-8 text-center">
        <p>
          No preview available for{' '}
          <span className="font-mono text-text-secondary">{displayType}</span>.
        </p>
        <p>Use the Pretty or Raw tab to inspect this response.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white h-full">
      {isRasterImage ? (
        <div className="flex items-center justify-center h-full p-8 text-center">
          <p className="text-text-muted text-sm">
            Image preview requires binary response support.
            <br />
            Use the Pretty or Raw tab to inspect this response.
          </p>
        </div>
      ) : isSvg ? (
        <div className="flex items-center justify-center h-full p-4">
          {blobUrl && (
            <img src={blobUrl} alt="SVG preview" className="max-w-full max-h-full object-contain" />
          )}
        </div>
      ) : (
        // Empty sandbox blocks scripts, same-origin Tauri access, forms, and popups.
        // Do not render until blobUrl is ready — src="" triggers an unwanted page reload.
        blobUrl && (
          <iframe
            src={blobUrl}
            title="Response preview"
            className="w-full h-full border-none"
            sandbox=""
          />
        )
      )}
    </div>
  )
}

export default ResponsePreviewTab
