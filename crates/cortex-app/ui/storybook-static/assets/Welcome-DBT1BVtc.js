import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { Default as o, n as s, t as c } from './Placeholder.stories-B9m6g79g.js'
import { t as l } from './mdx-react-shim-BMmPYFJS.js'
function u(e) {
  let t = {
    code: `code`,
    h1: `h1`,
    h2: `h2`,
    h3: `h3`,
    hr: `hr`,
    p: `p`,
    pre: `pre`,
    strong: `strong`,
    table: `table`,
    tbody: `tbody`,
    td: `td`,
    th: `th`,
    thead: `thead`,
    tr: `tr`,
    ...n(),
    ...e.components,
  }
  return (0, f.jsxs)(f.Fragment, {
    children: [
      (0, f.jsx)(i, { of: c }),
      `
`,
      (0, f.jsx)(t.h1, {
        id: `cortex-ui--component-library`,
        children: `Cortex UI — Component Library`,
      }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Cortex is an `,
          (0, f.jsx)(t.strong, { children: `offline-first, AI-native desktop API client` }),
          ` built with Tauri 2 + Rust (backend) and React 19 + TypeScript + Tailwind (frontend). This Storybook is the canonical visual catalogue, interactive design-system reference, and component development environment for the entire Cortex UI.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `contents`, children: `Contents` }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Section` }),
                (0, f.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.strong, { children: `Design System` }),
                  }),
                  (0, f.jsx)(t.td, {
                    children: `Token gallery, theme gallery, icon catalog — the foundation everything else is built on`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.strong, { children: `UI` }) }),
                  (0, f.jsx)(t.td, {
                    children: `23 atomic components: badges, buttons, inputs, dialogs, tooltips, code editors, context menus, and more`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.strong, { children: `Layout` }) }),
                  (0, f.jsx)(t.td, {
                    children: `33 composed components: sidebar, panels, tabs, top bar, command palette, breadcrumbs`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.strong, { children: `Composer` }) }),
                  (0, f.jsx)(t.td, {
                    children: `24 request-composer components: URL bar, method picker, body editor, auth panel, headers table`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.strong, { children: `Collection` }) }),
                  (0, f.jsx)(t.td, {
                    children: `14 collection-management components: tree, request row, folder row, environment picker`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.strong, { children: `Collection Runner` }),
                  }),
                  (0, f.jsx)(t.td, { children: `The automated collection runner UI` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, {
        id: `design-system-fundamentals`,
        children: `Design system fundamentals`,
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `13-themes-39-css-tokens`, children: `13 themes, 39 CSS tokens` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Every component in Cortex is styled exclusively through `,
          (0, f.jsx)(t.strong, { children: `CSS custom properties` }),
          `. Hardcoded colours are never used. The token contract has 39 variables across 9 categories:`,
        ],
      }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Category` }),
                (0, f.jsx)(t.th, { children: `Tokens` }),
                (0, f.jsx)(t.th, { children: `Example` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `Background` }),
                  (0, f.jsx)(t.td, { children: `6` }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `--color-bg-base` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `--color-bg-panel` }),
                    ],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `Text` }),
                  (0, f.jsx)(t.td, { children: `5` }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `--color-text-primary` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `--color-text-muted` }),
                    ],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `Border` }),
                  (0, f.jsx)(t.td, { children: `3` }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `--color-border-default` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `--color-border-strong` }),
                    ],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `Accent` }),
                  (0, f.jsx)(t.td, { children: `3` }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `--color-accent` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `--color-accent-hover` }),
                    ],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `Status` }),
                  (0, f.jsx)(t.td, { children: `8` }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `--color-success` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `--color-error` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `--color-warning` }),
                    ],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `HTTP Methods` }),
                  (0, f.jsx)(t.td, { children: `13` }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `--color-method-get` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `--color-method-post` }),
                    ],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `Syntax` }),
                  (0, f.jsx)(t.td, { children: `9` }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `--color-syntax-keyword` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `--color-syntax-string` }),
                    ],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `Typography` }),
                  (0, f.jsx)(t.td, { children: `4` }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `--font-sans` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `--font-mono` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `--font-size-base` }),
                    ],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `Shape` }),
                  (0, f.jsx)(t.td, { children: `3` }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `--radius-sm` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `--radius-md` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `--radius-lg` }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Themes are switched by setting `,
          (0, f.jsx)(t.code, { children: `data-theme="<id>"` }),
          ` on the `,
          (0, f.jsx)(t.code, { children: `<html>` }),
          ` element. Use the `,
          (0, f.jsx)(t.strong, { children: `Theme` }),
          ` toolbar button at the top of the page to switch between all 13 themes in real time.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `tailwind-integration`, children: `Tailwind integration` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `All 39 tokens are mapped to Tailwind utility classes via `,
          (0, f.jsx)(t.code, { children: `tailwind.config.ts` }),
          `:`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-tsx`,
          children: `// CSS token         → Tailwind class
// --color-bg-base   → bg-bg-base
// --color-text-primary → text-text-primary
// --color-accent    → text-accent, bg-accent, border-accent
// --color-method-get → text-method-get, bg-method-get

<div className="bg-bg-panel text-text-primary border border-border-default rounded-md">...</div>
`,
        }),
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `story-tiers`, children: `Story tiers` }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `Stories are organised into three tiers based on their dependencies:`,
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `tier-1--atomic`, children: `Tier 1 — Atomic` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Pure presentational components with no Zustand or Tauri dependencies. Stories render with zero setup, cover all prop variants via `,
          (0, f.jsx)(t.code, { children: `args` }),
          `, and include `,
          (0, f.jsx)(t.code, { children: `play()` }),
          ` functions for interactive behaviour.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `tier-2--composed`, children: `Tier 2 — Composed` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Components with internal logic that may read one Zustand store. Stories seed the required store state in `,
          (0, f.jsx)(t.code, { children: `beforeEach` }),
          ` and mock any `,
          (0, f.jsx)(t.code, { children: `invoke()` }),
          ` calls using per-story `,
          (0, f.jsx)(t.code, { children: `parameters.tauriMock` }),
          `.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `tier-3--stateful`, children: `Tier 3 — Stateful` }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `Components that orchestrate multiple stores and IPC calls. Stories provide a complete fixture workspace/collection and document which stores are touched.`,
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `storybook-infrastructure`, children: `Storybook infrastructure` }),
      `
`,
      (0, f.jsx)(t.h3, { id: `tauri-ipc-mocking`, children: `Tauri IPC mocking` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `All Tauri `,
          (0, f.jsx)(t.code, { children: `invoke()` }),
          ` calls are intercepted by the global `,
          (0, f.jsx)(t.code, { children: `withTauriMock` }),
          ` decorator. No native backend is needed. Per-story overrides are provided via `,
          (0, f.jsx)(t.code, { children: `parameters.tauriMock` }),
          `:`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-tsx`,
          children: `export const WithData: Story = {
  parameters: {
    tauriMock: {
      // Return the RAW value — the binding wraps it in { status: "ok", data: ... }
      load_collection: () => FIXTURE_COLLECTION,
    },
  },
}
`,
        }),
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `zustand-store-isolation`, children: `Zustand store isolation` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `All 11 Zustand stores are reset to their initial state before every story via `,
          (0, f.jsx)(t.code, { children: `preview.beforeEach` }),
          `. Story-level `,
          (0, f.jsx)(t.code, { children: `beforeEach` }),
          ` hooks run after the global reset, so seed data is always applied on a clean baseline:`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-tsx`,
          children: `export const WithCollections: Story = {
  beforeEach: () => {
    useWorkspaceStore.setState({ activeWorkspace: FIXTURE_WORKSPACE })
    useCollectionStore.setState({ collections: { ... } })
  },
}
`,
        }),
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `running-storybook-locally`, children: `Running Storybook locally` }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-bash`,
          children: `cd crates/cortex-app/ui
npm run storybook        # dev server → http://localhost:6006
npm run build-storybook  # static build → dist/storybook/
npm run test:stories     # run interaction tests headlessly
`,
        }),
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `default-story`, children: `Default story` }),
      `
`,
      (0, f.jsx)(r, { of: o }),
    ],
  })
}
function d(e = {}) {
  let { wrapper: t } = { ...n(), ...e.components }
  return t ? (0, f.jsx)(t, { ...e, children: (0, f.jsx)(u, { ...e }) }) : u(e)
}
var f
e(() => {
  ;((f = t()), l(), a(), s())
})()
export { d as default }
