import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import TabItem from '@/components/layout/TabItem'
import type { Tab } from '@/contexts/TabsContext'
import { TabsProvider } from '@/contexts/TabsContext'
import { useUIStore, resetUIStore } from '@/stores/uiStore'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const FIXTURE_TAB: Tab = {
  id: 'tab-story-001',
  type: 'request',
  name: 'List Pets',
  method: 'GET',
  requestPath: '/collections/petstore/list-pets.crx',
  collectionId: null,
  collectionPath: null,
  folderPath: null,
  exampleId: null,
  isDirty: false,
}

const FIXTURE_TAB_DIRTY: Tab = { ...FIXTURE_TAB, id: 'tab-story-002', isDirty: true }

const FIXTURE_TAB_POST: Tab = {
  ...FIXTURE_TAB,
  id: 'tab-story-post',
  name: 'Create Pet',
  method: 'POST',
}

const FIXTURE_TAB_PUT: Tab = {
  ...FIXTURE_TAB,
  id: 'tab-story-put',
  name: 'Update Pet',
  method: 'PUT',
}

const FIXTURE_TAB_DELETE: Tab = {
  ...FIXTURE_TAB,
  id: 'tab-story-delete',
  name: 'Delete Pet',
  method: 'DELETE',
}

// Default no-op drag handlers shared across stories
const DRAG_PROPS = {
  dragOverIndex: null,
  onDragStart: fn(),
  onDragOver: fn(),
  onDragLeave: fn(),
  onDrop: fn(),
  onDragEnd: fn(),
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof TabItem> = {
  title: 'layout/TabItem',
  component: TabItem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A single tab in the request tab bar. Renders a method label (or icon for special tab types), the request name, and a close button / dirty indicator. Supports drag-to-reorder and a right-click context menu.',
      },
    },
  },
  decorators: [
    (Story) => (
      // TabItem calls useTabs() — must live inside TabsProvider.
      // The outer div mimics the real tab bar strip dimensions.
      <TabsProvider>
        <div
          className="flex items-stretch bg-bg-panel border-b border-border-subtle"
          style={{ height: '36px', width: '600px' }}
        >
          <Story />
        </div>
      </TabsProvider>
    ),
  ],
  argTypes: {
    tab: { control: false, description: 'The Tab object to render.' },
    active: { control: 'boolean', description: 'Whether this tab is currently selected.' },
    index: { control: 'number', description: 'Position in the tab list (used for drag logic).' },
    dragOverIndex: {
      control: false,
      description: 'Index of the tab currently being dragged over, or null.',
    },
  },
  beforeEach: () => {
    // Seed openSaveToCollectionDialog with a spy so TabItem's context-menu
    // item can be clicked without triggering a real modal.
    resetUIStore()
    useUIStore.setState({ openSaveToCollectionDialog: fn() })
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Active — the currently selected tab.
 * Shows the accent bottom border, full-opacity close button, and primary text colour.
 */
export const Active: Story = {
  args: {
    tab: FIXTURE_TAB,
    active: true,
    index: 0,
    ...DRAG_PROPS,
  },
}

/**
 * Inactive — a background tab.
 * Text is muted; the close button is hidden until hover.
 */
export const Inactive: Story = {
  args: {
    tab: FIXTURE_TAB,
    active: false,
    index: 0,
    ...DRAG_PROPS,
  },
}

/**
 * Dirty — active tab with unsaved changes.
 * An orange dot appears; hovering the tab reveals the close button in place of the dot.
 * The play function hovers the tab and asserts the close button becomes visible.
 */
export const Dirty: Story = {
  args: {
    tab: FIXTURE_TAB_DIRTY,
    active: true,
    index: 0,
    ...DRAG_PROPS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tabEl = canvas.getByTitle('Unsaved changes')
    await userEvent.hover(tabEl)
    // The close button (×) is revealed on hover for dirty tabs
    const closeBtn = canvas.getByRole('button')
    await expect(closeBtn).toBeVisible()
  },
}

/**
 * InactiveHover — an inactive tab hovered by the user.
 * The play function hovers to confirm the close button transitions from opacity-0 to visible.
 */
export const InactiveHover: Story = {
  args: {
    tab: FIXTURE_TAB,
    active: false,
    index: 0,
    ...DRAG_PROPS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The outermost draggable div wraps the tab content — target it by title
    const tabEl = canvas.getByTitle(FIXTURE_TAB.name)
    await userEvent.hover(tabEl)
    const closeBtn = canvas.getByRole('button')
    await expect(closeBtn).toBeVisible()
  },
}

/**
 * MethodVariants — renders GET, POST, PUT, and DELETE tabs side by side to
 * verify that each HTTP method receives its correct colour token.
 */
export const MethodVariants: Story = {
  render: () => (
    <TabsProvider>
      <div
        className="flex items-stretch bg-bg-panel border-b border-border-subtle"
        style={{ height: '36px', width: '800px' }}
      >
        {[FIXTURE_TAB, FIXTURE_TAB_POST, FIXTURE_TAB_PUT, FIXTURE_TAB_DELETE].map((tab, i) => (
          <TabItem
            key={tab.id}
            tab={tab}
            active={i === 0}
            index={i}
            dragOverIndex={null}
            onDragStart={fn()}
            onDragOver={fn()}
            onDragLeave={fn()}
            onDrop={fn()}
            onDragEnd={fn()}
          />
        ))}
      </div>
    </TabsProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('GET')).toBeInTheDocument()
    await expect(canvas.getByText('POST')).toBeInTheDocument()
    await expect(canvas.getByText('PUT')).toBeInTheDocument()
    await expect(canvas.getByText('DELETE')).toBeInTheDocument()
  },
}

/**
 * ContextMenu — right-clicking the tab opens the context menu.
 * The play function fires a contextmenu event and asserts that the menu items
 * (Close Tab, Duplicate Tab, Copy Request URL) are present in the document.
 */
export const ContextMenu: Story = {
  args: {
    tab: FIXTURE_TAB,
    active: true,
    index: 0,
    ...DRAG_PROPS,
  },
  parameters: {
    docs: {
      story: { inline: false, height: '200px' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tabEl = canvas.getByTitle(FIXTURE_TAB.name)
    await userEvent.pointer({ target: tabEl, keys: '[MouseRight]' })
    // Context menu is portalled to document.body
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('Close Tab')).toBeInTheDocument()
    await expect(body.getByText('Duplicate Tab')).toBeInTheDocument()
    await expect(body.getByText('Copy Request URL')).toBeInTheDocument()
  },
}
