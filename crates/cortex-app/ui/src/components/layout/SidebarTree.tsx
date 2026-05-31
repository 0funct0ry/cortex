import React, { useEffect, useState, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useTabs } from '../../contexts/TabsContext'
import { toast } from '../../stores/toastStore'
import TreeNode from './TreeNode'
import * as Icons from '../ui/Icons'
import Tooltip from '../ui/Tooltip'
import { useRequestStore } from '../../stores/requestStore'
import type { CollectionItem, RequestFile } from '../../bindings'
import { commands } from '../../bindings'

const InlineCreateRow: React.FC = () => {
  const { activeWorkspace, activeWorkspacePath, loadWorkspace } = useWorkspaceStore()
  const { setCreatingInline, setExpanded, loadCollection } = useCollectionStore()

  // Generate initial default name
  const defaultName = useMemo(() => {
    if (!activeWorkspace) return 'Untitled Collection - 1'
    let counter = 1
    let proposed = `Untitled Collection - ${counter}`
    const existingNames = new Set(
      activeWorkspace.collections
        .map((c) => c.name?.toLowerCase().trim())
        .filter((n): n is string => !!n)
    )
    while (existingNames.has(proposed.toLowerCase())) {
      counter++
      proposed = `Untitled Collection - ${counter}`
    }
    return proposed
  }, [activeWorkspace])

  const [name, setName] = useState(defaultName)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Focus and select text on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  // Validation
  const trimmedName = name.trim()
  let isInvalid = false
  let tooltipContent = ''

  if (trimmedName === '') {
    isInvalid = true
    tooltipContent = 'Collection name cannot be empty'
  } else if (activeWorkspace) {
    const nameExists = activeWorkspace.collections.some(
      (c) => c.name?.toLowerCase().trim() === trimmedName.toLowerCase()
    )
    if (nameExists) {
      isInvalid = true
      tooltipContent = 'A collection with this name already exists'
    }
  }

  // Path resolution helpers
  const getParentDirectory = (filePath: string) => {
    const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'))
    if (lastSlash === -1) return ''
    return filePath.substring(0, lastSlash)
  }

  const joinPath = (parent: string, child: string) => {
    const isWindows = parent.includes('\\')
    const separator = isWindows ? '\\' : '/'
    return `${parent}${separator}${child}`
  }

  const handleConfirm = async () => {
    if (isInvalid || isSubmitting || !activeWorkspacePath) return
    setIsSubmitting(true)

    try {
      const workspaceDir = getParentDirectory(activeWorkspacePath)
      const newCollectionPath = joinPath(workspaceDir, trimmedName)
      const createRes = await commands.createCollection(trimmedName, newCollectionPath)

      if (createRes.status === 'ok') {
        const relativePath = `./${trimmedName}`
        const addRes = await commands.addCollectionToWorkspace(activeWorkspacePath, relativePath)

        if (addRes.status === 'ok') {
          // Reload workspace
          await loadWorkspace(activeWorkspacePath)
          // Mark the new collection as expanded
          setExpanded(newCollectionPath, true)
          // Load the collection itself
          await loadCollection(newCollectionPath)
          toast.success(`Collection "${trimmedName}" created`)
          setCreatingInline(false)
        } else {
          toast.error(`Failed to add collection to workspace: ${addRes.error}`)
        }
      } else {
        toast.error(`Failed to create collection: ${createRes.error}`)
      }
    } catch (e) {
      toast.error(`Error creating collection: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setCreatingInline(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleConfirm()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const checkButton = (
    <button
      disabled={isInvalid || isSubmitting}
      onClick={handleConfirm}
      className={`p-1 rounded transition-colors ${
        isInvalid || isSubmitting
          ? 'text-text-muted/40 cursor-not-allowed'
          : 'text-success hover:bg-success/12'
      }`}
    >
      <Icons.Check size={14} />
    </button>
  )

  return (
    <div
      className="flex items-center gap-1.5 h-[28px] select-none"
      style={{ paddingLeft: '12px', paddingRight: '12px' }}
    >
      {/* Spacer to align with collections that have a chevron */}
      <div className="w-3 h-3 flex items-center justify-center">
        <Icons.ChevronDown size={12} className="text-text-muted/50 -rotate-90" />
      </div>

      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <Icons.Folder size={14} className="text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-bg-surface border border-border-default focus:border-accent rounded px-1 outline-none text-sm w-full h-[22px] text-text-primary placeholder:text-text-muted"
          disabled={isSubmitting}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Icons.Settings size={14} className="text-text-muted/40 cursor-not-allowed mr-0.5" />
        {isInvalid ? (
          <Tooltip content={tooltipContent} position="top" align="center">
            {checkButton}
          </Tooltip>
        ) : (
          checkButton
        )}
        <button
          onClick={handleCancel}
          className="p-1 rounded text-error hover:bg-error/12 transition-colors"
          disabled={isSubmitting}
        >
          <Icons.X size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Path helpers (used by AddRequestLink) ───────────────────────────────────

const getParentDirectory = (filePath: string) => {
  const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'))
  if (lastSlash === -1) return ''
  return filePath.substring(0, lastSlash)
}

const joinPath = (parent: string, child: string) => {
  const isWindows = parent.includes('\\')
  const separator = isWindows ? '\\' : '/'
  return `${parent}${separator}${child}`
}

const doesPathExist = (items: CollectionItem[], pathToCheck: string): boolean => {
  for (const item of items) {
    if (item.type === 'Folder') {
      if (item.data.path === pathToCheck) return true
      if (doesPathExist(item.data.items, pathToCheck)) return true
    } else if (item.type === 'Request') {
      if (item.data.path === pathToCheck) return true
    }
  }
  return false
}

const getUniqueRequestName = (parentPath: string, items: CollectionItem[]): string => {
  let name = 'New Request'
  let path = joinPath(parentPath, name + '.crx')
  if (!doesPathExist(items, path)) {
    return name
  }
  let counter = 1
  while (true) {
    name = `New Request ${counter}`
    path = joinPath(parentPath, name + '.crx')
    if (!doesPathExist(items, path)) {
      return name
    }
    counter++
  }
}

const getTargetDirectory = (collectionPath: string, selectedPath: string | null): string => {
  if (!selectedPath) return collectionPath

  const isSubPath =
    selectedPath === collectionPath ||
    selectedPath.startsWith(collectionPath + '/') ||
    selectedPath.startsWith(collectionPath + '\\')

  if (!isSubPath) return collectionPath

  if (selectedPath.endsWith('.crx')) {
    return getParentDirectory(selectedPath)
  }
  return selectedPath
}

// ─── Protocol dropdown ────────────────────────────────────────────────────────

interface ProtocolDropdownProps {
  x: number
  y: number
  onClose: () => void
  onSelect: (method: string, url: string) => void
}

const ProtocolDropdown: React.FC<ProtocolDropdownProps> = ({ x, y, onClose, onSelect }) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x, y })

  // Clip to viewport after first render so we know the dropdown's size
  useEffect(() => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      let newX = x + 12
      let newY = y
      if (newX < 12) newX = 12
      if (newX + rect.width > window.innerWidth) newX = window.innerWidth - rect.width - 8
      if (newY + rect.height > window.innerHeight) newY = window.innerHeight - rect.height - 8
      setPosition({ x: newX, y: newY })
    }
  }, [x, y])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) onClose()
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

  const options = [
    {
      label: 'HTTP',
      method: 'GET',
      url: 'https://',
      icon: Icons.Api,
      colorClass: 'text-method-get bg-method-get/15',
    },
    {
      label: 'GraphQL',
      method: 'GraphQL',
      url: 'https://',
      icon: Icons.Star,
      colorClass: 'text-method-graphql bg-method-graphql/15',
    },
    {
      label: 'gRPC',
      method: 'gRPC',
      url: 'grpc://',
      icon: Icons.Code,
      colorClass: 'text-method-grpc bg-method-grpc/15',
    },
    {
      label: 'WebSocket',
      method: 'WS',
      url: 'ws://',
      icon: Icons.Plug,
      colorClass: 'text-method-ws bg-method-ws/15',
    },
  ]

  return createPortal(
    <div
      ref={dropdownRef}
      className="fixed z-[100] w-[180px] bg-bg-overlay border border-border-default rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.3)] py-1 select-none animate-in fade-in zoom-in-95 duration-100"
      style={{ left: position.x, top: position.y }}
    >
      {options.map((opt) => {
        const IconComponent = opt.icon
        return (
          <div
            key={opt.label}
            className="flex items-center gap-2.5 px-3 h-[30px] text-sm text-text-primary hover:bg-bg-highlight cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(opt.method, opt.url)
            }}
          >
            <div
              className={`w-[20px] h-[20px] flex items-center justify-center rounded-sm ${opt.colorClass}`}
            >
              <IconComponent size={12} />
            </div>
            <span className="font-medium text-xs text-text-secondary">{opt.label}</span>
          </div>
        )
      })}
    </div>,
    document.body
  )
}

// ─── Add Request link ─────────────────────────────────────────────────────────

interface AddRequestLinkProps {
  collectionPath: string
}

const AddRequestLink: React.FC<AddRequestLinkProps> = ({ collectionPath }) => {
  const { collections, selectedPath, loadCollection } = useCollectionStore()
  const { openTab } = useTabs()
  const [dropdownPosition, setDropdownPosition] = useState<{ x: number; y: number } | null>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setDropdownPosition({ x: rect.left, y: rect.bottom })
  }

  const handleSelectProtocol = async (method: string, url: string) => {
    setDropdownPosition(null)
    const colData = collections[collectionPath]
    if (!colData) return

    const targetDir = getTargetDirectory(collectionPath, selectedPath)
    const reqName = getUniqueRequestName(targetDir, colData.items)

    try {
      const res = await commands.createRequest(reqName, targetDir, method)
      if (res.status !== 'ok') {
        toast.error(`Failed to create request: ${res.error}`)
        return
      }

      const newRequestPath = res.data

      const defaultContent: RequestFile = {
        version: '1',
        name: reqName,
        method,
        url,
        headers: {},
        params: {},
        body: null,
      }

      await loadCollection(collectionPath)

      // Capture the UUID returned by openTab — the Composer keys store state
      // by this UUID, not by the file path.
      const tabId = openTab({
        type: 'request',
        requestPath: newRequestPath,
        collectionId: collectionPath,
        collectionPath: null,
        folderPath: null,
        name: reqName,
        method,
      })

      // Populate in-memory store under the correct UUID before React renders.
      useRequestStore.getState().populateRequest(tabId, defaultContent)

      // Highlight the new node in the sidebar immediately.
      useCollectionStore.getState().setSelectedPath(newRequestPath)

      // Persist url/method to disk (createRequest only writes name+method with
      // a hardcoded default URL; saveRequest writes the full RequestFile).
      await useRequestStore.getState().saveRequest(tabId, newRequestPath)

      // Enter inline rename mode so the user can name the request.
      useCollectionStore.getState().setRenamingPath(newRequestPath)
    } catch (e) {
      toast.error(`Error creating request: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return (
    <>
      <div
        className="flex items-center gap-1.5 h-[28px] cursor-pointer text-text-muted hover:text-text-primary transition-colors text-xs select-none group"
        style={{ paddingLeft: '24px', paddingRight: '12px' }}
        onClick={handleClick}
      >
        <Icons.Plus size={12} className="text-text-muted/60 group-hover:text-text-primary" />
        <span>Add request</span>
      </div>

      {dropdownPosition && (
        <ProtocolDropdown
          x={dropdownPosition.x}
          y={dropdownPosition.y}
          onClose={() => setDropdownPosition(null)}
          onSelect={handleSelectProtocol}
        />
      )}
    </>
  )
}

const SidebarTree: React.FC = () => {
  const {
    activeWorkspace,
    activeWorkspacePath,
    isLoading: isWorkspaceLoading,
    error: workspaceError,
    loadWorkspace,
    loadLastWorkspace,
  } = useWorkspaceStore()

  const {
    collections,
    loadingCollections,
    errors,
    expansionState,
    loadCollection,
    toggleExpansion,
    searchQuery,
    isCreatingInline,
    setCreatingInline,
  } = useCollectionStore()

  const { openTab, activeTab } = useTabs()

  // Load last workspace on mount
  useEffect(() => {
    if (!activeWorkspace) {
      loadLastWorkspace()
    }
  }, [loadLastWorkspace, activeWorkspace])

  // Ensure expanded collections are loaded
  useEffect(() => {
    if (activeWorkspace) {
      activeWorkspace.collections.forEach((col) => {
        const isExpanded = searchQuery ? true : expansionState[col.path] || false
        if (isExpanded && !collections[col.path] && !loadingCollections[col.path]) {
          loadCollection(col.path)
        }
      })
    }
  }, [
    activeWorkspace,
    expansionState,
    collections,
    loadingCollections,
    loadCollection,
    searchQuery,
  ])

  const handleOpenCollection = async () => {
    try {
      const result = await commands.pickDirectory('Open Collection or Workspace')
      if (!result.status || result.status !== 'ok' || !result.data) return

      const dirType = await commands.detectDirectoryType(result.data)

      if (dirType === 'workspace') {
        // It's a workspace directory — load it as such
        await loadWorkspace(result.data)
      } else if (dirType === 'collection') {
        // It's a bare collection directory — add it to the active workspace
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

  const renderItems = (
    items: CollectionItem[],
    depth: number,
    collectionPath: string,
    query: string
  ) => {
    // Filter logic:
    // 1. If query is empty, show everything.
    // 2. If item matches query, show it.
    // 3. If item is a folder and has matching children, show it.

    const filteredItems = items.filter((item) => {
      if (!query) return true

      const q = query.toLowerCase()
      if (item.type === 'Request') {
        return item.data.name.toLowerCase().includes(q)
      } else {
        // Folder matches if its name matches OR any of its children match
        const matchesName = item.data.name.toLowerCase().includes(q)
        const hasMatchingChildren = (items: CollectionItem[]): boolean => {
          return items.some((child) => {
            if (child.type === 'Request') {
              return child.data.name.toLowerCase().includes(q)
            } else {
              return (
                child.data.name.toLowerCase().includes(q) || hasMatchingChildren(child.data.items)
              )
            }
          })
        }
        return matchesName || hasMatchingChildren(item.data.items)
      }
    })

    if (filteredItems.length === 0 && query && depth === 1) {
      // This is handled by the caller to show "No results" if the whole tree is empty
    }

    return filteredItems.map((item) => {
      if (item.type === 'Folder') {
        const folder = item.data
        const isExpanded = query ? true : expansionState[folder.path] || false
        return (
          <React.Fragment key={folder.path}>
            <TreeNode
              label={folder.name}
              depth={depth}
              type="folder"
              path={folder.path}
              isExpanded={isExpanded}
              onToggle={() => toggleExpansion(folder.path)}
            />
            {isExpanded && renderItems(folder.items, depth + 1, collectionPath, query)}
          </React.Fragment>
        )
      } else {
        const request = item.data
        return (
          <TreeNode
            key={request.path}
            label={request.name}
            depth={depth}
            type="request"
            path={request.path}
            method={request.content?.method || 'GET'}
            error={request.error}
            isActive={activeTab?.requestPath === request.path}
            onClick={() => {
              const tabId = openTab({
                type: 'request',
                requestPath: request.path,
                collectionId: collectionPath,
                collectionPath: null,
                folderPath: null,
                name: request.name,
                method: request.content?.method || 'GET',
              })
              if (request.content) {
                useRequestStore.getState().populateRequest(tabId, request.content)
              }
            }}
          />
        )
      }
    })
  }

  const renderCollections = () => {
    const showEmptyState =
      !activeWorkspace || (activeWorkspace.collections.length === 0 && !isCreatingInline)
    if (showEmptyState) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center select-none">
          <div className="mb-4 text-text-muted opacity-20">
            <Icons.Folder size={64} strokeWidth={1} />
          </div>
          <h3 className="text-text-secondary text-sm font-medium mb-1">No collections yet</h3>
          <p className="text-text-muted text-xs mb-6">
            Create or open a collection to get started.
          </p>
          <div className="flex flex-col gap-2 w-full max-w-[200px]">
            <button
              onClick={() => setCreatingInline(true)}
              className="h-8 flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-accent-fg text-sm font-medium rounded-md transition-colors"
            >
              <Icons.Plus size={14} />
              Create collection
            </button>
            <button
              onClick={handleOpenCollection}
              className="h-8 flex items-center justify-center gap-2 border border-border-default hover:bg-bg-muted text-text-primary text-sm font-medium rounded-md transition-colors"
            >
              <Icons.Folder size={14} />
              Open collection
            </button>
          </div>
        </div>
      )
    }

    let totalItemsFound = 0

    const collectionsList = activeWorkspace
      ? activeWorkspace.collections.map((colRef) => {
          const colData = collections[colRef.path]
          const isExpanded = searchQuery ? true : expansionState[colRef.path] || false
          const isLoading = loadingCollections[colRef.path] || false
          const error = errors[colRef.path] || colRef.error

          const handleToggle = () => {
            if (!isExpanded && !colData) {
              loadCollection(colRef.path)
            }
            toggleExpansion(colRef.path)
          }

          const items = colData ? renderItems(colData.items, 1, colRef.path, searchQuery) : []
          if (items.length > 0 || !searchQuery) {
            totalItemsFound += items.length
            if (!searchQuery) totalItemsFound++ // Count collection root if not searching
          } else if (
            searchQuery &&
            colRef.name?.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            totalItemsFound++
          } else {
            return null
          }

          const handleOpenCollectionTab = () => {
            openTab({
              type: 'collection',
              collectionPath: colRef.path,
              collectionId: colRef.path,
              requestPath: null,
              folderPath: null,
              name: colRef.name || colRef.path.split('/').pop() || 'Collection',
              method: '',
            })
          }

          return (
            <React.Fragment key={colRef.path}>
              <TreeNode
                label={colRef.name || colRef.path.split('/').pop() || 'Collection'}
                depth={0}
                type="collection"
                path={colRef.path}
                isExpanded={isExpanded}
                isLoading={isLoading}
                error={error}
                onToggle={handleToggle}
                onOpenSettings={handleOpenCollectionTab}
              />
              {isExpanded && colData && (
                <>
                  {items}
                  <AddRequestLink collectionPath={colRef.path} />
                </>
              )}
            </React.Fragment>
          )
        })
      : []

    if (searchQuery && totalItemsFound === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center select-none">
          <p className="text-text-muted text-sm">No results for "{searchQuery}"</p>
        </div>
      )
    }

    return (
      <div className="py-1">
        {collectionsList}
        {isCreatingInline && <InlineCreateRow />}
      </div>
    )
  }

  if (isWorkspaceLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (workspaceError) {
    return <div className="p-4 text-error text-xs">Failed to load workspace: {workspaceError}</div>
  }

  return <div className="flex-1 overflow-y-auto custom-scrollbar">{renderCollections()}</div>
}

export default SidebarTree
