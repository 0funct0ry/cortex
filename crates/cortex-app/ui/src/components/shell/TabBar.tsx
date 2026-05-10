import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { getMethodColor } from '../../lib/methods'

export interface Tab {
  id: string
  name: string
  method: string
  path?: string
  isScratch?: boolean
}

interface TabBarProps {
  tabs: Tab[]
  activeTabId: string | null
  onSelectTab: (id: string) => void
  onCloseTab: (id: string) => void
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTabId, onSelectTab, onCloseTab }) => {
  return (
    <div className="flex items-center bg-[#020617] border-b border-slate-800 h-10 overflow-x-auto no-scrollbar shrink-0">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={cn(
            'group relative flex items-center gap-2 px-4 h-full min-w-[120px] max-w-[200px] cursor-pointer transition-all border-r border-slate-800/50',
            activeTabId === tab.id
              ? 'bg-slate-900/50 text-white'
              : 'bg-transparent text-slate-500 hover:bg-slate-900/30 hover:text-slate-300'
          )}
        >
          {activeTabId === tab.id && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          )}

          <span
            className={cn(
              'text-[9px] font-black uppercase px-1 rounded-sm shrink-0',
              getMethodColor(tab.method)
            )}
          >
            {tab.method}
          </span>

          <span className="text-xs font-medium truncate flex-1">{tab.name}</span>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onCloseTab(tab.id)
            }}
            className={cn(
              'p-0.5 rounded-sm hover:bg-slate-700 transition-colors shrink-0',
              activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
