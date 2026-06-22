import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import { AllTokens as s, n as c, t as l } from './TokenGallery.stories-CschUfnP.js'
function u(e) {
  let t = {
    code: `code`,
    h1: `h1`,
    h2: `h2`,
    h3: `h3`,
    hr: `hr`,
    li: `li`,
    ol: `ol`,
    p: `p`,
    pre: `pre`,
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
  return (0, f.jsxs)(f.Fragment, {
    children: [
      (0, f.jsx)(i, { of: l }),
      `
`,
      (0, f.jsx)(t.h1, { id: `token-gallery`, children: `Token Gallery` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Cortex's visual language is built on `,
          (0, f.jsx)(t.strong, { children: `39 CSS custom properties` }),
          ` (design tokens) defined in `,
          (0, f.jsx)(t.code, { children: `src/styles/tokens.css` }),
          `. Every component uses tokens — never hardcoded colours — so themes only need to override these properties under their own `,
          (0, f.jsx)(t.code, { children: `[data-theme="<id>"]` }),
          ` selector.`,
        ],
      }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `This gallery renders all 39 tokens as named swatches, grouped by category. Token values are read live from the computed document styles, so switching the `,
          (0, f.jsx)(t.strong, { children: `Theme` }),
          ` toolbar at the top of the page updates every swatch automatically.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `all-tokens`, children: `All tokens` }),
      `
`,
      (0, f.jsx)(r, { of: s }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `token-categories`, children: `Token categories` }),
      `
`,
      (0, f.jsx)(t.h3, { id: `background-6`, children: `Background (6)` }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `Background tokens define the layered surface system. Each layer sits on top of the previous one, creating depth without shadows.`,
      }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Token` }),
                (0, f.jsx)(t.th, { children: `Role` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-bg-base` }),
                  }),
                  (0, f.jsx)(t.td, {
                    children: `Page / window root background — the darkest layer`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-bg-panel` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Sidebar, panel chrome — one step above base` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-bg-surface` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Cards, list items, editor background` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-bg-overlay` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Dropdowns, popovers, context menus` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-bg-muted` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Subtle fills for inactive or disabled areas` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-bg-highlight` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Selection highlight, hover state fill` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `text-5`, children: `Text (5)` }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Token` }),
                (0, f.jsx)(t.th, { children: `Role` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-text-primary` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Default body text, headings` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-text-secondary` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Supporting labels, metadata` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-text-muted` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Placeholders, disabled text, timestamps` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-text-inverse` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Text on accent/filled backgrounds` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-text-link` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Hyperlinks, interactive text` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `border-3`, children: `Border (3)` }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Token` }),
                (0, f.jsx)(t.th, { children: `Role` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-border-subtle` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Dividers, hairlines — lowest contrast` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-border-default` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Input outlines, card borders` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-border-strong` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Focused input, selected item outline` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `accent-3`, children: `Accent (3)` }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `The brand accent is the single colour used for primary actions (buttons, active state indicators, links on dark surfaces).`,
      }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Token` }),
                (0, f.jsx)(t.th, { children: `Role` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-accent` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Primary brand colour` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-accent-hover` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Darkened accent for hover / active states` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-accent-foreground` }),
                  }),
                  (0, f.jsx)(t.td, {
                    children: `Text / icon colour on an accent-filled background`,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `status-8`, children: `Status (8)` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Each status colour has a `,
          (0, f.jsx)(t.strong, { children: `full-saturation` }),
          ` variant (badges, icons, text) and a `,
          (0, f.jsx)(t.strong, { children: `muted` }),
          ` variant (background fills for alert banners).`,
        ],
      }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Token` }),
                (0, f.jsx)(t.th, { children: `Role` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-success` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Success icon, badge, text` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-success-muted` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Success alert banner fill` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-warning` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Warning icon, badge, text` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-warning-muted` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Warning alert banner fill` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `--color-error` }) }),
                  (0, f.jsx)(t.td, { children: `Error icon, badge, text` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-error-muted` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Error alert banner fill` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `--color-info` }) }),
                  (0, f.jsx)(t.td, { children: `Info icon, badge, text` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-info-muted` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Info alert banner fill` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `http-methods-12`, children: `HTTP Methods (12)` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Each HTTP method and protocol type has a dedicated colour. These are used by `,
          (0, f.jsx)(t.code, { children: `MethodBadge` }),
          ` and throughout the request composer to provide instant visual scanning.`,
        ],
      }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Token` }),
                (0, f.jsx)(t.th, { children: `Method` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-get` }),
                  }),
                  (0, f.jsx)(t.td, { children: `GET` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-post` }),
                  }),
                  (0, f.jsx)(t.td, { children: `POST` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-put` }),
                  }),
                  (0, f.jsx)(t.td, { children: `PUT` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-patch` }),
                  }),
                  (0, f.jsx)(t.td, { children: `PATCH` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-delete` }),
                  }),
                  (0, f.jsx)(t.td, { children: `DELETE` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-head` }),
                  }),
                  (0, f.jsx)(t.td, { children: `HEAD` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-options` }),
                  }),
                  (0, f.jsx)(t.td, { children: `OPTIONS` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-ws` }),
                  }),
                  (0, f.jsx)(t.td, { children: `WebSocket` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-sse` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Server-Sent Events` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-grpc` }),
                  }),
                  (0, f.jsx)(t.td, { children: `gRPC` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-graphql` }),
                  }),
                  (0, f.jsx)(t.td, { children: `GraphQL` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-trace` }),
                  }),
                  (0, f.jsx)(t.td, { children: `TRACE` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `syntax-9`, children: `Syntax (9)` }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `Syntax highlighting colours for the built-in code editor. These match the active theme's palette so code always looks native.`,
      }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Token` }),
                (0, f.jsx)(t.th, { children: `Role` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-syntax-keyword` }),
                  }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      `Language keywords (`,
                      (0, f.jsx)(t.code, { children: `if` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `return` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `function` }),
                      `)`,
                    ],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-syntax-string` }),
                  }),
                  (0, f.jsx)(t.td, { children: `String literals` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-syntax-number` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Numeric literals` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-syntax-comment` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Comments` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-syntax-punctuation` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Brackets, commas, colons` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-syntax-property` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Object keys, JSON property names` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-syntax-variable` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Variable names` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-syntax-type` }),
                  }),
                  (0, f.jsx)(t.td, { children: `Type annotations` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-syntax-operator` }),
                  }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      `Operators (`,
                      (0, f.jsx)(t.code, { children: `=` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `+` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `=>` }),
                      `)`,
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
      (0, f.jsx)(t.h3, { id: `typography-6`, children: `Typography (6)` }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Token` }),
                (0, f.jsx)(t.th, { children: `Value` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `--font-sans` }) }),
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `'Inter', system-ui, sans-serif` }),
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `--font-mono` }) }),
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, {
                      children: `'JetBrains Mono', 'Fira Code', monospace`,
                    }),
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--font-size-xs` }),
                  }),
                  (0, f.jsxs)(t.td, {
                    children: [(0, f.jsx)(t.code, { children: `11px` }), ` — captions, badges`],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--font-size-sm` }),
                  }),
                  (0, f.jsxs)(t.td, {
                    children: [(0, f.jsx)(t.code, { children: `12px` }), ` — secondary labels`],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--font-size-base` }),
                  }),
                  (0, f.jsxs)(t.td, {
                    children: [(0, f.jsx)(t.code, { children: `13px` }), ` — body text`],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--font-size-md` }),
                  }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `14px` }),
                      ` — slightly larger body / subheadings`,
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
      (0, f.jsx)(t.h3, { id: `shape-3`, children: `Shape (3)` }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Token` }),
                (0, f.jsx)(t.th, { children: `Value` }),
                (0, f.jsx)(t.th, { children: `Usage` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `--radius-sm` }) }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `3px` }) }),
                  (0, f.jsx)(t.td, { children: `Badges, tags, small chips` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `--radius-md` }) }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `5px` }) }),
                  (0, f.jsx)(t.td, { children: `Inputs, buttons, cards` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `--radius-lg` }) }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `8px` }) }),
                  (0, f.jsx)(t.td, { children: `Modals, panels, popovers` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `how-tokens-are-defined`, children: `How tokens are defined` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `All 39 tokens have fallback values on `,
          (0, f.jsx)(t.code, { children: `:root` }),
          ` in `,
          (0, f.jsx)(t.code, { children: `src/styles/tokens.css` }),
          `. Each theme overrides them under its own attribute selector:`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-css`,
          children: `/* src/styles/tokens.css — fallback defaults */
:root {
  --color-bg-base: #000000;
  --color-accent: #000000;
  /* ... all 39 tokens ... */
}

/* src/styles/themes/dark.css — theme override */
[data-theme='dark'] {
  --color-bg-base: #1a1a1a;
  --color-accent: #f6ad55;
  /* ... all 39 tokens ... */
}
`,
        }),
      }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Because the selector is element-agnostic (`,
          (0, f.jsx)(t.code, { children: `[data-theme]` }),
          `, not `,
          (0, f.jsx)(t.code, { children: `:root` }),
          `), any DOM element can act as a theme root — this is how `,
          (0, f.jsx)(t.code, { children: `ThemeGallery` }),
          ` renders all 13 themes simultaneously without global conflicts.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, {
        id: `using-tokens-in-components`,
        children: `Using tokens in components`,
      }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `Always reference tokens via CSS custom properties or Tailwind utility classes, never with hardcoded values:`,
      }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-tsx`,
          children: `/* ✅ Correct — responds to theme changes */
