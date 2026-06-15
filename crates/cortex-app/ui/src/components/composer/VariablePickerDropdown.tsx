import React from 'react'
import { ComboboxOptions, ComboboxOption } from '@headlessui/react'
import type { VariableScope } from '../../bindings'
import type { VariableSuggestion } from './useVariablePicker'

type Scope = VariableScope | 'dynamic'

const GROUP_LABELS: Record<Scope, string> = {
  dynamic: 'Dynamic',
  runtime: 'Runtime',
  environment: 'Environment',
  collection: 'Collection',
  global: 'Global',
}

const GROUP_ORDER: Scope[] = ['dynamic', 'runtime', 'environment', 'collection', 'global']

const SCOPE_BADGE_CLASS: Record<Scope, string> = {
  dynamic: 'bg-accent/15 text-accent border-accent/30',
  runtime: 'bg-purple-500/15 text-purple-400 border-purple-400/30',
  environment: 'bg-success/15 text-success border-success/30',
  collection: 'bg-success/15 text-success border-success/30',
  global: 'bg-text-muted/15 text-text-secondary border-border-subtle',
}

const GROUP_HEADER_CLASS: Record<Scope, string> = {
  dynamic: 'text-accent',
  runtime: 'text-purple-400',
  environment: 'text-success',
  collection: 'text-success',
  global: 'text-text-secondary',
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/25 text-accent rounded-[2px] not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

interface VariablePickerDropdownProps {
  suggestions: VariableSuggestion[]
  query: string
  // When false the ComboboxOptions panel is hidden (no {{ context).
  open: boolean
}

export const VariablePickerDropdown: React.FC<VariablePickerDropdownProps> = ({
  suggestions,
  query,
  open,
}) => {
  // Group suggestions by scope, preserving GROUP_ORDER
  const grouped = new Map<Scope, VariableSuggestion[]>()
  for (const s of suggestions) {
    const scope = s.scope as Scope
    if (!grouped.has(scope)) grouped.set(scope, [])
    grouped.get(scope)!.push(s)
  }

  return (
    // portal renders into document.body while staying in the Combobox React context.
    // anchor="bottom start" uses @floating-ui to position below the ComboboxInput.
    // hidden={!open} hides the panel when we're not inside a {{ context.
    <ComboboxOptions
      portal
      anchor="bottom start"
      hidden={!open || suggestions.length === 0}
      className="z-[9999] w-80 bg-bg-overlay border border-border-subtle rounded-md shadow-xl overflow-y-auto max-h-64 py-1 font-sans text-text-primary [--anchor-gap:4px]"
    >
      {GROUP_ORDER.map((scope) => {
        const group = grouped.get(scope)
        if (!group || group.length === 0) return null
        return (
          <div key={scope}>
            <div
              className={`px-3 pt-2 pb-0.5 text-[9px] font-bold uppercase tracking-wider select-none ${GROUP_HEADER_CLASS[scope]}`}
            >
              {GROUP_LABELS[scope]}
            </div>
            {group.map((s) => {
              const matchQuery = s.isDynamic && !query.startsWith('$') ? '$' + query : query
              return (
                <ComboboxOption
                  key={s.name}
                  value={s.name}
                  className="flex items-start gap-2 px-3 py-1.5 cursor-pointer select-none transition-colors data-[focus]:bg-accent/10"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[11px] font-medium text-text-primary">
                        {highlightMatch(s.name, matchQuery)}
                      </span>
                      <span
                        className={`text-[9px] font-semibold uppercase tracking-wider border rounded-[3px] px-1 py-px shrink-0 ${SCOPE_BADGE_CLASS[scope]}`}
                      >
                        {scope}
                      </span>
                      {s.isDynamic && (
                        <span className="text-[9px] text-text-muted shrink-0">↻ each send</span>
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-text-secondary truncate mt-0.5">
                      {s.isDynamic ? (
                        <>
                          <span className="text-text-muted">{s.description} </span>
                          <span className="text-accent/70">→ {s.value}</span>
                        </>
                      ) : (
                        s.value
                      )}
                    </div>
                  </div>
                </ComboboxOption>
              )
            })}
          </div>
        )
      })}
    </ComboboxOptions>
  )
}

export default VariablePickerDropdown
