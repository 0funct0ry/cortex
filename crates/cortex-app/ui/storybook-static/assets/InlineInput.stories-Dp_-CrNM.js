import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { gt as n, t as r } from './iframe-CECvvSLk.js'
import { n as i, t as a } from './InlineInput-D-6bKBXk.js'
var o = t({
    Default: () => p,
    EmptyInitialValue: () => m,
    ErrorStyle: () => g,
    EscapeCancel: () => _,
    LongValue: () => h,
    __namedExportsOrder: () => v,
    default: () => f,
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
  y = e(() => {
    ;(n(),
      i(),
      (s = r()),
      ({ expect: c, fn: l, userEvent: u, within: d } = __STORYBOOK_MODULE_TEST__),
      (f = {
        title: `ui/InlineInput`,
        component: a,
        parameters: { layout: `centered` },
        args: { initialValue: `My Collection`, onConfirm: l(), onCancel: l() },
        argTypes: {
          initialValue: {
            control: `text`,
            description: `Pre-filled value shown when the input mounts`,
          },
          className: {
            control: `text`,
            description: `Additional Tailwind classes applied to the input element`,
          },
          onConfirm: { description: `Called with the current value on Enter or blur` },
          onCancel: { description: `Called when Escape is pressed` },
        },
      }),
      (p = {
        play: async ({ canvasElement: e, args: t }) => {
          let n = d(e).getByRole(`textbox`)
          ;(await u.clear(n),
            await u.type(n, `Renamed Collection`),
            await u.keyboard(`{Enter}`),
            await c(t.onConfirm).toHaveBeenCalledWith(`Renamed Collection`))
        },
      }),
      (m = { args: { initialValue: `` } }),
      (h = {
        args: {
          initialValue: `This is an exceptionally long collection name that tests horizontal overflow clipping behaviour inside the inline editor`,
        },
        decorators: [
          (e) => (0, s.jsx)(`div`, { style: { width: 240 }, children: (0, s.jsx)(e, {}) }),
        ],
      }),
      (g = { args: { initialValue: ``, className: `!border-error focus:!border-error` } }),
      (_ = {
        play: async ({ canvasElement: e, args: t }) => {
          let n = d(e).getByRole(`textbox`)
          ;(await u.click(n), await u.keyboard(`{Escape}`), await c(t.onCancel).toHaveBeenCalled())
        },
      }),
      (p.parameters = {
        ...p.parameters,
        docs: {
          ...p.parameters?.docs,
          source: {
            originalSource: `{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'Renamed Collection');
    await userEvent.keyboard('{Enter}');
    await expect(args.onConfirm).toHaveBeenCalledWith('Renamed Collection');
  }
}`,
            ...p.parameters?.docs?.source,
          },
          description: {
            story: `Default — input pre-filled with "My Collection", auto-focused and selected on mount.
Press Enter or Tab away to trigger onConfirm; Escape to trigger onCancel.
The play function types a new name and presses Enter, verifying onConfirm is called.`,
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
    initialValue: ''
  }
}`,
            ...m.parameters?.docs?.source,
          },
          description: {
            story: `EmptyInitialValue — starts with an empty string.
Illustrates the blank state a consumer sees before the user types anything.`,
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
    initialValue: 'This is an exceptionally long collection name that tests horizontal overflow clipping behaviour inside the inline editor'
  },
  decorators: [Story => <div style={{
    width: 240
  }}>
        <Story />
      </div>]
}`,
            ...h.parameters?.docs?.source,
          },
          description: {
            story: `LongValue — initial value is a very long string.
Verifies the input clips within its container rather than overflowing.`,
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
    initialValue: '',
    className: '!border-error focus:!border-error'
  }
}`,
            ...g.parameters?.docs?.source,
          },
          description: {
            story: `ErrorStyle — consumer-supplied className applies a red border to signal
invalid input. InlineInput has no built-in validation state; callers control
visual feedback via className.`,
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
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.click(input);
    await userEvent.keyboard('{Escape}');
    await expect(args.onCancel).toHaveBeenCalled();
  }
}`,
            ..._.parameters?.docs?.source,
          },
          description: {
            story: `EscapeCancel — play function presses Escape and verifies onCancel fires.`,
            ..._.parameters?.docs?.description,
          },
        },
      }),
      (v = [`Default`, `EmptyInitialValue`, `LongValue`, `ErrorStyle`, `EscapeCancel`]))
  })
y()
export {
  p as Default,
  m as EmptyInitialValue,
  g as ErrorStyle,
  _ as EscapeCancel,
  h as LongValue,
  v as __namedExportsOrder,
  f as default,
  y as n,
  o as t,
}
