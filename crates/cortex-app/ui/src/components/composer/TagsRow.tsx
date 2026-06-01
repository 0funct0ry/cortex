import React, { useRef, useState, useMemo } from 'react'
import { useRequestStore } from '../../stores/requestStore'
import { useCollectionStore, getAllTagsFromCollections } from '../../stores/collectionStore'
import type { TagDefinition } from '../../bindings'
import { TAG_COLORS, getTagColor } from '../../utils/tagColors'
import { TagPopover } from './TagPopover'

interface TagsRowProps {
  requestId: string
  collectionPath: string
}

const ColorSwatchPopover: React.FC<{
  open: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
  currentColor: string
  onSelect: (color: string) => void
}> = ({ open, onClose, anchorRef, currentColor, onSelect }) => {
  const ref = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose, anchorRef])

  if (!open) return null

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 z-50 mb-1 flex flex-wrap gap-1.5 rounded-md border border-border-default bg-bg-base p-2 shadow-lg"
      style={{ width: 160 }}
    >
      {TAG_COLORS.map((c) => (
        <button
          key={c.name}
          onClick={() => {
            onSelect(c.name)
            onClose()
          }}
          title={c.name}
          className="relative h-5 w-5 rounded-full border-2 transition-transform hover:scale-110"
          style={{
            background: c.bg,
            borderColor: currentColor === c.name ? '#fff' : 'transparent',
            boxShadow: currentColor === c.name ? `0 0 0 2px ${c.bg}` : undefined,
          }}
        >
          {currentColor === c.name && (
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

const TagChip: React.FC<{
  tagName: string
  def?: TagDefinition
  colorPickerTag: string | null
  setColorPickerTag: React.Dispatch<React.SetStateAction<string | null>>
  handleRecolor: (tagName: string, newColor: string) => Promise<void>
  handleRemoveTag: (tagName: string) => void
}> = ({ tagName, def, colorPickerTag, setColorPickerTag, handleRecolor, handleRemoveTag }) => {
  const dotRef = useRef<HTMLButtonElement>(null)
  const color = getTagColor(def?.color ?? 'gray')

  return (
    <span className="relative flex items-center gap-1 rounded-full border border-border-default px-2 py-0.5 text-xs text-text-primary">
      <button
        ref={dotRef}
        onClick={(e) => {
          e.stopPropagation()
          setColorPickerTag((prev) => (prev === tagName ? null : tagName))
        }}
        className="h-2.5 w-2.5 shrink-0 rounded-full transition-opacity hover:opacity-70"
        style={{ background: color.bg }}
        title="Change color"
      />
      {colorPickerTag === tagName && (
        <ColorSwatchPopover
          open
          onClose={() => setColorPickerTag(null)}
          anchorRef={dotRef}
          currentColor={def?.color ?? 'gray'}
          onSelect={(c) => handleRecolor(tagName, c)}
        />
      )}
      {tagName}
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleRemoveTag(tagName)
        }}
        className="ml-0.5 text-text-muted hover:text-text-primary"
        title="Remove tag"
      >
        ×
      </button>
    </span>
  )
}

export const TagsRow: React.FC<TagsRowProps> = ({ requestId, collectionPath }) => {
  const { getRequestState, updateRequest } = useRequestStore()
  const { collections, updateTagRegistry } = useCollectionStore()

  const requestData = getRequestState(requestId)
  const appliedTags = requestData.tags ?? []

  const collectionTags = getAllTagsFromCollections(
    collectionPath ? { [collectionPath]: collections[collectionPath] } : {}
  )

  const [pendingTagDefs, setPendingTagDefs] = useState<Record<string, TagDefinition>>({})

  const tagDefsMap = useMemo(() => {
    const map = new Map<string, TagDefinition>()
    collectionTags.forEach((t) => map.set(t.name, t))
    Object.entries(pendingTagDefs).forEach(([name, t]) => {
      if (!map.has(name)) map.set(name, t)
    })
    return map
  }, [collectionTags, pendingTagDefs])

  const resolveTagDef = (tagName: string): TagDefinition | undefined => tagDefsMap.get(tagName)

  const [popoverOpen, setPopoverOpen] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)

  const [colorPickerTag, setColorPickerTag] = useState<string | null>(null)

  const handleRemoveTag = (tagName: string) => {
    updateRequest(requestId, { tags: appliedTags.filter((t) => t !== tagName) })
  }

  const handleApplyTag = (tagName: string) => {
    if (!appliedTags.includes(tagName)) {
      updateRequest(requestId, { tags: [...appliedTags, tagName] })
    }
  }

  const handleCreateAndApply = async (tag: TagDefinition) => {
    // Synchronously cache the definition so the chip renders with the correct
    // color on the very next render, before the store update propagates.
    setPendingTagDefs((prev) => ({ ...prev, [tag.name]: tag }))
    const existing = collections[collectionPath]?.manifest.tag_registry ?? []
    if (!existing.find((t) => t.name === tag.name)) {
      await updateTagRegistry(collectionPath, [...existing, tag])
    }
    handleApplyTag(tag.name)
  }

  const handleRecolor = async (tagName: string, newColor: string) => {
    const existing = collections[collectionPath]?.manifest.tag_registry ?? []
    const updated = existing.map((t) => (t.name === tagName ? { ...t, color: newColor } : t))
    // Update pending cache immediately so the dot recolors before the store round-trips.
    setPendingTagDefs((prev) => {
      const pending = prev[tagName]
      if (pending) {
        return { ...prev, [tagName]: { ...pending, color: newColor } }
      }
      return prev
    })
    await updateTagRegistry(collectionPath, updated)
  }

  return (
    <div
      ref={rowRef}
      className="relative flex min-h-[28px] flex-wrap items-center gap-1 border-b border-border-default px-3 py-1"
      onClick={(e) => {
        if (e.target === rowRef.current) setPopoverOpen(true)
      }}
    >
      {appliedTags.length === 0 && !popoverOpen && (
        <button
          onClick={() => setPopoverOpen(true)}
          className="text-xs text-text-muted hover:text-text-secondary"
        >
          ＋ Add tag
        </button>
      )}

      {appliedTags.map((tagName) => (
        <TagChip
          key={tagName}
          tagName={tagName}
          def={resolveTagDef(tagName)}
          colorPickerTag={colorPickerTag}
          setColorPickerTag={setColorPickerTag}
          handleRecolor={handleRecolor}
          handleRemoveTag={handleRemoveTag}
        />
      ))}

      {appliedTags.length > 0 && (
        <button
          onClick={() => setPopoverOpen(true)}
          className="text-xs text-text-muted hover:text-text-secondary"
        >
          ＋
        </button>
      )}

      <div className="relative">
        <TagPopover
          open={popoverOpen}
          onClose={() => setPopoverOpen(false)}
          anchorRef={rowRef as React.RefObject<HTMLElement | null>}
          collectionTags={collectionTags}
          appliedTags={appliedTags}
          onApply={handleApplyTag}
          onCreateAndApply={handleCreateAndApply}
        />
      </div>
    </div>
  )
}
