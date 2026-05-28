import React, { useEffect } from 'react'
import { useResponseStore } from '../../stores/responseStore'

interface ResponseVisualizeTabProps {
  requestId: string
}

const BarChartIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="12" width="4" height="9" />
    <rect x="10" y="7" width="4" height="14" />
    <rect x="17" y="3" width="4" height="18" />
    <line x1="3" y1="21" x2="21" y2="21" />
  </svg>
)

const ResponseVisualizeTab: React.FC<ResponseVisualizeTabProps> = ({ requestId }) => {
  const { getVisualization } = useResponseStore()
  const visualization = getVisualization(requestId)

  const html = visualization?.html ?? null
  const error = visualization?.error ?? null

  const blobUrl = React.useMemo(() => {
    if (!html) return null
    const blob = new Blob([html], { type: 'text/html' })
    return URL.createObjectURL(blob)
  }, [html])

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [blobUrl])

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-lg bg-error/10 border border-error/30 rounded-md p-4">
          <p className="text-error text-[12px] font-semibold mb-2">Script Error</p>
          <pre className="text-error/80 text-[11px] font-mono whitespace-pre-wrap break-all">
            {error}
          </pre>
        </div>
      </div>
    )
  }

  if (!html) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="opacity-20 mb-6 text-text-muted">
          <BarChartIcon size={64} />
        </div>
        <p className="text-text-primary text-sm font-medium mb-1">No visualization set</p>
        <p className="text-text-muted text-[12px] mb-4 max-w-xs">
          Call <code className="font-mono text-accent">cortex.visualize.set(html)</code> in your
          post-response script to render a custom visualization here.
        </p>
        <pre className="text-[11px] font-mono bg-bg-muted border border-border-subtle rounded-md px-4 py-3 text-text-secondary text-left max-w-sm w-full">
          {`const data = cortex.response.json();\ncortex.visualize.set(\`\n  <html><body>\n    <h1>\${data.title}</h1>\n  </body></html>\`);`}
        </pre>
      </div>
    )
  }

  return (
    <div className="flex-1 h-full">
      {blobUrl && (
        <iframe
          src={blobUrl}
          title="Response visualization"
          className="w-full h-full border-none"
          sandbox="allow-scripts"
        />
      )}
    </div>
  )
}

export default ResponseVisualizeTab
