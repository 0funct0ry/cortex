import React, { useState, useEffect, useRef, useMemo } from 'react'
import { marked } from 'marked'
import * as Icons from '../ui/Icons'
import { useWorkspaceStore } from '../../stores/workspaceStore'

const STORAGE_PREFIX = 'cortex.workspace.docs.'

const DocumentationPanel: React.FC = () => {
  const { activeWorkspacePath } = useWorkspaceStore()

  const [docs, setDocs] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [draftDocs, setDraftDocs] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!activeWorkspacePath) return
    const value = localStorage.getItem(`${STORAGE_PREFIX}${activeWorkspacePath}`) ?? ''
    setTimeout(() => {
      setDocs(value)
      setIsEditing(false)
      setDraftDocs(value)
    }, 0)
  }, [activeWorkspacePath])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  const handleStartEdit = () => {
    setDraftDocs(docs)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!activeWorkspacePath) return
    localStorage.setItem(`${STORAGE_PREFIX}${activeWorkspacePath}`, draftDocs)
    setDocs(draftDocs)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDraftDocs(docs)
    setIsEditing(false)
  }

  const hasDocs = docs.trim().length > 0
  const renderedHtml = useMemo(() => marked.parse(docs) as string, [docs])

  return (
    <div className="w-[380px] border-l border-border-subtle flex flex-col h-full bg-bg-panel/20 shrink-0">
      {/* Header */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-border-subtle shrink-0 bg-bg-panel/30">
        <div className="flex items-center gap-2">
          <Icons.FileText size={14} className="text-text-muted" />
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Documentation
          </span>
        </div>
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCancel}
              className="h-6 px-2.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="h-6 px-2.5 text-xs font-semibold bg-accent hover:bg-accent-hover text-accent-fg rounded transition-colors"
            >
              Save
            </button>
          </div>
        ) : hasDocs ? (
          <button
            onClick={handleStartEdit}
            className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
            title="Edit documentation"
          >
            <Icons.Edit size={14} />
          </button>
        ) : null}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={draftDocs}
            onChange={(e) => setDraftDocs(e.target.value)}
            placeholder="Write workspace documentation, notes, and guides here..."
            className="flex-1 w-full resize-none bg-bg-base text-text-primary text-sm font-mono p-4 focus:outline-none placeholder:text-text-muted/50 leading-relaxed custom-scrollbar"
          />
        ) : hasDocs ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <div className="docs-content" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 select-none">
            <div className="text-text-muted opacity-10 mb-5">
              <Icons.FileText size={48} strokeWidth={1} />
            </div>
            <p className="text-sm font-medium text-text-secondary mb-1.5">No documentation yet</p>
            <p className="text-xs text-text-muted text-center leading-relaxed max-w-[220px] mb-6">
              Add workspace documentation, notes, and guides here.
            </p>
            <button
              onClick={handleStartEdit}
              className="h-8 flex items-center gap-2 px-3 bg-bg-surface hover:bg-bg-muted border border-border-subtle hover:border-border-default text-text-primary text-xs font-medium rounded-md transition-all"
            >
              <Icons.Plus size={13} />
              Add Documentation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentationPanel
