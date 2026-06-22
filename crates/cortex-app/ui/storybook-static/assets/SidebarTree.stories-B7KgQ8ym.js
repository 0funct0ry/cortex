import { a as e, n as t, r as n } from './chunk-DnJy8xQt.js'
import {
  A as r,
  C as i,
  T as a,
  c as o,
  f as s,
  g as c,
  gt as l,
  h as u,
  i as d,
  k as f,
  m as p,
  n as m,
  r as h,
  t as g,
  u as _,
  v,
  w as y,
  x as b,
} from './iframe-CECvvSLk.js'
import { t as x } from './react-dom-CUfkHZq5.js'
import {
  C as ee,
  D as S,
  E as C,
  O as w,
  T,
  _ as te,
  a as E,
  b as D,
  f as O,
  i as k,
  n as A,
  o as ne,
  r as re,
  y as j,
} from './Icons-DjzhDYF3.js'
import { n as M, r as ie, t as ae } from './TabsContext-DSn62RXv.js'
import { n as oe, t as N } from './Tooltip-D06fzBd3.js'
import { i as P, n as F, r as se, t as ce } from './tagColors-7aspA8vU.js'
import { n as le, t as ue } from './MethodBadge-Dl_g0J1V.js'
import { n as de, t as fe } from './Dialog-MIUUJcU6.js'
import { n as pe, t as me } from './InlineInput-D-6bKBXk.js'
import { n as he, t as ge } from './InfoPanel-BQg62_s5.js'
var I,
  _e,
  L,
  ve,
  R,
  ye,
  be = t(() => {
    ;((I = e(l(), 1)),
      (_e = e(x(), 1)),
      (L = g()),
      (ve = ({ x: e, y: t, items: n, onClose: r }) => {
        let i = (0, I.useRef)(null),
          [a, o] = (0, I.useState)({ x: e, y: t }),
          [s, c] = (0, I.useState)(null),
          l = n.reduce((e, t, n) => (!t.separator && !t.disabled && e.push(n), e), [])
        ;(0, I.useEffect)(() => {
          if (i.current) {
            let n = i.current.getBoundingClientRect(),
              r = e,
              a = t
            ;(e + n.width > window.innerWidth && (r = window.innerWidth - n.width - 8),
              t + n.height > window.innerHeight && (a = window.innerHeight - n.height - 8),
              o({ x: r, y: a }))
          }
        }, [e, t, n])
        let u = (0, I.useCallback)(
          (e) => {
            if (e.key === `Escape`) {
              r()
              return
            }
            if (e.key === `ArrowDown`) {
              ;(e.preventDefault(),
                c((e) =>
                  l.length === 0 ? null : e === null ? l[0] : l[(l.indexOf(e) + 1) % l.length]
                ))
              return
            }
            if (e.key === `ArrowUp`) {
              ;(e.preventDefault(),
                c((e) =>
                  l.length === 0
                    ? null
                    : e === null
                      ? l[l.length - 1]
                      : l[(l.indexOf(e) - 1 + l.length) % l.length]
                ))
              return
            }
            if (e.key === `Enter`) {
              if (s !== null) {
                let e = n[s]
                e && !e.disabled && !e.separator && e.onClick && (e.onClick(), r())
              }
              return
            }
          },
          [s, n, l, r]
        )
        ;(0, I.useEffect)(() => {
          let e = (e) => {
            i.current && !i.current.contains(e.target) && r()
          }
          return (
            document.addEventListener(`mousedown`, e),
            document.addEventListener(`keydown`, u),
            () => {
              ;(document.removeEventListener(`mousedown`, e),
                document.removeEventListener(`keydown`, u))
            }
          )
        }, [r, u])
        let d = (e, t) =>
          e.separator
            ? (0, L.jsx)(`div`, { className: `h-px bg-border-subtle my-1` }, `sep-${t}`)
            : (0, L.jsx)(
                R,
                { item: e, onClose: r, focused: s === t, onFocus: () => c(t) },
                e.label + t
              )
        return (0, _e.createPortal)(
          (0, L.jsx)(`div`, {
            ref: i,
            className: `fixed z-[100] w-[210px] bg-bg-overlay border border-border-subtle rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.3)] py-1 select-none animate-in fade-in zoom-in-95 duration-100`,
            style: { left: a.x, top: a.y },
            children: n.map((e, t) => d(e, t)),
          }),
          document.body
        )
      }),
      (R = ({ item: e, onClose: t, focused: n, onFocus: r }) => {
        let [i, a] = (0, I.useState)(!1),
          o = (0, I.useRef)(null)
        return (0, L.jsxs)(`div`, {
          ref: o,
          className: `relative flex items-center justify-between px-3 h-[26px] text-sm transition-colors ${e.disabled ? `text-text-muted cursor-not-allowed opacity-40` : e.danger ? `text-error hover:bg-error/10 cursor-pointer` : `text-text-primary hover:bg-bg-highlight cursor-pointer`} ${n && !e.disabled ? `bg-bg-highlight` : ``}`,
          onClick: (n) => {
            if (!e.disabled) {
              if (e.submenu) {
                n.stopPropagation()
                return
              }
              ;(e.onClick?.(), t())
            }
          },
          onMouseEnter: () => {
            ;(e.disabled || r(), e.submenu && a(!0))
          },
          onMouseLeave: () => a(!1),
          children: [
            (0, L.jsx)(`span`, { className: `truncate flex-1`, children: e.label }),
            e.shortcut &&
              (0, L.jsx)(`span`, {
                className: `text-xs text-text-muted ml-4`,
                children: e.shortcut,
              }),
            e.submenu &&
              (0, L.jsx)(`span`, { className: `text-xs text-text-muted ml-2`, children: `›` }),
            e.submenu && i && (0, L.jsx)(ye, { items: e.submenu, parentRef: o, onClose: t }),
          ],
        })
      }),
      (ye = ({ items: e, parentRef: t, onClose: n }) => {
        let [r, i] = (0, I.useState)({ x: 0, y: 0 }),
          a = (0, I.useRef)(null)
        return (
          (0, I.useEffect)(() => {
            if (t.current && a.current) {
              let e = t.current.getBoundingClientRect(),
                n = a.current.getBoundingClientRect(),
                r = e.right - 4,
                o = e.top - 4
              ;(r + n.width > window.innerWidth && (r = e.left - n.width + 4),
                o + n.height > window.innerHeight && (o = window.innerHeight - n.height - 8),
                i({ x: r, y: o }))
            }
          }, [t]),
          (0, L.jsx)(`div`, {
            ref: a,
            className: `fixed z-[101] w-[180px] bg-bg-overlay border border-border-subtle rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.3)] py-1`,
            style: { left: r.x, top: r.y },
            children: e.map((e, t) =>
              (0, L.jsx)(
                `div`,
                {
                  className: `flex items-center justify-between px-3 h-[26px] text-sm cursor-pointer text-text-primary hover:bg-bg-highlight transition-colors`,
                  onClick: (t) => {
                    ;(t.stopPropagation(), e.onClick?.(), n())
                  },
                  children: (0, L.jsx)(`span`, { className: `truncate`, children: e.label }),
                },
                e.label + t
              )
            ),
          })
        )
      }))
  })
