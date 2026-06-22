import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import { Default as s, n as c, t as l } from './EmptyComposerState.stories-CROQ6fah.js'
function u(e) {
  let t = {
    a: `a`,
    code: `code`,
    h1: `h1`,
    h2: `h2`,
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
  return (0, f.jsxs)(f.Fragment, {
    children: [
      (0, f.jsx)(i, { of: l }),
      `
`,
      (0, f.jsx)(t.h1, { id: `emptycomposerstate`, children: `EmptyComposerState` }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `The placeholder screen shown in the composer panel when no request tab is active. It combines a large decorative rocket icon with a concise keyboard shortcut reference so new users can immediately discover the five most common actions — without leaving the screen to read documentation.`,
      }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, f.jsx)(t.a, {
            href: `../../../components/layout/EmptyComposerState.tsx`,
            children: (0, f.jsx)(t.code, {
              children: `src/components/layout/EmptyComposerState.tsx`,
            }),
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `default`, children: `Default` }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `The only visual state this component has. Rendered whenever no tab is open in the workspace.`,
      }),
      `
`,
      (0, f.jsx)(r, { of: s }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `layout`, children: `Layout` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `The component is a full-height flex column (`,
          (0, f.jsx)(t.code, { children: `flex-1 flex flex-col items-center justify-center` }),
          `) that expands to fill whatever space the composer panel offers. Content is vertically centred with a `,
          (0, f.jsx)(t.code, { children: `max-w-[380px]` }),
          ` constraint on the shortcut list.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `The rocket icon is rendered at 160 px, opacity 10 %, and rotated 45° — purely decorative; it carries no ARIA label.`,
      }),
      `
`,
      (0, f.jsx)(t.h2, { id: `keyboard-shortcuts`, children: `Keyboard shortcuts` }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Shortcut` }),
                (0, f.jsx)(t.th, { children: `Action` }),
                (0, f.jsx)(t.th, { children: `Notes` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Cmd + Enter` }) }),
                  (0, f.jsx)(t.td, { children: `Send Request` }),
                  (0, f.jsx)(t.td, { children: `Fires the active request` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Cmd + ⇧N` }) }),
                  (0, f.jsx)(t.td, { children: `New Request` }),
                  (0, f.jsx)(t.td, {
                    children: `Opens a new named request and prompts to save to a collection`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Cmd + B` }) }),
                  (0, f.jsx)(t.td, { children: `New Transient Request` }),
                  (0, f.jsx)(t.td, {
                    children: `Opens a scratch request — choose protocol, never saved`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Cmd + N` }) }),
                  (0, f.jsx)(t.td, { children: `New Quick Request` }),
                  (0, f.jsx)(t.td, { children: `Instant HTTP GET scratch tab, never saved` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Cmd + E` }) }),
                  (0, f.jsx)(t.td, { children: `Edit Environments` }),
                  (0, f.jsx)(t.td, { children: `Opens the environment editor` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.h2, { id: `component-characteristics`, children: `Component characteristics` }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Property` }),
                (0, f.jsx)(t.th, { children: `Value` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `Props` }),
                  (0, f.jsx)(t.td, { children: `None` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `Context / Store` }),
                  (0, f.jsx)(t.td, { children: `None — purely presentational` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `Animation` }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `animate-in fade-in duration-300` }),
                      ` on mount`,
                    ],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `Selection` }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `select-none` }),
                      ` — text is intentionally not selectable`,
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
function d(e = {}) {
  let { wrapper: t } = { ...n(), ...e.components }
  return t ? (0, f.jsx)(t, { ...e, children: (0, f.jsx)(u, { ...e }) }) : u(e)
}
var f
e(() => {
  ;((f = t()), o(), a(), c())
})()
export { d as default }
