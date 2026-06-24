import type { Meta, StoryObj } from '@storybook/react'
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test'
import NewRequestDialog from '@/components/ui/NewRequestDialog'
import { TabsProvider } from '@/contexts/TabsContext'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useCollectionStore } from '@/stores/collectionStore'
import type { Collection, WorkspaceResponse } from '@/bindings'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const FIXTURE_WORKSPACE: WorkspaceResponse = {
  name: 'My Workspace',
  collections: [{ path: '/tmp/my-collection', name: 'My Collection', error: null }],
  variables: null,
  environments: [],
  env_files: [],
  active_environment: null,
  decrypt_failures: {},
}

// Raw Collection object — also used as the load_collection mock return value.
// The binding wraps mock return values as { status:'ok', data:<this> }, so we
// must NOT pre-wrap with { status, data } ourselves (preview.tsx comment).
const FIXTURE_COLLECTION: Collection = {
  path: '/tmp/my-collection',
  manifest: { name: 'My Collection', version: '1' },
  is_git_repo: false,
  items: [
    {
      type: 'Folder',
      data: {
        name: 'Auth',
        path: '/tmp/my-collection/auth',
        relative_path: 'auth',
        items: [],
      },
    },
  ],
}

function seedStores() {
  useWorkspaceStore.setState({ activeWorkspace: FIXTURE_WORKSPACE, activeWorkspacePath: '/tmp/ws' })
  useCollectionStore.setState({
    collections: { '/tmp/my-collection': FIXTURE_COLLECTION },
    loadingCollections: {},
    errors: {},
    expansionState: {},
    selectedPath: null,
  })
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof NewRequestDialog> = {
  title: 'ui/NewRequestDialog',
  component: NewRequestDialog,
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
      story: { inline: false, height: '680px' },
    },
    // IMPORTANT: mock values must be RAW inner values, not wrapped Results.
    // The binding generates: { status:'ok', data: await TAURI_INVOKE(...) }
    // so the mock return value becomes `data`. Returning a wrapped Result here
    // produces double-wrapping and causes colData.items to be undefined,
    // triggering a TypeError in buildFolderOptions → React error-recovery loop.
    //
    // Use plain async functions (not fn() spies) for IPC mocks — Storybook's spy
    // instrumentation layer can cause the preview to hang when instrumented spies
    // are invoked from outside a play() function (e.g. during manual interaction).
    // The story-level onClose arg stays fn() so it appears in the Actions panel.
    tauriMock: {
      create_request: async () => '/tmp/my-collection/new-request.crx',
      save_request: async () => null,
      load_collection: async () => FIXTURE_COLLECTION,
    },
  },
  args: {
    isOpen: true,
    onClose: fn(),
    initialCollectionPath: '/tmp/my-collection',
    initialFolderPath: null,
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the dialog is visible',
    },
    onClose: {
      description: 'Called when the dialog should close',
    },
    initialCollectionPath: {
      control: 'text',
      description: 'Pre-selects a collection and hides the collection picker',
    },
    initialFolderPath: {
      control: 'text',
      description: 'Pre-selects a folder within the active collection',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Open — dialog in its default HTTP state.
 *
 * The type selector shows HTTP pre-selected, the method dropdown (GET) and URL
 * field are visible, and the Create button is disabled until a name is entered.
 */
export const Open: Story = {
  beforeEach: seedStores,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByRole('dialog', { name: /new request/i })).toBeInTheDocument()
    await expect(body.getByText('New Request')).toBeInTheDocument()
    await expect(body.getByPlaceholderText('Request Name')).toBeInTheDocument()
    // HTTP type is selected by default — method + URL row visible
    await expect(body.getByText('GET')).toBeInTheDocument()
    await expect(body.getByPlaceholderText('Request URL')).toBeInTheDocument()
    // Create button is disabled with no name
    const createBtn = body.getByRole('button', { name: /create/i })
    await expect(createBtn).toBeDisabled()
  },
}

/**
 * Closed — isOpen=false; the component returns null and nothing is rendered.
 *
 * seedStores is required: even with isOpen=false hooks still run, so the
 * loadCollection effect fires if collections[path] is empty (after global
 * store reset). Pre-seeding prevents that call and any resulting re-render.
 */
export const Closed: Story = {
  beforeEach: seedStores,
  args: { isOpen: false },
}

/**
 * GraphQLType — selecting "GraphQL" keeps the method dropdown and URL field
 * visible (GraphQL still uses an HTTP transport).
 */
