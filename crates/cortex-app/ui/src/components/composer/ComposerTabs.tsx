import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useRequestStore } from '../../stores/requestStore'
import type { ComposerTabId } from '../../stores/requestStore'
import * as Icons from '../ui/Icons'

interface ComposerTabsProps {
  requestId: string
}

const ComposerTabs: React.FC<ComposerTabsProps> = ({ requestId }) => {
  const { getRequestState, updateRequest } = useRequestStore()
  const requestData = getRequestState(requestId)
  const activeTab = requestData.activeComposerTab || 'params'

  const containerRef = useRef<HTMLDivElement>(null)
  const [hasOverflow, setHasOverflow] = useState(false)
  const [showOverflowMenu, setShowOverflowMenu] = useState(false)

  const tabs: { id: ComposerTabId; label: string }[] = useMemo(
    () => [
      { id: 'params', label: 'Params' },
      {
        id: 'body',
        label:
          requestData.body.type && requestData.body.type !== 'none'
            ? `Body · ${
                requestData.body.type === 'form-data'
                  ? 'Form-Data'
                  : requestData.body.type === 'url-encoded'
                    ? 'URL-Encoded'
                    : requestData.body.type.toUpperCase()
              }`
            : 'Body',
      },
      { id: 'headers', label: 'Headers' },
      { id: 'auth', label: 'Auth' },
      { id: 'vars', label: 'Vars' },
      { id: 'script', label: 'Script' },
      { id: 'assert', label: 'Assert' },
      { id: 'tests', label: 'Tests' },
      { id: 'docs', label: 'Docs' },
      { id: 'file', label: 'File' },
      { id: 'settings', label: 'Settings' },
    ],
    [requestData.body.type]
  )

  const getCount = (tabId: ComposerTabId) => {
    switch (tabId) {
      case 'params':
        return requestData.params.filter((p) => p.enabled).length || null
      case 'headers':
        return requestData.headers.filter((h) => h.enabled).length || null
      case 'vars':
        // Assuming vars are HeaderEntry[] too if we use them for overrides
        return 0 // Placeholder
      case 'assert':
        return 0 // Placeholder
      default:
        return null
    }
  }

  const hasDot = (tabId: ComposerTabId) => {
    switch (tabId) {
      case 'body':
        return (
          (requestData.body.type && requestData.body.type !== 'none') ||
          (requestData.body.json && requestData.body.json.length > 0) ||
          (requestData.body.rawText && requestData.body.rawText.length > 0) ||
          (requestData.body.formFields && requestData.body.formFields.length > 0) ||
          (requestData.body.urlEncodedFields && requestData.body.urlEncodedFields.length > 0) ||
          requestData.body.filePath !== null
        )
      case 'auth':
        return requestData.auth.type !== 'none'
      case 'script':
        return requestData.scripts.pre.length > 0 || requestData.scripts.post.length > 0
      case 'tests':
        return requestData.tests.length > 0
      default:
        return false
    }
  }

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        setHasOverflow(containerRef.current.scrollWidth > containerRef.current.clientWidth + 1)
      }
    }

    const observer = new ResizeObserver(checkOverflow)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    checkOverflow()
    return () => observer.disconnect()
  }, [tabs, requestData])

  return (
    <div className="h-9 border-b border-border-subtle bg-bg-panel flex items-center px-2 shrink-0 relative">
      <div
        ref={containerRef}
        className="flex items-center h-full overflow-x-hidden no-scrollbar flex-1 min-w-0 max-w-full"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const count = getCount(tab.id)
          const dot = hasDot(tab.id)

          return (
            <button
              key={tab.id}
              onClick={() => updateRequest(requestId, { activeComposerTab: tab.id })}
              className={`h-full px-3 text-sm transition-colors flex items-center gap-1 whitespace-nowrap relative group ${
                isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>{tab.label}</span>
              {count !== null && (
                <span className="text-[10px] text-text-muted align-top leading-none -mt-1.5">
                  {count}
                </span>
              )}
              {dot && <div className="w-1.5 h-1.5 rounded-full bg-accent ml-0.5" />}
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />}
            </button>
          )
        })}
      </div>

      {hasOverflow && (
        <div className="flex items-center bg-bg-panel z-10 pl-1 border-l border-border-subtle h-full ml-1">
          <button
            onClick={() => setShowOverflowMenu(!showOverflowMenu)}
            className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors rounded-sm hover:bg-bg-muted"
          >
            <Icons.ChevronsRight size={14} />
          </button>
        </div>
      )}

      {showOverflowMenu && (
        <div className="absolute top-full right-2 mt-1 w-48 bg-bg-overlay border border-border-subtle rounded-md shadow-lg z-50 py-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                updateRequest(requestId, { activeComposerTab: tab.id })
                setShowOverflowMenu(false)
              }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-bg-highlight transition-colors flex items-center justify-between ${
                activeTab === tab.id ? 'text-accent' : 'text-text-primary'
              }`}
            >
              <span>{tab.label}</span>
              <div className="flex items-center gap-1.5">
                {getCount(tab.id) !== null && (
                  <span className="text-[10px] text-text-muted">{getCount(tab.id)}</span>
                )}
                {hasDot(tab.id) && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ComposerTabs
