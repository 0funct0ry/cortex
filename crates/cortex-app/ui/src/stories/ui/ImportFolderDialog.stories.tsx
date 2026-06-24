import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import ImportFolderDialog from '@/components/ui/ImportFolderDialog'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const PREVIEW_ENTRIES = [
  {
    name: 'Create Payment',
    rel_path: 'create-payment.yaml',
    conflicts: false,
    parse_error: null,
  },
  {
    name: 'List Payments',
    rel_path: 'list-payments.yaml',
    conflicts: true,
    parse_error: null,
  },
  {
    name: 'Refund Payment',
    rel_path: 'refund-payment.yaml',
    conflicts: false,
    parse_error: null,
  },
]

const PARSE_ERROR_ENTRIES = [
  {
    name: 'valid-request',
    rel_path: 'valid-request.yaml',
    conflicts: false,
    parse_error: null,
  },
  {
    name: 'bad-request',
    rel_path: 'bad-request.yaml',
    conflicts: false,
    parse_error: 'invalid YAML: unexpected token at line 4',
  },
]

const meta: Meta<typeof ImportFolderDialog> = {
  title: 'ui/ImportFolderDialog',
  component: ImportFolderDialog,
  parameters: {
    layout: 'fullscreen',
    // Renders via createPortal to document.body
    docs: {
      story: { inline: false, height: '520px' },
    },
    tauriMock: {
      pick_directory: () => '/Users/dev/exports/payments',
      scan_import_folder: () => ({ files: PREVIEW_ENTRIES, skipped_non_crx: 0 }),
      bulk_import_folder: () => ({ imported: 2, skipped: 0, failed: [] }),
    },
  },
  args: {
    isOpen: true,
    onClose: fn(),
    targetPath: '/workspace/payments-api',
    targetType: 'collection',
    collectionPath: '/workspace/payments-api',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the dialog is visible',
    },
    targetType: {
      control: 'select',
      options: ['collection', 'folder'],
      description: 'Whether files are being imported into a collection root or a sub-folder',
    },
    targetPath: {
      control: 'text',
      description: 'Absolute path to the collection or folder receiving the imports',
    },
    collectionPath: {
      control: 'text',
      description: 'Root collection path (needed for reload after import)',
    },
    onClose: { description: 'Called when the dialog should close' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Open — dialog in the "pick folder" step.
 * A Browse button prompts the user to select a folder via the OS picker.
 */
export const Open: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText(/import from folder/i)).toBeInTheDocument()
  },
}

/**
 * Closed — isOpen=false; the component renders nothing.
 */
export const Closed: Story = {
  args: { isOpen: false },
}

/**
 * PreviewStep — shows the list of files found in the selected folder.
 * Files with conflicts are highlighted; files with parse errors show an Error badge.
 * The `preview_import_folder` mock returns a mix of clean, conflicting, and errored entries.
 */
export const PreviewStep: Story = {
  parameters: {
    tauriMock: {
      pick_directory: () => '/Users/dev/exports/payments',
      scan_import_folder: () => ({ files: PREVIEW_ENTRIES, skipped_non_crx: 0 }),
      bulk_import_folder: () => ({ imported: 3, skipped: 0, failed: [] }),
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(body.getByRole('button', { name: /choose folder/i }))
    await expect(body.findByText('Create Payment')).resolves.toBeInTheDocument()
  },
}

/**
 * WithParseErrors — one file in the preview has a YAML parse error.
 * It is shown with an Error badge and its conflict choice is locked to Skip.
 */
export const WithParseErrors: Story = {
  parameters: {
    tauriMock: {
      pick_directory: () => '/Users/dev/exports',
      scan_import_folder: () => ({ files: PARSE_ERROR_ENTRIES, skipped_non_crx: 0 }),
      bulk_import_folder: () => ({ imported: 1, skipped: 0, failed: [] }),
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(body.getByRole('button', { name: /choose folder/i }))
    await expect(body.findByText('bad-request.yaml')).resolves.toBeInTheDocument()
    await expect(body.findByText(/invalid yaml/i)).resolves.toBeInTheDocument()
  },
}

/**
 * SummaryStep — after import completes, the dialog shows a per-file result
 * summary: green ticks for success, red crosses with error messages for failures.
 */
export const SummaryStep: Story = {
  parameters: {
    tauriMock: {
      pick_directory: () => '/Users/dev/exports/payments',
      scan_import_folder: () => ({ files: PREVIEW_ENTRIES, skipped_non_crx: 0 }),
      bulk_import_folder: () => ({
        imported: 2,
        skipped: 0,
        failed: [['refund-payment.yaml', 'Permission denied']],
      }),
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(body.getByRole('button', { name: /choose folder/i }))
    // Wait for preview, then click Import
    const importBtn = await body.findByRole('button', { name: /import/i })
    await userEvent.click(importBtn)
    // Summary step shows "Failed files" section and a Done button
    await expect(body.findByText('Failed files')).resolves.toBeInTheDocument()
    await expect(body.findByRole('button', { name: /done/i })).resolves.toBeInTheDocument()
  },
}
