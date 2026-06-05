import React, { useMemo, useState } from 'react'
import { marked } from 'marked'
import * as Icons from '../ui/Icons'
import type { CollectionDraft } from '../../stores/collectionViewStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useUIStore } from '../../stores/uiStore'
import type { CollectionItem } from '../../bindings'

interface CollectionOverviewTabProps {
  draft: CollectionDraft
  collectionPath: string
  onChange: (updates: Partial<CollectionDraft>) => void
}

function countRequests(items: CollectionItem[]): number {
  return items.reduce((count, item) => {
    if (item.type === 'Request') return count + 1
    return count + countRequests(item.data.items)
  }, 0)
}

const CollectionOverviewTab: React.FC<CollectionOverviewTabProps> = ({
  draft,
  collectionPath,
  onChange,
}) => {
  const [showPreview, setShowPreview] = useState(false)
  const { collections } = useCollectionStore()
  const { activeWorkspace } = useWorkspaceStore()
  const { openShareModal, openGenerateDocsModal } = useUIStore()

  const colData = collections[collectionPath]
  const requestCount = useMemo(() => (colData ? countRequests(colData.items) : 0), [colData])
  const envCount = activeWorkspace?.environments.length ?? 0

  const renderedMarkdown = useMemo(() => {
    if (!draft.description) return ''
    return marked.parse(draft.description) as string
  }, [draft.description])

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="p-4 space-y-6 max-w-4xl">
        {/* Collection Name */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Collection Name
          </label>
          <input
            type="text"
            value={draft.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors"
            placeholder="Collection name"
          />
        </div>

        {/* Stats row */}
        <div className="flex gap-4">
          {/* Disk path */}
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Location
            </label>
            <div className="flex items-center gap-2 h-9 bg-bg-muted rounded px-3 border border-border-subtle">
              <Icons.Folder size={13} className="text-text-muted shrink-0" />
              <span className="text-xs font-mono text-text-muted truncate">{collectionPath}</span>
            </div>
          </div>

          {/* Environments */}
          <div className="w-36 shrink-0">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Environments
            </label>
            <div className="flex items-center gap-2 h-9 bg-bg-muted rounded px-3 border border-border-subtle">
              <Icons.Globe size={13} className="text-text-muted shrink-0" />
              <span className="text-sm text-text-secondary">{envCount}</span>
            </div>
          </div>

          {/* Requests */}
          <div className="w-28 shrink-0">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Requests
            </label>
            <div className="flex items-center gap-2 h-9 bg-bg-muted rounded px-3 border border-border-subtle">
              <Icons.Api size={13} className="text-text-muted shrink-0" />
              <span className="text-sm text-text-secondary">{requestCount}</span>
            </div>
          </div>
        </div>

        {/* Action links */}
        <div className="flex gap-3">
          <button
            onClick={() => openShareModal(collectionPath, draft.name)}
            className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-medium transition-colors"
          >
            <Icons.ExternalLink size={13} />
            Share Collection
          </button>
          <span className="text-border-subtle">·</span>
          <button
            onClick={() => openGenerateDocsModal(collectionPath, draft.name)}
            className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-medium transition-colors"
          >
            <Icons.FileText size={13} />
            Generate Docs
          </button>
        </div>

        {/* Markdown documentation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Documentation
            </label>
            <button
              onClick={() => setShowPreview((v) => !v)}
              className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors ${
                showPreview
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-muted'
              }`}
            >
              <Icons.Eye size={12} />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {showPreview ? (
            <div
              className="docs-content min-h-[200px] p-3 bg-bg-surface border border-border-subtle rounded"
              dangerouslySetInnerHTML={{
                __html:
                  renderedMarkdown ||
                  '<em style="color:var(--color-text-muted)">No documentation yet.</em>',
              }}
            />
          ) : (
            <textarea
              value={draft.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={10}
              className="w-full bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 py-2 text-sm text-text-primary outline-none transition-colors resize-y font-mono placeholder:text-text-muted"
              placeholder="Write Markdown documentation for this collection..."
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CollectionOverviewTab
