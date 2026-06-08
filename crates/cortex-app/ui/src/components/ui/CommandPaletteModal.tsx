import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useUIStore } from '../../stores/uiStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { useTabs } from '../../contexts/TabsContext'
import {
  useCommandRegistry,
  setCommandAction,
  type Command,
  type SubPickerType,
} from '../../stores/commandRegistry'
import { fuzzyScore, fuzzyMatchIndices } from '../../utils/fuzzyMatch'
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

const CURATED_IDS = [
  'nav.open-request',
  'request.send',
  'env.switch',
  'view.toggle-sidebar',
  'collection.new-request',
  'env.edit',
]

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

// ─── Search helpers ───────────────────────────────────────────────────────────

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

function buildSearchIndex(collections: Record<string, Collection>): SearchResult[] {
  const all: SearchResult[] = []
  for (const col of Object.values(collections)) {
    const name = col.manifest.name ?? col.path.split('/').pop() ?? col.path
    const tagDefs = col.manifest.tag_registry ?? []
    all.push(...flattenCollectionItems(col.items, col.path, name, tagDefs, name))
  }
  return all
}

function matchesSearchQuery(result: SearchResult, query: string): boolean {
  const q = query.toLowerCase()
  return (
    result.name.toLowerCase().includes(q) ||
    result.url.toLowerCase().includes(q) ||
    result.method.toLowerCase().includes(q) ||
    result.tags.some((t) => t.toLowerCase().includes(q))
  )
}

// ─── Command filtering ────────────────────────────────────────────────────────

interface CommandContext {
  isRequestTab: boolean
  isCollectionFocused: boolean
}

