import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  Active as s,
  ContextMenu as c,
  Dirty as l,
  Inactive as u,
  InactiveHover as d,
  MethodVariants as f,
  n as p,
  t as m,
} from './TabItem.stories-coPHqXT0.js'
function h(e) {
  let t = {
    a: `a`,
    code: `code`,
    h1: `h1`,
    h2: `h2`,
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
  return (0, _.jsxs)(_.Fragment, {
    children: [
      (0, _.jsx)(i, { of: m }),
      `
`,
      (0, _.jsx)(t.h1, { id: `tabitem`, children: `TabItem` }),
      `
`,
      (0, _.jsx)(t.p, {
        children: `A single tab in the horizontal request tab bar. Each tab shows a method label (or an icon for non-request tab types), the request name, and a close button that transitions from hidden to visible on hover. An accent bottom border marks the active tab. Tabs support drag-to-reorder and expose a right-click context menu with tab management actions.`,
      }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, _.jsx)(t.a, {
            href: `../../../components/layout/TabItem.tsx`,
            children: (0, _.jsx)(t.code, { children: `src/components/layout/TabItem.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, _.jsx)(t.hr, {}),
      `
`,
      (0, _.jsx)(t.h2, { id: `active`, children: `Active` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `The currently selected tab. Full-opacity close button, lighter `,
          (0, _.jsx)(t.code, { children: `bg-bg-surface` }),
          ` background, and a 2 px accent bottom border.`,
        ],
      }),
      `
`,
      (0, _.jsx)(r, { of: s }),
      `
`,
      (0, _.jsx)(t.hr, {}),
      `
`,
      (0, _.jsx)(t.h2, { id: `inactive`, children: `Inactive` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `A background tab. Text is muted, background is `,
          (0, _.jsx)(t.code, { children: `bg-bg-panel` }),
          `, and the close button is hidden (opacity-0) until the tab is hovered.`,
        ],
      }),
      `
`,
      (0, _.jsx)(r, { of: u }),
      `
`,
      (0, _.jsx)(t.hr, {}),
      `
`,
      (0, _.jsx)(t.h2, { id: `dirty`, children: `Dirty` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `An active tab with unsaved changes. An orange dot (`,
          (0, _.jsx)(t.code, { children: `bg-accent` }),
          `) replaces the close button at rest. On hover the dot hides and the close button appears in its place. The tab's `,
          (0, _.jsx)(t.code, { children: `title` }),
          ` attribute reads "Unsaved changes" for accessibility.`,
        ],
      }),
      `
`,
      (0, _.jsx)(r, { of: l }),
      `
`,
      (0, _.jsx)(t.hr, {}),
      `
`,
      (0, _.jsx)(t.h2, { id: `inactive-hover`, children: `Inactive hover` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `Demonstrates the hover state of an inactive tab — the close button transitions from opacity-0 to visible via a CSS `,
          (0, _.jsx)(t.code, { children: `group-hover` }),
          ` rule.`,
        ],
      }),
      `
`,
      (0, _.jsx)(r, { of: d }),
      `
`,
      (0, _.jsx)(t.hr, {}),
      `
`,
      (0, _.jsx)(t.h2, { id: `method-variants`, children: `Method variants` }),
      `
`,
      (0, _.jsx)(t.p, {
        children: `All four common HTTP methods rendered side-by-side to verify per-method colour tokens.`,
      }),
      `
`,
      (0, _.jsx)(r, { of: f }),
      `
`,
      (0, _.jsx)(t.hr, {}),
      `
`,
      (0, _.jsx)(t.h2, { id: `context-menu`, children: `Context menu` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `Right-clicking a tab opens a fixed-position context menu portalled to `,
          (0, _.jsx)(t.code, { children: `document.body` }),
          `. The menu adapts based on tab type — request tabs get additional actions (Save to Collection, Duplicate, Copy URL).`,
        ],
      }),
      `
`,
      (0, _.jsx)(r, { of: c }),
      `
`,
      (0, _.jsx)(t.hr, {}),
      `
`,
      (0, _.jsx)(t.h2, { id: `props`, children: `Props` }),
      `
`,
      (0, _.jsxs)(t.table, {
        children: [
          (0, _.jsx)(t.thead, {
            children: (0, _.jsxs)(t.tr, {
              children: [
                (0, _.jsx)(t.th, { children: `Prop` }),
                (0, _.jsx)(t.th, { children: `Type` }),
                (0, _.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, _.jsxs)(t.tbody, {
            children: [
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `tab` }) }),
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `Tab` }) }),
                  (0, _.jsx)(t.td, {
                    children: `The tab data object (id, type, name, method, isDirty, …)`,
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `active` }) }),
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `boolean` }) }),
                  (0, _.jsx)(t.td, { children: `Whether this tab is the currently selected one` }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `index` }) }),
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `number` }) }),
                  (0, _.jsx)(t.td, {
                    children: `Position in the tab list — used for drag-and-drop logic`,
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `dragOverIndex` }) }),
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `number | null` }) }),
                  (0, _.jsxs)(t.td, {
                    children: [
                      `Index of the tab currently being dragged over, or `,
                      (0, _.jsx)(t.code, { children: `null` }),
                    ],
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `onDragStart` }) }),
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `(index: number) => void` }),
                  }),
                  (0, _.jsx)(t.td, { children: `Called when drag starts on this tab` }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `onDragOver` }) }),
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `(index: number) => void` }),
                  }),
                  (0, _.jsx)(t.td, {
                    children: `Called when another tab is dragged over this one`,
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `onDragLeave` }) }),
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `() => void` }) }),
                  (0, _.jsx)(t.td, {
                    children: `Called when the dragged tab leaves this drop target`,
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `onDrop` }) }),
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `(index: number) => void` }),
                  }),
                  (0, _.jsx)(t.td, { children: `Called when a tab is dropped onto this one` }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `onDragEnd` }) }),
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `() => void` }) }),
                  (0, _.jsx)(t.td, { children: `Called when a drag operation ends` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, _.jsx)(t.h2, { id: `tab-types-and-icons`, children: `Tab types and icons` }),
      `
`,
      (0, _.jsxs)(t.table, {
        children: [
          (0, _.jsx)(t.thead, {
            children: (0, _.jsxs)(t.tr, {
              children: [
                (0, _.jsx)(t.th, { children: (0, _.jsx)(t.code, { children: `tab.type` }) }),
                (0, _.jsx)(t.th, { children: `Icon` }),
              ],
            }),
          }),
          (0, _.jsxs)(t.tbody, {
            children: [
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `request` }) }),
                  (0, _.jsxs)(t.td, {
                    children: [
                      `Method label (e.g. `,
                      (0, _.jsx)(t.code, { children: `GET` }),
                      `, `,
                      (0, _.jsx)(t.code, { children: `POST` }),
                      `) in the method colour token`,
                    ],
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `environments` }) }),
                  (0, _.jsxs)(t.td, {
                    children: [`Globe icon in `, (0, _.jsx)(t.code, { children: `text-accent` })],
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `collection-environments` }),
                  }),
                  (0, _.jsxs)(t.td, {
                    children: [`Layers icon in `, (0, _.jsx)(t.code, { children: `text-accent` })],
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `collection` }) }),
                  (0, _.jsxs)(t.td, {
                    children: [
                      `Settings icon in `,
                      (0, _.jsx)(t.code, { children: `text-accent` }),
                    ],
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `folder` }) }),
                  (0, _.jsxs)(t.td, {
                    children: [`Folder icon in `, (0, _.jsx)(t.code, { children: `text-accent` })],
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `example` }) }),
                  (0, _.jsx)(t.td, { children: `Method label (same as request)` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, _.jsx)(t.h2, { id: `method-colour-tokens`, children: `Method colour tokens` }),
      `
`,
      (0, _.jsxs)(t.table, {
        children: [
          (0, _.jsx)(t.thead, {
            children: (0, _.jsxs)(t.tr, {
              children: [
                (0, _.jsx)(t.th, { children: `Method` }),
                (0, _.jsx)(t.th, { children: `Token` }),
              ],
            }),
          }),
          (0, _.jsxs)(t.tbody, {
            children: [
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: `GET` }),
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `text-method-get` }),
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: `POST` }),
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `text-method-post` }),
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: `PUT` }),
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `text-method-put` }),
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: `PATCH` }),
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `text-method-patch` }),
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: `DELETE` }),
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `text-method-delete` }),
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: `HEAD` }),
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `text-method-head` }),
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: `OPTIONS` }),
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `text-method-options` }),
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: `WS / SSE / gRPC / GraphQL` }),
                  (0, _.jsxs)(t.td, {
                    children: [
                      `Their respective `,
                      (0, _.jsx)(t.code, { children: `text-method-*` }),
                      ` tokens`,
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
      (0, _.jsx)(t.h2, { id: `dirty-indicator`, children: `Dirty indicator` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `When `,
          (0, _.jsx)(t.code, { children: `tab.isDirty` }),
          ` is `,
          (0, _.jsx)(t.code, { children: `true` }),
          `:`,
        ],
      }),
      `
`,
      (0, _.jsxs)(t.ul, {
        children: [
          `
`,
          (0, _.jsxs)(t.li, {
            children: [
              `At rest: a 6×6 px dot (`,
              (0, _.jsx)(t.code, { children: `w-1.5 h-1.5 rounded-full bg-accent` }),
              `) is shown, and the close button is hidden.`,
            ],
          }),
          `
`,
          (0, _.jsxs)(t.li, {
            children: [
              `On hover: the dot hides (`,
              (0, _.jsx)(t.code, { children: `group-hover:hidden` }),
              `) and the close button appears (`,
              (0, _.jsx)(t.code, { children: `hidden group-hover:flex` }),
              `).`,
            ],
          }),
          `
`,
          (0, _.jsxs)(t.li, {
            children: [
              `The tab's `,
              (0, _.jsx)(t.code, { children: `title` }),
              ` attribute switches to `,
              (0, _.jsx)(t.code, { children: `"Unsaved changes"` }),
              ` as a visual and accessibility cue.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, _.jsx)(t.h2, { id: `drag-to-reorder`, children: `Drag-to-reorder` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `Drop targets are highlighted with a left accent border (`,
          (0, _.jsx)(t.code, { children: `border-l-2 border-l-accent` }),
          `) and a subtle background tint (`,
          (0, _.jsx)(t.code, { children: `bg-bg-highlight/30` }),
          `) when `,
          (0, _.jsx)(t.code, { children: `dragOverIndex === index` }),
          `. The parent `,
          (0, _.jsx)(t.code, { children: `TabBar` }),
          ` component manages drag state and passes it down as props.`,
        ],
      }),
      `
`,
      (0, _.jsx)(t.h2, { id: `context-menu-1`, children: `Context menu` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `The context menu is a controlled component rendered in the component's own JSX (not a portal) at a fixed position derived from `,
          (0, _.jsx)(t.code, { children: `e.clientX / e.clientY` }),
          `. It is dismissed by a `,
          (0, _.jsx)(t.code, { children: `mousedown` }),
          ` listener on `,
          (0, _.jsx)(t.code, { children: `document` }),
          `. Menu items available for `,
          (0, _.jsx)(t.code, { children: `type === 'request'` }),
          ` tabs:`,
        ],
      }),
      `
`,
      (0, _.jsxs)(t.ul, {
        children: [
          `
`,
          (0, _.jsxs)(t.li, {
            children: [
              (0, _.jsx)(t.strong, { children: `Close Tab` }),
              ` — `,
              (0, _.jsx)(t.code, { children: `Cmd+W` }),
            ],
          }),
          `
`,
          (0, _.jsx)(t.li, { children: (0, _.jsx)(t.strong, { children: `Close Other Tabs` }) }),
          `
`,
          (0, _.jsx)(t.li, {
            children: (0, _.jsx)(t.strong, { children: `Close Tabs to the Right` }),
          }),
          `
`,
          (0, _.jsxs)(t.li, {
            children: [
              (0, _.jsx)(t.strong, { children: `Save to Collection…` }),
              ` — only shown when `,
              (0, _.jsx)(t.code, { children: `tab.requestPath` }),
              ` is `,
              (0, _.jsx)(t.code, { children: `null` }),
              ` (scratch/transient tab)`,
            ],
          }),
          `
`,
          (0, _.jsx)(t.li, { children: (0, _.jsx)(t.strong, { children: `Duplicate Tab` }) }),
          `
`,
          (0, _.jsx)(t.li, { children: (0, _.jsx)(t.strong, { children: `Copy Request URL` }) }),
          `
`,
        ],
      }),
      `
`,
      (0, _.jsx)(t.h2, { id: `context-dependencies`, children: `Context dependencies` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          (0, _.jsx)(t.code, { children: `TabItem` }),
          ` calls `,
          (0, _.jsx)(t.code, { children: `useTabs()` }),
          ` from `,
          (0, _.jsx)(t.code, { children: `TabsContext` }),
          ` and `,
          (0, _.jsx)(t.code, { children: `useUIStore()` }),
          `. In Storybook, stories wrap the component in a `,
          (0, _.jsx)(t.code, { children: `<TabsProvider>` }),
          ` decorator and seed `,
          (0, _.jsx)(t.code, { children: `useUIStore` }),
          ` via `,
          (0, _.jsx)(t.code, { children: `beforeEach` }),
          ` with a spy for `,
          (0, _.jsx)(t.code, { children: `openSaveToCollectionDialog` }),
          `.`,
        ],
      }),
    ],
  })
}
function g(e = {}) {
  let { wrapper: t } = { ...n(), ...e.components }
  return t ? (0, _.jsx)(t, { ...e, children: (0, _.jsx)(h, { ...e }) }) : h(e)
}
var _
e(() => {
  ;((_ = t()), o(), a(), p())
})()
export { g as default }
