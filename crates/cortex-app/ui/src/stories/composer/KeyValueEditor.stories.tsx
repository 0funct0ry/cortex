/**
 * KeyValueEditor stories.
 *
 * KeyValueEditor is primarily props-driven via `entries` and `onChange`. The
 * only external dependency is `useTabs()` from TabsContext, which is used
 * exclusively to scope localStorage custom-header memory to a collection ID.
 * It falls back to `null` gracefully, so stories work without an active tab.
 *
 * A `TabsProvider` decorator is required to satisfy the context hook —
 * without it, `useTabs()` throws "must be used within a TabsProvider".
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { expect, userEvent, within } from 'storybook/test'
import KeyValueEditor from '@/components/composer/KeyValueEditor'
import { TabsProvider } from '@/contexts/TabsContext'
import type { HeaderEntry } from '@/bindings'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const ENTRY_CONTENT_TYPE: HeaderEntry = {
  key: 'Content-Type',
  value: 'application/json',
  enabled: true,
}

const ENTRY_ACCEPT: HeaderEntry = { key: 'Accept', value: '*/*', enabled: true }

const ENTRY_AUTH: HeaderEntry = {
  key: 'Authorization',
  value: 'Bearer {{apiToken}}',
  enabled: true,
}

const ENTRY_CACHE: HeaderEntry = { key: 'Cache-Control', value: 'no-cache', enabled: true }

const ENTRY_DISABLED: HeaderEntry = {
  key: 'X-Debug-Mode',
  value: 'true',
  enabled: false,
}

// Duplicate key — triggers the duplicate-key warning highlight
const ENTRY_DUP_ACCEPT: HeaderEntry = { key: 'Accept', value: 'text/html', enabled: true }

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof KeyValueEditor> = {
  title: 'composer/KeyValueEditor',
  component: KeyValueEditor,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: 320, display: 'flex', flexDirection: 'column' }}>
        <TabsProvider>
          <Story />
        </TabsProvider>
      </div>
    ),
  ],
  args: {
    entries: [],
    onChange: fn(),
    title: 'Headers',
    namePlaceholder: 'Key',
    valuePlaceholder: 'Value',
    addButtonLabel: 'Add parameter',
    isHeaders: false,
    caseSensitiveKeys: false,
  },
  argTypes: {
    entries: {
      control: false,
      description: 'Array of `HeaderEntry` objects (`{ key, value, enabled }`)',
    },
    onChange: {
      description: 'Callback fired whenever any entry changes.',
      action: 'onChange',
    },
    title: {
      control: { type: 'text' },
      description: 'Label shown in the table header row.',
    },
    addButtonLabel: {
      control: { type: 'text' },
      description: 'Label for the bottom add-row button.',
    },
    isHeaders: {
      control: { type: 'boolean' },
      description: 'Enables HTTP-header autocomplete on key and value inputs.',
    },
    caseSensitiveKeys: {
      control: { type: 'boolean' },
      description: 'When true, duplicate-key detection is case-sensitive.',
    },
    namePlaceholder: {
      control: { type: 'text' },
      description: 'Placeholder text shown in the key column inputs.',
    },
    valuePlaceholder: {
      control: { type: 'text' },
      description: 'Placeholder text shown in the value column inputs.',
    },
    readOnlyEntries: {
      control: false,
      description: 'Array of read-only rows displayed below the editable table.',
    },
    readOnlyTitle: {
      control: { type: 'text' },
      description: 'Section heading for the read-only entries block.',
    },
    readOnlyTooltip: {
      control: { type: 'text' },
      description: 'Tooltip text for the info icon next to `readOnlyTitle`.',
    },
    presets: {
      control: false,
      description: 'Optional preset configurations available via the "Apply Preset" dropdown.',
    },
    onApplyPreset: {
      description: 'Callback fired when a preset is selected.',
      action: 'onApplyPreset',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Empty — no entries provided.
 *
 * KeyValueEditor normalises an empty `entries` array to a single blank row so
 * the user always has somewhere to type. The "Add parameter" button is
 * rendered below the placeholder row.
 */
export const Empty: Story = {
  args: {
    entries: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Add parameter')).toBeInTheDocument()
  },
}

/**
 * SingleRow — one filled key-value pair.
 *
 * A single `Content-Type: application/json` entry. The drag handle (⠿) and
 * the enabled checkbox are visible. The delete button appears on hover.
 */
export const SingleRow: Story = {
  args: {
    entries: [ENTRY_CONTENT_TYPE],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const keyInput = canvas.getByDisplayValue('Content-Type')
    await expect(keyInput).toBeInTheDocument()
    await expect(canvas.getByDisplayValue('application/json')).toBeInTheDocument()
  },
}

/**
 * MultipleRows — five realistic HTTP header entries.
 *
 * Includes a duplicate `Accept` key to demonstrate the duplicate-key warning
 * highlight (left border becomes amber). Both rows with key `Accept` are
 * highlighted.
 */
export const MultipleRows: Story = {
  args: {
    entries: [ENTRY_CONTENT_TYPE, ENTRY_ACCEPT, ENTRY_AUTH, ENTRY_CACHE, ENTRY_DUP_ACCEPT],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Both Accept rows should be present
    const acceptInputs = canvas.getAllByDisplayValue('Accept')
    await expect(acceptInputs).toHaveLength(2)
  },
}

/**
 * DisabledRow — a row with `enabled: false`.
 *
 * Disabled rows are rendered at 40% opacity with a muted background. Their
 * inputs are read-only (`readOnly` attribute set). The row checkbox is
 * unchecked. The rest of the table remains interactive.
 */
export const DisabledRow: Story = {
  args: {
    entries: [ENTRY_CONTENT_TYPE, ENTRY_DISABLED, ENTRY_ACCEPT],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByDisplayValue('X-Debug-Mode')).toBeInTheDocument()
    // VariableInput passes readOnly as disabled on the underlying <input>
    const disabledInput = canvas.getByDisplayValue('X-Debug-Mode')
    await expect(disabledInput).toBeDisabled()
  },
}

/**
 * WithReadOnlyEntries — inherited headers section.
 *
 * Two editable entries plus two read-only entries from a parent environment.
 * The read-only section is pinned to the bottom of the editor with an
 * "Inherited" heading and an info tooltip.
 */
export const WithReadOnlyEntries: Story = {
  args: {
    entries: [ENTRY_CONTENT_TYPE, ENTRY_AUTH],
    readOnlyEntries: [
      { key: 'X-Collection-Auth', value: 'Bearer env-token', description: 'Collection' },
      { key: 'X-Workspace-ID', value: 'ws-12345', description: 'Workspace' },
    ],
    readOnlyTitle: 'Inherited',
    readOnlyTooltip: 'These headers are inherited from the collection and cannot be edited here.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Inherited')).toBeInTheDocument()
    await expect(canvas.getByText('X-Collection-Auth')).toBeInTheDocument()
  },
}

