import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  LongUrl as s,
  WithQueryParams as c,
  WithSecrets as l,
  WithUnresolvedVariables as u,
  WithUrl as d,
  WithVariables as f,
  n as p,
  t as m,
} from './UrlPreviewBar.stories-Y-CA7S_6.js'
function h(e) {
  let t = {
    a: `a`,
    blockquote: `blockquote`,
    code: `code`,
    em: `em`,
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
      (0, _.jsx)(t.h1, { id: `urlpreviewbar`, children: `UrlPreviewBar` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `A slim read-only bar rendered directly below the URL input. It shows the `,
          (0, _.jsx)(t.strong, { children: `fully-resolved URL` }),
          ` — after variable substitution and query-parameter serialisation — so the user can verify exactly what will be sent over the wire before clicking Send. The bar renders `,
          (0, _.jsx)(t.code, { children: `null` }),
          ` (no DOM, no height) when the URL is empty.`,
        ],
      }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, _.jsx)(t.a, {
            href: `../../../components/composer/UrlPreviewBar.tsx`,
            children: (0, _.jsx)(t.code, { children: `src/components/composer/UrlPreviewBar.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, _.jsxs)(t.blockquote, {
        children: [
          `
`,
          (0, _.jsxs)(t.p, {
            children: [
              (0, _.jsx)(t.strong, { children: `Store-seeded stories.` }),
              ` UrlPreviewBar reads `,
              (0, _.jsx)(t.code, { children: `requestStates[requestId]` }),
              ` and `,
              (0, _.jsx)(t.code, { children: `resolvedVariables[requestId]` }),
              ` from `,
              (0, _.jsx)(t.code, { children: `requestStore` }),
              `. Every story that should render a visible bar pre-seeds these via `,
              (0, _.jsx)(t.code, { children: `beforeEach` }),
              ` using the stable ID `,
              (0, _.jsx)(t.code, { children: `story-urlpreviewbar-req-001` }),
              `.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, _.jsx)(t.hr, {}),
      `
`,
      (0, _.jsx)(t.h2, { id: `with-url`, children: `With URL` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `A plain URL with no variables and no query params. The `,
          (0, _.jsx)(t.strong, { children: `PREVIEW` }),
          ` label (eye icon), the monospace URL, and the copy button are all visible.`,
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
      (0, _.jsx)(t.h2, { id: `with-query-params`, children: `With Query Params` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `Two enabled query params are serialised and percent-encoded into the URL preview: `,
          (0, _.jsx)(t.code, { children: `?q=hello%20world&limit=20` }),
          `. Params come from `,
          (0, _.jsx)(t.code, { children: `tabState.params` }),
          ` — not from inline `,
          (0, _.jsx)(t.code, { children: `?…` }),
          ` syntax in the URL string.`,
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
      (0, _.jsx)(t.h2, { id: `with-variables-resolved`, children: `With Variables (resolved)` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `Both `,
          (0, _.jsx)(t.code, { children: `{{baseUrl}}` }),
          ` and `,
          (0, _.jsx)(t.code, { children: `{{userId}}` }),
          ` are resolved in the store. The preview bar substitutes the real values inline — no chips remain.`,
        ],
      }),
      `
`,
      (0, _.jsx)(r, { of: f }),
      `
`,
      (0, _.jsx)(t.hr, {}),
      `
`,
      (0, _.jsx)(t.h2, { id: `with-unresolved-variables`, children: `With Unresolved Variables` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          (0, _.jsx)(t.code, { children: `{{region}}` }),
          ` is not in the resolved variables map. The token remains in the displayed URL as a `,
          (0, _.jsx)(t.strong, { children: `yellow warning chip` }),
          ` so the user knows the variable is missing from the active environment.`,
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
      (0, _.jsx)(t.h2, { id: `with-secrets`, children: `With Secrets` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `The `,
          (0, _.jsx)(t.code, { children: `apiKey` }),
          ` query param is resolved but marked `,
          (0, _.jsx)(t.code, { children: `secret: true` }),
          `. The preview URL shows `,
          (0, _.jsx)(t.code, { children: `?key=••••••••` }),
          ` and an `,
          (0, _.jsx)(t.strong, { children: `eye-off icon` }),
          ` appears at the right edge. Clicking copy writes the `,
          (0, _.jsx)(t.strong, { children: `unmasked` }),
          ` URL (the real secret value) to the clipboard so it can be used in curl or a browser.`,
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
      (0, _.jsx)(t.h2, { id: `long-url`, children: `Long URL` }),
      `
`,
      (0, _.jsxs)(t.p, {
        children: [
          `A very long URL with five query params. The bar clips at a fixed single-line height (`,
          (0, _.jsx)(t.code, { children: `overflow-hidden whitespace-nowrap` }),
          `). The copy button remains visible at the far right regardless of URL length.`,
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
      (0, _.jsx)(t.h2, { id: `variable-rendering`, children: `Variable Rendering` }),
      `
`,
      (0, _.jsxs)(t.table, {
        children: [
          (0, _.jsx)(t.thead, {
            children: (0, _.jsxs)(t.tr, {
              children: [
                (0, _.jsx)(t.th, { children: `Token type` }),
                (0, _.jsx)(t.th, { children: `Rendering` }),
              ],
            }),
          }),
          (0, _.jsxs)(t.tbody, {
            children: [
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: `Resolved variable` }),
                  (0, _.jsx)(t.td, { children: `Value substituted inline — no chip` }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsxs)(t.td, {
                    children: [`Unresolved `, (0, _.jsx)(t.code, { children: `{{variable}}` })],
                  }),
                  (0, _.jsxs)(t.td, {
                    children: [
                      `Yellow warning chip (`,
                      (0, _.jsx)(t.code, {
                        children: `bg-warning/20 text-warning border-warning/30`,
                      }),
                      `)`,
                    ],
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsxs)(t.td, {
                    children: [`Dynamic `, (0, _.jsx)(t.code, { children: `{{$variable}}` })],
                  }),
                  (0, _.jsx)(t.td, {
                    children: `Italic muted monospace — value computed at send time`,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
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
          (0, _.jsx)(t.tbody, {
            children: (0, _.jsxs)(t.tr, {
              children: [
                (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `requestId` }) }),
                (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `string` }) }),
                (0, _.jsxs)(t.td, {
                  children: [
                    `The request ID used to look up `,
                    (0, _.jsx)(t.code, { children: `requestStates[requestId]` }),
                    ` and `,
                    (0, _.jsx)(t.code, { children: `resolvedVariables[requestId]` }),
                    ` in `,
                    (0, _.jsx)(t.code, { children: `requestStore` }),
                    `. Typically the active tab ID.`,
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      `
`,
      (0, _.jsx)(t.h2, { id: `behaviour-notes`, children: `Behaviour Notes` }),
      `
`,
      (0, _.jsxs)(t.ul, {
        children: [
          `
`,
          (0, _.jsxs)(t.li, {
            children: [
              (0, _.jsx)(t.strong, { children: `Query string source` }),
              ` — the preview bar builds the query string from `,
              (0, _.jsx)(t.code, { children: `tabState.params` }),
              ` (the Zustand array of enabled key/value pairs), `,
              (0, _.jsx)(t.strong, { children: `not` }),
              ` from any inline `,
              (0, _.jsx)(t.code, { children: `?key=value` }),
              ` syntax in the URL string. Inline query syntax in the URL is stripped when `,
              (0, _.jsx)(t.code, { children: `?` }),
              ` is found; only the `,
              (0, _.jsx)(t.code, { children: `params` }),
              ` array drives the query string.`,
            ],
          }),
          `
`,
          (0, _.jsxs)(t.li, {
            children: [
              (0, _.jsx)(t.strong, { children: `Secret masking` }),
              ` — a variable is masked only when it appears in a `,
              (0, _.jsx)(t.em, { children: `resolved` }),
              ` entry with `,
              (0, _.jsx)(t.code, { children: `secret: true` }),
              `. Unresolved variables that happen to be named `,
              (0, _.jsx)(t.code, { children: `apiKey` }),
              ` are not masked — they render as unresolved chips.`,
            ],
          }),
          `
`,
          (0, _.jsxs)(t.li, {
            children: [
              (0, _.jsx)(t.strong, { children: `Copy unmasked` }),
              ` — the copy button always copies the unmasked URL (real secret values). The display URL masks secrets; the clipboard value does not. This allows pasting into curl or a browser address bar.`,
            ],
          }),
          `
`,
          (0, _.jsxs)(t.li, {
            children: [
              (0, _.jsx)(t.strong, { children: `Empty state` }),
              ` — when `,
              (0, _.jsx)(t.code, { children: `tabState` }),
              ` is `,
              (0, _.jsx)(t.code, { children: `undefined` }),
              ` or `,
              (0, _.jsx)(t.code, { children: `tabState.url` }),
              ` is empty, the component returns `,
              (0, _.jsx)(t.code, { children: `null` }),
              `. No wrapper `,
              (0, _.jsx)(t.code, { children: `<div>` }),
              ` is rendered, so the surrounding layout does not reserve height.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, _.jsx)(t.h2, { id: `store-dependencies`, children: `Store Dependencies` }),
      `
`,
      (0, _.jsxs)(t.table, {
        children: [
          (0, _.jsx)(t.thead, {
            children: (0, _.jsxs)(t.tr, {
              children: [
                (0, _.jsx)(t.th, { children: `Store` }),
                (0, _.jsx)(t.th, { children: `Field` }),
                (0, _.jsx)(t.th, { children: `Purpose` }),
              ],
            }),
          }),
          (0, _.jsxs)(t.tbody, {
            children: [
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `requestStore` }) }),
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `requestStates[requestId]` }),
                  }),
                  (0, _.jsx)(t.td, {
                    children: `URL, enabled params, and method for the given request`,
                  }),
                ],
              }),
              (0, _.jsxs)(t.tr, {
                children: [
                  (0, _.jsx)(t.td, { children: (0, _.jsx)(t.code, { children: `requestStore` }) }),
                  (0, _.jsx)(t.td, {
                    children: (0, _.jsx)(t.code, { children: `resolvedVariables[requestId]` }),
                  }),
                  (0, _.jsx)(t.td, {
                    children: `Variable resolution map used for substitution and secret detection`,
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
function g(e = {}) {
  let { wrapper: t } = { ...n(), ...e.components }
  return t ? (0, _.jsx)(t, { ...e, children: (0, _.jsx)(h, { ...e }) }) : h(e)
}
var _
e(() => {
  ;((_ = t()), o(), a(), p())
})()
export { g as default }
