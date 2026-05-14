import React, { useEffect } from 'react'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useCollectionStore } from '../../stores/collectionStore'
import TreeNode from './TreeNode'
import * as Icons from '../ui/Icons'
import type { CollectionItem } from '../../bindings'
import { commands } from '../../bindings'

const SidebarTree: React.FC = () => {
  const {
    activeWorkspace,
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
  } = useCollectionStore()

  // Load last workspace on mount
  useEffect(() => {
    if (!activeWorkspace) {
      loadLastWorkspace()
    }
  }, [loadLastWorkspace, activeWorkspace])

  const handleOpenCollection = async () => {
    try {
      const result = await commands.pickDirectory('Open Collection or Workspace')
      if (result.status === 'ok' && result.data) {
        // Try to load as workspace first. If it fails, maybe it's just a collection?
        // For now, let's just load as workspace.
        await loadWorkspace(result.data)
      }
    } catch (e) {
      console.error('Failed to open collection', e)
    }
  }

  const handleCreateCollection = async () => {
    try {
      const name = window.prompt('Collection Name')
      if (!name) return

      const result = await commands.pickDirectory('Select Directory to Create Collection In')
      if (result.status === 'ok' && result.data) {
        const createRes = await commands.createCollection(name, result.data)
        if (createRes.status === 'ok') {
          // Add to workspace or load as standalone?
          // For now, let's just load the workspace at that path if it's a workspace
          // or load the collection directly.
          // Better: just load the directory we just created.
          await loadWorkspace(createRes.data)
        }
      }
    } catch (e) {
      console.error('Failed to create collection', e)
    }
  }

  const renderItems = (items: CollectionItem[], depth: number, collectionPath: string) => {
    return items.map((item) => {
      if (item.type === 'Folder') {
        const folder = item.data
        const isExpanded = expansionState[folder.path] || false
        return (
          <React.Fragment key={folder.path}>
            <TreeNode
              label={folder.name}
              depth={depth}
              type="folder"
              isExpanded={isExpanded}
              onToggle={() => toggleExpansion(folder.path)}
            />
            {isExpanded && renderItems(folder.items, depth + 1, collectionPath)}
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
            method={request.content?.method || 'GET'}
            onClick={() => console.log('Open request:', request.path)}
          />
        )
      }
    })
  }

  const renderCollections = () => {
    if (!activeWorkspace || activeWorkspace.collections.length === 0) {
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
              onClick={handleCreateCollection}
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

    return (
      <div className="py-1">
        {activeWorkspace.collections.map((colRef) => {
          const colData = collections[colRef.path]
          const isExpanded = expansionState[colRef.path] || false
          const isLoading = loadingCollections[colRef.path] || false
          const error = errors[colRef.path] || colRef.error

          const handleToggle = () => {
            if (!isExpanded && !colData) {
              loadCollection(colRef.path)
            }
            toggleExpansion(colRef.path)
          }

          return (
            <React.Fragment key={colRef.path}>
              <TreeNode
                label={colRef.name || colRef.path.split('/').pop() || 'Collection'}
                depth={0}
                type="collection"
                isExpanded={isExpanded}
                isLoading={isLoading}
                error={error}
                onToggle={handleToggle}
              />
              {isExpanded && colData && renderItems(colData.items, 1, colRef.path)}
            </React.Fragment>
          )
        })}
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
