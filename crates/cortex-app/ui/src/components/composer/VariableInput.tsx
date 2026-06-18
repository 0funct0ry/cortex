import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Combobox, ComboboxInput } from '@headlessui/react'
import { useRequestStore } from '../../stores/requestStore'
import { useTabs } from '../../contexts/TabsContext'
import { useCollectionEnvironmentStore } from '../../stores/collectionEnvironmentStore'
import type { ResolvedVariable } from '../../bindings'
import { detectContext, buildSuggestions } from './useVariablePicker'
import { VariablePickerDropdown } from './VariablePickerDropdown'
import { VarPopover } from './VarPopover'
import { computeBadge, UNRESOLVED_BADGE, type PopoverState } from './varBadges'

interface VariableInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  id?: string
  readOnly?: boolean
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  inputRef?: React.RefObject<HTMLInputElement | null>
  'data-row'?: number
  'data-field'?: string
  masked?: boolean
  type?: string
}

const EMPTY_RESOLVED_VARIABLES: Record<string, ResolvedVariable> = {}
const EMPTY_SET = new Set<string>()

export const VariableInput: React.FC<VariableInputProps> = ({
  value,
  onChange,
  onKeyDown,
  onPaste,
  placeholder = '',
  className = '',
  id,
  readOnly = false,
  onFocus,
  onBlur,
  inputRef: externalInputRef,
  'data-row': dataRow,
  'data-field': dataField,
  masked = false,
  type = 'text',
}) => {
  const { activeTabId, activeTab } = useTabs()
  const resolvedVariables = useRequestStore((s) =>
    activeTabId
      ? s.resolvedVariables[activeTabId] || EMPTY_RESOLVED_VARIABLES
      : EMPTY_RESOLVED_VARIABLES
  )

  const collectionId = activeTab?.collectionId ?? null
  const collectionEnvironments = useCollectionEnvironmentStore((s) => s.collectionEnvironments)
  const activeCollectionEnvName = useCollectionEnvironmentStore((s) => s.activeCollectionEnvName)

  const collectionEnvVarNames = useMemo(() => {
    const active = collectionId ? (activeCollectionEnvName[collectionId] ?? null) : null
    if (!collectionId || !active) return EMPTY_SET
    const envs = collectionEnvironments[collectionId] ?? []
    const env = envs.find((e) => e.name === active)
    return env ? new Set(env.variables.map((v) => v.name)) : EMPTY_SET
  }, [collectionId, activeCollectionEnvName, collectionEnvironments])

  const internalInputRef = useRef<HTMLInputElement>(null)
  const inputRef = externalInputRef || internalInputRef
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

  // Detect {{ context purely from the value string — no stale ref tricks needed.
  const context = useMemo(() => detectContext(value), [value])
  const query = context?.query ?? ''
  const suggestions = useMemo(
    () => buildSuggestions(resolvedVariables, query),
    [resolvedVariables, query]
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

  // Synchronize scrolling of input and highlight overlay
  const syncScroll = React.useCallback(() => {
    if (inputRef.current && overlayRef.current) {
      overlayRef.current.scrollLeft = inputRef.current.scrollLeft
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const input = inputRef.current
    if (input) {
      input.addEventListener('scroll', syncScroll)
      return () => input.removeEventListener('scroll', syncScroll)
    }
  }, [inputRef, syncScroll])

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
      const resolved = isDynamic ? null : (resolvedVariables[varName] ?? null)
      setPopover({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8,
        varName,
        resolved,
        isDynamic,
        badge: computeBadge(varName, resolved, isDynamic, collectionEnvVarNames),
      })
    },
    [resolvedVariables, collectionEnvVarNames]
  )

  const renderHighlighted = (text: string) => {
    const parts = text.split(/(\{\{[^{}]*\}\})/)
    return parts.map((part, i) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        const varName = part.slice(2, -2).trim()
        const isDynamic = varName.startsWith('$')
        const isResolved = !isDynamic && !!resolvedVariables[varName]

        let spanClass = 'border-b border-warning text-warning'
        if (isDynamic) {
          spanClass = 'border-b border-accent text-accent'
        } else if (isResolved) {
          spanClass = 'border-b border-success text-success'
        }

        return (
          <span
            key={i}
            className={`${spanClass} pointer-events-auto cursor-help font-mono font-medium`}
            onMouseEnter={(e) => handleTokenEnter(e, varName)}
            onMouseLeave={scheduleHide}
          >
            {part}
          </span>
        )
      }
      return <span key={i}>{masked ? '•'.repeat(part.length) : part}</span>
    })
  }

  return (
    // Combobox manages keyboard navigation and selection for the options panel.
    // immediate: opens the options panel as soon as the input is focused/typed in.
    // value={null}: we never track a "selected" combobox item — we handle insertion
    //   ourselves in handleSelect and always keep value controlled externally.
    <Combobox immediate value={null} onChange={handleSelect}>
      <div className="relative w-full h-full flex items-center group">
        {/* Highlighting Overlay */}
        <div
          ref={overlayRef}
          className={`absolute inset-x-0 bottom-0 top-0 flex items-center px-3 font-mono text-sm pointer-events-none overflow-hidden whitespace-pre select-none ${
            !value ? 'text-text-muted' : 'text-text-primary'
          }`}
        >
          {value ? (
            renderHighlighted(value)
          ) : (
            <span className="text-text-muted opacity-50">{placeholder}</span>
          )}
        </div>

        <ComboboxInput
          ref={inputRef as React.Ref<HTMLInputElement>}
          as="input"
          type={type}
          id={id}
          value={value}
          displayValue={() => value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            // headlessui calls e.preventDefault() for ↑/↓/Enter/Escape when open.
            // We stop propagation so parent KVE row-navigation doesn't also fire.
            if (e.defaultPrevented) {
              e.stopPropagation()
              return
            }
            onKeyDown?.(e)
          }}
          onPaste={onPaste}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={readOnly}
          className={`w-full h-full bg-transparent border-none outline-none px-3 font-mono text-sm text-transparent caret-accent selection:bg-accent/20 ${className}`}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          data-row={dataRow}
          data-field={dataField}
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
    </Combobox>
  )
}

export default VariableInput
