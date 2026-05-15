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

  return (
    <div className="flex-1 overflow-auto bg-bg-surface">
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
            <HeaderRow key={name} name={name} value={value} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

const HeaderRow: React.FC<{ name: string; value: string; index: number }> = ({
  name,
  value,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`${name}: ${value}`)
  }

  return (
    <tr
      className={`group h-8 border-b border-border-subtle/50 transition-colors ${
        index % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-muted/30'
      } hover:bg-bg-highlight`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="px-4 py-1 font-mono text-[12px] text-text-secondary select-text">{name}</td>
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
