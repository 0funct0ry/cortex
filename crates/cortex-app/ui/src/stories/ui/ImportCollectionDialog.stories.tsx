import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import ImportCollectionDialog from '@/components/ui/ImportCollectionDialog'
import { useUIStore } from '@/stores/uiStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const PREVIEW_DATA = {
  collection_name: 'Payments API',
  request_count: 12,
  has_conflict: false,
}

const PREVIEW_CONFLICT = {
  collection_name: 'Payments API',
  request_count: 12,
  has_conflict: true,
}

// ─── Shared seed helpers ──────────────────────────────────────────────────────

function seedBase(format: 'zip' | 'bundle') {
  useWorkspaceStore.setState({ activeWorkspacePath: '/workspace' })
  useUIStore.setState({
    importCollectionDialog: { isOpen: true, format },
  })
}

const meta: Meta<typeof ImportCollectionDialog> = {
  title: 'ui/ImportCollectionDialog',
  component: ImportCollectionDialog,
  parameters: {
    layout: 'fullscreen',
    // Renders via createPortal to document.body
    docs: {
      story: { inline: false, height: '480px' },
    },
    tauriMock: {
      pick_file: () => '/tmp/payments-api.zip',
      preview_import_zip: () => PREVIEW_DATA,
      preview_import_bundle: () => PREVIEW_DATA,
      extract_collection_zip: () => '/workspace/payments-api',
      extract_collection_bundle: () => '/workspace/payments-api',
      add_collection_to_workspace: () => null,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Open — dialog in its initial state for a ZIP import.
 * The dialog prompts the user to pick a file on mount.
 *
 * Store dependencies mocked via beforeEach:
 *   - uiStore.importCollectionDialog = { isOpen: true, format: 'zip' }
 *   - workspaceStore.activeWorkspacePath = '/workspace'
 * IPC mocked:
 *   - pick_file, preview_import_zip, extract_collection_zip
 */
export const Open: Story = {
  beforeEach: () => seedBase('zip'),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText(/import from/i)).toBeInTheDocument()
  },
}

/**
 * BundleFormat — same dialog opened for YAML bundle import instead of ZIP.
 */
export const BundleFormat: Story = {
  name: 'Bundle Format',
  beforeEach: () => seedBase('bundle'),
  parameters: {
    tauriMock: {
      pick_file: () => '/tmp/payments-api.yaml',
      preview_import_bundle: () => PREVIEW_DATA,
      extract_collection_bundle: () => '/workspace/payments-api',
      add_collection_to_workspace: () => null,
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText(/import from/i)).toBeInTheDocument()
  },
}

/**
 * PreviewStep — after picking a file the dialog shows a preview of what
 * will be imported: collection name and request count.
 */
export const PreviewStep: Story = {
  beforeEach: () => seedBase('zip'),
  parameters: {
    tauriMock: {
      pick_file: () => '/tmp/payments-api.zip',
      preview_import_zip: () => PREVIEW_DATA,
      extract_collection_zip: () => '/workspace/payments-api',
      add_collection_to_workspace: () => null,
    },
  },
}

/**
 * ConflictStep — preview shows that a collection with the same name already
 * exists; the dialog asks the user to choose a destination directory.
 */
export const ConflictStep: Story = {
  beforeEach: () => seedBase('zip'),
  parameters: {
    tauriMock: {
      pick_file: () => '/tmp/payments-api.zip',
      preview_import_zip: () => PREVIEW_CONFLICT,
      extract_collection_zip: () => '/workspace/payments-api',
      add_collection_to_workspace: () => null,
    },
  },
}

/**
 * ImportError — the preview command returns an error (malformed file).
 * The dialog surfaces the error message and allows the user to try again.
 */
export const ImportError: Story = {
  beforeEach: () => seedBase('zip'),
  parameters: {
    tauriMock: {
      pick_file: () => '/tmp/bad-file.zip',
      // Throwing a string causes the binding to produce { status: 'error', error: '...' }
      preview_import_zip: () => {
        throw 'Failed to read archive: not a valid ZIP file'
      },
    },
  },
}

/**
 * Closed — dialog renders nothing when isOpen=false.
 */
export const Closed: Story = {
  beforeEach: () => {
    useUIStore.setState({
      importCollectionDialog: { isOpen: false, format: null },
    })
  },
}
