import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { gt as n, t as r } from './iframe-CECvvSLk.js'
import { n as i, t as a } from './MethodBadge-Dl_g0J1V.js'
var o = t({
    AllMethods: () => C,
    Default: () => u,
    Delete: () => h,
    Get: () => d,
    GraphQl: () => x,
    Grpc: () => b,
    Head: () => g,
    Options: () => _,
    Patch: () => m,
    Post: () => f,
    Put: () => p,
    Sse: () => y,
    Trace: () => S,
    Ws: () => v,
    __namedExportsOrder: () => w,
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
  _,
  v,
  y,
  b,
  x,
  S,
  C,
  w,
  T = e(() => {
    ;(n(),
      i(),
      (s = r()),
      (c = [
        `GET`,
        `POST`,
        `PUT`,
        `PATCH`,
        `DELETE`,
        `HEAD`,
        `OPTIONS`,
        `WS`,
        `SSE`,
        `GRPC`,
        `GraphQL`,
        `TRACE`,
      ]),
      (l = {
        title: `ui/MethodBadge`,
        component: a,
        parameters: { layout: `centered` },
        args: { method: `GET` },
        argTypes: {
          method: { control: `select`, options: c, description: `HTTP method to display` },
          className: { control: `text`, description: `Additional CSS classes` },
        },
      }),
      (u = {}),
      (d = { args: { method: `GET` } }),
      (f = { args: { method: `POST` } }),
      (p = { args: { method: `PUT` } }),
      (m = { args: { method: `PATCH` } }),
      (h = { args: { method: `DELETE` } }),
      (g = { args: { method: `HEAD` } }),
      (_ = { args: { method: `OPTIONS` } }),
      (v = { args: { method: `WS` } }),
      (y = { args: { method: `SSE` } }),
      (b = { args: { method: `GRPC` } }),
      (x = { args: { method: `GraphQL` } }),
      (S = { args: { method: `TRACE` } }),
      (C = {
        render: () =>
          (0, s.jsx)(`div`, {
            className: `flex flex-wrap gap-2 items-center justify-center p-4`,
            children: c.map((e) => (0, s.jsx)(a, { method: e }, e)),
          }),
      }),
      (u.parameters = {
        ...u.parameters,
        docs: {
          ...u.parameters?.docs,
          source: { originalSource: `{}`, ...u.parameters?.docs?.source },
          description: {
            story: `Default state — renders a GET badge. Use the Controls panel to switch
between all supported HTTP methods.`,
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
    method: 'GET'
  }
}`,
            ...d.parameters?.docs?.source,
          },
          description: {
            story: `GET method badge — bright green text with translucent background.`,
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
    method: 'POST'
  }
}`,
            ...f.parameters?.docs?.source,
          },
          description: { story: `POST method badge.`, ...f.parameters?.docs?.description },
        },
      }),
      (p.parameters = {
        ...p.parameters,
        docs: {
          ...p.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    method: 'PUT'
  }
}`,
            ...p.parameters?.docs?.source,
          },
          description: { story: `PUT method badge.`, ...p.parameters?.docs?.description },
        },
      }),
      (m.parameters = {
        ...m.parameters,
        docs: {
          ...m.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    method: 'PATCH'
  }
}`,
            ...m.parameters?.docs?.source,
          },
          description: { story: `PATCH method badge.`, ...m.parameters?.docs?.description },
        },
      }),
      (h.parameters = {
        ...h.parameters,
        docs: {
          ...h.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    method: 'DELETE'
  }
}`,
            ...h.parameters?.docs?.source,
          },
          description: {
            story: `DELETE method badge — rendered in red to signal a destructive operation.`,
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
    method: 'HEAD'
  }
}`,
            ...g.parameters?.docs?.source,
          },
          description: { story: `HEAD method badge.`, ...g.parameters?.docs?.description },
        },
      }),
      (_.parameters = {
        ..._.parameters,
        docs: {
          ..._.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    method: 'OPTIONS'
  }
}`,
            ..._.parameters?.docs?.source,
          },
          description: { story: `OPTIONS method badge.`, ..._.parameters?.docs?.description },
        },
      }),
      (v.parameters = {
        ...v.parameters,
        docs: {
          ...v.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    method: 'WS'
  }
}`,
            ...v.parameters?.docs?.source,
          },
          description: {
            story: `WS (WebSocket) method badge.`,
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
    method: 'SSE'
  }
}`,
            ...y.parameters?.docs?.source,
          },
          description: {
            story: `SSE (Server-Sent Events) method badge.`,
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
    method: 'GRPC'
  }
}`,
            ...b.parameters?.docs?.source,
          },
          description: { story: `gRPC method badge.`, ...b.parameters?.docs?.description },
        },
      }),
      (x.parameters = {
        ...x.parameters,
        docs: {
          ...x.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    method: 'GraphQL'
  }
}`,
            ...x.parameters?.docs?.source,
          },
          description: { story: `GraphQL method badge.`, ...x.parameters?.docs?.description },
        },
      }),
      (S.parameters = {
        ...S.parameters,
        docs: {
          ...S.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    method: 'TRACE'
  }
}`,
            ...S.parameters?.docs?.source,
          },
          description: { story: `TRACE method badge.`, ...S.parameters?.docs?.description },
        },
      }),
      (C.parameters = {
        ...C.parameters,
        docs: {
          ...C.parameters?.docs,
          source: {
            originalSource: `{
  render: () => <div className="flex flex-wrap gap-2 items-center justify-center p-4">
      {ALL_METHODS.map(method => <MethodBadge key={method} method={method} />)}
    </div>
}`,
            ...C.parameters?.docs?.source,
          },
          description: {
            story: `AllMethods — all 12 colour variants side-by-side in a single canvas.
Useful for a quick visual audit across themes.`,
            ...C.parameters?.docs?.description,
          },
        },
      }),
      (w = [
        `Default`,
        `Get`,
        `Post`,
        `Put`,
        `Patch`,
        `Delete`,
        `Head`,
        `Options`,
        `Ws`,
        `Sse`,
        `Grpc`,
        `GraphQl`,
        `Trace`,
        `AllMethods`,
      ]))
  })
T()
export {
  C as AllMethods,
  u as Default,
  h as Delete,
  d as Get,
  x as GraphQl,
  b as Grpc,
  g as Head,
  _ as Options,
  m as Patch,
  f as Post,
  p as Put,
  y as Sse,
  S as Trace,
  v as Ws,
  w as __namedExportsOrder,
  l as default,
  T as n,
  o as t,
}
