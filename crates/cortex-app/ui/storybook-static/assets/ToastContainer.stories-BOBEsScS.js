import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { E as n, gt as r, t as i, w as a } from './iframe-CECvvSLk.js'
import { n as o, t as s } from './Toast-BKe4INxc.js'
var c,
  l,
  u = e(() => {
    ;(r(),
      a(),
      o(),
      (c = i()),
      (l = () => {
        let { toasts: e } = n()
        return (0, c.jsx)(`div`, {
          className: `fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none`,
          children: e.map((e) =>
            (0, c.jsx)(
              `div`,
              {
                className: `pointer-events-auto`,
                children: (0, c.jsx)(s, { id: e.id, type: e.type, message: e.message }),
              },
              e.id
            )
          ),
        })
      }),
      (l.__docgenInfo = { description: ``, methods: [], displayName: `ToastContainer` }))
  }),
  d = t({
    Empty: () => h,
    LongMessages: () => v,
    Multiple: () => _,
    Single: () => g,
    __namedExportsOrder: () => y,
    default: () => m,
  }),
  f,
  p,
  m,
  h,
  g,
  _,
  v,
  y,
  b = e(() => {
    ;(u(),
      a(),
      ({ expect: f, within: p } = __STORYBOOK_MODULE_TEST__),
      (m = { title: `ui/ToastContainer`, component: l, parameters: { layout: `fullscreen` } }),
      (h = {
        beforeEach: () => {
          n.setState({ toasts: [] })
        },
      }),
      (g = {
        beforeEach: () => {
          n.setState({ toasts: [{ id: `single-1`, type: `success`, message: `Workspace saved.` }] })
        },
      }),
      (_ = {
        beforeEach: () => {
          n.setState({
            toasts: [
              { id: `multi-1`, type: `success`, message: `Collection imported successfully.` },
              { id: `multi-2`, type: `error`, message: `Failed to connect to the server.` },
              { id: `multi-3`, type: `info`, message: `A new Cortex update is available.` },
            ],
          })
        },
        play: async ({ canvasElement: e }) => {
          let t = p(e)
          ;(await f(t.getByText(`Collection imported successfully.`)).toBeInTheDocument(),
            await f(t.getByText(`Failed to connect to the server.`)).toBeInTheDocument(),
            await f(t.getByText(`A new Cortex update is available.`)).toBeInTheDocument())
        },
      }),
      (v = {
        beforeEach: () => {
          n.setState({
            toasts: [
              {
                id: `long-1`,
                type: `success`,
                message: `Your collection has been exported and saved to the selected directory.`,
              },
              {
                id: `long-2`,
                type: `error`,
                message: `Unable to reach the remote server. Check your network connection and try again.`,
              },
            ],
          })
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
  }
}`,
            ...h.parameters?.docs?.source,
          },
          description: {
            story: `Empty — no toasts in the store. The container renders but is invisible
(zero children). Useful for verifying there are no layout side-effects.`,
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
    useToastStore.setState({
      toasts: [{
        id: 'single-1',
        type: 'success',
        message: 'Workspace saved.'
      }]
    });
  }
}`,
            ...g.parameters?.docs?.source,
          },
          description: {
            story: `Single — one success toast visible in the top-right corner.`,
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
    useToastStore.setState({
      toasts: [{
        id: 'multi-1',
        type: 'success',
        message: 'Collection imported successfully.'
      }, {
        id: 'multi-2',
        type: 'error',
        message: 'Failed to connect to the server.'
      }, {
        id: 'multi-3',
        type: 'info',
        message: 'A new Cortex update is available.'
      }]
    });
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // Verify all three messages are rendered
    await expect(canvas.getByText('Collection imported successfully.')).toBeInTheDocument();
    await expect(canvas.getByText('Failed to connect to the server.')).toBeInTheDocument();
    await expect(canvas.getByText('A new Cortex update is available.')).toBeInTheDocument();
  }
}`,
            ..._.parameters?.docs?.source,
          },
          description: {
            story: `Multiple — three stacked toasts (success, error, info) displayed
simultaneously to verify the stacking gap and z-index are correct.`,
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
    useToastStore.setState({
      toasts: [{
        id: 'long-1',
        type: 'success',
        message: 'Your collection has been exported and saved to the selected directory.'
      }, {
        id: 'long-2',
        type: 'error',
        message: 'Unable to reach the remote server. Check your network connection and try again.'
      }]
    });
  }
}`,
            ...v.parameters?.docs?.source,
          },
          description: {
            story: `LongMessages — multiple toasts with verbose messages to verify max-width
constrains each individual toast correctly even when stacked.`,
            ...v.parameters?.docs?.description,
          },
        },
      }),
      (y = [`Empty`, `Single`, `Multiple`, `LongMessages`]))
  })
b()
export {
  h as Empty,
  v as LongMessages,
  _ as Multiple,
  g as Single,
  y as __namedExportsOrder,
  m as default,
  b as n,
  d as t,
}
