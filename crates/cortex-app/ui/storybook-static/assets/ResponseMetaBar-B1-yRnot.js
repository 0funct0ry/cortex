import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  Loading as s,
  MultipartResponse as c,
  NoResponse as l,
  Status200 as u,
  Status404 as d,
  Status500 as f,
  WithRedirectChain as p,
  n as m,
  t as h,
} from './ResponseMetaBar.stories-BVHSw9lf.js'
function g(e) {
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
  return (0, v.jsxs)(v.Fragment, {
    children: [
      (0, v.jsx)(i, { of: h }),
      `
`,
      (0, v.jsx)(t.h1, { id: `responsemetabar`, children: `ResponseMetaBar` }),
      `
`,
      (0, v.jsx)(t.p, {
        children: `A fixed-height (36 px) status strip rendered above every response panel. It communicates HTTP status, duration, body size, redirect history, and multipart parse state at a glance — and provides one-click access to copy or save the response body.`,
      }),
      `
`,
      (0, v.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, v.jsx)(t.a, {
            href: `../../../components/layout/ResponseMetaBar.tsx`,
            children: (0, v.jsx)(t.code, { children: `src/components/layout/ResponseMetaBar.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, v.jsx)(t.hr, {}),
      `
`,
      (0, v.jsx)(t.h2, { id: `no-response`, children: `No response` }),
      `
`,
      (0, v.jsx)(t.p, {
        children: `Before any request has been sent for the active tab. A muted "RESPONSE" label occupies the bar as a placeholder.`,
      }),
      `
`,
      (0, v.jsx)(r, { of: l }),
      `
`,
      (0, v.jsx)(t.hr, {}),
      `
`,
      (0, v.jsx)(t.h2, { id: `loading`, children: `Loading` }),
      `
`,
      (0, v.jsxs)(t.p, {
        children: [
          `While a request is in-flight (`,
          (0, v.jsx)(t.code, { children: `inFlight=true` }),
          `). Three skeleton pill animations replace the status/duration/size slots. The bar remains full-width and does not shift layout.`,
        ],
      }),
      `
`,
      (0, v.jsx)(r, { of: s }),
      `
`,
      (0, v.jsx)(t.hr, {}),
      `
`,
      (0, v.jsx)(t.h2, { id: `status-200-ok`, children: `Status 200 OK` }),
      `
`,
      (0, v.jsx)(t.p, {
        children: `A successful response. Green badge, sub-200 ms duration (green), and body size in human-readable units.`,
      }),
      `
`,
      (0, v.jsx)(r, { of: u }),
      `
`,
      (0, v.jsx)(t.hr, {}),
      `
`,
      (0, v.jsx)(t.h2, { id: `status-404-not-found`, children: `Status 404 Not Found` }),
      `
`,
      (0, v.jsxs)(t.p, {
        children: [
          `A client error. The status badge uses the error colour token (`,
          (0, v.jsx)(t.code, { children: `bg-error-muted / text-error` }),
          `).`,
        ],
      }),
      `
`,
      (0, v.jsx)(r, { of: d }),
      `
`,
      (0, v.jsx)(t.hr, {}),
      `
`,
      (0, v.jsx)(t.h2, {
        id: `status-500-internal-server-error`,
        children: `Status 500 Internal Server Error`,
      }),
      `
`,
      (0, v.jsx)(t.p, {
        children: `A server error with a slow duration (>1000 ms → red duration text).`,
      }),
      `
`,
      (0, v.jsx)(r, { of: f }),
      `
`,
      (0, v.jsx)(t.hr, {}),
      `
`,
      (0, v.jsx)(t.h2, { id: `with-redirect-chain`, children: `With redirect chain` }),
      `
`,
      (0, v.jsx)(t.p, {
        children: `The request followed two redirects before settling. An amber pill shows the redirect count and the final status. Clicking it opens a popover listing each hop with its method, URL, and status code.`,
      }),
      `
`,
      (0, v.jsx)(r, { of: p }),
      `
`,
      (0, v.jsx)(t.hr, {}),
      `
`,
      (0, v.jsx)(t.h2, { id: `multipart-response`, children: `Multipart response` }),
      `
`,
      (0, v.jsxs)(t.p, {
        children: [
          `When the `,
          (0, v.jsx)(t.code, { children: `content-type` }),
          ` header is `,
          (0, v.jsx)(t.code, { children: `multipart/mixed` }),
          ` or `,
          (0, v.jsx)(t.code, { children: `multipart/form-data` }),
          `, a `,
          (0, v.jsx)(t.strong, { children: `Parse Multipart` }),
          ` checkbox appears. Toggling it switches the response view between raw and parsed-parts mode (handled by `,
          (0, v.jsx)(t.code, { children: `ResponseMultipartTab` }),
          `).`,
        ],
      }),
      `
`,
      (0, v.jsx)(r, { of: c }),
      `
`,
      (0, v.jsx)(t.hr, {}),
      `
`,
      (0, v.jsx)(t.h2, { id: `props`, children: `Props` }),
      `
`,
      (0, v.jsxs)(t.table, {
        children: [
          (0, v.jsx)(t.thead, {
            children: (0, v.jsxs)(t.tr, {
              children: [
                (0, v.jsx)(t.th, { children: `Prop` }),
                (0, v.jsx)(t.th, { children: `Type` }),
                (0, v.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, v.jsxs)(t.tbody, {
            children: [
              (0, v.jsxs)(t.tr, {
                children: [
                  (0, v.jsx)(t.td, { children: (0, v.jsx)(t.code, { children: `response` }) }),
                  (0, v.jsx)(t.td, {
                    children: (0, v.jsx)(t.code, { children: `ResponsePayload | null` }),
                  }),
                  (0, v.jsxs)(t.td, {
                    children: [
                      `The completed response, or `,
                      (0, v.jsx)(t.code, { children: `null` }),
                      ` before a request is sent`,
                    ],
                  }),
                ],
              }),
              (0, v.jsxs)(t.tr, {
                children: [
                  (0, v.jsx)(t.td, { children: (0, v.jsx)(t.code, { children: `inFlight` }) }),
                  (0, v.jsx)(t.td, { children: (0, v.jsx)(t.code, { children: `boolean` }) }),
                  (0, v.jsxs)(t.td, {
                    children: [
                      (0, v.jsx)(t.code, { children: `true` }),
                      ` while the HTTP request is executing; renders skeleton state`,
                    ],
                  }),
                ],
              }),
              (0, v.jsxs)(t.tr, {
                children: [
                  (0, v.jsx)(t.td, { children: (0, v.jsx)(t.code, { children: `requestId` }) }),
                  (0, v.jsx)(t.td, { children: (0, v.jsx)(t.code, { children: `string` }) }),
                  (0, v.jsx)(t.td, {
                    children: `Keys multipart-enabled state in the response store`,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, v.jsx)(t.h2, { id: `status-badge-colours`, children: `Status badge colours` }),
      `
`,
      (0, v.jsxs)(t.table, {
        children: [
          (0, v.jsx)(t.thead, {
            children: (0, v.jsxs)(t.tr, {
              children: [
                (0, v.jsx)(t.th, { children: `Status range` }),
                (0, v.jsx)(t.th, { children: `Colour token` }),
              ],
            }),
          }),
          (0, v.jsxs)(t.tbody, {
            children: [
              (0, v.jsxs)(t.tr, {
                children: [
                  (0, v.jsx)(t.td, { children: `2xx` }),
                  (0, v.jsx)(t.td, {
                    children: (0, v.jsx)(t.code, {
                      children: `bg-success-muted text-success border-success/20`,
                    }),
                  }),
                ],
              }),
              (0, v.jsxs)(t.tr, {
                children: [
                  (0, v.jsx)(t.td, { children: `3xx` }),
                  (0, v.jsx)(t.td, {
                    children: (0, v.jsx)(t.code, {
                      children: `bg-warning-muted text-warning border-warning/20`,
                    }),
                  }),
                ],
              }),
              (0, v.jsxs)(t.tr, {
                children: [
                  (0, v.jsx)(t.td, { children: `4xx / 5xx` }),
                  (0, v.jsx)(t.td, {
                    children: (0, v.jsx)(t.code, {
                      children: `bg-error-muted text-error border-error/20`,
                    }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, v.jsx)(t.h2, { id: `duration-colours`, children: `Duration colours` }),
      `
`,
      (0, v.jsxs)(t.table, {
        children: [
          (0, v.jsx)(t.thead, {
            children: (0, v.jsxs)(t.tr, {
              children: [
                (0, v.jsx)(t.th, { children: `Threshold` }),
                (0, v.jsx)(t.th, { children: `Colour` }),
              ],
            }),
          }),
          (0, v.jsxs)(t.tbody, {
            children: [
              (0, v.jsxs)(t.tr, {
                children: [
                  (0, v.jsx)(t.td, { children: `≤ 200 ms` }),
                  (0, v.jsxs)(t.td, {
                    children: [(0, v.jsx)(t.code, { children: `text-success` }), ` (green)`],
                  }),
                ],
              }),
              (0, v.jsxs)(t.tr, {
                children: [
                  (0, v.jsx)(t.td, { children: `201–1000 ms` }),
                  (0, v.jsxs)(t.td, {
                    children: [(0, v.jsx)(t.code, { children: `text-warning` }), ` (amber)`],
                  }),
                ],
              }),
              (0, v.jsxs)(t.tr, {
                children: [
                  (0, v.jsx)(t.td, { children: `> 1000 ms` }),
                  (0, v.jsxs)(t.td, {
                    children: [(0, v.jsx)(t.code, { children: `text-error` }), ` (red)`],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, v.jsx)(t.h2, { id: `size-formatting`, children: `Size formatting` }),
      `
`,
      (0, v.jsx)(t.p, {
        children: `Body size is reported in bytes, KB, or MB depending on magnitude:`,
      }),
      `
`,
      (0, v.jsxs)(t.ul, {
        children: [
          `
`,
          (0, v.jsxs)(t.li, {
            children: [
              (0, v.jsx)(t.code, { children: `< 1 024 B` }),
              ` → `,
              (0, v.jsx)(t.code, { children: `{n} B` }),
            ],
          }),
          `
`,
          (0, v.jsxs)(t.li, {
            children: [
              (0, v.jsx)(t.code, { children: `< 1 MB` }),
              ` → `,
              (0, v.jsx)(t.code, { children: `{n} KB` }),
              ` (1 decimal place)`,
            ],
          }),
          `
`,
          (0, v.jsxs)(t.li, {
            children: [
              (0, v.jsx)(t.code, { children: `≥ 1 MB` }),
              ` → `,
              (0, v.jsx)(t.code, { children: `{n} MB` }),
              ` (1 decimal place)`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, v.jsx)(t.h2, { id: `redirect-chain`, children: `Redirect chain` }),
      `
`,
      (0, v.jsxs)(t.p, {
        children: [
          `The `,
          (0, v.jsx)(t.code, { children: `redirectChain` }),
          ` field of `,
          (0, v.jsx)(t.code, { children: `ResponsePayload` }),
          ` is a `,
          (0, v.jsx)(t.code, { children: `RedirectHop[]` }),
          ` where each hop records `,
          (0, v.jsx)(t.code, { children: `{ method, url, status_code }` }),
          `. The popover lists them in order with index labels (`,
          (0, v.jsx)(t.code, { children: `#1` }),
          `, `,
          (0, v.jsx)(t.code, { children: `#2` }),
          `, …). It is dismissed by clicking outside (via `,
          (0, v.jsx)(t.code, { children: `mousedown` }),
          ` listener).`,
        ],
      }),
      `
`,
      (0, v.jsx)(t.h2, { id: `tauri-ipc-dependency`, children: `Tauri IPC dependency` }),
      `
`,
      (0, v.jsxs)(t.p, {
        children: [
          `The Save button calls `,
          (0, v.jsx)(t.code, { children: `commands.saveFile(…)` }),
          ` to open the native OS save dialog. In Storybook, this is mocked via `,
          (0, v.jsx)(t.code, { children: `parameters.tauriMock: { save_file: () => null }` }),
          ` so the button can be clicked without throwing.`,
        ],
      }),
    ],
  })
}
function _(e = {}) {
  let { wrapper: t } = { ...n(), ...e.components }
  return t ? (0, v.jsx)(t, { ...e, children: (0, v.jsx)(g, { ...e }) }) : g(e)
}
var v
e(() => {
  ;((v = t()), o(), a(), m())
})()
export { _ as default }
