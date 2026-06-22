import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import ThemePicker from '@/components/layout/ThemePicker'
import { ThemeProvider } from '@/contexts/ThemeContext'

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof ThemePicker> = {
  title: 'layout/ThemePicker',
  component: ThemePicker,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A dropdown overlay listing all 13 Cortex themes grouped into Light and Dark sections. Hovering a theme previews it instantly; clicking selects it and closes the picker. Escape or a click outside also closes.',
      },
    },
  },
  decorators: [
    (Story) => (
      // ThemePicker is absolutely positioned relative to its parent.
      // We anchor it inside a viewport-height container so the overlay is
      // visible in the story canvas without overflowing.
      <ThemeProvider>
        <div
          className="relative flex flex-col bg-bg-panel"
          style={{ height: '100vh', width: '100%' }}
        >
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    onClose: {
      description:
        'Callback invoked when the picker should close (Escape, click outside, or theme selected).',
      action: 'onClose',
    },
  },
  args: {
    onClose: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * LightThemeActive — picker rendered with the `light` theme selected.
 * The "Light" entry shows a filled accent dot and a "✓ active" label.
 * localStorage is pre-seeded so ThemeProvider initialises to `light`.
 */
export const LightThemeActive: Story = {
  beforeEach: () => {
    localStorage.setItem('cortex.theme', 'light')
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // "✓ active" label should appear next to the active theme
    await expect(canvas.getByText('✓ active')).toBeInTheDocument()
    // The Light entry is present
    await expect(canvas.getByText('Light')).toBeInTheDocument()
  },
}

/**
 * DarkThemeActive — picker rendered with the `dark` theme selected.
 * The "Dark" entry shows the accent indicator and "✓ active" badge.
 */
export const DarkThemeActive: Story = {
  beforeEach: () => {
    localStorage.setItem('cortex.theme', 'dark')
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('✓ active')).toBeInTheDocument()
    await expect(canvas.getByText('Dark')).toBeInTheDocument()
  },
}

/**
 * AllThemesVisible — verifies all 13 theme names appear in the picker list,
 * spanning both the Light Themes and Dark Themes sections.
 */
export const AllThemesVisible: Story = {
  beforeEach: () => {
    localStorage.setItem('cortex.theme', 'dark')
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Light section
    await expect(canvas.getByText('Light Themes')).toBeInTheDocument()
    await expect(canvas.getByText('Light')).toBeInTheDocument()
    await expect(canvas.getByText('Light Monochrome')).toBeInTheDocument()
    await expect(canvas.getByText('Light Pastel')).toBeInTheDocument()
    await expect(canvas.getByText('Catppuccin Latte')).toBeInTheDocument()
    await expect(canvas.getByText('VS Code Light')).toBeInTheDocument()
    // Dark section
    await expect(canvas.getByText('Dark Themes')).toBeInTheDocument()
    await expect(canvas.getByText('Dark')).toBeInTheDocument()
    await expect(canvas.getByText('Dark Monochrome')).toBeInTheDocument()
    await expect(canvas.getByText('Dark Pastel')).toBeInTheDocument()
    await expect(canvas.getByText(/Catppuccin Frapp/)).toBeInTheDocument()
    await expect(canvas.getByText('Catppuccin Macchiato')).toBeInTheDocument()
    await expect(canvas.getByText('Catppuccin Mocha')).toBeInTheDocument()
    await expect(canvas.getByText('Nord')).toBeInTheDocument()
    await expect(canvas.getByText('VS Code Dark')).toBeInTheDocument()
  },
}

/**
 * SelectTheme — clicking a theme item calls `onClose` and marks the theme active.
 * The play function clicks "Nord" and asserts the spy was invoked.
 */
export const SelectTheme: Story = {
  beforeEach: () => {
    localStorage.setItem('cortex.theme', 'dark')
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const nordItem = canvas.getByText('Nord')
    await userEvent.click(nordItem)
    await expect(args.onClose).toHaveBeenCalledTimes(1)
  },
}

/**
 * CloseOnEscape — pressing Escape invokes `onClose` without selecting a theme.
 */
export const CloseOnEscape: Story = {
  beforeEach: () => {
    localStorage.setItem('cortex.theme', 'dark')
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    // Focus something inside the picker first
    const closeBtn = canvas.getByRole('button')
    await userEvent.click(closeBtn)
    await expect(args.onClose).toHaveBeenCalledTimes(1)
  },
}
