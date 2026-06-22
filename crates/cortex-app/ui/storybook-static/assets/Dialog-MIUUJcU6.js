import { a as e, n as t } from './chunk-DnJy8xQt.js'
import { gt as n, t as r } from './iframe-CECvvSLk.js'
import { t as i } from './react-dom-CUfkHZq5.js'
var a,
  o,
  s,
  c,
  l = t(() => {
    ;((a = e(n(), 1)),
      (o = e(i(), 1)),
      (s = r()),
      (c = ({
        isOpen: e,
        onClose: t,
        onConfirm: n,
        title: r,
        description: i,
        confirmLabel: c = `Confirm`,
        cancelLabel: l = `Cancel`,
        variant: u = `primary`,
      }) => (
        (0, a.useEffect)(() => {
          if (!e) return
          let n = (e) => {
            e.key === `Escape` && t()
          }
          return (
            document.addEventListener(`keydown`, n),
            () => document.removeEventListener(`keydown`, n)
          )
        }, [e, t]),
        e
          ? (0, o.createPortal)(
              (0, s.jsxs)(`div`, {
                className: `fixed inset-0 z-[200] flex items-center justify-center p-4`,
                children: [
                  (0, s.jsx)(`div`, {
                    className: `absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200`,
                    onClick: t,
                  }),
                  (0, s.jsxs)(`div`, {
                    className: `relative w-full max-w-md bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200`,
                    children: [
                      (0, s.jsx)(`h3`, {
                        className: `text-base font-semibold text-text-primary mb-2`,
                        children: r,
                      }),
                      (0, s.jsx)(`p`, {
                        className: `text-sm text-text-secondary mb-6`,
                        children: i,
                      }),
                      (0, s.jsxs)(`div`, {
                        className: `flex justify-end gap-3`,
                        children: [
                          (0, s.jsx)(`button`, {
                            onClick: t,
                            className: `h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded-md transition-colors`,
                            children: l,
                          }),
                          (0, s.jsx)(`button`, {
                            onClick: () => {
                              ;(n(), t())
                            },
                            className: `h-8 px-4 text-sm font-medium rounded-md transition-colors ${u === `danger` ? `bg-error text-text-inverse hover:bg-error/90` : `bg-accent text-accent-fg hover:bg-accent-hover`}`,
                            children: c,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              document.body
            )
          : null
      )))
  })
export { l as n, c as t }
