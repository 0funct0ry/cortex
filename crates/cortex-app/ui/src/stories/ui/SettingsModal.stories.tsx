import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { SettingsModal } from '@/components/ui/SettingsModal'
import { TabsProvider } from '@/contexts/TabsContext'
import { useCollectionStore } from '@/stores/collectionStore'
import type { Collection } from '@/bindings'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

// Raw Collection objects — preview.tsx wraps mock return values as
// { status:'ok', data:<this> }, so we must NOT pre-wrap here.
const FIXTURE_COLLECTION_NO_AUTH: Collection = {
  path: '/tmp/my-collection',
  manifest: { name: 'My Collection', version: '1', auth: null, headers: null },
  is_git_repo: false,
  items: [],
}

const FIXTURE_COLLECTION_API_KEY: Collection = {
  path: '/tmp/my-collection',
  manifest: {
    name: 'My Collection',
    version: '1',
    auth: { type: 'api_key', key: 'X-API-Key', value: 'secret_value', addTo: 'header' },
    headers: null,
  },
  is_git_repo: false,
  items: [],
}

const FIXTURE_COLLECTION_BEARER: Collection = {
  path: '/tmp/my-collection',
  manifest: {
    name: 'My Collection',
    version: '1',
    auth: { type: 'bearer_token', token: 'my-bearer-token' },
    headers: null,
  },
  is_git_repo: false,
  items: [],
}

const FIXTURE_COLLECTION_WITH_HEADERS: Collection = {
  path: '/tmp/my-collection',
  manifest: {
    name: 'My Collection',
    version: '1',
    auth: null,
    headers: { 'X-Org-ID': 'my-org', 'X-Request-ID': '{{request_id}}' },
  },
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

function seedStores(col: Collection = FIXTURE_COLLECTION_NO_AUTH) {
  useCollectionStore.setState({
    collections: { '/tmp/my-collection': col },
    loadingCollections: {},
    errors: {},
    expansionState: {},
    selectedPath: null,
  })
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof SettingsModal> = {
  title: 'ui/SettingsModal',
  component: SettingsModal,
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
      story: { inline: false, height: '580px' },
    },
    // IMPORTANT: mock values must be RAW inner values, not wrapped Results.
    // Use plain async functions (not fn() spies) for IPC mocks.
    // The story-level onClose arg stays fn() so it appears in the Actions panel.
    tauriMock: {
      update_collection_auth: async () => null,
      update_collection_headers: async () => null,
      update_folder_auth: async () => null,
      update_folder_headers: async () => null,
      load_collection: async () => FIXTURE_COLLECTION_NO_AUTH,
    },
  },
  args: {
    isOpen: true,
    onClose: fn(),
    type: 'collection',
    path: '/tmp/my-collection',
    name: 'My Collection',
    collectionPath: '/tmp/my-collection',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls dialog visibility',
    },
    type: {
      control: 'radio',
      options: ['collection', 'folder'],
      description: 'Whether this modal targets a collection or a folder',
    },
    path: {
      control: 'text',
      description: 'Absolute path of the collection or folder being configured',
    },
    name: {
      control: 'text',
      description: 'Display name shown in the modal subtitle',
    },
    collectionPath: {
      control: 'text',
      description: 'Root collection path (used for folder lookups)',
    },
    onClose: {
      description: 'Called when the dialog should dismiss',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * CollectionAuthTab — modal opens on the Authentication tab (default) for a
 * collection with no auth configured. Auth type selector shows "No Auth".
 */
export const CollectionAuthTab: Story = {
  name: 'Collection: auth tab (no auth)',
  beforeEach: () => seedStores(FIXTURE_COLLECTION_NO_AUTH),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('Collection Settings')).toBeInTheDocument()
    await expect(body.getByText('My Collection')).toBeInTheDocument()
    // Auth tab is active by default
    await expect(body.getByRole('button', { name: /authentication/i })).toBeInTheDocument()
    // Auth type select defaults to "No Auth". With auth='none' there are no
    // VariableInput fields, so getByDisplayValue uniquely matches the select.
    await waitFor(() => expect(body.getByDisplayValue('No Auth')).toBeInTheDocument(), {
      timeout: 3000,
    })
  },
}

/**
 * CollectionApiKeyAuth — collection has an API Key auth configured; the form
 * fields for key name, key value, and "add to" placement are pre-filled.
 */
export const CollectionApiKeyAuth: Story = {
  name: 'Collection: API Key auth pre-filled',
  beforeEach: () => seedStores(FIXTURE_COLLECTION_API_KEY),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('Collection Settings')).toBeInTheDocument()
    // Wait for useEffect's Promise.resolve().then() to populate form state.
    // The Key Name VariableInput (placeholder 'e.g. X-API-Key') only renders
    // when authType === 'api_key', so it's a unique, unambiguous sentinel.
    await waitFor(() => expect(body.getByPlaceholderText('e.g. X-API-Key')).toBeInTheDocument(), {
      timeout: 3000,
    })
    // Key Name and Key Value labels are visible
    await expect(body.getByText('Key Name')).toBeInTheDocument()
    await expect(body.getByText('Key Value')).toBeInTheDocument()
    await expect(body.getByText('Add To')).toBeInTheDocument()
  },
}

