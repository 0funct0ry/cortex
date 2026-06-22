import { a as e, n as t } from './chunk-DnJy8xQt.js'
import { gt as n, t as r } from './iframe-CECvvSLk.js'
var i,
  a,
  o,
  s,
  c,
  l,
  u,
  d = t(() => {
    ;((i = e(n(), 1)),
      (a = r()),
      (o = (0, i.createContext)(void 0)),
      (s = `cortex.tabs.list`),
      (c = `cortex.tabs.activeId`),
      (l = ({ children: e }) => {
        let [t, n] = (0, i.useState)(() => {
            let e = localStorage.getItem(s)
            if (e)
              try {
                return JSON.parse(e).map((e) => ({
                  ...e,
                  collectionPath: e.collectionPath ?? null,
                  folderPath: e.folderPath ?? null,
                  exampleId: e.exampleId ?? null,
                }))
              } catch (e) {
                console.error(`Failed to load tabs from localStorage`, e)
              }
            return []
          }),
          [r, l] = (0, i.useState)(() => localStorage.getItem(c))
        ;((0, i.useEffect)(() => {
          localStorage.setItem(s, JSON.stringify(t))
        }, [t]),
          (0, i.useEffect)(() => {
            r ? localStorage.setItem(c, r) : localStorage.removeItem(c)
          }, [r]))
        let u = (0, i.useCallback)((e) => {
            l(e)
          }, []),
          d = (0, i.useCallback)(
            (e) => {
              if (e.type === `environments`) {
                let e = t.find((e) => e.type === `environments`)
                if (e) return (u(e.id), e.id)
              }
              if (e.type === `collection` && e.collectionPath) {
                let n = t.find(
                  (t) => t.type === `collection` && t.collectionPath === e.collectionPath
                )
                if (n) return (u(n.id), n.id)
              }
              if (e.type === `collection-environments` && e.collectionPath) {
                let n = t.find(
                  (t) =>
                    t.type === `collection-environments` && t.collectionPath === e.collectionPath
                )
                if (n) return (u(n.id), n.id)
              }
              if (e.type === `folder` && e.folderPath) {
                let n = t.find((t) => t.type === `folder` && t.folderPath === e.folderPath)
                if (n) return (u(n.id), n.id)
              }
              if (e.type === `request` && e.requestPath) {
                let n = t.find((t) => t.requestPath === e.requestPath)
                if (n) return (u(n.id), n.id)
              }
              if (e.type === `example` && e.requestPath && e.exampleId) {
                let n = t.find(
                  (t) =>
                    t.type === `example` &&
                    t.requestPath === e.requestPath &&
                    t.exampleId === e.exampleId
                )
                if (n) return (u(n.id), n.id)
              }
              let r = { ...e, id: crypto.randomUUID(), isDirty: !1, exampleId: e.exampleId ?? null }
              return (n((e) => [...e, r]), l(r.id), r.id)
            },
            [t, u]
          ),
          f = (0, i.useCallback)(
            (e) => {
              n((t) => {
                let n = t.findIndex((t) => t.id === e)
                if (n === -1) return t
                let i = t.filter((t) => t.id !== e)
                return (e === r && (i.length > 0 ? l(i[Math.max(0, n - 1)].id) : l(null)), i)
              })
            },
            [r]
          ),
          p = (0, i.useCallback)(
            (e) => {
              n((t) => {
                let n = t.filter((t) => !e(t))
                if (t.some((t) => t.id === r && e(t)))
                  if (n.length > 0) {
                    let r = t.findIndex((t) => e(t)),
                      i = Math.max(0, r - 1),
                      a = n[Math.min(i, n.length - 1)]
                    l(a.id)
                  } else l(null)
                return n
              })
            },
            [r]
          ),
          m = (0, i.useCallback)((e, t) => {
            n((n) => n.map((n) => (n.id === e ? { ...n, isDirty: t } : n)))
          }, []),
          h = (0, i.useCallback)((e, t) => {
            n((n) => n.map((n) => (n.id === e ? { ...n, ...t } : n)))
          }, []),
          g = (0, i.useCallback)((e, t) => {
            n((n) => {
              let r = Array.from(n),
                [i] = r.splice(e, 1)
              return (r.splice(t, 0, i), r)
            })
          }, []),
          _ = (0, i.useCallback)(
            (e) => {
              let r = t.find((t) => t.id === e)
              if (!r) return
              let i = { ...r, id: crypto.randomUUID(), name: `${r.name} (Copy)`, isDirty: !1 }
              ;(n((t) => {
                let n = t.findIndex((t) => t.id === e),
                  r = [...t]
                return (r.splice(n + 1, 0, i), r)
              }),
                l(i.id))
            },
            [t]
          ),
          v = (0, i.useCallback)((e) => {
            ;(n((t) => t.filter((t) => t.id === e)), l(e))
          }, []),
          y = (0, i.useCallback)((e) => {
            ;(n((t) => {
              let n = t.findIndex((t) => t.id === e)
              return n === -1 ? t : t.slice(0, n + 1)
            }),
              l(e))
          }, []),
          b = (0, i.useCallback)((e, t, r) => {
            n((n) =>
              n.map((n) => (n.id === e ? { ...n, requestPath: t, name: r, isDirty: !1 } : n))
            )
          }, []),
          x = t.find((e) => e.id === r) || null
        return (
          (0, i.useEffect)(() => {
            let e = (e) => {
              if (
                ((e.metaKey || e.ctrlKey) && e.key === `w` && r && (e.preventDefault(), f(r)),
                (e.metaKey || e.ctrlKey) && /^[1-9]$/.test(e.key))
              ) {
                let n = parseInt(e.key) - 1
                n < t.length && (e.preventDefault(), l(t[n].id))
              }
              ;((e.metaKey || e.ctrlKey) &&
                e.shiftKey &&
                (e.key === `}` || e.key === `]`
                  ? (e.preventDefault(), l(t[(t.findIndex((e) => e.id === r) + 1) % t.length].id))
                  : (e.key === `{` || e.key === `[`) &&
                    (e.preventDefault(),
                    l(t[(t.findIndex((e) => e.id === r) - 1 + t.length) % t.length].id))),
                (e.metaKey || e.ctrlKey) &&
                  !e.shiftKey &&
                  e.key === `n` &&
                  (e.preventDefault(),
                  d({
                    type: `request`,
                    requestPath: null,
                    collectionId: null,
                    collectionPath: null,
                    folderPath: null,
                    name: `Untitled`,
                    method: `GET`,
                  })))
            }
            return (
              window.addEventListener(`keydown`, e),
              () => window.removeEventListener(`keydown`, e)
            )
          }, [t, r, f, d]),
          (0, a.jsx)(o.Provider, {
            value: {
              tabs: t,
              activeTabId: r,
              activeTab: x,
              openTab: d,
              closeTab: f,
              closeTabsWhere: p,
              activateTab: u,
              setDirty: m,
              updateTab: h,
              reorderTabs: g,
              duplicateTab: _,
              closeOtherTabs: v,
              closeTabsToTheRight: y,
              promoteTab: b,
            },
            children: e,
          })
        )
      }),
      (u = () => {
        let e = (0, i.useContext)(o)
        if (e === void 0) throw Error(`useTabs must be used within a TabsProvider`)
        return e
      }),
      (l.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `TabsProvider`,
        props: {
          children: {
            required: !0,
            tsType: { name: `ReactReactNode`, raw: `React.ReactNode` },
            description: ``,
          },
        },
      }))
  })
export { d as n, u as r, l as t }
