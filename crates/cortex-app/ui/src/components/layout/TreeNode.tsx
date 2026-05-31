import React, { useState, useMemo, useCallback } from 'react'
import * as Icons from '../ui/Icons'
import MethodBadge from '../ui/MethodBadge'
import ContextMenu from '../ui/ContextMenu'
import type { ContextMenuItem } from '../ui/ContextMenu'
import Dialog from '../ui/Dialog'
import InlineInput from '../ui/InlineInput'
import InfoPanel from '../ui/InfoPanel'
import { commands } from '../../bindings'
import { useCollectionStore, type DropIndicator } from '../../stores/collectionStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useTabs } from '../../contexts/TabsContext'
import { toast } from '../../stores/toastStore'
import { useUIStore } from '../../stores/uiStore'
import { type TreeNodeType } from '../../utils/dndUtils'

interface TreeNodeProps {
  label: string
  depth: number
  type: TreeNodeType
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
  // DnD props
  parentPath?: string
  dropIndicator?: DropIndicator | null
  isDragSource?: boolean
  onNodeMouseDown?: (
    e: React.MouseEvent,
    path: string,
    type: 'folder' | 'request',
    parentPath: string
  ) => void
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
  parentPath,
  dropIndicator,
  isDragSource,
  onNodeMouseDown,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [isRenaming, setIsRenaming] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [folderItemCount, setFolderItemCount] = useState<number | null>(null)
  const [folderFolderCount, setFolderFolderCount] = useState<number | null>(null)
  const {
    searchQuery,
    collections,
    clearCollection,
    loadCollection,
    selectedPath,
    setSelectedPath,
    renamingPath,
    setRenamingPath,
    setClipboard,
  } = useCollectionStore()
  const { activeWorkspacePath, loadWorkspace } = useWorkspaceStore()
  const { tabs, updateTab, closeTabsWhere, openTab } = useTabs()
  const { openNewRequestDialog, openNewTransientDialog } = useUIStore()

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
          clearCollection(path)
          if (activeWorkspacePath) {
            await loadWorkspace(activeWorkspacePath)
            await loadCollection(res.data)
          }
        } else {
          if (collectionPath) await loadCollection(collectionPath)
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

  const handleCloneFolder = useCallback(async () => {
    try {
      const res = await commands.cloneFolder(path)
      if (res.status === 'ok') {
        if (collectionPath) await loadCollection(collectionPath)
        toast.success(`Folder cloned successfully`)
      } else {
        toast.error(`Clone failed: ${res.error}`)
      }
    } catch (err) {
      toast.error(`Clone failed: ${String(err)}`)
    }
  }, [path, collectionPath, loadCollection])

  const handleCreateRequest = useCallback(() => {
    if (type === 'collection') {
      openNewRequestDialog(path, null)
    } else {
      openNewRequestDialog(collectionPath || path, path)
    }
  }, [type, path, collectionPath, openNewRequestDialog])

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
          folderPath: null,
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
      folderPath: null,
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

  const handleCopy = useCallback(() => {
    if (type === 'folder' || type === 'request') {
      setClipboard(path, type)
      toast.success(`"${label}" copied to clipboard`)
    }
  }, [path, label, type, setClipboard])

  const handleShowDeleteConfirm = useCallback(async () => {
    if (type === 'folder') {
      const res = await commands.getItemInfo(path)
      if (res.status === 'ok') {
        setFolderItemCount(res.data.item_count ?? 0)
        setFolderFolderCount(res.data.folder_count ?? 0)
      } else {
        setFolderItemCount(null)
        setFolderFolderCount(null)
      }
    }
    setShowDeleteConfirm(true)
  }, [type, path])

  const deleteDescription = useMemo(() => {
    if (type === 'folder') {
      const parts: string[] = []
      if (folderItemCount)
        parts.push(`${folderItemCount} request${folderItemCount !== 1 ? 's' : ''}`)
      if (folderFolderCount)
        parts.push(`${folderFolderCount} folder${folderFolderCount !== 1 ? 's' : ''}`)
      const countText =
        folderItemCount !== null && folderFolderCount !== null
          ? parts.length > 0
            ? ` It contains ${parts.join(' and ')}.`
            : ' It is empty.'
          : ''
      return `This will permanently delete the folder "${label}".${countText} This action cannot be undone.`
    }
    return `This will permanently delete the request "${label}". This action cannot be undone.`
  }, [type, label, folderItemCount, folderFolderCount])

  const contextMenuItems = useMemo((): ContextMenuItem[] => {
    const creationGroup: ContextMenuItem[] = [
      { label: 'New Request', shortcut: 'Cmd+⇧N', onClick: handleCreateRequest },
      { label: 'New Transient Request', shortcut: 'Cmd+B', onClick: openNewTransientDialog },
      {
        label: 'New Quick Request',
        shortcut: 'Cmd+N',
        onClick: () =>
          openTab({
            type: 'request',
            requestPath: null,
            collectionId: null,
            collectionPath: null,
            folderPath: null,
            name: 'Untitled',
            method: 'GET',
          }),
      },
      { label: 'New Folder', onClick: handleCreateFolder },
      { label: 'New JS File', onClick: handleCreateJsFile },
    ]

    if (type === 'collection') {
      return [
        ...creationGroup,
        { label: '', separator: true },
        { label: 'Run', disabled: true, onClick: () => {} },
        { label: '', separator: true },
        { label: 'Clone', onClick: handleClone },
        { label: 'Rename', onClick: () => setIsRenaming(true) },
        { label: 'Share', onClick: () => toast.info('Share is coming in a future release') },
        {
          label: 'Generate Docs',
          onClick: () => toast.info('Documentation generation is coming in a future release'),
        },
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
        ...creationGroup,
        { label: '', separator: true },
        { label: 'Run', disabled: true, onClick: () => {} },
        { label: '', separator: true },
        { label: 'Clone', onClick: handleCloneFolder },
        { label: 'Copy', onClick: handleCopy },
        { label: 'Rename', onClick: () => setIsRenaming(true) },
        {
          label: isMac ? 'Reveal in Finder' : 'Reveal in Explorer',
          onClick: () => commands.openInExplorer(path),
        },
        { label: 'Info', onClick: () => setShowInfoPanel(true) },
        {
          label: 'Settings',
          onClick: () =>
            openTab({
              type: 'folder',
              folderPath: path,
              collectionPath: collectionPath,
              collectionId: collectionPath,
              requestPath: null,
              name: label,
              method: '',
            }),
        },
        { label: 'Open in Terminal', onClick: handleOpenInTerminal },
        { label: '', separator: true },
        { label: 'Delete', danger: true, onClick: handleShowDeleteConfirm },
      ]
    }

    // Request
    return [
      { label: 'Clone', onClick: handleDuplicate },
      { label: 'Copy', onClick: handleCopy },
      { label: 'Rename', onClick: () => setIsRenaming(true) },
      {
        label: 'Generate Code',
        onClick: () => toast.info('Code generation is coming in a future release'),
      },
      {
        label: 'Create Example',
        onClick: () => toast.info('Example creation is coming in a future release'),
      },
      {
        label: isMac ? 'Reveal in Finder' : 'Reveal in Explorer',
        onClick: () => commands.openInExplorer(path),
      },
      { label: 'Info', onClick: () => setShowInfoPanel(true) },
      { label: '', separator: true },
      { label: 'Delete', danger: true, onClick: handleShowDeleteConfirm },
    ]
  }, [
    type,
    path,
    isExpanded,
    handleCreateRequest,
    handleCreateFolder,
    handleCreateJsFile,
    handleClone,
    handleCloneFolder,
    handleOpenCollectionView,
    handleOpenInTerminal,
    handleDuplicate,
    handleCopy,
    handleShowDeleteConfirm,
    openNewTransientDialog,
    onToggle,
    openTab,
    label,
    collectionPath,
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
        return <Icons.Workspace size={14} className="text-text-muted" />
      case 'folder':
        return <Icons.Folder size={12} className="text-text-muted" />
      case 'request':
        return method ? <MethodBadge method={method} /> : null
      default:
        return null
    }
  }

  const isDropTarget = dropIndicator?.targetPath === path
  const dropPosition = isDropTarget ? dropIndicator!.position : null

  return (
    <div className="flex flex-col" onContextMenu={handleContextMenu}>
      <div
        data-path={path}
        data-nodetype={type}
        tabIndex={0}
        className={`flex items-center gap-1.5 h-[28px] cursor-pointer group transition-colors outline-none select-none focus:bg-bg-highlight ${
          isActive || selectedPath === path ? 'bg-bg-highlight' : isHovered ? 'bg-bg-muted' : ''
        } ${isDragSource ? 'opacity-40' : ''} ${
          dropPosition === 'inside' ? 'ring-1 ring-inset ring-accent bg-accent/10' : ''
        } ${dropPosition === 'before' ? 'border-t-2 border-accent' : ''} ${
          dropPosition === 'after' ? 'border-b-2 border-accent' : ''
        }`}
        style={{ paddingLeft: `${indentation}px`, paddingRight: '12px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={(e) => {
          if (onNodeMouseDown && type !== 'collection') {
            onNodeMouseDown(e, path, type as 'folder' | 'request', parentPath ?? '')
          }
        }}
        onClick={() => {
          setSelectedPath(path)
          if (type === 'request') {
            onClick?.()
          } else {
            onToggle?.()
          }
        }}
        onDoubleClick={onDoubleClick}
        onKeyDown={(e) => {
          if (e.key === 'F2') {
            e.preventDefault()
            setIsRenaming(true)
          }
        }}
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
        description={deleteDescription}
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

      <InfoPanel
        isOpen={showInfoPanel}
        onClose={() => setShowInfoPanel(false)}
        path={path}
        type={type as 'folder' | 'request'}
      />
    </div>
  )
}

export default TreeNode
