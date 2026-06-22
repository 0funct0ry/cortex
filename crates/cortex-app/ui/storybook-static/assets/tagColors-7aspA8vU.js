import { n as e } from './chunk-DnJy8xQt.js'
function t(e) {
  return r.find((t) => t.name === e) ?? r[r.length - 1]
}
function n(e) {
  return r.find((t) => !e.includes(t.name)) ?? r[0]
}
var r,
  i = e(() => {
    r = [
      { name: `red`, bg: `#ef4444`, text: `#fff` },
      { name: `orange`, bg: `#f97316`, text: `#fff` },
      { name: `yellow`, bg: `#eab308`, text: `#000` },
      { name: `lime`, bg: `#84cc16`, text: `#000` },
      { name: `green`, bg: `#22c55e`, text: `#fff` },
      { name: `teal`, bg: `#14b8a6`, text: `#fff` },
      { name: `cyan`, bg: `#06b6d4`, text: `#fff` },
      { name: `blue`, bg: `#3b82f6`, text: `#fff` },
      { name: `indigo`, bg: `#6366f1`, text: `#fff` },
      { name: `violet`, bg: `#8b5cf6`, text: `#fff` },
      { name: `pink`, bg: `#ec4899`, text: `#fff` },
      { name: `gray`, bg: `#6b7280`, text: `#fff` },
    ]
  })
export { i, n, t as r, r as t }
