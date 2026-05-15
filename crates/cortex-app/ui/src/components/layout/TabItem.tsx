import React, { useState, useEffect, useRef } from 'react'
import { type Tab, useTabs } from '../../contexts/TabsContext'
import * as Icons from '../ui/Icons'

interface TabItemProps {
  tab: Tab
  active: boolean
  index: number
  dragOverIndex: number | null
  onDragStart: (index: number) => void
  onDragOver: (index: number) => void
  onDragLeave: () => void
  onDrop: (index: number) => void
  onDragEnd: () => void
}

const TabItem: React.FC<TabItemProps> = ({
  tab,
  active,
  index,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}) => {
  const { activateTab, closeTab, duplicateTab, closeOtherTabs, closeTabsToTheRight } = useTabs()
  const [showMenu, setShowMenu] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuPos({ x: e.clientX, y: e.clientY })
    setShowMenu(true)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'text-method-get'
      case 'POST':
        return 'text-method-post'
      case 'PUT':
        return 'text-method-put'
      case 'PATCH':
        return 'text-method-patch'
      case 'DELETE':
        return 'text-method-delete'
      default:
        return 'text-text-muted'
    }
  }

  const isDropTarget = dragOverIndex === index

  return (
    <>
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move'
          onDragStart(index)
        }}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'move'
          onDragOver(index)
        }}
        onDragLeave={onDragLeave}
        onDrop={(e) => {
          e.preventDefault()
          onDrop(index)
        }}
        onClick={() => activateTab(tab.id)}
        onContextMenu={handleContextMenu}
        className={`
          group relative flex items-center h-full min-w-[80px] max-w-[200px] px-3 gap-2 cursor-pointer select-none border-r border-border-subtle transition-all
          ${active ? 'bg-bg-surface text-text-primary' : 'bg-bg-panel text-text-secondary hover:bg-bg-muted'}
          ${isDropTarget ? 'border-l-2 border-l-accent bg-bg-highlight/30' : ''}
        `}
        title={tab.isDirty ? 'Unsaved changes' : tab.name}
      >
        {/* Icon / Method Label */}
        {tab.type === 'environments' ? (
          <Icons.Globe size={14} className="text-accent shrink-0" />
        ) : (
          <span
            className={`text-[10px] font-bold uppercase shrink-0 ${getMethodColor(tab.method)}`}
          >
            {tab.method}
          </span>
        )}

        {/* Name */}
        <span className="text-[12px] truncate flex-1 font-medium">{tab.name}</span>

        {/* Close Button / Dirty Indicator */}
        <div className="flex items-center justify-center w-4 h-4 shrink-0 relative">
          {tab.isDirty ? (
            <div className="w-1.5 h-1.5 rounded-full bg-accent group-hover:hidden" />
          ) : null}

          <button
            onClick={(e) => {
              e.stopPropagation()
              closeTab(tab.id)
            }}
            className={`
              flex items-center justify-center w-full h-full rounded hover:bg-bg-highlight transition-colors
              ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
              ${tab.isDirty ? 'hidden group-hover:flex' : 'flex'}
            `}
          >
            <Icons.X size={12} />
          </button>
        </div>

        {/* Active Indicator (Bottom Border) */}
        {active && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />}
      </div>

      {/* Context Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          style={{ top: menuPos.y, left: menuPos.x }}
          className="fixed z-50 min-w-[160px] py-1 bg-bg-overlay border border-border-subtle rounded-md shadow-lg"
        >
          <button
            className="w-full flex items-center px-3 h-7 text-[12px] text-text-primary hover:bg-bg-highlight transition-colors"
            onClick={() => {
              closeTab(tab.id)
              setShowMenu(false)
            }}
          >
            Close Tab
            <span className="ml-auto text-[10px] text-text-muted">Cmd+W</span>
          </button>
          <button
            className="w-full flex items-center px-3 h-7 text-[12px] text-text-primary hover:bg-bg-highlight transition-colors"
            onClick={() => {
              closeOtherTabs(tab.id)
              setShowMenu(false)
            }}
          >
            Close Other Tabs
          </button>
          <button
            className="w-full flex items-center px-3 h-7 text-[12px] text-text-primary hover:bg-bg-highlight transition-colors"
            onClick={() => {
              closeTabsToTheRight(tab.id)
              setShowMenu(false)
            }}
          >
            Close Tabs to the Right
          </button>
          {tab.type === 'request' && (
            <>
              <div className="my-1 border-t border-border-subtle" />
              <button
                className="w-full flex items-center px-3 h-7 text-[12px] text-text-primary hover:bg-bg-highlight transition-colors"
                onClick={() => {
                  duplicateTab(tab.id)
                  setShowMenu(false)
                }}
              >
                Duplicate Tab
              </button>
              <button
                className="w-full flex items-center px-3 h-7 text-[12px] text-text-primary hover:bg-bg-highlight transition-colors"
                onClick={() => {
                  // Placeholder for Copy URL
                  setShowMenu(false)
                }}
              >
                Copy Request URL
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default TabItem
