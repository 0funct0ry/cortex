import type { Meta, StoryObj } from '@storybook/react'
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test'
import SaveToCollectionDialog from '@/components/ui/SaveToCollectionDialog'
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

const FIXTURE_WORKSPACE_MULTI: WorkspaceResponse = {
  ...FIXTURE_WORKSPACE,
  collections: [
    { path: '/tmp/my-collection', name: 'My Collection', error: null },
    { path: '/tmp/other-collection', name: 'Other Collection', error: null },
  ],
}

// Raw Collection — preview.tsx wraps mock return values as { status:'ok', data:<this> }
// so we must NOT pre-wrap here.
const FIXTURE_COLLECTION_EMPTY: Collection = {
  path: '/tmp/my-collection',
  manifest: { name: 'My Collection', version: '1' },
  is_git_repo: false,
  items: [],
}

const FIXTURE_COLLECTION_WITH_FOLDERS: Collection = {
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
    {
      type: 'Folder',
      data: {
        name: 'Users',
        path: '/tmp/my-collection/users',
        relative_path: 'users',
        items: [
          {
            type: 'Folder',
            data: {
              name: 'Admin',
              path: '/tmp/my-collection/users/admin',
              relative_path: 'users/admin',
              items: [],
            },
          },
        ],
      },
    },
  ],
}

function seedStores() {
  useWorkspaceStore.setState({ activeWorkspace: FIXTURE_WORKSPACE, activeWorkspacePath: '/tmp/ws' })
  useCollectionStore.setState({
    collections: { '/tmp/my-collection': FIXTURE_COLLECTION_WITH_FOLDERS },
    loadingCollections: {},
    errors: {},
    expansionState: {},
    selectedPath: null,
  })
}

function seedStoresEmpty() {
  useWorkspaceStore.setState({ activeWorkspace: FIXTURE_WORKSPACE, activeWorkspacePath: '/tmp/ws' })
  useCollectionStore.setState({
    collections: { '/tmp/my-collection': FIXTURE_COLLECTION_EMPTY },
    loadingCollections: {},
    errors: {},
    expansionState: {},
    selectedPath: null,
  })
}

function seedStoresMulti() {
  useWorkspaceStore.setState({
    activeWorkspace: FIXTURE_WORKSPACE_MULTI,
    activeWorkspacePath: '/tmp/ws',
  })
  useCollectionStore.setState({
    collections: {
      '/tmp/my-collection': FIXTURE_COLLECTION_WITH_FOLDERS,
      '/tmp/other-collection': FIXTURE_COLLECTION_EMPTY,
    },
    loadingCollections: {},
    errors: {},
    expansionState: {},
    selectedPath: null,
  })
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof SaveToCollectionDialog> = {
  title: 'ui/SaveToCollectionDialog',
  component: SaveToCollectionDialog,
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
      story: { inline: false, height: '480px' },
    },
    // IMPORTANT: mock values must be RAW inner values, not wrapped Results.
    // Use plain async functions (not fn() spies) for IPC mocks — instrumented
    // spies called outside play() can cause the preview to hang.
    // The story-level onClose arg stays fn() so it appears in the Actions panel.
    tauriMock: {
      create_request: async () => '/tmp/my-collection/new-request.crx',
      save_request: async () => null,
      load_collection: async () => FIXTURE_COLLECTION_WITH_FOLDERS,
    },
  },
  args: {
    isOpen: true,
    onClose: fn(),
    tabId: null,
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the dialog is visible',
    },
    onClose: {
      description: 'Called when the dialog should close (cancel or successful save)',
    },
    tabId: {
      control: 'text',
      description: 'ID of the transient tab to be promoted; null renders without a pre-filled name',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Open — dialog in its default state: name input empty and focused, folder
 * selector showing "Collection root", Save button disabled.
 */
export const Open: Story = {
  beforeEach: seedStores,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByRole('dialog', { name: /save to collection/i })).toBeInTheDocument()
    await expect(body.getByText('Save to Collection')).toBeInTheDocument()
    await expect(body.getByPlaceholderText('Request Name')).toBeInTheDocument()
    await expect(body.getByRole('button', { name: /save/i })).toBeDisabled()
    // Folder selector shows "Collection root" as default
    await expect(body.getByText('— Collection root —')).toBeInTheDocument()
  },
}