function filterCommands(
  commands: Command[],
  query: string,
  ctx: CommandContext
): { cmd: Command; score: number; notAvailable: boolean }[] {
  const results: { cmd: Command; score: number; notAvailable: boolean }[] = []

  for (const cmd of commands) {
    const nameScore = fuzzyScore(query, cmd.name)
    const descScore = cmd.description ? fuzzyScore(query, cmd.description) : null
    const rawScore = nameScore !== null ? nameScore : descScore !== null ? descScore - 20 : null
    if (rawScore === null) continue

    const notAvailable =
      (cmd.context === 'request-tab' && !ctx.isRequestTab) ||
      (cmd.context === 'collection-focused' && !ctx.isCollectionFocused)

    if (notAvailable && !query) continue

    results.push({ cmd, score: rawScore, notAvailable })
  }

  return results.sort((a, b) => {
    if (a.notAvailable !== b.notAvailable) return a.notAvailable ? 1 : -1
    return b.score - a.score
  })
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

const HighlightedName: React.FC<{ name: string; query: string }> = ({ name, query }) => {
  if (!query) return <span>{name}</span>
  const indices = new Set(fuzzyMatchIndices(query, name))
  return (
    <span>
      {name.split('').map((ch, i) =>
        indices.has(i) ? (
          <span key={i} className="text-accent font-semibold">
            {ch}
          </span>
        ) : (
          <span key={i}>{ch}</span>
        )
      )}
    </span>
  )
}

const KbdChip: React.FC<{ shortcut: string }> = ({ shortcut }) => (
  <kbd className="shrink-0 text-[10px] text-text-muted border border-border-subtle rounded px-1.5 py-0.5 font-mono whitespace-nowrap">
    {shortcut}
  </kbd>
)

const ScriptIcon: React.FC = () => (
  <svg
    className="shrink-0 text-text-muted"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="10" y1="13" x2="14" y2="13" />
    <line x1="10" y1="17" x2="14" y2="17" />
  </svg>
)

const ClockIcon: React.FC = () => (
  <svg
    className="shrink-0 text-text-muted"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const BackIcon: React.FC = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15,18 9,12 15,6" />
  </svg>
)

const SearchInputIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
    style={{ color: 'var(--color-text-muted)' }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const ClearIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="shrink-0"
    style={{ color: 'var(--color-text-muted)' }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-3.707 6.293a1 1 0 00-1.414 1.414L10.586 12l-3.707 3.293a1 1 0 001.414 1.414L12 13.414l3.293 3.293a1 1 0 001.414-1.414L13.414 12l3.293-3.293a1 1 0 00-1.414-1.414L12 10.586 8.707 8.293z"
    />
  </svg>
)

// ─── Search result row ────────────────────────────────────────────────────────

interface SearchResultRowProps {
  result: SearchResult
}

const SearchResultRow: React.FC<SearchResultRowProps> = ({ result }) => {
  const tagDefsMap = useMemo(() => {
    const m: Record<string, string> = {}
    for (const td of result.tagDefs) m[td.name] = td.color
    return m
  }, [result.tagDefs])

  return (
    <div className="flex items-center gap-2 w-full min-w-0">
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

// ─── Command row ──────────────────────────────────────────────────────────────

interface CommandRowProps {
  cmd: Command
  isRecent: boolean
  notAvailable: boolean
  query: string
  errorId: string | null
  errorMsg: string
}

const CommandRow: React.FC<CommandRowProps> = ({
  cmd,
  isRecent,
  notAvailable,
  query,
  errorId,
  errorMsg,
}) => {
  const hasError = errorId === cmd.id

  return (
    <div className={`flex items-center gap-2 w-full min-w-0 ${notAvailable ? 'opacity-50' : ''}`}>
      {cmd.isScript && <ScriptIcon />}
      {isRecent && !cmd.isScript && <ClockIcon />}
      {!isRecent && !cmd.isScript && <span className="w-3 shrink-0" />}

      <span className="flex-1 min-w-0 text-xs text-text-primary truncate">
        <HighlightedName name={cmd.name} query={query} />
        {notAvailable && (
          <span className="ml-2 text-text-muted font-normal">— not available here</span>
        )}
        {hasError && <span className="ml-2 text-red-400 font-normal">⚠ {errorMsg}</span>}
      </span>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-bg-panel border border-border-subtle">
          {cmd.category}
        </span>
        {cmd.shortcut && <KbdChip shortcut={cmd.shortcut} />}
      </div>
    </div>
  )
}

// ─── Sub-picker row ───────────────────────────────────────────────────────────

const SubPickerRow: React.FC<{ item: string; isActive: boolean }> = ({ item, isActive }) => (
  <div className="flex items-center w-full min-w-0">
    <span
      className={`flex-1 text-xs text-text-primary truncate ${isActive ? 'font-semibold' : ''}`}
    >
      {item}
    </span>
    {isActive && <span className="ml-auto text-[10px] text-text-muted shrink-0">active</span>}
  </div>
)

// ─── List item button ─────────────────────────────────────────────────────────
// Uses the "command-palette-list-item" class — keeps parity with react-cmdk's
// DOM-query-based keyboard navigation convention.

interface CmdItemProps {
  isSelected: boolean
  onClick: () => void
  onHover: () => void
  children: React.ReactNode
}

const CmdItem: React.FC<CmdItemProps> = ({ isSelected, onClick, onHover, children }) => (
  <button
    type="button"
    className={`command-palette-list-item block w-full text-left px-3.5 py-2.5 rounded-md flex items-center justify-between transition-colors focus:outline-none ${
      isSelected ? 'bg-bg-highlight' : 'hover:bg-bg-highlight'
    }`}
    onClick={onClick}
    onMouseEnter={onHover}
  >
    {children}
  </button>
)

// ─── Inner content ────────────────────────────────────────────────────────────

const CommandPaletteContent: React.FC = () => {
  const { closeCommandPalette, commandPaletteMode } = useUIStore()
  const { collections, selectedPath } = useCollectionStore()
  const { environments, activeEnvironmentName, setActiveEnvironment } = useEnvironmentStore()
  const { openTab, tabs, activeTabId, closeTab, closeTabsWhere, duplicateTab } = useTabs()
  const { commands, recentCommandIds, recordUsed } = useCommandRegistry()

  const activeTab = tabs.find((t) => t.id === activeTabId)
  const isRequestTab = activeTab?.type === 'request'
  const isCollectionFocused =
    selectedPath != null || activeTab?.type === 'collection' || activeTab?.type === 'folder'

  const [mode, setMode] = useState<'search' | 'command'>(commandPaletteMode)
  const [query, setQuery] = useState('')
  // True when command mode was entered by typing ">" — allows Backspace to return to search.
  const [enteredViaPrefix, setEnteredViaPrefix] = useState(false)
  const [subPicker, setSubPicker] = useState<SubPickerType | null>(null)
  const [subPickerLabel, setSubPickerLabel] = useState('')
  const [subPickerQuery, setSubPickerQuery] = useState('')
  const [errorId, setErrorId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Keyboard navigation: tracks the flat 0-based index of the currently highlighted item
  const [selected, setSelected] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Wire built-in command actions ─────────────────────────────────────────

  const { toggleSidebar, toggleLayout } = useUIStore()

  useEffect(() => {
    setCommandAction('view.toggle-sidebar', toggleSidebar)
  }, [toggleSidebar])

  useEffect(() => {
    setCommandAction('view.toggle-layout', toggleLayout)
  }, [toggleLayout])

  useEffect(() => {
    setCommandAction('env.edit', () => {
      openTab({
        type: 'environments',
        name: 'Environments',
        requestPath: null,
        collectionId: null,
        collectionPath: null,
        folderPath: null,
        method: '',
      })
      closeCommandPalette()
    })
  }, [openTab, closeCommandPalette])

  useEffect(() => {
    setCommandAction('collection.new-request', () => {
      useUIStore.getState().openNewRequestDialog()
      closeCommandPalette()
    })
  }, [closeCommandPalette])

  useEffect(() => {
    setCommandAction('collection.new-transient', () => {
      useUIStore.getState().openNewTransientDialog()
      closeCommandPalette()
    })
  }, [closeCommandPalette])

  useEffect(() => {
    setCommandAction('collection.import', () => {
      useUIStore.getState().openImportCollectionDialog('zip')
      closeCommandPalette()
    })
  }, [closeCommandPalette])

  useEffect(() => {
    setCommandAction('view.zoom-in', () => {
      document.documentElement.style.zoom = String(
        Math.min(2, parseFloat(document.documentElement.style.zoom || '1') + 0.1)
      )
      closeCommandPalette()
    })
  }, [closeCommandPalette])

  useEffect(() => {
    setCommandAction('view.zoom-out', () => {
      document.documentElement.style.zoom = String(
        Math.max(0.5, parseFloat(document.documentElement.style.zoom || '1') - 0.1)
      )
      closeCommandPalette()
    })
  }, [closeCommandPalette])

  useEffect(() => {
    setCommandAction('view.zoom-reset', () => {
      document.documentElement.style.zoom = '1'
      closeCommandPalette()
    })
  }, [closeCommandPalette])

  // "Open Request →" and "Open Recent →": run() switches to search mode
  useEffect(() => {
    setCommandAction('nav.open-request', () => {
      setMode('search')
      setSubPicker(null)
      setQuery('')
    })
  }, [])

  useEffect(() => {
    setCommandAction('workspace.open-recent', () => {
      setMode('search')
      setSubPicker(null)
      setQuery('')
    })
  }, [])

  useEffect(() => {
    setCommandAction('request.send', () => {
      window.dispatchEvent(new CustomEvent('cortex:send-request'))
      closeCommandPalette()
    })
  }, [closeCommandPalette])

  useEffect(() => {
    setCommandAction('request.save', () => {
      window.dispatchEvent(new CustomEvent('cortex:save-request'))
      closeCommandPalette()
    })
  }, [closeCommandPalette])

  useEffect(() => {
    setCommandAction('request.close-tab', () => {
      if (activeTabId) closeTab(activeTabId)
      closeCommandPalette()
    })
  }, [activeTabId, closeTab, closeCommandPalette])

  useEffect(() => {
    setCommandAction('request.close-all-tabs', () => {
      closeTabsWhere(() => true)
      closeCommandPalette()
    })
  }, [closeTabsWhere, closeCommandPalette])

  useEffect(() => {
    setCommandAction('request.clone', () => {
      if (activeTabId) duplicateTab(activeTabId)
      closeCommandPalette()
    })
  }, [activeTabId, duplicateTab, closeCommandPalette])

  useEffect(() => {
    setCommandAction('collection.new', () => {
      useUIStore.getState().openNewRequestDialog()
      closeCommandPalette()
    })
  }, [closeCommandPalette])

  useEffect(() => {
    setCommandAction('env.new', () => {
      openTab({
        type: 'environments',
        name: 'Environments',
        requestPath: null,
        collectionId: null,
        collectionPath: null,
        folderPath: null,
        method: '',
      })
      closeCommandPalette()
    })
  }, [openTab, closeCommandPalette])

  // ── Build search index ────────────────────────────────────────────────────

  const searchIndex = useMemo(() => buildSearchIndex(collections), [collections])

  const recentSearchResults = useMemo(() => {
    const paths = getRecentPaths()
    return paths
      .map((p) => searchIndex.find((r) => r.requestPath === p))
      .filter((r): r is SearchResult => r !== undefined)
  }, [searchIndex])

  // ── Page / search routing ─────────────────────────────────────────────────

  const currentPage = subPicker ? `sub-${subPicker}` : mode === 'search' ? 'search' : 'command'
  const currentSearch = subPicker ? subPickerQuery : query
  const effectiveQuery = query

  // ── Reset selection when page or search changes ───────────────────────────

  // (Handled via event handlers to avoid cascading renders in effects)

  // ── Handle close / back ───────────────────────────────────────────────────

  const handleClose = useCallback(() => {
    setSelected(0)
    if (subPicker) {
      setSubPicker(null)
      setSubPickerQuery('')
    } else {
      closeCommandPalette()
    }
  }, [subPicker, closeCommandPalette])

  // ── Handle search input change ────────────────────────────────────────────

  const handleSearchChange = useCallback(
    (val: string) => {
      setSelected(0)
      if (subPicker) {
        setSubPickerQuery(val)
        return
      }
      if (mode === 'search' && val === '>') {
        setSelected(0)
        setMode('command')
        setEnteredViaPrefix(true)
        setQuery('')
        return
      }
      setQuery(val)
      setErrorId(null)
    },
    [subPicker, mode]
  )

  // ── Sub-picker back ───────────────────────────────────────────────────────

  const handleSubPickerBack = useCallback(() => {
    setSelected(0)
    setSubPicker(null)
    setSubPickerQuery('')
  }, [])

  // ── Backspace-to-search (when entered command mode via ">") ───────────────

  useEffect(() => {
    if (!enteredViaPrefix) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && query === '' && !subPicker) {
        e.preventDefault()
        setSelected(0)
        setMode('search')
        setEnteredViaPrefix(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enteredViaPrefix, query, subPicker])

  // ── Keyboard navigation ───────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = containerRef.current?.querySelectorAll<HTMLElement>(
        '.command-palette-list-item'
      )
      if (!items) return

      if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n') || (e.ctrlKey && e.key === 'j')) {
        e.preventDefault()
        e.stopPropagation()
        if (items.length === 0) return
        const next = selected === items.length - 1 ? 0 : selected + 1
        setSelected(next)
        items[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      } else if (
        e.key === 'ArrowUp' ||
        (e.ctrlKey && e.key === 'p') ||
        (e.ctrlKey && e.key === 'k')
      ) {
        e.preventDefault()
        e.stopPropagation()
        if (items.length === 0) return
        const prev = selected === 0 ? items.length - 1 : selected - 1
        setSelected(prev)
        items[prev]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      } else if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        items[selected]?.click()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        handleClose()
      }
    },
    [selected, handleClose]
  )

  // ── Input-level key handling (Backspace-when-empty for sub-picker back) ───

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && currentSearch === '' && subPicker) {
        e.preventDefault()
        handleSubPickerBack()
      }
    },
    [currentSearch, subPicker, handleSubPickerBack]
  )

  // ── Search mode results ───────────────────────────────────────────────────

  const searchResults = useMemo(() => {
    if (mode !== 'search') return []
    if (!effectiveQuery.trim()) return []
    return searchIndex.filter((r) => matchesSearchQuery(r, effectiveQuery.trim()))
  }, [mode, effectiveQuery, searchIndex])

  const showRecentSearch = mode === 'search' && effectiveQuery.trim() === ''
  const activeSearchResults = showRecentSearch ? recentSearchResults : searchResults

  const groupedSearch = useMemo(() => {
    const map = new Map<string, SearchResult[]>()
    for (const r of activeSearchResults) {
      if (!map.has(r.collectionName)) map.set(r.collectionName, [])
      map.get(r.collectionName)!.push(r)
    }
    return Array.from(map.entries())
  }, [activeSearchResults])

  // ── Command mode results ──────────────────────────────────────────────────

  const commandCtx = useMemo(
    () => ({ isRequestTab: !!isRequestTab, isCollectionFocused: !!isCollectionFocused }),
    [isRequestTab, isCollectionFocused]
  )

  const filteredCommands = useMemo(() => {
    if (mode !== 'command' || subPicker) return []
    return filterCommands(commands, effectiveQuery, commandCtx)
  }, [mode, subPicker, commands, effectiveQuery, commandCtx])

  const emptyStateCommands = useMemo(() => {
    if (mode !== 'command' || effectiveQuery || subPicker) return []
    const recentCmds = recentCommandIds
      .map((id) => commands.find((c) => c.id === id))
      .filter((c): c is Command => c !== undefined)
    const curatedCmds = CURATED_IDS.map((id) => commands.find((c) => c.id === id))
      .filter((c): c is Command => c !== undefined)
      .filter((c) => !recentCmds.find((r) => r.id === c.id))
    return [...recentCmds, ...curatedCmds]
  }, [mode, effectiveQuery, subPicker, commands, recentCommandIds])

  const isEmptyState = mode === 'command' && !effectiveQuery && !subPicker

  const groupedCommands = useMemo(() => {
    const source = isEmptyState
      ? emptyStateCommands.map((cmd) => ({ cmd, score: 0, notAvailable: false }))
      : filteredCommands
    const map = new Map<string, typeof source>()
    for (const item of source) {
      const cat = item.cmd.category
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(item)
    }
    return Array.from(map.entries())
  }, [isEmptyState, emptyStateCommands, filteredCommands])

  // ── Sub-picker data ───────────────────────────────────────────────────────

  const subPickerItems = useMemo((): string[] => {
    if (!subPicker) return []
    switch (subPicker) {
      case 'switch-environment':
        return environments.map((e) => e.name)
      case 'switch-tab':
        return tabs.map((t) => t.name)
      case 'run-collection':
        return Object.values(collections).map(
          (col) => col.manifest.name ?? col.path.split('/').pop() ?? col.path
        )
      default:
        return []
    }
  }, [subPicker, environments, tabs, collections])

  const filteredSubPickerItems = useMemo(() => {
    if (!subPickerQuery) return subPickerItems
    return subPickerItems.filter((item) => fuzzyScore(subPickerQuery, item) !== null)
  }, [subPickerItems, subPickerQuery])

  // ── Flat item counter for selected state ──────────────────────────────────
  // We track a running index so each CmdItem knows its flat position.
  // Defined inside render to be reset per render.
  let flatIdx = 0

  // ── Select handlers ───────────────────────────────────────────────────────

  const handleSelectSearch = useCallback(
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

  const handleSelectCommand = useCallback(
    (cmd: Command) => {
      setErrorId(null)

      if (cmd.subPicker) {
        setSubPicker(cmd.subPicker)
        setSubPickerLabel(cmd.name)
        setSubPickerQuery('')
        return
      }

      if (!cmd.run) return

      recordUsed(cmd.id)

      if (cmd.isScript) {
        try {
          cmd.run()
        } catch (err) {
          setErrorId(cmd.id)
          setErrorMsg(err instanceof Error ? err.message : String(err))
          return
        }
      } else {
        cmd.run()
      }

      if (!cmd.id.startsWith('view.zoom')) {
        closeCommandPalette()
      }
    },
    [recordUsed, closeCommandPalette]
  )

  const handleSelectSubPickerItem = useCallback(
    (item: string) => {
      if (!subPicker) return
      switch (subPicker) {
        case 'switch-environment':
          setActiveEnvironment(item)
          closeCommandPalette()
          break
        case 'switch-tab': {
          const tab = tabs.find((t) => t.name === item)
          if (tab) openTab({ ...tab })
          closeCommandPalette()
          break
        }
        case 'run-collection':
          closeCommandPalette()
          break
        default:
          closeCommandPalette()
      }
    },
    [subPicker, setActiveEnvironment, closeCommandPalette, tabs, openTab]
  )

  // ── Placeholder text ──────────────────────────────────────────────────────

  const inputPlaceholder = subPicker
    ? `Filter ${subPickerLabel.replace(' →', '')}…`
    : mode === 'search'
      ? 'Search requests, URLs, methods, tags…'
      : 'Type a command…'

  const recentIdSet = new Set(recentCommandIds)

  // ── Render ────────────────────────────────────────────────────────────────

  return createPortal(
    <div
      className="fixed inset-0 z-[300]"
      onMouseDown={(e) => {
        // Close when clicking the backdrop (not the panel)
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onMouseDown={(e) => {
          e.stopPropagation()
          handleClose()
        }}
      />

      {/* Panel wrapper — centered horizontally, 15vh from top */}
      <div className="absolute inset-0 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
        {/* Panel */}
        <div
          ref={containerRef}
          className="command-palette relative w-full max-w-[640px] flex flex-col rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
          style={{
            backgroundColor: 'var(--color-bg-overlay)',
            border: '1px solid var(--color-border-subtle)',
            maxHeight: '65vh',
          }}
          onKeyDown={handleKeyDown}
          // Prevent backdrop mousedown from firing
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Sub-picker breadcrumb */}
          {subPicker && (
            <div
              className="flex items-center gap-1.5 px-4 py-1.5 border-b text-[11px]"
              style={{
                borderColor: 'var(--color-border-subtle)',
                backgroundColor: 'var(--color-bg-panel)',
                color: 'var(--color-text-muted)',
              }}
            >
              <button
                type="button"
                className="flex items-center gap-1 transition-opacity hover:opacity-70"
                onClick={handleSubPickerBack}
              >
                <BackIcon />
                <span>Back</span>
              </button>
              <span style={{ opacity: 0.5 }}>›</span>
              <span>Commands</span>
              <span style={{ opacity: 0.5 }}>›</span>
              <span style={{ color: 'var(--color-text-primary)' }}>
                {subPickerLabel.replace(' →', '')}
              </span>
            </div>
          )}

          {/* Search input row */}
          <div
            className="flex items-center gap-2 px-3 border-b shrink-0"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            <SearchInputIcon />
            <input
              ref={inputRef}
              type="text"
              value={currentSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={inputPlaceholder}
              className="flex-1 py-4 bg-transparent text-sm focus:outline-none focus:ring-0 border-none placeholder-text-muted"
              style={{ color: 'var(--color-text-primary)' }}
              autoFocus
              spellCheck={false}
            />
            {currentSearch && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => {
                  handleSearchChange('')
                  inputRef.current?.focus()
                }}
              >
                <ClearIcon />
              </button>
            )}
          </div>

          {/* List area */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3" tabIndex={-1}>
            {/* ── SEARCH PAGE ── */}
            {currentPage === 'search' && (
              <>
                {groupedSearch.length === 0 ? (
                  <div
                    className="px-4 py-8 text-center text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {showRecentSearch ? 'No recent searches' : 'No results found'}
                  </div>
                ) : (
                  <>
                    {showRecentSearch && (
                      <div className="px-3 pt-1 pb-0.5">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          Recent
                        </span>
                      </div>
                    )}
                    {groupedSearch.map(([collectionName, items]) => (
                      <div key={collectionName} className="space-y-1" tabIndex={-1}>
                        <h4
                          className="px-3.5 text-[11px] font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {collectionName}
                        </h4>
                        <ul tabIndex={-1}>
                          {items.map((result) => {
                            const idx = flatIdx++
                            return (
                              <li key={result.requestPath}>
                                <CmdItem
                                  isSelected={selected === idx}
                                  onClick={() => handleSelectSearch(result)}
                                  onHover={() => setSelected(idx)}
                                >
                                  <SearchResultRow result={result} />
                                </CmdItem>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}

            {/* ── COMMAND PAGE ── */}
            {currentPage === 'command' && (
              <>
                {groupedCommands.length === 0 ? (
                  <div
                    className="px-4 py-8 text-center text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    No commands found
                  </div>
                ) : (
                  <>
                    {isEmptyState && (
                      <div className="px-3 pt-1 pb-0.5">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {recentCommandIds.length > 0 ? 'Recent & Suggested' : 'Suggested'}
                        </span>
                      </div>
                    )}
                    {groupedCommands.map(([category, items]) => (
                      <div key={category} className="space-y-1" tabIndex={-1}>
                        {!isEmptyState && (
                          <h4
                            className="px-3.5 text-[11px] font-semibold uppercase tracking-wider"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {category}
                          </h4>
                        )}
                        <ul tabIndex={-1}>
                          {items.map((item) => {
                            const idx = flatIdx++
                            return (
                              <li key={item.cmd.id}>
                                <CmdItem
                                  isSelected={selected === idx}
                                  onClick={() => handleSelectCommand(item.cmd)}
                                  onHover={() => setSelected(idx)}
                                >
                                  <CommandRow
                                    cmd={item.cmd}
                                    isRecent={recentIdSet.has(item.cmd.id)}
                                    notAvailable={item.notAvailable}
                                    query={effectiveQuery}
                                    errorId={errorId}
                                    errorMsg={errorMsg}
                                  />
                                </CmdItem>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}

            {/* ── SUB-PICKER PAGES ── */}
            {(currentPage === 'sub-switch-environment' ||
              currentPage === 'sub-switch-tab' ||
              currentPage === 'sub-run-collection') && (
              <>
                {filteredSubPickerItems.length === 0 ? (
                  <div
                    className="px-4 py-8 text-center text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    No items found
                  </div>
                ) : (
                  <div className="space-y-1" tabIndex={-1}>
                    <ul tabIndex={-1}>
                      {filteredSubPickerItems.map((item) => {
                        const idx = flatIdx++
                        return (
                          <li key={item}>
                            <CmdItem
                              isSelected={selected === idx}
                              onClick={() => handleSelectSubPickerItem(item)}
                              onHover={() => setSelected(idx)}
                            >
                              <SubPickerRow
                                item={item}
                                isActive={
                                  subPicker === 'switch-environment' &&
                                  item === activeEnvironmentName
                                }
                              />
                            </CmdItem>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex items-center gap-4 px-4 py-2 border-t text-[10px] shrink-0"
            style={{
              backgroundColor: 'var(--color-bg-panel)',
              borderColor: 'var(--color-border-subtle)',
              color: 'var(--color-text-muted)',
            }}
          >
            <span className="flex items-center gap-1">
              <kbd
                className="border rounded px-1 py-0.5 font-mono text-[9px]"
                style={{ borderColor: 'var(--color-border-subtle)' }}
              >
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd
                className="border rounded px-1 py-0.5 font-mono text-[9px]"
                style={{ borderColor: 'var(--color-border-subtle)' }}
              >
                ↵
              </kbd>
              {mode === 'command' ? 'run' : 'open'}
            </span>
            <span className="flex items-center gap-1">
              <kbd
                className="border rounded px-1 py-0.5 font-mono text-[9px]"
                style={{ borderColor: 'var(--color-border-subtle)' }}
              >
                esc
              </kbd>
              {subPicker ? 'back' : 'close'}
            </span>
            {mode === 'search' && (
              <span className="ml-auto">
                Type{' '}
                <kbd
                  className="border rounded px-1 py-0.5 font-mono text-[9px]"
                  style={{ borderColor: 'var(--color-border-subtle)' }}
                >
                  &gt;
                </kbd>{' '}
                for commands
              </span>
            )}
            {mode === 'command' && !subPicker && (
              <span className="ml-auto">
                Delete{' '}
                <kbd
                  className="border rounded px-1 py-0.5 font-mono text-[9px]"
                  style={{ borderColor: 'var(--color-border-subtle)' }}
                >
                  &gt;
                </kbd>{' '}
                for search
              </span>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Outer wrapper ────────────────────────────────────────────────────────────

const CommandPaletteModal: React.FC = () => {
  const { isCommandPaletteOpen } = useUIStore()
  if (!isCommandPaletteOpen) return null
  return <CommandPaletteContent />
}

export default CommandPaletteModal
