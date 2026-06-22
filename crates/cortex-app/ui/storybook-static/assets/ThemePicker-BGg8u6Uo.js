import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  AllThemesVisible as s,
  CloseOnEscape as c,
  DarkThemeActive as l,
  LightThemeActive as u,
  SelectTheme as d,
  n as f,
  t as p,
} from './ThemePicker.stories-b6cMC4hs.js'
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
      (0, g.jsx)(t.h1, { id: `themepicker`, children: `ThemePicker` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `A compact overlay that lists all 13 Cortex themes grouped into `,
          (0, g.jsx)(t.strong, { children: `Light Themes` }),
          ` and `,
          (0, g.jsx)(t.strong, { children: `Dark Themes` }),
          ` sections. The currently active theme is indicated by a filled accent dot and a "✓ active" label. Hovering a theme previews it instantly by updating `,
          (0, g.jsx)(t.code, { children: `document.documentElement.dataset.theme` }),
          `; moving the cursor away reverts to the active theme. Clicking a theme commits the selection and closes the picker. Pressing Escape or clicking outside the overlay also closes it.`,
        ],
      }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, g.jsx)(t.a, {
            href: `../../../components/layout/ThemePicker.tsx`,
            children: (0, g.jsx)(t.code, { children: `src/components/layout/ThemePicker.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `light-theme-active`, children: `Light theme active` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `The picker with the `,
          (0, g.jsx)(t.code, { children: `light` }),
          ` theme selected. The Light entry receives a filled accent indicator and the "✓ active" badge.`,
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
      (0, g.jsx)(t.h2, { id: `dark-theme-active`, children: `Dark theme active` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `The picker with the `,
          (0, g.jsx)(t.code, { children: `dark` }),
          ` theme selected — the default Cortex theme.`,
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
      (0, g.jsx)(t.h2, { id: `all-themes-visible`, children: `All themes visible` }),
      `
`,
      (0, g.jsx)(t.p, {
        children: `Verifies that all 13 theme names appear across both sections: 5 light themes and 8 dark themes.`,
      }),
      `
`,
      (0, g.jsx)(r, { of: s }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `select-theme`, children: `Select theme` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Clicking a theme item (here: Nord) commits the selection and calls `,
          (0, g.jsx)(t.code, { children: `onClose` }),
          `. The play function asserts the spy is invoked exactly once.`,
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
      (0, g.jsx)(t.h2, { id: `close-on-escape`, children: `Close on Escape` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Pressing Escape (or clicking the × close button) calls `,
          (0, g.jsx)(t.code, { children: `onClose` }),
          ` without changing the active theme.`,
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
                (0, g.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, g.jsx)(t.tbody, {
            children: (0, g.jsxs)(t.tr, {
              children: [
                (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `onClose` }) }),
                (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `() => void` }) }),
                (0, g.jsx)(t.td, {
                  children: `Invoked when the picker should close — on theme selection, Escape, or click outside.`,
                }),
              ],
            }),
          }),
        ],
      }),
      `
`,
      (0, g.jsx)(t.h2, { id: `theme-list`, children: `Theme list` }),
      `
`,
      (0, g.jsxs)(t.table, {
        children: [
          (0, g.jsx)(t.thead, {
            children: (0, g.jsxs)(t.tr, {
              children: [
                (0, g.jsx)(t.th, { children: `Section` }),
                (0, g.jsx)(t.th, { children: `Theme ID` }),
                (0, g.jsx)(t.th, { children: `Display name` }),
              ],
            }),
          }),
          (0, g.jsxs)(t.tbody, {
            children: [
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Light` }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `light` }) }),
                  (0, g.jsx)(t.td, { children: `Light` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Light` }),
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `light-monochrome` }),
                  }),
                  (0, g.jsx)(t.td, { children: `Light Monochrome` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Light` }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `light-pastel` }) }),
                  (0, g.jsx)(t.td, { children: `Light Pastel` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Light` }),
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `catppuccin-latte` }),
                  }),
                  (0, g.jsx)(t.td, { children: `Catppuccin Latte` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Light` }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `vscode-light` }) }),
                  (0, g.jsx)(t.td, { children: `VS Code Light` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Dark` }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `dark` }) }),
                  (0, g.jsx)(t.td, { children: `Dark` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Dark` }),
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `dark-monochrome` }),
                  }),
                  (0, g.jsx)(t.td, { children: `Dark Monochrome` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Dark` }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `dark-pastel` }) }),
                  (0, g.jsx)(t.td, { children: `Dark Pastel` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Dark` }),
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `catppuccin-frappe` }),
                  }),
                  (0, g.jsx)(t.td, { children: `Catppuccin Frappé` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Dark` }),
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `catppuccin-macchiato` }),
                  }),
                  (0, g.jsx)(t.td, { children: `Catppuccin Macchiato` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Dark` }),
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `catppuccin-mocha` }),
                  }),
                  (0, g.jsx)(t.td, { children: `Catppuccin Mocha` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Dark` }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `nord` }) }),
                  (0, g.jsx)(t.td, { children: `Nord` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Dark` }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `vscode-dark` }) }),
                  (0, g.jsx)(t.td, { children: `VS Code Dark` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, g.jsx)(t.h2, { id: `hover-preview`, children: `Hover preview` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          (0, g.jsx)(t.code, { children: `onMouseEnter` }),
          ` on each theme row calls `,
          (0, g.jsx)(t.code, { children: `document.documentElement.dataset.theme = themeId` }),
          `, which instantly swaps all CSS custom-property tokens without persisting the change. `,
          (0, g.jsx)(t.code, { children: `onMouseLeave` }),
          ` reverts to the stored active theme. The cleanup function in the `,
          (0, g.jsx)(t.code, { children: `useEffect` }),
          ` also reverts on unmount so closing the picker without selecting always restores the previous theme.`,
        ],
      }),
      `
`,
      (0, g.jsx)(t.h2, { id: `persistence`, children: `Persistence` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          (0, g.jsx)(t.code, { children: `setTheme(themeId)` }),
          ` (from `,
          (0, g.jsx)(t.code, { children: `ThemeContext` }),
          `) writes to `,
          (0, g.jsx)(t.code, { children: `localStorage` }),
          ` under the key `,
          (0, g.jsx)(t.code, { children: `cortex.theme` }),
          `. On next load `,
          (0, g.jsx)(t.code, { children: `ThemeProvider` }),
          ` reads this key and initialises the theme before the first render, preventing a flash of the default theme.`,
        ],
      }),
      `
`,
      (0, g.jsx)(t.h2, { id: `context-dependency`, children: `Context dependency` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          (0, g.jsx)(t.code, { children: `ThemePicker` }),
          ` calls `,
          (0, g.jsx)(t.code, { children: `useTheme()` }),
          ` and will throw if rendered outside a `,
          (0, g.jsx)(t.code, { children: `ThemeProvider` }),
          `. Stories wrap the component with `,
          (0, g.jsx)(t.code, { children: `ThemeProvider` }),
          ` in a decorator and pre-seed `,
          (0, g.jsx)(t.code, { children: `localStorage` }),
          ` via `,
          (0, g.jsx)(t.code, { children: `beforeEach` }),
          ` to control the initial active theme.`,
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
