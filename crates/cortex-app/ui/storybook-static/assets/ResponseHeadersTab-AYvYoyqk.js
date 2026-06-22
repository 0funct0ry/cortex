import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  Empty as s,
  ManyHeaders as c,
  RedirectResponse as l,
  WithHeaders as u,
  n as d,
  t as f,
} from './ResponseHeadersTab.stories-B3HO9XIb.js'
function p(e) {
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
  return (0, h.jsxs)(h.Fragment, {
    children: [
      (0, h.jsx)(i, { of: f }),
      `
`,
      (0, h.jsx)(t.h1, { id: `responseheaderstab`, children: `ResponseHeadersTab` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `Renders the HTTP response headers returned by the server in a sortable two-column table (Name / Value). Headers are sorted alphabetically. Each row reveals a copy-to-clipboard button on hover. Redirect responses (3xx status codes) receive special treatment: a warning banner appears at the top and the `,
          (0, h.jsx)(t.code, { children: `location` }),
          ` header row is highlighted with a warning accent border and a "Redirect Location" badge.`,
        ],
      }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, h.jsx)(t.a, {
            href: `../../../components/layout/ResponseHeadersTab.tsx`,
            children: (0, h.jsx)(t.code, {
              children: `src/components/layout/ResponseHeadersTab.tsx`,
            }),
          }),
        ],
      }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `empty`, children: `Empty` }),
      `
`,
      (0, h.jsx)(t.p, {
        children: `A 200 response with no headers. The table renders the sticky header row (Name / Value) but the body is empty.`,
      }),
      `
`,
      (0, h.jsx)(r, { of: s }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `with-headers`, children: `With headers` }),
      `
`,
      (0, h.jsx)(t.p, {
        children: `Nine varied headers typical of a REST JSON API response — content-type, cache-control, rate-limit headers, CORS, and a request trace ID. Hovering any row reveals the per-row copy button.`,
      }),
      `
`,
      (0, h.jsx)(r, { of: u }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `redirect-response`, children: `Redirect response` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `A 301 Moved Permanently response with a `,
          (0, h.jsx)(t.code, { children: `location` }),
          ` header. The redirect warning banner is shown at the top, and the `,
          (0, h.jsx)(t.code, { children: `location` }),
          ` row receives a left warning-colour border plus the "Redirect Location" badge.`,
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
      (0, h.jsx)(t.h2, { id: `many-headers`, children: `Many headers` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `Twenty-four custom headers to verify the container scrolls vertically and alternating row backgrounds (even: `,
          (0, h.jsx)(t.code, { children: `bg-bg-surface` }),
          `, odd: `,
          (0, h.jsx)(t.code, { children: `bg-bg-muted/30` }),
          `) remain correct throughout a long list.`,
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
      (0, h.jsx)(t.h2, { id: `props`, children: `Props` }),
      `
`,
      (0, h.jsxs)(t.table, {
        children: [
          (0, h.jsx)(t.thead, {
            children: (0, h.jsxs)(t.tr, {
              children: [
                (0, h.jsx)(t.th, { children: `Prop` }),
                (0, h.jsx)(t.th, { children: `Type` }),
                (0, h.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, h.jsx)(t.tbody, {
            children: (0, h.jsxs)(t.tr, {
              children: [
                (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `response` }) }),
                (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `ResponsePayload` }) }),
                (0, h.jsxs)(t.td, {
                  children: [
                    `The full response object. Only `,
                    (0, h.jsx)(t.code, { children: `.headers` }),
                    ` and `,
                    (0, h.jsx)(t.code, { children: `.status` }),
                    ` are used by this tab.`,
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      `
`,
      (0, h.jsx)(t.h2, { id: `redirect-highlighting`, children: `Redirect highlighting` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `When `,
          (0, h.jsx)(t.code, { children: `response.status` }),
          ` is in the range 300–399 `,
          (0, h.jsx)(t.strong, { children: `and` }),
          ` a `,
          (0, h.jsx)(t.code, { children: `location` }),
          ` (case-insensitive) header is present:`,
        ],
      }),
      `
`,
      (0, h.jsxs)(t.ul, {
        children: [
          `
`,
          (0, h.jsx)(t.li, {
            children: `A warning banner is shown above the table with the redirect URL (click to copy).`,
          }),
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              `The `,
              (0, h.jsx)(t.code, { children: `location` }),
              ` header row receives `,
              (0, h.jsx)(t.code, { children: `bg-warning/10` }),
              ` background and a 3 px left `,
              (0, h.jsx)(t.code, { children: `border-l-warning` }),
              ` accent.`,
            ],
          }),
          `
`,
          (0, h.jsx)(t.li, {
            children: `A "Redirect Location" badge appears next to the header name.`,
          }),
          `
`,
        ],
      }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `This state occurs when the request's `,
          (0, h.jsx)(t.strong, { children: `Do not follow redirects` }),
          ` setting is active. Users can enable automatic redirect following in the request Settings tab.`,
        ],
      }),
      `
`,
      (0, h.jsx)(t.h2, { id: `row-interactions`, children: `Row interactions` }),
      `
`,
      (0, h.jsxs)(t.ul, {
        children: [
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              (0, h.jsx)(t.strong, { children: `Hover` }),
              ` — a copy icon button fades in at the right edge of the Value cell.`,
            ],
          }),
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              (0, h.jsx)(t.strong, { children: `Click copy` }),
              ` — writes `,
              (0, h.jsx)(t.code, { children: `name: value` }),
              ` to the clipboard via `,
              (0, h.jsx)(t.code, { children: `navigator.clipboard.writeText` }),
              `.`,
            ],
          }),
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              (0, h.jsx)(t.strong, { children: `Redirect URL click` }),
              ` — clicking the redirect URL in the banner copies the URL to the clipboard.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, h.jsx)(t.h2, { id: `sorting`, children: `Sorting` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `Headers are sorted alphabetically by name via `,
          (0, h.jsx)(t.code, { children: `Array.prototype.sort` }),
          ` with `,
          (0, h.jsx)(t.code, { children: `localeCompare` }),
          `. The sort is applied once on render via `,
          (0, h.jsx)(t.code, { children: `useMemo` }),
          `.`,
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
