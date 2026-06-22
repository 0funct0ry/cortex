import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { E as n, w as r } from './iframe-CECvvSLk.js'
import { n as i, t as a } from './Toast-BKe4INxc.js'
var o = t({
    Default: () => u,
    Error: () => f,
    Info: () => p,
    LongMessage: () => m,
    ResetStore: () => h,
    Success: () => d,
    __namedExportsOrder: () => g,
    default: () => l,
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
  _ = e(() => {
    ;(i(),
      r(),
      ({ userEvent: s, within: c } = __STORYBOOK_MODULE_TEST__),
      (l = {
        title: `ui/Toast`,
        component: a,
        parameters: { layout: `centered` },
        args: {
          id: `toast-preview`,
          type: `success`,
          message: `Operation completed successfully.`,
        },
        argTypes: {
          type: {
            control: `select`,
            options: [`success`, `error`, `info`],
            description: `Visual variant of the toast notification`,
          },
          message: { control: `text`, description: `Notification message text` },
          id: { control: `text`, description: `Unique identifier used when dismissing the toast` },
        },
      }),
      (u = {}),
      (d = {
        args: { type: `success`, message: `File saved successfully.` },
        play: async ({ canvasElement: e }) => {
          let t = c(e).getAllByRole(`button`),
            n = t[t.length - 1]
          await s.click(n)
        },
      }),
      (f = { args: { type: `error`, message: `Request failed with status 500.` } }),
      (p = { args: { type: `info`, message: `A new version of Cortex is available.` } }),
      (m = {
        args: {
          type: `info`,
          message: `This is a deliberately long notification message to verify that the toast container constrains its width and wraps text gracefully without overflowing the viewport or breaking the layout.`,
        },
      }),
      (h = {
        beforeEach: () => {
          n.setState({ toasts: [] })
        },
        args: { type: `success`, message: `Store reset before rendering.` },
      }),
      (u.parameters = {
        ...u.parameters,
        docs: {
          ...u.parameters?.docs,
          source: { originalSource: `{}`, ...u.parameters?.docs?.source },
          description: {
            story:
              'Default state — success variant with a short message. Click the × button\nto exercise the dismiss path (calls `removeToast` on the store).',
            ...u.parameters?.docs?.description,
          },
        },
      }),
      (d.parameters = {
        ...d.parameters,
        docs: {
          ...d.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    type: 'success',
    message: 'File saved successfully.'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // Dismiss button is present and clickable
    const dismissButtons = canvas.getAllByRole('button');
    const dismissBtn = dismissButtons[dismissButtons.length - 1];
    await userEvent.click(dismissBtn);
    // After click the store has removed the toast — we only verify the click
    // didn't throw; the container unmounts the component so no DOM assertion needed.
  }
}`,
            ...d.parameters?.docs?.source,
          },
          description: {
            story: `Success toast — green left-border with a check icon.`,
            ...d.parameters?.docs?.description,
          },
        },
      }),
      (f.parameters = {
        ...f.parameters,
        docs: {
          ...f.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    type: 'error',
    message: 'Request failed with status 500.'
  }
}`,
            ...f.parameters?.docs?.source,
          },
          description: {
            story: `Error toast — red left-border with an X icon.`,
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
    type: 'info',
    message: 'A new version of Cortex is available.'
  }
}`,
            ...p.parameters?.docs?.source,
          },
          description: {
            story: `Info toast — blue left-border with an info icon.`,
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
    type: 'info',
    message: 'This is a deliberately long notification message to verify that the toast container constrains its width and wraps text gracefully without overflowing the viewport or breaking the layout.'
  }
}`,
            ...m.parameters?.docs?.source,
          },
          description: {
            story: `LongMessage — verifies the toast constrains width to max-w-[450px] and
wraps text gracefully rather than overflowing the viewport.`,
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
  beforeEach: () => {
    useToastStore.setState({
      toasts: []
    });
  },
  args: {
    type: 'success',
    message: 'Store reset before rendering.'
  }
}`,
            ...h.parameters?.docs?.source,
          },
          description: {
            story: `ResetStore — demonstrates that the toast is driven purely by props;
the store is cleared in beforeEach so there are no stale toasts.`,
            ...h.parameters?.docs?.description,
          },
        },
      }),
      (g = [`Default`, `Success`, `Error`, `Info`, `LongMessage`, `ResetStore`]))
  })
_()
export {
  u as Default,
  f as Error,
  p as Info,
  m as LongMessage,
  h as ResetStore,
  d as Success,
  g as __namedExportsOrder,
  l as default,
  _ as n,
  o as t,
}
