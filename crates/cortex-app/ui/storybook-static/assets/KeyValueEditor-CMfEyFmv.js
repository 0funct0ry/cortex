import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  AddRow as s,
  DeleteRow as c,
  DisabledRow as l,
  Empty as u,
  HeadersMode as d,
  MultipleRows as f,
  SingleRow as p,
  WithReadOnlyEntries as m,
  n as h,
  t as g,
} from './KeyValueEditor.stories-1uz3uRa5.js'
function _(e) {
  let t = {
    a: `a`,
    blockquote: `blockquote`,
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
  return (0, y.jsxs)(y.Fragment, {
    children: [
      (0, y.jsx)(i, { of: g }),
      `
`,
      (0, y.jsx)(t.h1, { id: `keyvalueeditor`, children: `KeyValueEditor` }),
      `
`,
      (0, y.jsx)(t.p, {
        children: `A full-featured key-value table editor used throughout Cortex for request headers, query parameters, form fields, and URL-encoded body fields. It supports drag-and-drop row reordering, bulk edit mode, inline autocomplete for HTTP headers, multi-row selection, undo/redo, duplicate-key detection, and an optional read-only inherited-entries section.`,
      }),
      `
`,
      (0, y.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, y.jsx)(t.a, {
            href: `../../../components/composer/KeyValueEditor.tsx`,
            children: (0, y.jsx)(t.code, {
              children: `src/components/composer/KeyValueEditor.tsx`,
            }),
          }),
        ],
      }),
      `
`,
      (0, y.jsxs)(t.blockquote, {
        children: [
          `
`,
          (0, y.jsxs)(t.p, {
            children: [
              (0, y.jsx)(t.strong, { children: `Context dependency.` }),
              ` KeyValueEditor calls `,
              (0, y.jsx)(t.code, { children: `useTabs()` }),
              ` to obtain the active collection ID for scoping custom-header localStorage memory. Stories wrap the component in `,
              (0, y.jsx)(t.code, { children: `TabsProvider` }),
              `; without an active tab the `,
              (0, y.jsx)(t.code, { children: `collectionId` }),
              ` is `,
              (0, y.jsx)(t.code, { children: `null` }),
              ` and custom-header memory is skipped — all other features work normally.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, y.jsx)(t.hr, {}),
      `
`,
      (0, y.jsx)(t.h2, { id: `empty`, children: `Empty` }),
      `
`,
      (0, y.jsx)(t.p, {
        children: `No entries supplied. KeyValueEditor normalises to a single blank placeholder row so the user always has an input target. The "Add parameter" button appears below it.`,
      }),
      `
`,
      (0, y.jsx)(r, { of: u }),
      `
`,
      (0, y.jsx)(t.hr, {}),
      `
`,
      (0, y.jsx)(t.h2, { id: `single-row`, children: `Single Row` }),
      `
`,
      (0, y.jsxs)(t.p, {
        children: [
          `One `,
          (0, y.jsx)(t.code, { children: `Content-Type: application/json` }),
          ` entry. The drag handle (⠿), enabled checkbox, key/value inputs, and the hover-reveal × delete button are all visible.`,
        ],
      }),
      `
`,
      (0, y.jsx)(r, { of: p }),
      `
`,
      (0, y.jsx)(t.hr, {}),
      `
`,
      (0, y.jsx)(t.h2, { id: `multiple-rows`, children: `Multiple Rows` }),
      `
`,
      (0, y.jsxs)(t.p, {
        children: [
          `Five entries including a deliberate duplicate `,
          (0, y.jsx)(t.code, { children: `Accept` }),
          ` key. Both rows with that key are highlighted with an amber left border to warn the user of the conflict.`,
        ],
      }),
      `
`,
      (0, y.jsx)(r, { of: f }),
      `
`,
      (0, y.jsx)(t.hr, {}),
      `
`,
      (0, y.jsx)(t.h2, { id: `disabled-row`, children: `Disabled Row` }),
      `
`,
      (0, y.jsxs)(t.p, {
        children: [
          `The `,
          (0, y.jsx)(t.code, { children: `X-Debug-Mode` }),
          ` row has `,
          (0, y.jsx)(t.code, { children: `enabled: false` }),
          `. It renders at 40 % opacity with read-only inputs and an unchecked checkbox. Toggling the checkbox re-enables the row.`,
        ],
      }),
      `
`,
      (0, y.jsx)(r, { of: l }),
      `
`,
      (0, y.jsx)(t.hr, {}),
      `
`,
      (0, y.jsx)(t.h2, { id: `with-read-only-entries`, children: `With Read-Only Entries` }),
      `
`,
      (0, y.jsx)(t.p, {
        children: `Two editable rows plus two read-only entries inherited from the collection. The inherited section is pinned to the bottom with its own heading and an info tooltip.`,
      }),
      `
`,
      (0, y.jsx)(r, { of: m }),
      `
`,
      (0, y.jsx)(t.hr, {}),
      `
`,
      (0, y.jsx)(t.h2, { id: `headers-mode`, children: `Headers Mode` }),
      `
`,
      (0, y.jsxs)(t.p, {
        children: [
          (0, y.jsx)(t.code, { children: `isHeaders=true` }),
          ` unlocks HTTP-header autocomplete. Focusing a key cell shows matching built-in header names; once a key with known value presets is chosen, focusing the value cell shows those presets. Custom headers typed in this mode are remembered per-collection in localStorage.`,
        ],
      }),
      `
`,
      (0, y.jsx)(r, { of: d }),
      `
`,
      (0, y.jsx)(t.hr, {}),
      `
`,
      (0, y.jsx)(t.h2, { id: `add-row-interaction`, children: `Add Row (interaction)` }),
      `
`,
      (0, y.jsxs)(t.p, {
        children: [
          (0, y.jsx)(t.code, { children: `play()` }),
          ` clicks "Add parameter" and asserts that `,
          (0, y.jsx)(t.code, { children: `onChange` }),
          ` is called with a third blank entry appended.`,
        ],
      }),
      `
`,
      (0, y.jsx)(r, { of: s }),
      `
`,
      (0, y.jsx)(t.hr, {}),
      `
`,
      (0, y.jsx)(t.h2, { id: `delete-row-interaction`, children: `Delete Row (interaction)` }),
      `
`,
      (0, y.jsxs)(t.p, {
        children: [
          (0, y.jsx)(t.code, { children: `play()` }),
          ` hovers the first row to reveal its × button, clicks it, and asserts that `,
          (0, y.jsx)(t.code, { children: `onChange` }),
          ` is called without the deleted entry.`,
        ],
      }),
      `
`,
      (0, y.jsx)(r, { of: c }),
      `
`,
      (0, y.jsx)(t.hr, {}),
      `
`,
      (0, y.jsx)(t.h2, { id: `props`, children: `Props` }),
      `
`,
      (0, y.jsxs)(t.table, {
        children: [
          (0, y.jsx)(t.thead, {
            children: (0, y.jsxs)(t.tr, {
              children: [
                (0, y.jsx)(t.th, { children: `Prop` }),
                (0, y.jsx)(t.th, { children: `Type` }),
                (0, y.jsx)(t.th, { children: `Default` }),
                (0, y.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, y.jsxs)(t.tbody, {
            children: [
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `entries` }) }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `HeaderEntry[]` }) }),
                  (0, y.jsx)(t.td, { children: `—` }),
                  (0, y.jsx)(t.td, { children: `The controlled list of key-value rows.` }),
                ],
              }),
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `onChange` }) }),
                  (0, y.jsx)(t.td, {
                    children: (0, y.jsx)(t.code, { children: `(entries: HeaderEntry[]) => void` }),
                  }),
                  (0, y.jsx)(t.td, { children: `—` }),
                  (0, y.jsx)(t.td, {
                    children: `Called on every mutation (add, delete, edit, reorder, toggle).`,
                  }),
                ],
              }),
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `title` }) }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `string` }) }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `''` }) }),
                  (0, y.jsx)(t.td, { children: `Section label in the meta header row.` }),
                ],
              }),
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, {
                    children: (0, y.jsx)(t.code, { children: `namePlaceholder` }),
                  }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `string` }) }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `'Key'` }) }),
                  (0, y.jsx)(t.td, { children: `Placeholder for key-column inputs.` }),
                ],
              }),
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, {
                    children: (0, y.jsx)(t.code, { children: `valuePlaceholder` }),
                  }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `string` }) }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `'Value'` }) }),
                  (0, y.jsx)(t.td, { children: `Placeholder for value-column inputs.` }),
                ],
              }),
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, {
                    children: (0, y.jsx)(t.code, { children: `addButtonLabel` }),
                  }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `string` }) }),
                  (0, y.jsx)(t.td, {
                    children: (0, y.jsx)(t.code, { children: `'Add parameter'` }),
                  }),
                  (0, y.jsx)(t.td, { children: `Label for the bottom add-row button.` }),
                ],
              }),
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `isHeaders` }) }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `boolean` }) }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `false` }) }),
                  (0, y.jsx)(t.td, {
                    children: `Enables HTTP-header autocomplete for key and value cells.`,
                  }),
                ],
              }),
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, {
                    children: (0, y.jsx)(t.code, { children: `caseSensitiveKeys` }),
                  }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `boolean` }) }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `false` }) }),
                  (0, y.jsxs)(t.td, {
                    children: [
                      `When `,
                      (0, y.jsx)(t.code, { children: `true` }),
                      `, duplicate-key detection is case-sensitive.`,
                    ],
                  }),
                ],
              }),
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, {
                    children: (0, y.jsx)(t.code, { children: `readOnlyEntries` }),
                  }),
                  (0, y.jsx)(t.td, {
                    children: (0, y.jsx)(t.code, { children: `{ key, value, description? }[]` }),
                  }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `undefined` }) }),
                  (0, y.jsx)(t.td, { children: `Read-only rows pinned below the editable table.` }),
                ],
              }),
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `readOnlyTitle` }) }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `string` }) }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `undefined` }) }),
                  (0, y.jsx)(t.td, { children: `Heading for the read-only section.` }),
                ],
              }),
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, {
                    children: (0, y.jsx)(t.code, { children: `readOnlyTooltip` }),
                  }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `string` }) }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `undefined` }) }),
                  (0, y.jsxs)(t.td, {
                    children: [
                      `Tooltip text for the info icon beside `,
                      (0, y.jsx)(t.code, { children: `readOnlyTitle` }),
                      `.`,
                    ],
                  }),
                ],
              }),
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `presets` }) }),
                  (0, y.jsx)(t.td, {
                    children: (0, y.jsx)(t.code, { children: `{ name, fields[] }[]` }),
                  }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `undefined` }) }),
                  (0, y.jsx)(t.td, {
                    children: `Preset configurations selectable from the "Apply Preset" dropdown.`,
                  }),
                ],
              }),
              (0, y.jsxs)(t.tr, {
                children: [
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `onApplyPreset` }) }),
                  (0, y.jsx)(t.td, {
                    children: (0, y.jsx)(t.code, { children: `(fields) => void` }),
                  }),
                  (0, y.jsx)(t.td, { children: (0, y.jsx)(t.code, { children: `undefined` }) }),
                  (0, y.jsx)(t.td, { children: `Called when the user picks a preset.` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, y.jsx)(t.h2, { id: `behaviour-notes`, children: `Behaviour Notes` }),
      `
`,
      (0, y.jsxs)(t.ul, {
        children: [
          `
`,
          (0, y.jsxs)(t.li, {
            children: [
              (0, y.jsx)(t.strong, { children: `Normalisation` }),
              ` — an empty `,
              (0, y.jsx)(t.code, { children: `entries` }),
              ` array is always normalised to `,
              (0, y.jsx)(t.code, { children: `[{ key: '', value: '', enabled: true }]` }),
              ` so there is always a blank row for input.`,
            ],
          }),
          `
`,
          (0, y.jsxs)(t.li, {
            children: [
              (0, y.jsx)(t.strong, { children: `Undo stack` }),
              ` — deleting rows pushes to an in-memory undo stack. Cmd/Ctrl+Z restores the last deleted batch. The stack resets when the component unmounts.`,
            ],
          }),
          `
`,
          (0, y.jsxs)(t.li, {
            children: [
              (0, y.jsx)(t.strong, { children: `Bulk edit` }),
              ` — the "Bulk Edit" button toggles a textarea view where entries are serialised as `,
              (0, y.jsx)(t.code, { children: `Key: Value` }),
              ` lines. Disabled rows are prefixed with `,
              (0, y.jsx)(t.code, { children: `#` }),
              `. Pasting or typing in bulk mode updates the table in real time.`,
            ],
          }),
          `
`,
          (0, y.jsxs)(t.li, {
            children: [
              (0, y.jsx)(t.strong, { children: `Drag-and-drop` }),
              ` — each row has a drag handle column. Dragging reorders rows; the drop target row shows a top accent border.`,
            ],
          }),
          `
`,
          (0, y.jsxs)(t.li, {
            children: [
              (0, y.jsx)(t.strong, { children: `Duplicate keys` }),
              ` — rows with a non-unique key value gain an amber (`,
              (0, y.jsx)(t.code, { children: `warning` }),
              `) left border. Case sensitivity is controlled by `,
              (0, y.jsx)(t.code, { children: `caseSensitiveKeys` }),
              `.`,
            ],
          }),
          `
`,
          (0, y.jsxs)(t.li, {
            children: [
              (0, y.jsx)(t.strong, { children: `Custom header memory` }),
              ` — in `,
              (0, y.jsx)(t.code, { children: `isHeaders` }),
              ` mode, typing a non-built-in header name and leaving the cell saves it to `,
              (0, y.jsx)(t.code, { children: `localStorage` }),
              ` under `,
              (0, y.jsx)(t.code, { children: `cortex.custom-headers.<collectionId>` }),
              `. These appear alongside built-in suggestions on subsequent sessions.`,
            ],
          }),
          `
`,
        ],
      }),
    ],
  })
}
function v(e = {}) {
  let { wrapper: t } = { ...n(), ...e.components }
  return t ? (0, y.jsx)(t, { ...e, children: (0, y.jsx)(_, { ...e }) }) : _(e)
}
var y
e(() => {
  ;((y = t()), o(), a(), h())
})()
export { v as default }
