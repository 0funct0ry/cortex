import React, { useState, useEffect } from 'react'
import * as Icons from '../ui/Icons'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { commands } from '../../bindings'
import { toast } from '../../stores/toastStore'
import ImportModal from '../ui/ImportModal'

const WorkspaceOverview: React.FC = () => {
  const { activeWorkspace, activeWorkspacePath, loadWorkspace } = useWorkspaceStore()
  const { setCreatingInline, loadCollection, setExpanded } = useCollectionStore()

  const [error, setError] = useState<string | null>(null)
  const [recentCollections, setRecentCollections] = useState<{ name: string; path: string }[]>([])
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  // Load recent collections on mount or when workspace path changes
  useEffect(() => {
    if (activeWorkspacePath) {
      const key = `cortex.recent_collections.${activeWorkspacePath}`
      const saved = localStorage.getItem(key)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setTimeout(() => {
            setRecentCollections(parsed)
          }, 0)
        } catch (e) {
          console.error('Failed to parse recent collections', e)
        }
      } else {
        setTimeout(() => {
          setRecentCollections([])
        }, 0)
      }
    }
  }, [activeWorkspacePath])

  const addRecentCollection = (name: string, path: string) => {
    if (!activeWorkspacePath) return
    const key = `cortex.recent_collections.${activeWorkspacePath}`
    const saved = localStorage.getItem(key)
    let list: { name: string; path: string }[] = []
    if (saved) {
      try {
        list = JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    list = list.filter((item) => item.path !== path)
    list.unshift({ name, path })
    list = list.slice(0, 5)
    localStorage.setItem(key, JSON.stringify(list))
    setRecentCollections(list)
  }

  const handleOpenCollection = async () => {
    setError(null)
    try {
      const result = await commands.pickDirectory('Open Collection')
      if (!result.status || result.status !== 'ok' || !result.data) return

      const path = result.data
      await processOpenCollection(path)
    } catch (e) {
      setError(`Failed to open collection: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const processOpenCollection = async (path: string) => {
    if (!activeWorkspacePath || !activeWorkspace) return

    const dirType = await commands.detectDirectoryType(path)
    if (dirType !== 'collection') {
      setError(
        'The selected folder is not a Cortex collection. A cortex.yaml manifest is required.'
      )
      return
    }

    // Check if already open
    const isAlreadyOpen = activeWorkspace.collections.some((c) => c.path === path)
    if (isAlreadyOpen) {
      // Focus existing sidebar node
      setExpanded(path, true)
      toast.info('Collection is already open.')

      // Attempt to scroll into view and focus element
      setTimeout(() => {
        const el = document.querySelector(`[data-path="${path}"]`) as HTMLElement
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          el.focus()
        }
      }, 100)
      return
    }

    // Get collection manifest details (especially its name)
    const manifestRes = await commands.loadCollectionManifest(path)
    let collectionName = path.split('/').pop() || 'Collection'
    if (manifestRes.status === 'ok') {
      collectionName = manifestRes.data.manifest.name
    }

    // Add to workspace
    const addRes = await commands.addCollectionToWorkspace(activeWorkspacePath, path)
    if (addRes.status === 'ok') {
      await loadWorkspace(activeWorkspacePath)
      await loadCollection(path)
      setExpanded(path, true)

      // Save to recent list
      addRecentCollection(collectionName, path)
      toast.success(`Collection "${collectionName}" successfully opened.`)
    } else {
      setError(`Failed to add collection to workspace: ${addRes.error}`)
    }
  }

  const handleRecentCollectionClick = async (col: { name: string; path: string }) => {
    setError(null)
    try {
      await processOpenCollection(col.path)
    } catch (e) {
      setError(`Failed to open collection: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-bg-base p-8 select-none animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Workspace Title & Location */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4 border border-accent/20 shadow-sm animate-pulse">
            <Icons.Workspace size={24} />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            {activeWorkspace?.name || 'Workspace Overview'}
          </h1>
          <p className="text-xs text-text-muted mt-1 font-mono break-all max-w-md mx-auto opacity-75">
            {activeWorkspacePath}
          </p>
        </div>

        {/* Inline Error Alert */}
        {error && (
          <div className="w-full max-w-md flex items-start gap-3 p-3 bg-error/10 border border-error/20 rounded-md text-error text-xs mb-6 animate-in slide-in-from-top-1 duration-200">
            <Icons.AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
            <button
              onClick={() => setError(null)}
              className="p-0.5 hover:bg-error/20 rounded text-error ml-auto transition-colors"
            >
              <Icons.X size={12} />
            </button>
          </div>
        )}

        {/* Quick Actions Section */}
        <div className="w-full max-w-md mb-10">
          <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3 px-1">
            Quick Actions
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {/* Create Collection */}
            <button
              onClick={() => setCreatingInline(true)}
              className="flex flex-col items-center justify-center p-4 bg-bg-surface hover:bg-bg-muted border border-border-subtle hover:border-border-default rounded-lg transition-all active:scale-[0.98] group hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-md bg-accent/10 text-accent flex items-center justify-center mb-2.5 transition-colors group-hover:bg-accent/20">
                <Icons.Plus size={16} />
              </div>
              <span className="text-xs font-semibold text-text-primary">Create</span>
              <span className="text-[10px] text-text-muted mt-0.5">Collection</span>
            </button>

            {/* Open Collection */}
            <button
              onClick={handleOpenCollection}
              className="flex flex-col items-center justify-center p-4 bg-bg-surface hover:bg-bg-muted border border-border-subtle hover:border-border-default rounded-lg transition-all active:scale-[0.98] group hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-md bg-accent/10 text-accent flex items-center justify-center mb-2.5 transition-colors group-hover:bg-accent/20">
                <Icons.Folder size={16} />
              </div>
              <span className="text-xs font-semibold text-text-primary">Open</span>
              <span className="text-[10px] text-text-muted mt-0.5">Collection</span>
            </button>

            {/* Import Collection */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 bg-bg-surface hover:bg-bg-muted border border-border-subtle hover:border-border-default rounded-lg transition-all active:scale-[0.98] group hover:shadow-sm"
            >
              <div className="w-8 h-8 rounded-md bg-accent/10 text-accent flex items-center justify-center mb-2.5 transition-colors group-hover:bg-accent/20">
                <Icons.Download size={16} />
              </div>
              <span className="text-xs font-semibold text-text-primary">Import</span>
              <span className="text-[10px] text-text-muted mt-0.5">Collection</span>
            </button>
          </div>
        </div>

        {/* Recently Opened Collections */}
        {recentCollections.length > 0 && (
          <div className="w-full max-w-md mb-10">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Recent Collections
              </h2>
              <div className="flex-1 h-[1px] bg-border-subtle" />
            </div>
            <div className="space-y-1.5">
              {recentCollections.map((col) => (
                <button
                  key={col.path}
                  onClick={() => handleRecentCollectionClick(col)}
                  className="w-full group flex items-center gap-3 p-2.5 bg-bg-surface/50 hover:bg-bg-surface border border-border-subtle/45 hover:border-border-subtle rounded-md transition-all text-left"
                >
                  <div className="w-7 h-7 flex items-center justify-center rounded bg-bg-muted text-text-secondary group-hover:bg-accent group-hover:text-accent-fg transition-colors shrink-0">
                    <Icons.Folder size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-text-primary truncate">
                      {col.name}
                    </div>
                    <div className="text-[10px] text-text-muted truncate font-mono opacity-80 mt-0.5">
                      {col.path}
                    </div>
                  </div>
                  <Icons.ExternalLink
                    size={12}
                    className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts */}
        <div className="w-full max-w-md border border-border-subtle/50 bg-bg-surface/20 rounded-lg p-4">
          <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3 px-1">
            Keyboard Shortcuts
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-text-secondary">Send Request</span>
              <kbd className="px-1.5 py-0.5 bg-bg-surface border border-border-subtle rounded font-mono text-[10px] text-text-muted">
                Cmd + Enter
              </kbd>
            </div>
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-text-secondary">New Scratch Tab</span>
              <kbd className="px-1.5 py-0.5 bg-bg-surface border border-border-subtle rounded font-mono text-[10px] text-text-muted">
                Cmd + N
              </kbd>
            </div>
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-text-secondary">Toggle Sidebar</span>
              <kbd className="px-1.5 py-0.5 bg-bg-surface border border-border-subtle rounded font-mono text-[10px] text-text-muted">
                Cmd + \
              </kbd>
            </div>
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-text-secondary">Edit Environments</span>
              <kbd className="px-1.5 py-0.5 bg-bg-surface border border-border-subtle rounded font-mono text-[10px] text-text-muted">
                Cmd + E
              </kbd>
            </div>
          </div>
        </div>
      </div>

      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  )
}

export default WorkspaceOverview
