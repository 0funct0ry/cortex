import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import {
  NoTags as s,
  OpenTagPopover as c,
  WithTags as l,
  n as u,
  t as d,
} from './TagsRow.stories-DUMGhGkn.js'
function f(e) {
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
  return (0, m.jsxs)(m.Fragment, {
    children: [
      (0, m.jsx)(i, { of: d }),
      `
`,
      (0, m.jsx)(t.h1, { id: `tagsrow`, children: `TagsRow` }),
      `
`,
      (0, m.jsx)(t.p, {
        children: `A slim horizontal row rendered above the request URL bar. It displays the tags applied to the current request as coloured chips and provides controls to apply, create, recolour, and remove tags from the collection's shared tag registry.`,
      }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `Source: `,
          (0, m.jsx)(t.a, {
            href: `../../../components/composer/TagsRow.tsx`,
            children: (0, m.jsx)(t.code, { children: `src/components/composer/TagsRow.tsx` }),
          }),
        ],
      }),
      `
`,
      (0, m.jsxs)(t.blockquote, {
        children: [
          `
`,
          (0, m.jsxs)(t.p, {
            children: [
              (0, m.jsx)(t.strong, { children: `Store-seeded stories.` }),
              ` TagsRow reads `,
              (0, m.jsx)(t.code, { children: `requestStates[requestId].tags` }),
              ` from `,
              (0, m.jsx)(t.code, { children: `requestStore` }),
              ` and `,
              (0, m.jsx)(t.code, { children: `collections[collectionPath].manifest.tag_registry` }),
              ` from `,
              (0, m.jsx)(t.code, { children: `collectionStore` }),
              `. Every story pre-seeds both stores via `,
              (0, m.jsx)(t.code, { children: `beforeEach` }),
              ` using the stable IDs `,
              (0, m.jsx)(t.code, { children: `story-tagsrow-req-001` }),
              ` and `,
              (0, m.jsx)(t.code, { children: `story-collection` }),
              `.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `no-tags`, children: `No Tags` }),
      `
`,
      (0, m.jsx)(t.p, {
        children: `The default empty state for a newly created request. The row renders a single "＋ Add tag" button. Clicking it opens the TagPopover.`,
      }),
      `
`,
      (0, m.jsx)(r, { of: s }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `with-tags`, children: `With Tags` }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `Two tags — `,
          (0, m.jsx)(t.code, { children: `auth` }),
          ` (blue) and `,
          (0, m.jsx)(t.code, { children: `payments` }),
          ` (green) — are applied. Each chip shows a coloured dot (click to recolour), the tag name, and a × button to remove. A bare "＋" button appears after the last chip to add more tags without removing existing ones.`,
        ],
      }),
      `
`,
      (0, m.jsx)(r, { of: l }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `open-tag-popover`, children: `Open Tag Popover` }),
      `
`,
      (0, m.jsxs)(t.p, {
        children: [
          `A `,
          (0, m.jsx)(t.code, { children: `play()` }),
          ` function clicks "＋ Add tag" and verifies that the TagPopover renders its search/create input. From the popover the user can search existing collection tags or type a new name and choose a colour.`,
        ],
      }),
      `
`,
      (0, m.jsx)(r, { of: c }),
      `
`,
      (0, m.jsx)(t.hr, {}),
      `
`,
      (0, m.jsx)(t.h2, { id: `props`, children: `Props` }),
      `
`,
      (0, m.jsxs)(t.table, {
        children: [
          (0, m.jsx)(t.thead, {
            children: (0, m.jsxs)(t.tr, {
              children: [
                (0, m.jsx)(t.th, { children: `Prop` }),
                (0, m.jsx)(t.th, { children: `Type` }),
                (0, m.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, m.jsxs)(t.tbody, {
            children: [
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, { children: (0, m.jsx)(t.code, { children: `requestId` }) }),
                  (0, m.jsx)(t.td, { children: (0, m.jsx)(t.code, { children: `string` }) }),
                  (0, m.jsxs)(t.td, {
                    children: [
                      `Looks up `,
                      (0, m.jsx)(t.code, { children: `requestStates[requestId].tags` }),
                      ` in `,
                      (0, m.jsx)(t.code, { children: `requestStore` }),
                      `.`,
                    ],
                  }),
                ],
              }),
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, {
                    children: (0, m.jsx)(t.code, { children: `collectionPath` }),
                  }),
                  (0, m.jsx)(t.td, { children: (0, m.jsx)(t.code, { children: `string` }) }),
                  (0, m.jsxs)(t.td, {
                    children: [
                      `Looks up `,
                      (0, m.jsx)(t.code, {
                        children: `collections[collectionPath].manifest.tag_registry`,
                      }),
                      ` in `,
                      (0, m.jsx)(t.code, { children: `collectionStore` }),
                      `.`,
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
      (0, m.jsx)(t.h2, { id: `behaviour-notes`, children: `Behaviour Notes` }),
      `
`,
      (0, m.jsxs)(t.ul, {
        children: [
          `
`,
          (0, m.jsxs)(t.li, {
            children: [
              (0, m.jsx)(t.strong, { children: `Tag registry` }),
              ` — tags are defined once per collection in `,
              (0, m.jsx)(t.code, { children: `manifest.tag_registry` }),
              `. Applying a tag to a request stores only the tag name string in `,
              (0, m.jsx)(t.code, { children: `requestStates[id].tags` }),
              `; the color is resolved from the registry at render time.`,
            ],
          }),
          `
`,
          (0, m.jsxs)(t.li, {
            children: [
              (0, m.jsx)(t.strong, { children: `Pending cache` }),
              ` — when a new tag is created, the definition is optimistically cached in local component state (`,
              (0, m.jsx)(t.code, { children: `pendingTagDefs` }),
              `) so the chip renders with the correct colour before the Tauri `,
              (0, m.jsx)(t.code, { children: `save_tag_registry` }),
              ` round-trip completes.`,
            ],
          }),
          `
`,
          (0, m.jsxs)(t.li, {
            children: [
              (0, m.jsx)(t.strong, { children: `Recolouring` }),
              ` — clicking a chip's coloured dot opens `,
              (0, m.jsx)(t.code, { children: `ColorSwatchPopover` }),
              `. Selecting a swatch calls `,
              (0, m.jsx)(t.code, { children: `updateTagRegistry` }),
              ` to persist the new color for all requests that share this tag.`,
            ],
          }),
          `
`,
          (0, m.jsxs)(t.li, {
            children: [
              (0, m.jsx)(t.strong, { children: `Empty state` }),
              ` — when no tags are applied and the popover is closed, only the "+ Add tag" label is rendered. When at least one tag is applied a bare "＋" button appears at the end of the chip list.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, m.jsx)(t.h2, { id: `store-dependencies`, children: `Store Dependencies` }),
      `
`,
      (0, m.jsxs)(t.table, {
        children: [
          (0, m.jsx)(t.thead, {
            children: (0, m.jsxs)(t.tr, {
              children: [
                (0, m.jsx)(t.th, { children: `Store` }),
                (0, m.jsx)(t.th, { children: `Field` }),
                (0, m.jsx)(t.th, { children: `Purpose` }),
              ],
            }),
          }),
          (0, m.jsxs)(t.tbody, {
            children: [
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, { children: (0, m.jsx)(t.code, { children: `requestStore` }) }),
                  (0, m.jsx)(t.td, {
                    children: (0, m.jsx)(t.code, { children: `requestStates[requestId].tags` }),
                  }),
                  (0, m.jsx)(t.td, {
                    children: `Array of tag name strings applied to this request`,
                  }),
                ],
              }),
              (0, m.jsxs)(t.tr, {
                children: [
                  (0, m.jsx)(t.td, {
                    children: (0, m.jsx)(t.code, { children: `collectionStore` }),
                  }),
                  (0, m.jsx)(t.td, {
                    children: (0, m.jsx)(t.code, {
                      children: `collections[collectionPath].manifest.tag_registry`,
                    }),
                  }),
                  (0, m.jsx)(t.td, { children: `Tag registry supplying name→color definitions` }),
                ],
              }),
            ],
          }),
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
