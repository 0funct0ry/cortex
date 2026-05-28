import React from 'react'
import { useResponseStore } from '../../stores/responseStore'
import type { ResponseTabId } from '../../stores/responseStore'
import { useRequestStore } from '../../stores/requestStore'

interface ResponseTabsProps {
  requestId: string
}

const ResponseTabs: React.FC<ResponseTabsProps> = ({ requestId }) => {
  const { getActiveTab, setActiveTab } = useResponseStore()
  const activeTab = getActiveTab(requestId)
  const requestData = useRequestStore((s) => s.getRequestState(requestId))
  const hasPostScript = requestData.scripts.post.trim() !== ''

  const tabs: { id: ResponseTabId; label: string }[] = [
    { id: 'pretty', label: 'Pretty' },
    { id: 'raw', label: 'Raw' },
    { id: 'preview', label: 'Preview' },
    { id: 'headers', label: 'Headers' },
    { id: 'timeline', label: 'Timeline' },
    ...(hasPostScript ? ([{ id: 'visualize', label: 'Visualize' }] as const) : []),
  ]

  return (
    <div className="h-8 border-b border-border-subtle bg-bg-panel flex items-center px-2 shrink-0">
      <div className="flex items-center h-full overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(requestId, tab.id)}
              className={`h-full px-3 text-[12px] transition-colors flex items-center gap-1 whitespace-nowrap relative group ${
                isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>{tab.label}</span>
              {isActive && <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-accent" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ResponseTabs
