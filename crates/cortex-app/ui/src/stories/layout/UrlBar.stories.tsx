/**
 * UrlBar display-only stories.
 *
 * UrlBar is a Tier 3 orchestrator that reads from six Zustand stores and calls
 * Tauri IPC commands. These stories render it in a controlled, read-only state
 * by pre-seeding all required stores via `beforeEach` and registering no-op
 * tauriMock handlers for `send_request` and `cancel_request`.
 *
 * The tab is injected via localStorage so TabsProvider initialises with a known
 * activeTabId, which UrlBar uses to look up the request state in requestStore.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import UrlBar from '@/components/layout/UrlBar'
import { TabsProvider } from '@/contexts/TabsContext'
import { useRequestStore, resetRequestStore } from '@/stores/requestStore'
import { useWorkspaceStore, resetWorkspaceStore } from '@/stores/workspaceStore'
import type { RequestData } from '@/stores/requestStore'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORY_TAB_ID = 'story-urlbar-tab-001'

const STORY_TAB = {
  id: STORY_TAB_ID,
  type: 'request' as const,
  name: 'Story Request',
  method: 'GET',
  requestPath: null,
  collectionId: null,
  collectionPath: null,
  folderPath: null,
  exampleId: null,
  isDirty: false,
}

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

/** Seeds TabsProvider via localStorage and requestStore for the given URL/method. */
function seedTab(overrides: Partial<RequestData> = {}) {
  localStorage.setItem('cortex.tabs.list', JSON.stringify([STORY_TAB]))
  localStorage.setItem('cortex.tabs.activeId', STORY_TAB_ID)
  resetRequestStore()
  useRequestStore.setState({
    requestStates: {
      [STORY_TAB_ID]: { ...BASE_REQUEST_STATE, ...overrides },
    },
  })
  resetWorkspaceStore()
  useWorkspaceStore.setState({ activeWorkspacePath: '/mock/workspace' })
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof UrlBar> = {
  title: 'layout/UrlBar',
  component: UrlBar,
  parameters: {
    layout: 'fullscreen',
    // No-op IPC mocks so Send / Cancel never fire real network requests.
    tauriMock: {
      send_request: () => ({
        status_code: 200,
        status_text: 'OK',
        headers: {},
        response_body: '',
        duration_ms: 0,
        error: null,
        redirect_chain: null,
      }),
      cancel_request: () => undefined,
    },
    docs: {
      description: {
        component:
          'The request URL bar — combines a MethodSelector dropdown, a UrlInput with live variable highlighting, icon action buttons (Save, Generate code, Copy URL), and a SendButton. These stories render the bar in display-only mode by seeding store state; no real HTTP requests are made.',
      },
    },
  },
  decorators: [
    (Story) => (
      // TabsProvider reads the active tab from localStorage, which beforeEach
      // pre-seeds with STORY_TAB_ID so UrlBar finds a valid tabState.
      <TabsProvider>
        <div className="flex flex-col bg-bg-panel" style={{ width: '100%' }}>
          <Story />
        </div>
      </TabsProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * EmptyUrl — the URL bar with no URL entered.
 * Shows the method selector (GET), the empty UrlInput placeholder, and the Send button.
 */
export const EmptyUrl: Story = {
  beforeEach: () => {
    seedTab({ url: '', method: 'GET' })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('GET')).toBeInTheDocument()
  },
}

/**
 * WithUrl — a fully-formed URL with no variables.
 * Shows the method selector, the URL text, and the active Send button.
 */
export const WithUrl: Story = {
  beforeEach: () => {
    seedTab({ url: 'https://api.example.com/users', method: 'GET' })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('GET')).toBeInTheDocument()
  },
}

/**
 * VariableSegments — a URL containing `{{variable}}` placeholders.
 * UrlInput renders an overlay with coloured spans for each variable token
 * (resolved variables in one colour, unresolved in another).
 */
export const VariableSegments: Story = {
  beforeEach: () => {
    seedTab({
      url: 'https://{{baseUrl}}/users/{{userId}}/posts',
      method: 'POST',
    })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('POST')).toBeInTheDocument()
  },
}

/**
 * InFlight — the URL bar while a request is in progress.
 * The Send button switches to a red Cancel button.
 */
export const InFlight: Story = {
  beforeEach: () => {
    seedTab({
      url: 'https://api.example.com/slow-endpoint',
      method: 'GET',
      inFlight: true,
      requestId: 'mock-request-id-001',
    })
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Cancel')).toBeInTheDocument()
  },
}
