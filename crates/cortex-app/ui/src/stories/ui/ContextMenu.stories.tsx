import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import ContextMenu from '@/components/ui/ContextMenu'
import type { ContextMenuItem } from '@/components/ui/ContextMenu'

const baseItems: ContextMenuItem[] = [
  { label: 'Open', onClick: fn() },
  { label: 'Rename', onClick: fn(), shortcut: '↵' },
  { label: 'Duplicate', onClick: fn(), shortcut: '⌘D' },
  { label: '', separator: true },
  { label: 'Delete', onClick: fn(), danger: true, shortcut: '⌫' },
]

const meta: Meta<typeof ContextMenu> = {
  title: 'ui/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'fullscreen',
    // ContextMenu renders via createPortal to document.body using position:fixed.
    // inline:false isolates each Canvas block in its own iframe so the fixed menu
    // doesn't bleed out of the story container in the Docs page.
    docs: {
      story: { inline: false, height: '280px' },
    },
  },
  args: {
    x: 80,
    y: 60,
    items: baseItems,
    onClose: fn(),
  },
  argTypes: {
    x: {
      control: 'number',
      description: 'Horizontal pixel position of the menu (viewport-relative)',
    },
    y: {
      control: 'number',
      description: 'Vertical pixel position of the menu (viewport-relative)',
    },
    onClose: {
      description: 'Called when the menu should close (Escape, click-outside, item click)',
    },
    items: { description: 'Array of ContextMenuItem objects to render', control: false },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default — basic context menu with a set of actions including a danger item.
 * The play function navigates through items with ArrowDown and closes with Escape.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    // ContextMenu renders into document.body via createPortal; scope to the iframe body.
    const body = within(canvasElement.ownerDocument.body)
    // Menu should be visible
    await expect(body.getByText('Open')).toBeInTheDocument()
    await expect(body.getByText('Delete')).toBeInTheDocument()
    // Arrow key navigates focus
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Escape}')
  },
}

/**
 * WithSeparators — separator items (`separator: true`) render as thin dividers
 * that visually group related actions without receiving keyboard focus.
 */
export const WithSeparators: Story = {
  args: {
    items: [
      { label: 'Cut', onClick: fn(), shortcut: '⌘X' },
      { label: 'Copy', onClick: fn(), shortcut: '⌘C' },
      { label: 'Paste', onClick: fn(), shortcut: '⌘V' },
      { label: '', separator: true },
      { label: 'Select All', onClick: fn(), shortcut: '⌘A' },
      { label: '', separator: true },
      { label: 'Find', onClick: fn(), shortcut: '⌘F' },
    ],
  },
}

/**
 * WithDisabledItems — disabled items are rendered at reduced opacity with
 * `cursor-not-allowed` and are skipped during keyboard navigation.
 */
export const WithDisabledItems: Story = {
  args: {
    items: [
      { label: 'Send Request', onClick: fn() },
      { label: 'Save Response', onClick: fn(), disabled: true },
      { label: 'Copy as cURL', onClick: fn(), shortcut: '⌘⇧C' },
      { label: '', separator: true },
      { label: 'Clear History', onClick: fn(), disabled: true, danger: true },
    ],
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    // Disabled item is present but visually muted
    await expect(body.getByText('Save Response')).toBeInTheDocument()
  },
}

/**
 * WithShortcuts — items can display a keyboard shortcut hint on the right edge.
 * These are purely decorative; the actual hotkeys are wired up globally.
 */
export const WithShortcuts: Story = {
  args: {
    items: [
      { label: 'New Request', onClick: fn(), shortcut: '⌘N' },
      { label: 'New Folder', onClick: fn(), shortcut: '⌘⇧N' },
      { label: '', separator: true },
      { label: 'Run Collection', onClick: fn(), shortcut: '⌘R' },
      { label: 'Export', onClick: fn(), shortcut: '⌘E' },
      { label: '', separator: true },
      { label: 'Settings', onClick: fn(), shortcut: '⌘,' },
    ],
  },
}

/**
 * WithDangerItem — danger items render in the error colour token to signal
 * destructive or irreversible operations.
 */
export const WithDangerItem: Story = {
  args: {
    items: [
      { label: 'Edit', onClick: fn() },
      { label: 'Move to folder', onClick: fn() },
      { label: '', separator: true },
      { label: 'Delete Request', onClick: fn(), danger: true },
      { label: 'Delete Collection', onClick: fn(), danger: true },
    ],
  },
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)
    const deleteBtn = body.getByText('Delete Request')
    await userEvent.click(deleteBtn)
    await expect(args.onClose).toHaveBeenCalled()
  },
}

/**
 * WithSubmenu — items with a `submenu` array show a `›` indicator and reveal
 * a nested panel on hover. Submenus are viewport-clipped automatically.
 */
export const WithSubmenu: Story = {
  args: {
    items: [
      {
        label: 'Add to folder',
        submenu: [
          { label: 'Auth', onClick: fn() },
          { label: 'Users', onClick: fn() },
          { label: 'Products', onClick: fn() },
        ],
      },
      {
        label: 'Move to collection',
        submenu: [
          { label: 'Payments API', onClick: fn() },
          { label: 'Admin API', onClick: fn() },
        ],
      },
      { label: '', separator: true },
      { label: 'Delete', onClick: fn(), danger: true },
    ],
  },
}
