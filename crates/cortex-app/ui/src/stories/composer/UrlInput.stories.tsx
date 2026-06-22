/**
 * UrlInput stories.
 *
 * UrlInput reads from TabsContext (`useTabs`) and from `requestStore` /
 * `collectionEnvironmentStore` to resolve variable colours. These stories
 * follow the same pattern as UrlBar.stories.tsx: they pre-seed the stores via
 * `beforeEach` and wrap the component in a `TabsProvider` decorator so the
 * context is available.
 *
 * The component's `value` / `onChange` props are controlled via Storybook args
 * so the Controls panel lets you type a URL directly.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { expect, within } from 'storybook/test'
import UrlInput from '@/components/composer/UrlInput'
import { TabsProvider } from '@/contexts/TabsContext'
import { useRequestStore, resetRequestStore } from '@/stores/requestStore'
import { useWorkspaceStore, resetWorkspaceStore } from '@/stores/workspaceStore'
import type { ResolvedVariable } from '@/bindings'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORY_TAB_ID = 'story-urlinput-tab-001'

const STORY_TAB = {
  id: STORY_TAB_ID,
  type: 'request' as const,
  name: 'Story Request',
  method: 'GET',
  requestPath: null,
  collectionId: null,
  collectionPath: null,
  folderPath: null,
  exampleId: null,
  isDirty: false,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeResolved(value: string, secret = false): ResolvedVariable {
  return { value, scope: 'environment', secret }
}

/** Seeds TabsProvider via localStorage, requestStore, and workspaceStore. */
function seedTab(resolvedVariables: Record<string, ResolvedVariable> = {}) {
  localStorage.setItem('cortex.tabs.list', JSON.stringify([STORY_TAB]))
  localStorage.setItem('cortex.tabs.activeId', STORY_TAB_ID)
  resetRequestStore()
  useRequestStore.setState({
    resolvedVariables: { [STORY_TAB_ID]: resolvedVariables },
  })
  resetWorkspaceStore()
  useWorkspaceStore.setState({ activeWorkspacePath: '/mock/workspace' })
}

// ---------------------------------------------------------------------------
// Controlled wrapper — keeps the value in local state so the overlay updates
// as the user types in the Controls panel.
// ---------------------------------------------------------------------------

function ControlledUrlInput(props: {
  value: string
  onChange: (v: string) => void
  onEnter?: () => void
}) {
  const [value, setValue] = useState(props.value)
  const handleChange = (v: string) => {
    setValue(v)
    props.onChange(v)
  }
  return <UrlInput value={value} onChange={handleChange} onEnter={props.onEnter} />
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof ControlledUrlInput> = {
  title: 'composer/UrlInput',
  component: ControlledUrlInput,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <TabsProvider>
        <div className="flex flex-col bg-bg-panel p-4" style={{ width: '600px' }}>
          <Story />
        </div>
      </TabsProvider>
    ),
  ],
  args: {
    value: '',
    onChange: fn(),
    onEnter: fn(),
  },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'The current URL string. May contain `{{variable}}` tokens.',
    },
    onChange: {
      description: 'Callback fired on every keystroke with the new URL string.',
      action: 'onChange',
    },
    onEnter: {
      description: 'Callback fired when the user presses Enter (and the autocomplete is closed).',
      action: 'onEnter',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Empty — the input with no URL. Shows the placeholder text
 * _"Enter URL or paste text"_ in the overlay.
 */
export const Empty: Story = {
  args: { value: '' },
  beforeEach: () => {
    seedTab()
  },
}

/**
 * WithUrl — a plain URL without any variable tokens.
 * The overlay renders the text in the default `text-text-primary` colour.
 * No coloured spans are produced.
 */
export const WithUrl: Story = {
  args: { value: 'https://api.example.com/users/123' },
  beforeEach: () => {
    seedTab()
  },
}

/**
 * VariableSegments — a URL with two `{{variable}}` tokens.
 * - `{{baseUrl}}` is **resolved** (seeded in the store) → rendered in **green**
 * - `{{userId}}` is **unresolved** (not in the store) → rendered in **red**
 *
 * Hover either token to see the VarPopover.
 */
export const VariableSegments: Story = {
  args: { value: 'https://{{baseUrl}}/users/{{userId}}/posts' },
  beforeEach: () => {
    seedTab({
      baseUrl: makeResolved('api.example.com'),
    })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The overlay renders each segment as a <span>; verify token spans exist
    await expect(canvas.getAllByText(/\{\{baseUrl\}\}/).length).toBeGreaterThan(0)
    await expect(canvas.getAllByText(/\{\{userId\}\}/).length).toBeGreaterThan(0)
  },
}

/**
 * DynamicVariable — a URL with a `$timestamp` dynamic variable.
 * Dynamic variables (those starting with `$`) are always rendered in the
 * **accent blue** colour regardless of whether they are "resolved", because
 * their value is computed at request-send time by the Rust executor.
 */
export const DynamicVariable: Story = {
  args: { value: 'https://api.example.com/events?t={{$timestamp}}' },
  beforeEach: () => {
    seedTab()
  },
}

/**
 * MultipleVariableMix — a URL that combines resolved, unresolved, and dynamic tokens.
 * Useful for verifying that all three colour classes are applied correctly
 * in a single input without any rendering conflicts.
 */
export const MultipleVariableMix: Story = {
  args: { value: 'https://{{baseUrl}}/{{version}}/items/{{$randomUUID}}' },
  beforeEach: () => {
    seedTab({
      baseUrl: makeResolved('api.example.com'),
    })
  },
}
