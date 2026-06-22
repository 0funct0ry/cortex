import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { n, t as r } from './InfoPanel-BQg62_s5.js'
var i = t({
    Closed: () => h,
    ErrorState: () => m,
    FolderInfo: () => f,
    Loading: () => d,
    RequestInfo: () => p,
    __namedExportsOrder: () => g,
    default: () => u,
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
  _ = e(() => {
    ;(n(),
      ({ expect: a, fn: o, within: s } = __STORYBOOK_MODULE_TEST__),
      (c = {
        path: `/Users/dev/projects/payments-api.crx`,
        size_bytes: 8192,
        created: `2024-11-01T09:00:00Z`,
        modified: `2025-06-15T14:32:00Z`,
        item_count: 47,
        folder_count: 3,
        direct_request_count: 12,
        direct_folder_count: 3,
        method: null,
        url: null,
      }),
      (l = {
        path: `/Users/dev/projects/payments-api.crx#charge-card`,
        size_bytes: 1024,
        created: `2024-11-05T11:00:00Z`,
        modified: `2025-06-10T09:15:00Z`,
        item_count: null,
        folder_count: null,
        direct_request_count: null,
        direct_folder_count: null,
        method: `POST`,
        url: `https://api.stripe.com/v1/charges`,
      }),
      (u = {
        title: `ui/InfoPanel`,
        component: r,
        parameters: {
          layout: `fullscreen`,
          docs: { story: { inline: !1, height: `400px` } },
          tauriMock: { get_item_info: () => new Promise(() => {}) },
        },
        args: {
          isOpen: !0,
          path: `/Users/dev/projects/payments-api.crx`,
          type: `folder`,
          onClose: o(),
        },
        argTypes: {
          isOpen: { control: `boolean`, description: `Whether the panel is visible` },
          type: {
            control: `select`,
            options: [`folder`, `request`],
            description: `Controls the panel title (Folder Info vs Request Info)`,
          },
          path: { control: `text`, description: `Filesystem path passed to get_item_info` },
        },
      }),
      (d = {}),
      (f = {
        args: { type: `folder` },
        parameters: { tauriMock: { get_item_info: () => c } },
        play: async ({ canvasElement: e }) => {
          let t = s(e.ownerDocument.body)
          ;(await a(await t.findByText(`Path`)).toBeInTheDocument(),
            await a(t.getByText(`/Users/dev/projects/payments-api.crx`)).toBeInTheDocument(),
            await a(t.getByText(`8.0 KB`)).toBeInTheDocument())
        },
      }),
      (p = {
        args: { path: `/Users/dev/projects/payments-api.crx#charge-card`, type: `request` },
        parameters: { tauriMock: { get_item_info: () => l } },
        play: async ({ canvasElement: e }) => {
          let t = s(e.ownerDocument.body)
          ;(await a(await t.findByText(`Method`)).toBeInTheDocument(),
            await a(t.getByText(`POST`)).toBeInTheDocument(),
            await a(t.getByText(`https://api.stripe.com/v1/charges`)).toBeInTheDocument())
        },
      }),
      (m = {
        parameters: {
          tauriMock: {
            get_item_info: () => {
              throw `File not found: path does not exist on disk`
            },
          },
        },
        play: async ({ canvasElement: e }) => {
          await a(
            await s(e.ownerDocument.body).findByText(`File not found: path does not exist on disk`)
          ).toBeInTheDocument()
        },
      }),
      (h = { args: { isOpen: !1 } }),
      (d.parameters = {
        ...d.parameters,
        docs: {
          ...d.parameters?.docs,
          source: { originalSource: `{}`, ...d.parameters?.docs?.source },
          description: {
            story: `Loading — mock never resolves so the "Loading…" placeholder stays visible.
Demonstrates the intermediate state between isOpen=true and data arrival.`,
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
    type: 'folder'
  },
  parameters: {
    tauriMock: {
      get_item_info: () => FOLDER_INFO
    }
  },
  play: async ({
    canvasElement
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText('Path')).toBeInTheDocument();
    await expect(body.getByText('/Users/dev/projects/payments-api.crx')).toBeInTheDocument();
    await expect(body.getByText('8.0 KB')).toBeInTheDocument();
  }
}`,
            ...f.parameters?.docs?.source,
          },
          description: {
            story: `FolderInfo — mock resolves immediately with a folder ItemInfo fixture.
Displays path, size, timestamps, subfolder count, and total request count.
The play function asserts the Path row is visible in the portal.`,
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
    path: '/Users/dev/projects/payments-api.crx#charge-card',
    type: 'request'
  },
  parameters: {
    tauriMock: {
      get_item_info: () => REQUEST_INFO
    }
  },
  play: async ({
    canvasElement
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText('Method')).toBeInTheDocument();
    await expect(body.getByText('POST')).toBeInTheDocument();
    await expect(body.getByText('https://api.stripe.com/v1/charges')).toBeInTheDocument();
  }
}`,
            ...p.parameters?.docs?.source,
          },
          description: {
            story: `RequestInfo — mock resolves with a request ItemInfo fixture.
Shows method and URL fields in addition to path and timestamps.`,
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
  parameters: {
    tauriMock: {
      // Throwing a string causes the binding wrapper to produce { status: "error", error: "..." }
      get_item_info: () => {
        throw 'File not found: path does not exist on disk';
      }
    }
  },
  play: async ({
    canvasElement
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText('File not found: path does not exist on disk')).toBeInTheDocument();
  }
}`,
            ...m.parameters?.docs?.source,
          },
          description: {
            story: `ErrorState — mock returns an error result string.
InfoPanel renders the error message in place of the info table.`,
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
    isOpen: false
  }
}`,
            ...h.parameters?.docs?.source,
          },
          description: {
            story: `Closed — isOpen=false; the component returns null and nothing renders.`,
            ...h.parameters?.docs?.description,
          },
        },
      }),
      (g = [`Loading`, `FolderInfo`, `RequestInfo`, `ErrorState`, `Closed`]))
  })
_()
export {
  h as Closed,
  m as ErrorState,
  f as FolderInfo,
  d as Loading,
  p as RequestInfo,
  g as __namedExportsOrder,
  u as default,
  _ as n,
  i as t,
}
