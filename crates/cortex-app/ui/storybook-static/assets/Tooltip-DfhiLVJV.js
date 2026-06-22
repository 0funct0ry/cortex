import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  AlignEnd as s,
  AlignStart as c,
  Bottom as l,
  Default as u,
  Left as d,
  LongContent as f,
  Right as p,
  Top as m,
  WithDelay as h,
  n as g,
  t as _,
} from './Tooltip.stories-D7pdQjcc.js'
function v(e) {
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
  return (0, b.jsxs)(b.Fragment, {
    children: [
      (0, b.jsx)(i, { of: _ }),
      `
`,
      (0, b.jsx)(t.h1, { id: `tooltip`, children: `Tooltip` }),
      `
`,
      (0, b.jsxs)(t.p, {
        children: [
          `A lightweight hover tooltip that renders a small floating label adjacent to its trigger element. Visibility is controlled by `,
          (0, b.jsx)(t.code, { children: `onMouseEnter` }),
          ` / `,
          (0, b.jsx)(t.code, { children: `onMouseLeave` }),
          ` with a configurable delay, and placement is determined by the `,
          (0, b.jsx)(t.code, { children: `position` }),
          ` + `,
          (0, b.jsx)(t.code, { children: `align` }),
          ` props.`,
        ],
      }),
      `
`,
      (0, b.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, b.jsx)(t.a, {
            href: `../../../components/ui/Tooltip.tsx`,
            children: (0, b.jsx)(t.code, { children: `src/components/ui/Tooltip.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, b.jsx)(t.hr, {}),
      `
`,
      (0, b.jsx)(t.h2, { id: `default`, children: `Default` }),
      `
`,
      (0, b.jsxs)(t.p, {
        children: [
          `Tooltip below the trigger, centre-aligned, instant display (`,
          (0, b.jsx)(t.code, { children: `delay={0}` }),
          `).`,
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
      (0, b.jsx)(t.h2, { id: `placement-variants`, children: `Placement variants` }),
      `
`,
      (0, b.jsx)(t.h3, { id: `bottom-default`, children: `Bottom (default)` }),
      `
`,
      (0, b.jsx)(r, { of: l }),
      `
`,
      (0, b.jsx)(t.h3, { id: `top`, children: `Top` }),
      `
`,
      (0, b.jsx)(r, { of: m }),
      `
`,
      (0, b.jsx)(t.h3, { id: `left`, children: `Left` }),
      `
`,
      (0, b.jsx)(r, { of: d }),
      `
`,
      (0, b.jsx)(t.h3, { id: `right`, children: `Right` }),
      `
`,
      (0, b.jsx)(r, { of: p }),
      `
`,
      (0, b.jsx)(t.hr, {}),
      `
`,
      (0, b.jsx)(t.h2, { id: `alignment`, children: `Alignment` }),
      `
`,
      (0, b.jsx)(t.h3, { id: `align-start`, children: `Align Start` }),
      `
`,
      (0, b.jsx)(r, { of: c }),
      `
`,
      (0, b.jsx)(t.h3, { id: `align-end`, children: `Align End` }),
      `
`,
      (0, b.jsx)(r, { of: s }),
      `
`,
      (0, b.jsx)(t.hr, {}),
      `
`,
      (0, b.jsx)(t.h2, { id: `long-content`, children: `Long Content` }),
      `
`,
      (0, b.jsxs)(t.p, {
        children: [
          `The tooltip uses `,
          (0, b.jsx)(t.code, { children: `whitespace-nowrap` }),
          ` so long content extends horizontally. Keep tooltip text short in production.`,
        ],
      }),
      `
`,
      (0, b.jsx)(r, { of: f }),
      `
`,
      (0, b.jsx)(t.hr, {}),
      `
`,
      (0, b.jsx)(t.h2, { id: `with-delay`, children: `With Delay` }),
      `
`,
      (0, b.jsxs)(t.p, {
        children: [
          `The default `,
          (0, b.jsx)(t.code, { children: `delay` }),
          ` is 300 ms. The play function waits 350 ms after hover before asserting visibility.`,
        ],
      }),
      `
`,
      (0, b.jsx)(r, { of: h }),
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
                (0, b.jsx)(t.th, { children: `Default` }),
                (0, b.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, b.jsxs)(t.tbody, {
            children: [
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `content` }) }),
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `string` }) }),
                  (0, b.jsx)(t.td, { children: `—` }),
                  (0, b.jsx)(t.td, { children: `Text displayed inside the tooltip` }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `children` }) }),
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `ReactNode` }) }),
                  (0, b.jsx)(t.td, { children: `—` }),
                  (0, b.jsx)(t.td, { children: `The element that triggers the tooltip` }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `delay` }) }),
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `number` }) }),
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `300` }) }),
                  (0, b.jsx)(t.td, {
                    children: `Milliseconds before the tooltip appears after hover`,
                  }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `position` }) }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, {
                      children: `'top' | 'bottom' | 'left' | 'right'`,
                    }),
                  }),
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `'bottom'` }) }),
                  (0, b.jsx)(t.td, { children: `Side of the trigger where the tooltip appears` }),
                ],
              }),
              (0, b.jsxs)(t.tr, {
                children: [
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `align` }) }),
                  (0, b.jsx)(t.td, {
                    children: (0, b.jsx)(t.code, { children: `'start' | 'center' | 'end'` }),
                  }),
                  (0, b.jsx)(t.td, { children: (0, b.jsx)(t.code, { children: `'center'` }) }),
                  (0, b.jsxs)(t.td, {
                    children: [
                      `Alignment along the cross-axis (ignored for `,
                      (0, b.jsx)(t.code, { children: `left` }),
                      `/`,
                      (0, b.jsx)(t.code, { children: `right` }),
                      `)`,
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
      (0, b.jsx)(t.h2, { id: `accessibility-note`, children: `Accessibility note` }),
      `
`,
      (0, b.jsxs)(t.p, {
        children: [
          `The tooltip is purely CSS-positioned and mouse-driven. It does not currently implement `,
          (0, b.jsx)(t.code, { children: `aria-describedby` }),
          ` or keyboard focus handling. For keyboard-accessible tooltips wrap the trigger in a focusable element and manage `,
          (0, b.jsx)(t.code, { children: `onFocus` }),
          ` / `,
          (0, b.jsx)(t.code, { children: `onBlur` }),
          ` alongside `,
          (0, b.jsx)(t.code, { children: `onMouseEnter` }),
          ` / `,
          (0, b.jsx)(t.code, { children: `onMouseLeave` }),
          `.`,
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
