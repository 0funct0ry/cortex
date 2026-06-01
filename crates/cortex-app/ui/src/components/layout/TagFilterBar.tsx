import React from 'react'
import { useCollectionStore, getAllTagsFromCollections } from '../../stores/collectionStore'
import { getTagColor } from '../../utils/tagColors'

export const TagFilterBar: React.FC = () => {
  const {
    collections,
    activeTagFilters,
    tagFilterMode,
    toggleTagFilter,
    setTagFilterMode,
    clearTagFilters,
  } = useCollectionStore()

  const allTags = getAllTagsFromCollections(collections)

  if (allTags.length === 0) return null

  return (
    <div className="border-b border-border-default bg-bg-base px-3 py-2">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {activeTagFilters.length > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-accent-primary/15 px-2 py-0.5 text-[10px] font-medium text-accent-primary">
              Filtered: {activeTagFilters.length} {activeTagFilters.length === 1 ? 'tag' : 'tags'}
              <button
                onClick={clearTagFilters}
                className="ml-0.5 hover:text-accent-primary/70"
                aria-label="Clear filters"
              >
                ×
              </button>
            </span>
          )}
        </div>
        <button
          onClick={() => setTagFilterMode(tagFilterMode === 'and' ? 'or' : 'and')}
          className="rounded border border-border-default px-2 py-0.5 text-[10px] text-text-secondary hover:bg-bg-hover"
          title="Toggle AND/OR filter logic"
        >
          {tagFilterMode === 'and' ? 'Match all (AND)' : 'Match any (OR)'}
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {allTags.map((tag) => {
          const color = getTagColor(tag.color)
          const active = activeTagFilters.includes(tag.name)
          return (
            <button
              key={tag.name}
              onClick={() => toggleTagFilter(tag.name)}
              className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs transition-colors"
              style={
                active
                  ? { background: color.bg, borderColor: color.bg, color: color.text }
                  : { borderColor: color.bg, color: 'inherit' }
              }
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: active ? color.text : color.bg, opacity: active ? 0.8 : 1 }}
              />
              {tag.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
