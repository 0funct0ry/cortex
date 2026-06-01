import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useUIStore } from '../../stores/uiStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useTabs } from '../../contexts/TabsContext'
import { getTagColor } from '../../utils/tagColors'
import type { Collection, CollectionItem, TagDefinition } from '../../bindings'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  requestPath: string
  collectionPath: string
  collectionName: string
  name: string
  method: string
  url: string
  tags: string[]
  breadcrumb: string
  tagDefs: TagDefinition[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RECENT_KEY = 'cortex.search.recent'
const MAX_RECENT = 5

const METHOD_COLOR: Record<string, string> = {
  GET: 'text-method-get',
  POST: 'text-method-post',
  PUT: 'text-method-put',
  PATCH: 'text-method-patch',
  DELETE: 'text-method-delete',
  HEAD: 'text-method-head',
  OPTIONS: 'text-method-options',
  GraphQL: 'text-method-get',
  gRPC: 'text-method-put',
  WS: 'text-method-patch',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRecentPaths(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function saveRecentPath(path: string) {
  const existing = getRecentPaths().filter((p) => p !== path)
  localStorage.setItem(RECENT_KEY, JSON.stringify([path, ...existing].slice(0, MAX_RECENT)))
}

function flattenCollectionItems(
  items: CollectionItem[],
  collectionPath: string,
  collectionName: string,
  tagDefs: TagDefinition[],
  breadcrumbPrefix: string
): SearchResult[] {
  const results: SearchResult[] = []
  for (const item of items) {
    if (item.type === 'Request') {
      const r = item.data
      results.push({
        requestPath: r.path,
        collectionPath,
        collectionName,
        name: r.name,
        method: r.content?.method ?? 'GET',
        url: r.content?.url ?? '',
        tags: r.content?.tags ?? [],
        breadcrumb: breadcrumbPrefix ? `${breadcrumbPrefix} / ${r.name}` : r.name,
        tagDefs,
      })
    } else if (item.type === 'Folder') {
      const folder = item.data
      const prefix = breadcrumbPrefix ? `${breadcrumbPrefix} / ${folder.name}` : folder.name
      results.push(
        ...flattenCollectionItems(folder.items, collectionPath, collectionName, tagDefs, prefix)
      )
    }
  }
  return results
}

function buildIndex(collections: Record<string, Collection>): SearchResult[] {
  const all: SearchResult[] = []
  for (const col of Object.values(collections)) {
    const name = col.manifest.name ?? col.path.split('/').pop() ?? col.path
    const tagDefs = col.manifest.tag_registry ?? []
    all.push(...flattenCollectionItems(col.items, col.path, name, tagDefs, name))
  }
  return all
}

function matchesQuery(result: SearchResult, query: string): boolean {
  const q = query.toLowerCase()
  return (
    result.name.toLowerCase().includes(q) ||
    result.url.toLowerCase().includes(q) ||
    result.method.toLowerCase().includes(q) ||
    result.tags.some((t) => t.toLowerCase().includes(q))
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const MethodBadge: React.FC<{ method: string }> = ({ method }) => (
  <span
    className={`shrink-0 text-[10px] font-bold w-14 text-right tabular-nums ${METHOD_COLOR[method] ?? 'text-text-muted'}`}
  >
    {method}
  </span>
)

const TagPill: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  const tc = getTagColor(color)
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium leading-none shrink-0"
      style={{ backgroundColor: tc.bg + '33', color: tc.bg }}
    >
      {name}
    </span>
  )
}

interface ResultRowProps {
  result: SearchResult
  isSelected: boolean
  onSelect: (r: SearchResult) => void
  onHover: (index: number) => void
  index: number
}

const ResultRow: React.FC<ResultRowProps> = ({ result, isSelected, onSelect, onHover, index }) => {
  const tagDefsMap = useMemo(() => {
    const m: Record<string, string> = {}
    for (const td of result.tagDefs) m[td.name] = td.color
    return m
  }, [result.tagDefs])

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
        isSelected ? 'bg-accent/15' : 'hover:bg-bg-highlight'
      }`}
      onClick={() => onSelect(result)}
      onMouseEnter={() => onHover(index)}
    >
      <MethodBadge method={result.method} />
      <span className="flex-1 min-w-0 text-xs text-text-secondary truncate font-mono">
        {result.url || <span className="text-text-muted italic">no url</span>}
      </span>
      <div className="flex items-center gap-1 shrink-0 max-w-[120px] overflow-hidden">
        {result.tags.slice(0, 2).map((tag) => (
          <TagPill key={tag} name={tag} color={tagDefsMap[tag] ?? 'gray'} />
        ))}
      </div>
      <span className="shrink-0 text-xs text-text-primary font-medium max-w-[140px] truncate">
        {result.name}
      </span>
    </div>
  )
}

// ─── Inner content — mounts fresh on every open, so state needs no manual reset ─

const CommandPaletteContent: React.FC = () => {
  const { closeCommandPalette } = useUIStore()
  const { collections } = useCollectionStore()
  const { openTab } = useTabs()

  // State initialises fresh on every mount (i.e. every palette open).
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Build flat index from all collections.
  const index = useMemo(() => buildIndex(collections), [collections])

  // Resolve recent paths on first render.
  const recentResults = useMemo(() => {
    const paths = getRecentPaths()
    return paths
      .map((p) => index.find((r) => r.requestPath === p))
      .filter((r): r is SearchResult => r !== undefined)
  }, [index])

  // Filtered results when query is non-empty.
  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    return index.filter((r) => matchesQuery(r, query.trim()))
  }, [query, index])

  const showRecent = query.trim() === ''
  const activeResults = showRecent ? recentResults : searchResults

  // Group results by collection; derive a flat list in the same visual order.
  // All keyboard navigation indexes into flatOrdered, not the raw activeResults.
  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>()
    for (const r of activeResults) {
      if (!map.has(r.collectionName)) map.set(r.collectionName, [])
      map.get(r.collectionName)!.push(r)
    }
    return Array.from(map.entries())
  }, [activeResults])

  const flatOrdered = useMemo(() => grouped.flatMap(([, items]) => items), [grouped])

  // Refs so the window-level keyboard handler always reads current values
  // without needing to be re-registered on every render.
  const flatOrderedRef = useRef(flatOrdered)
  const selectedIndexRef = useRef(selectedIndex)
  const closeRef = useRef(closeCommandPalette)

  useEffect(() => {
    flatOrderedRef.current = flatOrdered
  }, [flatOrdered])
  useEffect(() => {
    selectedIndexRef.current = selectedIndex
  }, [selectedIndex])
  useEffect(() => {
    closeRef.current = closeCommandPalette
  }, [closeCommandPalette])

  const handleSelect = useCallback(
    (result: SearchResult) => {
      saveRecentPath(result.requestPath)
      openTab({
        type: 'request',
        requestPath: result.requestPath,
        collectionId: result.collectionPath,
        collectionPath: null,
        folderPath: null,
        name: result.name,
        method: result.method,
      })
      closeCommandPalette()
    },
    [openTab, closeCommandPalette]
  )

  const handleSelectRef = useRef(handleSelect)
  useEffect(() => {
    handleSelectRef.current = handleSelect
  }, [handleSelect])

  // Autofocus the input on mount.
  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 30)
    return () => clearTimeout(id)
  }, [])

  // Window-level keyboard handler — works regardless of which element has focus,
  // so arrow keys work correctly while the user is typing in the input.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, flatOrderedRef.current.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const r = flatOrderedRef.current[selectedIndexRef.current]
        if (r) handleSelectRef.current(r)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Keep the selected row scrolled into view.
  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector(`[data-idx="${selectedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  // Reset selection to first item when the query changes (event handler, not effect).
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setSelectedIndex(0)
  }

  const handleClearQuery = () => {
    setQuery('')
    setSelectedIndex(0)
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150"
        onClick={closeCommandPalette}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-[600px] mx-4 bg-bg-overlay border border-border-subtle rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
          <svg
            className="shrink-0 text-text-muted"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search requests, URLs, methods, tags…"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={handleClearQuery}
              className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <kbd className="shrink-0 text-[10px] text-text-muted border border-border-subtle rounded px-1.5 py-0.5 font-mono">
            esc
          </kbd>
        </div>

        {/* Results list */}
        <div ref={listRef} className="max-h-[400px] overflow-y-auto">
          {grouped.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-muted">
              {showRecent ? 'No recent searches' : 'No results found'}
            </div>
          ) : (
            <>
              {showRecent && (
                <div className="px-3 pt-2 pb-1">
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                    Recent
                  </span>
                </div>
              )}
              {grouped.map(([collectionName, items]) => {
                const groupStart = flatOrdered.indexOf(items[0])
                return (
                  <div key={collectionName}>
                    <div className="px-3 pt-2 pb-0.5 flex items-center gap-1.5">
                      <svg
                        className="text-text-muted shrink-0"
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider truncate">
                        {collectionName}
                      </span>
                    </div>
                    {items.map((result, i) => {
                      const absIdx = groupStart + i
                      return (
                        <div key={result.requestPath} data-idx={absIdx}>
                          <ResultRow
                            result={result}
                            isSelected={selectedIndex === absIdx}
                            onSelect={handleSelect}
                            onHover={setSelectedIndex}
                            index={absIdx}
                          />
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border-subtle bg-bg-panel">
          <span className="flex items-center gap-1 text-[10px] text-text-muted">
            <kbd className="border border-border-subtle rounded px-1 py-0.5 font-mono text-[9px]">
              ↑↓
            </kbd>
            navigate
          </span>
          <span className="flex items-center gap-1 text-[10px] text-text-muted">
            <kbd className="border border-border-subtle rounded px-1 py-0.5 font-mono text-[9px]">
              ↵
            </kbd>
            open
          </span>
          <span className="flex items-center gap-1 text-[10px] text-text-muted">
            <kbd className="border border-border-subtle rounded px-1 py-0.5 font-mono text-[9px]">
              esc
            </kbd>
            close
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Outer wrapper — controls visibility via portal ───────────────────────────
// Mounting CommandPaletteContent only when open means its state initialises
// fresh each time without any manual reset effects.

const CommandPaletteModal: React.FC = () => {
  const { isCommandPaletteOpen } = useUIStore()
  if (!isCommandPaletteOpen) return null
  return createPortal(<CommandPaletteContent />, document.body)
}

export default CommandPaletteModal
