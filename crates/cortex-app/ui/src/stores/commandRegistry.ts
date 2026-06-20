import { create } from 'zustand'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CommandCategory =
  | 'Request'
  | 'Collection'
  | 'Navigation'
  | 'View'
  | 'Environment'
  | 'Workspace'
  | 'Scripts'

export type SubPickerType = 'switch-environment' | 'filter-tag' | 'run-collection' | 'switch-tab'

export type CommandContext = 'always' | 'request-tab' | 'collection-focused'

export interface Command {
  id: string
  name: string
  description?: string
  category: CommandCategory
  shortcut?: string
  context: CommandContext
  subPicker?: SubPickerType
  run?: () => void
  isScript?: boolean
}

// ─── Store ────────────────────────────────────────────────────────────────────

const RECENT_KEY = 'cortex.commands.recent'
const MAX_RECENT = 5

function loadRecentIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function saveRecentIds(ids: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(ids))
}

interface CommandRegistryState {
  commands: Command[]
  recentCommandIds: string[]
  register: (cmd: Command) => void
  unregister: (id: string) => void
  recordUsed: (id: string) => void
}

// Built-in commands — run() fns are set lazily via setCommandAction() after stores init.
// We keep the registry as pure data here; PanelShell or the modal injects actions.
const BUILTIN_COMMANDS: Omit<Command, 'run'>[] = [
  // ── Request ──────────────────────────────────────────────────────────────
  {
    id: 'request.send',
    name: 'Send Request',
    category: 'Request',
    shortcut: '⌘↵',
    context: 'request-tab',
  },
  {
    id: 'request.save',
    name: 'Save Request',
    category: 'Request',
    shortcut: '⌘S',
    context: 'request-tab',
  },
  {
    id: 'request.save-as',
    name: 'Save as New Request',
    category: 'Request',
    shortcut: '⌘⇧S',
    context: 'request-tab',
  },
  { id: 'request.clone', name: 'Clone Request', category: 'Request', context: 'request-tab' },
  {
    id: 'request.close-tab',
    name: 'Close Tab',
    category: 'Request',
    shortcut: '⌘W',
    context: 'request-tab',
  },
  {
    id: 'request.close-all-tabs',
    name: 'Close All Tabs',
    category: 'Request',
    shortcut: '⌘⇧W',
    context: 'request-tab',
  },
  {
    id: 'request.rename',
    name: 'Rename Request',
    category: 'Request',
    shortcut: 'F2',
    context: 'request-tab',
  },
  { id: 'request.add-header', name: 'Add Header', category: 'Request', context: 'request-tab' },
  { id: 'request.clear-body', name: 'Clear Body', category: 'Request', context: 'request-tab' },
  {
    id: 'request.generate-code',
    name: 'Generate Code',
    category: 'Request',
    context: 'request-tab',
  },
  {
    id: 'request.create-example',
    name: 'Create Example',
    category: 'Request',
    context: 'request-tab',
  },

  // ── Collection ───────────────────────────────────────────────────────────
  { id: 'collection.new', name: 'New Collection', category: 'Collection', context: 'always' },
  {
    id: 'collection.new-request',
    name: 'New Request',
    category: 'Collection',
    shortcut: '⌘B',
    context: 'always',
  },
  {
    id: 'collection.new-transient',
    name: 'New Transient Request',
    category: 'Collection',
    context: 'always',
  },
  {
    id: 'collection.new-folder',
    name: 'New Folder',
    category: 'Collection',
    context: 'collection-focused',
  },
  {
    id: 'collection.run',
    name: 'Run Collection →',
    category: 'Collection',
    context: 'collection-focused',
    subPicker: 'run-collection',
  },
  { id: 'collection.import', name: 'Import Collection', category: 'Collection', context: 'always' },
  {
    id: 'collection.import-folder',
    name: 'Import from Folder',
    category: 'Collection',
    context: 'always',
  },
  {
    id: 'collection.export',
    name: 'Export Collection',
    category: 'Collection',
    context: 'collection-focused',
  },

  // ── Navigation ───────────────────────────────────────────────────────────
  {
    id: 'nav.open-request',
    name: 'Open Request →',
    category: 'Navigation',
    shortcut: '⌘K',
    context: 'always',
  },
  {
    id: 'nav.switch-tab',
    name: 'Switch Tab →',
    category: 'Navigation',
    shortcut: '⌘⇧[ / ]',
    context: 'always',
    subPicker: 'switch-tab',
  },
  {
    id: 'nav.reveal-in-explorer',
    name: 'Reveal in Explorer',
    category: 'Navigation',
    context: 'request-tab',
  },
  { id: 'nav.go-settings', name: 'Go to Settings', category: 'Navigation', context: 'always' },
  {
    id: 'nav.go-keyboard-shortcuts',
    name: 'Go to Keyboard Shortcuts',
    category: 'Navigation',
    context: 'always',
  },

  // ── View ─────────────────────────────────────────────────────────────────
  {
    id: 'view.toggle-sidebar',
    name: 'Toggle Sidebar',
    category: 'View',
    shortcut: '⌘\\',
    context: 'always',
  },
  {
    id: 'view.toggle-layout',
    name: 'Toggle Layout (Horizontal ↔ Vertical)',
    category: 'View',
    context: 'always',
  },
  { id: 'view.zoom-in', name: 'Zoom In', category: 'View', shortcut: '⌘+', context: 'always' },
  { id: 'view.zoom-out', name: 'Zoom Out', category: 'View', shortcut: '⌘-', context: 'always' },
  {
    id: 'view.zoom-reset',
    name: 'Reset Zoom',
    category: 'View',
    shortcut: '⌘0',
    context: 'always',
  },
  {
    id: 'view.toggle-theme',
    name: 'Toggle Theme (Light / Dark / System)',
    category: 'View',
    context: 'always',
  },

  // ── Environment ──────────────────────────────────────────────────────────
  {
    id: 'env.switch',
    name: 'Switch Environment →',
    category: 'Environment',
    context: 'always',
    subPicker: 'switch-environment',
  },
  { id: 'env.new', name: 'New Environment', category: 'Environment', context: 'always' },
  {
    id: 'env.edit',
    name: 'Edit Environments',
    category: 'Environment',
    shortcut: '⌘E',
    context: 'always',
  },
  {
    id: 'env.duplicate',
    name: 'Duplicate Environment',
    category: 'Environment',
    context: 'always',
  },

  // ── Workspace ────────────────────────────────────────────────────────────
  { id: 'workspace.open', name: 'Open Workspace', category: 'Workspace', context: 'always' },
  { id: 'workspace.close', name: 'Close Workspace', category: 'Workspace', context: 'always' },
  {
    id: 'workspace.open-recent',
    name: 'Open Recent →',
    category: 'Workspace',
    context: 'always',
  },
]

export const useCommandRegistry = create<CommandRegistryState>((set, get) => ({
  commands: BUILTIN_COMMANDS.map((c) => ({ ...c })) as Command[],
  recentCommandIds: loadRecentIds(),

  register: (cmd) =>
    set((state) => ({
      commands: [...state.commands.filter((c) => c.id !== cmd.id), cmd],
    })),

  unregister: (id) =>
    set((state) => ({
      commands: state.commands.filter((c) => c.id !== id),
    })),

  recordUsed: (id) => {
    const existing = get().recentCommandIds.filter((r) => r !== id)
    const updated = [id, ...existing].slice(0, MAX_RECENT)
    saveRecentIds(updated)
    set({ recentCommandIds: updated })
  },
}))

export function resetCommandRegistry() {
  localStorage.removeItem(RECENT_KEY)
  useCommandRegistry.setState({ commands: BUILTIN_COMMANDS as Command[], recentCommandIds: [] })
}

// Helper: set the run() action for a built-in command after store/hook wiring.
// Call this from the component that owns the relevant action.
export function setCommandAction(id: string, run: () => void) {
  useCommandRegistry.setState((state) => ({
    commands: state.commands.map((c) => (c.id === id ? { ...c, run } : c)),
  }))
}
