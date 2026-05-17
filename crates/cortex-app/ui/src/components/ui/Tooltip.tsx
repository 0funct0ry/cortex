import React, { useState, useRef, useEffect } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  delay?: number
  position?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'end' | 'center'
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  delay = 300,
  position = 'bottom',
  align = 'center',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        if (align === 'start') return 'bottom-full left-0 mb-1.5'
        if (align === 'end') return 'bottom-full right-0 mb-1.5'
        return 'bottom-full left-1/2 -translate-x-1/2 mb-1.5'
      case 'bottom':
        if (align === 'start') return 'top-full left-0 mt-1.5'
        if (align === 'end') return 'top-full right-0 mt-1.5'
        return 'top-full left-1/2 -translate-x-1/2 mt-1.5'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-1.5'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-1.5'
      default:
        if (align === 'start') return 'top-full left-0 mt-1.5'
        if (align === 'end') return 'top-full right-0 mt-1.5'
        return 'top-full left-1/2 -translate-x-1/2 mt-1.5'
    }
  }

  return (
    <div
      ref={triggerRef}
      className="relative flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-[100] px-1.5 py-0.5 bg-bg-overlay border border-border-subtle rounded-sm shadow-md whitespace-nowrap pointer-events-none transition-opacity duration-150 ${getPositionClasses()}`}
        >
          <span className="text-[10px] text-text-primary font-medium">{content}</span>
        </div>
      )}
    </div>
  )
}

export default Tooltip
