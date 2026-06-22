/**
 * MethodSelector stories.
 *
 * MethodSelector is a pure Tier 1 component — no store or context dependencies.
 * All states are driven entirely by the `method` and `onChange` props.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { expect, userEvent, within } from 'storybook/test'
import MethodSelector from '@/components/composer/MethodSelector'

const meta: Meta<typeof MethodSelector> = {
  title: 'composer/MethodSelector',
  component: MethodSelector,
  parameters: {
    layout: 'centered',
  },
  args: {
    method: 'GET',
    onChange: fn(),
  },
  argTypes: {
    method: {
      control: { type: 'select' },
      options: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'HEAD',
        'OPTIONS',
        'TRACE',
        'GraphQL',
        'gRPC',
        'WS',
        'SSE',
      ],
      description: 'The currently selected HTTP method or protocol.',
    },
    onChange: {
      description: 'Callback fired when the user selects a different method.',
      action: 'onChange',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * GetMethod — the default state. Shows the GET pill with its blue-green colour.
 * This is the most common starting state for a new request tab.
 */
export const GetMethod: Story = {
  args: { method: 'GET' },
}

/**
 * PostMethod — POST pill in green. Common for resource-creation endpoints.
 */
export const PostMethod: Story = {
  args: { method: 'POST' },
}

/**
 * DeleteMethod — DELETE pill in red. The warning colour signals a destructive operation.
 */
export const DeleteMethod: Story = {
  args: { method: 'DELETE' },
}

/**
 * PatchMethod — PATCH pill in yellow. Used for partial resource updates.
 */
export const PatchMethod: Story = {
  args: { method: 'PATCH' },
}

/**
 * PutMethod — PUT pill in amber. Used for full resource replacement.
 */
export const PutMethod: Story = {
  args: { method: 'PUT' },
}

/**
 * ProtocolGraphQL — GraphQL selected. Demonstrates the Protocol section colour token.
 */
export const ProtocolGraphQL: Story = {
  args: { method: 'GraphQL' },
}

/**
 * ProtocolWS — WebSocket selected. Shows the WS colour token from the Protocol section.
 */
export const ProtocolWS: Story = {
  args: { method: 'WS' },
}

/**
 * CustomMethod — a non-standard method value ("PURGE").
 * Falls back to neutral grey styling because there is no dedicated design token for it.
 * The pill still displays the value in uppercase.
 */
export const CustomMethod: Story = {
  args: { method: 'PURGE' },
}

/**
 * OpenDropdown — the dropdown is programmatically opened via a `play()` function.
 * Use this story to inspect the full dropdown UI: both sections (HTTP Methods and
 * Protocols), the divider, and the Custom Method input + Apply button.
 */
export const OpenDropdown: Story = {
  args: { method: 'GET' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The button's accessible name is its text content ("GET"), not the tooltip text.
    await userEvent.click(canvas.getByRole('button', { name: /^GET$/i }))
    // Verify all three dropdown section headings are visible
    await expect(canvas.getByText('HTTP Methods')).toBeInTheDocument()
    await expect(canvas.getByText('Protocols')).toBeInTheDocument()
    await expect(canvas.getByText('Custom Method')).toBeInTheDocument()
  },
}
