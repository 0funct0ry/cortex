import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import * as Icons from './Icons'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { commands } from '../../bindings'

interface CreateWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('')
  const [path, setPath] = useState('')
  const { createWorkspace, isLoading } = useWorkspaceStore()

  if (!isOpen) return null

  const handlePickDirectory = async () => {
    const result = await commands.pickDirectory('Select Workspace Directory')
    if (result.status === 'ok' && result.data) {
      setPath(result.data)
    }
  }

  const handleCreate = async () => {
    if (!name || !path) return
    const success = await createWorkspace(name, path)
    if (success) {
      onClose()
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-base font-semibold text-text-primary mb-4">Create New Workspace</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase">
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Project Alpha"
              className="w-full h-8 bg-bg-surface border border-border-default focus:border-accent rounded px-2 text-sm text-text-primary outline-none transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase">
              Workspace Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={path}
                readOnly
                placeholder="Choose a directory..."
                className="flex-1 h-8 bg-bg-surface border border-border-default rounded px-2 text-sm text-text-primary outline-none"
              />
              <button
                onClick={handlePickDirectory}
                className="h-8 px-3 bg-bg-muted hover:bg-bg-highlight border border-border-default rounded text-xs font-medium text-text-primary transition-colors flex items-center gap-1.5"
              >
                <Icons.Folder size={14} />
                Browse
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name || !path || isLoading}
            className="h-8 px-4 text-sm font-medium bg-accent hover:bg-accent-hover text-accent-fg rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Workspace'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CreateWorkspaceModal
