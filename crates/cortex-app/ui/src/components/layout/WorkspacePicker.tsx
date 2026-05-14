import React, { useState } from 'react'
import * as Icons from '../ui/Icons'
import WorkspaceDropdown from './WorkspaceDropdown'
import CreateWorkspaceModal from '../ui/CreateWorkspaceModal'
import { useWorkspaceStore } from '../../stores/workspaceStore'

const WorkspacePicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { activeWorkspace } = useWorkspaceStore()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors text-sm font-medium group ${
          isOpen ? 'bg-bg-muted text-text-primary' : 'hover:bg-bg-muted text-text-primary'
        }`}
      >
        <Icons.Workspace className="text-text-secondary group-hover:text-text-primary" size={14} />
        <span>{activeWorkspace?.name || 'Select Workspace'}</span>
        <Icons.ChevronDown className="text-text-muted" size={10} />
      </button>

      {isOpen && (
        <WorkspaceDropdown
          onClose={() => setIsOpen(false)}
          onCreateClick={() => setIsModalOpen(true)}
        />
      )}

      {isModalOpen && (
        <CreateWorkspaceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}

export default WorkspacePicker
