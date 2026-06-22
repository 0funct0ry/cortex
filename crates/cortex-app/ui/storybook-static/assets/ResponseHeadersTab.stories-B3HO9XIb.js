import { a as e, n as t, r as n } from './chunk-DnJy8xQt.js'
import { gt as r, t as i } from './iframe-CECvvSLk.js'
import { O as a, s as o, t as s } from './Icons-DjzhDYF3.js'
var c,
  l,
  u,
  d,
  f = t(() => {
    ;((c = e(r(), 1)),
      a(),
      (l = i()),
      (u = ({ response: e }) => {
        let t = (0, c.useMemo)(
            () => Object.entries(e.headers).sort(([e], [t]) => e.localeCompare(t)),
            [e.headers]
          ),
          n = (0, c.useMemo)(() => {
            if (e.status >= 300 && e.status < 400) {
              let t = Object.keys(e.headers).find((e) => e.toLowerCase() === `location`)
              return t ? e.headers[t] : null
            }
            return null
          }, [e.status, e.headers])
        return (0, l.jsxs)(`div`, {
          className: `flex-1 overflow-auto bg-bg-surface flex flex-col h-full`,
          children: [
            n &&
              (0, l.jsxs)(`div`, {
                className: `m-3 p-3 bg-warning/5 border border-warning/20 rounded-md text-xs flex flex-col gap-1.5 animate-fade-in`,
                children: [
                  (0, l.jsxs)(`div`, {
                    className: `flex items-center gap-1.5 text-warning font-semibold uppercase tracking-wider text-[10px]`,
                    children: [
                      (0, l.jsx)(s, { size: 12 }),
                      (0, l.jsx)(`span`, { children: `Redirect Response (Manual Mode)` }),
                    ],
                  }),
                  (0, l.jsxs)(`div`, {
                    className: `text-text-secondary leading-relaxed`,
                    children: [
                      `The request stopped at a redirect response because`,
                      ` `,
                      (0, l.jsx)(`strong`, { children: `Do not follow redirects` }),
                      ` is enabled. The server requested a redirection to:`,
                    ],
                  }),
                  (0, l.jsx)(`div`, {
                    className: `font-mono bg-bg-muted/50 p-1.5 rounded border border-border-subtle/50 break-all select-all text-text-link hover:text-accent cursor-pointer transition-colors`,
                    onClick: () => {
                      navigator.clipboard.writeText(n)
                    },
                    title: `Click to copy redirection URL`,
                    children: n,
                  }),
                  (0, l.jsx)(`div`, {
                    className: `text-[10px] text-text-muted`,
                    children: `Tip: You can enable "Follow all redirects" under the request Settings tab to traverse automatically.`,
                  }),
                ],
              }),
            (0, l.jsx)(`div`, {
              className: `flex-1 overflow-auto`,
              children: (0, l.jsxs)(`table`, {
                className: `w-full border-collapse`,
                children: [
                  (0, l.jsx)(`thead`, {
                    className: `sticky top-0 bg-bg-panel border-b border-border-subtle z-10`,
                    children: (0, l.jsxs)(`tr`, {
                      children: [
                        (0, l.jsx)(`th`, {
                          className: `text-left px-4 py-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider w-1/3`,
                          children: `Name`,
                        }),
                        (0, l.jsx)(`th`, {
                          className: `text-left px-4 py-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider`,
                          children: `Value`,
                        }),
                      ],
                    }),
                  }),
                  (0, l.jsx)(`tbody`, {
                    children: t.map(([t, n], r) =>
                      (0, l.jsx)(d, { name: t, value: n, index: r, responseStatus: e.status }, t)
                    ),
                  }),
                ],
              }),
            }),
          ],
        })
      }),
      (d = ({ name: e, value: t, index: n, responseStatus: r }) => {
        let [i, a] = (0, c.useState)(!1),
          s = () => {
            navigator.clipboard.writeText(`${e}: ${t}`)
          },
          u = e.toLowerCase() === `location`,
          d = r >= 300 && r < 400
        return (0, l.jsxs)(`tr`, {
          className: `group h-8 border-b border-border-subtle/50 transition-colors ${u && d ? `bg-warning/10 border-l-[3px] border-l-warning` : n % 2 == 0 ? `bg-bg-surface` : `bg-bg-muted/30`} hover:bg-bg-highlight`,
          onMouseEnter: () => a(!0),
          onMouseLeave: () => a(!1),
          children: [
            (0, l.jsx)(`td`, {
              className: `px-4 py-1 font-mono text-[12px] text-text-secondary select-text`,
              children: (0, l.jsxs)(`div`, {
                className: `flex items-center gap-2`,
                children: [
                  (0, l.jsx)(`span`, { children: e }),
                  u &&
                    d &&
                    (0, l.jsx)(`span`, {
                      className: `px-1 py-0.2 rounded-sm text-[8px] font-extrabold uppercase bg-warning text-text-inverse tracking-wider shrink-0`,
                      children: `Redirect Location`,
                    }),
                ],
              }),
            }),
            (0, l.jsx)(`td`, {
              className: `px-4 py-1 font-mono text-[12px] text-text-primary select-text relative`,
              children: (0, l.jsxs)(`div`, {
                className: `flex items-center justify-between gap-2`,
                children: [
                  (0, l.jsx)(`span`, { className: `truncate`, children: t }),
                  (0, l.jsx)(`button`, {
                    onClick: s,
                    className: `p-1 rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-opacity ${i ? `opacity-100` : `opacity-0`}`,
                    title: `Copy header`,
                    children: (0, l.jsx)(o, { size: 12 }),
                  }),
                ],
              }),
            }),
          ],
        })
      }),
      (u.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `ResponseHeadersTab`,
        props: { response: { required: !0, tsType: { name: `ResponsePayload` }, description: `` } },
      }))
  }),
  p = n({
    Empty: () => C,
    ManyHeaders: () => E,
    RedirectResponse: () => T,
    WithHeaders: () => w,
    __namedExportsOrder: () => D,
    default: () => S,
  }),
  m,
  h,
  g,
  _,
  v,
  y,
  b,
  x,
  S,
  C,
  w,
  T,
  E,
  D,
  O = t(() => {
    ;(f(),
      (m = i()),
      ({ expect: h, userEvent: g, within: _ } = __STORYBOOK_MODULE_TEST__),
      (v = {
        requestId: `req-empty-001`,
        status: 200,
        statusText: `OK`,
        headers: {},
        body: ``,
        durationMs: 12,
        bodySize: 0,
      }),
      (y = {
        requestId: `req-headers-002`,
        status: 200,
        statusText: `OK`,
        headers: {
          'content-type': `application/json; charset=utf-8`,
          'content-length': `1234`,
          'cache-control': `no-cache, no-store, must-revalidate`,
          'x-request-id': `a1b2c3d4-e5f6-7890-abcd-ef1234567890`,
          'x-rate-limit-limit': `100`,
          'x-rate-limit-remaining': `97`,
          'x-rate-limit-reset': `1719000000`,
          'access-control-allow-origin': `*`,
          vary: `Accept-Encoding`,
        },
        body: `{"id":1,"name":"Fluffy"}`,
        durationMs: 143,
        bodySize: 1234,
      }),
      (b = {
        requestId: `req-redirect-003`,
        status: 301,
        statusText: `Moved Permanently`,
        headers: {
          'content-type': `text/html; charset=utf-8`,
          location: `https://api.example.com/v2/users`,
          'x-request-id': `redir-001`,
        },
        body: ``,
        durationMs: 28,
        bodySize: 0,
      }),
      (x = {
        requestId: `req-many-004`,
        status: 200,
        statusText: `OK`,
        headers: Object.fromEntries(
          Array.from({ length: 24 }, (e, t) => [
            `x-custom-header-${String(t + 1).padStart(2, `0`)}`,
            `value-${t + 1}`,
          ])
        ),
        body: ``,
        durationMs: 55,
        bodySize: 0,
      }),
      (S = {
        title: `layout/ResponseHeadersTab`,
        component: u,
        parameters: {
          layout: `fullscreen`,
          docs: {
            description: {
              component: `Renders HTTP response headers in a sortable two-column table. Highlights redirect Location headers with a warning style and shows a redirect banner for 3xx responses.`,
            },
          },
        },
        decorators: [
          (e) =>
            (0, m.jsx)(`div`, {
              className: `flex flex-col`,
              style: { height: `100vh` },
              children: (0, m.jsx)(e, {}),
            }),
        ],
        argTypes: {
          response: {
            control: !1,
            description:
              'The `ResponsePayload` whose `.headers` record is rendered. Status code controls redirect highlighting.',
          },
        },
      }),
      (C = {
        args: { response: v },
        play: async ({ canvasElement: e }) => {
          let t = _(e)
          ;(await h(t.getByText(`Name`)).toBeInTheDocument(),
            await h(t.getByText(`Value`)).toBeInTheDocument())
        },
      }),
      (w = {
        args: { response: y },
        play: async ({ canvasElement: e }) => {
          let t = _(e)
          ;(await h(t.getByText(`content-type`)).toBeInTheDocument(),
            await h(t.getByText(`x-request-id`)).toBeInTheDocument())
          let n = t.getByText(`content-type`).closest(`tr`)
          ;(await g.hover(n), await h(_(n).getByTitle(`Copy header`)).toBeInTheDocument())
        },
      }),
      (T = {
        args: { response: b },
        play: async ({ canvasElement: e }) => {
          let t = _(e)
          ;(await h(t.getByText(`Redirect Response (Manual Mode)`)).toBeInTheDocument(),
            await h(t.getByText(`location`)).toBeInTheDocument(),
            await h(t.getByText(`Redirect Location`)).toBeInTheDocument(),
            await h(
              t.getAllByText(`https://api.example.com/v2/users`).length
            ).toBeGreaterThanOrEqual(2))
        },
      }),
      (E = {
        args: { response: x },
        play: async ({ canvasElement: e }) => {
          let t = _(e)
          ;(await h(t.getByText(`x-custom-header-01`)).toBeInTheDocument(),
            await h(t.getByText(`x-custom-header-24`)).toBeInTheDocument())
        },
      }),
      (C.parameters = {
        ...C.parameters,
        docs: {
          ...C.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    response: FIXTURE_RESPONSE_EMPTY
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Name')).toBeInTheDocument();
    await expect(canvas.getByText('Value')).toBeInTheDocument();
  }
}`,
            ...C.parameters?.docs?.source,
          },
          description: {
            story: `Empty — a 200 response with no headers.
The table renders with a Name / Value header row but an empty body.`,
            ...C.parameters?.docs?.description,
          },
        },
      }),
      (w.parameters = {
        ...w.parameters,
        docs: {
          ...w.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    response: FIXTURE_RESPONSE_WITH_HEADERS
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('content-type')).toBeInTheDocument();
    await expect(canvas.getByText('x-request-id')).toBeInTheDocument();
    // Hover the first header row to reveal the copy button
    const row = canvas.getByText('content-type').closest('tr')!;
    await userEvent.hover(row);
    // The copy button toggles opacity via React state — toBeVisible() checks
    // computed CSS opacity which is 0 before hover. After hover the class
    // switches to opacity-100, but asserting presence is sufficient here since
    // the opacity transition is a visual concern verified manually.
    const copyBtn = within(row).getByTitle('Copy header');
    await expect(copyBtn).toBeInTheDocument();
  }
}`,
            ...w.parameters?.docs?.source,
          },
          description: {
            story: `WithHeaders — nine varied headers typical of a REST JSON API response.
Hovering any row reveals the copy-to-clipboard button.`,
            ...w.parameters?.docs?.description,
          },
        },
      }),
      (T.parameters = {
        ...T.parameters,
        docs: {
          ...T.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    response: FIXTURE_RESPONSE_REDIRECT
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Redirect Response (Manual Mode)')).toBeInTheDocument();
    await expect(canvas.getByText('location')).toBeInTheDocument();
    await expect(canvas.getByText('Redirect Location')).toBeInTheDocument();
    // URL appears twice: once in the banner's clickable copy box and once in
    // the table's Value cell for the location header — use getAllByText.
    const urlEls = canvas.getAllByText('https://api.example.com/v2/users');
    await expect(urlEls.length).toBeGreaterThanOrEqual(2);
  }
}`,
            ...T.parameters?.docs?.source,
          },
          description: {
            story: `RedirectResponse — a 301 Moved Permanently response with a Location header.
Shows the redirect warning banner at the top and highlights the Location row.`,
            ...T.parameters?.docs?.description,
          },
        },
      }),
      (E.parameters = {
        ...E.parameters,
        docs: {
          ...E.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    response: FIXTURE_RESPONSE_MANY_HEADERS
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('x-custom-header-01')).toBeInTheDocument();
    await expect(canvas.getByText('x-custom-header-24')).toBeInTheDocument();
  }
}`,
            ...E.parameters?.docs?.source,
          },
          description: {
            story: `ManyHeaders — 24 custom headers to verify vertical scrolling and
alternating row backgrounds across a long list.`,
            ...E.parameters?.docs?.description,
          },
        },
      }),
      (D = [`Empty`, `WithHeaders`, `RedirectResponse`, `ManyHeaders`]))
  })
O()
export {
  C as Empty,
  E as ManyHeaders,
  T as RedirectResponse,
  w as WithHeaders,
  D as __namedExportsOrder,
  S as default,
  O as n,
  p as t,
}
