import type { Preview, Decorator } from '@storybook/react'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import { mockIPC } from '@tauri-apps/api/mocks'
import '../src/index.css'

// Intercept all Tauri invoke() calls globally — stories provide per-story overrides
mockIPC(() => null)

// Zustand store reset decorator — add store resets here as stores are created (SB.02)
const withStoreReset: Decorator = (Story, ctx) => {
  return <Story {...ctx} />
}

const preview: Preview = {
  decorators: [
    withStoreReset,
    withThemeByDataAttribute({
      themes: {
        dark: 'dark',
        'dark-monochrome': 'dark-monochrome',
        'dark-pastel': 'dark-pastel',
        'vscode-dark': 'vscode-dark',
        'catppuccin-frappe': 'catppuccin-frappe',
        'catppuccin-macchiato': 'catppuccin-macchiato',
        'catppuccin-mocha': 'catppuccin-mocha',
        nord: 'nord',
        light: 'light',
        'light-monochrome': 'light-monochrome',
        'light-pastel': 'light-pastel',
        'vscode-light': 'vscode-light',
        'catppuccin-latte': 'catppuccin-latte',
      },
      defaultTheme: 'dark',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: true }] } },
  },
}

export default preview
