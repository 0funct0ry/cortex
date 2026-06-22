import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  BinaryWarning as s,
  LongBody as c,
  RawText as l,
  n as u,
  t as d,
} from './ResponseRawTab.stories-CGiivpYH.js'
function f(e) {
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
  return (0, m.jsxs)(m.Fragment, {
    children: [
      (0, m.jsx)(i, { of: d }),
      `
`,
      (0, m.jsx)(t.h1, { id: `responserawtab`, children: `ResponseRawTab` }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `Renders the raw response body exactly as received from the server — no syntax highlighting, no parsing, no interpretation. The text is displayed in a monospace, `,
          (0, m.jsx)(t.code, { children: `whitespace-pre-wrap` }),
          `, selectable container that scrolls vertically when the body is long.`,
        ],
      }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, m.jsx)(t.a, {
            href: `../../../components/layout/ResponseRawTab.tsx`,
            children: (0, m.jsx)(t.code, { children: `src/components/layout/ResponseRawTab.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `raw-text`, children: `Raw text` }),
      `
`,
      (0, m.jsx)(t.p, {
        children: `A small, well-formatted JSON response. The font is monospace and the text is fully selectable for copy-paste.`,
      }),
      `
`,
      (0, m.jsx)(r, { of: l }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `long-body`, children: `Long body` }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `120 lines of text. Verifies that the container scrolls vertically without clipping content or causing horizontal overflow. The `,
          (0, m.jsx)(t.code, { children: `whitespace-pre-wrap` }),
          ` rule means long lines wrap rather than triggering horizontal scroll.`,
        ],
      }),
      `
`,
      (0, m.jsx)(r, { of: c }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `binary-warning`, children: `Binary warning` }),
      `
`,
      (0, m.jsx)(t.p, {
        children: `Documents the convention for binary or non-printable responses. The executor substitutes a human-readable placeholder string rather than attempting to render raw bytes in the browser.`,
      }),
      `
`,
      (0, m.jsx)(r, { of: s }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `props`, children: `Props` }),
      `
`,
      (0, m.jsxs)(t.table, {
        children: [
          (0, m.jsx)(t.thead, {
            children: (0, m.jsxs)(t.tr, {
              children: [
                (0, m.jsx)(t.th, { children: `Prop` }),
                (0, m.jsx)(t.th, { children: `Type` }),
                (0, m.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, m.jsx)(t.tbody, {
            children: (0, m.jsxs)(t.tr, {
              children: [
                (0, m.jsx)(t.td, { children: (0, m.jsx)(t.code, { children: `response` }) }),
                (0, m.jsx)(t.td, { children: (0, m.jsx)(t.code, { children: `ResponsePayload` }) }),
                (0, m.jsxs)(t.td, {
                  children: [
                    `The completed response object. Only `,
                    (0, m.jsx)(t.code, { children: `response.body` }),
                    ` is rendered; other fields are used by sibling tabs.`,
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      `
`,
      (0, m.jsx)(t.h2, { id: `rendering-contract`, children: `Rendering contract` }),
      `
`,
      (0, m.jsxs)(t.ul, {
        children: [
          `
`,
          (0, m.jsx)(t.li, {
            children: `Body is rendered verbatim — no JSON formatting, no HTML escaping beyond what React provides.`,
          }),
          `
`,
          (0, m.jsxs)(t.li, {
            children: [
              `Container uses `,
              (0, m.jsx)(t.code, { children: `overflow-auto` }),
              ` so long bodies scroll instead of clipping.`,
            ],
          }),
          `
`,
          (0, m.jsxs)(t.li, {
            children: [
              `Text selection (`,
              (0, m.jsx)(t.code, { children: `select-text` }),
              `) is enabled with an accent highlight (`,
              (0, m.jsx)(t.code, { children: `selection:bg-accent/30` }),
              `) so users can easily copy portions of the response.`,
            ],
          }),
          `
`,
          (0, m.jsxs)(t.li, {
            children: [
              `Background is `,
              (0, m.jsx)(t.code, { children: `bg-bg-surface` }),
              ` — one step lighter than `,
              (0, m.jsx)(t.code, { children: `bg-bg-base` }),
              `, matching the panel hosting the tab.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, m.jsx)(t.h2, { id: `binary-content`, children: `Binary content` }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `When the server returns a binary content-type (`,
          (0, m.jsx)(t.code, { children: `application/octet-stream` }),
          `, `,
          (0, m.jsx)(t.code, { children: `image/*` }),
          `, etc.), the Rust executor substitutes a placeholder string rather than trying to decode arbitrary bytes as UTF-8. The raw tab displays this placeholder as-is. Use the `,
          (0, m.jsx)(t.strong, { children: `Save` }),
          ` button in the `,
          (0, m.jsx)(t.code, { children: `ResponseMetaBar` }),
          ` to download the actual binary file.`,
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
