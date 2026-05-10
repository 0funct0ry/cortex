import React from 'react'
import { LayoutGrid, Plus } from 'lucide-react'

interface SidebarProps {
  children: React.ReactNode
  onAddCollection?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ children, onAddCollection }) => {
  return (
    <div className="flex flex-col h-full w-72">
      <div className="px-4 py-3 border-b border-slate-800/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Collections
          </span>
        </div>
        {onAddCollection && (
          <button
            onClick={onAddCollection}
            className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
            title="Create Collection"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">{children}</div>
    </div>
  )
}
