import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import { AllThemes as s, n as c, t as l } from './ThemeGallery.stories-BJH7513x.js'
function u(e) {
  let t = {
    code: `code`,
    h1: `h1`,
    h2: `h2`,
    h3: `h3`,
    hr: `hr`,
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
      (0, f.jsx)(t.h1, { id: `theme-gallery`, children: `Theme Gallery` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Cortex ships `,
          (0, f.jsx)(t.strong, { children: `13 themes` }),
          ` driven entirely by CSS custom properties. Every component uses tokens — never hardcoded colours — so switching themes requires only changing `,
          (0, f.jsx)(t.code, { children: `data-theme` }),
          ` on the root `,
          (0, f.jsx)(t.code, { children: `<html>` }),
          ` element. Use the `,
          (0, f.jsx)(t.strong, { children: `Theme` }),
          ` toolbar button at the top of this page to switch themes live.`,
        ],
      }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `The gallery below renders all 13 themes simultaneously. Each tile applies its own `,
          (0, f.jsx)(t.code, { children: `data-theme` }),
          ` attribute so it is a fully independent themed island. A blank or incorrectly coloured tile immediately signals a missing or incomplete theme CSS file.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `all-13-themes`, children: `All 13 themes` }),
      `
`,
      (0, f.jsx)(r, { of: s }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `theme-reference`, children: `Theme reference` }),
      `
`,
      (0, f.jsx)(t.h3, { id: `dark-themes-8`, children: `Dark themes (8)` }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Theme ID` }),
                (0, f.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `dark` }) }),
                  (0, f.jsx)(t.td, {
                    children: `Default dark theme. Deep grey backgrounds, amber accent.`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `dark-monochrome` }),
                  }),
                  (0, f.jsx)(t.td, {
                    children: `Greyscale variant of dark — zero colour accent, pure neutrals only.`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `dark-pastel` }) }),
                  (0, f.jsx)(t.td, {
                    children: `Dark backgrounds with soft, pastel-toned accents and method colours.`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `vscode-dark` }) }),
                  (0, f.jsx)(t.td, {
                    children: `Mirrors the VS Code default dark colour scheme for familiarity.`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `catppuccin-frappe` }),
                  }),
                  (0, f.jsx)(t.td, {
                    children: `Catppuccin Frappe — cool grey-purple dark palette.`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `catppuccin-macchiato` }),
                  }),
                  (0, f.jsx)(t.td, {
                    children: `Catppuccin Macchiato — deeper mauve-tinted dark palette.`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `catppuccin-mocha` }),
                  }),
                  (0, f.jsx)(t.td, {
                    children: `Catppuccin Mocha — the darkest Catppuccin variant, warm brown-purple.`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `nord` }) }),
                  (0, f.jsx)(t.td, { children: `Nord — arctic, blue-grey inspired dark palette.` }),
                ],
              }),
            ],
          }),
        ],
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `light-themes-5`, children: `Light themes (5)` }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Theme ID` }),
                (0, f.jsx)(t.th, { children: `Description` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `light` }) }),
                  (0, f.jsx)(t.td, {
                    children: `Default light theme. Off-white backgrounds, blue accent.`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `light-monochrome` }),
                  }),
                  (0, f.jsx)(t.td, {
                    children: `Greyscale variant of light — zero colour accent, pure neutrals.`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `light-pastel` }) }),
                  (0, f.jsx)(t.td, {
                    children: `Light backgrounds with soft, pastel-toned accents and method colours.`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `vscode-light` }) }),
                  (0, f.jsx)(t.td, {
                    children: `Mirrors the VS Code default light colour scheme.`,
                  }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `catppuccin-latte` }),
                  }),
                  (0, f.jsx)(t.td, {
                    children: `Catppuccin Latte — the light Catppuccin variant, warm cream tones.`,
                  }),
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
      (0, f.jsx)(t.h2, { id: `css-variable-contract`, children: `CSS variable contract` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Every theme must define all `,
          (0, f.jsx)(t.strong, { children: `39 CSS custom properties` }),
          ` under its `,
          (0, f.jsx)(t.code, { children: `[data-theme="<id>"]` }),
          ` selector. Use `,
          (0, f.jsx)(t.code, { children: `dark.css` }),
          ` as the canonical template — every variable present there must exist in every other theme.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-css`,
          children: `/* Example: src/styles/themes/dark.css */
[data-theme='dark'] {
  /* Background (6) */
  --color-bg-base: #1a1a1a;
  --color-bg-panel: #212121;
  --color-bg-surface: #2a2a2a;
  --color-bg-overlay: #303030;
  --color-bg-muted: #252525;
  --color-bg-highlight: #2d3748;

  /* Text (5) */
  --color-text-primary: #e2e8f0;
  --color-text-secondary: #a0aec0;
  --color-text-muted: #718096;
  --color-text-inverse: #1a1a1a;
  --color-text-link: #63b3ed;

  /* Border (3) */
  --color-border-subtle: #2d3748;
  --color-border-default: #4a5568;
  --color-border-strong: #63b3ed;

  /* Accent (3) */
  --color-accent: #f6ad55;
  --color-accent-hover: #ed8936;
  --color-accent-foreground: #1a1a1a;

  /* Status (8) */
  --color-success: #68d391;
  --color-success-muted: #22543d;
  --color-warning: #f6ad55;
  --color-warning-muted: #744210;
  --color-error: #fc8181;
  --color-error-muted: #63171b;
  --color-info: #63b3ed;
  --color-info-muted: #1a365d;

  /* HTTP Methods (13) */
  --color-method-get: #68d391;
  --color-method-post: #63b3ed;
  --color-method-put: #f6ad55;
  --color-method-patch: #76e4f7;
  --color-method-delete: #fc8181;
  --color-method-head: #b794f4;
  --color-method-options: #fbd38d;
  --color-method-ws: #4fd1c5;
  --color-method-sse: #f687b3;
  --color-method-grpc: #90cdf4;
  --color-method-graphql: #ed64a6;
  --color-method-trace: #a0aec0;
  --color-method-connect: #68d391;

  /* Syntax highlighting (9) */
  --color-syntax-keyword: #f6ad55;
  --color-syntax-string: #68d391;
  --color-syntax-number: #76e4f7;
  --color-syntax-comment: #718096;
  --color-syntax-punctuation: #a0aec0;
  --color-syntax-property: #63b3ed;
  --color-syntax-variable: #fc8181;
  --color-syntax-type: #b794f4;
  --color-syntax-operator: #f6ad55;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-size-xs: 0.6875rem;
  --font-size-sm: 0.75rem;
  --font-size-base: 0.8125rem;
  --font-size-md: 0.875rem;

  /* Shape */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 10px;
}
`,
        }),
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `how-theming-works`, children: `How theming works` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Themes are applied by setting the `,
          (0, f.jsx)(t.code, { children: `data-theme` }),
          ` attribute on the `,
          (0, f.jsx)(t.code, { children: `<html>` }),
          ` element. Because the selectors are element-agnostic (`,
          (0, f.jsx)(t.code, { children: `[data-theme='light']` }),
          `, not `,
          (0, f.jsx)(t.code, { children: `:root[data-theme]` }),
          `), you can also scope a theme to any subtree — which is how the gallery above renders all 13 themes simultaneously:`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-tsx`,
          children: `// Each tile is a self-contained themed island
function ThemeTile({ id }: { id: string }) {
  return (
    <div data-theme={id} style={{ backgroundColor: 'var(--color-bg-base)' }}>
      {/* All CSS tokens resolve to this theme's values inside this div */}
    </div>
  )
}
`,
        }),
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `adding-a-new-theme`, children: `Adding a new theme` }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `Three files must be updated when adding a new theme. The ThemeGallery story acts as a contract enforcement point — a blank tile means a step was missed.`,
      }),
      `
`,
      (0, f.jsx)(t.p, { children: (0, f.jsx)(t.strong, { children: `1. Create the CSS file` }) }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-bash`,
          children: `# Copy the dark theme as a starting point
cp src/styles/themes/dark.css src/styles/themes/<new-id>.css
`,
        }),
      }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Edit `,
          (0, f.jsx)(t.code, { children: `src/styles/themes/<new-id>.css` }),
          ` — change the selector and redefine all 39 tokens.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.p, {
        children: (0, f.jsxs)(t.strong, {
          children: [`2. Register in `, (0, f.jsx)(t.code, { children: `ThemeContext.tsx` })],
        }),
      }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-ts`,
          children: `// src/contexts/ThemeContext.tsx
export type ThemeId =
  | 'dark' | 'light' | ...
  | '<new-id>'          // ← add here

export const THEMES: ThemeId[] = [
  'dark', 'light', ...,
  '<new-id>',           // ← add here
]
`,
        }),
      }),
      `
`,
      (0, f.jsx)(t.p, {
        children: (0, f.jsxs)(t.strong, {
          children: [`3. Register in `, (0, f.jsx)(t.code, { children: `.storybook/preview.tsx` })],
        }),
      }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-ts`,
          children: `withThemeByDataAttribute({
  themes: {
    dark: 'dark',
    ...
    '<new-id>': '<new-id>',   // ← add here
  },
  defaultTheme: 'dark',
  attributeName: 'data-theme',
})
`,
        }),
      }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `After these three changes, the new theme tile will appear in the gallery above and in the toolbar dropdown.`,
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
