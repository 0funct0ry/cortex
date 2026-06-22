import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { n, t as r } from './Dialog-MIUUJcU6.js'
var i = t({
    Closed: () => d,
    CustomLabels: () => m,
    DangerVariant: () => f,
    LongContent: () => p,
    Open: () => u,
    __namedExportsOrder: () => h,
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
  g = e(() => {
    ;(n(),
      ({ expect: a, fn: o, userEvent: s, within: c } = __STORYBOOK_MODULE_TEST__),
      (l = {
        title: `ui/Dialog`,
        component: r,
        parameters: { layout: `fullscreen`, docs: { story: { inline: !1, height: `350px` } } },
        args: {
          isOpen: !0,
          title: `Confirm action`,
          description: `Are you sure you want to proceed? This cannot be undone.`,
          confirmLabel: `Confirm`,
          cancelLabel: `Cancel`,
          variant: `primary`,
          onClose: o(),
          onConfirm: o(),
        },
        argTypes: {
          isOpen: { control: `boolean`, description: `Whether the dialog is visible` },
          variant: {
            control: `select`,
            options: [`primary`, `danger`],
            description: `Visual style of the confirm button`,
          },
          title: { control: `text`, description: `Dialog heading` },
          description: { control: `text`, description: `Body text shown below the title` },
          confirmLabel: { control: `text`, description: `Label for the confirm button` },
          cancelLabel: { control: `text`, description: `Label for the cancel button` },
        },
      }),
      (u = {
        play: async ({ canvasElement: e, args: t }) => {
          let n = c(e.ownerDocument.body).getByRole(`button`, { name: /cancel/i })
          ;(await s.click(n), await a(t.onClose).toHaveBeenCalled())
        },
      }),
      (d = { args: { isOpen: !1 } }),
      (f = {
        args: {
          title: `Delete collection`,
          description: `Deleting "My Collection" will permanently remove all requests inside it.`,
          confirmLabel: `Delete`,
          variant: `danger`,
        },
        play: async ({ canvasElement: e, args: t }) => {
          let n = c(e.ownerDocument.body).getByRole(`button`, { name: /delete/i })
          ;(await s.click(n), await a(t.onConfirm).toHaveBeenCalled())
        },
      }),
      (p = {
        args: {
          title: `Export collection`,
          description: `You are about to export the entire "Payments API" collection including all 47 requests, 12 environment definitions, and 3 runner configurations. Secret variable values will be redacted and replaced with __REDACTED__ placeholders. The exported YAML file can be committed to version control or imported into another Cortex workspace.`,
        },
      }),
      (m = {
        args: {
          title: `Save changes?`,
          description: `You have unsaved edits to this request. Save them before closing?`,
          confirmLabel: `Save`,
          cancelLabel: `Discard`,
        },
      }),
      (u.parameters = {
        ...u.parameters,
        docs: {
          ...u.parameters?.docs,
          source: {
            originalSource: `{
  play: async ({
    canvasElement,
    args
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    const cancelBtn = body.getByRole('button', {
      name: /cancel/i
    });
    await userEvent.click(cancelBtn);
    await expect(args.onClose).toHaveBeenCalled();
  }
}`,
            ...u.parameters?.docs?.source,
          },
          description: {
            story: `Open — dialog rendered with isOpen=true, primary variant.
The play function clicks Cancel and asserts onClose was called.
Dialog renders via createPortal to document.body. We scope queries to
canvasElement.ownerDocument.body (the story iframe's body) rather than
the global document.body to avoid Storybook's "screen in docs mode" warning.`,
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
    isOpen: false
  }
}`,
            ...d.parameters?.docs?.source,
          },
          description: {
            story: `Closed — isOpen=false; the component returns null and nothing renders.
Documents the null-render contract so consumers don't need guards around Dialog.`,
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
    title: 'Delete collection',
    description: 'Deleting "My Collection" will permanently remove all requests inside it.',
    confirmLabel: 'Delete',
    variant: 'danger'
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const body = within(canvasElement.ownerDocument.body);
    const confirmBtn = body.getByRole('button', {
      name: /delete/i
    });
    await userEvent.click(confirmBtn);
    await expect(args.onConfirm).toHaveBeenCalled();
  }
}`,
            ...f.parameters?.docs?.source,
          },
          description: {
            story: `DangerVariant — confirm button uses the destructive (red) colour token.
Use for irreversible operations such as deleting a collection.`,
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
    title: 'Export collection',
    description: 'You are about to export the entire "Payments API" collection including all 47 requests, 12 environment definitions, and 3 runner configurations. Secret variable values will be redacted and replaced with __REDACTED__ placeholders. The exported YAML file can be committed to version control or imported into another Cortex workspace.'
  }
}`,
            ...p.parameters?.docs?.source,
          },
          description: {
            story: `LongContent — long description string verifies text wraps correctly inside
the max-w-md container without overflowing the backdrop.`,
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
    title: 'Save changes?',
    description: 'You have unsaved edits to this request. Save them before closing?',
    confirmLabel: 'Save',
    cancelLabel: 'Discard'
  }
}`,
            ...m.parameters?.docs?.source,
          },
          description: {
            story: `CustomLabels — demonstrates overriding the default "Confirm" / "Cancel" labels
for domain-specific copy.`,
            ...m.parameters?.docs?.description,
          },
        },
      }),
      (h = [`Open`, `Closed`, `DangerVariant`, `LongContent`, `CustomLabels`]))
  })
g()
export {
  d as Closed,
  m as CustomLabels,
  f as DangerVariant,
  p as LongContent,
  u as Open,
  h as __namedExportsOrder,
  l as default,
  g as n,
  i as t,
}
