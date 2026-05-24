import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

export interface ContextMenuItem {
  label: string
  onClick?: () => void
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  separator?: boolean
  submenu?: ContextMenuItem[]
}

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x, y })
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  // Indices of items that can receive keyboard focus (non-separator, non-disabled)
  const navigableIndices = items.reduce<number[]>((acc, item, i) => {
    if (!item.separator && !item.disabled) acc.push(i)
    return acc
  }, [])

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      let newX = x
      let newY = y

      // Clip to viewport
      if (x + rect.width > window.innerWidth) {
        newX = window.innerWidth - rect.width - 8
      }
      if (y + rect.height > window.innerHeight) {
        newY = window.innerHeight - rect.height - 8
      }

      setPosition({ x: newX, y: newY })
    }
  }, [x, y, items])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((prev) => {
          if (navigableIndices.length === 0) return null
          if (prev === null) return navigableIndices[0]
          const currentPos = navigableIndices.indexOf(prev)
          return navigableIndices[(currentPos + 1) % navigableIndices.length]
        })
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((prev) => {
          if (navigableIndices.length === 0) return null
          if (prev === null) return navigableIndices[navigableIndices.length - 1]
          const currentPos = navigableIndices.indexOf(prev)
          return navigableIndices[
            (currentPos - 1 + navigableIndices.length) % navigableIndices.length
          ]
        })
        return
      }

      if (e.key === 'Enter') {
        if (focusedIndex !== null) {
          const item = items[focusedIndex]
          if (item && !item.disabled && !item.separator && item.onClick) {
            item.onClick()
            onClose()
          }
        }
        return
      }
    },
    [focusedIndex, items, navigableIndices, onClose]
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, handleKeyDown])

  const renderItem = (item: ContextMenuItem, index: number) => {
    if (item.separator) {
      return <div key={`sep-${index}`} className="h-px bg-border-subtle my-1" />
    }

    return (
      <ContextMenuItemRow
        key={item.label + index}
        item={item}
        onClose={onClose}
        focused={focusedIndex === index}
        onFocus={() => setFocusedIndex(index)}
      />
    )
  }

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[100] w-[210px] bg-bg-overlay border border-border-subtle rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.3)] py-1 select-none animate-in fade-in zoom-in-95 duration-100"
      style={{ left: position.x, top: position.y }}
    >
      {items.map((item, index) => renderItem(item, index))}
    </div>,
    document.body
  )
}

const ContextMenuItemRow: React.FC<{
  item: ContextMenuItem
  onClose: () => void
  focused: boolean
  onFocus: () => void
}> = ({ item, onClose, focused, onFocus }) => {
  const [showSubmenu, setShowSubmenu] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  const colorClass = item.disabled
    ? 'text-text-muted cursor-not-allowed opacity-40'
    : item.danger
      ? 'text-error hover:bg-error/10 cursor-pointer'
      : 'text-text-primary hover:bg-bg-highlight cursor-pointer'

  const focusedClass = focused && !item.disabled ? 'bg-bg-highlight' : ''

  return (
    <div
      ref={itemRef}
      className={`relative flex items-center justify-between px-3 h-[26px] text-sm transition-colors ${colorClass} ${focusedClass}`}
      onClick={(e) => {
        if (item.disabled) return
        if (item.submenu) {
          e.stopPropagation()
          return
        }
        item.onClick?.()
        onClose()
      }}
      onMouseEnter={() => {
        if (!item.disabled) onFocus()
        if (item.submenu) setShowSubmenu(true)
      }}
      onMouseLeave={() => setShowSubmenu(false)}
    >
      <span className="truncate flex-1">{item.label}</span>
      {item.shortcut && <span className="text-xs text-text-muted ml-4">{item.shortcut}</span>}
      {item.submenu && <span className="text-xs text-text-muted ml-2">›</span>}

      {item.submenu && showSubmenu && (
        <Submenu items={item.submenu} parentRef={itemRef} onClose={onClose} />
      )}
    </div>
  )
}

const Submenu: React.FC<{
  items: ContextMenuItem[]
  parentRef: React.RefObject<HTMLDivElement | null>
  onClose: () => void
}> = ({ items, parentRef, onClose }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (parentRef.current && menuRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect()
      const menuRect = menuRef.current.getBoundingClientRect()

      let x = parentRect.right - 4
      let y = parentRect.top - 4

      // Clip
      if (x + menuRect.width > window.innerWidth) {
        x = parentRect.left - menuRect.width + 4
      }
      if (y + menuRect.height > window.innerHeight) {
        y = window.innerHeight - menuRect.height - 8
      }

      setPos({ x, y })
    }
  }, [parentRef])

  return (
    <div
      ref={menuRef}
      className="fixed z-[101] w-[180px] bg-bg-overlay border border-border-subtle rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.3)] py-1"
      style={{ left: pos.x, top: pos.y }}
    >
      {items.map((item, index) => (
        <div
          key={item.label + index}
          className={`flex items-center justify-between px-3 h-[26px] text-sm cursor-pointer text-text-primary hover:bg-bg-highlight transition-colors`}
          onClick={(e) => {
            e.stopPropagation()
            item.onClick?.()
            onClose()
          }}
        >
          <span className="truncate">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default ContextMenu
