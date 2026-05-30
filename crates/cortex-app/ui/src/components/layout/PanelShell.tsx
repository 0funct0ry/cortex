import React, { useState, useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import RequestTabBar from './RequestTabBar'
import Sidebar from './Sidebar'
import ResponsePane from './ResponsePane'
import EnvironmentsTab from './EnvironmentsTab'
import WorkspaceHome from './WorkspaceHome'
import Composer from '../composer/Composer'
import CollectionView from '../collection/CollectionView'
import NewRequestDialog from '../ui/NewRequestDialog'
import NewTransientRequestDialog from '../ui/NewTransientRequestDialog'
import SaveToCollectionDialog from '../ui/SaveToCollectionDialog'
import { useUIStore } from '../../stores/uiStore'
import { useTabs } from '../../contexts/TabsContext'

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
  const {
    sidebarCollapsed,
    toggleSidebar,
    newRequestDialog,
    dialogResetKey,
    openNewRequestDialog,
    closeNewRequestDialog,
    isNewTransientDialogOpen,
    newTransientDialogResetKey,
    openNewTransientDialog,
    closeNewTransientDialog,
    isSaveToCollectionDialogOpen,
    saveToCollectionTabId,
    saveToCollectionResetKey,
    closeSaveToCollectionDialog,
    layout,
    toggleLayout,
  } = useUIStore()
  const { tabs, activeTab, openTab } = useTabs()

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

  // Keyboard shortcut for environment editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault()
        openTab({
          type: 'environments',
          name: 'Environments',
          requestPath: null,
          collectionId: null,
          collectionPath: null,
          method: '',
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openTab])

  // Keyboard shortcut Cmd+Shift+N / Ctrl+Shift+N — New Request (saved to collection)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        openNewRequestDialog()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openNewRequestDialog])

  // Keyboard shortcut Cmd+B / Ctrl+B — New Transient Request dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'b') {
        e.preventDefault()
        openNewTransientDialog()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openNewTransientDialog])

  // Keyboard shortcut Cmd+Alt+L / Ctrl+Alt+L — Toggle Layout
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.altKey &&
        (e.code === 'KeyL' || e.key.toLowerCase() === 'l' || e.key === '¬')
      ) {
        e.preventDefault()
        toggleLayout()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleLayout])

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
            {tabs.length > 0 ? (
              <>
                <RequestTabBar />
                <div className="flex-1 overflow-hidden">
                  {activeTab?.type === 'collection' ? (
                    <CollectionView
                      collectionPath={activeTab.collectionPath!}
                      tabId={activeTab.id}
                    />
                  ) : activeTab?.type === 'environments' ? (
                    <EnvironmentsTab />
                  ) : (
                    <PanelGroup key={layout} direction={layout} onLayout={onEditorLayout}>
                      {/* COMPOSER */}
                      <Panel
                        id="composer"
                        order={1}
                        defaultSize={editorLayout[0]}
                        minSize={30}
                        className="bg-bg-base"
                      >
                        <Composer />
                      </Panel>

                      <ResizeHandle
                        orientation={layout === 'horizontal' ? 'vertical' : 'horizontal'}
                      />

                      <Panel
                        id="response"
                        order={2}
                        defaultSize={editorLayout[1]}
                        minSize={20}
                        maxSize={70}
                        className="bg-bg-panel"
                      >
                        <ResponsePane />
                      </Panel>
                    </PanelGroup>
                  )}
                </div>
              </>
            ) : (
              <WorkspaceHome />
            )}
          </div>
        </Panel>
      </PanelGroup>
      <NewRequestDialog
        key={dialogResetKey}
        isOpen={newRequestDialog.isOpen}
        onClose={closeNewRequestDialog}
        initialCollectionPath={newRequestDialog.collectionPath}
        initialFolderPath={newRequestDialog.folderPath}
      />
      <NewTransientRequestDialog
        key={newTransientDialogResetKey}
        isOpen={isNewTransientDialogOpen}
        onClose={closeNewTransientDialog}
      />
      <SaveToCollectionDialog
        key={saveToCollectionResetKey}
        isOpen={isSaveToCollectionDialogOpen}
        onClose={closeSaveToCollectionDialog}
        tabId={saveToCollectionTabId}
      />
    </main>
  )
}

export default PanelShell
