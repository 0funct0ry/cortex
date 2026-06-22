import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  Default as s,
  EmptyInitialValue as c,
  ErrorStyle as l,
  EscapeCancel as u,
  LongValue as d,
  n as f,
  t as p,
} from './InlineInput.stories-Dp_-CrNM.js'
function m(e) {
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
  return (0, g.jsxs)(g.Fragment, {
    children: [
      (0, g.jsx)(i, { of: p }),
      `
`,
      (0, g.jsx)(t.h1, { id: `inlineinput`, children: `InlineInput` }),
      `
`,
      (0, g.jsx)(t.p, {
        children: `A minimal single-line text editor that mounts pre-focused and pre-selected, ready for the user to type. Used in the collection tree for in-place rename of folders and requests.`,
      }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, g.jsx)(t.a, {
            href: `../../../components/ui/InlineInput.tsx`,
            children: (0, g.jsx)(t.code, { children: `src/components/ui/InlineInput.tsx` }),
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
      (0, g.jsxs)(t.p, {
        children: [
          `Input pre-filled with "My Collection". Auto-focuses and selects all text on mount so the user can type immediately without clicking. Press `,
          (0, g.jsx)(t.strong, { children: `Enter` }),
          ` or click away to confirm; press `,
          (0, g.jsx)(t.strong, { children: `Escape` }),
          ` to cancel.`,
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
      (0, g.jsx)(t.h2, { id: `empty-initial-value`, children: `Empty initial value` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `When `,
          (0, g.jsx)(t.code, { children: `initialValue` }),
          ` is an empty string the input renders blank.`,
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
      (0, g.jsx)(t.h2, { id: `long-value`, children: `Long value` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `A long initial value clips inside the fixed-width container. The component applies `,
          (0, g.jsx)(t.code, { children: `w-full` }),
          ` so it always fills its parent; callers control the container width.`,
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
      (0, g.jsx)(t.h2, {
        id: `error-style-via-classname`,
        children: `Error style (via className)`,
      }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `InlineInput has no built-in validation state. Callers signal invalid input by passing a `,
          (0, g.jsx)(t.code, { children: `className` }),
          ` that overrides the border colour.`,
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
      (0, g.jsx)(t.h2, { id: `escape-to-cancel`, children: `Escape to cancel` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Press Escape while the input is focused to call `,
          (0, g.jsx)(t.code, { children: `onCancel` }),
          ` without committing changes.`,
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
                (0, g.jsx)(t.th, { children: `Default` }),
                (0, g.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, g.jsxs)(t.tbody, {
            children: [
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `initialValue` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `string` }) }),
                  (0, g.jsx)(t.td, { children: `—` }),
                  (0, g.jsxs)(t.td, {
                    children: [
                      `Pre-filled text; also used as fallback if `,
                      (0, g.jsx)(t.code, { children: `value` }),
                      ` is empty`,
                    ],
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `onConfirm` }) }),
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `(value: string) => void` }),
                  }),
                  (0, g.jsx)(t.td, { children: `—` }),
                  (0, g.jsx)(t.td, {
                    children: `Called with the current input value on Enter or blur`,
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `onCancel` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `() => void` }) }),
                  (0, g.jsx)(t.td, { children: `—` }),
                  (0, g.jsx)(t.td, { children: `Called when Escape is pressed` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `className` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `string` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `''` }) }),
                  (0, g.jsxs)(t.td, {
                    children: [
                      `Additional classes applied to the `,
                      (0, g.jsx)(t.code, { children: `<input>` }),
                      ` element`,
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
      (0, g.jsx)(t.h2, { id: `behaviour-notes`, children: `Behaviour notes` }),
      `
`,
      (0, g.jsxs)(t.ul, {
        children: [
          `
`,
          (0, g.jsxs)(t.li, {
            children: [
              (0, g.jsx)(t.strong, { children: `Auto-focus + select` }),
              ` — `,
              (0, g.jsx)(t.code, { children: `useEffect` }),
              ` focuses and selects all text on mount, so the user never needs an extra click to start typing.`,
            ],
          }),
          `
`,
          (0, g.jsxs)(t.li, {
            children: [
              (0, g.jsx)(t.strong, { children: `Blur confirms` }),
              ` — tabbing or clicking away calls `,
              (0, g.jsx)(t.code, { children: `onConfirm` }),
              ` with the current value, matching the UX of rename fields in macOS Finder and VS Code.`,
            ],
          }),
          `
`,
          (0, g.jsxs)(t.li, {
            children: [
              (0, g.jsx)(t.strong, { children: `No controlled value` }),
              ` — InlineInput is uncontrolled (`,
              (0, g.jsx)(t.code, { children: `defaultValue` }),
              `). Callers don't need to manage intermediate input state; they only react to `,
              (0, g.jsx)(t.code, { children: `onConfirm` }),
              `.`,
            ],
          }),
          `
`,
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
