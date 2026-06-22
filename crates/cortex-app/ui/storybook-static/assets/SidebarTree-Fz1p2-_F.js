import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  Default as s,
  WithCollections as c,
  WithTauriMockOverride as l,
  n as u,
  t as d,
} from './SidebarTree.stories-B7KgQ8ym.js'
function f(e) {
  let t = {
    a: `a`,
    code: `code`,
    h1: `h1`,
    h2: `h2`,
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
  return (0, m.jsxs)(m.Fragment, {
    children: [
      (0, m.jsx)(i, { of: d }),
      `
`,
      (0, m.jsx)(t.h1, { id: `sidebartree`, children: `SidebarTree` }),
      `
`,
      (0, m.jsx)(t.p, {
        children: `The collapsible tree panel on the left edge of the workspace. It renders the full collection hierarchy — collections, folders, and individual requests — and is the primary navigation surface for saved API collections. Each node is drag-and-drop reorderable, context-menu enabled, and opens a tab in the composer when clicked.`,
      }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, m.jsx)(t.a, {
            href: `../../../components/layout/SidebarTree.tsx`,
            children: (0, m.jsx)(t.code, { children: `src/components/layout/SidebarTree.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `default`, children: `Default` }),
      `
`,
      (0, m.jsx)(t.p, {
        children: `No workspace is loaded. The sidebar shows an empty state prompting the user to open or create a collection.`,
      }),
      `
`,
      (0, m.jsx)(r, { of: s }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `with-collections`, children: `With collections` }),
      `
`,
      (0, m.jsx)(t.p, {
        children: `A workspace is seeded with the Petstore API collection containing two requests: "List pets" (GET) and "Create pet" (POST). The collection node is expanded, showing both child requests with their method badges.`,
      }),
      `
`,
      (0, m.jsx)(r, { of: c }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `with-tauri-mock-override`, children: `With Tauri mock override` }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `Demonstrates per-story `,
          (0, m.jsx)(t.code, { children: `parameters.tauriMock` }),
          ` override. The story overrides the default IPC mock to return a custom response for a specific command, showing how individual stories can extend the global IPC mock without affecting others.`,
        ],
      }),
      `
`,
      (0, m.jsx)(r, { of: l }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `store-dependencies`, children: `Store dependencies` }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `The `,
          (0, m.jsx)(t.code, { children: `SidebarTree` }),
          ` component reads from multiple Zustand stores. In Storybook, these are seeded via `,
          (0, m.jsx)(t.code, { children: `beforeEach` }),
          ` after the global store-reset decorator runs:`,
        ],
      }),
      `
`,
      (0, m.jsxs)(t.table, {
        children: [
          (0, m.jsx)(t.thead, {
            children: (0, m.jsxs)(t.tr, {
              children: [
                (0, m.jsx)(t.th, { children: `Store` }),
                (0, m.jsx)(t.th, { children: `Seeded fields` }),
              ],
            }),
          }),
          (0, m.jsxs)(t.tbody, {
            children: [
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, {
                    children: (0, m.jsx)(t.code, { children: `useWorkspaceStore` }),
                  }),
                  (0, m.jsxs)(t.td, {
                    children: [
                      (0, m.jsx)(t.code, { children: `activeWorkspace` }),
                      `, `,
                      (0, m.jsx)(t.code, { children: `activeWorkspacePath` }),
                    ],
                  }),
                ],
              }),
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, {
                    children: (0, m.jsx)(t.code, { children: `useCollectionStore` }),
                  }),
                  (0, m.jsxs)(t.td, {
                    children: [
                      (0, m.jsx)(t.code, { children: `collections` }),
                      ` map, `,
                      (0, m.jsx)(t.code, { children: `expansionState` }),
                      ` map`,
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
      (0, m.jsxs)(t.p, {
        children: [
          `The `,
          (0, m.jsx)(t.code, { children: `TabsProvider` }),
          ` context is required because clicking a request node calls `,
          (0, m.jsx)(t.code, { children: `openTab()` }),
          ` from `,
          (0, m.jsx)(t.code, { children: `useTabs()` }),
          `.`,
        ],
      }),
      `
`,
      (0, m.jsx)(t.h2, { id: `tauri-ipc-mocking`, children: `Tauri IPC mocking` }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `The global IPC mock (applied by the `,
          (0, m.jsx)(t.code, { children: `withTauriMock` }),
          ` decorator) nullifies all `,
          (0, m.jsx)(t.code, { children: `invoke()` }),
          ` calls by default. Individual stories can override specific commands via `,
          (0, m.jsx)(t.code, { children: `parameters.tauriMock` }),
          `:`,
        ],
      }),
      `
`,
      (0, m.jsx)(t.pre, {
        children: (0, m.jsx)(t.code, {
          className: `language-tsx`,
          children: `parameters: {
  tauriMock: {
    my_command: () => ({ some: 'data' }),
  },
}
`,
        }),
      }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          (0, m.jsx)(t.strong, { children: `Important` }),
          `: mock return values must be the raw inner data — the binding wrapper automatically wraps them in `,
          (0, m.jsx)(t.code, { children: `{ status: "ok", data: … }` }),
          `. Returning a pre-wrapped object will result in double-wrapping.`,
        ],
      }),
      `
`,
      (0, m.jsx)(t.h2, { id: `collection-node-structure`, children: `Collection node structure` }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `Each collection in the sidebar maps to a `,
          (0, m.jsx)(t.code, { children: `.crx` }),
          ` YAML file on disk. The tree structure mirrors the YAML hierarchy:`,
        ],
      }),
      `
`,
      (0, m.jsx)(t.pre, {
        children: (0, m.jsx)(t.code, {
          children: `Collection (root)
├── Folder
│   ├── Request
│   └── Request
└── Request
`,
        }),
      }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `Requests are colour-coded by HTTP method using the same `,
          (0, m.jsx)(t.code, { children: `text-method-*` }),
          ` tokens as `,
          (0, m.jsx)(t.code, { children: `TabItem` }),
          `. Folder nodes show expand/collapse chevrons and a folder icon.`,
        ],
      }),
      `
`,
      (0, m.jsx)(t.h2, { id: `component-characteristics`, children: `Component characteristics` }),
      `
`,
      (0, m.jsxs)(t.table, {
        children: [
          (0, m.jsx)(t.thead, {
            children: (0, m.jsxs)(t.tr, {
              children: [
                (0, m.jsx)(t.th, { children: `Property` }),
                (0, m.jsx)(t.th, { children: `Value` }),
              ],
            }),
          }),
          (0, m.jsxs)(t.tbody, {
            children: [
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, { children: `Width` }),
                  (0, m.jsx)(t.td, {
                    children: `260 px (fixed in stories; resizable in app via drag handle)`,
                  }),
                ],
              }),
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, { children: `Context` }),
                  (0, m.jsxs)(t.td, {
                    children: [(0, m.jsx)(t.code, { children: `TabsProvider` }), ` required`],
                  }),
                ],
              }),
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, { children: `Stores` }),
                  (0, m.jsxs)(t.td, {
                    children: [
                      (0, m.jsx)(t.code, { children: `useWorkspaceStore` }),
                      `, `,
                      (0, m.jsx)(t.code, { children: `useCollectionStore` }),
                      `, `,
                      (0, m.jsx)(t.code, { children: `useUIStore` }),
                    ],
                  }),
                ],
              }),
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, { children: `Tauri commands` }),
                  (0, m.jsxs)(t.td, {
                    children: [
                      (0, m.jsx)(t.code, { children: `open_collection` }),
                      `, `,
                      (0, m.jsx)(t.code, { children: `save_collection` }),
                      `, `,
                      (0, m.jsx)(t.code, { children: `delete_request` }),
                      `, and others`,
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
function p(e = {}) {
  let { wrapper: t } = { ...n(), ...e.components }
  return t ? (0, m.jsx)(t, { ...e, children: (0, m.jsx)(f, { ...e }) }) : f(e)
}
var m
e(() => {
  ;((m = t()), o(), a(), u())
})()
export { p as default }
