import React, { useRef, useState, useEffect } from 'react'
import { useTabs } from '../../contexts/TabsContext'
import TabItem from './TabItem'
import * as Icons from '../ui/Icons'
import { useUIStore } from '../../stores/uiStore'

const RequestTabBar: React.FC = () => {
  const { tabs, activeTabId, reorderTabs } = useTabs()
  const { openNewRequestDialog } = useUIStore()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  // Drag state — kept in a ref to avoid re-renders during drag
  const dragFromIndex = useRef<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const checkScroll = () => {
    const el = scrollContainerRef.current
    if (el) {
      setShowLeftArrow(el.scrollLeft > 0)
      setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [tabs])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (el) {
      const scrollAmount = 120
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  const handleNewTab = () => {
    openNewRequestDialog()
  }

  const handleDragStart = (index: number) => {
    dragFromIndex.current = index
  }

  const handleDragOver = (index: number) => {
    if (dragFromIndex.current !== null && dragFromIndex.current !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (toIndex: number) => {
    const fromIndex = dragFromIndex.current
    if (fromIndex !== null && fromIndex !== toIndex) {
      reorderTabs(fromIndex, toIndex)
    }
    dragFromIndex.current = null
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    dragFromIndex.current = null
    setDragOverIndex(null)
  }

  return (
    <div className="h-9 bg-bg-panel border-b border-border-subtle flex items-stretch shrink-0 relative group/tabbar">
      {/* Left Scroll Arrow */}
      {showLeftArrow && (
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 flex items-center justify-start pl-1 bg-gradient-to-r from-bg-panel to-transparent">
          <button
            onClick={() => scroll('left')}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-bg-muted text-text-secondary transition-colors"
          >
            <Icons.ChevronLeft size={14} />
          </button>
        </div>
      )}

      {/* Tabs Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex-1 flex items-stretch overflow-x-auto scrollbar-hide select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab, index) => (
          <TabItem
            key={tab.id}
            tab={tab}
            active={tab.id === activeTabId}
            index={index}
            dragOverIndex={dragOverIndex}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}

        {/* New Tab Button */}
        <div className="flex items-center px-2 shrink-0">
          <button
            onClick={handleNewTab}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors"
            title="New Request (Cmd+B)"
          >
            <Icons.Plus size={18} />
          </button>
        </div>
      </div>

      {/* Right Scroll Arrow */}
      {showRightArrow && (
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10 flex items-center justify-end pr-1 bg-gradient-to-l from-bg-panel to-transparent">
          <button
            onClick={() => scroll('right')}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-bg-muted text-text-secondary transition-colors"
          >
            <Icons.ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

export default RequestTabBar
