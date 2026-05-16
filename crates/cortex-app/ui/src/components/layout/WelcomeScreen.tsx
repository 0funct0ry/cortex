import React, { useState } from 'react'
import logo from '../../assets/logo.png'
import * as Icons from '../ui/Icons'
import CreateWorkspaceModal from '../ui/CreateWorkspaceModal'
import { useWorkspaceStore } from '../../stores/workspaceStore'

const WelcomeScreen: React.FC = () => {
  const { recentWorkspaces, loadWorkspace, openWorkspace } = useWorkspaceStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-bg-base p-8 animate-in fade-in duration-500">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={logo}
            alt="Cortex Logo"
            className="w-16 h-16 mb-4 select-none pointer-events-none drop-shadow-lg"
          />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-1">Cortex</h1>
          <p className="text-sm text-text-muted font-medium">API Development Environment</p>
        </div>

        {/* Primary Actions */}
        <div className="flex gap-3 mb-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-accent hover:bg-accent-hover text-accent-fg rounded-md text-sm transition-all shadow-sm active:scale-95"
          >
            <Icons.Plus size={16} />
            <span>Create workspace</span>
          </button>
          <button
            onClick={() => openWorkspace()}
            className="flex items-center gap-2 px-4 py-1.5 bg-bg-surface hover:bg-bg-muted border border-border-default text-text-primary rounded-md text-sm transition-all active:scale-95"
          >
            <Icons.Folder size={16} />
            <span>Open workspace</span>
          </button>
        </div>

        {/* Recent Workspaces */}
        {recentWorkspaces.length > 0 && (
          <div className="w-full max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Recent Workspaces
              </h2>
              <div className="flex-1 h-[1px] bg-border-subtle" />
            </div>
            <div className="space-y-1">
              {recentWorkspaces.map((ws) => (
                <button
                  key={ws.path}
                  onClick={() => loadWorkspace(ws.path)}
                  className="w-full group flex items-center gap-3 p-3 rounded-lg hover:bg-bg-surface border border-transparent hover:border-border-subtle transition-all text-left"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded bg-bg-muted text-text-secondary group-hover:bg-accent group-hover:text-accent-fg transition-colors">
                    <Icons.Workspace size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-text-primary truncate">
                      {ws.name}
                    </div>
                    <div className="text-xs text-text-muted truncate font-mono opacity-80">
                      {ws.path}
                    </div>
                  </div>
                  <Icons.ExternalLink
                    size={14}
                    className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateWorkspaceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}

export default WelcomeScreen
