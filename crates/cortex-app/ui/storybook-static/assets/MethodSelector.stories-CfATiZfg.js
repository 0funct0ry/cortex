import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { n, t as r } from './MethodSelector-CHZNDXam.js'
var i = t({
    CustomMethod: () => _,
    DeleteMethod: () => f,
    GetMethod: () => u,
    OpenDropdown: () => v,
    PatchMethod: () => p,
    PostMethod: () => d,
    ProtocolGraphQL: () => h,
    ProtocolWS: () => g,
    PutMethod: () => m,
    __namedExportsOrder: () => y,
    default: () => l,
  }),
  a,
  o,
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
  b = e(() => {
    ;(n(),
      ({ fn: a } = __STORYBOOK_MODULE_TEST__),
      ({ expect: o, userEvent: s, within: c } = __STORYBOOK_MODULE_TEST__),
      (l = {
        title: `composer/MethodSelector`,
        component: r,
        parameters: { layout: `centered` },
        args: { method: `GET`, onChange: a() },
        argTypes: {
          method: {
            control: { type: `select` },
            options: [
              `GET`,
              `POST`,
              `PUT`,
              `PATCH`,
              `DELETE`,
              `HEAD`,
              `OPTIONS`,
              `TRACE`,
              `GraphQL`,
              `gRPC`,
              `WS`,
              `SSE`,
            ],
            description: `The currently selected HTTP method or protocol.`,
          },
          onChange: {
            description: `Callback fired when the user selects a different method.`,
            action: `onChange`,
          },
        },
      }),
      (u = { args: { method: `GET` } }),
      (d = { args: { method: `POST` } }),
      (f = { args: { method: `DELETE` } }),
      (p = { args: { method: `PATCH` } }),
      (m = { args: { method: `PUT` } }),
      (h = { args: { method: `GraphQL` } }),
      (g = { args: { method: `WS` } }),
      (_ = { args: { method: `PURGE` } }),
      (v = {
        args: { method: `GET` },
        play: async ({ canvasElement: e }) => {
          let t = c(e)
          ;(await s.click(t.getByRole(`button`, { name: /^GET$/i })),
            await o(t.getByText(`HTTP Methods`)).toBeInTheDocument(),
            await o(t.getByText(`Protocols`)).toBeInTheDocument(),
            await o(t.getByText(`Custom Method`)).toBeInTheDocument())
        },
      }),
      (u.parameters = {
        ...u.parameters,
        docs: {
          ...u.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    method: 'GET'
  }
}`,
            ...u.parameters?.docs?.source,
          },
          description: {
            story: `GetMethod — the default state. Shows the GET pill with its blue-green colour.
This is the most common starting state for a new request tab.`,
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
    method: 'POST'
  }
}`,
            ...d.parameters?.docs?.source,
          },
          description: {
            story: `PostMethod — POST pill in green. Common for resource-creation endpoints.`,
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
    method: 'DELETE'
  }
}`,
            ...f.parameters?.docs?.source,
          },
          description: {
            story: `DeleteMethod — DELETE pill in red. The warning colour signals a destructive operation.`,
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
    method: 'PATCH'
  }
}`,
            ...p.parameters?.docs?.source,
          },
          description: {
            story: `PatchMethod — PATCH pill in yellow. Used for partial resource updates.`,
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
    method: 'PUT'
  }
}`,
            ...m.parameters?.docs?.source,
          },
          description: {
            story: `PutMethod — PUT pill in amber. Used for full resource replacement.`,
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
    method: 'GraphQL'
  }
}`,
            ...h.parameters?.docs?.source,
          },
          description: {
            story: `ProtocolGraphQL — GraphQL selected. Demonstrates the Protocol section colour token.`,
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
    method: 'WS'
  }
}`,
            ...g.parameters?.docs?.source,
          },
          description: {
            story: `ProtocolWS — WebSocket selected. Shows the WS colour token from the Protocol section.`,
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
    method: 'PURGE'
  }
}`,
            ..._.parameters?.docs?.source,
          },
          description: {
            story: `CustomMethod — a non-standard method value ("PURGE").
Falls back to neutral grey styling because there is no dedicated design token for it.
The pill still displays the value in uppercase.`,
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
    method: 'GET'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // The button's accessible name is its text content ("GET"), not the tooltip text.
    await userEvent.click(canvas.getByRole('button', {
      name: /^GET$/i
    }));
    // Verify all three dropdown section headings are visible
    await expect(canvas.getByText('HTTP Methods')).toBeInTheDocument();
    await expect(canvas.getByText('Protocols')).toBeInTheDocument();
    await expect(canvas.getByText('Custom Method')).toBeInTheDocument();
  }
}`,
            ...v.parameters?.docs?.source,
          },
          description: {
            story: `OpenDropdown — the dropdown is programmatically opened via a \`play()\` function.
Use this story to inspect the full dropdown UI: both sections (HTTP Methods and
Protocols), the divider, and the Custom Method input + Apply button.`,
            ...v.parameters?.docs?.description,
          },
        },
      }),
      (y = [
        `GetMethod`,
        `PostMethod`,
        `DeleteMethod`,
        `PatchMethod`,
        `PutMethod`,
        `ProtocolGraphQL`,
        `ProtocolWS`,
        `CustomMethod`,
        `OpenDropdown`,
      ]))
  })
b()
export {
  _ as CustomMethod,
  f as DeleteMethod,
  u as GetMethod,
  v as OpenDropdown,
  p as PatchMethod,
  d as PostMethod,
  h as ProtocolGraphQL,
  g as ProtocolWS,
  m as PutMethod,
  y as __namedExportsOrder,
  l as default,
  b as n,
  i as t,
}
