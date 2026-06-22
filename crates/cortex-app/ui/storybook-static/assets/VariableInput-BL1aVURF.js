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
      (D = ({
        value: e,
        onChange: t,
        onKeyDown: r,
        onPaste: i,
        placeholder: o = ``,
        className: s = ``,
        id: c,
        readOnly: u = !1,
        onFocus: f,
        onBlur: g,
        inputRef: b,
        'data-row': S,
        'data-field': D,
        masked: O = !1,
        type: k = `text`,
      }) => {
        let { activeTabId: A, activeTab: j } = l(),
          M = a((e) => (A && e.resolvedVariables[A]) || T),
          N = j?.collectionId ?? null,
          P = n((e) => e.collectionEnvironments),
          F = n((e) => e.activeCollectionEnvName),
          I = (0, C.useMemo)(() => {
            let e = N ? (F[N] ?? null) : null
            if (!N || !e) return E
            let t = (P[N] ?? []).find((t) => t.name === e)
            return t ? new Set(t.variables.map((e) => e.name)) : E
          }, [N, F, P]),
          L = (0, C.useRef)(null),
          R = b || L,
          z = (0, C.useRef)(null),
          B = (0, C.useRef)(null),
          [V, H] = (0, C.useState)({
            visible: !1,
            x: 0,
            y: 0,
            varName: ``,
            resolved: null,
            isDynamic: !1,
            badge: y,
          }),
          U = (0, C.useMemo)(() => h(e), [e]),
          W = U?.query ?? ``,
          G = (0, C.useMemo)(() => d(M, W), [M, W]),
          K = (n) => {
            if (!n || !U) return
            let r = R.current,
              i = r?.selectionStart ?? e.length
            t(e.slice(0, U.openOffset) + `{{${n}}}` + e.slice(i))
            let a = U.openOffset + n.length + 4
            setTimeout(() => {
              r && (r.focus(), r.setSelectionRange(a, a))
            }, 0)
          },
          q = C.useCallback(() => {
            R.current && z.current && (z.current.scrollLeft = R.current.scrollLeft)
          }, [])
        ;((0, C.useEffect)(() => {
          let e = R.current
          if (e) return (e.addEventListener(`scroll`, q), () => e.removeEventListener(`scroll`, q))
        }, [R, q]),
          (0, C.useEffect)(() => {
            q()
          }, [e, q]))
        let J = (0, C.useCallback)(() => {
            B.current &&= (clearTimeout(B.current), null)
          }, []),
          Y = (0, C.useCallback)(() => {
            ;(B.current && clearTimeout(B.current),
              (B.current = window.setTimeout(() => H((e) => ({ ...e, visible: !1 })), 140)))
          }, []),
          X = (0, C.useCallback)(
            (e, t) => {
              B.current &&= (clearTimeout(B.current), null)
              let n = e.currentTarget.getBoundingClientRect(),
                r = t.startsWith(`$`),
                i = r ? null : (M[t] ?? null)
              H({
                visible: !0,
                x: n.left + n.width / 2,
                y: n.bottom + 8,
                varName: t,
                resolved: i,
                isDynamic: r,
                badge: m(t, i, r, I),
              })
            },
            [M, I]
          )
        return (0, w.jsxs)(p, {
          immediate: !0,
          value: null,
          onChange: K,
          children: [
            (0, w.jsxs)(`div`, {
              className: `relative w-full h-full flex items-center group`,
              children: [
                (0, w.jsx)(`div`, {
                  ref: z,
                  className: `absolute inset-x-0 bottom-0 top-0 flex items-center px-3 font-mono text-sm pointer-events-none overflow-hidden whitespace-pre select-none ${e ? `text-text-primary` : `text-text-muted`}`,
                  children: e
                    ? ((e) =>
                        e.split(/(\{\{[^{}]*\}\})/).map((e, t) => {
                          if (e.startsWith(`{{`) && e.endsWith(`}}`)) {
                            let n = e.slice(2, -2).trim(),
                              r = n.startsWith(`$`),
                              i = !r && !!M[n],
                              a = `border-b border-warning text-warning`
                            return (
                              r
                                ? (a = `border-b border-accent text-accent`)
                                : i && (a = `border-b border-success text-success`),
                              (0, w.jsx)(
                                `span`,
                                {
                                  className: `${a} pointer-events-auto cursor-help font-mono font-medium`,
                                  onMouseEnter: (e) => X(e, n),
                                  onMouseLeave: Y,
                                  children: e,
                                },
                                t
                              )
                            )
                          }
                          return (0, w.jsx)(`span`, { children: O ? `•`.repeat(e.length) : e }, t)
                        }))(e)
                    : (0, w.jsx)(`span`, { className: `text-text-muted opacity-50`, children: o }),
                }),
                (0, w.jsx)(v, {
                  ref: R,
                  as: `input`,
                  type: k,
                  id: c,
                  value: e,
                  displayValue: () => e,
                  onChange: (e) => t(e.target.value),
                  onKeyDown: (e) => {
                    if (e.defaultPrevented) {
                      e.stopPropagation()
                      return
                    }
                    r?.(e)
                  },
                  onPaste: i,
                  onFocus: f,
                  onBlur: g,
                  placeholder: o,
                  disabled: u,
                  className: `w-full h-full bg-transparent border-none outline-none px-3 font-mono text-sm text-transparent caret-accent selection:bg-accent/20 ${s}`,
                  autoCapitalize: `none`,
                  autoCorrect: `off`,
                  spellCheck: !1,
                  'data-row': S,
                  'data-field': D,
                }),
              ],
            }),
            (0, w.jsx)(_, { suggestions: G, query: W, open: !!U }),
            V.visible && (0, w.jsx)(x, { data: V, onMouseEnter: J, onMouseLeave: Y }, V.varName),
          ],
        })
      }),
      (D.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `VariableInput`,
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
          onKeyDown: {
            required: !1,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(e: React.KeyboardEvent<HTMLInputElement>) => void`,
              signature: {
                arguments: [
                  {
                    type: {
                      name: `ReactKeyboardEvent`,
                      raw: `React.KeyboardEvent<HTMLInputElement>`,
                      elements: [{ name: `HTMLInputElement` }],
                    },
                    name: `e`,
                  },
                ],
                return: { name: `void` },
              },
            },
            description: ``,
          },
          onPaste: {
            required: !1,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(e: React.ClipboardEvent<HTMLInputElement>) => void`,
              signature: {
                arguments: [
                  {
                    type: {
                      name: `ReactClipboardEvent`,
                      raw: `React.ClipboardEvent<HTMLInputElement>`,
                      elements: [{ name: `HTMLInputElement` }],
                    },
                    name: `e`,
                  },
                ],
                return: { name: `void` },
              },
            },
            description: ``,
          },
          placeholder: {
            required: !1,
            tsType: { name: `string` },
            description: ``,
            defaultValue: { value: `''`, computed: !1 },
          },
          className: {
            required: !1,
            tsType: { name: `string` },
            description: ``,
            defaultValue: { value: `''`, computed: !1 },
          },
          id: { required: !1, tsType: { name: `string` }, description: `` },
          readOnly: {
            required: !1,
            tsType: { name: `boolean` },
            description: ``,
            defaultValue: { value: `false`, computed: !1 },
          },
          onFocus: {
            required: !1,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(e: React.FocusEvent<HTMLInputElement>) => void`,
              signature: {
                arguments: [
                  {
                    type: {
                      name: `ReactFocusEvent`,
                      raw: `React.FocusEvent<HTMLInputElement>`,
                      elements: [{ name: `HTMLInputElement` }],
                    },
                    name: `e`,
                  },
                ],
                return: { name: `void` },
              },
            },
            description: ``,
          },
          onBlur: {
            required: !1,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(e: React.FocusEvent<HTMLInputElement>) => void`,
              signature: {
                arguments: [
                  {
                    type: {
                      name: `ReactFocusEvent`,
                      raw: `React.FocusEvent<HTMLInputElement>`,
                      elements: [{ name: `HTMLInputElement` }],
                    },
                    name: `e`,
                  },
                ],
                return: { name: `void` },
              },
            },
            description: ``,
          },
          inputRef: {
            required: !1,
            tsType: {
              name: `ReactRefObject`,
              raw: `React.RefObject<HTMLInputElement | null>`,
              elements: [
                {
                  name: `union`,
                  raw: `HTMLInputElement | null`,
                  elements: [{ name: `HTMLInputElement` }, { name: `null` }],
                },
              ],
            },
            description: ``,
          },
          'data-row': { required: !1, tsType: { name: `number` }, description: `` },
          'data-field': { required: !1, tsType: { name: `string` }, description: `` },
          masked: {
            required: !1,
            tsType: { name: `boolean` },
            description: ``,
            defaultValue: { value: `false`, computed: !1 },
          },
          type: {
            required: !1,
            tsType: { name: `string` },
            description: ``,
            defaultValue: { value: `'text'`, computed: !1 },
          },
        },
      }))
  })
export { O as n, D as t }
