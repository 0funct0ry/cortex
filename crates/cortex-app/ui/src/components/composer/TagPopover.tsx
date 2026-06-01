import React, { useEffect, useRef, useState } from 'react'
import type { TagDefinition } from '../../bindings'
import { TAG_COLORS, getFirstUnusedColor, getTagColor } from '../../utils/tagColors'

interface TagPopoverProps {
  open: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
  collectionTags: TagDefinition[]
  appliedTags: string[]
  onApply: (tagName: string) => void
  onCreateAndApply: (tag: TagDefinition) => void
}

export const TagPopover: React.FC<TagPopoverProps> = ({
  open,
  onClose,
  anchorRef,
  collectionTags,
  appliedTags,
  onApply,
  onCreateAndApply,
}) => {
  const [query, setQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newColor, setNewColor] = useState(
    getFirstUnusedColor(collectionTags.map((t) => t.color)).name
  )
  const popoverRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [lastOpen, setLastOpen] = useState(false)
  if (open && !lastOpen) {
    setLastOpen(true)
    setQuery('')
    setShowCreate(false)
    setNewColor(getFirstUnusedColor(collectionTags.map((t) => t.color)).name)
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
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [open, onClose, anchorRef])

  if (!open) return null

  const filtered = collectionTags.filter(
    (t) => !appliedTags.includes(t.name) && t.name.toLowerCase().includes(query.toLowerCase())
  )
  const exactMatch = collectionTags.some((t) => t.name.toLowerCase() === query.toLowerCase())
  const showCreateOption = query.trim() !== '' && !exactMatch

  const handleSelect = (tagName: string) => {
    onApply(tagName)
    setQuery('')
  }

  const handleCreate = () => {
    const name = query.trim()
    if (!name) return
    onCreateAndApply({ name, color: newColor })
    setQuery('')
    setShowCreate(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showCreate) {
        handleCreate()
      } else if (filtered.length > 0) {
        handleSelect(filtered[0].name)
      } else if (showCreateOption) {
        setShowCreate(true)
      }
    }
  }

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 mt-1 w-64 rounded-md border border-border-default bg-bg-base shadow-lg"
      style={{ top: '100%', left: 0 }}
    >
      <div className="p-2">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowCreate(false)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search or create tag…"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded border border-border-default bg-bg-surface px-2 py-1 text-xs text-text-primary outline-none placeholder:text-text-muted focus:border-accent"
        />
      </div>

      {/* Suggestions list — scrollable */}
      <div className="max-h-40 overflow-y-auto">
        {filtered.map((tag) => {
          const color = getTagColor(tag.color)
          return (
            <button
              key={tag.name}
              onClick={() => handleSelect(tag.name)}
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

        {showCreateOption && !showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-hover"
          >
            <span className="text-text-muted">Create</span>
            <span className="font-medium text-text-primary">"{query.trim()}"</span>
          </button>
        )}

        {filtered.length === 0 && !showCreateOption && !showCreate && (
          <p className="px-3 py-2 text-xs text-text-muted">No tags yet</p>
        )}
      </div>

      {/* Color picker + Add button — always outside the scroll area */}
      {showCreate && (
        <div className="border-t border-border-default p-2">
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
            onClick={handleCreate}
            className="w-full rounded bg-accent hover:bg-accent-hover text-accent-fg px-2 py-1 text-xs font-medium"
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}
