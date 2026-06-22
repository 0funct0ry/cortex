import { a as e, n as t, t as n } from './chunk-DnJy8xQt.js'
import { gt as r, t as i } from './iframe-CECvvSLk.js'
import { t as a } from './react-dom-CUfkHZq5.js'
import { O as o, i as s, l as c, s as l, u } from './Icons-DjzhDYF3.js'
function d(e) {
  return typeof e == `object` && !!e && `nodeType` in e && typeof e.nodeType == `number`
}
function f(e) {
  return d(e) && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && `host` in e
}
var p,
  m,
  h = t(() => {
    ;((p = (e) => e?.ownerDocument ?? document),
      (m = (e) => (e && `window` in e && e.window === e ? e : p(e).defaultView || window)))
  })
function g() {
  return _
}
var _,
  v = t(() => {
    _ = !1
  }),
  y = t(() => {
    v()
  })
function b(e, t) {
  if (!g()) return t && e ? e.contains(t) : !1
  if (!e || !t) return !1
  let n = t
  for (; n !== null; ) {
    if (n === e) return !0
    n =
      n.tagName === `SLOT` && n.assignedSlot
        ? n.assignedSlot.parentNode
        : f(n)
          ? n.host
          : n.parentNode
  }
  return !1
}
function x(e) {
  if (g() && e.target instanceof Element && e.target.shadowRoot) {
    if (`composedPath` in e) return e.composedPath()[0] ?? null
    if (`composedPath` in e.nativeEvent) return e.nativeEvent.composedPath()[0] ?? null
  }
  return e.target
}
var S,
  C = t(() => {
    ;(h(),
      y(),
      (S = (e = document) => {
        if (!g()) return e.activeElement
        let t = e.activeElement
        for (; t && `shadowRoot` in t && t.shadowRoot?.activeElement; )
          t = t.shadowRoot.activeElement
        return t
      }))
  })
function w(e) {
  if (T()) e.focus({ preventScroll: !0 })
  else {
    let t = E(e)
    ;(e.focus(), D(t))
  }
}
function T() {
  if (O == null) {
    O = !1
    try {
      document.createElement(`div`).focus({
        get preventScroll() {
          return ((O = !0), !0)
        },
      })
    } catch {}
  }
  return O
}
function E(e) {
  let t = e.parentNode,
    n = [],
    r = document.scrollingElement || document.documentElement
  for (; t instanceof HTMLElement && t !== r; )
    ((t.offsetHeight < t.scrollHeight || t.offsetWidth < t.scrollWidth) &&
      n.push({ element: t, scrollTop: t.scrollTop, scrollLeft: t.scrollLeft }),
      (t = t.parentNode))
  return (
    r instanceof HTMLElement &&
      n.push({ element: r, scrollTop: r.scrollTop, scrollLeft: r.scrollLeft }),
    n
  )
}
function D(e) {
  for (let { element: t, scrollTop: n, scrollLeft: r } of e) ((t.scrollTop = n), (t.scrollLeft = r))
}
var O,
  k = t(() => {
    O = null
  }),
  A,
  ee,
  te = t(() => {
    ;((A = e(r(), 1)), (ee = typeof document < `u` ? A.useLayoutEffect : () => {}))
  })
function ne(e) {
  let t = e
  return (
    (t.nativeEvent = e),
    (t.isDefaultPrevented = () => t.defaultPrevented),
    (t.isPropagationStopped = () => t.cancelBubble),
    (t.persist = () => {}),
    t
  )
}
function re(e, t) {
  ;(Object.defineProperty(e, `target`, { value: t }),
    Object.defineProperty(e, `currentTarget`, { value: t }))
}
function ie(e) {
  let t = (0, ae.useRef)({ isFocused: !1, observer: null })
  return (
    ee(() => {
      let e = t.current
      return () => {
        e.observer &&= (e.observer.disconnect(), null)
      }
    }, []),
    (0, ae.useCallback)(
      (n) => {
        let r = x(n)
        if (
          r instanceof HTMLButtonElement ||
          r instanceof HTMLInputElement ||
          r instanceof HTMLTextAreaElement ||
          r instanceof HTMLSelectElement
        ) {
          t.current.isFocused = !0
          let n = r
          ;(n.addEventListener(
            `focusout`,
            (r) => {
              if (((t.current.isFocused = !1), n.disabled)) {
                let t = ne(r)
                e?.(t)
              }
              t.current.observer && (t.current.observer.disconnect(), (t.current.observer = null))
            },
            { once: !0 }
          ),
            (t.current.observer = new MutationObserver(() => {
              if (t.current.isFocused && n.disabled) {
                t.current.observer?.disconnect()
                let e = n === S() ? null : S()
                ;(n.dispatchEvent(new FocusEvent(`blur`, { relatedTarget: e })),
                  n.dispatchEvent(new FocusEvent(`focusout`, { bubbles: !0, relatedTarget: e })))
              }
            })),
            t.current.observer.observe(n, { attributes: !0, attributeFilter: [`disabled`] }))
        }
      },
      [e]
    )
  )
}
var ae,
  j,
  oe = t(() => {
    ;(C(), te(), (ae = e(r(), 1)), (j = !1))
  })
function se(e) {
  if (typeof window > `u` || window.navigator == null) return !1
  let t = window.navigator.userAgentData?.brands
  return (Array.isArray(t) && t.some((t) => e.test(t.brand))) || e.test(window.navigator.userAgent)
}
function ce(e) {
  return typeof window < `u` && window.navigator != null
    ? e.test(window.navigator.userAgentData?.platform || window.navigator.platform)
    : !1
}
function le(e) {
  let t = null
  return () => ((t ??= e()), t)
}
var ue,
  de,
  fe,
  pe,
  me,
  he,
  ge = t(() => {
    ;((ue = le(function () {
      return ce(/^Mac/i)
    })),
      (de = le(function () {
        return ce(/^iPad/i) || (ue() && navigator.maxTouchPoints > 1)
      })),
      (fe = le(function () {
        return se(/AppleWebKit/i) && !pe()
      })),
      (pe = le(function () {
        return se(/Chrome/i)
      })),
      (me = le(function () {
        return se(/Android/i)
      })),
      (he = le(function () {
        return se(/Firefox/i)
      })))
  })
function _e(e) {
  return e.pointerType === `` && e.isTrusted
    ? !0
    : me() && e.pointerType
      ? e.type === `click` && e.buttons === 1
      : e.detail === 0 && !e.pointerType
}
var ve = t(() => {
  ge()
})
function ye(e, t, n = !0) {
  let { metaKey: r, ctrlKey: i, altKey: a, shiftKey: o } = t
  he() &&
    window.event?.type?.startsWith(`key`) &&
    e.target === `_blank` &&
    (ue() ? (r = !0) : (i = !0))
  let s =
    fe() && ue() && !de()
      ? new KeyboardEvent(`keydown`, {
          keyIdentifier: `Enter`,
          metaKey: r,
          ctrlKey: i,
          altKey: a,
          shiftKey: o,
        })
      : new MouseEvent(`click`, {
          metaKey: r,
          ctrlKey: i,
          altKey: a,
          shiftKey: o,
          detail: 1,
          bubbles: !0,
          cancelable: !0,
        })
  ;((ye.isOpening = n), w(e), e.dispatchEvent(s), (ye.isOpening = !1))
}
var be = t(() => {
  ;(k(), ge(), r(), (ye.isOpening = !1))
})
function xe(e, t) {
  for (let n of Ie) n(e, t)
}
function Se(e) {
  return !(
    e.metaKey ||
    (!ue() && e.altKey) ||
    e.ctrlKey ||
    e.key === `Control` ||
    e.key === `Shift` ||
    e.key === `Meta`
  )
}
function Ce(e) {
  ;((Re = !0), !ye.isOpening && Se(e) && ((Pe = `keyboard`), (Fe = `keyboard`), xe(`keyboard`, e)))
}
function we(e) {
  ;((Pe = `pointer`),
    (Fe = `pointerType` in e ? e.pointerType : `mouse`),
    (e.type === `mousedown` || e.type === `pointerdown`) && ((Re = !0), xe(`pointer`, e)))
}
function Te(e) {
  !ye.isOpening && _e(e) && ((Re = !0), (Pe = `virtual`), (Fe = `virtual`))
}
function Ee(e) {
  let t = m(x(e)),
    n = p(x(e))
  x(e) === t ||
    x(e) === n ||
    j ||
    !e.isTrusted ||
    (!Re && !ze && ((Pe = `virtual`), (Fe = `virtual`), xe(`virtual`, e)), (Re = !1), (ze = !1))
}
function De() {
  j || ((Re = !1), (ze = !0))
}
function Oe(e) {
  if (typeof window > `u` || typeof document > `u`) return
  let t = m(e),
    n = p(e)
  if (Le.get(t)) return
  let r = t.HTMLElement.prototype.focus
  ;((t.HTMLElement.prototype.focus = function () {
    ;((Re = !0), r.apply(this, arguments))
  }),
    n.addEventListener(`keydown`, Ce, !0),
    n.addEventListener(`keyup`, Ce, !0),
    n.addEventListener(`click`, Te, !0),
    t.addEventListener(`focus`, Ee, !0),
    t.addEventListener(`blur`, De, !1),
    typeof PointerEvent < `u` &&
      (n.addEventListener(`pointerdown`, we, !0),
      n.addEventListener(`pointermove`, we, !0),
      n.addEventListener(`pointerup`, we, !0)),
    t.addEventListener(
      `beforeunload`,
      () => {
        Ve(e)
      },
      { once: !0 }
    ),
    Le.set(t, { focus: r }))
}
function ke(e) {
  let t = p(e),
    n
  return (
    t.readyState === `loading`
      ? ((n = () => {
          Oe(e)
        }),
        t.addEventListener(`DOMContentLoaded`, n))
      : Oe(e),
    () => Ve(e, n)
  )
}
function Ae() {
  return Pe !== `pointer`
}
function je(e, t, n) {
  let r = n ? x(n) : void 0,
    i = p(r),
    a = m(r),
    o = a === void 0 ? HTMLInputElement : a.HTMLInputElement,
    s = a === void 0 ? HTMLTextAreaElement : a.HTMLTextAreaElement,
    c = a === void 0 ? HTMLElement : a.HTMLElement,
    l = a === void 0 ? KeyboardEvent : a.KeyboardEvent,
    u = S(i)
  return (
    (e =
      e ||
      (u instanceof o && !He.has(u.type)) ||
      u instanceof s ||
      (u instanceof c && u.isContentEditable)),
    !(e && t === `keyboard` && n instanceof l && !Be[n.key])
  )
}
function Me(e, t, n) {
  ;(Oe(),
    (0, Ne.useEffect)(() => {
      if (n?.enabled === !1) return
      let t = (t, r) => {
        je(!!n?.isTextInput, t, r) && e(Ae())
      }
      return (
        Ie.add(t),
        () => {
          Ie.delete(t)
        }
      )
    }, t))
}
var Ne,
  Pe,
  Fe,
  Ie,
  Le,
  Re,
  ze,
  Be,
  Ve,
  He,
  Ue = t(() => {
    ;(C(),
      h(),
      oe(),
      ge(),
      ve(),
      be(),
      (Ne = e(r(), 1)),
      (Pe = null),
      (Ie = new Set()),
      (Le = new Map()),
      (Re = !1),
      (ze = !1),
      (Be = { Tab: !0, Escape: !0 }),
      (Ve = (e, t) => {
        let n = m(e),
          r = p(e)
        ;(t && r.removeEventListener(`DOMContentLoaded`, t),
          Le.has(n) &&
            ((n.HTMLElement.prototype.focus = Le.get(n).focus),
            r.removeEventListener(`keydown`, Ce, !0),
            r.removeEventListener(`keyup`, Ce, !0),
            r.removeEventListener(`click`, Te, !0),
            n.removeEventListener(`focus`, Ee, !0),
            n.removeEventListener(`blur`, De, !1),
            typeof PointerEvent < `u` &&
              (r.removeEventListener(`pointerdown`, we, !0),
              r.removeEventListener(`pointermove`, we, !0),
              r.removeEventListener(`pointerup`, we, !0)),
            Le.delete(n)))
      }),
      typeof document < `u` && ke(),
      (He = new Set([
        `checkbox`,
        `radio`,
        `range`,
        `color`,
        `file`,
        `image`,
        `button`,
        `submit`,
        `reset`,
      ])))
  })
function We(e) {
  let { isDisabled: t, onFocus: n, onBlur: r, onFocusChange: i } = e,
    a = (0, Ge.useCallback)(
      (e) => {
        if (x(e) === e.currentTarget) return (r && r(e), i && i(!1), !0)
      },
      [r, i]
    ),
    o = ie(a),
    s = (0, Ge.useCallback)(
      (e) => {
        let t = x(e),
          r = p(t),
          a = r ? S(r) : S()
        t === e.currentTarget && t === a && (n && n(e), i && i(!0), o(e))
      },
      [i, n, o]
    )
  return {
    focusProps: { onFocus: !t && (n || i || r) ? s : void 0, onBlur: !t && (r || i) ? a : void 0 },
  }
}
var Ge,
  Ke = t(() => {
    ;(C(), h(), oe(), (Ge = e(r(), 1)))
  })
function qe() {
  let e = (0, Je.useRef)(new Map()),
    t = (0, Je.useCallback)((t, n, r, i) => {
      let a = i?.once
        ? (...t) => {
            ;(e.current.delete(r), r(...t))
          }
        : r
      ;(e.current.set(r, { type: n, eventTarget: t, fn: a, options: i }),
        t.addEventListener(n, a, i))
    }, []),
    n = (0, Je.useCallback)((t, n, r, i) => {
      let a = e.current.get(r)?.fn || r
      ;(t.removeEventListener(n, a, i), e.current.delete(r))
    }, []),
    r = (0, Je.useCallback)(() => {
      e.current.forEach((e, t) => {
        n(e.eventTarget, e.type, t, e.options)
      })
    }, [n])
  return (
    (0, Je.useEffect)(() => r, [r]),
    { addGlobalListener: t, removeGlobalListener: n, removeAllGlobalListeners: r }
  )
}
var Je,
  Ye = t(() => {
    Je = e(r(), 1)
  })
function Xe(e) {
  let { isDisabled: t, onBlurWithin: n, onFocusWithin: r, onFocusWithinChange: i } = e,
    a = (0, Ze.useRef)({ isFocusWithin: !1 }),
    { addGlobalListener: o, removeAllGlobalListeners: s } = qe(),
    c = (0, Ze.useCallback)(
      (e) => {
        b(e.currentTarget, x(e)) &&
          a.current.isFocusWithin &&
          !b(e.currentTarget, e.relatedTarget) &&
          ((a.current.isFocusWithin = !1), s(), n && n(e), i && i(!1))
      },
      [n, i, a, s]
    ),
    l = ie(c),
    u = (0, Ze.useCallback)(
      (e) => {
        if (!b(e.currentTarget, x(e))) return
        let t = x(e),
          n = p(t),
          s = S(n)
        if (!a.current.isFocusWithin && s === t) {
          ;(r && r(e), i && i(!0), (a.current.isFocusWithin = !0), l(e))
          let t = e.currentTarget
          o(
            n,
            `focus`,
            (e) => {
              let r = x(e)
              if (a.current.isFocusWithin && !b(t, r)) {
                let e = new n.defaultView.FocusEvent(`blur`, { relatedTarget: r })
                ;(re(e, t), c(ne(e)))
              }
            },
            { capture: !0 }
          )
        }
      },
      [r, i, l, o, c]
    )
  return t
    ? { focusWithinProps: { onFocus: void 0, onBlur: void 0 } }
    : { focusWithinProps: { onFocus: u, onBlur: c } }
}
var Ze,
  Qe = t(() => {
    ;(oe(), C(), h(), Ye(), (Ze = e(r(), 1)))
  })
function $e(e = {}) {
  let { autoFocus: t = !1, isTextInput: n, within: r } = e,
    i = (0, et.useRef)({ isFocused: !1, isFocusVisible: t || Ae() }),
    [a, o] = (0, et.useState)(!1),
    [s, c] = (0, et.useState)(() => i.current.isFocused && i.current.isFocusVisible),
    l = (0, et.useCallback)(() => c(i.current.isFocused && i.current.isFocusVisible), []),
    u = (0, et.useCallback)(
      (e) => {
        ;((i.current.isFocused = e), (i.current.isFocusVisible = Ae()), o(e), l())
      },
      [l]
    )
  Me(
    (e) => {
      ;((i.current.isFocusVisible = e), l())
    },
    [n, a],
    { enabled: a, isTextInput: n }
  )
  let { focusProps: d } = We({ isDisabled: r, onFocusChange: u }),
    { focusWithinProps: f } = Xe({ isDisabled: !r, onFocusWithinChange: u })
  return { isFocused: a, isFocusVisible: s, focusProps: r ? f : d }
}
var et,
  tt = t(() => {
    ;(Ue(), Ke(), Qe(), (et = e(r(), 1)))
  }),
  nt = t(() => {
    tt()
  }),
  rt = t(() => {
    nt()
  })
function it() {
  ;((lt = !0),
    setTimeout(() => {
      lt = !1
    }, 500))
}
function at(e) {
  e.pointerType === `touch` && it()
}
function ot() {
  let e = p(null)
  if (e !== void 0)
    return (
      ut === 0 && typeof PointerEvent < `u` && e.addEventListener(`pointerup`, at),
      ut++,
      () => {
        ;(ut--, !(ut > 0) && typeof PointerEvent < `u` && e.removeEventListener(`pointerup`, at))
      }
    )
}
function st(e) {
  let { onHoverStart: t, onHoverChange: n, onHoverEnd: r, isDisabled: i } = e,
    [a, o] = (0, ct.useState)(!1),
    s = (0, ct.useRef)({
      isHovered: !1,
      ignoreEmulatedMouseEvents: !1,
      pointerType: ``,
      target: null,
    }).current
  ;(0, ct.useEffect)(ot, [])
  let { addGlobalListener: c, removeAllGlobalListeners: l } = qe(),
    { hoverProps: u, triggerHoverEnd: d } = (0, ct.useMemo)(() => {
      let e = (e, r) => {
          if (((s.pointerType = r), i || r === `touch` || s.isHovered || !b(e.currentTarget, x(e))))
            return
          s.isHovered = !0
          let l = e.currentTarget
          ;((s.target = l),
            c(
              p(x(e)),
              `pointerover`,
              (e) => {
                s.isHovered && s.target && !b(s.target, x(e)) && a(e, e.pointerType)
              },
              { capture: !0 }
            ),
            t && t({ type: `hoverstart`, target: l, pointerType: r }),
            n && n(!0),
            o(!0))
        },
        a = (e, t) => {
          let i = s.target
          ;((s.pointerType = ``),
            (s.target = null),
            !(t === `touch` || !s.isHovered || !i) &&
              ((s.isHovered = !1),
              l(),
              r && r({ type: `hoverend`, target: i, pointerType: t }),
              n && n(!1),
              o(!1)))
        },
        u = {}
      return (
        typeof PointerEvent < `u` &&
          ((u.onPointerEnter = (t) => {
            ;(lt && t.pointerType === `mouse`) || e(t, t.pointerType)
          }),
          (u.onPointerLeave = (e) => {
            !i && b(e.currentTarget, x(e)) && a(e, e.pointerType)
          })),
        { hoverProps: u, triggerHoverEnd: a }
      )
    }, [t, n, r, i, s, c, l])
  return (
    (0, ct.useEffect)(() => {
      i && d({ currentTarget: s.target }, s.pointerType)
    }, [i]),
    { hoverProps: u, isHovered: a }
  )
}
var ct,
  lt,
  ut,
  dt = t(() => {
    ;(C(), h(), Ye(), (ct = e(r(), 1)), (lt = !1), (ut = 0))
  }),
  ft = t(() => {
    dt()
  }),
  pt = t(() => {
    ft()
  }),
  mt,
  ht,
  gt,
  _t,
  vt,
  yt = t(() => {
    ;((mt = Object.defineProperty),
      (ht = (e, t, n) =>
        t in e
          ? mt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
          : (e[t] = n)),
      (gt = (e, t, n) => (ht(e, typeof t == `symbol` ? t : t + ``, n), n)),
      (_t = class {
        constructor() {
          ;(gt(this, `current`, this.detect()),
            gt(this, `handoffState`, `pending`),
            gt(this, `currentId`, 0))
        }
        set(e) {
          this.current !== e &&
            ((this.handoffState = `pending`), (this.currentId = 0), (this.current = e))
        }
        reset() {
          this.set(this.detect())
        }
        nextId() {
          return ++this.currentId
        }
        get isServer() {
          return this.current === `server`
        }
        get isClient() {
          return this.current === `client`
        }
        detect() {
          return typeof window > `u` || typeof document > `u` ? `server` : `client`
        }
        handoff() {
          this.handoffState === `pending` && (this.handoffState = `complete`)
        }
        get isHandoffComplete() {
          return this.handoffState === `complete`
        }
      }),
      (vt = new _t()))
  })
function bt(e) {
  return vt.isServer ? null : e == null ? document : (e?.ownerDocument ?? document)
}
function xt(e) {
  return vt.isServer ? null : e == null ? document : (e?.getRootNode?.call(e) ?? document)
}
function St(e) {
  return xt(e)?.activeElement ?? null
}
function Ct(e) {
  return St(e) === e
}
var wt = t(() => {
  yt()
})
function Tt(e) {
  typeof queueMicrotask == `function`
    ? queueMicrotask(e)
    : Promise.resolve()
        .then(e)
        .catch((e) =>
          setTimeout(() => {
            throw e
          })
        )
}
var Et = t(() => {})
function Dt() {
  let e = [],
    t = {
      addEventListener(e, n, r, i) {
        return (e.addEventListener(n, r, i), t.add(() => e.removeEventListener(n, r, i)))
      },
      requestAnimationFrame(...e) {
        let n = requestAnimationFrame(...e)
        return t.add(() => cancelAnimationFrame(n))
      },
      nextFrame(...e) {
        return t.requestAnimationFrame(() => t.requestAnimationFrame(...e))
      },
      setTimeout(...e) {
        let n = setTimeout(...e)
        return t.add(() => clearTimeout(n))
      },
      microTask(...e) {
        let n = { current: !0 }
        return (
          Tt(() => {
            n.current && e[0]()
          }),
          t.add(() => {
            n.current = !1
          })
        )
      },
      style(e, t, n) {
        let r = e.style.getPropertyValue(t)
        return (
          Object.assign(e.style, { [t]: n }),
          this.add(() => {
            Object.assign(e.style, { [t]: r })
          })
        )
      },
      group(e) {
        let t = Dt()
        return (e(t), this.add(() => t.dispose()))
      },
      add(t) {
        return (
          e.includes(t) || e.push(t),
          () => {
            let n = e.indexOf(t)
            if (n >= 0) for (let t of e.splice(n, 1)) t()
          }
        )
      },
      dispose() {
        for (let t of e.splice(0)) t()
      },
    }
  return t
}
var Ot = t(() => {
  Et()
})
function kt() {
  let [e] = (0, At.useState)(Dt)
  return ((0, At.useEffect)(() => () => e.dispose(), [e]), e)
}
var At,
  jt = t(() => {
    ;((At = e(r(), 1)), Ot())
  }),
  Mt,
  M,
  Nt = t(() => {
    ;((Mt = e(r(), 1)),
      yt(),
      (M = (e, t) => {
        vt.isServer ? (0, Mt.useEffect)(e, t) : (0, Mt.useLayoutEffect)(e, t)
      }))
  })
function Pt(e) {
  let t = (0, Ft.useRef)(e)
  return (
    M(() => {
      t.current = e
    }, [e]),
    t
  )
}
var Ft,
  It = t(() => {
    ;((Ft = e(r(), 1)), Nt())
  }),
  Lt,
  N,
  P = t(() => {
    ;((Lt = e(r(), 1)),
      It(),
      (N = function (e) {
        let t = Pt(e)
        return Lt.useCallback((...e) => t.current(...e), [t])
      }))
  })
function Rt(e) {
  let t = e.width / 2,
    n = e.height / 2
  return { top: e.clientY - n, right: e.clientX + t, bottom: e.clientY + n, left: e.clientX - t }
}
function zt(e, t) {
  return !(!e || !t || e.right < t.left || e.left > t.right || e.bottom < t.top || e.top > t.bottom)
}
function Bt({ disabled: e = !1 } = {}) {
  let t = (0, Vt.useRef)(null),
    [n, r] = (0, Vt.useState)(!1),
    i = kt(),
    a = N(() => {
      ;((t.current = null), r(!1), i.dispose())
    }),
    o = N((e) => {
      if ((i.dispose(), t.current === null)) {
        ;((t.current = e.currentTarget), r(!0))
        {
          let n = bt(e.currentTarget)
          ;(i.addEventListener(n, `pointerup`, a, !1),
            i.addEventListener(
              n,
              `pointermove`,
              (e) => {
                t.current && r(zt(Rt(e), t.current.getBoundingClientRect()))
              },
              !1
            ),
            i.addEventListener(n, `pointercancel`, a, !1))
        }
      }
    })
  return { pressed: n, pressProps: e ? {} : { onPointerDown: o, onPointerUp: a, onClick: a } }
}
var Vt,
  Ht = t(() => {
    ;((Vt = e(r(), 1)), wt(), jt(), P())
  })
function F(e) {
  return (0, Ut.useMemo)(() => e, Object.values(e))
}
var Ut,
  Wt = t(() => {
    Ut = e(r(), 1)
  })
function Gt() {
  return (0, qt.useContext)(Jt)
}
function Kt({ value: e, children: t }) {
  return qt.createElement(Jt.Provider, { value: e }, t)
}
var qt,
  Jt,
  Yt = t(() => {
    ;((qt = e(r(), 1)), (Jt = (0, qt.createContext)(void 0)))
  })
function Xt(...e) {
  return Array.from(new Set(e.flatMap((e) => (typeof e == `string` ? e.split(` `) : []))))
    .filter(Boolean)
    .join(` `)
}
var Zt = t(() => {})
function I(e, t, ...n) {
  if (e in t) {
    let r = t[e]
    return typeof r == `function` ? r(...n) : r
  }
  let r = Error(
    `Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      t
    )
      .map((e) => `"${e}"`)
      .join(`, `)}.`
  )
  throw (Error.captureStackTrace && Error.captureStackTrace(r, I), r)
}
var Qt = t(() => {})
function L() {
  let e = tn()
  return (0, fn.useCallback)((t) => $t({ mergeRefs: e, ...t }), [e])
}
function $t({
  ourProps: e,
  theirProps: t,
  slot: n,
  defaultTag: r,
  features: i,
  visible: a = !0,
  name: o,
  mergeRefs: s,
}) {
  s ??= nn
  let c = rn(t, e)
  if (a) return en(c, n, r, o, s)
  let l = i ?? 0
  if (l & 2) {
    let { static: e = !1, ...t } = c
    if (e) return en(t, n, r, o, s)
  }
  if (l & 1) {
    let { unmount: e = !0, ...t } = c
    return I(+!e, {
      0() {
        return null
      },
      1() {
        return en({ ...t, hidden: !0, style: { display: `none` } }, n, r, o, s)
      },
    })
  }
  return en(c, n, r, o, s)
}
function en(e, t = {}, n, r, i) {
  let { as: a = n, children: o, refName: s = `ref`, ...c } = sn(e, [`unmount`, `static`]),
    l = e.ref === void 0 ? {} : { [s]: e.ref },
    u = typeof o == `function` ? o(t) : o
  ;((u = ln(u)),
    `className` in c &&
      c.className &&
      typeof c.className == `function` &&
      (c.className = c.className(t)),
    c[`aria-labelledby`] && c[`aria-labelledby`] === c.id && (c[`aria-labelledby`] = void 0))
  let d = {}
  if (t) {
    let e = !1,
      n = []
    for (let [r, i] of Object.entries(t))
      (typeof i == `boolean` && (e = !0),
        i === !0 && n.push(r.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`)))
    if (e) {
      d[`data-headlessui-state`] = n.join(` `)
      for (let e of n) d[`data-${e}`] = ``
    }
  }
  if (un(a) && (Object.keys(on(c)).length > 0 || Object.keys(on(d)).length > 0))
    if (!(0, fn.isValidElement)(u) || (Array.isArray(u) && u.length > 1) || dn(u)) {
      if (Object.keys(on(c)).length > 0)
        throw Error(
          [
            `Passing props on "Fragment"!`,
            ``,
            `The current component <${r} /> is rendering a "Fragment".`,
            `However we need to passthrough the following props:`,
            Object.keys(on(c))
              .concat(Object.keys(on(d)))
              .map((e) => `  - ${e}`).join(`
`),
            ``,
            `You can apply a few solutions:`,
            [
              'Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',
              `Render a single element as the child so that we can forward the props onto that element.`,
            ].map((e) => `  - ${e}`).join(`
`),
          ].join(`
`)
        )
    } else {
      let e = u.props?.className,
        t = typeof e == `function` ? (...t) => Xt(e(...t), c.className) : Xt(e, c.className),
        n = t ? { className: t } : {},
        r = rn(u.props, on(sn(c, [`ref`])))
      for (let e in d) e in r && delete d[e]
      return (0, fn.cloneElement)(u, Object.assign({}, r, d, l, { ref: i(cn(u), l.ref) }, n))
    }
  return (0, fn.createElement)(a, Object.assign({}, sn(c, [`ref`]), !un(a) && l, !un(a) && d), u)
}
function tn() {
  let e = (0, fn.useRef)([]),
    t = (0, fn.useCallback)((t) => {
      for (let n of e.current) n != null && (typeof n == `function` ? n(t) : (n.current = t))
    }, [])
  return (...n) => {
    if (!n.every((e) => e == null)) return ((e.current = n), t)
  }
}
function nn(...e) {
  return e.every((e) => e == null)
    ? void 0
    : (t) => {
        for (let n of e) n != null && (typeof n == `function` ? n(t) : (n.current = t))
      }
}
function rn(...e) {
  if (e.length === 0) return {}
  if (e.length === 1) return e[0]
  let t = {},
    n = {}
  for (let r of e)
    for (let e in r)
      e.startsWith(`on`) && typeof r[e] == `function`
        ? (n[e] ?? (n[e] = []), n[e].push(r[e]))
        : (t[e] = r[e])
  if (t.disabled || t[`aria-disabled`])
    for (let e in n)
      /^(on(?:Click|Pointer|Mouse|Key)(?:Down|Up|Press)?)$/.test(e) &&
        (n[e] = [(e) => e?.preventDefault?.call(e)])
  for (let e in n)
    Object.assign(t, {
      [e](t, ...r) {
        let i = n[e]
        for (let e of i) {
          if ((t instanceof Event || t?.nativeEvent instanceof Event) && t.defaultPrevented) return
          e(t, ...r)
        }
      },
    })
  return t
}
function an(...e) {
  if (e.length === 0) return {}
  if (e.length === 1) return e[0]
  let t = {},
    n = {}
  for (let r of e)
    for (let e in r)
      e.startsWith(`on`) && typeof r[e] == `function`
        ? (n[e] ?? (n[e] = []), n[e].push(r[e]))
        : (t[e] = r[e])
  for (let e in n)
    Object.assign(t, {
      [e](...t) {
        let r = n[e]
        for (let e of r) e?.(...t)
      },
    })
  return t
}
function R(e) {
  return Object.assign((0, fn.forwardRef)(e), { displayName: e.displayName ?? e.name })
}
function on(e) {
  let t = Object.assign({}, e)
  for (let e in t) t[e] === void 0 && delete t[e]
  return t
}
function sn(e, t = []) {
  let n = Object.assign({}, e)
  for (let e of t) e in n && delete n[e]
  return n
}
function cn(e) {
  return `19.2.5`.split(`.`)[0] >= `19` ? e.props.ref : e.ref
}
function ln(e) {
  if (e != null && e.$$typeof === Symbol.for(`react.lazy`)) {
    let t = e._payload
    if (t != null && t.status === `fulfilled`) return ln(t.value)
  }
  return e
}
function un(e) {
  return e === fn.Fragment || e === Symbol.for(`react.fragment`)
}
function dn(e) {
  return un(e.type)
}
var fn,
  pn,
  mn,
  hn = t(() => {
    ;((fn = e(r(), 1)),
      Zt(),
      Qt(),
      (pn = ((e) => (
        (e[(e.None = 0)] = `None`),
        (e[(e.RenderStrategy = 1)] = `RenderStrategy`),
        (e[(e.Static = 2)] = `Static`),
        e
      ))(pn || {})),
      (mn = ((e) => ((e[(e.Unmount = 0)] = `Unmount`), (e[(e.Hidden = 1)] = `Hidden`), e))(
        mn || {}
      )))
  })
function gn(e, t) {
  let n = Gt(),
    { disabled: r = n || !1, autoFocus: i = !1, ...a } = e,
    { isFocusVisible: o, focusProps: s } = $e({ autoFocus: i }),
    { isHovered: c, hoverProps: l } = st({ isDisabled: r }),
    { pressed: u, pressProps: d } = Bt({ disabled: r }),
    f = an({ ref: t, type: a.type ?? `button`, disabled: r || void 0, autoFocus: i }, s, l, d),
    p = F({ disabled: r, hover: c, focus: o, active: u, autofocus: i })
  return L()({ ourProps: f, theirProps: a, slot: p, defaultTag: _n, name: `Button` })
}
var _n,
  vn,
  yn = t(() => {
    ;(rt(), pt(), Ht(), Wt(), Yt(), hn(), (_n = `button`), (vn = R(gn)))
  })
function bn(e, t, n) {
  let [r, i] = (0, xn.useState)(n),
    a = e !== void 0,
    o = (0, xn.useRef)(a),
    s = (0, xn.useRef)(!1),
    c = (0, xn.useRef)(!1)
  return (
    a && !o.current && !s.current
      ? ((s.current = !0),
        (o.current = a),
        console.error(
          `A component is changing from uncontrolled to controlled. This may be caused by the value changing from undefined to a defined value, which should not happen.`
        ))
      : !a &&
        o.current &&
        !c.current &&
        ((c.current = !0),
        (o.current = a),
        console.error(
          `A component is changing from controlled to uncontrolled. This may be caused by the value changing from a defined value to undefined, which should not happen.`
        )),
    [a ? e : r, N((e) => (a || (0, Sn.flushSync)(() => i(e)), t?.(e)))]
  )
}
var xn,
  Sn,
  Cn = t(() => {
    ;((xn = e(r(), 1)), (Sn = e(a(), 1)), P())
  })
function wn(e) {
  let [t] = (0, Tn.useState)(e)
  return t
}
var Tn,
  En = t(() => {
    Tn = e(r(), 1)
  }),
  z,
  Dn = t(() => {
    z = e(r(), 1)
  })
function On(e = {}, t = null, n = []) {
  for (let [r, i] of Object.entries(e)) An(n, kn(t, r), i)
  return n
}
function kn(e, t) {
  return e ? e + `[` + t + `]` : t
}
function An(e, t, n) {
  if (Array.isArray(n)) for (let [r, i] of n.entries()) An(e, kn(t, r.toString()), i)
  else
    n instanceof Date
      ? e.push([t, n.toISOString()])
      : typeof n == `boolean`
        ? e.push([t, n ? `1` : `0`])
        : typeof n == `string`
          ? e.push([t, n])
          : typeof n == `number`
            ? e.push([t, `${n}`])
            : n == null
              ? e.push([t, ``])
              : Mn(n) && !(0, Nn.isValidElement)(n) && On(n, t, e)
}
function jn(e) {
  var t
  let n = e?.form ?? e.closest(`form`)
  if (n) {
    for (let t of n.elements)
      if (
        t !== e &&
        ((t.tagName === `INPUT` && t.type === `submit`) ||
          (t.tagName === `BUTTON` && t.type === `submit`) ||
          (t.nodeName === `INPUT` && t.type === `image`))
      ) {
        t.click()
        return
      }
    ;(t = n.requestSubmit) == null || t.call(n)
  }
}
function Mn(e) {
  if (Object.prototype.toString.call(e) !== `[object Object]`) return !1
  let t = Object.getPrototypeOf(e)
  return t === null || Object.getPrototypeOf(t) === null
}
var Nn,
  Pn = t(() => {
    Nn = e(r(), 1)
  })
function Fn(e, t) {
  let { features: n = 1, ...r } = e,
    i = {
      ref: t,
      'aria-hidden': (n & 2) == 2 ? !0 : (r[`aria-hidden`] ?? void 0),
      hidden: (n & 4) == 4 ? !0 : void 0,
      style: {
        position: `fixed`,
        top: 1,
        left: 1,
        width: 1,
        height: 0,
        padding: 0,
        margin: -1,
        overflow: `hidden`,
        clip: `rect(0, 0, 0, 0)`,
        whiteSpace: `nowrap`,
        borderWidth: `0`,
        ...((n & 4) == 4 && (n & 2) != 2 && { display: `none` }),
      },
    }
  return L()({ ourProps: i, theirProps: r, slot: {}, defaultTag: In, name: `Hidden` })
}
var In,
  Ln,
  Rn,
  zn = t(() => {
    ;(hn(),
      (In = `span`),
      (Ln = ((e) => (
        (e[(e.None = 1)] = `None`),
        (e[(e.Focusable = 2)] = `Focusable`),
        (e[(e.Hidden = 4)] = `Hidden`),
        e
      ))(Ln || {})),
      (Rn = R(Fn)))
  })
function Bn(e) {
  let [t, n] = (0, Wn.useState)(null)
  return Wn.createElement(
    Kn.Provider,
    { value: { target: t } },
    e.children,
    Wn.createElement(Rn, { features: Ln.Hidden, ref: n })
  )
}
function Vn({ children: e }) {
  let t = (0, Wn.useContext)(Kn)
  if (!t) return Wn.createElement(Wn.Fragment, null, e)
  let { target: n } = t
  return n ? (0, Gn.createPortal)(Wn.createElement(Wn.Fragment, null, e), n) : null
}
function Hn({ data: e, form: t, disabled: n, onReset: r, overrides: i }) {
  let [a, o] = (0, Wn.useState)(null),
    s = kt()
  return (
    (0, Wn.useEffect)(() => {
      if (r && a) return s.addEventListener(a, `reset`, r)
    }, [a, t, r]),
    Wn.createElement(
      Vn,
      null,
      Wn.createElement(Un, { setForm: o, formId: t }),
      On(e).map(([e, r]) =>
        Wn.createElement(Rn, {
          features: Ln.Hidden,
          ...on({
            key: e,
            as: `input`,
            type: `hidden`,
            hidden: !0,
            readOnly: !0,
            form: t,
            disabled: n,
            name: e,
            value: r,
            ...i,
          }),
        })
      )
    )
  )
}
function Un({ setForm: e, formId: t }) {
  return (
    (0, Wn.useEffect)(() => {
      if (t) {
        let n = document.getElementById(t)
        n && e(n)
      }
    }, [e, t]),
    t
      ? null
      : Wn.createElement(Rn, {
          features: Ln.Hidden,
          as: `input`,
          type: `hidden`,
          hidden: !0,
          readOnly: !0,
          ref: (t) => {
            if (!t) return
            let n = t.closest(`form`)
            n && e(n)
          },
        })
  )
}
var Wn,
  Gn,
  Kn,
  qn = t(() => {
    ;((Wn = e(r(), 1)),
      (Gn = e(a(), 1)),
      jt(),
      Pn(),
      hn(),
      zn(),
      (Kn = (0, Wn.createContext)(null)))
  })
function Jn() {
  return (0, Xn.useContext)(Zn)
}
function Yn({ id: e, children: t }) {
  return Xn.createElement(Zn.Provider, { value: e }, t)
}
var Xn,
  Zn,
  Qn = t(() => {
    ;((Xn = e(r(), 1)), (Zn = (0, Xn.createContext)(void 0)))
  })
function $n(e) {
  return typeof e != `object` || !e ? !1 : `nodeType` in e
}
function er(e) {
  return $n(e) && `tagName` in e
}
function tr(e) {
  return er(e) && `accessKey` in e
}
function nr(e) {
  return er(e) && `tabIndex` in e
}
function rr(e) {
  return er(e) && `style` in e
}
function ir(e) {
  return tr(e) && e.nodeName === `IFRAME`
}
function ar(e) {
  return tr(e) && e.nodeName === `INPUT`
}
function or(e) {
  return tr(e) && e.nodeName === `LABEL`
}
function sr(e) {
  return tr(e) && e.nodeName === `FIELDSET`
}
function cr(e) {
  return tr(e) && e.nodeName === `LEGEND`
}
function lr(e) {
  return er(e)
    ? e.matches(
        `a[href],audio[controls],button,details,embed,iframe,img[usemap],input:not([type="hidden"]),label,select,textarea,video[controls]`
      )
    : !1
}
var ur = t(() => {})
function dr(e) {
  let t = e.parentElement,
    n = null
  for (; t && !sr(t); ) (cr(t) && (n = t), (t = t.parentElement))
  let r = t?.getAttribute(`disabled`) === ``
  return r && fr(n) ? !1 : r
}
function fr(e) {
  if (!e) return !1
  let t = e.previousElementSibling
  for (; t !== null; ) {
    if (cr(t)) return !1
    t = t.previousElementSibling
  }
  return !0
}
var pr = t(() => {
  ur()
})
function mr(e, t = !0) {
  return Object.assign(e, { [gr]: t })
}
function B(...e) {
  let t = (0, hr.useRef)(e)
  ;(0, hr.useEffect)(() => {
    t.current = e
  }, [e])
  let n = N((e) => {
    for (let n of t.current) n != null && (typeof n == `function` ? n(e) : (n.current = e))
  })
  return e.every((e) => e == null || e?.[gr]) ? void 0 : n
}
var hr,
  gr,
  _r = t(() => {
    ;((hr = e(r(), 1)), P(), (gr = Symbol()))
  })
function vr() {
  let e = (0, Sr.useContext)(Cr)
  if (e === null) {
    let e = Error(`You used a <Description /> component, but it is not inside a relevant parent.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(e, vr), e)
  }
  return e
}
function yr() {
  return (0, Sr.useContext)(Cr)?.value ?? void 0
}
function br() {
  let [e, t] = (0, Sr.useState)([])
  return [
    e.length > 0 ? e.join(` `) : void 0,
    (0, Sr.useMemo)(
      () =>
        function (e) {
          let n = N(
              (e) => (
                t((t) => [...t, e]),
                () =>
                  t((t) => {
                    let n = t.slice(),
                      r = n.indexOf(e)
                    return (r !== -1 && n.splice(r, 1), n)
                  })
              )
            ),
            r = (0, Sr.useMemo)(
              () => ({ register: n, slot: e.slot, name: e.name, props: e.props, value: e.value }),
              [n, e.slot, e.name, e.props, e.value]
            )
          return Sr.createElement(Cr.Provider, { value: r }, e.children)
        },
      [t]
    ),
  ]
}
function xr(e, t) {
  let n = (0, z.useId)(),
    r = Gt(),
    { id: i = `headlessui-description-${n}`, ...a } = e,
    o = vr(),
    s = B(t)
  M(() => o.register(i), [i, o.register])
  let c = F({ ...o.slot, disabled: r || !1 }),
    l = { ref: s, ...o.props, id: i }
  return L()({ ourProps: l, theirProps: a, slot: c, defaultTag: wr, name: o.name || `Description` })
}
var Sr,
  Cr,
  wr,
  Tr,
  Er,
  Dr = t(() => {
    ;((Sr = e(r(), 1)),
      P(),
      Dn(),
      Nt(),
      Wt(),
      _r(),
      Yt(),
      hn(),
      (Cr = (0, Sr.createContext)(null)),
      (Cr.displayName = `DescriptionContext`),
      (wr = `p`),
      (Tr = R(xr)),
      (Er = Object.assign(Tr, {})))
  }),
  V,
  Or = t(() => {
    V = ((e) => (
      (e.Space = ` `),
      (e.Enter = `Enter`),
      (e.Escape = `Escape`),
      (e.Backspace = `Backspace`),
      (e.Delete = `Delete`),
      (e.ArrowLeft = `ArrowLeft`),
      (e.ArrowUp = `ArrowUp`),
      (e.ArrowRight = `ArrowRight`),
      (e.ArrowDown = `ArrowDown`),
      (e.Home = `Home`),
      (e.End = `End`),
      (e.PageUp = `PageUp`),
      (e.PageDown = `PageDown`),
      (e.Tab = `Tab`),
      e
    ))(V || {})
  })
function kr() {
  let e = (0, Nr.useContext)(Pr)
  if (e === null) {
    let e = Error(`You used a <Label /> component, but it is not inside a relevant parent.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(e, kr), e)
  }
  return e
}
function Ar(e) {
  let t = (0, Nr.useContext)(Pr)?.value ?? void 0
  return (e?.length ?? 0) > 0 ? [t, ...e].filter(Boolean).join(` `) : t
}
function jr({ inherit: e = !1 } = {}) {
  let t = Ar(),
    [n, r] = (0, Nr.useState)([]),
    i = e ? [t, ...n].filter(Boolean) : n
  return [
    i.length > 0 ? i.join(` `) : void 0,
    (0, Nr.useMemo)(
      () =>
        function (e) {
          let t = N(
              (e) => (
                r((t) => [...t, e]),
                () =>
                  r((t) => {
                    let n = t.slice(),
                      r = n.indexOf(e)
                    return (r !== -1 && n.splice(r, 1), n)
                  })
              )
            ),
            n = (0, Nr.useMemo)(
              () => ({ register: t, slot: e.slot, name: e.name, props: e.props, value: e.value }),
              [t, e.slot, e.name, e.props, e.value]
            )
          return Nr.createElement(Pr.Provider, { value: n }, e.children)
        },
      [r]
    ),
  ]
}
function Mr(e, t) {
  let n = (0, z.useId)(),
    r = kr(),
    i = Jn(),
    a = Gt(),
    {
      id: o = `headlessui-label-${n}`,
      htmlFor: s = i ?? r.props?.htmlFor,
      passive: c = !1,
      ...l
    } = e,
    u = B(t)
  M(() => r.register(o), [o, r.register])
  let d = N((e) => {
      let t = e.currentTarget
      if (
        !(e.target !== e.currentTarget && lr(e.target)) &&
        (or(t) && e.preventDefault(),
        r.props &&
          `onClick` in r.props &&
          typeof r.props.onClick == `function` &&
          r.props.onClick(e),
        or(t))
      ) {
        let e = document.getElementById(t.htmlFor)
        if (e) {
          let t = e.getAttribute(`disabled`)
          if (t === `true` || t === ``) return
          let n = e.getAttribute(`aria-disabled`)
          if (n === `true` || n === ``) return
          ;(((ar(e) && (e.type === `file` || e.type === `radio` || e.type === `checkbox`)) ||
            e.role === `radio` ||
            e.role === `checkbox` ||
            e.role === `switch`) &&
            e.click(),
            e.focus({ preventScroll: !0 }))
        }
      }
    }),
    f = F({ ...r.slot, disabled: a || !1 }),
    p = { ref: u, ...r.props, id: o, htmlFor: s, onClick: d }
  return (
    c &&
      (`onClick` in p && (delete p.htmlFor, delete p.onClick), `onClick` in l && delete l.onClick),
    L()({
      ourProps: p,
      theirProps: l,
      slot: f,
      defaultTag: s ? Fr : `div`,
      name: r.name || `Label`,
    })
  )
}
var Nr,
  Pr,
  Fr,
  Ir,
  Lr,
  Rr = t(() => {
    ;((Nr = e(r(), 1)),
      P(),
      Dn(),
      Nt(),
      Wt(),
      _r(),
      Yt(),
      Qn(),
      ur(),
      hn(),
      (Pr = (0, Nr.createContext)(null)),
      (Pr.displayName = `LabelContext`),
      (Fr = `label`),
      (Ir = R(Mr)),
      (Lr = Object.assign(Ir, {})))
  })
function zr(e, t) {
  let n = (0, z.useId)(),
    r = Jn(),
    i = Gt(),
    {
      id: a = r || `headlessui-checkbox-${n}`,
      disabled: o = i || !1,
      autoFocus: s = !1,
      checked: c,
      defaultChecked: l,
      onChange: u,
      name: d,
      value: f,
      form: p,
      indeterminate: m = !1,
      tabIndex: h = 0,
      ...g
    } = e,
    _ = wn(l),
    [v, y] = bn(c, u, _ ?? !1),
    b = Ar(),
    x = yr(),
    S = kt(),
    [C, w] = (0, Br.useState)(!1),
    T = N(() => {
      ;(w(!0),
        y?.(!v),
        S.nextFrame(() => {
          w(!1)
        }))
    }),
    E = N((e) => {
      if (dr(e.currentTarget)) return e.preventDefault()
      ;(e.preventDefault(), T())
    }),
    D = N((e) => {
      e.key === V.Space ? (e.preventDefault(), T()) : e.key === V.Enter && jn(e.currentTarget)
    }),
    O = N((e) => e.preventDefault()),
    { isFocusVisible: k, focusProps: A } = $e({ autoFocus: s }),
    { isHovered: ee, hoverProps: te } = st({ isDisabled: o }),
    { pressed: ne, pressProps: re } = Bt({ disabled: o }),
    ie = an(
      {
        ref: t,
        id: a,
        role: `checkbox`,
        'aria-checked': m ? `mixed` : v ? `true` : `false`,
        'aria-labelledby': b,
        'aria-describedby': x,
        'aria-disabled': o ? !0 : void 0,
        indeterminate: m ? `true` : void 0,
        tabIndex: o ? void 0 : h,
        onKeyUp: o ? void 0 : D,
        onKeyPress: o ? void 0 : O,
        onClick: o ? void 0 : E,
      },
      A,
      te,
      re
    ),
    ae = F({
      checked: v,
      disabled: o,
      hover: ee,
      focus: k,
      active: ne,
      indeterminate: m,
      changing: C,
      autofocus: s,
    }),
    j = (0, Br.useCallback)(() => {
      if (_ !== void 0) return y?.(_)
    }, [y, _]),
    oe = L()
  return Br.createElement(
    Br.Fragment,
    null,
    d != null &&
      Br.createElement(Hn, {
        disabled: o,
        data: { [d]: f || `on` },
        overrides: { type: `checkbox`, checked: v },
        form: p,
        onReset: j,
      }),
    oe({ ourProps: ie, theirProps: g, slot: ae, defaultTag: Vr, name: `Checkbox` })
  )
}
var Br,
  Vr,
  Hr = t(() => {
    ;(rt(),
      pt(),
      (Br = e(r(), 1)),
      Ht(),
      Cn(),
      En(),
      jt(),
      P(),
      Dn(),
      Wt(),
      Yt(),
      qn(),
      Qn(),
      pr(),
      Pn(),
      hn(),
      Dr(),
      Or(),
      Rr(),
      (Vr = `span`),
      R(zr))
  })
function Ur() {
  return (0, Gr.useContext)(Kr)
}
function Wr({ value: e, children: t }) {
  return Gr.createElement(Kr.Provider, { value: e }, t)
}
var Gr,
  Kr,
  qr = t(() => {
    ;((Gr = e(r(), 1)), (Kr = (0, Gr.createContext)(() => {})))
  })
function Jr(e, t) {
  let n = Ur()
  return Yr.createElement(vn, { ref: t, ...an({ onClick: n }, e) })
}
var Yr,
  Xr = t(() => {
    ;((Yr = e(r(), 1)), qr(), hn(), yn(), R(Jr))
  })
function Zr(e, t, n) {
  let r = Array(e)
  return new Proxy(r, {
    get(r, i, a) {
      if (typeof i == `string`) {
        let a = i.charCodeAt(0)
        if (a >= 48 && a <= 57) {
          let a = +i
          if (Number.isInteger(a) && a >= 0 && a < e) {
            let e = r[a]
            if (!e) {
              let i = t[a * 2]
              e = r[a] = {
                index: a,
                key: n(a),
                start: i,
                size: t[a * 2 + 1],
                end: i + t[a * 2 + 1],
                lane: 0,
              }
            }
            return e
          }
        }
        if (i === `length`) return e
      }
      return Reflect.get(r, i, a)
    },
  })
}
var Qr = t(() => {})
function $r(e, t, n) {
  let r = n.initialDeps ?? [],
    i,
    a = !0
  function o() {
    let o = e()
    return o.length !== r.length || o.some((e, t) => r[t] !== e)
      ? ((r = o),
        (i = t(...o)),
        n?.onChange && !(a && n.skipInitialOnChange) && n.onChange(i),
        (a = !1),
        i)
      : i
  }
  return (
    (o.updateDeps = (e) => {
      r = e
    }),
    o
  )
}
function ei(e, t) {
  if (e === void 0) throw Error(`Unexpected undefined${t ? `: ${t}` : ``}`)
  return e
}
var ti,
  ni,
  ri = t(() => {
    ;((ti = (e, t) => Math.abs(e - t) < 1.01),
      (ni = (e, t, n) => {
        let r
        return function (...i) {
          ;(e.clearTimeout(r), (r = e.setTimeout(() => t.apply(this, i), n)))
        }
      }))
  })
function ii({ measurements: e, outerSize: t, scrollOffset: n, lanes: r, flat: i }) {
  let a = e.length - 1,
    o = i ? (e) => i[e * 2] : (t) => e[t].start,
    s = i ? (e) => i[e * 2] + i[e * 2 + 1] : (t) => e[t].end
  if (e.length <= r) return { startIndex: 0, endIndex: a }
  let c = yi(0, a, o, n),
    l = c
  if (r === 1) for (; l < a && s(l) < n + t; ) l++
  else if (r > 1) {
    let i = Array(r).fill(0)
    for (; l < a && i.some((e) => e < n + t); ) {
      let t = e[l]
      ;((i[t.lane] = t.end), l++)
    }
    let o = Array(r).fill(n + t)
    for (; c >= 0 && o.some((e) => e >= n); ) {
      let t = e[c]
      ;((o[t.lane] = t.start), c--)
    }
    ;((c = Math.max(0, c - (c % r))), (l = Math.min(a, l + (r - 1 - (l % r)))))
  }
  return { startIndex: c, endIndex: l }
}
var ai,
  oi,
  si,
  ci,
  li,
  ui,
  di,
  fi,
  pi,
  mi,
  hi,
  gi,
  _i,
  vi,
  yi,
  bi = t(() => {
    ;(Qr(),
      ri(),
      (oi = () => {
        if (ai !== void 0) return ai
        if (typeof navigator > `u`) return (ai = !1)
        if (/iP(hone|od|ad)/.test(navigator.userAgent)) return (ai = !0)
        let e = navigator.maxTouchPoints
        return (ai = navigator.platform === `MacIntel` && e !== void 0 && e > 0)
      }),
      (si = (e) => {
        let { offsetWidth: t, offsetHeight: n } = e
        return { width: t, height: n }
      }),
      (ci = (e) => e),
      (li = (e) => {
        let t = Math.max(e.startIndex - e.overscan, 0),
          n = Math.min(e.endIndex + e.overscan, e.count - 1) - t + 1,
          r = Array(n)
        for (let e = 0; e < n; e++) r[e] = t + e
        return r
      }),
      (ui = (e, t) => {
        let n = e.scrollElement
        if (!n) return
        let r = e.targetWindow
        if (!r) return
        let i = (e) => {
          let { width: n, height: r } = e
          t({ width: Math.round(n), height: Math.round(r) })
        }
        if ((i(si(n)), !r.ResizeObserver)) return () => {}
        let a = new r.ResizeObserver((t) => {
          let r = () => {
            let e = t[0]
            if (e?.borderBoxSize) {
              let t = e.borderBoxSize[0]
              if (t) {
                i({ width: t.inlineSize, height: t.blockSize })
                return
              }
            }
            i(si(n))
          }
          e.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(r) : r()
        })
        return (
          a.observe(n, { box: `border-box` }),
          () => {
            a.unobserve(n)
          }
        )
      }),
      (di = { passive: !0 }),
      (fi = typeof window > `u` ? !0 : `onscrollend` in window),
      (pi = (e, t, n) => {
        let r = e.scrollElement
        if (!r) return
        let i = e.targetWindow
        if (!i) return
        let a = e.options.useScrollendEvent && fi,
          o = 0,
          s = a ? null : ni(i, () => t(o, !1), e.options.isScrollingResetDelay),
          c = (e) => () => {
            ;((o = n(r)), s?.(), t(o, e))
          },
          l = c(!0),
          u = c(!1)
        return (
          r.addEventListener(`scroll`, l, di),
          a && r.addEventListener(`scrollend`, u, di),
          () => {
            ;(r.removeEventListener(`scroll`, l), a && r.removeEventListener(`scrollend`, u))
          }
        )
      }),
      (mi = (e, t) =>
        pi(e, t, (t) => {
          let { horizontal: n, isRtl: r } = e.options
          return n ? t.scrollLeft * ((r && -1) || 1) : t.scrollTop
        })),
      (hi = (e, t, n) => {
        if (n.options.useCachedMeasurements) {
          let t = n.indexFromElement(e),
            r = n.options.getItemKey(t)
          return n.itemSizeCache.get(r) ?? n.options.estimateSize(t)
        }
        if (t?.borderBoxSize) {
          let e = t.borderBoxSize[0]
          if (e) return Math.round(e[n.options.horizontal ? `inlineSize` : `blockSize`])
        }
        if (!t) {
          let t = n.indexFromElement(e),
            r = n.options.getItemKey(t),
            i = n.itemSizeCache.get(r)
          if (i !== void 0) return i
        }
        return e[n.options.horizontal ? `offsetWidth` : `offsetHeight`]
      }),
      (gi = (e, { adjustments: t = 0, behavior: n }, r) => {
        var i, a
        ;(a = (i = r.scrollElement)?.scrollTo) == null ||
          a.call(i, { [r.options.horizontal ? `left` : `top`]: e + t, behavior: n })
      }),
      (_i = gi),
      (vi = class {
        constructor(e) {
          ;((this.unsubs = []),
            (this.scrollElement = null),
            (this.targetWindow = null),
            (this.isScrolling = !1),
            (this.scrollState = null),
            (this.measurementsCache = []),
            (this._flatMeasurements = null),
            (this.itemSizeCache = new Map()),
            (this.itemSizeCacheVersion = 0),
            (this.laneAssignments = new Map()),
            (this.pendingMin = null),
            (this.prevLanes = void 0),
            (this.lanesChangedFlag = !1),
            (this.lanesSettling = !1),
            (this.pendingScrollAnchor = null),
            (this.scrollRect = null),
            (this.scrollOffset = null),
            (this.scrollDirection = null),
            (this.scrollAdjustments = 0),
            (this._iosDeferredAdjustment = 0),
            (this._iosTouching = !1),
            (this._iosJustTouchEnded = !1),
            (this._iosTouchEndTimerId = null),
            (this._intendedScrollOffset = null),
            (this.elementsCache = new Map()),
            (this.now = () => {
              var e
              return (e = this.targetWindow?.performance)?.now?.call(e) ?? Date.now()
            }),
            (this.observer = (() => {
              let e = null,
                t = () =>
                  e ||
                  (!this.targetWindow || !this.targetWindow.ResizeObserver
                    ? null
                    : (e = new this.targetWindow.ResizeObserver((e) => {
                        e.forEach((e) => {
                          let t = () => {
                            let t = e.target,
                              n = this.indexFromElement(t)
                            if (!t.isConnected) {
                              this.observer.unobserve(t)
                              for (let [e, n] of this.elementsCache)
                                if (n === t) {
                                  this.elementsCache.delete(e)
                                  break
                                }
                              return
                            }
                            this.shouldMeasureDuringScroll(n) &&
                              this.resizeItem(n, this.options.measureElement(t, e, this))
                          }
                          this.options.useAnimationFrameWithResizeObserver
                            ? requestAnimationFrame(t)
                            : t()
                        })
                      })))
              return {
                disconnect: () => {
                  var n
                  ;((n = t()) == null || n.disconnect(), (e = null))
                },
                observe: (e) => t()?.observe(e, { box: `border-box` }),
                unobserve: (e) => t()?.unobserve(e),
              }
            })()),
            (this.range = null),
            (this.setOptions = (e) => {
              let t = {
                debug: !1,
                initialOffset: 0,
                overscan: 1,
                paddingStart: 0,
                paddingEnd: 0,
                scrollPaddingStart: 0,
                scrollPaddingEnd: 0,
                horizontal: !1,
                getItemKey: ci,
                rangeExtractor: li,
                onChange: () => {},
                measureElement: hi,
                initialRect: { width: 0, height: 0 },
                scrollMargin: 0,
                gap: 0,
                indexAttribute: `data-index`,
                initialMeasurementsCache: [],
                lanes: 1,
                anchorTo: `start`,
                followOnAppend: !1,
                scrollEndThreshold: 1,
                isScrollingResetDelay: 150,
                enabled: !0,
                isRtl: !1,
                useScrollendEvent: !1,
                useAnimationFrameWithResizeObserver: !1,
                laneAssignmentMode: `estimate`,
                useCachedMeasurements: !1,
              }
              for (let n in e) {
                let r = e[n]
                r !== void 0 && (t[n] = r)
              }
              let n = this.options,
                r = null,
                i = null,
                a = !1
              if (
                n !== void 0 &&
                n.enabled &&
                t.enabled &&
                t.anchorTo === `end` &&
                this.scrollElement !== null
              ) {
                let e = n.count,
                  o = t.count,
                  s = this.getMeasurements(),
                  c = e > 0 ? (s[0]?.key ?? n.getItemKey(0)) : null,
                  l = e > 0 ? (s[e - 1]?.key ?? n.getItemKey(e - 1)) : null
                if (
                  o !== e ||
                  (e > 0 && o > 0 && (t.getItemKey(0) !== c || t.getItemKey(o - 1) !== l))
                ) {
                  a = !0
                  let c =
                    e > 0 ? (this.getVirtualItemForOffset(this.getScrollOffset()) ?? s[0]) : null
                  c && (r = [c.key, this.getScrollOffset() - c.start])
                  let u = t.followOnAppend === !0 ? `auto` : t.followOnAppend || null
                  u &&
                    o > e &&
                    this.isAtEnd(n.scrollEndThreshold) &&
                    (e === 0 || t.getItemKey(o - 1) !== l) &&
                    (i = u)
                }
              }
              ;((this.options = t), a && ((this.pendingMin = 0), this.itemSizeCacheVersion++))
              let o = !1,
                s = 0
              if (r && this.scrollOffset !== null) {
                let [e, t] = r,
                  n = this.getMeasurements(),
                  { count: i, getItemKey: a } = this.options,
                  c = 0
                for (; c < i && a(c) !== e; ) c++
                if (c < i) {
                  let e = n[c]
                  if (e) {
                    let n = e.start + t
                    n !== this.scrollOffset &&
                      ((s = n - this.scrollOffset), (this.scrollOffset = n), (o = !0))
                  }
                }
              }
              ;(o || i) && (this.pendingScrollAnchor = [o ? r[0] : null, o ? r[1] : 0, i, s])
            }),
            (this.notify = (e) => {
              var t, n
              ;(n = (t = this.options).onChange) == null || n.call(t, this, e)
            }),
            (this.maybeNotify = $r(
              () => (
                this.calculateRange(),
                [
                  this.isScrolling,
                  this.range ? this.range.startIndex : null,
                  this.range ? this.range.endIndex : null,
                ]
              ),
              (e) => {
                this.notify(e)
              },
              {
                key: !1,
                debug: () => this.options.debug,
                initialDeps: [
                  this.isScrolling,
                  this.range ? this.range.startIndex : null,
                  this.range ? this.range.endIndex : null,
                ],
              }
            )),
            (this.cleanup = () => {
              ;(this.unsubs.filter(Boolean).forEach((e) => e()),
                (this.unsubs = []),
                this.observer.disconnect(),
                this.rafId != null &&
                  this.targetWindow &&
                  (this.targetWindow.cancelAnimationFrame(this.rafId), (this.rafId = null)),
                (this.scrollState = null),
                (this.scrollElement = null),
                (this.targetWindow = null))
            }),
            (this._didMount = () => () => {
              this.cleanup()
            }),
            (this._willUpdate = () => {
              let e = this.options.enabled ? this.options.getScrollElement() : null
              if (this.scrollElement !== e) {
                if ((this.cleanup(), !e)) {
                  this.maybeNotify()
                  return
                }
                if (
                  ((this.scrollElement = e),
                  this.scrollElement && `ownerDocument` in this.scrollElement
                    ? (this.targetWindow = this.scrollElement.ownerDocument.defaultView)
                    : (this.targetWindow = this.scrollElement?.window ?? null),
                  this.elementsCache.forEach((e) => {
                    this.observer.observe(e)
                  }),
                  this.unsubs.push(
                    this.options.observeElementRect(this, (e) => {
                      ;((this.scrollRect = e), this.maybeNotify())
                    })
                  ),
                  this.unsubs.push(
                    this.options.observeElementOffset(this, (e, t) => {
                      ;(this._intendedScrollOffset !== null &&
                        Math.abs(e - this._intendedScrollOffset) < 1.5 &&
                        (e = this._intendedScrollOffset),
                        (this._intendedScrollOffset = null),
                        (this.scrollAdjustments = 0),
                        (this.scrollDirection = t
                          ? this.getScrollOffset() < e
                            ? `forward`
                            : `backward`
                          : null),
                        (this.scrollOffset = e),
                        (this.isScrolling = t),
                        this._flushIosDeferredIfReady(),
                        this.scrollState && this.scheduleScrollReconcile(),
                        this.maybeNotify())
                    })
                  ),
                  `addEventListener` in this.scrollElement)
                ) {
                  let e = this.scrollElement,
                    t = () => {
                      ;((this._iosTouching = !0),
                        (this._iosJustTouchEnded = !1),
                        this._iosTouchEndTimerId !== null &&
                          this.targetWindow != null &&
                          (this.targetWindow.clearTimeout(this._iosTouchEndTimerId),
                          (this._iosTouchEndTimerId = null)))
                    },
                    n = () => {
                      ;((this._iosTouching = !1),
                        !(!oi() || this.targetWindow == null) &&
                          ((this._iosJustTouchEnded = !0),
                          (this._iosTouchEndTimerId = this.targetWindow.setTimeout(() => {
                            ;((this._iosJustTouchEnded = !1),
                              (this._iosTouchEndTimerId = null),
                              this._flushIosDeferredIfReady())
                          }, 150))))
                    }
                  ;(e.addEventListener(`touchstart`, t, di),
                    e.addEventListener(`touchend`, n, di),
                    this.unsubs.push(() => {
                      ;(e.removeEventListener(`touchstart`, t),
                        e.removeEventListener(`touchend`, n),
                        this._iosTouchEndTimerId !== null &&
                          this.targetWindow != null &&
                          (this.targetWindow.clearTimeout(this._iosTouchEndTimerId),
                          (this._iosTouchEndTimerId = null)))
                    }))
                }
                this._scrollToOffset(this.getScrollOffset(), {
                  adjustments: void 0,
                  behavior: void 0,
                })
              }
              let t = this.pendingScrollAnchor
              if (
                ((this.pendingScrollAnchor = null), t && this.scrollElement && this.options.enabled)
              ) {
                let [e, n, r, i] = t
                ;(e !== null &&
                  !r &&
                  (oi() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded)
                    ? i !== 0 && (this._iosDeferredAdjustment += i)
                    : this._scrollToOffset(this.getScrollOffset(), {
                        adjustments: void 0,
                        behavior: void 0,
                      })),
                  r && this.scrollToEnd({ behavior: r }))
              }
            }),
            (this._flushIosDeferredIfReady = () => {
              if (
                this._iosDeferredAdjustment === 0 ||
                this.isScrolling ||
                this._iosTouching ||
                this._iosJustTouchEnded
              )
                return
              let e = this.getScrollOffset(),
                t = this.getMaxScrollOffset()
              if (e < 0 || e > t) return
              let n = this._iosDeferredAdjustment
              ;((this._iosDeferredAdjustment = 0),
                this._scrollToOffset(e, {
                  adjustments: (this.scrollAdjustments += n),
                  behavior: void 0,
                }))
            }),
            (this.rafId = null),
            (this.getSize = () =>
              this.options.enabled
                ? ((this.scrollRect = this.scrollRect ?? this.options.initialRect),
                  this.scrollRect[this.options.horizontal ? `width` : `height`])
                : ((this.scrollRect = null), 0)),
            (this.getScrollOffset = () =>
              this.options.enabled
                ? ((this.scrollOffset =
                    this.scrollOffset ??
                    (typeof this.options.initialOffset == `function`
                      ? this.options.initialOffset()
                      : this.options.initialOffset)),
                  this.scrollOffset)
                : ((this.scrollOffset = null), 0)),
            (this.getFurthestMeasurement = (e, t) => {
              let n = new Map(),
                r = new Map()
              for (let i = t - 1; i >= 0; i--) {
                let t = e[i]
                if (n.has(t.lane)) continue
                let a = r.get(t.lane)
                if (
                  (a == null || t.end > a.end
                    ? r.set(t.lane, t)
                    : t.end < a.end && n.set(t.lane, !0),
                  n.size === this.options.lanes)
                )
                  break
              }
              return r.size === this.options.lanes
                ? Array.from(r.values()).sort((e, t) =>
                    e.end === t.end ? e.index - t.index : e.end - t.end
                  )[0]
                : void 0
            }),
            (this.getMeasurementOptions = $r(
              () => [
                this.options.count,
                this.options.paddingStart,
                this.options.scrollMargin,
                this.options.getItemKey,
                this.options.enabled,
                this.options.lanes,
                this.options.laneAssignmentMode,
              ],
              (e, t, n, r, i, a, o) => (
                this.prevLanes !== void 0 && this.prevLanes !== a && (this.lanesChangedFlag = !0),
                (this.prevLanes = a),
                (this.pendingMin = null),
                {
                  count: e,
                  paddingStart: t,
                  scrollMargin: n,
                  getItemKey: r,
                  enabled: i,
                  lanes: a,
                  laneAssignmentMode: o,
                }
              ),
              { key: !1 }
            )),
            (this.getMeasurements = $r(
              () => [this.getMeasurementOptions(), this.itemSizeCacheVersion],
              (
                {
                  count: e,
                  paddingStart: t,
                  scrollMargin: n,
                  getItemKey: r,
                  enabled: i,
                  lanes: a,
                  laneAssignmentMode: o,
                },
                s
              ) => {
                let c = this.itemSizeCache
                if (!i)
                  return (
                    (this.measurementsCache = []),
                    this.itemSizeCache.clear(),
                    this.laneAssignments.clear(),
                    []
                  )
                if (this.laneAssignments.size > e)
                  for (let t of this.laneAssignments.keys())
                    t >= e && this.laneAssignments.delete(t)
                ;(this.lanesChangedFlag &&
                  ((this.lanesChangedFlag = !1),
                  (this.lanesSettling = !0),
                  (this.measurementsCache = []),
                  this.itemSizeCache.clear(),
                  this.laneAssignments.clear(),
                  (this.pendingMin = null)),
                  this.measurementsCache.length === 0 &&
                    !this.lanesSettling &&
                    ((this.measurementsCache = this.options.initialMeasurementsCache),
                    this.measurementsCache.forEach((e) => {
                      this.itemSizeCache.set(e.key, e.size)
                    })))
                let l = this.lanesSettling ? 0 : (this.pendingMin ?? 0)
                if (
                  ((this.pendingMin = null),
                  this.lanesSettling &&
                    this.measurementsCache.length === e &&
                    (this.lanesSettling = !1),
                  a === 1)
                ) {
                  let i = this.options.gap,
                    a = e * 2,
                    o = this._flatMeasurements
                  if (!o || o.length < a) {
                    let e = new Float64Array(a)
                    ;(o && l > 0 && e.set(o.subarray(0, l * 2)),
                      (o = e),
                      (this._flatMeasurements = o))
                  }
                  let s
                  if (l === 0) s = t + n
                  else {
                    let e = l - 1
                    s = o[e * 2] + o[e * 2 + 1] + i
                  }
                  for (let t = l; t < e; t++) {
                    let e = r(t),
                      n = c.get(e),
                      a = typeof n == `number` ? n : this.options.estimateSize(t)
                    ;((o[t * 2] = s), (o[t * 2 + 1] = a), (s += a + i))
                  }
                  let u = Zr(e, o, r)
                  return ((this.measurementsCache = u), u)
                }
                let u = this.measurementsCache.slice(0, l),
                  d = Array(a).fill(void 0)
                for (let e = 0; e < l; e++) {
                  let t = u[e]
                  t && (d[t.lane] = e)
                }
                for (let i = l; i < e; i++) {
                  let e = r(i),
                    a = this.laneAssignments.get(i),
                    s,
                    l,
                    f = o === `estimate` || c.has(e)
                  if (a !== void 0 && this.options.lanes > 1) {
                    s = a
                    let e = d[s],
                      r = e === void 0 ? void 0 : u[e]
                    l = r ? r.end + this.options.gap : t + n
                  } else {
                    let e = this.options.lanes === 1 ? u[i - 1] : this.getFurthestMeasurement(u, i)
                    ;((l = e ? e.end + this.options.gap : t + n),
                      (s = e ? e.lane : i % this.options.lanes),
                      this.options.lanes > 1 && f && this.laneAssignments.set(i, s))
                  }
                  let p = c.get(e),
                    m = typeof p == `number` ? p : this.options.estimateSize(i),
                    h = l + m
                  ;((u[i] = { index: i, start: l, size: m, end: h, key: e, lane: s }), (d[s] = i))
                }
                return ((this.measurementsCache = u), u)
              },
              { key: !1, debug: () => this.options.debug }
            )),
            (this.calculateRange = $r(
              () => [
                this.getMeasurements(),
                this.getSize(),
                this.getScrollOffset(),
                this.options.lanes,
              ],
              (e, t, n, r) =>
                (this.range =
                  e.length > 0 && t > 0
                    ? ii({
                        measurements: e,
                        outerSize: t,
                        scrollOffset: n,
                        lanes: r,
                        flat:
                          r === 1 && this._flatMeasurements != null ? this._flatMeasurements : null,
                      })
                    : null),
              { key: !1, debug: () => this.options.debug }
            )),
            (this.getVirtualIndexes = $r(
              () => {
                let e = null,
                  t = null,
                  n = this.calculateRange()
                return (
                  n && ((e = n.startIndex), (t = n.endIndex)),
                  this.maybeNotify.updateDeps([this.isScrolling, e, t]),
                  [this.options.rangeExtractor, this.options.overscan, this.options.count, e, t]
                )
              },
              (e, t, n, r, i) =>
                r === null || i === null
                  ? []
                  : e({ startIndex: r, endIndex: i, overscan: t, count: n }),
              { key: !1, debug: () => this.options.debug }
            )),
            (this.indexFromElement = (e) => {
              let t = this.options.indexAttribute,
                n = e.getAttribute(t)
              return n
                ? parseInt(n, 10)
                : (console.warn(`Missing attribute name '${t}={index}' on measured element.`), -1)
            }),
            (this.shouldMeasureDuringScroll = (e) => {
              if (!this.scrollState || this.scrollState.behavior !== `smooth`) return !0
              let t =
                this.scrollState.index ??
                this.getVirtualItemForOffset(this.scrollState.lastTargetOffset)?.index
              if (t !== void 0 && this.range) {
                let n = Math.max(
                    this.options.overscan,
                    Math.ceil((this.range.endIndex - this.range.startIndex) / 2)
                  ),
                  r = Math.max(0, t - n),
                  i = Math.min(this.options.count - 1, t + n)
                return e >= r && e <= i
              }
              return !0
            }),
            (this.measureElement = (e) => {
              if (!e) {
                this.elementsCache.forEach((e, t) => {
                  e.isConnected || (this.observer.unobserve(e), this.elementsCache.delete(t))
                })
                return
              }
              let t = this.indexFromElement(e),
                n = this.options.getItemKey(t),
                r = this.elementsCache.get(n)
              ;(r !== e &&
                (r && this.observer.unobserve(r),
                this.observer.observe(e),
                this.elementsCache.set(n, e)),
                (!this.isScrolling || this.scrollState) &&
                  this.shouldMeasureDuringScroll(t) &&
                  this.resizeItem(t, this.options.measureElement(e, void 0, this)))
            }),
            (this.resizeItem = (e, t) => {
              if (e < 0 || e >= this.options.count) return
              let n,
                r,
                i,
                a = this._flatMeasurements
              if (this.options.lanes === 1 && a !== null)
                ((i = this.options.getItemKey(e)), (r = a[e * 2]), (n = a[e * 2 + 1]))
              else {
                let t = this.measurementsCache[e]
                if (!t) return
                ;((i = t.key), (r = t.start), (n = t.size))
              }
              let o = t - (this.itemSizeCache.get(i) ?? n)
              if (o !== 0) {
                let a =
                    this.options.anchorTo === `end` &&
                    this.scrollState?.behavior !== `smooth` &&
                    this.getVirtualDistanceFromEnd() <= this.options.scrollEndThreshold,
                  s = a ? this.getTotalSize() : 0,
                  c =
                    this.scrollState?.behavior !== `smooth` &&
                    (this.shouldAdjustScrollPositionOnItemSizeChange === void 0
                      ? r < this.getScrollOffset() + this.scrollAdjustments &&
                        this.scrollDirection !== `backward`
                      : this.shouldAdjustScrollPositionOnItemSizeChange(
                          this.measurementsCache[e] ?? {
                            index: e,
                            key: i,
                            start: r,
                            size: n,
                            end: r + n,
                            lane: 0,
                          },
                          o,
                          this
                        ))
                ;((this.pendingMin === null || e < this.pendingMin) && (this.pendingMin = e),
                  this.itemSizeCache.set(i, t),
                  this.itemSizeCacheVersion++,
                  a
                    ? this.applyScrollAdjustment(this.getTotalSize() - s)
                    : c && this.applyScrollAdjustment(o),
                  this.notify(!1))
              }
            }),
            (this.getVirtualItems = $r(
              () => [this.getVirtualIndexes(), this.getMeasurements()],
              (e, t) => {
                let n = []
                for (let r = 0, i = e.length; r < i; r++) {
                  let i = t[e[r]]
                  n.push(i)
                }
                return n
              },
              { key: !1, debug: () => this.options.debug }
            )),
            (this.getVirtualItemForOffset = (e) => {
              let t = this.getMeasurements()
              if (t.length === 0) return
              let n = this._flatMeasurements,
                r = this.options.lanes === 1 && n != null
              return ei(t[yi(0, t.length - 1, r ? (e) => n[e * 2] : (e) => ei(t[e]).start, e)])
            }),
            (this.getMaxScrollOffset = () => {
              if (!this.scrollElement) return 0
              if (`scrollHeight` in this.scrollElement)
                return this.options.horizontal
                  ? this.scrollElement.scrollWidth - this.scrollElement.clientWidth
                  : this.scrollElement.scrollHeight - this.scrollElement.clientHeight
              {
                let e = this.scrollElement.document.documentElement
                return this.options.horizontal
                  ? e.scrollWidth - this.scrollElement.innerWidth
                  : e.scrollHeight - this.scrollElement.innerHeight
              }
            }),
            (this.getVirtualDistanceFromEnd = () =>
              Math.max(this.getTotalSize() - this.getSize() - this.getScrollOffset(), 0)),
            (this.getDistanceFromEnd = () =>
              Math.max(this.getMaxScrollOffset() - this.getScrollOffset(), 0)),
            (this.isAtEnd = (e = this.options.scrollEndThreshold) =>
              this.getDistanceFromEnd() <= e),
            (this.getOffsetForAlignment = (e, t, n = 0) => {
              if (!this.scrollElement) return 0
              let r = this.getSize(),
                i = this.getScrollOffset()
              ;(t === `auto` && (t = e >= i + r ? `end` : `start`),
                t === `center` ? (e += (n - r) / 2) : t === `end` && (e -= r))
              let a = this.getMaxScrollOffset()
              return Math.max(Math.min(a, e), 0)
            }),
            (this.getOffsetForIndex = (e, t = `auto`) => {
              e = Math.max(0, Math.min(e, this.options.count - 1))
              let n = this.getSize(),
                r = this.getScrollOffset(),
                i = this.measurementsCache[e]
              if (!i) return
              if (t === `auto`)
                if (i.end >= r + n - this.options.scrollPaddingEnd) t = `end`
                else if (i.start <= r + this.options.scrollPaddingStart) t = `start`
                else return [r, t]
              if (t === `end` && e === this.options.count - 1) return [this.getMaxScrollOffset(), t]
              let a =
                t === `end`
                  ? i.end + this.options.scrollPaddingEnd
                  : i.start - this.options.scrollPaddingStart
              return [this.getOffsetForAlignment(a, t, i.size), t]
            }),
            (this.scrollToOffset = (e, { align: t = `start`, behavior: n = `auto` } = {}) => {
              let r = this.getOffsetForAlignment(e, t),
                i = this.now()
              ;((this.scrollState = {
                index: null,
                align: t,
                behavior: n,
                startedAt: i,
                lastTargetOffset: r,
                stableFrames: 0,
              }),
                this._scrollToOffset(r, { adjustments: void 0, behavior: n }),
                this.scheduleScrollReconcile())
            }),
            (this.scrollToIndex = (e, { align: t = `auto`, behavior: n = `auto` } = {}) => {
              e = Math.max(0, Math.min(e, this.options.count - 1))
              let r = this.getOffsetForIndex(e, t)
              if (!r) return
              let [i, a] = r,
                o = this.now()
              ;((this.scrollState = {
                index: e,
                align: a,
                behavior: n,
                startedAt: o,
                lastTargetOffset: i,
                stableFrames: 0,
              }),
                this._scrollToOffset(i, { adjustments: void 0, behavior: n }),
                this.scheduleScrollReconcile())
            }),
            (this.scrollBy = (e, { behavior: t = `auto` } = {}) => {
              let n = this.getScrollOffset() + e,
                r = this.now()
              ;((this.scrollState = {
                index: null,
                align: `start`,
                behavior: t,
                startedAt: r,
                lastTargetOffset: n,
                stableFrames: 0,
              }),
                this._scrollToOffset(n, { adjustments: void 0, behavior: t }),
                this.scheduleScrollReconcile())
            }),
            (this.scrollToEnd = ({ behavior: e = `auto` } = {}) => {
              if (this.options.count > 0) {
                this.scrollToIndex(this.options.count - 1, { align: `end`, behavior: e })
                return
              }
              this.scrollToOffset(Math.max(this.getTotalSize() - this.getSize(), 0), {
                behavior: e,
              })
            }),
            (this.getTotalSize = () => {
              let e = this.getMeasurements(),
                t
              if (e.length === 0) t = this.options.paddingStart
              else if (this.options.lanes === 1) {
                let n = e.length - 1,
                  r = this._flatMeasurements
                t = r == null ? (e[n]?.end ?? 0) : r[n * 2] + r[n * 2 + 1]
              } else {
                let n = Array(this.options.lanes).fill(null),
                  r = e.length - 1
                for (; r >= 0 && n.some((e) => e === null); ) {
                  let t = e[r]
                  ;(n[t.lane] === null && (n[t.lane] = t.end), r--)
                }
                t = Math.max(...n.filter((e) => e !== null))
              }
              return Math.max(t - this.options.scrollMargin + this.options.paddingEnd, 0)
            }),
            (this.takeSnapshot = () => {
              let e = []
              if (this.itemSizeCache.size === 0) return e
              let t = this.getMeasurements()
              for (let n of t)
                n &&
                  this.itemSizeCache.has(n.key) &&
                  e.push({
                    index: n.index,
                    key: n.key,
                    start: n.start,
                    size: n.size,
                    end: n.end,
                    lane: n.lane,
                  })
              return e
            }),
            (this._scrollToOffset = (e, { adjustments: t, behavior: n }) => {
              ;((this._intendedScrollOffset = e + (t ?? 0)),
                this.options.scrollToFn(e, { behavior: n, adjustments: t }, this))
            }),
            (this.measure = () => {
              ;((this.pendingMin = null),
                this.itemSizeCache.clear(),
                this.laneAssignments.clear(),
                this.itemSizeCacheVersion++,
                this.notify(!1))
            }),
            this.setOptions(e))
        }
        applyScrollAdjustment(e, t) {
          e !== 0 &&
            (oi() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded)
              ? (this._iosDeferredAdjustment += e)
              : this._scrollToOffset(this.getScrollOffset(), {
                  adjustments: (this.scrollAdjustments += e),
                  behavior: t,
                }))
        }
        scheduleScrollReconcile() {
          if (!this.targetWindow) {
            this.scrollState = null
            return
          }
          this.rafId ??= this.targetWindow.requestAnimationFrame(() => {
            ;((this.rafId = null), this.reconcileScroll())
          })
        }
        reconcileScroll() {
          if (!this.scrollState || !this.scrollElement) return
          if (this.now() - this.scrollState.startedAt > 5e3) {
            this.scrollState = null
            return
          }
          let e =
              this.scrollState.index == null
                ? void 0
                : this.getOffsetForIndex(this.scrollState.index, this.scrollState.align),
            t = e ? e[0] : this.scrollState.lastTargetOffset,
            n = t !== this.scrollState.lastTargetOffset
          if (!n && ti(t, this.getScrollOffset())) {
            if ((this.scrollState.stableFrames++, this.scrollState.stableFrames >= 1)) {
              ;(this.getScrollOffset() !== t &&
                this._scrollToOffset(t, { adjustments: void 0, behavior: `auto` }),
                (this.scrollState = null))
              return
            }
          } else if (((this.scrollState.stableFrames = 0), n)) {
            let e = this.getSize() || 600,
              n = Math.abs(t - this.getScrollOffset()),
              r = this.scrollState.behavior === `smooth` && n > e
            ;((this.scrollState.lastTargetOffset = t),
              r || (this.scrollState.behavior = `auto`),
              this._scrollToOffset(t, { adjustments: void 0, behavior: r ? `smooth` : `auto` }))
          }
          this.scheduleScrollReconcile()
        }
      }),
      (yi = (e, t, n, r) => {
        for (; e <= t; ) {
          let i = ((e + t) / 2) | 0,
            a = n(i)
          if (a < r) e = i + 1
          else if (a > r) t = i - 1
          else return i
        }
        return e > 0 ? e - 1 : 0
      }))
  })
function xi({
  useFlushSync: e = !0,
  directDomUpdates: t = !1,
  directDomUpdatesMode: n = `transform`,
  ...r
}) {
  let i = Ci.useReducer((e) => e + 1, 0)[1],
    a = Ci.useRef({
      enabled: t,
      mode: n,
      container: null,
      lastSize: null,
      lastPositions: new WeakMap(),
      prevRange: null,
    })
  ;((a.current.enabled = t), (a.current.mode = n))
  let o = (e) => {
      let t = a.current
      if (!t.enabled) return
      let n = e.getTotalSize()
      if (t.container && n !== t.lastSize) {
        t.lastSize = n
        let r = e.options.horizontal ? `width` : `height`
        t.container.style[r] = `${n}px`
      }
      let r = !!e.options.horizontal,
        i = t.mode === `transform`,
        o = r ? `left` : `top`,
        s = e.options.scrollMargin,
        c = e.getVirtualItems()
      for (let n of c) {
        let a = n.start - s,
          c = e.elementsCache.get(n.key)
        c &&
          t.lastPositions.get(c) !== a &&
          (t.lastPositions.set(c, a),
          i
            ? (c.style.transform = r ? `translate3d(${a}px, 0, 0)` : `translate3d(0, ${a}px, 0)`)
            : (c.style[o] = `${a}px`))
      }
    },
    s = {
      ...r,
      onChange: (t, n) => {
        var s
        let c = a.current,
          l = !0
        if (c.enabled) {
          o(t)
          let e = t.range,
            n = c.prevRange
          ;((l =
            !n ||
            n.isScrolling !== t.isScrolling ||
            n.startIndex !== e?.startIndex ||
            n.endIndex !== e?.endIndex),
            l &&
              (c.prevRange = e
                ? { startIndex: e.startIndex, endIndex: e.endIndex, isScrolling: t.isScrolling }
                : null))
        }
        ;(l && (e && n ? (0, wi.flushSync)(i) : i()), (s = r.onChange) == null || s.call(r, t, n))
      },
    },
    [c] = Ci.useState(() => {
      let e = new vi(s)
      return Object.assign(e, {
        containerRef: (t) => {
          let n = a.current
          if (((n.container = t), (n.lastSize = null), t && n.enabled)) {
            let r = e.getTotalSize()
            n.lastSize = r
            let i = e.options.horizontal ? `width` : `height`
            t.style[i] = `${r}px`
          }
        },
      })
    })
  return (
    c.setOptions(s),
    Ti(() => c._didMount(), []),
    Ti(() => c._willUpdate()),
    Ti(() => {
      o(c)
    }),
    c
  )
}
function Si(e) {
  return xi({ observeElementRect: ui, observeElementOffset: mi, scrollToFn: _i, ...e })
}
var Ci,
  wi,
  Ti,
  Ei = t(() => {
    ;((Ci = e(r(), 1)),
      (wi = e(a(), 1)),
      bi(),
      bi(),
      (Ti = typeof document < `u` ? Ci.useLayoutEffect : Ci.useEffect))
  })
function Di(e, t) {
  return e !== null &&
    t !== null &&
    typeof e == `object` &&
    typeof t == `object` &&
    `id` in e &&
    `id` in t
    ? e.id === t.id
    : e === t
}
function Oi(e = Di) {
  return (0, ki.useCallback)(
    (t, n) => {
      if (typeof e == `string`) {
        let r = e
        return t?.[r] === n?.[r]
      }
      return e(t, n)
    },
    [e]
  )
}
var ki,
  Ai = t(() => {
    ki = e(r(), 1)
  })
function ji(e) {
  if (e === null) return { width: 0, height: 0 }
  let { width: t, height: n } = e.getBoundingClientRect()
  return { width: t, height: n }
}
function Mi(e, t, n = !1) {
  let [r, i] = (0, Ni.useState)(() => ji(t))
  return (
    M(() => {
      if (!t || !e) return
      let n = Dt()
      return (
        n.requestAnimationFrame(function e() {
          ;(n.requestAnimationFrame(e),
            i((e) => {
              let n = ji(t)
              return n.width === e.width && n.height === e.height ? e : n
            }))
        }),
        () => {
          n.dispose()
        }
      )
    }, [t, e]),
    n ? { width: `${r.width}px`, height: `${r.height}px` } : r
  )
}
var Ni,
  Pi = t(() => {
    ;((Ni = e(r(), 1)), Ot(), Nt())
  }),
  Fi,
  Ii = t(() => {
    Fi = ((e) => ((e[(e.Left = 0)] = `Left`), (e[(e.Right = 2)] = `Right`), e))(Fi || {})
  })
function Li(e) {
  let t = (0, Ri.useRef)(null)
  return {
    onPointerDown: N((n) => {
      ;((t.current = n.pointerType),
        !dr(n.currentTarget) &&
          n.pointerType === `mouse` &&
          n.button === Fi.Left &&
          (n.preventDefault(), e(n)))
    }),
    onClick: N((n) => {
      t.current !== `mouse` && (dr(n.currentTarget) || e(n))
    }),
  }
}
var Ri,
  zi = t(() => {
    ;((Ri = e(r(), 1)), Ii(), pr(), P())
  }),
  Bi,
  Vi = t(() => {
    Bi = class extends Map {
      constructor(e) {
        ;(super(), (this.factory = e))
      }
      get(e) {
        let t = super.get(e)
        return (t === void 0 && ((t = this.factory(e)), this.set(e, t)), t)
      }
    }
  })
function Hi(e, t) {
  return Object.is(e, t)
    ? !0
    : typeof e != `object` || !e || typeof t != `object` || !t
      ? !1
      : Array.isArray(e) && Array.isArray(t)
        ? e.length === t.length
          ? Ui(e[Symbol.iterator](), t[Symbol.iterator]())
          : !1
        : (e instanceof Map && t instanceof Map) || (e instanceof Set && t instanceof Set)
          ? e.size === t.size
            ? Ui(e.entries(), t.entries())
            : !1
          : Wi(e) && Wi(t)
            ? Ui(Object.entries(e)[Symbol.iterator](), Object.entries(t)[Symbol.iterator]())
            : !1
}
function Ui(e, t) {
  do {
    let n = e.next(),
      r = t.next()
    if (n.done && r.done) return !0
    if (n.done || r.done || !Object.is(n.value, r.value)) return !1
  } while (!0)
}
function Wi(e) {
  if (Object.prototype.toString.call(e) !== `[object Object]`) return !1
  let t = Object.getPrototypeOf(e)
  return t === null || Object.getPrototypeOf(t) === null
}
function Gi(e) {
  let [t, n] = e(),
    r = Dt()
  return (...e) => {
    ;(t(...e), r.dispose(), r.microTask(n))
  }
}
var Ki,
  qi,
  Ji,
  Yi,
  Xi,
  Zi,
  Qi,
  $i,
  ea,
  ta,
  na,
  ra = t(() => {
    ;(Vi(),
      Ot(),
      yt(),
      (Ki = Object.defineProperty),
      (qi = (e, t, n) =>
        t in e
          ? Ki(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
          : (e[t] = n)),
      (Ji = (e, t, n) => (qi(e, typeof t == `symbol` ? t : t + ``, n), n)),
      (Yi = (e, t, n) => {
        if (!t.has(e)) throw TypeError(`Cannot ` + n)
      }),
      (Xi = (e, t, n) => (Yi(e, t, `read from private field`), n ? n.call(e) : t.get(e))),
      (Zi = (e, t, n) => {
        if (t.has(e)) throw TypeError(`Cannot add the same private member more than once`)
        t instanceof WeakSet ? t.add(e) : t.set(e, n)
      }),
      (Qi = (e, t, n, r) => (
        Yi(e, t, `write to private field`),
        r ? r.call(e, n) : t.set(e, n),
        n
      )),
      (na = class {
        constructor(e) {
          ;(Zi(this, $i, {}),
            Zi(this, ea, new Bi(() => new Set())),
            Zi(this, ta, new Set()),
            Ji(this, `disposables`, Dt()),
            Qi(this, $i, e),
            vt.isServer &&
              this.disposables.microTask(() => {
                this.dispose()
              }))
        }
        dispose() {
          this.disposables.dispose()
        }
        get state() {
          return Xi(this, $i)
        }
        subscribe(e, t) {
          if (vt.isServer) return () => {}
          let n = { selector: e, callback: t, current: e(Xi(this, $i)) }
          return (
            Xi(this, ta).add(n),
            this.disposables.add(() => {
              Xi(this, ta).delete(n)
            })
          )
        }
        on(e, t) {
          return vt.isServer
            ? () => {}
            : (Xi(this, ea).get(e).add(t),
              this.disposables.add(() => {
                Xi(this, ea).get(e).delete(t)
              }))
        }
        send(e) {
          let t = this.reduce(Xi(this, $i), e)
          if (t !== Xi(this, $i)) {
            Qi(this, $i, t)
            for (let e of Xi(this, ta)) {
              let t = e.selector(Xi(this, $i))
              Hi(e.current, t) || ((e.current = t), e.callback(t))
            }
            for (let t of Xi(this, ea).get(e.type)) t(Xi(this, $i), e)
          }
        }
      }),
      ($i = new WeakMap()),
      (ea = new WeakMap()),
      (ta = new WeakMap()))
  }),
  ia,
  aa,
  oa,
  sa,
  ca,
  la,
  ua,
  da = t(() => {
    ;(ra(),
      Vi(),
      Qt(),
      (ia = Object.defineProperty),
      (aa = (e, t, n) =>
        t in e
          ? ia(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
          : (e[t] = n)),
      (oa = (e, t, n) => (aa(e, typeof t == `symbol` ? t : t + ``, n), n)),
      (sa = ((e) => ((e[(e.Push = 0)] = `Push`), (e[(e.Pop = 1)] = `Pop`), e))(sa || {})),
      (ca = {
        0(e, t) {
          let n = t.id,
            r = e.stack,
            i = e.stack.indexOf(n)
          if (i !== -1) {
            let t = e.stack.slice()
            return (t.splice(i, 1), t.push(n), (r = t), { ...e, stack: r })
          }
          return { ...e, stack: [...e.stack, n] }
        },
        1(e, t) {
          let n = t.id,
            r = e.stack.indexOf(n)
          if (r === -1) return e
          let i = e.stack.slice()
          return (i.splice(r, 1), { ...e, stack: i })
        },
      }),
      (la = class e extends na {
        constructor() {
          ;(super(...arguments),
            oa(this, `actions`, {
              push: (e) => this.send({ type: 0, id: e }),
              pop: (e) => this.send({ type: 1, id: e }),
            }),
            oa(this, `selectors`, {
              isTop: (e, t) => e.stack[e.stack.length - 1] === t,
              inStack: (e, t) => e.stack.includes(t),
            }))
        }
        static new() {
          return new e({ stack: [] })
        }
        reduce(e, t) {
          return I(t.type, ca, e, t)
        }
      }),
      (ua = new Bi(() => la.new())))
  }),
  fa = n((e) => {
    var t = r()
    function n(e, t) {
      return (e === t && (e !== 0 || 1 / e == 1 / t)) || (e !== e && t !== t)
    }
    var i = typeof Object.is == `function` ? Object.is : n,
      a = t.useSyncExternalStore,
      o = t.useRef,
      s = t.useEffect,
      c = t.useMemo,
      l = t.useDebugValue
    e.useSyncExternalStoreWithSelector = function (e, t, n, r, u) {
      var d = o(null)
      if (d.current === null) {
        var f = { hasValue: !1, value: null }
        d.current = f
      } else f = d.current
      d = c(
        function () {
          function e(e) {
            if (!a) {
              if (((a = !0), (o = e), (e = r(e)), u !== void 0 && f.hasValue)) {
                var t = f.value
                if (u(t, e)) return (s = t)
              }
              return (s = e)
            }
            if (((t = s), i(o, e))) return t
            var n = r(e)
            return u !== void 0 && u(t, n) ? ((o = e), t) : ((o = e), (s = n))
          }
          var a = !1,
            o,
            s,
            c = n === void 0 ? null : n
          return [
            function () {
              return e(t())
            },
            c === null
              ? void 0
              : function () {
                  return e(c())
                },
          ]
        },
        [t, n, r, u]
      )
      var p = a(e, d[0], d[1])
      return (
        s(
          function () {
            ;((f.hasValue = !0), (f.value = p))
          },
          [p]
        ),
        l(p),
        p
      )
    }
  }),
  pa = n((e, t) => {
    t.exports = fa()
  })
function H(e, t, n = Hi) {
  return (0, ha.useSyncExternalStoreWithSelector)(
    N((t) => e.subscribe(ma, t)),
    N(() => e.state),
    N(() => e.state),
    N(t),
    n
  )
}
function ma(e) {
  return e
}
var ha,
  ga = t(() => {
    ;((ha = pa()), P(), ra())
  })
function _a(e, t) {
  let n = (0, va.useId)(),
    r = ua.get(t),
    [i, a] = H(
      r,
      (0, va.useCallback)((e) => [r.selectors.isTop(e, n), r.selectors.inStack(e, n)], [r, n])
    )
  return (
    M(() => {
      if (e) return (r.actions.push(n), () => r.actions.pop(n))
    }, [r, e, n]),
    e ? (a ? i : !0) : !1
  )
}
var va,
  ya = t(() => {
    ;((va = e(r(), 1)), da(), ga(), Nt())
  })
function ba(e) {
  let t = wa.get(e) ?? 0
  return (
    wa.set(e, t + 1),
    t === 0
      ? (Ca.set(e, { 'aria-hidden': e.getAttribute(`aria-hidden`), inert: e.inert }),
        e.setAttribute(`aria-hidden`, `true`),
        (e.inert = !0),
        () => xa(e))
      : () => xa(e)
  )
}
function xa(e) {
  let t = wa.get(e) ?? 1
  if ((t === 1 ? wa.delete(e) : wa.set(e, t - 1), t !== 1)) return
  let n = Ca.get(e)
  n &&
    (n[`aria-hidden`] === null
      ? e.removeAttribute(`aria-hidden`)
      : e.setAttribute(`aria-hidden`, n[`aria-hidden`]),
    (e.inert = n.inert),
    Ca.delete(e))
}
function Sa(e, { allowed: t, disallowed: n } = {}) {
  let r = _a(e, `inert-others`)
  M(() => {
    if (!r) return
    let e = Dt()
    for (let t of n?.() ?? []) t && e.add(ba(t))
    let i = t?.() ?? []
    for (let t of i) {
      if (!t) continue
      let n = bt(t)
      if (!n) continue
      let r = t.parentElement
      for (; r && r !== n.body; ) {
        for (let t of r.children) i.some((e) => t.contains(e)) || e.add(ba(t))
        r = r.parentElement
      }
    }
    return e.dispose
  }, [r, t, n])
}
var Ca,
  wa,
  Ta = t(() => {
    ;(Ot(), wt(), ya(), Nt(), (Ca = new Map()), (wa = new Map()))
  })
function Ea(e, t, n) {
  let r = Pt((e) => {
    let t = e.getBoundingClientRect()
    t.x === 0 && t.y === 0 && t.width === 0 && t.height === 0 && n()
  })
  ;(0, Da.useEffect)(() => {
    if (!e) return
    let n = t === null ? null : tr(t) ? t : t.current
    if (!n) return
    let i = Dt()
    if (typeof ResizeObserver < `u`) {
      let e = new ResizeObserver(() => r.current(n))
      ;(e.observe(n), i.add(() => e.disconnect()))
    }
    if (typeof IntersectionObserver < `u`) {
      let e = new IntersectionObserver(() => r.current(n))
      ;(e.observe(n), i.add(() => e.disconnect()))
    }
    return () => i.dispose()
  }, [t, r, e])
}
var Da,
  Oa = t(() => {
    ;((Da = e(r(), 1)), Ot(), ur(), It())
  })
function ka(e = document.body) {
  return e == null
    ? []
    : Array.from(e.querySelectorAll(Ra)).sort((e, t) =>
        Math.sign((e.tabIndex || 2 ** 53 - 1) - (t.tabIndex || 2 ** 53 - 1))
      )
}
function Aa(e = document.body) {
  return e == null
    ? []
    : Array.from(e.querySelectorAll(za)).sort((e, t) =>
        Math.sign((e.tabIndex || 2 ** 53 - 1) - (t.tabIndex || 2 ** 53 - 1))
      )
}
function ja(e, t = 0) {
  return e === bt(e)?.body
    ? !1
    : I(t, {
        0() {
          return e.matches(Ra)
        },
        1() {
          let t = e
          for (; t !== null; ) {
            if (t.matches(Ra)) return !0
            t = t.parentElement
          }
          return !1
        },
      })
}
function Ma(e) {
  Dt().nextFrame(() => {
    let t = St(e)
    t && nr(t) && !ja(t, 0) && Na(e)
  })
}
function Na(e) {
  e?.focus({ preventScroll: !0 })
}
function Pa(e) {
  return e?.matches?.call(e, Wa) ?? !1
}
function Fa(e, t = (e) => e) {
  return e.slice().sort((e, n) => {
    let r = t(e),
      i = t(n)
    if (r === null || i === null) return 0
    let a = r.compareDocumentPosition(i)
    return a & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : a & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0
  })
}
function Ia(e, t, n = e === null ? document.body : xt(e)) {
  return La(ka(n), t, { relativeTo: e })
}
function La(e, t, { sorted: n = !0, relativeTo: r = null, skipElements: i = [] } = {}) {
  let a = Array.isArray(e) ? (e.length > 0 ? xt(e[0]) : document) : xt(e),
    o = Array.isArray(e) ? (n ? Fa(e) : e) : t & 64 ? Aa(e) : ka(e)
  ;(i.length > 0 &&
    o.length > 1 &&
    (o = o.filter(
      (e) => !i.some((t) => (t != null && `current` in t ? t?.current === e : t === e))
    )),
    (r ??= a?.activeElement))
  let s = (() => {
      if (t & 5) return 1
      if (t & 10) return -1
      throw Error(`Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last`)
    })(),
    c = (() => {
      if (t & 1) return 0
      if (t & 2) return Math.max(0, o.indexOf(r)) - 1
      if (t & 4) return Math.max(0, o.indexOf(r)) + 1
      if (t & 8) return o.length - 1
      throw Error(`Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last`)
    })(),
    l = t & 32 ? { preventScroll: !0 } : {},
    u = 0,
    d = o.length,
    f
  do {
    if (u >= d || u + d <= 0) return 0
    let e = c + u
    if (t & 16) e = (e + d) % d
    else {
      if (e < 0) return 3
      if (e >= d) return 1
    }
    ;((f = o[e]), f?.focus(l), (u += s))
  } while (f !== St(f))
  return (t & 6 && Pa(f) && f.select(), 2)
}
var Ra,
  za,
  U,
  Ba,
  Va,
  Ha,
  Ua,
  Wa,
  Ga = t(() => {
    ;(Ot(),
      ur(),
      Qt(),
      wt(),
      (Ra = [
        `[contentEditable=true]`,
        `[tabindex]`,
        `a[href]`,
        `area[href]`,
        `button:not([disabled])`,
        `iframe`,
        `input:not([disabled])`,
        `select:not([disabled])`,
        `details>summary`,
        `textarea:not([disabled])`,
      ]
        .map((e) => `${e}:not([tabindex='-1'])`)
        .join(`,`)),
      (za = [`[data-autofocus]`].map((e) => `${e}:not([tabindex='-1'])`).join(`,`)),
      (U = ((e) => (
        (e[(e.First = 1)] = `First`),
        (e[(e.Previous = 2)] = `Previous`),
        (e[(e.Next = 4)] = `Next`),
        (e[(e.Last = 8)] = `Last`),
        (e[(e.WrapAround = 16)] = `WrapAround`),
        (e[(e.NoScroll = 32)] = `NoScroll`),
        (e[(e.AutoFocus = 64)] = `AutoFocus`),
        e
      ))(U || {})),
      (Ba = ((e) => (
        (e[(e.Error = 0)] = `Error`),
        (e[(e.Overflow = 1)] = `Overflow`),
        (e[(e.Success = 2)] = `Success`),
        (e[(e.Underflow = 3)] = `Underflow`),
        e
      ))(Ba || {})),
      (Va = ((e) => ((e[(e.Previous = -1)] = `Previous`), (e[(e.Next = 1)] = `Next`), e))(
        Va || {}
      )),
      (Ha = ((e) => ((e[(e.Strict = 0)] = `Strict`), (e[(e.Loose = 1)] = `Loose`), e))(Ha || {})),
      (Ua = ((e) => ((e[(e.Keyboard = 0)] = `Keyboard`), (e[(e.Mouse = 1)] = `Mouse`), e))(
        Ua || {}
      )),
      typeof window < `u` &&
        typeof document < `u` &&
        (document.addEventListener(
          `keydown`,
          (e) => {
            e.metaKey ||
              e.altKey ||
              e.ctrlKey ||
              (document.documentElement.dataset.headlessuiFocusVisible = ``)
          },
          !0
        ),
        document.addEventListener(
          `click`,
          (e) => {
            e.detail === 1
              ? delete document.documentElement.dataset.headlessuiFocusVisible
              : e.detail === 0 && (document.documentElement.dataset.headlessuiFocusVisible = ``)
          },
          !0
        )),
      (Wa = [`textarea`, `input`].join(`,`)))
  })
function Ka() {
  return (
    /iPhone/gi.test(window.navigator.platform) ||
    (/Mac/gi.test(window.navigator.platform) && window.navigator.maxTouchPoints > 0)
  )
}
function qa() {
  return /Android/gi.test(window.navigator.userAgent)
}
function Ja() {
  return Ka() || qa()
}
var Ya = t(() => {})
function Xa(e, t, n, r) {
  let i = Pt(n)
  ;(0, Za.useEffect)(() => {
    if (!e) return
    function n(e) {
      i.current(e)
    }
    return (document.addEventListener(t, n, r), () => document.removeEventListener(t, n, r))
  }, [e, t, r])
}
var Za,
  Qa = t(() => {
    ;((Za = e(r(), 1)), It())
  })
function $a(e, t, n, r) {
  let i = Pt(n)
  ;(0, eo.useEffect)(() => {
    if (!e) return
    function n(e) {
      i.current(e)
    }
    return (window.addEventListener(t, n, r), () => window.removeEventListener(t, n, r))
  }, [e, t, r])
}
var eo,
  to = t(() => {
    ;((eo = e(r(), 1)), It())
  })
function no(e, t, n) {
  let r = Pt(n),
    i = (0, ro.useCallback)(
      function (e, n) {
        if (e.defaultPrevented) return
        let i = n(e)
        if (i === null || !i.getRootNode().contains(i) || !i.isConnected) return
        let a = (function e(t) {
          return typeof t == `function` ? e(t()) : Array.isArray(t) || t instanceof Set ? t : [t]
        })(t)
        for (let t of a)
          if (t !== null && (t.contains(i) || (e.composed && e.composedPath().includes(t)))) return
        return (!ja(i, Ha.Loose) && i.tabIndex !== -1 && e.preventDefault(), r.current(e, i))
      },
      [r, t]
    ),
    a = (0, ro.useRef)(null)
  ;(Xa(
    e,
    `pointerdown`,
    (e) => {
      Ja() || (a.current = e.composedPath?.call(e)?.[0] || e.target)
    },
    !0
  ),
    Xa(
      e,
      `pointerup`,
      (e) => {
        if (Ja() || !a.current) return
        let t = a.current
        return ((a.current = null), i(e, () => t))
      },
      !0
    ))
  let o = (0, ro.useRef)({ x: 0, y: 0 })
  ;(Xa(
    e,
    `touchstart`,
    (e) => {
      ;((o.current.x = e.touches[0].clientX), (o.current.y = e.touches[0].clientY))
    },
    !0
  ),
    Xa(
      e,
      `touchend`,
      (e) => {
        let t = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
        if (!(Math.abs(t.x - o.current.x) >= io || Math.abs(t.y - o.current.y) >= io))
          return i(e, () => (nr(e.target) ? e.target : null))
      },
      !0
    ),
    $a(
      e,
      `blur`,
      (e) => i(e, () => (ir(window.document.activeElement) ? window.document.activeElement : null)),
      !0
    ))
}
var ro,
  io,
  ao = t(() => {
    ;((ro = e(r(), 1)), ur(), Ga(), Ya(), Qa(), It(), to(), (io = 30))
  })
function oo(...e) {
  return (0, co.useMemo)(() => bt(...e), [...e])
}
function so(...e) {
  return (0, co.useMemo)(() => xt(...e), [...e])
}
var co,
  lo = t(() => {
    ;((co = e(r(), 1)), wt())
  })
function uo(e, { trigger: t, action: n, close: r, select: i }) {
  let a = (0, fo.useRef)(null),
    o = (0, fo.useRef)(null),
    s = (0, fo.useRef)(null)
  ;(Xa(e && t !== null, `pointerdown`, (e) => {
    $n(e?.target) &&
      t != null &&
      t.contains(e.target) &&
      ((o.current = e.x), (s.current = e.y), (a.current = e.timeStamp))
  }),
    Xa(
      e && t !== null,
      `pointerup`,
      (e) => {
        let t = a.current
        if (
          t === null ||
          ((a.current = null), !nr(e.target)) ||
          (Math.abs(e.x - (o.current ?? e.x)) < go && Math.abs(e.y - (s.current ?? e.y)) < go)
        )
          return
        let c = n(e)
        switch (c.kind) {
          case 0:
            return
          case 1:
            e.timeStamp - t > ho && (i(c.target), r())
            break
          case 2:
            r()
            break
        }
      },
      { capture: !0 }
    ))
}
var fo,
  po,
  mo,
  ho,
  go,
  _o = t(() => {
    ;((fo = e(r(), 1)),
      ur(),
      Qa(),
      (po = ((e) => (
        (e[(e.Ignore = 0)] = `Ignore`),
        (e[(e.Select = 1)] = `Select`),
        (e[(e.Close = 2)] = `Close`),
        e
      ))(po || {})),
      (mo = { Ignore: { kind: 0 }, Select: (e) => ({ kind: 1, target: e }), Close: { kind: 2 } }),
      (ho = 200),
      (go = 5))
  })
function vo(e, t, n, r) {
  let i = Pt(n)
  ;(0, yo.useEffect)(() => {
    e ??= window
    function n(e) {
      i.current(e)
    }
    return (e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r))
  }, [e, t, r])
}
var yo,
  bo = t(() => {
    ;((yo = e(r(), 1)), It())
  })
function xo(e) {
  let t = (0, So.useRef)({ value: ``, selectionStart: null, selectionEnd: null })
  return (
    vo(e, `blur`, (e) => {
      let n = e.target
      ar(n) &&
        (t.current = {
          value: n.value,
          selectionStart: n.selectionStart,
          selectionEnd: n.selectionEnd,
        })
    }),
    N(() => {
      if (!Ct(e) && ar(e) && e.isConnected) {
        if ((e.focus({ preventScroll: !0 }), e.value !== t.current.value))
          e.setSelectionRange(e.value.length, e.value.length)
        else {
          let { selectionStart: n, selectionEnd: r } = t.current
          n !== null && r !== null && e.setSelectionRange(n, r)
        }
        t.current = { value: ``, selectionStart: null, selectionEnd: null }
      }
    })
  )
}
var So,
  Co = t(() => {
    ;((So = e(r(), 1)), ur(), wt(), P(), bo())
  })
function wo(e, t) {
  return (0, To.useMemo)(() => {
    if (e.type) return e.type
    let n = e.as ?? `button`
    if (
      (typeof n == `string` && n.toLowerCase() === `button`) ||
      (t?.tagName === `BUTTON` && !t.hasAttribute(`type`))
    )
      return `button`
  }, [e.type, e.as, t])
}
var To,
  Eo = t(() => {
    To = e(r(), 1)
  })
function Do(e) {
  return (0, Oo.useSyncExternalStore)(e.subscribe, e.getSnapshot, e.getSnapshot)
}
var Oo,
  ko = t(() => {
    Oo = e(r(), 1)
  })
function Ao(e, t) {
  let n = e(),
    r = new Set()
  return {
    getSnapshot() {
      return n
    },
    subscribe(e) {
      return (r.add(e), () => r.delete(e))
    },
    dispatch(e, ...i) {
      let a = t[e].call(n, ...i)
      a && ((n = a), r.forEach((e) => e()))
    },
  }
}
var jo = t(() => {})
function Mo() {
  let e
  return {
    before({ doc: t }) {
      let n = t.documentElement,
        r = t.defaultView ?? window
      e = Math.max(0, r.innerWidth - n.clientWidth)
    },
    after({ doc: t, d: n }) {
      let r = t.documentElement,
        i = Math.max(0, r.clientWidth - r.offsetWidth),
        a = Math.max(0, e - i)
      n.style(r, `paddingRight`, `${a}px`)
    },
  }
}
var No = t(() => {})
function Po() {
  return Ka()
    ? {
        before({ doc: e, d: t, meta: n }) {
          function r(e) {
            for (let t of n().containers) for (let n of t()) if (n.contains(e)) return !0
            return !1
          }
          t.microTask(() => {
            if (window.getComputedStyle(e.documentElement).scrollBehavior !== `auto`) {
              let n = Dt()
              ;(n.style(e.documentElement, `scrollBehavior`, `auto`),
                t.add(() => t.microTask(() => n.dispose())))
            }
            let n = window.scrollY ?? window.pageYOffset,
              i = null
            ;(t.addEventListener(
              e,
              `click`,
              (t) => {
                if (nr(t.target))
                  try {
                    let n = t.target.closest(`a`)
                    if (!n) return
                    let { hash: a } = new URL(n.href),
                      o = e.querySelector(a)
                    nr(o) && !r(o) && (i = o)
                  } catch {}
              },
              !0
            ),
              t.group((n) => {
                t.addEventListener(e, `touchstart`, (e) => {
                  if ((n.dispose(), nr(e.target) && rr(e.target)))
                    if (r(e.target)) {
                      let t = e.target
                      for (; t.parentElement && r(t.parentElement); ) t = t.parentElement
                      n.style(t, `overscrollBehavior`, `contain`)
                    } else n.style(e.target, `touchAction`, `none`)
                })
              }),
              t.addEventListener(
                e,
                `touchmove`,
                (e) => {
                  if (nr(e.target)) {
                    if (ar(e.target)) return
                    if (r(e.target)) {
                      let t = e.target
                      for (
                        ;
                        t.parentElement &&
                        t.dataset.headlessuiPortal !== `` &&
                        !(t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth);
                      )
                        t = t.parentElement
                      t.dataset.headlessuiPortal === `` && e.preventDefault()
                    } else e.preventDefault()
                  }
                },
                { passive: !1 }
              ),
              t.add(() => {
                ;(n !== (window.scrollY ?? window.pageYOffset) && window.scrollTo(0, n),
                  i && i.isConnected && (i.scrollIntoView({ block: `nearest` }), (i = null)))
              }))
          })
        },
      }
    : {}
}
var Fo = t(() => {
  ;(Ot(), ur(), Ya())
})
function Io() {
  return {
    before({ doc: e, d: t }) {
      t.style(e.documentElement, `overflow`, `hidden`)
    },
  }
}
var Lo = t(() => {})
function Ro(e) {
  let t = {}
  for (let n of e) Object.assign(t, n(t))
  return t
}
var zo,
  Bo = t(() => {
    ;(Ot(),
      jo(),
      No(),
      Fo(),
      Lo(),
      (zo = Ao(() => new Map(), {
        PUSH(e, t) {
          let n = this.get(e) ?? { doc: e, count: 0, d: Dt(), meta: new Set(), computedMeta: {} }
          return (n.count++, n.meta.add(t), (n.computedMeta = Ro(n.meta)), this.set(e, n), this)
        },
        POP(e, t) {
          let n = this.get(e)
          return (n && (n.count--, n.meta.delete(t), (n.computedMeta = Ro(n.meta))), this)
        },
        SCROLL_PREVENT(e) {
          let t = {
              doc: e.doc,
              d: e.d,
              meta() {
                return e.computedMeta
              },
            },
            n = [Po(), Mo(), Io()]
          ;(n.forEach(({ before: e }) => e?.(t)), n.forEach(({ after: e }) => e?.(t)))
        },
        SCROLL_ALLOW({ d: e }) {
          e.dispose()
        },
        TEARDOWN({ doc: e }) {
          this.delete(e)
        },
      })),
      zo.subscribe(() => {
        let e = zo.getSnapshot(),
          t = new Map()
        for (let [n] of e) t.set(n, n.documentElement.style.overflow)
        for (let n of e.values()) {
          let e = t.get(n.doc) === `hidden`,
            r = n.count !== 0
          ;(((r && !e) || (!r && e)) &&
            zo.dispatch(n.count > 0 ? `SCROLL_PREVENT` : `SCROLL_ALLOW`, n),
            n.count === 0 && zo.dispatch(`TEARDOWN`, n))
        }
      }))
  })
function Vo(e, t, n = () => ({ containers: [] })) {
  let r = Do(zo),
    i = t ? r.get(t) : void 0,
    a = i ? i.count > 0 : !1
  return (
    M(() => {
      if (!(!t || !e)) return (zo.dispatch(`PUSH`, t, n), () => zo.dispatch(`POP`, t, n))
    }, [e, t]),
    a
  )
}
var Ho = t(() => {
  ;(ko(), Nt(), Bo())
})
function Uo(e, t, n = () => [document.body]) {
  Vo(_a(e, `scroll-lock`), t, (e) => ({ containers: [...(e.containers ?? []), n] }))
}
var Wo = t(() => {
  ;(Ho(), ya())
})
function Go(e) {
  return [e.screenX, e.screenY]
}
function Ko() {
  let e = (0, qo.useRef)([-1, -1])
  return {
    wasMoved(t) {
      let n = Go(t)
      return e.current[0] === n[0] && e.current[1] === n[1] ? !1 : ((e.current = n), !0)
    },
    update(t) {
      e.current = Go(t)
    },
  }
}
var qo,
  Jo = t(() => {
    qo = e(r(), 1)
  })
function Yo(e = 0) {
  let [t, n] = (0, Xo.useState)(e)
  return {
    flags: t,
    setFlag: (0, Xo.useCallback)((e) => n(e), []),
    addFlag: (0, Xo.useCallback)((e) => n((t) => t | e), []),
    hasFlag: (0, Xo.useCallback)((e) => (t & e) === e, [t]),
    removeFlag: (0, Xo.useCallback)((e) => n((t) => t & ~e), []),
    toggleFlag: (0, Xo.useCallback)((e) => n((t) => t ^ e), []),
  }
}
var Xo,
  Zo = t(() => {
    Xo = e(r(), 1)
  })
function Qo(e) {
  let t = {}
  for (let n in e) e[n] === !0 && (t[`data-${n}`] = ``)
  return t
}
function $o(e, t, n, r) {
  let [i, a] = (0, is.useState)(n),
    { hasFlag: o, addFlag: s, removeFlag: c } = Yo(e && i ? 3 : 0),
    l = (0, is.useRef)(!1),
    u = (0, is.useRef)(!1)
  return (
    M(() => {
      var i
      if (e) {
        if ((n && a(!0), !t)) {
          n && s(3)
          return
        }
        return (
          (i = r?.start) == null || i.call(r, n),
          es(t, {
            inFlight: l,
            prepare() {
              ;(u.current ? (u.current = !1) : (u.current = l.current),
                (l.current = !0),
                !u.current && (n ? (s(3), c(4)) : (s(4), c(2))))
            },
            run() {
              u.current ? (n ? (c(3), s(4)) : (c(4), s(3))) : n ? c(1) : s(1)
            },
            done() {
              var e
              ;(u.current && rs(t)) ||
                ((l.current = !1), c(7), n || a(!1), (e = r?.end) == null || e.call(r, n))
            },
          })
        )
      }
    }, [e, n, t, kt()]),
    e
      ? [i, { closed: o(1), enter: o(2), leave: o(4), transition: o(2) || o(4) }]
      : [n, { closed: void 0, enter: void 0, leave: void 0, transition: void 0 }]
  )
}
function es(e, { prepare: t, run: n, done: r, inFlight: i }) {
  let a = Dt()
  return (
    ns(e, { prepare: t, inFlight: i }),
    a.nextFrame(() => {
      ;(n(),
        a.requestAnimationFrame(() => {
          a.add(ts(e, r))
        }))
    }),
    a.dispose
  )
}
function ts(e, t) {
  let n = Dt()
  if (!e) return n.dispose
  let r = !1
  n.add(() => {
    r = !0
  })
  let i = e.getAnimations?.call(e).filter((e) => e instanceof CSSTransition) ?? []
  return i.length === 0
    ? (t(), n.dispose)
    : (Promise.allSettled(i.map((e) => e.finished)).then(() => {
        r || t()
      }),
      n.dispose)
}
function ns(e, { inFlight: t, prepare: n }) {
  if (t != null && t.current) {
    n()
    return
  }
  let r = e.style.transition
  ;((e.style.transition = `none`), n(), e.offsetHeight, (e.style.transition = r))
}
function rs(e) {
  return (e.getAnimations?.call(e) ?? []).some(
    (e) => e instanceof CSSTransition && e.playState !== `finished`
  )
}
var is,
  as,
  os = t(() => {
    ;((is = e(r(), 1)),
      Ot(),
      jt(),
      Zo(),
      Nt(),
      typeof process < `u` &&
        typeof globalThis < `u` &&
        typeof Element < `u` &&
        (process == null ? void 0 : {})?.NODE_ENV === `test` &&
        (Element == null ? void 0 : Element.prototype)?.getAnimations === void 0 &&
        (Element.prototype.getAnimations = function () {
          return (
            console.warn(
              [
                'Headless UI has polyfilled `Element.prototype.getAnimations` for your tests.',
                'Please install a proper polyfill e.g. `jsdom-testing-mocks`, to silence these warnings.',
                ``,
                `Example usage:`,
                '```js',
                `import { mockAnimationsApi } from 'jsdom-testing-mocks'`,
                `mockAnimationsApi()`,
                '```',
              ].join(`
`)
            ),
            []
          )
        }),
      (as = ((e) => (
        (e[(e.None = 0)] = `None`),
        (e[(e.Closed = 1)] = `Closed`),
        (e[(e.Enter = 2)] = `Enter`),
        (e[(e.Leave = 4)] = `Leave`),
        e
      ))(as || {})))
  })
function ss(e, { container: t, accept: n, walk: r }) {
  let i = (0, cs.useRef)(n),
    a = (0, cs.useRef)(r)
  ;((0, cs.useEffect)(() => {
    ;((i.current = n), (a.current = r))
  }, [n, r]),
    M(() => {
      if (!t || !e) return
      let n = bt(t)
      if (!n) return
      let r = i.current,
        o = a.current,
        s = Object.assign((e) => r(e), { acceptNode: r }),
        c = n.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, s, !1)
      for (; c.nextNode(); ) o(c.currentNode)
    }, [t, e, i, a]))
}
var cs,
  ls = t(() => {
    ;((cs = e(r(), 1)), wt(), Nt())
  })
function us(e, t) {
  let n = (0, ds.useRef)([]),
    r = N(e)
  ;(0, ds.useEffect)(() => {
    let e = [...n.current]
    for (let [i, a] of t.entries())
      if (n.current[i] !== a) {
        let i = r(t, e)
        return ((n.current = t), i)
      }
  }, [r, ...t])
}
var ds,
  fs = t(() => {
    ;((ds = e(r(), 1)), P())
  })
function ps() {
  return typeof window < `u`
}
function ms(e) {
  return _s(e) ? (e.nodeName || ``).toLowerCase() : `#document`
}
function hs(e) {
  var t
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window
}
function gs(e) {
  return ((_s(e) ? e.ownerDocument : e.document) || window.document)?.documentElement
}
function _s(e) {
  return ps() ? e instanceof Node || e instanceof hs(e).Node : !1
}
function vs(e) {
  return ps() ? e instanceof Element || e instanceof hs(e).Element : !1
}
function ys(e) {
  return ps() ? e instanceof HTMLElement || e instanceof hs(e).HTMLElement : !1
}
function bs(e) {
  return !ps() || typeof ShadowRoot > `u`
    ? !1
    : e instanceof ShadowRoot || e instanceof hs(e).ShadowRoot
}
function xs(e) {
  let { overflow: t, overflowX: n, overflowY: r, display: i } = Os(e)
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== `inline` && i !== `contents`
}
function Ss(e) {
  return /^(table|td|th)$/.test(ms(e))
}
function Cs(e) {
  try {
    if (e.matches(`:popover-open`)) return !0
  } catch {}
  try {
    return e.matches(`:modal`)
  } catch {
    return !1
  }
}
function ws(e) {
  let t = vs(e) ? Os(e) : e
  return (
    Is(t.transform) ||
    Is(t.translate) ||
    Is(t.scale) ||
    Is(t.rotate) ||
    Is(t.perspective) ||
    (!Es() && (Is(t.backdropFilter) || Is(t.filter))) ||
    Ps.test(t.willChange || ``) ||
    Fs.test(t.contain || ``)
  )
}
function Ts(e) {
  let t = As(e)
  for (; ys(t) && !Ds(t); ) {
    if (ws(t)) return t
    if (Cs(t)) return null
    t = As(t)
  }
  return null
}
function Es() {
  return (
    (Ls ??= typeof CSS < `u` && CSS.supports && CSS.supports(`-webkit-backdrop-filter`, `none`)),
    Ls
  )
}
function Ds(e) {
  return /^(html|body|#document)$/.test(ms(e))
}
function Os(e) {
  return hs(e).getComputedStyle(e)
}
function ks(e) {
  return vs(e)
    ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
    : { scrollLeft: e.scrollX, scrollTop: e.scrollY }
}
function As(e) {
  if (ms(e) === `html`) return e
  let t = e.assignedSlot || e.parentNode || (bs(e) && e.host) || gs(e)
  return bs(t) ? t.host : t
}
function js(e) {
  let t = As(e)
  return Ds(t) ? (e.ownerDocument ? e.ownerDocument.body : e.body) : ys(t) && xs(t) ? t : js(t)
}
function Ms(e, t, n) {
  ;(t === void 0 && (t = []), n === void 0 && (n = !0))
  let r = js(e),
    i = r === e.ownerDocument?.body,
    a = hs(r)
  if (i) {
    let e = Ns(a)
    return t.concat(a, a.visualViewport || [], xs(r) ? r : [], e && n ? Ms(e) : [])
  } else return t.concat(r, Ms(r, [], n))
}
function Ns(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null
}
var Ps,
  Fs,
  Is,
  Ls,
  Rs = t(() => {
    ;((Ps = /transform|translate|scale|rotate|perspective|filter/),
      (Fs = /paint|layout|strict|content/),
      (Is = (e) => !!e && e !== `none`))
  })
function zs() {
  let e = navigator.userAgentData
  return e && Array.isArray(e.brands)
    ? e.brands
        .map((e) => {
          let { brand: t, version: n } = e
          return t + `/` + n
        })
        .join(` `)
    : navigator.userAgent
}
var Bs = t(() => {})
function Vs(e, t, n) {
  return ac(e, ic(t, n))
}
function Hs(e, t) {
  return typeof e == `function` ? e(t) : e
}
function Us(e) {
  return e.split(`-`)[0]
}
function Ws(e) {
  return e.split(`-`)[1]
}
function Gs(e) {
  return e === `x` ? `y` : `x`
}
function Ks(e) {
  return e === `y` ? `height` : `width`
}
function qs(e) {
  let t = e[0]
  return t === `t` || t === `b` ? `y` : `x`
}
function Js(e) {
  return Gs(qs(e))
}
function Ys(e, t, n) {
  n === void 0 && (n = !1)
  let r = Ws(e),
    i = Js(e),
    a = Ks(i),
    o =
      i === `x`
        ? r === (n ? `end` : `start`)
          ? `right`
          : `left`
        : r === `start`
          ? `bottom`
          : `top`
  return (t.reference[a] > t.floating[a] && (o = ec(o)), [o, ec(o)])
}
function Xs(e) {
  let t = ec(e)
  return [Zs(e), t, Zs(t)]
}
function Zs(e) {
  return e.includes(`start`) ? e.replace(`start`, `end`) : e.replace(`end`, `start`)
}
function Qs(e, t, n) {
  switch (e) {
    case `top`:
    case `bottom`:
      return n ? (t ? dc : uc) : t ? uc : dc
    case `left`:
    case `right`:
      return t ? fc : pc
    default:
      return []
  }
}
function $s(e, t, n, r) {
  let i = Ws(e),
    a = Qs(Us(e), n === `start`, r)
  return (i && ((a = a.map((e) => e + `-` + i)), t && (a = a.concat(a.map(Zs)))), a)
}
function ec(e) {
  let t = Us(e)
  return lc[t] + e.slice(t.length)
}
function tc(e) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...e }
}
function nc(e) {
  return typeof e == `number` ? { top: e, right: e, bottom: e, left: e } : tc(e)
}
function rc(e) {
  let { x: t, y: n, width: r, height: i } = e
  return { width: r, height: i, top: n, left: t, right: t + r, bottom: n + i, x: t, y: n }
}
var ic,
  ac,
  oc,
  sc,
  cc,
  lc,
  uc,
  dc,
  fc,
  pc,
  mc = t(() => {
    ;((ic = Math.min),
      (ac = Math.max),
      (oc = Math.round),
      (sc = Math.floor),
      (cc = (e) => ({ x: e, y: e })),
      (lc = { left: `right`, right: `left`, bottom: `top`, top: `bottom` }),
      (uc = [`left`, `right`]),
      (dc = [`right`, `left`]),
      (fc = [`top`, `bottom`]),
      (pc = [`bottom`, `top`]))
  })
function hc(e, t, n) {
  let { reference: r, floating: i } = e,
    a = qs(t),
    o = Js(t),
    s = Ks(o),
    c = Us(t),
    l = a === `y`,
    u = r.x + r.width / 2 - i.width / 2,
    d = r.y + r.height / 2 - i.height / 2,
    f = r[s] / 2 - i[s] / 2,
    p
  switch (c) {
    case `top`:
      p = { x: u, y: r.y - i.height }
      break
    case `bottom`:
      p = { x: u, y: r.y + r.height }
      break
    case `right`:
      p = { x: r.x + r.width, y: d }
      break
    case `left`:
      p = { x: r.x - i.width, y: d }
      break
    default:
      p = { x: r.x, y: r.y }
  }
  switch (Ws(t)) {
    case `start`:
      p[o] -= f * (n && l ? -1 : 1)
      break
    case `end`:
      p[o] += f * (n && l ? -1 : 1)
      break
  }
  return p
}
async function gc(e, t) {
  t === void 0 && (t = {})
  let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e,
    {
      boundary: c = `clippingAncestors`,
      rootBoundary: l = `viewport`,
      elementContext: u = `floating`,
      altBoundary: d = !1,
      padding: f = 0,
    } = Hs(t, e),
    p = nc(f),
    m = o[d ? (u === `floating` ? `reference` : `floating`) : u],
    h = rc(
      await i.getClippingRect({
        element:
          ((await (i.isElement == null ? void 0 : i.isElement(m))) ?? !0)
            ? m
            : m.contextElement ||
              (await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(o.floating))),
        boundary: c,
        rootBoundary: l,
        strategy: s,
      })
    ),
    g =
      u === `floating`
        ? { x: n, y: r, width: a.floating.width, height: a.floating.height }
        : a.reference,
    _ = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(o.floating)),
    v = ((await (i.isElement == null ? void 0 : i.isElement(_))) &&
      (await (i.getScale == null ? void 0 : i.getScale(_)))) || { x: 1, y: 1 },
    y = rc(
      i.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
            elements: o,
            rect: g,
            offsetParent: _,
            strategy: s,
          })
        : g
    )
  return {
    top: (h.top - y.top + p.top) / v.y,
    bottom: (y.bottom - h.bottom + p.bottom) / v.y,
    left: (h.left - y.left + p.left) / v.x,
    right: (y.right - h.right + p.right) / v.x,
  }
}
async function _c(e, t) {
  let { placement: n, platform: r, elements: i } = e,
    a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)),
    o = Us(n),
    s = Ws(n),
    c = qs(n) === `y`,
    l = xc.has(o) ? -1 : 1,
    u = a && c ? -1 : 1,
    d = Hs(t, e),
    {
      mainAxis: f,
      crossAxis: p,
      alignmentAxis: m,
    } = typeof d == `number`
      ? { mainAxis: d, crossAxis: 0, alignmentAxis: null }
      : { mainAxis: d.mainAxis || 0, crossAxis: d.crossAxis || 0, alignmentAxis: d.alignmentAxis }
  return (
    s && typeof m == `number` && (p = s === `end` ? m * -1 : m),
    c ? { x: p * u, y: f * l } : { x: f * l, y: p * u }
  )
}
var vc,
  yc,
  bc,
  xc,
  Sc,
  Cc,
  wc,
  Tc = t(() => {
    ;(mc(),
      (vc = 50),
      (yc = async (e, t, n) => {
        let {
            placement: r = `bottom`,
            strategy: i = `absolute`,
            middleware: a = [],
            platform: o,
          } = n,
          s = o.detectOverflow ? o : { ...o, detectOverflow: gc },
          c = await (o.isRTL == null ? void 0 : o.isRTL(t)),
          l = await o.getElementRects({ reference: e, floating: t, strategy: i }),
          { x: u, y: d } = hc(l, r, c),
          f = r,
          p = 0,
          m = {}
        for (let n = 0; n < a.length; n++) {
          let h = a[n]
          if (!h) continue
          let { name: g, fn: _ } = h,
            {
              x: v,
              y,
              data: b,
              reset: x,
            } = await _({
              x: u,
              y: d,
              initialPlacement: r,
              placement: f,
              strategy: i,
              middlewareData: m,
              rects: l,
              platform: s,
              elements: { reference: e, floating: t },
            })
          ;((u = v ?? u),
            (d = y ?? d),
            (m[g] = { ...m[g], ...b }),
            x &&
              p < vc &&
              (p++,
              typeof x == `object` &&
                (x.placement && (f = x.placement),
                x.rects &&
                  (l =
                    x.rects === !0
                      ? await o.getElementRects({ reference: e, floating: t, strategy: i })
                      : x.rects),
                ({ x: u, y: d } = hc(l, f, c))),
              (n = -1)))
        }
        return { x: u, y: d, placement: f, strategy: i, middlewareData: m }
      }),
      (bc = function (e) {
        return (
          e === void 0 && (e = {}),
          {
            name: `flip`,
            options: e,
            async fn(t) {
              var n
              let {
                  placement: r,
                  middlewareData: i,
                  rects: a,
                  initialPlacement: o,
                  platform: s,
                  elements: c,
                } = t,
                {
                  mainAxis: l = !0,
                  crossAxis: u = !0,
                  fallbackPlacements: d,
                  fallbackStrategy: f = `bestFit`,
                  fallbackAxisSideDirection: p = `none`,
                  flipAlignment: m = !0,
                  ...h
                } = Hs(e, t)
              if ((n = i.arrow) != null && n.alignmentOffset) return {}
              let g = Us(r),
                _ = qs(o),
                v = Us(o) === o,
                y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)),
                b = d || (v || !m ? [ec(o)] : Xs(o)),
                x = p !== `none`
              !d && x && b.push(...$s(o, m, p, y))
              let S = [o, ...b],
                C = await s.detectOverflow(t, h),
                w = [],
                T = i.flip?.overflows || []
              if ((l && w.push(C[g]), u)) {
                let e = Ys(r, a, y)
                w.push(C[e[0]], C[e[1]])
              }
              if (((T = [...T, { placement: r, overflows: w }]), !w.every((e) => e <= 0))) {
                let e = (i.flip?.index || 0) + 1,
                  t = S[e]
                if (
                  t &&
                  (!(u === `alignment` && _ !== qs(t)) ||
                    T.every((e) => (qs(e.placement) === _ ? e.overflows[0] > 0 : !0)))
                )
                  return { data: { index: e, overflows: T }, reset: { placement: t } }
                let n = T.filter((e) => e.overflows[0] <= 0).sort(
                  (e, t) => e.overflows[1] - t.overflows[1]
                )[0]?.placement
                if (!n)
                  switch (f) {
                    case `bestFit`: {
                      let e = T.filter((e) => {
                        if (x) {
                          let t = qs(e.placement)
                          return t === _ || t === `y`
                        }
                        return !0
                      })
                        .map((e) => [
                          e.placement,
                          e.overflows.filter((e) => e > 0).reduce((e, t) => e + t, 0),
                        ])
                        .sort((e, t) => e[1] - t[1])[0]?.[0]
                      e && (n = e)
                      break
                    }
                    case `initialPlacement`:
                      n = o
                      break
                  }
                if (r !== n) return { reset: { placement: n } }
              }
              return {}
            },
          }
        )
      }),
      (xc = new Set([`left`, `top`])),
      (Sc = function (e) {
        return (
          e === void 0 && (e = 0),
          {
            name: `offset`,
            options: e,
            async fn(t) {
              var n
              let { x: r, y: i, placement: a, middlewareData: o } = t,
                s = await _c(t, e)
              return a === o.offset?.placement && (n = o.arrow) != null && n.alignmentOffset
                ? {}
                : { x: r + s.x, y: i + s.y, data: { ...s, placement: a } }
            },
          }
        )
      }),
      (Cc = function (e) {
        return (
          e === void 0 && (e = {}),
          {
            name: `shift`,
            options: e,
            async fn(t) {
              let { x: n, y: r, placement: i, platform: a } = t,
                {
                  mainAxis: o = !0,
                  crossAxis: s = !1,
                  limiter: c = {
                    fn: (e) => {
                      let { x: t, y: n } = e
                      return { x: t, y: n }
                    },
                  },
                  ...l
                } = Hs(e, t),
                u = { x: n, y: r },
                d = await a.detectOverflow(t, l),
                f = qs(Us(i)),
                p = Gs(f),
                m = u[p],
                h = u[f]
              if (o) {
                let e = p === `y` ? `top` : `left`,
                  t = p === `y` ? `bottom` : `right`,
                  n = m + d[e],
                  r = m - d[t]
                m = Vs(n, m, r)
              }
              if (s) {
                let e = f === `y` ? `top` : `left`,
                  t = f === `y` ? `bottom` : `right`,
                  n = h + d[e],
                  r = h - d[t]
                h = Vs(n, h, r)
              }
              let g = c.fn({ ...t, [p]: m, [f]: h })
              return { ...g, data: { x: g.x - n, y: g.y - r, enabled: { [p]: o, [f]: s } } }
            },
          }
        )
      }),
      (wc = function (e) {
        return (
          e === void 0 && (e = {}),
          {
            name: `size`,
            options: e,
            async fn(t) {
              var n, r
              let { placement: i, rects: a, platform: o, elements: s } = t,
                { apply: c = () => {}, ...l } = Hs(e, t),
                u = await o.detectOverflow(t, l),
                d = Us(i),
                f = Ws(i),
                p = qs(i) === `y`,
                { width: m, height: h } = a.floating,
                g,
                _
              d === `top` || d === `bottom`
                ? ((g = d),
                  (_ =
                    f ===
                    ((await (o.isRTL == null ? void 0 : o.isRTL(s.floating))) ? `start` : `end`)
                      ? `left`
                      : `right`))
                : ((_ = d), (g = f === `end` ? `top` : `bottom`))
              let v = h - u.top - u.bottom,
                y = m - u.left - u.right,
                b = ic(h - u[g], v),
                x = ic(m - u[_], y),
                S = !t.middlewareData.shift,
                C = b,
                w = x
              if (
                ((n = t.middlewareData.shift) != null && n.enabled.x && (w = y),
                (r = t.middlewareData.shift) != null && r.enabled.y && (C = v),
                S && !f)
              ) {
                let e = ac(u.left, 0),
                  t = ac(u.right, 0),
                  n = ac(u.top, 0),
                  r = ac(u.bottom, 0)
                p
                  ? (w = m - 2 * (e !== 0 || t !== 0 ? e + t : ac(u.left, u.right)))
                  : (C = h - 2 * (n !== 0 || r !== 0 ? n + r : ac(u.top, u.bottom)))
              }
              await c({ ...t, availableWidth: w, availableHeight: C })
              let T = await o.getDimensions(s.floating)
              return m !== T.width || h !== T.height ? { reset: { rects: !0 } } : {}
            },
          }
        )
      }))
  })
function Ec(e) {
  let t = Os(e),
    n = parseFloat(t.width) || 0,
    r = parseFloat(t.height) || 0,
    i = ys(e),
    a = i ? e.offsetWidth : n,
    o = i ? e.offsetHeight : r,
    s = oc(n) !== a || oc(r) !== o
  return (s && ((n = a), (r = o)), { width: n, height: r, $: s })
}
function Dc(e) {
  return vs(e) ? e : e.contextElement
}
function Oc(e) {
  let t = Dc(e)
  if (!ys(t)) return cc(1)
  let n = t.getBoundingClientRect(),
    { width: r, height: i, $: a } = Ec(t),
    o = (a ? oc(n.width) : n.width) / r,
    s = (a ? oc(n.height) : n.height) / i
  return (
    (!o || !Number.isFinite(o)) && (o = 1),
    (!s || !Number.isFinite(s)) && (s = 1),
    { x: o, y: s }
  )
}
function kc(e) {
  let t = hs(e)
  return !Es() || !t.visualViewport
    ? Qc
    : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop }
}
function Ac(e, t, n) {
  return (t === void 0 && (t = !1), !n || (t && n !== hs(e)) ? !1 : t)
}
function jc(e, t, n, r) {
  ;(t === void 0 && (t = !1), n === void 0 && (n = !1))
  let i = e.getBoundingClientRect(),
    a = Dc(e),
    o = cc(1)
  t && (r ? vs(r) && (o = Oc(r)) : (o = Oc(e)))
  let s = Ac(a, n, r) ? kc(a) : cc(0),
    c = (i.left + s.x) / o.x,
    l = (i.top + s.y) / o.y,
    u = i.width / o.x,
    d = i.height / o.y
  if (a) {
    let e = hs(a),
      t = r && vs(r) ? hs(r) : r,
      n = e,
      i = Ns(n)
    for (; i && r && t !== n; ) {
      let e = Oc(i),
        t = i.getBoundingClientRect(),
        r = Os(i),
        a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x,
        o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y
      ;((c *= e.x),
        (l *= e.y),
        (u *= e.x),
        (d *= e.y),
        (c += a),
        (l += o),
        (n = hs(i)),
        (i = Ns(n)))
    }
  }
  return rc({ width: u, height: d, x: c, y: l })
}
function Mc(e, t) {
  let n = ks(e).scrollLeft
  return t ? t.left + n : jc(gs(e)).left + n
}
function Nc(e, t) {
  let n = e.getBoundingClientRect()
  return { x: n.left + t.scrollLeft - Mc(e, n), y: n.top + t.scrollTop }
}
function Pc(e) {
  let { elements: t, rect: n, offsetParent: r, strategy: i } = e,
    a = i === `fixed`,
    o = gs(r),
    s = t ? Cs(t.floating) : !1
  if (r === o || (s && a)) return n
  let c = { scrollLeft: 0, scrollTop: 0 },
    l = cc(1),
    u = cc(0),
    d = ys(r)
  if ((d || (!d && !a)) && ((ms(r) !== `body` || xs(o)) && (c = ks(r)), d)) {
    let e = jc(r)
    ;((l = Oc(r)), (u.x = e.x + r.clientLeft), (u.y = e.y + r.clientTop))
  }
  let f = o && !d && !a ? Nc(o, c) : cc(0)
  return {
    width: n.width * l.x,
    height: n.height * l.y,
    x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
    y: n.y * l.y - c.scrollTop * l.y + u.y + f.y,
  }
}
function Fc(e) {
  return Array.from(e.getClientRects())
}
function Ic(e) {
  let t = gs(e),
    n = ks(e),
    r = e.ownerDocument.body,
    i = ac(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth),
    a = ac(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight),
    o = -n.scrollLeft + Mc(e),
    s = -n.scrollTop
  return (
    Os(r).direction === `rtl` && (o += ac(t.clientWidth, r.clientWidth) - i),
    { width: i, height: a, x: o, y: s }
  )
}
function Lc(e, t) {
  let n = hs(e),
    r = gs(e),
    i = n.visualViewport,
    a = r.clientWidth,
    o = r.clientHeight,
    s = 0,
    c = 0
  if (i) {
    ;((a = i.width), (o = i.height))
    let e = Es()
    ;(!e || (e && t === `fixed`)) && ((s = i.offsetLeft), (c = i.offsetTop))
  }
  let l = Mc(r)
  if (l <= 0) {
    let e = r.ownerDocument,
      t = e.body,
      n = getComputedStyle(t),
      i =
        (e.compatMode === `CSS1Compat` && parseFloat(n.marginLeft) + parseFloat(n.marginRight)) ||
        0,
      o = Math.abs(r.clientWidth - t.clientWidth - i)
    o <= $c && (a -= o)
  } else l <= $c && (a += l)
  return { width: a, height: o, x: s, y: c }
}
function Rc(e, t) {
  let n = jc(e, !0, t === `fixed`),
    r = n.top + e.clientTop,
    i = n.left + e.clientLeft,
    a = ys(e) ? Oc(e) : cc(1)
  return { width: e.clientWidth * a.x, height: e.clientHeight * a.y, x: i * a.x, y: r * a.y }
}
function zc(e, t, n) {
  let r
  if (t === `viewport`) r = Lc(e, n)
  else if (t === `document`) r = Ic(gs(e))
  else if (vs(t)) r = Rc(t, n)
  else {
    let n = kc(e)
    r = { x: t.x - n.x, y: t.y - n.y, width: t.width, height: t.height }
  }
  return rc(r)
}
function Bc(e, t) {
  let n = As(e)
  return n === t || !vs(n) || Ds(n) ? !1 : Os(n).position === `fixed` || Bc(n, t)
}
function Vc(e, t) {
  let n = t.get(e)
  if (n) return n
  let r = Ms(e, [], !1).filter((e) => vs(e) && ms(e) !== `body`),
    i = null,
    a = Os(e).position === `fixed`,
    o = a ? As(e) : e
  for (; vs(o) && !Ds(o); ) {
    let t = Os(o),
      n = ws(o)
    ;(!n && t.position === `fixed` && (i = null),
      (
        a
          ? !n && !i
          : (!n &&
              t.position === `static` &&
              i &&
              (i.position === `absolute` || i.position === `fixed`)) ||
            (xs(o) && !n && Bc(e, o))
      )
        ? (r = r.filter((e) => e !== o))
        : (i = t),
      (o = As(o)))
  }
  return (t.set(e, r), r)
}
function Hc(e) {
  let { element: t, boundary: n, rootBoundary: r, strategy: i } = e,
    a = [...(n === `clippingAncestors` ? (Cs(t) ? [] : Vc(t, this._c)) : [].concat(n)), r],
    o = zc(t, a[0], i),
    s = o.top,
    c = o.right,
    l = o.bottom,
    u = o.left
  for (let e = 1; e < a.length; e++) {
    let n = zc(t, a[e], i)
    ;((s = ac(n.top, s)), (c = ic(n.right, c)), (l = ic(n.bottom, l)), (u = ac(n.left, u)))
  }
  return { width: c - u, height: l - s, x: u, y: s }
}
function Uc(e) {
  let { width: t, height: n } = Ec(e)
  return { width: t, height: n }
}
function Wc(e, t, n) {
  let r = ys(t),
    i = gs(t),
    a = n === `fixed`,
    o = jc(e, !0, a, t),
    s = { scrollLeft: 0, scrollTop: 0 },
    c = cc(0)
  function l() {
    c.x = Mc(i)
  }
  if (r || (!r && !a))
    if (((ms(t) !== `body` || xs(i)) && (s = ks(t)), r)) {
      let e = jc(t, !0, a, t)
      ;((c.x = e.x + t.clientLeft), (c.y = e.y + t.clientTop))
    } else i && l()
  a && !r && i && l()
  let u = i && !r && !a ? Nc(i, s) : cc(0)
  return {
    x: o.left + s.scrollLeft - c.x - u.x,
    y: o.top + s.scrollTop - c.y - u.y,
    width: o.width,
    height: o.height,
  }
}
function Gc(e) {
  return Os(e).position === `static`
}
function Kc(e, t) {
  if (!ys(e) || Os(e).position === `fixed`) return null
  if (t) return t(e)
  let n = e.offsetParent
  return (gs(e) === n && (n = n.ownerDocument.body), n)
}
function qc(e, t) {
  let n = hs(e)
  if (Cs(e)) return n
  if (!ys(e)) {
    let t = As(e)
    for (; t && !Ds(t); ) {
      if (vs(t) && !Gc(t)) return t
      t = As(t)
    }
    return n
  }
  let r = Kc(e, t)
  for (; r && Ss(r) && Gc(r); ) r = Kc(r, t)
  return r && Ds(r) && Gc(r) && !ws(r) ? n : r || Ts(e) || n
}
function Jc(e) {
  return Os(e).direction === `rtl`
}
function Yc(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height
}
function Xc(e, t) {
  let n = null,
    r,
    i = gs(e)
  function a() {
    var e
    ;(clearTimeout(r), (e = n) == null || e.disconnect(), (n = null))
  }
  function o(s, c) {
    ;(s === void 0 && (s = !1), c === void 0 && (c = 1), a())
    let l = e.getBoundingClientRect(),
      { left: u, top: d, width: f, height: p } = l
    if ((s || t(), !f || !p)) return
    let m = sc(d),
      h = sc(i.clientWidth - (u + f)),
      g = sc(i.clientHeight - (d + p)),
      _ = sc(u),
      v = {
        rootMargin: -m + `px ` + -h + `px ` + -g + `px ` + -_ + `px`,
        threshold: ac(0, ic(1, c)) || 1,
      },
      y = !0
    function b(t) {
      let n = t[0].intersectionRatio
      if (n !== c) {
        if (!y) return o()
        n
          ? o(!1, n)
          : (r = setTimeout(() => {
              o(!1, 1e-7)
            }, 1e3))
      }
      ;(n === 1 && !Yc(l, e.getBoundingClientRect()) && o(), (y = !1))
    }
    try {
      n = new IntersectionObserver(b, { ...v, root: i.ownerDocument })
    } catch {
      n = new IntersectionObserver(b, v)
    }
    n.observe(e)
  }
  return (o(!0), a)
}
function Zc(e, t, n, r) {
  r === void 0 && (r = {})
  let {
      ancestorScroll: i = !0,
      ancestorResize: a = !0,
      elementResize: o = typeof ResizeObserver == `function`,
      layoutShift: s = typeof IntersectionObserver == `function`,
      animationFrame: c = !1,
    } = r,
    l = Dc(e),
    u = i || a ? [...(l ? Ms(l) : []), ...(t ? Ms(t) : [])] : []
  u.forEach((e) => {
    ;(i && e.addEventListener(`scroll`, n, { passive: !0 }), a && e.addEventListener(`resize`, n))
  })
  let d = l && s ? Xc(l, n) : null,
    f = -1,
    p = null
  o &&
    ((p = new ResizeObserver((e) => {
      let [r] = e
      ;(r &&
        r.target === l &&
        p &&
        t &&
        (p.unobserve(t),
        cancelAnimationFrame(f),
        (f = requestAnimationFrame(() => {
          var e
          ;(e = p) == null || e.observe(t)
        }))),
        n())
    })),
    l && !c && p.observe(l),
    t && p.observe(t))
  let m,
    h = c ? jc(e) : null
  c && g()
  function g() {
    let t = jc(e)
    ;(h && !Yc(h, t) && n(), (h = t), (m = requestAnimationFrame(g)))
  }
  return (
    n(),
    () => {
      var e
      ;(u.forEach((e) => {
        ;(i && e.removeEventListener(`scroll`, n), a && e.removeEventListener(`resize`, n))
      }),
        d?.(),
        (e = p) == null || e.disconnect(),
        (p = null),
        c && cancelAnimationFrame(m))
    }
  )
}
var Qc,
  $c,
  el,
  tl,
  nl,
  rl,
  il,
  al,
  ol,
  sl,
  cl = t(() => {
    ;(Tc(),
      mc(),
      Rs(),
      (Qc = cc(0)),
      ($c = 25),
      (el = async function (e) {
        let t = this.getOffsetParent || qc,
          n = this.getDimensions,
          r = await n(e.floating)
        return {
          reference: Wc(e.reference, await t(e.floating), e.strategy),
          floating: { x: 0, y: 0, width: r.width, height: r.height },
        }
      }),
      (tl = {
        convertOffsetParentRelativeRectToViewportRelativeRect: Pc,
        getDocumentElement: gs,
        getClippingRect: Hc,
        getOffsetParent: qc,
        getElementRects: el,
        getClientRects: Fc,
        getDimensions: Uc,
        getScale: Oc,
        isElement: vs,
        isRTL: Jc,
      }),
      (nl = gc),
      (rl = Sc),
      (il = Cc),
      (al = bc),
      (ol = wc),
      (sl = (e, t, n) => {
        let r = new Map(),
          i = { platform: tl, ...n },
          a = { ...i.platform, _c: r }
        return yc(e, t, { ...i, platform: a })
      }))
  })
function ll(e, t) {
  if (e === t) return !0
  if (typeof e != typeof t) return !1
  if (typeof e == `function` && e.toString() === t.toString()) return !0
  let n, r, i
  if (e && t && typeof e == `object`) {
    if (Array.isArray(e)) {
      if (((n = e.length), n !== t.length)) return !1
      for (r = n; r-- !== 0; ) if (!ll(e[r], t[r])) return !1
      return !0
    }
    if (((i = Object.keys(e)), (n = i.length), n !== Object.keys(t).length)) return !1
    for (r = n; r-- !== 0; ) if (!{}.hasOwnProperty.call(t, i[r])) return !1
    for (r = n; r-- !== 0; ) {
      let n = i[r]
      if (!(n === `_owner` && e.$$typeof) && !ll(e[n], t[n])) return !1
    }
    return !0
  }
  return e !== e && t !== t
}
function ul(e) {
  return typeof window > `u` ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1
}
function dl(e, t) {
  let n = ul(e)
  return Math.round(t * n) / n
}
function fl(e) {
  let t = ml.useRef(e)
  return (
    _l(() => {
      t.current = e
    }),
    t
  )
}
function pl(e) {
  e === void 0 && (e = {})
  let {
      placement: t = `bottom`,
      strategy: n = `absolute`,
      middleware: r = [],
      platform: i,
      elements: { reference: a, floating: o } = {},
      transform: s = !0,
      whileElementsMounted: c,
      open: l,
    } = e,
    [u, d] = ml.useState({
      x: 0,
      y: 0,
      strategy: n,
      placement: t,
      middlewareData: {},
      isPositioned: !1,
    }),
    [f, p] = ml.useState(r)
  ll(f, r) || p(r)
  let [m, h] = ml.useState(null),
    [g, _] = ml.useState(null),
    v = ml.useCallback((e) => {
      e !== S.current && ((S.current = e), h(e))
    }, []),
    y = ml.useCallback((e) => {
      e !== C.current && ((C.current = e), _(e))
    }, []),
    b = a || m,
    x = o || g,
    S = ml.useRef(null),
    C = ml.useRef(null),
    w = ml.useRef(u),
    T = c != null,
    E = fl(c),
    D = fl(i),
    O = fl(l),
    k = ml.useCallback(() => {
      if (!S.current || !C.current) return
      let e = { placement: t, strategy: n, middleware: f }
      ;(D.current && (e.platform = D.current),
        sl(S.current, C.current, e).then((e) => {
          let t = { ...e, isPositioned: O.current !== !1 }
          A.current &&
            !ll(w.current, t) &&
            ((w.current = t),
            gl.flushSync(() => {
              d(t)
            }))
        }))
    }, [f, t, n, D, O])
  _l(() => {
    l === !1 &&
      w.current.isPositioned &&
      ((w.current.isPositioned = !1), d((e) => ({ ...e, isPositioned: !1 })))
  }, [l])
  let A = ml.useRef(!1)
  ;(_l(
    () => (
      (A.current = !0),
      () => {
        A.current = !1
      }
    ),
    []
  ),
    _l(() => {
      if ((b && (S.current = b), x && (C.current = x), b && x)) {
        if (E.current) return E.current(b, x, k)
        k()
      }
    }, [b, x, k, E, T]))
  let ee = ml.useMemo(
      () => ({ reference: S, floating: C, setReference: v, setFloating: y }),
      [v, y]
    ),
    te = ml.useMemo(() => ({ reference: b, floating: x }), [b, x]),
    ne = ml.useMemo(() => {
      let e = { position: n, left: 0, top: 0 }
      if (!te.floating) return e
      let t = dl(te.floating, u.x),
        r = dl(te.floating, u.y)
      return s
        ? {
            ...e,
            transform: `translate(` + t + `px, ` + r + `px)`,
            ...(ul(te.floating) >= 1.5 && { willChange: `transform` }),
          }
        : { position: n, left: t, top: r }
    }, [n, s, te.floating, u.x, u.y])
  return ml.useMemo(
    () => ({ ...u, update: k, refs: ee, elements: te, floatingStyles: ne }),
    [u, k, ee, te, ne]
  )
}
var ml,
  hl,
  gl,
  _l,
  vl,
  yl,
  bl,
  xl,
  Sl = t(() => {
    ;(cl(),
      (ml = e(r(), 1)),
      (hl = e(r(), 1)),
      (gl = e(a(), 1)),
      (_l = typeof document < `u` ? hl.useLayoutEffect : function () {}),
      (vl = (e, t) => {
        let n = rl(e)
        return { name: n.name, fn: n.fn, options: [e, t] }
      }),
      (yl = (e, t) => {
        let n = il(e)
        return { name: n.name, fn: n.fn, options: [e, t] }
      }),
      (bl = (e, t) => {
        let n = al(e)
        return { name: n.name, fn: n.fn, options: [e, t] }
      }),
      (xl = (e, t) => {
        let n = ol(e)
        return { name: n.name, fn: n.fn, options: [e, t] }
      }))
  })
function Cl(e) {
  let t = W.useRef(() => {})
  return (
    Fl(() => {
      t.current = e
    }),
    W.useCallback(function () {
      var e = [...arguments]
      return t.current == null ? void 0 : t.current(...e)
    }, [])
  )
}
function wl() {
  let [e, t] = W.useState(() => (Ul ? Gl() : void 0))
  return (
    Bl(() => {
      e ?? t(Gl())
    }, []),
    W.useEffect(() => {
      Ul = !0
    }, []),
    e
  )
}
function Tl() {
  let e = new Map()
  return {
    emit(t, n) {
      var r
      ;(r = e.get(t)) == null || r.forEach((e) => e(n))
    },
    on(t, n) {
      e.set(t, [...(e.get(t) || []), n])
    },
    off(t, n) {
      e.set(t, e.get(t)?.filter((e) => e !== n) || [])
    },
  }
}
function El(e) {
  let { open: t = !1, onOpenChange: n, elements: r } = e,
    i = Kl(),
    a = W.useRef({}),
    [o] = W.useState(() => Tl()),
    s = Yl() != null,
    [c, l] = W.useState(r.reference),
    u = Cl((e, t, r) => {
      ;((a.current.openEvent = e ? t : void 0),
        o.emit(`openchange`, { open: e, event: t, reason: r, nested: s }),
        n?.(e, t, r))
    }),
    d = W.useMemo(() => ({ setPositionReference: l }), []),
    f = W.useMemo(
      () => ({
        reference: c || r.reference || null,
        floating: r.floating || null,
        domReference: r.reference,
      }),
      [c, r.reference, r.floating]
    )
  return W.useMemo(
    () => ({
      dataRef: a,
      open: t,
      onOpenChange: u,
      elements: f,
      events: o,
      floatingId: i,
      refs: d,
    }),
    [t, u, f, o, i, d]
  )
}
function Dl(e) {
  e === void 0 && (e = {})
  let { nodeId: t } = e,
    n = El({ ...e, elements: { reference: null, floating: null, ...e.elements } }),
    r = e.rootContext || n,
    i = r.elements,
    [a, o] = W.useState(null),
    [s, c] = W.useState(null),
    l = i?.domReference || a,
    u = W.useRef(null),
    d = Xl()
  Bl(() => {
    l && (u.current = l)
  }, [l])
  let f = pl({ ...e, elements: { ...i, ...(s && { reference: s }) } }),
    p = W.useCallback(
      (e) => {
        let t = vs(e)
          ? { getBoundingClientRect: () => e.getBoundingClientRect(), contextElement: e }
          : e
        ;(c(t), f.refs.setReference(t))
      },
      [f.refs]
    ),
    m = W.useCallback(
      (e) => {
        ;((vs(e) || e === null) && ((u.current = e), o(e)),
          (vs(f.refs.reference.current) ||
            f.refs.reference.current === null ||
            (e !== null && !vs(e))) &&
            f.refs.setReference(e))
      },
      [f.refs]
    ),
    h = W.useMemo(
      () => ({ ...f.refs, setReference: m, setPositionReference: p, domReference: u }),
      [f.refs, m, p]
    ),
    g = W.useMemo(() => ({ ...f.elements, domReference: l }), [f.elements, l]),
    _ = W.useMemo(() => ({ ...f, ...r, refs: h, elements: g, nodeId: t }), [f, h, g, t, r])
  return (
    Bl(() => {
      r.dataRef.current.floatingContext = _
      let e = d?.nodesRef.current.find((e) => e.id === t)
      e && (e.context = _)
    }),
    W.useMemo(() => ({ ...f, context: _, refs: h, elements: g }), [f, h, g, _])
  )
}
function Ol(e, t, n) {
  let r = new Map(),
    i = n === `item`,
    a = e
  if (i && e) {
    let { [Ql]: t, [$l]: n, ...r } = e
    a = r
  }
  return {
    ...(n === `floating` && { tabIndex: -1, [Zl]: `` }),
    ...a,
    ...t
      .map((t) => {
        let r = t ? t[n] : null
        return typeof r == `function` ? (e ? r(e) : null) : r
      })
      .concat(e)
      .reduce(
        (e, t) => (
          t &&
            Object.entries(t).forEach((t) => {
              let [n, a] = t
              if (!(i && [Ql, $l].includes(n)))
                if (n.indexOf(`on`) === 0) {
                  if ((r.has(n) || r.set(n, []), typeof a == `function`)) {
                    var o
                    ;((o = r.get(n)) == null || o.push(a),
                      (e[n] = function () {
                        var e = [...arguments]
                        return r
                          .get(n)
                          ?.map((t) => t(...e))
                          .find((e) => e !== void 0)
                      }))
                  }
                } else e[n] = a
            }),
          e
        ),
        {}
      ),
  }
}
function kl(e) {
  e === void 0 && (e = [])
  let t = e.map((e) => e?.reference),
    n = e.map((e) => e?.floating),
    r = e.map((e) => e?.item),
    i = W.useCallback((t) => Ol(t, e, `reference`), t),
    a = W.useCallback((t) => Ol(t, e, `floating`), n),
    o = W.useCallback((t) => Ol(t, e, `item`), r)
  return W.useMemo(
    () => ({ getReferenceProps: i, getFloatingProps: a, getItemProps: o }),
    [i, a, o]
  )
}
function Al(e, t) {
  return { ...e, rects: { ...e.rects, floating: { ...e.rects.floating, height: t } } }
}
function jl(e, t) {
  let { open: n, elements: r } = e,
    { enabled: i = !0, overflowRef: a, scrollRef: o, onChange: s } = t,
    c = Cl(s),
    l = W.useRef(!1),
    u = W.useRef(null),
    d = W.useRef(null)
  W.useEffect(() => {
    if (!i) return
    function e(e) {
      if (e.ctrlKey || !t || a.current == null) return
      let n = e.deltaY,
        r = a.current.top >= -0.5,
        i = a.current.bottom >= -0.5,
        o = t.scrollHeight - t.clientHeight,
        s = n < 0 ? -1 : 1,
        l = n < 0 ? `max` : `min`
      t.scrollHeight <= t.clientHeight ||
        ((!r && n > 0) || (!i && n < 0)
          ? (e.preventDefault(),
            Nl.flushSync(() => {
              c((e) => e + Math[l](n, o * s))
            }))
          : /firefox/i.test(zs()) && (t.scrollTop += n))
    }
    let t = o?.current || r.floating
    if (n && t)
      return (
        t.addEventListener(`wheel`, e),
        requestAnimationFrame(() => {
          ;((u.current = t.scrollTop), a.current != null && (d.current = { ...a.current }))
        }),
        () => {
          ;((u.current = null), (d.current = null), t.removeEventListener(`wheel`, e))
        }
      )
  }, [i, n, r.floating, a, o, c])
  let f = W.useMemo(
    () => ({
      onKeyDown() {
        l.current = !0
      },
      onWheel() {
        l.current = !1
      },
      onPointerMove() {
        l.current = !1
      },
      onScroll() {
        let e = o?.current || r.floating
        if (!(!a.current || !e || !l.current)) {
          if (u.current !== null) {
            let t = e.scrollTop - u.current
            ;((a.current.bottom < -0.5 && t < -1) || (a.current.top < -0.5 && t > 1)) &&
              Nl.flushSync(() => c((e) => e + t))
          }
          requestAnimationFrame(() => {
            u.current = e.scrollTop
          })
        }
      },
    }),
    [r.floating, c, a, o]
  )
  return W.useMemo(() => (i ? { floating: f } : {}), [i, f])
}
var W,
  Ml,
  Nl,
  Pl,
  Fl,
  Il,
  Ll,
  Rl,
  zl,
  Bl,
  Vl,
  Hl,
  Ul,
  Wl,
  Gl,
  Kl,
  ql,
  Jl,
  Yl,
  Xl,
  Zl,
  Ql,
  $l,
  eu,
  tu = t(() => {
    ;((W = e(r(), 1)),
      (Ml = e(r(), 1)),
      Bs(),
      mc(),
      Rs(),
      (Nl = e(a(), 1)),
      Sl(),
      (Pl = { ...W }),
      (Fl = Pl.useInsertionEffect || ((e) => e())),
      (Il = `ArrowUp`),
      (Ll = `ArrowDown`),
      (Rl = `ArrowLeft`),
      (zl = `ArrowRight`),
      (Bl = typeof document < `u` ? Ml.useLayoutEffect : Ml.useEffect),
      (Vl = [Rl, zl]),
      (Hl = [Il, Ll]),
      [...Vl, ...Hl],
      (Ul = !1),
      (Wl = 0),
      (Gl = () => `floating-ui-` + Math.random().toString(36).slice(2, 6) + Wl++),
      (Kl = Pl.useId || wl),
      (ql = W.createContext(null)),
      (Jl = W.createContext(null)),
      (Yl = () => W.useContext(ql)?.id || null),
      (Xl = () => W.useContext(Jl)),
      (Zl = `data-floating-ui-focusable`),
      (Ql = `active`),
      ($l = `selected`),
      (eu = (e) => ({
        name: `inner`,
        options: e,
        async fn(t) {
          let {
              listRef: n,
              overflowRef: r,
              onFallbackChange: i,
              offset: a = 0,
              index: o = 0,
              minItemsVisible: s = 4,
              referenceOverflowThreshold: c = 0,
              scrollRef: l,
              ...u
            } = Hs(e, t),
            {
              rects: d,
              elements: { floating: f },
            } = t,
            p = n.current[o],
            m = l?.current || f,
            h = f.clientTop || m.clientTop,
            g = f.clientTop !== 0,
            _ = m.clientTop !== 0,
            v = f === m
          if (!p) return {}
          let y = {
              ...t,
              ...(await vl(
                -p.offsetTop - f.clientTop - d.reference.height / 2 - p.offsetHeight / 2 - a
              ).fn(t)),
            },
            b = await nl(Al(y, m.scrollHeight + h + f.clientTop), u),
            x = await nl(y, { ...u, elementContext: `reference` }),
            S = ac(0, b.top),
            C = y.y + S,
            w = (m.scrollHeight > m.clientHeight ? (e) => e : oc)(
              ac(0, m.scrollHeight + ((g && v) || _ ? h * 2 : 0) - S - ac(0, b.bottom))
            )
          if (((m.style.maxHeight = w + `px`), (m.scrollTop = S), i)) {
            let e =
              m.offsetHeight < p.offsetHeight * ic(s, n.current.length) - 1 ||
              x.top >= -c ||
              x.bottom >= -c
            Nl.flushSync(() => i(e))
          }
          return (
            r && (r.current = await nl(Al({ ...y, y: C }, m.offsetHeight + h + f.clientTop), u)),
            { y: C }
          )
        },
      })))
  })
function nu(e) {
  return (0, mu.useMemo)(() => (e ? (typeof e == `string` ? { to: e } : e) : null), [e])
}
function ru() {
  return (0, mu.useContext)(hu).setReference
}
function iu() {
  return (0, mu.useContext)(hu).getReferenceProps
}
function au() {
  let { getFloatingProps: e, slot: t } = (0, mu.useContext)(hu)
  return (0, mu.useCallback)(
    (...n) => Object.assign({}, e(...n), { 'data-anchor': t.anchor }),
    [e, t]
  )
}
function ou(e = null) {
  ;(e === !1 && (e = null), typeof e == `string` && (e = { to: e }))
  let t = (0, mu.useContext)(gu),
    n = (0, mu.useMemo)(() => e, [JSON.stringify(e, (e, t) => t?.outerHTML ?? t)])
  M(() => {
    t?.(n ?? null)
  }, [t, n])
  let r = (0, mu.useContext)(hu)
  return (0, mu.useMemo)(() => [r.setFloating, e ? r.styles : {}], [r.setFloating, e, r.styles])
}
function su({ children: e, enabled: t = !0 }) {
  let [n, r] = (0, mu.useState)(null),
    [i, a] = (0, mu.useState)(0),
    o = (0, mu.useRef)(null),
    [s, c] = (0, mu.useState)(null)
  cu(s)
  let l = t && n !== null && s !== null,
    { to: u = `bottom`, gap: d = 0, offset: f = 0, padding: p = 0, inner: m } = lu(n, s),
    [h, g = `center`] = u.split(` `)
  M(() => {
    l && a(0)
  }, [l])
  let {
      refs: _,
      floatingStyles: v,
      context: y,
    } = Dl({
      open: l,
      placement:
        h === `selection`
          ? g === `center`
            ? `bottom`
            : `bottom-${g}`
          : g === `center`
            ? `${h}`
            : `${h}-${g}`,
      strategy: `absolute`,
      transform: !1,
      middleware: [
        vl({ mainAxis: h === `selection` ? 0 : d, crossAxis: f }),
        yl({ padding: p }),
        h !== `selection` && bl({ padding: p }),
        h === `selection` && m
          ? eu({
              ...m,
              padding: p,
              overflowRef: o,
              offset: i,
              minItemsVisible: _u,
              referenceOverflowThreshold: p,
              onFallbackChange(e) {
                if (!e) return
                let t = y.elements.floating
                if (!t) return
                let n = parseFloat(getComputedStyle(t).scrollPaddingBottom) || 0,
                  r = Math.min(_u, t.childElementCount),
                  i = 0,
                  o = 0
                for (let e of y.elements.floating?.childNodes ?? [])
                  if (tr(e)) {
                    let a = e.offsetTop,
                      s = a + e.clientHeight + n,
                      c = t.scrollTop,
                      l = c + t.clientHeight
                    if (a >= c && s <= l) r--
                    else {
                      ;((o = Math.max(0, Math.min(s, l) - Math.max(a, c))), (i = e.clientHeight))
                      break
                    }
                  }
                r >= 1 &&
                  a((e) => {
                    let t = i * r - o + n
                    return e >= t ? e : t
                  })
              },
            })
          : null,
        xl({
          padding: p,
          apply({ availableWidth: e, availableHeight: t, elements: n }) {
            Object.assign(n.floating.style, {
              overflow: `auto`,
              maxWidth: `${e}px`,
              maxHeight: `min(var(--anchor-max-height, 100vh), ${t}px)`,
            })
          },
        }),
      ].filter(Boolean),
      whileElementsMounted: Zc,
    }),
    [b = h, x = g] = y.placement.split(`-`)
  h === `selection` && (b = `selection`)
  let S = (0, mu.useMemo)(() => ({ anchor: [b, x].filter(Boolean).join(` `) }), [b, x]),
    { getReferenceProps: C, getFloatingProps: w } = kl([jl(y, { overflowRef: o, onChange: a })]),
    T = N((e) => {
      ;(c(e), _.setFloating(e))
    })
  return pu.createElement(
    gu.Provider,
    { value: r },
    pu.createElement(
      hu.Provider,
      {
        value: {
          setFloating: T,
          setReference: _.setReference,
          styles: v,
          getReferenceProps: C,
          getFloatingProps: w,
          slot: S,
        },
      },
      e
    )
  )
}
function cu(e) {
  M(() => {
    if (!e) return
    let t = new MutationObserver(() => {
      let t = window.getComputedStyle(e).maxHeight,
        n = parseFloat(t)
      if (isNaN(n)) return
      let r = parseInt(t)
      isNaN(r) || (n !== r && (e.style.maxHeight = `${Math.ceil(n)}px`))
    })
    return (
      t.observe(e, { attributes: !0, attributeFilter: [`style`] }),
      () => {
        t.disconnect()
      }
    )
  }, [e])
}
function lu(e, t) {
  let n = uu(e?.gap ?? `var(--anchor-gap, 0)`, t),
    r = uu(e?.offset ?? `var(--anchor-offset, 0)`, t),
    i = uu(e?.padding ?? `var(--anchor-padding, 0)`, t)
  return { ...e, gap: n, offset: r, padding: i }
}
function uu(e, t, n = void 0) {
  let r = kt(),
    i = N((e, t) => {
      if (e == null) return [n, null]
      if (typeof e == `number`) return [e, null]
      if (typeof e == `string`) {
        if (!t) return [n, null]
        let i = fu(e, t)
        return [
          i,
          (n) => {
            let a = du(e)
            {
              let o = a.map((e) => window.getComputedStyle(t).getPropertyValue(e))
              r.requestAnimationFrame(function s() {
                r.nextFrame(s)
                let c = !1
                for (let [e, n] of a.entries()) {
                  let r = window.getComputedStyle(t).getPropertyValue(n)
                  if (o[e] !== r) {
                    ;((o[e] = r), (c = !0))
                    break
                  }
                }
                if (!c) return
                let l = fu(e, t)
                i !== l && (n(l), (i = l))
              })
            }
            return r.dispose
          },
        ]
      }
      return [n, null]
    }),
    a = (0, mu.useMemo)(() => i(e, t)[0], [e, t]),
    [o = a, s] = (0, mu.useState)()
  return (
    M(() => {
      let [n, r] = i(e, t)
      if ((s(n), r)) return r(s)
    }, [e, t]),
    o
  )
}
function du(e) {
  let t = /var\((.*)\)/.exec(e)
  if (t) {
    let e = t[1].indexOf(`,`)
    if (e === -1) return [t[1]]
    let n = t[1].slice(0, e).trim(),
      r = t[1].slice(e + 1).trim()
    return r ? [n, ...du(r)] : [n]
  }
  return []
}
function fu(e, t) {
  let n = document.createElement(`div`)
  ;(t.appendChild(n),
    n.style.setProperty(`margin-top`, `0px`, `important`),
    n.style.setProperty(`margin-top`, e, `important`))
  let r = parseFloat(window.getComputedStyle(n).marginTop) || 0
  return (t.removeChild(n), r)
}
var pu,
  mu,
  hu,
  gu,
  _u,
  vu = t(() => {
    ;(tu(),
      (pu = e(r(), 1)),
      (mu = e(r(), 1)),
      jt(),
      P(),
      Nt(),
      ur(),
      (hu = (0, mu.createContext)({
        styles: void 0,
        setReference: () => {},
        setFloating: () => {},
        getReferenceProps: () => ({}),
        getFloatingProps: () => ({}),
        slot: {},
      })),
      (hu.displayName = `FloatingContext`),
      (gu = (0, mu.createContext)(null)),
      (gu.displayName = `PlacementContext`),
      (_u = 4))
  })
function yu({ children: e, freeze: t }, n) {
  let r = bu(t, e)
  return (0, xu.isValidElement)(r)
    ? (0, xu.cloneElement)(r, { ref: n })
    : xu.createElement(xu.Fragment, null, r)
}
function bu(e, t) {
  let [n, r] = (0, xu.useState)(t)
  return (!e && n !== t && r(t), e ? n : t)
}
var xu,
  Su,
  Cu = t(() => {
    ;((xu = e(r(), 1)), (Su = xu.forwardRef(yu)))
  })
function wu() {
  return (0, Du.useContext)(Ou)
}
function Tu({ value: e, children: t }) {
  return Du.createElement(Ou.Provider, { value: e }, t)
}
function Eu({ children: e }) {
  return Du.createElement(Ou.Provider, { value: null }, e)
}
var Du,
  Ou,
  G,
  ku = t(() => {
    ;((Du = e(r(), 1)),
      (Ou = (0, Du.createContext)(null)),
      (Ou.displayName = `OpenClosedContext`),
      (G = ((e) => (
        (e[(e.Open = 1)] = `Open`),
        (e[(e.Closed = 2)] = `Closed`),
        (e[(e.Closing = 4)] = `Closing`),
        (e[(e.Opening = 8)] = `Opening`),
        e
      ))(G || {})))
  })
function Au(e) {
  function t() {
    document.readyState !== `loading` && (e(), document.removeEventListener(`DOMContentLoaded`, t))
  }
  typeof window < `u` &&
    typeof document < `u` &&
    (document.addEventListener(`DOMContentLoaded`, t), t())
}
var ju = t(() => {}),
  Mu,
  Nu = t(() => {
    ;(ju(),
      ur(),
      Ga(),
      (Mu = []),
      Au(() => {
        function e(e) {
          if (!nr(e.target) || e.target === document.body || Mu[0] === e.target) return
          let t = e.target
          ;((t = t.closest(Ra)),
            Mu.unshift(t ?? e.target),
            (Mu = Mu.filter((e) => e != null && e.isConnected)),
            Mu.splice(10))
        }
        ;(window.addEventListener(`click`, e, { capture: !0 }),
          window.addEventListener(`mousedown`, e, { capture: !0 }),
          window.addEventListener(`focus`, e, { capture: !0 }),
          document.body.addEventListener(`click`, e, { capture: !0 }),
          document.body.addEventListener(`mousedown`, e, { capture: !0 }),
          document.body.addEventListener(`focus`, e, { capture: !0 }))
      }))
  })
function Pu(e) {
  throw Error(`Unexpected object: ` + e)
}
function Fu(e, t) {
  let n = t.resolveItems()
  if (n.length <= 0) return null
  let r = t.resolveActiveIndex(),
    i = r ?? -1
  switch (e.focus) {
    case 0:
      for (let e = 0; e < n.length; ++e) if (!t.resolveDisabled(n[e], e, n)) return e
      return r
    case 1:
      i === -1 && (i = n.length)
      for (let e = i - 1; e >= 0; --e) if (!t.resolveDisabled(n[e], e, n)) return e
      return r
    case 2:
      for (let e = i + 1; e < n.length; ++e) if (!t.resolveDisabled(n[e], e, n)) return e
      return r
    case 3:
      for (let e = n.length - 1; e >= 0; --e) if (!t.resolveDisabled(n[e], e, n)) return e
      return r
    case 4:
      for (let r = 0; r < n.length; ++r) if (t.resolveId(n[r], r, n) === e.id) return r
      return r
    case 5:
      return null
    default:
      Pu(e)
  }
}
var K,
  Iu = t(() => {
    K = ((e) => (
      (e[(e.First = 0)] = `First`),
      (e[(e.Previous = 1)] = `Previous`),
      (e[(e.Next = 2)] = `Next`),
      (e[(e.Last = 3)] = `Last`),
      (e[(e.Specific = 4)] = `Specific`),
      (e[(e.Nothing = 5)] = `Nothing`),
      e
    ))(K || {})
  })
function Lu(e) {
  let t = N(e),
    n = (0, Ru.useRef)(!1)
  ;(0, Ru.useEffect)(
    () => (
      (n.current = !1),
      () => {
        ;((n.current = !0),
          Tt(() => {
            n.current && t()
          }))
      }
    ),
    [t]
  )
}
var Ru,
  zu = t(() => {
    ;((Ru = e(r(), 1)), Et(), P())
  })
function Bu() {
  let e = typeof document > `u`
  return `useSyncExternalStore` in Hu
    ? ((e) => e.useSyncExternalStore)(Hu)(
        () => () => {},
        () => !1,
        () => !e
      )
    : !1
}
function Vu() {
  let e = Bu(),
    [t, n] = Hu.useState(vt.isHandoffComplete)
  return (
    t && vt.isHandoffComplete === !1 && n(!1),
    Hu.useEffect(() => {
      t !== !0 && n(!0)
    }, [t]),
    Hu.useEffect(() => vt.handoff(), []),
    e ? !1 : t
  )
}
var Hu,
  Uu = t(() => {
    ;((Hu = e(r(), 1)), yt())
  })
function Wu() {
  return (0, Ku.useContext)(qu)
}
function Gu(e) {
  return Ku.createElement(qu.Provider, { value: e.force }, e.children)
}
var Ku,
  qu,
  Ju = t(() => {
    ;((Ku = e(r(), 1)), (qu = (0, Ku.createContext)(!1)))
  })
function Yu(e) {
  let t = Wu(),
    n = (0, $u.useContext)(id),
    [r, i] = (0, $u.useState)(() => {
      if (!t && n !== null) return n.current ?? null
      if (vt.isServer) return null
      let r = e?.getElementById(`headlessui-portal-root`)
      if (r) return r
      if (e === null) return null
      let i = e.createElement(`div`)
      return (i.setAttribute(`id`, `headlessui-portal-root`), e.body.appendChild(i))
    })
  return (
    (0, $u.useEffect)(() => {
      r !== null && ((e != null && e.body.contains(r)) || e == null || e.body.appendChild(r))
    }, [r, e]),
    (0, $u.useEffect)(() => {
      t || (n !== null && i(n.current))
    }, [n, i, t]),
    r
  )
}
function Xu(e, t) {
  let n = B(t),
    { enabled: r = !0, ownerDocument: i, ...a } = e,
    o = L()
  return r
    ? $u.createElement(nd, { ...a, ownerDocument: i, ref: n })
    : o({ ourProps: { ref: n }, theirProps: a, slot: {}, defaultTag: td, name: `Portal` })
}
function Zu(e, t) {
  let { target: n, ...r } = e,
    i = { ref: B(t) },
    a = L()
  return $u.createElement(
    id.Provider,
    { value: n },
    a({ ourProps: i, theirProps: r, defaultTag: rd, name: `Popover.Group` })
  )
}
function Qu() {
  let e = (0, $u.useContext)(ad),
    t = (0, $u.useRef)([]),
    n = N((n) => (t.current.push(n), e && e.register(n), () => r(n))),
    r = N((n) => {
      let r = t.current.indexOf(n)
      ;(r !== -1 && t.current.splice(r, 1), e && e.unregister(n))
    }),
    i = (0, $u.useMemo)(() => ({ register: n, unregister: r, portals: t }), [n, r, t])
  return [
    t,
    (0, $u.useMemo)(
      () =>
        function ({ children: e }) {
          return $u.createElement(ad.Provider, { value: i }, e)
        },
      [i]
    ),
  ]
}
var $u,
  ed,
  td,
  nd,
  rd,
  id,
  ad,
  od,
  sd,
  cd,
  ld = t(() => {
    ;(($u = e(r(), 1)),
      (ed = e(a(), 1)),
      jt(),
      P(),
      zu(),
      lo(),
      Uu(),
      _r(),
      Ju(),
      yt(),
      hn(),
      (td = $u.Fragment),
      (nd = R(function (e, t) {
        let { ownerDocument: n = null, ...r } = e,
          i = (0, $u.useRef)(null),
          a = B(
            mr((e) => {
              i.current = e
            }),
            t
          ),
          o = oo(i.current),
          s = Yu(n ?? o),
          c = (0, $u.useContext)(ad),
          l = kt(),
          u = Vu(),
          d = L()
        return (
          Lu(() => {
            var e
            s && s.childNodes.length <= 0 && ((e = s.parentElement) == null || e.removeChild(s))
          }),
          !s || !u
            ? null
            : (0, ed.createPortal)(
                $u.createElement(
                  `div`,
                  {
                    'data-headlessui-portal': ``,
                    ref: (e) => {
                      ;(l.dispose(), c && e && l.add(c.register(e)))
                    },
                  },
                  d({
                    ourProps: { ref: a },
                    theirProps: r,
                    slot: {},
                    defaultTag: td,
                    name: `Portal`,
                  })
                ),
                s
              )
        )
      })),
      (rd = $u.Fragment),
      (id = (0, $u.createContext)(null)),
      (ad = (0, $u.createContext)(null)),
      (od = R(Xu)),
      (sd = R(Zu)),
      (cd = Object.assign(od, { Group: sd })))
  })
function ud(e) {
  let t = e.getBoundingClientRect()
  return `${t.x},${t.y}`
}
function dd(e, t, n) {
  let r = Dt()
  if (t.kind === `Tracked`) {
    let i = function () {
        a !== ud(e) && (r.dispose(), n())
      },
      { position: a } = t,
      o = new ResizeObserver(i)
    ;(o.observe(e),
      r.add(() => o.disconnect()),
      r.addEventListener(window, `scroll`, i, { passive: !0 }),
      r.addEventListener(window, `resize`, i))
  }
  return () => r.dispose()
}
var fd,
  pd = t(() => {
    ;(Ot(),
      (fd = {
        Idle: { kind: `Idle` },
        Tracked: (e) => ({ kind: `Tracked`, position: e }),
        Moved: { kind: `Moved` },
      }))
  })
function md(e, t = (e) => e) {
  let n = e.activeOptionIndex === null ? null : e.options[e.activeOptionIndex],
    r = t(e.options.slice()),
    i =
      r.length > 0 && r[0].dataRef.current.order !== null
        ? r.sort((e, t) => e.dataRef.current.order - t.dataRef.current.order)
        : Fa(r, (e) => e.dataRef.current.domRef.current),
    a = n ? i.indexOf(n) : null
  return (a === -1 && (a = null), { options: i, activeOptionIndex: a })
}
var hd,
  gd,
  _d,
  q,
  vd,
  yd,
  bd,
  xd,
  Sd,
  Cd = t(() => {
    ;(ra(),
      da(),
      Iu(),
      pd(),
      Ga(),
      Qt(),
      (hd = Object.defineProperty),
      (gd = (e, t, n) =>
        t in e
          ? hd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
          : (e[t] = n)),
      (_d = (e, t, n) => (gd(e, typeof t == `symbol` ? t : t + ``, n), n)),
      (q = ((e) => ((e[(e.Open = 0)] = `Open`), (e[(e.Closed = 1)] = `Closed`), e))(q || {})),
      (vd = ((e) => ((e[(e.Single = 0)] = `Single`), (e[(e.Multi = 1)] = `Multi`), e))(vd || {})),
      (yd = ((e) => (
        (e[(e.Pointer = 0)] = `Pointer`),
        (e[(e.Focus = 1)] = `Focus`),
        (e[(e.Other = 2)] = `Other`),
        e
      ))(yd || {})),
      (bd = ((e) => (
        (e[(e.OpenCombobox = 0)] = `OpenCombobox`),
        (e[(e.CloseCombobox = 1)] = `CloseCombobox`),
        (e[(e.GoToOption = 2)] = `GoToOption`),
        (e[(e.SetTyping = 3)] = `SetTyping`),
        (e[(e.RegisterOption = 4)] = `RegisterOption`),
        (e[(e.UnregisterOption = 5)] = `UnregisterOption`),
        (e[(e.DefaultToFirstOption = 6)] = `DefaultToFirstOption`),
        (e[(e.SetActivationTrigger = 7)] = `SetActivationTrigger`),
        (e[(e.UpdateVirtualConfiguration = 8)] = `UpdateVirtualConfiguration`),
        (e[(e.SetInputElement = 9)] = `SetInputElement`),
        (e[(e.SetButtonElement = 10)] = `SetButtonElement`),
        (e[(e.SetOptionsElement = 11)] = `SetOptionsElement`),
        (e[(e.MarkInputAsMoved = 12)] = `MarkInputAsMoved`),
        e
      ))(bd || {})),
      (xd = {
        1(e) {
          var t
          if (((t = e.dataRef.current) != null && t.disabled) || e.comboboxState === 1) return e
          let n = e.inputElement ? fd.Tracked(ud(e.inputElement)) : e.inputPositionState
          return {
            ...e,
            activeOptionIndex: null,
            comboboxState: 1,
            isTyping: !1,
            activationTrigger: 2,
            inputPositionState: n,
            __demoMode: !1,
          }
        },
        0(e) {
          var t, n
          if (((t = e.dataRef.current) != null && t.disabled) || e.comboboxState === 0) return e
          if ((n = e.dataRef.current) != null && n.value) {
            let t = e.dataRef.current.calculateIndex(e.dataRef.current.value)
            if (t !== -1)
              return {
                ...e,
                activeOptionIndex: t,
                comboboxState: 0,
                __demoMode: !1,
                inputPositionState: fd.Idle,
              }
          }
          return { ...e, comboboxState: 0, inputPositionState: fd.Idle, __demoMode: !1 }
        },
        3(e, t) {
          return e.isTyping === t.isTyping ? e : { ...e, isTyping: t.isTyping }
        },
        2(e, t) {
          var n, r
          if (
            ((n = e.dataRef.current) != null && n.disabled) ||
            (e.optionsElement &&
              !((r = e.dataRef.current) != null && r.optionsPropsRef.current.static) &&
              e.comboboxState === 1)
          )
            return e
          if (e.virtual) {
            let { options: n, disabled: r } = e.virtual,
              i =
                t.focus === K.Specific
                  ? t.idx
                  : Fu(t, {
                      resolveItems: () => n,
                      resolveActiveIndex: () =>
                        e.activeOptionIndex ?? n.findIndex((e) => !r(e)) ?? null,
                      resolveDisabled: r,
                      resolveId() {
                        throw Error(`Function not implemented.`)
                      },
                    }),
              a = t.trigger ?? 2
            return e.activeOptionIndex === i && e.activationTrigger === a
              ? e
              : { ...e, activeOptionIndex: i, activationTrigger: a, isTyping: !1, __demoMode: !1 }
          }
          let i = md(e)
          if (i.activeOptionIndex === null) {
            let e = i.options.findIndex((e) => !e.dataRef.current.disabled)
            e !== -1 && (i.activeOptionIndex = e)
          }
          let a =
              t.focus === K.Specific
                ? t.idx
                : Fu(t, {
                    resolveItems: () => i.options,
                    resolveActiveIndex: () => i.activeOptionIndex,
                    resolveId: (e) => e.id,
                    resolveDisabled: (e) => e.dataRef.current.disabled,
                  }),
            o = t.trigger ?? 2
          return e.activeOptionIndex === a && e.activationTrigger === o
            ? e
            : {
                ...e,
                ...i,
                isTyping: !1,
                activeOptionIndex: a,
                activationTrigger: o,
                __demoMode: !1,
              }
        },
        4: (e, t) => {
          var n, r, i, a
          if ((n = e.dataRef.current) != null && n.virtual)
            return { ...e, options: [...e.options, t.payload] }
          let o = t.payload,
            s = md(e, (e) => (e.push(o), e))
          e.activeOptionIndex === null &&
            (i = (r = e.dataRef.current).isSelected) != null &&
            i.call(r, t.payload.dataRef.current.value) &&
            (s.activeOptionIndex = s.options.indexOf(o))
          let c = { ...e, ...s, activationTrigger: 2 }
          return (
            (a = e.dataRef.current) != null &&
              a.__demoMode &&
              e.dataRef.current.value === void 0 &&
              (c.activeOptionIndex = 0),
            c
          )
        },
        5: (e, t) => {
          var n
          if ((n = e.dataRef.current) != null && n.virtual)
            return { ...e, options: e.options.filter((e) => e.id !== t.id) }
          let r = md(e, (e) => {
            let n = e.findIndex((e) => e.id === t.id)
            return (n !== -1 && e.splice(n, 1), e)
          })
          return { ...e, ...r, activationTrigger: 2 }
        },
        6: (e, t) =>
          e.defaultToFirstOption === t.value ? e : { ...e, defaultToFirstOption: t.value },
        7: (e, t) =>
          e.activationTrigger === t.trigger ? e : { ...e, activationTrigger: t.trigger },
        8: (e, t) => {
          if (e.virtual === null)
            return { ...e, virtual: { options: t.options, disabled: t.disabled ?? (() => !1) } }
          if (e.virtual.options === t.options && e.virtual.disabled === t.disabled) return e
          let n = e.activeOptionIndex
          if (e.activeOptionIndex !== null) {
            let r = t.options.indexOf(e.virtual.options[e.activeOptionIndex])
            n = r === -1 ? null : r
          }
          return {
            ...e,
            activeOptionIndex: n,
            virtual: { options: t.options, disabled: t.disabled ?? (() => !1) },
          }
        },
        9: (e, t) => (e.inputElement === t.element ? e : { ...e, inputElement: t.element }),
        10: (e, t) => (e.buttonElement === t.element ? e : { ...e, buttonElement: t.element }),
        11: (e, t) => (e.optionsElement === t.element ? e : { ...e, optionsElement: t.element }),
        12(e) {
          return e.inputPositionState.kind === `Tracked`
            ? { ...e, inputPositionState: fd.Moved }
            : e
        },
      }),
      (Sd = class e extends na {
        constructor(e) {
          ;(super(e),
            _d(this, `actions`, {
              onChange: (e) => {
                let { onChange: t, compare: n, mode: r, value: i } = this.state.dataRef.current
                return I(r, {
                  0: () => t?.(e),
                  1: () => {
                    let r = i.slice(),
                      a = r.findIndex((t) => n(t, e))
                    return (a === -1 ? r.push(e) : r.splice(a, 1), t?.(r))
                  },
                })
              },
              registerOption: (e, t) => (
                this.send({ type: 4, payload: { id: e, dataRef: t } }),
                () => {
                  ;(this.state.activeOptionIndex ===
                    this.state.dataRef.current.calculateIndex(t.current.value) &&
                    this.send({ type: 6, value: !0 }),
                    this.send({ type: 5, id: e }))
                }
              ),
              goToOption: (e, t) => (
                this.send({ type: 6, value: !1 }),
                this.send({ type: 2, ...e, trigger: t })
              ),
              setIsTyping: (e) => {
                this.send({ type: 3, isTyping: e })
              },
              closeCombobox: () => {
                var e, t
                ;(this.send({ type: 1 }),
                  this.send({ type: 6, value: !1 }),
                  (t = (e = this.state.dataRef.current).onClose) == null || t.call(e))
              },
              openCombobox: () => {
                ;(this.send({ type: 0 }), this.send({ type: 6, value: !0 }))
              },
              setActivationTrigger: (e) => {
                this.send({ type: 7, trigger: e })
              },
              selectActiveOption: () => {
                let e = this.selectors.activeOptionIndex(this.state)
                if (e !== null) {
                  if ((this.actions.setIsTyping(!1), this.state.virtual))
                    this.actions.onChange(this.state.virtual.options[e])
                  else {
                    let { dataRef: t } = this.state.options[e]
                    this.actions.onChange(t.current.value)
                  }
                  this.actions.goToOption({ focus: K.Specific, idx: e })
                }
              },
              setInputElement: (e) => {
                this.send({ type: 9, element: e })
              },
              setButtonElement: (e) => {
                this.send({ type: 10, element: e })
              },
              setOptionsElement: (e) => {
                this.send({ type: 11, element: e })
              },
            }),
            _d(this, `selectors`, {
              activeDescendantId: (e) => {
                let t = this.selectors.activeOptionIndex(e)
                if (t !== null)
                  return e.virtual
                    ? e.options.find(
                        (n) =>
                          !n.dataRef.current.disabled &&
                          e.dataRef.current.compare(n.dataRef.current.value, e.virtual.options[t])
                      )?.id
                    : e.options[t]?.id
              },
              activeOptionIndex: (e) => {
                if (
                  e.defaultToFirstOption &&
                  e.activeOptionIndex === null &&
                  (e.virtual ? e.virtual.options.length > 0 : e.options.length > 0)
                ) {
                  if (e.virtual) {
                    let { options: t, disabled: n } = e.virtual,
                      r = t.findIndex((e) => {
                        var t
                        return !((t = n?.(e)) != null && t)
                      })
                    if (r !== -1) return r
                  }
                  let t = e.options.findIndex((e) => !e.dataRef.current.disabled)
                  if (t !== -1) return t
                }
                return e.activeOptionIndex
              },
              activeOption: (e) => {
                let t = this.selectors.activeOptionIndex(e)
                return t === null
                  ? null
                  : e.virtual
                    ? e.virtual.options[t ?? 0]
                    : (e.options[t]?.dataRef.current.value ?? null)
              },
              isActive: (e, t, n) => {
                let r = this.selectors.activeOptionIndex(e)
                return r === null
                  ? !1
                  : e.virtual
                    ? r === e.dataRef.current.calculateIndex(t)
                    : e.options[r]?.id === n
              },
              shouldScrollIntoView: (e, t, n) =>
                !(
                  e.virtual ||
                  e.__demoMode ||
                  e.comboboxState !== 0 ||
                  e.activationTrigger === 0 ||
                  !this.selectors.isActive(e, t, n)
                ),
              didInputMove(e) {
                return e.inputPositionState.kind === `Moved`
              },
            }))
          {
            let e = this.state.id,
              t = ua.get(null)
            ;(this.disposables.add(
              t.on(sa.Push, (n) => {
                !t.selectors.isTop(n, e) &&
                  this.state.comboboxState === 0 &&
                  this.actions.closeCombobox()
              })
            ),
              this.on(0, () => t.actions.push(e)),
              this.on(1, () => t.actions.pop(e)))
          }
          this.disposables.group((e) => {
            this.on(1, (t) => {
              t.inputElement &&
                (e.dispose(),
                e.add(
                  dd(t.inputElement, t.inputPositionState, () => {
                    this.send({ type: 12 })
                  })
                ))
            })
          })
        }
        static new({ id: t, virtual: n = null, __demoMode: r = !1 }) {
          return new e({
            id: t,
            dataRef: { current: {} },
            comboboxState: +!r,
            isTyping: !1,
            options: [],
            virtual: n ? { options: n.options, disabled: n.disabled ?? (() => !1) } : null,
            activeOptionIndex: null,
            activationTrigger: 2,
            inputElement: null,
            buttonElement: null,
            optionsElement: null,
            __demoMode: r,
            inputPositionState: fd.Idle,
          })
        }
        reduce(e, t) {
          return I(t.type, xd, e, t)
        }
      }))
  })
function wd(e) {
  let t = (0, Ed.useContext)(Dd)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <Combobox /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, Td), t)
  }
  return t
}
function Td({ id: e, virtual: t = null, __demoMode: n = !1 }) {
  let r = (0, Ed.useMemo)(() => Sd.new({ id: e, virtual: t, __demoMode: n }), [])
  return (Lu(() => r.dispose()), r)
}
var Ed,
  Dd,
  Od = t(() => {
    ;((Ed = e(r(), 1)), zu(), Cd(), (Dd = (0, Ed.createContext)(null)))
  })
function kd(e) {
  let t = (0, J.useContext)(Ld)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <Combobox /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, kd), t)
  }
  return t
}
function Ad(e) {
  let t = wd(`VirtualProvider`),
    { options: n } = kd(`VirtualProvider`).virtual,
    r = H(t, (e) => e.optionsElement),
    [i, a] = (0, J.useMemo)(() => {
      let e = r
      if (!e) return [0, 0]
      let t = window.getComputedStyle(e)
      return [
        parseFloat(t.paddingBlockStart || t.paddingTop),
        parseFloat(t.paddingBlockEnd || t.paddingBottom),
      ]
    }, [r]),
    o = Si({
      enabled: n.length !== 0,
      scrollPaddingStart: i,
      scrollPaddingEnd: a,
      count: n.length,
      estimateSize() {
        return 40
      },
      getScrollElement() {
        return t.state.optionsElement
      },
      overscan: 12,
    }),
    [s, c] = (0, J.useState)(0)
  M(() => {
    c((e) => e + 1)
  }, [n])
  let l = o.getVirtualItems(),
    u = H(t, (e) => e.activationTrigger === yd.Pointer),
    d = H(t, t.selectors.activeOptionIndex)
  return l.length === 0
    ? null
    : J.createElement(
        Rd.Provider,
        { value: o },
        J.createElement(
          `div`,
          {
            style: { position: `relative`, width: `100%`, height: `${o.getTotalSize()}px` },
            ref: (e) => {
              e && (u || (d !== null && n.length > d && o.scrollToIndex(d)))
            },
          },
          l.map((t) =>
            J.createElement(
              J.Fragment,
              { key: t.key },
              J.cloneElement(e.children?.call(e, { ...e.slot, option: n[t.index] }), {
                key: `${s}-${t.key}`,
                'data-index': t.index,
                'aria-setsize': n.length,
                'aria-posinset': t.index + 1,
                style: {
                  position: `absolute`,
                  top: 0,
                  left: 0,
                  transform: `translateY(${t.start}px)`,
                  overflowAnchor: `none`,
                },
              })
            )
          )
        )
      )
}
function jd(e, t) {
  let n = (0, z.useId)(),
    r = Gt(),
    {
      value: i,
      defaultValue: a,
      onChange: o,
      form: s,
      name: c,
      by: l,
      invalid: u = !1,
      disabled: d = r || !1,
      onClose: f,
      __demoMode: p = !1,
      multiple: m = !1,
      immediate: h = !1,
      virtual: g = null,
      nullable: _,
      ...v
    } = e,
    y = wn(a),
    [b = m ? [] : void 0, x] = bn(i, o, y),
    S = Td({ id: n, virtual: g, __demoMode: p }),
    C = (0, J.useRef)({ static: !1, hold: !1 }),
    w = Oi(l),
    T = N((e) =>
      g
        ? l === null
          ? g.options.indexOf(e)
          : g.options.findIndex((t) => w(t, e))
        : S.state.options.findIndex((t) => w(t.dataRef.current.value, e))
    ),
    E = (0, J.useCallback)(
      (e) => I(k.mode, { [vd.Multi]: () => b.some((t) => w(t, e)), [vd.Single]: () => w(b, e) }),
      [b]
    ),
    D = H(S, (e) => e.virtual),
    O = N(() => f?.()),
    k = (0, J.useMemo)(
      () => ({
        __demoMode: p,
        immediate: h,
        optionsPropsRef: C,
        value: b,
        defaultValue: y,
        disabled: d,
        invalid: u,
        mode: m ? vd.Multi : vd.Single,
        virtual: g ? D : null,
        onChange: x,
        isSelected: E,
        calculateIndex: T,
        compare: w,
        onClose: O,
      }),
      [p, h, C, b, y, d, u, m, g, D, x, E, T, w, O]
    )
  ;(M(() => {
    g &&
      S.send({
        type: bd.UpdateVirtualConfiguration,
        options: g.options,
        disabled: g.disabled ?? null,
      })
  }, [g, g?.options, g?.disabled]),
    M(() => {
      S.state.dataRef.current = k
    }, [k]))
  let [A, ee, te, ne] = H(S, (e) => [
      e.comboboxState,
      e.buttonElement,
      e.inputElement,
      e.optionsElement,
    ]),
    re = ua.get(null)
  no(
    H(
      re,
      (0, J.useCallback)((e) => re.selectors.isTop(e, n), [re, n])
    ),
    [ee, te, ne],
    () => S.actions.closeCombobox()
  )
  let ie = H(S, S.selectors.activeOptionIndex),
    ae = H(S, S.selectors.activeOption),
    j = F({
      open: A === q.Open,
      disabled: d,
      invalid: u,
      activeIndex: ie,
      activeOption: ae,
      value: b,
    }),
    [oe, se] = jr(),
    ce = t === null ? {} : { ref: t },
    le = (0, J.useCallback)(() => {
      if (y !== void 0) return x?.(y)
    }, [x, y]),
    ue = L()
  return J.createElement(
    se,
    { value: oe, props: { htmlFor: te?.id }, slot: { open: A === q.Open, disabled: d } },
    J.createElement(
      su,
      null,
      J.createElement(
        Ld.Provider,
        { value: k },
        J.createElement(
          Dd.Provider,
          { value: S },
          J.createElement(
            Tu,
            { value: I(A, { [q.Open]: G.Open, [q.Closed]: G.Closed }) },
            c != null &&
              J.createElement(Hn, {
                disabled: d,
                data: b == null ? {} : { [c]: b },
                form: s,
                onReset: le,
              }),
            ue({ ourProps: ce, theirProps: v, slot: j, defaultTag: zd, name: `Combobox` })
          )
        )
      )
    )
  )
}
function Md(e, t) {
  let n = wd(`Combobox.Input`),
    r = kd(`Combobox.Input`),
    i = (0, z.useId)(),
    a = Jn(),
    {
      id: o = a || `headlessui-combobox-input-${i}`,
      onChange: s,
      displayValue: c,
      disabled: l = r.disabled || !1,
      autoFocus: u = !1,
      type: d = `text`,
      ...f
    } = e,
    p = (0, J.useRef)(null),
    m = B(p, t, ru(), n.actions.setInputElement),
    [h, g] = H(n, (e) => [e.comboboxState, e.isTyping]),
    _ = kt(),
    v = N(() => {
      ;(n.actions.onChange(null),
        n.state.optionsElement && (n.state.optionsElement.scrollTop = 0),
        n.actions.goToOption({ focus: K.Nothing }))
    })
  ;(us(
    ([e, t], [r, i]) => {
      if (n.state.isTyping) return
      let a = p.current
      a &&
        (((i === q.Open && t === q.Closed) || e !== r) && (a.value = e),
        requestAnimationFrame(() => {
          if (n.state.isTyping || !a || Ct(a)) return
          let { selectionStart: e, selectionEnd: t } = a
          Math.abs((t ?? 0) - (e ?? 0)) === 0 &&
            e === 0 &&
            a.setSelectionRange(a.value.length, a.value.length)
        }))
    },
    [
      (0, J.useMemo)(
        () =>
          typeof c == `function` && r.value !== void 0
            ? (c(r.value) ?? ``)
            : typeof r.value == `string`
              ? r.value
              : ``,
        [r.value, c]
      ),
      h,
      g,
    ]
  ),
    us(
      ([e], [t]) => {
        if (e === q.Open && t === q.Closed) {
          if (n.state.isTyping) return
          let e = p.current
          if (!e) return
          let t = e.value,
            { selectionStart: r, selectionEnd: i, selectionDirection: a } = e
          ;((e.value = ``),
            (e.value = t),
            a === null ? e.setSelectionRange(r, i) : e.setSelectionRange(r, i, a))
        }
      },
      [h]
    ))
  let y = (0, J.useRef)(!1),
    b = N(() => {
      y.current = !0
    }),
    x = N(() => {
      _.nextFrame(() => {
        y.current = !1
      })
    }),
    S = N((e) => {
      switch ((n.actions.setIsTyping(!0), e.key)) {
        case V.Enter:
          if (n.state.comboboxState !== q.Open || y.current) return
          if (
            (e.preventDefault(),
            e.stopPropagation(),
            n.selectors.activeOptionIndex(n.state) === null)
          ) {
            n.actions.closeCombobox()
            return
          }
          ;(n.actions.selectActiveOption(), r.mode === vd.Single && n.actions.closeCombobox())
          break
        case V.ArrowDown:
          return (
            e.preventDefault(),
            e.stopPropagation(),
            I(n.state.comboboxState, {
              [q.Open]: () => n.actions.goToOption({ focus: K.Next }),
              [q.Closed]: () => n.actions.openCombobox(),
            })
          )
        case V.ArrowUp:
          return (
            e.preventDefault(),
            e.stopPropagation(),
            I(n.state.comboboxState, {
              [q.Open]: () => n.actions.goToOption({ focus: K.Previous }),
              [q.Closed]: () => {
                ;((0, Id.flushSync)(() => n.actions.openCombobox()),
                  r.value || n.actions.goToOption({ focus: K.Last }))
              },
            })
          )
        case V.Home:
          if (n.state.comboboxState === q.Closed || e.shiftKey) break
          return (e.preventDefault(), e.stopPropagation(), n.actions.goToOption({ focus: K.First }))
        case V.PageUp:
          return (e.preventDefault(), e.stopPropagation(), n.actions.goToOption({ focus: K.First }))
        case V.End:
          if (n.state.comboboxState === q.Closed || e.shiftKey) break
          return (e.preventDefault(), e.stopPropagation(), n.actions.goToOption({ focus: K.Last }))
        case V.PageDown:
          return (e.preventDefault(), e.stopPropagation(), n.actions.goToOption({ focus: K.Last }))
        case V.Escape:
          return n.state.comboboxState === q.Open
            ? (e.preventDefault(),
              n.state.optionsElement && !r.optionsPropsRef.current.static && e.stopPropagation(),
              r.mode === vd.Single && r.value === null && v(),
              n.actions.closeCombobox())
            : void 0
        case V.Tab:
          if ((n.actions.setIsTyping(!1), n.state.comboboxState !== q.Open)) return
          ;(r.mode === vd.Single &&
            n.state.activationTrigger !== yd.Focus &&
            n.actions.selectActiveOption(),
            n.actions.closeCombobox())
          break
      }
    }),
    C = N((e) => {
      ;(s?.(e), r.mode === vd.Single && e.target.value === `` && v(), n.actions.openCombobox())
    }),
    w = N((e) => {
      var t, i
      let a = e.relatedTarget ?? Mu.find((t) => t !== e.currentTarget)
      if (
        !((t = n.state.optionsElement) != null && t.contains(a)) &&
        !((i = n.state.buttonElement) != null && i.contains(a)) &&
        n.state.comboboxState === q.Open
      )
        return (
          e.preventDefault(),
          r.mode === vd.Single && r.value === null && v(),
          n.actions.closeCombobox()
        )
    }),
    T = N((e) => {
      var t, i
      let a = e.relatedTarget ?? Mu.find((t) => t !== e.currentTarget)
      ;((t = n.state.buttonElement) != null && t.contains(a)) ||
        ((i = n.state.optionsElement) != null && i.contains(a)) ||
        r.disabled ||
        (r.immediate &&
          n.state.comboboxState !== q.Open &&
          _.microTask(() => {
            ;((0, Id.flushSync)(() => n.actions.openCombobox()),
              n.actions.setActivationTrigger(yd.Focus))
          }))
    }),
    E = Ar(),
    D = yr(),
    { isFocused: O, focusProps: k } = $e({ autoFocus: u }),
    { isHovered: A, hoverProps: ee } = st({ isDisabled: l }),
    te = H(n, (e) => e.optionsElement),
    ne = F({
      open: h === q.Open,
      disabled: l,
      invalid: r.invalid,
      hover: A,
      focus: O,
      autofocus: u,
    }),
    re = an(
      {
        ref: m,
        id: o,
        role: `combobox`,
        type: d,
        'aria-controls': te?.id,
        'aria-expanded': h === q.Open,
        'aria-activedescendant': H(n, n.selectors.activeDescendantId),
        'aria-labelledby': E,
        'aria-describedby': D,
        'aria-autocomplete': `list`,
        defaultValue:
          e.defaultValue ??
          (r.defaultValue === void 0 ? null : c?.(r.defaultValue)) ??
          r.defaultValue,
        disabled: l || void 0,
        autoFocus: u,
        onCompositionStart: b,
        onCompositionEnd: x,
        onKeyDown: S,
        onChange: C,
        onFocus: T,
        onBlur: w,
      },
      k,
      ee
    )
  return L()({ ourProps: re, theirProps: f, slot: ne, defaultTag: Bd, name: `Combobox.Input` })
}
function Nd(e, t) {
  let n = wd(`Combobox.Button`),
    r = kd(`Combobox.Button`),
    [i, a] = (0, J.useState)(null),
    o = B(t, a, n.actions.setButtonElement),
    s = (0, z.useId)(),
    {
      id: c = `headlessui-combobox-button-${s}`,
      disabled: l = r.disabled || !1,
      autoFocus: u = !1,
      ...d
    } = e,
    [f, p, m] = H(n, (e) => [e.comboboxState, e.inputElement, e.optionsElement]),
    h = xo(p)
  uo(f === q.Open, {
    trigger: i,
    action: (0, J.useCallback)(
      (e) => {
        if ((i != null && i.contains(e.target)) || (p != null && p.contains(e.target)))
          return mo.Ignore
        let t = e.target.closest(`[role="option"]:not([data-disabled])`)
        return tr(t) ? mo.Select(t) : m != null && m.contains(e.target) ? mo.Ignore : mo.Close
      },
      [i, p, m]
    ),
    close: n.actions.closeCombobox,
    select: n.actions.selectActiveOption,
  })
  let g = N((e) => {
      switch (e.key) {
        case V.Space:
        case V.Enter:
          ;(e.preventDefault(),
            e.stopPropagation(),
            n.state.comboboxState === q.Closed && (0, Id.flushSync)(() => n.actions.openCombobox()),
            h())
          return
        case V.ArrowDown:
          ;(e.preventDefault(),
            e.stopPropagation(),
            n.state.comboboxState === q.Closed &&
              ((0, Id.flushSync)(() => n.actions.openCombobox()),
              n.state.dataRef.current.value || n.actions.goToOption({ focus: K.First })),
            h())
          return
        case V.ArrowUp:
          ;(e.preventDefault(),
            e.stopPropagation(),
            n.state.comboboxState === q.Closed &&
              ((0, Id.flushSync)(() => n.actions.openCombobox()),
              n.state.dataRef.current.value || n.actions.goToOption({ focus: K.Last })),
            h())
          return
        case V.Escape:
          if (n.state.comboboxState !== q.Open) return
          ;(e.preventDefault(),
            n.state.optionsElement && !r.optionsPropsRef.current.static && e.stopPropagation(),
            (0, Id.flushSync)(() => n.actions.closeCombobox()),
            h())
          return
        default:
          return
      }
    }),
    _ = Li(() => {
      ;(n.state.comboboxState === q.Open ? n.actions.closeCombobox() : n.actions.openCombobox(),
        h())
    }),
    v = Ar([c]),
    { isFocusVisible: y, focusProps: b } = $e({ autoFocus: u }),
    { isHovered: x, hoverProps: S } = st({ isDisabled: l }),
    { pressed: C, pressProps: w } = Bt({ disabled: l }),
    T = F({
      open: f === q.Open,
      active: C || f === q.Open,
      disabled: l,
      invalid: r.invalid,
      value: r.value,
      hover: x,
      focus: y,
    }),
    E = an(
      {
        ref: o,
        id: c,
        type: wo(e, i),
        tabIndex: -1,
        'aria-haspopup': `listbox`,
        'aria-controls': m?.id,
        'aria-expanded': f === q.Open,
        'aria-labelledby': v,
        disabled: l || void 0,
        autoFocus: u,
        onKeyDown: g,
      },
      _,
      b,
      S,
      w
    )
  return L()({ ourProps: E, theirProps: d, slot: T, defaultTag: Vd, name: `Combobox.Button` })
}
function Pd(e, t) {
  let n = (0, z.useId)(),
    {
      id: r = `headlessui-combobox-options-${n}`,
      hold: i = !1,
      anchor: a,
      portal: o = !1,
      modal: s = !0,
      transition: c = !1,
      ...l
    } = e,
    u = wd(`Combobox.Options`),
    d = kd(`Combobox.Options`),
    f = nu(a)
  f && (o = !0)
  let [p, m] = ou(f),
    [h, g] = (0, J.useState)(null),
    _ = au(),
    v = B(t, f ? p : null, u.actions.setOptionsElement, g),
    [y, b, x, S, C] = H(u, (e) => [
      e.comboboxState,
      e.inputElement,
      e.buttonElement,
      e.optionsElement,
      e.activationTrigger,
    ]),
    w = oo(b || x),
    T = oo(S),
    E = wu(),
    [D, O] = $o(c, h, E === null ? y === q.Open : (E & G.Open) === G.Open)
  ;(Ea(D, b, u.actions.closeCombobox),
    Uo(d.__demoMode ? !1 : s && y === q.Open, T),
    Sa(d.__demoMode ? !1 : s && y === q.Open, {
      allowed: (0, J.useCallback)(() => [b, x, S], [b, x, S]),
    }))
  let k = H(u, u.selectors.didInputMove) ? !1 : D
  ;(M(() => {
    d.optionsPropsRef.current.static = e.static ?? !1
  }, [d.optionsPropsRef, e.static]),
    M(() => {
      d.optionsPropsRef.current.hold = i
    }, [d.optionsPropsRef, i]),
    ss(y === q.Open, {
      container: S,
      accept(e) {
        return e.getAttribute(`role`) === `option`
          ? NodeFilter.FILTER_REJECT
          : e.hasAttribute(`role`)
            ? NodeFilter.FILTER_SKIP
            : NodeFilter.FILTER_ACCEPT
      },
      walk(e) {
        e.setAttribute(`role`, `none`)
      },
    }))
  let A = Ar([x?.id]),
    ee = F({ open: y === q.Open, option: void 0 }),
    te = N(() => {
      u.actions.setActivationTrigger(yd.Pointer)
    }),
    ne = N((e) => {
      ;(e.preventDefault(), u.actions.setActivationTrigger(yd.Pointer))
    }),
    re = an(f ? _() : {}, {
      'aria-labelledby': A,
      role: `listbox`,
      'aria-multiselectable': d.mode === vd.Multi ? !0 : void 0,
      id: r,
      ref: v,
      style: {
        ...l.style,
        ...m,
        '--input-width': Mi(D, b, !0).width,
        '--button-width': Mi(D, x, !0).width,
      },
      onWheel: C === yd.Pointer ? void 0 : te,
      onMouseDown: ne,
      ...Qo(O),
    }),
    ie = D && y === q.Closed && !e.static,
    ae = bu(ie, d.virtual?.options),
    j = bu(ie, d.value),
    oe = (0, J.useCallback)((e) => d.compare(j, e), [d.compare, j]),
    se = (0, J.useMemo)(() => {
      if (!d.virtual) return d
      if (ae === void 0) throw Error('Missing `options` in virtual mode')
      return ae === d.virtual.options ? d : { ...d, virtual: { ...d.virtual, options: ae } }
    }, [d, ae, d.virtual?.options])
  d.virtual &&
    Object.assign(l, {
      children: J.createElement(
        Ld.Provider,
        { value: se },
        J.createElement(Ad, { slot: ee }, l.children)
      ),
    })
  let ce = L(),
    le = (0, J.useMemo)(() => (d.mode === vd.Multi ? d : { ...d, isSelected: oe }), [d, oe])
  return J.createElement(
    cd,
    { enabled: o ? e.static || D : !1, ownerDocument: w },
    J.createElement(
      Ld.Provider,
      { value: le },
      ce({
        ourProps: re,
        theirProps: {
          ...l,
          children: J.createElement(
            Su,
            { freeze: ie },
            typeof l.children == `function` ? l.children?.call(l, ee) : l.children
          ),
        },
        slot: ee,
        defaultTag: Hd,
        features: Ud,
        visible: k,
        name: `Combobox.Options`,
      })
    )
  )
}
function Fd(e, t) {
  var n
  let r = kd(`Combobox.Option`),
    i = wd(`Combobox.Option`),
    a = (0, z.useId)(),
    {
      id: o = `headlessui-combobox-option-${a}`,
      value: s,
      disabled: c = (n = r.virtual)?.disabled?.call(n, s) ?? !1,
      order: l = null,
      ...u
    } = e,
    [d] = H(i, (e) => [e.inputElement]),
    f = xo(d),
    p = H(
      i,
      (0, J.useCallback)((e) => i.selectors.isActive(e, s, o), [s, o])
    ),
    m = r.isSelected(s),
    h = (0, J.useRef)(null),
    g = Pt({ disabled: c, value: s, domRef: h, order: l }),
    _ = (0, J.useContext)(Rd),
    v = B(t, h, _ ? _.measureElement : null),
    y = N(() => {
      ;(i.actions.setIsTyping(!1), i.actions.onChange(s))
    })
  M(() => i.actions.registerOption(o, g), [g, o])
  let b = H(
    i,
    (0, J.useCallback)((e) => i.selectors.shouldScrollIntoView(e, s, o), [s, o])
  )
  M(() => {
    if (b)
      return Dt().requestAnimationFrame(() => {
        var e, t
        ;(t = (e = h.current)?.scrollIntoView) == null || t.call(e, { block: `nearest` })
      })
  }, [b, h])
  let x = N((e) => {
      ;(e.preventDefault(),
        e.button === Fi.Left &&
          (c ||
            (y(),
            Ja() || requestAnimationFrame(() => f()),
            r.mode === vd.Single && i.actions.closeCombobox())))
    }),
    S = N(() => {
      if (c) return i.actions.goToOption({ focus: K.Nothing })
      let e = r.calculateIndex(s)
      i.actions.goToOption({ focus: K.Specific, idx: e })
    }),
    C = Ko(),
    w = N((e) => C.update(e)),
    T = N((e) => {
      if (!C.wasMoved(e) || c || (p && i.state.activationTrigger === yd.Pointer)) return
      let t = r.calculateIndex(s)
      i.actions.goToOption({ focus: K.Specific, idx: t }, yd.Pointer)
    }),
    E = N((e) => {
      C.wasMoved(e) &&
        (c ||
          (p &&
            (r.optionsPropsRef.current.hold ||
              (i.state.activationTrigger === yd.Pointer &&
                i.actions.goToOption({ focus: K.Nothing })))))
    }),
    D = F({ active: p, focus: p, selected: m, disabled: c }),
    O = {
      id: o,
      ref: v,
      role: `option`,
      tabIndex: c === !0 ? void 0 : -1,
      'aria-disabled': c === !0 ? !0 : void 0,
      'aria-selected': m,
      disabled: void 0,
      onMouseDown: x,
      onFocus: S,
      onPointerEnter: w,
      onMouseEnter: w,
      onPointerMove: T,
      onMouseMove: T,
      onPointerLeave: E,
      onMouseLeave: E,
    }
  return L()({ ourProps: O, theirProps: u, slot: D, defaultTag: Wd, name: `Combobox.Option` })
}
var J,
  Id,
  Ld,
  Rd,
  zd,
  Bd,
  Vd,
  Hd,
  Ud,
  Wd,
  Gd,
  Kd,
  qd,
  Jd,
  Yd,
  Xd,
  Zd,
  Qd = t(() => {
    ;(rt(),
      pt(),
      Ei(),
      (J = e(r(), 1)),
      (Id = e(a(), 1)),
      Ht(),
      Ai(),
      Cn(),
      En(),
      jt(),
      Pi(),
      P(),
      zi(),
      Dn(),
      Ta(),
      Nt(),
      It(),
      Oa(),
      ao(),
      lo(),
      _o(),
      Co(),
      Eo(),
      Wo(),
      Wt(),
      _r(),
      Jo(),
      os(),
      ls(),
      fs(),
      Yt(),
      vu(),
      qn(),
      Cu(),
      Qn(),
      ku(),
      da(),
      ga(),
      Nu(),
      Iu(),
      Ot(),
      ur(),
      Qt(),
      wt(),
      Ya(),
      hn(),
      Dr(),
      Or(),
      Rr(),
      Ii(),
      ld(),
      Cd(),
      Od(),
      (Ld = (0, J.createContext)(null)),
      (Ld.displayName = `ComboboxDataContext`),
      (Rd = (0, J.createContext)(null)),
      (zd = J.Fragment),
      (Bd = `input`),
      (Vd = `button`),
      (Hd = `div`),
      (Ud = pn.RenderStrategy | pn.Static),
      (Wd = `div`),
      (Gd = R(jd)),
      (Kd = R(Nd)),
      (qd = R(Md)),
      (Jd = Lr),
      (Yd = R(Pd)),
      (Xd = R(Fd)),
      (Zd = Object.assign(Gd, { Input: qd, Button: Kd, Label: Jd, Options: Yd, Option: Xd })))
  })
function $d(e, t) {
  let { ...n } = e,
    { isFocusVisible: r, focusProps: i } = $e(),
    { isHovered: a, hoverProps: o } = st({ isDisabled: !1 }),
    { pressed: s, pressProps: c } = Bt({ disabled: !1 }),
    l = an({ ref: t }, i, o, c),
    u = F({ hover: a, focus: r, active: s })
  return L()({ ourProps: l, theirProps: n, slot: u, defaultTag: tf, name: `DataInteractive` })
}
var ef,
  tf,
  nf = t(() => {
    ;(rt(), pt(), (ef = e(r(), 1)), Ht(), Wt(), hn(), (tf = ef.Fragment), R($d))
  })
function rf(e, t = typeof document < `u` ? document.defaultView : null, n) {
  let r = _a(e, `escape`)
  vo(t, `keydown`, (e) => {
    r && (e.defaultPrevented || (e.key === V.Escape && n(e)))
  })
}
var af = t(() => {
  ;(Or(), bo(), ya())
})
function of() {
  let [e] = (0, sf.useState)(() =>
      typeof window < `u` && typeof window.matchMedia == `function`
        ? window.matchMedia(`(pointer: coarse)`)
        : null
    ),
    [t, n] = (0, sf.useState)(e?.matches ?? !1)
  return (
    M(() => {
      if (!e) return
      function t(e) {
        n(e.matches)
      }
      return (e.addEventListener(`change`, t), () => e.removeEventListener(`change`, t))
    }, [e]),
    t
  )
}
var sf,
  cf = t(() => {
    ;((sf = e(r(), 1)), Nt())
  })
function lf({ defaultContainers: e = [], portals: t, mainTreeNode: n } = {}) {
  let r = N(() => {
    let r = bt(n),
      i = []
    for (let t of e)
      t !== null && (er(t) ? i.push(t) : `current` in t && er(t.current) && i.push(t.current))
    if (t != null && t.current) for (let e of t.current) i.push(e)
    for (let e of r?.querySelectorAll(`html > *, body > *`) ?? [])
      e !== document.body &&
        e !== document.head &&
        er(e) &&
        e.id !== `headlessui-portal-root` &&
        ((n && (e.contains(n) || e.contains(n?.getRootNode()?.host))) ||
          i.some((t) => e.contains(t)) ||
          i.push(e))
    return i
  })
  return { resolveContainers: r, contains: N((e) => r().some((t) => t.contains(e))) }
}
function uf({ children: e, node: t }) {
  let [n, r] = (0, ff.useState)(null),
    i = df(t ?? n)
  return ff.createElement(
    pf.Provider,
    { value: i },
    e,
    i === null &&
      ff.createElement(Rn, {
        features: Ln.Hidden,
        ref: (e) => {
          if (e) {
            for (let t of bt(e)?.querySelectorAll(`html > *, body > *`) ?? [])
              if (
                t !== document.body &&
                t !== document.head &&
                er(t) &&
                t != null &&
                t.contains(e)
              ) {
                r(t)
                break
              }
          }
        },
      })
  )
}
function df(e = null) {
  return (0, ff.useContext)(pf) ?? e
}
var ff,
  pf,
  mf = t(() => {
    ;((ff = e(r(), 1)), zn(), ur(), wt(), P(), (pf = (0, ff.createContext)(null)))
  })
function hf() {
  let e = (0, gf.useRef)(!1)
  return (
    M(
      () => (
        (e.current = !0),
        () => {
          e.current = !1
        }
      ),
      []
    ),
    e
  )
}
var gf,
  _f = t(() => {
    ;((gf = e(r(), 1)), Nt())
  })
function vf() {
  let e = (0, yf.useRef)(0)
  return (
    $a(
      !0,
      `keydown`,
      (t) => {
        t.key === `Tab` && (e.current = +!!t.shiftKey)
      },
      !0
    ),
    e
  )
}
var yf,
  bf,
  xf = t(() => {
    ;((yf = e(r(), 1)),
      to(),
      (bf = ((e) => ((e[(e.Forwards = 0)] = `Forwards`), (e[(e.Backwards = 1)] = `Backwards`), e))(
        bf || {}
      )))
  })
function Sf(e) {
  if (!e) return new Set()
  if (typeof e == `function`) return new Set(e())
  let t = new Set()
  for (let n of e.current) er(n.current) && t.add(n.current)
  return t
}
function Cf(e, t) {
  let n = (0, kf.useRef)(null),
    r = B(n, t),
    { initialFocus: i, initialFocusFallback: a, containers: o, features: s = 15, ...c } = e
  Vu() || (s = 0)
  let l = oo(n.current)
  Tf(s, { ownerDocument: l })
  let u = Ef(s, { ownerDocument: l, container: n, initialFocus: i, initialFocusFallback: a })
  Df(s, { ownerDocument: l, container: n, containers: o, previousActiveElement: u })
  let d = vf(),
    f = N((e) => {
      if (!tr(n.current)) return
      let t = n.current
      ;((e) => e())(() => {
        I(d.current, {
          [bf.Forwards]: () => {
            La(t, U.First, { skipElements: [e.relatedTarget, a] })
          },
          [bf.Backwards]: () => {
            La(t, U.Last, { skipElements: [e.relatedTarget, a] })
          },
        })
      })
    }),
    p = _a(!!(s & 2), `focus-trap#tab-lock`),
    m = kt(),
    h = (0, kf.useRef)(!1),
    g = {
      ref: r,
      onKeyDown(e) {
        e.key == `Tab` &&
          ((h.current = !0),
          m.requestAnimationFrame(() => {
            h.current = !1
          }))
      },
      onBlur(e) {
        if (!(s & 4)) return
        let t = Sf(o)
        tr(n.current) && t.add(n.current)
        let r = e.relatedTarget
        nr(r) &&
          r.dataset.headlessuiFocusGuard !== `true` &&
          (Of(t, r) ||
            (h.current
              ? La(
                  n.current,
                  I(d.current, { [bf.Forwards]: () => U.Next, [bf.Backwards]: () => U.Previous }) |
                    U.WrapAround,
                  { relativeTo: e.target }
                )
              : nr(e.target) && Na(e.target)))
      },
    },
    _ = L()
  return kf.createElement(
    kf.Fragment,
    null,
    p &&
      kf.createElement(Rn, {
        as: `button`,
        type: `button`,
        'data-headlessui-focus-guard': !0,
        onFocus: f,
        features: Ln.Focusable,
      }),
    _({ ourProps: g, theirProps: c, defaultTag: Af, name: `FocusTrap` }),
    p &&
      kf.createElement(Rn, {
        as: `button`,
        type: `button`,
        'data-headlessui-focus-guard': !0,
        onFocus: f,
        features: Ln.Focusable,
      })
  )
}
function wf(e = !0) {
  let t = (0, kf.useRef)(Mu.slice())
  return (
    us(
      ([e], [n]) => {
        ;(n === !0 &&
          e === !1 &&
          Tt(() => {
            t.current.splice(0)
          }),
          n === !1 && e === !0 && (t.current = Mu.slice()))
      },
      [e, Mu, t]
    ),
    N(() => t.current.find((e) => e != null && e.isConnected) ?? null)
  )
}
function Tf(e, { ownerDocument: t }) {
  let n = !!(e & 8),
    r = wf(n)
  ;(us(() => {
    n || (Ct(t?.body) && Na(r()))
  }, [n]),
    Lu(() => {
      n && Na(r())
    }))
}
function Ef(e, { ownerDocument: t, container: n, initialFocus: r, initialFocusFallback: i }) {
  let a = (0, kf.useRef)(null),
    o = _a(!!(e & 1), `focus-trap#initial-focus`),
    s = hf()
  return (
    us(() => {
      if (e === 0) return
      if (!o) {
        i != null && i.current && Na(i.current)
        return
      }
      let c = n.current
      c &&
        Tt(() => {
          if (!s.current) return
          let n = t?.activeElement
          if (r != null && r.current) {
            if (r?.current === n) {
              a.current = n
              return
            }
          } else if (c.contains(n)) {
            a.current = n
            return
          }
          if (r != null && r.current) Na(r.current)
          else {
            if (e & 16) {
              if (La(c, U.First | U.AutoFocus) !== Ba.Error) return
            } else if (La(c, U.First) !== Ba.Error) return
            if (i != null && i.current && (Na(i.current), t?.activeElement === i.current)) return
            console.warn(`There are no focusable elements inside the <FocusTrap />`)
          }
          a.current = t?.activeElement
        })
    }, [i, o, e]),
    a
  )
}
function Df(e, { ownerDocument: t, container: n, containers: r, previousActiveElement: i }) {
  let a = hf(),
    o = !!(e & 4)
  vo(
    t?.defaultView,
    `focus`,
    (e) => {
      if (!o || !a.current) return
      let t = Sf(r)
      tr(n.current) && t.add(n.current)
      let s = i.current
      if (!s) return
      let c = e.target
      tr(c)
        ? Of(t, c)
          ? ((i.current = c), Na(c))
          : (e.preventDefault(), e.stopPropagation(), Na(s))
        : Na(i.current)
    },
    !0
  )
}
function Of(e, t) {
  for (let n of e) if (n.contains(t)) return !0
  return !1
}
var kf,
  Af,
  jf,
  Mf,
  Nf,
  Pf = t(() => {
    ;((kf = e(r(), 1)),
      jt(),
      P(),
      bo(),
      _f(),
      ya(),
      zu(),
      lo(),
      Uu(),
      _r(),
      xf(),
      fs(),
      zn(),
      Nu(),
      ur(),
      Ga(),
      Qt(),
      Et(),
      wt(),
      hn(),
      (Af = `div`),
      (jf = ((e) => (
        (e[(e.None = 0)] = `None`),
        (e[(e.InitialFocus = 1)] = `InitialFocus`),
        (e[(e.TabLock = 2)] = `TabLock`),
        (e[(e.FocusLock = 4)] = `FocusLock`),
        (e[(e.RestoreFocus = 8)] = `RestoreFocus`),
        (e[(e.AutoFocus = 16)] = `AutoFocus`),
        e
      ))(jf || {})),
      (Mf = R(Cf)),
      (Nf = Object.assign(Mf, { features: jf })))
  })
function Ff(e) {
  return (
    !!(e.enter || e.enterFrom || e.enterTo || e.leave || e.leaveFrom || e.leaveTo) ||
    !un(e.as ?? Kf) ||
    Y.Children.count(e.children) === 1
  )
}
function If() {
  let e = (0, Y.useContext)(Uf)
  if (e === null)
    throw Error(
      `A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.`
    )
  return e
}
function Lf() {
  let e = (0, Y.useContext)(Gf)
  if (e === null)
    throw Error(
      `A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.`
    )
  return e
}
function Rf(e) {
  return `children` in e
    ? Rf(e.children)
    : e.current.filter(({ el: e }) => e.current !== null).filter(({ state: e }) => e === `visible`)
        .length > 0
}
function zf(e, t) {
  let n = Pt(e),
    r = (0, Y.useRef)([]),
    i = hf(),
    a = kt(),
    o = N((e, t = mn.Hidden) => {
      let o = r.current.findIndex(({ el: t }) => t === e)
      o !== -1 &&
        (I(t, {
          [mn.Unmount]() {
            r.current.splice(o, 1)
          },
          [mn.Hidden]() {
            r.current[o].state = `hidden`
          },
        }),
        a.microTask(() => {
          var e
          !Rf(r) && i.current && ((e = n.current) == null || e.call(n))
        }))
    }),
    s = N((e) => {
      let t = r.current.find(({ el: t }) => t === e)
      return (
        t
          ? t.state !== `visible` && (t.state = `visible`)
          : r.current.push({ el: e, state: `visible` }),
        () => o(e, mn.Unmount)
      )
    }),
    c = (0, Y.useRef)([]),
    l = (0, Y.useRef)(Promise.resolve()),
    u = (0, Y.useRef)({ enter: [], leave: [] }),
    d = N((e, n, r) => {
      ;(c.current.splice(0),
        t && (t.chains.current[n] = t.chains.current[n].filter(([t]) => t !== e)),
        t?.chains.current[n].push([
          e,
          new Promise((e) => {
            c.current.push(e)
          }),
        ]),
        t?.chains.current[n].push([
          e,
          new Promise((e) => {
            Promise.all(u.current[n].map(([e, t]) => t)).then(() => e())
          }),
        ]),
        n === `enter` ? (l.current = l.current.then(() => t?.wait.current).then(() => r(n))) : r(n))
    }),
    f = N((e, t, n) => {
      Promise.all(u.current[t].splice(0).map(([e, t]) => t))
        .then(() => {
          var e
          ;(e = c.current.shift()) == null || e()
        })
        .then(() => n(t))
    })
  return (0, Y.useMemo)(
    () => ({ children: r, register: s, unregister: o, onStart: d, onStop: f, wait: l, chains: u }),
    [s, o, r, d, f, u, l]
  )
}
function Bf(e, t) {
  var n
  let {
      transition: r = !0,
      beforeEnter: i,
      afterEnter: a,
      beforeLeave: o,
      afterLeave: s,
      enter: c,
      enterFrom: l,
      enterTo: u,
      entered: d,
      leave: f,
      leaveFrom: p,
      leaveTo: m,
      ...h
    } = e,
    [g, _] = (0, Y.useState)(null),
    v = (0, Y.useRef)(null),
    y = Ff(e),
    b = B(...(y ? [v, t, _] : t === null ? [] : [t])),
    x = (n = h.unmount) == null || n ? mn.Unmount : mn.Hidden,
    { show: S, appear: C, initial: w } = If(),
    [T, E] = (0, Y.useState)(S ? `visible` : `hidden`),
    D = Lf(),
    { register: O, unregister: k } = D
  ;(M(() => O(v), [O, v]),
    M(() => {
      if (x === mn.Hidden && v.current) {
        if (S && T !== `visible`) {
          E(`visible`)
          return
        }
        return I(T, { hidden: () => k(v), visible: () => O(v) })
      }
    }, [T, v, O, k, S, x]))
  let A = Vu()
  M(() => {
    if (y && A && T === `visible` && v.current === null)
      throw Error('Did you forget to passthrough the `ref` to the actual DOM node?')
  }, [v, T, A, y])
  let ee = w && !C,
    te = C && S && w,
    ne = (0, Y.useRef)(!1),
    re = zf(() => {
      ne.current || (E(`hidden`), k(v))
    }, D),
    ie = N((e) => {
      ne.current = !0
      let t = e ? `enter` : `leave`
      re.onStart(v, t, (e) => {
        e === `enter` ? i?.() : e === `leave` && o?.()
      })
    }),
    ae = N((e) => {
      let t = e ? `enter` : `leave`
      ;((ne.current = !1),
        re.onStop(v, t, (e) => {
          e === `enter` ? a?.() : e === `leave` && s?.()
        }),
        t === `leave` && !Rf(re) && (E(`hidden`), k(v)))
    })
  ;(0, Y.useEffect)(() => {
    ;(y && r) || (ie(S), ae(S))
  }, [S, y, r])
  let [, j] = $o(!(!r || !y || !A || ee), g, S, { start: ie, end: ae }),
    oe = on({
      ref: b,
      className:
        Xt(
          h.className,
          te && c,
          te && l,
          j.enter && c,
          j.enter && j.closed && l,
          j.enter && !j.closed && u,
          j.leave && f,
          j.leave && !j.closed && p,
          j.leave && j.closed && m,
          !j.transition && S && d
        )?.trim() || void 0,
      ...Qo(j),
    }),
    se = 0
  ;(T === `visible` && (se |= G.Open),
    T === `hidden` && (se |= G.Closed),
    S && T === `hidden` && (se |= G.Opening),
    !S && T === `visible` && (se |= G.Closing))
  let ce = L()
  return Y.createElement(
    Gf.Provider,
    { value: re },
    Y.createElement(
      Tu,
      { value: se },
      ce({
        ourProps: oe,
        theirProps: h,
        defaultTag: Kf,
        features: qf,
        visible: T === `visible`,
        name: `Transition.Child`,
      })
    )
  )
}
function Vf(e, t) {
  let { show: n, appear: r = !1, unmount: i = !0, ...a } = e,
    o = (0, Y.useRef)(null),
    s = B(...(Ff(e) ? [o, t] : t === null ? [] : [t]))
  Vu()
  let c = wu()
  if ((n === void 0 && c !== null && (n = (c & G.Open) === G.Open), n === void 0))
    throw Error('A <Transition /> is used but it is missing a `show={true | false}` prop.')
  let [l, u] = (0, Y.useState)(n ? `visible` : `hidden`),
    d = zf(() => {
      n || u(`hidden`)
    }),
    [f, p] = (0, Y.useState)(!0),
    m = (0, Y.useRef)([n])
  M(() => {
    f !== !1 && m.current[m.current.length - 1] !== n && (m.current.push(n), p(!1))
  }, [m, n])
  let h = (0, Y.useMemo)(() => ({ show: n, appear: r, initial: f }), [n, r, f])
  M(() => {
    n ? u(`visible`) : !Rf(d) && o.current !== null && u(`hidden`)
  }, [n, d])
  let g = { unmount: i },
    _ = N(() => {
      var t
      ;(f && p(!1), (t = e.beforeEnter) == null || t.call(e))
    }),
    v = N(() => {
      var t
      ;(f && p(!1), (t = e.beforeLeave) == null || t.call(e))
    }),
    y = L()
  return Y.createElement(
    Gf.Provider,
    { value: d },
    Y.createElement(
      Uf.Provider,
      { value: h },
      y({
        ourProps: {
          ...g,
          as: Y.Fragment,
          children: Y.createElement(Yf, { ref: s, ...g, ...a, beforeEnter: _, beforeLeave: v }),
        },
        theirProps: {},
        defaultTag: Y.Fragment,
        features: qf,
        visible: l === `visible`,
        name: `Transition`,
      })
    )
  )
}
function Hf(e, t) {
  let n = (0, Y.useContext)(Uf) !== null,
    r = wu() !== null
  return Y.createElement(
    Y.Fragment,
    null,
    !n && r ? Y.createElement(Jf, { ref: t, ...e }) : Y.createElement(Yf, { ref: t, ...e })
  )
}
var Y,
  Uf,
  Wf,
  Gf,
  Kf,
  qf,
  Jf,
  Yf,
  Xf,
  Zf,
  Qf = t(() => {
    ;((Y = e(r(), 1)),
      jt(),
      P(),
      _f(),
      Nt(),
      It(),
      Uu(),
      _r(),
      os(),
      ku(),
      Zt(),
      Qt(),
      hn(),
      (Uf = (0, Y.createContext)(null)),
      (Uf.displayName = `TransitionContext`),
      (Wf = ((e) => ((e.Visible = `visible`), (e.Hidden = `hidden`), e))(Wf || {})),
      (Gf = (0, Y.createContext)(null)),
      (Gf.displayName = `NestingContext`),
      (Kf = Y.Fragment),
      (qf = pn.RenderStrategy),
      (Jf = R(Vf)),
      (Yf = R(Bf)),
      (Xf = R(Hf)),
      (Zf = Object.assign(Jf, { Child: Xf, Root: Jf })))
  })
function $f(e) {
  let t = (0, X.useContext)(cp)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <Dialog /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, $f), t)
  }
  return t
}
function ep(e, t) {
  return I(t.type, sp, e, t)
}
function tp(e, t) {
  let { transition: n = !1, open: r, ...i } = e,
    a = wu(),
    o = e.hasOwnProperty(`open`) || a !== null,
    s = e.hasOwnProperty(`onClose`)
  if (!o && !s)
    throw Error('You have to provide an `open` and an `onClose` prop to the `Dialog` component.')
  if (!o) throw Error('You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.')
  if (!s) throw Error('You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.')
  if (!a && typeof e.open != `boolean`)
    throw Error(
      `You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${e.open}`
    )
  if (typeof e.onClose != `function`)
    throw Error(
      `You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${e.onClose}`
    )
  return (r !== void 0 || n) && !i.static
    ? X.createElement(
        uf,
        null,
        X.createElement(
          Zf,
          { show: r, transition: n, unmount: i.unmount },
          X.createElement(lp, { ref: t, ...i })
        )
      )
    : X.createElement(uf, null, X.createElement(lp, { ref: t, open: r, ...i }))
}
function np(e, t) {
  let n = (0, z.useId)(),
    { id: r = `headlessui-dialog-panel-${n}`, transition: i = !1, ...a } = e,
    [{ dialogState: o, unmount: s }, c] = $f(`Dialog.Panel`),
    l = B(t, c.panelRef),
    u = F({ open: o === 0 }),
    d = {
      ref: l,
      id: r,
      onClick: N((e) => {
        e.stopPropagation()
      }),
    },
    f = i ? Xf : X.Fragment,
    p = i ? { unmount: s } : {},
    m = L()
  return X.createElement(
    f,
    { ...p },
    m({ ourProps: d, theirProps: a, slot: u, defaultTag: fp, name: `Dialog.Panel` })
  )
}
function rp(e, t) {
  let { transition: n = !1, ...r } = e,
    [{ dialogState: i, unmount: a }] = $f(`Dialog.Backdrop`),
    o = F({ open: i === 0 }),
    s = { ref: t, 'aria-hidden': !0 },
    c = n ? Xf : X.Fragment,
    l = n ? { unmount: a } : {},
    u = L()
  return X.createElement(
    c,
    { ...l },
    u({ ourProps: s, theirProps: r, slot: o, defaultTag: pp, name: `Dialog.Backdrop` })
  )
}
function ip(e, t) {
  let n = (0, z.useId)(),
    { id: r = `headlessui-dialog-title-${n}`, ...i } = e,
    [{ dialogState: a, setTitleId: o }] = $f(`Dialog.Title`),
    s = B(t)
  ;(0, X.useEffect)(() => (o(r), () => o(null)), [r, o])
  let c = F({ open: a === 0 }),
    l = { ref: s, id: r }
  return L()({ ourProps: l, theirProps: i, slot: c, defaultTag: mp, name: `Dialog.Title` })
}
var X,
  ap,
  op,
  sp,
  cp,
  lp,
  up,
  dp,
  fp,
  pp,
  mp,
  hp,
  gp,
  _p,
  vp = t(() => {
    ;((X = e(r(), 1)),
      af(),
      P(),
      Dn(),
      Ta(),
      cf(),
      Nt(),
      Oa(),
      ao(),
      lo(),
      mf(),
      Wo(),
      Uu(),
      Wt(),
      _r(),
      qr(),
      ku(),
      Ju(),
      da(),
      ga(),
      Qt(),
      hn(),
      Dr(),
      Pf(),
      ld(),
      Qf(),
      (ap = ((e) => ((e[(e.Open = 0)] = `Open`), (e[(e.Closed = 1)] = `Closed`), e))(ap || {})),
      (op = ((e) => ((e[(e.SetTitleId = 0)] = `SetTitleId`), e))(op || {})),
      (sp = {
        0(e, t) {
          return e.titleId === t.id ? e : { ...e, titleId: t.id }
        },
      }),
      (cp = (0, X.createContext)(null)),
      (cp.displayName = `DialogContext`),
      (lp = R(function (e, t) {
        let n = (0, z.useId)(),
          {
            id: r = `headlessui-dialog-${n}`,
            open: i,
            onClose: a,
            initialFocus: o,
            role: s = `dialog`,
            autoFocus: c = !0,
            __demoMode: l = !1,
            unmount: u = !1,
            ...d
          } = e,
          f = (0, X.useRef)(!1)
        s = (function () {
          return s === `dialog` || s === `alertdialog`
            ? s
            : (f.current ||
                ((f.current = !0),
                console.warn(
                  `Invalid role [${s}] passed to <Dialog />. Only \`dialog\` and and \`alertdialog\` are supported. Using \`dialog\` instead.`
                )),
              `dialog`)
        })()
        let p = wu()
        i === void 0 && p !== null && (i = (p & G.Open) === G.Open)
        let m = (0, X.useRef)(null),
          h = B(m, t),
          g = oo(m.current),
          _ = +!i,
          [v, y] = (0, X.useReducer)(ep, {
            titleId: null,
            descriptionId: null,
            panelRef: (0, X.createRef)(),
          }),
          b = N(() => a(!1)),
          x = N((e) => y({ type: 0, id: e })),
          S = Vu() ? _ === 0 : !1,
          [C, w] = Qu(),
          T = {
            get current() {
              return v.panelRef.current ?? m.current
            },
          },
          E = df(),
          { resolveContainers: D } = lf({ mainTreeNode: E, portals: C, defaultContainers: [T] }),
          O = p === null ? !1 : (p & G.Closing) === G.Closing
        Sa(l || O ? !1 : S, {
          allowed: N(() => [m.current?.closest(`[data-headlessui-portal]`) ?? null]),
          disallowed: N(() => [E?.closest(`body > *:not(#headlessui-portal-root)`) ?? null]),
        })
        let k = ua.get(null)
        M(() => {
          if (S) return (k.actions.push(r), () => k.actions.pop(r))
        }, [k, r, S])
        let A = H(
          k,
          (0, X.useCallback)((e) => k.selectors.isTop(e, r), [k, r])
        )
        ;(no(A, D, (e) => {
          ;(e.preventDefault(), b())
        }),
          rf(A, g?.defaultView, (e) => {
            ;(e.preventDefault(),
              e.stopPropagation(),
              document.activeElement &&
                `blur` in document.activeElement &&
                typeof document.activeElement.blur == `function` &&
                document.activeElement.blur(),
              b())
          }),
          Uo(l || O ? !1 : S, g, D),
          Ea(S, m, b))
        let [ee, te] = br(),
          ne = (0, X.useMemo)(
            () => [{ dialogState: _, close: b, setTitleId: x, unmount: u }, v],
            [_, b, x, u, v]
          ),
          re = F({ open: _ === 0 }),
          ie = {
            ref: h,
            id: r,
            role: s,
            tabIndex: -1,
            'aria-modal': l ? void 0 : _ === 0 ? !0 : void 0,
            'aria-labelledby': v.titleId,
            'aria-describedby': ee,
            unmount: u,
          },
          ae = !of(),
          j = jf.None
        S &&
          !l &&
          ((j |= jf.RestoreFocus),
          (j |= jf.TabLock),
          c && (j |= jf.AutoFocus),
          ae && (j |= jf.InitialFocus))
        let oe = L()
        return X.createElement(
          Eu,
          null,
          X.createElement(
            Gu,
            { force: !0 },
            X.createElement(
              cd,
              null,
              X.createElement(
                cp.Provider,
                { value: ne },
                X.createElement(
                  sd,
                  { target: m },
                  X.createElement(
                    Gu,
                    { force: !1 },
                    X.createElement(
                      te,
                      { slot: re },
                      X.createElement(
                        w,
                        null,
                        X.createElement(
                          Nf,
                          { initialFocus: o, initialFocusFallback: m, containers: D, features: j },
                          X.createElement(
                            Wr,
                            { value: b },
                            oe({
                              ourProps: ie,
                              theirProps: d,
                              slot: re,
                              defaultTag: up,
                              features: dp,
                              visible: _ === 0,
                              name: `Dialog`,
                            })
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      })),
      (up = `div`),
      (dp = pn.RenderStrategy | pn.Static),
      (fp = `div`),
      (pp = `div`),
      (mp = `h2`),
      (hp = R(tp)),
      (gp = R(np)),
      R(rp),
      (_p = R(ip)),
      Object.assign(hp, { Panel: gp, Title: _p, Description: Er }))
  }),
  yp,
  bp,
  xp = t(() => {
    ;((yp = e(r(), 1)),
      (bp =
        yp.startTransition ??
        function (e) {
          e()
        }))
  })
function Sp(e) {
  let t = (0, kp.useContext)(Np)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <Disclosure /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, Sp), t)
  }
  return t
}
function Cp(e) {
  let t = (0, kp.useContext)(Pp)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <Disclosure /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, Cp), t)
  }
  return t
}
function wp() {
  return (0, kp.useContext)(Fp)
}
function Tp(e, t) {
  return I(t.type, Mp, e, t)
}
function Ep(e, t) {
  let { defaultOpen: n = !1, ...r } = e,
    i = (0, kp.useRef)(null),
    a = B(
      t,
      mr(
        (e) => {
          i.current = e
        },
        e.as === void 0 || un(e.as)
      )
    ),
    o = (0, kp.useReducer)(Tp, {
      disclosureState: +!n,
      buttonElement: null,
      panelElement: null,
      buttonId: null,
      panelId: null,
    }),
    [{ disclosureState: s, buttonId: c }, l] = o,
    u = N((e) => {
      l({ type: 1 })
      let t = bt(i.current)
      !t ||
        !c ||
        (e
          ? nr(e)
            ? e
            : `current` in e && nr(e.current)
              ? e.current
              : t.getElementById(c)
          : t.getElementById(c)
        )?.focus()
    }),
    d = (0, kp.useMemo)(() => ({ close: u }), [u]),
    f = F({ open: s === 0, close: u }),
    p = { ref: a },
    m = L()
  return kp.createElement(
    Np.Provider,
    { value: o },
    kp.createElement(
      Pp.Provider,
      { value: d },
      kp.createElement(
        Wr,
        { value: u },
        kp.createElement(
          Tu,
          { value: I(s, { 0: G.Open, 1: G.Closed }) },
          m({ ourProps: p, theirProps: r, slot: f, defaultTag: Ip, name: `Disclosure` })
        )
      )
    )
  )
}
function Dp(e, t) {
  let n = (0, z.useId)(),
    { id: r = `headlessui-disclosure-button-${n}`, disabled: i = !1, autoFocus: a = !1, ...o } = e,
    [s, c] = Sp(`Disclosure.Button`),
    l = wp(),
    u = l === null ? !1 : l === s.panelId,
    d = B(
      (0, kp.useRef)(null),
      t,
      N((e) => {
        if (!u) return c({ type: 4, element: e })
      })
    )
  ;(0, kp.useEffect)(() => {
    if (!u)
      return (
        c({ type: 2, buttonId: r }),
        () => {
          c({ type: 2, buttonId: null })
        }
      )
  }, [r, c, u])
  let f = N((e) => {
      var t
      if (u) {
        if (s.disclosureState === 1) return
        switch (e.key) {
          case V.Space:
          case V.Enter:
            ;(e.preventDefault(),
              e.stopPropagation(),
              c({ type: 0 }),
              (t = s.buttonElement) == null || t.focus())
            break
        }
      } else
        switch (e.key) {
          case V.Space:
          case V.Enter:
            ;(e.preventDefault(), e.stopPropagation(), c({ type: 0 }))
            break
        }
    }),
    p = N((e) => {
      switch (e.key) {
        case V.Space:
          e.preventDefault()
          break
      }
    }),
    m = N((e) => {
      var t
      dr(e.currentTarget) ||
        i ||
        (u ? (c({ type: 0 }), (t = s.buttonElement) == null || t.focus()) : c({ type: 0 }))
    }),
    { isFocusVisible: h, focusProps: g } = $e({ autoFocus: a }),
    { isHovered: _, hoverProps: v } = st({ isDisabled: i }),
    { pressed: y, pressProps: b } = Bt({ disabled: i }),
    x = F({
      open: s.disclosureState === 0,
      hover: _,
      active: y,
      disabled: i,
      focus: h,
      autofocus: a,
    }),
    S = wo(e, s.buttonElement),
    C = an(
      u
        ? { ref: d, type: S, disabled: i || void 0, autoFocus: a, onKeyDown: f, onClick: m }
        : {
            ref: d,
            id: r,
            type: S,
            'aria-expanded': s.disclosureState === 0,
            'aria-controls': s.panelElement ? s.panelId : void 0,
            disabled: i || void 0,
            autoFocus: a,
            onKeyDown: f,
            onKeyUp: p,
            onClick: m,
          },
      g,
      v,
      b
    )
  return L()({ ourProps: C, theirProps: o, slot: x, defaultTag: Lp, name: `Disclosure.Button` })
}
function Op(e, t) {
  let n = (0, z.useId)(),
    { id: r = `headlessui-disclosure-panel-${n}`, transition: i = !1, ...a } = e,
    [o, s] = Sp(`Disclosure.Panel`),
    { close: c } = Cp(`Disclosure.Panel`),
    [l, u] = (0, kp.useState)(null),
    d = B(
      t,
      N((e) => {
        bp(() => s({ type: 5, element: e }))
      }),
      u
    )
  ;(0, kp.useEffect)(
    () => (
      s({ type: 3, panelId: r }),
      () => {
        s({ type: 3, panelId: null })
      }
    ),
    [r, s]
  )
  let f = wu(),
    [p, m] = $o(i, l, f === null ? o.disclosureState === 0 : (f & G.Open) === G.Open),
    h = F({ open: o.disclosureState === 0, close: c }),
    g = { ref: d, id: r, ...Qo(m) },
    _ = L()
  return kp.createElement(
    Eu,
    null,
    kp.createElement(
      Fp.Provider,
      { value: o.panelId },
      _({
        ourProps: g,
        theirProps: a,
        slot: h,
        defaultTag: Rp,
        features: zp,
        visible: p,
        name: `Disclosure.Panel`,
      })
    )
  )
}
var kp,
  Ap,
  jp,
  Mp,
  Np,
  Pp,
  Fp,
  Ip,
  Lp,
  Rp,
  zp,
  Bp,
  Vp,
  Hp,
  Up = t(() => {
    ;(rt(),
      pt(),
      (kp = e(r(), 1)),
      Ht(),
      P(),
      Dn(),
      Eo(),
      Wt(),
      _r(),
      os(),
      qr(),
      ku(),
      pr(),
      ur(),
      Qt(),
      wt(),
      hn(),
      xp(),
      Or(),
      (Ap = ((e) => ((e[(e.Open = 0)] = `Open`), (e[(e.Closed = 1)] = `Closed`), e))(Ap || {})),
      (jp = ((e) => (
        (e[(e.ToggleDisclosure = 0)] = `ToggleDisclosure`),
        (e[(e.CloseDisclosure = 1)] = `CloseDisclosure`),
        (e[(e.SetButtonId = 2)] = `SetButtonId`),
        (e[(e.SetPanelId = 3)] = `SetPanelId`),
        (e[(e.SetButtonElement = 4)] = `SetButtonElement`),
        (e[(e.SetPanelElement = 5)] = `SetPanelElement`),
        e
      ))(jp || {})),
      (Mp = {
        0: (e) => ({ ...e, disclosureState: I(e.disclosureState, { 0: 1, 1: 0 }) }),
        1: (e) => (e.disclosureState === 1 ? e : { ...e, disclosureState: 1 }),
        2(e, t) {
          return e.buttonId === t.buttonId ? e : { ...e, buttonId: t.buttonId }
        },
        3(e, t) {
          return e.panelId === t.panelId ? e : { ...e, panelId: t.panelId }
        },
        4(e, t) {
          return e.buttonElement === t.element ? e : { ...e, buttonElement: t.element }
        },
        5(e, t) {
          return e.panelElement === t.element ? e : { ...e, panelElement: t.element }
        },
      }),
      (Np = (0, kp.createContext)(null)),
      (Np.displayName = `DisclosureContext`),
      (Pp = (0, kp.createContext)(null)),
      (Pp.displayName = `DisclosureAPIContext`),
      (Fp = (0, kp.createContext)(null)),
      (Fp.displayName = `DisclosurePanelContext`),
      (Ip = kp.Fragment),
      (Lp = `button`),
      (Rp = `div`),
      (zp = pn.RenderStrategy | pn.Static),
      (Bp = R(Ep)),
      (Vp = R(Dp)),
      (Hp = R(Op)),
      Object.assign(Bp, { Button: Vp, Panel: Hp }))
  })
function Wp(e, t) {
  let n = `headlessui-control-${(0, z.useId)()}`,
    [r, i] = jr(),
    [a, o] = br(),
    s = Gt(),
    { disabled: c = s || !1, ...l } = e,
    u = F({ disabled: c }),
    d = { ref: t, disabled: c || void 0, 'aria-disabled': c || void 0 },
    f = L()
  return Gp.createElement(
    Kt,
    { value: c },
    Gp.createElement(
      i,
      { value: r },
      Gp.createElement(
        o,
        { value: a },
        Gp.createElement(
          Yn,
          { id: n },
          f({
            ourProps: d,
            theirProps: {
              ...l,
              children: Gp.createElement(
                Bn,
                null,
                typeof l.children == `function` ? l.children(u) : l.children
              ),
            },
            slot: u,
            defaultTag: Kp,
            name: `Field`,
          })
        )
      )
    )
  )
}
var Gp,
  Kp,
  qp = t(() => {
    ;((Gp = e(r(), 1)), Dn(), Wt(), Yt(), qn(), Qn(), hn(), Dr(), Rr(), (Kp = `div`), R(Wp))
  })
function Jp(e) {
  let t = typeof e == `string` ? e : void 0,
    [n, r] = (0, Yp.useState)(t)
  return [
    t ?? n,
    (0, Yp.useCallback)(
      (e) => {
        t || (tr(e) && r(e.tagName.toLowerCase()))
      },
      [t]
    ),
  ]
}
var Yp,
  Xp = t(() => {
    ;((Yp = e(r(), 1)), ur())
  })
function Zp(e, t) {
  let n = Gt(),
    { disabled: r = n || !1, ...i } = e,
    [a, o] = Jp(e.as ?? $p),
    s = B(t, o),
    [c, l] = jr(),
    u = F({ disabled: r }),
    d =
      a === `fieldset`
        ? { ref: s, 'aria-labelledby': c, disabled: r || void 0 }
        : { ref: s, role: `group`, 'aria-labelledby': c, 'aria-disabled': r || void 0 },
    f = L()
  return Qp.createElement(
    Kt,
    { value: r },
    Qp.createElement(
      l,
      null,
      f({ ourProps: d, theirProps: i, slot: u, defaultTag: $p, name: `Fieldset` })
    )
  )
}
var Qp,
  $p,
  em = t(() => {
    ;((Qp = e(r(), 1)), Xp(), Wt(), _r(), Yt(), hn(), Rr(), ($p = `fieldset`), R(Zp))
  })
function tm(e, t) {
  let n = (0, z.useId)(),
    r = Jn(),
    i = Gt(),
    {
      id: a = r || `headlessui-input-${n}`,
      disabled: o = i || !1,
      autoFocus: s = !1,
      invalid: c = !1,
      ...l
    } = e,
    u = Ar(),
    d = yr(),
    { isFocused: f, focusProps: p } = $e({ autoFocus: s }),
    { isHovered: m, hoverProps: h } = st({ isDisabled: o }),
    g = an(
      {
        ref: t,
        id: a,
        'aria-labelledby': u,
        'aria-describedby': d,
        'aria-invalid': c ? `true` : void 0,
        disabled: o || void 0,
        autoFocus: s,
      },
      p,
      h
    ),
    _ = F({ disabled: o, invalid: c, hover: m, focus: f, autofocus: s })
  return L()({ ourProps: g, theirProps: l, slot: _, defaultTag: nm, name: `Input` })
}
var nm,
  rm = t(() => {
    ;(rt(), pt(), Dn(), Wt(), Yt(), Qn(), hn(), Dr(), Rr(), (nm = `input`), R(tm))
  })
function im(e, t) {
  return am.createElement(Lr, { as: `div`, ref: t, ...e })
}
var am,
  om = t(() => {
    ;((am = e(r(), 1)), hn(), Rr(), R(im))
  })
function sm(e) {
  let t = e.innerText ?? ``,
    n = e.cloneNode(!0)
  if (!tr(n)) return t
  let r = !1
  for (let e of n.querySelectorAll(`[hidden],[aria-hidden],[role="img"]`)) (e.remove(), (r = !0))
  let i = r ? (n.innerText ?? ``) : t
  return (lm.test(i) && (i = i.replace(lm, ``)), i)
}
function cm(e) {
  let t = e.getAttribute(`aria-label`)
  if (typeof t == `string`) return t.trim()
  let n = e.getAttribute(`aria-labelledby`)
  if (n) {
    let e = n
      .split(` `)
      .map((e) => {
        let t = document.getElementById(e)
        if (t) {
          let e = t.getAttribute(`aria-label`)
          return typeof e == `string` ? e.trim() : sm(t).trim()
        }
        return null
      })
      .filter(Boolean)
    if (e.length > 0) return e.join(`, `)
  }
  return sm(e).trim()
}
var lm,
  um = t(() => {
    ;(ur(),
      (lm =
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g))
  })
function dm(e) {
  let t = (0, fm.useRef)(``),
    n = (0, fm.useRef)(``)
  return N(() => {
    let r = e.current
    if (!r) return ``
    let i = r.innerText
    if (t.current === i) return n.current
    let a = cm(r).trim().toLowerCase()
    return ((t.current = i), (n.current = a), a)
  })
}
var fm,
  pm = t(() => {
    ;((fm = e(r(), 1)), um(), P())
  })
function mm(e, t = (e) => e) {
  let n = e.activeOptionIndex === null ? null : e.options[e.activeOptionIndex],
    r = Fa(t(e.options.slice()), (e) => e.dataRef.current.domRef.current),
    i = n ? r.indexOf(n) : null
  return (i === -1 && (i = null), { options: r, activeOptionIndex: i })
}
var hm,
  gm,
  _m,
  vm,
  ym,
  bm,
  xm,
  Sm,
  Cm,
  wm = t(() => {
    ;(ra(),
      da(),
      Iu(),
      pd(),
      Ga(),
      Qt(),
      (hm = Object.defineProperty),
      (gm = (e, t, n) =>
        t in e
          ? hm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
          : (e[t] = n)),
      (_m = (e, t, n) => (gm(e, typeof t == `symbol` ? t : t + ``, n), n)),
      (vm = ((e) => ((e[(e.Open = 0)] = `Open`), (e[(e.Closed = 1)] = `Closed`), e))(vm || {})),
      (ym = ((e) => ((e[(e.Single = 0)] = `Single`), (e[(e.Multi = 1)] = `Multi`), e))(ym || {})),
      (bm = ((e) => ((e[(e.Pointer = 0)] = `Pointer`), (e[(e.Other = 1)] = `Other`), e))(bm || {})),
      (xm = ((e) => (
        (e[(e.OpenListbox = 0)] = `OpenListbox`),
        (e[(e.CloseListbox = 1)] = `CloseListbox`),
        (e[(e.GoToOption = 2)] = `GoToOption`),
        (e[(e.Search = 3)] = `Search`),
        (e[(e.ClearSearch = 4)] = `ClearSearch`),
        (e[(e.SelectOption = 5)] = `SelectOption`),
        (e[(e.RegisterOptions = 6)] = `RegisterOptions`),
        (e[(e.UnregisterOptions = 7)] = `UnregisterOptions`),
        (e[(e.SetButtonElement = 8)] = `SetButtonElement`),
        (e[(e.SetOptionsElement = 9)] = `SetOptionsElement`),
        (e[(e.SortOptions = 10)] = `SortOptions`),
        (e[(e.MarkButtonAsMoved = 11)] = `MarkButtonAsMoved`),
        e
      ))(xm || {})),
      (Sm = {
        1(e) {
          if (e.dataRef.current.disabled || e.listboxState === 1) return e
          let t = e.buttonElement ? fd.Tracked(ud(e.buttonElement)) : e.buttonPositionState
          return {
            ...e,
            activeOptionIndex: null,
            pendingFocus: { focus: K.Nothing },
            listboxState: 1,
            __demoMode: !1,
            buttonPositionState: t,
          }
        },
        0(e, t) {
          if (e.dataRef.current.disabled || e.listboxState === 0) return e
          let n = e.activeOptionIndex,
            { isSelected: r } = e.dataRef.current,
            i = e.options.findIndex((e) => r(e.dataRef.current.value))
          return (
            i !== -1 && (n = i),
            {
              ...e,
              frozenValue: !1,
              pendingFocus: t.focus,
              listboxState: 0,
              activeOptionIndex: n,
              __demoMode: !1,
              buttonPositionState: fd.Idle,
            }
          )
        },
        2(e, t) {
          if (e.dataRef.current.disabled || e.listboxState === 1) return e
          let n = { ...e, searchQuery: ``, activationTrigger: t.trigger ?? 1, __demoMode: !1 }
          if (t.focus === K.Nothing) return { ...n, activeOptionIndex: null }
          if (t.focus === K.Specific)
            return { ...n, activeOptionIndex: e.options.findIndex((e) => e.id === t.id) }
          if (t.focus === K.Previous) {
            let r = e.activeOptionIndex
            if (r !== null) {
              let i = e.options[r].dataRef.current.domRef,
                a = Fu(t, {
                  resolveItems: () => e.options,
                  resolveActiveIndex: () => e.activeOptionIndex,
                  resolveId: (e) => e.id,
                  resolveDisabled: (e) => e.dataRef.current.disabled,
                })
              if (a !== null) {
                let t = e.options[a].dataRef.current.domRef
                if (
                  i.current?.previousElementSibling === t.current ||
                  t.current?.previousElementSibling === null
                )
                  return { ...n, activeOptionIndex: a }
              }
            }
          } else if (t.focus === K.Next) {
            let r = e.activeOptionIndex
            if (r !== null) {
              let i = e.options[r].dataRef.current.domRef,
                a = Fu(t, {
                  resolveItems: () => e.options,
                  resolveActiveIndex: () => e.activeOptionIndex,
                  resolveId: (e) => e.id,
                  resolveDisabled: (e) => e.dataRef.current.disabled,
                })
              if (a !== null) {
                let t = e.options[a].dataRef.current.domRef
                if (
                  i.current?.nextElementSibling === t.current ||
                  t.current?.nextElementSibling === null
                )
                  return { ...n, activeOptionIndex: a }
              }
            }
          }
          let r = mm(e),
            i = Fu(t, {
              resolveItems: () => r.options,
              resolveActiveIndex: () => r.activeOptionIndex,
              resolveId: (e) => e.id,
              resolveDisabled: (e) => e.dataRef.current.disabled,
            })
          return { ...n, ...r, activeOptionIndex: i }
        },
        3: (e, t) => {
          if (e.dataRef.current.disabled || e.listboxState === 1) return e
          let n = +(e.searchQuery === ``),
            r = e.searchQuery + t.value.toLowerCase(),
            i = (
              e.activeOptionIndex === null
                ? e.options
                : e.options
                    .slice(e.activeOptionIndex + n)
                    .concat(e.options.slice(0, e.activeOptionIndex + n))
            ).find(
              (e) => !e.dataRef.current.disabled && e.dataRef.current.textValue?.startsWith(r)
            ),
            a = i ? e.options.indexOf(i) : -1
          return a === -1 || a === e.activeOptionIndex
            ? { ...e, searchQuery: r }
            : { ...e, searchQuery: r, activeOptionIndex: a, activationTrigger: 1 }
        },
        4(e) {
          return e.dataRef.current.disabled || e.listboxState === 1 || e.searchQuery === ``
            ? e
            : { ...e, searchQuery: `` }
        },
        5(e) {
          return e.dataRef.current.mode === 0 ? { ...e, frozenValue: !0 } : { ...e }
        },
        6: (e, t) => {
          let n = e.options.concat(t.options),
            r = e.activeOptionIndex
          if (
            (e.pendingFocus.focus !== K.Nothing &&
              (r = Fu(e.pendingFocus, {
                resolveItems: () => n,
                resolveActiveIndex: () => e.activeOptionIndex,
                resolveId: (e) => e.id,
                resolveDisabled: (e) => e.dataRef.current.disabled,
              })),
            e.activeOptionIndex === null)
          ) {
            let { isSelected: t } = e.dataRef.current
            if (t) {
              let e = n.findIndex((e) => t?.(e.dataRef.current.value))
              e !== -1 && (r = e)
            }
          }
          return {
            ...e,
            options: n,
            activeOptionIndex: r,
            pendingFocus: { focus: K.Nothing },
            pendingShouldSort: !0,
          }
        },
        7: (e, t) => {
          let n = e.options,
            r = [],
            i = new Set(t.options)
          for (let [e, t] of n.entries())
            if (i.has(t.id) && (r.push(e), i.delete(t.id), i.size === 0)) break
          if (r.length > 0) {
            n = n.slice()
            for (let e of r.reverse()) n.splice(e, 1)
          }
          return { ...e, options: n, activationTrigger: 1 }
        },
        8: (e, t) => (e.buttonElement === t.element ? e : { ...e, buttonElement: t.element }),
        9: (e, t) => (e.optionsElement === t.element ? e : { ...e, optionsElement: t.element }),
        10: (e) => (e.pendingShouldSort ? { ...e, ...mm(e), pendingShouldSort: !1 } : e),
        11(e) {
          return e.buttonPositionState.kind === `Tracked`
            ? { ...e, buttonPositionState: fd.Moved }
            : e
        },
      }),
      (Cm = class e extends na {
        constructor(e) {
          ;(super(e),
            _m(this, `actions`, {
              onChange: (e) => {
                let { onChange: t, compare: n, mode: r, value: i } = this.state.dataRef.current
                return I(r, {
                  0: () => t?.(e),
                  1: () => {
                    let r = i.slice(),
                      a = r.findIndex((t) => n(t, e))
                    return (a === -1 ? r.push(e) : r.splice(a, 1), t?.(r))
                  },
                })
              },
              registerOption: Gi(() => {
                let e = [],
                  t = new Set()
                return [
                  (n, r) => {
                    t.has(r) || (t.add(r), e.push({ id: n, dataRef: r }))
                  },
                  () => (t.clear(), this.send({ type: 6, options: e.splice(0) })),
                ]
              }),
              unregisterOption: Gi(() => {
                let e = []
                return [
                  (t) => e.push(t),
                  () => {
                    this.send({ type: 7, options: e.splice(0) })
                  },
                ]
              }),
              goToOption: Gi(() => {
                let e = null
                return [
                  (t, n) => {
                    e = { type: 2, ...t, trigger: n }
                  },
                  () => e && this.send(e),
                ]
              }),
              closeListbox: () => {
                this.send({ type: 1 })
              },
              openListbox: (e) => {
                this.send({ type: 0, focus: e })
              },
              selectActiveOption: () => {
                var e
                if (this.state.activeOptionIndex !== null) {
                  let { dataRef: e } = this.state.options[this.state.activeOptionIndex]
                  this.actions.selectOption(e.current.value)
                } else
                  this.state.dataRef.current.mode === 0 &&
                    (this.actions.closeListbox(),
                    (e = this.state.buttonElement) == null || e.focus({ preventScroll: !0 }))
              },
              selectOption: (e) => {
                this.send({ type: 5, value: e })
              },
              search: (e) => {
                this.send({ type: 3, value: e })
              },
              clearSearch: () => {
                this.send({ type: 4 })
              },
              setButtonElement: (e) => {
                this.send({ type: 8, element: e })
              },
              setOptionsElement: (e) => {
                this.send({ type: 9, element: e })
              },
            }),
            _m(this, `selectors`, {
              activeDescendantId(e) {
                var t
                let n = e.activeOptionIndex,
                  r = e.options
                return n === null || (t = r[n]) == null ? void 0 : t.id
              },
              isActive(e, t) {
                let n = e.activeOptionIndex,
                  r = e.options
                return n === null ? !1 : r[n]?.id === t
              },
              hasFrozenValue(e) {
                return e.frozenValue
              },
              shouldScrollIntoView(e, t) {
                return e.__demoMode || e.listboxState !== 0 || e.activationTrigger === 0
                  ? !1
                  : this.isActive(e, t)
              },
              didButtonMove(e) {
                return e.buttonPositionState.kind === `Moved`
              },
            }),
            this.on(6, () => {
              requestAnimationFrame(() => {
                this.send({ type: 10 })
              })
            }))
          {
            let e = this.state.id,
              t = ua.get(null)
            ;(this.disposables.add(
              t.on(sa.Push, (n) => {
                !t.selectors.isTop(n, e) &&
                  this.state.listboxState === 0 &&
                  this.actions.closeListbox()
              })
            ),
              this.on(0, () => t.actions.push(e)),
              this.on(1, () => t.actions.pop(e)))
          }
          ;(this.disposables.group((e) => {
            this.on(1, (t) => {
              t.buttonElement &&
                (e.dispose(),
                e.add(
                  dd(t.buttonElement, t.buttonPositionState, () => {
                    this.send({ type: 11 })
                  })
                ))
            })
          }),
            this.on(5, (e, t) => {
              var n
              ;(this.actions.onChange(t.value),
                this.state.dataRef.current.mode === 0 &&
                  (this.actions.closeListbox(),
                  (n = this.state.buttonElement) == null || n.focus({ preventScroll: !0 })))
            }))
        }
        static new({ id: t, __demoMode: n = !1 }) {
          return new e({
            id: t,
            dataRef: { current: {} },
            listboxState: +!n,
            options: [],
            searchQuery: ``,
            activeOptionIndex: null,
            activationTrigger: 1,
            buttonElement: null,
            optionsElement: null,
            pendingShouldSort: !1,
            pendingFocus: { focus: K.Nothing },
            frozenValue: !1,
            __demoMode: n,
            buttonPositionState: fd.Idle,
          })
        }
        reduce(e, t) {
          return I(t.type, Sm, e, t)
        }
      }))
  })
function Tm(e) {
  let t = (0, Dm.useContext)(Om)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <Listbox /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, Em), t)
  }
  return t
}
function Em({ id: e, __demoMode: t = !1 }) {
  let n = (0, Dm.useMemo)(() => Cm.new({ id: e, __demoMode: t }), [])
  return (Lu(() => n.dispose()), n)
}
var Dm,
  Om,
  km = t(() => {
    ;((Dm = e(r(), 1)), zu(), wm(), (Om = (0, Dm.createContext)(null)))
  })
function Am(e) {
  let t = (0, Z.useContext)(Lm)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <Listbox /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, Am), t)
  }
  return t
}
function jm(e, t) {
  let n = (0, z.useId)(),
    r = Gt(),
    {
      value: i,
      defaultValue: a,
      form: o,
      name: s,
      onChange: c,
      by: l,
      invalid: u = !1,
      disabled: d = r || !1,
      horizontal: f = !1,
      multiple: p = !1,
      __demoMode: m = !1,
      ...h
    } = e,
    g = f ? `horizontal` : `vertical`,
    _ = B(t),
    v = wn(a),
    [y = p ? [] : void 0, b] = bn(i, c, v),
    x = Em({ id: n, __demoMode: m }),
    S = (0, Z.useRef)({ static: !1, hold: !1 }),
    C = (0, Z.useRef)(new Map()),
    w = Oi(l),
    T = (0, Z.useCallback)(
      (e) => I(E.mode, { [ym.Multi]: () => y.some((t) => w(t, e)), [ym.Single]: () => w(y, e) }),
      [y]
    ),
    E = F({
      value: y,
      disabled: d,
      invalid: u,
      mode: p ? ym.Multi : ym.Single,
      orientation: g,
      onChange: b,
      compare: w,
      isSelected: T,
      optionsPropsRef: S,
      listRef: C,
    })
  M(() => {
    x.state.dataRef.current = E
  }, [E])
  let D = H(x, (e) => e.listboxState),
    O = ua.get(null),
    k = H(
      O,
      (0, Z.useCallback)((e) => O.selectors.isTop(e, n), [O, n])
    ),
    [A, ee] = H(x, (e) => [e.buttonElement, e.optionsElement])
  no(k, [A, ee], (e, t) => {
    ;(x.send({ type: xm.CloseListbox }), ja(t, Ha.Loose) || (e.preventDefault(), A?.focus()))
  })
  let te = F({ open: D === vm.Open, disabled: d, invalid: u, value: y }),
    [ne, re] = jr({ inherit: !0 }),
    ie = { ref: _ },
    ae = (0, Z.useCallback)(() => {
      if (v !== void 0) return b?.(v)
    }, [b, v]),
    j = L()
  return Z.createElement(
    re,
    { value: ne, props: { htmlFor: A?.id }, slot: { open: D === vm.Open, disabled: d } },
    Z.createElement(
      su,
      null,
      Z.createElement(
        Om.Provider,
        { value: x },
        Z.createElement(
          Lm.Provider,
          { value: E },
          Z.createElement(
            Tu,
            { value: I(D, { [vm.Open]: G.Open, [vm.Closed]: G.Closed }) },
            s != null &&
              y != null &&
              Z.createElement(Hn, { disabled: d, data: { [s]: y }, form: o, onReset: ae }),
            j({ ourProps: ie, theirProps: h, slot: te, defaultTag: Rm, name: `Listbox` })
          )
        )
      )
    )
  )
}
function Mm(e, t) {
  let n = (0, z.useId)(),
    r = Jn(),
    i = Am(`Listbox.Button`),
    a = Tm(`Listbox.Button`),
    {
      id: o = r || `headlessui-listbox-button-${n}`,
      disabled: s = i.disabled || !1,
      autoFocus: c = !1,
      ...l
    } = e,
    u = B(t, ru(), a.actions.setButtonElement),
    d = iu(),
    [f, p, m] = H(a, (e) => [e.listboxState, e.buttonElement, e.optionsElement])
  uo(f === vm.Open, {
    trigger: p,
    action: (0, Z.useCallback)(
      (e) => {
        if (p != null && p.contains(e.target)) return mo.Ignore
        let t = e.target.closest(`[role="option"]:not([data-disabled])`)
        return tr(t) ? mo.Select(t) : m != null && m.contains(e.target) ? mo.Ignore : mo.Close
      },
      [p, m]
    ),
    close: a.actions.closeListbox,
    select: a.actions.selectActiveOption,
  })
  let h = N((e) => {
      switch (e.key) {
        case V.Enter:
          jn(e.currentTarget)
          break
        case V.Space:
        case V.ArrowDown:
          ;(e.preventDefault(), a.actions.openListbox({ focus: i.value ? K.Nothing : K.First }))
          break
        case V.ArrowUp:
          ;(e.preventDefault(), a.actions.openListbox({ focus: i.value ? K.Nothing : K.Last }))
          break
      }
    }),
    g = N((e) => {
      switch (e.key) {
        case V.Space:
          e.preventDefault()
          break
      }
    }),
    _ = Li((e) => {
      var t
      a.state.listboxState === vm.Open
        ? ((0, Im.flushSync)(() => a.actions.closeListbox()),
          (t = a.state.buttonElement) == null || t.focus({ preventScroll: !0 }))
        : (e.preventDefault(), a.actions.openListbox({ focus: K.Nothing }))
    }),
    v = N((e) => e.preventDefault()),
    y = Ar([o]),
    b = yr(),
    { isFocusVisible: x, focusProps: S } = $e({ autoFocus: c }),
    { isHovered: C, hoverProps: w } = st({ isDisabled: s }),
    { pressed: T, pressProps: E } = Bt({ disabled: s }),
    D = F({
      open: f === vm.Open,
      active: T || f === vm.Open,
      disabled: s,
      invalid: i.invalid,
      value: i.value,
      hover: C,
      focus: x,
      autofocus: c,
    }),
    O = H(a, (e) => e.listboxState === vm.Open),
    k = an(
      d(),
      {
        ref: u,
        id: o,
        type: wo(e, p),
        'aria-haspopup': `listbox`,
        'aria-controls': m?.id,
        'aria-expanded': O,
        'aria-labelledby': y,
        'aria-describedby': b,
        disabled: s || void 0,
        autoFocus: c,
        onKeyDown: h,
        onKeyUp: g,
        onKeyPress: v,
      },
      _,
      S,
      w,
      E
    )
  return L()({ ourProps: k, theirProps: l, slot: D, defaultTag: zm, name: `Listbox.Button` })
}
function Nm(e, t) {
  let n = (0, z.useId)(),
    {
      id: r = `headlessui-listbox-options-${n}`,
      anchor: i,
      portal: a = !1,
      modal: o = !0,
      transition: s = !1,
      ...c
    } = e,
    l = nu(i),
    [u, d] = (0, Z.useState)(null)
  l && (a = !0)
  let f = Am(`Listbox.Options`),
    p = Tm(`Listbox.Options`),
    [m, h, g, _] = H(p, (e) => [e.listboxState, e.buttonElement, e.optionsElement, e.__demoMode]),
    v = oo(h),
    y = oo(g),
    b = wu(),
    [x, S] = $o(s, u, b === null ? m === vm.Open : (b & G.Open) === G.Open)
  ;(Ea(x, h, p.actions.closeListbox),
    Uo(_ ? !1 : o && m === vm.Open, y),
    Sa(_ ? !1 : o && m === vm.Open, { allowed: (0, Z.useCallback)(() => [h, g], [h, g]) }))
  let C = H(p, p.selectors.didButtonMove) ? !1 : x,
    w = bu(H(p, p.selectors.hasFrozenValue) && !e.static, f.value),
    T = (0, Z.useCallback)((e) => f.compare(w, e), [f.compare, w]),
    E = H(p, (e) => {
      var t
      if (l == null || !((t = l?.to) != null && t.includes(`selection`))) return null
      let n = e.options.findIndex((e) => T(e.dataRef.current.value))
      return (n === -1 && (n = 0), n)
    }),
    [D, O] = ou(
      (() => {
        if (l == null) return
        if (E === null) return { ...l, inner: void 0 }
        let e = Array.from(f.listRef.current.values())
        return { ...l, inner: { listRef: { current: e }, index: E } }
      })()
    ),
    k = au(),
    A = B(t, l ? D : null, p.actions.setOptionsElement, d),
    ee = kt()
  ;(0, Z.useEffect)(() => {
    let e = g
    e && m === vm.Open && (Ct(e) || e == null || e.focus({ preventScroll: !0 }))
  }, [m, g])
  let te = N((e) => {
      var t
      switch ((ee.dispose(), e.key)) {
        case V.Space:
          if (p.state.searchQuery !== ``)
            return (e.preventDefault(), e.stopPropagation(), p.actions.search(e.key))
        case V.Enter:
          ;(e.preventDefault(), e.stopPropagation(), p.actions.selectActiveOption())
          break
        case I(f.orientation, { vertical: V.ArrowDown, horizontal: V.ArrowRight }):
          return (e.preventDefault(), e.stopPropagation(), p.actions.goToOption({ focus: K.Next }))
        case I(f.orientation, { vertical: V.ArrowUp, horizontal: V.ArrowLeft }):
          return (
            e.preventDefault(),
            e.stopPropagation(),
            p.actions.goToOption({ focus: K.Previous })
          )
        case V.Home:
        case V.PageUp:
          return (e.preventDefault(), e.stopPropagation(), p.actions.goToOption({ focus: K.First }))
        case V.End:
        case V.PageDown:
          return (e.preventDefault(), e.stopPropagation(), p.actions.goToOption({ focus: K.Last }))
        case V.Escape:
          ;(e.preventDefault(),
            e.stopPropagation(),
            (0, Im.flushSync)(() => p.actions.closeListbox()),
            (t = p.state.buttonElement) == null || t.focus({ preventScroll: !0 }))
          return
        case V.Tab:
          ;(e.preventDefault(),
            e.stopPropagation(),
            (0, Im.flushSync)(() => p.actions.closeListbox()),
            Ia(p.state.buttonElement, e.shiftKey ? U.Previous : U.Next))
          break
        default:
          e.key.length === 1 &&
            (p.actions.search(e.key), ee.setTimeout(() => p.actions.clearSearch(), 350))
          break
      }
    }),
    ne = H(p, (e) => e.buttonElement?.id),
    re = F({ open: m === vm.Open }),
    ie = an(l ? k() : {}, {
      id: r,
      ref: A,
      'aria-activedescendant': H(p, p.selectors.activeDescendantId),
      'aria-multiselectable': f.mode === ym.Multi ? !0 : void 0,
      'aria-labelledby': ne,
      'aria-orientation': f.orientation,
      onKeyDown: te,
      role: `listbox`,
      tabIndex: m === vm.Open ? 0 : void 0,
      style: { ...c.style, ...O, '--button-width': Mi(x, h, !0).width },
      ...Qo(S),
    }),
    ae = L(),
    j = (0, Z.useMemo)(() => (f.mode === ym.Multi ? f : { ...f, isSelected: T }), [f, T])
  return Z.createElement(
    cd,
    { enabled: a ? e.static || x : !1, ownerDocument: v },
    Z.createElement(
      Lm.Provider,
      { value: j },
      ae({
        ourProps: ie,
        theirProps: c,
        slot: re,
        defaultTag: Vm,
        features: Hm,
        visible: C,
        name: `Listbox.Options`,
      })
    )
  )
}
function Pm(e, t) {
  let n = (0, z.useId)(),
    { id: r = `headlessui-listbox-option-${n}`, disabled: i = !1, value: a, ...o } = e,
    s = (0, Z.useContext)(Bm) === !0,
    c = Am(`Listbox.Option`),
    l = Tm(`Listbox.Option`),
    u = H(l, (e) => l.selectors.isActive(e, r)),
    d = c.isSelected(a),
    f = (0, Z.useRef)(null),
    p = dm(f),
    m = Pt({
      disabled: i,
      value: a,
      domRef: f,
      get textValue() {
        return p()
      },
    }),
    h = B(t, f, (e) => {
      e ? c.listRef.current.set(r, e) : c.listRef.current.delete(r)
    }),
    g = H(l, (e) => l.selectors.shouldScrollIntoView(e, r))
  ;(M(() => {
    if (g)
      return Dt().requestAnimationFrame(() => {
        var e, t
        ;(t = (e = f.current)?.scrollIntoView) == null || t.call(e, { block: `nearest` })
      })
  }, [g, f]),
    M(() => {
      if (!s) return (l.actions.registerOption(r, m), () => l.actions.unregisterOption(r))
    }, [m, r, s]))
  let _ = N((e) => {
      if (i) return e.preventDefault()
      l.actions.selectOption(a)
    }),
    v = N(() => {
      if (i) return l.actions.goToOption({ focus: K.Nothing })
      l.actions.goToOption({ focus: K.Specific, id: r })
    }),
    y = Ko(),
    b = N((e) => y.update(e)),
    x = N((e) => {
      y.wasMoved(e) &&
        (i ||
          (u && l.state.activationTrigger === bm.Pointer) ||
          l.actions.goToOption({ focus: K.Specific, id: r }, bm.Pointer))
    }),
    S = N((e) => {
      y.wasMoved(e) &&
        (i ||
          (u &&
            l.state.activationTrigger === bm.Pointer &&
            l.actions.goToOption({ focus: K.Nothing })))
    }),
    C = F({ active: u, focus: u, selected: d, disabled: i, selectedOption: d && s }),
    w = s
      ? {}
      : {
          id: r,
          ref: h,
          role: `option`,
          tabIndex: i === !0 ? void 0 : -1,
          'aria-disabled': i === !0 ? !0 : void 0,
          'aria-selected': d,
          disabled: void 0,
          onClick: _,
          onFocus: v,
          onPointerEnter: b,
          onMouseEnter: b,
          onPointerMove: x,
          onMouseMove: x,
          onPointerLeave: S,
          onMouseLeave: S,
        },
    T = L()
  return !d && s
    ? null
    : T({ ourProps: w, theirProps: o, slot: C, defaultTag: Um, name: `Listbox.Option` })
}
function Fm(e, t) {
  let { options: n, placeholder: r, ...i } = e,
    a = { ref: B(t) },
    o = Am(`ListboxSelectedOption`),
    s = F({}),
    c =
      o.value === void 0 ||
      o.value === null ||
      (o.mode === ym.Multi && Array.isArray(o.value) && o.value.length === 0),
    l = L()
  return Z.createElement(
    Bm.Provider,
    { value: !0 },
    l({
      ourProps: a,
      theirProps: { ...i, children: Z.createElement(Z.Fragment, null, r && c ? r : n) },
      slot: s,
      defaultTag: Wm,
      name: `ListboxSelectedOption`,
    })
  )
}
var Z,
  Im,
  Lm,
  Rm,
  zm,
  Bm,
  Vm,
  Hm,
  Um,
  Wm,
  Gm,
  Km,
  qm,
  Jm,
  Ym,
  Xm,
  Zm = t(() => {
    ;(rt(),
      pt(),
      (Z = e(r(), 1)),
      (Im = e(a(), 1)),
      Ht(),
      Ai(),
      Cn(),
      En(),
      jt(),
      Pi(),
      P(),
      zi(),
      Dn(),
      Ta(),
      Nt(),
      It(),
      Oa(),
      ao(),
      lo(),
      _o(),
      Eo(),
      Wo(),
      Wt(),
      _r(),
      pm(),
      Jo(),
      os(),
      Yt(),
      vu(),
      qn(),
      Cu(),
      Qn(),
      ku(),
      da(),
      ga(),
      Iu(),
      Ot(),
      ur(),
      Ga(),
      Pn(),
      Qt(),
      wt(),
      hn(),
      Dr(),
      Or(),
      Rr(),
      ld(),
      wm(),
      km(),
      (Lm = (0, Z.createContext)(null)),
      (Lm.displayName = `ListboxDataContext`),
      (Rm = Z.Fragment),
      (zm = `button`),
      (Bm = (0, Z.createContext)(!1)),
      (Vm = `div`),
      (Hm = pn.RenderStrategy | pn.Static),
      (Um = `div`),
      (Wm = Z.Fragment),
      (Gm = R(jm)),
      (Km = R(Mm)),
      (qm = Lr),
      (Jm = R(Nm)),
      (Ym = R(Pm)),
      (Xm = R(Fm)),
      Object.assign(Gm, { Button: Km, Label: qm, Options: Jm, Option: Ym, SelectedOption: Xm }))
  })
function Qm(e, t = (e) => e) {
  let n = e.activeItemIndex === null ? null : e.items[e.activeItemIndex],
    r = Fa(t(e.items.slice()), (e) => e.dataRef.current.domRef.current),
    i = n ? r.indexOf(n) : null
  return (i === -1 && (i = null), { items: r, activeItemIndex: i })
}
var $m,
  eh,
  th,
  nh,
  rh,
  Q,
  ih,
  ah,
  oh = t(() => {
    ;(ra(),
      da(),
      Iu(),
      pd(),
      Ga(),
      Qt(),
      ($m = Object.defineProperty),
      (eh = (e, t, n) =>
        t in e
          ? $m(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
          : (e[t] = n)),
      (th = (e, t, n) => (eh(e, typeof t == `symbol` ? t : t + ``, n), n)),
      (nh = ((e) => ((e[(e.Open = 0)] = `Open`), (e[(e.Closed = 1)] = `Closed`), e))(nh || {})),
      (rh = ((e) => ((e[(e.Pointer = 0)] = `Pointer`), (e[(e.Other = 1)] = `Other`), e))(rh || {})),
      (Q = ((e) => (
        (e[(e.OpenMenu = 0)] = `OpenMenu`),
        (e[(e.CloseMenu = 1)] = `CloseMenu`),
        (e[(e.GoToItem = 2)] = `GoToItem`),
        (e[(e.Search = 3)] = `Search`),
        (e[(e.ClearSearch = 4)] = `ClearSearch`),
        (e[(e.RegisterItems = 5)] = `RegisterItems`),
        (e[(e.UnregisterItems = 6)] = `UnregisterItems`),
        (e[(e.SetButtonElement = 7)] = `SetButtonElement`),
        (e[(e.SetItemsElement = 8)] = `SetItemsElement`),
        (e[(e.SortItems = 9)] = `SortItems`),
        (e[(e.MarkButtonAsMoved = 10)] = `MarkButtonAsMoved`),
        e
      ))(Q || {})),
      (ih = {
        1(e) {
          if (e.menuState === 1) return e
          let t = e.buttonElement ? fd.Tracked(ud(e.buttonElement)) : e.buttonPositionState
          return {
            ...e,
            activeItemIndex: null,
            pendingFocus: { focus: K.Nothing },
            menuState: 1,
            buttonPositionState: t,
          }
        },
        0(e, t) {
          return e.menuState === 0
            ? e
            : {
                ...e,
                __demoMode: !1,
                pendingFocus: t.focus,
                menuState: 0,
                buttonPositionState: fd.Idle,
              }
        },
        2: (e, t) => {
          if (e.menuState === 1) return e
          let n = { ...e, searchQuery: ``, activationTrigger: t.trigger ?? 1, __demoMode: !1 }
          if (t.focus === K.Nothing) return { ...n, activeItemIndex: null }
          if (t.focus === K.Specific)
            return { ...n, activeItemIndex: e.items.findIndex((e) => e.id === t.id) }
          if (t.focus === K.Previous) {
            let r = e.activeItemIndex
            if (r !== null) {
              let i = e.items[r].dataRef.current.domRef,
                a = Fu(t, {
                  resolveItems: () => e.items,
                  resolveActiveIndex: () => e.activeItemIndex,
                  resolveId: (e) => e.id,
                  resolveDisabled: (e) => e.dataRef.current.disabled,
                })
              if (a !== null) {
                let t = e.items[a].dataRef.current.domRef
                if (
                  i.current?.previousElementSibling === t.current ||
                  t.current?.previousElementSibling === null
                )
                  return { ...n, activeItemIndex: a }
              }
            }
          } else if (t.focus === K.Next) {
            let r = e.activeItemIndex
            if (r !== null) {
              let i = e.items[r].dataRef.current.domRef,
                a = Fu(t, {
                  resolveItems: () => e.items,
                  resolveActiveIndex: () => e.activeItemIndex,
                  resolveId: (e) => e.id,
                  resolveDisabled: (e) => e.dataRef.current.disabled,
                })
              if (a !== null) {
                let t = e.items[a].dataRef.current.domRef
                if (
                  i.current?.nextElementSibling === t.current ||
                  t.current?.nextElementSibling === null
                )
                  return { ...n, activeItemIndex: a }
              }
            }
          }
          let r = Qm(e),
            i = Fu(t, {
              resolveItems: () => r.items,
              resolveActiveIndex: () => r.activeItemIndex,
              resolveId: (e) => e.id,
              resolveDisabled: (e) => e.dataRef.current.disabled,
            })
          return { ...n, ...r, activeItemIndex: i }
        },
        3: (e, t) => {
          let n = +(e.searchQuery === ``),
            r = e.searchQuery + t.value.toLowerCase(),
            i = (
              e.activeItemIndex === null
                ? e.items
                : e.items
                    .slice(e.activeItemIndex + n)
                    .concat(e.items.slice(0, e.activeItemIndex + n))
            ).find(
              (e) => e.dataRef.current.textValue?.startsWith(r) && !e.dataRef.current.disabled
            ),
            a = i ? e.items.indexOf(i) : -1
          return a === -1 || a === e.activeItemIndex
            ? { ...e, searchQuery: r }
            : { ...e, searchQuery: r, activeItemIndex: a, activationTrigger: 1 }
        },
        4(e) {
          return e.searchQuery === `` ? e : { ...e, searchQuery: ``, searchActiveItemIndex: null }
        },
        5: (e, t) => {
          let n = e.items.concat(t.items.map((e) => e)),
            r = e.activeItemIndex
          return (
            e.pendingFocus.focus !== K.Nothing &&
              (r = Fu(e.pendingFocus, {
                resolveItems: () => n,
                resolveActiveIndex: () => e.activeItemIndex,
                resolveId: (e) => e.id,
                resolveDisabled: (e) => e.dataRef.current.disabled,
              })),
            {
              ...e,
              items: n,
              activeItemIndex: r,
              pendingFocus: { focus: K.Nothing },
              pendingShouldSort: !0,
            }
          )
        },
        6: (e, t) => {
          let n = e.items,
            r = [],
            i = new Set(t.items)
          for (let [e, t] of n.entries())
            if (i.has(t.id) && (r.push(e), i.delete(t.id), i.size === 0)) break
          if (r.length > 0) {
            n = n.slice()
            for (let e of r.reverse()) n.splice(e, 1)
          }
          return { ...e, items: n, activationTrigger: 1 }
        },
        7: (e, t) => (e.buttonElement === t.element ? e : { ...e, buttonElement: t.element }),
        8: (e, t) => (e.itemsElement === t.element ? e : { ...e, itemsElement: t.element }),
        9: (e) => (e.pendingShouldSort ? { ...e, ...Qm(e), pendingShouldSort: !1 } : e),
        10(e) {
          return e.buttonPositionState.kind === `Tracked`
            ? { ...e, buttonPositionState: fd.Moved }
            : e
        },
      }),
      (ah = class e extends na {
        constructor(e) {
          ;(super(e),
            th(this, `actions`, {
              registerItem: Gi(() => {
                let e = [],
                  t = new Set()
                return [
                  (n, r) => {
                    t.has(r) || (t.add(r), e.push({ id: n, dataRef: r }))
                  },
                  () => (t.clear(), this.send({ type: 5, items: e.splice(0) })),
                ]
              }),
              unregisterItem: Gi(() => {
                let e = []
                return [(t) => e.push(t), () => this.send({ type: 6, items: e.splice(0) })]
              }),
            }),
            th(this, `selectors`, {
              activeDescendantId(e) {
                var t
                let n = e.activeItemIndex,
                  r = e.items
                return n === null || (t = r[n]) == null ? void 0 : t.id
              },
              isActive(e, t) {
                let n = e.activeItemIndex,
                  r = e.items
                return n === null ? !1 : r[n]?.id === t
              },
              shouldScrollIntoView(e, t) {
                return e.__demoMode || e.menuState !== 0 || e.activationTrigger === 0
                  ? !1
                  : this.isActive(e, t)
              },
              didButtonMove(e) {
                return e.buttonPositionState.kind === `Moved`
              },
            }),
            this.on(5, () => {
              this.disposables.requestAnimationFrame(() => {
                this.send({ type: 9 })
              })
            }))
          {
            let e = this.state.id,
              t = ua.get(null)
            ;(this.disposables.add(
              t.on(sa.Push, (n) => {
                !t.selectors.isTop(n, e) && this.state.menuState === 0 && this.send({ type: 1 })
              })
            ),
              this.on(0, () => t.actions.push(e)),
              this.on(1, () => t.actions.pop(e)))
          }
          this.disposables.group((e) => {
            this.on(1, (t) => {
              t.buttonElement &&
                (e.dispose(),
                e.add(
                  dd(t.buttonElement, t.buttonPositionState, () => {
                    this.send({ type: 10 })
                  })
                ))
            })
          })
        }
        static new({ id: t, __demoMode: n = !1 }) {
          return new e({
            id: t,
            __demoMode: n,
            menuState: +!n,
            buttonElement: null,
            itemsElement: null,
            items: [],
            searchQuery: ``,
            activeItemIndex: null,
            activationTrigger: 1,
            pendingShouldSort: !1,
            pendingFocus: { focus: K.Nothing },
            buttonPositionState: fd.Idle,
          })
        }
        reduce(e, t) {
          return I(t.type, ih, e, t)
        }
      }))
  })
function sh(e) {
  let t = (0, lh.useContext)(uh)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <Menu /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, ch), t)
  }
  return t
}
function ch({ id: e, __demoMode: t = !1 }) {
  let n = (0, lh.useMemo)(() => ah.new({ id: e, __demoMode: t }), [])
  return (Lu(() => n.dispose()), n)
}
var lh,
  uh,
  dh = t(() => {
    ;((lh = e(r(), 1)), zu(), oh(), (uh = (0, lh.createContext)(null)))
  })
function fh(e, t) {
  let n = (0, z.useId)(),
    { __demoMode: r = !1, ...i } = e,
    a = ch({ id: n, __demoMode: r }),
    [o, s, c] = H(a, (e) => [e.menuState, e.itemsElement, e.buttonElement]),
    l = B(t),
    u = ua.get(null)
  no(
    H(
      u,
      (0, yh.useCallback)((e) => u.selectors.isTop(e, n), [u, n])
    ),
    [c, s],
    (e, t) => {
      var n
      ;(a.send({ type: Q.CloseMenu }),
        ja(t, Ha.Loose) || (e.preventDefault(), (n = a.state.buttonElement) == null || n.focus()))
    }
  )
  let d = N(() => {
      a.send({ type: Q.CloseMenu })
    }),
    f = F({ open: o === nh.Open, close: d }),
    p = { ref: l },
    m = L()
  return yh.createElement(
    su,
    null,
    yh.createElement(
      uh.Provider,
      { value: a },
      yh.createElement(
        Tu,
        { value: I(o, { [nh.Open]: G.Open, [nh.Closed]: G.Closed }) },
        m({ ourProps: p, theirProps: i, slot: f, defaultTag: xh, name: `Menu` })
      )
    )
  )
}
function ph(e, t) {
  let n = sh(`Menu.Button`),
    r = (0, z.useId)(),
    { id: i = `headlessui-menu-button-${r}`, disabled: a = !1, autoFocus: o = !1, ...s } = e,
    c = (0, yh.useRef)(null),
    l = iu(),
    u = B(
      t,
      c,
      ru(),
      N((e) => n.send({ type: Q.SetButtonElement, element: e }))
    ),
    d = N((e) => {
      switch (e.key) {
        case V.Space:
        case V.Enter:
        case V.ArrowDown:
          ;(e.preventDefault(),
            e.stopPropagation(),
            n.send({ type: Q.OpenMenu, focus: { focus: K.First } }))
          break
        case V.ArrowUp:
          ;(e.preventDefault(),
            e.stopPropagation(),
            n.send({ type: Q.OpenMenu, focus: { focus: K.Last } }))
          break
      }
    }),
    f = N((e) => {
      switch (e.key) {
        case V.Space:
          e.preventDefault()
          break
      }
    }),
    [p, m, h] = H(n, (e) => [e.menuState, e.buttonElement, e.itemsElement])
  uo(p === nh.Open, {
    trigger: m,
    action: (0, yh.useCallback)(
      (e) => {
        if (m != null && m.contains(e.target)) return mo.Ignore
        let t = e.target.closest(`[role="menuitem"]:not([data-disabled])`)
        return tr(t) ? mo.Select(t) : h != null && h.contains(e.target) ? mo.Ignore : mo.Close
      },
      [m, h]
    ),
    close: (0, yh.useCallback)(() => n.send({ type: Q.CloseMenu }), []),
    select: (0, yh.useCallback)((e) => e.click(), []),
  })
  let g = Li((e) => {
      var t
      a ||
        (p === nh.Open
          ? ((0, bh.flushSync)(() => n.send({ type: Q.CloseMenu })),
            (t = c.current) == null || t.focus({ preventScroll: !0 }))
          : (e.preventDefault(),
            n.send({ type: Q.OpenMenu, focus: { focus: K.Nothing }, trigger: rh.Pointer })))
    }),
    { isFocusVisible: _, focusProps: v } = $e({ autoFocus: o }),
    { isHovered: y, hoverProps: b } = st({ isDisabled: a }),
    { pressed: x, pressProps: S } = Bt({ disabled: a }),
    C = F({
      open: p === nh.Open,
      active: x || p === nh.Open,
      disabled: a,
      hover: y,
      focus: _,
      autofocus: o,
    }),
    w = an(
      l(),
      {
        ref: u,
        id: i,
        type: wo(e, c.current),
        'aria-haspopup': `menu`,
        'aria-controls': h?.id,
        'aria-expanded': p === nh.Open,
        disabled: a || void 0,
        autoFocus: o,
        onKeyDown: d,
        onKeyUp: f,
      },
      g,
      v,
      b,
      S
    )
  return L()({ ourProps: w, theirProps: s, slot: C, defaultTag: Sh, name: `Menu.Button` })
}
function mh(e, t) {
  let n = (0, z.useId)(),
    {
      id: r = `headlessui-menu-items-${n}`,
      anchor: i,
      portal: a = !1,
      modal: o = !0,
      transition: s = !1,
      ...c
    } = e,
    l = nu(i),
    u = sh(`Menu.Items`),
    [d, f] = ou(l),
    p = au(),
    [m, h] = (0, yh.useState)(null),
    g = B(
      t,
      l ? d : null,
      N((e) => u.send({ type: Q.SetItemsElement, element: e })),
      h
    ),
    [_, v] = H(u, (e) => [e.menuState, e.buttonElement]),
    y = oo(v),
    b = oo(m)
  l && (a = !0)
  let x = wu(),
    [S, C] = $o(s, m, x === null ? _ === nh.Open : (x & G.Open) === G.Open)
  Ea(S, v, () => {
    u.send({ type: Q.CloseMenu })
  })
  let w = H(u, (e) => e.__demoMode)
  ;(Uo(w ? !1 : o && _ === nh.Open, b),
    Sa(w ? !1 : o && _ === nh.Open, { allowed: (0, yh.useCallback)(() => [v, m], [v, m]) }))
  let T = H(u, u.selectors.didButtonMove) ? !1 : S
  ;((0, yh.useEffect)(() => {
    let e = m
    e && _ === nh.Open && (Ct(e) || e.focus({ preventScroll: !0 }))
  }, [_, m]),
    ss(_ === nh.Open, {
      container: m,
      accept(e) {
        return e.getAttribute(`role`) === `menuitem`
          ? NodeFilter.FILTER_REJECT
          : e.hasAttribute(`role`)
            ? NodeFilter.FILTER_SKIP
            : NodeFilter.FILTER_ACCEPT
      },
      walk(e) {
        e.setAttribute(`role`, `none`)
      },
    }))
  let E = kt(),
    D = N((e) => {
      var t, n
      switch ((E.dispose(), e.key)) {
        case V.Space:
          if (u.state.searchQuery !== ``)
            return (
              e.preventDefault(),
              e.stopPropagation(),
              u.send({ type: Q.Search, value: e.key })
            )
        case V.Enter:
          if ((e.preventDefault(), e.stopPropagation(), u.state.activeItemIndex !== null)) {
            let { dataRef: e } = u.state.items[u.state.activeItemIndex]
            ;(t = e.current?.domRef.current) == null || t.click()
          }
          ;(u.send({ type: Q.CloseMenu }), Ma(u.state.buttonElement))
          break
        case V.ArrowDown:
          return (
            e.preventDefault(),
            e.stopPropagation(),
            u.send({ type: Q.GoToItem, focus: K.Next })
          )
        case V.ArrowUp:
          return (
            e.preventDefault(),
            e.stopPropagation(),
            u.send({ type: Q.GoToItem, focus: K.Previous })
          )
        case V.Home:
        case V.PageUp:
          return (
            e.preventDefault(),
            e.stopPropagation(),
            u.send({ type: Q.GoToItem, focus: K.First })
          )
        case V.End:
        case V.PageDown:
          return (
            e.preventDefault(),
            e.stopPropagation(),
            u.send({ type: Q.GoToItem, focus: K.Last })
          )
        case V.Escape:
          ;(e.preventDefault(),
            e.stopPropagation(),
            (0, bh.flushSync)(() => u.send({ type: Q.CloseMenu })),
            (n = u.state.buttonElement) == null || n.focus({ preventScroll: !0 }))
          break
        case V.Tab:
          ;(e.preventDefault(),
            e.stopPropagation(),
            (0, bh.flushSync)(() => u.send({ type: Q.CloseMenu })),
            Ia(u.state.buttonElement, e.shiftKey ? U.Previous : U.Next))
          break
        default:
          e.key.length === 1 &&
            (u.send({ type: Q.Search, value: e.key }),
            E.setTimeout(() => u.send({ type: Q.ClearSearch }), 350))
          break
      }
    }),
    O = N((e) => {
      switch (e.key) {
        case V.Space:
          e.preventDefault()
          break
      }
    }),
    k = F({ open: _ === nh.Open }),
    A = an(l ? p() : {}, {
      'aria-activedescendant': H(u, u.selectors.activeDescendantId),
      'aria-labelledby': H(u, (e) => e.buttonElement?.id),
      id: r,
      onKeyDown: D,
      onKeyUp: O,
      role: `menu`,
      tabIndex: _ === nh.Open ? 0 : void 0,
      ref: g,
      style: { ...c.style, ...f, '--button-width': Mi(S, v, !0).width },
      ...Qo(C),
    }),
    ee = L()
  return yh.createElement(
    cd,
    { enabled: a ? e.static || S : !1, ownerDocument: y },
    ee({
      ourProps: A,
      theirProps: c,
      slot: k,
      defaultTag: Ch,
      features: wh,
      visible: T,
      name: `Menu.Items`,
    })
  )
}
function hh(e, t) {
  let n = (0, z.useId)(),
    { id: r = `headlessui-menu-item-${n}`, disabled: i = !1, ...a } = e,
    o = sh(`Menu.Item`),
    s = H(o, (e) => o.selectors.isActive(e, r)),
    c = (0, yh.useRef)(null),
    l = B(t, c),
    u = H(o, (e) => o.selectors.shouldScrollIntoView(e, r))
  M(() => {
    if (u)
      return Dt().requestAnimationFrame(() => {
        var e, t
        ;(t = (e = c.current)?.scrollIntoView) == null || t.call(e, { block: `nearest` })
      })
  }, [u, c])
  let d = dm(c),
    f = (0, yh.useRef)({
      disabled: i,
      domRef: c,
      get textValue() {
        return d()
      },
    })
  ;(M(() => {
    f.current.disabled = i
  }, [f, i]),
    M(() => (o.actions.registerItem(r, f), () => o.actions.unregisterItem(r)), [f, r]))
  let p = N(() => {
      o.send({ type: Q.CloseMenu })
    }),
    m = N((e) => {
      if (i) return e.preventDefault()
      ;(o.send({ type: Q.CloseMenu }), Ma(o.state.buttonElement))
    }),
    h = N(() => {
      if (i) return o.send({ type: Q.GoToItem, focus: K.Nothing })
      o.send({ type: Q.GoToItem, focus: K.Specific, id: r })
    }),
    g = Ko(),
    _ = N((e) => g.update(e)),
    v = N((e) => {
      g.wasMoved(e) &&
        (i || s || o.send({ type: Q.GoToItem, focus: K.Specific, id: r, trigger: rh.Pointer }))
    }),
    y = N((e) => {
      g.wasMoved(e) &&
        (i ||
          (s &&
            o.state.activationTrigger === rh.Pointer &&
            o.send({ type: Q.GoToItem, focus: K.Nothing })))
    }),
    [b, x] = jr(),
    [S, C] = br(),
    w = F({ active: s, focus: s, disabled: i, close: p }),
    T = {
      id: r,
      ref: l,
      role: `menuitem`,
      tabIndex: i === !0 ? void 0 : -1,
      'aria-disabled': i === !0 ? !0 : void 0,
      'aria-labelledby': b,
      'aria-describedby': S,
      disabled: void 0,
      onClick: m,
      onFocus: h,
      onPointerEnter: _,
      onMouseEnter: _,
      onPointerMove: v,
      onMouseMove: v,
      onPointerLeave: y,
      onMouseLeave: y,
    },
    E = L()
  return yh.createElement(
    x,
    null,
    yh.createElement(
      C,
      null,
      E({ ourProps: T, theirProps: a, slot: w, defaultTag: Th, name: `Menu.Item` })
    )
  )
}
function gh(e, t) {
  let [n, r] = jr(),
    i = e,
    a = { ref: t, 'aria-labelledby': n, role: `group` },
    o = L()
  return yh.createElement(
    r,
    null,
    o({ ourProps: a, theirProps: i, slot: {}, defaultTag: Eh, name: `Menu.Section` })
  )
}
function _h(e, t) {
  let n = (0, z.useId)(),
    { id: r = `headlessui-menu-heading-${n}`, ...i } = e,
    a = kr()
  M(() => a.register(r), [r, a.register])
  let o = { id: r, ref: t, role: `presentation`, ...a.props }
  return L()({ ourProps: o, theirProps: i, slot: {}, defaultTag: Dh, name: `Menu.Heading` })
}
function vh(e, t) {
  let n = e,
    r = { ref: t, role: `separator` }
  return L()({ ourProps: r, theirProps: n, slot: {}, defaultTag: Oh, name: `Menu.Separator` })
}
var yh,
  bh,
  xh,
  Sh,
  Ch,
  wh,
  Th,
  Eh,
  Dh,
  Oh,
  kh,
  Ah,
  jh,
  Mh,
  Nh,
  Ph,
  Fh,
  Ih = t(() => {
    ;(rt(),
      pt(),
      (yh = e(r(), 1)),
      (bh = e(a(), 1)),
      Ht(),
      jt(),
      Pi(),
      P(),
      zi(),
      Dn(),
      Ta(),
      Nt(),
      Oa(),
      ao(),
      lo(),
      _o(),
      Eo(),
      Wo(),
      Wt(),
      _r(),
      pm(),
      Jo(),
      os(),
      ls(),
      vu(),
      ku(),
      da(),
      ga(),
      Iu(),
      Ot(),
      ur(),
      Ga(),
      Qt(),
      wt(),
      hn(),
      Dr(),
      Or(),
      Rr(),
      ld(),
      oh(),
      dh(),
      (xh = yh.Fragment),
      (Sh = `button`),
      (Ch = `div`),
      (wh = pn.RenderStrategy | pn.Static),
      (Th = yh.Fragment),
      (Eh = `div`),
      (Dh = `header`),
      (Oh = `div`),
      (kh = R(fh)),
      (Ah = R(ph)),
      (jh = R(mh)),
      (Mh = R(hh)),
      (Nh = R(gh)),
      (Ph = R(_h)),
      (Fh = R(vh)),
      Object.assign(kh, {
        Button: Ah,
        Items: jh,
        Item: Mh,
        Section: Nh,
        Heading: Ph,
        Separator: Fh,
      }))
  }),
  Lh,
  Rh,
  zh,
  Bh,
  Vh,
  Hh,
  Uh,
  Wh = t(() => {
    ;(ra(),
      da(),
      ur(),
      Ga(),
      Qt(),
      wt(),
      (Lh = Object.defineProperty),
      (Rh = (e, t, n) =>
        t in e
          ? Lh(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
          : (e[t] = n)),
      (zh = (e, t, n) => (Rh(e, typeof t == `symbol` ? t : t + ``, n), n)),
      (Bh = ((e) => ((e[(e.Open = 0)] = `Open`), (e[(e.Closed = 1)] = `Closed`), e))(Bh || {})),
      (Vh = ((e) => (
        (e[(e.OpenPopover = 0)] = `OpenPopover`),
        (e[(e.ClosePopover = 1)] = `ClosePopover`),
        (e[(e.SetButton = 2)] = `SetButton`),
        (e[(e.SetButtonId = 3)] = `SetButtonId`),
        (e[(e.SetPanel = 4)] = `SetPanel`),
        (e[(e.SetPanelId = 5)] = `SetPanelId`),
        e
      ))(Vh || {})),
      (Hh = {
        0: (e) => (e.popoverState === 0 ? e : { ...e, popoverState: 0, __demoMode: !1 }),
        1(e) {
          return e.popoverState === 1 ? e : { ...e, popoverState: 1, __demoMode: !1 }
        },
        2(e, t) {
          return e.button === t.button ? e : { ...e, button: t.button }
        },
        3(e, t) {
          return e.buttonId === t.buttonId ? e : { ...e, buttonId: t.buttonId }
        },
        4(e, t) {
          return e.panel === t.panel ? e : { ...e, panel: t.panel }
        },
        5(e, t) {
          return e.panelId === t.panelId ? e : { ...e, panelId: t.panelId }
        },
      }),
      (Uh = class e extends na {
        constructor(e) {
          ;(super(e),
            zh(this, `actions`, {
              close: () => this.send({ type: 1 }),
              refocusableClose: (e) => {
                ;(this.actions.close(),
                  (e
                    ? tr(e)
                      ? e
                      : `current` in e && tr(e.current)
                        ? e.current
                        : this.state.button
                    : this.state.button
                  )?.focus())
              },
              open: () => this.send({ type: 0 }),
              setButtonId: (e) => this.send({ type: 3, buttonId: e }),
              setButton: (e) => this.send({ type: 2, button: e }),
              setPanelId: (e) => this.send({ type: 5, panelId: e }),
              setPanel: (e) => this.send({ type: 4, panel: e }),
            }),
            zh(this, `selectors`, {
              isPortalled: (e) => {
                if (!e.button || !e.panel) return !1
                let t = bt(e.button) ?? document
                for (let n of t.querySelectorAll(`body > *`))
                  if (Number(n?.contains(e.button)) ^ Number(n?.contains(e.panel))) return !0
                let n = ka(t),
                  r = n.indexOf(e.button),
                  i = (r + n.length - 1) % n.length,
                  a = (r + 1) % n.length,
                  o = n[i],
                  s = n[a]
                return !e.panel.contains(o) && !e.panel.contains(s)
              },
            }))
          {
            let e = this.state.id,
              t = ua.get(null)
            ;(this.on(0, () => t.actions.push(e)), this.on(1, () => t.actions.pop(e)))
          }
        }
        static new({ id: t, __demoMode: n = !1 }) {
          return new e({
            id: t,
            __demoMode: n,
            popoverState: +!n,
            buttons: { current: [] },
            button: null,
            buttonId: null,
            panel: null,
            panelId: null,
            beforePanelSentinel: { current: null },
            afterPanelSentinel: { current: null },
            afterButtonSentinel: { current: null },
          })
        }
        reduce(e, t) {
          return I(t.type, Hh, e, t)
        }
      }))
  })
function Gh(e) {
  let t = (0, qh.useContext)(Jh)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <Popover /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, Gh), t)
  }
  return t
}
function Kh({ id: e, __demoMode: t = !1 }) {
  let n = (0, qh.useMemo)(() => Uh.new({ id: e, __demoMode: t }), [])
  return (Lu(() => n.dispose()), n)
}
var qh,
  Jh,
  Yh = t(() => {
    ;((qh = e(r(), 1)), zu(), Wh(), (Jh = (0, qh.createContext)(null)))
  })
function Xh() {
  return (0, $.useContext)(rg)
}
function Zh() {
  return (0, $.useContext)(ig)
}
function Qh(e, t) {
  let n = (0, z.useId)(),
    { __demoMode: r = !1, ...i } = e,
    a = Kh({ id: n, __demoMode: r }),
    o = (0, $.useRef)(null),
    s = B(
      t,
      mr((e) => {
        o.current = e
      })
    ),
    [c, l, u, d, f] = H(
      a,
      (0, $.useCallback)((e) => [e.popoverState, e.button, e.panel, e.buttonId, e.panelId], [])
    ),
    p = so(o.current ?? l),
    m = Pt(d),
    h = Pt(f),
    g = (0, $.useMemo)(() => ({ buttonId: m, panelId: h, close: a.actions.close }), [m, h, a]),
    _ = Xh(),
    v = _?.registerPopover,
    y = N(() => {
      let e = St(o.current ?? l)
      return _?.isFocusWithinPopoverGroup() ?? (e && (l?.contains(e) || u?.contains(e)))
    })
  ;(0, $.useEffect)(() => v?.(g), [v, g])
  let [b, x] = Qu(),
    S = df(l),
    C = lf({
      mainTreeNode: S,
      portals: b,
      defaultContainers: [
        {
          get current() {
            return a.state.button
          },
        },
        {
          get current() {
            return a.state.panel
          },
        },
      ],
    })
  ;(vo(
    p,
    `focus`,
    (e) => {
      var t, n, r, i, o, s
      e.target !== window &&
        nr(e.target) &&
        a.state.popoverState === Bh.Open &&
        (y() ||
          (a.state.button &&
            a.state.panel &&
            (C.contains(e.target) ||
              ((n = (t = a.state.beforePanelSentinel.current)?.contains) != null &&
                n.call(t, e.target)) ||
              ((i = (r = a.state.afterPanelSentinel.current)?.contains) != null &&
                i.call(r, e.target)) ||
              ((s = (o = a.state.afterButtonSentinel.current)?.contains) != null &&
                s.call(o, e.target)) ||
              a.actions.close())))
    },
    !0
  ),
    no(c === Bh.Open, C.resolveContainers, (e, t) => {
      ;(a.actions.close(), ja(t, Ha.Loose) || (e.preventDefault(), l?.focus()))
    }))
  let w = F({ open: c === Bh.Open, close: a.actions.refocusableClose }),
    T = H(
      a,
      (0, $.useCallback)((e) => I(e.popoverState, { [Bh.Open]: G.Open, [Bh.Closed]: G.Closed }), [])
    ),
    E = { ref: s },
    D = L()
  return $.createElement(
    uf,
    { node: S },
    $.createElement(
      su,
      null,
      $.createElement(
        ig.Provider,
        { value: null },
        $.createElement(
          Jh.Provider,
          { value: a },
          $.createElement(
            Wr,
            { value: a.actions.refocusableClose },
            $.createElement(
              Tu,
              { value: T },
              $.createElement(
                x,
                null,
                D({ ourProps: E, theirProps: i, slot: w, defaultTag: ag, name: `Popover` })
              )
            )
          )
        )
      )
    )
  )
}
function $h(e, t) {
  let n = (0, z.useId)(),
    { id: r = `headlessui-popover-button-${n}`, disabled: i = !1, autoFocus: a = !1, ...o } = e,
    s = Gh(`Popover.Button`),
    [c, l, u, d, f, p, m] = H(
      s,
      (0, $.useCallback)(
        (e) => [
          e.popoverState,
          s.selectors.isPortalled(e),
          e.button,
          e.buttonId,
          e.panel,
          e.panelId,
          e.afterButtonSentinel,
        ],
        []
      )
    ),
    h = (0, $.useRef)(null),
    g = `headlessui-focus-sentinel-${(0, z.useId)()}`,
    _ = Xh()?.closeOthers,
    v = Zh() !== null
  ;(0, $.useEffect)(() => {
    if (!v) return (s.actions.setButtonId(r), () => s.actions.setButtonId(null))
  }, [v, r, s])
  let [y] = (0, $.useState)(() => Symbol()),
    b = B(
      h,
      t,
      ru(),
      N((e) => {
        if (!v) {
          if (e) s.state.buttons.current.push(y)
          else {
            let e = s.state.buttons.current.indexOf(y)
            e !== -1 && s.state.buttons.current.splice(e, 1)
          }
          ;(s.state.buttons.current.length > 1 &&
            console.warn(
              `You are already using a <Popover.Button /> but only 1 <Popover.Button /> is supported.`
            ),
            e && s.actions.setButton(e))
        }
      })
    ),
    x = B(h, t),
    S = N((e) => {
      var t, n, r
      if (v) {
        if (s.state.popoverState === Bh.Closed) return
        switch (e.key) {
          case V.Space:
          case V.Enter:
            ;(e.preventDefault(),
              (n = (t = e.target).click) == null || n.call(t),
              s.actions.close(),
              (r = s.state.button) == null || r.focus())
            break
        }
      } else
        switch (e.key) {
          case V.Space:
          case V.Enter:
            ;(e.preventDefault(),
              e.stopPropagation(),
              s.state.popoverState === Bh.Closed
                ? (_?.(s.state.buttonId), s.actions.open())
                : s.actions.close())
            break
          case V.Escape:
            if (s.state.popoverState !== Bh.Open) return _?.(s.state.buttonId)
            if (!h.current) return
            let t = St(h.current)
            if (t && !h.current.contains(t)) return
            ;(e.preventDefault(), e.stopPropagation(), s.actions.close())
            break
        }
    }),
    C = N((e) => {
      v || (e.key === V.Space && e.preventDefault())
    }),
    w = N((e) => {
      var t, n
      dr(e.currentTarget) ||
        i ||
        (v
          ? (s.actions.close(), (t = s.state.button) == null || t.focus())
          : (e.preventDefault(),
            e.stopPropagation(),
            s.state.popoverState === Bh.Closed
              ? (_?.(s.state.buttonId), s.actions.open())
              : s.actions.close(),
            (n = s.state.button) == null || n.focus()))
    }),
    T = N((e) => {
      ;(e.preventDefault(), e.stopPropagation())
    }),
    { isFocusVisible: E, focusProps: D } = $e({ autoFocus: a }),
    { isHovered: O, hoverProps: k } = st({ isDisabled: i }),
    { pressed: A, pressProps: ee } = Bt({ disabled: i }),
    te = c === Bh.Open,
    ne = F({ open: te, active: A || te, disabled: i, hover: O, focus: E, autofocus: a }),
    re = wo(e, u),
    ie = an(
      v
        ? { ref: x, type: re, onKeyDown: S, onClick: w, disabled: i || void 0, autoFocus: a }
        : {
            ref: b,
            id: d,
            type: re,
            'aria-expanded': c === Bh.Open,
            'aria-controls': f ? p : void 0,
            disabled: i || void 0,
            autoFocus: a,
            onKeyDown: S,
            onKeyUp: C,
            onClick: w,
            onMouseDown: T,
          },
      D,
      k,
      ee
    ),
    ae = vf(),
    j = N(() => {
      if (!tr(s.state.panel)) return
      let e = s.state.panel
      function t() {
        I(ae.current, {
          [bf.Forwards]: () => La(e, U.First),
          [bf.Backwards]: () => La(e, U.Last),
        }) === Ba.Error &&
          La(
            ka(xt(s.state.button)).filter((e) => e.dataset.headlessuiFocusGuard !== `true`),
            I(ae.current, { [bf.Forwards]: U.Next, [bf.Backwards]: U.Previous }),
            { relativeTo: s.state.button }
          )
      }
      t()
    }),
    oe = L()
  return $.createElement(
    $.Fragment,
    null,
    oe({ ourProps: ie, theirProps: o, slot: ne, defaultTag: og, name: `Popover.Button` }),
    te &&
      !v &&
      l &&
      $.createElement(Rn, {
        id: g,
        ref: m,
        features: Ln.Focusable,
        'data-headlessui-focus-guard': !0,
        as: `button`,
        type: `button`,
        onFocus: j,
      })
  )
}
function eg(e, t) {
  let n = (0, z.useId)(),
    { id: r = `headlessui-popover-backdrop-${n}`, transition: i = !1, ...a } = e,
    o = Gh(`Popover.Backdrop`),
    s = H(
      o,
      (0, $.useCallback)((e) => e.popoverState, [])
    ),
    [c, l] = (0, $.useState)(null),
    u = B(t, l),
    d = wu(),
    [f, p] = $o(i, c, d === null ? s === Bh.Open : (d & G.Open) === G.Open),
    m = N((e) => {
      if (dr(e.currentTarget)) return e.preventDefault()
      o.actions.close()
    }),
    h = F({ open: s === Bh.Open }),
    g = { ref: u, id: r, 'aria-hidden': !0, onClick: m, ...Qo(p) }
  return L()({
    ourProps: g,
    theirProps: a,
    slot: h,
    defaultTag: sg,
    features: cg,
    visible: f,
    name: `Popover.Backdrop`,
  })
}
function tg(e, t) {
  let n = (0, z.useId)(),
    {
      id: r = `headlessui-popover-panel-${n}`,
      focus: i = !1,
      anchor: a,
      portal: o = !1,
      modal: s = !1,
      transition: c = !1,
      ...l
    } = e,
    u = Gh(`Popover.Panel`),
    d = H(u, u.selectors.isPortalled),
    [f, p, m, h, g] = H(
      u,
      (0, $.useCallback)(
        (e) => [
          e.popoverState,
          e.button,
          e.__demoMode,
          e.beforePanelSentinel,
          e.afterPanelSentinel,
        ],
        []
      )
    ),
    _ = `headlessui-focus-sentinel-before-${n}`,
    v = `headlessui-focus-sentinel-after-${n}`,
    y = (0, $.useRef)(null),
    b = nu(a),
    [x, S] = ou(b),
    C = au()
  b && (o = !0)
  let [w, T] = (0, $.useState)(null),
    E = B(y, t, b ? x : null, u.actions.setPanel, T),
    D = oo(p),
    O = oo(y.current)
  M(() => (u.actions.setPanelId(r), () => u.actions.setPanelId(null)), [r, u])
  let k = wu(),
    [A, ee] = $o(c, w, k === null ? f === Bh.Open : (k & G.Open) === G.Open)
  ;(Ea(A, p, u.actions.close), Uo(m ? !1 : s && A, O))
  let te = N((e) => {
    var t
    switch (e.key) {
      case V.Escape:
        if (u.state.popoverState !== Bh.Open || !y.current) return
        let n = St(y.current)
        if (n && !y.current.contains(n)) return
        ;(e.preventDefault(),
          e.stopPropagation(),
          u.actions.close(),
          (t = u.state.button) == null || t.focus())
        break
    }
  })
  ;((0, $.useEffect)(() => {
    var t
    e.static || (f === Bh.Closed && ((t = e.unmount) == null || t) && u.actions.setPanel(null))
  }, [f, e.unmount, e.static, u]),
    (0, $.useEffect)(() => {
      if (m || !i || f !== Bh.Open || !y.current) return
      let e = St(y.current)
      y.current.contains(e) || La(y.current, U.First)
    }, [m, i, y.current, f]))
  let ne = F({ open: f === Bh.Open, close: u.actions.refocusableClose }),
    re = an(b ? C() : {}, {
      ref: E,
      id: r,
      onKeyDown: te,
      onBlur:
        i && f === Bh.Open
          ? (e) => {
              var t, n, r, i, a
              let o = e.relatedTarget
              o &&
                y.current &&
                (((t = y.current) != null && t.contains(o)) ||
                  (u.actions.close(),
                  (((r = (n = h.current)?.contains) != null && r.call(n, o)) ||
                    ((a = (i = g.current)?.contains) != null && a.call(i, o))) &&
                    o.focus({ preventScroll: !0 })))
            }
          : void 0,
      tabIndex: -1,
      style: { ...l.style, ...S, '--button-width': Mi(A, p, !0).width },
      ...Qo(ee),
    }),
    ie = vf(),
    ae = N(() => {
      let e = y.current
      if (!e) return
      function t() {
        I(ie.current, {
          [bf.Forwards]: () => {
            var t
            La(e, U.First) === Ba.Error &&
              ((t = u.state.afterPanelSentinel.current) == null || t.focus())
          },
          [bf.Backwards]: () => {
            var e
            ;(e = u.state.button) == null || e.focus({ preventScroll: !0 })
          },
        })
      }
      t()
    }),
    j = N(() => {
      let e = y.current
      if (!e) return
      function t() {
        I(ie.current, {
          [bf.Forwards]: () => {
            if (!u.state.button) return
            let e = ka(xt(u.state.button) ?? document.body),
              t = e.indexOf(u.state.button),
              n = e.slice(0, t + 1),
              r = [...e.slice(t + 1), ...n]
            for (let e of r.slice())
              if (e.dataset.headlessuiFocusGuard === `true` || (w != null && w.contains(e))) {
                let t = r.indexOf(e)
                t !== -1 && r.splice(t, 1)
              }
            La(r, U.First, { sorted: !1 })
          },
          [bf.Backwards]: () => {
            var t
            La(e, U.Previous) === Ba.Error && ((t = u.state.button) == null || t.focus())
          },
        })
      }
      t()
    }),
    oe = L()
  return $.createElement(
    Eu,
    null,
    $.createElement(
      ig.Provider,
      { value: r },
      $.createElement(
        Wr,
        { value: u.actions.refocusableClose },
        $.createElement(
          cd,
          { enabled: o ? e.static || A : !1, ownerDocument: D },
          A &&
            d &&
            $.createElement(Rn, {
              id: _,
              ref: h,
              features: Ln.Focusable,
              'data-headlessui-focus-guard': !0,
              as: `button`,
              type: `button`,
              onFocus: ae,
            }),
          oe({
            ourProps: re,
            theirProps: l,
            slot: ne,
            defaultTag: lg,
            features: ug,
            visible: A,
            name: `Popover.Panel`,
          }),
          A &&
            d &&
            $.createElement(Rn, {
              id: v,
              ref: g,
              features: Ln.Focusable,
              'data-headlessui-focus-guard': !0,
              as: `button`,
              type: `button`,
              onFocus: j,
            })
        )
      )
    )
  )
}
function ng(e, t) {
  let n = (0, $.useRef)(null),
    r = B(n, t),
    [i, a] = (0, $.useState)([]),
    o = N((e) => {
      a((t) => {
        let n = t.indexOf(e)
        if (n !== -1) {
          let e = t.slice()
          return (e.splice(n, 1), e)
        }
        return t
      })
    }),
    s = N((e) => (a((t) => [...t, e]), () => o(e))),
    c = N(() => {
      var e
      let t = xt(n.current)
      if (!t) return !1
      let r = St(n.current)
      return (e = n.current) != null && e.contains(r)
        ? !0
        : i.some(
            (e) =>
              t.getElementById(e.buttonId.current)?.contains(r) ||
              t.getElementById(e.panelId.current)?.contains(r)
          )
    }),
    l = N((e) => {
      for (let t of i) t.buttonId.current !== e && t.close()
    }),
    u = (0, $.useMemo)(
      () => ({
        registerPopover: s,
        unregisterPopover: o,
        isFocusWithinPopoverGroup: c,
        closeOthers: l,
      }),
      [s, o, c, l]
    ),
    d = F({}),
    f = e,
    p = { ref: r },
    m = L()
  return $.createElement(
    uf,
    null,
    $.createElement(
      rg.Provider,
      { value: u },
      m({ ourProps: p, theirProps: f, slot: d, defaultTag: dg, name: `Popover.Group` })
    )
  )
}
var $,
  rg,
  ig,
  ag,
  og,
  sg,
  cg,
  lg,
  ug,
  dg,
  fg,
  pg,
  mg,
  hg,
  gg,
  _g,
  vg = t(() => {
    ;(rt(),
      pt(),
      ($ = e(r(), 1)),
      Ht(),
      Pi(),
      P(),
      bo(),
      Dn(),
      Nt(),
      It(),
      Oa(),
      ao(),
      lo(),
      Eo(),
      mf(),
      Wo(),
      Wt(),
      _r(),
      xf(),
      os(),
      qr(),
      vu(),
      zn(),
      ku(),
      ga(),
      pr(),
      ur(),
      Ga(),
      Qt(),
      wt(),
      hn(),
      Or(),
      ld(),
      Wh(),
      Yh(),
      (rg = (0, $.createContext)(null)),
      (rg.displayName = `PopoverGroupContext`),
      (ig = (0, $.createContext)(null)),
      (ig.displayName = `PopoverPanelContext`),
      (ag = `div`),
      (og = `button`),
      (sg = `div`),
      (cg = pn.RenderStrategy | pn.Static),
      (lg = `div`),
      (ug = pn.RenderStrategy | pn.Static),
      (dg = `div`),
      (fg = R(Qh)),
      (pg = R($h)),
      (mg = R(eg)),
      (hg = R(eg)),
      (gg = R(tg)),
      (_g = R(ng)),
      Object.assign(fg, { Button: pg, Backdrop: hg, Overlay: mg, Panel: gg, Group: _g }))
  })
function yg(e) {
  let t = (0, Tg.useContext)(Og)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <RadioGroup /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, yg), t)
  }
  return t
}
function bg(e) {
  let t = (0, Tg.useContext)(kg)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <RadioGroup /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, bg), t)
  }
  return t
}
function xg(e, t) {
  return I(t.type, Dg, e, t)
}
function Sg(e, t) {
  let n = (0, z.useId)(),
    r = Gt(),
    {
      id: i = `headlessui-radiogroup-${n}`,
      value: a,
      form: o,
      name: s,
      onChange: c,
      by: l,
      disabled: u = r || !1,
      defaultValue: d,
      tabIndex: f = 0,
      ...p
    } = e,
    m = Oi(l),
    [h, g] = (0, Tg.useReducer)(xg, { options: [] }),
    _ = h.options,
    [v, y] = jr(),
    [b, x] = br(),
    S = (0, Tg.useRef)(null),
    C = B(S, t),
    w = wn(d),
    [T, E] = bn(a, c, w),
    D = (0, Tg.useMemo)(() => _.find((e) => !e.propsRef.current.disabled), [_]),
    O = (0, Tg.useMemo)(() => _.some((e) => m(e.propsRef.current.value, T)), [_, T]),
    k = N((e) => {
      if (u || m(e, T)) return !1
      let t = _.find((t) => m(t.propsRef.current.value, e))?.propsRef.current
      return t != null && t.disabled ? !1 : (E?.(e), !0)
    }),
    A = N((e) => {
      if (!S.current) return
      let t = _.filter((e) => e.propsRef.current.disabled === !1).map((e) => e.element.current)
      switch (e.key) {
        case V.Enter:
          jn(e.currentTarget)
          break
        case V.ArrowLeft:
        case V.ArrowUp:
          if (
            (e.preventDefault(),
            e.stopPropagation(),
            La(t, U.Previous | U.WrapAround) === Ba.Success)
          ) {
            let e = _.find((e) => Ct(e.element.current))
            e && k(e.propsRef.current.value)
          }
          break
        case V.ArrowRight:
        case V.ArrowDown:
          if (
            (e.preventDefault(), e.stopPropagation(), La(t, U.Next | U.WrapAround) === Ba.Success)
          ) {
            let e = _.find((e) => Ct(e.element.current))
            e && k(e.propsRef.current.value)
          }
          break
        case V.Space:
          {
            ;(e.preventDefault(), e.stopPropagation())
            let t = _.find((e) => Ct(e.element.current))
            t && k(t.propsRef.current.value)
          }
          break
      }
    }),
    ee = N((e) => (g({ type: 0, ...e }), () => g({ type: 1, id: e.id }))),
    te = (0, Tg.useMemo)(
      () => ({
        value: T,
        firstOption: D,
        containsCheckedOption: O,
        disabled: u,
        compare: m,
        tabIndex: f,
        ...h,
      }),
      [T, D, O, u, m, f, h]
    ),
    ne = (0, Tg.useMemo)(() => ({ registerOption: ee, change: k }), [ee, k]),
    re = {
      ref: C,
      id: i,
      role: `radiogroup`,
      'aria-labelledby': v,
      'aria-describedby': b,
      onKeyDown: A,
    },
    ie = F({ value: T }),
    ae = (0, Tg.useCallback)(() => {
      if (w !== void 0) return k(w)
    }, [k, w]),
    j = L()
  return Tg.createElement(
    x,
    { name: `RadioGroup.Description` },
    Tg.createElement(
      y,
      { name: `RadioGroup.Label` },
      Tg.createElement(
        kg.Provider,
        { value: ne },
        Tg.createElement(
          Og.Provider,
          { value: te },
          s != null &&
            Tg.createElement(Hn, {
              disabled: u,
              data: { [s]: T || `on` },
              overrides: { type: `radio`, checked: T != null },
              form: o,
              onReset: ae,
            }),
          j({ ourProps: re, theirProps: p, slot: ie, defaultTag: Ag, name: `RadioGroup` })
        )
      )
    )
  )
}
function Cg(e, t) {
  let n = yg(`RadioGroup.Option`),
    r = bg(`RadioGroup.Option`),
    i = (0, z.useId)(),
    {
      id: a = `headlessui-radiogroup-option-${i}`,
      value: o,
      disabled: s = n.disabled || !1,
      autoFocus: c = !1,
      ...l
    } = e,
    u = (0, Tg.useRef)(null),
    d = B(u, t),
    [f, p] = jr(),
    [m, h] = br(),
    g = Pt({ value: o, disabled: s })
  M(() => r.registerOption({ id: a, element: u, propsRef: g }), [a, r, u, g])
  let _ = N((e) => {
      var t
      if (dr(e.currentTarget)) return e.preventDefault()
      r.change(o) && ((t = u.current) == null || t.focus())
    }),
    v = n.firstOption?.id === a,
    { isFocusVisible: y, focusProps: b } = $e({ autoFocus: c }),
    { isHovered: x, hoverProps: S } = st({ isDisabled: s }),
    C = n.compare(n.value, o),
    w = an(
      {
        ref: d,
        id: a,
        role: `radio`,
        'aria-checked': C ? `true` : `false`,
        'aria-labelledby': f,
        'aria-describedby': m,
        'aria-disabled': s ? !0 : void 0,
        tabIndex: s ? -1 : C || (!n.containsCheckedOption && v) ? n.tabIndex : -1,
        onClick: s ? void 0 : _,
        autoFocus: c,
      },
      b,
      S
    ),
    T = F({ checked: C, disabled: s, active: y, hover: x, focus: y, autofocus: c }),
    E = L()
  return Tg.createElement(
    h,
    { name: `RadioGroup.Description` },
    Tg.createElement(
      p,
      { name: `RadioGroup.Label` },
      E({ ourProps: w, theirProps: l, slot: T, defaultTag: jg, name: `RadioGroup.Option` })
    )
  )
}
function wg(e, t) {
  let n = yg(`Radio`),
    r = bg(`Radio`),
    i = (0, z.useId)(),
    a = Jn(),
    o = Gt(),
    {
      id: s = a || `headlessui-radio-${i}`,
      value: c,
      disabled: l = n.disabled || o || !1,
      autoFocus: u = !1,
      ...d
    } = e,
    f = (0, Tg.useRef)(null),
    p = B(f, t),
    m = Ar(),
    h = yr(),
    g = Pt({ value: c, disabled: l })
  M(() => r.registerOption({ id: s, element: f, propsRef: g }), [s, r, f, g])
  let _ = N((e) => {
      var t
      if (dr(e.currentTarget)) return e.preventDefault()
      r.change(c) && ((t = f.current) == null || t.focus())
    }),
    { isFocusVisible: v, focusProps: y } = $e({ autoFocus: u }),
    { isHovered: b, hoverProps: x } = st({ isDisabled: l }),
    S = n.firstOption?.id === s,
    C = n.compare(n.value, c),
    w = an(
      {
        ref: p,
        id: s,
        role: `radio`,
        'aria-checked': C ? `true` : `false`,
        'aria-labelledby': m,
        'aria-describedby': h,
        'aria-disabled': l ? !0 : void 0,
        tabIndex: l ? -1 : C || (!n.containsCheckedOption && S) ? n.tabIndex : -1,
        autoFocus: u,
        onClick: l ? void 0 : _,
      },
      y,
      x
    ),
    T = F({ checked: C, disabled: l, hover: b, focus: v, autofocus: u })
  return L()({ ourProps: w, theirProps: d, slot: T, defaultTag: Mg, name: `Radio` })
}
var Tg,
  Eg,
  Dg,
  Og,
  kg,
  Ag,
  jg,
  Mg,
  Ng,
  Pg,
  Fg,
  Ig,
  Lg,
  Rg = t(() => {
    ;(rt(),
      pt(),
      (Tg = e(r(), 1)),
      Ai(),
      Cn(),
      En(),
      P(),
      Dn(),
      Nt(),
      It(),
      Wt(),
      _r(),
      Yt(),
      qn(),
      Qn(),
      pr(),
      Ga(),
      Pn(),
      Qt(),
      wt(),
      hn(),
      Dr(),
      Or(),
      Rr(),
      (Eg = ((e) => (
        (e[(e.RegisterOption = 0)] = `RegisterOption`),
        (e[(e.UnregisterOption = 1)] = `UnregisterOption`),
        e
      ))(Eg || {})),
      (Dg = {
        0(e, t) {
          let n = [...e.options, { id: t.id, element: t.element, propsRef: t.propsRef }]
          return { ...e, options: Fa(n, (e) => e.element.current) }
        },
        1(e, t) {
          let n = e.options.slice(),
            r = e.options.findIndex((e) => e.id === t.id)
          return r === -1 ? e : (n.splice(r, 1), { ...e, options: n })
        },
      }),
      (Og = (0, Tg.createContext)(null)),
      (Og.displayName = `RadioGroupDataContext`),
      (kg = (0, Tg.createContext)(null)),
      (kg.displayName = `RadioGroupActionsContext`),
      (Ag = `div`),
      (jg = `div`),
      (Mg = `span`),
      (Ng = R(Sg)),
      (Pg = R(Cg)),
      (Fg = R(wg)),
      (Ig = Lr),
      (Lg = Er),
      Object.assign(Ng, { Option: Pg, Radio: Fg, Label: Ig, Description: Lg }))
  })
function zg(e, t) {
  let n = (0, z.useId)(),
    r = Jn(),
    i = Gt(),
    {
      id: a = r || `headlessui-select-${n}`,
      disabled: o = i || !1,
      invalid: s = !1,
      autoFocus: c = !1,
      ...l
    } = e,
    u = Ar(),
    d = yr(),
    { isFocusVisible: f, focusProps: p } = $e({ autoFocus: c }),
    { isHovered: m, hoverProps: h } = st({ isDisabled: o }),
    { pressed: g, pressProps: _ } = Bt({ disabled: o }),
    v = an(
      {
        ref: t,
        id: a,
        'aria-labelledby': u,
        'aria-describedby': d,
        'aria-invalid': s ? `true` : void 0,
        disabled: o || void 0,
        autoFocus: c,
      },
      p,
      h,
      _
    ),
    y = F({ disabled: o, invalid: s, hover: m, focus: f, active: g, autofocus: c })
  return L()({ ourProps: v, theirProps: l, slot: y, defaultTag: Bg, name: `Select` })
}
var Bg,
  Vg = t(() => {
    ;(rt(), pt(), Ht(), Dn(), Wt(), Yt(), Qn(), hn(), Dr(), Rr(), (Bg = `select`), R(zg))
  })
function Hg(e) {
  let [t, n] = (0, Wg.useState)(null),
    [r, i] = jr(),
    [a, o] = br(),
    s = (0, Wg.useMemo)(() => ({ switch: t, setSwitch: n }), [t, n]),
    c = {},
    l = e,
    u = L()
  return Wg.createElement(
    o,
    { name: `Switch.Description`, value: a },
    Wg.createElement(
      i,
      {
        name: `Switch.Label`,
        value: r,
        props: {
          htmlFor: s.switch?.id,
          onClick(e) {
            t &&
              (or(e.currentTarget) && e.preventDefault(), t.click(), t.focus({ preventScroll: !0 }))
          },
        },
      },
      Wg.createElement(
        Gg.Provider,
        { value: s },
        u({ ourProps: c, theirProps: l, slot: {}, defaultTag: Kg, name: `Switch.Group` })
      )
    )
  )
}
function Ug(e, t) {
  let n = (0, z.useId)(),
    r = Jn(),
    i = Gt(),
    {
      id: a = r || `headlessui-switch-${n}`,
      disabled: o = i || !1,
      checked: s,
      defaultChecked: c,
      onChange: l,
      name: u,
      value: d,
      form: f,
      autoFocus: p = !1,
      ...m
    } = e,
    h = (0, Wg.useContext)(Gg),
    [g, _] = (0, Wg.useState)(null),
    v = B((0, Wg.useRef)(null), t, h === null ? null : h.setSwitch, _),
    y = wn(c),
    [b, x] = bn(s, l, y ?? !1),
    S = kt(),
    [C, w] = (0, Wg.useState)(!1),
    T = N(() => {
      ;(w(!0),
        x?.(!b),
        S.nextFrame(() => {
          w(!1)
        }))
    }),
    E = N((e) => {
      if (dr(e.currentTarget)) return e.preventDefault()
      ;(e.preventDefault(), T())
    }),
    D = N((e) => {
      e.key === V.Space ? (e.preventDefault(), T()) : e.key === V.Enter && jn(e.currentTarget)
    }),
    O = N((e) => e.preventDefault()),
    k = Ar(),
    A = yr(),
    { isFocusVisible: ee, focusProps: te } = $e({ autoFocus: p }),
    { isHovered: ne, hoverProps: re } = st({ isDisabled: o }),
    { pressed: ie, pressProps: ae } = Bt({ disabled: o }),
    j = F({ checked: b, disabled: o, hover: ne, focus: ee, active: ie, autofocus: p, changing: C }),
    oe = an(
      {
        id: a,
        ref: v,
        role: `switch`,
        type: wo(e, g),
        tabIndex: e.tabIndex === -1 ? 0 : (e.tabIndex ?? 0),
        'aria-checked': b,
        'aria-labelledby': k,
        'aria-describedby': A,
        disabled: o || void 0,
        autoFocus: p,
        onClick: E,
        onKeyUp: D,
        onKeyPress: O,
      },
      te,
      re,
      ae
    ),
    se = (0, Wg.useCallback)(() => {
      if (y !== void 0) return x?.(y)
    }, [x, y]),
    ce = L()
  return Wg.createElement(
    Wg.Fragment,
    null,
    u != null &&
      Wg.createElement(Hn, {
        disabled: o,
        data: { [u]: d || `on` },
        overrides: { type: `checkbox`, checked: b },
        form: f,
        onReset: se,
      }),
    ce({ ourProps: oe, theirProps: m, slot: j, defaultTag: qg, name: `Switch` })
  )
}
var Wg,
  Gg,
  Kg,
  qg,
  Jg,
  Yg,
  Xg,
  Zg,
  Qg = t(() => {
    ;(rt(),
      pt(),
      (Wg = e(r(), 1)),
      Ht(),
      Cn(),
      En(),
      jt(),
      P(),
      Dn(),
      Eo(),
      Wt(),
      _r(),
      Yt(),
      qn(),
      Qn(),
      pr(),
      ur(),
      Pn(),
      hn(),
      Dr(),
      Or(),
      Rr(),
      (Gg = (0, Wg.createContext)(null)),
      (Gg.displayName = `GroupContext`),
      (Kg = Wg.Fragment),
      (qg = `button`),
      (Jg = R(Ug)),
      (Yg = Hg),
      (Xg = Lr),
      (Zg = Er),
      Object.assign(Jg, { Group: Yg, Label: Xg, Description: Zg }))
  })
function $g({ onFocus: e }) {
  let [t, n] = (0, e_.useState)(!0),
    r = hf()
  return t
    ? e_.createElement(Rn, {
        as: `button`,
        type: `button`,
        features: Ln.Focusable,
        onFocus: (t) => {
          t.preventDefault()
          let i,
            a = 50
          function o() {
            if (a-- <= 0) {
              i && cancelAnimationFrame(i)
              return
            }
            if (e()) {
              if ((cancelAnimationFrame(i), !r.current)) return
              n(!1)
              return
            }
            i = requestAnimationFrame(o)
          }
          i = requestAnimationFrame(o)
        },
      })
    : null
}
var e_,
  t_ = t(() => {
    ;((e_ = e(r(), 1)), _f(), zn())
  })
function n_() {
  return {
    groups: new Map(),
    get(e, t) {
      let n = this.groups.get(e)
      n || ((n = new Map()), this.groups.set(e, n))
      let r = n.get(t) ?? 0
      n.set(t, r + 1)
      let i = Array.from(n.keys()).indexOf(t)
      function a() {
        let e = n.get(t)
        e > 1 ? n.set(t, e - 1) : n.delete(t)
      }
      return [i, a]
    },
  }
}
function r_({ children: e }) {
  let t = a_.useRef(n_())
  return a_.createElement(o_.Provider, { value: t }, e)
}
function i_(e) {
  let t = a_.useContext(o_)
  if (!t) throw Error(`You must wrap your component in a <StableCollection>`)
  let n = a_.useId(),
    [r, i] = t.current.get(e, n)
  return (a_.useEffect(() => i, []), r)
}
var a_,
  o_,
  s_ = t(() => {
    ;((a_ = e(r(), 1)), (o_ = a_.createContext(null)))
  })
function c_(e) {
  let t = (0, g_.useContext)(x_)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <Tab.Group /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, c_), t)
  }
  return t
}
function l_(e) {
  let t = (0, g_.useContext)(S_)
  if (t === null) {
    let t = Error(`<${e} /> is missing a parent <Tab.Group /> component.`)
    throw (Error.captureStackTrace && Error.captureStackTrace(t, l_), t)
  }
  return t
}
function u_(e, t) {
  return I(t.type, b_, e, t)
}
function d_(e, t) {
  let {
      defaultIndex: n = 0,
      vertical: r = !1,
      manual: i = !1,
      onChange: a,
      selectedIndex: o = null,
      ...s
    } = e,
    c = r ? `vertical` : `horizontal`,
    l = i ? `manual` : `auto`,
    u = o !== null,
    d = Pt({ isControlled: u }),
    f = B(t),
    [p, m] = (0, g_.useReducer)(u_, { info: d, selectedIndex: o ?? n, tabs: [], panels: [] }),
    h = F({ selectedIndex: p.selectedIndex }),
    g = Pt(a || (() => {})),
    _ = Pt(p.tabs),
    v = (0, g_.useMemo)(() => ({ orientation: c, activation: l, ...p }), [c, l, p]),
    y = N((e) => (m({ type: 1, tab: e }), () => m({ type: 2, tab: e }))),
    b = N((e) => (m({ type: 3, panel: e }), () => m({ type: 4, panel: e }))),
    x = N((e) => {
      ;(S.current !== e && g.current(e), u || m({ type: 0, index: e }))
    }),
    S = Pt(u ? e.selectedIndex : p.selectedIndex),
    C = (0, g_.useMemo)(() => ({ registerTab: y, registerPanel: b, change: x }), [])
  ;(M(() => {
    m({ type: 0, index: o ?? n })
  }, [o]),
    M(() => {
      if (S.current === void 0 || p.tabs.length <= 0) return
      let e = Fa(p.tabs, (e) => e.current)
      e.some((e, t) => p.tabs[t] !== e) && x(e.indexOf(p.tabs[S.current]))
    }))
  let w = { ref: f },
    T = L()
  return g_.createElement(
    r_,
    null,
    g_.createElement(
      S_.Provider,
      { value: C },
      g_.createElement(
        x_.Provider,
        { value: v },
        v.tabs.length <= 0 &&
          g_.createElement($g, {
            onFocus: () => {
              var e
              for (let t of _.current)
                if (t.current?.tabIndex === 0) return ((e = t.current) == null || e.focus(), !0)
              return !1
            },
          }),
        T({ ourProps: w, theirProps: s, slot: h, defaultTag: C_, name: `Tabs` })
      )
    )
  )
}
function f_(e, t) {
  let { orientation: n, selectedIndex: r } = c_(`Tab.List`),
    i = B(t),
    a = F({ selectedIndex: r }),
    o = e,
    s = { ref: i, role: `tablist`, 'aria-orientation': n }
  return L()({ ourProps: s, theirProps: o, slot: a, defaultTag: w_, name: `Tabs.List` })
}
function p_(e, t) {
  let n = (0, z.useId)(),
    { id: r = `headlessui-tabs-tab-${n}`, disabled: i = !1, autoFocus: a = !1, ...o } = e,
    { orientation: s, activation: c, selectedIndex: l, tabs: u, panels: d } = c_(`Tab`),
    f = l_(`Tab`),
    p = c_(`Tab`),
    [m, h] = (0, g_.useState)(null),
    g = (0, g_.useRef)(null),
    _ = B(g, t, h)
  M(() => f.registerTab(g), [f, g])
  let v = i_(`tabs`),
    y = u.indexOf(g)
  y === -1 && (y = v)
  let b = y === l,
    x = N((e) => {
      let t = e()
      if (t === Ba.Success && c === `auto`) {
        let e = St(g.current),
          t = p.tabs.findIndex((t) => t.current === e)
        t !== -1 && f.change(t)
      }
      return t
    }),
    S = N((e) => {
      let t = u.map((e) => e.current).filter(Boolean)
      if (e.key === V.Space || e.key === V.Enter) {
        ;(e.preventDefault(), e.stopPropagation(), f.change(y))
        return
      }
      switch (e.key) {
        case V.Home:
        case V.PageUp:
          return (e.preventDefault(), e.stopPropagation(), x(() => La(t, U.First)))
        case V.End:
        case V.PageDown:
          return (e.preventDefault(), e.stopPropagation(), x(() => La(t, U.Last)))
      }
      if (
        x(() =>
          I(s, {
            vertical() {
              return e.key === V.ArrowUp
                ? La(t, U.Previous | U.WrapAround)
                : e.key === V.ArrowDown
                  ? La(t, U.Next | U.WrapAround)
                  : Ba.Error
            },
            horizontal() {
              return e.key === V.ArrowLeft
                ? La(t, U.Previous | U.WrapAround)
                : e.key === V.ArrowRight
                  ? La(t, U.Next | U.WrapAround)
                  : Ba.Error
            },
          })
        ) === Ba.Success
      )
        return e.preventDefault()
    }),
    C = (0, g_.useRef)(!1),
    w = N(() => {
      var e
      C.current ||
        ((C.current = !0),
        (e = g.current) == null || e.focus({ preventScroll: !0 }),
        f.change(y),
        Tt(() => {
          C.current = !1
        }))
    }),
    T = N((e) => {
      e.preventDefault()
    }),
    { isFocusVisible: E, focusProps: D } = $e({ autoFocus: a }),
    { isHovered: O, hoverProps: k } = st({ isDisabled: i }),
    { pressed: A, pressProps: ee } = Bt({ disabled: i }),
    te = F({ selected: b, hover: O, active: A, focus: E, autofocus: a, disabled: i }),
    ne = an(
      {
        ref: _,
        onKeyDown: S,
        onMouseDown: T,
        onClick: w,
        id: r,
        role: `tab`,
        type: wo(e, m),
        'aria-controls': d[y]?.current?.id,
        'aria-selected': b,
        tabIndex: b ? 0 : -1,
        disabled: i || void 0,
        autoFocus: a,
      },
      D,
      k,
      ee
    )
  return L()({ ourProps: ne, theirProps: o, slot: te, defaultTag: T_, name: `Tabs.Tab` })
}
function m_(e, t) {
  let { selectedIndex: n } = c_(`Tab.Panels`),
    r = B(t),
    i = F({ selectedIndex: n }),
    a = e,
    o = { ref: r }
  return L()({ ourProps: o, theirProps: a, slot: i, defaultTag: E_, name: `Tabs.Panels` })
}
function h_(e, t) {
  var n, r
  let i = (0, z.useId)(),
    { id: a = `headlessui-tabs-panel-${i}`, tabIndex: o = 0, ...s } = e,
    { selectedIndex: c, tabs: l, panels: u } = c_(`Tab.Panel`),
    d = l_(`Tab.Panel`),
    f = (0, g_.useRef)(null),
    p = B(f, t)
  M(() => d.registerPanel(f), [d, f])
  let m = i_(`panels`),
    h = u.indexOf(f)
  h === -1 && (h = m)
  let g = h === c,
    { isFocusVisible: _, focusProps: v } = $e(),
    y = F({ selected: g, focus: _ }),
    b = an(
      {
        ref: p,
        id: a,
        role: `tabpanel`,
        'aria-labelledby': l[h]?.current?.id,
        tabIndex: g ? o : -1,
      },
      v
    ),
    x = L()
  return !g && ((n = s.unmount) == null || n) && !((r = s.static) != null && r)
    ? g_.createElement(Rn, { 'aria-hidden': `true`, ...b })
    : x({
        ourProps: b,
        theirProps: s,
        slot: y,
        defaultTag: D_,
        features: O_,
        visible: g,
        name: `Tabs.Panel`,
      })
}
var g_,
  __,
  v_,
  y_,
  b_,
  x_,
  S_,
  C_,
  w_,
  T_,
  E_,
  D_,
  O_,
  k_,
  A_,
  j_,
  M_,
  N_,
  P_ = t(() => {
    ;(rt(),
      pt(),
      (g_ = e(r(), 1)),
      Ht(),
      P(),
      Dn(),
      Nt(),
      It(),
      Eo(),
      Wt(),
      _r(),
      t_(),
      zn(),
      Ga(),
      Qt(),
      Et(),
      wt(),
      hn(),
      s_(),
      Or(),
      (__ = ((e) => ((e[(e.Forwards = 0)] = `Forwards`), (e[(e.Backwards = 1)] = `Backwards`), e))(
        __ || {}
      )),
      (v_ = ((e) => (
        (e[(e.Less = -1)] = `Less`),
        (e[(e.Equal = 0)] = `Equal`),
        (e[(e.Greater = 1)] = `Greater`),
        e
      ))(v_ || {})),
      (y_ = ((e) => (
        (e[(e.SetSelectedIndex = 0)] = `SetSelectedIndex`),
        (e[(e.RegisterTab = 1)] = `RegisterTab`),
        (e[(e.UnregisterTab = 2)] = `UnregisterTab`),
        (e[(e.RegisterPanel = 3)] = `RegisterPanel`),
        (e[(e.UnregisterPanel = 4)] = `UnregisterPanel`),
        e
      ))(y_ || {})),
      (b_ = {
        0(e, t) {
          let n = Fa(e.tabs, (e) => e.current),
            r = Fa(e.panels, (e) => e.current),
            i = n.filter((e) => {
              var t
              return !((t = e.current) != null && t.hasAttribute(`disabled`))
            }),
            a = { ...e, tabs: n, panels: r }
          if (t.index < 0 || t.index > n.length - 1) {
            let r = I(Math.sign(t.index - e.selectedIndex), {
              [-1]: () => 1,
              0: () => I(Math.sign(t.index), { [-1]: () => 0, 0: () => 0, 1: () => 1 }),
              1: () => 0,
            })
            if (i.length === 0) return a
            let o = I(r, { 0: () => n.indexOf(i[0]), 1: () => n.indexOf(i[i.length - 1]) })
            return { ...a, selectedIndex: o === -1 ? e.selectedIndex : o }
          }
          let o = n.slice(0, t.index),
            s = [...n.slice(t.index), ...o].find((e) => i.includes(e))
          if (!s) return a
          let c = n.indexOf(s) ?? e.selectedIndex
          return (c === -1 && (c = e.selectedIndex), { ...a, selectedIndex: c })
        },
        1(e, t) {
          if (e.tabs.includes(t.tab)) return e
          let n = e.tabs[e.selectedIndex],
            r = Fa([...e.tabs, t.tab], (e) => e.current),
            i = e.selectedIndex
          return (
            e.info.current.isControlled || ((i = r.indexOf(n)), i === -1 && (i = e.selectedIndex)),
            { ...e, tabs: r, selectedIndex: i }
          )
        },
        2(e, t) {
          return { ...e, tabs: e.tabs.filter((e) => e !== t.tab) }
        },
        3(e, t) {
          return e.panels.includes(t.panel)
            ? e
            : { ...e, panels: Fa([...e.panels, t.panel], (e) => e.current) }
        },
        4(e, t) {
          return { ...e, panels: e.panels.filter((e) => e !== t.panel) }
        },
      }),
      (x_ = (0, g_.createContext)(null)),
      (x_.displayName = `TabsDataContext`),
      (S_ = (0, g_.createContext)(null)),
      (S_.displayName = `TabsActionsContext`),
      (C_ = `div`),
      (w_ = `div`),
      (T_ = `button`),
      (E_ = `div`),
      (D_ = `div`),
      (O_ = pn.RenderStrategy | pn.Static),
      (k_ = R(p_)),
      (A_ = R(d_)),
      (j_ = R(f_)),
      (M_ = R(m_)),
      (N_ = R(h_)),
      Object.assign(k_, { Group: A_, List: j_, Panels: M_, Panel: N_ }))
  })
function F_(e, t) {
  let n = (0, z.useId)(),
    r = Jn(),
    i = Gt(),
    {
      id: a = r || `headlessui-textarea-${n}`,
      disabled: o = i || !1,
      autoFocus: s = !1,
      invalid: c = !1,
      ...l
    } = e,
    u = Ar(),
    d = yr(),
    { isFocused: f, focusProps: p } = $e({ autoFocus: s }),
    { isHovered: m, hoverProps: h } = st({ isDisabled: o }),
    g = an(
      {
        ref: t,
        id: a,
        'aria-labelledby': u,
        'aria-describedby': d,
        'aria-invalid': c ? `true` : void 0,
        disabled: o || void 0,
        autoFocus: s,
      },
      p,
      h
    ),
    _ = F({ disabled: o, invalid: c, hover: m, focus: f, autofocus: s })
  return L()({ ourProps: g, theirProps: l, slot: _, defaultTag: I_, name: `Textarea` })
}
var I_,
  L_ = t(() => {
    ;(rt(), pt(), Dn(), Wt(), Yt(), Qn(), hn(), Dr(), Rr(), (I_ = `textarea`), R(F_))
  }),
  R_ = t(() => {
    ;(yn(),
      Hr(),
      Xr(),
      Qd(),
      nf(),
      vp(),
      Up(),
      qp(),
      em(),
      Pf(),
      rm(),
      om(),
      Zm(),
      Ih(),
      vg(),
      Rg(),
      Vg(),
      Qg(),
      P_(),
      L_(),
      Qf())
  })
function z_(e) {
  switch (e) {
    case `$uuid`:
      return crypto.randomUUID()
    case `$timestamp`:
      return String(Math.floor(Date.now() / 1e3))
    case `$isoTimestamp`:
      return new Date().toISOString()
    case `$randomInt`:
      return String(Math.floor(Math.random() * 1e3))
    case `$randomNanoId`:
      return Array.from({ length: 21 }, () =>
        `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`.charAt(
          Math.floor(Math.random() * 62)
        )
      ).join(``)
    case `$randomBoolean`:
      return String(Math.random() > 0.5)
    case `$randomFirstName`:
      return `Alice`
    case `$randomLastName`:
      return `Johnson`
    case `$randomEmail`:
      return `alice.johnson@example.com`
    case `$randomPhoneNumber`:
      return `+1-555-123-4567`
    case `$randomUrl`:
      return `https://example.com/resource`
    case `$randomIPv4`:
      return `192.168.1.42`
    case `$randomLoremWord`:
      return `lorem`
    case `$randomLoremSentence`:
      return `Lorem ipsum dolor sit amet.`
    default:
      return `…`
  }
}
function B_(e) {
  let t = e.match(/\{\{([^}]*)$/)
  return t ? { query: t[1], openOffset: e.lastIndexOf(`{{`) } : null
}
function V_(e, t) {
  let n = t.toLowerCase(),
    r = Object.entries(H_)
      .filter(([e]) => {
        let t = e.toLowerCase()
        return t.includes(n) || t.slice(1).includes(n)
      })
      .map(([e, t]) => ({
        name: e,
        scope: `dynamic`,
        value: z_(e),
        description: t,
        secret: !1,
        isDynamic: !0,
      })),
    i = Object.entries(e)
      .filter(([e]) => e.toLowerCase().includes(n))
      .map(([e, t]) => ({
        name: e,
        scope: t.scope,
        value: t.secret
          ? `••••••••`
          : typeof t.value == `string`
            ? t.value
            : JSON.stringify(t.value),
        description: t.description ?? void 0,
        secret: t.secret,
        isDynamic: !1,
      }))
      .sort((e, t) => U_.indexOf(e.scope) - U_.indexOf(t.scope))
  return [...r, ...i]
}
var H_,
  U_,
  W_ = t(() => {
    ;((H_ = {
      $randomInt: `Generates a random integer between 0 and 1000.`,
      $timestamp: `Current Unix timestamp in seconds.`,
      $isoTimestamp: `Current ISO 8601 UTC timestamp.`,
      $randomNanoId: `Generates a secure 21-character NanoID.`,
      $uuid: `Generates a random v4 UUID.`,
      $randomFirstName: `Generates a realistic random first name.`,
      $randomLastName: `Generates a realistic random last name.`,
      $randomEmail: `Generates a random email address.`,
      $randomPhoneNumber: `Generates a random phone number.`,
      $randomUrl: `Generates a random URL.`,
      $randomIPv4: `Generates a random IPv4 address.`,
      $randomBoolean: `Generates a random boolean value.`,
      $randomLoremWord: `Generates a random lorem ipsum word.`,
      $randomLoremSentence: `Generates a random lorem ipsum sentence.`,
    }),
      (U_ = [`dynamic`, `runtime`, `folder`, `environment`, `collection`, `global`]))
  })
function G_(e, t) {
  if (!t) return e
  let n = e.toLowerCase().indexOf(t.toLowerCase())
  return n === -1
    ? e
    : (0, K_.jsxs)(K_.Fragment, {
        children: [
          e.slice(0, n),
          (0, K_.jsx)(`mark`, {
            className: `bg-accent/25 text-accent rounded-[2px] not-italic`,
            children: e.slice(n, n + t.length),
          }),
          e.slice(n + t.length),
        ],
      })
}
var K_,
  q_,
  J_,
  Y_,
  X_,
  Z_,
  Q_ = t(() => {
    ;(r(),
      R_(),
      (K_ = i()),
      (q_ = {
        dynamic: `Dynamic`,
        runtime: `Runtime`,
        folder: `Folder`,
        environment: `Environment`,
        collection: `Collection`,
        global: `Global`,
      }),
      (J_ = [`dynamic`, `runtime`, `folder`, `environment`, `collection`, `global`]),
      (Y_ = {
        dynamic: `bg-accent/15 text-accent border-accent/30`,
        runtime: `bg-purple-500/15 text-purple-400 border-purple-400/30`,
        folder: `bg-warning/15 text-warning border-warning/30`,
        environment: `bg-success/15 text-success border-success/30`,
        collection: `bg-success/15 text-success border-success/30`,
        global: `bg-text-muted/15 text-text-secondary border-border-subtle`,
      }),
      (X_ = {
        dynamic: `text-accent`,
        runtime: `text-purple-400`,
        folder: `text-warning`,
        environment: `text-success`,
        collection: `text-success`,
        global: `text-text-secondary`,
      }),
      (Z_ = ({ suggestions: e, query: t, open: n }) => {
        let r = new Map()
        for (let t of e) {
          let e = t.scope
          ;(r.has(e) || r.set(e, []), r.get(e).push(t))
        }
        return (0, K_.jsx)(Yd, {
          portal: !0,
          anchor: `bottom start`,
          hidden: !n || e.length === 0,
          className: `z-[9999] w-80 bg-bg-overlay border border-border-subtle rounded-md shadow-xl overflow-y-auto max-h-64 py-1 font-sans text-text-primary [--anchor-gap:4px]`,
          children: J_.map((e) => {
            let n = r.get(e)
            return !n || n.length === 0
              ? null
              : (0, K_.jsxs)(
                  `div`,
                  {
                    children: [
                      (0, K_.jsx)(`div`, {
                        className: `px-3 pt-2 pb-0.5 text-[9px] font-bold uppercase tracking-wider select-none ${X_[e]}`,
                        children: q_[e],
                      }),
                      n.map((n) => {
                        let r = n.isDynamic && !t.startsWith(`$`) ? `$` + t : t
                        return (0, K_.jsx)(
                          Xd,
                          {
                            value: n.name,
                            className: `flex items-start gap-2 px-3 py-1.5 cursor-pointer select-none transition-colors data-[focus]:bg-accent/10`,
                            children: (0, K_.jsxs)(`div`, {
                              className: `flex-1 min-w-0`,
                              children: [
                                (0, K_.jsxs)(`div`, {
                                  className: `flex items-center gap-1.5 flex-wrap`,
                                  children: [
                                    (0, K_.jsx)(`span`, {
                                      className: `font-mono text-[11px] font-medium text-text-primary`,
                                      children: G_(n.name, r),
                                    }),
                                    (0, K_.jsx)(`span`, {
                                      className: `text-[9px] font-semibold uppercase tracking-wider border rounded-[3px] px-1 py-px shrink-0 ${Y_[e]}`,
                                      children: e,
                                    }),
                                    n.isDynamic &&
                                      (0, K_.jsx)(`span`, {
                                        className: `text-[9px] text-text-muted shrink-0`,
                                        children: `↻ each send`,
                                      }),
                                  ],
                                }),
                                (0, K_.jsx)(`div`, {
                                  className: `font-mono text-[10px] text-text-secondary truncate mt-0.5`,
                                  children: n.isDynamic
                                    ? (0, K_.jsxs)(K_.Fragment, {
                                        children: [
                                          (0, K_.jsxs)(`span`, {
                                            className: `text-text-muted`,
                                            children: [n.description, ` `],
                                          }),
                                          (0, K_.jsxs)(`span`, {
                                            className: `text-accent/70`,
                                            children: [`→ `, n.value],
                                          }),
                                        ],
                                      })
                                    : n.value,
                                }),
                              ],
                            }),
                          },
                          n.name
                        )
                      }),
                    ],
                  },
                  e
                )
          }),
        })
      }),
      (Z_.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `VariablePickerDropdown`,
        props: {
          suggestions: {
            required: !0,
            tsType: {
              name: `Array`,
              elements: [
                {
                  name: `signature`,
                  type: `object`,
                  raw: `{
  name: string
  scope: VariableScope | 'dynamic'
  value: string
  description?: string
  secret: boolean
  isDynamic: boolean
}`,
                  signature: {
                    properties: [
                      { key: `name`, value: { name: `string`, required: !0 } },
                      {
                        key: `scope`,
                        value: {
                          name: `union`,
                          raw: `VariableScope | 'dynamic'`,
                          elements: [
                            {
                              name: `union`,
                              raw: `"global" | "collection" | "folder" | "environment" | "runtime" | "dynamic"`,
                              elements: [
                                { name: `literal`, value: `"global"` },
                                { name: `literal`, value: `"collection"` },
                                { name: `literal`, value: `"folder"` },
                                { name: `literal`, value: `"environment"` },
                                { name: `literal`, value: `"runtime"` },
                                { name: `literal`, value: `"dynamic"` },
                              ],
                            },
                            { name: `literal`, value: `'dynamic'` },
                          ],
                          required: !0,
                        },
                      },
                      { key: `value`, value: { name: `string`, required: !0 } },
                      { key: `description`, value: { name: `string`, required: !1 } },
                      { key: `secret`, value: { name: `boolean`, required: !0 } },
                      { key: `isDynamic`, value: { name: `boolean`, required: !0 } },
                    ],
                  },
                },
              ],
              raw: `VariableSuggestion[]`,
            },
            description: ``,
          },
          query: { required: !0, tsType: { name: `string` }, description: `` },
          open: { required: !0, tsType: { name: `boolean` }, description: `` },
        },
      }))
  })
function $_(e, t, n, r) {
  if (n) return av
  if (!t) return ov
  switch (t.scope) {
    case `environment`:
      return r.has(e) ? nv : tv
    case `collection`:
      return nv
    case `folder`:
      return rv
    case `global`:
      return tv
    case `runtime`:
      return iv
    case `dynamic`:
      return av
    default:
      return tv
  }
}
function ev(e) {
  return e == null ? `` : typeof e == `string` ? e : JSON.stringify(e)
}
var tv,
  nv,
  rv,
  iv,
  av,
  ov,
  sv = t(() => {
    ;((tv = { label: `Global`, cls: `bg-success/15 text-success border-success/30` }),
      (nv = { label: `Collection`, cls: `bg-accent/15 text-accent border-accent/30` }),
      (rv = { label: `Folder`, cls: `bg-warning/15 text-warning border-warning/30` }),
      (iv = { label: `Session`, cls: `bg-bg-muted text-text-secondary border-border-default` }),
      (av = { label: `Dynamic`, cls: `bg-accent/15 text-accent border-accent/30` }),
      (ov = { label: `Unresolved`, cls: `bg-error/15 text-error border-error/30` }))
  }),
  cv,
  lv,
  uv,
  dv,
  fv = t(() => {
    ;((cv = e(r(), 1)),
      (lv = e(a(), 1)),
      o(),
      W_(),
      sv(),
      (uv = i()),
      (dv = ({ data: e, onMouseEnter: t, onMouseLeave: n }) => {
        let { varName: r, resolved: i, isDynamic: a, badge: o, x: d, y: f } = e,
          [p, m] = (0, cv.useState)(!1),
          [h, g] = (0, cv.useState)(!1),
          _ = i ? ev(i.value) : ``
        return lv.createPortal(
          (0, uv.jsxs)(`div`, {
            style: {
              position: `fixed`,
              left: `${d}px`,
              top: `${f}px`,
              transform: `translateX(-50%)`,
              zIndex: 9999,
            },
            onMouseEnter: t,
            onMouseLeave: n,
            className: `w-[260px] bg-bg-overlay border border-border-subtle rounded-md shadow-xl p-2.5 text-xs flex flex-col gap-2 font-sans animate-fade-in`,
            children: [
              (0, uv.jsxs)(`div`, {
                className: `flex items-center justify-between gap-2`,
                children: [
                  (0, uv.jsx)(`span`, {
                    className: `font-mono font-semibold text-text-primary truncate`,
                    children: r,
                  }),
                  (0, uv.jsx)(`span`, {
                    className: `shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${o.cls}`,
                    children: o.label,
                  }),
                ],
              }),
              a
                ? (0, uv.jsx)(`p`, {
                    className: `text-[11px] text-text-secondary leading-relaxed`,
                    children: H_[r] ?? `Generates a value when the request is sent.`,
                  })
                : i
                  ? (0, uv.jsxs)(`div`, {
                      className: `flex items-center gap-1.5 bg-bg-muted/60 border border-border-subtle/60 rounded px-2 py-1.5`,
                      children: [
                        (0, uv.jsx)(`span`, {
                          className: `flex-1 font-mono text-[11px] text-text-primary break-all min-w-0`,
                          children:
                            i.secret && !p
                              ? `••••••••`
                              : _ ||
                                (0, uv.jsx)(`em`, {
                                  className: `text-text-muted not-italic`,
                                  children: `(empty)`,
                                }),
                        }),
                        i.secret &&
                          (0, uv.jsx)(`button`, {
                            onClick: () => m((e) => !e),
                            className: `shrink-0 p-0.5 rounded text-text-muted hover:text-text-primary transition-colors`,
                            title: p ? `Hide value` : `Reveal value`,
                            children: p
                              ? (0, uv.jsx)(u, { size: 13 })
                              : (0, uv.jsx)(c, { size: 13 }),
                          }),
                        (0, uv.jsx)(`button`, {
                          onClick: async () => {
                            try {
                              ;(await navigator.clipboard.writeText(_),
                                g(!0),
                                setTimeout(() => g(!1), 1500))
                            } catch {}
                          },
                          className: `shrink-0 p-0.5 rounded text-text-muted hover:text-text-primary transition-colors`,
                          title: `Copy value`,
                          children: h
                            ? (0, uv.jsx)(s, { size: 13, className: `text-success` })
                            : (0, uv.jsx)(l, { size: 13 }),
                        }),
                      ],
                    })
                  : (0, uv.jsx)(`p`, {
                      className: `text-[11px] text-text-secondary leading-relaxed`,
                      children: `Not defined in any active scope. Define it in an environment or as a variable.`,
                    }),
            ],
          }),
          document.body
        )
      }))
  })
export {
  sv as a,
  V_ as c,
  R_ as d,
  Zd as f,
  $_ as i,
  B_ as l,
  fv as n,
  Z_ as o,
  qd as p,
  ov as r,
  Q_ as s,
  dv as t,
  W_ as u,
}
