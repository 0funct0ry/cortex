import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import CreateExampleModal from '@/components/ui/CreateExampleModal'
import { TabsProvider } from '@/contexts/TabsContext'
import { useUIStore } from '@/stores/uiStore'

const meta: Meta<typeof CreateExampleModal> = {
  title: 'ui/CreateExampleModal',
  component: CreateExampleModal,
  decorators: [
    (Story) => (
      <TabsProvider>
        <Story />
      </TabsProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    // Renders via createPortal to document.body
    docs: {
      story: { inline: false, height: '400px' },
    },
    // Mock the Tauri IPC command used to save the example
    tauriMock: {
      save_example: fn().mockResolvedValue({ status: 'ok', data: null }),
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Open — modal in default state with an auto-generated name ("Example 1").
 * The play function asserts the heading and name input are visible.
 *
 * Store dependencies mocked via beforeEach:
 *   - uiStore.createExampleModal = { isOpen: true, requestPath: '...', resetKey: 0 }
 */
export const Open: Story = {
  beforeEach: () => {
    useUIStore.setState({
      createExampleModal: {
        isOpen: true,
        requestPath: '/workspace/payments-api/create-payment.yaml',
        resetKey: 0,
      },
    })
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText(/create example/i)).toBeInTheDocument()
    const nameInput = body.getByPlaceholderText(/example 1/i)
    await expect(nameInput).toBeInTheDocument()
  },
}

/**
 * WithCustomName — user types a custom example name before saving.
 * Asserts the input reflects the typed value and Save is enabled.
 */
export const WithCustomName: Story = {
  beforeEach: () => {
    useUIStore.setState({
      createExampleModal: {
        isOpen: true,
        requestPath: '/workspace/payments-api/create-payment.yaml',
        resetKey: 0,
      },
    })
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const nameInput = body.getByPlaceholderText(/example 1/i)
    await userEvent.click(nameInput)
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Happy Path — 200 OK')
    await expect(nameInput).toHaveValue('Happy Path — 200 OK')
    const saveBtn = body.getByRole('button', { name: /Create Example/i })
    await expect(saveBtn).not.toBeDisabled()
  },
}

/**
 * Closed — modal returns null when isOpen is false.
 * Demonstrates the null-render contract.
 */
export const Closed: Story = {
  beforeEach: () => {
    useUIStore.setState({
      createExampleModal: { isOpen: false, requestPath: null, resetKey: 0 },
    })
  },
}
