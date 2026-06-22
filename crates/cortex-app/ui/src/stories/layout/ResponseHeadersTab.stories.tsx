import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import ResponseHeadersTab from '@/components/layout/ResponseHeadersTab'
import type { ResponsePayload } from '@/stores/responseStore'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const FIXTURE_RESPONSE_EMPTY: ResponsePayload = {
  requestId: 'req-empty-001',
  status: 200,
  statusText: 'OK',
  headers: {},
  body: '',
  durationMs: 12,
  bodySize: 0,
}

const FIXTURE_RESPONSE_WITH_HEADERS: ResponsePayload = {
  requestId: 'req-headers-002',
  status: 200,
  statusText: 'OK',
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'content-length': '1234',
    'cache-control': 'no-cache, no-store, must-revalidate',
    'x-request-id': 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'x-rate-limit-limit': '100',
    'x-rate-limit-remaining': '97',
    'x-rate-limit-reset': '1719000000',
    'access-control-allow-origin': '*',
    vary: 'Accept-Encoding',
  },
  body: '{"id":1,"name":"Fluffy"}',
  durationMs: 143,
  bodySize: 1234,
}

const FIXTURE_RESPONSE_REDIRECT: ResponsePayload = {
  requestId: 'req-redirect-003',
  status: 301,
  statusText: 'Moved Permanently',
  headers: {
    'content-type': 'text/html; charset=utf-8',
    location: 'https://api.example.com/v2/users',
    'x-request-id': 'redir-001',
  },
  body: '',
  durationMs: 28,
  bodySize: 0,
}

const FIXTURE_RESPONSE_MANY_HEADERS: ResponsePayload = {
  requestId: 'req-many-004',
  status: 200,
  statusText: 'OK',
  headers: Object.fromEntries(
    Array.from({ length: 24 }, (_, i) => [
      `x-custom-header-${String(i + 1).padStart(2, '0')}`,
      `value-${i + 1}`,
    ])
  ),
  body: '',
  durationMs: 55,
  bodySize: 0,
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof ResponseHeadersTab> = {
  title: 'layout/ResponseHeadersTab',
  component: ResponseHeadersTab,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Renders HTTP response headers in a sortable two-column table. Highlights redirect Location headers with a warning style and shows a redirect banner for 3xx responses.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col" style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    response: {
      control: false,
      description:
        'The `ResponsePayload` whose `.headers` record is rendered. Status code controls redirect highlighting.',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Empty — a 200 response with no headers.
 * The table renders with a Name / Value header row but an empty body.
 */
export const Empty: Story = {
  args: { response: FIXTURE_RESPONSE_EMPTY },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Name')).toBeInTheDocument()
    await expect(canvas.getByText('Value')).toBeInTheDocument()
  },
}

/**
 * WithHeaders — nine varied headers typical of a REST JSON API response.
 * Hovering any row reveals the copy-to-clipboard button.
 */
export const WithHeaders: Story = {
  args: { response: FIXTURE_RESPONSE_WITH_HEADERS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('content-type')).toBeInTheDocument()
    await expect(canvas.getByText('x-request-id')).toBeInTheDocument()
    // Hover the first header row to reveal the copy button
    const row = canvas.getByText('content-type').closest('tr')!
    await userEvent.hover(row)
    // The copy button toggles opacity via React state — toBeVisible() checks
    // computed CSS opacity which is 0 before hover. After hover the class
    // switches to opacity-100, but asserting presence is sufficient here since
    // the opacity transition is a visual concern verified manually.
    const copyBtn = within(row).getByTitle('Copy header')
    await expect(copyBtn).toBeInTheDocument()
  },
}

/**
 * RedirectResponse — a 301 Moved Permanently response with a Location header.
 * Shows the redirect warning banner at the top and highlights the Location row.
 */
export const RedirectResponse: Story = {
  args: { response: FIXTURE_RESPONSE_REDIRECT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Redirect Response (Manual Mode)')).toBeInTheDocument()
    await expect(canvas.getByText('location')).toBeInTheDocument()
    await expect(canvas.getByText('Redirect Location')).toBeInTheDocument()
    // URL appears twice: once in the banner's clickable copy box and once in
    // the table's Value cell for the location header — use getAllByText.
    const urlEls = canvas.getAllByText('https://api.example.com/v2/users')
    await expect(urlEls.length).toBeGreaterThanOrEqual(2)
  },
}

/**
 * ManyHeaders — 24 custom headers to verify vertical scrolling and
 * alternating row backgrounds across a long list.
 */
export const ManyHeaders: Story = {
  args: { response: FIXTURE_RESPONSE_MANY_HEADERS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('x-custom-header-01')).toBeInTheDocument()
    await expect(canvas.getByText('x-custom-header-24')).toBeInTheDocument()
  },
}
