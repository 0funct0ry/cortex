import { a as e, n as t, r as n } from './chunk-DnJy8xQt.js'
import {
  A as r,
  C as i,
  D as a,
  O as o,
  S as s,
  T as c,
  a as l,
  b as ee,
  c as u,
  f as d,
  g as f,
  gt as p,
  k as m,
  m as h,
  p as te,
  s as g,
  t as _,
  u as v,
  v as y,
  w as b,
  x,
  y as S,
} from './iframe-CECvvSLk.js'
import { O as C, f as ne, l as w, o as re, s as ie, u as T } from './Icons-DjzhDYF3.js'
import { n as E, r as ae, t as oe } from './TabsContext-DSn62RXv.js'
import { n as D, t as O } from './VariableInput-BL1aVURF.js'
import { n as se, t as k } from './Tooltip-D06fzBd3.js'
import { n as ce, t as A } from './MethodSelector-CHZNDXam.js'
import { n as j, t as le } from './SendButton-B3fSDd3K.js'
import { n as M, t as ue } from './UrlInput-CGaVMZec.js'
function N(e, t) {
  let n = null,
    r = {
      visualize: {
        set: (e) => {
          n = e
        },
      },
      response: {
        status: t.status,
        statusText: t.statusText,
        headers: t.headers,
        body: t.body,
        json: () => {
          try {
            return JSON.parse(t.body)
          } catch {
            throw Error(`Response body is not valid JSON`)
          }
        },
      },
    }
  try {
    return (Function(`cortex`, e)(r), { html: n, error: null })
  } catch (e) {
    return { html: null, error: String(e) }
  }
}
var P = t(() => {})
function de(e, t, n, r) {
  if (r && r.type && r.type !== `none`) return { auth: r, source: `local` }
  let i = t.find((t) => t.id === e)
  if (!i || !i.collectionId) return { auth: { type: `none`, config: {} }, source: `none` }
  let a = n[i.collectionId]
  if (!a) return { auth: { type: `none`, config: {} }, source: `none` }
  let o = i.requestPath || ``,
    s = a.path,
    c = [],
    l = o.split(`/`)
  l.pop()
  let ee = (e, t) => {
      for (let n of e)
        if (n.type === `Folder`) {
          if (n.data.path === t) return n.data
          let e = ee(n.data.items || [], t)
          if (e) return e
        }
      return null
    },
    u = l.join(`/`)
  for (; u.startsWith(s) && u !== s; ) {
    let e = ee(a.items || [], u)
    e && c.push(e)
    let t = u.split(`/`)
    ;(t.pop(), (u = t.join(`/`)))
  }
  for (let e of c)
    if (e.manifest && e.manifest.auth && e.manifest.auth.type && e.manifest.auth.type !== `none`)
      return {
        auth: { type: e.manifest.auth.type, config: { ...e.manifest.auth } },
        source: `folder`,
        sourceName: e.name,
      }
  return a.manifest && a.manifest.auth && a.manifest.auth.type && a.manifest.auth.type !== `none`
    ? {
        auth: { type: a.manifest.auth.type, config: { ...a.manifest.auth } },
        source: `collection`,
        sourceName: a.name,
      }
    : { auth: { type: `none`, config: {} }, source: `none` }
}
var F,
  I,
  L,
  R = t(() => {
    ;((F = e(p(), 1)),
      d(),
      f(),
      a(),
      x(),
      S(),
      E(),
      D(),
      C(),
      r(),
      (I = _()),
      (L = ({ requestId: e }) => {
        let { getRequestState: t, updateRequest: n } = h(),
          { collections: r } = y(),
          { tabs: a } = ae(),
          s = o((e) => e.activeEnvironmentName),
          c = t(e),
          l = (0, F.useMemo)(() => c?.auth || { type: `none`, config: {} }, [c?.auth]),
          u = (0, F.useMemo)(() => l.config || {}, [l.config]),
          [d, f] = (0, F.useState)(!0),
          [p, te] = (0, F.useState)(!0),
          [g, _] = (0, F.useState)(!0),
          [v, b] = (0, F.useState)(!0),
          [x, S] = (0, F.useState)(!0),
          [C, ne] = (0, F.useState)(!0),
          [re, ie] = (0, F.useState)(!0),
          [E, oe] = (0, F.useState)(!0),
          [D, se] = (0, F.useState)(!0),
          [k, ce] = (0, F.useState)(!0),
          [A, j] = (0, F.useState)(!1),
          [le, M] = (0, F.useState)(null),
          [ue, N] = (0, F.useState)(null),
          [P, L] = (0, F.useState)(null),
          {
            auth: R,
            source: z,
            sourceName: B,
          } = (0, F.useMemo)(() => de(e, a, r, l), [e, a, r, l]),
          V = (0, F.useMemo)(() => R.config || {}, [R.config]),
          fe = V.token || ``,
          pe = R.type === `bearer_token` && fe.toLowerCase().startsWith(`bearer `),
          H = (0, F.useMemo)(() => {
            let e = c?.headers || []
            if (
              R.type === `bearer_token` ||
              R.type === `basic` ||
              R.type === `digest` ||
              R.type === `oauth2` ||
              R.type === `aws_sigv4`
            )
              return e.some((e) => e.enabled && e.key.toLowerCase() === `authorization`)
                ? `Authorization`
                : null
            if (R.type === `api_key`) {
              let t = V.key || ``,
                n = V.addTo || `header`
              if (t && n === `header`)
                return e.some((e) => e.enabled && e.key.toLowerCase() === t.toLowerCase())
                  ? t
                  : null
            }
            return null
          }, [R, V, c]),
          U = (0, F.useMemo)(() => {
            if (R.type === `none`) return !1
            if (R.type === `bearer_token`) {
              let e = V.token || ``
              return e.includes(`{{`) && e.includes(`}}`)
            }
            if (R.type === `api_key`) {
              let e = V.key || ``,
                t = V.value || ``
              return (
                (e.includes(`{{`) && e.includes(`}}`)) || (t.includes(`{{`) && t.includes(`}}`))
              )
            }
            if (R.type === `basic` || R.type === `digest`) {
              let e = V.username || ``,
                t = V.password || ``
              return (
                (e.includes(`{{`) && e.includes(`}}`)) || (t.includes(`{{`) && t.includes(`}}`))
              )
            }
            return R.type === `oauth2` || R.type === `aws_sigv4`
              ? Object.values(V).some(
                  (e) => typeof e == `string` && e.includes(`{{`) && e.includes(`}}`)
                )
              : !1
          }, [R, V]),
          W = (t) => {
            t !== l.type &&
              ((l.type === `api_key` && (u.key || u.value)) ||
              (l.type === `bearer_token` && u.token) ||
              (l.type === `basic` && (u.username || u.password)) ||
              (l.type === `digest` && (u.username || u.password)) ||
              (l.type === `oauth2` && Object.values(u).some((e) => !!e)) ||
              (l.type === `aws_sigv4` && Object.values(u).some((e) => !!e))
                ? L(t)
                : n(e, {
                    auth: {
                      type: t,
                      config:
                        t === `api_key`
                          ? { addTo: `header` }
                          : t === `oauth2`
                            ? { grantType: `authorization_code` }
                            : t === `aws_sigv4`
                              ? {
                                  region: ``,
                                  service: ``,
                                  accessKeyId: ``,
                                  secretAccessKey: ``,
                                  sessionToken: ``,
                                }
                              : {},
                    },
                  }))
          },
          G = () => {
            P &&
              (n(e, {
                auth: {
                  type: P,
                  config:
                    P === `api_key`
                      ? { addTo: `header` }
                      : P === `oauth2`
                        ? { grantType: `authorization_code` }
                        : P === `aws_sigv4`
                          ? {
                              region: ``,
                              service: ``,
                              accessKeyId: ``,
                              secretAccessKey: ``,
                              sessionToken: ``,
                            }
                          : {},
                },
              }),
              L(null))
          },
          K = (t, r) => {
            n(e, { auth: { ...l, config: { ...u, [t]: r } } })
          },
          q = (t) => {
            n(e, { auth: { ...l, config: { ...u, ...t } } })
          },
          me = (e) => {},
          J = ae().tabs.find((t) => t.id === e),
          Y = i.getState().activeWorkspacePath || null,
          X = o((e) => e.activeEnvironmentName),
          Z = J?.collectionId
            ? (ee.getState().activeCollectionEnvName[J.collectionId] ?? null)
            : null,
          Q = V.grantType || `authorization_code`,
          $ = V.tokenEndpoint || ``,
          he = V.authEndpoint || ``,
          ge = V.clientId || ``,
          _e = V.clientSecret || ``,
          ve = V.scope || ``,
          ye = V.username || ``,
          be = V.password || ``,
          xe = V.additionalParams || ``,
          Se = V.redirectUriMode || `default`,
          Ce = V.customRedirectUri || ``,
          we = V.refreshToken || ``
        return (0, I.jsxs)(`div`, {
          className: `h-full flex flex-col p-6 space-y-6 overflow-y-auto`,
          children: [
            (0, I.jsxs)(`div`, {
              className: `space-y-3`,
              children: [
                U &&
                  !s &&
                  (0, I.jsxs)(`div`, {
                    className: `bg-warning-muted/10 border border-warning/30 rounded p-3 flex items-start gap-2.5 animate-in fade-in duration-200`,
                    children: [
                      (0, I.jsxs)(`svg`, {
                        xmlns: `http://www.w3.org/2000/svg`,
                        width: `16`,
                        height: `16`,
                        viewBox: `0 0 24 24`,
                        fill: `none`,
                        stroke: `currentColor`,
                        strokeWidth: `2`,
                        strokeLinecap: `round`,
                        strokeLinejoin: `round`,
                        className: `text-warning mt-0.5`,
                        children: [
                          (0, I.jsx)(`path`, {
                            d: `M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z`,
                          }),
                          (0, I.jsx)(`line`, { x1: `12`, y1: `9`, x2: `12`, y2: `13` }),
                          (0, I.jsx)(`line`, { x1: `12`, y1: `17`, x2: `12.01`, y2: `17` }),
                        ],
                      }),
                      (0, I.jsx)(`div`, {
                        className: `text-xs text-text-primary`,
                        children: `Some auth values contain unresolved variables. Select an environment to resolve them.`,
                      }),
                    ],
                  }),
                pe &&
                  (0, I.jsxs)(`div`, {
                    className: `bg-error-muted/10 border border-error/30 rounded p-3 flex items-start justify-between gap-2.5 animate-in fade-in duration-200`,
                    children: [
                      (0, I.jsxs)(`div`, {
                        className: `flex items-start gap-2.5`,
                        children: [
                          (0, I.jsxs)(`svg`, {
                            xmlns: `http://www.w3.org/2000/svg`,
                            width: `16`,
                            height: `16`,
                            viewBox: `0 0 24 24`,
                            fill: `none`,
                            stroke: `currentColor`,
                            strokeWidth: `2`,
                            strokeLinecap: `round`,
                            strokeLinejoin: `round`,
                            className: `text-error mt-0.5`,
                            children: [
                              (0, I.jsx)(`circle`, { cx: `12`, cy: `12`, r: `10` }),
                              (0, I.jsx)(`line`, { x1: `12`, y1: `8`, x2: `12`, y2: `12` }),
                              (0, I.jsx)(`line`, { x1: `12`, y1: `16`, x2: `12.01`, y2: `16` }),
                            ],
                          }),
                          (0, I.jsxs)(`div`, {
                            className: `text-xs text-text-primary`,
                            children: [
                              `Warning: Do not include the`,
                              ` `,
                              (0, I.jsxs)(`code`, {
                                className: `bg-bg-panel px-1 py-0.5 rounded font-mono text-[11px]`,
                                children: [`Bearer`, ` `],
                              }),
                              ` `,
                              `prefix manually in the Token field. Cortex handles this automatically when injecting the Authorization header.`,
                            ],
                          }),
                        ],
                      }),
                      (0, I.jsx)(`button`, {
                        onClick: () => {
                          let e = V.token || ``
                          e.toLowerCase().startsWith(`bearer `) && K(`token`, e.substring(7).trim())
                        },
                        className: `bg-error/15 hover:bg-error/25 text-error text-[10px] font-semibold uppercase px-2 py-1 rounded transition-colors shrink-0 select-none`,
                        children: `Clean Prefix`,
                      }),
                    ],
                  }),
                H &&
                  (0, I.jsxs)(`div`, {
                    className: `bg-warning-muted/10 border border-warning/30 rounded p-3 flex items-start gap-2.5 animate-in fade-in duration-200`,
                    children: [
                      (0, I.jsxs)(`svg`, {
                        xmlns: `http://www.w3.org/2000/svg`,
                        width: `16`,
                        height: `16`,
                        viewBox: `0 0 24 24`,
                        fill: `none`,
                        stroke: `currentColor`,
                        strokeWidth: `2`,
                        strokeLinecap: `round`,
                        strokeLinejoin: `round`,
                        className: `text-warning mt-0.5`,
                        children: [
                          (0, I.jsx)(`path`, {
                            d: `M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z`,
                          }),
                          (0, I.jsx)(`line`, { x1: `12`, y1: `9`, x2: `12`, y2: `13` }),
                          (0, I.jsx)(`line`, { x1: `12`, y1: `17`, x2: `12.01`, y2: `17` }),
                        ],
                      }),
                      (0, I.jsxs)(`div`, {
                        className: `text-xs text-text-primary`,
                        children: [
                          `A manually defined header/parameter`,
                          ` `,
                          (0, I.jsx)(`code`, {
                            className: `bg-bg-panel px-1 py-0.5 rounded font-mono text-[11px]`,
                            children: H,
                          }),
                          ` `,
                          `conflicts with the active authentication configuration. The auth-managed value will take precedence.`,
                        ],
                      }),
                    ],
                  }),
                P &&
                  (0, I.jsxs)(`div`, {
                    className: `bg-warning-muted/10 border border-warning/30 rounded p-4 flex flex-col gap-3 animate-in fade-in duration-200`,
                    children: [
                      (0, I.jsxs)(`div`, {
                        className: `flex items-start gap-2.5`,
                        children: [
                          (0, I.jsxs)(`svg`, {
                            xmlns: `http://www.w3.org/2000/svg`,
                            width: `16`,
                            height: `16`,
                            viewBox: `0 0 24 24`,
                            fill: `none`,
                            stroke: `currentColor`,
                            strokeWidth: `2`,
                            strokeLinecap: `round`,
                            strokeLinejoin: `round`,
                            className: `text-warning mt-0.5`,
                            children: [
                              (0, I.jsx)(`path`, {
                                d: `M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z`,
                              }),
                              (0, I.jsx)(`line`, { x1: `12`, y1: `9`, x2: `12`, y2: `13` }),
                              (0, I.jsx)(`line`, { x1: `12`, y1: `17`, x2: `12.01`, y2: `17` }),
                            ],
                          }),
                          (0, I.jsxs)(`div`, {
                            className: `text-xs text-text-primary font-medium`,
                            children: [
                              `Switching auth type will clear the current`,
                              ` `,
                              l.type === `api_key`
                                ? `API Key`
                                : l.type === `bearer_token`
                                  ? `Bearer Token`
                                  : l.type === `basic`
                                    ? `Basic Auth`
                                    : l.type === `digest`
                                      ? `Digest Auth`
                                      : `No Auth`,
                              ` `,
                              `configuration. Continue?`,
                            ],
                          }),
                        ],
                      }),
                      (0, I.jsxs)(`div`, {
                        className: `flex gap-2 justify-end`,
                        children: [
                          (0, I.jsx)(`button`, {
                            onClick: () => L(null),
                            className: `px-2.5 py-1 bg-bg-muted hover:bg-bg-highlight text-[11px] font-medium text-text-secondary rounded transition-colors`,
                            children: `Revert`,
                          }),
                          (0, I.jsx)(`button`, {
                            onClick: G,
                            className: `px-2.5 py-1 bg-warning hover:bg-warning/80 text-[11px] font-medium text-text-inverse rounded transition-colors`,
                            children: `Confirm`,
                          }),
                        ],
                      }),
                    ],
                  }),
              ],
            }),
            z !== `local` &&
              z !== `none` &&
              (0, I.jsxs)(`div`, {
                className: `bg-bg-panel border border-border-subtle rounded p-3.5 flex items-center justify-between animate-in fade-in duration-200`,
                children: [
                  (0, I.jsxs)(`div`, {
                    className: `flex items-center gap-2`,
                    children: [
                      (0, I.jsx)(`span`, {
                        className: `bg-accent/10 text-accent font-semibold text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider`,
                        children: `Inherited`,
                      }),
                      (0, I.jsxs)(`span`, {
                        className: `text-xs text-text-secondary`,
                        children: [
                          `Using authentication config from `,
                          z === `collection` ? `Collection` : `Folder`,
                          `:`,
                          ` `,
                          (0, I.jsx)(`strong`, { className: `text-text-primary`, children: B }),
                        ],
                      }),
                    ],
                  }),
                  (0, I.jsx)(`button`, {
                    onClick: () => {
                      n(e, { auth: { type: R.type, config: { ...V } } })
                    },
                    className: `text-[11px] text-accent hover:text-accent-hover font-semibold transition-colors`,
                    children: `Override local`,
                  }),
                ],
              }),
            (0, I.jsxs)(`div`, {
              className: `max-w-lg space-y-5`,
              children: [
                (0, I.jsxs)(`div`, {
                  children: [
                    (0, I.jsxs)(`div`, {
                      className: `flex items-center justify-between mb-2`,
                      children: [
                        (0, I.jsx)(`label`, {
                          className: `text-xs font-semibold text-text-secondary uppercase tracking-wider`,
                          children: `Authentication Method`,
                        }),
                        z === `local` &&
                          (0, I.jsx)(`span`, {
                            className: `text-[10px] bg-success/10 text-success font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider`,
                            children: `Local Override`,
                          }),
                      ],
                    }),
                    (0, I.jsxs)(`select`, {
                      value: l.type,
                      onChange: (e) => W(e.target.value),
                      disabled: !!P,
                      className: `w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors cursor-pointer`,
                      children: [
                        (0, I.jsx)(`option`, {
                          value: `none`,
                          children:
                            z !== `local` && z !== `none`
                              ? `Inherit from ${z === `collection` ? `Collection` : `Folder`} (${R.type === `api_key` ? `API Key` : R.type === `bearer_token` ? `Bearer Token` : R.type === `basic` ? `Basic Auth` : R.type === `digest` ? `Digest Auth` : R.type === `oauth2` ? `OAuth 2.0` : R.type === `aws_sigv4` ? `AWS SigV4` : R.type})`
                              : `No Auth`,
                        }),
                        (0, I.jsx)(`option`, { value: `api_key`, children: `API Key` }),
                        (0, I.jsx)(`option`, { value: `bearer_token`, children: `Bearer Token` }),
                        (0, I.jsx)(`option`, { value: `basic`, children: `Basic Auth` }),
                        (0, I.jsx)(`option`, { value: `digest`, children: `Digest Auth` }),
                        (0, I.jsx)(`option`, { value: `oauth2`, children: `OAuth 2.0` }),
                        (0, I.jsx)(`option`, { value: `aws_sigv4`, children: `AWS SigV4` }),
                      ],
                    }),
                  ],
                }),
                R.type === `api_key` &&
                  (0, I.jsxs)(`div`, {
                    className: `space-y-4`,
                    children: [
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `Key Name`,
                          }),
                          (0, I.jsx)(`div`, {
                            className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                            children: (0, I.jsx)(O, {
                              value: V.key || ``,
                              onChange: (e) => K(`key`, e),
                              placeholder: `e.g. X-API-Key`,
                              readOnly: z !== `local`,
                            }),
                          }),
                        ],
                      }),
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `Key Value`,
                          }),
                          (0, I.jsxs)(`div`, {
                            className: `flex gap-2`,
                            children: [
                              (0, I.jsx)(`div`, {
                                className: `flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                children: (0, I.jsx)(O, {
                                  value: V.value || ``,
                                  onChange: (e) => K(`value`, e),
                                  placeholder: `e.g. secret_value or {{my_key}}`,
                                  masked: d,
                                  type: d ? `password` : `text`,
                                  readOnly: z !== `local`,
                                }),
                              }),
                              (0, I.jsx)(`button`, {
                                onClick: () => f(!d),
                                className: `h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors`,
                                title: d ? `Show value` : `Hide value`,
                                children: d
                                  ? (0, I.jsx)(w, { size: 16 })
                                  : (0, I.jsx)(T, { size: 16 }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2`,
                            children: `Add To`,
                          }),
                          (0, I.jsxs)(`select`, {
                            value: V.addTo || `header`,
                            onChange: (e) => K(`addTo`, e.target.value),
                            disabled: z !== `local`,
                            className: `w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors cursor-pointer`,
                            children: [
                              (0, I.jsx)(`option`, { value: `header`, children: `Header` }),
                              (0, I.jsx)(`option`, { value: `query`, children: `Query Parameter` }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                R.type === `bearer_token` &&
                  (0, I.jsx)(`div`, {
                    className: `space-y-4`,
                    children: (0, I.jsxs)(`div`, {
                      children: [
                        (0, I.jsx)(`label`, {
                          className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                          children: `Token`,
                        }),
                        (0, I.jsxs)(`div`, {
                          className: `flex gap-2`,
                          children: [
                            (0, I.jsx)(`div`, {
                              className: `flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                              children: (0, I.jsx)(O, {
                                value: V.token || ``,
                                onChange: (e) => K(`token`, e),
                                onPaste: me,
                                placeholder: `e.g. secret_token or {{my_token}}`,
                                masked: p,
                                type: p ? `password` : `text`,
                                readOnly: z !== `local`,
                              }),
                            }),
                            (0, I.jsx)(`button`, {
                              onClick: () => te(!p),
                              className: `h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors`,
                              title: p ? `Show token` : `Hide token`,
                              children: p
                                ? (0, I.jsx)(w, { size: 16 })
                                : (0, I.jsx)(T, { size: 16 }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                R.type === `basic` &&
                  (0, I.jsxs)(`div`, {
                    className: `space-y-4`,
                    children: [
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `Username`,
                          }),
                          (0, I.jsx)(`div`, {
                            className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                            children: (0, I.jsx)(O, {
                              value: V.username || ``,
                              onChange: (e) => K(`username`, e),
                              placeholder: `Username or {{username_var}}`,
                              readOnly: z !== `local`,
                            }),
                          }),
                        ],
                      }),
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `Password`,
                          }),
                          (0, I.jsxs)(`div`, {
                            className: `flex gap-2`,
                            children: [
                              (0, I.jsx)(`div`, {
                                className: `flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                children: (0, I.jsx)(O, {
                                  value: V.password || ``,
                                  onChange: (e) => K(`password`, e),
                                  placeholder: `Password or {{password_var}}`,
                                  masked: g,
                                  type: g ? `password` : `text`,
                                  readOnly: z !== `local`,
                                }),
                              }),
                              (0, I.jsx)(`button`, {
                                onClick: () => _(!g),
                                className: `h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors`,
                                title: g ? `Show password` : `Hide password`,
                                children: g
                                  ? (0, I.jsx)(w, { size: 16 })
                                  : (0, I.jsx)(T, { size: 16 }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                R.type === `digest` &&
                  (0, I.jsxs)(`div`, {
                    className: `space-y-4`,
                    children: [
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `Username`,
                          }),
                          (0, I.jsx)(`div`, {
                            className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                            children: (0, I.jsx)(O, {
                              value: V.username || ``,
                              onChange: (e) => K(`username`, e),
                              placeholder: `Username or {{username_var}}`,
                              readOnly: z !== `local`,
                            }),
                          }),
                        ],
                      }),
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `Password`,
                          }),
                          (0, I.jsxs)(`div`, {
                            className: `flex gap-2`,
                            children: [
                              (0, I.jsx)(`div`, {
                                className: `flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                children: (0, I.jsx)(O, {
                                  value: V.password || ``,
                                  onChange: (e) => K(`password`, e),
                                  placeholder: `Password or {{password_var}}`,
                                  masked: v,
                                  type: v ? `password` : `text`,
                                  readOnly: z !== `local`,
                                }),
                              }),
                              (0, I.jsx)(`button`, {
                                onClick: () => b(!v),
                                className: `h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors`,
                                title: v ? `Show password` : `Hide password`,
                                children: v
                                  ? (0, I.jsx)(w, { size: 16 })
                                  : (0, I.jsx)(T, { size: 16 }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                R.type === `oauth2` &&
                  (0, I.jsxs)(`div`, {
                    className: `space-y-4`,
                    children: [
                      le &&
                        (0, I.jsxs)(`div`, {
                          className: `bg-error/10 border border-error/30 text-error text-xs rounded-md p-3 flex items-start gap-2.5 animate-in fade-in duration-200`,
                          children: [
                            (0, I.jsxs)(`svg`, {
                              xmlns: `http://www.w3.org/2000/svg`,
                              width: `16`,
                              height: `16`,
                              viewBox: `0 0 24 24`,
                              fill: `none`,
                              stroke: `currentColor`,
                              strokeWidth: `2`,
                              strokeLinecap: `round`,
                              strokeLinejoin: `round`,
                              className: `text-error mt-0.5 shrink-0`,
                              children: [
                                (0, I.jsx)(`circle`, { cx: `12`, cy: `12`, r: `10` }),
                                (0, I.jsx)(`line`, { x1: `12`, y1: `8`, x2: `12`, y2: `12` }),
                                (0, I.jsx)(`line`, { x1: `12`, y1: `16`, x2: `12.01`, y2: `16` }),
                              ],
                            }),
                            (0, I.jsxs)(`div`, {
                              className: `min-w-0 flex-1 break-words whitespace-pre-wrap`,
                              children: [
                                (0, I.jsx)(`div`, {
                                  className: `font-semibold mb-0.5`,
                                  children: `Authentication Error`,
                                }),
                                (0, I.jsx)(`div`, { children: le }),
                              ],
                            }),
                          ],
                        }),
                      ue &&
                        (0, I.jsxs)(`div`, {
                          className: `bg-success/10 border border-success/30 text-success text-xs rounded-md p-3 flex items-start gap-2.5 animate-in fade-in duration-200`,
                          children: [
                            (0, I.jsxs)(`svg`, {
                              xmlns: `http://www.w3.org/2000/svg`,
                              width: `16`,
                              height: `16`,
                              viewBox: `0 0 24 24`,
                              fill: `none`,
                              stroke: `currentColor`,
                              strokeWidth: `2`,
                              strokeLinecap: `round`,
                              strokeLinejoin: `round`,
                              className: `text-success mt-0.5 shrink-0`,
                              children: [
                                (0, I.jsx)(`path`, { d: `M22 11.08V12a10 10 0 1 1-5.93-9.14` }),
                                (0, I.jsx)(`polyline`, { points: `22 4 12 14.01 9 11.01` }),
                              ],
                            }),
                            (0, I.jsxs)(`div`, {
                              children: [
                                (0, I.jsx)(`div`, {
                                  className: `font-semibold mb-0.5`,
                                  children: `Success`,
                                }),
                                (0, I.jsx)(`div`, { children: ue }),
                              ],
                            }),
                          ],
                        }),
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `Grant Type`,
                          }),
                          (0, I.jsxs)(`select`, {
                            value: V.grantType || `authorization_code`,
                            onChange: (e) => K(`grantType`, e.target.value),
                            disabled: z !== `local`,
                            className: `w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors cursor-pointer`,
                            children: [
                              (0, I.jsx)(`option`, {
                                value: `authorization_code`,
                                children: `Authorization Code`,
                              }),
                              (0, I.jsx)(`option`, {
                                value: `client_credentials`,
                                children: `Client Credentials`,
                              }),
                              (0, I.jsx)(`option`, {
                                value: `password`,
                                children: `Resource Owner Password`,
                              }),
                              (0, I.jsx)(`option`, { value: `implicit`, children: `Implicit` }),
                            ],
                          }),
                        ],
                      }),
                      (0, I.jsxs)(`div`, {
                        className: `grid grid-cols-2 gap-4`,
                        children: [
                          (0, I.jsxs)(`div`, {
                            children: [
                              (0, I.jsx)(`label`, {
                                className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                                children: `Client ID`,
                              }),
                              (0, I.jsx)(`div`, {
                                className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                children: (0, I.jsx)(O, {
                                  value: V.clientId || ``,
                                  onChange: (e) => K(`clientId`, e),
                                  placeholder: `Client ID or {{client_id}}`,
                                  readOnly: z !== `local`,
                                }),
                              }),
                            ],
                          }),
                          (0, I.jsxs)(`div`, {
                            children: [
                              (0, I.jsx)(`label`, {
                                className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                                children: `Client Secret`,
                              }),
                              (0, I.jsxs)(`div`, {
                                className: `flex gap-2`,
                                children: [
                                  (0, I.jsx)(`div`, {
                                    className: `flex-grow h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                    children: (0, I.jsx)(O, {
                                      value: V.clientSecret || ``,
                                      onChange: (e) => K(`clientSecret`, e),
                                      placeholder: `Optional Secret or {{client_secret}}`,
                                      masked: x,
                                      type: x ? `password` : `text`,
                                      readOnly: z !== `local`,
                                    }),
                                  }),
                                  (0, I.jsx)(`button`, {
                                    onClick: () => S(!x),
                                    className: `h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0`,
                                    title: x ? `Show secret` : `Hide secret`,
                                    children: x
                                      ? (0, I.jsx)(w, { size: 16 })
                                      : (0, I.jsx)(T, { size: 16 }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (V.grantType === `authorization_code` || V.grantType === `implicit`) &&
                        (0, I.jsxs)(`div`, {
                          className: `space-y-4 animate-in fade-in duration-200`,
                          children: [
                            (0, I.jsxs)(`div`, {
                              children: [
                                (0, I.jsx)(`label`, {
                                  className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                                  children: `Authorization Endpoint`,
                                }),
                                (0, I.jsx)(`div`, {
                                  className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                  children: (0, I.jsx)(O, {
                                    value: V.authEndpoint || ``,
                                    onChange: (e) => K(`authEndpoint`, e),
                                    placeholder: `https://example.com/oauth/authorize`,
                                    readOnly: z !== `local`,
                                  }),
                                }),
                              ],
                            }),
                            (0, I.jsxs)(`div`, {
                              className: `grid grid-cols-2 gap-4`,
                              children: [
                                (0, I.jsxs)(`div`, {
                                  children: [
                                    (0, I.jsx)(`label`, {
                                      className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                                      children: `Redirect URI Mode`,
                                    }),
                                    (0, I.jsxs)(`select`, {
                                      value: V.redirectUriMode || `default`,
                                      onChange: (e) => K(`redirectUriMode`, e.target.value),
                                      disabled: z !== `local`,
                                      className: `w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors cursor-pointer`,
                                      children: [
                                        (0, I.jsx)(`option`, {
                                          value: `default`,
                                          children: `Default Listener (Automatic)`,
                                        }),
                                        (0, I.jsx)(`option`, {
                                          value: `custom`,
                                          children: `Custom Redirect URI`,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                V.redirectUriMode === `custom` &&
                                  (0, I.jsxs)(`div`, {
                                    className: `animate-in slide-in-from-right duration-200`,
                                    children: [
                                      (0, I.jsx)(`label`, {
                                        className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                                        children: `Custom Redirect URI`,
                                      }),
                                      (0, I.jsx)(`div`, {
                                        className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                        children: (0, I.jsx)(O, {
                                          value: V.customRedirectUri || ``,
                                          onChange: (e) => K(`customRedirectUri`, e),
                                          placeholder: `e.g. http://localhost:3000/callback`,
                                          readOnly: z !== `local`,
                                        }),
                                      }),
                                    ],
                                  }),
                              ],
                            }),
                          ],
                        }),
                      V.grantType !== `implicit` &&
                        (0, I.jsxs)(`div`, {
                          children: [
                            (0, I.jsx)(`label`, {
                              className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                              children: `Token Endpoint`,
                            }),
                            (0, I.jsx)(`div`, {
                              className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                              children: (0, I.jsx)(O, {
                                value: V.tokenEndpoint || ``,
                                onChange: (e) => K(`tokenEndpoint`, e),
                                placeholder: `https://example.com/oauth/token`,
                                readOnly: z !== `local`,
                              }),
                            }),
                          ],
                        }),
                      V.grantType === `password` &&
                        (0, I.jsxs)(`div`, {
                          className: `grid grid-cols-2 gap-4`,
                          children: [
                            (0, I.jsxs)(`div`, {
                              children: [
                                (0, I.jsx)(`label`, {
                                  className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                                  children: `Username`,
                                }),
                                (0, I.jsx)(`div`, {
                                  className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                  children: (0, I.jsx)(O, {
                                    value: V.username || ``,
                                    onChange: (e) => K(`username`, e),
                                    placeholder: `Username or {{username}}`,
                                    readOnly: z !== `local`,
                                  }),
                                }),
                              ],
                            }),
                            (0, I.jsxs)(`div`, {
                              children: [
                                (0, I.jsx)(`label`, {
                                  className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                                  children: `Password`,
                                }),
                                (0, I.jsxs)(`div`, {
                                  className: `flex gap-2`,
                                  children: [
                                    (0, I.jsx)(`div`, {
                                      className: `flex-grow h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                      children: (0, I.jsx)(O, {
                                        value: V.password || ``,
                                        onChange: (e) => K(`password`, e),
                                        placeholder: `Password or {{password}}`,
                                        masked: C,
                                        type: C ? `password` : `text`,
                                        readOnly: z !== `local`,
                                      }),
                                    }),
                                    (0, I.jsx)(`button`, {
                                      onClick: () => ne(!C),
                                      className: `h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0`,
                                      title: C ? `Show password` : `Hide password`,
                                      children: C
                                        ? (0, I.jsx)(w, { size: 16 })
                                        : (0, I.jsx)(T, { size: 16 }),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      (0, I.jsxs)(`div`, {
                        className: `grid grid-cols-2 gap-4`,
                        children: [
                          (0, I.jsxs)(`div`, {
                            children: [
                              (0, I.jsx)(`label`, {
                                className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                                children: `Scope`,
                              }),
                              (0, I.jsx)(`div`, {
                                className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                children: (0, I.jsx)(O, {
                                  value: V.scope || ``,
                                  onChange: (e) => K(`scope`, e),
                                  placeholder: `e.g. read write offline_access`,
                                  readOnly: z !== `local`,
                                }),
                              }),
                            ],
                          }),
                          (0, I.jsxs)(`div`, {
                            children: [
                              (0, I.jsx)(`label`, {
                                className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                                children: `Token Prefix`,
                              }),
                              (0, I.jsx)(`div`, {
                                className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                children: (0, I.jsx)(O, {
                                  value: V.tokenHeaderPrefix || ``,
                                  onChange: (e) => K(`tokenHeaderPrefix`, e),
                                  placeholder: `Bearer`,
                                  readOnly: z !== `local`,
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `Additional Parameters (URL encoded)`,
                          }),
                          (0, I.jsx)(`div`, {
                            className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                            children: (0, I.jsx)(O, {
                              value: V.additionalParams || ``,
                              onChange: (e) => K(`additionalParams`, e),
                              placeholder: `e.g. prompt=consent&audience=api`,
                              readOnly: z !== `local`,
                            }),
                          }),
                        ],
                      }),
                      (0, I.jsx)(`div`, {
                        className: `pt-2`,
                        children: (0, I.jsxs)(`button`, {
                          onClick: async () => {
                            ;(j(!0), M(null), N(null))
                            try {
                              let e = await m.oauth2FetchToken({
                                grantType: Q,
                                tokenEndpoint: $ || null,
                                authEndpoint: he || null,
                                clientId: ge || null,
                                clientSecret: _e || null,
                                scope: ve || null,
                                username: ye || null,
                                password: be || null,
                                additionalParams: xe || null,
                                redirectUriMode: Se || null,
                                customRedirectUri: Ce || null,
                                workspacePath: Y,
                                collectionPath:
                                  (J?.collectionId &&
                                    y.getState().collections[J.collectionId]?.path) ||
                                  null,
                                environmentName: X || null,
                                collectionEnvironmentName: Z,
                              })
                              if (e.status === `error`) throw Error(e.error)
                              let t = e.data
                              if (t.accessToken)
                                (q({
                                  accessToken: t.accessToken,
                                  refreshToken: t.refreshToken || ``,
                                  expiresAt: t.expiresAt || ``,
                                }),
                                  N(`Access Token successfully acquired!`))
                              else throw Error(`No access_token returned by backend.`)
                            } catch (e) {
                              ;(console.error(e), M(e.message || `Failed to fetch access token.`))
                            } finally {
                              j(!1)
                            }
                          },
                          disabled: A || z !== `local`,
                          className: `w-full h-9 bg-accent hover:bg-accent-hover text-accent-fg disabled:bg-bg-muted disabled:text-text-muted rounded flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm select-none`,
                          children: [
                            A
                              ? (0, I.jsxs)(`svg`, {
                                  className: `animate-spin h-4 w-4 text-current`,
                                  xmlns: `http://www.w3.org/2000/svg`,
                                  fill: `none`,
                                  viewBox: `0 0 24 24`,
                                  children: [
                                    (0, I.jsx)(`circle`, {
                                      className: `opacity-25`,
                                      cx: `12`,
                                      cy: `12`,
                                      r: `10`,
                                      stroke: `currentColor`,
                                      strokeWidth: `4`,
                                    }),
                                    (0, I.jsx)(`path`, {
                                      className: `opacity-75`,
                                      fill: `currentColor`,
                                      d: `M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z`,
                                    }),
                                  ],
                                })
                              : (0, I.jsxs)(`svg`, {
                                  xmlns: `http://www.w3.org/2000/svg`,
                                  width: `14`,
                                  height: `14`,
                                  viewBox: `0 0 24 24`,
                                  fill: `none`,
                                  stroke: `currentColor`,
                                  strokeWidth: `2.5`,
                                  strokeLinecap: `round`,
                                  strokeLinejoin: `round`,
                                  children: [
                                    (0, I.jsx)(`path`, { d: `M15 3h6v6` }),
                                    (0, I.jsx)(`path`, { d: `M10 14 21 3` }),
                                    (0, I.jsx)(`path`, {
                                      d: `M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6`,
                                    }),
                                  ],
                                }),
                            A ? `Retrieving Token...` : `Get New Access Token`,
                          ],
                        }),
                      }),
                      (V.accessToken || V.refreshToken) &&
                        (0, I.jsxs)(`div`, {
                          className: `bg-bg-panel/40 border border-border-subtle rounded-lg p-4 space-y-3.5`,
                          children: [
                            (0, I.jsxs)(`div`, {
                              className: `flex items-center justify-between border-b border-border-subtle pb-2`,
                              children: [
                                (0, I.jsx)(`span`, {
                                  className: `text-[11px] font-bold text-text-secondary uppercase tracking-wider`,
                                  children: `Current Token Status`,
                                }),
                                V.expiresAt &&
                                  (0, I.jsxs)(`span`, {
                                    className: `text-[10px] text-text-muted font-medium bg-bg-muted px-2 py-0.5 rounded`,
                                    children: [
                                      `Expires:`,
                                      ` `,
                                      new Date(parseInt(V.expiresAt) * 1e3).toLocaleString(),
                                    ],
                                  }),
                              ],
                            }),
                            V.accessToken &&
                              (0, I.jsxs)(`div`, {
                                className: `space-y-1`,
                                children: [
                                  (0, I.jsxs)(`div`, {
                                    className: `flex items-center justify-between`,
                                    children: [
                                      (0, I.jsx)(`label`, {
                                        className: `text-[10px] font-semibold text-text-muted uppercase`,
                                        children: `Access Token`,
                                      }),
                                      (0, I.jsx)(`button`, {
                                        onClick: () => ie(!re),
                                        className: `text-[10px] text-accent hover:text-accent-hover font-semibold transition-colors flex items-center gap-1 select-none`,
                                        children: re ? `Reveal` : `Mask`,
                                      }),
                                    ],
                                  }),
                                  (0, I.jsx)(`div`, {
                                    className: `font-mono text-xs text-text-primary bg-bg-surface border border-border-default rounded p-2 overflow-x-auto whitespace-pre-wrap break-all max-h-24`,
                                    children: re ? `•`.repeat(32) : V.accessToken,
                                  }),
                                ],
                              }),
                            V.refreshToken &&
                              (0, I.jsxs)(`div`, {
                                className: `space-y-1`,
                                children: [
                                  (0, I.jsxs)(`div`, {
                                    className: `flex items-center justify-between`,
                                    children: [
                                      (0, I.jsx)(`label`, {
                                        className: `text-[10px] font-semibold text-text-muted uppercase`,
                                        children: `Refresh Token`,
                                      }),
                                      (0, I.jsx)(`button`, {
                                        onClick: () => oe(!E),
                                        className: `text-[10px] text-accent hover:text-accent-hover font-semibold transition-colors flex items-center gap-1 select-none`,
                                        children: E ? `Reveal` : `Mask`,
                                      }),
                                    ],
                                  }),
                                  (0, I.jsx)(`div`, {
                                    className: `font-mono text-xs text-text-secondary bg-bg-surface/50 border border-border-default rounded p-2 overflow-x-auto whitespace-pre-wrap break-all max-h-16`,
                                    children: E ? `•`.repeat(24) : V.refreshToken,
                                  }),
                                ],
                              }),
                            z === `local` &&
                              (0, I.jsxs)(`div`, {
                                className: `flex gap-2.5 pt-1.5`,
                                children: [
                                  V.refreshToken &&
                                    V.tokenEndpoint &&
                                    (0, I.jsxs)(`button`, {
                                      onClick: async () => {
                                        if (!(!we || !$ || !ge)) {
                                          ;(j(!0), M(null), N(null))
                                          try {
                                            let e = await m.oauth2RefreshToken({
                                              refreshToken: we,
                                              tokenEndpoint: $,
                                              clientId: ge,
                                              clientSecret: _e || null,
                                              additionalParams: xe || null,
                                              workspacePath: Y,
                                              collectionPath:
                                                (J?.collectionId &&
                                                  y.getState().collections[J.collectionId]?.path) ||
                                                null,
                                              environmentName: X || null,
                                              collectionEnvironmentName: Z,
                                            })
                                            if (e.status === `error`) throw Error(e.error)
                                            let t = e.data
                                            if (t.accessToken)
                                              (q({
                                                accessToken: t.accessToken,
                                                refreshToken: t.refreshToken || we,
                                                expiresAt: t.expiresAt || ``,
                                              }),
                                                N(`Access Token successfully refreshed!`))
                                            else
                                              throw Error(
                                                `No access_token returned by backend during refresh.`
                                              )
                                          } catch (e) {
                                            ;(console.error(e),
                                              M(e.message || `Failed to refresh access token.`))
                                          } finally {
                                            j(!1)
                                          }
                                        }
                                      },
                                      disabled: A,
                                      className: `flex-1 h-8 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong text-text-primary rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 select-none`,
                                      children: [
                                        (0, I.jsx)(`svg`, {
                                          xmlns: `http://www.w3.org/2000/svg`,
                                          width: `12`,
                                          height: `12`,
                                          viewBox: `0 0 24 24`,
                                          fill: `none`,
                                          stroke: `currentColor`,
                                          strokeWidth: `2`,
                                          strokeLinecap: `round`,
                                          strokeLinejoin: `round`,
                                          children: (0, I.jsx)(`path`, {
                                            d: `M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67`,
                                          }),
                                        }),
                                        `Refresh Token`,
                                      ],
                                    }),
                                  (0, I.jsxs)(`button`, {
                                    onClick: () => {
                                      ;(q({ accessToken: ``, refreshToken: ``, expiresAt: `` }),
                                        N(null),
                                        M(null))
                                    },
                                    className: `flex-grow h-8 bg-error/10 hover:bg-error/20 border border-error/20 text-error rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 select-none`,
                                    children: [
                                      (0, I.jsx)(`svg`, {
                                        xmlns: `http://www.w3.org/2000/svg`,
                                        width: `12`,
                                        height: `12`,
                                        viewBox: `0 0 24 24`,
                                        fill: `none`,
                                        stroke: `currentColor`,
                                        strokeWidth: `2.5`,
                                        strokeLinecap: `round`,
                                        strokeLinejoin: `round`,
                                        children: (0, I.jsx)(`path`, {
                                          d: `M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2`,
                                        }),
                                      }),
                                      `Clear Token`,
                                    ],
                                  }),
                                ],
                              }),
                          ],
                        }),
                    ],
                  }),
                R.type === `aws_sigv4` &&
                  (0, I.jsxs)(`div`, {
                    className: `space-y-4 animate-in fade-in duration-200`,
                    children: [
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `AWS Region`,
                          }),
                          (0, I.jsx)(`div`, {
                            className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                            children: (0, I.jsx)(O, {
                              value: V.region || ``,
                              onChange: (e) => K(`region`, e),
                              placeholder: `us-east-1 or {{aws_region}}`,
                              readOnly: z !== `local`,
                            }),
                          }),
                        ],
                      }),
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `Service Name`,
                          }),
                          (0, I.jsx)(`div`, {
                            className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                            children: (0, I.jsx)(O, {
                              value: V.service || ``,
                              onChange: (e) => K(`service`, e),
                              placeholder: `s3, execute-api, iam or {{aws_service}}`,
                              readOnly: z !== `local`,
                            }),
                          }),
                        ],
                      }),
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `Access Key ID`,
                          }),
                          (0, I.jsx)(`div`, {
                            className: `h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                            children: (0, I.jsx)(O, {
                              value: V.accessKeyId || ``,
                              onChange: (e) => K(`accessKeyId`, e),
                              placeholder: `AKIAIOSFODNN7EXAMPLE or {{aws_access_key}}`,
                              readOnly: z !== `local`,
                            }),
                          }),
                        ],
                      }),
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `Secret Access Key`,
                          }),
                          (0, I.jsxs)(`div`, {
                            className: `flex gap-2`,
                            children: [
                              (0, I.jsx)(`div`, {
                                className: `flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                children: (0, I.jsx)(O, {
                                  value: V.secretAccessKey || ``,
                                  onChange: (e) => K(`secretAccessKey`, e),
                                  placeholder: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY or {{aws_secret_key}}`,
                                  masked: D,
                                  type: D ? `password` : `text`,
                                  readOnly: z !== `local`,
                                }),
                              }),
                              (0, I.jsx)(`button`, {
                                onClick: () => se(!D),
                                className: `h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0`,
                                title: D ? `Show secret key` : `Hide secret key`,
                                children: D
                                  ? (0, I.jsx)(w, { size: 16 })
                                  : (0, I.jsx)(T, { size: 16 }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, I.jsxs)(`div`, {
                        children: [
                          (0, I.jsx)(`label`, {
                            className: `block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5`,
                            children: `Session Token (Optional)`,
                          }),
                          (0, I.jsxs)(`div`, {
                            className: `flex gap-2`,
                            children: [
                              (0, I.jsx)(`div`, {
                                className: `flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden`,
                                children: (0, I.jsx)(O, {
                                  value: V.sessionToken || ``,
                                  onChange: (e) => K(`sessionToken`, e),
                                  placeholder: `Session token (optional) or {{aws_session_token}}`,
                                  masked: k,
                                  type: k ? `password` : `text`,
                                  readOnly: z !== `local`,
                                }),
                              }),
                              (0, I.jsx)(`button`, {
                                onClick: () => ce(!k),
                                className: `h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0`,
                                title: k ? `Show session token` : `Hide session token`,
                                children: k
                                  ? (0, I.jsx)(w, { size: 16 })
                                  : (0, I.jsx)(T, { size: 16 }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                R.type === `none` &&
                  (0, I.jsx)(`div`, {
                    className: `h-[120px] flex items-center justify-center border border-dashed border-border-subtle rounded-lg p-6 bg-bg-panel/10`,
                    children: (0, I.jsx)(`span`, {
                      className: `text-xs text-text-muted text-center max-w-[280px]`,
                      children: `No active authentication method configured. Choose an auth method above or configure settings on parent ancestors.`,
                    }),
                  }),
              ],
            }),
          ],
        })
      }),
      (L.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `AuthTab`,
        props: { requestId: { required: !0, tsType: { name: `string` }, description: `` } },
      }))
  }),
  z,
  B,
  V,
  fe = t(() => {
    ;((z = e(p(), 1)),
      C(),
      ce(),
      M(),
      j(),
      se(),
      E(),
      d(),
      x(),
      l(),
      P(),
      r(),
      a(),
      S(),
      b(),
      f(),
      u(),
      R(),
      (B = _()),
      (V = () => {
        let { tabs: e, activeTab: t, activeTabId: n, updateTab: r } = ae(),
          { openSaveToCollectionDialog: a, openGenerateCodeModal: s } = v(),
          { activeWorkspacePath: l } = i(),
          { updateRequest: u, setInFlight: d } = h(),
          { setResponse: f, setVisualization: p, clearVisualization: te } = g(),
          _ = h((e) => (n ? e.requestStates[n] || e.getRequestState(n) : null)),
          { collections: b } = y(),
          { disabled: x, disabledReason: S } = (0, z.useMemo)(() => {
            if (!n || !_) return { disabled: !1 }
            let { auth: t } = de(n, e, b, _.auth || { type: `none`, config: {} }),
              r = t.config || {}
            if (t.type === `bearer_token`) {
              if (!(r.token || ``).trim())
                return { disabled: !0, disabledReason: `Bearer Token is empty` }
            } else if (t.type === `api_key`) {
              let e = r.key || ``,
                t = r.value || ``
              if (!e.trim() || !t.trim())
                return { disabled: !0, disabledReason: `API Key auth is incomplete` }
            }
            return { disabled: !1 }
          }, [n, _, e, b]),
          C = (0, z.useCallback)(async () => {
            if (!n || !t || !_ || _.inFlight) return
            let e = _.url.trim()
            if (e)
              try {
                let { activeEnvironmentName: r } = o.getState(),
                  i = t.collectionId || null,
                  a = i ? (ee.getState().activeCollectionEnvName[i] ?? null) : null,
                  s = crypto.randomUUID()
                ;(d(n, !0, s), te(n))
                let c = (e) =>
                    e === `form-data` ? `form_data` : e === `url-encoded` ? `url_encoded` : e,
                  u = null
                _.auth && _.auth.type !== `none` && (u = { type: _.auth.type, ..._.auth.config })
                let h = {
                    request_id: s,
                    request_name: t.name,
                    method: _.method,
                    url: e,
                    headers: _.headers.filter(
                      (e) => e.enabled && (e.key.trim() !== `` || e.value.trim() !== ``)
                    ),
                    auth: u,
                    body:
                      _.body.type === `none`
                        ? null
                        : {
                            active_type: c(_.body.type),
                            json: _.body.type === `json` ? _.body.json : null,
                            raw_text: _.body.type === `raw` ? _.body.rawText : null,
                            raw_subtype: _.body.type === `raw` ? _.body.rawSubtype : null,
                            form_data:
                              _.body.type === `form-data`
                                ? _.body.formFields.map((e) => ({
                                    key: e.key,
                                    value: e.value,
                                    is_file: e.isFile,
                                    file_path: e.filePath,
                                    enabled: e.enabled,
                                  }))
                                : null,
                            url_encoded:
                              _.body.type === `url-encoded`
                                ? _.body.urlEncodedFields.map((e) => ({
                                    key: e.key,
                                    value: e.value,
                                    enabled: e.enabled,
                                  }))
                                : null,
                            file_path: _.body.type === `file` ? _.body.filePath : null,
                            file_filter: _.body.type === `file` ? _.body.fileFilter : null,
                            text: null,
                            form: null,
                          },
                    settings: {
                      timeout: _.settings?.timeout || null,
                      redirect_behavior:
                        _.settings?.redirectBehavior === `default`
                          ? null
                          : _.settings?.redirectBehavior || null,
                    },
                  },
                  v = {
                    workspace_path: l,
                    collection_path: t.collectionId || null,
                    environment_name: r,
                    collection_environment_name: a,
                    request_path: t.requestPath,
                  },
                  y = await m.sendRequest(h, v),
                  b = (e) => {
                    let t = _.scripts.post.trim()
                    t && p(n, N(t, e))
                  }
                if (y.status === `ok`) {
                  let e = y.data,
                    t = {
                      requestId: n,
                      status: e.status_code || 0,
                      statusText: e.status_text || (e.error ? `Error` : `Unknown`),
                      headers: e.headers || {},
                      body: e.response_body || ``,
                      durationMs: e.duration_ms || 0,
                      bodySize: e.response_body ? new Blob([e.response_body]).size : 0,
                      error: e.error || void 0,
                      redirectChain: e.redirect_chain || void 0,
                    }
                  ;(f(n, t),
                    b(t),
                    _.method.toUpperCase() === `HEAD` && g.getState().setActiveTab(n, `headers`))
                } else {
                  let e = {
                    requestId: n,
                    status: 0,
                    statusText: `Error`,
                    headers: {},
                    body: ``,
                    durationMs: 0,
                    bodySize: 0,
                    error: y.error,
                  }
                  ;(f(n, e), b(e))
                }
              } catch (e) {
                c.error(`IPC Error: ${String(e)}`)
              } finally {
                d(n, !1, null)
              }
          }, [n, t, _, d, l, f, p, te]),
          w = (0, z.useCallback)(() => {
            !n ||
              !_?.requestId ||
              (m.cancelRequest(_.requestId).catch(console.error), d(n, !1, null))
          }, [n, _, d])
        return (
          (0, z.useEffect)(() => {
            let e = (e) => {
                ;(e.metaKey || e.ctrlKey) && e.key === `Enter` && (e.preventDefault(), C())
              },
              t = () => C()
            return (
              window.addEventListener(`keydown`, e),
              window.addEventListener(`cortex:send-request`, t),
              () => {
                ;(window.removeEventListener(`keydown`, e),
                  window.removeEventListener(`cortex:send-request`, t))
              }
            )
          }, [C]),
          !n || !_
            ? null
            : (0, B.jsxs)(`div`, {
                className: `min-h-11 border-b border-border-subtle flex items-center px-2 gap-2 shrink-0 bg-bg-panel py-1.5`,
                children: [
                  (0, B.jsx)(A, {
                    method: _.method,
                    onChange: (e) => {
                      ;(u(n, { method: e }), r(n, { method: e }))
                    },
                  }),
                  (0, B.jsx)(ue, { value: _.url, onChange: (e) => u(n, { url: e }), onEnter: C }),
                  (0, B.jsxs)(`div`, {
                    className: `flex items-center gap-1`,
                    children: [
                      t?.type === `request` &&
                        !t.requestPath &&
                        (0, B.jsx)(k, {
                          content: `Save to collection`,
                          children: (0, B.jsx)(`button`, {
                            onClick: () => n && a(n),
                            className: `w-7 h-7 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors`,
                            children: (0, B.jsx)(ne, { size: 14 }),
                          }),
                        }),
                      (0, B.jsx)(k, {
                        content: `Generate code snippet`,
                        children: (0, B.jsx)(`button`, {
                          onClick: () =>
                            t?.requestPath &&
                            s(t.requestPath, t.name || ``, t.collectionId ?? null),
                          className: `w-7 h-7 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors`,
                          children: (0, B.jsx)(re, { size: 14 }),
                        }),
                      }),
                      (0, B.jsx)(k, {
                        content: `Copy URL`,
                        children: (0, B.jsx)(`button`, {
                          onClick: () => {
                            _?.url && navigator.clipboard.writeText(_.url)
                          },
                          className: `w-7 h-7 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors`,
                          children: (0, B.jsx)(ie, { size: 14 }),
                        }),
                      }),
                    ],
                  }),
                  (0, B.jsx)(le, {
                    inFlight: _.inFlight,
                    onSend: C,
                    onCancel: w,
                    disabled: x,
                    disabledReason: S,
                  }),
                ],
              })
        )
      }),
      (V.__docgenInfo = { description: ``, methods: [], displayName: `UrlBar` }))
  }),
  pe = n({
    EmptyUrl: () => Y,
    InFlight: () => Q,
    VariableSegments: () => Z,
    WithUrl: () => X,
    __namedExportsOrder: () => $,
    default: () => J,
  })
function H(e = {}) {
  ;(localStorage.setItem(`cortex.tabs.list`, JSON.stringify([q])),
    localStorage.setItem(`cortex.tabs.activeId`, K),
    te(),
    h.setState({ requestStates: { [K]: { ...me, ...e } } }),
    s(),
    i.setState({ activeWorkspacePath: `/mock/workspace` }))
}
var U,
  W,
  G,
  K,
  q,
  me,
  J,
  Y,
  X,
  Z,
  Q,
  $,
  he = t(() => {
    ;(p(),
      fe(),
      E(),
      d(),
      x(),
      (U = _()),
      ({ expect: W, within: G } = __STORYBOOK_MODULE_TEST__),
      (K = `story-urlbar-tab-001`),
      (q = {
        id: K,
        type: `request`,
        name: `Story Request`,
        method: `GET`,
        requestPath: null,
        collectionId: null,
        collectionPath: null,
        folderPath: null,
        exampleId: null,
        isDirty: !1,
      }),
      (me = {
        name: `Story Request`,
        url: ``,
        method: `GET`,
        params: [],
        headers: [],
        body: {
          type: `none`,
          json: ``,
          rawText: ``,
          rawSubtype: `text`,
          formFields: [],
          urlEncodedFields: [],
          filePath: null,
          fileFilter: ``,
        },
        auth: { type: `none`, config: {} },
        scripts: { pre: ``, post: `` },
        tests: ``,
        settings: { timeout: ``, redirectBehavior: `default` },
        tags: [],
        activeComposerTab: `params`,
        inFlight: !1,
        requestId: null,
      }),
      (J = {
        title: `layout/UrlBar`,
        component: V,
        parameters: {
          layout: `fullscreen`,
          tauriMock: {
            send_request: () => ({
              status_code: 200,
              status_text: `OK`,
              headers: {},
              response_body: ``,
              duration_ms: 0,
              error: null,
              redirect_chain: null,
            }),
            cancel_request: () => void 0,
          },
          docs: {
            description: {
              component: `The request URL bar — combines a MethodSelector dropdown, a UrlInput with live variable highlighting, icon action buttons (Save, Generate code, Copy URL), and a SendButton. These stories render the bar in display-only mode by seeding store state; no real HTTP requests are made.`,
            },
          },
        },
        decorators: [
          (e) =>
            (0, U.jsx)(oe, {
              children: (0, U.jsx)(`div`, {
                className: `flex flex-col bg-bg-panel`,
                style: { width: `100%` },
                children: (0, U.jsx)(e, {}),
              }),
            }),
        ],
      }),
      (Y = {
        beforeEach: () => {
          H({ url: ``, method: `GET` })
        },
        play: async ({ canvasElement: e }) => {
          await W(G(e).getByText(`GET`)).toBeInTheDocument()
        },
      }),
      (X = {
        beforeEach: () => {
          H({ url: `https://api.example.com/users`, method: `GET` })
        },
        play: async ({ canvasElement: e }) => {
          await W(G(e).getByText(`GET`)).toBeInTheDocument()
        },
      }),
      (Z = {
        beforeEach: () => {
          H({ url: `https://{{baseUrl}}/users/{{userId}}/posts`, method: `POST` })
        },
        play: async ({ canvasElement: e }) => {
          await W(G(e).getByText(`POST`)).toBeInTheDocument()
        },
      }),
      (Q = {
        beforeEach: () => {
          H({
            url: `https://api.example.com/slow-endpoint`,
            method: `GET`,
            inFlight: !0,
            requestId: `mock-request-id-001`,
          })
        },
        play: async ({ canvasElement: e }) => {
          await W(G(e).getByText(`Cancel`)).toBeInTheDocument()
        },
      }),
      (Y.parameters = {
        ...Y.parameters,
        docs: {
          ...Y.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    seedTab({
      url: '',
      method: 'GET'
    });
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('GET')).toBeInTheDocument();
  }
}`,
            ...Y.parameters?.docs?.source,
          },
          description: {
            story: `EmptyUrl — the URL bar with no URL entered.
Shows the method selector (GET), the empty UrlInput placeholder, and the Send button.`,
            ...Y.parameters?.docs?.description,
          },
        },
      }),
      (X.parameters = {
        ...X.parameters,
        docs: {
          ...X.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    seedTab({
      url: 'https://api.example.com/users',
      method: 'GET'
    });
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('GET')).toBeInTheDocument();
  }
}`,
            ...X.parameters?.docs?.source,
          },
          description: {
            story: `WithUrl — a fully-formed URL with no variables.
Shows the method selector, the URL text, and the active Send button.`,
            ...X.parameters?.docs?.description,
          },
        },
      }),
      (Z.parameters = {
        ...Z.parameters,
        docs: {
          ...Z.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    seedTab({
      url: 'https://{{baseUrl}}/users/{{userId}}/posts',
      method: 'POST'
    });
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('POST')).toBeInTheDocument();
  }
}`,
            ...Z.parameters?.docs?.source,
          },
          description: {
            story: `VariableSegments — a URL containing \`{{variable}}\` placeholders.
UrlInput renders an overlay with coloured spans for each variable token
(resolved variables in one colour, unresolved in another).`,
            ...Z.parameters?.docs?.description,
          },
        },
      }),
      (Q.parameters = {
        ...Q.parameters,
        docs: {
          ...Q.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    seedTab({
      url: 'https://api.example.com/slow-endpoint',
      method: 'GET',
      inFlight: true,
      requestId: 'mock-request-id-001'
    });
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Cancel')).toBeInTheDocument();
  }
}`,
            ...Q.parameters?.docs?.source,
          },
          description: {
            story: `InFlight — the URL bar while a request is in progress.
The Send button switches to a red Cancel button.`,
            ...Q.parameters?.docs?.description,
          },
        },
      }),
      ($ = [`EmptyUrl`, `WithUrl`, `VariableSegments`, `InFlight`]))
  })
he()
export {
  Y as EmptyUrl,
  Q as InFlight,
  Z as VariableSegments,
  X as WithUrl,
  $ as __namedExportsOrder,
  J as default,
  he as n,
  pe as t,
}
