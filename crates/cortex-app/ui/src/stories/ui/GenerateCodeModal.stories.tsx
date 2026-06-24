import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import GenerateCodeModal from '@/components/ui/GenerateCodeModal'
import { useUIStore } from '@/stores/uiStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const FIXTURE_REQUEST = {
  content: {
    version: '1',
    name: 'Create Payment',
    method: 'POST',
    url: 'https://api.example.com/v1/payments',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer {{token}}',
    },
    params: {},
    body: {
      type: 'Raw' as const,
      content: JSON.stringify({ amount: 100, currency: 'USD', customer_id: '{{customer_id}}' }),
    },
    auth: null,
    pre_request_script: null,
    post_response_script: null,
    follow_redirects: true,
    examples: [],
    tags: [],
  },
  error: null,
}

const RESOLVED_VARS = {
  token: {
    value: 'eyJhbGciOiJIUzI1NiJ9...',
    scope: 'environment' as const,
    secret: false,
    description: null,
  },
  customer_id: {
    value: 'cus_abc123',
    scope: 'environment' as const,
    secret: false,
    description: null,
  },
}

// ─── Shared store seed ────────────────────────────────────────────────────────

const LANG_KEY = 'cortex.code-gen.last-language'

function seedModal(lang = 'curl') {
  localStorage.setItem(LANG_KEY, lang)
  useWorkspaceStore.setState({ activeWorkspacePath: '/workspace' })
  useUIStore.setState({
    generateCodeModal: {
      isOpen: true,
      requestPath: '/workspace/payments-api/create-payment.yaml',
      requestName: 'Create Payment',
      collectionId: 'payments-api',
    },
  })
}

const meta: Meta<typeof GenerateCodeModal> = {
  title: 'ui/GenerateCodeModal',
  component: GenerateCodeModal,
  parameters: {
    layout: 'fullscreen',
    // Renders via createPortal to document.body
    docs: {
      story: { inline: false, height: '560px' },
    },
    tauriMock: {
      load_request: () => FIXTURE_REQUEST,
      get_resolved_variables: () => RESOLVED_VARS,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Open — modal in the default state (cURL target).
 * The play function verifies the modal heading is rendered.
 *
 * Store dependencies mocked via beforeEach:
 *   - uiStore.generateCodeModal = { isOpen: true, requestPath, requestName, collectionId }
 *   - workspaceStore.activeWorkspacePath = '/workspace'
 * IPC mocked:
 *   - load_request → fixture POST request with headers and JSON body
 *   - get_resolved_variables → { token, customer_id }
 */
export const Open: Story = {
  beforeEach: () => seedModal('curl'),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText(/generate code/i)).toBeInTheDocument()
  },
}

/**
 * CurlTarget — cURL code is the default language. The generated snippet shows
 * `curl -X POST` with the resolved URL, headers, and JSON body.
 */
export const CurlTarget: Story = {
  name: 'cURL Target',
  beforeEach: () => seedModal('curl'),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const select = await body.findByRole('combobox')
    await expect(select).toHaveValue('curl')
    await expect(select).toHaveDisplayValue('cURL')
    const editor = body.getByRole('textbox')
    await expect(editor).toHaveTextContent(/curl.*-X POST/i)
  },
}

/**
 * FetchTarget — pre-selects JavaScript (fetch) from the language dropdown
 * to show browser-compatible fetch code with async/await.
 */
export const FetchTarget: Story = {
  name: 'Fetch Target',
  beforeEach: () => seedModal('fetch'),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const select = await body.findByRole('combobox')
    await expect(select).toHaveValue('fetch')
    await expect(select).toHaveDisplayValue('JavaScript (fetch)')
    const editor = body.getByRole('textbox')
    await expect(editor).toHaveTextContent(/const response = await fetch.*/i)
  },
}

/**
 * PythonTarget — requests library snippet for Python users.
 */
export const PythonTarget: Story = {
  name: 'Python Target',
  beforeEach: () => seedModal('python'),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const select = await body.findByRole('combobox')
    await expect(select).toHaveValue('python')
    await expect(select).toHaveDisplayValue('Python (requests)')
    const editor = body.getByRole('textbox')
    await expect(editor).toHaveTextContent(/import requests/i)
  },
}

/**
 * GoTarget — net/http snippet for Go users.
 */
export const GoTarget: Story = {
  name: 'Go Target',
  beforeEach: () => seedModal('go'),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const select = await body.findByRole('combobox')
    await expect(select).toHaveValue('go')
    await expect(select).toHaveDisplayValue('Go (net/http)')
    const editor = body.getByRole('textbox')
    await expect(editor).toHaveTextContent(/package main/i)
  },
}

/**
 * RustTarget — reqwest library snippet for Rust users.
 */
export const RustTarget: Story = {
  name: 'Rust Target',
  beforeEach: () => seedModal('rust'),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const select = await body.findByRole('combobox')
    await expect(select).toHaveValue('rust')
    await expect(select).toHaveDisplayValue('Rust (reqwest)')
    const editor = body.getByRole('textbox')
    await expect(editor).toHaveTextContent(/use reqwest.*/i)
  },
}

/**
 * Closed — modal returns null when isOpen=false.
 */
export const Closed: Story = {
  beforeEach: () => {
    useUIStore.setState({
      generateCodeModal: {
        isOpen: false,
        requestPath: null,
        requestName: null,
        collectionId: null,
      },
    })
  },
}
