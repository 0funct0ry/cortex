import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import MethodBadge from '@/components/ui/MethodBadge'

const ALL_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'WS',
  'SSE',
  'GRPC',
  'GraphQL',
  'TRACE',
]

const meta: Meta<typeof MethodBadge> = {
  title: 'ui/MethodBadge',
  component: MethodBadge,
  parameters: {
    layout: 'centered',
  },
  args: {
    method: 'GET',
  },
  argTypes: {
    method: {
      control: 'select',
      options: ALL_METHODS,
      description: 'HTTP method to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default state — renders a GET badge. Use the Controls panel to switch
 * between all supported HTTP methods.
 */
export const Default: Story = {}

/**
 * GET method badge — bright green text with translucent background.
 */
export const Get: Story = { args: { method: 'GET' } }

/**
 * POST method badge.
 */
export const Post: Story = { args: { method: 'POST' } }

/**
 * PUT method badge.
 */
export const Put: Story = { args: { method: 'PUT' } }

/**
 * PATCH method badge.
 */
export const Patch: Story = { args: { method: 'PATCH' } }

/**
 * DELETE method badge — rendered in red to signal a destructive operation.
 */
export const Delete: Story = { args: { method: 'DELETE' } }

/**
 * HEAD method badge.
 */
export const Head: Story = { args: { method: 'HEAD' } }

/**
 * OPTIONS method badge.
 */
export const Options: Story = { args: { method: 'OPTIONS' } }

/**
 * WS (WebSocket) method badge.
 */
export const Ws: Story = { args: { method: 'WS' } }

/**
 * SSE (Server-Sent Events) method badge.
 */
export const Sse: Story = { args: { method: 'SSE' } }

/**
 * gRPC method badge.
 */
export const Grpc: Story = { args: { method: 'GRPC' } }

/**
 * GraphQL method badge.
 */
export const GraphQl: Story = { args: { method: 'GraphQL' } }

/**
 * TRACE method badge.
 */
export const Trace: Story = { args: { method: 'TRACE' } }

/**
 * AllMethods — all 12 colour variants side-by-side in a single canvas.
 * Useful for a quick visual audit across themes.
 */
export const AllMethods: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center justify-center p-4">
      {ALL_METHODS.map((method) => (
        <MethodBadge key={method} method={method} />
      ))}
    </div>
  ),
}
