import React, { useState } from 'react'
import * as Icons from '../ui/Icons'
import MethodBadge from '../ui/MethodBadge'

interface TreeNodeProps {
  label: string
  depth: number
  type: 'collection' | 'folder' | 'request'
  method?: string
  isExpanded?: boolean
  isLoading?: boolean
  error?: string | null
  onToggle?: () => void
  onClick?: () => void
  onDoubleClick?: () => void
}

const TreeNode: React.FC<TreeNodeProps> = ({
  label,
  depth,
  type,
  method,
  isExpanded,
  isLoading,
  error,
  onToggle,
  onClick,
  onDoubleClick,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const indentation = depth * 12 + 12

  const renderIcon = () => {
    if (isLoading) {
      return (
        <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      )
    }

    switch (type) {
      case 'collection':
      case 'folder':
        return <Icons.Folder size={type === 'collection' ? 14 : 12} className="text-text-muted" />
      case 'request':
        return method ? <MethodBadge method={method} /> : null
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center gap-1.5 h-[28px] cursor-pointer group transition-colors ${
          isHovered ? 'bg-bg-muted' : ''
        }`}
        style={{ paddingLeft: `${indentation}px`, paddingRight: '12px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={type === 'request' ? onClick : onToggle}
        onDoubleClick={onDoubleClick}
      >
        {(type === 'collection' || type === 'folder') && (
          <div
            className={`w-3 h-3 flex items-center justify-center transition-transform duration-150 ${
              isExpanded ? 'rotate-0' : '-rotate-90'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onToggle?.()
            }}
          >
            <Icons.ChevronDown size={12} className="text-text-muted hover:text-text-primary" />
          </div>
        )}

        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {renderIcon()}
          <span className="text-sm text-text-primary truncate">{label}</span>
        </div>

        {isHovered && (
          <button className="p-1 hover:bg-bg-highlight rounded text-text-muted hover:text-text-primary transition-opacity opacity-0 group-hover:opacity-100">
            <Icons.MoreHorizontal size={14} />
          </button>
        )}
      </div>

      {error && (
        <div
          className="text-[10px] text-error px-3 py-1 bg-error/10"
          style={{ paddingLeft: `${indentation + 16}px` }}
        >
          {error}
        </div>
      )}
    </div>
  )
}

export default TreeNode
