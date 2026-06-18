import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { Combobox, ComboboxInput } from '@headlessui/react'
import { useRequestStore } from '../../stores/requestStore'
import { useTabs } from '../../contexts/TabsContext'
import { useCollectionEnvironmentStore } from '../../stores/collectionEnvironmentStore'
import type { ResolvedVariable } from '../../bindings'
import { detectContext, buildSuggestions } from './useVariablePicker'
import { VariablePickerDropdown } from './VariablePickerDropdown'
import { VarPopover } from './VarPopover'
import { computeBadge, UNRESOLVED_BADGE, type PopoverState } from './varBadges'

interface UrlInputProps {
  value: string
  onChange: (value: string) => void
  onEnter?: () => void
}

const EMPTY_RESOLVED: Record<string, ResolvedVariable> = {}
const EMPTY_SET = new Set<string>()

/**
 * URL input bar with inline variable highlighting and {{ autocomplete.
 *
 * A transparent <input> sits on top of a colour-coded overlay; the overlay's
 * horizontal scroll is kept in sync with the input. This keeps native caret
 * hit-testing, keyboard shortcuts and click-to-position fully intact.
 *
 * Autocomplete is powered by @headlessui/react <Combobox> which handles all
 * keyboard navigation (↑/↓/Enter/Escape) correctly without stale-ref issues.
 */
const UrlInput: React.FC<UrlInputProps> = ({ value, onChange, onEnter }) => {
  const { activeTabId, activeTab } = useTabs()
  const resolvedVariables = useRequestStore((s) =>
    activeTabId ? s.resolvedVariables[activeTabId] || EMPTY_RESOLVED : EMPTY_RESOLVED
  )

  // Detect {{ context from the value — no stale state, just a regex.
  const context = useMemo(() => detectContext(value), [value])
  const query = context?.query ?? ''
  const suggestions = useMemo(
    () => buildSuggestions(resolvedVariables, query),
    [resolvedVariables, query]
  )

  const collectionId = activeTab?.collectionId ?? null
  const loadCollectionEnvironments = useCollectionEnvironmentStore(
    (s) => s.loadCollectionEnvironments
  )
  const collectionEnvironments = useCollectionEnvironmentStore((s) => s.collectionEnvironments)
  const activeCollectionEnvName = useCollectionEnvironmentStore((s) => s.activeCollectionEnvName)

  useEffect(() => {
    if (collectionId) loadCollectionEnvironments(collectionId)
  }, [collectionId, loadCollectionEnvironments])

  const collectionEnvVarNames = useMemo(() => {
    const active = collectionId ? (activeCollectionEnvName[collectionId] ?? null) : null
    if (!collectionId || !active) return EMPTY_SET
    const envs = collectionEnvironments[collectionId] ?? []
    const env = envs.find((e) => e.name === active)
    return env ? new Set(env.variables.map((v) => v.name)) : EMPTY_SET
  }, [collectionId, activeCollectionEnvName, collectionEnvironments])

  const effectiveResolved = useCallback(
    (varName: string): ResolvedVariable | null => resolvedVariables[varName] ?? null,
    [resolvedVariables]
  )

  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<number | null>(null)

  const [popover, setPopover] = useState<PopoverState>({
    visible: false,
    x: 0,
    y: 0,
    varName: '',
    resolved: null,
    isDynamic: false,
    badge: UNRESOLVED_BADGE,
  })

  const syncScroll = useCallback(() => {
    if (inputRef.current && overlayRef.current) {
      overlayRef.current.scrollLeft = inputRef.current.scrollLeft
    }
  }, [])

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    input.addEventListener('scroll', syncScroll)
    return () => input.removeEventListener('scroll', syncScroll)
  }, [syncScroll])

  useEffect(() => {
    syncScroll()
  }, [value, syncScroll])

  const clearHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
  }, [])

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setPopover((p) => ({ ...p, visible: false })), 140)
  }, [])

  const handleTokenEnter = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>, varName: string) => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current)
        hideTimer.current = null
      }
      const rect = e.currentTarget.getBoundingClientRect()
      const isDynamic = varName.startsWith('$')
      const resolved = isDynamic ? null : effectiveResolved(varName)
      setPopover({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.bottom + 6,
        varName,
        resolved,
        isDynamic,
        badge: computeBadge(varName, resolved, isDynamic, collectionEnvVarNames),
      })
    },
    [effectiveResolved, collectionEnvVarNames]
  )

  // Insert the selected variable name at the {{ offset.
  const handleSelect = (name: string | null) => {
    if (!name || !context) return
    const el = inputRef.current
    const caretPos = el?.selectionStart ?? value.length
    const newValue = value.slice(0, context.openOffset) + `{{${name}}}` + value.slice(caretPos)
    onChange(newValue)
    const newCaret = context.openOffset + name.length + 4
    setTimeout(() => {
      if (el) {
        el.focus()
        el.setSelectionRange(newCaret, newCaret)
      }
    }, 0)
  }

  const renderHighlighted = (text: string) => {
    const parts = text.split(/(\{\{[^{}]*\}\})/)
    return parts.map((part, i) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        const varName = part.slice(2, -2).trim()
        const isDynamic = varName.startsWith('$')
        const isResolved = !isDynamic && !!effectiveResolved(varName)

        let cls = 'text-error'
        if (isDynamic) cls = 'text-accent'
        else if (isResolved) cls = 'text-success'

        return (
          <span
            key={i}
            className={`${cls} pointer-events-auto cursor-help font-medium`}
            onMouseEnter={(e) => handleTokenEnter(e, varName)}
            onMouseLeave={scheduleHide}
          >
            {part}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    // Combobox handles keyboard navigation for the {{ picker.
    // immediate: opens (internally) as soon as the input is focused/typed in,
    //   so ↑/↓/Enter/Escape are ready without an extra click.
    // value={null}: we never persist a "selected" combobox item — insertion is
    //   done in handleSelect and the full URL text is always controlled externally.
    <Combobox immediate value={null} onChange={handleSelect}>
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="relative flex items-center h-[30px] bg-bg-surface border border-border-default rounded-md transition-all duration-150 focus-within:border-border-strong focus-within:ring-2 focus-within:ring-accent/20">
          {/* Colour-coded overlay (behind the transparent input text) */}
          <div
            ref={overlayRef}
            aria-hidden
            className={`absolute inset-0 flex items-center px-3 font-mono text-sm overflow-hidden whitespace-pre pointer-events-none ${
              value ? 'text-text-primary' : 'text-text-muted'
            }`}
          >
            {value ? (
              renderHighlighted(value)
            ) : (
              <span className="text-text-muted">Enter URL or paste text</span>
            )}
          </div>

          <ComboboxInput
            ref={inputRef as React.Ref<HTMLInputElement>}
            as="input"
            type="text"
            value={value}
            displayValue={() => value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              // headlessui preventDefault for ↑/↓/Enter/Escape when picker is open.
              // Only forward Enter to onEnter when headlessui did NOT handle it.
              if (e.defaultPrevented) return
              if (e.key === 'Enter') onEnter?.()
            }}
            onBlur={() => {}}
            className="w-full h-full bg-transparent border-none outline-none px-3 font-mono text-sm text-transparent caret-accent selection:bg-accent/20"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        {/* Rendered inside Combobox React context; portals to document.body via headlessui */}
        <VariablePickerDropdown suggestions={suggestions} query={query} open={!!context} />

        {popover.visible && (
          <VarPopover
            key={popover.varName}
            data={popover}
            onMouseEnter={clearHide}
            onMouseLeave={scheduleHide}
          />
        )}
      </div>
    </Combobox>
  )
}

export default UrlInput
