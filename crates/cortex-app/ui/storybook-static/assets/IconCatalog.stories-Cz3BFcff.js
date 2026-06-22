import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { t as n } from './iframe-CECvvSLk.js'
import { O as r, m as i } from './Icons-DjzhDYF3.js'
var a = t({ AllIcons: () => l, __namedExportsOrder: () => u, default: () => c })
function o() {
  let e = Object.entries(i)
  return (0, s.jsxs)(`div`, {
    style: {
      backgroundColor: `var(--color-bg-base)`,
      minHeight: `100vh`,
      padding: 32,
      fontFamily: `var(--font-sans)`,
    },
    children: [
      (0, s.jsx)(`h1`, {
        style: {
          color: `var(--color-text-primary)`,
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 8,
          marginTop: 0,
        },
        children: `Icon Catalog`,
      }),
      (0, s.jsxs)(`p`, {
        style: { color: `var(--color-text-muted)`, fontSize: 12, marginBottom: 32, marginTop: 0 },
        children: [
          e.length,
          ` icons · sourced from`,
          ` `,
          (0, s.jsx)(`code`, {
            style: {
              fontFamily: `var(--font-mono)`,
              backgroundColor: `var(--color-bg-surface)`,
              padding: `1px 4px`,
              borderRadius: 3,
            },
            children: `components/ui/Icons.tsx`,
          }),
        ],
      }),
      (0, s.jsx)(`div`, {
        style: {
          display: `grid`,
          gridTemplateColumns: `repeat(auto-fill, minmax(100px, 1fr))`,
          gap: 8,
        },
        children: e.map(([e, t]) =>
          (0, s.jsxs)(
            `div`,
            {
              title: e,
              style: {
                display: `flex`,
                flexDirection: `column`,
                alignItems: `center`,
                justifyContent: `center`,
                gap: 8,
                padding: `16px 8px`,
                borderRadius: 6,
                border: `1px solid var(--color-border-subtle)`,
                backgroundColor: `var(--color-bg-panel)`,
                cursor: `default`,
              },
              children: [
                (0, s.jsx)(t, {
                  size: 24,
                  style: { color: `var(--color-text-primary)`, flexShrink: 0 },
                }),
                (0, s.jsx)(`span`, {
                  style: {
                    color: `var(--color-text-muted)`,
                    fontSize: 10,
                    fontFamily: `var(--font-mono)`,
                    textAlign: `center`,
                    wordBreak: `break-all`,
                    lineHeight: 1.3,
                  },
                  children: e,
                }),
              ],
            },
            e
          )
        ),
      }),
    ],
  })
}
var s,
  c,
  l,
  u,
  d = e(() => {
    ;(r(),
      (s = n()),
      (c = {
        title: `Design System/Icon Catalog`,
        component: o,
        parameters: { layout: `fullscreen` },
      }),
      (l = {}),
      (l.parameters = {
        ...l.parameters,
        docs: {
          ...l.parameters?.docs,
          source: { originalSource: `{}`, ...l.parameters?.docs?.source },
          description: {
            story: `Every named icon exported from \`components/ui/Icons.tsx\`, rendered at size 24
with its export name. The count in the subtitle reflects the true export count —
if an icon is missing here it is not exported from Icons.tsx.`,
            ...l.parameters?.docs?.description,
          },
        },
      }),
      (u = [`AllIcons`]))
  })
d()
export { l as AllIcons, u as __namedExportsOrder, c as default, d as n, a as t }
