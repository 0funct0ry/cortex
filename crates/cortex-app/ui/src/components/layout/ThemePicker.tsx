import React, { useEffect, useRef } from 'react'
import * as Icons from '../ui/Icons'
import { useTheme } from '../../contexts/ThemeContext'
import type { ThemeId } from '../../contexts/ThemeContext'

interface ThemeMetadata {
  id: ThemeId
  name: string
  section: 'light' | 'dark'
}

const THEMES: ThemeMetadata[] = [
  { id: 'light', name: 'Light', section: 'light' },
  { id: 'light-monochrome', name: 'Light Monochrome', section: 'light' },
  { id: 'light-pastel', name: 'Light Pastel', section: 'light' },
  { id: 'catppuccin-latte', name: 'Catppuccin Latte', section: 'light' },
  { id: 'vscode-light', name: 'VS Code Light', section: 'light' },
  { id: 'dark', name: 'Dark', section: 'dark' },
  { id: 'dark-monochrome', name: 'Dark Monochrome', section: 'dark' },
  { id: 'dark-pastel', name: 'Dark Pastel', section: 'dark' },
  { id: 'catppuccin-frappe', name: 'Catppuccin Frappé', section: 'dark' },
  { id: 'catppuccin-macchiato', name: 'Catppuccin Macchiato', section: 'dark' },
  { id: 'catppuccin-mocha', name: 'Catppuccin Mocha', section: 'dark' },
  { id: 'nord', name: 'Nord', section: 'dark' },
  { id: 'vscode-dark', name: 'VS Code Dark', section: 'dark' },
]

interface ThemePickerProps {
  onClose: () => void
}

const ThemePicker: React.FC<ThemePickerProps> = ({ onClose }) => {
  const { theme: currentTheme, setTheme } = useTheme()
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      // Ensure theme is reverted to original if closed without picking
      document.documentElement.dataset.theme = currentTheme
    }
  }, [onClose, currentTheme])

  const handleHover = (themeId: ThemeId | null) => {
    // eslint-disable-next-line react-hooks/immutability
    document.documentElement.dataset.theme = themeId || currentTheme
  }

  const handleSelect = (themeId: ThemeId) => {
    setTheme(themeId)
    onClose()
  }

  const renderSection = (title: string, section: 'light' | 'dark') => {
    const sectionThemes = THEMES.filter((t) => t.section === section)

    return (
      <div className="py-1">
        <div className="px-3 pt-2 pb-1 text-xs font-semibold text-text-muted uppercase tracking-wider">
          {title}
        </div>
        {sectionThemes.map((theme) => {
          const isActive = theme.id === currentTheme
          return (
            <div
              key={theme.id}
              className="flex items-center h-7 px-3 gap-2 cursor-pointer hover:bg-bg-highlight group transition-colors"
              onMouseEnter={() => handleHover(theme.id)}
              onMouseLeave={() => handleHover(null)}
              onClick={() => handleSelect(theme.id)}
            >
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                {isActive ? (
                  <div className="w-2 h-2 rounded-full bg-accent" />
                ) : (
                  <div className="w-2 h-2 rounded-full border border-text-muted/40 group-hover:border-text-muted/60" />
                )}
              </div>
              <span className={`text-sm text-text-primary flex-1 ${isActive ? 'font-medium' : ''}`}>
                {theme.name}
              </span>
              {isActive && <span className="text-xs text-text-muted">✓ active</span>}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-[26px] right-3 w-[280px] max-h-[360px] bg-bg-overlay border border-border-subtle rounded-md shadow-lg overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="sticky top-0 bg-bg-overlay border-b border-border-subtle flex items-center justify-between px-3 h-8 z-10">
        <span className="text-xs font-semibold text-text-primary">Theme</span>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <Icons.X size={14} />
        </button>
      </div>

      <div className="py-1">
        {renderSection('Light Themes', 'light')}
        <div className="h-px bg-border-subtle mx-1 my-1" />
        {renderSection('Dark Themes', 'dark')}
      </div>
    </div>
  )
}

export default ThemePicker
