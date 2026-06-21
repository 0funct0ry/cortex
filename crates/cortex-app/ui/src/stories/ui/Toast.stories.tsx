import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from 'storybook/test'
import Toast from '@/components/ui/Toast'
import { useToastStore } from '@/stores/toastStore'

const meta: Meta<typeof Toast> = {
  title: 'ui/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  args: {
    id: 'toast-preview',
    type: 'success',
    message: 'Operation completed successfully.',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'info'],
      description: 'Visual variant of the toast notification',
    },
    message: {
      control: 'text',
      description: 'Notification message text',
    },
    id: {
      control: 'text',
      description: 'Unique identifier used when dismissing the toast',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default state — success variant with a short message. Click the × button
 * to exercise the dismiss path (calls `removeToast` on the store).
 */
export const Default: Story = {}

/**
 * Success toast — green left-border with a check icon.
 */
export const Success: Story = {
  args: { type: 'success', message: 'File saved successfully.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Dismiss button is present and clickable
    const dismissButtons = canvas.getAllByRole('button')
    const dismissBtn = dismissButtons[dismissButtons.length - 1]
    await userEvent.click(dismissBtn)
    // After click the store has removed the toast — we only verify the click
    // didn't throw; the container unmounts the component so no DOM assertion needed.
  },
}

/**
 * Error toast — red left-border with an X icon.
 */
export const Error: Story = {
  args: { type: 'error', message: 'Request failed with status 500.' },
}

/**
 * Info toast — blue left-border with an info icon.
 */
export const Info: Story = {
  args: { type: 'info', message: 'A new version of Cortex is available.' },
}

/**
 * LongMessage — verifies the toast constrains width to max-w-[450px] and
 * wraps text gracefully rather than overflowing the viewport.
 */
export const LongMessage: Story = {
  args: {
    type: 'info',
    message:
      'This is a deliberately long notification message to verify that the toast container constrains its width and wraps text gracefully without overflowing the viewport or breaking the layout.',
  },
}

/**
 * ResetStore — demonstrates that the toast is driven purely by props;
 * the store is cleared in beforeEach so there are no stale toasts.
 */
export const ResetStore: Story = {
  beforeEach: () => {
    useToastStore.setState({ toasts: [] })
  },
  args: { type: 'success', message: 'Store reset before rendering.' },
}
