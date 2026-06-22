import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import { Default as s, n as c, t as l } from './SidebarFooter.stories-t8FyRnaU.js'
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
      (0, f.jsx)(t.h1, { id: `sidebarfooter`, children: `SidebarFooter` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `A fixed-height (`,
          (0, f.jsx)(t.code, { children: `h-9` }),
          `, 36 px) footer strip rendered at the very bottom of the sidebar panel. It contains an "API Specs" label with a `,
          (0, f.jsx)(t.code, { children: `FileText` }),
          ` icon on the left, and a `,
          (0, f.jsx)(t.code, { children: `Plus` }),
          ` button on the right (currently disabled — the API Specs feature is planned for a future release). The footer uses `,
          (0, f.jsx)(t.code, { children: `shrink-0` }),
          ` so it is never compressed by a flex parent.`,
        ],
      }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, f.jsx)(t.a, {
            href: `../../../components/layout/SidebarFooter.tsx`,
            children: (0, f.jsx)(t.code, { children: `src/components/layout/SidebarFooter.tsx` }),
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
      (0, f.jsxs)(t.p, {
        children: [
          `The sole variant of `,
          (0, f.jsx)(t.code, { children: `SidebarFooter` }),
          `. The component has no props and no internal state.`,
        ],
      }),
      `
`,
      (0, f.jsx)(r, { of: s }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `props`, children: `Props` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          (0, f.jsx)(t.code, { children: `SidebarFooter` }),
          ` accepts no props. It is a fully stateless presentational component.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.h2, { id: `layout-tokens`, children: `Layout tokens` }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Token` }),
                (0, f.jsx)(t.th, { children: `Usage` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `bg-bg-panel` }) }),
                  (0, f.jsx)(t.td, { children: `Footer background` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `border-border-subtle` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Top border separating footer from sidebar tree` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `text-text-muted` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Icon and button colour at rest` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `text-text-secondary` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Label text colour` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `hover:bg-bg-muted` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Plus button hover background` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `hover:text-text-primary` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Plus button icon colour on hover` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.h2, { id: `plus-button`, children: `Plus button` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `The plus button carries `,
          (0, f.jsx)(t.code, { children: `title="Coming soon"` }),
          ` which surfaces as a native browser tooltip on hover. It has no `,
          (0, f.jsx)(t.code, { children: `onClick` }),
          ` handler — clicking it is a no-op until the API Specs feature ships.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.h2, { id: `future-use`, children: `Future use` }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `When the API Specs feature is implemented, the plus button is expected to open a dialog for importing or linking an OpenAPI / AsyncAPI specification file to the active workspace.`,
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
