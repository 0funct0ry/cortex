import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  DynamicVariable as s,
  Empty as c,
  MultipleVariableMix as l,
  VariableSegments as u,
  WithUrl as d,
  n as f,
  t as p,
} from './UrlInput.stories-CO8XDMls.js'
function m(e) {
  let t = {
    a: `a`,
    blockquote: `blockquote`,
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
  return (0, g.jsxs)(g.Fragment, {
    children: [
      (0, g.jsx)(i, { of: p }),
      `
`,
      (0, g.jsx)(t.h1, { id: `urlinput`, children: `UrlInput` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `The URL text field in the request URL bar. Beneath a native `,
          (0, g.jsx)(t.code, { children: `<input>` }),
          ` element sits an invisible colour-coded overlay `,
          (0, g.jsx)(t.code, { children: `<div>` }),
          ` that highlights `,
          (0, g.jsx)(t.code, { children: `{{variable}}` }),
          ` tokens in real time. The overlay's horizontal scroll is kept in sync with the input so colour spans always align with typed characters.`,
        ],
      }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, g.jsx)(t.a, {
            href: `../../../components/composer/UrlInput.tsx`,
            children: (0, g.jsx)(t.code, { children: `src/components/composer/UrlInput.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, g.jsxs)(t.blockquote, {
        children: [
          `
`,
          (0, g.jsxs)(t.p, {
            children: [
              (0, g.jsx)(t.strong, { children: `Store-seeded stories.` }),
              ` UrlInput reads from `,
              (0, g.jsx)(t.code, { children: `TabsContext` }),
              `, `,
              (0, g.jsx)(t.code, { children: `requestStore` }),
              `, and `,
              (0, g.jsx)(t.code, { children: `collectionEnvironmentStore` }),
              `. These stories wrap the component in a `,
              (0, g.jsx)(t.code, { children: `TabsProvider` }),
              ` decorator and pre-seed `,
              (0, g.jsx)(t.code, { children: `requestStore.resolvedVariables` }),
              ` via `,
              (0, g.jsx)(t.code, { children: `beforeEach` }),
              ` so variable colour-coding works without a running Tauri backend.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `empty`, children: `Empty` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `The input with no URL. Shows the placeholder `,
          (0, g.jsx)(t.em, { children: `"Enter URL or paste text"` }),
          ` in muted text.`,
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
      (0, g.jsx)(t.h2, { id: `with-url`, children: `With URL` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `A plain URL without any variable tokens. The overlay renders in the default `,
          (0, g.jsx)(t.code, { children: `text-text-primary` }),
          ` colour — no coloured spans.`,
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
      (0, g.jsx)(t.h2, { id: `variable-segments`, children: `Variable Segments` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `A URL containing two `,
          (0, g.jsx)(t.code, { children: `{{variable}}` }),
          ` tokens. The story seeds `,
          (0, g.jsx)(t.code, { children: `requestStore` }),
          ` with `,
          (0, g.jsx)(t.code, { children: `baseUrl` }),
          ` resolved and leaves `,
          (0, g.jsx)(t.code, { children: `userId` }),
          ` absent so the two colours are visible side-by-side.`,
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
              (0, g.jsx)(t.code, { children: `{{baseUrl}}` }),
              ` — `,
              (0, g.jsx)(t.strong, { children: `green` }),
              ` (`,
              (0, g.jsx)(t.code, { children: `text-success` }),
              `) — resolved in the store`,
            ],
          }),
          `
`,
          (0, g.jsxs)(t.li, {
            children: [
              (0, g.jsx)(t.code, { children: `{{userId}}` }),
              ` — `,
              (0, g.jsx)(t.strong, { children: `red` }),
              ` (`,
              (0, g.jsx)(t.code, { children: `text-error` }),
              `) — not found in any scope`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `Hover either token to see the `,
          (0, g.jsx)(t.strong, { children: `VarPopover` }),
          ` with the resolved value or an `,
          (0, g.jsx)(t.em, { children: `"Unresolved"` }),
          ` badge. The `,
          (0, g.jsx)(t.code, { children: `play()` }),
          ` function asserts both overlay spans are in the DOM.`,
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
      (0, g.jsx)(t.h2, { id: `dynamic-variable`, children: `Dynamic Variable` }),
      `
`,
      (0, g.jsxs)(t.p, {
        children: [
          `A URL containing a `,
          (0, g.jsx)(t.code, { children: `$` }),
          `-prefixed dynamic variable (`,
          (0, g.jsx)(t.code, { children: `{{$timestamp}}` }),
          `). Dynamic variables are computed at request-send time by the Rust executor and are therefore never "resolved" at preview time. They always render in `,
          (0, g.jsx)(t.strong, { children: `accent blue` }),
          ` (`,
          (0, g.jsx)(t.code, { children: `text-accent` }),
          `).`,
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
      (0, g.jsx)(t.h2, { id: `multiple-variable-mix`, children: `Multiple Variable Mix` }),
      `
`,
      (0, g.jsx)(t.p, {
        children: `All three colour classes in a single URL — resolved (green), unresolved (red), and dynamic (blue). Use this story to verify there are no rendering conflicts when multiple token types appear together.`,
      }),
      `
`,
      (0, g.jsx)(r, { of: l }),
      `
`,
      (0, g.jsx)(t.hr, {}),
      `
`,
      (0, g.jsx)(t.h2, { id: `variable-colour-semantics`, children: `Variable Colour Semantics` }),
      `
`,
      (0, g.jsxs)(t.table, {
        children: [
          (0, g.jsx)(t.thead, {
            children: (0, g.jsxs)(t.tr, {
              children: [
                (0, g.jsx)(t.th, { children: `Colour` }),
                (0, g.jsx)(t.th, { children: `Tailwind class` }),
                (0, g.jsx)(t.th, { children: `Meaning` }),
              ],
            }),
          }),
          (0, g.jsxs)(t.tbody, {
            children: [
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Green` }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `text-success` }) }),
                  (0, g.jsx)(t.td, {
                    children: `Variable resolved — a value exists in the active environment or workspace`,
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Red` }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `text-error` }) }),
                  (0, g.jsx)(t.td, {
                    children: `Variable unresolved — no value found in any scope`,
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: `Blue` }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `text-accent` }) }),
                  (0, g.jsxs)(t.td, {
                    children: [
                      `Dynamic variable starting with `,
                      (0, g.jsx)(t.code, { children: `$` }),
                      ` — value computed at send time`,
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
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `value` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `string` }) }),
                  (0, g.jsxs)(t.td, {
                    children: [
                      `The current URL string. May contain `,
                      (0, g.jsx)(t.code, { children: `{{variable}}` }),
                      ` tokens. Fully controlled — the parent manages state.`,
                    ],
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `onChange` }) }),
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `(value: string) => void` }),
                  }),
                  (0, g.jsx)(t.td, {
                    children: `Called on every keystroke with the new URL string.`,
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `onEnter` }) }),
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `() => void` }) }),
                  (0, g.jsx)(t.td, {
                    children: `Optional. Called when Enter is pressed and the autocomplete picker is not handling the event.`,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, g.jsx)(t.h2, { id: `behaviour-notes`, children: `Behaviour Notes` }),
      `
`,
      (0, g.jsxs)(t.ul, {
        children: [
          `
`,
          (0, g.jsxs)(t.li, {
            children: [
              (0, g.jsx)(t.strong, { children: `Overlay sync` }),
              ` — a `,
              (0, g.jsx)(t.code, { children: `scroll` }),
              ` listener on the `,
              (0, g.jsx)(t.code, { children: `<input>` }),
              ` keeps `,
              (0, g.jsx)(t.code, { children: `overlayRef.scrollLeft` }),
              ` in step so variable spans never drift horizontally.`,
            ],
          }),
          `
`,
          (0, g.jsxs)(t.li, {
            children: [
              (0, g.jsx)(t.strong, { children: `Autocomplete picker` }),
              ` — typing `,
              (0, g.jsx)(t.code, { children: `{{` }),
              ` opens a Headless UI `,
              (0, g.jsx)(t.code, { children: `<Combobox>` }),
              ` that lists all variables in scope. ↑/↓ navigate; Enter selects and inserts `,
              (0, g.jsx)(t.code, { children: `{{variableName}}` }),
              ` at the caret; Escape closes without inserting.`,
            ],
          }),
          `
`,
          (0, g.jsxs)(t.li, {
            children: [
              (0, g.jsx)(t.strong, { children: `Hover popover` }),
              ` — 140 ms hide-delay prevents the `,
              (0, g.jsx)(t.code, { children: `VarPopover` }),
              ` from flickering when the cursor moves between token and popover.`,
            ],
          }),
          `
`,
          (0, g.jsxs)(t.li, {
            children: [
              (0, g.jsx)(t.strong, { children: `Caret colour` }),
              ` — the input text is `,
              (0, g.jsx)(t.code, { children: `text-transparent` }),
              ` (hidden) with `,
              (0, g.jsx)(t.code, { children: `caret-accent` }),
              ` so only the caret is visible; all visible text comes from the overlay.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, g.jsx)(t.h2, { id: `store-dependencies`, children: `Store Dependencies` }),
      `
`,
      (0, g.jsxs)(t.table, {
        children: [
          (0, g.jsx)(t.thead, {
            children: (0, g.jsxs)(t.tr, {
              children: [
                (0, g.jsx)(t.th, { children: `Store` }),
                (0, g.jsx)(t.th, { children: `Field` }),
                (0, g.jsx)(t.th, { children: `Purpose` }),
              ],
            }),
          }),
          (0, g.jsxs)(t.tbody, {
            children: [
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `TabsContext` }) }),
                  (0, g.jsxs)(t.td, {
                    children: [
                      (0, g.jsx)(t.code, { children: `activeTabId` }),
                      `, `,
                      (0, g.jsx)(t.code, { children: `activeTab` }),
                    ],
                  }),
                  (0, g.jsxs)(t.td, {
                    children: [
                      `Keys into `,
                      (0, g.jsx)(t.code, { children: `requestStore` }),
                      `; provides `,
                      (0, g.jsx)(t.code, { children: `collectionId` }),
                    ],
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, { children: (0, g.jsx)(t.code, { children: `requestStore` }) }),
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `resolvedVariables[activeTabId]` }),
                  }),
                  (0, g.jsx)(t.td, {
                    children: `Map of variable name → resolved value used for colour coding`,
                  }),
                ],
              }),
              (0, g.jsxs)(t.tr, {
                children: [
                  (0, g.jsx)(t.td, {
                    children: (0, g.jsx)(t.code, { children: `collectionEnvironmentStore` }),
                  }),
                  (0, g.jsxs)(t.td, {
                    children: [
                      (0, g.jsx)(t.code, { children: `collectionEnvironments` }),
                      `, `,
                      (0, g.jsx)(t.code, { children: `activeCollectionEnvName` }),
                    ],
                  }),
                  (0, g.jsx)(t.td, {
                    children: `Collection-scoped env var names for badge variant styling`,
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
function h(e = {}) {
  let { wrapper: t } = { ...n(), ...e.components }
  return t ? (0, g.jsx)(t, { ...e, children: (0, g.jsx)(m, { ...e }) }) : m(e)
}
var g
e(() => {
  ;((g = t()), o(), a(), f())
})()
export { h as default }
