import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import * as Icons from './Icons'
import { commands } from '../../bindings'
import type { CollectionItem } from '../../bindings'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useRequestStore } from '../../stores/requestStore'
import { useTabs } from '../../contexts/TabsContext'
import { toast } from '../../stores/toastStore'

// ─── Folder tree builder ──────────────────────────────────────────────────────

interface FolderOption {
  label: string
  path: string
  depth: number
}

function buildFolderOptions(items: CollectionItem[], depth = 0): FolderOption[] {
  const result: FolderOption[] = []
  for (const item of items) {
    if (item.type === 'Folder') {
      result.push({ label: item.data.name, path: item.data.path, depth })
      result.push(...buildFolderOptions(item.data.items, depth + 1))
    }
  }
  return result
}

// ─── Main Dialog ─────────────────────────────────────────────────────────────

interface SaveToCollectionDialogProps {
  isOpen: boolean
  onClose: () => void
  tabId: string | null
}

const SaveToCollectionDialog: React.FC<SaveToCollectionDialogProps> = ({
  isOpen,
  onClose,
  tabId,
}) => {
  const { activeWorkspace } = useWorkspaceStore()
  const { collections, loadCollection } = useCollectionStore()
  const { promoteTab, tabs } = useTabs()

  const activeTab = tabs.find((t) => t.id === tabId) ?? null

  const initCollectionPath = activeWorkspace?.collections[0]?.path ?? ''

  const [name, setName] = useState('')
  const [selectedCollectionPath, setSelectedCollectionPath] = useState<string>(initCollectionPath)
  const [selectedFolderPath, setSelectedFolderPath] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nameInputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setName(activeTab?.name && activeTab.name !== 'Untitled' ? activeTab.name : '')
    setSelectedCollectionPath(activeWorkspace?.collections[0]?.path ?? '')
    setSelectedFolderPath(null)
  }, [activeTab, activeWorkspace])

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(reset, 0)
      return () => clearTimeout(id)
    }
  }, [isOpen, reset])

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => nameInputRef.current?.focus(), 50)
      return () => clearTimeout(id)
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedCollectionPath && !collections[selectedCollectionPath]) {
      loadCollection(selectedCollectionPath)
    }
  }, [selectedCollectionPath, collections, loadCollection])

  const colData = collections[selectedCollectionPath]
  const folderOptions: FolderOption[] = colData ? buildFolderOptions(colData.items) : []
  const allCollections = activeWorkspace?.collections ?? []
  const canSave = name.trim() !== '' && selectedCollectionPath !== '' && !isSubmitting

  const handleSave = useCallback(async () => {
    if (!canSave || !tabId) return
    setIsSubmitting(true)

    try {
      const targetDir = selectedFolderPath ?? selectedCollectionPath
      const trimmedName = name.trim()
      const currentMethod = activeTab?.method ?? 'GET'

      const res = await commands.createRequest(trimmedName, targetDir, currentMethod)
      if (res.status !== 'ok') {
        toast.error(`Failed to save request: ${res.error}`)
        return
      }

      const newPath = res.data

      // Persist the in-memory state to the new file
      await useRequestStore.getState().saveRequest(tabId, newPath)

      // Reload the sidebar to show the new file
      await loadCollection(selectedCollectionPath)

      // Highlight the new request in the sidebar
      useCollectionStore.getState().setSelectedPath(newPath)

      // Promote the tab from transient to saved
      promoteTab(tabId, newPath, trimmedName)

      toast.success(`Saved as "${trimmedName}"`)
      onClose()
    } catch (e) {
      toast.error(`Error saving request: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [
    canSave,
    tabId,
    name,
    selectedCollectionPath,
    selectedFolderPath,
    activeTab,
    loadCollection,
    promoteTab,
    onClose,
  ])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    },
    [onClose]
  )

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canSave) {
      e.preventDefault()
      handleSave()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-[440px] bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Save to Collection"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border-subtle">
          <h3 className="text-sm font-semibold text-text-primary">Save to Collection</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-muted transition-colors"
          >
            <Icons.X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          {/* Request Name */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Request Name
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleNameKeyDown}
              autoCapitalize="off"
              autoCorrect="off"
              placeholder="Request Name"
              className="w-full h-9 bg-bg-surface border border-border-default focus:border-accent rounded-md px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted"
            />
          </div>

          {/* Collection selector */}
          {allCollections.length > 1 && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-text-secondary w-20 shrink-0">Collection</label>
              <select
                value={selectedCollectionPath}
                onChange={(e) => {
                  setSelectedCollectionPath(e.target.value)
                  setSelectedFolderPath(null)
                }}
                className="flex-1 h-7 bg-bg-surface border border-border-default rounded px-2 text-xs text-text-primary outline-none focus:border-accent"
              >
                {allCollections.map((c) => (
                  <option key={c.path} value={c.path}>
                    {c.name ?? c.path.split('/').pop()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Folder selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-text-secondary w-20 shrink-0">Save to folder</label>
            <select
              value={selectedFolderPath ?? ''}
              onChange={(e) => setSelectedFolderPath(e.target.value || null)}
              className="flex-1 h-7 bg-bg-surface border border-border-default rounded px-2 text-xs text-text-primary outline-none focus:border-accent"
            >
              <option value="">— Collection root —</option>
              {folderOptions.map((f) => (
                <option key={f.path} value={f.path}>
                  {'  '.repeat(f.depth)}
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border-subtle">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="h-8 px-4 text-sm font-semibold bg-accent hover:bg-accent-hover text-accent-fg rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default SaveToCollectionDialog
