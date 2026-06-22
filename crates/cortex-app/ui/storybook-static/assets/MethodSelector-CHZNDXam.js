import { a as e, n as t } from './chunk-DnJy8xQt.js'
import { gt as n, t as r } from './iframe-CECvvSLk.js'
import { O as i, a } from './Icons-DjzhDYF3.js'
import { n as o, t as s } from './Tooltip-D06fzBd3.js'
var c,
  l,
  u,
  d,
  f,
  p,
  m = t(() => {
    ;((c = e(n(), 1)),
      i(),
      o(),
      (l = r()),
      (u = [
        { label: `GET`, section: `HTTP` },
        { label: `POST`, section: `HTTP` },
        { label: `PUT`, section: `HTTP` },
        { label: `PATCH`, section: `HTTP` },
        { label: `DELETE`, section: `HTTP` },
        { label: `HEAD`, section: `HTTP` },
        { label: `OPTIONS`, section: `HTTP` },
        { label: `TRACE`, section: `HTTP` },
        { label: `GraphQL`, section: `Protocol` },
        { label: `gRPC`, section: `Protocol` },
        { label: `WS`, section: `Protocol` },
        { label: `SSE`, section: `Protocol` },
      ]),
      (d = (e) => {
        let t = e.toUpperCase()
        return t === `GET`
          ? `text-method-get`
          : t === `POST`
            ? `text-method-post`
            : t === `PUT`
              ? `text-method-put`
              : t === `PATCH`
                ? `text-method-patch`
                : t === `DELETE`
                  ? `text-method-delete`
                  : t === `HEAD`
                    ? `text-method-head`
                    : t === `OPTIONS`
                      ? `text-method-options`
                      : t === `TRACE`
                        ? `text-method-trace`
                        : t === `GRAPHQL`
                          ? `text-method-graphql`
                          : t === `GRPC`
                            ? `text-method-grpc`
                            : t === `WS`
                              ? `text-method-ws`
                              : t === `SSE`
                                ? `text-method-sse`
                                : `text-text-secondary`
      }),
      (f = (e) => {
        let t = e.toUpperCase()
        return t === `GET`
          ? `bg-method-get/10 border-method-get/30`
          : t === `POST`
            ? `bg-method-post/10 border-method-post/30`
            : t === `PUT`
              ? `bg-method-put/10 border-method-put/30`
              : t === `PATCH`
                ? `bg-method-patch/10 border-method-patch/30`
                : t === `DELETE`
                  ? `bg-method-delete/10 border-method-delete/30`
                  : t === `HEAD`
                    ? `bg-method-head/10 border-method-head/30`
                    : t === `OPTIONS`
                      ? `bg-method-options/10 border-method-options/30`
                      : t === `TRACE`
                        ? `bg-method-trace/10 border-method-trace/30`
                        : t === `GRAPHQL`
                          ? `bg-method-graphql/10 border-method-graphql/30`
                          : t === `GRPC`
                            ? `bg-method-grpc/10 border-method-grpc/30`
                            : t === `WS`
                              ? `bg-method-ws/10 border-method-ws/30`
                              : t === `SSE`
                                ? `bg-method-sse/10 border-method-sse/30`
                                : `bg-bg-muted/50 border-border-subtle`
      }),
      (p = ({ method: e, onChange: t }) => {
        let [n, r] = (0, c.useState)(!1),
          [i, o] = (0, c.useState)(``),
          p = (0, c.useRef)(null)
        ;(0, c.useEffect)(() => {
          let e = (e) => {
            p.current && !p.current.contains(e.target) && r(!1)
          }
          return (
            document.addEventListener(`mousedown`, e),
            () => document.removeEventListener(`mousedown`, e)
          )
        }, [])
        let m = () => {
            let t = !n
            ;(r(t), t && (u.some((t) => t.label.toUpperCase() === e.toUpperCase()) ? o(``) : o(e)))
          },
          h = (e) => {
            ;(t(e), r(!1))
          },
          g = {
            HTTP: u.filter((e) => e.section === `HTTP`),
            Protocol: u.filter((e) => e.section === `Protocol`),
          }
        return (0, l.jsxs)(`div`, {
          className: `relative`,
          ref: p,
          children: [
            (0, l.jsx)(s, {
              content: `Change HTTP method or protocol`,
              align: `start`,
              children: (0, l.jsxs)(`button`, {
                onClick: m,
                className: `w-[72px] h-[30px] rounded-md border flex items-center justify-between px-2 transition-colors ${f(e)} ${d(e)} text-[12px] font-bold`,
                children: [
                  (0, l.jsx)(`span`, { className: `truncate uppercase`, children: e }),
                  (0, l.jsx)(a, { size: 10, className: `text-text-muted shrink-0 ml-1` }),
                ],
              }),
            }),
            n &&
              (0, l.jsxs)(`div`, {
                className: `absolute top-full left-0 mt-1 w-48 bg-bg-overlay border border-border-subtle rounded-md shadow-lg py-1 z-50`,
                children: [
                  (0, l.jsx)(`div`, {
                    className: `px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider`,
                    children: `HTTP Methods`,
                  }),
                  g.HTTP.map((e) =>
                    (0, l.jsx)(
                      `button`,
                      {
                        onClick: () => h(e.label),
                        className: `w-full text-left px-3 py-1.5 text-sm hover:bg-bg-highlight flex items-center transition-colors ${d(e.label)}`,
                        children: e.label,
                      },
                      e.label
                    )
                  ),
                  (0, l.jsx)(`div`, { className: `h-[1px] bg-border-subtle my-1` }),
                  (0, l.jsx)(`div`, {
                    className: `px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider`,
                    children: `Protocols`,
                  }),
                  g.Protocol.map((e) =>
                    (0, l.jsx)(
                      `button`,
                      {
                        onClick: () => h(e.label),
                        className: `w-full text-left px-3 py-1.5 text-sm hover:bg-bg-highlight flex items-center transition-colors ${d(e.label)}`,
                        children: e.label,
                      },
                      e.label
                    )
                  ),
                  (0, l.jsx)(`div`, { className: `h-[1px] bg-border-subtle my-1` }),
                  (0, l.jsx)(`div`, {
                    className: `px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider`,
                    children: `Custom Method`,
                  }),
                  (0, l.jsxs)(`div`, {
                    className: `px-3 py-1.5 flex gap-1 items-center`,
                    onClick: (e) => e.stopPropagation(),
                    children: [
                      (0, l.jsx)(`input`, {
                        type: `text`,
                        placeholder: `e.g. PURGE`,
                        className: `w-full h-7 bg-bg-surface border border-border-default rounded px-2 text-xs font-mono uppercase focus:outline-none focus:border-border-strong text-text-primary`,
                        value: i,
                        onChange: (e) => o(e.target.value.toUpperCase()),
                        onKeyDown: (e) => {
                          if (e.key === `Enter`) {
                            e.preventDefault()
                            let t = i.trim()
                            t && h(t)
                          }
                        },
                      }),
                      (0, l.jsx)(`button`, {
                        onClick: () => {
                          let e = i.trim()
                          e && h(e)
                        },
                        className: `px-2 h-7 bg-bg-muted hover:bg-bg-highlight border border-border-default text-xs font-semibold rounded text-text-primary transition-colors shrink-0`,
                        children: `Apply`,
                      }),
                    ],
                  }),
                ],
              }),
          ],
        })
      }),
      (p.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `MethodSelector`,
        props: {
          method: { required: !0, tsType: { name: `string` }, description: `` },
          onChange: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(method: string) => void`,
              signature: {
                arguments: [{ type: { name: `string` }, name: `method` }],
                return: { name: `void` },
              },
            },
            description: ``,
          },
        },
      }))
  })
export { m as n, p as t }
