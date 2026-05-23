import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import * as Icons from '../ui/Icons'
import type { HeaderEntry } from '../../bindings'
import { useTabs } from '../../contexts/TabsContext'
import VariableInput from './VariableInput'

interface KeyValueEditorProps {
  entries: HeaderEntry[]
  onChange: (entries: HeaderEntry[]) => void
  namePlaceholder?: string
  valuePlaceholder?: string
  title?: string
  addButtonLabel?: string
  readOnlyEntries?: { key: string; value: string; description?: string }[]
  readOnlyTitle?: string
  readOnlyTooltip?: string
  isHeaders?: boolean
  caseSensitiveKeys?: boolean
  presets?: { name: string; fields: { key: string; value: string; enabled: boolean }[] }[]
  onApplyPreset?: (fields: { key: string; value: string; enabled: boolean }[]) => void
}

// Built-in HTTP Headers dictionary for autocompletion
const COMMON_HEADERS: Record<string, string[]> = {
  'Content-Type': [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/plain',
    'text/html',
    'text/xml',
    'application/xml',
    'application/octet-stream',
    'application/graphql',
  ],
  'Content-Encoding': ['gzip', 'deflate', 'br', 'identity', 'zstd'],
  'Content-Language': ['en', 'en-US', 'fr', 'de', 'es', 'zh', 'ja', 'ar'],
  'Content-Disposition': ['inline', 'attachment', 'attachment; filename="file.txt"'],
  Accept: [
    '*/*',
    'application/json',
    'text/html',
    'text/plain',
    'application/xml',
    'text/xml',
    'application/pdf',
    'image/*',
    'application/octet-stream',
  ],
  'Accept-Encoding': ['gzip', 'deflate', 'br', 'identity', 'gzip, deflate, br', '*'],
  'Accept-Language': ['en-US,en;q=0.9', 'fr-FR,fr;q=0.9', '*', 'en', 'de', 'zh-CN'],
  'Accept-Charset': ['utf-8', 'iso-8859-1', 'utf-8, iso-8859-1;q=0.5', '*'],
  Authorization: ['Bearer ', 'Basic ', 'Digest ', 'AWS4-HMAC-SHA256 ', 'Token ', 'ApiKey '],
  'Proxy-Authorization': ['Bearer ', 'Basic '],
  'WWW-Authenticate': ['Bearer', 'Basic realm="example"', 'Digest realm="example"'],
  'Cache-Control': [
    'no-cache',
    'no-store',
    'max-age=0',
    'max-age=3600',
    'must-revalidate',
    'public',
    'private',
    'no-transform',
    'only-if-cached',
  ],
  Pragma: ['no-cache'],
  Connection: ['keep-alive', 'close', 'upgrade'],
  'Keep-Alive': ['timeout=5', 'timeout=5, max=1000'],
  'Transfer-Encoding': ['chunked', 'compress', 'deflate', 'gzip', 'identity'],
  Upgrade: ['websocket', 'h2c', 'HTTP/2.0'],
  TE: ['trailers', 'deflate', 'gzip'],
  Origin: [],
  'Access-Control-Request-Method': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  'Access-Control-Request-Headers': ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  Cookie: [],
  'Set-Cookie': [
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'SameSite=Lax',
    'SameSite=None; Secure',
    'Max-Age=3600',
    'Domain=example.com',
  ],
  Host: [],
  Forwarded: ['for=192.0.2.60', 'for=192.0.2.60;proto=http;by=203.0.113.43'],
  'X-Forwarded-For': [],
  'X-Forwarded-Host': [],
  'X-Forwarded-Proto': ['http', 'https'],
  Via: [],
  'Idempotency-Key': [],
  'X-Request-ID': [],
  'X-Correlation-ID': [],
  'X-Trace-ID': [],
  'X-B3-TraceId': [],
  'X-B3-SpanId': [],
  'X-B3-Sampled': ['0', '1'],
  'X-RateLimit-Limit': [],
  'Retry-After': [],
  'X-Hub-Signature': [],
  'X-Hub-Signature-256': [],
  'X-GitHub-Event': ['push', 'pull_request', 'issues', 'release', 'ping', 'workflow_run'],
  'X-Stripe-Signature': [],
  'Webhook-ID': [],
  'Webhook-Timestamp': [],
  'Webhook-Signature': [],
  'User-Agent': [],
  Referer: [],
  From: [],
  Expires: [],
  'Last-Modified': [],
  Vary: ['Accept', 'Accept-Encoding', 'Accept-Language', 'Origin', '*'],
  'Strict-Transport-Security': [
    'max-age=31536000',
    'max-age=31536000; includeSubDomains',
    'max-age=31536000; includeSubDomains; preload',
  ],
  'Content-Security-Policy': ["default-src 'self'", "default-src 'self'; script-src 'nonce-…'"],
  'X-Content-Type-Options': ['nosniff'],
  'X-Frame-Options': ['DENY', 'SAMEORIGIN', 'ALLOW-FROM https://example.com'],
  'X-XSS-Protection': ['0', '1', '1; mode=block'],
  'Referrer-Policy': [
    'no-referrer',
    'no-referrer-when-downgrade',
    'origin',
    'origin-when-cross-origin',
    'same-origin',
    'strict-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url',
  ],
  'Permissions-Policy': ['geolocation=()', 'camera=()', 'microphone=()'],
  'Cross-Origin-Opener-Policy': ['unsafe-none', 'same-origin-allow-popups', 'same-origin'],
  'Cross-Origin-Resource-Policy': ['same-site', 'same-origin', 'cross-origin'],
  'Cross-Origin-Embedder-Policy': ['unsafe-none', 'require-corp'],
  'Access-Control-Allow-Origin': ['*', 'https://example.com'],
  'Access-Control-Allow-Methods': ['GET, POST, PUT, DELETE, PATCH, OPTIONS'],
  'Access-Control-Allow-Headers': ['Content-Type, Authorization, X-Requested-With'],
  'Access-Control-Expose-Headers': ['Content-Length, X-Request-ID'],
  'Access-Control-Max-Age': ['86400', '3600'],
  'Access-Control-Allow-Credentials': ['true'],
  'X-RateLimit-Remaining': [],
  'X-RateLimit-Reset': [],
}

