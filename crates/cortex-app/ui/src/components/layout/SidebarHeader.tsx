import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import * as Icons from '../ui/Icons'
import ImportModal from '../ui/ImportModal'
import { useCollectionStore, getAllTagsFromCollections } from '../../stores/collectionStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { commands } from '../../bindings'
import { toast } from '../../stores/toastStore'
import { TagFilterBar } from './TagFilterBar'

// ---------------------------------------------------------------------------
// AddMenu — portal dropdown anchored below the + button
// ---------------------------------------------------------------------------

interface AddMenuProps {
  anchorRect: DOMRect
  onClose: () => void
  onCreateCollection: () => void
  onOpenCollection: () => void
  onImportCollection: () => void
}

const AddMenu: React.FC<AddMenuProps> = ({
  anchorRect,
  onClose,
  onCreateCollection,
  onOpenCollection,
  onImportCollection,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  // Position below and left-aligned with the button, clipped to viewport
  const gap = 4
  const top = anchorRect.bottom + gap
  let left = anchorRect.right - 192 // menu width ~192px, right-aligned with button

  if (left < 8) left = 8

  const items = [
    { icon: <Icons.Plus size={14} />, label: 'Create collection', onClick: onCreateCollection },
    { icon: <Icons.Folder size={14} />, label: 'Open collection', onClick: onOpenCollection },
    { icon: <Icons.Download size={14} />, label: 'Import collection', onClick: onImportCollection },
  ]

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[100] w-48 bg-bg-overlay border border-border-subtle rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.3)] py-1 animate-in fade-in zoom-in-95 duration-100"
      style={{ top, left }}
    >
      {items.map(({ icon, label, onClick }) => (
        <button
          key={label}
          className="w-full flex items-center gap-2.5 px-3 h-8 text-sm text-text-primary hover:bg-bg-highlight transition-colors text-left"
          onClick={() => {
            onClick()
            onClose()
          }}
        >
          <span className="text-text-muted shrink-0">{icon}</span>
          {label}
        </button>
      ))}
    </div>,
    document.body
  )
}

// ---------------------------------------------------------------------------
// SidebarHeader
// ---------------------------------------------------------------------------

const SidebarHeader: React.FC = () => {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [addMenuRect, setAddMenuRect] = useState<DOMRect | null>(null)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const {
    searchQuery,
    setSearchQuery,
    setCreatingInline,
    collections,
    showTagFilterBar,
    toggleTagFilterBar,
  } = useCollectionStore()
  const {
    activeWorkspace,
    activeWorkspacePath,
    isLoading: isWorkspaceLoading,
    loadWorkspace,
  } = useWorkspaceStore()
  const { loadCollection } = useCollectionStore()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const plusButtonRef = useRef<HTMLButtonElement>(null)

  const allTags = getAllTagsFromCollections(collections)
  const hasAnyTags = allTags.length > 0

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchActive])

  const handleToggleSearch = () => {
    if (isSearchActive) {
      setSearchQuery('')
      setIsSearchActive(false)
    } else {
      setIsSearchActive(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('')
      setIsSearchActive(false)
    }
  }

  const handlePlusClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (addMenuRect) {
      setAddMenuRect(null)
      return
    }
    setAddMenuRect(e.currentTarget.getBoundingClientRect())
  }

  const handleOpenCollection = async () => {
    try {
      const result = await commands.pickDirectory('Open Collection or Workspace')
      if (!result.status || result.status !== 'ok' || !result.data) return

      const dirType = await commands.detectDirectoryType(result.data)

      if (dirType === 'workspace') {
        await loadWorkspace(result.data)
      } else if (dirType === 'collection') {
        if (!activeWorkspacePath) {
          toast.error('Open a workspace first before adding a collection.')
          return
        }
        const addRes = await commands.addCollectionToWorkspace(activeWorkspacePath, result.data)
        if (addRes.status === 'ok') {
          await loadWorkspace(activeWorkspacePath)
          await loadCollection(result.data)
          toast.success('Collection added to workspace')
        } else {
          toast.error(`Failed to add collection: ${addRes.error}`)
        }
      } else {
        toast.error(
          'The selected directory is neither a Cortex workspace nor a collection (no cortex-workspace.yaml or cortex.yaml found).'
        )
      }
    } catch (e) {
      toast.error(`Failed to open collection: ${String(e)}`)
    }
  }

  const isPlusDisabled = !activeWorkspace || isWorkspaceLoading

  if (isSearchActive) {
    return (
      <>
        <div className="h-8 flex items-center gap-2 px-2 bg-bg-panel shrink-0 select-none border-b border-border-subtle">
          <button
            onClick={handleToggleSearch}
            className="p-1 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors"
          >
            <Icons.X size={14} />
          </button>
          <div className="flex-1 flex items-center bg-bg-surface border border-border-default rounded h-6 px-1.5 gap-1.5 focus-within:border-accent">
            <Icons.Search size={12} className="text-text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search requests..."
              className="flex-1 bg-transparent border-none outline-none text-[12px] text-text-primary placeholder:text-text-muted h-full"
            />
          </div>
          <button
            onClick={hasAnyTags ? toggleTagFilterBar : undefined}
            className={`p-1 rounded-md transition-colors ${
              !hasAnyTags
                ? 'text-text-muted/30 cursor-not-allowed'
                : showTagFilterBar
                  ? 'bg-bg-muted text-accent-primary'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-muted'
            }`}
            title={hasAnyTags ? 'Filter by tags' : 'No tags defined'}
          >
            <Icons.Filter size={14} />
          </button>
        </div>
        {showTagFilterBar && <TagFilterBar />}
      </>
    )
  }

  return (
    <>
      <div className="h-8 flex items-center justify-between px-3 bg-bg-panel shrink-0 select-none border-b border-border-subtle">
        <span className="text-text-secondary text-[11px] font-semibold uppercase tracking-wider">
          Collections
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleSearch}
            className="p-1 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors"
          >
            <Icons.Search size={14} />
          </button>
          <button
            onClick={hasAnyTags ? toggleTagFilterBar : undefined}
            className={`p-1 rounded-md transition-colors ${
              !hasAnyTags
                ? 'text-text-muted/30 cursor-not-allowed'
                : showTagFilterBar
                  ? 'bg-bg-muted text-accent-primary'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-muted'
            }`}
            title={hasAnyTags ? 'Filter by tags' : 'No tags defined'}
          >
            <Icons.Filter size={14} />
          </button>
          <button
            ref={plusButtonRef}
            disabled={isPlusDisabled}
            onClick={handlePlusClick}
            className={`p-1 rounded-md transition-colors ${
              isPlusDisabled
                ? 'text-text-muted/40 cursor-not-allowed'
                : addMenuRect
                  ? 'bg-bg-muted text-text-primary'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-muted'
            }`}
            title={
              isPlusDisabled ? 'Open a workspace first to create collections' : 'Add Collection'
            }
          >
            <Icons.Plus size={14} />
          </button>
          <button className="p-1 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors">
            <Icons.MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {showTagFilterBar && <TagFilterBar />}

      {addMenuRect && (
        <AddMenu
          anchorRect={addMenuRect}
          onClose={() => setAddMenuRect(null)}
          onCreateCollection={() => setCreatingInline(true)}
          onOpenCollection={handleOpenCollection}
          onImportCollection={() => setIsImportOpen(true)}
        />
      )}

      <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </>
  )
}

export default SidebarHeader
