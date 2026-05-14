import React, { useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import RequestTabBar from './RequestTabBar'
import UrlBar from './UrlBar'

import * as Icons from '../ui/Icons'

const STORAGE_KEY_MAIN = 'cortex.layout.main'
const STORAGE_KEY_EDITOR = 'cortex.layout.editor'

const ResizeHandle: React.FC<{ orientation?: 'horizontal' | 'vertical' }> = ({
  orientation = 'vertical',
}) => {
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
        <Panel
          id="sidebar"
          order={1}
          defaultSize={mainLayout[0]}
          minSize={15}
          maxSize={35}
          className="bg-bg-panel"
        >
          <div className="h-full flex flex-col">
            <div className="h-9 border-b border-border-subtle flex items-center px-3 shrink-0">
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Collections
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 text-text-secondary text-sm">
              {/* Sidebar Content Placeholder */}
              <div className="italic opacity-50">Sidebar content...</div>
            </div>
          </div>
        </Panel>

        <ResizeHandle />

        {/* CONTENT AREA */}
        <Panel id="content" order={2} defaultSize={mainLayout[1]}>
          <div className="h-full flex flex-col">
            <RequestTabBar />
            <UrlBar />

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
                    <div className="flex-1 overflow-y-auto p-4">
                      {/* Composer Content Placeholder */}
                      <div className="italic opacity-50">Composer content...</div>
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
          </div>
        </Panel>
      </PanelGroup>
    </main>
  )
}

export default PanelShell
