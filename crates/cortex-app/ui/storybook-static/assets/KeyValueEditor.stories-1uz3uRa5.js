import { a as e, n as t, r as n } from './chunk-DnJy8xQt.js'
import { gt as r, t as i } from './iframe-CECvvSLk.js'
import { D as a, O as o, b as s, h as c, w as l } from './Icons-DjzhDYF3.js'
import { n as u, r as d, t as f } from './TabsContext-DSn62RXv.js'
import { n as p, t as m } from './VariableInput-BL1aVURF.js'
var h,
  g,
  _,
  v,
  y,
  b = t(() => {
    ;((h = e(r(), 1)),
      o(),
      u(),
      p(),
      (g = i()),
      (_ = {
        'Content-Type': [
          `application/json`,
          `application/x-www-form-urlencoded`,
          `multipart/form-data`,
          `text/plain`,
          `text/html`,
          `text/xml`,
          `application/xml`,
          `application/octet-stream`,
          `application/graphql`,
        ],
        'Content-Encoding': [`gzip`, `deflate`, `br`, `identity`, `zstd`],
        'Content-Language': [`en`, `en-US`, `fr`, `de`, `es`, `zh`, `ja`, `ar`],
        'Content-Disposition': [`inline`, `attachment`, `attachment; filename="file.txt"`],
        Accept: [
          `*/*`,
          `application/json`,
          `text/html`,
          `text/plain`,
          `application/xml`,
          `text/xml`,
          `application/pdf`,
          `image/*`,
          `application/octet-stream`,
        ],
        'Accept-Encoding': [`gzip`, `deflate`, `br`, `identity`, `gzip, deflate, br`, `*`],
        'Accept-Language': [`en-US,en;q=0.9`, `fr-FR,fr;q=0.9`, `*`, `en`, `de`, `zh-CN`],
        'Accept-Charset': [`utf-8`, `iso-8859-1`, `utf-8, iso-8859-1;q=0.5`, `*`],
        Authorization: [`Bearer `, `Basic `, `Digest `, `AWS4-HMAC-SHA256 `, `Token `, `ApiKey `],
        'Proxy-Authorization': [`Bearer `, `Basic `],
        'WWW-Authenticate': [`Bearer`, `Basic realm="example"`, `Digest realm="example"`],
        'Cache-Control': [
          `no-cache`,
          `no-store`,
          `max-age=0`,
          `max-age=3600`,
          `must-revalidate`,
          `public`,
          `private`,
          `no-transform`,
          `only-if-cached`,
        ],
        Pragma: [`no-cache`],
        Connection: [`keep-alive`, `close`, `upgrade`],
        'Keep-Alive': [`timeout=5`, `timeout=5, max=1000`],
        'Transfer-Encoding': [`chunked`, `compress`, `deflate`, `gzip`, `identity`],
        Upgrade: [`websocket`, `h2c`, `HTTP/2.0`],
        TE: [`trailers`, `deflate`, `gzip`],
        Origin: [],
        'Access-Control-Request-Method': [
          `GET`,
          `POST`,
          `PUT`,
          `DELETE`,
          `PATCH`,
          `OPTIONS`,
          `HEAD`,
        ],
        'Access-Control-Request-Headers': [
          `Content-Type`,
          `Authorization`,
          `X-Requested-With`,
          `Accept`,
        ],
        Cookie: [],
        'Set-Cookie': [
          `Path=/`,
          `HttpOnly`,
          `Secure`,
          `SameSite=Strict`,
          `SameSite=Lax`,
          `SameSite=None; Secure`,
          `Max-Age=3600`,
          `Domain=example.com`,
        ],
        Host: [],
        Forwarded: [`for=192.0.2.60`, `for=192.0.2.60;proto=http;by=203.0.113.43`],
        'X-Forwarded-For': [],
        'X-Forwarded-Host': [],
        'X-Forwarded-Proto': [`http`, `https`],
        Via: [],
        'Idempotency-Key': [],
        'X-Request-ID': [],
        'X-Correlation-ID': [],
        'X-Trace-ID': [],
        'X-B3-TraceId': [],
        'X-B3-SpanId': [],
        'X-B3-Sampled': [`0`, `1`],
        'X-RateLimit-Limit': [],
        'Retry-After': [],
        'X-Hub-Signature': [],
        'X-Hub-Signature-256': [],
        'X-GitHub-Event': [`push`, `pull_request`, `issues`, `release`, `ping`, `workflow_run`],
        'X-Stripe-Signature': [],
        'Webhook-ID': [],
        'Webhook-Timestamp': [],
        'Webhook-Signature': [],
        'User-Agent': [],
        Referer: [],
        From: [],
        Expires: [],
        'Last-Modified': [],
        Vary: [`Accept`, `Accept-Encoding`, `Accept-Language`, `Origin`, `*`],
        'Strict-Transport-Security': [
          `max-age=31536000`,
          `max-age=31536000; includeSubDomains`,
          `max-age=31536000; includeSubDomains; preload`,
        ],
        'Content-Security-Policy': [
          `default-src 'self'`,
          `default-src 'self'; script-src 'nonce-…'`,
        ],
        'X-Content-Type-Options': [`nosniff`],
        'X-Frame-Options': [`DENY`, `SAMEORIGIN`, `ALLOW-FROM https://example.com`],
        'X-XSS-Protection': [`0`, `1`, `1; mode=block`],
        'Referrer-Policy': [
          `no-referrer`,
          `no-referrer-when-downgrade`,
          `origin`,
          `origin-when-cross-origin`,
          `same-origin`,
          `strict-origin`,
          `strict-origin-when-cross-origin`,
          `unsafe-url`,
        ],
        'Permissions-Policy': [`geolocation=()`, `camera=()`, `microphone=()`],
        'Cross-Origin-Opener-Policy': [`unsafe-none`, `same-origin-allow-popups`, `same-origin`],
        'Cross-Origin-Resource-Policy': [`same-site`, `same-origin`, `cross-origin`],
        'Cross-Origin-Embedder-Policy': [`unsafe-none`, `require-corp`],
        'Access-Control-Allow-Origin': [`*`, `https://example.com`],
        'Access-Control-Allow-Methods': [`GET, POST, PUT, DELETE, PATCH, OPTIONS`],
        'Access-Control-Allow-Headers': [`Content-Type, Authorization, X-Requested-With`],
        'Access-Control-Expose-Headers': [`Content-Length, X-Request-ID`],
        'Access-Control-Max-Age': [`86400`, `3600`],
        'Access-Control-Allow-Credentials': [`true`],
        'X-RateLimit-Remaining': [],
        'X-RateLimit-Reset': [],
      }),
      (v = Object.keys(_)),
      (y = ({
        entries: e,
        onChange: t,
        namePlaceholder: n = `Key`,
        valuePlaceholder: r = `Value`,
        title: i = ``,
        addButtonLabel: o = `Add parameter`,
        readOnlyEntries: u,
        readOnlyTitle: f,
        readOnlyTooltip: p,
        isHeaders: y = !1,
        caseSensitiveKeys: b = !1,
        presets: x,
        onApplyPreset: S,
      }) => {
        let [C, w] = (0, h.useState)(!1),
          T = (0, h.useRef)(null)
        ;(0, h.useEffect)(() => {
          let e = (e) => {
            T.current && !T.current.contains(e.target) && w(!1)
          }
          return (
            C && document.addEventListener(`mousedown`, e),
            () => document.removeEventListener(`mousedown`, e)
          )
        }, [C])
        let { activeTab: E } = d(),
          D = E?.collectionId || null,
          O = (0, h.useMemo)(() => (e.length > 0 ? e : [{ key: ``, value: ``, enabled: !0 }]), [e]),
          [k, A] = (0, h.useState)(!1),
          [j, M] = (0, h.useState)(``),
          [N, P] = (0, h.useState)([]),
          [F, I] = (0, h.useState)([]),
          [L, R] = (0, h.useState)(null),
          [z, B] = (0, h.useState)(null),
          [V, H] = (0, h.useState)({
            visible: !1,
            rowIndex: -1,
            field: `key`,
            suggestions: [],
            activeIndex: 0,
            rect: null,
          }),
          [U, W] = (0, h.useState)({
            visible: !1,
            suggestions: [],
            activeIndex: 0,
            lineIndex: -1,
            startPos: -1,
            query: ``,
          }),
          G = (0, h.useRef)([]),
          K = (0, h.useRef)(``),
          q = (e, t) => {
            setTimeout(() => {
              let n = `input[data-row="${e}"][data-field="${t}"]`,
                r = document.querySelector(n)
              r && (r.focus(), r.select())
            }, 50)
          },
          ee = (0, h.useCallback)(() => {
            if (F.length === 0) return
            let e = [...F].sort((e, t) => e - t),
              n = e.map((e) => O[e])
            G.current.push({ entries: n, indices: e })
            let r = O.filter((e, t) => !F.includes(t))
            ;(r.length === 0 && (r = [{ key: ``, value: ``, enabled: !0 }]), t(r), I([]))
          }, [F, O, t]),
          J = (0, h.useCallback)(() => {
            let e = G.current.pop()
            if (!e) return
            let n = [...O]
            ;(e.indices.forEach((t, r) => {
              ;(n.length === 1 && n[0].key === `` && n[0].value === `` && n.splice(0, 1),
                n.splice(t, 0, e.entries[r]))
            }),
              t(n))
          }, [O, t])
        ;(0, h.useEffect)(() => {
          let e = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === `z`) {
              let t = document.activeElement
              ;((t?.tagName === `INPUT` && t.hasAttribute(`data-field`)) ||
                !t ||
                t.tagName === `BODY`) &&
                (e.preventDefault(), J())
            }
          }
          return (
            window.addEventListener(`keydown`, e),
            () => window.removeEventListener(`keydown`, e)
          )
        }, [J])
        let Y = () => {
            if (!D) return []
            let e = localStorage.getItem(`cortex.custom-headers.${D}`)
            return e ? JSON.parse(e) : []
          },
          te = (e) => {
            if (!D || !e.trim() || v.some((t) => t.toLowerCase() === e.toLowerCase())) return
            let t = Y()
            if (!t.some((t) => t.toLowerCase() === e.toLowerCase())) {
              let n = [...t, e]
              localStorage.setItem(`cortex.custom-headers.${D}`, JSON.stringify(n))
            }
          },
          X = (e, n) => {
            let r = [...O]
            ;((r[e] = { ...r[e], ...n }), t(r))
          },
          Z = O.length > 0 && O.every((e) => e.enabled),
          ne = () => {
            let e = !Z
            t(O.map((t) => ({ ...t, enabled: e })))
          },
          re = (e, t) => {
            ;(R(t),
              (e.dataTransfer.effectAllowed = `move`),
              e.dataTransfer.setData(`text/plain`, t.toString()))
            let n = e.target.closest(`tr`)
            n && e.dataTransfer.setDragImage(n, 10, 14)
          },
          ie = (e, t) => {
            ;(e.preventDefault(), L !== t && B(t))
          },
          ae = (e, n) => {
            if ((e.preventDefault(), L === null || L === n)) return
            let r = [...O],
              [i] = r.splice(L, 1)
            ;(r.splice(n, 0, i), t(r))
          },
          oe = () => {
            ;(R(null), B(null))
          },
          se = (e) => {
            let n = O[e]
            G.current.push({ entries: [n], indices: [e] })
            let r = O.filter((t, n) => n !== e)
            ;(r.length === 0 && (r = [{ key: ``, value: ``, enabled: !0 }]), t(r), I([]))
          },
          ce = (e, t) => {
            if (!(e.target instanceof HTMLInputElement))
              if (e.metaKey || e.ctrlKey)
                I((e) => (e.includes(t) ? e.filter((e) => e !== t) : [...e, t]))
              else if (e.shiftKey && F.length > 0) {
                let e = F[F.length - 1],
                  n = Math.min(e, t),
                  r = Math.max(e, t),
                  i = []
                for (let e = n; e <= r; e++) i.push(e)
                I(i)
              } else I([t])
          }
        ;(0, h.useEffect)(() => {
          let e = (e) => {
            if (e.key === `Delete` || e.key === `Backspace`) {
              let t = document.activeElement
              !(t?.tagName === `INPUT` || t?.tagName === `TEXTAREA`) &&
                F.length > 0 &&
                (e.preventDefault(), ee())
            }
          }
          return (
            window.addEventListener(`keydown`, e),
            () => window.removeEventListener(`keydown`, e)
          )
        }, [F, ee])
        let le = () => {
            let e = [...O, { key: ``, value: ``, enabled: !0 }]
            ;(t(e), q(e.length - 1, `key`))
          },
          Q = (e, t, n, r) => {
            if (((K.current = n), O[e].enabled && y)) {
              let i = r.currentTarget.getBoundingClientRect()
              if (t === `key`) {
                let t = n.trim().toLowerCase(),
                  r = Y(),
                  a = [...v, ...r],
                  o = t ? a.filter((e) => e.toLowerCase().startsWith(t)) : []
                H({
                  visible: o.length > 0,
                  rowIndex: e,
                  field: `key`,
                  suggestions: o,
                  activeIndex: 0,
                  rect: i,
                })
              } else {
                let t = _[O[e].key] || [],
                  r = n.trim().toLowerCase(),
                  a = r ? t.filter((e) => e.toLowerCase().startsWith(r)) : t
                H({
                  visible: a.length > 0,
                  rowIndex: e,
                  field: `value`,
                  suggestions: a,
                  activeIndex: 0,
                  rect: i,
                })
              }
            }
          },
          ue = () => {
            setTimeout(() => {
              H((e) => ({ ...e, visible: !1 }))
            }, 150)
          },
          de = (e, n, r) => {
            if (V.visible) {
              if (e.key === `ArrowDown`) {
                ;(e.preventDefault(),
                  H((e) => ({ ...e, activeIndex: (e.activeIndex + 1) % e.suggestions.length })))
                return
              }
              if (e.key === `ArrowUp`) {
                ;(e.preventDefault(),
                  H((e) => ({
                    ...e,
                    activeIndex: (e.activeIndex - 1 + e.suggestions.length) % e.suggestions.length,
                  })))
                return
              }
              if (e.key === `Enter` || e.key === `Tab`) {
                e.preventDefault()
                let t = V.suggestions[V.activeIndex]
                fe(n, r, t)
                return
              }
              if (e.key === `Escape`) {
                ;(e.preventDefault(), H((e) => ({ ...e, visible: !1 })))
                return
              }
            }
            if (e.key === `Escape`) {
              e.preventDefault()
              let i = [...O]
              ;((i[n] = { ...i[n], [r]: K.current }), t(i), e.currentTarget.blur())
              return
            }
            if (e.key === `Enter`) {
              e.preventDefault()
              let r = [...O]
              ;(r.splice(n + 1, 0, { key: ``, value: ``, enabled: !0 }), t(r), q(n + 1, `key`))
              return
            }
            if (e.key === `Tab` && !e.shiftKey && r === `value` && n === O.length - 1) {
              let r = O[n]
              if (r.key.trim() !== `` || r.value.trim() !== ``) {
                e.preventDefault()
                let n = [...O, { key: ``, value: ``, enabled: !0 }]
                ;(t(n), q(n.length - 1, `key`))
              }
            }
          },
          fe = (e, n, r) => {
            let i = [...O]
            ;((i[e] = { ...i[e], [n]: r }),
              t(i),
              H((e) => ({ ...e, visible: !1 })),
              n === `key` && (te(r), _[r] && _[r].length > 0 && q(e, `value`)))
          },
          pe = (e, t) => {
            let n = document.getElementById(`kv-${t}-${e}`)
            return n ? n.getBoundingClientRect() : new DOMRect()
          },
          me = (e, t) => {
            if ((X(e, { key: t }), y && O[e].enabled)) {
              let n = t.trim().toLowerCase(),
                r = Y(),
                i = [...v, ...r],
                a = n ? i.filter((e) => e.toLowerCase().startsWith(n)) : []
              H({
                visible: a.length > 0,
                rowIndex: e,
                field: `key`,
                suggestions: a,
                activeIndex: 0,
                rect: pe(e, `key`),
              })
            }
          },
          he = (e, t) => {
            if ((X(e, { value: t, is_valueless: !1 }), y && O[e].enabled)) {
              let n = _[O[e].key] || [],
                r = t.trim().toLowerCase(),
                i = r ? n.filter((e) => e.toLowerCase().startsWith(r)) : n
              H({
                visible: i.length > 0,
                rowIndex: e,
                field: `value`,
                suggestions: i,
                activeIndex: 0,
                rect: pe(e, `value`),
              })
            }
          },
          ge = O.map((e) => (b ? e.key : e.key.toLowerCase())),
          _e = (e) => {
            if (!e.trim()) return !1
            let t = b ? e : e.toLowerCase()
            return ge.filter((e) => e === t).length > 1
          },
          $ = (0, h.useCallback)((e) => {
            let t = e.split(`
`),
              n = [],
              r = []
            return (
              t.forEach((e, t) => {
                if (!e.trim()) return
                let i = !0,
                  a = e.trim()
                a.startsWith(`#`) && ((i = !1), (a = a.slice(1).trim()))
                let o = a.indexOf(`:`)
                if (o === -1)
                  (r.push(`Line ${t + 1}: Missing ":" separator`),
                    n.push({ key: a.trim(), value: ``, enabled: i }))
                else {
                  let e = a.slice(0, o).trim(),
                    t = a.slice(o + 1),
                    r = t.startsWith(` `) ? t.slice(1) : t
                  n.push({ key: e, value: r, enabled: i })
                }
              }),
              { parsedItems: n, errors: r }
            )
          }, []),
          ve = () => {
            if (!k)
              (M(
                O.map((e) =>
                  e.key.trim() === `` && e.value.trim() === ``
                    ? ``
                    : `${e.enabled ? `` : `# `}${e.key}: ${e.value}`
                ).filter((e) => e !== ``).join(`
`)
              ),
                P([]),
                A(!0))
            else {
              let { parsedItems: e } = $(j),
                n = e
              ;(n.length === 0 && (n = [{ key: ``, value: ``, enabled: !0 }]), t(n), A(!1), P([]))
            }
          },
          ye = (e) => {
            if (U.visible) {
              if (e.key === `ArrowDown`) {
                ;(e.preventDefault(),
                  W((e) => ({ ...e, activeIndex: (e.activeIndex + 1) % e.suggestions.length })))
                return
              }
              if (e.key === `ArrowUp`) {
                ;(e.preventDefault(),
                  W((e) => ({
                    ...e,
                    activeIndex: (e.activeIndex - 1 + e.suggestions.length) % e.suggestions.length,
                  })))
                return
              }
              if (e.key === `Enter` || e.key === `Tab`) {
                ;(e.preventDefault(), xe(U.suggestions[U.activeIndex]))
                return
              }
              if (e.key === `Escape` || e.key === ` ` || e.key === `:`) {
                W((e) => ({ ...e, visible: !1 }))
                return
              }
            }
          },
          be = (e) => {
            let n = e.target.value
            M(n)
            let { parsedItems: r, errors: i } = $(n)
            P(i)
            let a = r
            if ((a.length === 0 && (a = [{ key: ``, value: ``, enabled: !0 }]), t(a), !y)) return
            let o = e.target.selectionStart,
              s = n.substring(0, o),
              c = s.split(`
`),
              l = c.length - 1,
              u = c[l],
              d = u.indexOf(`:`)
            if (
              d === -1 ||
              o <=
                s.lastIndexOf(`
`) +
                  1 +
                  d
            ) {
              let e = u.replace(/^#\s*/, ``).trim()
              if (e.length > 0) {
                let t = Y(),
                  n = [...v, ...t].filter((t) => t.toLowerCase().startsWith(e.toLowerCase()))
                if (n.length > 0) {
                  W({
                    visible: !0,
                    suggestions: n,
                    activeIndex: 0,
                    lineIndex: l,
                    startPos:
                      s.lastIndexOf(`
`) +
                      1 +
                      (u.startsWith(`#`) ? u.indexOf(`#`) + 1 : 0),
                    query: e,
                  })
                  return
                }
              }
            }
            W((e) => ({ ...e, visible: !1 }))
          },
          xe = (e) => {
            let n = j.split(`
`),
              r = n[U.lineIndex].startsWith(`#`) ? `# ` : ``
            n[U.lineIndex] = `${r}${e}: `
            let i = n.join(`
`)
            ;(M(i), W((e) => ({ ...e, visible: !1 })))
            let { parsedItems: a } = $(i),
              o = a
            ;(o.length === 0 && (o = [{ key: ``, value: ``, enabled: !0 }]), t(o))
          }
        return k
          ? (0, g.jsxs)(`div`, {
              className: `flex flex-col h-full bg-bg-surface font-sans border border-border-subtle overflow-hidden`,
              children: [
                (0, g.jsxs)(`div`, {
                  className: `flex items-center justify-between px-4 py-2 border-b border-border-subtle shrink-0 bg-bg-panel`,
                  children: [
                    (0, g.jsxs)(`span`, {
                      className: `text-xs font-semibold text-text-secondary uppercase tracking-wider`,
                      children: [i, ` — Bulk Edit Mode`],
                    }),
                    (0, g.jsx)(`button`, {
                      onClick: ve,
                      className: `text-xs font-medium text-accent hover:text-accent-hover hover:underline transition-all`,
                      children: `Key-Value Editor`,
                    }),
                  ],
                }),
                N.length > 0 &&
                  (0, g.jsxs)(`div`, {
                    className: `bg-error/10 border-b border-error/20 px-4 py-2 text-xs text-error flex flex-col gap-1 select-none`,
                    children: [
                      N.slice(0, 3).map((e, t) =>
                        (0, g.jsxs)(
                          `div`,
                          {
                            className: `flex items-center gap-1.5`,
                            children: [
                              (0, g.jsx)(`span`, {
                                className: `w-1.5 h-1.5 bg-error rounded-full`,
                              }),
                              e,
                            ],
                          },
                          t
                        )
                      ),
                      N.length > 3 &&
                        (0, g.jsxs)(`div`, {
                          className: `text-text-muted italic ml-3`,
                          children: [`And `, N.length - 3, ` more errors...`],
                        }),
                    ],
                  }),
                (0, g.jsxs)(`div`, {
                  className: `flex-1 relative overflow-hidden`,
                  children: [
                    (0, g.jsx)(`textarea`, {
                      value: j,
                      onChange: be,
                      onKeyDown: ye,
                      className: `w-full h-full bg-transparent p-4 font-mono text-sm resize-none focus:outline-none text-text-primary placeholder:text-text-muted/40 selection:bg-accent/20 leading-relaxed`,
                      placeholder: y
                        ? `# Key: Value
Content-Type: application/json`
                        : `# Key: Value
page: 2`,
                      autoCapitalize: `none`,
                      autoCorrect: `off`,
                      spellCheck: !1,
                    }),
                    U.visible &&
                      (0, g.jsx)(`div`, {
                        style: {
                          position: `absolute`,
                          top: `${U.lineIndex * 22 + 40}px`,
                          left: `24px`,
                          zIndex: 1e3,
                        },
                        className: `bg-bg-overlay border border-border-subtle rounded-md shadow-2xl overflow-hidden max-h-[200px] w-[260px] overflow-y-auto select-none`,
                        children: U.suggestions.map((e, t) =>
                          (0, g.jsx)(
                            `div`,
                            {
                              onClick: () => xe(e),
                              onMouseEnter: () => W((e) => ({ ...e, activeIndex: t })),
                              className: `px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors flex items-center justify-between ${t === U.activeIndex ? `bg-bg-highlight text-text-primary` : `text-text-secondary hover:bg-bg-muted/50`}`,
                              children: e,
                            },
                            e
                          )
                        ),
                      }),
                  ],
                }),
              ],
            })
          : (0, g.jsxs)(`div`, {
              className: `flex flex-col h-full bg-bg-surface font-sans border border-border-subtle overflow-hidden`,
              children: [
                (0, g.jsxs)(`div`, {
                  className: `flex items-center justify-between px-4 py-2 border-b border-border-subtle shrink-0 bg-bg-panel`,
                  children: [
                    (0, g.jsxs)(`span`, {
                      className: `text-xs font-semibold text-text-secondary uppercase tracking-wider`,
                      children: [i, ` (`, O.filter((e) => e.key || e.value).length, ` rows)`],
                    }),
                    (0, g.jsxs)(`div`, {
                      className: `flex items-center gap-3`,
                      children: [
                        x &&
                          x.length > 0 &&
                          (0, g.jsxs)(`div`, {
                            className: `relative`,
                            ref: T,
                            children: [
                              (0, g.jsxs)(`button`, {
                                type: `button`,
                                onClick: () => w(!C),
                                className: `text-xs font-medium text-accent hover:text-accent-hover hover:underline flex items-center gap-1 transition-all`,
                                children: [(0, g.jsx)(l, { size: 11 }), `Apply Preset`],
                              }),
                              C &&
                                (0, g.jsx)(`div`, {
                                  className: `absolute right-0 top-full mt-1.5 w-48 bg-bg-overlay border border-border-subtle rounded shadow-lg py-1 z-30 font-sans`,
                                  children: x.map((e) =>
                                    (0, g.jsx)(
                                      `button`,
                                      {
                                        type: `button`,
                                        onClick: () => {
                                          ;(S?.(e.fields), w(!1))
                                        },
                                        className: `w-full text-left px-3 py-1.5 text-xs text-text-primary hover:bg-bg-highlight truncate`,
                                        children: e.name,
                                      },
                                      e.name
                                    )
                                  ),
                                }),
                            ],
                          }),
                        (0, g.jsx)(`button`, {
                          onClick: ve,
                          className: `text-xs font-medium text-accent hover:text-accent-hover hover:underline transition-all`,
                          children: `Bulk Edit`,
                        }),
                      ],
                    }),
                  ],
                }),
                (0, g.jsx)(`div`, {
                  className: `flex-1 overflow-y-auto select-none`,
                  children: (0, g.jsxs)(`table`, {
                    className: `w-full border-collapse`,
                    children: [
                      (0, g.jsx)(`thead`, {
                        children: (0, g.jsxs)(`tr`, {
                          className: `border-b border-border-subtle h-[28px] bg-bg-panel/40`,
                          children: [
                            (0, g.jsx)(`th`, {
                              className: `w-[22px] border-r border-border-subtle text-center`,
                            }),
                            (0, g.jsx)(`th`, {
                              className: `w-[30px] border-r border-border-subtle text-center`,
                              children: (0, g.jsx)(`input`, {
                                type: `checkbox`,
                                checked: Z,
                                onChange: ne,
                                className: `accent-accent cursor-pointer`,
                              }),
                            }),
                            (0, g.jsx)(`th`, {
                              className: `text-left px-3 text-[11px] font-semibold text-text-muted uppercase border-r border-border-subtle w-1/3`,
                              children: n,
                            }),
                            (0, g.jsx)(`th`, {
                              className: `text-left px-3 text-[11px] font-semibold text-text-muted uppercase`,
                              children: r,
                            }),
                            (0, g.jsx)(`th`, { className: `w-[30px]` }),
                          ],
                        }),
                      }),
                      (0, g.jsxs)(`tbody`, {
                        children: [
                          O.map((e, t) => {
                            let i = F.includes(t),
                              o = z === t,
                              s = _e(e.key)
                            return (0, g.jsxs)(
                              `tr`,
                              {
                                onDragOver: (e) => ie(e, t),
                                onDrop: (e) => ae(e, t),
                                onDragEnd: oe,
                                onClick: (e) => ce(e, t),
                                className: `group border-b border-border-subtle h-[28px] transition-all cursor-default ${e.enabled ? (i ? `bg-bg-highlight` : o ? `border-t-2 border-accent` : s ? `bg-warning/5 text-warning-muted border-l-2 border-l-warning` : `hover:bg-bg-muted/10`) : `opacity-40 bg-bg-muted/20 text-text-muted`}`,
                                children: [
                                  (0, g.jsx)(`td`, {
                                    draggable: !0,
                                    onDragStart: (e) => re(e, t),
                                    className: `drag-handle w-[22px] border-r border-border-subtle text-center align-middle cursor-grab active:cursor-grabbing select-none`,
                                    children: (0, g.jsx)(`div`, {
                                      className: `flex items-center justify-center w-full h-full text-text-muted/40 group-hover:text-text-secondary transition-colors`,
                                      children: (0, g.jsxs)(`svg`, {
                                        width: `8`,
                                        height: `12`,
                                        viewBox: `0 0 8 12`,
                                        fill: `none`,
                                        children: [
                                          (0, g.jsx)(`circle`, {
                                            cx: `2`,
                                            cy: `2`,
                                            r: `1`,
                                            fill: `currentColor`,
                                          }),
                                          (0, g.jsx)(`circle`, {
                                            cx: `2`,
                                            cy: `6`,
                                            r: `1`,
                                            fill: `currentColor`,
                                          }),
                                          (0, g.jsx)(`circle`, {
                                            cx: `2`,
                                            cy: `10`,
                                            r: `1`,
                                            fill: `currentColor`,
                                          }),
                                          (0, g.jsx)(`circle`, {
                                            cx: `6`,
                                            cy: `2`,
                                            r: `1`,
                                            fill: `currentColor`,
                                          }),
                                          (0, g.jsx)(`circle`, {
                                            cx: `6`,
                                            cy: `6`,
                                            r: `1`,
                                            fill: `currentColor`,
                                          }),
                                          (0, g.jsx)(`circle`, {
                                            cx: `6`,
                                            cy: `10`,
                                            r: `1`,
                                            fill: `currentColor`,
                                          }),
                                        ],
                                      }),
                                    }),
                                  }),
                                  (0, g.jsx)(`td`, {
                                    className: `text-center border-r border-border-subtle`,
                                    children: (0, g.jsx)(`input`, {
                                      type: `checkbox`,
                                      checked: e.enabled,
                                      onChange: (e) => X(t, { enabled: e.target.checked }),
                                      className: `accent-accent cursor-pointer`,
                                    }),
                                  }),
                                  (0, g.jsx)(`td`, {
                                    className: `border-r border-border-subtle px-0 relative`,
                                    children: (0, g.jsx)(m, {
                                      value: e.key,
                                      onChange: (e) => me(t, e),
                                      onKeyDown: (e) => de(e, t, `key`),
                                      onFocus: (n) => Q(t, `key`, e.key, n),
                                      onBlur: ue,
                                      placeholder: n,
                                      readOnly: !e.enabled,
                                      id: `kv-key-${t}`,
                                      'data-row': t,
                                      'data-field': `key`,
                                      className: `w-full h-full bg-transparent px-3 text-sm focus:bg-bg-surface focus:outline-none`,
                                    }),
                                  }),
                                  (0, g.jsx)(`td`, {
                                    className: `px-0 relative`,
                                    children: (0, g.jsx)(m, {
                                      value: e.value,
                                      onChange: (e) => he(t, e),
                                      onKeyDown: (e) => de(e, t, `value`),
                                      onFocus: (n) => Q(t, `value`, e.value, n),
                                      onBlur: ue,
                                      placeholder: e.is_valueless ? `(no value flag)` : r,
                                      readOnly: !e.enabled,
                                      id: `kv-value-${t}`,
                                      'data-row': t,
                                      'data-field': `value`,
                                      className: `w-full h-full bg-transparent px-3 text-sm focus:bg-bg-surface`,
                                    }),
                                  }),
                                  (0, g.jsx)(`td`, {
                                    className: `text-center opacity-0 group-hover:opacity-100 transition-opacity`,
                                    children: (0, g.jsx)(`button`, {
                                      onClick: (e) => {
                                        ;(e.stopPropagation(), se(t))
                                      },
                                      className: `text-text-muted hover:text-error transition-colors flex items-center justify-center w-full h-full`,
                                      children: (0, g.jsx)(a, { size: 14 }),
                                    }),
                                  }),
                                ],
                              },
                              t
                            )
                          }),
                          (0, g.jsx)(`tr`, {
                            className: `h-[28px] hover:bg-bg-muted/10 transition-colors`,
                            children: (0, g.jsx)(`td`, {
                              colSpan: 5,
                              children: (0, g.jsxs)(`button`, {
                                onClick: le,
                                className: `w-full h-full px-[54px] text-left text-xs font-semibold text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5`,
                                children: [(0, g.jsx)(s, { size: 12 }), o],
                              }),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                V.visible &&
                  V.rect &&
                  (0, g.jsx)(`div`, {
                    style: {
                      position: `fixed`,
                      left: `${V.rect.left}px`,
                      top: `${V.rect.bottom + 4}px`,
                      width: `${V.rect.width}px`,
                      zIndex: 9999,
                    },
                    className: `bg-bg-overlay border border-border-subtle rounded-md shadow-2xl overflow-hidden max-h-[160px] overflow-y-auto select-none font-mono text-xs flex flex-col`,
                    children: V.suggestions.map((e, t) =>
                      (0, g.jsx)(
                        `div`,
                        {
                          onClick: () => fe(V.rowIndex, V.field, e),
                          onMouseEnter: () => H((e) => ({ ...e, activeIndex: t })),
                          className: `px-3 py-1.5 cursor-pointer transition-colors flex items-center justify-between ${t === V.activeIndex ? `bg-bg-highlight text-text-primary` : `text-text-secondary hover:bg-bg-muted/50`}`,
                          children: (0, g.jsx)(`span`, { children: e }),
                        },
                        e
                      )
                    ),
                  }),
                u &&
                  u.length > 0 &&
                  (0, g.jsxs)(`div`, {
                    className: `mt-auto border-t border-border-subtle shrink-0`,
                    children: [
                      (0, g.jsxs)(`div`, {
                        className: `px-4 py-1.5 border-b border-border-subtle bg-bg-panel/40 flex items-center gap-2 select-none`,
                        children: [
                          (0, g.jsx)(`span`, {
                            className: `text-[10px] font-semibold text-text-muted uppercase tracking-wider`,
                            children: f,
                          }),
                          p &&
                            (0, g.jsx)(`div`, {
                              className: `text-text-muted hover:text-text-primary cursor-help`,
                              title: p,
                              children: (0, g.jsx)(c, { size: 12 }),
                            }),
                        ],
                      }),
                      (0, g.jsx)(`table`, {
                        className: `w-full border-collapse`,
                        children: (0, g.jsx)(`tbody`, {
                          children: u.map((e, t) =>
                            (0, g.jsxs)(
                              `tr`,
                              {
                                className: `border-b border-border-subtle h-[28px] text-text-muted/65 italic bg-bg-muted/10`,
                                children: [
                                  (0, g.jsx)(`td`, {
                                    className: `w-[30px] border-r border-border-subtle`,
                                  }),
                                  (0, g.jsx)(`td`, {
                                    className: `border-r border-border-subtle px-3 text-sm font-mono w-1/3`,
                                    children: e.key,
                                  }),
                                  (0, g.jsxs)(`td`, {
                                    className: `px-3 text-sm font-mono flex items-center justify-between h-[28px]`,
                                    children: [
                                      (0, g.jsx)(`span`, { children: e.value }),
                                      e.description &&
                                        (0, g.jsx)(`span`, {
                                          className: `bg-accent/10 text-accent text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded tracking-wider mr-2 select-none`,
                                          children: e.description,
                                        }),
                                    ],
                                  }),
                                  (0, g.jsx)(`td`, { className: `w-[30px]` }),
                                ],
                              },
                              t
                            )
                          ),
                        }),
                      }),
                    ],
                  }),
              ],
            })
      }),
      (y.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `KeyValueEditor`,
        props: {
          entries: {
            required: !0,
            tsType: {
              name: `Array`,
              elements: [
                {
                  name: `signature`,
                  type: `object`,
                  raw: `{ key: string; value: string; enabled: boolean; is_valueless?: boolean | null }`,
                  signature: {
                    properties: [
                      { key: `key`, value: { name: `string`, required: !0 } },
                      { key: `value`, value: { name: `string`, required: !0 } },
                      { key: `enabled`, value: { name: `boolean`, required: !0 } },
                      {
                        key: `is_valueless`,
                        value: {
                          name: `union`,
                          raw: `boolean | null`,
                          elements: [{ name: `boolean` }, { name: `null` }],
                          required: !1,
                        },
                      },
                    ],
                  },
                },
              ],
              raw: `HeaderEntry[]`,
            },
            description: ``,
          },
          onChange: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(entries: HeaderEntry[]) => void`,
              signature: {
                arguments: [
                  {
                    type: {
                      name: `Array`,
                      elements: [
                        {
                          name: `signature`,
                          type: `object`,
                          raw: `{ key: string; value: string; enabled: boolean; is_valueless?: boolean | null }`,
                          signature: {
                            properties: [
                              { key: `key`, value: { name: `string`, required: !0 } },
                              { key: `value`, value: { name: `string`, required: !0 } },
                              { key: `enabled`, value: { name: `boolean`, required: !0 } },
                              {
                                key: `is_valueless`,
                                value: {
                                  name: `union`,
                                  raw: `boolean | null`,
                                  elements: [{ name: `boolean` }, { name: `null` }],
                                  required: !1,
                                },
                              },
                            ],
                          },
                        },
                      ],
                      raw: `HeaderEntry[]`,
                    },
                    name: `entries`,
                  },
                ],
                return: { name: `void` },
              },
            },
            description: ``,
          },
          namePlaceholder: {
            required: !1,
            tsType: { name: `string` },
            description: ``,
            defaultValue: { value: `'Key'`, computed: !1 },
          },
          valuePlaceholder: {
            required: !1,
            tsType: { name: `string` },
            description: ``,
            defaultValue: { value: `'Value'`, computed: !1 },
          },
          title: {
            required: !1,
            tsType: { name: `string` },
            description: ``,
            defaultValue: { value: `''`, computed: !1 },
          },
          addButtonLabel: {
            required: !1,
            tsType: { name: `string` },
            description: ``,
            defaultValue: { value: `'Add parameter'`, computed: !1 },
          },
          readOnlyEntries: {
            required: !1,
            tsType: {
              name: `Array`,
              elements: [
                {
                  name: `signature`,
                  type: `object`,
                  raw: `{ key: string; value: string; description?: string }`,
                  signature: {
                    properties: [
                      { key: `key`, value: { name: `string`, required: !0 } },
                      { key: `value`, value: { name: `string`, required: !0 } },
                      { key: `description`, value: { name: `string`, required: !1 } },
                    ],
                  },
                },
              ],
              raw: `{ key: string; value: string; description?: string }[]`,
            },
            description: ``,
          },
          readOnlyTitle: { required: !1, tsType: { name: `string` }, description: `` },
          readOnlyTooltip: { required: !1, tsType: { name: `string` }, description: `` },
          isHeaders: {
            required: !1,
            tsType: { name: `boolean` },
            description: ``,
            defaultValue: { value: `false`, computed: !1 },
          },
          caseSensitiveKeys: {
            required: !1,
            tsType: { name: `boolean` },
            description: ``,
            defaultValue: { value: `false`, computed: !1 },
          },
          presets: {
            required: !1,
            tsType: {
              name: `Array`,
              elements: [
                {
                  name: `signature`,
                  type: `object`,
                  raw: `{ name: string; fields: { key: string; value: string; enabled: boolean }[] }`,
                  signature: {
                    properties: [
                      { key: `name`, value: { name: `string`, required: !0 } },
                      {
                        key: `fields`,
                        value: {
                          name: `Array`,
                          elements: [
                            {
                              name: `signature`,
                              type: `object`,
                              raw: `{ key: string; value: string; enabled: boolean }`,
                              signature: {
                                properties: [
                                  { key: `key`, value: { name: `string`, required: !0 } },
                                  { key: `value`, value: { name: `string`, required: !0 } },
                                  { key: `enabled`, value: { name: `boolean`, required: !0 } },
                                ],
                              },
                            },
                          ],
                          raw: `{ key: string; value: string; enabled: boolean }[]`,
                          required: !0,
                        },
                      },
                    ],
                  },
                },
              ],
              raw: `{ name: string; fields: { key: string; value: string; enabled: boolean }[] }[]`,
            },
            description: ``,
          },
          onApplyPreset: {
            required: !1,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(fields: { key: string; value: string; enabled: boolean }[]) => void`,
              signature: {
                arguments: [
                  {
                    type: {
                      name: `Array`,
                      elements: [
                        {
                          name: `signature`,
                          type: `object`,
                          raw: `{ key: string; value: string; enabled: boolean }`,
                          signature: {
                            properties: [
                              { key: `key`, value: { name: `string`, required: !0 } },
                              { key: `value`, value: { name: `string`, required: !0 } },
                              { key: `enabled`, value: { name: `boolean`, required: !0 } },
                            ],
                          },
                        },
                      ],
                      raw: `{ key: string; value: string; enabled: boolean }[]`,
                    },
                    name: `fields`,
                  },
                ],
                return: { name: `void` },
              },
            },
            description: ``,
          },
        },
      }))
  }),
  x = n({
    AddRow: () => B,
    DeleteRow: () => V,
    DisabledRow: () => L,
    Empty: () => P,
    HeadersMode: () => z,
    MultipleRows: () => I,
    SingleRow: () => F,
    WithReadOnlyEntries: () => R,
    __namedExportsOrder: () => H,
    default: () => N,
  }),
  S,
  C,
  w,
  T,
  E,
  D,
  O,
  k,
  A,
  j,
  M,
  N,
  P,
  F,
  I,
  L,
  R,
  z,
  B,
  V,
  H,
  U = t(() => {
    ;(r(),
      b(),
      u(),
      (S = i()),
      ({ fn: C } = __STORYBOOK_MODULE_TEST__),
      ({ expect: w, userEvent: T, within: E } = __STORYBOOK_MODULE_TEST__),
      (D = { key: `Content-Type`, value: `application/json`, enabled: !0 }),
      (O = { key: `Accept`, value: `*/*`, enabled: !0 }),
      (k = { key: `Authorization`, value: `Bearer {{apiToken}}`, enabled: !0 }),
      (A = { key: `Cache-Control`, value: `no-cache`, enabled: !0 }),
      (j = { key: `X-Debug-Mode`, value: `true`, enabled: !1 }),
      (M = { key: `Accept`, value: `text/html`, enabled: !0 }),
      (N = {
        title: `composer/KeyValueEditor`,
        component: y,
        parameters: { layout: `fullscreen` },
        decorators: [
          (e) =>
            (0, S.jsx)(`div`, {
              style: { height: 320, display: `flex`, flexDirection: `column` },
              children: (0, S.jsx)(f, { children: (0, S.jsx)(e, {}) }),
            }),
        ],
        args: {
          entries: [],
          onChange: C(),
          title: `Headers`,
          namePlaceholder: `Key`,
          valuePlaceholder: `Value`,
          addButtonLabel: `Add parameter`,
          isHeaders: !1,
          caseSensitiveKeys: !1,
        },
        argTypes: {
          entries: {
            control: !1,
            description: 'Array of `HeaderEntry` objects (`{ key, value, enabled }`)',
          },
          onChange: {
            description: `Callback fired whenever any entry changes.`,
            action: `onChange`,
          },
          title: { control: { type: `text` }, description: `Label shown in the table header row.` },
          addButtonLabel: {
            control: { type: `text` },
            description: `Label for the bottom add-row button.`,
          },
          isHeaders: {
            control: { type: `boolean` },
            description: `Enables HTTP-header autocomplete on key and value inputs.`,
          },
          caseSensitiveKeys: {
            control: { type: `boolean` },
            description: `When true, duplicate-key detection is case-sensitive.`,
          },
          namePlaceholder: {
            control: { type: `text` },
            description: `Placeholder text shown in the key column inputs.`,
          },
          valuePlaceholder: {
            control: { type: `text` },
            description: `Placeholder text shown in the value column inputs.`,
          },
          readOnlyEntries: {
            control: !1,
            description: `Array of read-only rows displayed below the editable table.`,
          },
          readOnlyTitle: {
            control: { type: `text` },
            description: `Section heading for the read-only entries block.`,
          },
          readOnlyTooltip: {
            control: { type: `text` },
            description: 'Tooltip text for the info icon next to `readOnlyTitle`.',
          },
          presets: {
            control: !1,
            description: `Optional preset configurations available via the "Apply Preset" dropdown.`,
          },
          onApplyPreset: {
            description: `Callback fired when a preset is selected.`,
            action: `onApplyPreset`,
          },
        },
      }),
      (P = {
        args: { entries: [] },
        play: async ({ canvasElement: e }) => {
          await w(E(e).getByText(`Add parameter`)).toBeInTheDocument()
        },
      }),
      (F = {
        args: { entries: [D] },
        play: async ({ canvasElement: e }) => {
          let t = E(e)
          ;(await w(t.getByDisplayValue(`Content-Type`)).toBeInTheDocument(),
            await w(t.getByDisplayValue(`application/json`)).toBeInTheDocument())
        },
      }),
      (I = {
        args: { entries: [D, O, k, A, M] },
        play: async ({ canvasElement: e }) => {
          await w(E(e).getAllByDisplayValue(`Accept`)).toHaveLength(2)
        },
      }),
      (L = {
        args: { entries: [D, j, O] },
        play: async ({ canvasElement: e }) => {
          let t = E(e)
          ;(await w(t.getByDisplayValue(`X-Debug-Mode`)).toBeInTheDocument(),
            await w(t.getByDisplayValue(`X-Debug-Mode`)).toHaveAttribute(`readonly`))
        },
      }),
      (R = {
        args: {
          entries: [D, k],
          readOnlyEntries: [
            { key: `X-Collection-Auth`, value: `Bearer env-token`, description: `Collection` },
            { key: `X-Workspace-ID`, value: `ws-12345`, description: `Workspace` },
          ],
          readOnlyTitle: `Inherited`,
          readOnlyTooltip: `These headers are inherited from the collection and cannot be edited here.`,
        },
        play: async ({ canvasElement: e }) => {
          let t = E(e)
          ;(await w(t.getByText(`Inherited`)).toBeInTheDocument(),
            await w(t.getByText(`X-Collection-Auth`)).toBeInTheDocument())
        },
      }),
      (z = {
        args: { entries: [k, D], isHeaders: !0, title: `Headers`, addButtonLabel: `Add header` },
        play: async ({ canvasElement: e }) => {
          let t = E(e)
          ;(await w(t.getByDisplayValue(`Authorization`)).toBeInTheDocument(),
            await w(t.getByText(`Add header`)).toBeInTheDocument())
        },
      }),
      (B = {
        args: { entries: [D, O], onChange: C() },
        play: async ({ canvasElement: e, args: t }) => {
          let n = E(e).getByText(`Add parameter`)
          ;(await T.click(n),
            await w(t.onChange).toHaveBeenCalledWith(
              w.arrayContaining([
                w.objectContaining({ key: `Content-Type` }),
                w.objectContaining({ key: `Accept` }),
                w.objectContaining({ key: ``, value: ``, enabled: !0 }),
              ])
            ))
        },
      }),
      (V = {
        args: { entries: [D, O, k], onChange: C() },
        play: async ({ canvasElement: e, args: t }) => {
          let n = E(e),
            r = n.getByDisplayValue(`Content-Type`).closest(`tr`)
          ;(await T.hover(r), n.getAllByRole(`button`, { name: `` }))
          let i = r.querySelector(`button`)
          ;(i && (await T.click(i)),
            await w(t.onChange).toHaveBeenCalled(),
            await w(t.onChange.mock.calls.at(-1)?.[0]?.map((e) => e.key) ?? []).not.toContain(
              `Content-Type`
            ))
        },
      }),
      (P.parameters = {
        ...P.parameters,
        docs: {
          ...P.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    entries: []
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Add parameter')).toBeInTheDocument();
  }
}`,
            ...P.parameters?.docs?.source,
          },
          description: {
            story: `Empty — no entries provided.

KeyValueEditor normalises an empty \`entries\` array to a single blank row so
the user always has somewhere to type. The "Add parameter" button is
rendered below the placeholder row.`,
            ...P.parameters?.docs?.description,
          },
        },
      }),
      (F.parameters = {
        ...F.parameters,
        docs: {
          ...F.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    entries: [ENTRY_CONTENT_TYPE]
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const keyInput = canvas.getByDisplayValue('Content-Type');
    await expect(keyInput).toBeInTheDocument();
    await expect(canvas.getByDisplayValue('application/json')).toBeInTheDocument();
  }
}`,
            ...F.parameters?.docs?.source,
          },
          description: {
            story: `SingleRow — one filled key-value pair.

A single \`Content-Type: application/json\` entry. The drag handle (⠿) and
the enabled checkbox are visible. The delete button appears on hover.`,
            ...F.parameters?.docs?.description,
          },
        },
      }),
      (I.parameters = {
        ...I.parameters,
        docs: {
          ...I.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    entries: [ENTRY_CONTENT_TYPE, ENTRY_ACCEPT, ENTRY_AUTH, ENTRY_CACHE, ENTRY_DUP_ACCEPT]
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // Both Accept rows should be present
    const acceptInputs = canvas.getAllByDisplayValue('Accept');
    await expect(acceptInputs).toHaveLength(2);
  }
}`,
            ...I.parameters?.docs?.source,
          },
          description: {
            story: `MultipleRows — five realistic HTTP header entries.

Includes a duplicate \`Accept\` key to demonstrate the duplicate-key warning
highlight (left border becomes amber). Both rows with key \`Accept\` are
highlighted.`,
            ...I.parameters?.docs?.description,
          },
        },
      }),
      (L.parameters = {
        ...L.parameters,
        docs: {
          ...L.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    entries: [ENTRY_CONTENT_TYPE, ENTRY_DISABLED, ENTRY_ACCEPT]
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByDisplayValue('X-Debug-Mode')).toBeInTheDocument();
    // Disabled row input should be read-only
    const disabledInput = canvas.getByDisplayValue('X-Debug-Mode');
    await expect(disabledInput).toHaveAttribute('readonly');
  }
}`,
            ...L.parameters?.docs?.source,
          },
          description: {
            story: `DisabledRow — a row with \`enabled: false\`.

Disabled rows are rendered at 40% opacity with a muted background. Their
inputs are read-only (\`readOnly\` attribute set). The row checkbox is
unchecked. The rest of the table remains interactive.`,
            ...L.parameters?.docs?.description,
          },
        },
      }),
      (R.parameters = {
        ...R.parameters,
        docs: {
          ...R.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    entries: [ENTRY_CONTENT_TYPE, ENTRY_AUTH],
    readOnlyEntries: [{
      key: 'X-Collection-Auth',
      value: 'Bearer env-token',
      description: 'Collection'
    }, {
      key: 'X-Workspace-ID',
      value: 'ws-12345',
      description: 'Workspace'
    }],
    readOnlyTitle: 'Inherited',
    readOnlyTooltip: 'These headers are inherited from the collection and cannot be edited here.'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Inherited')).toBeInTheDocument();
    await expect(canvas.getByText('X-Collection-Auth')).toBeInTheDocument();
  }
}`,
            ...R.parameters?.docs?.source,
          },
          description: {
            story: `WithReadOnlyEntries — inherited headers section.

Two editable entries plus two read-only entries from a parent environment.
The read-only section is pinned to the bottom of the editor with an
"Inherited" heading and an info tooltip.`,
            ...R.parameters?.docs?.description,
          },
        },
      }),
      (z.parameters = {
        ...z.parameters,
        docs: {
          ...z.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    entries: [ENTRY_AUTH, ENTRY_CONTENT_TYPE],
    isHeaders: true,
    title: 'Headers',
    addButtonLabel: 'Add header'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByDisplayValue('Authorization')).toBeInTheDocument();
    await expect(canvas.getByText('Add header')).toBeInTheDocument();
  }
}`,
            ...z.parameters?.docs?.source,
          },
          description: {
            story:
              'HeadersMode — `isHeaders=true` enables HTTP header autocomplete.\n\nIn this mode, focusing a key cell shows autocomplete suggestions from the\nbuilt-in HTTP headers dictionary and any custom headers remembered for the\ncurrent collection. The `Authorization` header is pre-filled to demonstrate\nthat `Bearer` prefix suggestions would appear on value focus.',
            ...z.parameters?.docs?.description,
          },
        },
      }),
      (B.parameters = {
        ...B.parameters,
        docs: {
          ...B.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    entries: [ENTRY_CONTENT_TYPE, ENTRY_ACCEPT],
    onChange: fn()
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const addBtn = canvas.getByText('Add parameter');
    await userEvent.click(addBtn);
    // onChange should have been called with 3 entries
    await expect(args.onChange).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
      key: 'Content-Type'
    }), expect.objectContaining({
      key: 'Accept'
    }), expect.objectContaining({
      key: '',
      value: '',
      enabled: true
    })]));
  }
}`,
            ...B.parameters?.docs?.source,
          },
          description: {
            story: `AddRow — \`play()\` adds a new row via the "Add parameter" button.

Starts with two entries. The play function clicks "Add parameter" and
verifies that a third blank row appears in the table.`,
            ...B.parameters?.docs?.description,
          },
        },
      }),
      (V.parameters = {
        ...V.parameters,
        docs: {
          ...V.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    entries: [ENTRY_CONTENT_TYPE, ENTRY_ACCEPT, ENTRY_AUTH],
    onChange: fn()
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    // Hover the first data row to make its delete button visible
    const firstKeyInput = canvas.getByDisplayValue('Content-Type');
    const firstRow = firstKeyInput.closest('tr')!;
    await userEvent.hover(firstRow);

    // Click the delete (×) button in that row
    const deleteButtons = canvas.getAllByRole('button', {
      name: ''
    });
    // The delete button is the one inside the hovered row
    const rowDeleteBtn = firstRow.querySelector('button');
    if (rowDeleteBtn) {
      await userEvent.click(rowDeleteBtn);
    }

    // onChange should have been called — the result should not include Content-Type
    await expect(args.onChange).toHaveBeenCalled();
    const lastCall = (args.onChange as ReturnType<typeof fn>).mock.calls.at(-1)?.[0] as HeaderEntry[];
    const keys = lastCall?.map(e => e.key) ?? [];
    await expect(keys).not.toContain('Content-Type');
  }
}`,
            ...V.parameters?.docs?.source,
          },
          description: {
            story: `DeleteRow — \`play()\` deletes a row using the × delete button.

Starts with three entries. The play function hovers the first row to reveal
the × button, clicks it, and verifies \`onChange\` was called without the
deleted entry.`,
            ...V.parameters?.docs?.description,
          },
        },
      }),
      (H = [
        `Empty`,
        `SingleRow`,
        `MultipleRows`,
        `DisabledRow`,
        `WithReadOnlyEntries`,
        `HeadersMode`,
        `AddRow`,
        `DeleteRow`,
      ]))
  })
U()
export {
  B as AddRow,
  V as DeleteRow,
  L as DisabledRow,
  P as Empty,
  z as HeadersMode,
  I as MultipleRows,
  F as SingleRow,
  R as WithReadOnlyEntries,
  H as __namedExportsOrder,
  N as default,
  U as n,
  x as t,
}
