import React, { useState, useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import RequestTabBar from './RequestTabBar'
import UrlBar from './UrlBar'
import ComposerTabs from '../composer/ComposerTabs'
import Sidebar from './Sidebar'
import { useUIStore } from '../../stores/uiStore'
import { useTabs } from '../../contexts/TabsContext'

import * as Icons from '../ui/Icons'

const STORAGE_KEY_MAIN = 'cortex.layout.main'
const STORAGE_KEY_EDITOR = 'cortex.layout.editor'

const ResizeHandle: React.FC<{ orientation?: 'horizontal' | 'vertical'; hidden?: boolean }> = ({
  orientation = 'vertical',
  hidden = false,
}) => {
  if (hidden) return null
  return (
    <PanelResizeHandle
      className={`relative flex items-center justify-center bg-border-subtle hover:bg-border-default transition-colors ${
        orientation === 'vertical'
          ? 'w-[4px] h-full cursor-col-resize'
          : 'h-[4px] w-full cursor-row-resize'
      }`}
    />
  )
}

const PanelShell: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { tabs } = useTabs()

  const [mainLayout, setMainLayout] = useState<number[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MAIN)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved main layout', e)
      }
    }
    return [20, 80] // Default Sidebar: 20%
  })

  const [editorLayout, setEditorLayout] = useState<number[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EDITOR)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved editor layout', e)
      }
    }
    return [55, 45] // Default Composer: 55% of remaining
  })

  // Keyboard shortcut for toggling sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  const onMainLayout = (sizes: number[]) => {
    setMainLayout(sizes)
    localStorage.setItem(STORAGE_KEY_MAIN, JSON.stringify(sizes))
  }

  const onEditorLayout = (sizes: number[]) => {
    setEditorLayout(sizes)
    localStorage.setItem(STORAGE_KEY_EDITOR, JSON.stringify(sizes))
  }

  return (
    <main className="flex-1 overflow-hidden bg-bg-base">
      <PanelGroup direction="horizontal" onLayout={onMainLayout}>
        {/* SIDEBAR */}
        {!sidebarCollapsed && (
          <>
            <Panel
              id="sidebar"
              order={1}
              defaultSize={mainLayout[0]}
              minSize={15}
              maxSize={35}
              className="bg-bg-panel transition-[width] duration-200"
            >
              <Sidebar />
            </Panel>
            <ResizeHandle />
          </>
        )}

        {/* CONTENT AREA */}
        <Panel id="content" order={2} defaultSize={sidebarCollapsed ? 100 : mainLayout[1]}>
          <div className="h-full flex flex-col">
            <RequestTabBar />

            {tabs.length > 0 ? (
              <div className="flex-1 overflow-hidden">
                <PanelGroup direction="horizontal" onLayout={onEditorLayout}>
                  {/* COMPOSER */}
                  <Panel
                    id="composer"
                    order={1}
                    defaultSize={editorLayout[0]}
                    minSize={30}
                    className="bg-bg-base"
                  >
                    <div className="h-full flex flex-col">
                      <UrlBar />
                      <ComposerTabs />
                      <div className="flex-1 overflow-y-auto bg-bg-surface">
                        {/* Composer Content Placeholder */}
                        <div className="p-4 italic opacity-50">Composer content...</div>
                      </div>
                    </div>
                  </Panel>

                  <ResizeHandle />

                  {/* RESPONSE */}
                  <Panel
                    id="response"
                    order={2}
                    defaultSize={editorLayout[1]}
                    minSize={20}
                    maxSize={70}
                    className="bg-bg-panel"
                  >
                    <div className="h-full flex flex-col">
                      <div className="h-9 border-b border-border-subtle flex items-center px-3 shrink-0">
                        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                          Response
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center p-4">
                        {/* Response Placeholder */}
                        <div className="opacity-20">
                          <Icons.Rocket size={80} strokeWidth={1} className="rotate-45" />
                        </div>
                        <div className="mt-4 text-center">
                          <div className="text-text-muted text-xs grid grid-cols-2 gap-x-4 gap-y-1">
                            <span className="text-right">Send Request</span>
                            <span className="text-left font-mono">Cmd + Enter</span>
                            <span className="text-right">New Request</span>
                            <span className="text-left font-mono">Cmd + B</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Panel>
                </PanelGroup>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-bg-base select-none">
                <div className="opacity-10 mb-8">
                  <Icons.Rocket size={120} strokeWidth={0.5} className="rotate-45" />
                </div>
                <div className="text-center">
                  <h2 className="text-text-secondary text-lg font-medium mb-2">
                    Ready to explore?
                  </h2>
                  <p className="text-text-muted text-sm max-w-[300px] mb-8">
                    Select a request from the sidebar or create a new one to get started.
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-text-muted/60">
                    <span className="text-right">New Request</span>
                    <span className="text-left font-mono">Cmd + N</span>
                    <span className="text-right">Search Everything</span>
                    <span className="text-left font-mono">Cmd + P</span>
                    <span className="text-right">Toggle Sidebar</span>
                    <span className="text-left font-mono">Cmd + \</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </main>
  )
}

export default PanelShell
