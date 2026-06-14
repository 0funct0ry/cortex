import React, { useRef, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useRequestStore } from '../../stores/requestStore'
import { useTabs } from '../../contexts/TabsContext'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { useCollectionEnvironmentStore } from '../../stores/collectionEnvironmentStore'
import type { ResolvedVariable } from '../../bindings'

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

interface TooltipState {
  visible: boolean
  x: number
  y: number
  title: string
  content: string
  scope?: string
}

const DYNAMIC_VARS_DESC: Record<string, string> = {
  $randomInt: 'Generates a random integer between 0 and 1000.',
  $timestamp: 'Current Unix timestamp in seconds.',
  $isoTimestamp: 'Current ISO 8601 UTC timestamp.',
  $randomNanoId: 'Generates a secure 21-character NanoID.',
  $uuid: 'Generates a random v4 UUID.',
  $randomFirstName: 'Generates a realistic random first name.',
  $randomLastName: 'Generates a realistic random last name.',
  $randomEmail: 'Generates a random email address.',
  $randomPhoneNumber: 'Generates a random phone number.',
  $randomUrl: 'Generates a random URL.',
  $randomIPv4: 'Generates a random IPv4 address.',
  $randomBoolean: 'Generates a random boolean value.',
  $randomLoremWord: 'Generates a random lorem ipsum word.',
  $randomLoremSentence: 'Generates a random lorem ipsum sentence.',
}

const EMPTY_RESOLVED_VARIABLES: Record<string, ResolvedVariable> = {}

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

  const internalInputRef = useRef<HTMLInputElement>(null)
  const inputRef = externalInputRef || internalInputRef
  const overlayRef = useRef<HTMLDivElement>(null)

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    title: '',
    content: '',
  })

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

  // Sync scroll on value change as well
  useEffect(() => {
    syncScroll()
  }, [value, syncScroll])

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>, rawVar: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.bottom + 8 // just below the span

    const varName = rawVar.replace(/^\{\{/, '').replace(/\}\}$/, '').trim()
    const isDynamic = varName.startsWith('$')

    let title = varName
    let content = 'Unresolved'
    let scope = 'unresolved'

    if (isDynamic) {
      scope = 'dynamic'
      title = `Dynamic Variable: ${varName}`
      content = DYNAMIC_VARS_DESC[varName] || 'Generates a dynamic value at run-time.'
    } else {
      const resolved = resolvedVariables[varName]
      if (resolved) {
        scope = resolved.scope || 'environment'

        // Build a human-readable source label for the title.
        // Both the active global environment and the active collection environment
        // resolve to the same backend `environment` scope — disambiguate by checking
        // whether the variable belongs to the active collection environment.
        const collectionId = activeTab?.collectionId ?? null
        const activeGlobalEnv = useEnvironmentStore.getState().activeEnvironmentName
        const collState = useCollectionEnvironmentStore.getState()
        const activeCollEnv = collectionId
          ? (collState.activeCollectionEnvName[collectionId] ?? null)
          : null
        const collEnvVarNames = (() => {
          if (!collectionId || !activeCollEnv) return new Set<string>()
          const envs = collState.collectionEnvironments[collectionId] ?? []
          const env = envs.find((e) => e.name === activeCollEnv)
          return new Set((env?.variables ?? []).map((v) => v.name))
        })()

        const fromCollection =
          scope === 'collection' || (scope === 'environment' && collEnvVarNames.has(varName))

        if (fromCollection) {
          title = activeCollEnv ? `Collection env: ${activeCollEnv}` : 'Collection'
        } else if (scope === 'environment') {
          title = activeGlobalEnv ? `Global env: ${activeGlobalEnv}` : 'Global'
        } else if (scope === 'globalenv' || scope === 'global') {
          title = activeGlobalEnv ? `Global env: ${activeGlobalEnv}` : 'Global'
        } else {
          title = `Resolved Variable (${scope})`
        }

        if (resolved.secret) {
          content = 'Secret Value: ********'
        } else {
          content =
            typeof resolved.value === 'string' ? resolved.value : JSON.stringify(resolved.value)
        }
      }
    }

    setTooltip({
      visible: true,
      x,
      y,
      title,
      content,
      scope,
    })
  }

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }

  const renderHighlighted = (text: string) => {
    // Regex matches {{variable_name}} templates
    const parts = text.split(/(\{\{[^{}]*\}\})/)
    return parts.map((part, i) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        const varName = part.slice(2, -2).trim()
        const isDynamic = varName.startsWith('$')
        const isResolved = !isDynamic && !!resolvedVariables[varName]

        let spanClass = 'border-b border-warning text-warning' // default unresolved (orange)
        if (isDynamic) {
          spanClass = 'border-b border-accent text-accent' // dynamic (blue)
        } else if (isResolved) {
          spanClass = 'border-b border-success text-success' // resolved (green)
        }

        return (
          <span
            key={i}
            className={`${spanClass} pointer-events-auto cursor-help font-mono font-medium`}
            onMouseEnter={(e) => handleMouseEnter(e, part)}
            onMouseLeave={handleMouseLeave}
          >
            {part}
          </span>
        )
      }
      return <span key={i}>{masked ? '•'.repeat(part.length) : part}</span>
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative w-full h-full flex items-center group">
      {/* Highlighting Overlay (absolutely positioned behind/underneath transparent text) */}
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

      <input
        ref={inputRef}
        type={type}
        id={id}
        value={value}
        onChange={handleInputChange}
        onKeyDown={onKeyDown}
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

      {/* Portal Tooltip — positioned below the hovered variable span */}
      {tooltip.visible &&
        ReactDOM.createPortal(
          <div
            style={{
              position: 'fixed',
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: 'translateX(-50%)',
              zIndex: 9999,
            }}
            className="bg-bg-overlay border border-border-subtle rounded-md shadow-lg p-2 max-w-[280px] pointer-events-none text-xs flex flex-col gap-1 font-sans text-text-primary animate-fade-in"
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  tooltip.scope === 'dynamic'
                    ? 'bg-accent'
                    : tooltip.scope === 'unresolved'
                      ? 'bg-warning'
                      : 'bg-success'
                }`}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                {tooltip.title}
              </span>
            </div>
            <div className="font-mono text-text-primary break-all bg-bg-muted/50 p-1 rounded-sm border border-border-subtle/50 text-[11px] leading-relaxed">
              {tooltip.content}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default VariableInput
