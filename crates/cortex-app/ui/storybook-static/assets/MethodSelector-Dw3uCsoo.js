import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  CustomMethod as s,
  DeleteMethod as c,
  GetMethod as l,
  OpenDropdown as u,
  PatchMethod as d,
  PostMethod as f,
  ProtocolGraphQL as p,
  ProtocolWS as m,
  PutMethod as h,
  n as g,
  t as _,
} from './MethodSelector.stories-CfATiZfg.js'
function v(e) {
  let t = {
    a: `a`,
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
  return (0, b.jsxs)(b.Fragment, {
    children: [
      (0, b.jsx)(i, { of: _ }),
      `
`,
      (0, b.jsx)(t.h1, { id: `methodselector`, children: `MethodSelector` }),
      `
`,
      (0, b.jsx)(t.p, {
        children: `The HTTP method / protocol dropdown pill displayed at the left edge of the request URL bar. Clicking the pill opens a layered dropdown with HTTP methods, protocol types, and a free-text custom method entry. Each standard method maps to a dedicated design-token colour pair so the pill is colour-coded at a glance across all 13 Cortex themes.`,
      }),
      `
`,
      (0, b.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, b.jsx)(t.a, {
            href: `../../../components/composer/MethodSelector.tsx`,
            children: (0, b.jsx)(t.code, {
              children: `src/components/composer/MethodSelector.tsx`,
            }),
          }),
        ],
      }),
      `
`,
      (0, b.jsx)(t.hr, {}),
      `
`,
      (0, b.jsx)(t.h2, { id: `http-methods`, children: `HTTP Methods` }),
      `
`,
      (0, b.jsx)(t.h3, { id: `get`, children: `GET` }),
      `
`,
      (0, b.jsx)(r, { of: l }),
      `
`,
      (0, b.jsx)(t.h3, { id: `post`, children: `POST` }),
      `
`,
      (0, b.jsx)(r, { of: f }),
      `
`,
      (0, b.jsx)(t.h3, { id: `put`, children: `PUT` }),
      `
`,
      (0, b.jsx)(r, { of: h }),
      `
`,
      (0, b.jsx)(t.h3, { id: `patch`, children: `PATCH` }),
      `
`,
      (0, b.jsx)(r, { of: d }),
      `
`,
      (0, b.jsx)(t.h3, { id: `delete`, children: `DELETE` }),
      `
`,
      (0, b.jsx)(t.p, {
        children: `The red warning colour signals a destructive operation at a glance.`,
      }),
      `
`,
      (0, b.jsx)(r, { of: c }),
      `
`,
      (0, b.jsx)(t.hr, {}),
      `
`,
      (0, b.jsx)(t.h2, { id: `protocols`, children: `Protocols` }),
      `
`,
      (0, b.jsx)(t.h3, { id: `graphql`, children: `GraphQL` }),
      `
`,
      (0, b.jsx)(r, { of: p }),
      `
`,
      (0, b.jsx)(t.h3, { id: `websocket`, children: `WebSocket` }),
      `
`,
      (0, b.jsx)(r, { of: m }),
      `
`,
      (0, b.jsx)(t.hr, {}),
      `
`,
      (0, b.jsx)(t.h2, { id: `custom-method`, children: `Custom Method` }),
      `
`,
      (0, b.jsxs)(t.p, {
        children: [
          `Non-standard methods (e.g. `,
          (0, b.jsx)(t.code, { children: `PURGE` }),
          `, `,
          (0, b.jsx)(t.code, { children: `LOCK` }),
          `, `,
          (0, b.jsx)(t.code, { children: `MKCOL` }),
          `) are entered via the freeform text field at the bottom of the dropdown. They render in a neutral grey pill because no dedicated design token exists for them. Pressing `,
          (0, b.jsx)(t.strong, { children: `Enter` }),
          ` or clicking `,
          (0, b.jsx)(t.strong, { children: `Apply` }),
          ` commits the value and closes the dropdown.`,
        ],
      }),
      `
`,
      (0, b.jsx)(r, { of: s }),
      `
`,
      (0, b.jsx)(t.hr, {}),
      `
`,
      (0, b.jsx)(t.h2, { id: `open-dropdown`, children: `Open Dropdown` }),
      `
`,
      (0, b.jsxs)(t.p, {
        children: [
          `The `,
          (0, b.jsx)(t.code, { children: `play()` }),
          ` function clicks the trigger and asserts all three section headings — `,
          (0, b.jsx)(t.strong, { children: `HTTP Methods` }),
          `, `,
          (0, b.jsx)(t.strong, { children: `Protocols` }),
          `, and `,
          (0, b.jsx)(t.strong, { children: `Custom Method` }),
          ` — are present in the dropdown. Use this story to inspect the full dropdown UI.`,
        ],
      }),
      `
`,
      (0, b.jsx)(r, { of: u }),
      `
`,
      (0, b.jsx)(t.hr, {}),
      `
`,
      (0, b.jsx)(t.h2, { id: `method-colour-tokens`, children: `Method Colour Tokens` }),
      `
`,
      (0, b.jsxs)(t.table, {
        children: [
          (0, b.jsx)(t.thead, {
            children: (0, b.jsxs)(t.tr, {
              children: [
                (0, b.jsx)(t.th, { children: `Method` }),
                (0, b.jsx)(t.th, { children: `Text token` }),
                (0, b.jsx)(t.th, { children: `Background token` }),
              ],
            }),
          }),
          (0, b.jsxs)(t.tbody, {
            children: [
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `GET` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-method-get` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-method-get/10` }),
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `POST` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-method-post` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-method-post/10` }),
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `PUT` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-method-put` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-method-put/10` }),
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `PATCH` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-method-patch` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-method-patch/10` }),
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `DELETE` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-method-delete` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-method-delete/10` }),
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `HEAD` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-method-head` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-method-head/10` }),
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `OPTIONS` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-method-options` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-method-options/10` }),
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `TRACE` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-method-trace` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-method-trace/10` }),
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `GraphQL` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-method-graphql` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-method-graphql/10` }),
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `gRPC` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-method-grpc` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-method-grpc/10` }),
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `WS` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-method-ws` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-method-ws/10` }),
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `SSE` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-method-sse` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-method-sse/10` }),
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: `Custom` }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `text-text-secondary` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `bg-bg-muted/50` }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, b.jsx)(t.hr, {}),
      `
`,
      (0, b.jsx)(t.h2, { id: `props`, children: `Props` }),
      `
`,
      (0, b.jsxs)(t.table, {
        children: [
          (0, b.jsx)(t.thead, {
            children: (0, b.jsxs)(t.tr, {
              children: [
                (0, b.jsx)(t.th, { children: `Prop` }),
                (0, b.jsx)(t.th, { children: `Type` }),
                (0, b.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, b.jsxs)(t.tbody, {
            children: [
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `method` }) }),
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `string` }) }),
                  (0, b.jsx)(t.td, {
                    children: `The currently selected HTTP method or protocol. Displayed in uppercase; matched case-insensitively against the known method list for colour resolution.`,
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `onChange` }) }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `(method: string) => void` }),
                  }),
                  (0, b.jsx)(t.td, {
                    children: `Callback fired when the user selects a method from the dropdown or submits a custom method.`,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, b.jsx)(t.h2, { id: `behaviour-notes`, children: `Behaviour Notes` }),
      `
`,
      (0, b.jsxs)(t.ul, {
        children: [
          `
`,
          (0, b.jsxs)(t.li, {
            children: [
              (0, b.jsx)(t.strong, { children: `Click outside to close` }),
              ` — a `,
              (0, b.jsx)(t.code, { children: `mousedown` }),
              ` listener on `,
              (0, b.jsx)(t.code, { children: `document` }),
              ` closes the dropdown when the user clicks outside the component.`,
            ],
          }),
          `
`,
          (0, b.jsxs)(t.li, {
            children: [
              (0, b.jsx)(t.strong, { children: `Custom method via keyboard` }),
              ` — pressing `,
              (0, b.jsx)(t.strong, { children: `Enter` }),
              ` in the custom method `,
              (0, b.jsx)(t.code, { children: `<input>` }),
              ` submits without requiring a click on `,
              (0, b.jsx)(t.strong, { children: `Apply` }),
              `.`,
            ],
          }),
          `
`,
          (0, b.jsxs)(t.li, {
            children: [
              (0, b.jsx)(t.strong, { children: `Tooltip alignment` }),
              ` — the trigger button tooltip is `,
              (0, b.jsx)(t.code, { children: `align="start"` }),
              ` so it does not overlap the dropdown.`,
            ],
          }),
          `
`,
          (0, b.jsxs)(t.li, {
            children: [
              (0, b.jsx)(t.strong, { children: `Pill width` }),
              ` — fixed at `,
              (0, b.jsx)(t.code, { children: `72px` }),
              ` (`,
              (0, b.jsx)(t.code, { children: `w-[72px]` }),
              `) to prevent layout shift when switching between short (`,
              (0, b.jsx)(t.code, { children: `GET` }),
              `) and longer (`,
              (0, b.jsx)(t.code, { children: `DELETE` }),
              `, `,
              (0, b.jsx)(t.code, { children: `GraphQL` }),
              `) method labels.`,
            ],
          }),
          `
`,
        ],
      }),
    ],
  })
}
function y(e = {}) {
  let { wrapper: t } = { ...n(), ...e.components }
  return t ? (0, b.jsx)(t, { ...e, children: (0, b.jsx)(v, { ...e }) }) : v(e)
}
var b
e(() => {
  ;((b = t()), o(), a(), g())
})()
export { y as default }
