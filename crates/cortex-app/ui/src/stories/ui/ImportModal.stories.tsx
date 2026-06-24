import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import ImportModal from '@/components/ui/ImportModal'
import { useUIStore } from '@/stores/uiStore'

const meta: Meta<typeof ImportModal> = {
  title: 'ui/ImportModal',
  component: ImportModal,
  parameters: {
    layout: 'fullscreen',
    // Renders via createPortal to document.body
    docs: {
      story: { inline: false, height: '640px' },
    },
  },
  args: {
    isOpen: true,
    onClose: fn(),
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is visible',
    },
    onClose: {
      description: 'Called when the modal should close',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Open — modal showing all import format cards.
 * Two Cortex-native options (ZIP Archive, YAML Bundle) at the top,
 * followed by third-party formats (Postman, Insomnia, OpenAPI) marked "coming soon".
 */
export const Open: Story = {
  beforeEach: () => {
    // Reset sub-dialog state so it doesn't bleed in from a previous story
    useUIStore.setState({
      importCollectionDialog: { isOpen: false, format: null },
    })
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('Import Collection')).toBeInTheDocument()
    await expect(body.getByText('Cortex ZIP Archive')).toBeInTheDocument()
    await expect(body.getByText('Cortex YAML Bundle')).toBeInTheDocument()
    await expect(body.getByText('Postman Collection')).toBeInTheDocument()
    await expect(body.getByText('Insomnia Collection')).toBeInTheDocument()
    await expect(body.getByText('OpenAPI Specification')).toBeInTheDocument()
  },
}

/**
 * Closed — isOpen=false; the modal renders nothing.
 */
export const Closed: Story = {
  args: { isOpen: false },
}

/**
 * SelectZipFormat — clicking the ZIP Archive card closes this modal and opens
 * ImportCollectionDialog in 'zip' mode via `uiStore.openImportCollectionDialog`.
 */
export const SelectZipFormat: Story = {
  name: 'Select ZIP Format',
  beforeEach: () => {
    useUIStore.setState({
      importCollectionDialog: { isOpen: false, format: null },
    })
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const zipCard = body.getByText('Cortex ZIP Archive')
    await userEvent.click(zipCard)
    // After clicking the ZIP card, the store should have format='zip'
    const { importCollectionDialog } = useUIStore.getState()
    await expect(importCollectionDialog.format).toBe('zip')
  },
}

/**
 * SelectBundleFormat — clicking the YAML Bundle card opens ImportCollectionDialog
 * in 'bundle' mode.
 */
export const SelectBundleFormat: Story = {
  name: 'Select Bundle Format',
  beforeEach: () => {
    useUIStore.setState({
      importCollectionDialog: { isOpen: false, format: null },
    })
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const bundleCard = body.getByText('Cortex YAML Bundle')
    await userEvent.click(bundleCard)
    const { importCollectionDialog } = useUIStore.getState()
    await expect(importCollectionDialog.format).toBe('bundle')
  },
}
