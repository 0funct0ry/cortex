import React, { useMemo, useState } from 'react'
import type { ResponsePayload } from '../../stores/responseStore'
import * as Icons from '../ui/Icons'

interface ResponseHeadersTabProps {
  response: ResponsePayload
}

const ResponseHeadersTab: React.FC<ResponseHeadersTabProps> = ({ response }) => {
  const sortedHeaders = useMemo(() => {
    return Object.entries(response.headers).sort(([a], [b]) => a.localeCompare(b))
  }, [response.headers])

  const redirectLocation = useMemo(() => {
    if (response.status >= 300 && response.status < 400) {
      const locKey = Object.keys(response.headers).find((k) => k.toLowerCase() === 'location')
      return locKey ? response.headers[locKey] : null
    }
    return null
  }, [response.status, response.headers])

  return (
    <div className="flex-1 overflow-auto bg-bg-surface flex flex-col h-full">
      {redirectLocation && (
        <div className="m-3 p-3 bg-warning/5 border border-warning/20 rounded-md text-xs flex flex-col gap-1.5 animate-fade-in">
          <div className="flex items-center gap-1.5 text-warning font-semibold uppercase tracking-wider text-[10px]">
            <Icons.AlertCircle size={12} />
            <span>Redirect Response (Manual Mode)</span>
          </div>
          <div className="text-text-secondary leading-relaxed">
            The request stopped at a redirect response because{' '}
            <strong>Do not follow redirects</strong> is enabled. The server requested a redirection
            to:
          </div>
          <div
            className="font-mono bg-bg-muted/50 p-1.5 rounded border border-border-subtle/50 break-all select-all text-text-link hover:text-accent cursor-pointer transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(redirectLocation)
            }}
            title="Click to copy redirection URL"
          >
            {redirectLocation}
          </div>
          <div className="text-[10px] text-text-muted">
            Tip: You can enable "Follow all redirects" under the request Settings tab to traverse
            automatically.
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-bg-panel border-b border-border-subtle z-10">
            <tr>
              <th className="text-left px-4 py-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider w-1/3">
                Name
              </th>
              <th className="text-left px-4 py-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedHeaders.map(([name, value], index) => (
              <HeaderRow
                key={name}
                name={name}
                value={value}
                index={index}
                responseStatus={response.status}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const HeaderRow: React.FC<{
  name: string
  value: string
  index: number
  responseStatus: number
}> = ({ name, value, index, responseStatus }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`${name}: ${value}`)
  }

  const isLocationHeader = name.toLowerCase() === 'location'
  const isRedirectStatus = responseStatus >= 300 && responseStatus < 400

  return (
    <tr
      className={`group h-8 border-b border-border-subtle/50 transition-colors ${
        isLocationHeader && isRedirectStatus
          ? 'bg-warning/10 border-l-[3px] border-l-warning'
          : index % 2 === 0
            ? 'bg-bg-surface'
            : 'bg-bg-muted/30'
      } hover:bg-bg-highlight`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="px-4 py-1 font-mono text-[12px] text-text-secondary select-text">
        <div className="flex items-center gap-2">
          <span>{name}</span>
          {isLocationHeader && isRedirectStatus && (
            <span className="px-1 py-0.2 rounded-sm text-[8px] font-extrabold uppercase bg-warning text-text-inverse tracking-wider shrink-0">
              Redirect Location
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-1 font-mono text-[12px] text-text-primary select-text relative">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate">{value}</span>
          <button
            onClick={handleCopy}
            className={`p-1 rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-opacity ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            title="Copy header"
          >
            <Icons.Copy size={12} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ResponseHeadersTab
