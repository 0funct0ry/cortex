import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  Closed as s,
  ErrorState as c,
  FolderInfo as l,
  Loading as u,
  RequestInfo as d,
  n as f,
  t as p,
} from './InfoPanel.stories-Q1r5pr3v.js'
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
      (0, g.jsx)(t.h1, { id: `infopanel`, children: `InfoPanel` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `A modal information panel that displays filesystem metadata for a collection item (folder or request). Data is fetched from the Rust backend via the `,
          (0, g.jsx)(t.code, { children: `get_item_info` }),
          ` Tauri command each time `,
          (0, g.jsx)(t.code, { children: `isOpen` }),
          ` flips to `,
          (0, g.jsx)(t.code, { children: `true` }),
          `.`,
        ],
      }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, g.jsx)(t.a, {
            href: `../../../components/ui/InfoPanel.tsx`,
            children: (0, g.jsx)(t.code, { children: `src/components/ui/InfoPanel.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `loading`, children: `Loading` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `The panel renders "Loading…" while awaiting the `,
          (0, g.jsx)(t.code, { children: `get_item_info` }),
          ` response. In this story the mock never resolves so the loading state stays visible indefinitely.`,
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
      (0, g.jsx)(t.h2, { id: `folder-info`, children: `Folder info` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Mock returns a complete folder `,
          (0, g.jsx)(t.code, { children: `ItemInfo` }),
          ` fixture: path, size, timestamps, subfolder count, and total request count.`,
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
      (0, g.jsx)(t.h2, { id: `request-info`, children: `Request info` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Mock returns a request `,
          (0, g.jsx)(t.code, { children: `ItemInfo` }),
          `: path, size, timestamps, HTTP method, and URL. Fields present in the fixture but absent from the type (e.g. `,
          (0, g.jsx)(t.code, { children: `item_count` }),
          `) are omitted from the table.`,
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
      (0, g.jsx)(t.h2, { id: `error-state`, children: `Error state` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `When `,
          (0, g.jsx)(t.code, { children: `get_item_info` }),
          ` returns an error the panel replaces the table with the error message in red.`,
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
      (0, g.jsx)(t.h2, { id: `closed`, children: `Closed` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [(0, g.jsx)(t.code, { children: `isOpen=false` }), ` — component returns null.`],
      }),
      `
`,
      (0, g.jsx)(r, { of: s }),
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
          (0, g.jsxs)(t.tbody, {
            children: [
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `isOpen` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `boolean` }) }),
                  (0, g.jsx)(t.td, {
                    children: `Controls visibility; component returns null when false`,
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `onClose` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `() => void` }) }),
                  (0, g.jsx)(t.td, { children: `Called on backdrop click or Escape key` }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `path` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `string` }) }),
                  (0, g.jsxs)(t.td, {
                    children: [
                      `Filesystem path passed to `,
                      (0, g.jsx)(t.code, { children: `get_item_info` }),
                    ],
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `type` }) }),
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `'folder' | 'request'` }),
                  }),
                  (0, g.jsx)(t.td, {
                    children: `Sets the panel title ("Folder Info" or "Request Info")`,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, g.jsx)(t.h2, {
        id: `tauri-ipc-mocking-in-stories`,
        children: `Tauri IPC mocking in stories`,
      }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `InfoPanel calls `,
          (0, g.jsx)(t.code, { children: `commands.getItemInfo(path)` }),
          ` on mount. In Storybook, each story supplies a `,
          (0, g.jsx)(t.code, { children: `parameters.tauriMock` }),
          ` map with a `,
          (0, g.jsx)(t.code, { children: `get_item_info` }),
          ` key. The global `,
          (0, g.jsx)(t.code, { children: `withTauriMock` }),
          ` decorator in `,
          (0, g.jsx)(t.code, { children: `preview.tsx` }),
          ` intercepts IPC calls and routes them to the matching mock function.`,
        ],
      }),
      `
`,
      (0, g.jsxs)(t.ul, {
        children: [
          `
`,
          (0, g.jsxs)(t.li, {
            children: [
              `To show `,
              (0, g.jsx)(t.strong, { children: `loaded data` }),
              ` — return the raw `,
              (0, g.jsx)(t.code, { children: `ItemInfo` }),
              ` object (the binding wrapper adds `,
              (0, g.jsx)(t.code, { children: `{ status: "ok", data: … }` }),
              ` automatically).`,
            ],
          }),
          `
`,
          (0, g.jsxs)(t.li, {
            children: [
              `To show the `,
              (0, g.jsx)(t.strong, { children: `error state` }),
              ` — `,
              (0, g.jsx)(t.code, { children: `throw` }),
              ` a string; the binding catches non-Error throws and produces `,
              (0, g.jsx)(t.code, { children: `{ status: "error", error: … }` }),
              `.`,
            ],
          }),
          `
`,
          (0, g.jsxs)(t.li, {
            children: [
              `To show the `,
              (0, g.jsx)(t.strong, { children: `loading state` }),
              ` — return `,
              (0, g.jsx)(t.code, { children: `new Promise(() => {})` }),
              ` (never resolves).`,
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
