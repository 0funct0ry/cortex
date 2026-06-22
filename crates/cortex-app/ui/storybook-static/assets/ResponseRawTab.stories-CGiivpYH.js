import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { gt as n, t as r } from './iframe-CECvvSLk.js'
var i,
  a,
  o = e(() => {
    ;(n(),
      (i = r()),
      (a = ({ response: e }) =>
        (0, i.jsx)(`div`, {
          className: `flex-1 overflow-auto bg-bg-surface p-3 font-mono text-[12px] whitespace-pre-wrap select-text selection:bg-accent/30`,
          children: e.body,
        })),
      (a.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `ResponseRawTab`,
        props: { response: { required: !0, tsType: { name: `ResponsePayload` }, description: `` } },
      }))
  }),
  s = t({
    BinaryWarning: () => _,
    LongBody: () => g,
    RawText: () => h,
    __namedExportsOrder: () => v,
    default: () => m,
  }),
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
    ;(o(),
      (c = r()),
      ({ expect: l, within: u } = __STORYBOOK_MODULE_TEST__),
      (d = {
        requestId: `req-001`,
        status: 200,
        statusText: `OK`,
        headers: { 'content-type': `application/json` },
        body: JSON.stringify(
          {
            id: 1,
            name: `Fluffy`,
            status: `available`,
            photoUrls: [`https://example.com/fluffy.jpg`],
            tags: [{ id: 42, name: `cat` }],
          },
          null,
          2
        ),
        durationMs: 143,
        bodySize: 156,
      }),
      (f = {
        requestId: `req-002`,
        status: 200,
        statusText: `OK`,
        headers: { 'content-type': `text/plain` },
        body: Array.from({ length: 120 }, (e, t) => `Line ${t + 1}: ${`x`.repeat(80)}`).join(`
`),
        durationMs: 220,
        bodySize: 9600,
      }),
      (p = {
        requestId: `req-003`,
        status: 200,
        statusText: `OK`,
        headers: { 'content-type': `application/octet-stream` },
        body: `[Binary content — cannot display as text. Use Save to download the raw bytes.]`,
        durationMs: 55,
        bodySize: 4096,
      }),
      (m = {
        title: `layout/ResponseRawTab`,
        component: a,
        parameters: {
          layout: `fullscreen`,
          docs: {
            description: {
              component: `Renders the raw response body in a monospace, pre-wrap, selectable container. Handles any content-type since it never interprets the body — it displays exactly what the server returned.`,
            },
          },
        },
        decorators: [
          (e) =>
            (0, c.jsx)(`div`, {
              className: `flex flex-col`,
              style: { height: `100vh` },
              children: (0, c.jsx)(e, {}),
            }),
        ],
        argTypes: {
          response: {
            description: 'The ResponsePayload whose `.body` string is rendered verbatim.',
            control: !1,
          },
        },
      }),
      (h = {
        args: { response: d },
        play: async ({ canvasElement: e }) => {
          await l(u(e).getByText(/Fluffy/)).toBeInTheDocument()
        },
      }),
      (g = {
        args: { response: f },
        play: async ({ canvasElement: e }) => {
          let t = u(e)
          ;(await l(t.getByText(/Line 1:/)).toBeInTheDocument(),
            await l(t.getByText(/Line 120:/)).toBeInTheDocument())
        },
      }),
      (_ = {
        args: { response: p },
        play: async ({ canvasElement: e }) => {
          await l(u(e).getByText(/Binary content/)).toBeInTheDocument()
        },
      }),
      (h.parameters = {
        ...h.parameters,
        docs: {
          ...h.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    response: FIXTURE_RESPONSE_JSON
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Fluffy/)).toBeInTheDocument();
  }
}`,
            ...h.parameters?.docs?.source,
          },
          description: {
            story: `RawText — a small, well-formatted JSON body.
Verifies that the body string is present and that the container is in the DOM.`,
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
    response: FIXTURE_RESPONSE_LONG
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Line 1:/)).toBeInTheDocument();
    await expect(canvas.getByText(/Line 120:/)).toBeInTheDocument();
  }
}`,
            ...g.parameters?.docs?.source,
          },
          description: {
            story: `LongBody — 120 lines of text to confirm the container scrolls vertically
without clipping content or causing horizontal overflow.`,
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
    response: FIXTURE_RESPONSE_BINARY
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Binary content/)).toBeInTheDocument();
  }
}`,
            ..._.parameters?.docs?.source,
          },
          description: {
            story: `BinaryWarning — documents the convention for binary/non-printable responses:
the executor substitutes a descriptive placeholder string rather than
attempting to display raw bytes.`,
            ..._.parameters?.docs?.description,
          },
        },
      }),
      (v = [`RawText`, `LongBody`, `BinaryWarning`]))
  })
y()
export {
  _ as BinaryWarning,
  g as LongBody,
  h as RawText,
  v as __namedExportsOrder,
  m as default,
  y as n,
  s as t,
}
