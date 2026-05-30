import React, { useState } from 'react'
import * as Icons from '../ui/Icons'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { commands } from '../../bindings'
import { toast } from '../../stores/toastStore'
import ImportModal from '../ui/ImportModal'

// ─── Keyboard shortcut helpers ────────────────────────────────────────────────

const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0

/** Render a single key token as a keycap chip */
const Key: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded bg-bg-surface border border-border-subtle border-b-border-default text-[10px] font-mono font-medium text-text-secondary leading-none shadow-[0_1px_0] shadow-border-default select-none">
    {children}
  </kbd>
)

/** Render a keyboard shortcut as space-separated key chips */
const Shortcut: React.FC<{ keys: string[] }> = ({ keys }) => (
  <div className="flex items-center gap-0.5">
    {keys.map((k, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span className="text-[9px] text-text-muted mx-0.5">+</span>}
        <Key>{k}</Key>
      </React.Fragment>
    ))}
  </div>
)

const cmd = isMac ? '⌘' : 'Ctrl'
const shift = isMac ? '⇧' : 'Shift'
const alt = isMac ? '⌥' : 'Alt'
const enter = isMac ? '↵' : 'Enter'

interface ShortcutRow {
  label: string
  description?: string
  keys: string[]
}

interface ShortcutGroup {
  title: string
  rows: ShortcutRow[]
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Create Requests',
    rows: [
      { label: 'New Request', description: 'Save to a collection', keys: [cmd, shift, 'N'] },
      {
        label: 'New Transient Request',
        description: 'Pick protocol, never saved',
        keys: [cmd, 'B'],
      },
      {
        label: 'New Quick Request',
        description: 'Instant HTTP GET, never saved',
        keys: [cmd, 'N'],
      },
      { label: 'Send Request', keys: [cmd, enter] },
    ],
  },
  {
    title: 'Navigate',
    rows: [
      { label: 'Edit Environments', keys: [cmd, 'E'] },
      { label: 'Toggle Sidebar', keys: [cmd, '\\'] },
      { label: 'Toggle Layout', keys: [cmd, alt, 'L'] },
      { label: 'Switch Tabs', keys: [cmd, '1–9'] },
    ],
  },
]

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

      {/* Keyboard shortcuts — shown when at least one collection is open */}
      {collectionCount > 0 && (
        <div className="px-6 pb-6 shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-text-muted">
              Keyboard Shortcuts
            </span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-0">
            {SHORTCUT_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted/60 mb-2">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4 px-2.5 py-1.5 rounded-md group hover:bg-bg-muted transition-colors"
                    >
                      <div className="min-w-0">
                        <span className="text-[12px] font-medium text-text-secondary group-hover:text-text-primary transition-colors truncate block">
                          {row.label}
                        </span>
                        {row.description && (
                          <span className="text-[10px] text-text-muted leading-none">
                            {row.description}
                          </span>
                        )}
                      </div>
                      <Shortcut keys={row.keys} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