<div className="bg-bg-panel text-text-primary border border-border-default rounded-md">
  <span className="text-text-muted">Metadata</span>
</div>

/* ✅ Also correct — inline CSS var */
<div style={{ color: 'var(--color-accent)' }}>Accent text</div>

/* ❌ Wrong — hardcoded colour breaks on theme switch */
<div style={{ color: '#f6ad55' }}>Accent text</div>
`,
        }),
      }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `The Tailwind config in `,
          (0, f.jsx)(t.code, { children: `tailwind.config.ts` }),
          ` maps every token to a utility class:`,
        ],
      }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `CSS variable` }),
                (0, f.jsx)(t.th, { children: `Tailwind class` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-bg-base` }),
                  }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `bg-bg-base` }) }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-text-primary` }),
                  }),
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `text-text-primary` }),
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-border-default` }),
                  }),
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `border-border-default` }),
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-accent` }),
                  }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `bg-accent` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `text-accent` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `border-accent` }),
                    ],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `--color-method-get` }),
                  }),
                  (0, f.jsxs)(t.td, {
                    children: [
                      (0, f.jsx)(t.code, { children: `text-method-get` }),
                      `, `,
                      (0, f.jsx)(t.code, { children: `bg-method-get` }),
                    ],
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `--radius-md` }) }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `rounded-md` }) }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `adding-a-new-token`, children: `Adding a new token` }),
      `
