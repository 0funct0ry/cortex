import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import ResponseMetaBar from '@/components/layout/ResponseMetaBar'
import type { ResponsePayload } from '@/stores/responseStore'
import { resetResponseStore } from '@/stores/responseStore'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const BASE: Omit<ResponsePayload, 'status' | 'statusText' | 'durationMs' | 'bodySize'> = {
  requestId: 'req-story',
  headers: { 'content-type': 'application/json' },
  body: '{"ok":true}',
}

const FIXTURE_200: ResponsePayload = {
  ...BASE,
  status: 200,
  statusText: 'OK',
  durationMs: 143,
  bodySize: 2458,
}

const FIXTURE_404: ResponsePayload = {
  ...BASE,
  status: 404,
  statusText: 'Not Found',
  durationMs: 88,
  bodySize: 42,
}

const FIXTURE_500: ResponsePayload = {
  ...BASE,
  status: 500,
  statusText: 'Internal Server Error',
  durationMs: 1340,
  bodySize: 320,
}

const FIXTURE_REDIRECT: ResponsePayload = {
  ...BASE,
  status: 200,
  statusText: 'OK',
  durationMs: 310,
  bodySize: 1800,
  redirectChain: [
    { method: 'GET', url: 'http://example.com/old-path', status_code: 301 },
    { method: 'GET', url: 'http://example.com/new-path', status_code: 302 },
  ],
}

const FIXTURE_MULTIPART: ResponsePayload = {
  requestId: 'req-multi',
  status: 200,
  statusText: 'OK',
  durationMs: 204,
  bodySize: 5120,
  // Minimal multipart/mixed body — just needs the content-type header to trigger the checkbox
  headers: {
    'content-type': 'multipart/mixed; boundary="--boundary--"',
  },
  body: [
    '----boundary--',
    'Content-Type: application/json',
    '',
    '{"part":1}',
    '----boundary--',
    'Content-Type: text/plain',
    '',
    'hello',
    '----boundary----',
  ].join('\r\n'),
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof ResponseMetaBar> = {
  title: 'layout/ResponseMetaBar',
  component: ResponseMetaBar,
  parameters: {
    layout: 'fullscreen',
    // commands.saveFile opens a native save dialog. We mock it to a no-op so
    // the story doesn't throw when the Save button is clicked.
    tauriMock: {
      save_file: () => null,
    },
    docs: {
      description: {
        component:
          'Thin status strip rendered above every response panel. Displays HTTP status badge, duration, body size, redirect chain popover, and (when applicable) the Parse Multipart checkbox. Shows skeleton pulses while a request is in-flight.',
      },
    },
  },
  decorators: [
    (Story) => (
      // Replicate the actual hosting context: full-width, 36px tall strip.
      <div className="flex flex-col bg-bg-base" style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    response: {
      description: 'The completed ResponsePayload, or null when no request has been sent yet.',
      control: false,
    },
    inFlight: {
      control: 'boolean',
      description: 'True while the HTTP request is executing — renders skeleton placeholders.',
    },
    requestId: {
      control: 'text',
      description: 'Used to key multipart-enabled state in the response store.',
    },
  },
  beforeEach: () => {
    resetResponseStore()
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * NoResponse — initial state before any request has been sent.
 * The bar shows a muted "RESPONSE" placeholder.
 */
export const NoResponse: Story = {
  args: {
    response: null,
    inFlight: false,
    requestId: 'req-story',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Response')).toBeInTheDocument()
  },
}

/**
 * Loading — in-flight state while the HTTP request is executing.
 * Three skeleton pill animations replace the status/duration/size slots.
 */
export const Loading: Story = {
  args: {
    response: null,
    inFlight: true,
    requestId: 'req-story',
  },
}

/**
 * Status200 — successful 200 OK response.
 * Green badge, sub-200 ms duration (green), and body size in KB.
 */
export const Status200: Story = {
  args: {
    response: FIXTURE_200,
    inFlight: false,
    requestId: 'req-story',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('200')).toBeInTheDocument()
    await expect(canvas.getByText('OK')).toBeInTheDocument()
    await expect(canvas.getByText('143 ms')).toBeInTheDocument()
    await expect(canvas.getByText('2.4 KB')).toBeInTheDocument()
  },
}

/**
 * Status404 — client error. Red badge and error-coloured duration.
 */
export const Status404: Story = {
  args: {
    response: FIXTURE_404,
    inFlight: false,
    requestId: 'req-story',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('404')).toBeInTheDocument()
    await expect(canvas.getByText('Not Found')).toBeInTheDocument()
  },
}

/**
 * Status500 — server error. Red badge, slow duration (also red).
 */
export const Status500: Story = {
  args: {
    response: FIXTURE_500,
    inFlight: false,
    requestId: 'req-story',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('500')).toBeInTheDocument()
    await expect(canvas.getByText('Internal Server Error')).toBeInTheDocument()
  },
}

/**
 * WithRedirectChain — the response followed 2 redirects before settling on 200.
 * The play function opens the redirect popover and asserts hop entries are visible.
 */
export const WithRedirectChain: Story = {
  args: {
    response: FIXTURE_REDIRECT,
    inFlight: false,
    requestId: 'req-story',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Click the "2 redirects → 200" pill to open the popover
    const redirectBtn = canvas.getByText(/redirect/i)
    await userEvent.click(redirectBtn)
    // Assert the redirect history heading appeared
    await expect(canvas.getByText('Redirect History')).toBeInTheDocument()
    // Assert both hop URLs are visible
    await expect(canvas.getByText(/old-path/)).toBeInTheDocument()
    await expect(canvas.getByText(/new-path/)).toBeInTheDocument()
  },
}

/**
 * MultipartResponse — content-type multipart/mixed triggers the Parse Multipart
 * checkbox. The play function verifies the checkbox is rendered and interactive.
 */
export const MultipartResponse: Story = {
  args: {
    response: FIXTURE_MULTIPART,
    inFlight: false,
    requestId: 'req-multi',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: /parse multipart/i })
    await expect(checkbox).toBeInTheDocument()
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
  },
}
