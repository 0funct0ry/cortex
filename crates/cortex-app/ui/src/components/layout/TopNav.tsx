import React from 'react'
import * as Icons from '../ui/Icons'
import { useUIStore } from '../../stores/uiStore'
import WorkspacePicker from './WorkspacePicker'
import EnvironmentSwitcher from './EnvironmentSwitcher'

const TopNav: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <nav className="h-8 bg-bg-panel border-b border-border-subtle flex items-center px-2 gap-0 shrink-0">
      {/* Left Group */}
      <div className="flex items-center gap-1 pl-1">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-bg-muted text-text-secondary hover:text-text-primary transition-colors mr-1"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <Icons.SidebarToggle
            size={14}
            className={`transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`}
          />
        </button>

        <WorkspacePicker />
        <div className="w-[1px] h-4 bg-border-subtle mx-1" />
        {/* CollectionBreadcrumb placeholder */}
        <div className="text-[11px] text-text-muted">Collection / Folder</div>
      </div>

      {/* Tabs Placeholder */}
      <div className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="text-[11px] text-text-muted">Tabs area</div>
      </div>

      {/* Right Group */}
      <div className="flex items-center gap-0.5 pr-2 shrink-0">
        <div className="flex items-center gap-1 px-2 py-1 rounded hover:bg-bg-muted text-text-secondary transition-colors cursor-pointer group">
          <div className="w-1.5 h-1.5 rounded-full bg-success group-hover:shadow-[0_0_8px_var(--color-success)] transition-shadow" />
          <span className="font-mono text-[11px]">main</span>
        </div>

        <div className="w-[1px] h-4 bg-border-subtle mx-0.5" />

        <button
          title="Run collection"
          className="p-1.5 rounded hover:bg-bg-muted text-text-secondary hover:text-text-primary transition-colors"
        >
          <Icons.Play size={14} />
        </button>

        <div className="w-[1px] h-4 bg-border-subtle mx-0.5" />

        <EnvironmentSwitcher />

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
