import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import StatusBar from '@/components/layout/StatusBar'
import { ThemeProvider } from '@/contexts/ThemeContext'

const meta: Meta<typeof StatusBar> = {
  title: 'layout/StatusBar',
  component: StatusBar,
  parameters: {
    layout: 'fullscreen',
    // StatusBar calls commands.openDevtools() only in DEV mode (import.meta.env.DEV).
    // We register a no-op mock so the IPC layer doesn't throw if the button is clicked.
    tauriMock: {
      open_devtools: () => undefined,
    },
  },
  decorators: [
    (Story) => (
      // ThemeProvider supplies useTheme(); the global withThemeByDataAttribute
      // decorator manages data-theme on document.documentElement so CSS tokens
      // resolve correctly. We wrap here to ensure useTheme() doesn't throw.
      <ThemeProvider>
        {/* Pin the bar to the bottom of a viewport-height container */}
        <div className="relative flex flex-col" style={{ height: '100vh' }}>
          <div className="flex-1" />
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default — idle state.
 * Shows the search hint (Cmd+K), active theme name, and app version.
 * The play function clicks the theme name chip and verifies the ThemePicker opens.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Theme chip text is the humanised theme name, e.g. "dark"
    const themeChip = canvas.getByText(/dark|light/i)
    await userEvent.click(themeChip)
    // ThemePicker renders a list of theme options. Assert a single unique theme
    // name — "Nord" appears exactly once and is unambiguous in the picker list.
    await expect(canvas.getByText('Nord')).toBeInTheDocument()
  },
}

/**
 * WithThemePicker — documents that clicking the theme chip toggles ThemePicker.
 * Uses the same interaction as Default but acts as a named reference variant.
 */
export const WithThemePicker: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const themeChip = canvas.getByText(/dark|light/i)
    await userEvent.click(themeChip)
    // Picker is open — clicking again should close it
    await userEvent.click(themeChip)
  },
}

/**
 * SearchHint — verifies the "Search / Cmd+K" affordance is always rendered
 * regardless of theme or workspace state.
 */
export const SearchHint: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Search')).toBeInTheDocument()
    await expect(canvas.getByText('Cmd+K')).toBeInTheDocument()
  },
}
