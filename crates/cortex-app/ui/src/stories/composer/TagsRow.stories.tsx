/**
 * TagsRow stories.
 *
 * TagsRow is a store-seeded component — it reads `requestStates[requestId].tags`
 * from `requestStore` and `collections[collectionPath].manifest.tag_registry`
 * from `collectionStore`. Every story pre-seeds both stores via `beforeEach`.
 *
 * No context decorator is required — the component uses neither TabsContext
 * nor any Tauri IPC command that needs mocking for basic rendering.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { TagsRow } from '@/components/composer/TagsRow'
import { useRequestStore, resetRequestStore } from '@/stores/requestStore'
import { useCollectionStore, resetCollectionStore } from '@/stores/collectionStore'
import type { RequestData } from '@/stores/requestStore'
import type { TagDefinition, Collection } from '@/bindings'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORY_REQUEST_ID = 'story-tagsrow-req-001'
const STORY_COLLECTION_PATH = 'story-collection'

const BASE_REQUEST_STATE: RequestData = {
  name: 'Story Request',
  url: 'https://api.example.com/users',
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

const SAMPLE_TAG_DEFS: TagDefinition[] = [
  { name: 'auth', color: 'blue' },
  { name: 'payments', color: 'green' },
  { name: 'deprecated', color: 'red' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function seedRequestStore(tags: string[]) {
  resetRequestStore()
  useRequestStore.setState({
    requestStates: {
      [STORY_REQUEST_ID]: { ...BASE_REQUEST_STATE, tags },
    },
  })
}

function seedCollectionStore(tagDefs: TagDefinition[]) {
  resetCollectionStore()
  useCollectionStore.setState({
    collections: {
      [STORY_COLLECTION_PATH]: {
        path: STORY_COLLECTION_PATH,
        is_git_repo: false,
        items: [],
        manifest: {
          version: '1',
          name: 'Story Collection',
          tag_registry: tagDefs,
        },
      } as Collection,
    },
  })
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof TagsRow> = {
  title: 'composer/TagsRow',
  component: TagsRow,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    requestId: STORY_REQUEST_ID,
    collectionPath: STORY_COLLECTION_PATH,
  },
  argTypes: {
    requestId: {
      control: { type: 'text' },
      description:
        'The request ID used to look up `requestStates[requestId].tags` in `requestStore`.',
    },
    collectionPath: {
      control: { type: 'text' },
      description: 'The collection path used to look up the tag registry in `collectionStore`.',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * NoTags — the initial empty state.
 *
 * No tags are applied to the request. The row renders a single "＋ Add tag"
 * button. This is the default state for a freshly created request.
 */
export const NoTags: Story = {
  beforeEach: () => {
    seedRequestStore([])
    seedCollectionStore(SAMPLE_TAG_DEFS)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('＋ Add tag')).toBeInTheDocument()
  },
}

/**
 * WithTags — two tags applied with different palette colors.
 *
 * The `auth` tag (blue) and `payments` tag (green) are both applied. Each
 * renders as a chip with a colored dot on the left and a ×-remove button on
 * the right. A "＋" button appears after the last chip to add more tags.
 */
export const WithTags: Story = {
  beforeEach: () => {
    seedRequestStore(['auth', 'payments'])
    seedCollectionStore(SAMPLE_TAG_DEFS)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('auth')).toBeInTheDocument()
    await expect(canvas.getByText('payments')).toBeInTheDocument()
  },
}

/**
 * OpenTagPopover — the tag popover opens on "＋ Add tag" click.
 *
 * A `play()` function clicks the "＋ Add tag" button and verifies that the
 * tag search/create popover appears with its input field.
 */
export const OpenTagPopover: Story = {
  beforeEach: () => {
    seedRequestStore([])
    seedCollectionStore(SAMPLE_TAG_DEFS)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const addBtn = canvas.getByText('＋ Add tag')
    await userEvent.click(addBtn)
    // TagPopover renders an input with placeholder "Search or create tag…"
    const input = await canvas.findByPlaceholderText('Search or create tag…')
    await expect(input).toBeInTheDocument()
  },
}
