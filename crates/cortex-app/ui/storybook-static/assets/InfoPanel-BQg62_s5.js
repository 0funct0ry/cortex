import { a as e, n as t } from './chunk-DnJy8xQt.js'
import { A as n, gt as r, k as i, t as a } from './iframe-CECvvSLk.js'
import { t as o } from './react-dom-CUfkHZq5.js'
function s(e) {
  if (e === 0) return `0 B`
  let t = [`B`, `KB`, `MB`, `GB`],
    n = Math.floor(Math.log(e) / Math.log(1024))
  return `${(e / 1024 ** n).toFixed(1)} ${t[n]}`
}
function c(e) {
  return new Date(e).toLocaleString(void 0, { dateStyle: `medium`, timeStyle: `short` })
}
var l,
  u,
  d,
  f,
  p = t(() => {
    ;((l = e(r(), 1)),
      (u = e(o(), 1)),
      n(),
      (d = a()),
      (f = ({ isOpen: e, onClose: t, path: n, type: r }) => {
        let [a, o] = (0, l.useState)(null),
          [f, p] = (0, l.useState)(null)
        if (
          ((0, l.useEffect)(() => {
            if (!e) return
            let t = !1
            return (
              i.getItemInfo(n).then((e) => {
                t || (e.status === `ok` ? o(e.data) : p(e.error))
              }),
              () => {
                ;((t = !0), o(null), p(null))
              }
            )
          }, [e, n]),
          (0, l.useEffect)(() => {
            if (!e) return
            let n = (e) => {
              e.key === `Escape` && t()
            }
            return (
              document.addEventListener(`keydown`, n),
              () => document.removeEventListener(`keydown`, n)
            )
          }, [e, t]),
          !e)
        )
          return null
        let m = a
          ? [
              { label: `Path`, value: a.path },
              { label: `Size`, value: s(a.size_bytes) },
              ...(a.created ? [{ label: `Created`, value: c(a.created) }] : []),
              ...(a.modified ? [{ label: `Modified`, value: c(a.modified) }] : []),
              ...(a.method == null ? [] : [{ label: `Method`, value: a.method }]),
              ...(a.url == null ? [] : [{ label: `URL`, value: a.url }]),
              ...(a.direct_request_count == null
                ? []
                : [{ label: `Direct requests`, value: String(a.direct_request_count) }]),
              ...(a.direct_folder_count == null
                ? []
                : [{ label: `Subfolders`, value: String(a.direct_folder_count) }]),
              ...(a.item_count == null
                ? []
                : [{ label: `Total requests`, value: String(a.item_count) }]),
            ]
          : []
        return (0, u.createPortal)(
          (0, d.jsxs)(`div`, {
            className: `fixed inset-0 z-[200] flex items-center justify-center p-4`,
            children: [
              (0, d.jsx)(`div`, {
                className: `absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200`,
                onClick: t,
              }),
              (0, d.jsxs)(`div`, {
                className: `relative w-full max-w-md bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200`,
                children: [
                  (0, d.jsx)(`h3`, {
                    className: `text-base font-semibold text-text-primary mb-4`,
                    children: r === `folder` ? `Folder Info` : `Request Info`,
                  }),
                  f
                    ? (0, d.jsx)(`p`, { className: `text-sm text-error mb-4`, children: f })
                    : a
                      ? (0, d.jsx)(`table`, {
                          className: `w-full text-sm border-collapse mb-4`,
                          children: (0, d.jsx)(`tbody`, {
                            children: m.map(({ label: e, value: t }) =>
                              (0, d.jsxs)(
                                `tr`,
                                {
                                  className: `border-b border-border-subtle last:border-0`,
                                  children: [
                                    (0, d.jsx)(`td`, {
                                      className: `py-1.5 pr-4 text-text-muted font-medium w-24 align-top`,
                                      children: e,
                                    }),
                                    (0, d.jsx)(`td`, {
                                      className: `py-1.5 text-text-primary break-all`,
                                      children: t,
                                    }),
                                  ],
                                },
                                e
                              )
                            ),
                          }),
                        })
                      : (0, d.jsx)(`p`, {
                          className: `text-sm text-text-muted mb-4`,
                          children: `Loading…`,
                        }),
                  (0, d.jsx)(`div`, {
                    className: `flex justify-end`,
                    children: (0, d.jsx)(`button`, {
                      onClick: t,
                      className: `h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded-md transition-colors`,
                      children: `Close`,
                    }),
                  }),
                ],
              }),
            ],
          }),
          document.body
        )
      }))
  })
export { p as n, f as t }
