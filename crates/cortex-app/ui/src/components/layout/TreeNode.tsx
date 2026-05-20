import React, { useState, useMemo, useCallback } from 'react'
import * as Icons from '../ui/Icons'
import MethodBadge from '../ui/MethodBadge'
import ContextMenu from '../ui/ContextMenu'
import type { ContextMenuItem } from '../ui/ContextMenu'
import Dialog from '../ui/Dialog'
import InlineInput from '../ui/InlineInput'
import { commands } from '../../bindings'
import { useCollectionStore } from '../../stores/collectionStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { toast } from '../../stores/toastStore'
import { SettingsModal } from '../ui/SettingsModal'

interface TreeNodeProps {
  label: string
  depth: number
  type: 'collection' | 'folder' | 'request'
  path: string
  method?: string
  isExpanded?: boolean
  isLoading?: boolean
  error?: string | null
  isActive?: boolean
  onToggle?: () => void
  onClick?: () => void
  onDoubleClick?: () => void
}

const TreeNode: React.FC<TreeNodeProps> = ({
  label,
  depth,
  type,
  path,
  method,
  isExpanded,
  isLoading,
  error,
  isActive,
  onToggle,
  onClick,
  onDoubleClick,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [isRenaming, setIsRenaming] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { searchQuery, collections, clearCollection, loadCollection } = useCollectionStore()
  const { activeWorkspacePath, loadWorkspace } = useWorkspaceStore()

  const collectionPath = useMemo(() => {
    if (type === 'collection') return path
    for (const colPath of Object.keys(collections)) {
      if (path.startsWith(colPath)) return colPath
    }
    return ''
  }, [type, path, collections])

  const indentation = depth * 12 + 12

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const handleRename = async (newName: string) => {
    setIsRenaming(false)
    if (newName === label) return

    try {
      const res = await commands.renameItem(path, newName)
      if (res.status === 'ok') {
        if (type === 'collection') {
          // Evict stale collection data keyed by old path
          clearCollection(path)
          // Reload workspace so activeWorkspace.collections reflects new path
          if (activeWorkspacePath) {
            await loadWorkspace(activeWorkspacePath)
            // Eagerly load the renamed collection under its new path
            await loadCollection(res.data)
          }
        } else {
          if (activeWorkspacePath) await loadWorkspace(activeWorkspacePath)
        }
      } else {
        toast.error(`Rename failed: ${res.error}`)
      }
    } catch (err) {
      toast.error(`Rename failed: ${String(err)}`)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await commands.deleteItem(path)
      if (res.status === 'ok') {
        if (activeWorkspacePath) await loadWorkspace(activeWorkspacePath)
      }
    } catch (err) {
      toast.error(`Delete failed: ${String(err)}`)
    }
  }

  const handleDeleteCollection = async () => {
    if (!activeWorkspacePath) return
    try {
      // 1. Remove the collection reference from the workspace manifest
      const removeRes = await commands.removeCollectionFromWorkspace(activeWorkspacePath, path)
      if (removeRes.status === 'ok') {
        // 2. Delete the physical directory (moves to trash)
        const deleteRes = await commands.deleteItem(path)
        if (deleteRes.status === 'ok') {
          await loadWorkspace(activeWorkspacePath)
          toast.success(`Collection "${label}" deleted`)
        } else {
          toast.error(`Failed to delete collection directory: ${deleteRes.error}`)
        }
      } else {
        toast.error(`Failed to remove collection from workspace: ${removeRes.error}`)
      }
    } catch (err) {
      toast.error(`Delete collection failed: ${String(err)}`)
    }
  }

  const handleDuplicate = useCallback(async () => {
    try {
      const res = await commands.duplicateRequest(path)
      if (res.status === 'ok') {
        if (activeWorkspacePath) await loadWorkspace(activeWorkspacePath)
      }
    } catch (err) {
      toast.error(`Duplicate failed: ${String(err)}`)
    }
  }, [path, activeWorkspacePath, loadWorkspace])

  const handleCreateRequest = useCallback(async () => {
    try {
      const res = await commands.createRequest('New Request', path)
      if (res.status === 'ok') {
        if (activeWorkspacePath) await loadWorkspace(activeWorkspacePath)
      }
    } catch (err) {
      toast.error(`Create request failed: ${String(err)}`)
    }
  }, [path, activeWorkspacePath, loadWorkspace])

  const handleCreateFolder = useCallback(async () => {
    try {
      const res = await commands.createFolder('New Folder', path)
      if (res.status === 'ok') {
        if (activeWorkspacePath) await loadWorkspace(activeWorkspacePath)
      }
    } catch (err) {
      toast.error(`Create folder failed: ${String(err)}`)
    }
  }, [path, activeWorkspacePath, loadWorkspace])

  const contextMenuItems = useMemo((): ContextMenuItem[] => {
    const common: ContextMenuItem[] = [{ label: 'Rename', onClick: () => setIsRenaming(true) }]

    if (type === 'collection') {
      return [
        { label: 'New Request', shortcut: 'Cmd+N', onClick: handleCreateRequest },
        { label: 'New Folder', onClick: handleCreateFolder },
        { label: '', separator: true },
        ...common,
        { label: 'Settings', onClick: () => setIsSettingsOpen(true) },
        { label: '', separator: true },
        { label: 'Open in File Explorer', onClick: () => commands.openInExplorer(path) },
        { label: '', separator: true },
        {
          label: 'Close Collection',
          danger: true,
          onClick: () => {
            if (activeWorkspacePath)
              commands
                .removeCollectionFromWorkspace(activeWorkspacePath, path)
                .then(() => loadWorkspace(activeWorkspacePath))
          },
        },
        {
          label: 'Delete Collection',
          danger: true,
          onClick: () => setShowDeleteConfirm(true),
        },
      ]
    }

    if (type === 'folder') {
      return [
        { label: 'New Request', shortcut: 'Cmd+N', onClick: handleCreateRequest },
        { label: 'New Folder', onClick: handleCreateFolder },
        { label: '', separator: true },
        ...common,
        { label: 'Duplicate', onClick: handleDuplicate },
        { label: 'Settings', onClick: () => setIsSettingsOpen(true) },
        { label: '', separator: true },
        { label: 'Delete Folder', danger: true, onClick: () => setShowDeleteConfirm(true) },
      ]
    }

    // Request
    return [
      { label: 'Open in New Tab', onClick: onClick },
      { label: 'Duplicate Request', onClick: handleDuplicate },
      { label: '', separator: true },
      ...common,
      { label: '', separator: true },
      {
        label: 'Copy URL',
        onClick: () => {
          // Just a stub for now, would need actual URL resolution
          navigator.clipboard.writeText('https://example.com')
        },
      },
      {
        label: 'Copy as cURL',
        onClick: () => {
          navigator.clipboard.writeText('curl https://example.com')
        },
      },
      { label: '', separator: true },
      {
        label: 'Move to',
        shortcut: '›',
        submenu: [
          { label: 'Root', onClick: () => {} }, // Would need actual folder list
        ],
      },
      { label: '', separator: true },
      { label: 'Delete Request', danger: true, onClick: () => setShowDeleteConfirm(true) },
    ]
  }, [
    type,
    path,
    activeWorkspacePath,
    handleCreateRequest,
    handleCreateFolder,
    handleDuplicate,
    onClick,
    loadWorkspace,
  ])

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="bg-bg-highlight text-text-primary">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    )
  }

  const renderIcon = () => {
    if (isLoading) {
      return (
        <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      )
    }

    switch (type) {
      case 'collection':
      case 'folder':
        return <Icons.Folder size={type === 'collection' ? 14 : 12} className="text-text-muted" />
      case 'request':
        return method ? <MethodBadge method={method} /> : null
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col" onContextMenu={handleContextMenu}>
      <div
        className={`flex items-center gap-1.5 h-[28px] cursor-pointer group transition-colors ${
          isActive ? 'bg-bg-highlight' : isHovered ? 'bg-bg-muted' : ''
        }`}
        style={{ paddingLeft: `${indentation}px`, paddingRight: '12px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={type === 'request' ? onClick : onToggle}
        onDoubleClick={onDoubleClick}
      >
        {(type === 'collection' || type === 'folder') && (
          <div
            className={`w-3 h-3 flex items-center justify-center transition-transform duration-150 ${
              isExpanded ? 'rotate-0' : '-rotate-90'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onToggle?.()
            }}
          >
            <Icons.ChevronDown size={12} className="text-text-muted hover:text-text-primary" />
          </div>
        )}

        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {renderIcon()}
          {isRenaming ? (
            <InlineInput
              initialValue={label}
              onConfirm={handleRename}
              onCancel={() => setIsRenaming(false)}
            />
          ) : (
            <span
              className={`text-sm truncate ${
                isActive
                  ? 'text-text-primary font-medium'
                  : 'text-text-secondary group-hover:text-text-primary'
              }`}
            >
              {highlightMatch(label, searchQuery)}
            </span>
          )}
        </div>

        {isHovered && !isRenaming && (
          <button
            className="p-1 hover:bg-bg-highlight rounded text-text-muted hover:text-text-primary transition-opacity opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              setContextMenu({ x: e.clientX, y: e.clientY })
            }}
          >
            <Icons.MoreHorizontal size={14} />
          </button>
        )}
      </div>

      {error && (
        <div
          className="text-[10px] text-error px-3 py-1 bg-error/10"
          style={{ paddingLeft: `${indentation + 16}px` }}
        >
          {error}
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}

      <Dialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={type === 'collection' ? handleDeleteCollection : handleDelete}
        title={`Delete ${type === 'request' ? 'Request' : type === 'folder' ? 'Folder' : 'Collection'}?`}
        description={
          type === 'collection'
            ? 'This will permanently delete the collection folder from your disk and remove it from the workspace. This action cannot be undone.'
            : `This will permanently delete the ${type} file. This action cannot be undone.`
        }
        confirmLabel="Delete"
        variant="danger"
      />

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          type={type as 'collection' | 'folder'}
          path={path}
          name={label}
          collectionPath={collectionPath}
        />
      )}
    </div>
  )
}

export default TreeNode
