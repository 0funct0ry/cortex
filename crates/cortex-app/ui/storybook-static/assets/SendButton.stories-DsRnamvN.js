import { n as e, r as t } from './chunk-DnJy8xQt.js'
import { n, t as r } from './SendButton-B3fSDd3K.js'
var i = t({
    Disabled: () => l,
    DisabledWithReason: () => u,
    Idle: () => s,
    InFlight: () => c,
    __namedExportsOrder: () => d,
    default: () => o,
  }),
  a,
  o,
  s,
  c,
  l,
  u,
  d,
  f = e(() => {
    ;(n(),
      ({ fn: a } = __STORYBOOK_MODULE_TEST__),
      (o = {
        title: `composer/SendButton`,
        component: r,
        parameters: { layout: `centered` },
        args: { inFlight: !1, onSend: a(), onCancel: a(), disabled: !1, disabledReason: `` },
        argTypes: {
          inFlight: {
            control: { type: `boolean` },
            description: 'When `true` the button switches to Cancel mode.',
          },
          disabled: {
            control: { type: `boolean` },
            description: 'Disables the Send button (ignored when `inFlight` is `true`).',
          },
          disabledReason: {
            control: { type: `text` },
            description: `Optional tooltip text shown when the button is disabled.`,
          },
          onSend: { description: `Callback fired when the user clicks Send.`, action: `onSend` },
          onCancel: {
            description: `Callback fired when the user clicks Cancel.`,
            action: `onCancel`,
          },
        },
      }),
      (s = { args: { inFlight: !1, disabled: !1 } }),
      (c = { args: { inFlight: !0 } }),
      (l = { args: { inFlight: !1, disabled: !0, disabledReason: `` } }),
      (u = { args: { inFlight: !1, disabled: !0, disabledReason: `No URL entered` } }),
      (s.parameters = {
        ...s.parameters,
        docs: {
          ...s.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    inFlight: false,
    disabled: false
  }
}`,
            ...s.parameters?.docs?.source,
          },
          description: {
            story: `Idle — the default Send state.
The accent-coloured pill is clickable and shows the keyboard shortcut in its tooltip.`,
            ...s.parameters?.docs?.description,
          },
        },
      }),
      (c.parameters = {
        ...c.parameters,
        docs: {
          ...c.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    inFlight: true
  }
}`,
            ...c.parameters?.docs?.source,
          },
          description: {
            story: `InFlight — a request is in progress.
The button switches to a red Cancel pill with an ✕ icon.
Clicking fires \`onCancel\` which aborts the in-flight request via Tauri IPC.`,
            ...c.parameters?.docs?.description,
          },
        },
      }),
      (l.parameters = {
        ...l.parameters,
        docs: {
          ...l.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    inFlight: false,
    disabled: true,
    disabledReason: ''
  }
}`,
            ...l.parameters?.docs?.source,
          },
          description: {
            story: `Disabled — no URL has been entered yet.
The Send button is rendered at reduced opacity with a \`cursor-not-allowed\` cursor.
The tooltip still shows the keyboard shortcut (no reason provided here).`,
            ...l.parameters?.docs?.description,
          },
        },
      }),
      (u.parameters = {
        ...u.parameters,
        docs: {
          ...u.parameters?.docs,
          source: {
            originalSource: `{
  args: {
    inFlight: false,
    disabled: true,
    disabledReason: 'No URL entered'
  }
}`,
            ...u.parameters?.docs?.source,
          },
          description: {
            story: `DisabledWithReason — the Send button is disabled and the tooltip explains why.
\`disabledReason\` replaces the default shortcut hint so the user understands
what they need to do before they can send (e.g. enter a URL).`,
            ...u.parameters?.docs?.description,
          },
        },
      }),
      (d = [`Idle`, `InFlight`, `Disabled`, `DisabledWithReason`]))
  })
f()
export {
  l as Disabled,
  u as DisabledWithReason,
  s as Idle,
  c as InFlight,
  d as __namedExportsOrder,
  o as default,
  f as n,
  i as t,
}
