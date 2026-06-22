/**
 * SendButton stories.
 *
 * SendButton is a pure Tier 1 component — no store or context dependencies.
 * All states are driven entirely by props: `inFlight`, `disabled`, and `disabledReason`.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import SendButton from '@/components/composer/SendButton'

const meta: Meta<typeof SendButton> = {
  title: 'composer/SendButton',
  component: SendButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    inFlight: false,
    onSend: fn(),
    onCancel: fn(),
    disabled: false,
    disabledReason: '',
  },
  argTypes: {
    inFlight: {
      control: { type: 'boolean' },
      description: 'When `true` the button switches to Cancel mode.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the Send button (ignored when `inFlight` is `true`).',
    },
    disabledReason: {
      control: { type: 'text' },
      description: 'Optional tooltip text shown when the button is disabled.',
    },
    onSend: { description: 'Callback fired when the user clicks Send.', action: 'onSend' },
    onCancel: { description: 'Callback fired when the user clicks Cancel.', action: 'onCancel' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Idle — the default Send state.
 * The accent-coloured pill is clickable and shows the keyboard shortcut in its tooltip.
 */
export const Idle: Story = {
  args: {
    inFlight: false,
    disabled: false,
  },
}

/**
 * InFlight — a request is in progress.
 * The button switches to a red Cancel pill with an ✕ icon.
 * Clicking fires `onCancel` which aborts the in-flight request via Tauri IPC.
 */
export const InFlight: Story = {
  args: {
    inFlight: true,
  },
}

/**
 * Disabled — no URL has been entered yet.
 * The Send button is rendered at reduced opacity with a `cursor-not-allowed` cursor.
 * The tooltip still shows the keyboard shortcut (no reason provided here).
 */
export const Disabled: Story = {
  args: {
    inFlight: false,
    disabled: true,
    disabledReason: '',
  },
}

/**
 * DisabledWithReason — the Send button is disabled and the tooltip explains why.
 * `disabledReason` replaces the default shortcut hint so the user understands
 * what they need to do before they can send (e.g. enter a URL).
 */
export const DisabledWithReason: Story = {
  args: {
    inFlight: false,
    disabled: true,
    disabledReason: 'No URL entered',
  },
}
