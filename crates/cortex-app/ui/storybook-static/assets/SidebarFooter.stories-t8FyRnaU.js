import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { gt as n, t as r } from './iframe-CECvvSLk.js'
import { O as i, b as a, d as o } from './Icons-DjzhDYF3.js'
var s,
  c,
  l = e(() => {
    ;(n(),
      i(),
      (s = r()),
      (c = () =>
        (0, s.jsxs)(`div`, {
          className: `h-9 flex items-center justify-between px-3 border-top border-border-subtle bg-bg-panel shrink-0 select-none`,
          children: [
            (0, s.jsxs)(`div`, {
              className: `flex items-center gap-1.5`,
              children: [
                (0, s.jsx)(o, { size: 14, className: `text-text-muted` }),
                (0, s.jsx)(`span`, {
                  className: `text-text-secondary text-[11px] font-semibold uppercase tracking-wider`,
                  children: `API Specs`,
                }),
              ],
            }),
            (0, s.jsx)(`button`, {
              className: `p-1 hover:bg-bg-muted rounded-md text-text-muted hover:text-text-primary transition-colors`,
              title: `Coming soon`,
              children: (0, s.jsx)(a, { size: 14 }),
            }),
          ],
        })),
      (c.__docgenInfo = { description: ``, methods: [], displayName: `SidebarFooter` }))
  }),
  u = t({ Default: () => g, __namedExportsOrder: () => _, default: () => h }),
  d,
  f,
  p,
  m,
  h,
  g,
  _,
  v = e(() => {
    ;(l(),
      (d = r()),
      ({ expect: f, userEvent: p, within: m } = __STORYBOOK_MODULE_TEST__),
      (h = {
        title: `layout/SidebarFooter`,
        component: c,
        parameters: {
          layout: `centered`,
          docs: {
            description: {
              component: `A fixed-height footer strip at the bottom of the sidebar. Displays an "API Specs" label with a file-text icon and a disabled plus button (feature coming soon).`,
            },
          },
        },
        decorators: [
          (e) => (0, d.jsx)(`div`, { style: { width: `240px` }, children: (0, d.jsx)(e, {}) }),
        ],
      }),
      (g = {
        play: async ({ canvasElement: e }) => {
          let t = m(e)
          await f(t.getByText(`API Specs`)).toBeInTheDocument()
          let n = t.getByTitle(`Coming soon`)
          ;(await f(n).toBeInTheDocument(), await p.hover(n), await f(n).toBeVisible())
        },
      }),
      (g.parameters = {
        ...g.parameters,
        docs: {
          ...g.parameters?.docs,
          source: {
            originalSource: `{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('API Specs')).toBeInTheDocument();
    const plusBtn = canvas.getByTitle('Coming soon');
    await expect(plusBtn).toBeInTheDocument();
    await userEvent.hover(plusBtn);
    await expect(plusBtn).toBeVisible();
  }
}`,
            ...g.parameters?.docs?.source,
          },
          description: {
            story: `Default — the only state of SidebarFooter.
Shows the FileText icon, "API Specs" label, and the disabled plus button.
The play function hovers the plus button and asserts the "Coming soon" tooltip title is present.`,
            ...g.parameters?.docs?.description,
          },
        },
      }),
      (_ = [`Default`]))
  })
v()
export { g as Default, _ as __namedExportsOrder, h as default, v as n, u as t }