export const GraphQLType: Story = {
  name: 'Type: GraphQL',
  beforeEach: seedStores,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const graphqlRadio = body.getByText('GraphQL')
    await userEvent.click(graphqlRadio)
    // Method dropdown and URL field remain
    await expect(body.getByText('GET')).toBeInTheDocument()
    await expect(body.getByPlaceholderText('Request URL')).toBeInTheDocument()
  },
}

/**
 * GrpcType — selecting "gRPC" hides the method dropdown and shows a plain URL
 * input with `grpc://` placeholder.
 */
export const GrpcType: Story = {
  name: 'Type: gRPC',
  beforeEach: seedStores,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const grpcRadio = body.getByText('gRPC')
    await userEvent.click(grpcRadio)
    // URL-only row with grpc:// placeholder; no method dropdown button
    await expect(body.getByPlaceholderText('grpc://')).toBeInTheDocument()
    await expect(body.queryByText('GET')).not.toBeInTheDocument()
  },
}

/**
 * WebSocketType — selecting "WebSocket" shows a plain URL input with `ws://` placeholder.
 */
export const WebSocketType: Story = {
  name: 'Type: WebSocket',
  beforeEach: seedStores,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const wsRadio = body.getByText('WebSocket')
    await userEvent.click(wsRadio)
    await expect(body.getByPlaceholderText('ws://')).toBeInTheDocument()
    await expect(body.queryByText('GET')).not.toBeInTheDocument()
  },
}

/**
 * FromCurlType — selecting "From cURL" hides the URL/method row and reveals a
 * multi-line textarea for pasting a raw `curl` command, plus a parse-as selector.
 */
export const FromCurlType: Story = {
  name: 'Type: From cURL',
  beforeEach: seedStores,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const curlRadio = body.getByText('From cURL')
    await userEvent.click(curlRadio)
    await expect(body.getByPlaceholderText(/enter curl request/i)).toBeInTheDocument()
    // Parse-as select shows HTTP / GraphQL options
    await expect(body.getByRole('combobox')).toBeInTheDocument()
    // Method dropdown is gone
    await expect(body.queryByPlaceholderText('Request URL')).not.toBeInTheDocument()
  },
}

/**
 * ValidationNameRequired — the Create button stays disabled when the request
 * name field is empty (the default).
 */
export const ValidationNameRequired: Story = {
  name: 'Validation: name required',
  beforeEach: seedStores,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const nameInput = body.getByPlaceholderText('Request Name')
    await expect(nameInput).toHaveValue('')
    const createBtn = body.getByRole('button', { name: /create/i })
    await expect(createBtn).toBeDisabled()
  },
}

/**
 * ValidationNameFilled — typing a request name enables the Create button.
 *
 * Uses fireEvent.change (not userEvent.type) because user-event v14 does not
 * trigger React 18's onChange for controlled <input> elements — the DOM value
 * updates but React's requestName state stays empty, so the button never
 * enables.  fireEvent.change uses the native prototype setter + dispatches a
 * change event, which React 18 picks up correctly.
 */
export const ValidationNameFilled: Story = {
  name: 'Validation: name enables Create',
  beforeEach: seedStores,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const nameInput = body.getByPlaceholderText('Request Name')
    await fireEvent.change(nameInput, { target: { value: 'Get Users' } })
    await expect(nameInput).toHaveValue('Get Users')
    const createBtn = body.getByRole('button', { name: /create/i })
    await expect(createBtn).not.toBeDisabled()
  },
}

/**
 * CreateRequest — types a name and clicks Create; verifies onClose is called.
 *
 * handleCreate is async (IPC calls + store updates), so onClose is checked
 * inside waitFor to give the async chain time to complete before asserting.
 */
export const CreateRequest: Story = {
  name: 'Create: submit flow',
  beforeEach: seedStores,
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)
    const nameInput = body.getByPlaceholderText('Request Name')
    await fireEvent.change(nameInput, { target: { value: 'Get Users' } })
    await expect(nameInput).toHaveValue('Get Users')
    const createBtn = body.getByRole('button', { name: /create/i })
    await expect(createBtn).not.toBeDisabled()
    await userEvent.click(createBtn)
    await waitFor(() => expect(args.onClose).toHaveBeenCalled(), { timeout: 5000 })
  },
}

/**
 * CancelCloses — clicking the Cancel button calls `onClose` without submitting.
 */
export const CancelCloses: Story = {
  beforeEach: seedStores,
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)
    const cancelBtn = body.getByRole('button', { name: /cancel/i })
    await userEvent.click(cancelBtn)
    await expect(args.onClose).toHaveBeenCalled()
  },
}
