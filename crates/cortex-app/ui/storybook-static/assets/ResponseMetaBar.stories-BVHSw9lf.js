import { a as e, n as t, r as n } from './chunk-DnJy8xQt.js'
import { A as r, a as i, gt as a, k as o, o as s, s as c, t as l } from './iframe-CECvvSLk.js'
import { O as u, a as d, c as f, s as p } from './Icons-DjzhDYF3.js'
import { n as m, t as h } from './Tooltip-D06fzBd3.js'
function g(e) {
  let t = e.split(`;`)
  for (let e of t) {
    let t = e.trim()
    if (t.toLowerCase().startsWith(`boundary=`)) {
      let e = t.substring(9)
      return (e.startsWith(`"`) && e.endsWith(`"`) && (e = e.substring(1, e.length - 1)), e)
    }
  }
  return null
}
function _(e, t) {
  let n = g(t)
  if (!n) throw Error(`Missing "boundary" parameter in Content-Type header.`)
  let r = `--${n}`
  if (!e.includes(r)) throw Error(`Boundary marker "${r}" not found in response body.`)
  let i = e.split(r),
    a = []
  for (let e = 1; e < i.length; e++) {
    let t = i[e],
      n = t.trim()
    if (n === `--` || n === `` || n.startsWith(`--`)) continue
    let r = ``,
      o,
      s = t.indexOf(`\r
\r
`)
    if (s !== -1) ((r = t.substring(0, s)), (o = t.substring(s + 4)))
    else {
      let e = t.indexOf(`

`)
      e === -1 ? (o = t) : ((r = t.substring(0, e)), (o = t.substring(e + 2)))
    }
    ;(r.startsWith(`\r
`)
      ? (r = r.substring(2))
      : r.startsWith(`
`) && (r = r.substring(1)),
      o.endsWith(`\r
`)
        ? (o = o.substring(0, o.length - 2))
        : o.endsWith(`
`) && (o = o.substring(0, o.length - 1)))
    let c = {},
      l = r.split(/\r?\n/)
    for (let e of l) {
      let t = e.trim()
      if (!t) continue
      let n = t.indexOf(`:`)
      if (n !== -1) {
        let e = t.substring(0, n).trim().toLowerCase()
        c[e] = t.substring(n + 1).trim()
      }
    }
    a.push({ headers: c, body: o })
  }
  if (a.length === 0) throw Error(`No parts parsed from multipart response body.`)
  return a
}
var v = t(() => {}),
  y,
  b,
  x,
  S = t(() => {
    ;((y = e(a(), 1)),
      u(),
      m(),
      i(),
      r(),
      v(),
      (b = l()),
      (x = ({ response: e, inFlight: t, requestId: n }) => {
        let [r, i] = y.useState(!1),
          a = y.useRef(null),
          s = e?.headers[`content-type`] || e?.headers[`Content-Type`] || ``,
          l =
            s.toLowerCase().includes(`multipart/mixed`) ||
            s.toLowerCase().includes(`multipart/form-data`),
          u = y.useMemo(() => {
            if (!l || !e) return 0
            try {
              return _(e.body, s).length
            } catch {
              return 0
            }
          }, [l, e, s]),
          m = c((e) => e.multipartEnabled[n] ?? !1),
          g = c((e) => e.setMultipartEnabled)
        y.useEffect(() => {
          let e = (e) => {
            a.current && !a.current.contains(e.target) && i(!1)
          }
          return (
            document.addEventListener(`mousedown`, e),
            () => document.removeEventListener(`mousedown`, e)
          )
        }, [])
        let v = (e) =>
          e >= 200 && e < 300
            ? `bg-success-muted text-success border-success/20`
            : e >= 300 && e < 400
              ? `bg-warning-muted text-warning border-warning/20`
              : `bg-error-muted text-error border-error/20`
        return (0, b.jsx)(`div`, {
          className: `h-9 border-b border-border-subtle flex items-center px-3 gap-4 shrink-0 bg-bg-panel`,
          children: t
            ? (0, b.jsxs)(`div`, {
                className: `flex items-center gap-3 w-full`,
                children: [
                  (0, b.jsx)(`div`, { className: `h-5 w-16 bg-bg-muted rounded animate-pulse` }),
                  (0, b.jsx)(`div`, { className: `h-4 w-12 bg-bg-muted rounded animate-pulse` }),
                  (0, b.jsx)(`div`, { className: `h-4 w-12 bg-bg-muted rounded animate-pulse` }),
                ],
              })
            : e
              ? (0, b.jsxs)(b.Fragment, {
                  children: [
                    (0, b.jsxs)(`div`, {
                      className: `flex items-center gap-2 relative`,
                      ref: a,
                      children: [
                        e.redirectChain && e.redirectChain.length > 0
                          ? (0, b.jsxs)(b.Fragment, {
                              children: [
                                (0, b.jsxs)(`button`, {
                                  onClick: () => i(!r),
                                  className: `flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11px] font-semibold border bg-warning/10 text-warning border-warning/20 hover:bg-warning/20 transition-colors select-none`,
                                  children: [
                                    (0, b.jsxs)(`span`, {
                                      children: [
                                        e.redirectChain.length,
                                        ` `,
                                        e.redirectChain.length === 1 ? `redirect` : `redirects`,
                                      ],
                                    }),
                                    (0, b.jsx)(d, {
                                      size: 10,
                                      className: `transform transition-transform ${r ? `rotate-180` : ``}`,
                                    }),
                                    (0, b.jsx)(`span`, { children: `→` }),
                                    (0, b.jsx)(`span`, {
                                      className: `font-extrabold px-1.5 py-0.2 rounded-sm border ${v(e.status)}`,
                                      children: e.status,
                                    }),
                                  ],
                                }),
                                r &&
                                  (0, b.jsxs)(`div`, {
                                    className: `absolute top-full left-0 mt-1 w-80 bg-bg-overlay border border-border-subtle rounded-md shadow-lg z-50 p-3 flex flex-col gap-2 font-sans text-xs`,
                                    children: [
                                      (0, b.jsx)(`div`, {
                                        className: `font-semibold text-text-primary border-b border-border-subtle pb-1`,
                                        children: `Redirect History`,
                                      }),
                                      (0, b.jsx)(`div`, {
                                        className: `max-h-60 overflow-y-auto flex flex-col gap-1.5 no-scrollbar`,
                                        children: e.redirectChain.map((e, t) =>
                                          (0, b.jsxs)(
                                            `div`,
                                            {
                                              className: `flex items-center gap-2 py-1 border-b border-border-subtle/30 last:border-b-0 font-mono text-[11px]`,
                                              children: [
                                                (0, b.jsxs)(`span`, {
                                                  className: `text-[10px] text-text-muted shrink-0`,
                                                  children: [`#`, t + 1],
                                                }),
                                                (0, b.jsx)(`span`, {
                                                  className: `text-[10px] font-bold uppercase px-1 py-0.2 bg-bg-muted rounded text-accent shrink-0`,
                                                  children: e.method,
                                                }),
                                                (0, b.jsx)(`span`, {
                                                  className: `truncate text-text-primary flex-1 max-w-[150px]`,
                                                  title: e.url,
                                                  children: e.url,
                                                }),
                                                (0, b.jsx)(`span`, {
                                                  className: `font-bold shrink-0 text-[11px] ${e.status_code >= 200 && e.status_code < 300 ? `text-success` : e.status_code >= 300 && e.status_code < 400 ? `text-warning` : `text-error`}`,
                                                  children: e.status_code,
                                                }),
                                              ],
                                            },
                                            t
                                          )
                                        ),
                                      }),
                                    ],
                                  }),
                              ],
                            })
                          : (0, b.jsx)(`span`, {
                              className: `px-1.5 py-0.5 rounded-sm text-[11px] font-bold border ${v(e.status)}`,
                              children: e.status,
                            }),
                        (0, b.jsx)(`span`, {
                          className: `text-sm text-text-secondary font-medium`,
                          children: e.statusText,
                        }),
                      ],
                    }),
                    (0, b.jsxs)(`div`, {
                      className: `flex items-center gap-4`,
                      children: [
                        (0, b.jsx)(`div`, {
                          className: `flex flex-col`,
                          children: (0, b.jsxs)(`span`, {
                            className: `text-[11px] font-mono leading-tight ${((e) => (e <= 200 ? `text-success` : e <= 1e3 ? `text-warning` : `text-error`))(e.durationMs)}`,
                            children: [e.durationMs, ` ms`],
                          }),
                        }),
                        (0, b.jsx)(`div`, {
                          className: `flex flex-col`,
                          children: (0, b.jsx)(`span`, {
                            className: `text-[11px] font-mono leading-tight text-text-muted`,
                            children: ((e) =>
                              e < 1024
                                ? `${e} B`
                                : e < 1024 * 1024
                                  ? `${(e / 1024).toFixed(1)} KB`
                                  : `${(e / (1024 * 1024)).toFixed(1)} MB`)(e.bodySize),
                          }),
                        }),
                        u > 0 &&
                          (0, b.jsx)(`div`, {
                            className: `flex flex-col`,
                            children: (0, b.jsxs)(`span`, {
                              className: `text-[11px] font-mono leading-tight text-text-muted bg-bg-muted px-1.5 py-0.5 rounded border border-border-subtle/50`,
                              children: [u, ` `, u === 1 ? `part` : `parts`],
                            }),
                          }),
                      ],
                    }),
                    (0, b.jsx)(`div`, { className: `flex-1` }),
                    (0, b.jsxs)(`div`, {
                      className: `flex items-center gap-2`,
                      children: [
                        l &&
                          (0, b.jsxs)(`label`, {
                            className: `flex items-center gap-1.5 text-[11px] text-text-secondary select-none cursor-pointer hover:text-text-primary mr-2`,
                            children: [
                              (0, b.jsx)(`input`, {
                                type: `checkbox`,
                                checked: m,
                                onChange: (e) => g(n, e.target.checked),
                                className: `rounded border-border-subtle bg-bg-surface text-accent focus:ring-accent w-3.5 h-3.5 cursor-pointer`,
                              }),
                              (0, b.jsx)(`span`, { children: `Parse Multipart` }),
                            ],
                          }),
                        (0, b.jsxs)(`div`, {
                          className: `flex items-center gap-1`,
                          children: [
                            (0, b.jsx)(h, {
                              content: `Copy raw response`,
                              position: `left`,
                              children: (0, b.jsx)(`button`, {
                                onClick: () => {
                                  e?.body && navigator.clipboard.writeText(e.body)
                                },
                                className: `w-7 h-7 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors`,
                                children: (0, b.jsx)(p, { size: 14 }),
                              }),
                            }),
                            (0, b.jsx)(h, {
                              content: `Save response body`,
                              position: `left`,
                              children: (0, b.jsx)(`button`, {
                                onClick: async () => {
                                  if (e)
                                    try {
                                      let e = await o.saveFile(
                                        `Save Response Body`,
                                        `All Files`,
                                        `*`,
                                        null
                                      )
                                      e.status === `ok` && e.data && console.log(`Save to:`, e.data)
                                    } catch (e) {
                                      console.error(`Failed to save response:`, e)
                                    }
                                },
                                className: `w-7 h-7 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors`,
                                children: (0, b.jsx)(f, { size: 14 }),
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                })
              : (0, b.jsx)(`span`, {
                  className: `text-[11px] font-semibold text-text-muted uppercase tracking-wider`,
                  children: `Response`,
                }),
        })
      }),
      (x.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `ResponseMetaBar`,
        props: {
          response: {
            required: !0,
            tsType: {
              name: `union`,
              raw: `ResponsePayload | null`,
              elements: [{ name: `ResponsePayload` }, { name: `null` }],
            },
            description: ``,
          },
          inFlight: { required: !0, tsType: { name: `boolean` }, description: `` },
          requestId: { required: !0, tsType: { name: `string` }, description: `` },
        },
      }))
  }),
  C = n({
    Loading: () => I,
    MultipartResponse: () => V,
    NoResponse: () => F,
    Status200: () => L,
    Status404: () => R,
    Status500: () => z,
    WithRedirectChain: () => B,
    __namedExportsOrder: () => H,
    default: () => P,
  }),
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
    ;(a(),
      S(),
      i(),
      (w = l()),
      ({ expect: T, userEvent: E, within: D } = __STORYBOOK_MODULE_TEST__),
      (O = {
        requestId: `req-story`,
        headers: { 'content-type': `application/json` },
        body: `{"ok":true}`,
      }),
      (k = { ...O, status: 200, statusText: `OK`, durationMs: 143, bodySize: 2458 }),
      (A = { ...O, status: 404, statusText: `Not Found`, durationMs: 88, bodySize: 42 }),
      (j = {
        ...O,
        status: 500,
        statusText: `Internal Server Error`,
        durationMs: 1340,
        bodySize: 320,
      }),
      (M = {
        ...O,
        status: 200,
        statusText: `OK`,
        durationMs: 310,
        bodySize: 1800,
        redirectChain: [
          { method: `GET`, url: `http://example.com/old-path`, status_code: 301 },
          { method: `GET`, url: `http://example.com/new-path`, status_code: 302 },
        ],
      }),
      (N = {
        requestId: `req-multi`,
        status: 200,
        statusText: `OK`,
        durationMs: 204,
        bodySize: 5120,
        headers: { 'content-type': `multipart/mixed; boundary="--boundary--"` },
        body: [
          `----boundary--`,
          `Content-Type: application/json`,
          ``,
          `{"part":1}`,
          `----boundary--`,
          `Content-Type: text/plain`,
          ``,
          `hello`,
          `----boundary----`,
        ].join(`\r
`),
      }),
      (P = {
        title: `layout/ResponseMetaBar`,
        component: x,
        parameters: {
          layout: `fullscreen`,
          tauriMock: { save_file: () => null },
          docs: {
            description: {
              component: `Thin status strip rendered above every response panel. Displays HTTP status badge, duration, body size, redirect chain popover, and (when applicable) the Parse Multipart checkbox. Shows skeleton pulses while a request is in-flight.`,
            },
          },
        },
        decorators: [
          (e) =>
            (0, w.jsx)(`div`, {
              className: `flex flex-col bg-bg-base`,
              style: { height: `100vh` },
              children: (0, w.jsx)(e, {}),
            }),
        ],
        argTypes: {
          response: {
            description: `The completed ResponsePayload, or null when no request has been sent yet.`,
            control: !1,
          },
          inFlight: {
            control: `boolean`,
            description: `True while the HTTP request is executing — renders skeleton placeholders.`,
          },
          requestId: {
            control: `text`,
            description: `Used to key multipart-enabled state in the response store.`,
          },
        },
        beforeEach: () => {
          s()
        },
      }),
      (F = {
        args: { response: null, inFlight: !1, requestId: `req-story` },
        play: async ({ canvasElement: e }) => {
          await T(D(e).getByText(`Response`)).toBeInTheDocument()
        },
      }),
      (I = { args: { response: null, inFlight: !0, requestId: `req-story` } }),
      (L = {
        args: { response: k, inFlight: !1, requestId: `req-story` },
        play: async ({ canvasElement: e }) => {
          let t = D(e)
          ;(await T(t.getByText(`200`)).toBeInTheDocument(),
            await T(t.getByText(`OK`)).toBeInTheDocument(),
            await T(t.getByText(`143 ms`)).toBeInTheDocument(),
            await T(t.getByText(`2.4 KB`)).toBeInTheDocument())
        },
      }),
      (R = {
        args: { response: A, inFlight: !1, requestId: `req-story` },
        play: async ({ canvasElement: e }) => {
          let t = D(e)
          ;(await T(t.getByText(`404`)).toBeInTheDocument(),
            await T(t.getByText(`Not Found`)).toBeInTheDocument())
        },
      }),
      (z = {
        args: { response: j, inFlight: !1, requestId: `req-story` },
        play: async ({ canvasElement: e }) => {
          let t = D(e)
          ;(await T(t.getByText(`500`)).toBeInTheDocument(),
            await T(t.getByText(`Internal Server Error`)).toBeInTheDocument())
        },
      }),
      (B = {
        args: { response: M, inFlight: !1, requestId: `req-story` },
        play: async ({ canvasElement: e }) => {
          let t = D(e),
            n = t.getByText(/redirect/i)
          ;(await E.click(n),
            await T(t.getByText(`Redirect History`)).toBeInTheDocument(),
            await T(t.getByText(/old-path/)).toBeInTheDocument(),
            await T(t.getByText(/new-path/)).toBeInTheDocument())
        },
      }),
      (V = {
        args: { response: N, inFlight: !1, requestId: `req-multi` },
        play: async ({ canvasElement: e }) => {
          let t = D(e).getByRole(`checkbox`, { name: /parse multipart/i })
          ;(await T(t).toBeInTheDocument(),
            await T(t).not.toBeChecked(),
            await E.click(t),
            await T(t).toBeChecked())
        },
      }),
      (F.parameters = {
        ...F.parameters,
        docs: {
          ...F.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    response: null,
    inFlight: false,
    requestId: 'req-story'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Response')).toBeInTheDocument();
  }
}`,
            ...F.parameters?.docs?.source,
          },
          description: {
            story: `NoResponse — initial state before any request has been sent.
The bar shows a muted "RESPONSE" placeholder.`,
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
    response: null,
    inFlight: true,
    requestId: 'req-story'
  }
}`,
            ...I.parameters?.docs?.source,
          },
          description: {
            story: `Loading — in-flight state while the HTTP request is executing.
Three skeleton pill animations replace the status/duration/size slots.`,
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
    response: FIXTURE_200,
    inFlight: false,
    requestId: 'req-story'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('200')).toBeInTheDocument();
    await expect(canvas.getByText('OK')).toBeInTheDocument();
    await expect(canvas.getByText('143 ms')).toBeInTheDocument();
    await expect(canvas.getByText('2.4 KB')).toBeInTheDocument();
  }
}`,
            ...L.parameters?.docs?.source,
          },
          description: {
            story: `Status200 — successful 200 OK response.
Green badge, sub-200 ms duration (green), and body size in KB.`,
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
    response: FIXTURE_404,
    inFlight: false,
    requestId: 'req-story'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('404')).toBeInTheDocument();
    await expect(canvas.getByText('Not Found')).toBeInTheDocument();
  }
}`,
            ...R.parameters?.docs?.source,
          },
          description: {
            story: `Status404 — client error. Red badge and error-coloured duration.`,
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
    response: FIXTURE_500,
    inFlight: false,
    requestId: 'req-story'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('500')).toBeInTheDocument();
    await expect(canvas.getByText('Internal Server Error')).toBeInTheDocument();
  }
}`,
            ...z.parameters?.docs?.source,
          },
          description: {
            story: `Status500 — server error. Red badge, slow duration (also red).`,
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
    response: FIXTURE_REDIRECT,
    inFlight: false,
    requestId: 'req-story'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // Click the "2 redirects → 200" pill to open the popover
    const redirectBtn = canvas.getByText(/redirect/i);
    await userEvent.click(redirectBtn);
    // Assert the redirect history heading appeared
    await expect(canvas.getByText('Redirect History')).toBeInTheDocument();
    // Assert both hop URLs are visible
    await expect(canvas.getByText(/old-path/)).toBeInTheDocument();
    await expect(canvas.getByText(/new-path/)).toBeInTheDocument();
  }
}`,
            ...B.parameters?.docs?.source,
          },
          description: {
            story: `WithRedirectChain — the response followed 2 redirects before settling on 200.
The play function opens the redirect popover and asserts hop entries are visible.`,
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
    response: FIXTURE_MULTIPART,
    inFlight: false,
    requestId: 'req-multi'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', {
      name: /parse multipart/i
    });
    await expect(checkbox).toBeInTheDocument();
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  }
}`,
            ...V.parameters?.docs?.source,
          },
          description: {
            story: `MultipartResponse — content-type multipart/mixed triggers the Parse Multipart
checkbox. The play function verifies the checkbox is rendered and interactive.`,
            ...V.parameters?.docs?.description,
          },
        },
      }),
      (H = [
        `NoResponse`,
        `Loading`,
        `Status200`,
        `Status404`,
        `Status500`,
        `WithRedirectChain`,
        `MultipartResponse`,
      ]))
  })
U()
export {
  I as Loading,
  V as MultipartResponse,
  F as NoResponse,
  L as Status200,
  R as Status404,
  z as Status500,
  B as WithRedirectChain,
  H as __namedExportsOrder,
  P as default,
  U as n,
  C as t,
}
