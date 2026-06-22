import { a as e, n as t } from './chunk-DnJy8xQt.js'
import { gt as n, t as r } from './iframe-CECvvSLk.js'
import { D as i, O as a } from './Icons-DjzhDYF3.js'
var o,
  s,
  c,
  l,
  u,
  d,
  f = t(() => {
    ;((o = e(n(), 1)),
      (s = r()),
      (c = (0, o.createContext)(void 0)),
      (l = `cortex.theme`),
      (u = ({ children: e }) => {
        let [t, n] = (0, o.useState)(() => localStorage.getItem(l) || `dark`)
        return (
          (0, o.useEffect)(() => {
            document.documentElement.dataset.theme = t
          }, [t]),
          (0, s.jsx)(c.Provider, {
            value: {
              theme: t,
              setTheme: (e) => {
                ;(n(e), localStorage.setItem(l, e))
              },
            },
            children: e,
          })
        )
      }),
      (d = () => {
        let e = (0, o.useContext)(c)
        if (e === void 0) throw Error(`useTheme must be used within a ThemeProvider`)
        return e
      }),
      (u.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `ThemeProvider`,
        props: {
          children: {
            required: !0,
            tsType: { name: `ReactReactNode`, raw: `React.ReactNode` },
            description: ``,
          },
        },
      }))
  }),
  p,
  m,
  h,
  g,
  _ = t(() => {
    ;((p = e(n(), 1)),
      a(),
      f(),
      (m = r()),
      (h = [
        { id: `light`, name: `Light`, section: `light` },
        { id: `light-monochrome`, name: `Light Monochrome`, section: `light` },
        { id: `light-pastel`, name: `Light Pastel`, section: `light` },
        { id: `catppuccin-latte`, name: `Catppuccin Latte`, section: `light` },
        { id: `vscode-light`, name: `VS Code Light`, section: `light` },
        { id: `dark`, name: `Dark`, section: `dark` },
        { id: `dark-monochrome`, name: `Dark Monochrome`, section: `dark` },
        { id: `dark-pastel`, name: `Dark Pastel`, section: `dark` },
        { id: `catppuccin-frappe`, name: `Catppuccin Frappé`, section: `dark` },
        { id: `catppuccin-macchiato`, name: `Catppuccin Macchiato`, section: `dark` },
        { id: `catppuccin-mocha`, name: `Catppuccin Mocha`, section: `dark` },
        { id: `nord`, name: `Nord`, section: `dark` },
        { id: `vscode-dark`, name: `VS Code Dark`, section: `dark` },
      ]),
      (g = ({ onClose: e }) => {
        let { theme: t, setTheme: n } = d(),
          r = (0, p.useRef)(null)
        ;(0, p.useEffect)(() => {
          let n = (t) => {
              r.current && !r.current.contains(t.target) && e()
            },
            i = (t) => {
              t.key === `Escape` && e()
            }
          return (
            document.addEventListener(`mousedown`, n),
            document.addEventListener(`keydown`, i),
            () => {
              ;(document.removeEventListener(`mousedown`, n),
                document.removeEventListener(`keydown`, i),
                (document.documentElement.dataset.theme = t))
            }
          )
        }, [e, t])
        let a = (e) => {
            document.documentElement.dataset.theme = e || t
          },
          o = (t) => {
            ;(n(t), e())
          },
          s = (e, n) => {
            let r = h.filter((e) => e.section === n)
            return (0, m.jsxs)(`div`, {
              className: `py-1`,
              children: [
                (0, m.jsx)(`div`, {
                  className: `px-3 pt-2 pb-1 text-xs font-semibold text-text-muted uppercase tracking-wider`,
                  children: e,
                }),
                r.map((e) => {
                  let n = e.id === t
                  return (0, m.jsxs)(
                    `div`,
                    {
                      className: `flex items-center h-7 px-3 gap-2 cursor-pointer hover:bg-bg-highlight group transition-colors`,
                      onMouseEnter: () => a(e.id),
                      onMouseLeave: () => a(null),
                      onClick: () => o(e.id),
                      children: [
                        (0, m.jsx)(`div`, {
                          className: `w-3.5 h-3.5 flex items-center justify-center`,
                          children: n
                            ? (0, m.jsx)(`div`, { className: `w-2 h-2 rounded-full bg-accent` })
                            : (0, m.jsx)(`div`, {
                                className: `w-2 h-2 rounded-full border border-text-muted/40 group-hover:border-text-muted/60`,
                              }),
                        }),
                        (0, m.jsx)(`span`, {
                          className: `text-sm text-text-primary flex-1 ${n ? `font-medium` : ``}`,
                          children: e.name,
                        }),
                        n &&
                          (0, m.jsx)(`span`, {
                            className: `text-xs text-text-muted`,
                            children: `✓ active`,
                          }),
                      ],
                    },
                    e.id
                  )
                }),
              ],
            })
          }
        return (0, m.jsxs)(`div`, {
          ref: r,
          className: `absolute bottom-[26px] right-3 w-[280px] max-h-[360px] bg-bg-overlay border border-border-subtle rounded-md shadow-lg overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100`,
          children: [
            (0, m.jsxs)(`div`, {
              className: `sticky top-0 bg-bg-overlay border-b border-border-subtle flex items-center justify-between px-3 h-8 z-10`,
              children: [
                (0, m.jsx)(`span`, {
                  className: `text-xs font-semibold text-text-primary`,
                  children: `Theme`,
                }),
                (0, m.jsx)(`button`, {
                  onClick: e,
                  className: `text-text-muted hover:text-text-primary transition-colors`,
                  children: (0, m.jsx)(i, { size: 14 }),
                }),
              ],
            }),
            (0, m.jsxs)(`div`, {
              className: `py-1`,
              children: [
                s(`Light Themes`, `light`),
                (0, m.jsx)(`div`, { className: `h-px bg-border-subtle mx-1 my-1` }),
                s(`Dark Themes`, `dark`),
              ],
            }),
          ],
        })
      }),
      (g.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `ThemePicker`,
        props: {
          onClose: {
            required: !0,
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
export { d as a, f as i, _ as n, u as r, g as t }
