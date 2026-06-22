import { a as e, n as t } from './chunk-DnJy8xQt.js'
import { gt as n, t as r } from './iframe-CECvvSLk.js'
var i,
  a,
  o,
  s = t(() => {
    ;((i = e(n(), 1)),
      (a = r()),
      (o = ({ initialValue: e, onConfirm: t, onCancel: n, className: r = `` }) => {
        let o = (0, i.useRef)(null)
        return (
          (0, i.useEffect)(() => {
            o.current && (o.current.focus(), o.current.select())
          }, []),
          (0, a.jsx)(`input`, {
            ref: o,
            defaultValue: e,
            onKeyDown: (r) => {
              r.key === `Enter` ? t(o.current?.value || e) : r.key === `Escape` && n()
            },
            onBlur: () => {
              t(o.current?.value || e)
            },
            autoComplete: `off`,
            autoCorrect: `off`,
            autoCapitalize: `off`,
            spellCheck: !1,
            className: `bg-bg-surface border border-accent rounded px-1 outline-none text-sm w-full h-[22px] ${r}`,
            onClick: (e) => e.stopPropagation(),
          })
        )
      }),
      (o.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `InlineInput`,
        props: {
          initialValue: { required: !0, tsType: { name: `string` }, description: `` },
          onConfirm: {
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
          onCancel: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `() => void`,
              signature: { arguments: [], return: { name: `void` } },
            },
            description: ``,
          },
          className: {
            required: !1,
            tsType: { name: `string` },
            description: ``,
            defaultValue: { value: `''`, computed: !1 },
          },
        },
      }))
  })
export { s as n, o as t }
