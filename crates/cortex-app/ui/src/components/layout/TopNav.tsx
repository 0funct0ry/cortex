import React from 'react'
import * as Icons from '../ui/Icons'
import { useUIStore } from '../../stores/uiStore'

const TopNav: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <nav className="h-9 bg-bg-panel border-b border-border-subtle flex items-center px-2 gap-0 shrink-0">
      {/* Left Group */}
      <div className="flex items-center gap-1 pl-1">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded hover:bg-bg-muted text-text-secondary hover:text-text-primary transition-colors mr-1"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <Icons.SidebarToggle
            size={16}
            className={`transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`}
          />
        </button>

        <button className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-bg-muted transition-colors text-text-primary text-sm font-medium group">
          <Icons.Workspace className="text-text-secondary group-hover:text-text-primary" />
          <span>My Workspace</span>
          <Icons.ChevronDown className="text-text-muted" size={10} />
        </button>

        <div className="w-[1px] h-4 bg-border-subtle mx-1" />

        <button className="flex items-center gap-1.5 px-2 py-1 rounded border border-border-default hover:border-accent text-text-secondary text-[11px] transition-colors">
          No Environment
          <Icons.ChevronDown className="text-text-muted" size={10} />
        </button>
      </div>

      {/* Middle Placeholder */}
      <div className="flex-1" />

      {/* Right Group */}
      <div className="flex items-center gap-0.5 pr-2 shrink-0">
        <div className="flex items-center gap-1 px-2 py-1 rounded hover:bg-bg-muted text-text-secondary transition-colors cursor-pointer">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="font-mono text-[11px]">main</span>
        </div>

        <div className="w-[1px] h-4 bg-border-subtle mx-0.5" />

        <button
          title="Run collection"
          className="p-1.5 rounded hover:bg-bg-muted text-text-secondary hover:text-text-primary transition-colors"
        >
          <Icons.Play />
        </button>

        <div className="w-[1px] h-4 bg-border-subtle mx-0.5" />

        <button className="p-1.5 rounded hover:bg-bg-muted text-text-secondary hover:text-text-primary transition-colors">
          <Icons.Settings />
        </button>

        <button className="p-1.5 rounded hover:bg-bg-muted text-text-secondary hover:text-text-primary transition-colors">
          <Icons.MoreHorizontal />
        </button>
      </div>
    </nav>
  )
}

export default TopNav
