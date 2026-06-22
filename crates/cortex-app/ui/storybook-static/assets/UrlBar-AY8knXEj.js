import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  EmptyUrl as s,
  InFlight as c,
  VariableSegments as l,
  WithUrl as u,
  n as d,
  t as f,
} from './UrlBar.stories-_hdtP-ln.js'
function p(e) {
  let t = {
    a: `a`,
    blockquote: `blockquote`,
    code: `code`,
    h1: `h1`,
    h2: `h2`,
    h3: `h3`,
    hr: `hr`,
    li: `li`,
    p: `p`,
    strong: `strong`,
    table: `table`,
    tbody: `tbody`,
    td: `td`,
    th: `th`,
    thead: `thead`,
    tr: `tr`,
    ul: `ul`,
    ...n(),
    ...e.components,
  }
  return (0, h.jsxs)(h.Fragment, {
    children: [
      (0, h.jsx)(i, { of: f }),
      `
`,
      (0, h.jsx)(t.h1, { id: `urlbar`, children: `UrlBar` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `The horizontal request bar that sits above the composer panel. It composes three sub-components — `,
          (0, h.jsx)(t.code, { children: `MethodSelector` }),
          `, `,
          (0, h.jsx)(t.code, { children: `UrlInput` }),
          `, and `,
          (0, h.jsx)(t.code, { children: `SendButton` }),
          ` — plus three icon action buttons (Save to collection, Generate code snippet, Copy URL). UrlBar orchestrates the full request lifecycle: it reads state from six Zustand stores, builds the request payload, calls `,
          (0, h.jsx)(t.code, { children: `commands.sendRequest` }),
          ` via Tauri IPC, and writes the response back to `,
          (0, h.jsx)(t.code, { children: `responseStore` }),
          `.`,
        ],
      }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, h.jsx)(t.a, {
            href: `../../../components/layout/UrlBar.tsx`,
            children: (0, h.jsx)(t.code, { children: `src/components/layout/UrlBar.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, h.jsxs)(t.blockquote, {
        children: [
          `
`,
          (0, h.jsxs)(t.p, {
            children: [
              (0, h.jsx)(t.strong, { children: `Story mode — display only.` }),
              ` These stories render UrlBar in a controlled state by pre-seeding stores via `,
              (0, h.jsx)(t.code, { children: `beforeEach` }),
              ` and registering no-op tauriMock handlers for `,
              (0, h.jsx)(t.code, { children: `send_request` }),
              ` and `,
              (0, h.jsx)(t.code, { children: `cancel_request` }),
              `. No real HTTP requests are made.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `empty-url`, children: `Empty URL` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `The URL bar with no URL entered. Shows the method selector at `,
          (0, h.jsx)(t.code, { children: `GET` }),
          `, an empty UrlInput, the icon action buttons, and the Send button.`,
        ],
      }),
      `
`,
      (0, h.jsx)(r, { of: s }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `with-url`, children: `With URL` }),
      `
`,
      (0, h.jsx)(t.p, {
        children: `A fully-formed URL with no template variables. The Send button is active.`,
      }),
      `
`,
      (0, h.jsx)(r, { of: u }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `variable-segments`, children: `Variable segments` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `A URL containing `,
          (0, h.jsx)(t.code, { children: `{{variable}}` }),
          ` placeholders (`,
          (0, h.jsx)(t.code, { children: `{{baseUrl}}` }),
          ` and `,
          (0, h.jsx)(t.code, { children: `{{userId}}` }),
          `). UrlInput renders a transparent overlay with coloured `,
          (0, h.jsx)(t.code, { children: `<span>` }),
          ` tokens for each variable — resolved variables and unresolved variables receive different colour tokens.`,
        ],
      }),
      `
`,
      (0, h.jsx)(r, { of: l }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `in-flight`, children: `In-flight` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `The URL bar while a request is in progress (`,
          (0, h.jsx)(t.code, { children: `inFlight: true` }),
          `). The green Send button switches to a red Cancel button. Clicking Cancel calls `,
          (0, h.jsx)(t.code, { children: `commands.cancelRequest` }),
          ` with the in-progress request ID.`,
        ],
      }),
      `
`,
      (0, h.jsx)(r, { of: c }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `store-dependencies`, children: `Store dependencies` }),
      `
`,
      (0, h.jsx)(t.p, { children: `UrlBar reads from these stores at render time:` }),
      `
`,
      (0, h.jsxs)(t.table, {
        children: [
          (0, h.jsx)(t.thead, {
            children: (0, h.jsxs)(t.tr, {
              children: [
                (0, h.jsx)(t.th, { children: `Store` }),
                (0, h.jsx)(t.th, { children: `Fields consumed` }),
              ],
            }),
          }),
          (0, h.jsxs)(t.tbody, {
            children: [
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `requestStore` }) }),
                  (0, h.jsxs)(t.td, {
                    children: [
                      (0, h.jsx)(t.code, { children: `method` }),
                      `, `,
                      (0, h.jsx)(t.code, { children: `url` }),
                      `, `,
                      (0, h.jsx)(t.code, { children: `headers` }),
                      `, `,
                      (0, h.jsx)(t.code, { children: `auth` }),
                      `, `,
                      (0, h.jsx)(t.code, { children: `body` }),
                      `, `,
                      (0, h.jsx)(t.code, { children: `settings` }),
                      `, `,
                      (0, h.jsx)(t.code, { children: `inFlight` }),
                      `, `,
                      (0, h.jsx)(t.code, { children: `requestId` }),
                      ` (per active tab)`,
                    ],
                  }),
                ],
              }),
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, {
                    children: (0, h.jsx)(t.code, { children: `workspaceStore` }),
                  }),
                  (0, h.jsx)(t.td, {
                    children: (0, h.jsx)(t.code, { children: `activeWorkspacePath` }),
                  }),
                ],
              }),
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `responseStore` }) }),
                  (0, h.jsxs)(t.td, {
                    children: [
                      (0, h.jsx)(t.code, { children: `setResponse` }),
                      `, `,
                      (0, h.jsx)(t.code, { children: `setVisualization` }),
                      `, `,
                      (0, h.jsx)(t.code, { children: `clearVisualization` }),
                    ],
                  }),
                ],
              }),
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, {
                    children: (0, h.jsx)(t.code, { children: `environmentStore` }),
                  }),
                  (0, h.jsx)(t.td, {
                    children: (0, h.jsx)(t.code, { children: `activeEnvironmentName` }),
                  }),
                ],
              }),
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, {
                    children: (0, h.jsx)(t.code, { children: `collectionEnvironmentStore` }),
                  }),
                  (0, h.jsx)(t.td, {
                    children: (0, h.jsx)(t.code, { children: `activeCollectionEnvName` }),
                  }),
                ],
              }),
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, {
                    children: (0, h.jsx)(t.code, { children: `collectionStore` }),
                  }),
                  (0, h.jsxs)(t.td, {
                    children: [
                      (0, h.jsx)(t.code, { children: `collections` }),
                      ` (for auth inheritance)`,
                    ],
                  }),
                ],
              }),
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `uiStore` }) }),
                  (0, h.jsxs)(t.td, {
                    children: [
                      (0, h.jsx)(t.code, { children: `openSaveToCollectionDialog` }),
                      `, `,
                      (0, h.jsx)(t.code, { children: `openGenerateCodeModal` }),
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
      (0, h.jsxs)(t.p, {
        children: [
          `Stories seed the minimum required stores (`,
          (0, h.jsx)(t.code, { children: `requestStore` }),
          `, `,
          (0, h.jsx)(t.code, { children: `workspaceStore` }),
          `) and let the others remain at their reset defaults.`,
        ],
      }),
      `
`,
      (0, h.jsx)(t.h2, { id: `sub-components`, children: `Sub-components` }),
      `
`,
      (0, h.jsx)(t.h3, { id: `methodselector`, children: `MethodSelector` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `A dropdown that lists 8 standard HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, TRACE), 4 protocol types (GraphQL, gRPC, WS, SSE), and a free-text custom method input. Each method is coloured via `,
          (0, h.jsx)(t.code, { children: `text-method-*` }),
          ` tokens.`,
        ],
      }),
      `
`,
      (0, h.jsx)(t.h3, { id: `urlinput`, children: `UrlInput` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `A custom contenteditable-like input that renders a read-only colour overlay synced with a real `,
          (0, h.jsx)(t.code, { children: `<input>` }),
          ` element. Template variables (`,
          (0, h.jsx)(t.code, { children: `{{name}}` }),
          `) are parsed and wrapped in coloured spans — resolved variables in `,
          (0, h.jsx)(t.code, { children: `text-var-resolved` }),
          `, unresolved in `,
          (0, h.jsx)(t.code, { children: `text-var-unresolved` }),
          `, and dynamic expressions in `,
          (0, h.jsx)(t.code, { children: `text-var-dynamic` }),
          `. The overlay scrolls in sync with the input so the colour spans always align with the typed characters.`,
        ],
      }),
      `
`,
      (0, h.jsx)(t.h3, { id: `sendbutton`, children: `SendButton` }),
      `
`,
      (0, h.jsx)(t.p, { children: `A dual-state button:` }),
      `
`,
      (0, h.jsxs)(t.ul, {
        children: [
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              (0, h.jsx)(t.strong, { children: `Idle` }),
              ` — accent-coloured "Send" label with a keyboard shortcut hint (⌘+Enter / Ctrl+Enter). Disabled and shows a tooltip when auth is incomplete.`,
            ],
          }),
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              (0, h.jsx)(t.strong, { children: `In-flight` }),
              ` — red "Cancel" button with an X icon. Clicking it calls `,
              (0, h.jsx)(t.code, { children: `commands.cancelRequest` }),
              `.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, h.jsx)(t.h2, { id: `keyboard-shortcuts`, children: `Keyboard shortcuts` }),
      `
`,
      (0, h.jsxs)(t.table, {
        children: [
          (0, h.jsx)(t.thead, {
            children: (0, h.jsxs)(t.tr, {
              children: [
                (0, h.jsx)(t.th, { children: `Shortcut` }),
                (0, h.jsx)(t.th, { children: `Action` }),
              ],
            }),
          }),
          (0, h.jsxs)(t.tbody, {
            children: [
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, {
                    children: (0, h.jsx)(t.code, { children: `Cmd/Ctrl + Enter` }),
                  }),
                  (0, h.jsx)(t.td, { children: `Send the current request` }),
                ],
              }),
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsxs)(t.td, {
                    children: [
                      `Custom `,
                      (0, h.jsx)(t.code, { children: `cortex:send-request` }),
                      ` window event`,
                    ],
                  }),
                  (0, h.jsx)(t.td, { children: `Also triggers send (used by command palette)` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, h.jsx)(t.h2, { id: `auth-validation`, children: `Auth validation` }),
      `
`,
      (0, h.jsx)(t.p, {
        children: `Before enabling the Send button, UrlBar resolves the effective auth (accounting for collection-level auth inheritance) and disables the button with a descriptive reason if:`,
      }),
      `
`,
      (0, h.jsxs)(t.ul, {
        children: [
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              `Auth type is `,
              (0, h.jsx)(t.code, { children: `bearer_token` }),
              ` and the token field is empty.`,
            ],
          }),
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              `Auth type is `,
              (0, h.jsx)(t.code, { children: `api_key` }),
              ` and either the key name or value field is empty.`,
            ],
          }),
          `
`,
        ],
      }),
    ],
  })
}
function m(e = {}) {
  let { wrapper: t } = { ...n(), ...e.components }
  return t ? (0, h.jsx)(t, { ...e, children: (0, h.jsx)(p, { ...e }) }) : p(e)
}
var h
e(() => {
  ;((h = t()), o(), a(), d())
})()
export { m as default }
