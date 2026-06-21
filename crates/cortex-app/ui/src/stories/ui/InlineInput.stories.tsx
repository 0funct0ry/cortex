import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import InlineInput from '@/components/ui/InlineInput'

const meta: Meta<typeof InlineInput> = {
  title: 'ui/InlineInput',
  component: InlineInput,
  parameters: {
    layout: 'centered',
  },
  args: {
    initialValue: 'My Collection',
    onConfirm: fn(),
    onCancel: fn(),
  },
  argTypes: {
    initialValue: {
      control: 'text',
      description: 'Pre-filled value shown when the input mounts',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind classes applied to the input element',
    },
    onConfirm: {
      description: 'Called with the current value on Enter or blur',
    },
    onCancel: {
      description: 'Called when Escape is pressed',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default — input pre-filled with "My Collection", auto-focused and selected on mount.
 * Press Enter or Tab away to trigger onConfirm; Escape to trigger onCancel.
 * The play function types a new name and presses Enter, verifying onConfirm is called.
 */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'Renamed Collection')
    await userEvent.keyboard('{Enter}')
    await expect(args.onConfirm).toHaveBeenCalledWith('Renamed Collection')
  },
}

/**
 * EmptyInitialValue — starts with an empty string.
 * Illustrates the blank state a consumer sees before the user types anything.
 */
export const EmptyInitialValue: Story = {
  args: { initialValue: '' },
}

/**
 * LongValue — initial value is a very long string.
 * Verifies the input clips within its container rather than overflowing.
 */
export const LongValue: Story = {
  args: {
    initialValue:
      'This is an exceptionally long collection name that tests horizontal overflow clipping behaviour inside the inline editor',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
}

/**
 * ErrorStyle — consumer-supplied className applies a red border to signal
 * invalid input. InlineInput has no built-in validation state; callers control
 * visual feedback via className.
 */
export const ErrorStyle: Story = {
  args: {
    initialValue: '',
    className: '!border-error focus:!border-error',
  },
}

/**
 * EscapeCancel — play function presses Escape and verifies onCancel fires.
 */
export const EscapeCancel: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.keyboard('{Escape}')
    await expect(args.onCancel).toHaveBeenCalled()
  },
}
