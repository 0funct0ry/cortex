import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface ContextMenuItem {
  label: string
  onClick?: () => void
  shortcut?: string
  danger?: boolean
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const renderItem = (item: ContextMenuItem, index: number) => {
    if (item.separator) {
      return <div key={`sep-${index}`} className="h-px bg-border-subtle my-1" />
    }

    return <ContextMenuItemRow key={item.label} item={item} onClose={onClose} />
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

const ContextMenuItemRow: React.FC<{ item: ContextMenuItem; onClose: () => void }> = ({
  item,
  onClose,
}) => {
  const [showSubmenu, setShowSubmenu] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={itemRef}
      className={`relative flex items-center justify-between px-3 h-[26px] text-sm cursor-pointer transition-colors ${
        item.danger ? 'text-error hover:bg-error/10' : 'text-text-primary hover:bg-bg-highlight'
      }`}
      onClick={(e) => {
        if (item.submenu) {
          e.stopPropagation()
          return
        }
        item.onClick?.()
        onClose()
      }}
      onMouseEnter={() => setShowSubmenu(true)}
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
