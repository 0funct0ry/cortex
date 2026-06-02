import React, { useState, useMemo, useCallback } from 'react'
import * as Icons from '../ui/Icons'
import MethodBadge from '../ui/MethodBadge'
import ContextMenu from '../ui/ContextMenu'
import type { ContextMenuItem } from '../ui/ContextMenu'
import Dialog from '../ui/Dialog'
import InlineInput from '../ui/InlineInput'
import InfoPanel from '../ui/InfoPanel'
import { commands } from '../../bindings'
import {
  useCollectionStore,
  getAllTagsFromCollections,
  type DropIndicator,
} from '../../stores/collectionStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useTabs } from '../../contexts/TabsContext'
import { toast } from '../../stores/toastStore'
import { useUIStore } from '../../stores/uiStore'
import { type TreeNodeType } from '../../utils/dndUtils'
import { getTagColor } from '../../utils/tagColors'
import { TagManagerDialog } from '../composer/TagManagerDialog'
import { useCollectionRunnerStore, buildRunnerItems } from '../../stores/collectionRunnerStore'

interface SiblingItem {
  path: string
}

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
  dimmed?: boolean
  requestTags?: string[]
  collectionPath?: string
  /** Whether this collection has a Git repository initialised in its root directory */
  isGitRepo?: boolean
  /** Sibling items at the same level, used for Move Up / Move Down */
  siblings?: SiblingItem[]
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
  dimmed,
  requestTags,
  collectionPath,
  isGitRepo,
  siblings,
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
  const [showTagManager, setShowTagManager] = useState(false)
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
  const { openNewRequestDialog, openNewTransientDialog, openImportFolderDialog, openShareModal } =
    useUIStore()

  React.useEffect(() => {
    if (renamingPath === path) {
      setTimeout(() => {
        setIsRenaming(true)
        setRenamingPath(null)
      }, 0)
    }
  }, [renamingPath, path, setRenamingPath])

  const resolvedCollectionPath = useMemo(() => {
    if (type === 'collection') return path
    for (const colPath of Object.keys(collections)) {
      if (path.startsWith(colPath)) return colPath
    }
    return ''
  }, [type, path, collections])

  const {
    open: openRunner,
    scope: runnerScope,
    runStatus: runnerStatus,
  } = useCollectionRunnerStore()

  const isRunnerActive = runnerScope?.path === path
  const isRunnerRunning = isRunnerActive && runnerStatus === 'running'
  const isRunnerDone =
    isRunnerActive && (runnerStatus === 'completed' || runnerStatus === 'aborted')

  const handleRun = useCallback(() => {
    const items = buildRunnerItems(path, type as 'collection' | 'folder')
    openRunner(
      {
        path,
        type: type as 'collection' | 'folder',
        label,
        collectionPath: resolvedCollectionPath || path,
      },
      items
    )
  }, [path, type, label, resolvedCollectionPath, openRunner])

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
          if (resolvedCollectionPath) await loadCollection(resolvedCollectionPath)
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
        if (resolvedCollectionPath) await loadCollection(resolvedCollectionPath)
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
        if (resolvedCollectionPath) await loadCollection(resolvedCollectionPath)
      }
    } catch (err) {
      toast.error(`Duplicate failed: ${String(err)}`)
    }
  }, [path, resolvedCollectionPath, loadCollection])

  const handleCloneFolder = useCallback(async () => {
    try {
      const res = await commands.cloneFolder(path)
      if (res.status === 'ok') {
        if (resolvedCollectionPath) await loadCollection(resolvedCollectionPath)
        toast.success(`Folder cloned successfully`)
      } else {
        toast.error(`Clone failed: ${res.error}`)
      }
    } catch (err) {
      toast.error(`Clone failed: ${String(err)}`)
    }
  }, [path, resolvedCollectionPath, loadCollection])

  const handleCreateRequest = useCallback(() => {
    if (type === 'collection') {
      openNewRequestDialog(path, null)
    } else {
      openNewRequestDialog(resolvedCollectionPath || path, path)
    }
  }, [type, path, resolvedCollectionPath, openNewRequestDialog])

  const handleCreateFolder = useCallback(async () => {
    try {
      const res = await commands.createFolder('New Folder', path)
      if (res.status === 'ok') {
        await loadCollection(resolvedCollectionPath || path)
        useCollectionStore.getState().setRenamingPath(res.data)
      }
    } catch (err) {
      toast.error(`Create folder failed: ${String(err)}`)
    }
  }, [path, resolvedCollectionPath, loadCollection])

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

  const handleImportFolder = useCallback(() => {
    openImportFolderDialog(path, type as 'collection' | 'folder', collectionPath ?? path)
  }, [path, type, collectionPath, openImportFolderDialog])

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

  const siblingIndex = useMemo(
    () => (siblings ? siblings.findIndex((s) => s.path === path) : -1),
    [siblings, path]
  )
  const canMoveUp = siblingIndex > 0
  const canMoveDown =
    siblings !== undefined && siblingIndex >= 0 && siblingIndex < siblings.length - 1

  const handleMoveUp = useCallback(async () => {
    if (!canMoveUp || !siblings) return
    const target = siblings[siblingIndex - 1]
    try {
      const res = await commands.reorderItem(path, target.path, 'before')
      if (res.status === 'ok') {
        if (resolvedCollectionPath) await loadCollection(resolvedCollectionPath)
      } else {
        toast.error(`Move Up failed: ${res.error}`)
      }
    } catch (err) {
      toast.error(`Move Up failed: ${String(err)}`)
    }
  }, [canMoveUp, siblings, siblingIndex, path, resolvedCollectionPath, loadCollection])

  const handleMoveDown = useCallback(async () => {
    if (!canMoveDown || !siblings) return
    const target = siblings[siblingIndex + 1]
    try {
      const res = await commands.reorderItem(path, target.path, 'after')
      if (res.status === 'ok') {
        if (resolvedCollectionPath) await loadCollection(resolvedCollectionPath)
      } else {
        toast.error(`Move Down failed: ${res.error}`)
      }
    } catch (err) {
      toast.error(`Move Down failed: ${String(err)}`)
    }
  }, [canMoveDown, siblings, siblingIndex, path, resolvedCollectionPath, loadCollection])

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
        { label: 'Run', onClick: handleRun },
        { label: '', separator: true },
        { label: 'Clone', onClick: handleClone },
        { label: 'Import from folder…', onClick: handleImportFolder },
        { label: 'Rename', onClick: () => setIsRenaming(true) },
        { label: 'Share', onClick: () => openShareModal(path, label) },
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
        { label: 'Run', onClick: handleRun },
        { label: '', separator: true },
        { label: 'Move Up', shortcut: '⌥↑', disabled: !canMoveUp, onClick: handleMoveUp },
        { label: 'Move Down', shortcut: '⌥↓', disabled: !canMoveDown, onClick: handleMoveDown },
        { label: '', separator: true },
        { label: 'Clone', onClick: handleCloneFolder },
        { label: 'Import from folder…', onClick: handleImportFolder },
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
              collectionPath: collectionPath ?? null,
              collectionId: collectionPath ?? null,
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
      { label: 'Move Up', shortcut: '⌥↑', disabled: !canMoveUp, onClick: handleMoveUp },
      { label: 'Move Down', shortcut: '⌥↓', disabled: !canMoveDown, onClick: handleMoveDown },
      { label: '', separator: true },
      { label: 'Clone', onClick: handleDuplicate },
      { label: 'Copy', onClick: handleCopy },
      { label: 'Rename', onClick: () => setIsRenaming(true) },
      { label: 'Manage Tags', onClick: () => setShowTagManager(true) },
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
    handleRun,
    handleDuplicate,
    handleCopy,
    handleShowDeleteConfirm,
    handleMoveUp,
    handleMoveDown,
    canMoveUp,
    canMoveDown,
    openNewTransientDialog,
    handleImportFolder,
    onToggle,
    openTab,
    label,
    collectionPath,
    openShareModal,
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
        } ${isDragSource || dimmed ? 'opacity-40' : ''} ${
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
          {type === 'collection' && isGitRepo && !isRenaming && (
            <span
              title="Git repository initialized"
              className="ml-auto shrink-0 flex items-center gap-0.5 text-text-muted opacity-50"
            >
              <Icons.Branch size={10} />
            </span>
          )}
          {type === 'request' &&
            requestTags &&
            requestTags.length > 0 &&
            !isRenaming &&
            (() => {
              const allColTags = getAllTagsFromCollections(
                collectionPath
                  ? { [collectionPath]: useCollectionStore.getState().collections[collectionPath] }
                  : {}
              )
              const visible = requestTags.slice(0, 3)
              const extra = requestTags.length - 3
              return (
                <span className="ml-auto flex shrink-0 items-center gap-0.5 pl-1">
                  {visible.map((tagName) => {
                    const def = allColTags.find((t) => t.name === tagName)
                    const color = getTagColor(def?.color ?? 'gray')
                    return (
                      <span
                        key={tagName}
                        className="h-2 w-2 rounded-full"
                        style={{ background: color.bg }}
                        title={tagName}
                      />
                    )
                  })}
                  {extra > 0 && <span className="text-[9px] text-text-muted">+{extra}</span>}
                </span>
              )
            })()}
        </div>

        {(type === 'collection' || type === 'folder') && isRunnerRunning && (
          <span className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {(type === 'collection' || type === 'folder') && isRunnerDone && !isRunnerRunning && (
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              runnerStatus === 'completed' ? 'bg-success' : 'bg-warning'
            }`}
          />
        )}

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

      {type === 'request' && (
        <TagManagerDialog
          open={showTagManager}
          onClose={() => setShowTagManager(false)}
          collectionPath={collectionPath ?? ''}
          requestPath={path}
          initialTags={requestTags ?? []}
        />
      )}
    </div>
  )
}

export default TreeNode
