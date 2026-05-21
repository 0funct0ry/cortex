import React, { useState } from 'react'
import * as Icons from '../ui/Icons'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { commands } from '../../bindings'
import { toast } from '../../stores/toastStore'
import ImportModal from '../ui/ImportModal'

const WorkspaceOverview: React.FC = () => {
  const { activeWorkspace, activeWorkspacePath, loadWorkspace } = useWorkspaceStore()
  const { setCreatingInline, loadCollection, setExpanded } = useCollectionStore()
  const { environments } = useEnvironmentStore()

  const [error, setError] = useState<string | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

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

    const isAlreadyOpen = activeWorkspace.collections.some((c) => c.path === path)
    if (isAlreadyOpen) {
      setExpanded(path, true)
      toast.info('Collection is already open.')
      setTimeout(() => {
        const el = document.querySelector(`[data-path="${path}"]`) as HTMLElement
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          el.focus()
        }
      }, 100)
      return
    }

    const manifestRes = await commands.loadCollectionManifest(path)
    let collectionName = path.split('/').pop() || 'Collection'
    if (manifestRes.status === 'ok') {
      collectionName = manifestRes.data.manifest.name
    }

    const addRes = await commands.addCollectionToWorkspace(activeWorkspacePath, path)
    if (addRes.status === 'ok') {
      await loadWorkspace(activeWorkspacePath)
      await loadCollection(path)
      setExpanded(path, true)
      addRecentCollection(collectionName, path)
      toast.success(`Collection "${collectionName}" successfully opened.`)
    } else {
      setError(`Failed to add collection to workspace: ${addRes.error}`)
    }
  }

  const collectionCount = activeWorkspace?.collections.length ?? 0
  const environmentCount = environments.length

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar bg-bg-base animate-in fade-in duration-500">
      {/* Stats row */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-text-primary">{collectionCount}</span>
          <span className="text-xs text-text-muted font-medium">
            {collectionCount === 1 ? 'Collection' : 'Collections'}
          </span>
        </div>
        <div className="w-[1px] h-5 bg-border-subtle" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-text-primary">{environmentCount}</span>
          <span className="text-xs text-text-muted font-medium">
            {environmentCount === 1 ? 'Environment' : 'Environments'}
          </span>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mx-6 mb-4 flex items-start gap-3 p-3 bg-error/10 border border-error/20 rounded-md text-error text-xs animate-in slide-in-from-top-1 duration-200">
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

      {/* Empty state */}
      {collectionCount === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center pb-12 select-none">
          <div className="text-text-muted opacity-10 mb-6">
            <Icons.Folder size={60} strokeWidth={1} />
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">No collections yet</h2>
          <p className="text-xs text-text-muted mb-8 max-w-[260px] text-center leading-relaxed">
            Create your first collection or open an existing one to get started.
          </p>
          <div className="flex flex-col gap-2 w-full max-w-[220px]">
            <button
              onClick={() => setCreatingInline(true)}
              className="h-9 flex items-center justify-center gap-2 px-4 bg-accent hover:bg-accent-hover text-accent-fg text-sm font-semibold rounded-md transition-colors shadow-sm"
            >
              <Icons.Plus size={15} />
              Create Collection
            </button>
            <button
              onClick={handleOpenCollection}
              className="h-9 flex items-center justify-center gap-2 px-4 bg-bg-surface hover:bg-bg-muted border border-border-subtle hover:border-border-default text-text-primary text-sm font-medium rounded-md transition-all"
            >
              <Icons.Folder size={15} />
              Open Collection
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="h-9 flex items-center justify-center gap-2 px-4 bg-bg-surface hover:bg-bg-muted border border-border-subtle hover:border-border-default text-text-primary text-sm font-medium rounded-md transition-all"
            >
              <Icons.Download size={15} />
              Import Collection
            </button>
          </div>
        </div>
      )}

      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </div>
  )
}

export default WorkspaceOverview
