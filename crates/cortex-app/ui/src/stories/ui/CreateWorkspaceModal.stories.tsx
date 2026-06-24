import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import CreateWorkspaceModal from '@/components/ui/CreateWorkspaceModal'

const meta: Meta<typeof CreateWorkspaceModal> = {
  title: 'ui/CreateWorkspaceModal',
  component: CreateWorkspaceModal,
  parameters: {
    layout: 'fullscreen',
    // Renders via createPortal to document.body
    docs: {
      story: { inline: false, height: '420px' },
    },
    // Mock the Tauri directory picker and workspace-creation command
    tauriMock: {
      pick_directory: fn().mockResolvedValue({ status: 'ok', data: '/Users/dev/projects/my-api' }),
      create_workspace: fn().mockResolvedValue({ status: 'ok', data: null }),
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
      description: 'Called when the modal should close (Cancel button, backdrop click)',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Open — modal in its default empty state.
 * Both inputs are blank and the Create button is disabled until both fields are filled.
 */
export const Open: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('Create New Workspace')).toBeInTheDocument()
    // Create button disabled until name + path are both filled
    const createBtn = body.getByRole('button', { name: /create workspace/i })
    await expect(createBtn).toBeDisabled()
  },
}

/**
 * Closed — isOpen=false; the component returns null and nothing renders.
 */
export const Closed: Story = {
  args: { isOpen: false },
}

/**
 * WithNameFilled — workspace name is entered but no directory is chosen yet.
 * The Create button remains disabled because the path is still empty.
 */
export const WithNameFilled: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const nameInput = body.getByPlaceholderText(/project alpha/i)
    await userEvent.type(nameInput, 'Payments API')
    await expect(nameInput).toHaveValue('Payments API')
    // Still disabled — no path yet
    const createBtn = body.getByRole('button', { name: /create workspace/i })
    await expect(createBtn).toBeDisabled()
  },
}

/**
 * CancelCloses — clicking Cancel calls onClose without creating a workspace.
 */
export const CancelCloses: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)
    const cancelBtn = body.getByRole('button', { name: /cancel/i })
    await userEvent.click(cancelBtn)
    await expect(args.onClose).toHaveBeenCalled()
  },
}
