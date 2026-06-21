import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import Dialog from '@/components/ui/Dialog'

const meta: Meta<typeof Dialog> = {
  title: 'ui/Dialog',
  component: Dialog,
  parameters: {
    layout: 'fullscreen',
    // Dialog renders via createPortal to document.body using position:fixed.
    // In the Docs page, Canvas blocks are rendered inline (same DOM), so the
    // fixed backdrop would escape the canvas container and overlay all docs
    // content below it. inline:false forces each Canvas block into its own
    // sandboxed iframe, containing the fixed overlay within that iframe.
    docs: {
      story: { inline: false, height: '350px' },
    },
  },
  args: {
    isOpen: true,
    title: 'Confirm action',
    description: 'Are you sure you want to proceed? This cannot be undone.',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    variant: 'primary',
    onClose: fn(),
    onConfirm: fn(),
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the dialog is visible',
    },
    variant: {
      control: 'select',
      options: ['primary', 'danger'],
      description: 'Visual style of the confirm button',
    },
    title: { control: 'text', description: 'Dialog heading' },
    description: { control: 'text', description: 'Body text shown below the title' },
    confirmLabel: { control: 'text', description: 'Label for the confirm button' },
    cancelLabel: { control: 'text', description: 'Label for the cancel button' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Open — dialog rendered with isOpen=true, primary variant.
 * The play function clicks Cancel and asserts onClose was called.
 * Dialog renders via createPortal to document.body. We scope queries to
 * canvasElement.ownerDocument.body (the story iframe's body) rather than
 * the global document.body to avoid Storybook's "screen in docs mode" warning.
 */
export const Open: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)
    const cancelBtn = body.getByRole('button', { name: /cancel/i })
    await userEvent.click(cancelBtn)
    await expect(args.onClose).toHaveBeenCalled()
  },
}

/**
 * Closed — isOpen=false; the component returns null and nothing renders.
 * Documents the null-render contract so consumers don't need guards around Dialog.
 */
export const Closed: Story = {
  args: { isOpen: false },
}

/**
 * DangerVariant — confirm button uses the destructive (red) colour token.
 * Use for irreversible operations such as deleting a collection.
 */
export const DangerVariant: Story = {
  args: {
    title: 'Delete collection',
    description: 'Deleting "My Collection" will permanently remove all requests inside it.',
    confirmLabel: 'Delete',
    variant: 'danger',
  },
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)
    const confirmBtn = body.getByRole('button', { name: /delete/i })
    await userEvent.click(confirmBtn)
    await expect(args.onConfirm).toHaveBeenCalled()
  },
}

/**
 * LongContent — long description string verifies text wraps correctly inside
 * the max-w-md container without overflowing the backdrop.
 */
export const LongContent: Story = {
  args: {
    title: 'Export collection',
    description:
      'You are about to export the entire "Payments API" collection including all 47 requests, 12 environment definitions, and 3 runner configurations. Secret variable values will be redacted and replaced with __REDACTED__ placeholders. The exported YAML file can be committed to version control or imported into another Cortex workspace.',
  },
}

/**
 * CustomLabels — demonstrates overriding the default "Confirm" / "Cancel" labels
 * for domain-specific copy.
 */
export const CustomLabels: Story = {
  args: {
    title: 'Save changes?',
    description: 'You have unsaved edits to this request. Save them before closing?',
    confirmLabel: 'Save',
    cancelLabel: 'Discard',
  },
}
