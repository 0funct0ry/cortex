import React from 'react'
import { Menu, Settings, ChevronDown, Monitor } from 'lucide-react'
import { cn } from '../../lib/utils'

interface TopBarProps {
  workspaceName: string
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  onOpenVariables: () => void
  environmentName?: string
}

export const TopBar: React.FC<TopBarProps> = ({
  workspaceName,
  isSidebarOpen,
  onToggleSidebar,
  onOpenVariables,
  environmentName = 'No Environment',
}) => {
  return (
    <div className="flex items-center justify-between w-full px-4 h-full">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className={cn(
            'p-1.5 rounded-md hover:bg-slate-800 transition-colors',
            !isSidebarOpen && 'bg-blue-600/20 text-blue-400'
          )}
          title="Toggle Sidebar (⌘B)"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-blue-500/20">
            C
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-200">{workspaceName}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          onClick={onOpenVariables}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
          title="Switch Environment / Manage Variables"
        >
          <Monitor className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
          <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
            {environmentName}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-600" />
        </div>

        <button className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-md transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
