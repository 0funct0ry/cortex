import React, { useState, useRef, useEffect } from 'react'
import * as Icons from '../ui/Icons'
import Tooltip from '../ui/Tooltip'

export type Method =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'TRACE'
  | 'WS'
  | 'SSE'
  | 'gRPC'
  | 'GraphQL'

interface MethodSelectorProps {
  method: string
  onChange: (method: string) => void
}

const METHODS: { label: string; section: 'HTTP' | 'Protocol' }[] = [
  { label: 'GET', section: 'HTTP' },
  { label: 'POST', section: 'HTTP' },
  { label: 'PUT', section: 'HTTP' },
  { label: 'PATCH', section: 'HTTP' },
  { label: 'DELETE', section: 'HTTP' },
  { label: 'HEAD', section: 'HTTP' },
  { label: 'OPTIONS', section: 'HTTP' },
  { label: 'TRACE', section: 'HTTP' },
  { label: 'GraphQL', section: 'Protocol' },
  { label: 'gRPC', section: 'Protocol' },
  { label: 'WS', section: 'Protocol' },
  { label: 'SSE', section: 'Protocol' },
]

const getMethodColor = (method: string) => {
  const m = method.toUpperCase()
  if (m === 'GET') return 'text-method-get'
  if (m === 'POST') return 'text-method-post'
  if (m === 'PUT') return 'text-method-put'
  if (m === 'PATCH') return 'text-method-patch'
  if (m === 'DELETE') return 'text-method-delete'
  if (m === 'HEAD') return 'text-method-head'
  if (m === 'OPTIONS') return 'text-method-options'
  if (m === 'TRACE') return 'text-method-trace'
  if (m === 'GRAPHQL') return 'text-method-graphql'
  if (m === 'GRPC') return 'text-method-grpc'
  if (m === 'WS') return 'text-method-ws'
  if (m === 'SSE') return 'text-method-sse'
  return 'text-text-secondary'
}

const getMethodBg = (method: string) => {
  const m = method.toUpperCase()
  if (m === 'GET') return 'bg-method-get/10 border-method-get/30'
  if (m === 'POST') return 'bg-method-post/10 border-method-post/30'
  if (m === 'PUT') return 'bg-method-put/10 border-method-put/30'
  if (m === 'PATCH') return 'bg-method-patch/10 border-method-patch/30'
  if (m === 'DELETE') return 'bg-method-delete/10 border-method-delete/30'
  if (m === 'HEAD') return 'bg-method-head/10 border-method-head/30'
  if (m === 'OPTIONS') return 'bg-method-options/10 border-method-options/30'
  if (m === 'TRACE') return 'bg-method-trace/10 border-method-trace/30'
  if (m === 'GRAPHQL') return 'bg-method-graphql/10 border-method-graphql/30'
  if (m === 'GRPC') return 'bg-method-grpc/10 border-method-grpc/30'
  if (m === 'WS') return 'bg-method-ws/10 border-method-ws/30'
  if (m === 'SSE') return 'bg-method-sse/10 border-method-sse/30'
  return 'bg-bg-muted/50 border-border-subtle'
}

const MethodSelector: React.FC<MethodSelectorProps> = ({ method, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [customMethod, setCustomMethod] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = () => {
    const nextOpen = !isOpen
    setIsOpen(nextOpen)
    if (nextOpen) {
      const isStandard = METHODS.some((m) => m.label.toUpperCase() === method.toUpperCase())
      if (!isStandard) {
        setCustomMethod(method)
      } else {
        setCustomMethod('')
      }
    }
  }

  const handleSelect = (m: string) => {
    onChange(m)
    setIsOpen(false)
  }

  const sections = {
    HTTP: METHODS.filter((m) => m.section === 'HTTP'),
    Protocol: METHODS.filter((m) => m.section === 'Protocol'),
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip content="Change HTTP method or protocol" align="start">
        <button
          onClick={toggleDropdown}
          className={`w-[72px] h-[30px] rounded-md border flex items-center justify-between px-2 transition-colors ${getMethodBg(method)} ${getMethodColor(method)} text-[12px] font-bold`}
        >
          <span className="truncate uppercase">{method}</span>
          <Icons.ChevronDown size={10} className="text-text-muted shrink-0 ml-1" />
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-bg-overlay border border-border-subtle rounded-md shadow-lg py-1 z-50">
          <div className="px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
            HTTP Methods
          </div>
          {sections.HTTP.map((m) => (
            <button
              key={m.label}
              onClick={() => handleSelect(m.label)}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-bg-highlight flex items-center transition-colors ${getMethodColor(m.label)}`}
            >
              {m.label}
            </button>
          ))}

          <div className="h-[1px] bg-border-subtle my-1" />

          <div className="px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Protocols
          </div>
          {sections.Protocol.map((m) => (
            <button
              key={m.label}
              onClick={() => handleSelect(m.label)}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-bg-highlight flex items-center transition-colors ${getMethodColor(m.label)}`}
            >
              {m.label}
            </button>
          ))}

          <div className="h-[1px] bg-border-subtle my-1" />

          <div className="px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Custom Method
          </div>
          <div className="px-3 py-1.5 flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="e.g. PURGE"
              className="w-full h-7 bg-bg-surface border border-border-default rounded px-2 text-xs font-mono uppercase focus:outline-none focus:border-border-strong text-text-primary"
              value={customMethod}
              onChange={(e) => setCustomMethod(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const trimmed = customMethod.trim()
                  if (trimmed) {
                    handleSelect(trimmed)
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const trimmed = customMethod.trim()
                if (trimmed) {
                  handleSelect(trimmed)
                }
              }}
              className="px-2 h-7 bg-bg-muted hover:bg-bg-highlight border border-border-default text-xs font-semibold rounded text-text-primary transition-colors shrink-0"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MethodSelector