const COMMON_HEADERS_KEYS = Object.keys(COMMON_HEADERS)

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  entries: rawEntries,
  onChange,
  namePlaceholder = 'Key',
  valuePlaceholder = 'Value',
  title = '',
  addButtonLabel = 'Add parameter',
  readOnlyEntries,
  readOnlyTitle,
  readOnlyTooltip,
  isHeaders = false,
  caseSensitiveKeys = false,
  presets,
  onApplyPreset,
}) => {
  const [presetsOpen, setPresetsOpen] = useState(false)
  const presetsDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (presetsDropdownRef.current && !presetsDropdownRef.current.contains(e.target as Node)) {
        setPresetsOpen(false)
      }
    }
    if (presetsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [presetsOpen])
  const { activeTab } = useTabs()
  const collectionId = activeTab?.collectionId || null

  // Ensure there is always at least one row on load
  const entries = useMemo(() => {
    return rawEntries.length > 0 ? rawEntries : [{ key: '', value: '', enabled: true }]
  }, [rawEntries])

  // Local state
  const [isBulkEdit, setIsBulkEdit] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const [bulkErrors, setBulkErrors] = useState<string[]>([])

  // Selection and drag-and-drop
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Autocomplete state
  const [autocomplete, setAutocomplete] = useState<{
    visible: boolean
    rowIndex: number
    field: 'key' | 'value'
    suggestions: string[]
    activeIndex: number
    rect: DOMRect | null
  }>({
    visible: false,
    rowIndex: -1,
    field: 'key',
    suggestions: [],
    activeIndex: 0,
    rect: null,
  })

  // Bulk Edit Autocomplete
  const [bulkAutocomplete, setBulkAutocomplete] = useState<{
    visible: boolean
    suggestions: string[]
    activeIndex: number
    lineIndex: number
    startPos: number
    query: string
  }>({
    visible: false,
    suggestions: [],
    activeIndex: 0,
    lineIndex: -1,
    startPos: -1,
    query: '',
  })

  // Undo stack
  const undoStack = useRef<{ entries: HeaderEntry[]; indices: number[] }[]>([])
  // For reverting Escape value
  const originalCellVal = useRef<string>('')

  // Helper: focus input
  const focusCell = (rowIndex: number, field: 'key' | 'value') => {
    setTimeout(() => {
      const selector = `input[data-row="${rowIndex}"][data-field="${field}"]`
      const element = document.querySelector(selector) as HTMLInputElement
      if (element) {
        element.focus()
        element.select()
      }
    }, 50)
  }

  const handleDeleteSelected = useCallback(() => {
    if (selectedIndices.length === 0) return

    const sortedIndices = [...selectedIndices].sort((a, b) => a - b)
    const deletedItems = sortedIndices.map((idx) => entries[idx])

    undoStack.current.push({
      entries: deletedItems,
      indices: sortedIndices,
    })

    let newEntries = entries.filter((_, idx) => !selectedIndices.includes(idx))
    if (newEntries.length === 0) {
      newEntries = [{ key: '', value: '', enabled: true }]
    }
    onChange(newEntries)
    setSelectedIndices([])
  }, [selectedIndices, entries, onChange])

  const handleUndo = useCallback(() => {
    const lastAction = undoStack.current.pop()
    if (!lastAction) return

    const newEntries = [...entries]
    lastAction.indices.forEach((originalIdx, i) => {
      // Overwrite the placeholder row if it's the only blank item in the table
      if (newEntries.length === 1 && newEntries[0].key === '' && newEntries[0].value === '') {
        newEntries.splice(0, 1)
      }
      newEntries.splice(originalIdx, 0, lastAction.entries[i])
    })
    onChange(newEntries)
  }, [entries, onChange])

  // Keyboard undo listener
  useEffect(() => {
    const handleUndoKeys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        // Prevent if typing in an editor other than KV cells or if we have historical edits
        const activeElem = document.activeElement
        const isEditingCell =
          activeElem?.tagName === 'INPUT' && activeElem.hasAttribute('data-field')
        if (isEditingCell || !activeElem || activeElem.tagName === 'BODY') {
          e.preventDefault()
          handleUndo()
        }
      }
    }
    window.addEventListener('keydown', handleUndoKeys)
    return () => window.removeEventListener('keydown', handleUndoKeys)
  }, [handleUndo])

  // Custom Headers collection memory
  const getCustomHeaders = (): string[] => {
    if (!collectionId) return []
    const saved = localStorage.getItem(`cortex.custom-headers.${collectionId}`)
    return saved ? JSON.parse(saved) : []
  }

  const rememberCustomHeader = (key: string) => {
    if (!collectionId || !key.trim()) return
    const isBuiltIn = COMMON_HEADERS_KEYS.some((k) => k.toLowerCase() === key.toLowerCase())
    if (isBuiltIn) return

    const current = getCustomHeaders()
    if (!current.some((c) => c.toLowerCase() === key.toLowerCase())) {
      const updated = [...current, key]
      localStorage.setItem(`cortex.custom-headers.${collectionId}`, JSON.stringify(updated))
    }
  }

  // Toggle single item
  const handleEntryChange = (index: number, updates: Partial<HeaderEntry>) => {
    const newEntries = [...entries]
    newEntries[index] = { ...newEntries[index], ...updates }
    onChange(newEntries)
  }

  // Toggle all checkboxes
  const allChecked = entries.length > 0 && entries.every((e) => e.enabled)
  const handleToggleAll = () => {
    const nextState = !allChecked
    const newEntries = entries.map((e) => ({ ...e, enabled: nextState }))
    onChange(newEntries)
  }

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())

    // Set the whole row as the drag image for a premium experience
    const tr = (e.target as HTMLElement).closest('tr')
    if (tr) {
      e.dataTransfer.setDragImage(tr, 10, 14)
    }
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newEntries = [...entries]
    const [removed] = newEntries.splice(draggedIndex, 1)
    newEntries.splice(index, 0, removed)

    onChange(newEntries)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // Deletion and Selection
  const handleDelete = (index: number) => {
    const deletedItem = entries[index]
    undoStack.current.push({
      entries: [deletedItem],
      indices: [index],
    })

    let newEntries = entries.filter((_, i) => i !== index)
    if (newEntries.length === 0) {
      newEntries = [{ key: '', value: '', enabled: true }]
    }
    onChange(newEntries)
    setSelectedIndices([])
  }

  // Row selection
  const handleRowClick = (e: React.MouseEvent, index: number) => {
    if (e.target instanceof HTMLInputElement) return // ignore inputs

    if (e.metaKey || e.ctrlKey) {
      setSelectedIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      )
    } else if (e.shiftKey && selectedIndices.length > 0) {
      const lastSelected = selectedIndices[selectedIndices.length - 1]
      const start = Math.min(lastSelected, index)
      const end = Math.max(lastSelected, index)
      const range: number[] = []
      for (let i = start; i <= end; i++) {
        range.push(i)
      }
      setSelectedIndices(range)
    } else {
      setSelectedIndices([index])
    }
  }

  // Focus key down listener for Deletions
  useEffect(() => {
    const handleGlobalDelete = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeElem = document.activeElement
        const isEditingCell = activeElem?.tagName === 'INPUT' || activeElem?.tagName === 'TEXTAREA'
        if (!isEditingCell && selectedIndices.length > 0) {
          e.preventDefault()
          handleDeleteSelected()
        }
      }
    }
    window.addEventListener('keydown', handleGlobalDelete)
    return () => window.removeEventListener('keydown', handleGlobalDelete)
  }, [selectedIndices, handleDeleteSelected])

  const handleAdd = () => {
    const newEntries = [...entries, { key: '', value: '', enabled: true }]
    onChange(newEntries)
    focusCell(newEntries.length - 1, 'key')
  }

  // Revert ESC value
  const handleCellFocus = (
    index: number,
    field: 'key' | 'value',
    val: string,
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    originalCellVal.current = val

    // Autocomplete on focus
    if (!entries[index].enabled) return

    if (isHeaders) {
      const rect = e.currentTarget.getBoundingClientRect()
      if (field === 'key') {
        const query = val.trim().toLowerCase()
        const custom = getCustomHeaders()
        const mergedKeys = [...COMMON_HEADERS_KEYS, ...custom]
        const suggestions = query ? mergedKeys.filter((k) => k.toLowerCase().startsWith(query)) : []

        setAutocomplete({
          visible: suggestions.length > 0,
          rowIndex: index,
          field: 'key',
          suggestions,
          activeIndex: 0,
          rect,
        })
      } else {
        const key = entries[index].key
        const values = COMMON_HEADERS[key] || []
        const query = val.trim().toLowerCase()
        const suggestions = query ? values.filter((v) => v.toLowerCase().startsWith(query)) : values // Full values list if blank

        setAutocomplete({
          visible: suggestions.length > 0,
          rowIndex: index,
          field: 'value',
          suggestions,
          activeIndex: 0,
          rect,
        })
      }
    }
  }

  const handleCellBlur = () => {
    // Timeout so dropdown clicks register first
    setTimeout(() => {
      setAutocomplete((prev) => ({ ...prev, visible: false }))
    }, 150)
  }

  const handleCellKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    field: 'key' | 'value'
  ) => {
    // Autocomplete keyboard control
    if (autocomplete.visible) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setAutocomplete((prev) => ({
          ...prev,
          activeIndex: (prev.activeIndex + 1) % prev.suggestions.length,
        }))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setAutocomplete((prev) => ({
          ...prev,
          activeIndex: (prev.activeIndex - 1 + prev.suggestions.length) % prev.suggestions.length,
        }))
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        const selected = autocomplete.suggestions[autocomplete.activeIndex]
        selectAutocompleteValue(index, field, selected)
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setAutocomplete((prev) => ({ ...prev, visible: false }))
        return
      }
    }

    // Default cell keyboard actions
    if (e.key === 'Escape') {
      e.preventDefault()
      const newEntries = [...entries]
      newEntries[index] = { ...newEntries[index], [field]: originalCellVal.current }
      onChange(newEntries)
      e.currentTarget.blur()
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      const newEntries = [...entries]
      newEntries.splice(index + 1, 0, { key: '', value: '', enabled: true })
      onChange(newEntries)
      focusCell(index + 1, 'key')
      return
    }

    if (e.key === 'Tab' && !e.shiftKey && field === 'value' && index === entries.length - 1) {
      const currentEntry = entries[index]
      if (currentEntry.key.trim() !== '' || currentEntry.value.trim() !== '') {
        e.preventDefault()
        const newEntries = [...entries, { key: '', value: '', enabled: true }]
        onChange(newEntries)
        focusCell(newEntries.length - 1, 'key')
      }
    }
  }

  const selectAutocompleteValue = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...entries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    onChange(newEntries)
    setAutocomplete((prev) => ({ ...prev, visible: false }))

    if (field === 'key') {
      rememberCustomHeader(value)
      // If header has preset options, move focus to value
      if (COMMON_HEADERS[value] && COMMON_HEADERS[value].length > 0) {
        focusCell(index, 'value')
      }
    }
  }

  const getCellRect = (index: number, field: 'key' | 'value'): DOMRect => {
    const el = document.getElementById(`kv-${field}-${index}`)
    if (el) {
      return el.getBoundingClientRect()
    }
    return new DOMRect()
  }

  // Key changes handler
  const handleKeyChange = (index: number, val: string) => {
    handleEntryChange(index, { key: val })

    if (isHeaders && entries[index].enabled) {
      const query = val.trim().toLowerCase()
      const custom = getCustomHeaders()
      const mergedKeys = [...COMMON_HEADERS_KEYS, ...custom]
      const suggestions = query ? mergedKeys.filter((k) => k.toLowerCase().startsWith(query)) : []

      setAutocomplete({
        visible: suggestions.length > 0,
        rowIndex: index,
        field: 'key',
        suggestions,
        activeIndex: 0,
        rect: getCellRect(index, 'key'),
      })
    }
  }

  // Value changes handler
  const handleValueChange = (index: number, val: string) => {
    handleEntryChange(index, { value: val, is_valueless: false })

    if (isHeaders && entries[index].enabled) {
      const key = entries[index].key
      const values = COMMON_HEADERS[key] || []
      const query = val.trim().toLowerCase()
      const suggestions = query ? values.filter((v) => v.toLowerCase().startsWith(query)) : values

      setAutocomplete({
        visible: suggestions.length > 0,
        rowIndex: index,
        field: 'value',
        suggestions,
        activeIndex: 0,
        rect: getCellRect(index, 'value'),
      })
    }
  }

  // Validation: duplicate key check
  const duplicateKeysList = entries.map((e) => (caseSensitiveKeys ? e.key : e.key.toLowerCase()))
  const checkDuplicate = (key: string) => {
    if (!key.trim()) return false
    const matchVal = caseSensitiveKeys ? key : key.toLowerCase()
    return duplicateKeysList.filter((k) => k === matchVal).length > 1
  }

  // Helper: parse bulk text to array of entries in real-time
  const parseBulkText = useCallback((text: string) => {
    const lines = text.split('\n')
    const parsedItems: HeaderEntry[] = []
    const errors: string[] = []

    lines.forEach((line, i) => {
      const trimmed = line.trim()
      if (!trimmed) return // skip blank lines

      let enabled = true
      let content = line.trim()
      if (content.startsWith('#')) {
        enabled = false
        content = content.slice(1).trim()
      }

      const colonIdx = content.indexOf(':')
      if (colonIdx === -1) {
        // In real-time parsing, treat the whole line as the key and show a soft error
        errors.push(`Line ${i + 1}: Missing ":" separator`)
        parsedItems.push({ key: content.trim(), value: '', enabled })
      } else {
        const key = content.slice(0, colonIdx).trim()
        const valPart = content.slice(colonIdx + 1)
        // Strip exactly one leading space after colon if present, otherwise trim
        const value = valPart.startsWith(' ') ? valPart.slice(1) : valPart
        parsedItems.push({ key, value, enabled })
      }
    })

    return { parsedItems, errors }
  }, [])

  // Bulk Edit Toggle
  const toggleBulkEdit = () => {
    if (!isBulkEdit) {
      // Serialize current table state
      const formatLines = entries
        .map((e) => {
          if (e.key.trim() === '' && e.value.trim() === '') return ''
          const prefix = e.enabled ? '' : '# '
          return `${prefix}${e.key}: ${e.value}` // ALWAYS use colon separator
        })
        .filter((l) => l !== '')

      setBulkText(formatLines.join('\n'))
      setBulkErrors([])
      setIsBulkEdit(true)
    } else {
      // Transitioning back to table view
      const { parsedItems } = parseBulkText(bulkText)

      let finalItems = parsedItems
      if (finalItems.length === 0) {
        finalItems = [{ key: '', value: '', enabled: true }]
      }

      onChange(finalItems)
      setIsBulkEdit(false)
      setBulkErrors([])
    }
  }

  // Bulk Edit autocomplete trigger
  const handleBulkKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (bulkAutocomplete.visible) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setBulkAutocomplete((prev) => ({
          ...prev,
          activeIndex: (prev.activeIndex + 1) % prev.suggestions.length,
        }))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setBulkAutocomplete((prev) => ({
          ...prev,
          activeIndex: (prev.activeIndex - 1 + prev.suggestions.length) % prev.suggestions.length,
        }))
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        selectBulkAutocomplete(bulkAutocomplete.suggestions[bulkAutocomplete.activeIndex])
        return
      }
      if (e.key === 'Escape' || e.key === ' ' || e.key === ':') {
        setBulkAutocomplete((prev) => ({ ...prev, visible: false }))
        return
      }
    }
  }

  const handleBulkTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setBulkText(text)

    // Real-time parsing and parent store update
    const { parsedItems, errors } = parseBulkText(text)
    setBulkErrors(errors)

    let finalItems = parsedItems
    if (finalItems.length === 0) {
      finalItems = [{ key: '', value: '', enabled: true }]
    }
    onChange(finalItems)

    if (!isHeaders) return

    const selectionStart = e.target.selectionStart
    const upToCursor = text.substring(0, selectionStart)
    const lines = upToCursor.split('\n')
    const currentLineIndex = lines.length - 1
    const currentLine = lines[currentLineIndex]

    // Check if user is typing key (before colon)
    const colonIdx = currentLine.indexOf(':')
    if (colonIdx === -1 || selectionStart <= upToCursor.lastIndexOf('\n') + 1 + colonIdx) {
      // Find the query prefix
      const keyPrefix = currentLine.replace(/^#\s*/, '').trim()
      if (keyPrefix.length > 0) {
        const custom = getCustomHeaders()
        const mergedKeys = [...COMMON_HEADERS_KEYS, ...custom]
        const suggestions = mergedKeys.filter((k) =>
          k.toLowerCase().startsWith(keyPrefix.toLowerCase())
        )

        if (suggestions.length > 0) {
          setBulkAutocomplete({
            visible: true,
            suggestions,
            activeIndex: 0,
            lineIndex: currentLineIndex,
            startPos:
              upToCursor.lastIndexOf('\n') +
              1 +
              (currentLine.startsWith('#') ? currentLine.indexOf('#') + 1 : 0),
            query: keyPrefix,
          })
          return
        }
      }
    }
    setBulkAutocomplete((prev) => ({ ...prev, visible: false }))
  }

  const selectBulkAutocomplete = (selected: string) => {
    const lines = bulkText.split('\n')
    const currentLine = lines[bulkAutocomplete.lineIndex]

    // Replace prefix query with selected key
    const prefix = currentLine.startsWith('#') ? '# ' : ''
    lines[bulkAutocomplete.lineIndex] = `${prefix}${selected}: `

    const updatedText = lines.join('\n')
    setBulkText(updatedText)
    setBulkAutocomplete((prev) => ({ ...prev, visible: false }))

    // Trigger real-time sync with parent for autocomplete selections
    const { parsedItems } = parseBulkText(updatedText)
    let finalItems = parsedItems
    if (finalItems.length === 0) {
      finalItems = [{ key: '', value: '', enabled: true }]
    }
    onChange(finalItems)
  }

  if (isBulkEdit) {
    return (
      <div className="flex flex-col h-full bg-bg-surface font-sans border border-border-subtle overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle shrink-0 bg-bg-panel">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {title} — Bulk Edit Mode
          </span>
          <button
            onClick={toggleBulkEdit}
            className="text-xs font-medium text-accent hover:text-accent-hover hover:underline transition-all"
          >
            Key-Value Editor
          </button>
        </div>

        {bulkErrors.length > 0 && (
          <div className="bg-error/10 border-b border-error/20 px-4 py-2 text-xs text-error flex flex-col gap-1 select-none">
            {bulkErrors.slice(0, 3).map((err, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-error rounded-full" />
                {err}
              </div>
            ))}
            {bulkErrors.length > 3 && (
              <div className="text-text-muted italic ml-3">
                And {bulkErrors.length - 3} more errors...
              </div>
            )}
          </div>
        )}

        <div className="flex-1 relative overflow-hidden">
          <textarea
            value={bulkText}
            onChange={handleBulkTextChange}
            onKeyDown={handleBulkKeyDown}
            className="w-full h-full bg-transparent p-4 font-mono text-sm resize-none focus:outline-none text-text-primary placeholder:text-text-muted/40 selection:bg-accent/20 leading-relaxed"
            placeholder={
              isHeaders ? `# Key: Value\nContent-Type: application/json` : `# Key: Value\npage: 2`
            }
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />

          {bulkAutocomplete.visible && (
            <div
              style={{
                position: 'absolute',
                top: `${bulkAutocomplete.lineIndex * 22 + 40}px`,
                left: '24px',
                zIndex: 1000,
              }}
              className="bg-bg-overlay border border-border-subtle rounded-md shadow-2xl overflow-hidden max-h-[200px] w-[260px] overflow-y-auto select-none"
            >
              {bulkAutocomplete.suggestions.map((sug, i) => (
                <div
                  key={sug}
                  onClick={() => selectBulkAutocomplete(sug)}
                  onMouseEnter={() => setBulkAutocomplete((prev) => ({ ...prev, activeIndex: i }))}
                  className={`px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors flex items-center justify-between ${
                    i === bulkAutocomplete.activeIndex
                      ? 'bg-bg-highlight text-text-primary'
                      : 'text-text-secondary hover:bg-bg-muted/50'
                  }`}
                >
                  {sug}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-bg-surface font-sans border border-border-subtle overflow-hidden">
      {/* Meta header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle shrink-0 bg-bg-panel">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {title} ({entries.filter((e) => e.key || e.value).length} rows)
        </span>
        <div className="flex items-center gap-3">
          {presets && presets.length > 0 && (
            <div className="relative" ref={presetsDropdownRef}>
              <button
                type="button"
                onClick={() => setPresetsOpen(!presetsOpen)}
                className="text-xs font-medium text-accent hover:text-accent-hover hover:underline flex items-center gap-1 transition-all"
              >
                <Icons.Sliders size={11} />
                Apply Preset
              </button>
              {presetsOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-bg-overlay border border-border-subtle rounded shadow-lg py-1 z-30 font-sans">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        onApplyPreset?.(preset.fields)
                        setPresetsOpen(false)
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-text-primary hover:bg-bg-highlight truncate"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            onClick={toggleBulkEdit}
            className="text-xs font-medium text-accent hover:text-accent-hover hover:underline transition-all"
          >
            Bulk Edit
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto select-none">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-subtle h-[28px] bg-bg-panel/40">
              <th className="w-[22px] border-r border-border-subtle text-center"></th>
              <th className="w-[30px] border-r border-border-subtle text-center">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={handleToggleAll}
                  className="accent-accent cursor-pointer"
                />
              </th>
              <th className="text-left px-3 text-[11px] font-semibold text-text-muted uppercase border-r border-border-subtle w-1/3">
                {namePlaceholder}
              </th>
              <th className="text-left px-3 text-[11px] font-semibold text-text-muted uppercase">
                {valuePlaceholder}
              </th>
              <th className="w-[30px]"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const isSelected = selectedIndices.includes(index)
              const isDragOver = dragOverIndex === index
              const isDup = checkDuplicate(entry.key)

              return (
                <tr
                  key={index}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => handleRowClick(e, index)}
                  className={`group border-b border-border-subtle h-[28px] transition-all cursor-default ${
                    !entry.enabled
                      ? 'opacity-40 bg-bg-muted/20 text-text-muted'
                      : isSelected
                        ? 'bg-bg-highlight'
                        : isDragOver
                          ? 'border-t-2 border-accent'
                          : isDup
                            ? 'bg-warning/5 text-warning-muted border-l-2 border-l-warning'
                            : 'hover:bg-bg-muted/10'
                  }`}
                >
                  {/* Drag Handle Column */}
                  <td
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, index)}
                    className="drag-handle w-[22px] border-r border-border-subtle text-center align-middle cursor-grab active:cursor-grabbing select-none"
                  >
                    <div className="flex items-center justify-center w-full h-full text-text-muted/40 group-hover:text-text-secondary transition-colors">
                      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                        <circle cx="2" cy="6" r="1" fill="currentColor" />
                        <circle cx="2" cy="10" r="1" fill="currentColor" />
                        <circle cx="6" cy="2" r="1" fill="currentColor" />
                        <circle cx="6" cy="6" r="1" fill="currentColor" />
                        <circle cx="6" cy="10" r="1" fill="currentColor" />
                      </svg>
                    </div>
                  </td>

                  {/* Enabled Checkbox */}
                  <td className="text-center border-r border-border-subtle">
                    <input
                      type="checkbox"
                      checked={entry.enabled}
                      onChange={(e) => handleEntryChange(index, { enabled: e.target.checked })}
                      className="accent-accent cursor-pointer"
                    />
                  </td>

                  {/* Key input */}
                  <td className="border-r border-border-subtle px-0 relative">
                    <VariableInput
                      value={entry.key}
                      onChange={(val) => handleKeyChange(index, val)}
                      onKeyDown={(e) => handleCellKeyDown(e, index, 'key')}
                      onFocus={(e) => handleCellFocus(index, 'key', entry.key, e)}
                      onBlur={handleCellBlur}
                      placeholder={namePlaceholder}
                      readOnly={!entry.enabled}
                      id={`kv-key-${index}`}
                      data-row={index}
                      data-field="key"
                      className="w-full h-full bg-transparent px-3 text-sm focus:bg-bg-surface focus:outline-none"
                    />
                  </td>

                  {/* Value input */}
                  <td className="px-0 relative">
                    <VariableInput
                      value={entry.value}
                      onChange={(val) => handleValueChange(index, val)}
                      onKeyDown={(e) => handleCellKeyDown(e, index, 'value')}
                      onFocus={(e) => handleCellFocus(index, 'value', entry.value, e)}
                      onBlur={handleCellBlur}
                      placeholder={entry.is_valueless ? '(no value flag)' : valuePlaceholder}
                      readOnly={!entry.enabled}
                      id={`kv-value-${index}`}
                      data-row={index}
                      data-field="value"
                      className="w-full h-full bg-transparent px-3 text-sm focus:bg-bg-surface"
                    />
                  </td>

                  {/* Delete Row button */}
                  <td className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(index)
                      }}
                      className="text-text-muted hover:text-error transition-colors flex items-center justify-center w-full h-full"
                    >
                      <Icons.X size={14} />
                    </button>
                  </td>
                </tr>
              )
            })}

            {/* Clickable Add Parameter bottom row */}
            <tr className="h-[28px] hover:bg-bg-muted/10 transition-colors">
              <td colSpan={5}>
                <button
                  onClick={handleAdd}
                  className="w-full h-full px-[54px] text-left text-xs font-semibold text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5"
                >
                  <Icons.Plus size={12} />
                  {addButtonLabel}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Autocomplete Popup Portal */}
      {autocomplete.visible && autocomplete.rect && (
        <div
          style={{
            position: 'fixed',
            left: `${autocomplete.rect.left}px`,
            top: `${autocomplete.rect.bottom + 4}px`,
            width: `${autocomplete.rect.width}px`,
            zIndex: 9999,
          }}
          className="bg-bg-overlay border border-border-subtle rounded-md shadow-2xl overflow-hidden max-h-[160px] overflow-y-auto select-none font-mono text-xs flex flex-col"
        >
          {autocomplete.suggestions.map((sug, i) => (
            <div
              key={sug}
              onClick={() =>
                selectAutocompleteValue(autocomplete.rowIndex, autocomplete.field, sug)
              }
              onMouseEnter={() => setAutocomplete((prev) => ({ ...prev, activeIndex: i }))}
              className={`px-3 py-1.5 cursor-pointer transition-colors flex items-center justify-between ${
                i === autocomplete.activeIndex
                  ? 'bg-bg-highlight text-text-primary'
                  : 'text-text-secondary hover:bg-bg-muted/50'
              }`}
            >
              <span>{sug}</span>
            </div>
          ))}
        </div>
      )}

      {/* Inherited Headers (read-only) section */}
      {readOnlyEntries && readOnlyEntries.length > 0 && (
        <div className="mt-auto border-t border-border-subtle shrink-0">
          <div className="px-4 py-1.5 border-b border-border-subtle bg-bg-panel/40 flex items-center gap-2 select-none">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
              {readOnlyTitle}
            </span>
            {readOnlyTooltip && (
              <div
                className="text-text-muted hover:text-text-primary cursor-help"
                title={readOnlyTooltip}
              >
                <Icons.Info size={12} />
              </div>
            )}
          </div>
          <table className="w-full border-collapse">
            <tbody>
              {readOnlyEntries.map((entry, index) => (
                <tr
                  key={index}
                  className="border-b border-border-subtle h-[28px] text-text-muted/65 italic bg-bg-muted/10"
                >
                  <td className="w-[30px] border-r border-border-subtle"></td>
                  <td className="border-r border-border-subtle px-3 text-sm font-mono w-1/3">
                    {entry.key}
                  </td>
                  <td className="px-3 text-sm font-mono flex items-center justify-between h-[28px]">
                    <span>{entry.value}</span>
                    {entry.description && (
                      <span className="bg-accent/10 text-accent text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded tracking-wider mr-2 select-none">
                        {entry.description}
                      </span>
                    )}
                  </td>
                  <td className="w-[30px]"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default KeyValueEditor