/**
 * WithFolders — collection has Auth and Users folders; the folder selector
 * exposes them with hierarchical indentation (Users/Admin nested under Users).
 */
export const WithFolders: Story = {
  name: 'Folder selector: with folders',
  beforeEach: seedStores,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByRole('dialog', { name: /save to collection/i })).toBeInTheDocument()
    // Folder options appear in the folder selector
    await expect(body.getByText('Auth')).toBeInTheDocument()
    await expect(body.getByText('Users')).toBeInTheDocument()
  },
}

/**
 * EmptyCollection — collection has no folders; the folder selector shows only
 * "Collection root" with no additional options.
 */
export const EmptyCollection: Story = {
  name: 'Folder selector: empty collection',
  beforeEach: seedStoresEmpty,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByRole('dialog', { name: /save to collection/i })).toBeInTheDocument()
    await expect(body.getByText('— Collection root —')).toBeInTheDocument()
    // No additional folder options
    await expect(body.queryByText('Auth')).not.toBeInTheDocument()
  },
}

/**
 * MultipleCollections — workspace has two collections; the collection picker
 * row becomes visible so the user can choose which collection to save into.
 */
export const MultipleCollections: Story = {
  name: 'Collection picker: multiple collections',
  beforeEach: seedStoresMulti,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByRole('dialog', { name: /save to collection/i })).toBeInTheDocument()
    // "Collection" label appears only when there are multiple collections
    await expect(body.getByText('Collection')).toBeInTheDocument()
    await expect(body.getByText('My Collection')).toBeInTheDocument()
    await expect(body.getByText('Other Collection')).toBeInTheDocument()
  },
}

/**
 * ValidationNameRequired — Save button is disabled when the name field is empty.
 */
export const ValidationNameRequired: Story = {
  name: 'Validation: name required',
  beforeEach: seedStores,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const nameInput = body.getByPlaceholderText('Request Name')
    await expect(nameInput).toHaveValue('')
    await expect(body.getByRole('button', { name: /save/i })).toBeDisabled()
  },
}

/**
 * ValidationNameFilled — typing a request name enables the Save button.
 *
 * Uses fireEvent.change (not userEvent.type) because user-event v14 does not
 * trigger React 18's onChange for controlled <input> elements.
 */
export const ValidationNameFilled: Story = {
  name: 'Validation: name enables Save',
  beforeEach: seedStores,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const nameInput = body.getByPlaceholderText('Request Name')
    await fireEvent.change(nameInput, { target: { value: 'Get Users' } })
    await expect(nameInput).toHaveValue('Get Users')
    await expect(body.getByRole('button', { name: /save/i })).not.toBeDisabled()
  },
}

/**
 * SaveFlow — fills the name and clicks Save; verifies that `onClose` is called
 * once the async IPC chain (create_request → save_request → load_collection)
 * completes.
 *
 * tabId must be non-null: handleSave has an early `if (!canSave || !tabId) return`
 * guard that prevents the IPC chain from firing when tabId is null.
 */
export const SaveFlow: Story = {
  name: 'Save: submit flow',
  beforeEach: seedStores,
  args: { tabId: 'tab-1' },
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)
    const nameInput = body.getByPlaceholderText('Request Name')
    await fireEvent.change(nameInput, { target: { value: 'Get Users' } })
    await expect(nameInput).toHaveValue('Get Users')
    const saveBtn = body.getByRole('button', { name: /^save$/i })
    await expect(saveBtn).not.toBeDisabled()
    await userEvent.click(saveBtn)
    await waitFor(() => expect(args.onClose).toHaveBeenCalled(), { timeout: 5000 })
  },
}

/**
 * CancelCloses — clicking the Cancel button calls `onClose` immediately without
 * triggering any IPC commands.
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

/**
 * Closed — `isOpen=false`; the component returns null and nothing is rendered.
 *
 * seedStores is required: even with isOpen=false hooks still run, so the
 * loadCollection effect may fire if collections[path] is absent.
 */
export const Closed: Story = {
  beforeEach: seedStores,
  args: { isOpen: false },
}
