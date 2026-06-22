import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import { AllMethods as s, Default as c, n as l, t as u } from './MethodBadge.stories-Br5fl0Qx.js'
function d(e) {
  let t = {
    a: `a`,
    code: `code`,
    h1: `h1`,
    h2: `h2`,
    hr: `hr`,
    p: `p`,
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
  return (0, p.jsxs)(p.Fragment, {
    children: [
      (0, p.jsx)(i, { of: u }),
      `
`,
      (0, p.jsx)(t.h1, { id: `methodbadge`, children: `MethodBadge` }),
      `
`,
      (0, p.jsxs)(t.p, {
        children: [
          `A compact, colour-coded badge that identifies the HTTP method of a request. Each method maps to a dedicated design-token colour pair (`,
          (0, p.jsx)(t.code, { children: `text-method-<m>` }),
          ` / `,
          (0, p.jsx)(t.code, { children: `bg-method-<m>/15` }),
          `) so badges remain legible across all 13 Cortex themes.`,
        ],
      }),
      `
`,
      (0, p.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, p.jsx)(t.a, {
            href: `../../../components/ui/MethodBadge.tsx`,
            children: (0, p.jsx)(t.code, { children: `src/components/ui/MethodBadge.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, p.jsx)(t.hr, {}),
      `
`,
      (0, p.jsx)(t.h2, { id: `default`, children: `Default` }),
      `
`,
      (0, p.jsx)(r, { of: c }),
      `
`,
      (0, p.jsx)(t.hr, {}),
      `
`,
      (0, p.jsx)(t.h2, { id: `all-methods`, children: `All Methods` }),
      `
`,
      (0, p.jsxs)(t.p, {
        children: [
          `Every supported method rendered side-by-side. Switch the `,
          (0, p.jsx)(t.strong, { children: `Theme` }),
          ` toolbar to verify colour contrast across all 13 themes.`,
        ],
      }),
      `
`,
      (0, p.jsx)(r, { of: s }),
      `
`,
      (0, p.jsx)(t.hr, {}),
      `
`,
      (0, p.jsx)(t.h2, { id: `variants`, children: `Variants` }),
      `
`,
      (0, p.jsxs)(t.table, {
        children: [
          (0, p.jsx)(t.thead, {
            children: (0, p.jsxs)(t.tr, {
              children: [
                (0, p.jsx)(t.th, { children: `Story` }),
                (0, p.jsx)(t.th, { children: `Method` }),
                (0, p.jsx)(t.th, { children: `Token` }),
              ],
            }),
          }),
          (0, p.jsxs)(t.tbody, {
            children: [
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: `Get` }),
                  (0, p.jsx)(t.td, { children: `GET` }),
                  (0, p.jsx)(t.td, {
                    children: (0, p.jsx)(t.code, { children: `--color-method-get` }),
                  }),
                ],
              }),
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: `Post` }),
                  (0, p.jsx)(t.td, { children: `POST` }),
                  (0, p.jsx)(t.td, {
                    children: (0, p.jsx)(t.code, { children: `--color-method-post` }),
                  }),
                ],
              }),
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: `Put` }),
                  (0, p.jsx)(t.td, { children: `PUT` }),
                  (0, p.jsx)(t.td, {
                    children: (0, p.jsx)(t.code, { children: `--color-method-put` }),
                  }),
                ],
              }),
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: `Patch` }),
                  (0, p.jsx)(t.td, { children: `PATCH` }),
                  (0, p.jsx)(t.td, {
                    children: (0, p.jsx)(t.code, { children: `--color-method-patch` }),
                  }),
                ],
              }),
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: `Delete` }),
                  (0, p.jsx)(t.td, { children: `DELETE` }),
                  (0, p.jsx)(t.td, {
                    children: (0, p.jsx)(t.code, { children: `--color-method-delete` }),
                  }),
                ],
              }),
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: `Head` }),
                  (0, p.jsx)(t.td, { children: `HEAD` }),
                  (0, p.jsx)(t.td, {
                    children: (0, p.jsx)(t.code, { children: `--color-method-head` }),
                  }),
                ],
              }),
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: `Options` }),
                  (0, p.jsx)(t.td, { children: `OPTIONS` }),
                  (0, p.jsx)(t.td, {
                    children: (0, p.jsx)(t.code, { children: `--color-method-options` }),
                  }),
                ],
              }),
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: `Ws` }),
                  (0, p.jsx)(t.td, { children: `WS` }),
                  (0, p.jsx)(t.td, {
                    children: (0, p.jsx)(t.code, { children: `--color-method-ws` }),
                  }),
                ],
              }),
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: `Sse` }),
                  (0, p.jsx)(t.td, { children: `SSE` }),
                  (0, p.jsx)(t.td, {
                    children: (0, p.jsx)(t.code, { children: `--color-method-sse` }),
                  }),
                ],
              }),
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: `Grpc` }),
                  (0, p.jsx)(t.td, { children: `GRPC` }),
                  (0, p.jsx)(t.td, {
                    children: (0, p.jsx)(t.code, { children: `--color-method-grpc` }),
                  }),
                ],
              }),
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: `GraphQl` }),
                  (0, p.jsx)(t.td, { children: `GraphQL` }),
                  (0, p.jsx)(t.td, {
                    children: (0, p.jsx)(t.code, { children: `--color-method-graphql` }),
                  }),
                ],
              }),
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: `Trace` }),
                  (0, p.jsx)(t.td, { children: `TRACE` }),
                  (0, p.jsx)(t.td, {
                    children: (0, p.jsx)(t.code, { children: `--color-method-trace` }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, p.jsx)(t.hr, {}),
      `
`,
      (0, p.jsx)(t.h2, { id: `props`, children: `Props` }),
      `
`,
      (0, p.jsxs)(t.table, {
        children: [
          (0, p.jsx)(t.thead, {
            children: (0, p.jsxs)(t.tr, {
              children: [
                (0, p.jsx)(t.th, { children: `Prop` }),
                (0, p.jsx)(t.th, { children: `Type` }),
                (0, p.jsx)(t.th, { children: `Default` }),
                (0, p.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, p.jsxs)(t.tbody, {
            children: [
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: (0, p.jsx)(t.code, { children: `method` }) }),
                  (0, p.jsx)(t.td, { children: (0, p.jsx)(t.code, { children: `string` }) }),
                  (0, p.jsx)(t.td, { children: `—` }),
                  (0, p.jsx)(t.td, { children: `HTTP method string (case-insensitive match)` }),
                ],
              }),
              (0, p.jsxs)(t.tr, {
                children: [
                  (0, p.jsx)(t.td, { children: (0, p.jsx)(t.code, { children: `className` }) }),
                  (0, p.jsx)(t.td, { children: (0, p.jsx)(t.code, { children: `string` }) }),
                  (0, p.jsx)(t.td, { children: (0, p.jsx)(t.code, { children: `''` }) }),
                  (0, p.jsx)(t.td, {
                    children: `Additional Tailwind classes for layout overrides`,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, p.jsxs)(t.p, {
        children: [
          `The component normalises `,
          (0, p.jsx)(t.code, { children: `method` }),
          ` to lowercase before matching, so `,
          (0, p.jsx)(t.code, { children: `'GET'` }),
          `, `,
          (0, p.jsx)(t.code, { children: `'get'` }),
          `, and `,
          (0, p.jsx)(t.code, { children: `'Get'` }),
          ` all render identically. Unknown methods fall back to a muted neutral style.`,
        ],
      }),
    ],
  })
}
function f(e = {}) {
  let { wrapper: t } = { ...n(), ...e.components }
  return t ? (0, p.jsx)(t, { ...e, children: (0, p.jsx)(d, { ...e }) }) : d(e)
}
var p
e(() => {
  ;((p = t()), o(), a(), l())
})()
export { f as default }
