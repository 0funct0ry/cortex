import { a as e, n as t, r as n } from './chunk-DnJy8xQt.js'
import {
  _ as r,
  f as i,
  g as a,
  gt as o,
  h as s,
  m as c,
  p as l,
  t as u,
  v as d,
} from './iframe-CECvvSLk.js'
import { i as f, n as p, r as m, t as h } from './tagColors-7aspA8vU.js'
var g,
  _,
  v,
  y = t(() => {
    ;((g = e(o(), 1)),
      f(),
      (_ = u()),
      (v = ({
        open: e,
        onClose: t,
        anchorRef: n,
        collectionTags: r,
        appliedTags: i,
        onApply: a,
        onCreateAndApply: o,
      }) => {
        let [s, c] = (0, g.useState)(``),
          [l, u] = (0, g.useState)(!1),
          [d, f] = (0, g.useState)(p(r.map((e) => e.color)).name),
          v = (0, g.useRef)(null),
          y = (0, g.useRef)(null),
          [b, x] = (0, g.useState)(!1)
        if (
          (e && !b ? (x(!0), c(``), u(!1), f(p(r.map((e) => e.color)).name)) : !e && b && x(!1),
          (0, g.useEffect)(() => {
            e && setTimeout(() => y.current?.focus(), 10)
          }, [e]),
          (0, g.useEffect)(() => {
            if (!e) return
            let r = (e) => {
                e.key === `Escape` && t()
              },
              i = (e) => {
                v.current &&
                  !v.current.contains(e.target) &&
                  n.current &&
                  !n.current.contains(e.target) &&
                  t()
              }
            return (
              document.addEventListener(`keydown`, r),
              document.addEventListener(`mousedown`, i),
              () => {
                ;(document.removeEventListener(`keydown`, r),
                  document.removeEventListener(`mousedown`, i))
              }
            )
          }, [e, t, n]),
          !e)
        )
          return null
        let S = r.filter(
            (e) => !i.includes(e.name) && e.name.toLowerCase().includes(s.toLowerCase())
          ),
          C = r.some((e) => e.name.toLowerCase() === s.toLowerCase()),
          w = s.trim() !== `` && !C,
          T = (e) => {
            ;(a(e), c(``))
          },
          E = () => {
            let e = s.trim()
            e && (o({ name: e, color: d }), c(``), u(!1))
          }
        return (0, _.jsxs)(`div`, {
          ref: v,
          className: `absolute z-50 mt-1 w-64 rounded-md border border-border-default bg-bg-base shadow-lg`,
          style: { top: `100%`, left: 0 },
          children: [
            (0, _.jsx)(`div`, {
              className: `p-2`,
              children: (0, _.jsx)(`input`, {
                ref: y,
                value: s,
                onChange: (e) => {
                  ;(c(e.target.value), u(!1))
                },
                onKeyDown: (e) => {
                  e.key === `Enter` && (l ? E() : S.length > 0 ? T(S[0].name) : w && u(!0))
                },
                placeholder: `Search or create tag…`,
                autoCapitalize: `none`,
                autoCorrect: `off`,
                spellCheck: !1,
                className: `w-full rounded border border-border-default bg-bg-surface px-2 py-1 text-xs text-text-primary outline-none placeholder:text-text-muted focus:border-accent`,
              }),
            }),
            (0, _.jsxs)(`div`, {
              className: `max-h-40 overflow-y-auto`,
              children: [
                S.map((e) =>
                  (0, _.jsxs)(
                    `button`,
                    {
                      onClick: () => T(e.name),
                      className: `flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-primary hover:bg-bg-hover`,
                      children: [
                        (0, _.jsx)(`span`, {
                          className: `h-2.5 w-2.5 shrink-0 rounded-full`,
                          style: { background: m(e.color).bg },
                        }),
                        e.name,
                      ],
                    },
                    e.name
                  )
                ),
                w &&
                  !l &&
                  (0, _.jsxs)(`button`, {
                    onClick: () => u(!0),
                    className: `flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-hover`,
                    children: [
                      (0, _.jsx)(`span`, { className: `text-text-muted`, children: `Create` }),
                      (0, _.jsxs)(`span`, {
                        className: `font-medium text-text-primary`,
                        children: [`"`, s.trim(), `"`],
                      }),
                    ],
                  }),
                S.length === 0 &&
                  !w &&
                  !l &&
                  (0, _.jsx)(`p`, {
                    className: `px-3 py-2 text-xs text-text-muted`,
                    children: `No tags yet`,
                  }),
              ],
            }),
            l &&
              (0, _.jsxs)(`div`, {
                className: `border-t border-border-default p-2`,
                children: [
                  (0, _.jsx)(`p`, {
                    className: `mb-1.5 text-xs font-medium text-text-secondary`,
                    children: `Pick a color`,
                  }),
                  (0, _.jsx)(`div`, {
                    className: `mb-2 flex flex-wrap gap-1.5`,
                    children: h.map((e) =>
                      (0, _.jsx)(
                        `button`,
                        {
                          onClick: () => f(e.name),
                          title: e.name,
                          className: `relative h-5 w-5 rounded-full border-2 transition-transform hover:scale-110`,
                          style: {
                            background: e.bg,
                            borderColor: d === e.name ? `#fff` : `transparent`,
                            boxShadow: d === e.name ? `0 0 0 2px ${e.bg}` : void 0,
                          },
                          children:
                            d === e.name &&
                            (0, _.jsx)(`span`, {
                              className: `absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white`,
                              children: `✓`,
                            }),
                        },
                        e.name
                      )
                    ),
                  }),
                  (0, _.jsx)(`button`, {
                    onClick: E,
                    className: `w-full rounded bg-accent hover:bg-accent-hover text-accent-fg px-2 py-1 text-xs font-medium`,
                    children: `Add`,
                  }),
                ],
              }),
          ],
        })
      }),
      (v.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `TagPopover`,
        props: {
          open: { required: !0, tsType: { name: `boolean` }, description: `` },
          onClose: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `() => void`,
              signature: { arguments: [], return: { name: `void` } },
            },
            description: ``,
          },
          anchorRef: {
            required: !0,
            tsType: {
              name: `ReactRefObject`,
              raw: `React.RefObject<HTMLElement | null>`,
              elements: [
                {
                  name: `union`,
                  raw: `HTMLElement | null`,
                  elements: [{ name: `HTMLElement` }, { name: `null` }],
                },
              ],
            },
            description: ``,
          },
          collectionTags: {
            required: !0,
            tsType: {
              name: `Array`,
              elements: [
                {
                  name: `signature`,
                  type: `object`,
                  raw: `{ name: string; 
/**
 * One of 12 named palette colors: red|orange|yellow|lime|green|teal|cyan|blue|indigo|violet|pink|gray
 */
color: string }`,
                  signature: {
                    properties: [
                      { key: `name`, value: { name: `string`, required: !0 } },
                      {
                        key: `color`,
                        value: { name: `string`, required: !0 },
                        description: `One of 12 named palette colors: red|orange|yellow|lime|green|teal|cyan|blue|indigo|violet|pink|gray`,
                      },
                    ],
                  },
                },
              ],
              raw: `TagDefinition[]`,
            },
            description: ``,
          },
          appliedTags: {
            required: !0,
            tsType: { name: `Array`, elements: [{ name: `string` }], raw: `string[]` },
            description: ``,
          },
          onApply: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(tagName: string) => void`,
              signature: {
                arguments: [{ type: { name: `string` }, name: `tagName` }],
                return: { name: `void` },
              },
            },
            description: ``,
          },
          onCreateAndApply: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(tag: TagDefinition) => void`,
              signature: {
                arguments: [
                  {
                    type: {
                      name: `signature`,
                      type: `object`,
                      raw: `{ name: string; 
/**
 * One of 12 named palette colors: red|orange|yellow|lime|green|teal|cyan|blue|indigo|violet|pink|gray
 */
color: string }`,
                      signature: {
                        properties: [
                          { key: `name`, value: { name: `string`, required: !0 } },
                          {
                            key: `color`,
                            value: { name: `string`, required: !0 },
                            description: `One of 12 named palette colors: red|orange|yellow|lime|green|teal|cyan|blue|indigo|violet|pink|gray`,
                          },
                        ],
                      },
                    },
                    name: `tag`,
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
  b,
  x,
  S,
  C,
  w,
  T = t(() => {
    ;((b = e(o(), 1)),
      i(),
      a(),
      f(),
      y(),
      (x = u()),
      (S = ({ open: e, onClose: t, anchorRef: n, currentColor: r, onSelect: i }) => {
        let a = (0, b.useRef)(null)
        return (
          b.useEffect(() => {
            if (!e) return
            let r = (e) => {
                a.current &&
                  !a.current.contains(e.target) &&
                  n.current &&
                  !n.current.contains(e.target) &&
                  t()
              },
              i = (e) => e.key === `Escape` && t()
            return (
              document.addEventListener(`mousedown`, r),
              document.addEventListener(`keydown`, i),
              () => {
                ;(document.removeEventListener(`mousedown`, r),
                  document.removeEventListener(`keydown`, i))
              }
            )
          }, [e, t, n]),
          e
            ? (0, x.jsx)(`div`, {
                ref: a,
                className: `absolute bottom-full left-0 z-50 mb-1 flex flex-wrap gap-1.5 rounded-md border border-border-default bg-bg-base p-2 shadow-lg`,
                style: { width: 160 },
                children: h.map((e) =>
                  (0, x.jsx)(
                    `button`,
                    {
                      onClick: () => {
                        ;(i(e.name), t())
                      },
                      title: e.name,
                      className: `relative h-5 w-5 rounded-full border-2 transition-transform hover:scale-110`,
                      style: {
                        background: e.bg,
                        borderColor: r === e.name ? `#fff` : `transparent`,
                        boxShadow: r === e.name ? `0 0 0 2px ${e.bg}` : void 0,
                      },
                      children:
                        r === e.name &&
                        (0, x.jsx)(`span`, {
                          className: `absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white`,
                          children: `✓`,
                        }),
                    },
                    e.name
                  )
                ),
              })
            : null
        )
      }),
      (C = ({
        tagName: e,
        def: t,
        colorPickerTag: n,
        setColorPickerTag: r,
        handleRecolor: i,
        handleRemoveTag: a,
      }) => {
        let o = (0, b.useRef)(null)
        return (0, x.jsxs)(`span`, {
          className: `relative flex items-center gap-1 rounded-full border border-border-default px-2 py-0.5 text-xs text-text-primary`,
          children: [
            (0, x.jsx)(`button`, {
              ref: o,
              onClick: (t) => {
                ;(t.stopPropagation(), r((t) => (t === e ? null : e)))
              },
              className: `h-2.5 w-2.5 shrink-0 rounded-full transition-opacity hover:opacity-70`,
              style: { background: m(t?.color ?? `gray`).bg },
              title: `Change color`,
            }),
            n === e &&
              (0, x.jsx)(S, {
                open: !0,
                onClose: () => r(null),
                anchorRef: o,
                currentColor: t?.color ?? `gray`,
                onSelect: (t) => i(e, t),
              }),
            e,
            (0, x.jsx)(`button`, {
              onClick: (t) => {
                ;(t.stopPropagation(), a(e))
              },
              className: `ml-0.5 text-text-muted hover:text-text-primary`,
              title: `Remove tag`,
              children: `×`,
            }),
          ],
        })
      }),
      (w = ({ requestId: e, collectionPath: t }) => {
        let { getRequestState: n, updateRequest: r } = c(),
          { collections: i, updateTagRegistry: a } = d(),
          o = n(e).tags ?? [],
          l = s(t ? { [t]: i[t] } : {}),
          [u, f] = (0, b.useState)({}),
          p = (0, b.useMemo)(() => {
            let e = new Map()
            return (
              l.forEach((t) => e.set(t.name, t)),
              Object.entries(u).forEach(([t, n]) => {
                e.has(t) || e.set(t, n)
              }),
              e
            )
          }, [l, u]),
          m = (e) => p.get(e),
          [h, g] = (0, b.useState)(!1),
          _ = (0, b.useRef)(null),
          [y, S] = (0, b.useState)(null),
          w = (t) => {
            r(e, { tags: o.filter((e) => e !== t) })
          },
          T = (t) => {
            o.includes(t) || r(e, { tags: [...o, t] })
          },
          E = async (e) => {
            f((t) => ({ ...t, [e.name]: e }))
            let n = i[t]?.manifest.tag_registry ?? []
            ;(n.find((t) => t.name === e.name) || (await a(t, [...n, e])), T(e.name))
          },
          D = async (e, n) => {
            let r = (i[t]?.manifest.tag_registry ?? []).map((t) =>
              t.name === e ? { ...t, color: n } : t
            )
            ;(f((t) => {
              let r = t[e]
              return r ? { ...t, [e]: { ...r, color: n } } : t
            }),
              await a(t, r))
          }
        return (0, x.jsxs)(`div`, {
          ref: _,
          className: `relative flex min-h-[28px] flex-wrap items-center gap-1 border-b border-border-default px-3 py-1`,
          onClick: (e) => {
            e.target === _.current && g(!0)
          },
          children: [
            o.length === 0 &&
              !h &&
              (0, x.jsx)(`button`, {
                onClick: () => g(!0),
                className: `text-xs text-text-muted hover:text-text-secondary`,
                children: `＋ Add tag`,
              }),
            o.map((e) =>
              (0, x.jsx)(
                C,
                {
                  tagName: e,
                  def: m(e),
                  colorPickerTag: y,
                  setColorPickerTag: S,
                  handleRecolor: D,
                  handleRemoveTag: w,
                },
                e
              )
            ),
            o.length > 0 &&
              (0, x.jsx)(`button`, {
                onClick: () => g(!0),
                className: `text-xs text-text-muted hover:text-text-secondary`,
                children: `＋`,
              }),
            (0, x.jsx)(`div`, {
              className: `relative`,
              children: (0, x.jsx)(v, {
                open: h,
                onClose: () => g(!1),
                anchorRef: _,
                collectionTags: l,
                appliedTags: o,
                onApply: T,
                onCreateAndApply: E,
              }),
            }),
          ],
        })
      }),
      (w.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `TagsRow`,
        props: {
          requestId: { required: !0, tsType: { name: `string` }, description: `` },
          collectionPath: { required: !0, tsType: { name: `string` }, description: `` },
        },
      }))
  }),
  E = n({
    NoTags: () => L,
    OpenTagPopover: () => z,
    WithTags: () => R,
    __namedExportsOrder: () => B,
    default: () => I,
  })
function D(e) {
  ;(l(), c.setState({ requestStates: { [M]: { ...P, tags: e } } }))
}
function O(e) {
  ;(r(),
    d.setState({
      collections: {
        [N]: {
          path: N,
          is_git_repo: !1,
          items: [],
          manifest: { version: `1`, name: `Story Collection`, tag_registry: e },
        },
      },
    }))
}
var k,
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
  V = t(() => {
    ;(T(),
      i(),
      a(),
      ({ expect: k, userEvent: A, within: j } = __STORYBOOK_MODULE_TEST__),
      (M = `story-tagsrow-req-001`),
      (N = `story-collection`),
      (P = {
        name: `Story Request`,
        url: `https://api.example.com/users`,
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
      (F = [
        { name: `auth`, color: `blue` },
        { name: `payments`, color: `green` },
        { name: `deprecated`, color: `red` },
      ]),
      (I = {
        title: `composer/TagsRow`,
        component: w,
        parameters: { layout: `fullscreen` },
        args: { requestId: M, collectionPath: N },
        argTypes: {
          requestId: {
            control: { type: `text` },
            description:
              'The request ID used to look up `requestStates[requestId].tags` in `requestStore`.',
          },
          collectionPath: {
            control: { type: `text` },
            description:
              'The collection path used to look up the tag registry in `collectionStore`.',
          },
        },
      }),
      (L = {
        beforeEach: () => {
          ;(D([]), O(F))
        },
        play: async ({ canvasElement: e }) => {
          await k(j(e).getByText(`＋ Add tag`)).toBeInTheDocument()
        },
      }),
      (R = {
        beforeEach: () => {
          ;(D([`auth`, `payments`]), O(F))
        },
        play: async ({ canvasElement: e }) => {
          let t = j(e)
          ;(await k(t.getByText(`auth`)).toBeInTheDocument(),
            await k(t.getByText(`payments`)).toBeInTheDocument())
        },
      }),
      (z = {
        beforeEach: () => {
          ;(D([]), O(F))
        },
        play: async ({ canvasElement: e }) => {
          let t = j(e),
            n = t.getByText(`＋ Add tag`)
          ;(await A.click(n),
            await k(await t.findByPlaceholderText(`Search or create tag…`)).toBeInTheDocument())
        },
      }),
      (L.parameters = {
        ...L.parameters,
        docs: {
          ...L.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    seedRequestStore([]);
    seedCollectionStore(SAMPLE_TAG_DEFS);
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('＋ Add tag')).toBeInTheDocument();
  }
}`,
            ...L.parameters?.docs?.source,
          },
          description: {
            story: `NoTags — the initial empty state.

No tags are applied to the request. The row renders a single "＋ Add tag"
button. This is the default state for a freshly created request.`,
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
  beforeEach: () => {
    seedRequestStore(['auth', 'payments']);
    seedCollectionStore(SAMPLE_TAG_DEFS);
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('auth')).toBeInTheDocument();
    await expect(canvas.getByText('payments')).toBeInTheDocument();
  }
}`,
            ...R.parameters?.docs?.source,
          },
          description: {
            story: `WithTags — two tags applied with different palette colors.

The \`auth\` tag (blue) and \`payments\` tag (green) are both applied. Each
renders as a chip with a colored dot on the left and a ×-remove button on
the right. A "＋" button appears after the last chip to add more tags.`,
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
  beforeEach: () => {
    seedRequestStore([]);
    seedCollectionStore(SAMPLE_TAG_DEFS);
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const addBtn = canvas.getByText('＋ Add tag');
    await userEvent.click(addBtn);
    // TagPopover renders an input with placeholder "Search or create tag…"
    const input = await canvas.findByPlaceholderText('Search or create tag…');
    await expect(input).toBeInTheDocument();
  }
}`,
            ...z.parameters?.docs?.source,
          },
          description: {
            story: `OpenTagPopover — the tag popover opens on "＋ Add tag" click.

A \`play()\` function clicks the "＋ Add tag" button and verifies that the
tag search/create popover appears with its input field.`,
            ...z.parameters?.docs?.description,
          },
        },
      }),
      (B = [`NoTags`, `WithTags`, `OpenTagPopover`]))
  })
V()
export {
  L as NoTags,
  z as OpenTagPopover,
  R as WithTags,
  B as __namedExportsOrder,
  I as default,
  V as n,
  E as t,
}
