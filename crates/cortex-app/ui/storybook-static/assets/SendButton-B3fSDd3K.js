import { n as e } from './chunk-DnJy8xQt.js'
import { gt as t, t as n } from './iframe-CECvvSLk.js'
import { D as r, O as i } from './Icons-DjzhDYF3.js'
import { n as a, t as o } from './Tooltip-D06fzBd3.js'
var s,
  c,
  l = e(() => {
    ;(t(),
      i(),
      a(),
      (s = n()),
      (c = ({ inFlight: e, onSend: t, onCancel: n, disabled: i = !1, disabledReason: a = `` }) => {
        let c = navigator.platform.toUpperCase().indexOf(`MAC`) >= 0 ? `⌘ + Enter` : `Ctrl + Enter`
        return e
          ? (0, s.jsx)(o, {
              content: `Cancel Request`,
              position: `bottom`,
              align: `end`,
              children: (0, s.jsxs)(`button`, {
                onClick: n,
                className: `h-8 px-4 rounded-md bg-error text-white font-semibold text-sm hover:bg-error/90 transition-colors flex items-center gap-2`,
                children: [(0, s.jsx)(r, { size: 14 }), `Cancel`],
              }),
            })
          : (0, s.jsx)(o, {
              content: i && a ? a : `Send Request (${c})`,
              position: `bottom`,
              align: `end`,
              children: (0, s.jsx)(`button`, {
                onClick: i ? void 0 : t,
                disabled: i,
                className: `h-8 px-5 rounded-md bg-accent text-accent-fg font-semibold text-sm transition-colors shadow-sm select-none ${i ? `opacity-40 cursor-not-allowed` : `hover:bg-accent-hover`}`,
                children: `Send`,
              }),
            })
      }),
      (c.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `SendButton`,
        props: {
          inFlight: { required: !0, tsType: { name: `boolean` }, description: `` },
          onSend: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `() => void`,
              signature: { arguments: [], return: { name: `void` } },
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
          disabled: {
            required: !1,
            tsType: { name: `boolean` },
            description: ``,
            defaultValue: { value: `false`, computed: !1 },
          },
          disabledReason: {
            required: !1,
            tsType: { name: `string` },
            description: ``,
            defaultValue: { value: `''`, computed: !1 },
          },
        },
      }))
  })
export { l as n, c as t }
