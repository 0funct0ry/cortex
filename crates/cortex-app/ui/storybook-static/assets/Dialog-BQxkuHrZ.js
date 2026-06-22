import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  Closed as s,
  CustomLabels as c,
  DangerVariant as l,
  LongContent as u,
  Open as d,
  n as f,
  t as p,
} from './Dialog.stories-C9zoFciy.js'
function m(e) {
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
  return (0, g.jsxs)(g.Fragment, {
    children: [
      (0, g.jsx)(i, { of: p }),
      `
`,
      (0, g.jsx)(t.h1, { id: `dialog`, children: `Dialog` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `A modal confirmation dialog that renders into `,
          (0, g.jsx)(t.code, { children: `document.body` }),
          ` via `,
          (0, g.jsx)(t.code, { children: `createPortal` }),
          `. Used throughout Cortex for destructive confirmations (delete collection, discard changes) and neutral confirmations (save, export).`,
        ],
      }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, g.jsx)(t.a, {
            href: `../../../components/ui/Dialog.tsx`,
            children: (0, g.jsx)(t.code, { children: `src/components/ui/Dialog.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `open-primary`, children: `Open (primary)` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Default state — `,
          (0, g.jsx)(t.code, { children: `isOpen=true` }),
          `, primary variant. The backdrop is semi-transparent with a subtle blur. Clicking the backdrop or pressing `,
          (0, g.jsx)(t.strong, { children: `Escape` }),
          ` calls `,
          (0, g.jsx)(t.code, { children: `onClose` }),
          `.`,
        ],
      }),
      `
`,
      (0, g.jsx)(r, { of: d }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `closed`, children: `Closed` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          (0, g.jsx)(t.code, { children: `isOpen=false` }),
          ` — the component returns `,
          (0, g.jsx)(t.code, { children: `null` }),
          `. Nothing is mounted in the DOM. Callers can always render `,
          (0, g.jsx)(t.code, { children: `<Dialog>` }),
          ` unconditionally and toggle `,
          (0, g.jsx)(t.code, { children: `isOpen` }),
          ` without unmounting.`,
        ],
      }),
      `
`,
      (0, g.jsx)(r, { of: s }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `danger-variant`, children: `Danger variant` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          (0, g.jsx)(t.code, { children: `variant="danger"` }),
          ` renders the confirm button with the `,
          (0, g.jsx)(t.code, { children: `bg-error` }),
          ` token — red in all themes. Use for irreversible operations.`,
        ],
      }),
      `
`,
      (0, g.jsx)(r, { of: l }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `long-content`, children: `Long content` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Long `,
          (0, g.jsx)(t.code, { children: `description` }),
          ` text wraps inside the `,
          (0, g.jsx)(t.code, { children: `max-w-md` }),
          ` container. The dialog does not scroll; keep descriptions concise.`,
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
      (0, g.jsx)(t.h2, { id: `custom-labels`, children: `Custom labels` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Override `,
          (0, g.jsx)(t.code, { children: `confirmLabel` }),
          ` and `,
          (0, g.jsx)(t.code, { children: `cancelLabel` }),
          ` for domain-specific copy.`,
        ],
      }),
      `
`,
      (0, g.jsx)(r, { of: c }),
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
                (0, g.jsx)(t.th, { children: `Default` }),
                (0, g.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, g.jsxs)(t.tbody, {
            children: [
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `isOpen` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `boolean` }) }),
                  (0, g.jsx)(t.td, { children: `—` }),
                  (0, g.jsx)(t.td, {
                    children: `Controls visibility; component returns null when false`,
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `onClose` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `() => void` }) }),
                  (0, g.jsx)(t.td, { children: `—` }),
                  (0, g.jsx)(t.td, {
                    children: `Called on backdrop click, Escape key, or Cancel button`,
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `onConfirm` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `() => void` }) }),
                  (0, g.jsx)(t.td, { children: `—` }),
                  (0, g.jsx)(t.td, {
                    children: `Called when the confirm button is clicked (then onClose)`,
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `title` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `string` }) }),
                  (0, g.jsx)(t.td, { children: `—` }),
                  (0, g.jsx)(t.td, { children: `Heading text` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `description` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `string` }) }),
                  (0, g.jsx)(t.td, { children: `—` }),
                  (0, g.jsx)(t.td, { children: `Body text shown below the title` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `confirmLabel` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `string` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `'Confirm'` }) }),
                  (0, g.jsx)(t.td, { children: `Label for the primary action button` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `cancelLabel` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `string` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `'Cancel'` }) }),
                  (0, g.jsx)(t.td, { children: `Label for the dismiss button` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `variant` }) }),
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `'primary' | 'danger'` }),
                  }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `'primary'` }) }),
                  (0, g.jsx)(t.td, { children: `Visual style of the confirm button` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, g.jsx)(t.h2, { id: `portal-behaviour`, children: `Portal behaviour` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Dialog renders via `,
          (0, g.jsx)(t.code, { children: `createPortal(…, document.body)` }),
          `. Storybook interaction tests must therefore use `,
          (0, g.jsx)(t.code, { children: `within(document.body)` }),
          ` rather than `,
          (0, g.jsx)(t.code, { children: `within(canvasElement)` }),
          ` when querying dialog elements.`,
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
