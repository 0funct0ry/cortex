import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import EmptyComposerState from '@/components/layout/EmptyComposerState'

const meta: Meta<typeof EmptyComposerState> = {
  title: 'layout/EmptyComposerState',
  component: EmptyComposerState,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Shown in the composer panel when no request tab is active. Purely presentational — renders a faded rocket illustration and five keyboard shortcut hints. Has no props and no store/context dependencies.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col" style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default — the only visible state of this component.
 *
 * The play function asserts all five keyboard shortcut labels are rendered so
 * regressions to the hint list are caught automatically.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Primary action
    await expect(canvas.getByText('Send Request')).toBeInTheDocument()

    // Request-creation shortcuts
    await expect(canvas.getByText('New Request')).toBeInTheDocument()
    await expect(canvas.getByText('New Transient Request')).toBeInTheDocument()
    await expect(canvas.getByText('New Quick Request')).toBeInTheDocument()

    // Environment shortcut
    await expect(canvas.getByText('Edit Environments')).toBeInTheDocument()

    // Keyboard bindings
    await expect(canvas.getByText('Cmd + Enter')).toBeInTheDocument()
    await expect(canvas.getByText('Cmd + ⇧N')).toBeInTheDocument()
    await expect(canvas.getByText('Cmd + B')).toBeInTheDocument()
    await expect(canvas.getByText('Cmd + N')).toBeInTheDocument()
    await expect(canvas.getByText('Cmd + E')).toBeInTheDocument()
  },
}
