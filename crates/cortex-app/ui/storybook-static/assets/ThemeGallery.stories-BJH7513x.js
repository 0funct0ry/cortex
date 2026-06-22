import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { t as n } from './iframe-CECvvSLk.js'
import { n as r, t as i } from './MethodBadge-Dl_g0J1V.js'
var a = t({ AllThemes: () => f, __namedExportsOrder: () => p, default: () => d })
function o({ id: e, label: t }) {
  return (0, c.jsxs)(`div`, {
    'data-theme': e,
    style: {
      backgroundColor: `var(--color-bg-base)`,
      border: `1px solid var(--color-border-default)`,
      borderRadius: 8,
      padding: 16,
      display: `flex`,
      flexDirection: `column`,
      gap: 12,
      minWidth: 0,
    },
    children: [
      (0, c.jsx)(`span`, {
        style: {
          color: `var(--color-text-primary)`,
          fontWeight: 600,
          fontSize: `0.75rem`,
          fontFamily: `var(--font-sans)`,
        },
        children: t,
      }),
      (0, c.jsx)(`div`, {
        style: { display: `flex`, gap: 4, flexWrap: `wrap` },
        children: [`GET`, `POST`, `DELETE`, `WS`].map((e) => (0, c.jsx)(i, { method: e }, e)),
      }),
      (0, c.jsx)(`div`, {
        style: { display: `flex`, gap: 4 },
        children: u.map((e) =>
          (0, c.jsx)(
            `div`,
            {
              title: e,
              style: {
                width: 16,
                height: 16,
                borderRadius: 3,
                backgroundColor: `var(${e})`,
                border: `1px solid var(--color-border-subtle)`,
              },
            },
            e
          )
        ),
      }),
      (0, c.jsxs)(`div`, {
        style: {
          color: `var(--color-text-secondary)`,
          fontSize: `0.7rem`,
          fontFamily: `var(--font-sans)`,
        },
        children: [
          `Secondary text · `,
          (0, c.jsx)(`span`, {
            style: { color: `var(--color-text-muted)` },
            children: `Muted text`,
          }),
        ],
      }),
    ],
  })
}
function s() {
  return (0, c.jsx)(`div`, {
    style: {
      display: `grid`,
      gridTemplateColumns: `repeat(3, 1fr)`,
      gap: 16,
      padding: 24,
      maxWidth: 900,
    },
    children: l.map((e) => (0, c.jsx)(o, { id: e.id, label: e.label }, e.id)),
  })
}
var c,
  l,
  u,
  d,
  f,
  p,
  m = e(() => {
    ;(r(),
      (c = n()),
      (l = [
        { id: `dark`, label: `Dark` },
        { id: `dark-monochrome`, label: `Dark Monochrome` },
        { id: `dark-pastel`, label: `Dark Pastel` },
        { id: `vscode-dark`, label: `VS Code Dark` },
        { id: `catppuccin-frappe`, label: `Catppuccin Frappé` },
        { id: `catppuccin-macchiato`, label: `Catppuccin Macchiato` },
        { id: `catppuccin-mocha`, label: `Catppuccin Mocha` },
        { id: `nord`, label: `Nord` },
        { id: `light`, label: `Light` },
        { id: `light-monochrome`, label: `Light Monochrome` },
        { id: `light-pastel`, label: `Light Pastel` },
        { id: `vscode-light`, label: `VS Code Light` },
        { id: `catppuccin-latte`, label: `Catppuccin Latte` },
      ]),
      (u = [
        `--color-bg-panel`,
        `--color-bg-surface`,
        `--color-accent`,
        `--color-error`,
        `--color-success`,
        `--color-info`,
      ]),
      (d = {
        title: `Design System/Theme Gallery`,
        component: s,
        parameters: { layout: `fullscreen` },
      }),
      (f = {}),
      (f.parameters = {
        ...f.parameters,
        docs: {
          ...f.parameters?.docs,
          source: { originalSource: `{}`, ...f.parameters?.docs?.source },
          description: {
            story: `All 13 Cortex themes rendered simultaneously, each tile scoped by its own
\`data-theme\` attribute. A blank or unstyled tile indicates a missing theme
CSS file or incomplete token definition.`,
            ...f.parameters?.docs?.description,
          },
        },
      }),
      (p = [`AllThemes`]))
  })
m()
export { f as AllThemes, p as __namedExportsOrder, d as default, m as n, a as t }
