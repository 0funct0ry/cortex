import { n as e } from './chunk-DnJy8xQt.js'
import { E as t, gt as n, t as r, w as i } from './iframe-CECvvSLk.js'
import { D as a, O as o, h as s, i as c } from './Icons-DjzhDYF3.js'
var l,
  u,
  d = e(() => {
    ;(n(),
      o(),
      i(),
      (l = r()),
      (u = ({ id: e, type: n, message: r }) => {
        let { removeToast: i } = t(),
          o = {
            success: {
              border: `border-l-[3px] border-l-success`,
              icon: (0, l.jsx)(c, { className: `text-success` }),
            },
            error: {
              border: `border-l-[3px] border-l-error`,
              icon: (0, l.jsx)(a, { className: `text-error` }),
            },
            info: {
              border: `border-l-[3px] border-l-info`,
              icon: (0, l.jsx)(s, { className: `text-info` }),
            },
          }[n]
        return (0, l.jsxs)(`div`, {
          className: `flex items-center gap-3 px-3 py-2.5 min-w-[300px] max-w-[450px] bg-bg-overlay ${o.border} rounded-sm shadow-lg animate-slide-in`,
          children: [
            (0, l.jsx)(`div`, { className: `flex-shrink-0`, children: o.icon }),
            (0, l.jsx)(`div`, { className: `flex-grow text-sm text-text-primary`, children: r }),
            (0, l.jsx)(`button`, {
              onClick: () => i(e),
              className: `flex-shrink-0 p-1 rounded-md hover:bg-bg-highlight text-text-muted hover:text-text-primary transition-colors`,
              children: (0, l.jsx)(a, { size: 14 }),
            }),
          ],
        })
      }),
      (u.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `Toast`,
        props: {
          id: { required: !0, tsType: { name: `string` }, description: `` },
          type: {
            required: !0,
            tsType: {
              name: `union`,
              raw: `'success' | 'error' | 'info'`,
              elements: [
                { name: `literal`, value: `'success'` },
                { name: `literal`, value: `'error'` },
                { name: `literal`, value: `'info'` },
              ],
            },
            description: ``,
          },
          message: { required: !0, tsType: { name: `string` }, description: `` },
        },
      }))
  })
export { d as n, u as t }
