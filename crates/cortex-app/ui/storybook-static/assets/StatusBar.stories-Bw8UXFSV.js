import { a as e, n as t, r as n } from './chunk-DnJy8xQt.js'
import { A as r, gt as i, t as a } from './iframe-CECvvSLk.js'
import { O as o, S as s, v as c } from './Icons-DjzhDYF3.js'
import { a as l, i as u, n as d, r as f, t as p } from './ThemePicker-B67_07r1.js'
var m,
  h,
  g,
  _ = t(() => {
    ;((m = e(i(), 1)),
      o(),
      u(),
      d(),
      r(),
      (h = a()),
      (g = () => {
        let { theme: e } = l(),
          [t, n] = m.useState(!1)
        return (0, h.jsxs)(`footer`, {
          className: `h-[22px] bg-bg-panel border-t border-border-subtle flex items-center px-3 gap-3 shrink-0 relative`,
          children: [
            (0, h.jsx)(`div`, { className: `flex-1` }),
            ` `,
            (0, h.jsxs)(`div`, {
              className: `flex items-center gap-3`,
              children: [
                (0, h.jsxs)(`div`, {
                  className: `flex items-center gap-1.5 text-text-muted text-[11px] cursor-pointer hover:text-text-secondary transition-colors group`,
                  children: [
                    (0, h.jsx)(s, {
                      size: 12,
                      className: `text-text-muted group-hover:text-text-secondary`,
                    }),
                    (0, h.jsx)(`span`, { children: `Search` }),
                    (0, h.jsx)(`span`, {
                      className: `text-text-muted/60 text-[10px] ml-0.5`,
                      children: `Cmd+K`,
                    }),
                  ],
                }),
                (0, h.jsx)(`div`, { className: `w-[1px] h-3 bg-border-subtle` }),
                (0, h.jsxs)(`div`, {
                  onClick: () => n(!t),
                  className: `flex items-center gap-1.5 text-[11px] cursor-pointer transition-colors group ${t ? `text-text-primary` : `text-text-muted hover:text-text-secondary`}`,
                  children: [
                    (0, h.jsx)(c, {
                      size: 12,
                      className: t
                        ? `text-accent`
                        : `text-text-muted group-hover:text-text-secondary`,
                    }),
                    (0, h.jsx)(`span`, { className: `capitalize`, children: e.replace(/-/g, ` `) }),
                  ],
                }),
                (0, h.jsx)(`div`, { className: `w-[1px] h-3 bg-border-subtle` }),
                (0, h.jsx)(`div`, { className: `text-text-muted text-[11px]`, children: `0.0.0` }),
                !1,
              ],
            }),
            t && (0, h.jsx)(p, { onClose: () => n(!1) }),
          ],
        })
      }),
      (g.__docgenInfo = { description: ``, methods: [], displayName: `StatusBar` }))
  }),
  v = n({
    Default: () => w,
    SearchHint: () => E,
    WithThemePicker: () => T,
    __namedExportsOrder: () => D,
    default: () => C,
  }),
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
    ;(i(),
      _(),
      u(),
      (y = a()),
      ({ expect: b, userEvent: x, within: S } = __STORYBOOK_MODULE_TEST__),
      (C = {
        title: `layout/StatusBar`,
        component: g,
        parameters: { layout: `fullscreen`, tauriMock: { open_devtools: () => void 0 } },
        decorators: [
          (e) =>
            (0, y.jsx)(f, {
              children: (0, y.jsxs)(`div`, {
                className: `relative flex flex-col`,
                style: { height: `100vh` },
                children: [(0, y.jsx)(`div`, { className: `flex-1` }), (0, y.jsx)(e, {})],
              }),
            }),
        ],
      }),
      (w = {
        play: async ({ canvasElement: e }) => {
          let t = S(e),
            n = t.getByText(/dark|light/i)
          ;(await x.click(n), await b(t.getByText(`Nord`)).toBeInTheDocument())
        },
      }),
      (T = {
        play: async ({ canvasElement: e }) => {
          let t = S(e).getByText(/dark|light/i)
          ;(await x.click(t), await x.click(t))
        },
      }),
      (E = {
        play: async ({ canvasElement: e }) => {
          let t = S(e)
          ;(await b(t.getByText(`Search`)).toBeInTheDocument(),
            await b(t.getByText(`Cmd+K`)).toBeInTheDocument())
        },
      }),
      (w.parameters = {
        ...w.parameters,
        docs: {
          ...w.parameters?.docs,
          source: {
            originalSource: `{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // Theme chip text is the humanised theme name, e.g. "dark"
    const themeChip = canvas.getByText(/dark|light/i);
    await userEvent.click(themeChip);
    // ThemePicker renders a list of theme options. Assert a single unique theme
    // name — "Nord" appears exactly once and is unambiguous in the picker list.
    await expect(canvas.getByText('Nord')).toBeInTheDocument();
  }
}`,
            ...w.parameters?.docs?.source,
          },
          description: {
            story: `Default — idle state.
Shows the search hint (Cmd+K), active theme name, and app version.
The play function clicks the theme name chip and verifies the ThemePicker opens.`,
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
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const themeChip = canvas.getByText(/dark|light/i);
    await userEvent.click(themeChip);
    // Picker is open — clicking again should close it
    await userEvent.click(themeChip);
  }
}`,
            ...T.parameters?.docs?.source,
          },
          description: {
            story: `WithThemePicker — documents that clicking the theme chip toggles ThemePicker.
Uses the same interaction as Default but acts as a named reference variant.`,
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
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Search')).toBeInTheDocument();
    await expect(canvas.getByText('Cmd+K')).toBeInTheDocument();
  }
}`,
            ...E.parameters?.docs?.source,
          },
          description: {
            story: `SearchHint — verifies the "Search / Cmd+K" affordance is always rendered
regardless of theme or workspace state.`,
            ...E.parameters?.docs?.description,
          },
        },
      }),
      (D = [`Default`, `WithThemePicker`, `SearchHint`]))
  })
O()
export {
  w as Default,
  E as SearchHint,
  T as WithThemePicker,
  D as __namedExportsOrder,
  C as default,
  O as n,
  v as t,
}
