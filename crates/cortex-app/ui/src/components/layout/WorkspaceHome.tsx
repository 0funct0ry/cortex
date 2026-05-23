import React, { useState, useEffect } from 'react'
import * as Icons from '../ui/Icons'
import { useTabs } from '../../contexts/TabsContext'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import WorkspaceOverview from './WorkspaceOverview'
import DocumentationPanel from './DocumentationPanel'
import EnvironmentsTab from './EnvironmentsTab'

type HomeTab = 'overview' | 'environments'

const STORAGE_KEY_HOME_TAB = 'cortex.home.activeTab'

const WorkspaceHome: React.FC = () => {
  const { openTab } = useTabs()
  const { activeWorkspacePath } = useWorkspaceStore()

  const [activeHomeTab, setActiveHomeTab] = useState<HomeTab>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HOME_TAB)
    return (saved === 'environments' ? 'environments' : 'overview') as HomeTab
  })

  // Reset to overview when workspace changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HOME_TAB, 'overview')
    setTimeout(() => {
      setActiveHomeTab('overview')
    }, 0)
  }, [activeWorkspacePath])

  const handleTabChange = (tab: HomeTab) => {
    setActiveHomeTab(tab)
    localStorage.setItem(STORAGE_KEY_HOME_TAB, tab)
  }

  const handleNewTab = () => {
    openTab({
      type: 'request',
      requestPath: null,
      collectionId: null,
      collectionPath: null,
      name: 'Untitled',
      method: 'GET',
    })
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300">
      {/* Workspace navigation tab bar */}
      <div className="h-9 bg-bg-panel border-b border-border-subtle flex items-stretch shrink-0">
        {/* Overview tab */}
        <button
          onClick={() => handleTabChange('overview')}
          className={`relative flex items-center px-4 h-full text-xs font-medium transition-colors border-r border-border-subtle select-none ${
            activeHomeTab === 'overview'
              ? 'bg-bg-surface text-text-primary'
              : 'text-text-secondary hover:bg-bg-muted hover:text-text-primary'
          }`}
        >
          Overview
          {activeHomeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
          )}
        </button>

        {/* Environments tab */}
        <button
          onClick={() => handleTabChange('environments')}
          className={`relative flex items-center px-4 h-full text-xs font-medium transition-colors border-r border-border-subtle select-none ${
            activeHomeTab === 'environments'
              ? 'bg-bg-surface text-text-primary'
              : 'text-text-secondary hover:bg-bg-muted hover:text-text-primary'
          }`}
        >
          Environments
          {activeHomeTab === 'environments' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
          )}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* New request tab button */}
        <div className="flex items-center px-2 shrink-0">
          <button
            onClick={handleNewTab}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors"
            title="New Tab (Cmd+N)"
          >
            <Icons.Plus size={18} />
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeHomeTab === 'overview' ? (
          <div className="flex h-full overflow-hidden">
            <WorkspaceOverview />
            <DocumentationPanel />
          </div>
        ) : (
          <EnvironmentsTab />
        )}
      </div>
    </div>
  )
}

export default WorkspaceHome
