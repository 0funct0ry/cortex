import { a as e, n as t } from './chunk-DnJy8xQt.js'
import { b as n, f as r, gt as i, m as a, t as o, y as s } from './iframe-CECvvSLk.js'
import { n as c, r as l } from './TabsContext-DSn62RXv.js'
import {
  a as u,
  c as d,
  d as f,
  f as p,
  i as m,
  l as h,
  n as g,
  o as _,
  p as v,
  r as y,
  s as b,
  t as x,
  u as S,
} from './VarPopover-CXmoFTgw.js'
var C,
  w,
  T,
  E,
  D,
  O = t(() => {
    ;((C = e(i(), 1)),
      f(),
      r(),
      c(),
      s(),
      S(),
      b(),
      g(),
      u(),
      (w = o()),
      (T = {}),
      (E = new Set()),
      (D = ({ value: e, onChange: t, onEnter: r }) => {
        let { activeTabId: i, activeTab: o } = l(),
          s = a((e) => (i && e.resolvedVariables[i]) || T),
          c = (0, C.useMemo)(() => h(e), [e]),
          u = c?.query ?? ``,
          f = (0, C.useMemo)(() => d(s, u), [s, u]),
          g = o?.collectionId ?? null,
          b = n((e) => e.loadCollectionEnvironments),
          S = n((e) => e.collectionEnvironments),
          D = n((e) => e.activeCollectionEnvName)
        ;(0, C.useEffect)(() => {
          g && b(g)
        }, [g, b])
        let O = (0, C.useMemo)(() => {
            let e = g ? (D[g] ?? null) : null
            if (!g || !e) return E
            let t = (S[g] ?? []).find((t) => t.name === e)
            return t ? new Set(t.variables.map((e) => e.name)) : E
          }, [g, D, S]),
          k = (0, C.useCallback)((e) => s[e] ?? null, [s]),
          A = (0, C.useRef)(null),
          j = (0, C.useRef)(null),
          M = (0, C.useRef)(null),
          [N, P] = (0, C.useState)({
            visible: !1,
            x: 0,
            y: 0,
            varName: ``,
            resolved: null,
            isDynamic: !1,
            badge: y,
          }),
          F = (0, C.useCallback)(() => {
            A.current && j.current && (j.current.scrollLeft = A.current.scrollLeft)
          }, [])
        ;((0, C.useEffect)(() => {
          let e = A.current
          if (e) return (e.addEventListener(`scroll`, F), () => e.removeEventListener(`scroll`, F))
        }, [F]),
          (0, C.useEffect)(() => {
            F()
          }, [e, F]))
        let I = (0, C.useCallback)(() => {
            M.current &&= (clearTimeout(M.current), null)
          }, []),
          L = (0, C.useCallback)(() => {
            ;(M.current && clearTimeout(M.current),
              (M.current = window.setTimeout(() => P((e) => ({ ...e, visible: !1 })), 140)))
          }, []),
          R = (0, C.useCallback)(
            (e, t) => {
              M.current &&= (clearTimeout(M.current), null)
              let n = e.currentTarget.getBoundingClientRect(),
                r = t.startsWith(`$`),
                i = r ? null : k(t)
              P({
                visible: !0,
                x: n.left + n.width / 2,
                y: n.bottom + 6,
                varName: t,
                resolved: i,
                isDynamic: r,
                badge: m(t, i, r, O),
              })
            },
            [k, O]
          )
        return (0, w.jsx)(p, {
          immediate: !0,
          value: null,
          onChange: (n) => {
            if (!n || !c) return
            let r = A.current,
              i = r?.selectionStart ?? e.length
            t(e.slice(0, c.openOffset) + `{{${n}}}` + e.slice(i))
            let a = c.openOffset + n.length + 4
            setTimeout(() => {
              r && (r.focus(), r.setSelectionRange(a, a))
            }, 0)
          },
          children: (0, w.jsxs)(`div`, {
            className: `flex-1 flex flex-col justify-center min-w-0`,
            children: [
              (0, w.jsxs)(`div`, {
                className: `relative flex items-center h-[30px] bg-bg-surface border border-border-default rounded-md transition-all duration-150 focus-within:border-border-strong focus-within:ring-2 focus-within:ring-accent/20`,
                children: [
                  (0, w.jsx)(`div`, {
                    ref: j,
                    'aria-hidden': !0,
                    className: `absolute inset-0 flex items-center px-3 font-mono text-sm overflow-hidden whitespace-pre pointer-events-none ${e ? `text-text-primary` : `text-text-muted`}`,
                    children: e
                      ? ((e) =>
                          e.split(/(\{\{[^{}]*\}\})/).map((e, t) => {
                            if (e.startsWith(`{{`) && e.endsWith(`}}`)) {
                              let n = e.slice(2, -2).trim(),
                                r = n.startsWith(`$`),
                                i = !r && !!k(n),
                                a = `text-error`
                              return (
                                r ? (a = `text-accent`) : i && (a = `text-success`),
                                (0, w.jsx)(
                                  `span`,
                                  {
                                    className: `${a} pointer-events-auto cursor-help font-medium`,
                                    onMouseEnter: (e) => R(e, n),
                                    onMouseLeave: L,
                                    children: e,
                                  },
                                  t
                                )
                              )
                            }
                            return (0, w.jsx)(`span`, { children: e }, t)
                          }))(e)
                      : (0, w.jsx)(`span`, {
                          className: `text-text-muted`,
                          children: `Enter URL or paste text`,
                        }),
                  }),
                  (0, w.jsx)(v, {
                    ref: A,
                    as: `input`,
                    type: `text`,
                    value: e,
                    displayValue: () => e,
                    onChange: (e) => t(e.target.value),
                    onKeyDown: (e) => {
                      e.defaultPrevented || (e.key === `Enter` && r?.())
                    },
                    onBlur: () => {},
                    className: `w-full h-full bg-transparent border-none outline-none px-3 font-mono text-sm text-transparent caret-accent selection:bg-accent/20`,
                    autoCapitalize: `none`,
                    autoCorrect: `off`,
                    spellCheck: !1,
                  }),
                ],
              }),
              (0, w.jsx)(_, { suggestions: f, query: u, open: !!c }),
              N.visible && (0, w.jsx)(x, { data: N, onMouseEnter: I, onMouseLeave: L }, N.varName),
            ],
          }),
        })
      }),
      (D.__docgenInfo = {
        description: `URL input bar with inline variable highlighting and {{ autocomplete.

A transparent <input> sits on top of a colour-coded overlay; the overlay's
horizontal scroll is kept in sync with the input. This keeps native caret
hit-testing, keyboard shortcuts and click-to-position fully intact.

Autocomplete is powered by @headlessui/react <Combobox> which handles all
keyboard navigation (↑/↓/Enter/Escape) correctly without stale-ref issues.`,
        methods: [],
        displayName: `UrlInput`,
        props: {
          value: { required: !0, tsType: { name: `string` }, description: `` },
          onChange: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(value: string) => void`,
              signature: {
                arguments: [{ type: { name: `string` }, name: `value` }],
                return: { name: `void` },
              },
            },
            description: ``,
          },
          onEnter: {
            required: !1,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `() => void`,
              signature: { arguments: [], return: { name: `void` } },
            },
            description: ``,
          },
        },
      }))
  })
export { O as n, D as t }
