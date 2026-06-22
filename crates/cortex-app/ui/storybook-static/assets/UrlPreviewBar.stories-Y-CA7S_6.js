import { a as e, n as t, r as n } from './chunk-DnJy8xQt.js'
import { d as r, f as i, gt as a, m as o, p as s, t as c } from './iframe-CECvvSLk.js'
import { O as l, i as u, l as d, s as f, u as p } from './Icons-DjzhDYF3.js'
import { n as m, t as h } from './Tooltip-D06fzBd3.js'
function g(e, t, n = !1) {
  return e
    ? e.replace(/\{\{([^{}]+)\}\}/g, (e, r) => {
        let i = r.trim(),
          a = t?.[i]
        return i.startsWith(`$`) || a === void 0
          ? e
          : n && a.secret
            ? `••••••••`
            : typeof a.value == `object` && a.value !== null
              ? JSON.stringify(a.value)
              : String(a.value)
      })
    : ``
}
function _(e) {
  let t = e.split(/(\{\{[^{}]+\}\})/g)
  return t.length === 1
    ? e
    : (0, b.jsx)(b.Fragment, {
        children: t.map((e, t) => {
          let n = e.match(/^\{\{([^{}]+)\}\}$/)
          return n
            ? n[1].trim().startsWith(`$`)
              ? (0, b.jsx)(
                  `span`,
                  { className: `font-mono text-text-muted italic`, children: e },
                  t
                )
              : (0, b.jsx)(
                  `span`,
                  {
                    className: `inline-flex items-center px-1 mx-px rounded text-[10px] bg-warning/20 text-warning font-semibold border border-warning/30 not-italic`,
                    children: e,
                  },
                  t
                )
            : (0, b.jsx)(y.Fragment, { children: e }, t)
        }),
      })
}
function v(e, t) {
  if (!e || !t) return !1
  let n = e.match(/\{\{([^{}]+)\}\}/g)
  return n ? n.some((e) => t[e.slice(2, -2).trim()]?.secret === !0) : !1
}
var y,
  b,
  x,
  S = t(() => {
    ;((y = e(a(), 1)),
      i(),
      l(),
      m(),
      (b = c()),
      (x = ({ requestId: e }) => {
        let [t, n] = (0, y.useState)(!1),
          i = o((t) => t.requestStates[e] || t.getRequestState(e)),
          a = o((t) => t.resolvedVariables[e]),
          {
            displayUrl: s,
            copyUrl: c,
            containsSecrets: l,
          } = (0, y.useMemo)(() => {
            if (!i) return { displayUrl: ``, copyUrl: ``, containsSecrets: !1 }
            let e = i.url.trim()
            if (!e) return { displayUrl: ``, copyUrl: ``, containsSecrets: !1 }
            let t = e.indexOf(`?`),
              n = e.indexOf(`#`),
              o = e,
              s = ``
            ;(t === -1 ? n !== -1 && (o = e.slice(0, n)) : (o = e.slice(0, t)),
              n !== -1 && (s = e.slice(n)))
            let c = i.params.filter(
                (e) => e.enabled && (e.key.trim() !== `` || e.value.trim() !== ``)
              ),
              l = v(o, a) || v(s, a) || c.some((e) => v(e.key, a) || v(e.value, a))
            function u(e) {
              let t = g(o, a, e),
                n = g(s, a, e)
              return c.length > 0
                ? `${t}?${c
                    .map((t) => {
                      let n = g(t.key, a, e),
                        i = e && v(t.key, a) ? n : r(n)
                      if (t.is_valueless) return i
                      let o = g(t.value, a, e)
                      return `${i}=${e && v(t.value, a) ? o : r(o)}`
                    })
                    .join(`&`)}${n}`
                : `${t}${n}`
            }
            return { displayUrl: u(!0), copyUrl: u(!1), containsSecrets: l }
          }, [i, a])
        return s
          ? (0, b.jsxs)(`div`, {
              className: `h-7 border-b border-border-subtle bg-bg-panel/40 flex items-center px-3 gap-2 shrink-0 select-none text-[11px] transition-colors duration-150`,
              children: [
                (0, b.jsxs)(`div`, {
                  className: `flex items-center gap-1.5 shrink-0 text-text-muted font-semibold tracking-wider uppercase pr-2 border-r border-border-subtle h-3.5 select-none`,
                  children: [
                    (0, b.jsx)(d, { size: 11, className: `text-accent` }),
                    (0, b.jsx)(`span`, { children: `Preview` }),
                  ],
                }),
                (0, b.jsx)(`div`, {
                  className: `flex-1 font-mono text-text-secondary overflow-hidden whitespace-nowrap select-text pr-4 hover:text-text-primary transition-colors cursor-text`,
                  children: _(s),
                }),
                l &&
                  (0, b.jsx)(h, {
                    content: `Secret values are masked in the preview`,
                    children: (0, b.jsx)(p, { size: 11, className: `text-warning shrink-0` }),
                  }),
                (0, b.jsx)(h, {
                  content: t
                    ? `Copied!`
                    : l
                      ? `Copy URL (includes secret values)`
                      : `Copy resolved URL`,
                  children: (0, b.jsx)(`button`, {
                    onClick: async () => {
                      if (c)
                        try {
                          ;(await navigator.clipboard.writeText(c),
                            n(!0),
                            setTimeout(() => n(!1), 2e3))
                        } catch (e) {
                          console.error(`Failed to copy resolved URL`, e)
                        }
                    },
                    className: `w-5 h-5 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-all duration-150 active:scale-95`,
                    children: t
                      ? (0, b.jsx)(u, { size: 11, className: `text-success` })
                      : (0, b.jsx)(f, { size: 11 }),
                  }),
                }),
              ],
            })
          : null
      }),
      (x.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `UrlPreviewBar`,
        props: { requestId: { required: !0, tsType: { name: `string` }, description: `` } },
      }))
  }),
  C = n({
    LongUrl: () => I,
    WithQueryParams: () => M,
    WithSecrets: () => F,
    WithUnresolvedVariables: () => P,
    WithUrl: () => j,
    WithVariables: () => N,
    __namedExportsOrder: () => L,
    default: () => A,
  })
