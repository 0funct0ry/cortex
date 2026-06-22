import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { gt as n, t as r } from './iframe-CECvvSLk.js'
import { n as i, t as a } from './Tooltip-D06fzBd3.js'
var o = t({
    AlignEnd: () => y,
    AlignStart: () => v,
    Bottom: () => p,
    Default: () => f,
    Left: () => h,
    LongContent: () => _,
    Right: () => g,
    Top: () => m,
    WithDelay: () => b,
    __namedExportsOrder: () => x,
    default: () => d,
  }),
  s,
  c,
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
  x,
  S = e(() => {
    ;(n(),
      i(),
      (s = r()),
      ({ expect: c, userEvent: l, within: u } = __STORYBOOK_MODULE_TEST__),
      (d = {
        title: `ui/Tooltip`,
        component: a,
        parameters: { layout: `centered` },
        args: {
          content: `Tooltip text`,
          position: `bottom`,
          align: `center`,
          delay: 0,
          children: (0, s.jsx)(`button`, {
            className: `px-3 py-1.5 bg-bg-surface border border-border-subtle rounded-sm text-sm text-text-primary`,
            children: `Hover me`,
          }),
        },
        argTypes: {
          position: {
            control: `select`,
            options: [`top`, `bottom`, `left`, `right`],
            description: `Placement of the tooltip relative to the trigger`,
          },
          align: {
            control: `select`,
            options: [`start`, `center`, `end`],
            description: `Alignment along the cross-axis`,
          },
          delay: {
            control: `number`,
            description: `Hover delay in milliseconds before the tooltip appears`,
          },
          content: { control: `text`, description: `Text content of the tooltip` },
        },
      }),
      (f = {}),
      (p = {
        args: { position: `bottom`, content: `Opens below` },
        play: async ({ canvasElement: e }) => {
          let t = u(e),
            n = t.getByRole(`button`)
          ;(await l.hover(n), await c(t.getByText(`Opens below`)).toBeInTheDocument())
        },
      }),
      (m = {
        args: { position: `top`, content: `Opens above` },
        play: async ({ canvasElement: e }) => {
          let t = u(e),
            n = t.getByRole(`button`)
          ;(await l.hover(n), await c(t.getByText(`Opens above`)).toBeInTheDocument())
        },
      }),
      (h = {
        args: { position: `left`, content: `Opens left` },
        play: async ({ canvasElement: e }) => {
          let t = u(e),
            n = t.getByRole(`button`)
          ;(await l.hover(n), await c(t.getByText(`Opens left`)).toBeInTheDocument())
        },
      }),
      (g = {
        args: { position: `right`, content: `Opens right` },
        play: async ({ canvasElement: e }) => {
          let t = u(e),
            n = t.getByRole(`button`)
          ;(await l.hover(n), await c(t.getByText(`Opens right`)).toBeInTheDocument())
        },
      }),
      (_ = {
        args: {
          content: `This is a much longer tooltip message that documents expected whitespace-nowrap behaviour`,
          position: `bottom`,
        },
        play: async ({ canvasElement: e }) => {
          let t = u(e),
            n = t.getByRole(`button`)
          ;(await l.hover(n),
            await c(
              t.getByText(
                `This is a much longer tooltip message that documents expected whitespace-nowrap behaviour`
              )
            ).toBeInTheDocument())
        },
      }),
      (v = { args: { position: `bottom`, align: `start`, content: `Aligned to start` } }),
      (y = { args: { position: `bottom`, align: `end`, content: `Aligned to end` } }),
      (b = {
        args: { delay: 300, content: `Appeared after delay` },
        play: async ({ canvasElement: e }) => {
          let t = u(e),
            n = t.getByRole(`button`)
          ;(await l.hover(n),
            await new Promise((e) => setTimeout(e, 350)),
            await c(t.getByText(`Appeared after delay`)).toBeInTheDocument())
        },
      }),
      (f.parameters = {
        ...f.parameters,
        docs: {
          ...f.parameters?.docs,
          source: { originalSource: `{}`, ...f.parameters?.docs?.source },
          description: {
            story: `Default state — tooltip appears below the trigger on hover.
Delay is set to 0 for instant display during interaction testing.`,
            ...f.parameters?.docs?.description,
          },
        },
      }),
      (p.parameters = {
        ...p.parameters,
        docs: {
          ...p.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    position: 'bottom',
    content: 'Opens below'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.hover(trigger);
    await expect(canvas.getByText('Opens below')).toBeInTheDocument();
  }
}`,
            ...p.parameters?.docs?.source,
          },
          description: {
            story: `Bottom — tooltip appears below the trigger (default position).
The play function hovers the trigger and asserts the tooltip becomes visible.`,
            ...p.parameters?.docs?.description,
          },
        },
      }),
      (m.parameters = {
        ...m.parameters,
        docs: {
          ...m.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    position: 'top',
    content: 'Opens above'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.hover(trigger);
    await expect(canvas.getByText('Opens above')).toBeInTheDocument();
  }
}`,
            ...m.parameters?.docs?.source,
          },
          description: {
            story: `Top — tooltip appears above the trigger.`,
            ...m.parameters?.docs?.description,
          },
        },
      }),
      (h.parameters = {
        ...h.parameters,
        docs: {
          ...h.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    position: 'left',
    content: 'Opens left'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.hover(trigger);
    await expect(canvas.getByText('Opens left')).toBeInTheDocument();
  }
}`,
            ...h.parameters?.docs?.source,
          },
          description: {
            story: `Left — tooltip appears to the left of the trigger.`,
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
  args: {
    position: 'right',
    content: 'Opens right'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.hover(trigger);
    await expect(canvas.getByText('Opens right')).toBeInTheDocument();
  }
}`,
            ...g.parameters?.docs?.source,
          },
          description: {
            story: `Right — tooltip appears to the right of the trigger.`,
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
  args: {
    content: 'This is a much longer tooltip message that documents expected whitespace-nowrap behaviour',
    position: 'bottom'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.hover(trigger);
    await expect(canvas.getByText('This is a much longer tooltip message that documents expected whitespace-nowrap behaviour')).toBeInTheDocument();
  }
}`,
            ..._.parameters?.docs?.source,
          },
          description: {
            story: `LongContent — verifies that long tooltip text renders correctly without
