import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import WelcomeScreen from '@/components/layout/WelcomeScreen'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import type { RecentWorkspace } from '@/bindings'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const FIXTURE_RECENT_WORKSPACES: RecentWorkspace[] = [
  { name: 'Acme API', path: '/home/user/acme-api' },
  { name: 'Payment Service', path: '/home/user/payment-service' },
  { name: 'Internal Tools', path: '/home/user/internal-tools' },
]

function seedStores(
  recentWorkspaces: RecentWorkspace[] = [],
  loadWorkspaceSpy = fn(),
  openWorkspaceSpy = fn()
) {
  useWorkspaceStore.setState((s) => ({
    ...s,
    recentWorkspaces,
    activeWorkspace: null,
    activeWorkspacePath: null,
    loadWorkspace: loadWorkspaceSpy,
    openWorkspace: openWorkspaceSpy,
  }))
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof WelcomeScreen> = {
  title: 'layout/WelcomeScreen',
  component: WelcomeScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '480px' },
    },
    tauriMock: {
      get_recent_workspaces: async () => [],
      open_workspace: async () => null,
      load_workspace: async () => null,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * NoRecentWorkspaces — the welcome screen with an empty recent-workspaces list.
 * Only the "Create workspace" and "Open workspace" buttons are shown; the
 * "Recent Workspaces" section is absent.
 */
export const NoRecentWorkspaces: Story = {
  name: 'Empty state: no recent workspaces',
  beforeEach: () => seedStores([]),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByRole('button', { name: /create workspace/i })).toBeInTheDocument()
    await expect(body.getByRole('button', { name: /open workspace/i })).toBeInTheDocument()
    await expect(body.queryByText(/recent workspaces/i)).not.toBeInTheDocument()
  },
}

/**
 * WithRecentWorkspaces — three recent workspaces are listed. Clicking a
 * workspace entry calls `loadWorkspace` with the correct path.
 */
export const WithRecentWorkspaces: Story = {
  name: 'Populated: recent workspaces list',
  beforeEach: () => {
    const loadWorkspaceSpy = fn()
    seedStores(FIXTURE_RECENT_WORKSPACES, loadWorkspaceSpy)
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText(/recent workspaces/i)).toBeInTheDocument()

    // All workspace names are rendered
    await expect(body.getByText('Acme API')).toBeInTheDocument()
    await expect(body.getByText('Payment Service')).toBeInTheDocument()
    await expect(body.getByText('Internal Tools')).toBeInTheDocument()

    // Clicking a workspace entry calls loadWorkspace
    const loadWorkspaceSpy = useWorkspaceStore.getState().loadWorkspace as ReturnType<typeof fn>
    await userEvent.click(body.getByText('Acme API'))
    await waitFor(() => expect(loadWorkspaceSpy).toHaveBeenCalledWith('/home/user/acme-api'), {
      timeout: 3000,
    })
  },
}
