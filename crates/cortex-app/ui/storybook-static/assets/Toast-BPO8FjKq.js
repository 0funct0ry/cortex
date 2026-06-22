import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  Default as s,
  Error as c,
  Info as l,
  LongMessage as u,
  Success as d,
  n as f,
  t as p,
} from './Toast.stories-C_pzVCvV.js'
function m(e) {
  let t = {
    a: `a`,
    code: `code`,
    h1: `h1`,
    h2: `h2`,
    h3: `h3`,
    hr: `hr`,
    p: `p`,
    table: `table`,
    tbody: `tbody`,
    td: `td`,
    th: `th`,
    thead: `thead`,
    tr: `tr`,
    ...n(),
    ...e.components,
  }
  return (0, g.jsxs)(g.Fragment, {
    children: [
      (0, g.jsx)(i, { of: p }),
      `
`,
      (0, g.jsx)(t.h1, { id: `toast`, children: `Toast` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `A single notification toast rendered as a horizontally-laid-out card with a coloured left border, a type icon, the message text, and a dismiss button. Toasts are managed by `,
          (0, g.jsx)(t.code, { children: `useToastStore` }),
          ` — the `,
          (0, g.jsx)(t.code, { children: `id` }),
          ` prop connects the dismiss button to the store's `,
          (0, g.jsx)(t.code, { children: `removeToast` }),
          ` action.`,
        ],
      }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, g.jsx)(t.a, {
            href: `../../../components/ui/Toast.tsx`,
            children: (0, g.jsx)(t.code, { children: `src/components/ui/Toast.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `default`, children: `Default` }),
      `
`,
      (0, g.jsx)(r, { of: s }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `variants`, children: `Variants` }),
      `
`,
      (0, g.jsx)(t.h3, { id: `success`, children: `Success` }),
      `
`,
      (0, g.jsx)(r, { of: d }),
      `
`,
      (0, g.jsx)(t.h3, { id: `error`, children: `Error` }),
      `
`,
      (0, g.jsx)(r, { of: c }),
      `
`,
      (0, g.jsx)(t.h3, { id: `info`, children: `Info` }),
      `
`,
      (0, g.jsx)(r, { of: l }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `long-message`, children: `Long Message` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Text wraps within the `,
          (0, g.jsx)(t.code, { children: `min-w-[300px] max-w-[450px]` }),
          ` constraints. The toast never overflows those bounds.`,
        ],
      }),
      `
`,
      (0, g.jsx)(r, { of: u }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `props`, children: `Props` }),
      `
`,
      (0, g.jsxs)(t.table, {
        children: [
          (0, g.jsx)(t.thead, {
            children: (0, g.jsxs)(t.tr, {
              children: [
                (0, g.jsx)(t.th, { children: `Prop` }),
                (0, g.jsx)(t.th, { children: `Type` }),
                (0, g.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, g.jsxs)(t.tbody, {
            children: [
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `id` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `string` }) }),
                  (0, g.jsxs)(t.td, {
                    children: [
                      `Unique identifier; passed to `,
                      (0, g.jsx)(t.code, { children: `removeToast` }),
                      ` on dismiss`,
                    ],
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `type` }) }),
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `'success' | 'error' | 'info'` }),
                  }),
                  (0, g.jsx)(t.td, { children: `Controls border colour and icon` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `message` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `string` }) }),
                  (0, g.jsx)(t.td, { children: `Notification text` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, g.jsx)(t.h2, { id: `design-tokens-used`, children: `Design tokens used` }),
      `
`,
      (0, g.jsxs)(t.table, {
        children: [
          (0, g.jsx)(t.thead, {
            children: (0, g.jsxs)(t.tr, {
              children: [
                (0, g.jsx)(t.th, { children: `Token` }),
                (0, g.jsx)(t.th, { children: `Role` }),
              ],
            }),
          }),
          (0, g.jsxs)(t.tbody, {
            children: [
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `--color-success` }),
                  }),
                  (0, g.jsx)(t.td, { children: `Left border + icon for success variant` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `--color-error` }) }),
                  (0, g.jsx)(t.td, { children: `Left border + icon for error variant` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `--color-info` }) }),
                  (0, g.jsx)(t.td, { children: `Left border + icon for info variant` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `--color-bg-overlay` }),
                  }),
                  (0, g.jsx)(t.td, { children: `Toast background surface` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `--color-bg-highlight` }),
                  }),
                  (0, g.jsx)(t.td, { children: `Dismiss button hover background` }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
function h(e = {}) {
  let { wrapper: t } = { ...n(), ...e.components }
  return t ? (0, g.jsx)(t, { ...e, children: (0, g.jsx)(m, { ...e }) }) : m(e)
}
var g
e(() => {
  ;((g = t()), o(), a(), f())
})()
export { h as default }