breaking layout. The \`whitespace-nowrap\` class on the tooltip span means
it extends horizontally; this story documents that expected behaviour.`,
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
  args: {
    position: 'bottom',
    align: 'start',
    content: 'Aligned to start'
  }
}`,
            ...v.parameters?.docs?.source,
          },
          description: {
            story: `AlignStart — tooltip aligned to the start edge of the trigger.`,
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
  args: {
    position: 'bottom',
    align: 'end',
    content: 'Aligned to end'
  }
}`,
            ...y.parameters?.docs?.source,
          },
          description: {
            story: `AlignEnd — tooltip aligned to the end edge of the trigger.`,
            ...y.parameters?.docs?.description,
          },
        },
      }),
      (b.parameters = {
        ...b.parameters,
        docs: {
          ...b.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    delay: 300,
    content: 'Appeared after delay'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.hover(trigger);
    // Wait for the delay to elapse
    await new Promise(r => setTimeout(r, 350));
    await expect(canvas.getByText('Appeared after delay')).toBeInTheDocument();
  }
}`,
            ...b.parameters?.docs?.source,
          },
          description: {
            story: `WithDelay — demonstrates the default 300ms hover delay.
The play function uses a manual wait to account for the timeout.`,
            ...b.parameters?.docs?.description,
          },
        },
      }),
      (x = [
        `Default`,
        `Bottom`,
        `Top`,
        `Left`,
        `Right`,
        `LongContent`,
        `AlignStart`,
        `AlignEnd`,
        `WithDelay`,
      ]))
  })
S()
export {
  y as AlignEnd,
  v as AlignStart,
  p as Bottom,
  f as Default,
  h as Left,
  _ as LongContent,
  g as Right,
  m as Top,
  b as WithDelay,
  x as __namedExportsOrder,
  d as default,
  S as n,
  o as t,
}
