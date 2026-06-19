import type { Meta, StoryObj } from '@storybook/react'

const Placeholder = () => (
  <div
    style={{
      padding: '2rem',
      fontFamily: 'system-ui',
      color: 'var(--color-text-primary, #e8e8ea)',
    }}
  >
    <h2 style={{ margin: '0 0 0.5rem' }}>Cortex UI</h2>
    <p style={{ margin: 0, opacity: 0.6 }}>Component stories coming soon.</p>
  </div>
)

const meta: Meta<typeof Placeholder> = {
  title: 'Design System/Welcome',
  component: Placeholder,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
