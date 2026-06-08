// Fuzzy matching with tiered scoring.
//
// Score tiers:
//   100 = exact prefix
//    80 = word-boundary prefix
//    60 = substring
//    40 = fuzzy (scattered chars in order)
//    null = no match

export function fuzzyScore(query: string, target: string): number | null {
  if (!query) return 60 // empty query matches everything at mid-rank

  const q = query.toLowerCase()
  const t = target.toLowerCase()

  if (t.startsWith(q)) return 100

  // Word-boundary prefix: query matches the start of any word in target
  const words = t.split(/[\s\-_/]/)
  for (const word of words) {
    if (word.startsWith(q)) return 80
  }

  // Also check CamelCase word boundaries
  const camelWords = t.split(/(?=[A-Z])/)
  for (const word of camelWords) {
    if (word.toLowerCase().startsWith(q)) return 80
  }

  if (t.includes(q)) return 60

  // Fuzzy: all chars of query appear in target in order
  let ti = 0
  for (let qi = 0; qi < q.length; qi++) {
    const idx = t.indexOf(q[qi], ti)
    if (idx === -1) return null
    ti = idx + 1
  }
  return 40
}

// Returns indices in `target` that are matched by fuzzy query (for highlight rendering).
export function fuzzyMatchIndices(query: string, target: string): number[] {
  if (!query) return []
  const q = query.toLowerCase()
  const t = target.toLowerCase()
  const indices: number[] = []

  // For prefix match, highlight the prefix
  if (t.startsWith(q)) {
    return Array.from({ length: q.length }, (_, i) => i)
  }

  // Fuzzy: track sequential char positions
  let ti = 0
  for (let qi = 0; qi < q.length; qi++) {
    const idx = t.indexOf(q[qi], ti)
    if (idx === -1) return []
    indices.push(idx)
    ti = idx + 1
  }
  return indices
}
