import { n as e } from './chunk-DnJy8xQt.js'
import { gt as t, t as n } from './iframe-CECvvSLk.js'
var r,
  i,
  a = e(() => {
    ;(t(),
      (r = n()),
      (i = ({ method: e, className: t = `` }) => {
        let n = e.toLowerCase()
        return (0, r.jsx)(`div`, {
          className: `w-9 h-[18px] flex items-center justify-center rounded-sm text-[10px] font-bold uppercase select-none ${((
            e
          ) => {
            switch (e) {
              case `get`:
                return `text-method-get bg-method-get/15`
              case `post`:
                return `text-method-post bg-method-post/15`
              case `put`:
                return `text-method-put bg-method-put/15`
              case `patch`:
                return `text-method-patch bg-method-patch/15`
              case `delete`:
                return `text-method-delete bg-method-delete/15`
              case `head`:
                return `text-method-head bg-method-head/15`
              case `options`:
                return `text-method-options bg-method-options/15`
              case `ws`:
                return `text-method-ws bg-method-ws/15`
              case `sse`:
                return `text-method-sse bg-method-sse/15`
              case `grpc`:
                return `text-method-grpc bg-method-grpc/15`
              case `graphql`:
                return `text-method-graphql bg-method-graphql/15`
              case `trace`:
                return `text-method-trace bg-method-trace/15`
              default:
                return `text-text-secondary bg-bg-muted/30 border border-border-subtle/30`
            }
          })(n)} ${t}`,
          children: e,
        })
      }),
      (i.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `MethodBadge`,
        props: {
          method: { required: !0, tsType: { name: `string` }, description: `` },
          className: {
            required: !1,
            tsType: { name: `string` },
            description: ``,
            defaultValue: { value: `''`, computed: !1 },
          },
        },
      }))
  })
export { a as n, i as t }
