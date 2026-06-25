import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import ShareCollectionModal from '@/components/ui/ShareCollectionModal'
import { useUIStore } from '@/stores/uiStore'
import { useCollectionStore } from '@/stores/collectionStore'
import type { Collection } from '@/bindings'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const FIXTURE_COLLECTION: Collection = {
  path: '/tmp/my-collection',
  manifest: {
    name: 'My Collection',
    version: '1',
    auth: null,
    headers: null,
    variables: null,
  },
  is_git_repo: false,
  items: [],
}

const FIXTURE_COLLECTION_WITH_SECRETS: Collection = {
  path: '/tmp/my-collection',
  manifest: {
    name: 'My Collection',
    version: '1',
    auth: null,
    headers: null,
    variables: [
      { name: 'API_KEY', value: 'super_secret', secret: true, enabled: true },
      { name: 'BEARER_TOKEN', value: 'tok_abc123', secret: true, enabled: true },
    ],
  },
  is_git_repo: false,
  items: [],
}

function seedStores(col: Collection = FIXTURE_COLLECTION) {
  useUIStore.setState((s) => ({
    ...s,
    shareModal: {
      isOpen: true,
      collectionPath: '/tmp/my-collection',
      collectionName: 'My Collection',
    },
    // Spy wraps the real close logic so the modal actually unmounts AND the
    // call is visible in the Actions panel / assertable in play().
    closeShareModal: fn(() => {
      useUIStore.setState((s2) => ({
        ...s2,
        shareModal: { isOpen: false, collectionPath: null, collectionName: null },
      }))
    }),
  }))
  useCollectionStore.setState((s) => ({
    ...s,
    collections: { '/tmp/my-collection': col },
  }))
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ShareCollectionModal> = {
  title: 'ui/ShareCollectionModal',
  component: ShareCollectionModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '560px' },
    },
    tauriMock: {
      check_git_initialized: async () => false,
      git_init_collection: async () => null,
      save_file: async () => '/tmp/my-collection-2024-01-01.zip',
      export_collection_zip: async () => null,
      export_collection_bundle: async () => null,
      load_collection: async () => FIXTURE_COLLECTION,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * GitTabNotInitialized — modal opens on the Git tab (default). The collection
 * directory has no Git repo yet; the "Initialize Git Repository" button is shown.
 */
export const GitTabNotInitialized: Story = {
  name: 'Git tab: not initialized',
  parameters: {
    tauriMock: {
      check_git_initialized: async () => false,
      git_init_collection: async () => null,
      save_file: async () => '/tmp/my-collection-2024-01-01.zip',
      export_collection_zip: async () => null,
      export_collection_bundle: async () => null,
      load_collection: async () => FIXTURE_COLLECTION,
    },
  },
  beforeEach: () => seedStores(),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('Share Collection')).toBeInTheDocument()
    await waitFor(
      () =>
        expect(
          body.getByRole('button', { name: /initialize git repository/i })
        ).toBeInTheDocument(),
      { timeout: 3000 }
    )
  },
}

/**
 * GitTabInitialized — `check_git_initialized` returns `true`. The success
 * banner ("Git repository already initialized") is shown in place of the init button.
 */
export const GitTabInitialized: Story = {
  name: 'Git tab: already initialized',
  parameters: {
    tauriMock: {
      check_git_initialized: async () => true,
      git_init_collection: async () => null,
      save_file: async () => '/tmp/my-collection-2024-01-01.zip',
      export_collection_zip: async () => null,
      export_collection_bundle: async () => null,
      load_collection: async () => FIXTURE_COLLECTION,
    },
  },
  beforeEach: () => seedStores(),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('Share Collection')).toBeInTheDocument()
    await waitFor(
      () => expect(body.getByText(/git repository already initialized/i)).toBeInTheDocument(),
      { timeout: 3000 }
    )
  },
}

/**
 * GitTabInitializing — starts with no repo, then clicks "Initialize Git
 * Repository". The button transitions to "Initializing…" while the IPC call
 * is in-flight.
 */
