import { a as e, n as t, r as n } from './chunk-DnJy8xQt.js'
import {
  C as r,
  S as i,
  f as a,
  gt as o,
  m as s,
  p as c,
  t as l,
  x as u,
} from './iframe-CECvvSLk.js'
import { n as d, t as f } from './TabsContext-DSn62RXv.js'
import { n as p, t as m } from './UrlInput-CGaVMZec.js'
var h = n({
  DynamicVariable: () => A,
  Empty: () => D,
  MultipleVariableMix: () => j,
  VariableSegments: () => k,
  WithUrl: () => O,
  __namedExportsOrder: () => M,
  default: () => E,
})
function g(e, t = !1) {
  return { value: e, scope: `environment`, secret: t }
}
function _(e = {}) {
  ;(localStorage.setItem(`cortex.tabs.list`, JSON.stringify([T])),
    localStorage.setItem(`cortex.tabs.activeId`, w),
    c(),
    s.setState({ resolvedVariables: { [w]: e } }),
    i(),
    r.setState({ activeWorkspacePath: `/mock/workspace` }))
}
function v(e) {
  let [t, n] = (0, y.useState)(e.value)
  return (0, b.jsx)(m, {
    value: t,
    onChange: (t) => {
      ;(n(t), e.onChange(t))
    },
    onEnter: e.onEnter,
  })
}
var y,
  b,
  x,
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
  N = t(() => {
    ;((y = e(o(), 1)),
      p(),
      d(),
      a(),
      u(),
      (b = l()),
      ({ fn: x } = __STORYBOOK_MODULE_TEST__),
      ({ expect: S, within: C } = __STORYBOOK_MODULE_TEST__),
      (w = `story-urlinput-tab-001`),
      (T = {
        id: w,
        type: `request`,
        name: `Story Request`,
        method: `GET`,
        requestPath: null,
        collectionId: null,
        collectionPath: null,
        folderPath: null,
        exampleId: null,
        isDirty: !1,
      }),
      (E = {
        title: `composer/UrlInput`,
        component: v,
        parameters: { layout: `padded` },
        decorators: [
          (e) =>
            (0, b.jsx)(f, {
              children: (0, b.jsx)(`div`, {
                className: `flex flex-col bg-bg-panel p-4`,
                style: { width: `600px` },
                children: (0, b.jsx)(e, {}),
              }),
            }),
        ],
        args: { value: ``, onChange: x(), onEnter: x() },
        argTypes: {
          value: {
            control: { type: `text` },
            description: 'The current URL string. May contain `{{variable}}` tokens.',
          },
          onChange: {
            description: `Callback fired on every keystroke with the new URL string.`,
            action: `onChange`,
          },
          onEnter: {
            description: `Callback fired when the user presses Enter (and the autocomplete is closed).`,
            action: `onEnter`,
          },
        },
      }),
      (D = {
        args: { value: `` },
        beforeEach: () => {
          _()
        },
      }),
      (O = {
        args: { value: `https://api.example.com/users/123` },
        beforeEach: () => {
          _()
        },
      }),
      (k = {
        args: { value: `https://{{baseUrl}}/users/{{userId}}/posts` },
        beforeEach: () => {
          _({ baseUrl: g(`api.example.com`) })
        },
        play: async ({ canvasElement: e }) => {
          let t = C(e)
          ;(await S(t.getAllByText(/\{\{baseUrl\}\}/).length).toBeGreaterThan(0),
            await S(t.getAllByText(/\{\{userId\}\}/).length).toBeGreaterThan(0))
        },
      }),
      (A = {
        args: { value: `https://api.example.com/events?t={{$timestamp}}` },
        beforeEach: () => {
          _()
        },
      }),
      (j = {
        args: { value: `https://{{baseUrl}}/{{version}}/items/{{$randomUUID}}` },
        beforeEach: () => {
          _({ baseUrl: g(`api.example.com`) })
        },
      }),
      (D.parameters = {
        ...D.parameters,
        docs: {
          ...D.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    value: ''
  },
  beforeEach: () => {
    seedTab();
  }
}`,
            ...D.parameters?.docs?.source,
          },
          description: {
            story: `Empty — the input with no URL. Shows the placeholder text
_"Enter URL or paste text"_ in the overlay.`,
            ...D.parameters?.docs?.description,
          },
        },
      }),
      (O.parameters = {
        ...O.parameters,
        docs: {
          ...O.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    value: 'https://api.example.com/users/123'
  },
  beforeEach: () => {
    seedTab();
  }
}`,
            ...O.parameters?.docs?.source,
          },
          description: {
            story: `WithUrl — a plain URL without any variable tokens.
The overlay renders the text in the default \`text-text-primary\` colour.
No coloured spans are produced.`,
            ...O.parameters?.docs?.description,
          },
        },
      }),
      (k.parameters = {
        ...k.parameters,
        docs: {
          ...k.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    value: 'https://{{baseUrl}}/users/{{userId}}/posts'
  },
  beforeEach: () => {
    seedTab({
      baseUrl: makeResolved('api.example.com')
    });
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // The overlay renders each segment as a <span>; verify token spans exist
    await expect(canvas.getAllByText(/\\{\\{baseUrl\\}\\}/).length).toBeGreaterThan(0);
    await expect(canvas.getAllByText(/\\{\\{userId\\}\\}/).length).toBeGreaterThan(0);
  }
}`,
            ...k.parameters?.docs?.source,
          },
          description: {
            story:
              'VariableSegments — a URL with two `{{variable}}` tokens.\n- `{{baseUrl}}` is **resolved** (seeded in the store) → rendered in **green**\n- `{{userId}}` is **unresolved** (not in the store) → rendered in **red**\n\nHover either token to see the VarPopover.',
            ...k.parameters?.docs?.description,
          },
        },
      }),
      (A.parameters = {
        ...A.parameters,
        docs: {
          ...A.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    value: 'https://api.example.com/events?t={{$timestamp}}'
  },
  beforeEach: () => {
    seedTab();
  }
}`,
            ...A.parameters?.docs?.source,
          },
          description: {
            story:
              'DynamicVariable — a URL with a `$timestamp` dynamic variable.\nDynamic variables (those starting with `$`) are always rendered in the\n**accent blue** colour regardless of whether they are "resolved", because\ntheir value is computed at request-send time by the Rust executor.',
            ...A.parameters?.docs?.description,
          },
        },
      }),
      (j.parameters = {
        ...j.parameters,
        docs: {
          ...j.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    value: 'https://{{baseUrl}}/{{version}}/items/{{$randomUUID}}'
  },
  beforeEach: () => {
    seedTab({
      baseUrl: makeResolved('api.example.com')
    });
  }
}`,
            ...j.parameters?.docs?.source,
          },
          description: {
            story: `MultipleVariableMix — a URL that combines resolved, unresolved, and dynamic tokens.
Useful for verifying that all three colour classes are applied correctly
in a single input without any rendering conflicts.`,
            ...j.parameters?.docs?.description,
          },
        },
      }),
      (M = [`Empty`, `WithUrl`, `VariableSegments`, `DynamicVariable`, `MultipleVariableMix`]))
  })
N()
export {
  A as DynamicVariable,
  D as Empty,
  j as MultipleVariableMix,
  k as VariableSegments,
  O as WithUrl,
  M as __namedExportsOrder,
  E as default,
  N as n,
  h as t,
}
