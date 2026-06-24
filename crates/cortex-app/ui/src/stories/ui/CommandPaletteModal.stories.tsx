import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import CommandPaletteModal from '@/components/ui/CommandPaletteModal'
import { TabsProvider } from '@/contexts/TabsContext'
import { useUIStore } from '@/stores/uiStore'
import { useCollectionStore } from '@/stores/collectionStore'
import type { Collection } from '@/bindings'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const FIXTURE_COLLECTION: Collection = {
  path: '/workspace/payments-api',
  is_git_repo: false,
  manifest: {
    version: '1',
    name: 'Payments API',
    description: null,
    headers: null,
    variables: [],
    auth: null,
    scripts: null,
    tests: null,
    presets: [],
    proxy: { enabled: false, url: '', bypass_list: null, username: null, password: null },
    client_certificates: [],
    protobuf: { proto_files: [], import_paths: [] },
    tag_registry: [],
  },
  items: [
    {
      type: 'Request',
      data: {
        name: 'Create Payment',
        path: '/workspace/payments-api/create-payment.yaml',
        relative_path: 'create-payment.yaml',
        content: null,
        error: null,
      },
    },
    {
      type: 'Request',
      data: {
        name: 'List Payments',
        path: '/workspace/payments-api/list-payments.yaml',
        relative_path: 'list-payments.yaml',
        content: null,
        error: null,
      },
    },
    {
      type: 'Request',
      data: {
        name: 'Refund Payment',
        path: '/workspace/payments-api/refund-payment.yaml',
        relative_path: 'refund-payment.yaml',
        content: null,
        error: null,
      },
    },
  ],
}

// ─── Shared store seed ────────────────────────────────────────────────────────

function seedCollectionStore() {
  useCollectionStore.setState({
    collections: {
      '/workspace/payments-api': FIXTURE_COLLECTION,
    },
    expansionState: { '/workspace/payments-api': true },
    selectedPath: null,
  })
}

const meta: Meta<typeof CommandPaletteModal> = {
  title: 'ui/CommandPaletteModal',
  component: CommandPaletteModal,
  decorators: [
    (Story) => (
      <TabsProvider>
        <Story />
      </TabsProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    // Renders via createPortal to document.body — isolate in iframe
    docs: {
      story: { inline: false, height: '480px' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Open — palette opens in search mode showing the seeded collection's requests.
 * The play function verifies the search input is rendered.
 *
 * Store dependencies mocked via beforeEach:
 *   - uiStore.isCommandPaletteOpen = true (via openCommandPalette)
 *   - collectionStore.collections = { 'Payments API': [...] }
 */
export const Open: Story = {
  beforeEach: () => {
    seedCollectionStore()
    useUIStore.getState().openCommandPalette()
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    // Wait for the search input to appear
    const input = await body.findByPlaceholderText(/search requests/i)
    await expect(input).toBeInTheDocument()
  },
}

/**
 * SearchMode — user has typed "pay" into the search box; the result list is
 * filtered to matching requests from the seeded Payments API collection.
 */
export const SearchMode: Story = {
  beforeEach: () => {
    seedCollectionStore()
    useUIStore.getState().openCommandPalette()
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const input = await body.findByPlaceholderText(/search requests/i)
    await userEvent.type(input, 'pay')
    // At least one result should appear
    await expect(body.getByText('Create Payment')).toBeInTheDocument()
  },
}

/**
 * EmptyResults — query that matches nothing shows a "No results" empty state.
 */
export const EmptyResults: Story = {
  beforeEach: () => {
    seedCollectionStore()
    useUIStore.getState().openCommandPalette()
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const input = await body.findByPlaceholderText(/search requests/i)
    await userEvent.type(input, 'zzz_no_match_xyz')
    await expect(body.getByText(/no results/i)).toBeInTheDocument()
  },
}

/**
 * CommandMode — palette opens with `>` prefix to run commands.
 * The command list shows curated and recently-used commands.
 *
 * Store dependencies mocked via beforeEach:
 *   - uiStore.commandPaletteMode = 'command' (via openCommandMode)
 */
export const CommandMode: Story = {
  beforeEach: () => {
    seedCollectionStore()
    useUIStore.getState().openCommandMode()
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    // In command mode the placeholder changes
    const input = await body.findByPlaceholderText(/type a command/i)
    await expect(input).toBeInTheDocument()
  },
}
