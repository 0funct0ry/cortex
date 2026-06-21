import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import ToastContainer from '@/components/ui/ToastContainer'
import { useToastStore } from '@/stores/toastStore'

const meta: Meta<typeof ToastContainer> = {
  title: 'ui/ToastContainer',
  component: ToastContainer,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Empty — no toasts in the store. The container renders but is invisible
 * (zero children). Useful for verifying there are no layout side-effects.
 */
export const Empty: Story = {
  beforeEach: () => {
    useToastStore.setState({ toasts: [] })
  },
}

/**
 * Single — one success toast visible in the top-right corner.
 */
export const Single: Story = {
  beforeEach: () => {
    useToastStore.setState({
      toasts: [{ id: 'single-1', type: 'success', message: 'Workspace saved.' }],
    })
  },
}

/**
 * Multiple — three stacked toasts (success, error, info) displayed
 * simultaneously to verify the stacking gap and z-index are correct.
 */
export const Multiple: Story = {
  beforeEach: () => {
    useToastStore.setState({
      toasts: [
        { id: 'multi-1', type: 'success', message: 'Collection imported successfully.' },
        { id: 'multi-2', type: 'error', message: 'Failed to connect to the server.' },
        { id: 'multi-3', type: 'info', message: 'A new Cortex update is available.' },
      ],
    })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Verify all three messages are rendered
    await expect(canvas.getByText('Collection imported successfully.')).toBeInTheDocument()
    await expect(canvas.getByText('Failed to connect to the server.')).toBeInTheDocument()
    await expect(canvas.getByText('A new Cortex update is available.')).toBeInTheDocument()
  },
}

/**
 * LongMessages — multiple toasts with verbose messages to verify max-width
 * constrains each individual toast correctly even when stacked.
 */
export const LongMessages: Story = {
  beforeEach: () => {
    useToastStore.setState({
      toasts: [
        {
          id: 'long-1',
          type: 'success',
          message: 'Your collection has been exported and saved to the selected directory.',
        },
        {
          id: 'long-2',
          type: 'error',
          message:
            'Unable to reach the remote server. Check your network connection and try again.',
        },
      ],
    })
  },
}
