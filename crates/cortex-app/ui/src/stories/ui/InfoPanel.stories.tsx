import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, within } from 'storybook/test'
import InfoPanel from '@/components/ui/InfoPanel'
import type { ItemInfo } from '@/bindings'

const FOLDER_INFO: ItemInfo = {
  path: '/Users/dev/projects/payments-api.crx',
  size_bytes: 8192,
  created: '2024-11-01T09:00:00Z',
  modified: '2025-06-15T14:32:00Z',
  item_count: 47,
  folder_count: 3,
  direct_request_count: 12,
  direct_folder_count: 3,
  method: null,
  url: null,
}

const REQUEST_INFO: ItemInfo = {
  path: '/Users/dev/projects/payments-api.crx#charge-card',
  size_bytes: 1024,
  created: '2024-11-05T11:00:00Z',
  modified: '2025-06-10T09:15:00Z',
  item_count: null,
  folder_count: null,
  direct_request_count: null,
  direct_folder_count: null,
  method: 'POST',
  url: 'https://api.stripe.com/v1/charges',
}

const meta: Meta<typeof InfoPanel> = {
  title: 'ui/InfoPanel',
  component: InfoPanel,
  parameters: {
    layout: 'fullscreen',
    // InfoPanel renders via createPortal to document.body using position:fixed.
    // In the Docs page, Canvas blocks are rendered inline (same DOM), so the
    // fixed backdrop would escape the canvas container and overlay all docs
    // content below it. inline:false forces each Canvas block into its own
    // sandboxed iframe, containing the fixed overlay within that iframe.
    docs: {
      story: { inline: false, height: '400px' },
    },
    // Default mock: never resolves so we always see "Loading…" unless overridden.
    tauriMock: {
      get_item_info: () => new Promise(() => {}),
    },
  },
  args: {
    isOpen: true,
    path: '/Users/dev/projects/payments-api.crx',
    type: 'folder',
    onClose: fn(),
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the panel is visible',
    },
    type: {
      control: 'select',
      options: ['folder', 'request'],
      description: 'Controls the panel title (Folder Info vs Request Info)',
    },
    path: {
      control: 'text',
      description: 'Filesystem path passed to get_item_info',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Loading — mock never resolves so the "Loading…" placeholder stays visible.
 * Demonstrates the intermediate state between isOpen=true and data arrival.
 */
export const Loading: Story = {}

/**
 * FolderInfo — mock resolves immediately with a folder ItemInfo fixture.
 * Displays path, size, timestamps, subfolder count, and total request count.
 * The play function asserts the Path row is visible in the portal.
 */
export const FolderInfo: Story = {
  args: {
    type: 'folder',
  },

  parameters: {
    tauriMock: {
      get_item_info: () => FOLDER_INFO,
    },
  },

  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(await body.findByText('Path')).toBeInTheDocument()
    await expect(body.getByText('/Users/dev/projects/payments-api.crx')).toBeInTheDocument()
    await expect(body.getByText('8.0 KB')).toBeInTheDocument()
  },
}

/**
 * RequestInfo — mock resolves with a request ItemInfo fixture.
 * Shows method and URL fields in addition to path and timestamps.
 */
export const RequestInfo: Story = {
  args: {
    path: '/Users/dev/projects/payments-api.crx#charge-card',
    type: 'request',
  },
  parameters: {
    tauriMock: {
      get_item_info: () => REQUEST_INFO,
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(await body.findByText('Method')).toBeInTheDocument()
    await expect(body.getByText('POST')).toBeInTheDocument()
    await expect(body.getByText('https://api.stripe.com/v1/charges')).toBeInTheDocument()
  },
}

/**
 * ErrorState — mock returns an error result string.
 * InfoPanel renders the error message in place of the info table.
 */
export const ErrorState: Story = {
  parameters: {
    tauriMock: {
      // Throwing a string causes the binding wrapper to produce { status: "error", error: "..." }
      get_item_info: () => {
        throw 'File not found: path does not exist on disk'
      },
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(
      await body.findByText('File not found: path does not exist on disk')
    ).toBeInTheDocument()
  },
}

/**
 * Closed — isOpen=false; the component returns null and nothing renders.
 */
export const Closed: Story = {
  args: { isOpen: false },
}