function w(e, t = !1) {
  return { value: e, scope: `environment`, secret: t }
}
function T(e, t = {}) {
  ;(s(), o.setState({ requestStates: { [O]: { ...k, ...e } }, resolvedVariables: { [O]: t } }))
}
var E,
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
  R = t(() => {
    ;(S(),
      i(),
      ({ expect: E, within: D } = __STORYBOOK_MODULE_TEST__),
      (O = `story-urlpreviewbar-req-001`),
      (k = {
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
      (A = {
        title: `composer/UrlPreviewBar`,
        component: x,
        parameters: { layout: `fullscreen` },
        args: { requestId: O },
        argTypes: {
          requestId: {
            control: { type: `text` },
            description: 'The request ID used to look up state in `requestStore`.',
          },
        },
      }),
      (j = {
        beforeEach: () => {
          T({ url: `https://api.example.com/users/123` })
        },
        play: async ({ canvasElement: e }) => {
          let t = D(e)
          ;(await E(t.getByText(`Preview`)).toBeInTheDocument(),
            await E(t.getByText(/api\.example\.com/)).toBeInTheDocument())
        },
      }),
      (M = {
        beforeEach: () => {
          T({
            url: `https://api.example.com/search`,
            params: [
              { key: `q`, value: `hello world`, enabled: !0, is_valueless: !1 },
              { key: `limit`, value: `20`, enabled: !0, is_valueless: !1 },
            ],
          })
        },
        play: async ({ canvasElement: e }) => {
          await E(D(e).getByText(`Preview`)).toBeInTheDocument()
        },
      }),
      (N = {
        beforeEach: () => {
          T(
            { url: `https://{{baseUrl}}/users/{{userId}}` },
            { baseUrl: w(`api.example.com`), userId: w(`42`) }
          )
        },
        play: async ({ canvasElement: e }) => {
          await E(D(e).getByText(`Preview`)).toBeInTheDocument()
        },
      }),
      (P = {
        beforeEach: () => {
          T({ url: `https://{{region}}.api.example.com/items` }, {})
        },
        play: async ({ canvasElement: e }) => {
          let t = D(e)
          ;(await E(t.getByText(`Preview`)).toBeInTheDocument(),
            await E(t.getByText(/\{\{region\}\}/)).toBeInTheDocument())
        },
      }),
      (F = {
        beforeEach: () => {
          T(
            {
              url: `https://api.example.com/data`,
              params: [{ key: `key`, value: `{{apiKey}}`, enabled: !0, is_valueless: !1 }],
            },
            { apiKey: w(`sk-super-secret-token-abc123`, !0) }
          )
        },
        play: async ({ canvasElement: e }) => {
          let t = D(e)
          ;(await E(t.getByText(`Preview`)).toBeInTheDocument(),
            await E(t.getByText(/••••••••/)).toBeInTheDocument())
        },
      }),
      (I = {
        beforeEach: () => {
          T({
            url: `https://api.example.com/v3/organizations/acme-corporation/workspaces/production/datasets/customer-profiles/records/search`,
            params: [
              {
                key: `filter`,
                value: `status:active AND country:US AND tier:enterprise`,
                enabled: !0,
                is_valueless: !1,
              },
              {
                key: `fields`,
                value: `id,name,email,phone,address,subscription,created_at,updated_at`,
                enabled: !0,
                is_valueless: !1,
              },
              { key: `sort`, value: `created_at:desc`, enabled: !0, is_valueless: !1 },
              { key: `page`, value: `1`, enabled: !0, is_valueless: !1 },
              { key: `per_page`, value: `50`, enabled: !0, is_valueless: !1 },
            ],
          })
        },
        play: async ({ canvasElement: e }) => {
          await E(D(e).getByText(`Preview`)).toBeInTheDocument()
        },
      }),
      (j.parameters = {
        ...j.parameters,
        docs: {
          ...j.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    seedStore({
      url: 'https://api.example.com/users/123'
    });
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Preview')).toBeInTheDocument();
    await expect(canvas.getByText(/api\\.example\\.com/)).toBeInTheDocument();
  }
}`,
            ...j.parameters?.docs?.source,
          },
          description: {
            story: `WithUrl — a plain URL with no variables and no query params.
The Preview label, the URL in monospace, and the copy button are all visible.`,
            ...j.parameters?.docs?.description,
          },
        },
      }),
      (M.parameters = {
        ...M.parameters,
        docs: {
          ...M.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    seedStore({
      url: 'https://api.example.com/search',
      params: [{
        key: 'q',
        value: 'hello world',
        enabled: true,
        is_valueless: false
      }, {
        key: 'limit',
        value: '20',
        enabled: true,
        is_valueless: false
      }]
    });
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Preview')).toBeInTheDocument();
  }
}`,
            ...M.parameters?.docs?.source,
          },
          description: {
            story: `WithQueryParams — two enabled query parameters are appended to the base URL.
UrlPreviewBar serialises the params into \`?key=value&key2=value2\` and
percent-encodes special characters in keys and values.`,
            ...M.parameters?.docs?.description,
          },
        },
      }),
      (N.parameters = {
        ...N.parameters,
        docs: {
          ...N.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    seedStore({
      url: 'https://{{baseUrl}}/users/{{userId}}'
    }, {
      baseUrl: makeResolved('api.example.com'),
      userId: makeResolved('42')
    });
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Preview')).toBeInTheDocument();
  }
}`,
            ...N.parameters?.docs?.source,
          },
          description: {
            story: `WithVariables — the URL contains \`{{baseUrl}}\` and \`{{userId}}\` tokens.
Both are seeded as resolved in the store so their values are substituted
inline. The display URL shows plain text (no chips) because the resolved
value replaced the template syntax.

Note: The preview bar renders the *resolved* URL with values substituted.
Variable chips are shown only for tokens that remain unresolved after
substitution.`,
            ...N.parameters?.docs?.description,
          },
        },
      }),
      (P.parameters = {
        ...P.parameters,
        docs: {
          ...P.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    seedStore({
      url: 'https://{{region}}.api.example.com/items'
    }, {} // no resolved variables — chip stays
    );
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Preview')).toBeInTheDocument();
    // The unresolved token stays in the URL and is rendered as a chip
    await expect(canvas.getByText(/\\{\\{region\\}\\}/)).toBeInTheDocument();
  }
}`,
            ...P.parameters?.docs?.source,
          },
          description: {
            story:
              'WithUnresolvedVariables — `{{region}}` is not in the resolved variables map,\nso it remains as a `{{region}}` chip in the preview. This is how the bar\nsignals to the user that a variable is missing from the active environment.',
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
  beforeEach: () => {
    seedStore({
      url: 'https://api.example.com/data',
      params: [{
        key: 'key',
        value: '{{apiKey}}',
        enabled: true,
        is_valueless: false
      }]
    }, {
      apiKey: makeResolved('sk-super-secret-token-abc123', true)
    });
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Preview')).toBeInTheDocument();
    // The masked value should appear in the URL preview
    await expect(canvas.getByText(/••••••••/)).toBeInTheDocument();
  }
}`,
            ...F.parameters?.docs?.source,
          },
          description: {
            story:
              'WithSecrets — the `{{apiKey}}` variable is resolved but marked `secret: true`.\nThe display URL shows `key=••••••••` in place of the real value and an eye-off\nicon appears at the right edge of the bar with a tooltip explanation.\nThe copy button copies the **unmasked** URL.\n\nNote: UrlPreviewBar builds the query string from `tabState.params`, not from\ninline `?…` syntax in the URL string. The secret param must therefore be in\nthe `params` array so it is picked up by `enabledParams` and masked correctly.',
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
  beforeEach: () => {
    seedStore({
      url: 'https://api.example.com/v3/organizations/acme-corporation/workspaces/production/datasets/customer-profiles/records/search',
      params: [{
        key: 'filter',
        value: 'status:active AND country:US AND tier:enterprise',
        enabled: true,
        is_valueless: false
      }, {
        key: 'fields',
        value: 'id,name,email,phone,address,subscription,created_at,updated_at',
        enabled: true,
        is_valueless: false
      }, {
        key: 'sort',
        value: 'created_at:desc',
        enabled: true,
        is_valueless: false
      }, {
        key: 'page',
        value: '1',
        enabled: true,
        is_valueless: false
      }, {
        key: 'per_page',
        value: '50',
        enabled: true,
        is_valueless: false
      }]
    });
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Preview')).toBeInTheDocument();
  }
}`,
            ...I.parameters?.docs?.source,
          },
          description: {
            story: `LongUrl — a very long URL that overflows the container width.
The bar clips the overflow with \`overflow-hidden whitespace-nowrap\` so the
layout stays at a fixed single-line height. The user can still copy the
full URL via the copy button.`,
            ...I.parameters?.docs?.description,
          },
        },
      }),
      (L = [
        `WithUrl`,
        `WithQueryParams`,
        `WithVariables`,
        `WithUnresolvedVariables`,
        `WithSecrets`,
        `LongUrl`,
      ]))
  })
R()
export {
  I as LongUrl,
  M as WithQueryParams,
  F as WithSecrets,
  P as WithUnresolvedVariables,
  j as WithUrl,
  N as WithVariables,
  L as __namedExportsOrder,
  A as default,
  R as n,
  C as t,
}
