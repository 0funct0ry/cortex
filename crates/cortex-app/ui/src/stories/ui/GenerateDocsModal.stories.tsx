import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import GenerateDocsModal from '@/components/ui/GenerateDocsModal'
import { useUIStore } from '@/stores/uiStore'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const HTML_OUTPUT = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Payments API</title></head>
<body>
  <h1>Payments API</h1>
  <section>
    <h2>POST /payments</h2>
    <p>Create a new payment intent.</p>
  </section>
</body>
</html>`

const MARKDOWN_OUTPUT = `# Payments API

## POST /payments

Create a new payment intent.

**Headers**

| Name | Value |
|------|-------|
| Content-Type | application/json |
`

// ─── Shared seed ─────────────────────────────────────────────────────────────

function seedModal() {
  useUIStore.setState({
    generateDocsModal: {
      isOpen: true,
      collectionPath: '/workspace/payments-api',
      collectionName: 'Payments API',
    },
  })
}

const meta: Meta<typeof GenerateDocsModal> = {
  title: 'ui/GenerateDocsModal',
  component: GenerateDocsModal,
  parameters: {
    layout: 'fullscreen',
    // Renders via createPortal to document.body
    docs: {
      story: { inline: false, height: '560px' },
    },
    tauriMock: {
      generate_docs_html: () => HTML_OUTPUT,
      generate_docs_markdown: () => MARKDOWN_OUTPUT,
      generate_docs_openapi_yaml: () => 'openapi: "3.1.0"\ninfo:\n  title: Payments API',
      generate_docs_openapi_json: () => '{"openapi":"3.1.0"}',
      save_docs: () => null,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Open — modal in its default state showing the HTML tab.
 *
 * Store dependencies mocked via beforeEach:
 *   - uiStore.generateDocsModal = { isOpen: true, collectionPath: '...', collectionName: 'Payments API' }
 * IPC mocked:
 *   - generate_docs_html → fixture HTML string
 */
export const Open: Story = {
  beforeEach: seedModal,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText(/generate documentation/i)).toBeInTheDocument()
  },
}

/**
 * HtmlTab — HTML output tab is active (default). Generated HTML preview is
 * displayed in a read-only CodeEditor; theme and options toggles are visible.
 */
export const HtmlTab: Story = {
  beforeEach: seedModal,
}

/**
 * MarkdownTab — clicking the Markdown tab switches to markdown-specific
 * options (heading offset, collapse examples) and generates Markdown output.
 */
export const MarkdownTab: Story = {
  beforeEach: seedModal,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const mdTab = await body.findByRole('button', { name: 'Markdown' })
    await userEvent.click(mdTab)
    // "Heading offset" is only rendered when the Markdown panel is active
    await expect(body.getByText(/heading offset/i)).toBeInTheDocument()
  },
}

/**
 * OtherFormatsTab — the "Other" tab exposes OpenAPI YAML, OpenAPI JSON,
 * and API Blueprint export options.
 */
export const OtherFormatsTab: Story = {
  name: 'Other Formats Tab',
  beforeEach: seedModal,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const otherTab = await body.findByRole('button', { name: 'Other Formats' })
    await userEvent.click(otherTab)
    // "OpenAPI YAML" radio is only rendered when the Other Formats panel is active
    await expect(body.getByText('OpenAPI YAML')).toBeInTheDocument()
  },
}

/**
 * Closed — modal returns null when isOpen=false.
 */
export const Closed: Story = {
  beforeEach: () => {
    useUIStore.setState({
      generateDocsModal: { isOpen: false, collectionPath: null, collectionName: null },
    })
  },
}
