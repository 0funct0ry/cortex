import { n as e } from './chunk-DnJy8xQt.js'
import { t } from './iframe-CECvvSLk.js'
import { r as n } from './react-DQ-_5NEo.js'
import { n as r, o as i, s as a } from './blocks-BSw4ipgC.js'
import { t as o } from './mdx-react-shim-BMmPYFJS.js'
import { AllIcons as s, n as c, t as l } from './IconCatalog.stories-Cz3BFcff.js'
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
    ul: `ul`,
    ...n(),
    ...e.components,
  }
  return (0, f.jsxs)(f.Fragment, {
    children: [
      (0, f.jsx)(i, { of: l }),
      `
`,
      (0, f.jsx)(t.h1, { id: `icon-catalog`, children: `Icon Catalog` }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Cortex uses a single icon module — `,
          (0, f.jsx)(t.code, { children: `src/components/ui/Icons.tsx` }),
          ` — as the canonical source for all UI icons. Every icon is an inline React SVG component that accepts a `,
          (0, f.jsx)(t.code, { children: `size` }),
          ` prop and all standard `,
          (0, f.jsx)(t.code, { children: `SVGProps` }),
          `, making them fully styleable via CSS.`,
        ],
      }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `This catalog renders every named export from that file. If an icon is not shown here, it is not exported from `,
          (0, f.jsx)(t.code, { children: `Icons.tsx` }),
          `.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `all-icons`, children: `All icons` }),
      `
`,
      (0, f.jsx)(r, { of: s }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `icon-component-api`, children: `Icon component API` }),
      `
`,
      (0, f.jsx)(t.p, { children: `All icons share the same interface:` }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-ts`,
          children: `interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number // sets both width and height; each icon has its own default
}
`,
        }),
      }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-tsx`,
          children: `import { Play, Search, Trash } from '@/components/ui/Icons'

// Default size (each icon has its own sensible default, typically 14–16px)
<Play />

// Explicit size
<Search size={20} />

// Colour via CSS (icons inherit currentColor)
<Trash size={16} className="text-error" />
<Trash size={16} style={{ color: 'var(--color-error)' }} />

// All SVG props pass through
<Play size={14} aria-label="Run request" className="text-text-primary" />
`,
        }),
      }),
      `
`,
      (0, f.jsxs)(t.p, {
        children: [
          `Icons inherit `,
          (0, f.jsx)(t.code, { children: `currentColor` }),
          ` for their `,
          (0, f.jsx)(t.code, { children: `stroke` }),
          ` or `,
          (0, f.jsx)(t.code, { children: `fill` }),
          `, so they automatically match whichever text colour is in scope. You never need to pass a colour prop directly.`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, { id: `icon-reference`, children: `Icon reference` }),
      `
`,
      (0, f.jsxs)(t.table, {
        children: [
          (0, f.jsx)(t.thead, {
            children: (0, f.jsxs)(t.tr, {
              children: [
                (0, f.jsx)(t.th, { children: `Icon` }),
                (0, f.jsx)(t.th, { children: `Export name` }),
                (0, f.jsx)(t.th, { children: `Default size` }),
                (0, f.jsx)(t.th, { children: `Typical use` }),
              ],
            }),
          }),
          (0, f.jsxs)(t.tbody, {
            children: [
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `AlertCircle` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Error state indicator, validation error` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `AlertTriangle` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Warning banner, caution notice` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Api` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `API endpoint node in the sidebar tree` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Branch` }) }),
                  (0, f.jsx)(t.td, { children: `12` }),
                  (0, f.jsx)(t.td, { children: `Git branch indicator, version label` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Check` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Success tick, checkbox checked state` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `ChevronDown` }) }),
                  (0, f.jsx)(t.td, { children: `12` }),
                  (0, f.jsx)(t.td, { children: `Collapsed → expanded toggle, select dropdown` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `ChevronLeft` }) }),
                  (0, f.jsx)(t.td, { children: `12` }),
                  (0, f.jsx)(t.td, { children: `Navigate back, collapse panel left` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `ChevronRight` }) }),
                  (0, f.jsx)(t.td, { children: `12` }),
                  (0, f.jsx)(t.td, { children: `Navigate forward, expand panel right` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `ChevronUp` }) }),
                  (0, f.jsx)(t.td, { children: `12` }),
                  (0, f.jsx)(t.td, { children: `Expanded → collapsed toggle` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `ChevronsRight` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Skip forward, expand all` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Code` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Code view, raw body tab` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Columns` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Side-by-side layout toggle` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Copy` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Copy to clipboard` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Download` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Export / download file` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Edit` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Rename, inline edit` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `ExternalLink` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Open in browser / new tab` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Eye` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Show / reveal secret` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `EyeOff` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Hide / mask secret` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `File` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Generic file node` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `FileText` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Request file, text document node` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Filter` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Filter list, query filter` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Folder` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Collection folder node` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Globe` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Environment switcher, base URL` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Info` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Info tooltip trigger, info banner` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Layers` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Collection runner, stacked requests` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Loader` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Spinner / in-progress indicator` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, {
                    children: (0, f.jsx)(t.code, { children: `MoreHorizontal` }),
                  }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Overflow menu (horizontal)` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `MoreVertical` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Overflow menu (vertical)` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Palette` }) }),
                  (0, f.jsx)(t.td, { children: `13` }),
                  (0, f.jsx)(t.td, { children: `Theme picker trigger` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Play` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Send request, run collection` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Plug` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Plugin, connection, extension` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Plus` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Add item, new request` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Power` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Enable / disable toggle` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Rocket` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Onboarding, launch, getting started` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Rows` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Stacked / list layout toggle` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Search` }) }),
                  (0, f.jsx)(t.td, { children: `13` }),
                  (0, f.jsx)(t.td, { children: `Search input trigger, command palette` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Settings` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Settings panel, configuration` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `SidebarToggle` }) }),
                  (0, f.jsx)(t.td, { children: `16` }),
                  (0, f.jsx)(t.td, { children: `Show / hide the sidebar` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Sliders` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Advanced options, parameters panel` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Star` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Favourite, bookmark` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Terminal` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `CLI mode, script runner` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Trash` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Delete item` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Upload` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Import file, upload body` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `Workspace` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Workspace node, root of tree` }),
                ],
              }),
              (0, f.jsxs)(t.tr, {
                children: [
                  (0, f.jsx)(t.td, { children: `—` }),
                  (0, f.jsx)(t.td, { children: (0, f.jsx)(t.code, { children: `X` }) }),
                  (0, f.jsx)(t.td, { children: `14` }),
                  (0, f.jsx)(t.td, { children: `Close, dismiss, remove tag` }),
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
      (0, f.jsx)(t.h2, { id: `adding-a-new-icon`, children: `Adding a new icon` }),
      `
`,
      (0, f.jsxs)(t.ol, {
        children: [
          `
`,
          (0, f.jsxs)(t.li, {
            children: [
              `Open `,
              (0, f.jsx)(t.code, { children: `src/components/ui/Icons.tsx` }),
              `.`,
            ],
          }),
          `
`,
          (0, f.jsx)(t.li, { children: `Export a new component following the existing pattern:` }),
          `
`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-tsx`,
          children: `export const MyIcon: React.FC<IconProps> = ({ size = 14, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* SVG path(s) */}
    <path d="..." />
  </svg>
)
`,
        }),
      }),
      `
`,
      (0, f.jsxs)(t.ol, {
        start: `3`,
        children: [
          `
`,
          (0, f.jsxs)(t.li, {
            children: [
              `The Icon Catalog story (`,
              (0, f.jsx)(t.code, { children: `IconCatalog.stories.tsx` }),
              `) uses `,
              (0, f.jsx)(t.code, { children: `import * as Icons` }),
              ` + `,
              (0, f.jsx)(t.code, { children: `Object.entries` }),
              `, so the new icon `,
              (0, f.jsx)(t.strong, { children: `appears here automatically` }),
              ` — no story change required.`,
            ],
          }),
          `
`,
          (0, f.jsx)(t.li, { children: `Update the icon reference table above in this MDX file.` }),
          `
`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.h3, { id: `icon-design-guidelines`, children: `Icon design guidelines` }),
      `
`,
      (0, f.jsxs)(t.ul, {
        children: [
          `
`,
          (0, f.jsxs)(t.li, {
            children: [
              (0, f.jsx)(t.strong, { children: `ViewBox:` }),
              ` always `,
              (0, f.jsx)(t.code, { children: `0 0 24 24` }),
              `.`,
            ],
          }),
          `
`,
          (0, f.jsxs)(t.li, {
            children: [
              (0, f.jsx)(t.strong, { children: `Stroke:` }),
              ` use `,
              (0, f.jsx)(t.code, { children: `currentColor` }),
              `; `,
              (0, f.jsx)(t.code, { children: `strokeWidth={1.5}` }),
              ` is the default weight. Prefer stroke over fill for line icons.`,
            ],
          }),
          `
`,
          (0, f.jsxs)(t.li, {
            children: [
              (0, f.jsx)(t.strong, { children: `Default size:` }),
              ` match the visual weight of similar icons. Most UI icons default to `,
              (0, f.jsx)(t.code, { children: `14px` }),
              `; navigation icons (chevrons) to `,
              (0, f.jsx)(t.code, { children: `12px` }),
              `; the sidebar toggle to `,
              (0, f.jsx)(t.code, { children: `16px` }),
              `.`,
            ],
          }),
          `
`,
          (0, f.jsxs)(t.li, {
            children: [
              (0, f.jsx)(t.strong, { children: `No hardcoded colours:` }),
              ` icons must respond to `,
              (0, f.jsx)(t.code, { children: `currentColor` }),
              ` so they inherit from the surrounding text colour context.`,
            ],
          }),
          `
`,
          (0, f.jsxs)(t.li, {
            children: [
              (0, f.jsx)(t.strong, { children: `Accessibility:` }),
              ` callers are responsible for `,
              (0, f.jsx)(t.code, { children: `aria-label` }),
              ` or wrapping with a visually-hidden label when the icon is the only affordance.`,
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      (0, f.jsx)(t.hr, {}),
      `
`,
      (0, f.jsx)(t.h2, {
        id: `how-icons-are-used-in-the-app`,
        children: `How icons are used in the app`,
      }),
      `
`,
      (0, f.jsx)(t.p, {
        children: `Icons are imported directly by name — there is no icon font, no sprite sheet, and no dynamic lookup:`,
      }),
      `
`,
      (0, f.jsx)(t.pre, {
        children: (0, f.jsx)(t.code, {
          className: `language-tsx`,
          children: `import { Play, Search, ChevronRight } from '@/components/ui/Icons'
`,
        }),
      }),
      `
`,
      (0, f.jsx)(t.p, { children: `Because they are inline SVGs, they:` }),
      `
`,
      (0, f.jsxs)(t.ul, {
        children: [
          `
`,
          (0, f.jsx)(t.li, { children: `Scale sharply at any resolution (no blur at high DPI).` }),
          `
`,
          (0, f.jsxs)(t.li, {
            children: [
              `Respond to CSS `,
              (0, f.jsx)(t.code, { children: `color` }),
              ` / `,
              (0, f.jsx)(t.code, { children: `currentColor` }),
              ` without any wrapper.`,
            ],
          }),
          `
`,
          (0, f.jsx)(t.li, {
            children: `Are tree-shaken by Vite — only the icons actually imported are included in the production bundle.`,
          }),
          `
`,
          (0, f.jsx)(t.li, {
            children: `Require no external asset loading — they render immediately without a network request.`,
          }),
          `
`,
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
