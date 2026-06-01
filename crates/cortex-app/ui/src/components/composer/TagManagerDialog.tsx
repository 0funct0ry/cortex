import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { TagDefinition } from '../../bindings'
import { commands } from '../../bindings'
import { useCollectionStore, getAllTagsFromCollections } from '../../stores/collectionStore'
import { useRequestStore } from '../../stores/requestStore'
import { TAG_COLORS, getFirstUnusedColor, getTagColor } from '../../utils/tagColors'

interface TagManagerDialogProps {
  open: boolean
  onClose: () => void
  collectionPath: string
  /** If set, tags are read/written through the request store (composer mode). */
  requestId?: string
  /** If set (tree context menu), tags are read from here and saved directly to disk. */
  requestPath?: string
  initialTags?: string[]
}

export const TagManagerDialog: React.FC<TagManagerDialogProps> = ({
  open,
  onClose,
  collectionPath,
  requestId,
  requestPath,
  initialTags,
}) => {
  const { getRequestState, updateRequest } = useRequestStore()
  const { collections, updateTagRegistry, loadCollection } = useCollectionStore()

  const collectionTags = getAllTagsFromCollections(
    collectionPath ? { [collectionPath]: collections[collectionPath] } : {}
  )

  // Determine applied tags source
  const storeAppliedTags = requestId ? (getRequestState(requestId).tags ?? []) : null
  const [localTags, setLocalTags] = useState<string[]>(initialTags ?? [])

  const appliedTags = storeAppliedTags ?? localTags

  const setAppliedTags = async (next: string[]) => {
    if (requestId) {
      updateRequest(requestId, { tags: next })
    } else if (requestPath) {
      setLocalTags(next)
      // Save directly to disk
      try {
        const result = await commands.loadRequest(requestPath)
        if (result.status === 'ok' && result.data.content) {
          const updated = { ...result.data.content, tags: next.length > 0 ? next : undefined }
          await commands.saveRequest(updated, requestPath)
          // Reload the collection so the tree updates
          if (collectionPath) loadCollection(collectionPath)
        }
      } catch (e) {
        console.error('Failed to save tags', e)
      }
    }
  }

  const [query, setQuery] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [newColor, setNewColor] = useState(
    getFirstUnusedColor(collectionTags.map((t) => t.color)).name
  )
  const inputRef = useRef<HTMLInputElement>(null)

  const [lastOpen, setLastOpen] = useState(false)
  if (open && !lastOpen) {
    setLastOpen(true)
    setQuery('')
    setShowNewForm(false)
    setNewColor(getFirstUnusedColor(collectionTags.map((t) => t.color)).name)
    if (initialTags) setLocalTags(initialTags)
  } else if (!open && lastOpen) {
    setLastOpen(false)
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const filtered = collectionTags.filter(
    (t) => !appliedTags.includes(t.name) && t.name.toLowerCase().includes(query.toLowerCase())
  )
  const exactMatch = collectionTags.some((t) => t.name.toLowerCase() === query.toLowerCase())
  const showCreateOption = query.trim() !== '' && !exactMatch

  const handleRemove = (tagName: string) => {
    setAppliedTags(appliedTags.filter((t) => t !== tagName))
  }

  const handleApply = (tagName: string) => {
    if (!appliedTags.includes(tagName)) {
      setAppliedTags([...appliedTags, tagName])
    }
    setQuery('')
    setShowNewForm(false)
  }

  const handleCreateAndApply = async () => {
    const name = query.trim()
    if (!name) return
    const tag: TagDefinition = { name, color: newColor }
    const existing = collections[collectionPath]?.manifest.tag_registry ?? []
    if (!existing.find((t) => t.name === name)) {
      await updateTagRegistry(collectionPath, [...existing, tag])
    }
    handleApply(name)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showNewForm) {
        handleCreateAndApply()
      } else if (filtered.length > 0) {
        handleApply(filtered[0].name)
      } else if (showCreateOption) {
        setShowNewForm(true)
      }
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative z-10 w-80 rounded-lg border border-border-default bg-bg-base shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
          <h2 className="text-sm font-semibold text-text-primary">Manage Tags</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          {/* Applied tags */}
          {appliedTags.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-xs font-medium text-text-secondary">Applied tags</p>
              <div className="flex flex-wrap gap-1.5">
                {appliedTags.map((tagName) => {
                  const def = collectionTags.find((t) => t.name === tagName)
                  const color = getTagColor(def?.color ?? 'gray')
                  return (
                    <span
                      key={tagName}
                      className="flex items-center gap-1 rounded-full border border-border-default px-2 py-0.5 text-xs text-text-primary"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: color.bg }}
                      />
                      {tagName}
                      <button
                        onClick={() => handleRemove(tagName)}
                        className="ml-0.5 text-text-muted hover:text-text-primary"
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Search input */}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowNewForm(false)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search or create tag…"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded border border-border-default bg-bg-surface px-2 py-1.5 text-xs text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
          />

          {/* Suggestions */}
          {filtered.length > 0 && (
            <div className="mt-1 max-h-40 overflow-y-auto rounded border border-border-default bg-bg-surface">
              {filtered.map((tag) => {
                const color = getTagColor(tag.color)
                return (
                  <button
                    key={tag.name}
                    onClick={() => handleApply(tag.name)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-primary hover:bg-bg-hover"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: color.bg }}
                    />
                    {tag.name}
                  </button>
                )
              })}
            </div>
          )}

          {showCreateOption && !showNewForm && (
            <button
              onClick={() => setShowNewForm(true)}
              className="mt-1 flex w-full items-center gap-2 rounded border border-border-default px-3 py-1.5 text-xs hover:bg-bg-hover"
            >
              <span className="text-text-muted">Create</span>
              <span className="font-medium text-text-primary">"{query.trim()}"</span>
            </button>
          )}

          {showNewForm && (
            <div className="mt-2 rounded border border-border-default p-3">
              <p className="mb-1.5 text-xs font-medium text-text-secondary">Pick a color</p>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {TAG_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setNewColor(c.name)}
                    title={c.name}
                    className="relative h-5 w-5 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      background: c.bg,
                      borderColor: newColor === c.name ? '#fff' : 'transparent',
                      boxShadow: newColor === c.name ? `0 0 0 2px ${c.bg}` : undefined,
                    }}
                  >
                    {newColor === c.name && (
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCreateAndApply}
                className="w-full rounded bg-accent hover:bg-accent-hover text-accent-fg px-2 py-1 text-xs font-medium"
              >
                Create &amp; add
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-border-default px-4 py-3">
          <button
            onClick={onClose}
            className="rounded bg-bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-bg-hover"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
