// Utility functions and types for the variable {{ }} autocomplete picker.
// Keyboard navigation, open state, and dropdown rendering are handled by
// @headlessui/react <Combobox> — this file only owns filtering logic and types.
import type { ResolvedVariable, VariableScope } from '../../bindings'

export const DYNAMIC_VARS_DESC: Record<string, string> = {
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

export type VariableSuggestion = {
  name: string
  scope: VariableScope | 'dynamic'
  value: string
  description?: string
  secret: boolean
  isDynamic: boolean
}

const SCOPE_ORDER: Array<VariableScope | 'dynamic'> = [
  'dynamic',
  'runtime',
  'environment',
  'collection',
  'global',
]

function generateDynamicPreview(name: string): string {
  switch (name) {
    case '$uuid':
      return crypto.randomUUID()
    case '$timestamp':
      return String(Math.floor(Date.now() / 1000))
    case '$isoTimestamp':
      return new Date().toISOString()
    case '$randomInt':
      return String(Math.floor(Math.random() * 1000))
    case '$randomNanoId':
      return Array.from({ length: 21 }, () =>
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(
          Math.floor(Math.random() * 62)
        )
      ).join('')
    case '$randomBoolean':
      return String(Math.random() > 0.5)
    case '$randomFirstName':
      return 'Alice'
    case '$randomLastName':
      return 'Johnson'
    case '$randomEmail':
      return 'alice.johnson@example.com'
    case '$randomPhoneNumber':
      return '+1-555-123-4567'
    case '$randomUrl':
      return 'https://example.com/resource'
    case '$randomIPv4':
      return '192.168.1.42'
    case '$randomLoremWord':
      return 'lorem'
    case '$randomLoremSentence':
      return 'Lorem ipsum dolor sit amet.'
    default:
      return '…'
  }
}

// Detect an open {{ context at the END of the value string.
// Returns { query, openOffset } when inside an unclosed {{ token,
// or null when the context is closed or absent.
// Using a regex avoids relying on selectionStart, which React batching
// can make stale for controlled inputs.
export function detectContext(value: string): { query: string; openOffset: number } | null {
  const m = value.match(/\{\{([^}]*)$/)
  if (!m) return null
  return {
    query: m[1],
    openOffset: value.lastIndexOf('{{'),
  }
}

export function buildSuggestions(
  resolvedVars: Record<string, ResolvedVariable>,
  query: string
): VariableSuggestion[] {
  const q = query.toLowerCase()

  const dynamicSuggestions: VariableSuggestion[] = Object.entries(DYNAMIC_VARS_DESC)
    .filter(([name]) => {
      const n = name.toLowerCase()
      return n.includes(q) || n.slice(1).includes(q)
    })
    .map(([name, description]) => ({
      name,
      scope: 'dynamic' as const,
      value: generateDynamicPreview(name),
      description,
      secret: false,
      isDynamic: true,
    }))

  const resolvedSuggestions: VariableSuggestion[] = Object.entries(resolvedVars)
    .filter(([name]) => name.toLowerCase().includes(q))
    .map(([name, rv]) => ({
      name,
      scope: rv.scope,
      value: rv.secret
        ? '••••••••'
        : typeof rv.value === 'string'
          ? rv.value
          : JSON.stringify(rv.value),
      description: rv.description ?? undefined,
      secret: rv.secret,
      isDynamic: false,
    }))
    .sort((a, b) => SCOPE_ORDER.indexOf(a.scope) - SCOPE_ORDER.indexOf(b.scope))

  return [...dynamicSuggestions, ...resolvedSuggestions]
}