function xe(e, t, n) {
  let r = (e - t.top) / t.height
  return n === `request`
    ? r < 0.5
      ? `before`
      : `after`
    : r < 0.25
      ? `before`
      : r > 0.75
        ? `after`
        : `inside`
}
function Se(e, t) {
  let n = document.elementFromPoint(e, t)
  for (; n; ) {
    if (n.dataset.path && n.dataset.nodetype)
      return { path: n.dataset.path, nodeType: n.dataset.nodetype, element: n }
    n = n.parentElement
  }
  return null
}
var Ce = t(() => {}),
  z,
  B,
  V,
  we,
  Te = t(() => {
    ;((z = e(l(), 1)),
      (B = e(x(), 1)),
      r(),
      c(),
      s(),
      P(),
      (V = g()),
      (we = ({
        open: e,
        onClose: t,
        collectionPath: n,
        requestId: r,
        requestPath: i,
        initialTags: a,
      }) => {
        let { getRequestState: o, updateRequest: s } = p(),
          { collections: c, updateTagRegistry: l, loadCollection: d } = v(),
          m = u(n ? { [n]: c[n] } : {}),
          h = r ? (o(r).tags ?? []) : null,
          [g, _] = (0, z.useState)(a ?? []),
          y = h ?? g,
          b = async (e) => {
            if (r) s(r, { tags: e })
            else if (i) {
              _(e)
              try {
                let t = await f.loadRequest(i)
                if (t.status === `ok` && t.data.content) {
                  let r = { ...t.data.content, tags: e.length > 0 ? e : void 0 }
                  ;(await f.saveRequest(r, i), n && d(n))
                }
              } catch (e) {
                console.error(`Failed to save tags`, e)
              }
            }
          },
          [x, ee] = (0, z.useState)(``),
          [S, C] = (0, z.useState)(!1),
          [w, T] = (0, z.useState)(F(m.map((e) => e.color)).name),
          te = (0, z.useRef)(null),
          [E, D] = (0, z.useState)(!1)
        if (
          (e && !E
            ? (D(!0), ee(``), C(!1), T(F(m.map((e) => e.color)).name), a && _(a))
            : !e && E && D(!1),
          (0, z.useEffect)(() => {
            e && setTimeout(() => te.current?.focus(), 10)
          }, [e]),
          (0, z.useEffect)(() => {
            if (!e) return
            let n = (e) => e.key === `Escape` && t()
            return (
              document.addEventListener(`keydown`, n),
              () => document.removeEventListener(`keydown`, n)
            )
          }, [e, t]),
          !e)
        )
          return null
        let O = m.filter(
            (e) => !y.includes(e.name) && e.name.toLowerCase().includes(x.toLowerCase())
          ),
          k = m.some((e) => e.name.toLowerCase() === x.toLowerCase()),
          A = x.trim() !== `` && !k,
          ne = (e) => {
            b(y.filter((t) => t !== e))
          },
          re = (e) => {
            ;(y.includes(e) || b([...y, e]), ee(``), C(!1))
          },
          j = async () => {
            let e = x.trim()
            if (!e) return
            let t = { name: e, color: w },
              r = c[n]?.manifest.tag_registry ?? []
            ;(r.find((t) => t.name === e) || (await l(n, [...r, t])), re(e))
          }
        return (0, B.createPortal)(
          (0, V.jsxs)(`div`, {
            className: `fixed inset-0 z-[200] flex items-center justify-center p-4`,
            children: [
              (0, V.jsx)(`div`, { className: `absolute inset-0 bg-black/40`, onClick: t }),
              (0, V.jsxs)(`div`, {
                className: `relative z-10 w-80 rounded-lg border border-border-default bg-bg-base shadow-xl`,
                onClick: (e) => e.stopPropagation(),
                children: [
                  (0, V.jsxs)(`div`, {
                    className: `flex items-center justify-between border-b border-border-default px-4 py-3`,
                    children: [
                      (0, V.jsx)(`h2`, {
                        className: `text-sm font-semibold text-text-primary`,
                        children: `Manage Tags`,
                      }),
                      (0, V.jsx)(`button`, {
                        onClick: t,
                        className: `text-text-muted hover:text-text-primary`,
                        'aria-label': `Close`,
                        children: `✕`,
                      }),
                    ],
                  }),
                  (0, V.jsxs)(`div`, {
                    className: `p-4`,
                    children: [
                      y.length > 0 &&
                        (0, V.jsxs)(`div`, {
                          className: `mb-3`,
                          children: [
                            (0, V.jsx)(`p`, {
                              className: `mb-1.5 text-xs font-medium text-text-secondary`,
                              children: `Applied tags`,
                            }),
                            (0, V.jsx)(`div`, {
                              className: `flex flex-wrap gap-1.5`,
                              children: y.map((e) =>
                                (0, V.jsxs)(
                                  `span`,
                                  {
                                    className: `flex items-center gap-1 rounded-full border border-border-default px-2 py-0.5 text-xs text-text-primary`,
                                    children: [
                                      (0, V.jsx)(`span`, {
                                        className: `h-2.5 w-2.5 shrink-0 rounded-full`,
                                        style: {
                                          background: se(
                                            m.find((t) => t.name === e)?.color ?? `gray`
                                          ).bg,
                                        },
                                      }),
                                      e,
                                      (0, V.jsx)(`button`, {
                                        onClick: () => ne(e),
                                        className: `ml-0.5 text-text-muted hover:text-text-primary`,
                                        children: `×`,
                                      }),
                                    ],
                                  },
                                  e
                                )
                              ),
                            }),
                          ],
                        }),
                      (0, V.jsx)(`input`, {
                        ref: te,
                        value: x,
                        onChange: (e) => {
                          ;(ee(e.target.value), C(!1))
                        },
                        onKeyDown: (e) => {
                          e.key === `Enter` && (S ? j() : O.length > 0 ? re(O[0].name) : A && C(!0))
                        },
                        placeholder: `Search or create tag…`,
                        autoCapitalize: `none`,
                        autoCorrect: `off`,
                        spellCheck: !1,
                        className: `w-full rounded border border-border-default bg-bg-surface px-2 py-1.5 text-xs text-text-primary outline-none placeholder:text-text-muted focus:border-accent`,
                      }),
                      O.length > 0 &&
                        (0, V.jsx)(`div`, {
                          className: `mt-1 max-h-40 overflow-y-auto rounded border border-border-default bg-bg-surface`,
                          children: O.map((e) =>
                            (0, V.jsxs)(
                              `button`,
                              {
                                onClick: () => re(e.name),
                                className: `flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-primary hover:bg-bg-hover`,
                                children: [
                                  (0, V.jsx)(`span`, {
                                    className: `h-2.5 w-2.5 shrink-0 rounded-full`,
                                    style: { background: se(e.color).bg },
                                  }),
                                  e.name,
                                ],
                              },
                              e.name
                            )
                          ),
                        }),
                      A &&
                        !S &&
                        (0, V.jsxs)(`button`, {
                          onClick: () => C(!0),
                          className: `mt-1 flex w-full items-center gap-2 rounded border border-border-default px-3 py-1.5 text-xs hover:bg-bg-hover`,
                          children: [
                            (0, V.jsx)(`span`, {
                              className: `text-text-muted`,
                              children: `Create`,
                            }),
                            (0, V.jsxs)(`span`, {
                              className: `font-medium text-text-primary`,
                              children: [`"`, x.trim(), `"`],
                            }),
                          ],
                        }),
                      S &&
                        (0, V.jsxs)(`div`, {
                          className: `mt-2 rounded border border-border-default p-3`,
                          children: [
                            (0, V.jsx)(`p`, {
                              className: `mb-1.5 text-xs font-medium text-text-secondary`,
                              children: `Pick a color`,
                            }),
                            (0, V.jsx)(`div`, {
                              className: `mb-2 flex flex-wrap gap-1.5`,
                              children: ce.map((e) =>
                                (0, V.jsx)(
                                  `button`,
                                  {
                                    onClick: () => T(e.name),
                                    title: e.name,
                                    className: `relative h-5 w-5 rounded-full border-2 transition-transform hover:scale-110`,
                                    style: {
                                      background: e.bg,
                                      borderColor: w === e.name ? `#fff` : `transparent`,
                                      boxShadow: w === e.name ? `0 0 0 2px ${e.bg}` : void 0,
                                    },
                                    children:
                                      w === e.name &&
                                      (0, V.jsx)(`span`, {
                                        className: `absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white`,
                                        children: `✓`,
                                      }),
                                  },
                                  e.name
                                )
                              ),
                            }),
                            (0, V.jsx)(`button`, {
                              onClick: j,
                              className: `w-full rounded bg-accent hover:bg-accent-hover text-accent-fg px-2 py-1 text-xs font-medium`,
                              children: `Create & add`,
                            }),
                          ],
                        }),
                    ],
                  }),
                  (0, V.jsx)(`div`, {
                    className: `flex justify-end border-t border-border-default px-4 py-3`,
                    children: (0, V.jsx)(`button`, {
                      onClick: t,
                      className: `rounded bg-bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-bg-hover`,
                      children: `Done`,
                    }),
                  }),
                ],
              }),
            ],
          }),
          document.body
        )
      }))
  }),
  H,
  U,
  Ee,
  W,
  De = t(() => {
    ;((H = e(l(), 1)),
      w(),
      le(),
      be(),
      de(),
      pe(),
      he(),
      r(),
      c(),
      b(),
      M(),
      y(),
      o(),
      P(),
      Te(),
      h(),
      (U = g()),
      (Ee = navigator.platform.toUpperCase().includes(`MAC`)),
      (W = ({
        label: e,
        depth: t,
        type: n,
        path: r,
        method: o,
        isExpanded: s,
        isLoading: c,
        error: l,
        isActive: p,
        onToggle: h,
        onClick: g,
        onDoubleClick: y,
        onOpenSettings: b,
        dimmed: x,
        requestTags: S,
        collectionPath: w,
        isGitRepo: T,
        siblings: D,
        parentPath: k,
        dropIndicator: A,
        isDragSource: ne,
        onNodeMouseDown: j,
      }) => {
        let [M, ae] = (0, H.useState)(!1),
          [oe, N] = (0, H.useState)(null),
          [P, F] = (0, H.useState)(!1),
          [ce, le] = (0, H.useState)(!1),
          [de, pe] = (0, H.useState)(!1),
          [he, I] = (0, H.useState)(!1),
          [_e, L] = (0, H.useState)(!1),
          [R, ye] = (0, H.useState)(null),
          [be, xe] = (0, H.useState)(null),
          {
            searchQuery: Se,
            collections: Ce,
            clearCollection: z,
            loadCollection: B,
            selectedPath: V,
            setSelectedPath: Te,
            renamingPath: W,
            setRenamingPath: De,
            setClipboard: G,
          } = v(),
          { activeWorkspacePath: K, loadWorkspace: q } = i(),
          { tabs: Oe, updateTab: J, closeTabsWhere: ke, openTab: Y } = ie(),
          {
            openNewRequestDialog: Ae,
            openNewTransientDialog: je,
            openImportFolderDialog: Me,
            openShareModal: Ne,
            openGenerateDocsModal: Pe,
            openGenerateCodeModal: Fe,
            openCreateExampleModal: Ie,
          } = _()
        H.useEffect(() => {
          W === r &&
            setTimeout(() => {
              ;(F(!0), De(null))
            }, 0)
        }, [W, r, De])
        let X = (0, H.useMemo)(() => {
            if (n === `collection`) return r
            for (let e of Object.keys(Ce)) if (r.startsWith(e)) return e
            return ``
          }, [n, r, Ce]),
          { open: Le, scope: Re, runStatus: ze } = d(),
          Z = Re?.path === r,
          Q = Z && ze === `running`,
          $ = Z && (ze === `completed` || ze === `aborted`),
          Be = (0, H.useCallback)(() => {
            let t = m(r, n)
            Le({ path: r, type: n, label: e, collectionPath: X || r }, t)
          }, [r, n, e, X, Le]),
          Ve = t * 12 + 12,
          He = (e) => {
            ;(e.preventDefault(), N({ x: e.clientX, y: e.clientY }))
          },
          Ue = async (t) => {
            if (n === `example`) {
              await qe(t)
              return
            }
            if ((F(!1), t !== e))
              try {
                let e = await f.renameItem(r, t)
                if (e.status === `ok`)
                  if (n === `collection`) (z(r), K && (await q(K), await B(e.data)))
                  else {
                    X && (await B(X))
                    let n = Oe.find((e) => e.requestPath === r)
                    n && J(n.id, { name: t, requestPath: e.data })
                  }
                else a.error(`Rename failed: ${e.error}`)
              } catch (e) {
                a.error(`Rename failed: ${String(e)}`)
              }
          },
          We = async () => {
            if (n === `example`) {
              await Je()
              return
            }
            try {
              ;(await f.deleteItem(r)).status === `ok` &&
                (X && (await B(X)),
                ke((e) => e.requestPath !== null && e.requestPath.startsWith(r)))
            } catch (e) {
              a.error(`Delete failed: ${String(e)}`)
            }
          },
          Ge = n === `example` ? r.split(`#`)[0] : null,
          Ke = n === `example` ? r.split(`#`).slice(1).join(`#`) : null,
          qe = async (t) => {
            if ((F(!1), !(!Ge || !Ke || t === e)))
              try {
                let e = await f.loadRequest(Ge)
                if (e.status !== `ok`) return
                let n = e.data.content
                if (!n) return
                let r = n.examples?.find((e) => e.id === Ke)
                if (!r) return
                let i = await f.updateExample(Ge, { ...r, name: t })
                if (i.status === `ok`) {
                  X && (await B(X))
                  let e = Oe.find(
                    (e) => e.type === `example` && e.requestPath === Ge && e.exampleId === Ke
                  )
                  e && J(e.id, { name: t })
                } else a.error(`Rename failed: ${i.error}`)
              } catch (e) {
                a.error(`Rename failed: ${String(e)}`)
              }
          },
          Je = async () => {
            if (!(!Ge || !Ke))
              try {
                let e = await f.deleteExample(Ge, Ke)
                e.status === `ok`
                  ? (X && (await B(X)),
                    ke((e) => e.type === `example` && e.requestPath === Ge && e.exampleId === Ke))
                  : a.error(`Delete failed: ${e.error}`)
              } catch (e) {
                a.error(`Delete failed: ${String(e)}`)
              }
          },
          Ye = (0, H.useCallback)(async () => {
            try {
              ;(await f.duplicateRequest(r)).status === `ok` && X && (await B(X))
            } catch (e) {
              a.error(`Duplicate failed: ${String(e)}`)
            }
          }, [r, X, B]),
          Xe = (0, H.useCallback)(async () => {
            try {
              let e = await f.cloneFolder(r)
              e.status === `ok`
                ? (X && (await B(X)), a.success(`Folder cloned successfully`))
                : a.error(`Clone failed: ${e.error}`)
            } catch (e) {
              a.error(`Clone failed: ${String(e)}`)
            }
          }, [r, X, B]),
          Ze = (0, H.useCallback)(() => {
            n === `collection` ? Ae(r, null) : Ae(X || r, r)
          }, [n, r, X, Ae]),
          Qe = (0, H.useCallback)(async () => {
            try {
              let e = await f.createFolder(`New Folder`, r)
              e.status === `ok` && (await B(X || r), v.getState().setRenamingPath(e.data))
            } catch (e) {
              a.error(`Create folder failed: ${String(e)}`)
            }
          }, [r, X, B]),
          $e = (0, H.useCallback)(async () => {
            try {
              let t = await f.createJsFile(r, `script.js`)
              if (t.status === `ok`) {
                let n = t.data.split(`/`).pop() ?? `script.js`
                ;(Y({
                  type: `collection`,
                  collectionPath: r,
                  collectionId: r,
                  folderPath: null,
                  name: e,
                  requestPath: null,
                  method: ``,
                }),
                  a.success(`Created ${n} — open the Script tab to use it`))
              } else a.error(`Failed to create JS file: ${t.error}`)
            } catch (e) {
              a.error(`Failed to create JS file: ${String(e)}`)
            }
          }, [r, e, Y]),
          et = (0, H.useCallback)(async () => {
            if (K)
              try {
                let e = await f.cloneCollection(K, r)
                e.status === `ok`
                  ? (await q(K), a.success(`Collection cloned successfully`))
                  : a.error(`Clone failed: ${e.error}`)
              } catch (e) {
                a.error(`Clone failed: ${String(e)}`)
              }
          }, [r, K, q]),
          tt = (0, H.useCallback)(async () => {
            try {
              let e = await f.openInTerminal(r)
              e.status !== `ok` && a.error(`Failed to open terminal: ${e.error}`)
            } catch (e) {
              a.error(`Failed to open terminal: ${String(e)}`)
            }
          }, [r]),
          nt = (0, H.useCallback)(() => {
            Me(r, n, w ?? r)
          }, [r, n, w, Me]),
          rt = (0, H.useCallback)(() => {
            Y({
              type: `collection`,
              collectionPath: r,
              collectionId: r,
              folderPath: null,
              name: e,
              requestPath: null,
              method: ``,
            })
          }, [r, e, Y]),
          it = (0, H.useCallback)(async () => {
            if (K)
              try {
                let t = await f.removeCollectionFromWorkspace(K, r)
                t.status === `ok`
                  ? (await q(K),
                    ke(
                      (e) =>
                        (e.type === `request` && e.collectionId === r) ||
                        (e.type === `collection` && e.collectionPath === r)
                    ),
                    a.success(`"${e}" removed from workspace`))
                  : a.error(`Remove failed: ${t.error}`)
              } catch (e) {
                a.error(`Remove failed: ${String(e)}`)
              }
          }, [r, e, K, q, ke]),
          at = (0, H.useMemo)(() => (D ? D.findIndex((e) => e.path === r) : -1), [D, r]),
          ot = at > 0,
          st = D !== void 0 && at >= 0 && at < D.length - 1,
          ct = (0, H.useCallback)(async () => {
            if (!ot || !D) return
            let e = D[at - 1]
            try {
              let t = await f.reorderItem(r, e.path, `before`)
              t.status === `ok` ? X && (await B(X)) : a.error(`Move Up failed: ${t.error}`)
            } catch (e) {
              a.error(`Move Up failed: ${String(e)}`)
            }
          }, [ot, D, at, r, X, B]),
          lt = (0, H.useCallback)(async () => {
            if (!st || !D) return
            let e = D[at + 1]
            try {
              let t = await f.reorderItem(r, e.path, `after`)
              t.status === `ok` ? X && (await B(X)) : a.error(`Move Down failed: ${t.error}`)
            } catch (e) {
              a.error(`Move Down failed: ${String(e)}`)
            }
          }, [st, D, at, r, X, B]),
          ut = (0, H.useCallback)(() => {
            ;(n === `folder` || n === `request`) &&
              (G(r, n), a.success(`"${e}" copied to clipboard`))
          }, [r, e, n, G]),
          dt = (0, H.useCallback)(async () => {
            if (n === `folder`) {
              let e = await f.getItemInfo(r)
              e.status === `ok`
                ? (ye(e.data.item_count ?? 0), xe(e.data.folder_count ?? 0))
                : (ye(null), xe(null))
            }
            le(!0)
          }, [n, r]),
          ft = (0, H.useMemo)(() => {
            if (n === `folder`) {
              let t = []
              return (
                R && t.push(`${R} request${R === 1 ? `` : `s`}`),
                be && t.push(`${be} folder${be === 1 ? `` : `s`}`),
                `This will permanently delete the folder "${e}".${R !== null && be !== null ? (t.length > 0 ? ` It contains ${t.join(` and `)}.` : ` It is empty.`) : ``} This action cannot be undone.`
              )
            }
            return n === `example`
              ? `This will permanently delete the example "${e}". This action cannot be undone.`
              : `This will permanently delete the request "${e}". This action cannot be undone.`
          }, [n, e, R, be]),
          pt = (0, H.useMemo)(() => {
            let t = [
              { label: `New Request`, shortcut: `Cmd+⇧N`, onClick: Ze },
              { label: `New Transient Request`, shortcut: `Cmd+B`, onClick: je },
              {
                label: `New Quick Request`,
                shortcut: `Cmd+N`,
                onClick: () =>
                  Y({
                    type: `request`,
                    requestPath: null,
                    collectionId: null,
                    collectionPath: null,
                    folderPath: null,
                    name: `Untitled`,
                    method: `GET`,
                  }),
              },
              { label: `New Folder`, onClick: Qe },
              { label: `New JS File`, onClick: $e },
            ]
            return n === `collection`
              ? [
                  ...t,
                  { label: ``, separator: !0 },
                  { label: `Run`, onClick: Be },
                  { label: ``, separator: !0 },
                  { label: `Clone`, onClick: et },
                  { label: `Import from folder…`, onClick: nt },
                  { label: `Rename`, onClick: () => F(!0) },
                  { label: `Share`, onClick: () => Ne(r, e) },
                  { label: `Generate Docs`, onClick: () => Pe(r, e) },
                  {
                    label: `Collapse`,
                    disabled: !s,
                    onClick: () => {
                      s && h?.()
                    },
                  },
                  {
                    label: Ee ? `Reveal in Finder` : `Reveal in Explorer`,
                    onClick: () => f.openInExplorer(r),
                  },
                  { label: `Settings`, onClick: rt },
                  { label: `Open in Terminal`, onClick: tt },
                  { label: ``, separator: !0 },
                  { label: `Remove`, danger: !0, onClick: () => pe(!0) },
                ]
              : n === `folder`
                ? [
                    ...t,
                    { label: ``, separator: !0 },
                    { label: `Run`, onClick: Be },
                    { label: ``, separator: !0 },
                    { label: `Move Up`, shortcut: `⌥↑`, disabled: !ot, onClick: ct },
                    { label: `Move Down`, shortcut: `⌥↓`, disabled: !st, onClick: lt },
                    { label: ``, separator: !0 },
                    { label: `Clone`, onClick: Xe },
                    { label: `Import from folder…`, onClick: nt },
                    { label: `Copy`, onClick: ut },
                    { label: `Rename`, onClick: () => F(!0) },
                    {
                      label: Ee ? `Reveal in Finder` : `Reveal in Explorer`,
                      onClick: () => f.openInExplorer(r),
                    },
                    { label: `Info`, onClick: () => I(!0) },
                    {
                      label: `Settings`,
                      onClick: () =>
                        Y({
                          type: `folder`,
                          folderPath: r,
                          collectionPath: w ?? null,
                          collectionId: w ?? null,
                          requestPath: null,
                          name: e,
                          method: ``,
                        }),
                    },
                    { label: `Open in Terminal`, onClick: tt },
                    { label: ``, separator: !0 },
                    { label: `Delete`, danger: !0, onClick: dt },
                  ]
                : n === `example`
                  ? [
                      { label: `Rename`, onClick: () => F(!0) },
                      { label: ``, separator: !0 },
                      { label: `Delete`, danger: !0, onClick: dt },
                    ]
                  : [
                      { label: `Move Up`, shortcut: `⌥↑`, disabled: !ot, onClick: ct },
                      { label: `Move Down`, shortcut: `⌥↓`, disabled: !st, onClick: lt },
                      { label: ``, separator: !0 },
                      { label: `Clone`, onClick: Ye },
                      { label: `Copy`, onClick: ut },
                      { label: `Rename`, onClick: () => F(!0) },
                      { label: `Manage Tags`, onClick: () => L(!0) },
                      { label: `Generate Code`, onClick: () => Fe(r, e, w ?? null) },
                      { label: `Create Example`, onClick: () => Ie(r) },
                      {
                        label: Ee ? `Reveal in Finder` : `Reveal in Explorer`,
                        onClick: () => f.openInExplorer(r),
                      },
                      { label: `Info`, onClick: () => I(!0) },
                      { label: ``, separator: !0 },
                      { label: `Delete`, danger: !0, onClick: dt },
                    ]
          }, [
            n,
            r,
            s,
            Ze,
            Qe,
            $e,
            et,
            Xe,
            rt,
            tt,
            Be,
            Ye,
            ut,
            dt,
            ct,
            lt,
            ot,
            st,
            je,
            nt,
            h,
            Y,
            e,
            w,
            Ne,
            Pe,
            Fe,
            Ie,
          ]),
          mt = (e, t) =>
            t
              ? (0, U.jsx)(U.Fragment, {
                  children: e
                    .split(RegExp(`(${t})`, `gi`))
                    .map((e, n) =>
                      e.toLowerCase() === t.toLowerCase()
                        ? (0, U.jsx)(
                            `span`,
                            { className: `bg-bg-highlight text-text-primary`, children: e },
                            n
                          )
                        : e
                    ),
                })
              : e,
          ht = () => {
            if (c)
              return (0, U.jsx)(`div`, {
                className: `w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin`,
              })
            switch (n) {
              case `collection`:
                return (0, U.jsx)(C, { size: 14, className: `text-text-muted` })
              case `folder`:
                return (0, U.jsx)(O, { size: 12, className: `text-text-muted` })
              case `request`:
                return o ? (0, U.jsx)(ue, { method: o }) : null
              case `example`:
                return (0, U.jsx)(`span`, {
                  className: `inline-flex items-center justify-center w-[24px] h-[16px] rounded text-[9px] font-semibold bg-bg-muted text-text-muted border border-border-subtle leading-none`,
                  children: `E`,
                })
              default:
                return null
            }
          },
          gt = A?.targetPath === r ? A.position : null
        return (0, U.jsxs)(`div`, {
          className: `flex flex-col`,
          onContextMenu: He,
          children: [
            (0, U.jsxs)(`div`, {
              'data-path': r,
              'data-nodetype': n,
              tabIndex: 0,
              className: `flex items-center gap-1.5 h-[28px] cursor-pointer group transition-colors outline-none select-none focus:bg-bg-highlight ${p || V === r ? `bg-bg-highlight` : M ? `bg-bg-muted` : ``} ${ne || x ? `opacity-40` : ``} ${gt === `inside` ? `ring-1 ring-inset ring-accent bg-accent/10` : ``} ${gt === `before` ? `border-t-2 border-accent` : ``} ${gt === `after` ? `border-b-2 border-accent` : ``}`,
              style: { paddingLeft: `${Ve}px`, paddingRight: `12px` },
              onMouseEnter: () => ae(!0),
              onMouseLeave: () => ae(!1),
              onMouseDown: (e) => {
                j && n !== `collection` && j(e, r, n, k ?? ``)
              },
              onClick: () => {
                ;(Te(r), n === `request` || n === `example` ? g?.() : h?.())
              },
              onDoubleClick: y,
              onKeyDown: (e) => {
                e.key === `F2` && (e.preventDefault(), F(!0))
              },
              children: [
                (n === `collection` || n === `folder` || (n === `request` && h !== void 0)) &&
                  (0, U.jsx)(`div`, {
                    className: `w-3 h-3 flex items-center justify-center transition-transform duration-150 ${s ? `rotate-0` : `-rotate-90`}`,
                    onClick: (e) => {
                      ;(e.stopPropagation(), h?.())
                    },
                    children: (0, U.jsx)(E, {
                      size: 12,
                      className: `text-text-muted hover:text-text-primary`,
                    }),
                  }),
                (0, U.jsxs)(`div`, {
                  className: `flex items-center gap-1.5 min-w-0 flex-1`,
                  children: [
                    ht(),
                    P
                      ? (0, U.jsx)(me, { initialValue: e, onConfirm: Ue, onCancel: () => F(!1) })
                      : (0, U.jsx)(`span`, {
                          className: `text-sm truncate ${p ? `text-text-primary font-medium` : `text-text-secondary group-hover:text-text-primary`}`,
                          children: mt(e, Se),
                        }),
                    n === `collection` &&
                      T &&
                      !P &&
                      (0, U.jsx)(`span`, {
                        title: `Git repository initialized`,
                        className: `ml-auto shrink-0 flex items-center gap-0.5 text-text-muted opacity-50`,
                        children: (0, U.jsx)(re, { size: 10 }),
                      }),
                    n === `request` &&
                      S &&
                      S.length > 0 &&
                      !P &&
                      (() => {
                        let e = u(w ? { [w]: v.getState().collections[w] } : {}),
                          t = S.slice(0, 3),
                          n = S.length - 3
                        return (0, U.jsxs)(`span`, {
                          className: `ml-auto flex shrink-0 items-center gap-0.5 pl-1`,
                          children: [
                            t.map((t) =>
                              (0, U.jsx)(
                                `span`,
                                {
                                  className: `h-2 w-2 rounded-full`,
                                  style: {
                                    background: se(e.find((e) => e.name === t)?.color ?? `gray`).bg,
                                  },
                                  title: t,
                                },
                                t
                              )
                            ),
                            n > 0 &&
                              (0, U.jsxs)(`span`, {
                                className: `text-[9px] text-text-muted`,
                                children: [`+`, n],
                              }),
                          ],
                        })
                      })(),
                  ],
                }),
                (n === `collection` || n === `folder`) &&
                  Q &&
                  (0, U.jsx)(`span`, {
                    className: `w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin shrink-0`,
                  }),
                (n === `collection` || n === `folder`) &&
                  $ &&
                  !Q &&
                  (0, U.jsx)(`span`, {
                    className: `w-2 h-2 rounded-full shrink-0 ${ze === `completed` ? `bg-success` : `bg-warning`}`,
                  }),
                M &&
                  !P &&
                  n === `collection` &&
                  (0, U.jsx)(`button`, {
                    className: `p-1 hover:bg-bg-highlight rounded text-text-muted hover:text-text-primary transition-opacity opacity-0 group-hover:opacity-100`,
                    onClick: (e) => {
                      ;(e.stopPropagation(), b?.())
                    },
                    title: `Collection Settings`,
                    children: (0, U.jsx)(ee, { size: 14 }),
                  }),
                M &&
                  !P &&
                  (0, U.jsx)(`button`, {
                    className: `p-1 hover:bg-bg-highlight rounded text-text-muted hover:text-text-primary transition-opacity opacity-0 group-hover:opacity-100`,
                    onClick: (e) => {
                      ;(e.stopPropagation(), N({ x: e.clientX, y: e.clientY }))
                    },
                    children: (0, U.jsx)(te, { size: 14 }),
                  }),
              ],
            }),
            l &&
              (0, U.jsx)(`div`, {
                className: `text-[10px] text-error px-3 py-1 bg-error/10`,
                style: { paddingLeft: `${Ve + 16}px` },
                children: l,
              }),
            oe && (0, U.jsx)(ve, { x: oe.x, y: oe.y, items: pt, onClose: () => N(null) }),
            (0, U.jsx)(fe, {
              isOpen: ce,
              onClose: () => le(!1),
              onConfirm: We,
              title: `Delete ${n === `request` ? `Request` : n === `example` ? `Example` : `Folder`}?`,
              description: ft,
              confirmLabel: `Delete`,
              variant: `danger`,
            }),
            (0, U.jsx)(fe, {
              isOpen: de,
              onClose: () => pe(!1),
              onConfirm: it,
              title: `Remove "${e}" from workspace?`,
              description: `The files on disk will not be deleted. You can re-add this collection later.`,
              confirmLabel: `Remove`,
              variant: `danger`,
            }),
            (0, U.jsx)(ge, { isOpen: he, onClose: () => I(!1), path: r, type: n }),
            n === `request` &&
              (0, U.jsx)(we, {
                open: _e,
                onClose: () => L(!1),
                collectionPath: w ?? ``,
                requestPath: r,
                initialTags: S ?? [],
              }),
          ],
        })
      }),
      (W.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `TreeNode`,
        props: {
          label: { required: !0, tsType: { name: `string` }, description: `` },
          depth: { required: !0, tsType: { name: `number` }, description: `` },
          type: {
            required: !0,
            tsType: {
              name: `union`,
              raw: `'collection' | 'folder' | 'request' | 'example'`,
              elements: [
                { name: `literal`, value: `'collection'` },
                { name: `literal`, value: `'folder'` },
                { name: `literal`, value: `'request'` },
                { name: `literal`, value: `'example'` },
              ],
            },
            description: ``,
          },
          path: { required: !0, tsType: { name: `string` }, description: `` },
          method: { required: !1, tsType: { name: `string` }, description: `` },
          isExpanded: { required: !1, tsType: { name: `boolean` }, description: `` },
          isLoading: { required: !1, tsType: { name: `boolean` }, description: `` },
          error: {
            required: !1,
            tsType: {
              name: `union`,
              raw: `string | null`,
              elements: [{ name: `string` }, { name: `null` }],
            },
            description: ``,
          },
          isActive: { required: !1, tsType: { name: `boolean` }, description: `` },
          onToggle: {
            required: !1,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `() => void`,
              signature: { arguments: [], return: { name: `void` } },
            },
            description: ``,
          },
          onClick: {
            required: !1,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `() => void`,
              signature: { arguments: [], return: { name: `void` } },
            },
            description: ``,
          },
          onDoubleClick: {
            required: !1,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `() => void`,
              signature: { arguments: [], return: { name: `void` } },
            },
            description: ``,
          },
          onOpenSettings: {
            required: !1,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `() => void`,
              signature: { arguments: [], return: { name: `void` } },
            },
            description: ``,
          },
          dimmed: { required: !1, tsType: { name: `boolean` }, description: `` },
          requestTags: {
            required: !1,
            tsType: { name: `Array`, elements: [{ name: `string` }], raw: `string[]` },
            description: ``,
          },
          collectionPath: { required: !1, tsType: { name: `string` }, description: `` },
          isGitRepo: {
            required: !1,
            tsType: { name: `boolean` },
            description: `Whether this collection has a Git repository initialised in its root directory`,
          },
          siblings: {
            required: !1,
            tsType: { name: `Array`, elements: [{ name: `SiblingItem` }], raw: `SiblingItem[]` },
            description: `Sibling items at the same level, used for Move Up / Move Down`,
          },
          parentPath: { required: !1, tsType: { name: `string` }, description: `` },
          dropIndicator: {
            required: !1,
            tsType: {
              name: `union`,
              raw: `DropIndicator | null`,
              elements: [{ name: `DropIndicator` }, { name: `null` }],
            },
            description: ``,
          },
          isDragSource: { required: !1, tsType: { name: `boolean` }, description: `` },
          onNodeMouseDown: {
            required: !1,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(
  e: React.MouseEvent,
  path: string,
  type: 'folder' | 'request',
  parentPath: string
) => void`,
              signature: {
                arguments: [
                  { type: { name: `ReactMouseEvent`, raw: `React.MouseEvent` }, name: `e` },
                  { type: { name: `string` }, name: `path` },
                  {
                    type: {
                      name: `union`,
                      raw: `'folder' | 'request'`,
                      elements: [
                        { name: `literal`, value: `'folder'` },
                        { name: `literal`, value: `'request'` },
                      ],
                    },
                    name: `type`,
                  },
                  { type: { name: `string` }, name: `parentPath` },
                ],
                return: { name: `void` },
              },
            },
            description: ``,
          },
        },
      }))
  }),
  G,
  K,
  q,
  Oe,
  J,
  ke,
  Y,
  Ae,
  je,
  Me,
  Ne,
  Pe,
  Fe = t(() => {
    ;((G = e(l(), 1)),
      (K = e(x(), 1)),
      b(),
      c(),
      M(),
      y(),
      De(),
      Ce(),
      w(),
      oe(),
      s(),
      r(),
      (q = g()),
      (Oe = () => {
        let { activeWorkspace: e, activeWorkspacePath: t, loadWorkspace: n } = i(),
          { setCreatingInline: r, setExpanded: o, loadCollection: s } = v(),
          [c, l] = (0, G.useState)(
            (0, G.useMemo)(() => {
              if (!e) return `Untitled Collection - 1`
              let t = 1,
                n = `Untitled Collection - ${t}`,
                r = new Set(
                  e.collections.map((e) => e.name?.toLowerCase().trim()).filter((e) => !!e)
                )
              for (; r.has(n.toLowerCase()); ) (t++, (n = `Untitled Collection - ${t}`))
              return n
            }, [e])
          ),
          u = (0, G.useRef)(null),
          [d, p] = (0, G.useState)(!1)
        ;(0, G.useEffect)(() => {
          u.current && (u.current.focus(), u.current.select())
        }, [])
        let m = c.trim(),
          h = !1,
          g = ``
        m === ``
          ? ((h = !0), (g = `Collection name cannot be empty`))
          : e &&
            e.collections.some((e) => e.name?.toLowerCase().trim() === m.toLowerCase()) &&
            ((h = !0), (g = `A collection with this name already exists`))
        let _ = (e) => {
            let t = Math.max(e.lastIndexOf(`/`), e.lastIndexOf(`\\`))
            return t === -1 ? `` : e.substring(0, t)
          },
          y = (e, t) => `${e}${e.includes(`\\`) ? `\\` : `/`}${t}`,
          b = async () => {
            if (!(h || d || !t)) {
              p(!0)
              try {
                let e = y(_(t), m),
                  i = await f.createCollection(m, e)
                if (i.status === `ok`) {
                  let i = `./${m}`,
                    c = await f.addCollectionToWorkspace(t, i)
                  c.status === `ok`
                    ? (await n(t),
                      o(e, !0),
                      await s(e),
                      a.success(`Collection "${m}" created`),
                      r(!1))
                    : a.error(`Failed to add collection to workspace: ${c.error}`)
                } else a.error(`Failed to create collection: ${i.error}`)
              } catch (e) {
                a.error(`Error creating collection: ${e instanceof Error ? e.message : String(e)}`)
              } finally {
                p(!1)
              }
            }
          },
          x = () => {
            r(!1)
          },
          C = (e) => {
            e.key === `Enter`
              ? (e.preventDefault(), b())
              : e.key === `Escape` && (e.preventDefault(), x())
          },
          w = (0, q.jsx)(`button`, {
            disabled: h || d,
            onClick: b,
            className: `p-1 rounded transition-colors ${h || d ? `text-text-muted/40 cursor-not-allowed` : `text-success hover:bg-success/12`}`,
            children: (0, q.jsx)(k, { size: 14 }),
          })
        return (0, q.jsxs)(`div`, {
          className: `flex items-center gap-1.5 h-[28px] select-none`,
          style: { paddingLeft: `12px`, paddingRight: `12px` },
          children: [
            (0, q.jsx)(`div`, {
              className: `w-3 h-3 flex items-center justify-center`,
              children: (0, q.jsx)(E, { size: 12, className: `text-text-muted/50 -rotate-90` }),
            }),
            (0, q.jsxs)(`div`, {
              className: `flex items-center gap-1.5 min-w-0 flex-1`,
              children: [
                (0, q.jsx)(O, { size: 14, className: `text-text-muted` }),
                (0, q.jsx)(`input`, {
                  ref: u,
                  type: `text`,
                  value: c,
                  onChange: (e) => l(e.target.value),
                  onKeyDown: C,
                  className: `bg-bg-surface border border-border-default focus:border-accent rounded px-1 outline-none text-sm w-full h-[22px] text-text-primary placeholder:text-text-muted`,
                  disabled: d,
                  onClick: (e) => e.stopPropagation(),
                }),
              ],
            }),
            (0, q.jsxs)(`div`, {
              className: `flex items-center gap-1 shrink-0`,
              children: [
                (0, q.jsx)(ee, {
                  size: 14,
                  className: `text-text-muted/40 cursor-not-allowed mr-0.5`,
                }),
                h
                  ? (0, q.jsx)(N, { content: g, position: `top`, align: `center`, children: w })
                  : w,
                (0, q.jsx)(`button`, {
                  onClick: x,
                  className: `p-1 rounded text-error hover:bg-error/12 transition-colors`,
                  disabled: d,
                  children: (0, q.jsx)(S, { size: 14 }),
                }),
              ],
            }),
          ],
        })
      }),
      (J = (e) => {
        let t = Math.max(e.lastIndexOf(`/`), e.lastIndexOf(`\\`))
        return t === -1 ? `` : e.substring(0, t)
      }),
      (ke = (e, t) => `${e}${e.includes(`\\`) ? `\\` : `/`}${t}`),
      (Y = (e, t) => {
        for (let n of e)
          if (n.type === `Folder`) {
            if (n.data.path === t || Y(n.data.items, t)) return !0
          } else if (n.type === `Request` && n.data.path === t) return !0
        return !1
      }),
      (Ae = (e, t) => {
        let n = `New Request`,
          r = ke(e, n + `.crx`)
        if (!Y(t, r)) return n
        let i = 1
        for (;;) {
          if (((n = `New Request ${i}`), (r = ke(e, n + `.crx`)), !Y(t, r))) return n
          i++
        }
      }),
      (je = (e, t) =>
        !t || !(t === e || t.startsWith(e + `/`) || t.startsWith(e + `\\`))
          ? e
          : t.endsWith(`.crx`)
            ? J(t)
            : t),
      (Me = ({ x: e, y: t, onClose: n, onSelect: r }) => {
        let i = (0, G.useRef)(null),
          [a, o] = (0, G.useState)({ x: e, y: t })
        ;((0, G.useEffect)(() => {
          if (i.current) {
            let n = i.current.getBoundingClientRect(),
              r = e + 12,
              a = t
            ;(r < 12 && (r = 12),
              r + n.width > window.innerWidth && (r = window.innerWidth - n.width - 8),
              a + n.height > window.innerHeight && (a = window.innerHeight - n.height - 8),
              o({ x: r, y: a }))
          }
        }, [e, t]),
          (0, G.useEffect)(() => {
            let e = (e) => {
                i.current && !i.current.contains(e.target) && n()
              },
              t = (e) => {
                e.key === `Escape` && n()
              }
            return (
              document.addEventListener(`mousedown`, e),
              document.addEventListener(`keydown`, t),
              () => {
                ;(document.removeEventListener(`mousedown`, e),
                  document.removeEventListener(`keydown`, t))
              }
            )
          }, [n]))
        let s = [
          {
            label: `HTTP`,
            method: `GET`,
            url: `https://`,
            icon: A,
            colorClass: `text-method-get bg-method-get/15`,
          },
          {
            label: `GraphQL`,
            method: `GraphQL`,
            url: `https://`,
            icon: T,
            colorClass: `text-method-graphql bg-method-graphql/15`,
          },
          {
            label: `gRPC`,
            method: `gRPC`,
            url: `grpc://`,
            icon: ne,
            colorClass: `text-method-grpc bg-method-grpc/15`,
          },
          {
            label: `WebSocket`,
            method: `WS`,
            url: `ws://`,
            icon: j,
            colorClass: `text-method-ws bg-method-ws/15`,
          },
        ]
        return (0, K.createPortal)(
          (0, q.jsx)(`div`, {
            ref: i,
            className: `fixed z-[100] w-[180px] bg-bg-overlay border border-border-default rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.3)] py-1 select-none animate-in fade-in zoom-in-95 duration-100`,
            style: { left: a.x, top: a.y },
            children: s.map((e) => {
              let t = e.icon
              return (0, q.jsxs)(
                `div`,
                {
                  className: `flex items-center gap-2.5 px-3 h-[30px] text-sm text-text-primary hover:bg-bg-highlight cursor-pointer transition-colors`,
                  onClick: (t) => {
                    ;(t.stopPropagation(), r(e.method, e.url))
                  },
                  children: [
                    (0, q.jsx)(`div`, {
                      className: `w-[20px] h-[20px] flex items-center justify-center rounded-sm ${e.colorClass}`,
                      children: (0, q.jsx)(t, { size: 12 }),
                    }),
                    (0, q.jsx)(`span`, {
                      className: `font-medium text-xs text-text-secondary`,
                      children: e.label,
                    }),
                  ],
                },
                e.label
              )
            }),
          }),
          document.body
        )
      }),
      (Ne = ({ collectionPath: e }) => {
        let { collections: t, selectedPath: n, loadCollection: r } = v(),
          { openTab: i } = ie(),
          [o, s] = (0, G.useState)(null)
        return (0, q.jsxs)(q.Fragment, {
          children: [
            (0, q.jsxs)(`div`, {
              className: `flex items-center gap-1.5 h-[28px] cursor-pointer text-text-muted hover:text-text-primary transition-colors text-xs select-none group`,
              style: { paddingLeft: `24px`, paddingRight: `12px` },
              onClick: (e) => {
                e.stopPropagation()
                let t = e.currentTarget.getBoundingClientRect()
                s({ x: t.left, y: t.bottom })
              },
              children: [
                (0, q.jsx)(D, {
                  size: 12,
                  className: `text-text-muted/60 group-hover:text-text-primary`,
                }),
                (0, q.jsx)(`span`, { children: `Add request` }),
              ],
            }),
            o &&
              (0, q.jsx)(Me, {
                x: o.x,
                y: o.y,
                onClose: () => s(null),
                onSelect: async (o, c) => {
                  s(null)
                  let l = t[e]
                  if (!l) return
                  let u = je(e, n),
                    d = Ae(u, l.items)
                  try {
                    let t = await f.createRequest(d, u, o)
                    if (t.status !== `ok`) {
                      a.error(`Failed to create request: ${t.error}`)
                      return
                    }
                    let n = t.data,
                      s = {
                        version: `1`,
                        name: d,
                        method: o,
                        url: c,
                        headers: {},
                        params: {},
                        body: null,
                      }
                    await r(e)
                    let l = i({
                      type: `request`,
                      requestPath: n,
                      collectionId: e,
                      collectionPath: null,
                      folderPath: null,
                      name: d,
                      method: o,
                    })
                    ;(p.getState().populateRequest(l, s),
                      v.getState().setSelectedPath(n),
                      await p.getState().saveRequest(l, n),
                      v.getState().setRenamingPath(n))
                  } catch (e) {
                    a.error(`Error creating request: ${e instanceof Error ? e.message : String(e)}`)
                  }
                },
              }),
          ],
        })
      }),
      (Pe = () => {
        let {
            activeWorkspace: e,
            activeWorkspacePath: t,
            isLoading: n,
            error: r,
            loadWorkspace: o,
            loadLastWorkspace: s,
          } = i(),
          {
            collections: c,
            loadingCollections: l,
            errors: u,
            expansionState: d,
            loadCollection: m,
            toggleExpansion: h,
            setExpanded: g,
            searchQuery: _,
            isCreatingInline: y,
            setCreatingInline: b,
            dropIndicator: x,
            setDropIndicator: ee,
            clearDropIndicator: S,
            pushDndUndo: C,
            popDndUndo: w,
            activeTagFilters: T,
            tagFilterMode: te,
          } = v(),
          { openTab: E, activeTab: k } = ie(),
          A = (0, G.useRef)(null),
          ne = (0, G.useRef)(null),
          re = (0, G.useRef)(null),
          [j, M] = (0, G.useState)(null),
          [ae, oe] = (0, G.useState)(null),
          N = (0, G.useCallback)(
            (e) => {
              for (let t of Object.keys(c))
                if (e === t || e.startsWith(t + `/`) || e.startsWith(t + `\\`)) return t
              return ``
            },
            [c]
          ),
          P = (0, G.useCallback)(() => {
            ;((ne.current &&= (clearTimeout(ne.current), null)), (re.current = null))
          }, []),
          F = (0, G.useCallback)(
            async (e, t, n) => {
              if (e.sourcePath === t) return
              let r = J(e.sourcePath),
                i = J(t),
                o =
                  e.sourcePath
                    .split(`/`)
                    .pop()
                    ?.replace(/\.crx$/, ``) ?? e.sourcePath
              if (n !== `inside` && r === i) {
                try {
                  let r = await f.reorderItem(e.sourcePath, t, n)
                  r.status === `ok`
                    ? (await m(e.sourceCollectionPath), a.success(`"${o}" reordered`))
                    : a.error(`Reorder failed: ${r.error}`)
                } catch (e) {
                  a.error(`Reorder failed: ${String(e)}`)
                }
                return
              }
              let s = n === `inside` ? t : i
              if (!(n === `inside` && r === s))
                try {
                  let t = await f.moveItem(e.sourcePath, s)
                  if (t.status === `ok`) {
                    C({ movedToPath: t.data, originalParentPath: e.sourceParentPath })
                    let r = N(s)
                    ;(await m(e.sourceCollectionPath),
                      r && r !== e.sourceCollectionPath && (await m(r)),
                      n === `inside` && g(s, !0),
                      a.success(`"${o}" moved`))
                  } else a.error(`Move failed: ${t.error}`)
                } catch (e) {
                  a.error(`Move failed: ${String(e)}`)
                }
            },
            [C, N, m, g]
          ),
          se = (0, G.useCallback)(
            (e, t, n, r) => {
              if (e.button !== 0) return
              A.current = {
                sourcePath: t,
                sourceType: n,
                sourceParentPath: r,
                sourceCollectionPath: N(t),
                startX: e.clientX,
                startY: e.clientY,
                isDragging: !1,
              }
              let i = (e) => {
                  let t = A.current
                  if (!t) return
                  let n = Math.hypot(e.clientX - t.startX, e.clientY - t.startY)
                  if (!t.isDragging) {
                    if (n < 4) return
                    ;((t.isDragging = !0), oe(t.sourcePath))
                  }
                  let r =
                    t.sourcePath
                      .split(`/`)
                      .pop()
                      ?.replace(/\.crx$/, ``) ?? ``
                  M({ x: e.clientX, y: e.clientY, label: r })
                  let i = Se(e.clientX, e.clientY)
                  if (
                    !i ||
                    i.path === t.sourcePath ||
                    i.path.startsWith(t.sourcePath + `/`) ||
                    i.path.startsWith(t.sourcePath + `\\`)
                  ) {
                    ;(v.getState().dropIndicator !== null && S(), P())
                    return
                  }
                  let a = i.element.getBoundingClientRect(),
                    o = xe(e.clientY, a, i.nodeType),
                    s = v.getState().dropIndicator
                  ;((s?.targetPath !== i.path || s?.position !== o) &&
                    ee({ targetPath: i.path, position: o }),
                    o === `inside` && i.nodeType !== `request`
                      ? re.current !== i.path &&
                        (P(),
                        (re.current = i.path),
                        (ne.current = setTimeout(() => {
                          ;(g(i.path, !0), c[i.path] === void 0 && !l[i.path] && m(i.path))
                        }, 600)))
                      : P())
                },
                a = async (e) => {
                  ;(document.removeEventListener(`mousemove`, i),
                    document.removeEventListener(`mouseup`, a))
                  let t = A.current
                  if (((A.current = null), oe(null), M(null), S(), P(), !t?.isDragging)) return
                  let n = Se(e.clientX, e.clientY)
                  if (
                    !n ||
                    n.path === t.sourcePath ||
                    n.path.startsWith(t.sourcePath + `/`) ||
                    n.path.startsWith(t.sourcePath + `\\`)
                  )
                    return
                  let r = n.element.getBoundingClientRect(),
                    o = xe(e.clientY, r, n.nodeType)
                  await F(t, n.path, o)
                }
              ;(document.addEventListener(`mousemove`, i), document.addEventListener(`mouseup`, a))
            },
            [N, S, P, ee, g, c, l, m, F]
          )
        ;((0, G.useEffect)(() => {
          let e = async (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === `z` && !e.shiftKey) {
              let t = w()
              if (!t) return
              ;(e.preventDefault(), e.stopPropagation())
              try {
                let e = await f.moveItem(t.movedToPath, t.originalParentPath)
                if (e.status === `ok`) {
                  let e = N(t.movedToPath),
                    n = N(t.originalParentPath)
                  ;(e && (await m(e)), n && n !== e && (await m(n)), a.success(`Move undone`))
                } else a.error(`Undo failed: ${e.error}`)
              } catch (e) {
                a.error(`Undo failed: ${String(e)}`)
              }
            }
          }
          return (
            document.addEventListener(`keydown`, e),
            () => document.removeEventListener(`keydown`, e)
          )
        }, [w, N, m]),
          (0, G.useEffect)(() => {
            e || s()
          }, [s, e]),
          (0, G.useEffect)(() => {
            e &&
              e.collections.forEach((e) => {
                ;(_ || d[e.path]) && !c[e.path] && !l[e.path] && m(e.path)
              })
          }, [e, d, c, l, m, _]))
        let ce = async () => {
            try {
              let e = await f.pickDirectory(`Open Collection or Workspace`)
              if (!e.status || e.status !== `ok` || !e.data) return
              let n = await f.detectDirectoryType(e.data)
              if (n === `workspace`) await o(e.data)
              else if (n === `collection`) {
                if (!t) {
                  a.error(`Open a workspace first before adding a collection.`)
                  return
                }
                let n = await f.addCollectionToWorkspace(t, e.data)
                n.status === `ok`
                  ? (await o(t), await m(e.data), a.success(`Collection added to workspace`))
                  : a.error(`Failed to add collection: ${n.error}`)
              } else
                a.error(
                  `The selected directory is neither a Cortex workspace nor a collection (no cortex-workspace.yaml or cortex.yaml found).`
                )
            } catch (e) {
              a.error(`Failed to open collection: ${String(e)}`)
            }
          },
          le = (e) => {
            if (T.length === 0) return !0
            let t = e ?? []
            return te === `and` ? T.every((e) => t.includes(e)) : T.some((e) => t.includes(e))
          },
          ue = (e) =>
            e.some((e) => (e.type === `Request` ? le(e.data.content?.tags) : ue(e.data.items))),
          de = (e, t, n, r) => {
            let i = e.filter((e) => {
              let t = T.length > 0
              if (e.type === `Request`) {
                let n = !r || e.data.name.toLowerCase().includes(r.toLowerCase()),
                  i = !t || le(e.data.content?.tags)
                return n && i
              } else {
                let n = !r || e.data.name.toLowerCase().includes(r.toLowerCase()),
                  i = (e) =>
                    e.some((e) => {
                      if (e.type === `Request`) {
                        let n = !r || e.data.name.toLowerCase().includes(r.toLowerCase()),
                          i = !t || le(e.data.content?.tags)
                        return n && i
                      } else
                        return (
                          !r ||
                          e.data.name.toLowerCase().includes(r.toLowerCase()) ||
                          i(e.data.items)
                        )
                    })
                return t ? ue(e.data.items) : n || i(e.data.items)
              }
            })
            i.length
            let a = i.map((e) => ({ path: (e.type, e.data.path) }))
            return i.map((e) => {
              if (e.type === `Folder`) {
                let i = e.data,
                  o = r || T.length > 0 ? !0 : d[i.path] || !1,
                  s = T.length > 0
                return (0, q.jsxs)(
                  G.Fragment,
                  {
                    children: [
                      (0, q.jsx)(W, {
                        label: i.name,
                        depth: t,
                        type: `folder`,
                        path: i.path,
                        isExpanded: o,
                        onToggle: () => h(i.path),
                        collectionPath: n,
                        siblings: a,
                        parentPath: J(i.path),
                        dropIndicator: x,
                        isDragSource: ae === i.path,
                        dimmed: s,
                        onNodeMouseDown: se,
                      }),
                      o && de(i.items, t + 1, n, r),
                    ],
                  },
                  i.path
                )
              } else {
                let r = e.data,
                  i = r.content?.examples ?? [],
                  o = i.length > 0,
                  s = `${r.path}#examples`,
                  c = o ? (d[s] ?? !0) : !1
                return (0, q.jsxs)(
                  G.Fragment,
                  {
                    children: [
                      (0, q.jsx)(W, {
                        label: r.name,
                        depth: t,
                        type: `request`,
                        path: r.path,
                        method: r.content?.method || `GET`,
                        error: r.error,
                        isActive: k?.requestPath === r.path && k?.type === `request`,
                        requestTags: r.content?.tags ?? [],
                        collectionPath: n,
                        siblings: a,
                        isExpanded: o ? c : void 0,
                        onToggle: o ? () => h(s) : void 0,
                        onClick: () => {
                          let e = E({
                            type: `request`,
                            requestPath: r.path,
                            collectionId: n,
                            collectionPath: null,
                            folderPath: null,
                            name: r.name,
                            method: r.content?.method || `GET`,
                          })
                          r.content && p.getState().populateRequest(e, r.content)
                        },
                        parentPath: J(r.path),
                        dropIndicator: x,
                        isDragSource: ae === r.path,
                        onNodeMouseDown: se,
                      }),
                      o &&
                        c &&
                        i.map((e) =>
                          (0, q.jsx)(
                            W,
                            {
                              label: e.name,
                              depth: t + 1,
                              type: `example`,
                              path: `${r.path}#${e.id}`,
                              method: ``,
                              collectionPath: n,
                              siblings: [],
                              isActive:
                                k?.type === `example` &&
                                k?.requestPath === r.path &&
                                k?.exampleId === e.id,
                              onClick: () => {
                                E({
                                  type: `example`,
                                  requestPath: r.path,
                                  collectionId: n,
                                  collectionPath: null,
                                  folderPath: null,
                                  exampleId: e.id,
                                  name: e.name,
                                  method: e.method,
                                })
                              },
                              parentPath: r.path,
                              onNodeMouseDown: se,
                            },
                            `${r.path}#${e.id}`
                          )
                        ),
                    ],
                  },
                  r.path
                )
              }
            })
          }
        return n
          ? (0, q.jsx)(`div`, {
              className: `flex items-center justify-center h-full`,
              children: (0, q.jsx)(`div`, {
                className: `w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin`,
              }),
            })
          : r
            ? (0, q.jsxs)(`div`, {
                className: `p-4 text-error text-xs`,
                children: [`Failed to load workspace: `, r],
              })
            : (0, q.jsxs)(q.Fragment, {
                children: [
                  (0, q.jsx)(`div`, {
                    id: `sidebar-tree-root`,
                    className: `flex-1 overflow-y-auto custom-scrollbar`,
                    children: (() => {
                      if (!e || (e.collections.length === 0 && !y))
                        return (0, q.jsxs)(`div`, {
                          className: `flex flex-col items-center justify-center h-full p-6 text-center select-none`,
                          children: [
                            (0, q.jsx)(`div`, {
                              className: `mb-4 text-text-muted opacity-20`,
                              children: (0, q.jsx)(O, { size: 64, strokeWidth: 1 }),
                            }),
                            (0, q.jsx)(`h3`, {
                              className: `text-text-secondary text-sm font-medium mb-1`,
                              children: `No collections yet`,
                            }),
                            (0, q.jsx)(`p`, {
                              className: `text-text-muted text-xs mb-6`,
                              children: `Create or open a collection to get started.`,
                            }),
                            (0, q.jsxs)(`div`, {
                              className: `flex flex-col gap-2 w-full max-w-[200px]`,
                              children: [
                                (0, q.jsxs)(`button`, {
                                  onClick: () => b(!0),
                                  className: `h-8 flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-accent-fg text-sm font-medium rounded-md transition-colors`,
                                  children: [(0, q.jsx)(D, { size: 14 }), `Create collection`],
                                }),
                                (0, q.jsxs)(`button`, {
                                  onClick: ce,
                                  className: `h-8 flex items-center justify-center gap-2 border border-border-default hover:bg-bg-muted text-text-primary text-sm font-medium rounded-md transition-colors`,
                                  children: [(0, q.jsx)(O, { size: 14 }), `Open collection`],
                                }),
                              ],
                            }),
                          ],
                        })
                      let t = 0,
                        n = e
                          ? e.collections.map((e) => {
                              let n = c[e.path],
                                r = _ ? !0 : d[e.path] || !1,
                                i = l[e.path] || !1,
                                a = u[e.path] || e.error,
                                o = () => {
                                  ;(!r && !n && m(e.path), h(e.path))
                                },
                                s = n ? de(n.items, 1, e.path, _) : []
                              if (s.length > 0 || !_) ((t += s.length), _ || t++)
                              else if (_ && e.name?.toLowerCase().includes(_.toLowerCase())) t++
                              else return null
                              return (0, q.jsxs)(
                                G.Fragment,
                                {
                                  children: [
                                    (0, q.jsx)(W, {
                                      label: e.name || e.path.split(`/`).pop() || `Collection`,
                                      depth: 0,
                                      type: `collection`,
                                      path: e.path,
                                      isExpanded: r,
                                      isLoading: i,
                                      error: a,
                                      onToggle: o,
                                      onOpenSettings: () => {
                                        E({
                                          type: `collection`,
                                          collectionPath: e.path,
                                          collectionId: e.path,
                                          requestPath: null,
                                          folderPath: null,
                                          name: e.name || e.path.split(`/`).pop() || `Collection`,
                                          method: ``,
                                        })
                                      },
                                      dropIndicator: x,
                                      isGitRepo: n?.is_git_repo === !0,
                                    }),
                                    r &&
                                      n &&
                                      (0, q.jsxs)(q.Fragment, {
                                        children: [s, (0, q.jsx)(Ne, { collectionPath: e.path })],
                                      }),
                                  ],
                                },
                                e.path
                              )
                            })
                          : []
                      return _ && t === 0
                        ? (0, q.jsx)(`div`, {
                            className: `flex flex-col items-center justify-center h-full p-4 text-center select-none`,
                            children: (0, q.jsxs)(`p`, {
                              className: `text-text-muted text-sm`,
                              children: [`No results for "`, _, `"`],
                            }),
                          })
                        : (0, q.jsxs)(`div`, {
                            className: `py-1`,
                            children: [n, y && (0, q.jsx)(Oe, {})],
                          })
                    })(),
                  }),
                  j &&
                    (0, K.createPortal)(
                      (0, q.jsx)(`div`, {
                        className: `fixed pointer-events-none z-[9999] bg-bg-overlay border border-border-default rounded px-2 py-1 text-xs text-text-primary shadow-lg`,
                        style: { left: j.x + 14, top: j.y - 8 },
                        children: j.label,
                      }),
                      document.body
                    ),
                ],
              })
      }),
      (Pe.__docgenInfo = { description: ``, methods: [], displayName: `SidebarTree` }))
  }),
  Ie = n({
    Default: () => Z,
    WithCollections: () => Q,
    WithTauriMockOverride: () => $,
    __namedExportsOrder: () => Be,
    default: () => ze,
  }),
  X,
  Le,
  Re,
  ze,
  Z,
  Q,
  $,
  Be,
  Ve = t(() => {
    ;(Fe(),
      M(),
      b(),
      c(),
      (X = g()),
      (Le = {
        name: `Demo Workspace`,
        collections: [{ path: `/demo/workspace/petstore.crx`, name: `Petstore API`, error: null }],
        environments: [],
        env_files: [],
        variables: null,
        active_environment: null,
        decrypt_failures: {},
      }),
      (Re = {
        path: `/demo/workspace/petstore.crx`,
        is_git_repo: !1,
        manifest: {
          version: `1`,
          name: `Petstore API`,
          description: `Sample Petstore collection`,
          headers: null,
          variables: [],
          auth: null,
          scripts: null,
          tests: null,
          presets: [],
          proxy: { enabled: !1, url: ``, bypass_list: null, username: null, password: null },
          client_certificates: [],
          protobuf: { proto_files: [], import_paths: [] },
          tag_registry: [],
        },
        items: [
          {
            type: `Request`,
            data: {
              name: `List pets`,
              path: `/demo/workspace/petstore.crx/GET_pets.yaml`,
              relative_path: `GET_pets.yaml`,
              content: null,
              error: null,
            },
          },
          {
            type: `Request`,
            data: {
              name: `Create pet`,
              path: `/demo/workspace/petstore.crx/POST_pets.yaml`,
              relative_path: `POST_pets.yaml`,
              content: null,
              error: null,
            },
          },
        ],
      }),
      (ze = {
        title: `layout/SidebarTree`,
        component: Pe,
        decorators: [
          (e) =>
            (0, X.jsx)(ae, {
              children: (0, X.jsx)(`div`, {
                style: { width: 260, height: 600, display: `flex`, flexDirection: `column` },
                children: (0, X.jsx)(e, {}),
              }),
            }),
        ],
        parameters: { layout: `fullscreen` },
      }),
      (Z = {}),
      (Q = {
        beforeEach: () => {
          ;(i.setState({ activeWorkspace: Le, activeWorkspacePath: `/demo/workspace` }),
            v.setState({
              collections: { '/demo/workspace/petstore.crx': Re },
              expansionState: { '/demo/workspace/petstore.crx': !0 },
            }))
        },
      }),
      ($ = {
        beforeEach: () => {
          ;(i.setState({ activeWorkspace: Le, activeWorkspacePath: `/demo/workspace` }),
            v.setState({
              collections: { '/demo/workspace/petstore.crx': Re },
              expansionState: { '/demo/workspace/petstore.crx': !0 },
            }))
        },
        parameters: { tauriMock: { load_collection: () => Re } },
      }),
      (Z.parameters = {
        ...Z.parameters,
        docs: {
          ...Z.parameters?.docs,
          source: { originalSource: `{}`, ...Z.parameters?.docs?.source },
          description: {
            story: `Default — no workspace loaded.
The global store reset puts workspaceStore.activeWorkspace back to null so
the tree shows the "Open workspace" empty state.`,
            ...Z.parameters?.docs?.description,
          },
        },
      }),
      (Q.parameters = {
        ...Q.parameters,
        docs: {
          ...Q.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    useWorkspaceStore.setState({
      activeWorkspace: FIXTURE_WORKSPACE,
      activeWorkspacePath: '/demo/workspace'
    });
    useCollectionStore.setState({
      collections: {
        '/demo/workspace/petstore.crx': FIXTURE_COLLECTION
      },
      expansionState: {
        '/demo/workspace/petstore.crx': true
      }
    });
  }
}`,
            ...Q.parameters?.docs?.source,
          },
          description: {
            story:
              'WithCollections — workspace and one collection pre-seeded via beforeEach.\n\nPattern: use `beforeEach` to call `useXxxStore.setState(...)` after the\nglobal reset has already run. This populates only what this story needs.',
            ...Q.parameters?.docs?.description,
          },
        },
      }),
      ($.parameters = {
        ...$.parameters,
        docs: {
          ...$.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    useWorkspaceStore.setState({
      activeWorkspace: FIXTURE_WORKSPACE,
      activeWorkspacePath: '/demo/workspace'
    });
    useCollectionStore.setState({
      collections: {
        '/demo/workspace/petstore.crx': FIXTURE_COLLECTION
      },
      expansionState: {
        '/demo/workspace/petstore.crx': true
      }
    });
  },
  parameters: {
    // Return the RAW inner value — the binding wraps it in { status:"ok", data:... }
    // automatically. Do NOT return { status:'ok', data:X } here or it double-wraps.
    tauriMock: {
      load_collection: () => FIXTURE_COLLECTION
    }
  }
}`,
            ...$.parameters?.docs?.source,
          },
          description: {
            story: `WithTauriMockOverride — demonstrates how to override a specific Tauri command
for a story via \`parameters.tauriMock\`.

The \`withTauriMock\` decorator in preview.tsx reads this map and routes
matching commands to the provided handler instead of the default null stub.`,
            ...$.parameters?.docs?.description,
          },
        },
      }),
      (Be = [`Default`, `WithCollections`, `WithTauriMockOverride`]))
  })
Ve()
export {
  Z as Default,
  Q as WithCollections,
  $ as WithTauriMockOverride,
  Be as __namedExportsOrder,
  ze as default,
  Ve as n,
  Ie as t,
}