/**
 * CollectionBearerAuth — collection has a Bearer Token configured; the bearer
 * token field is visible and masked by default.
 */
export const CollectionBearerAuth: Story = {
  name: 'Collection: Bearer Token auth pre-filled',
  beforeEach: () => seedStores(FIXTURE_COLLECTION_BEARER),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('Collection Settings')).toBeInTheDocument()
    // The bearer token VariableInput only renders when authType === 'bearer_token'.
    // Its placeholder is unique on the page, so it's a reliable deferred-init sentinel.
    await waitFor(
      () =>
        expect(body.getByPlaceholderText('e.g. your_token or {{my_token}}')).toBeInTheDocument(),
      { timeout: 3000 }
    )
  },
}

/**
 * CollectionHeadersTab — clicking the "Custom Headers" tab switches content to
 * the headers panel. With no headers configured, the empty state message is shown.
 */
export const CollectionHeadersTab: Story = {
  name: 'Collection: headers tab (empty)',
  beforeEach: () => seedStores(FIXTURE_COLLECTION_NO_AUTH),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('Collection Settings')).toBeInTheDocument()
    const headersTab = body.getByRole('button', { name: /custom headers/i })
    await userEvent.click(headersTab)
    // Empty state message
    await expect(body.getByText(/no custom headers configured/i)).toBeInTheDocument()
    // Add Header button is present
    await expect(body.getByRole('button', { name: /add header/i })).toBeInTheDocument()
  },
}

/**
 * CollectionHeadersWithRows — collection has pre-configured headers; the
 * headers tab lists each key-value row.
 */
export const CollectionHeadersWithRows: Story = {
  name: 'Collection: headers tab (with rows)',
  beforeEach: () => seedStores(FIXTURE_COLLECTION_WITH_HEADERS),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const headersTab = body.getByRole('button', { name: /custom headers/i })
    await userEvent.click(headersTab)
    // Wait for useEffect to populate headers from fixture
    await waitFor(
      () => {
        expect(body.getByDisplayValue('X-Org-ID')).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
    await expect(body.getByDisplayValue('{{request_id}}')).toBeInTheDocument()
  },
}

/**
 * FolderSettings — `type="folder"` changes the title to "Folder Settings" and
 * the auth type selector shows "Inherit Auth (No Auth)" for the none option.
 */
export const FolderSettings: Story = {
  name: 'Folder: settings modal',
  beforeEach: () => seedStores(FIXTURE_COLLECTION_WITH_HEADERS),
  args: {
    type: 'folder',
    path: '/tmp/my-collection/auth',
    name: 'Auth',
    collectionPath: '/tmp/my-collection',
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('Folder Settings')).toBeInTheDocument()
    await expect(body.getByText('Auth')).toBeInTheDocument()
    // With auth='none' and no VariableInput fields, getByDisplayValue uniquely
    // matches the auth type <select>. The folder variant shows "Inherit Auth (No Auth)".
    await waitFor(
      () => expect(body.getByDisplayValue('Inherit Auth (No Auth)')).toBeInTheDocument(),
      { timeout: 3000 }
    )
  },
}

/**
 * SaveFlow — with bearer token pre-loaded, click "Save Changes" and verify
 * that `onClose` is called after the async IPC chain completes.
 */
export const SaveFlow: Story = {
  name: 'Save: submit flow',
  beforeEach: () => seedStores(FIXTURE_COLLECTION_BEARER),
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('Collection Settings')).toBeInTheDocument()
    // Wait for the bearer token VariableInput to appear — same sentinel as CollectionBearerAuth.
    await waitFor(
      () =>
        expect(body.getByPlaceholderText('e.g. your_token or {{my_token}}')).toBeInTheDocument(),
      { timeout: 3000 }
    )
    const saveBtn = body.getByRole('button', { name: /save changes/i })
    await userEvent.click(saveBtn)
    await waitFor(() => expect(args.onClose).toHaveBeenCalled(), { timeout: 5000 })
  },
}

/**
 * CancelCloses — clicking the Cancel button calls `onClose` immediately without
 * triggering any IPC commands.
 */
export const CancelCloses: Story = {
  beforeEach: () => seedStores(FIXTURE_COLLECTION_NO_AUTH),
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)
    const cancelBtn = body.getByRole('button', { name: /cancel/i })
    await userEvent.click(cancelBtn)
    await expect(args.onClose).toHaveBeenCalled()
  },
}

/**
 * Closed — `isOpen=false`; the component returns null and nothing is rendered.
 */
export const Closed: Story = {
  beforeEach: () => seedStores(FIXTURE_COLLECTION_NO_AUTH),
  args: { isOpen: false },
}
