import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { gt as n, t as r } from './iframe-CECvvSLk.js'
import { i, n as a, r as o, t as s } from './ThemePicker-B67_07r1.js'
var c = t({
    AllThemesVisible: () => _,
    CloseOnEscape: () => y,
    DarkThemeActive: () => g,
    LightThemeActive: () => h,
    SelectTheme: () => v,
    __namedExportsOrder: () => b,
    default: () => m,
  }),
  l,
  u,
  d,
  f,
  p,
  m,
  h,
  g,
  _,
  v,
  y,
  b,
  x = e(() => {
    ;(n(),
      a(),
      i(),
      (l = r()),
      ({ expect: u, fn: d, userEvent: f, within: p } = __STORYBOOK_MODULE_TEST__),
      (m = {
        title: `layout/ThemePicker`,
        component: s,
        parameters: {
          layout: `fullscreen`,
          docs: {
            description: {
              component: `A dropdown overlay listing all 13 Cortex themes grouped into Light and Dark sections. Hovering a theme previews it instantly; clicking selects it and closes the picker. Escape or a click outside also closes.`,
            },
          },
        },
        decorators: [
          (e) =>
            (0, l.jsx)(o, {
              children: (0, l.jsx)(`div`, {
                className: `relative flex flex-col bg-bg-panel`,
                style: { height: `100vh`, width: `100%` },
                children: (0, l.jsx)(e, {}),
              }),
            }),
        ],
        argTypes: {
          onClose: {
            description: `Callback invoked when the picker should close (Escape, click outside, or theme selected).`,
            action: `onClose`,
          },
        },
        args: { onClose: d() },
      }),
      (h = {
        beforeEach: () => {
          localStorage.setItem(`cortex.theme`, `light`)
        },
        play: async ({ canvasElement: e }) => {
          let t = p(e)
          ;(await u(t.getByText(`✓ active`)).toBeInTheDocument(),
            await u(t.getByText(`Light`)).toBeInTheDocument())
        },
      }),
      (g = {
        beforeEach: () => {
          localStorage.setItem(`cortex.theme`, `dark`)
        },
        play: async ({ canvasElement: e }) => {
          let t = p(e)
          ;(await u(t.getByText(`✓ active`)).toBeInTheDocument(),
            await u(t.getByText(`Dark`)).toBeInTheDocument())
        },
      }),
      (_ = {
        beforeEach: () => {
          localStorage.setItem(`cortex.theme`, `dark`)
        },
        play: async ({ canvasElement: e }) => {
          let t = p(e)
          ;(await u(t.getByText(`Light Themes`)).toBeInTheDocument(),
            await u(t.getByText(`Light`)).toBeInTheDocument(),
            await u(t.getByText(`Light Monochrome`)).toBeInTheDocument(),
            await u(t.getByText(`Light Pastel`)).toBeInTheDocument(),
            await u(t.getByText(`Catppuccin Latte`)).toBeInTheDocument(),
            await u(t.getByText(`VS Code Light`)).toBeInTheDocument(),
            await u(t.getByText(`Dark Themes`)).toBeInTheDocument(),
            await u(t.getByText(`Dark`)).toBeInTheDocument(),
            await u(t.getByText(`Dark Monochrome`)).toBeInTheDocument(),
            await u(t.getByText(`Dark Pastel`)).toBeInTheDocument(),
            await u(t.getByText(/Catppuccin Frapp/)).toBeInTheDocument(),
            await u(t.getByText(`Catppuccin Macchiato`)).toBeInTheDocument(),
            await u(t.getByText(`Catppuccin Mocha`)).toBeInTheDocument(),
            await u(t.getByText(`Nord`)).toBeInTheDocument(),
            await u(t.getByText(`VS Code Dark`)).toBeInTheDocument())
        },
      }),
      (v = {
        beforeEach: () => {
          localStorage.setItem(`cortex.theme`, `dark`)
        },
        play: async ({ canvasElement: e, args: t }) => {
          let n = p(e).getByText(`Nord`)
          ;(await f.click(n), await u(t.onClose).toHaveBeenCalledTimes(1))
        },
      }),
      (y = {
        beforeEach: () => {
          localStorage.setItem(`cortex.theme`, `dark`)
        },
        play: async ({ canvasElement: e, args: t }) => {
          let n = p(e).getByRole(`button`)
          ;(await f.click(n), await u(t.onClose).toHaveBeenCalledTimes(1))
        },
      }),
      (h.parameters = {
        ...h.parameters,
        docs: {
          ...h.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    localStorage.setItem('cortex.theme', 'light');
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // "✓ active" label should appear next to the active theme
    await expect(canvas.getByText('✓ active')).toBeInTheDocument();
    // The Light entry is present
    await expect(canvas.getByText('Light')).toBeInTheDocument();
  }
}`,
            ...h.parameters?.docs?.source,
          },
          description: {
            story:
              'LightThemeActive — picker rendered with the `light` theme selected.\nThe "Light" entry shows a filled accent dot and a "✓ active" label.\nlocalStorage is pre-seeded so ThemeProvider initialises to `light`.',
            ...h.parameters?.docs?.description,
          },
        },
      }),
      (g.parameters = {
        ...g.parameters,
        docs: {
          ...g.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    localStorage.setItem('cortex.theme', 'dark');
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('✓ active')).toBeInTheDocument();
    await expect(canvas.getByText('Dark')).toBeInTheDocument();
  }
}`,
            ...g.parameters?.docs?.source,
          },
          description: {
            story:
              'DarkThemeActive — picker rendered with the `dark` theme selected.\nThe "Dark" entry shows the accent indicator and "✓ active" badge.',
            ...g.parameters?.docs?.description,
          },
        },
      }),
      (_.parameters = {
        ..._.parameters,
        docs: {
          ..._.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    localStorage.setItem('cortex.theme', 'dark');
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // Light section
    await expect(canvas.getByText('Light Themes')).toBeInTheDocument();
    await expect(canvas.getByText('Light')).toBeInTheDocument();
    await expect(canvas.getByText('Light Monochrome')).toBeInTheDocument();
    await expect(canvas.getByText('Light Pastel')).toBeInTheDocument();
    await expect(canvas.getByText('Catppuccin Latte')).toBeInTheDocument();
    await expect(canvas.getByText('VS Code Light')).toBeInTheDocument();
    // Dark section
    await expect(canvas.getByText('Dark Themes')).toBeInTheDocument();
    await expect(canvas.getByText('Dark')).toBeInTheDocument();
    await expect(canvas.getByText('Dark Monochrome')).toBeInTheDocument();
    await expect(canvas.getByText('Dark Pastel')).toBeInTheDocument();
    await expect(canvas.getByText(/Catppuccin Frapp/)).toBeInTheDocument();
    await expect(canvas.getByText('Catppuccin Macchiato')).toBeInTheDocument();
    await expect(canvas.getByText('Catppuccin Mocha')).toBeInTheDocument();
    await expect(canvas.getByText('Nord')).toBeInTheDocument();
    await expect(canvas.getByText('VS Code Dark')).toBeInTheDocument();
  }
}`,
            ..._.parameters?.docs?.source,
          },
          description: {
            story: `AllThemesVisible — verifies all 13 theme names appear in the picker list,
spanning both the Light Themes and Dark Themes sections.`,
            ..._.parameters?.docs?.description,
          },
        },
      }),
      (v.parameters = {
        ...v.parameters,
        docs: {
          ...v.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    localStorage.setItem('cortex.theme', 'dark');
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const nordItem = canvas.getByText('Nord');
    await userEvent.click(nordItem);
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  }
}`,
            ...v.parameters?.docs?.source,
          },
          description: {
            story:
              'SelectTheme — clicking a theme item calls `onClose` and marks the theme active.\nThe play function clicks "Nord" and asserts the spy was invoked.',
            ...v.parameters?.docs?.description,
          },
        },
      }),
      (y.parameters = {
        ...y.parameters,
        docs: {
          ...y.parameters?.docs,
          source: {
            originalSource: `{
  beforeEach: () => {
    localStorage.setItem('cortex.theme', 'dark');
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    // Focus something inside the picker first
    const closeBtn = canvas.getByRole('button');
    await userEvent.click(closeBtn);
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  }
}`,
            ...y.parameters?.docs?.source,
          },
          description: {
            story: 'CloseOnEscape — pressing Escape invokes `onClose` without selecting a theme.',
            ...y.parameters?.docs?.description,
          },
        },
      }),
      (b = [
        `LightThemeActive`,
        `DarkThemeActive`,
        `AllThemesVisible`,
        `SelectTheme`,
        `CloseOnEscape`,
      ]))
  })
x()
export {
  _ as AllThemesVisible,
  y as CloseOnEscape,
  g as DarkThemeActive,
  h as LightThemeActive,
  v as SelectTheme,
  b as __namedExportsOrder,
  m as default,
  x as n,
  c as t,
}
