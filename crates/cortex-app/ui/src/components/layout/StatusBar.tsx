import React from 'react'
import * as Icons from '../ui/Icons'
import { useTheme } from '../../contexts/ThemeContext'
import ThemePicker from './ThemePicker'

const StatusBar: React.FC = () => {
  const { theme } = useTheme()
  const [isThemePickerOpen, setIsThemePickerOpen] = React.useState(false)
  const version = import.meta.env.VITE_APP_VERSION || 'v0.1.0'

  return (
    <footer className="h-[22px] bg-bg-panel border-t border-border-subtle flex items-center px-3 gap-3 shrink-0 relative">
      <div className="flex-1" /> {/* Spacer */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-text-muted text-[11px] cursor-pointer hover:text-text-secondary transition-colors group">
          <Icons.Search size={12} className="text-text-muted group-hover:text-text-secondary" />
          <span>Search</span>
          <span className="text-text-muted/60 text-[10px] ml-0.5">Cmd+K</span>
        </div>

        <div className="w-[1px] h-3 bg-border-subtle" />

        <div
          onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
          className={`flex items-center gap-1.5 text-[11px] cursor-pointer transition-colors group ${
            isThemePickerOpen ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <Icons.Palette
            size={12}
            className={
              isThemePickerOpen ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
            }
          />
          <span className="capitalize">{theme.replace(/-/g, ' ')}</span>
        </div>

        <div className="w-[1px] h-3 bg-border-subtle" />

        <div className="text-text-muted text-[11px]">{version}</div>
      </div>
      {isThemePickerOpen && <ThemePicker onClose={() => setIsThemePickerOpen(false)} />}
    </footer>
  )
}

export default StatusBar