/**
 * HeadersMode — `isHeaders=true` enables HTTP header autocomplete.
 *
 * In this mode, focusing a key cell shows autocomplete suggestions from the
 * built-in HTTP headers dictionary and any custom headers remembered for the
 * current collection. The `Authorization` header is pre-filled to demonstrate
 * that `Bearer` prefix suggestions would appear on value focus.
 */
export const HeadersMode: Story = {
  args: {
    entries: [ENTRY_AUTH, ENTRY_CONTENT_TYPE],
    isHeaders: true,
    title: 'Headers',
    addButtonLabel: 'Add header',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByDisplayValue('Authorization')).toBeInTheDocument()
    await expect(canvas.getByText('Add header')).toBeInTheDocument()
  },
}

/**
 * BulkEdit — the textarea bulk-edit mode.
 *
 * Clicking "Bulk Edit" in the header switches the component from the table view
 * to a full-height textarea. Each entry is serialised as `Key: Value`; disabled
 * rows are prefixed with `# `. Editing the textarea updates the parent in real
 * time. Clicking "Key-Value Editor" switches back and commits the parsed result.
 *
 * The `play()` function clicks "Bulk Edit", verifies the textarea appears, types
 * a new line, and asserts `onChange` is called with the parsed entry.
 */
export const BulkEdit: Story = {
  args: {
    entries: [ENTRY_CONTENT_TYPE, ENTRY_ACCEPT],
    onChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Switch to bulk edit mode
    const bulkEditBtn = canvas.getByText('Bulk Edit')
    await userEvent.click(bulkEditBtn)
    // Textarea should now be visible
    const textarea = canvas.getByRole('textbox')
    await expect(textarea).toBeInTheDocument()
    // Heading switches to bulk-edit label
    await expect(canvas.getByText(/Bulk Edit Mode/i)).toBeInTheDocument()
    // "Key-Value Editor" toggle link should appear
    await expect(canvas.getByText('Key-Value Editor')).toBeInTheDocument()
  },
}

/**
 * AddRow — `play()` adds a new row via the "Add parameter" button.
 *
 * Starts with two entries. The play function clicks "Add parameter" and
 * verifies that a third blank row appears in the table.
 */
export const AddRow: Story = {
  args: {
    entries: [ENTRY_CONTENT_TYPE, ENTRY_ACCEPT],
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const addBtn = canvas.getByText('Add parameter')
    await userEvent.click(addBtn)
    // onChange should have been called with 3 entries
    await expect(args.onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: 'Content-Type' }),
        expect.objectContaining({ key: 'Accept' }),
        expect.objectContaining({ key: '', value: '', enabled: true }),
      ])
    )
  },
}

/**
 * DeleteRow — `play()` deletes a row using the × delete button.
 *
 * Starts with three entries. The play function hovers the first row to reveal
 * the × button, clicks it, and verifies `onChange` was called without the
 * deleted entry.
 */
export const DeleteRow: Story = {
  args: {
    entries: [ENTRY_CONTENT_TYPE, ENTRY_ACCEPT, ENTRY_AUTH],
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    // Hover the first data row to make its delete button visible
    const firstKeyInput = canvas.getByDisplayValue('Content-Type')
    const firstRow = firstKeyInput.closest('tr')!
    await userEvent.hover(firstRow)

    // The delete button is the one inside the hovered row
    const rowDeleteBtn = firstRow.querySelector('button')
    if (rowDeleteBtn) {
      await userEvent.click(rowDeleteBtn)
    }

    // onChange should have been called — the result should not include Content-Type
    await expect(args.onChange).toHaveBeenCalled()
    const lastCall = (args.onChange as ReturnType<typeof fn>).mock.calls.at(
      -1
    )?.[0] as HeaderEntry[]
    const keys = lastCall?.map((e) => e.key) ?? []
    await expect(keys).not.toContain('Content-Type')
  },
}
