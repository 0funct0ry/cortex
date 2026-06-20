import type { Preview, Decorator } from '@storybook/react'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import { mockIPC } from '@tauri-apps/api/mocks'
import '../src/index.css'
import { resetRequestStore } from '../src/stores/requestStore'
import { resetWorkspaceStore } from '../src/stores/workspaceStore'
import { resetUIStore } from '../src/stores/uiStore'
import { resetCollectionStore } from '../src/stores/collectionStore'
import { resetEnvironmentStore } from '../src/stores/environmentStore'
import { resetResponseStore } from '../src/stores/responseStore'
import { resetCollectionEnvironmentStore } from '../src/stores/collectionEnvironmentStore'
import { resetCollectionViewStore } from '../src/stores/collectionViewStore'
import { resetCollectionRunnerStore } from '../src/stores/collectionRunnerStore'
import { resetToastStore } from '../src/stores/toastStore'
import { resetCommandRegistry } from '../src/stores/commandRegistry'

// Re-apply the IPC mock before each story, honouring per-story overrides.
// This runs as a decorator (during render) so it can access ctx.parameters.
//
// IMPORTANT — how Tauri bindings wrap IPC results:
//   Result-type commands (the majority) are generated as:
//     return { status: "ok", data: await TAURI_INVOKE(cmd, args) }
//   Their catch block re-throws Error instances but returns { status: "error" }
//   for any other thrown value.
//
// Consequence for mocks:
//   • The default no-op must THROW a non-Error string, not return null.
//     Returning null produces { status: "ok", data: null }, which makes stores
//     overwrite their seeded state with null and triggers infinite reload loops.
//     Throwing a string makes the binding return { status: "error" }, which
//     stores handle gracefully (log the error, leave existing state intact).
//
//   • Per-story overrides must return the RAW inner value — the value that
//     TAURI_INVOKE itself would resolve to — NOT a wrapped Result object.
//     The binding adds the { status: "ok", data: ... } wrapper automatically.
//     Example: to mock load_collection, return FIXTURE_COLLECTION directly,
//     not { status: 'ok', data: FIXTURE_COLLECTION }.
const withTauriMock: Decorator = (Story, ctx) => {
  const overrides = ctx.parameters.tauriMock as
    | Record<string, (args: unknown) => unknown>
    | undefined
  mockIPC((cmd, args) => {
    if (overrides?.[cmd]) return overrides[cmd](args)
    throw `[Storybook] No Tauri mock registered for command "${cmd}"`
  })
  return <Story {...ctx} />
}

const preview: Preview = {
  // Store resets run in preview.beforeEach, NOT in a decorator.
  //
  // Why: Storybook guarantees that global beforeEach runs BEFORE any story-level
  // beforeEach. A decorator runs during React rendering, which happens AFTER
  // beforeEach. Putting resets in a decorator would reset stores after the story's
  // beforeEach had already seeded them, producing an empty render every time.
  //
  // Execution order (correct):
  //   1. preview.beforeEach  → resets all stores
  //   2. story.beforeEach    → seeds story-specific state
  //   3. React renders       → withTauriMock decorator, then Story
  async beforeEach() {
    resetRequestStore()
    resetWorkspaceStore()
    resetUIStore()
    resetCollectionStore()
    resetEnvironmentStore()
    resetResponseStore()
    resetCollectionEnvironmentStore()
    resetCollectionViewStore()
    resetCollectionRunnerStore()
    resetToastStore()
    resetCommandRegistry()
  },
  decorators: [
    withTauriMock,
    withThemeByDataAttribute({
      themes: {
        dark: 'dark',
        'dark-monochrome': 'dark-monochrome',
        'dark-pastel': 'dark-pastel',
        'vscode-dark': 'vscode-dark',
        'catppuccin-frappe': 'catppuccin-frappe',
        'catppuccin-macchiato': 'catppuccin-macchiato',
        'catppuccin-mocha': 'catppuccin-mocha',
        nord: 'nord',
        light: 'light',
        'light-monochrome': 'light-monochrome',
        'light-pastel': 'light-pastel',
        'vscode-light': 'vscode-light',
        'catppuccin-latte': 'catppuccin-latte',
      },
      defaultTheme: 'dark',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: true }] } },
  },
}

export default preview
