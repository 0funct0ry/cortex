/**
 * UrlPreviewBar stories.
 *
 * UrlPreviewBar reads `requestStates[requestId]` and `resolvedVariables[requestId]`
 * from `requestStore`. It returns `null` when there is no URL, so every story that
 * should render a visible bar must pre-seed the store via `beforeEach`.
 *
 * No context decorator is required — the component does not use TabsContext.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import UrlPreviewBar from '@/components/composer/UrlPreviewBar'
import { useRequestStore, resetRequestStore } from '@/stores/requestStore'
import type { ResolvedVariable } from '@/bindings'
import type { RequestData } from '@/stores/requestStore'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORY_REQUEST_ID = 'story-urlpreviewbar-req-001'

const BASE_REQUEST_STATE: RequestData = {
  name: 'Story Request',
  url: '',
  method: 'GET',
  params: [],
  headers: [],
  body: {
    type: 'none',
    json: '',
    rawText: '',
    rawSubtype: 'text',
    formFields: [],
    urlEncodedFields: [],
    filePath: null,
    fileFilter: '',
  },
  auth: { type: 'none', config: {} },
  scripts: { pre: '', post: '' },
  tests: '',
  settings: { timeout: '', redirectBehavior: 'default' },
  tags: [],
  activeComposerTab: 'params',
  inFlight: false,
  requestId: null,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeResolved(value: string, secret = false): ResolvedVariable {
  return { value, scope: 'environment', secret }
}

function seedStore(
  overrides: Partial<RequestData>,
  resolvedVariables: Record<string, ResolvedVariable> = {}
) {
  resetRequestStore()
  useRequestStore.setState({
    requestStates: {
      [STORY_REQUEST_ID]: { ...BASE_REQUEST_STATE, ...overrides },
    },
    resolvedVariables: {
      [STORY_REQUEST_ID]: resolvedVariables,
    },
  })
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof UrlPreviewBar> = {
  title: 'composer/UrlPreviewBar',
  component: UrlPreviewBar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    requestId: STORY_REQUEST_ID,
  },
  argTypes: {
    requestId: {
      control: { type: 'text' },
      description: 'The request ID used to look up state in `requestStore`.',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * WithUrl — a plain URL with no variables and no query params.
 * The Preview label, the URL in monospace, and the copy button are all visible.
 */
export const WithUrl: Story = {
  beforeEach: () => {
    seedStore({ url: 'https://api.example.com/users/123' })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Preview')).toBeInTheDocument()
    await expect(canvas.getByText(/api\.example\.com/)).toBeInTheDocument()
  },
}

/**
 * WithQueryParams — two enabled query parameters are appended to the base URL.
 * UrlPreviewBar serialises the params into `?key=value&key2=value2` and
 * percent-encodes special characters in keys and values.
 */
export const WithQueryParams: Story = {
  beforeEach: () => {
    seedStore({
      url: 'https://api.example.com/search',
      params: [
        { key: 'q', value: 'hello world', enabled: true, is_valueless: false },
        { key: 'limit', value: '20', enabled: true, is_valueless: false },
      ],
    })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Preview')).toBeInTheDocument()
  },
}

/**
 * WithVariables — the URL contains `{{baseUrl}}` and `{{userId}}` tokens.
 * Both are seeded as resolved in the store so their values are substituted
 * inline. The display URL shows plain text (no chips) because the resolved
 * value replaced the template syntax.
 *
 * Note: The preview bar renders the *resolved* URL with values substituted.
 * Variable chips are shown only for tokens that remain unresolved after
 * substitution.
 */
export const WithVariables: Story = {
  beforeEach: () => {
    seedStore(
      { url: 'https://{{baseUrl}}/users/{{userId}}' },
      {
        baseUrl: makeResolved('api.example.com'),
        userId: makeResolved('42'),
      }
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Preview')).toBeInTheDocument()
  },
}

/**
 * WithUnresolvedVariables — `{{region}}` is not in the resolved variables map,
 * so it remains as a `{{region}}` chip in the preview. This is how the bar
 * signals to the user that a variable is missing from the active environment.
 */
export const WithUnresolvedVariables: Story = {
  beforeEach: () => {
    seedStore(
      { url: 'https://{{region}}.api.example.com/items' },
      {} // no resolved variables — chip stays
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Preview')).toBeInTheDocument()
    // The unresolved token stays in the URL and is rendered as a chip
    await expect(canvas.getByText(/\{\{region\}\}/)).toBeInTheDocument()
  },
}

/**
 * WithSecrets — the `{{apiKey}}` variable is resolved but marked `secret: true`.
 * The display URL shows `key=••••••••` in place of the real value and an eye-off
 * icon appears at the right edge of the bar with a tooltip explanation.
 * The copy button copies the **unmasked** URL.
 *
 * Note: UrlPreviewBar builds the query string from `tabState.params`, not from
 * inline `?…` syntax in the URL string. The secret param must therefore be in
 * the `params` array so it is picked up by `enabledParams` and masked correctly.
 */
export const WithSecrets: Story = {
  beforeEach: () => {
    seedStore(
      {
        url: 'https://api.example.com/data',
        params: [{ key: 'key', value: '{{apiKey}}', enabled: true, is_valueless: false }],
      },
      {
        apiKey: makeResolved('sk-super-secret-token-abc123', true),
      }
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Preview')).toBeInTheDocument()
    // The masked value should appear in the URL preview
    await expect(canvas.getByText(/••••••••/)).toBeInTheDocument()
  },
}

/**
 * LongUrl — a very long URL that overflows the container width.
 * The bar clips the overflow with `overflow-hidden whitespace-nowrap` so the
 * layout stays at a fixed single-line height. The user can still copy the
 * full URL via the copy button.
 */
export const LongUrl: Story = {
  beforeEach: () => {
    seedStore({
      url: 'https://api.example.com/v3/organizations/acme-corporation/workspaces/production/datasets/customer-profiles/records/search',
      params: [
        {
          key: 'filter',
          value: 'status:active AND country:US AND tier:enterprise',
          enabled: true,
          is_valueless: false,
        },
        {
          key: 'fields',
          value: 'id,name,email,phone,address,subscription,created_at,updated_at',
          enabled: true,
          is_valueless: false,
        },
        { key: 'sort', value: 'created_at:desc', enabled: true, is_valueless: false },
        { key: 'page', value: '1', enabled: true, is_valueless: false },
        { key: 'per_page', value: '50', enabled: true, is_valueless: false },
      ],
    })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Preview')).toBeInTheDocument()
  },
}
