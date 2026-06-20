/**
 * SB.02 reference story — documents the store-seeding and Tauri mock override patterns.
 *
 * Pattern rules:
 *  1. preview.beforeEach resets all stores before each story. Story-level beforeEach
 *     runs after that, so use it to seed the state you need.
 *  2. Seed store state via `beforeEach` using `useXxxStore.setState(...)`.
 *  3. Override specific Tauri IPC commands per-story via `parameters.tauriMock`.
 *
 * CRITICAL — tauriMock values must be RAW inner values, not wrapped Results:
 *   The specta-generated bindings already wrap invoke results:
 *     return { status: "ok", data: await TAURI_INVOKE(cmd, args) }
 *   So the mock's return value becomes `data`. Return FIXTURE directly, never
 *   { status: 'ok', data: FIXTURE } — that would double-wrap and crash.
 *
 * The default no-op (no override registered) throws a plain string so the binding
 * returns { status: "error" } and stores leave their existing seeded state intact.
 */
import type { Meta, StoryObj } from '@storybook/react'
import SidebarTree from '@/components/layout/SidebarTree'
import { TabsProvider } from '@/contexts/TabsContext'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useCollectionStore } from '@/stores/collectionStore'
import type { WorkspaceResponse, Collection } from '@/bindings'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const FIXTURE_WORKSPACE: WorkspaceResponse = {
  name: 'Demo Workspace',
  collections: [{ path: '/demo/workspace/petstore.crx', name: 'Petstore API', error: null }],
  environments: [],
  env_files: [],
  variables: null,
  active_environment: null,
  decrypt_failures: {},
}

const FIXTURE_COLLECTION: Collection = {
  path: '/demo/workspace/petstore.crx',
  is_git_repo: false,
  manifest: {
    version: '1',
    name: 'Petstore API',
    description: 'Sample Petstore collection',
    headers: null,
    variables: [],
    auth: null,
    scripts: null,
    tests: null,
    presets: [],
    proxy: { enabled: false, url: '', bypass_list: null, username: null, password: null },
    client_certificates: [],
    protobuf: { proto_files: [], import_paths: [] },
    tag_registry: [],
  },
  items: [
    {
      type: 'Request',
      data: {
        name: 'List pets',
        path: '/demo/workspace/petstore.crx/GET_pets.yaml',
        relative_path: 'GET_pets.yaml',
        content: null,
        error: null,
      },
    },
    {
      type: 'Request',
      data: {
        name: 'Create pet',
        path: '/demo/workspace/petstore.crx/POST_pets.yaml',
        relative_path: 'POST_pets.yaml',
        content: null,
        error: null,
      },
    },
  ],
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof SidebarTree> = {
  title: 'layout/SidebarTree',
  component: SidebarTree,
  // TabsProvider must wrap the tree — it manages open request tabs and calls
  // Tauri IPC internally, which is silenced by the global mockIPC in preview.tsx.
  decorators: [
    (Story) => (
      <TabsProvider>
        <div style={{ width: 260, height: 600, display: 'flex', flexDirection: 'column' }}>
          <Story />
        </div>
      </TabsProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Default — no workspace loaded.
 * The global store reset puts workspaceStore.activeWorkspace back to null so
 * the tree shows the "Open workspace" empty state.
 */
export const Default: Story = {}

/**
 * WithCollections — workspace and one collection pre-seeded via beforeEach.
 *
 * Pattern: use `beforeEach` to call `useXxxStore.setState(...)` after the
 * global reset has already run. This populates only what this story needs.
 */
export const WithCollections: Story = {
  beforeEach: () => {
    useWorkspaceStore.setState({
      activeWorkspace: FIXTURE_WORKSPACE,
      activeWorkspacePath: '/demo/workspace',
    })
    useCollectionStore.setState({
      collections: { '/demo/workspace/petstore.crx': FIXTURE_COLLECTION },
      expansionState: { '/demo/workspace/petstore.crx': true },
    })
  },
}

/**
 * WithTauriMockOverride — demonstrates how to override a specific Tauri command
 * for a story via `parameters.tauriMock`.
 *
 * The `withTauriMock` decorator in preview.tsx reads this map and routes
 * matching commands to the provided handler instead of the default null stub.
 */
export const WithTauriMockOverride: Story = {
  beforeEach: () => {
    useWorkspaceStore.setState({
      activeWorkspace: FIXTURE_WORKSPACE,
      activeWorkspacePath: '/demo/workspace',
    })
    useCollectionStore.setState({
      collections: { '/demo/workspace/petstore.crx': FIXTURE_COLLECTION },
      expansionState: { '/demo/workspace/petstore.crx': true },
    })
  },
  parameters: {
    // Return the RAW inner value — the binding wraps it in { status:"ok", data:... }
    // automatically. Do NOT return { status:'ok', data:X } here or it double-wraps.
    tauriMock: {
      load_collection: () => FIXTURE_COLLECTION,
    },
  },
}
