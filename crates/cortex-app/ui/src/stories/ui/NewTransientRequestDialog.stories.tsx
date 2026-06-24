import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import NewTransientRequestDialog from '@/components/ui/NewTransientRequestDialog'
import { TabsProvider } from '@/contexts/TabsContext'

const meta: Meta<typeof NewTransientRequestDialog> = {
  title: 'ui/NewTransientRequestDialog',
  component: NewTransientRequestDialog,
  decorators: [
    (Story) => (
      <TabsProvider>
        <Story />
      </TabsProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '560px' },
    },
  },
  args: {
    isOpen: true,
    onClose: fn(),
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the dialog is visible',
    },
    onClose: {
      description: 'Called when the dialog should close',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Open — dialog in its default HTTP state.
 *
 * HTTP is pre-selected, the method dropdown (GET) and URL field are visible,
 * and the Open button is enabled with no prerequisites.
 */
export const Open: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByRole('dialog', { name: /new transient request/i })).toBeInTheDocument()
    await expect(body.getByText('New Transient Request')).toBeInTheDocument()
    // HTTP is selected — method dropdown visible
    await expect(body.getByText('GET')).toBeInTheDocument()
    // Open button always enabled
    const openBtn = body.getByRole('button', { name: /^open$/i })
    await expect(openBtn).not.toBeDisabled()
  },
}

/**
 * Closed — isOpen=false; the component returns null and nothing is rendered.
 */
export const Closed: Story = {
  args: { isOpen: false },
}

/**
 * GraphQLProtocol — selecting GraphQL hides the HTTP method dropdown and shows
 * a plain URL input with an `https://` placeholder.
 */
export const GraphQLProtocol: Story = {
  name: 'Protocol: GraphQL',
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const graphqlRadio = body.getByText('GraphQL')
    await userEvent.click(graphqlRadio)
    // Method dropdown gone
    await expect(body.queryByText('GET')).not.toBeInTheDocument()
    await expect(body.getByPlaceholderText('https://')).toBeInTheDocument()
  },
}

/**
 * GrpcProtocol — selecting gRPC shows a plain URL input with a `grpc://` placeholder.
 */
export const GrpcProtocol: Story = {
  name: 'Protocol: gRPC',
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const grpcRadio = body.getByText('gRPC')
    await userEvent.click(grpcRadio)
    await expect(body.getByPlaceholderText('grpc://')).toBeInTheDocument()
    await expect(body.queryByText('GET')).not.toBeInTheDocument()
  },
}

/**
 * WebSocketProtocol — selecting WebSocket shows a plain URL input with `ws://` placeholder.
 */
export const WebSocketProtocol: Story = {
  name: 'Protocol: WebSocket',
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const wsRadio = body.getByText('WebSocket')
    await userEvent.click(wsRadio)
    await expect(body.getByPlaceholderText('ws://')).toBeInTheDocument()
    await expect(body.queryByText('GET')).not.toBeInTheDocument()
  },
}

/**
 * SseProtocol — selecting SSE shows a plain URL input with `https://` placeholder
 * (SSE uses HTTP transport but has no method picker).
 */
export const SseProtocol: Story = {
  name: 'Protocol: SSE',
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const sseRadio = body.getByText('SSE')
    await userEvent.click(sseRadio)
    await expect(body.getByPlaceholderText('https://')).toBeInTheDocument()
    await expect(body.queryByText('GET')).not.toBeInTheDocument()
  },
}

/**
 * CancelCloses — clicking the Cancel button calls `onClose`.
 */
export const CancelCloses: Story = {
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)
    const cancelBtn = body.getByRole('button', { name: /cancel/i })
    await userEvent.click(cancelBtn)
    await expect(args.onClose).toHaveBeenCalled()
  },
}

/**
 * OpenButtonExists — the Open button is always enabled regardless of URL input,
 * because transient requests don't require a name or saved location.
 */
export const OpenButtonExists: Story = {
  name: 'Open button always enabled',
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const openBtn = body.getByRole('button', { name: /^open$/i })
    await expect(openBtn).not.toBeDisabled()
    // Confirm it's still enabled with no URL typed
    const urlInput = body.getByPlaceholderText('https://')
    await expect(urlInput).toHaveValue('')
    await expect(openBtn).not.toBeDisabled()
  },
}
