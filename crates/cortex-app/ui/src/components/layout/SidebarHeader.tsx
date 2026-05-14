import React from 'react'
import * as Icons from '../ui/Icons'

const SidebarHeader: React.FC = () => {
  return (
    <div className="h-8 flex items-center justify-between px-3 bg-bg-panel shrink-0 select-none">
      <span className="text-text-secondary text-[11px] font-semibold uppercase tracking-wider">
        Collections
      </span>
      <div className="flex items-center gap-1">
        <button className="p-1 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors">
          <Icons.Search size={14} />
        </button>
        <button className="p-1 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors">
          <Icons.Plus size={14} />
        </button>
        <button className="p-1 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors">
          <Icons.MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  )
}

export default SidebarHeader
