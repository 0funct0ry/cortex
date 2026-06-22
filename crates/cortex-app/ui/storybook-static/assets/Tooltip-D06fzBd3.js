import { a as e, n as t } from './chunk-DnJy8xQt.js'
import { gt as n, t as r } from './iframe-CECvvSLk.js'
var i,
  a,
  o,
  s = t(() => {
    ;((i = e(n(), 1)),
      (a = r()),
      (o = ({
        content: e,
        children: t,
        delay: n = 300,
        position: r = `bottom`,
        align: o = `center`,
      }) => {
        let [s, c] = (0, i.useState)(!1),
          l = (0, i.useRef)(null),
          u = (0, i.useRef)(null)
        return (
          (0, i.useEffect)(
            () => () => {
              l.current && window.clearTimeout(l.current)
            },
            []
          ),
          (0, a.jsxs)(`div`, {
            ref: u,
            className: `relative flex items-center justify-center`,
            onMouseEnter: () => {
              l.current = window.setTimeout(() => {
                c(!0)
              }, n)
            },
            onMouseLeave: () => {
              ;(l.current && window.clearTimeout(l.current), c(!1))
            },
            children: [
              t,
              s &&
                (0, a.jsx)(`div`, {
                  className: `absolute z-[100] px-1.5 py-0.5 bg-bg-overlay border border-border-subtle rounded-sm shadow-md whitespace-nowrap pointer-events-none transition-opacity duration-150 ${(() => {
                    switch (r) {
                      case `top`:
                        return o === `start`
                          ? `bottom-full left-0 mb-1.5`
                          : o === `end`
                            ? `bottom-full right-0 mb-1.5`
                            : `bottom-full left-1/2 -translate-x-1/2 mb-1.5`
                      case `bottom`:
                        return o === `start`
                          ? `top-full left-0 mt-1.5`
                          : o === `end`
                            ? `top-full right-0 mt-1.5`
                            : `top-full left-1/2 -translate-x-1/2 mt-1.5`
                      case `left`:
                        return `right-full top-1/2 -translate-y-1/2 mr-1.5`
                      case `right`:
                        return `left-full top-1/2 -translate-y-1/2 ml-1.5`
                      default:
                        return o === `start`
                          ? `top-full left-0 mt-1.5`
                          : o === `end`
                            ? `top-full right-0 mt-1.5`
                            : `top-full left-1/2 -translate-x-1/2 mt-1.5`
                    }
                  })()}`,
                  children: (0, a.jsx)(`span`, {
                    className: `text-[10px] text-text-primary font-medium`,
                    children: e,
                  }),
                }),
            ],
          })
        )
      }),
      (o.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `Tooltip`,
        props: {
          content: { required: !0, tsType: { name: `string` }, description: `` },
          children: {
            required: !0,
            tsType: { name: `ReactReactNode`, raw: `React.ReactNode` },
            description: ``,
          },
          delay: {
            required: !1,
            tsType: { name: `number` },
            description: ``,
            defaultValue: { value: `300`, computed: !1 },
          },
          position: {
            required: !1,
            tsType: {
              name: `union`,
              raw: `'top' | 'bottom' | 'left' | 'right'`,
              elements: [
                { name: `literal`, value: `'top'` },
                { name: `literal`, value: `'bottom'` },
                { name: `literal`, value: `'left'` },
                { name: `literal`, value: `'right'` },
              ],
            },
            description: ``,
            defaultValue: { value: `'bottom'`, computed: !1 },
          },
          align: {
            required: !1,
            tsType: {
              name: `union`,
              raw: `'start' | 'end' | 'center'`,
              elements: [
                { name: `literal`, value: `'start'` },
                { name: `literal`, value: `'end'` },
                { name: `literal`, value: `'center'` },
              ],
            },
            description: ``,
            defaultValue: { value: `'center'`, computed: !1 },
          },
        },
      }))
  })
export { s as n, o as t }
