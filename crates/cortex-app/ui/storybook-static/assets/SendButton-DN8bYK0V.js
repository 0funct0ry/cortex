import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  Disabled as s,
  DisabledWithReason as c,
  Idle as l,
  InFlight as u,
  n as d,
  t as f,
} from './SendButton.stories-DsRnamvN.js'
function p(e) {
  let t = {
    a: `a`,
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
  return (0, h.jsxs)(h.Fragment, {
    children: [
      (0, h.jsx)(i, { of: f }),
      `
`,
      (0, h.jsx)(t.h1, { id: `sendbutton`, children: `SendButton` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `The primary action button at the right edge of the request URL bar. It has two mutually exclusive modes — `,
          (0, h.jsx)(t.strong, { children: `Send` }),
          ` (idle) and `,
          (0, h.jsx)(t.strong, { children: `Cancel` }),
          ` (in-flight) — controlled entirely by the `,
          (0, h.jsx)(t.code, { children: `inFlight` }),
          ` prop. A disabled state prevents sending when required fields are missing.`,
        ],
      }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, h.jsx)(t.a, {
            href: `../../../components/composer/SendButton.tsx`,
            children: (0, h.jsx)(t.code, { children: `src/components/composer/SendButton.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `idle--send`, children: `Idle — Send` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `The default state. An accent-coloured pill labelled `,
          (0, h.jsx)(t.strong, { children: `Send` }),
          ` is rendered. A tooltip shows the platform-aware keyboard shortcut: `,
          (0, h.jsx)(t.strong, { children: `⌘ + Enter` }),
          ` on macOS and `,
          (0, h.jsx)(t.strong, { children: `Ctrl + Enter` }),
          ` on Windows/Linux.`,
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
      (0, h.jsx)(t.h2, { id: `in-flight--cancel`, children: `In-Flight — Cancel` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `When `,
          (0, h.jsx)(t.code, { children: `inFlight` }),
          ` is `,
          (0, h.jsx)(t.code, { children: `true` }),
          ` the button switches to a red error-coloured pill with an `,
          (0, h.jsx)(t.strong, { children: `✕ Cancel` }),
          ` label. Clicking fires `,
          (0, h.jsx)(t.code, { children: `onCancel` }),
          `, which aborts the in-progress HTTP request via Tauri IPC. The tooltip reads `,
          (0, h.jsx)(t.em, { children: `"Cancel Request"` }),
          `.`,
        ],
      }),
      `
`,
      (0, h.jsx)(r, { of: u }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `disabled`, children: `Disabled` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `When `,
          (0, h.jsx)(t.code, { children: `disabled` }),
          ` is `,
          (0, h.jsx)(t.code, { children: `true` }),
          ` the Send button renders at 40 % opacity with a `,
          (0, h.jsx)(t.code, { children: `cursor-not-allowed` }),
          ` cursor. Clicks are silently ignored — no `,
          (0, h.jsx)(t.code, { children: `onSend` }),
          ` is fired.`,
        ],
      }),
      `
`,
      (0, h.jsx)(r, { of: s }),
      `
`,
      (0, h.jsx)(t.hr, {}),
      `
`,
      (0, h.jsx)(t.h2, { id: `disabled-with-reason`, children: `Disabled With Reason` }),
      `
`,
      (0, h.jsxs)(t.p, {
        children: [
          `The optional `,
          (0, h.jsx)(t.code, { children: `disabledReason` }),
          ` prop replaces the keyboard shortcut hint in the tooltip. Use it to explain `,
          (0, h.jsx)(t.em, { children: `why` }),
          ` the button is disabled (e.g. `,
          (0, h.jsx)(t.em, { children: `"No URL entered"` }),
          `, `,
          (0, h.jsx)(t.em, { children: `"Bearer token is required"` }),
          `).`,
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
                (0, h.jsx)(t.th, { children: `Default` }),
                (0, h.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, h.jsxs)(t.tbody, {
            children: [
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `inFlight` }) }),
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `boolean` }) }),
                  (0, h.jsx)(t.td, { children: `—` }),
                  (0, h.jsxs)(t.td, {
                    children: [
                      `When `,
                      (0, h.jsx)(t.code, { children: `true` }),
                      `, renders the red Cancel button instead of Send.`,
                    ],
                  }),
                ],
              }),
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `onSend` }) }),
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `() => void` }) }),
                  (0, h.jsx)(t.td, { children: `—` }),
                  (0, h.jsx)(t.td, {
                    children: `Called when the user clicks Send (only when not disabled).`,
                  }),
                ],
              }),
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `onCancel` }) }),
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `() => void` }) }),
                  (0, h.jsx)(t.td, { children: `—` }),
                  (0, h.jsx)(t.td, { children: `Called when the user clicks Cancel.` }),
                ],
              }),
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `disabled` }) }),
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `boolean` }) }),
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `false` }) }),
                  (0, h.jsxs)(t.td, {
                    children: [
                      `Disables the Send button. Ignored when `,
                      (0, h.jsx)(t.code, { children: `inFlight` }),
                      ` is `,
                      (0, h.jsx)(t.code, { children: `true` }),
                      `.`,
                    ],
                  }),
                ],
              }),
              (0, h.jsxs)(t.tr, {
                children: [
                  (0, h.jsx)(t.td, {
                    children: (0, h.jsx)(t.code, { children: `disabledReason` }),
                  }),
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `string` }) }),
                  (0, h.jsx)(t.td, { children: (0, h.jsx)(t.code, { children: `''` }) }),
                  (0, h.jsx)(t.td, {
                    children: `Optional tooltip text shown instead of the keyboard shortcut when the button is disabled.`,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, h.jsx)(t.h2, { id: `behaviour-notes`, children: `Behaviour Notes` }),
      `
`,
      (0, h.jsxs)(t.ul, {
        children: [
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              (0, h.jsx)(t.strong, { children: `Platform shortcut` }),
              ` — computed at render time via `,
              (0, h.jsx)(t.code, { children: `navigator.platform` }),
              `. Stories inside Storybook always show the macOS variant (⌘ + Enter) because the browser UA reports a Mac.`,
            ],
          }),
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              (0, h.jsx)(t.strong, { children: `No double-fire guard` }),
              ` — the component does not debounce clicks; callers are responsible for setting `,
              (0, h.jsx)(t.code, { children: `inFlight: true` }),
              ` promptly to prevent multiple `,
              (0, h.jsx)(t.code, { children: `onSend` }),
              ` calls.`,
            ],
          }),
          `
`,
          (0, h.jsxs)(t.li, {
            children: [
              (0, h.jsx)(t.strong, { children: `Disabled during in-flight` }),
              ` — the `,
              (0, h.jsx)(t.code, { children: `disabled` }),
              ` prop has no effect when `,
              (0, h.jsx)(t.code, { children: `inFlight` }),
              ` is `,
              (0, h.jsx)(t.code, { children: `true` }),
              `; the Cancel button is always clickable.`,
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