`,
      (0, f.jsxs)(t.ol, {
        children: [
          `
`,
          (0, f.jsxs)(t.li, {
            children: [
              `Add the token with a fallback value in `,
              (0, f.jsx)(t.code, { children: `src/styles/tokens.css` }),
              ` under `,
              (0, f.jsx)(t.code, { children: `:root` }),
              `.`,
            ],
          }),
          `
`,
          (0, f.jsxs)(t.li, {
            children: [
              `Add a themed value in every theme file under `,
              (0, f.jsx)(t.code, { children: `src/styles/themes/` }),
              `.`,
            ],
          }),
          `
`,
          (0, f.jsxs)(t.li, {
            children: [
              `Add the Tailwind mapping in `,
              (0, f.jsx)(t.code, { children: `tailwind.config.ts` }),
              ` if the token needs a utility class.`,
            ],
          }),
          `
`,
          (0, f.jsxs)(t.li, {
            children: [
              `Add the token to the `,
              (0, f.jsx)(t.code, { children: `CATEGORIES` }),
              ` array in `,
              (0, f.jsx)(t.code, { children: `TokenGallery.stories.tsx` }),
              ` so it appears in this gallery.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `A token that appears as solid black (`,
          (0, f.jsx)(t.code, { children: `#000000` }),
          `) in the gallery indicates step 2 was missed for the active theme — the fallback from `,
          (0, f.jsx)(t.code, { children: `tokens.css` }),
          ` is showing.`,
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
