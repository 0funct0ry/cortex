import React, { useState, useMemo } from 'react'
import * as Icons from '../ui/Icons'
import MethodBadge from '../ui/MethodBadge'
import ContextMenu from '../ui/ContextMenu'
import type { ContextMenuItem } from '../ui/ContextMenu'
import Dialog from '../ui/Dialog'
import InlineInput from '../ui/InlineInput'
import { commands } from '../../bindings'
import { useCollectionStore } from '../../stores/collectionStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'

interface TreeNodeProps {
  label: string
  depth: number
  type: 'collection' | 'folder' | 'request'
  path: string
  method?: string
  isExpanded?: boolean
  isLoading?: boolean
  error?: string | null
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
  onToggle,
  onClick,
  onDoubleClick,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [isRenaming, setIsRenaming] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { searchQuery } = useCollectionStore()
  const { activeWorkspacePath, loadWorkspace } = useWorkspaceStore()

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
        // Refresh collection/workspace
        if (activeWorkspacePath) await loadWorkspace(activeWorkspacePath)
      }
    } catch (err) {
      console.error('Rename failed', err)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await commands.deleteItem(path)
      if (res.status === 'ok') {
        if (activeWorkspacePath) await loadWorkspace(activeWorkspacePath)
      }
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  const handleDuplicate = async () => {
    try {
      const res = await commands.duplicateRequest(path)
      if (res.status === 'ok') {
        if (activeWorkspacePath) await loadWorkspace(activeWorkspacePath)
      }
    } catch (err) {
      console.error('Duplicate failed', err)
    }
  }

  const handleCreateRequest = async () => {
    try {
      const res = await commands.createRequest('New Request', path)
      if (res.status === 'ok') {
        if (activeWorkspacePath) await loadWorkspace(activeWorkspacePath)
      }
    } catch (err) {
      console.error('Create request failed', err)
    }
  }

  const handleCreateFolder = async () => {
    try {
      const res = await commands.createFolder('New Folder', path)
      if (res.status === 'ok') {
        if (activeWorkspacePath) await loadWorkspace(activeWorkspacePath)
      }
    } catch (err) {
      console.error('Create folder failed', err)
    }
  }

  const contextMenuItems = useMemo((): ContextMenuItem[] => {
    const common: ContextMenuItem[] = [{ label: 'Rename', onClick: () => setIsRenaming(true) }]

    if (type === 'collection') {
      return [
        { label: 'New Request', shortcut: 'Cmd+N', onClick: handleCreateRequest },
        { label: 'New Folder', onClick: handleCreateFolder },
        { label: '', separator: true },
        ...common,
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
      ]
    }

    if (type === 'folder') {
      return [
        { label: 'New Request', shortcut: 'Cmd+N', onClick: handleCreateRequest },
        { label: 'New Folder', onClick: handleCreateFolder },
        { label: '', separator: true },
        ...common,
        { label: 'Duplicate', onClick: handleDuplicate },
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
    activeWorkspacePath,
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
          isHovered ? 'bg-bg-muted' : ''
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
            <span className="text-sm text-text-primary truncate">
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
        onConfirm={handleDelete}
        title={`Delete ${type === 'request' ? 'Request' : 'Folder'}?`}
        description={`This will permanently delete the ${type} file. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

export default TreeNode
