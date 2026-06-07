export type TreeNodeType = 'collection' | 'folder' | 'request' | 'example'

export function computeDropPositionFromCoords(
  clientY: number,
  rect: DOMRect,
  nodeType: TreeNodeType
): 'before' | 'after' | 'inside' {
  const ratio = (clientY - rect.top) / rect.height
  if (nodeType === 'request') return ratio < 0.5 ? 'before' : 'after'
  if (ratio < 0.25) return 'before'
  if (ratio > 0.75) return 'after'
  return 'inside'
}

export function findDragTarget(
  x: number,
  y: number
): { path: string; nodeType: TreeNodeType; element: HTMLElement } | null {
  let el = document.elementFromPoint(x, y) as HTMLElement | null
  while (el) {
    if (el.dataset.path && el.dataset.nodetype) {
      return {
        path: el.dataset.path,
        nodeType: el.dataset.nodetype as TreeNodeType,
        element: el,
      }
    }
    el = el.parentElement
  }
  return null
}
