import React from 'react'
import * as Icons from '../ui/Icons'
import { useTheme } from '../../contexts/ThemeContext'
import ThemePicker from './ThemePicker'
import { commands } from '../../bindings'

const StatusBar: React.FC = () => {
  const { theme } = useTheme()
  const [isThemePickerOpen, setIsThemePickerOpen] = React.useState(false)
  const version = import.meta.env.VITE_APP_VERSION || 'v0.1.0'
  // Devtools are compiled into debug builds; the right-click "Inspect" menu is
  // disabled, so expose an explicit button during development.
  const showDevtools = import.meta.env.DEV

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

        {showDevtools && (
          <>
            <div className="w-[1px] h-3 bg-border-subtle" />
            <button
              type="button"
              title="Open dev console"
              aria-label="Open dev console"
              onClick={() => commands.openDevtools().catch(console.error)}
              className="flex items-center text-text-muted hover:text-text-secondary transition-colors"
            >
              <Icons.Terminal size={12} />
            </button>
          </>
        )}
      </div>
      {isThemePickerOpen && <ThemePicker onClose={() => setIsThemePickerOpen(false)} />}
    </footer>
  )
}

export default StatusBar
