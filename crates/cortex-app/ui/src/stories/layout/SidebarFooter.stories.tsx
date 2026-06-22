import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import SidebarFooter from '@/components/layout/SidebarFooter'

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof SidebarFooter> = {
  title: 'layout/SidebarFooter',
  component: SidebarFooter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A fixed-height footer strip at the bottom of the sidebar. Displays an "API Specs" label with a file-text icon and a disabled plus button (feature coming soon).',
      },
    },
  },
  decorators: [
    (Story) => (
      // Mirror the sidebar's fixed width so the footer stretches correctly.
      <div style={{ width: '240px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default — the only state of SidebarFooter.
 * Shows the FileText icon, "API Specs" label, and the disabled plus button.
 * The play function hovers the plus button and asserts the "Coming soon" tooltip title is present.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('API Specs')).toBeInTheDocument()
    const plusBtn = canvas.getByTitle('Coming soon')
    await expect(plusBtn).toBeInTheDocument()
    await userEvent.hover(plusBtn)
    await expect(plusBtn).toBeVisible()
  },
}
