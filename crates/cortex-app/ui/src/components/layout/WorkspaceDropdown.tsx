import React, { useEffect, useRef } from 'react'
import * as Icons from '../ui/Icons'
import { useWorkspaceStore } from '../../stores/workspaceStore'

interface WorkspaceDropdownProps {
  onClose: () => void
  onCreateClick: () => void
}

const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = ({ onClose, onCreateClick }) => {
  const { recentWorkspaces, activeWorkspacePath, loadWorkspace, openWorkspace } =
    useWorkspaceStore()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleWorkspaceClick = (path: string) => {
    loadWorkspace(path)
    onClose()
  }

  const handleOpenClick = () => {
    openWorkspace()
    onClose()
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-9 left-0 w-[240px] bg-bg-overlay border border-border-subtle rounded-md shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
        Workspaces
      </div>

      <div className="max-h-[200px] overflow-y-auto">
        {recentWorkspaces.map((ws) => (
          <button
            key={ws.path}
            onClick={() => handleWorkspaceClick(ws.path)}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-text-primary hover:bg-bg-highlight group transition-colors"
          >
            <Icons.Workspace size={14} className="text-text-muted group-hover:text-text-primary" />
            <span className="flex-1 text-left truncate">{ws.name}</span>
            {ws.path === activeWorkspacePath && <span className="text-accent text-xs">✓</span>}
          </button>
        ))}
      </div>

      <div className="h-[1px] bg-border-subtle my-1" />

      <button
        onClick={() => {
          onCreateClick()
          onClose()
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-text-primary hover:bg-bg-highlight group transition-colors"
      >
        <Icons.Plus size={14} className="text-text-muted group-hover:text-text-primary" />
        <span>Create workspace</span>
      </button>

      <button
        onClick={handleOpenClick}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-text-primary hover:bg-bg-highlight group transition-colors"
      >
        <Icons.Folder size={14} className="text-text-muted group-hover:text-text-primary" />
        <span>Open workspace</span>
      </button>

      {/* Import Placeholder */}
      <button
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-text-primary hover:bg-bg-highlight group transition-colors"
        onClick={handleOpenClick}
      >
        <Icons.Download size={14} className="text-text-muted group-hover:text-text-primary" />
        <span>Import workspace</span>
      </button>

      <div className="h-[1px] bg-border-subtle my-1" />

      <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-text-primary hover:bg-bg-highlight group transition-colors">
        <Icons.Settings size={14} className="text-text-muted group-hover:text-text-primary" />
        <span>Manage workspaces</span>
      </button>
    </div>
  )
}

export default WorkspaceDropdown
