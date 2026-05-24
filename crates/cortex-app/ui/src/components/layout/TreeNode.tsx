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
import { useTabs } from '../../contexts/TabsContext'
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
  onOpenSettings?: () => void
}

const isMac = navigator.platform.toUpperCase().includes('MAC')

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
  onOpenSettings,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [isRenaming, setIsRenaming] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const {
    searchQuery,
    collections,
    clearCollection,
    loadCollection,
    selectedPath,
    setSelectedPath,
    renamingPath,
    setRenamingPath,
  } = useCollectionStore()
  const { activeWorkspacePath, loadWorkspace } = useWorkspaceStore()
  const { tabs, updateTab, closeTabsWhere, openTab } = useTabs()

  React.useEffect(() => {
    if (renamingPath === path) {
      setTimeout(() => {
        setIsRenaming(true)
        setRenamingPath(null)
      }, 0)
    }
  }, [renamingPath, path, setRenamingPath])

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
          if (collectionPath) await loadCollection(collectionPath)
          // Sync the tab title and path for any open tab pointing at this request
          const matchingTab = tabs.find((t) => t.requestPath === path)
          if (matchingTab) {
            updateTab(matchingTab.id, { name: newName, requestPath: res.data })
          }
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
        if (collectionPath) await loadCollection(collectionPath)
        // Close the tab for the deleted request (or any request inside a deleted folder)
        closeTabsWhere((t) => t.requestPath !== null && t.requestPath.startsWith(path))
      }
    } catch (err) {
      toast.error(`Delete failed: ${String(err)}`)
    }
  }

  const handleDuplicate = useCallback(async () => {
    try {
      const res = await commands.duplicateRequest(path)
      if (res.status === 'ok') {
        if (collectionPath) await loadCollection(collectionPath)
      }
    } catch (err) {
      toast.error(`Duplicate failed: ${String(err)}`)
    }
  }, [path, collectionPath, loadCollection])

  const handleCreateRequest = useCallback(async () => {
    try {
      const res = await commands.createRequest('New Request', path, null)
      if (res.status === 'ok') {
        await loadCollection(collectionPath || path)
        useCollectionStore.getState().setRenamingPath(res.data)
      }
    } catch (err) {
      toast.error(`Create request failed: ${String(err)}`)
    }
  }, [path, collectionPath, loadCollection])

  const handleCreateFolder = useCallback(async () => {
    try {
      const res = await commands.createFolder('New Folder', path)
      if (res.status === 'ok') {
        await loadCollection(collectionPath || path)
        useCollectionStore.getState().setRenamingPath(res.data)
      }
    } catch (err) {
      toast.error(`Create folder failed: ${String(err)}`)
    }
  }, [path, collectionPath, loadCollection])

  const handleCreateJsFile = useCallback(async () => {
    try {
      const res = await commands.createJsFile(path, 'script.js')
      if (res.status === 'ok') {
        const filename = res.data.split('/').pop() ?? 'script.js'
        openTab({
          type: 'collection',
          collectionPath: path,
          collectionId: path,
          name: label,
          requestPath: null,
          method: '',
        })
        toast.success(`Created ${filename} — open the Script tab to use it`)
      } else {
        toast.error(`Failed to create JS file: ${res.error}`)
      }
    } catch (err) {
      toast.error(`Failed to create JS file: ${String(err)}`)
    }
  }, [path, label, openTab])

  const handleClone = useCallback(async () => {
    if (!activeWorkspacePath) return
    try {
      const res = await commands.cloneCollection(activeWorkspacePath, path)
      if (res.status === 'ok') {
        await loadWorkspace(activeWorkspacePath)
        toast.success(`Collection cloned successfully`)
      } else {
        toast.error(`Clone failed: ${res.error}`)
      }
    } catch (err) {
      toast.error(`Clone failed: ${String(err)}`)
    }
  }, [path, activeWorkspacePath, loadWorkspace])

  const handleOpenInTerminal = useCallback(async () => {
    try {
      const res = await commands.openInTerminal(path)
      if (res.status !== 'ok') {
        toast.error(`Failed to open terminal: ${res.error}`)
      }
    } catch (err) {
      toast.error(`Failed to open terminal: ${String(err)}`)
    }
  }, [path])

  const handleOpenCollectionView = useCallback(() => {
    openTab({
      type: 'collection',
      collectionPath: path,
      collectionId: path,
      name: label,
      requestPath: null,
      method: '',
    })
  }, [path, label, openTab])

  const handleRemove = useCallback(async () => {
    if (!activeWorkspacePath) return
    try {
      const res = await commands.removeCollectionFromWorkspace(activeWorkspacePath, path)
      if (res.status === 'ok') {
        await loadWorkspace(activeWorkspacePath)
        closeTabsWhere(
          (t) =>
            (t.type === 'request' && t.collectionId === path) ||
            (t.type === 'collection' && t.collectionPath === path)
        )
        toast.success(`"${label}" removed from workspace`)
      } else {
        toast.error(`Remove failed: ${res.error}`)
      }
    } catch (err) {
      toast.error(`Remove failed: ${String(err)}`)
    }
  }, [path, label, activeWorkspacePath, loadWorkspace, closeTabsWhere])

  const contextMenuItems = useMemo((): ContextMenuItem[] => {
    const common: ContextMenuItem[] = [{ label: 'Rename', onClick: () => setIsRenaming(true) }]

    if (type === 'collection') {
      return [
        { label: 'New Request', shortcut: 'Cmd+N', onClick: handleCreateRequest },
        { label: 'New Folder', onClick: handleCreateFolder },
        { label: 'New JS File', onClick: handleCreateJsFile },
        { label: '', separator: true },
        { label: 'Run', disabled: true, onClick: () => {} },
        { label: '', separator: true },
        { label: 'Clone', onClick: handleClone },
        ...common,
        { label: 'Share', onClick: () => toast.info('Share is coming in a future release') },
        {
          label: 'Generate Docs',
          onClick: () => toast.info('Documentation generation is coming in a future release'),
        },
        { label: '', separator: true },
        {
          label: 'Collapse',
          disabled: !isExpanded,
          onClick: () => {
            if (isExpanded) onToggle?.()
          },
        },
        {
          label: isMac ? 'Reveal in Finder' : 'Reveal in Explorer',
          onClick: () => commands.openInExplorer(path),
        },
        { label: 'Settings', onClick: handleOpenCollectionView },
        { label: 'Open in Terminal', onClick: handleOpenInTerminal },
        { label: '', separator: true },
        { label: 'Remove', danger: true, onClick: () => setShowRemoveConfirm(true) },
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
    isExpanded,
    handleCreateRequest,
    handleCreateFolder,
    handleCreateJsFile,
    handleClone,
    handleOpenCollectionView,
    handleOpenInTerminal,
    handleDuplicate,
    onClick,
    onToggle,
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
        data-path={path}
        tabIndex={0}
        className={`flex items-center gap-1.5 h-[28px] cursor-pointer group transition-colors outline-none focus:bg-bg-highlight ${
          isActive || selectedPath === path ? 'bg-bg-highlight' : isHovered ? 'bg-bg-muted' : ''
        }`}
        style={{ paddingLeft: `${indentation}px`, paddingRight: '12px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          setSelectedPath(path)
          if (type === 'request') {
            onClick?.()
          } else {
            onToggle?.()
          }
        }}
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

        {isHovered && !isRenaming && type === 'collection' && (
          <button
            className="p-1 hover:bg-bg-highlight rounded text-text-muted hover:text-text-primary transition-opacity opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onOpenSettings?.()
            }}
            title="Collection Settings"
          >
            <Icons.Settings size={14} />
          </button>
        )}

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

      <Dialog
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={handleRemove}
        title={`Remove "${label}" from workspace?`}
        description="The files on disk will not be deleted. You can re-add this collection later."
        confirmLabel="Remove"
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
