import { a as e, n as t, r as n } from './chunk-DnJy8xQt.js'
import { gt as r, t as i } from './iframe-CECvvSLk.js'
var a = n({ AllTokens: () => v, __namedExportsOrder: () => y, default: () => _ })
function o(e) {
  let [t, n] = (0, p.useState)({})
  return (
    (0, p.useEffect)(() => {
      function t() {
        let t = getComputedStyle(document.documentElement),
          r = {}
        for (let n of e) r[n] = t.getPropertyValue(n).trim()
        n(r)
      }
      t()
      let r = new MutationObserver(t)
      return (
        r.observe(document.documentElement, { attributes: !0, attributeFilter: [`data-theme`] }),
        () => r.disconnect()
      )
    }, [e.join(`,`)]),
    t
  )
}
function s({ name: e, value: t }) {
  return (0, m.jsxs)(`div`, {
    style: { display: `flex`, alignItems: `center`, gap: 10, padding: `4px 0` },
    children: [
      (0, m.jsx)(`div`, {
        title: t,
        style: {
          width: 24,
          height: 24,
          borderRadius: 4,
          backgroundColor: `var(${e})`,
          border: `1px solid var(--color-border-default)`,
          flexShrink: 0,
        },
      }),
      (0, m.jsx)(`span`, {
        style: {
          fontFamily: `var(--font-mono)`,
          fontSize: 11,
          color: `var(--color-text-primary)`,
          flexGrow: 1,
        },
        children: e,
      }),
      (0, m.jsx)(`span`, {
        style: { fontFamily: `var(--font-mono)`, fontSize: 11, color: `var(--color-text-muted)` },
        children: t || `—`,
      }),
    ],
  })
}
function c({ name: e, value: t }) {
  return (0, m.jsxs)(`div`, {
    style: { display: `flex`, alignItems: `center`, gap: 10, padding: `4px 0` },
    children: [
      (0, m.jsx)(`div`, {
        style: {
          width: 24,
          height: 24,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          flexShrink: 0,
        },
        children: (0, m.jsx)(`span`, {
          style: {
            fontFamily: `var(${e})`,
            fontSize: 14,
            color: `var(--color-text-primary)`,
            fontWeight: 600,
          },
          children: `Aa`,
        }),
      }),
      (0, m.jsx)(`span`, {
        style: {
          fontFamily: `var(--font-mono)`,
          fontSize: 11,
          color: `var(--color-text-primary)`,
          flexGrow: 1,
        },
        children: e,
      }),
      (0, m.jsx)(`span`, {
        style: {
          fontFamily: `var(${e})`,
          fontSize: 11,
          color: `var(--color-text-muted)`,
          maxWidth: 260,
          overflow: `hidden`,
          textOverflow: `ellipsis`,
          whiteSpace: `nowrap`,
        },
        children: t || `—`,
      }),
    ],
  })
}
function l({ name: e, value: t }) {
  return (0, m.jsxs)(`div`, {
    style: { display: `flex`, alignItems: `center`, gap: 10, padding: `4px 0` },
    children: [
      (0, m.jsx)(`div`, {
        style: {
          width: 24,
          height: 24,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          flexShrink: 0,
        },
        children: (0, m.jsx)(`span`, {
          style: {
            fontFamily: `var(--font-sans)`,
            fontSize: `var(${e})`,
            color: `var(--color-text-primary)`,
          },
          children: `Aa`,
        }),
      }),
      (0, m.jsx)(`span`, {
        style: {
          fontFamily: `var(--font-mono)`,
          fontSize: 11,
          color: `var(--color-text-primary)`,
          flexGrow: 1,
        },
        children: e,
      }),
      (0, m.jsx)(`span`, {
        style: { fontFamily: `var(--font-mono)`, fontSize: 11, color: `var(--color-text-muted)` },
        children: t || `—`,
      }),
    ],
  })
}
function u({ name: e, value: t }) {
  return (0, m.jsxs)(`div`, {
    style: { display: `flex`, alignItems: `center`, gap: 10, padding: `4px 0` },
    children: [
      (0, m.jsx)(`div`, {
        style: {
          width: 24,
          height: 24,
          borderRadius: `var(${e})`,
          backgroundColor: `var(--color-accent)`,
          flexShrink: 0,
        },
      }),
      (0, m.jsx)(`span`, {
        style: {
          fontFamily: `var(--font-mono)`,
          fontSize: 11,
          color: `var(--color-text-primary)`,
          flexGrow: 1,
        },
        children: e,
      }),
      (0, m.jsx)(`span`, {
        style: { fontFamily: `var(--font-mono)`, fontSize: 11, color: `var(--color-text-muted)` },
        children: t || `—`,
      }),
    ],
  })
}
function d({ token: e, values: t }) {
  let n = t[e.name] ?? ``
  switch (e.kind) {
    case `color`:
      return (0, m.jsx)(s, { name: e.name, value: n })
    case `font-family`:
      return (0, m.jsx)(c, { name: e.name, value: n })
    case `font-size`:
      return (0, m.jsx)(l, { name: e.name, value: n })
    case `radius`:
      return (0, m.jsx)(u, { name: e.name, value: n })
  }
}
function f() {
  let e = o(g)
  return (0, m.jsxs)(`div`, {
    style: {
      backgroundColor: `var(--color-bg-base)`,
      minHeight: `100vh`,
      padding: 32,
      fontFamily: `var(--font-sans)`,
    },
    children: [
      (0, m.jsx)(`h1`, {
        style: {
          color: `var(--color-text-primary)`,
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 32,
          marginTop: 0,
        },
        children: `Token Gallery`,
      }),
      (0, m.jsx)(`div`, {
        style: {
          display: `grid`,
          gridTemplateColumns: `repeat(auto-fill, minmax(380px, 1fr))`,
          gap: 32,
          alignItems: `start`,
        },
        children: h.map((t) =>
          (0, m.jsxs)(
            `section`,
            {
              children: [
                (0, m.jsx)(`h2`, {
                  style: {
                    color: `var(--color-text-secondary)`,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: `uppercase`,
                    letterSpacing: `0.08em`,
                    marginTop: 0,
                    marginBottom: 8,
                    paddingBottom: 6,
                    borderBottom: `1px solid var(--color-border-subtle)`,
                  },
                  children: t.label,
                }),
                t.tokens.map((t) => (0, m.jsx)(d, { token: t, values: e }, t.name)),
              ],
            },
            t.label
          )
        ),
      }),
    ],
  })
}
var p,
  m,
  h,
  g,
  _,
  v,
  y,
  b = t(() => {
    ;((p = e(r(), 1)),
      (m = i()),
      (h = [
        {
          label: `Background`,
          tokens: [
            { name: `--color-bg-base`, kind: `color` },
            { name: `--color-bg-panel`, kind: `color` },
            { name: `--color-bg-surface`, kind: `color` },
            { name: `--color-bg-overlay`, kind: `color` },
            { name: `--color-bg-muted`, kind: `color` },
            { name: `--color-bg-highlight`, kind: `color` },
          ],
        },
        {
          label: `Text`,
          tokens: [
            { name: `--color-text-primary`, kind: `color` },
            { name: `--color-text-secondary`, kind: `color` },
            { name: `--color-text-muted`, kind: `color` },
            { name: `--color-text-inverse`, kind: `color` },
            { name: `--color-text-link`, kind: `color` },
          ],
        },
        {
          label: `Border`,
          tokens: [
            { name: `--color-border-subtle`, kind: `color` },
            { name: `--color-border-default`, kind: `color` },
            { name: `--color-border-strong`, kind: `color` },
          ],
        },
        {
          label: `Accent`,
          tokens: [
            { name: `--color-accent`, kind: `color` },
            { name: `--color-accent-hover`, kind: `color` },
            { name: `--color-accent-foreground`, kind: `color` },
          ],
        },
        {
          label: `Status`,
          tokens: [
            { name: `--color-success`, kind: `color` },
            { name: `--color-success-muted`, kind: `color` },
            { name: `--color-warning`, kind: `color` },
            { name: `--color-warning-muted`, kind: `color` },
            { name: `--color-error`, kind: `color` },
            { name: `--color-error-muted`, kind: `color` },
            { name: `--color-info`, kind: `color` },
            { name: `--color-info-muted`, kind: `color` },
          ],
        },
        {
          label: `HTTP Methods`,
          tokens: [
            { name: `--color-method-get`, kind: `color` },
            { name: `--color-method-post`, kind: `color` },
            { name: `--color-method-put`, kind: `color` },
            { name: `--color-method-patch`, kind: `color` },
            { name: `--color-method-delete`, kind: `color` },
            { name: `--color-method-head`, kind: `color` },
            { name: `--color-method-options`, kind: `color` },
            { name: `--color-method-ws`, kind: `color` },
            { name: `--color-method-sse`, kind: `color` },
            { name: `--color-method-grpc`, kind: `color` },
            { name: `--color-method-graphql`, kind: `color` },
            { name: `--color-method-trace`, kind: `color` },
          ],
        },
        {
          label: `Syntax`,
          tokens: [
            { name: `--color-syntax-keyword`, kind: `color` },
            { name: `--color-syntax-string`, kind: `color` },
            { name: `--color-syntax-number`, kind: `color` },
            { name: `--color-syntax-comment`, kind: `color` },
            { name: `--color-syntax-punctuation`, kind: `color` },
            { name: `--color-syntax-property`, kind: `color` },
            { name: `--color-syntax-variable`, kind: `color` },
            { name: `--color-syntax-type`, kind: `color` },
            { name: `--color-syntax-operator`, kind: `color` },
          ],
        },
        {
          label: `Typography`,
          tokens: [
            { name: `--font-sans`, kind: `font-family` },
            { name: `--font-mono`, kind: `font-family` },
            { name: `--font-size-xs`, kind: `font-size` },
            { name: `--font-size-sm`, kind: `font-size` },
            { name: `--font-size-base`, kind: `font-size` },
            { name: `--font-size-md`, kind: `font-size` },
          ],
        },
        {
          label: `Shape`,
          tokens: [
            { name: `--radius-sm`, kind: `radius` },
            { name: `--radius-md`, kind: `radius` },
            { name: `--radius-lg`, kind: `radius` },
          ],
        },
      ]),
      (g = h.flatMap((e) => e.tokens.map((e) => e.name))),
      (_ = {
        title: `Design System/Token Gallery`,
        component: f,
        parameters: { layout: `fullscreen` },
      }),
      (v = {}),
      (v.parameters = {
        ...v.parameters,
        docs: {
          ...v.parameters?.docs,
          source: { originalSource: `{}`, ...v.parameters?.docs?.source },
          description: {
            story: `All 39 CSS design tokens rendered as named swatches, grouped by category.
Token values are read from the live document styles and update automatically
when the theme toolbar is switched.`,
            ...v.parameters?.docs?.description,
          },
        },
      }),
      (y = [`AllTokens`]))
  })
b()
export { v as AllTokens, y as __namedExportsOrder, _ as default, b as n, a as t }
