import React from 'react'
import * as Icons from '../ui/Icons'

const SidebarFooter: React.FC = () => {
  return (
    <div className="h-9 flex items-center justify-between px-3 border-top border-border-subtle bg-bg-panel shrink-0 select-none">
      <div className="flex items-center gap-1.5">
        <Icons.FileText size={14} className="text-text-muted" />
        <span className="text-text-secondary text-[11px] font-semibold uppercase tracking-wider">
          API Specs
        </span>
      </div>
      <button
        className="p-1 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors"
        title="Coming soon"
      >
        <Icons.Plus size={14} />
      </button>
    </div>
  )
}

export default SidebarFooter