export const GitTabInitializing: Story = {
  name: 'Git tab: initializing (in-progress)',
  parameters: {
    tauriMock: {
      // Delay resolving so the loading state is visible during the play function
      check_git_initialized: async () => false,
      git_init_collection: async () => new Promise((resolve) => setTimeout(resolve, 2000)),
      save_file: async () => '/tmp/my-collection-2024-01-01.zip',
      export_collection_zip: async () => null,
      export_collection_bundle: async () => null,
      load_collection: async () => FIXTURE_COLLECTION,
    },
  },
  beforeEach: () => seedStores(),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await waitFor(
      () =>
        expect(
          body.getByRole('button', { name: /initialize git repository/i })
        ).toBeInTheDocument(),
      { timeout: 3000 }
    )
    await userEvent.click(body.getByRole('button', { name: /initialize git repository/i }))
    await waitFor(() => expect(body.getByText(/initializing/i)).toBeInTheDocument(), {
      timeout: 3000,
    })
  },
}

/**
 * ExportTabZip — switches to the Export tab. The ZIP format card is selected
 * by default and the "Proceed" button is visible.
 */
export const ExportTabZip: Story = {
  name: 'Export tab: ZIP format (default)',
  parameters: {
    tauriMock: {
      check_git_initialized: async () => false,
      git_init_collection: async () => null,
      save_file: async () => '/tmp/my-collection-2024-01-01.zip',
      export_collection_zip: async () => null,
      export_collection_bundle: async () => null,
      load_collection: async () => FIXTURE_COLLECTION,
    },
  },
  beforeEach: () => seedStores(),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const exportTab = body.getByRole('button', { name: /^export$/i })
    await userEvent.click(exportTab)
    await expect(body.getByText('Cortex Collection (ZIP)')).toBeInTheDocument()
    await expect(body.getByRole('button', { name: /^proceed$/i })).toBeInTheDocument()
  },
}

/**
 * ClosesOnXButton — clicking the ✕ button in the modal header calls
 * `closeShareModal`. The spy is seeded into the store so the call is visible
 * in the Storybook Actions panel.
 */
export const ClosesOnXButton: Story = {
  name: 'Close: X button calls closeShareModal',
  parameters: {
    tauriMock: {
      check_git_initialized: async () => false,
      git_init_collection: async () => null,
      save_file: async () => '/tmp/my-collection-2024-01-01.zip',
      export_collection_zip: async () => null,
      export_collection_bundle: async () => null,
      load_collection: async () => FIXTURE_COLLECTION,
    },
  },
  beforeEach: () => seedStores(),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('Share Collection')).toBeInTheDocument()
    // The X button is the only button in the modal with no text content.
    const allButtons = body.getAllByRole('button')
    const closeBtn = allButtons.find((b) => !b.textContent?.trim())!
    await userEvent.click(closeBtn)
    const closeShareModalSpy = useUIStore.getState().closeShareModal as ReturnType<typeof fn>
    await waitFor(() => expect(closeShareModalSpy).toHaveBeenCalled(), { timeout: 3000 })
  },
}

/**
 * ExportTabWithSecrets — collection has 2 secret variables. After switching to
 * the Export tab, the yellow secret-variable warning banner is visible.
 */
export const ExportTabWithSecrets: Story = {
  name: 'Export tab: with secret variables warning',
  parameters: {
    tauriMock: {
      check_git_initialized: async () => false,
      git_init_collection: async () => null,
      save_file: async () => '/tmp/my-collection-2024-01-01.zip',
      export_collection_zip: async () => null,
      export_collection_bundle: async () => null,
      load_collection: async () => FIXTURE_COLLECTION_WITH_SECRETS,
    },
  },
  beforeEach: () => seedStores(FIXTURE_COLLECTION_WITH_SECRETS),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const exportTab = body.getByRole('button', { name: /^export$/i })
    await userEvent.click(exportTab)
    await waitFor(() => expect(body.getByText(/2 secret variables/i)).toBeInTheDocument(), {
      timeout: 3000,
    })
    await expect(body.getByText(/redacted in the export/i)).toBeInTheDocument()
  },
}
