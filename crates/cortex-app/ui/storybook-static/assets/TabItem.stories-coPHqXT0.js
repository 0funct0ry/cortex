import { a as e, n as t, r as n } from './chunk-DnJy8xQt.js'
import { c as r, gt as i, l as a, t as o, u as s } from './iframe-CECvvSLk.js'
import { C as c, D as l, O as u, f as d, g as f, p } from './Icons-DjzhDYF3.js'
import { n as m, r as h, t as g } from './TabsContext-DSn62RXv.js'
var _,
  v,
  y,
  b = t(() => {
    ;((_ = e(i(), 1)),
      m(),
      u(),
      r(),
      (v = o()),
      (y = ({
        tab: e,
        active: t,
        index: n,
        dragOverIndex: r,
        onDragStart: i,
        onDragOver: a,
        onDragLeave: o,
        onDrop: u,
        onDragEnd: m,
      }) => {
        let {
            activateTab: g,
            closeTab: y,
            duplicateTab: b,
            closeOtherTabs: x,
            closeTabsToTheRight: S,
          } = h(),
          { openSaveToCollectionDialog: C } = s(),
          [w, T] = (0, _.useState)(!1),
          [E, D] = (0, _.useState)({ x: 0, y: 0 }),
          O = (0, _.useRef)(null)
        return (
          (0, _.useEffect)(() => {
            let e = (e) => {
              O.current && !O.current.contains(e.target) && T(!1)
            }
            return (
              w && document.addEventListener(`mousedown`, e),
              () => document.removeEventListener(`mousedown`, e)
            )
          }, [w]),
          (0, v.jsxs)(v.Fragment, {
            children: [
              (0, v.jsxs)(`div`, {
                draggable: !0,
                onDragStart: (e) => {
                  ;((e.dataTransfer.effectAllowed = `move`), i(n))
                },
                onDragEnd: m,
                onDragOver: (e) => {
                  ;(e.preventDefault(), (e.dataTransfer.dropEffect = `move`), a(n))
                },
                onDragLeave: o,
                onDrop: (e) => {
                  ;(e.preventDefault(), u(n))
                },
                onClick: () => g(e.id),
                onContextMenu: (e) => {
                  ;(e.preventDefault(), D({ x: e.clientX, y: e.clientY }), T(!0))
                },
                className: `
          group relative flex items-center h-full min-w-[80px] max-w-[200px] px-3 gap-2 cursor-pointer select-none border-r border-border-subtle transition-all
          ${t ? `bg-bg-surface text-text-primary` : `bg-bg-panel text-text-secondary hover:bg-bg-muted`}
          ${r === n ? `border-l-2 border-l-accent bg-bg-highlight/30` : ``}
        `,
                title: e.isDirty ? `Unsaved changes` : e.name,
                children: [
                  e.type === `environments`
                    ? (0, v.jsx)(p, { size: 14, className: `text-accent shrink-0` })
                    : e.type === `collection-environments`
                      ? (0, v.jsx)(f, { size: 14, className: `text-accent shrink-0` })
                      : e.type === `collection`
                        ? (0, v.jsx)(c, { size: 14, className: `text-accent shrink-0` })
                        : e.type === `folder`
                          ? (0, v.jsx)(d, { size: 14, className: `text-accent shrink-0` })
                          : (0, v.jsx)(`span`, {
                              className: `text-[10px] font-bold uppercase shrink-0 ${((e, t) => {
                                switch (e.toUpperCase()) {
                                  case `GET`:
                                    return `text-method-get`
                                  case `POST`:
                                    return `text-method-post`
                                  case `PUT`:
                                    return `text-method-put`
                                  case `PATCH`:
                                    return `text-method-patch`
                                  case `DELETE`:
                                    return `text-method-delete`
                                  case `HEAD`:
                                    return `text-method-head`
                                  case `OPTIONS`:
                                    return `text-method-options`
                                  case `TRACE`:
                                    return `text-method-trace`
                                  case `WS`:
                                    return `text-method-ws`
                                  case `SSE`:
                                    return `text-method-sse`
                                  case `GRPC`:
                                    return `text-method-grpc`
                                  case `GRAPHQL`:
                                    return `text-method-graphql`
                                  default:
                                    return t ? `text-text-primary` : `text-text-muted`
                                }
                              })(e.method, t)}`,
                              children: e.method,
                            }),
                  (0, v.jsx)(`span`, {
                    title: e.type === `collection-environments` ? e.name : void 0,
                    className: `text-[12px] truncate flex-1 font-medium ${e.type === `request` && !e.requestPath ? `italic ${t ? `text-text-secondary` : `text-text-muted`}` : ``}`,
                    children: e.name,
                  }),
                  (0, v.jsxs)(`div`, {
                    className: `flex items-center justify-center w-4 h-4 shrink-0 relative`,
                    children: [
                      e.isDirty
                        ? (0, v.jsx)(`div`, {
                            className: `w-1.5 h-1.5 rounded-full bg-accent group-hover:hidden`,
                          })
                        : null,
                      (0, v.jsx)(`button`, {
                        onClick: (t) => {
                          ;(t.stopPropagation(), y(e.id))
                        },
                        className: `
              flex items-center justify-center w-full h-full rounded hover:bg-bg-highlight transition-colors
              ${t ? `opacity-100` : `opacity-0 group-hover:opacity-100`}
              ${e.isDirty ? `hidden group-hover:flex` : `flex`}
            `,
                        children: (0, v.jsx)(l, { size: 12 }),
                      }),
                    ],
                  }),
                  t &&
                    (0, v.jsx)(`div`, {
                      className: `absolute bottom-0 left-0 right-0 h-[2px] bg-accent`,
                    }),
                ],
              }),
              w &&
                (0, v.jsxs)(`div`, {
                  ref: O,
                  style: { top: E.y, left: E.x },
                  className: `fixed z-50 min-w-[160px] py-1 bg-bg-overlay border border-border-subtle rounded-md shadow-lg`,
                  children: [
                    (0, v.jsxs)(`button`, {
                      className: `w-full flex items-center px-3 h-7 text-[12px] text-text-primary hover:bg-bg-highlight transition-colors`,
                      onClick: () => {
                        ;(y(e.id), T(!1))
                      },
                      children: [
                        `Close Tab`,
                        (0, v.jsx)(`span`, {
                          className: `ml-auto text-[10px] text-text-muted`,
                          children: `Cmd+W`,
                        }),
                      ],
                    }),
                    (0, v.jsx)(`button`, {
                      className: `w-full flex items-center px-3 h-7 text-[12px] text-text-primary hover:bg-bg-highlight transition-colors`,
                      onClick: () => {
                        ;(x(e.id), T(!1))
                      },
                      children: `Close Other Tabs`,
                    }),
                    (0, v.jsx)(`button`, {
                      className: `w-full flex items-center px-3 h-7 text-[12px] text-text-primary hover:bg-bg-highlight transition-colors`,
                      onClick: () => {
                        ;(S(e.id), T(!1))
                      },
                      children: `Close Tabs to the Right`,
                    }),
                    e.type === `request` &&
                      (0, v.jsxs)(v.Fragment, {
                        children: [
                          (0, v.jsx)(`div`, { className: `my-1 border-t border-border-subtle` }),
                          !e.requestPath &&
                            (0, v.jsx)(`button`, {
                              className: `w-full flex items-center px-3 h-7 text-[12px] text-text-primary hover:bg-bg-highlight transition-colors`,
                              onClick: () => {
                                ;(C(e.id), T(!1))
                              },
                              children: `Save to Collection…`,
                            }),
                          (0, v.jsx)(`button`, {
                            className: `w-full flex items-center px-3 h-7 text-[12px] text-text-primary hover:bg-bg-highlight transition-colors`,
                            onClick: () => {
                              ;(b(e.id), T(!1))
                            },
                            children: `Duplicate Tab`,
                          }),
                          (0, v.jsx)(`button`, {
                            className: `w-full flex items-center px-3 h-7 text-[12px] text-text-primary hover:bg-bg-highlight transition-colors`,
                            onClick: () => {
                              T(!1)
                            },
                            children: `Copy Request URL`,
                          }),
                        ],
                      }),
                  ],
                }),
            ],
          })
        )
      }),
      (y.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `TabItem`,
        props: {
          tab: { required: !0, tsType: { name: `Tab` }, description: `` },
          active: { required: !0, tsType: { name: `boolean` }, description: `` },
          index: { required: !0, tsType: { name: `number` }, description: `` },
          dragOverIndex: {
            required: !0,
            tsType: {
              name: `union`,
              raw: `number | null`,
              elements: [{ name: `number` }, { name: `null` }],
            },
            description: ``,
          },
          onDragStart: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(index: number) => void`,
              signature: {
                arguments: [{ type: { name: `number` }, name: `index` }],
                return: { name: `void` },
              },
            },
            description: ``,
          },
          onDragOver: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(index: number) => void`,
              signature: {
                arguments: [{ type: { name: `number` }, name: `index` }],
                return: { name: `void` },
              },
            },
            description: ``,
          },
          onDragLeave: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `() => void`,
              signature: { arguments: [], return: { name: `void` } },
            },
            description: ``,
          },
          onDrop: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `(index: number) => void`,
              signature: {
                arguments: [{ type: { name: `number` }, name: `index` }],
                return: { name: `void` },
              },
            },
            description: ``,
          },
          onDragEnd: {
            required: !0,
            tsType: {
              name: `signature`,
              type: `function`,
              raw: `() => void`,
              signature: { arguments: [], return: { name: `void` } },
            },
            description: ``,
          },
        },
      }))
  }),
  x = n({
    Active: () => P,
    ContextMenu: () => z,
    Dirty: () => I,
    Inactive: () => F,
    InactiveHover: () => L,
    MethodVariants: () => R,
    __namedExportsOrder: () => B,
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
  V = t(() => {
    ;(i(),
      b(),
      m(),
      r(),
      (S = o()),
      ({ expect: C, fn: w, userEvent: T, within: E } = __STORYBOOK_MODULE_TEST__),
      (D = {
        id: `tab-story-001`,
        type: `request`,
        name: `List Pets`,
        method: `GET`,
        requestPath: `/collections/petstore/list-pets.crx`,
        collectionId: null,
        collectionPath: null,
        folderPath: null,
        exampleId: null,
        isDirty: !1,
      }),
      (O = { ...D, id: `tab-story-002`, isDirty: !0 }),
      (k = { ...D, id: `tab-story-post`, name: `Create Pet`, method: `POST` }),
      (A = { ...D, id: `tab-story-put`, name: `Update Pet`, method: `PUT` }),
      (j = { ...D, id: `tab-story-delete`, name: `Delete Pet`, method: `DELETE` }),
      (M = {
        dragOverIndex: null,
        onDragStart: w(),
        onDragOver: w(),
        onDragLeave: w(),
        onDrop: w(),
        onDragEnd: w(),
      }),
      (N = {
        title: `layout/TabItem`,
        component: y,
        parameters: {
          layout: `fullscreen`,
          docs: {
            description: {
              component: `A single tab in the request tab bar. Renders a method label (or icon for special tab types), the request name, and a close button / dirty indicator. Supports drag-to-reorder and a right-click context menu.`,
            },
          },
        },
        decorators: [
          (e) =>
            (0, S.jsx)(g, {
              children: (0, S.jsx)(`div`, {
                className: `flex items-stretch bg-bg-panel border-b border-border-subtle`,
                style: { height: `36px`, width: `600px` },
                children: (0, S.jsx)(e, {}),
              }),
            }),
        ],
        argTypes: {
          tab: { control: !1, description: `The Tab object to render.` },
          active: { control: `boolean`, description: `Whether this tab is currently selected.` },
          index: {
            control: `number`,
            description: `Position in the tab list (used for drag logic).`,
          },
          dragOverIndex: {
            control: !1,
            description: `Index of the tab currently being dragged over, or null.`,
          },
        },
        beforeEach: () => {
          ;(a(), s.setState({ openSaveToCollectionDialog: w() }))
        },
      }),
      (P = { args: { tab: D, active: !0, index: 0, ...M } }),
      (F = { args: { tab: D, active: !1, index: 0, ...M } }),
      (I = {
        args: { tab: O, active: !0, index: 0, ...M },
        play: async ({ canvasElement: e }) => {
          let t = E(e),
            n = t.getByTitle(`Unsaved changes`)
          ;(await T.hover(n), await C(t.getByRole(`button`)).toBeVisible())
        },
      }),
      (L = {
        args: { tab: D, active: !1, index: 0, ...M },
        play: async ({ canvasElement: e }) => {
          let t = E(e),
            n = t.getByTitle(D.name)
          ;(await T.hover(n), await C(t.getByRole(`button`)).toBeVisible())
        },
      }),
      (R = {
        render: () =>
          (0, S.jsx)(g, {
            children: (0, S.jsx)(`div`, {
              className: `flex items-stretch bg-bg-panel border-b border-border-subtle`,
              style: { height: `36px`, width: `800px` },
              children: [D, k, A, j].map((e, t) =>
                (0, S.jsx)(
                  y,
                  {
                    tab: e,
                    active: t === 0,
                    index: t,
                    dragOverIndex: null,
                    onDragStart: w(),
                    onDragOver: w(),
                    onDragLeave: w(),
                    onDrop: w(),
                    onDragEnd: w(),
                  },
                  e.id
                )
              ),
            }),
          }),
        play: async ({ canvasElement: e }) => {
          let t = E(e)
          ;(await C(t.getByText(`GET`)).toBeInTheDocument(),
            await C(t.getByText(`POST`)).toBeInTheDocument(),
            await C(t.getByText(`PUT`)).toBeInTheDocument(),
            await C(t.getByText(`DELETE`)).toBeInTheDocument())
        },
      }),
      (z = {
        args: { tab: D, active: !0, index: 0, ...M },
        parameters: { docs: { story: { inline: !1, height: `200px` } } },
        play: async ({ canvasElement: e }) => {
          let t = E(e).getByTitle(D.name)
          await T.pointer({ target: t, keys: `[MouseRight]` })
          let n = E(e.ownerDocument.body)
          ;(await C(n.getByText(`Close Tab`)).toBeInTheDocument(),
            await C(n.getByText(`Duplicate Tab`)).toBeInTheDocument(),
            await C(n.getByText(`Copy Request URL`)).toBeInTheDocument())
        },
      }),
      (P.parameters = {
        ...P.parameters,
        docs: {
          ...P.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    tab: FIXTURE_TAB,
    active: true,
    index: 0,
    ...DRAG_PROPS
  }
}`,
            ...P.parameters?.docs?.source,
          },
          description: {
            story: `Active — the currently selected tab.
Shows the accent bottom border, full-opacity close button, and primary text colour.`,
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
    tab: FIXTURE_TAB,
    active: false,
    index: 0,
    ...DRAG_PROPS
  }
}`,
            ...F.parameters?.docs?.source,
          },
          description: {
            story: `Inactive — a background tab.
Text is muted; the close button is hidden until hover.`,
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
    tab: FIXTURE_TAB_DIRTY,
    active: true,
    index: 0,
    ...DRAG_PROPS
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const tabEl = canvas.getByTitle('Unsaved changes');
    await userEvent.hover(tabEl);
    // The close button (×) is revealed on hover for dirty tabs
    const closeBtn = canvas.getByRole('button');
    await expect(closeBtn).toBeVisible();
  }
}`,
            ...I.parameters?.docs?.source,
          },
          description: {
            story: `Dirty — active tab with unsaved changes.
An orange dot appears; hovering the tab reveals the close button in place of the dot.
The play function hovers the tab and asserts the close button becomes visible.`,
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
    tab: FIXTURE_TAB,
    active: false,
    index: 0,
    ...DRAG_PROPS
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // The outermost draggable div wraps the tab content — target it by title
    const tabEl = canvas.getByTitle(FIXTURE_TAB.name);
    await userEvent.hover(tabEl);
    const closeBtn = canvas.getByRole('button');
    await expect(closeBtn).toBeVisible();
  }
}`,
            ...L.parameters?.docs?.source,
          },
          description: {
            story: `InactiveHover — an inactive tab hovered by the user.
The play function hovers to confirm the close button transitions from opacity-0 to visible.`,
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
  render: () => <TabsProvider>
      <div className="flex items-stretch bg-bg-panel border-b border-border-subtle" style={{
      height: '36px',
      width: '800px'
    }}>
        {[FIXTURE_TAB, FIXTURE_TAB_POST, FIXTURE_TAB_PUT, FIXTURE_TAB_DELETE].map((tab, i) => <TabItem key={tab.id} tab={tab} active={i === 0} index={i} dragOverIndex={null} onDragStart={fn()} onDragOver={fn()} onDragLeave={fn()} onDrop={fn()} onDragEnd={fn()} />)}
      </div>
    </TabsProvider>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('GET')).toBeInTheDocument();
    await expect(canvas.getByText('POST')).toBeInTheDocument();
    await expect(canvas.getByText('PUT')).toBeInTheDocument();
    await expect(canvas.getByText('DELETE')).toBeInTheDocument();
  }
}`,
            ...R.parameters?.docs?.source,
          },
          description: {
            story: `MethodVariants — renders GET, POST, PUT, and DELETE tabs side by side to
verify that each HTTP method receives its correct colour token.`,
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
    tab: FIXTURE_TAB,
    active: true,
    index: 0,
    ...DRAG_PROPS
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        height: '200px'
      }
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const tabEl = canvas.getByTitle(FIXTURE_TAB.name);
    await userEvent.pointer({
      target: tabEl,
      keys: '[MouseRight]'
    });
    // Context menu is portalled to document.body
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByText('Close Tab')).toBeInTheDocument();
    await expect(body.getByText('Duplicate Tab')).toBeInTheDocument();
    await expect(body.getByText('Copy Request URL')).toBeInTheDocument();
  }
}`,
            ...z.parameters?.docs?.source,
          },
          description: {
            story: `ContextMenu — right-clicking the tab opens the context menu.
The play function fires a contextmenu event and asserts that the menu items
(Close Tab, Duplicate Tab, Copy Request URL) are present in the document.`,
            ...z.parameters?.docs?.description,
          },
        },
      }),
      (B = [`Active`, `Inactive`, `Dirty`, `InactiveHover`, `MethodVariants`, `ContextMenu`]))
  })
V()
export {
  P as Active,
  z as ContextMenu,
  I as Dirty,
  F as Inactive,
  L as InactiveHover,
  R as MethodVariants,
  B as __namedExportsOrder,
  N as default,
  V as n,
  x as t,
}
