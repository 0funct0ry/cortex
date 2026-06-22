import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  Empty as s,
  LongMessages as c,
  Multiple as l,
  Single as u,
  n as d,
  t as f,
} from './ToastContainer.stories-BOBEsScS.js'
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
    ul: `ul`,
    ...n(),
    ...e.components,
  }
  return (0, h.jsxs)(h.Fragment, {
    children: [
      (0, h.jsx)(i, { of: f }),
      `
`,
      (0, h.jsx)(t.h1, { id: `toastcontainer`, children: `ToastContainer` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `A zero-prop container that reads `,
          (0, h.jsx)(t.code, { children: `toasts` }),
          ` from `,
          (0, h.jsx)(t.code, { children: `useToastStore` }),
          ` and stacks them in the top-right corner of the viewport (`,
          (0, h.jsx)(t.code, { children: `fixed top-4 right-4 z-[9999]` }),
          `). Each toast is wrapped in a `,
          (0, h.jsx)(t.code, { children: `pointer-events-auto` }),
          ` div so dismissal works even though the container itself uses `,
          (0, h.jsx)(t.code, { children: `pointer-events-none` }),
          `.`,
        ],
      }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, h.jsx)(t.a, {
            href: `../../../components/ui/ToastContainer.tsx`,
            children: (0, h.jsx)(t.code, { children: `src/components/ui/ToastContainer.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `Mount `,
          (0, h.jsx)(t.code, { children: `<ToastContainer />` }),
          ` once in `,
          (0, h.jsx)(t.code, { children: `App.tsx` }),
          ` — it is always present regardless of which workspace or panel is active.`,
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
        children: `No toasts in the store — the container renders but is invisible.`,
      }),
      `
`,
      (0, h.jsx)(r, { of: s }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `single`, children: `Single` }),
      `
`,
      (0, h.jsx)(t.p, { children: `One success toast visible in the top-right corner.` }),
      `
`,
      (0, h.jsx)(r, { of: u }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `multiple-stacked`, children: `Multiple (stacked)` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `Three toasts stacked with a `,
          (0, h.jsx)(t.code, { children: `gap-2` }),
          ` between them. The play function asserts all three messages are in the DOM.`,
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
      (0, h.jsx)(t.h2, { id: `long-messages`, children: `Long Messages` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `Verifies that `,
          (0, h.jsx)(t.code, { children: `max-w-[450px]` }),
          ` on individual toasts is respected even when multiple long-message toasts are stacked.`,
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
      (0, h.jsx)(t.h2, { id: `behaviour-notes`, children: `Behaviour notes` }),
      `
`,
      (0, h.jsxs)(t.ul, {
        children: [
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              (0, h.jsx)(t.strong, { children: `Auto-dismiss` }),
              `: `,
              (0, h.jsx)(t.code, { children: `addToast` }),
              ` schedules a `,
              (0, h.jsx)(t.code, { children: `setTimeout` }),
              ` for `,
              (0, h.jsx)(t.code, { children: `duration` }),
              ` ms (default 4000). Stories use direct `,
              (0, h.jsx)(t.code, { children: `setState` }),
              ` so duration timers are not active.`,
            ],
          }),
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              (0, h.jsx)(t.strong, { children: `Stacking order` }),
              `: toasts are appended; newest appears at the bottom of the stack.`,
            ],
          }),
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              (0, h.jsx)(t.strong, { children: `Z-index` }),
              `: `,
              (0, h.jsx)(t.code, { children: `z-[9999]` }),
              ` sits above all panels, modals, and dropdowns.`,
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
