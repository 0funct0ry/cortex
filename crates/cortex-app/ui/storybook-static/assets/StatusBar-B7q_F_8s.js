import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  Default as s,
  SearchHint as c,
  WithThemePicker as l,
  n as u,
  t as d,
} from './StatusBar.stories-Bw8UXFSV.js'
function f(e) {
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
  return (0, m.jsxs)(m.Fragment, {
    children: [
      (0, m.jsx)(i, { of: d }),
      `
`,
      (0, m.jsx)(t.h1, { id: `statusbar`, children: `StatusBar` }),
      `
`,
      (0, m.jsx)(t.p, {
        children: `The application footer bar (22 px tall) that sits at the bottom of every workspace. It shows the active theme name (clickable to open the ThemePicker), the app version, and — in development builds — a button to open Tauri devtools.`,
      }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, m.jsx)(t.a, {
            href: `../../../components/layout/StatusBar.tsx`,
            children: (0, m.jsx)(t.code, { children: `src/components/layout/StatusBar.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `default`, children: `Default` }),
      `
`,
      (0, m.jsx)(t.p, {
        children: `Idle state. The theme chip on the right shows the currently active theme name. Clicking it toggles the ThemePicker popover.`,
      }),
      `
`,
      (0, m.jsx)(r, { of: s }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `with-theme-picker`, children: `With theme picker` }),
      `
`,
      (0, m.jsx)(t.p, {
        children: `Documents the toggle behaviour: a second click on the chip dismisses the ThemePicker.`,
      }),
      `
`,
      (0, m.jsx)(r, { of: l }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `search-hint`, children: `Search hint` }),
      `
`,
      (0, m.jsx)(t.p, {
        children: `Verifies that the "Search / Cmd+K" affordance is always rendered, regardless of workspace state.`,
      }),
      `
`,
      (0, m.jsx)(r, { of: c }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `component-characteristics`, children: `Component characteristics` }),
      `
`,
      (0, m.jsxs)(t.table, {
        children: [
          (0, m.jsx)(t.thead, {
            children: (0, m.jsxs)(t.tr, {
              children: [
                (0, m.jsx)(t.th, { children: `Property` }),
                (0, m.jsx)(t.th, { children: `Value` }),
              ],
            }),
          }),
          (0, m.jsxs)(t.tbody, {
            children: [
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, { children: `Height` }),
                  (0, m.jsxs)(t.td, {
                    children: [
                      (0, m.jsx)(t.code, { children: `22px` }),
                      ` fixed (`,
                      (0, m.jsx)(t.code, { children: `h-[22px]` }),
                      `)`,
                    ],
                  }),
                ],
              }),
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, { children: `Background` }),
                  (0, m.jsx)(t.td, { children: (0, m.jsx)(t.code, { children: `bg-bg-panel` }) }),
                ],
              }),
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, { children: `Border` }),
                  (0, m.jsxs)(t.td, {
                    children: [
                      (0, m.jsx)(t.code, { children: `border-t border-border-subtle` }),
                      ` (top edge only)`,
                    ],
                  }),
                ],
              }),
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, { children: `Props` }),
                  (0, m.jsxs)(t.td, {
                    children: [
                      `None — reads from `,
                      (0, m.jsx)(t.code, { children: `useTheme()` }),
                      ` and `,
                      (0, m.jsx)(t.code, { children: `import.meta.env` }),
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
      (0, m.jsx)(t.h2, { id: `theme-display`, children: `Theme display` }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `The active theme ID is humanised for display by replacing hyphens with spaces (`,
          (0, m.jsx)(t.code, { children: `dark-monochrome` }),
          ` → "dark monochrome"). Clicking the chip opens a `,
          (0, m.jsx)(t.code, { children: `ThemePicker` }),
          ` popover that lets the user switch between all 13 Cortex themes. The new theme is persisted to `,
          (0, m.jsx)(t.code, { children: `settings.json` }),
          ` via `,
          (0, m.jsx)(t.code, { children: `AppSettings` }),
          `.`,
        ],
      }),
      `
`,
      (0, m.jsx)(t.h2, { id: `version-string`, children: `Version string` }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          (0, m.jsx)(t.code, { children: `VITE_APP_VERSION` }),
          ` is injected at build time. If the env var is absent (e.g. in local dev without the Makefile), the component falls back to `,
          (0, m.jsx)(t.code, { children: `"v0.1.0"` }),
          `.`,
        ],
      }),
      `
`,
      (0, m.jsx)(t.h2, { id: `devtools-button`, children: `Devtools button` }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `Only rendered when `,
          (0, m.jsx)(t.code, { children: `import.meta.env.DEV` }),
          ` is truthy. Not visible in production builds or in Storybook's production `,
          (0, m.jsx)(t.code, { children: `build-storybook` }),
          ` output.`,
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
