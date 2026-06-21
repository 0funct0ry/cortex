import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import Tooltip from '@/components/ui/Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'ui/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  args: {
    content: 'Tooltip text',
    position: 'bottom',
    align: 'center',
    delay: 0,
    children: (
      <button className="px-3 py-1.5 bg-bg-surface border border-border-subtle rounded-sm text-sm text-text-primary">
        Hover me
      </button>
    ),
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Placement of the tooltip relative to the trigger',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Alignment along the cross-axis',
    },
    delay: {
      control: 'number',
      description: 'Hover delay in milliseconds before the tooltip appears',
    },
    content: {
      control: 'text',
      description: 'Text content of the tooltip',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default state — tooltip appears below the trigger on hover.
 * Delay is set to 0 for instant display during interaction testing.
 */
export const Default: Story = {}

/**
 * Bottom — tooltip appears below the trigger (default position).
 * The play function hovers the trigger and asserts the tooltip becomes visible.
 */
export const Bottom: Story = {
  args: { position: 'bottom', content: 'Opens below' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button')
    await userEvent.hover(trigger)
    await expect(canvas.getByText('Opens below')).toBeInTheDocument()
  },
}

/**
 * Top — tooltip appears above the trigger.
 */
export const Top: Story = {
  args: { position: 'top', content: 'Opens above' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button')
    await userEvent.hover(trigger)
    await expect(canvas.getByText('Opens above')).toBeInTheDocument()
  },
}

/**
 * Left — tooltip appears to the left of the trigger.
 */
export const Left: Story = {
  args: { position: 'left', content: 'Opens left' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button')
    await userEvent.hover(trigger)
    await expect(canvas.getByText('Opens left')).toBeInTheDocument()
  },
}

/**
 * Right — tooltip appears to the right of the trigger.
 */
export const Right: Story = {
  args: { position: 'right', content: 'Opens right' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button')
    await userEvent.hover(trigger)
    await expect(canvas.getByText('Opens right')).toBeInTheDocument()
  },
}

/**
 * LongContent — verifies that long tooltip text renders correctly without
 * breaking layout. The `whitespace-nowrap` class on the tooltip span means
 * it extends horizontally; this story documents that expected behaviour.
 */
export const LongContent: Story = {
  args: {
    content:
      'This is a much longer tooltip message that documents expected whitespace-nowrap behaviour',
    position: 'bottom',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button')
    await userEvent.hover(trigger)
    await expect(
      canvas.getByText(
        'This is a much longer tooltip message that documents expected whitespace-nowrap behaviour'
      )
    ).toBeInTheDocument()
  },
}

/**
 * AlignStart — tooltip aligned to the start edge of the trigger.
 */
export const AlignStart: Story = {
  args: { position: 'bottom', align: 'start', content: 'Aligned to start' },
}

/**
 * AlignEnd — tooltip aligned to the end edge of the trigger.
 */
export const AlignEnd: Story = {
  args: { position: 'bottom', align: 'end', content: 'Aligned to end' },
}

/**
 * WithDelay — demonstrates the default 300ms hover delay.
 * The play function uses a manual wait to account for the timeout.
 */
export const WithDelay: Story = {
  args: { delay: 300, content: 'Appeared after delay' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button')
    await userEvent.hover(trigger)
    // Wait for the delay to elapse
    await new Promise((r) => setTimeout(r, 350))
    await expect(canvas.getByText('Appeared after delay')).toBeInTheDocument()
  },
}
