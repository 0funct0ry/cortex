import React, { useState, useRef, useEffect } from 'react'
import * as Icons from '../ui/Icons'
import { useCollectionStore } from '../../stores/collectionStore'

const SidebarHeader: React.FC = () => {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const { searchQuery, setSearchQuery } = useCollectionStore()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchActive])

  const handleToggleSearch = () => {
    if (isSearchActive) {
      setSearchQuery('')
      setIsSearchActive(false)
    } else {
      setIsSearchActive(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('')
      setIsSearchActive(false)
    }
  }

  if (isSearchActive) {
    return (
      <div className="h-8 flex items-center gap-2 px-2 bg-bg-panel shrink-0 select-none border-b border-border-subtle">
        <button
          onClick={handleToggleSearch}
          className="p-1 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors"
        >
          <Icons.X size={14} />
        </button>
        <div className="flex-1 flex items-center bg-bg-surface border border-border-default rounded h-6 px-1.5 gap-1.5 focus-within:border-accent">
          <Icons.Search size={12} className="text-text-muted" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search requests..."
            className="flex-1 bg-transparent border-none outline-none text-[12px] text-text-primary placeholder:text-text-muted h-full"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="h-8 flex items-center justify-between px-3 bg-bg-panel shrink-0 select-none border-b border-border-subtle">
      <span className="text-text-secondary text-[11px] font-semibold uppercase tracking-wider">
        Collections
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={handleToggleSearch}
          className="p-1 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors"
        >
          <Icons.Search size={14} />
        </button>
        <button className="p-1 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors">
          <Icons.Plus size={14} />
        </button>
        <button className="p-1 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors">
          <Icons.MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  )
}

export default SidebarHeader
