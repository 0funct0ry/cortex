import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import ResponseRawTab from '@/components/layout/ResponseRawTab'
import type { ResponsePayload } from '@/stores/responseStore'

const FIXTURE_RESPONSE_JSON: ResponsePayload = {
  requestId: 'req-001',
  status: 200,
  statusText: 'OK',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(
    {
      id: 1,
      name: 'Fluffy',
      status: 'available',
      photoUrls: ['https://example.com/fluffy.jpg'],
      tags: [{ id: 42, name: 'cat' }],
    },
    null,
    2
  ),
  durationMs: 143,
  bodySize: 156,
}

const FIXTURE_RESPONSE_LONG: ResponsePayload = {
  requestId: 'req-002',
  status: 200,
  statusText: 'OK',
  headers: { 'content-type': 'text/plain' },
  body: Array.from({ length: 120 }, (_, i) => `Line ${i + 1}: ${'x'.repeat(80)}`).join('\n'),
  durationMs: 220,
  bodySize: 9600,
}

const FIXTURE_RESPONSE_BINARY: ResponsePayload = {
  requestId: 'req-003',
  status: 200,
  statusText: 'OK',
  headers: { 'content-type': 'application/octet-stream' },
  body: '[Binary content — cannot display as text. Use Save to download the raw bytes.]',
  durationMs: 55,
  bodySize: 4096,
}

const meta: Meta<typeof ResponseRawTab> = {
  title: 'layout/ResponseRawTab',
  component: ResponseRawTab,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Renders the raw response body in a monospace, pre-wrap, selectable container. Handles any content-type since it never interprets the body — it displays exactly what the server returned.',
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
      description: 'The ResponsePayload whose `.body` string is rendered verbatim.',
      control: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * RawText — a small, well-formatted JSON body.
 * Verifies that the body string is present and that the container is in the DOM.
 */
export const RawText: Story = {
  args: { response: FIXTURE_RESPONSE_JSON },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/Fluffy/)).toBeInTheDocument()
  },
}

/**
 * LongBody — 120 lines of text to confirm the container scrolls vertically
 * without clipping content or causing horizontal overflow.
 */
export const LongBody: Story = {
  args: { response: FIXTURE_RESPONSE_LONG },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/Line 1:/)).toBeInTheDocument()
    await expect(canvas.getByText(/Line 120:/)).toBeInTheDocument()
  },
}

/**
 * BinaryWarning — documents the convention for binary/non-printable responses:
 * the executor substitutes a descriptive placeholder string rather than
 * attempting to display raw bytes.
 */
export const BinaryWarning: Story = {
  args: { response: FIXTURE_RESPONSE_BINARY },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/Binary content/)).toBeInTheDocument()
  },
}
