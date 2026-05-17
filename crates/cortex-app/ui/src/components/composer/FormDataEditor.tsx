import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import * as Icons from '../ui/Icons'
import { commands } from '../../bindings'
import VariableInput from './VariableInput'

export interface FormField {
  key: string
  value: string
  isFile: boolean
  filePath: string
  enabled: boolean
}

interface FormDataEditorProps {
  fields: FormField[]
  onChange: (fields: FormField[]) => void
}

const EMPTY_ROW: FormField = { key: '', value: '', isFile: false, filePath: '', enabled: true }

const getFileMetadata = (path: string) => {
  if (!path) return null
  const parts = path.split(/[/\\]/)
  const fileName = parts[parts.length - 1] || 'file'
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  const mimeMap: Record<string, string> = {
    json: 'application/json',
    xml: 'application/xml',
    html: 'text/html',
    txt: 'text/plain',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    pdf: 'application/pdf',
    zip: 'application/zip',
    csv: 'text/csv',
  }
  return {
    name: fileName,
    ext: ext.toUpperCase(),
    mime: mimeMap[ext] || 'application/octet-stream',
  }
}

// Serialize fields → bulk text  (file fields use @filepath syntax)
const serializeFields = (fields: FormField[]): string => {
  return fields
    .filter((f) => f.key.trim() || f.value.trim() || f.filePath.trim())
    .map((f) => {
      const prefix = f.enabled ? '' : '# '
      const val = f.isFile ? `@${f.filePath}` : f.value
      return `${prefix}${f.key}: ${val}`
    })
    .join('\n')
}

// Parse bulk text → fields
const parseBulkText = (text: string): { fields: FormField[]; errors: string[] } => {
  const lines = text.split('\n')
  const fields: FormField[] = []
  const errors: string[] = []
  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) return
    let enabled = true
    let content = trimmed
    if (content.startsWith('#')) {
      enabled = false
      content = content.slice(1).trim()
    }
    const colonIdx = content.indexOf(':')
    if (colonIdx === -1) {
      errors.push(`Line ${i + 1}: Missing ":" separator`)
      fields.push({ ...EMPTY_ROW, key: content, enabled })
    } else {
      const key = content.slice(0, colonIdx).trim()
      const rawVal = content.slice(colonIdx + 1)
      const val = rawVal.startsWith(' ') ? rawVal.slice(1) : rawVal
      if (val.startsWith('@')) {
        fields.push({ key, value: '', isFile: true, filePath: val.slice(1), enabled })
      } else {
        fields.push({ key, value: val, isFile: false, filePath: '', enabled })
      }
    }
  })
  return { fields, errors }
}

const FormDataEditor: React.FC<FormDataEditorProps> = ({ fields: rawFields, onChange }) => {
  const fields = useMemo(() => (rawFields.length > 0 ? rawFields : [{ ...EMPTY_ROW }]), [rawFields])

  const [isBulkEdit, setIsBulkEdit] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const [bulkErrors, setBulkErrors] = useState<string[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const undoStack = useRef<{ fields: FormField[]; indices: number[] }[]>([])

  // --- Bulk Edit ---
  const toggleBulkEdit = () => {
    if (!isBulkEdit) {
      setBulkText(serializeFields(fields))
      setBulkErrors([])
      setIsBulkEdit(true)
    } else {
      const { fields: parsed } = parseBulkText(bulkText)
      onChange(parsed.length > 0 ? parsed : [{ ...EMPTY_ROW }])
      setIsBulkEdit(false)
      setBulkErrors([])
    }
  }

  const handleBulkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setBulkText(text)
    const { fields: parsed, errors } = parseBulkText(text)
    setBulkErrors(errors)
    onChange(parsed.length > 0 ? parsed : [{ ...EMPTY_ROW }])
  }

  // --- Row operations ---
  const handleRowChange = (index: number, updates: Partial<FormField>) => {
    const next = [...fields]
    next[index] = { ...next[index], ...updates }
    onChange(next)
  }

  const handleAdd = () => {
    onChange([...fields, { ...EMPTY_ROW }])
  }

  const handleDelete = (index: number) => {
    undoStack.current.push({ fields: [fields[index]], indices: [index] })
    let next = fields.filter((_, i) => i !== index)
    if (next.length === 0) next = [{ ...EMPTY_ROW }]
    onChange(next)
    setSelectedIndices([])
  }

  const handleDeleteSelected = useCallback(() => {
    if (selectedIndices.length === 0) return
    const sorted = [...selectedIndices].sort((a, b) => a - b)
    undoStack.current.push({ fields: sorted.map((i) => fields[i]), indices: sorted })
    let next = fields.filter((_, i) => !selectedIndices.includes(i))
    if (next.length === 0) next = [{ ...EMPTY_ROW }]
    onChange(next)
    setSelectedIndices([])
  }, [selectedIndices, fields, onChange])

  const handleSelectFile = async (index: number) => {
    try {
      const selected = await commands.pickFile('Select Form File', 'All Files', '*')
      if (selected?.status === 'ok' && selected.data) {
        handleRowChange(index, { filePath: selected.data })
      }
    } catch (e) {
      console.error('Failed to select file', e)
    }
  }

  // --- Drag and drop ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    const tr = (e.target as HTMLElement).closest('tr')
    if (tr) e.dataTransfer.setDragImage(tr, 10, 14)
  }
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== index) setDragOverIndex(index)
  }
  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    const next = [...fields]
    const [moved] = next.splice(draggedIndex, 1)
    next.splice(index, 0, moved)
    onChange(next)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }
  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // --- Row selection ---
  const handleRowClick = (e: React.MouseEvent, index: number) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLSelectElement ||
      e.target instanceof HTMLButtonElement
    )
      return
    if (e.metaKey || e.ctrlKey) {
      setSelectedIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      )
    } else if (e.shiftKey && selectedIndices.length > 0) {
      const last = selectedIndices[selectedIndices.length - 1]
      const start = Math.min(last, index)
      const end = Math.max(last, index)
      setSelectedIndices(Array.from({ length: end - start + 1 }, (_, k) => start + k))
    } else {
      setSelectedIndices([index])
    }
  }

  // Focus key down listener for Deletions
  useEffect(() => {
    const handleGlobalDelete = (e: KeyboardEvent) => {
      const activeElem = document.activeElement
      const isEditingCell = activeElem?.tagName === 'INPUT' || activeElem?.tagName === 'TEXTAREA'
      if (!isEditingCell && selectedIndices.length > 0) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault()
          handleDeleteSelected()
        }
      }
    }
    window.addEventListener('keydown', handleGlobalDelete)
    return () => window.removeEventListener('keydown', handleGlobalDelete)
  }, [selectedIndices, handleDeleteSelected])

  // Duplicate key detection
  const activeKeys = fields
    .filter((f) => f.enabled && f.key.trim())
    .map((f) => f.key.trim().toLowerCase())
  const duplicateKeys = new Set(activeKeys.filter((k, i) => activeKeys.indexOf(k) !== i))

  const allChecked = fields.every((f) => f.enabled)
  const handleToggleAll = () => {
    const next = !allChecked
    onChange(fields.map((f) => ({ ...f, enabled: next })))
  }

  // ---- BULK EDIT VIEW ----
  if (isBulkEdit) {
    return (
      <div className="flex flex-col h-full bg-bg-surface font-sans border border-border-subtle overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle shrink-0 bg-bg-panel">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Multipart Form — Bulk Edit Mode
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
              <div className="text-text-muted italic ml-3">And {bulkErrors.length - 3} more…</div>
            )}
          </div>
        )}

        <div className="px-4 py-2 bg-bg-muted/20 border-b border-border-subtle text-[10px] text-text-muted select-none">
          Format: <span className="font-mono text-text-secondary">key: value</span>&nbsp;·&nbsp;
          Files: <span className="font-mono text-text-secondary">key: @/path/to/file</span>
          &nbsp;·&nbsp; Disabled:{' '}
          <span className="font-mono text-text-secondary"># key: value</span>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <textarea
            value={bulkText}
            onChange={handleBulkChange}
            className="w-full h-full bg-transparent p-4 font-mono text-sm resize-none focus:outline-none text-text-primary placeholder:text-text-muted/40 selection:bg-accent/20 leading-relaxed"
            placeholder={`# comment line\nfield1: text value\nfile_field: @/path/to/file.png`}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>
    )
  }

  // ---- TABLE VIEW ----
  return (
    <div className="flex flex-col h-full bg-bg-surface font-sans border border-border-subtle overflow-hidden">
      {/* Header bar — matches KeyValueEditor exactly */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle shrink-0 bg-bg-panel">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Multipart Form ({fields.filter((f) => f.key || f.value || f.filePath).length} rows)
        </span>
        <button
          onClick={toggleBulkEdit}
          className="text-xs font-medium text-accent hover:text-accent-hover hover:underline transition-all"
        >
          Bulk Edit
        </button>
      </div>

      <div className="flex-1 overflow-y-auto select-none">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-subtle h-[28px] bg-bg-panel/40">
              {/* Drag handle column */}
              <th className="w-[22px] border-r border-border-subtle" />
              {/* Enable all checkbox */}
              <th className="w-[30px] border-r border-border-subtle text-center">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={handleToggleAll}
                  className="accent-accent cursor-pointer"
                />
              </th>
              <th className="text-left px-3 text-[11px] font-semibold text-text-muted uppercase border-r border-border-subtle w-[28%]">
                Key
              </th>
              <th className="text-left px-3 text-[11px] font-semibold text-text-muted uppercase border-r border-border-subtle">
                Value / File
              </th>
              <th className="text-left px-3 text-[11px] font-semibold text-text-muted uppercase border-r border-border-subtle w-[80px]">
                Type
              </th>
              <th className="w-[30px]" />
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => {
              const isSelected = selectedIndices.includes(index)
              const isDragOver = dragOverIndex === index
              const isDuplicate =
                field.enabled &&
                field.key.trim() &&
                duplicateKeys.has(field.key.trim().toLowerCase())
              const isEmptyKey =
                field.enabled && !field.key.trim() && (field.value.trim() || field.filePath.trim())
              const isMissingFile = field.enabled && field.isFile && !field.filePath.trim()
              const meta = field.isFile ? getFileMetadata(field.filePath) : null

              return (
                <tr
                  key={index}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => handleRowClick(e, index)}
                  className={`group border-b border-border-subtle h-[28px] transition-all cursor-default ${
                    !field.enabled
                      ? 'opacity-40 bg-bg-muted/20 text-text-muted'
                      : isSelected
                        ? 'bg-bg-highlight'
                        : isDragOver
                          ? 'border-t-2 border-accent'
                          : isDuplicate
                            ? 'bg-warning/5 border-l-2 border-l-warning'
                            : 'hover:bg-bg-muted/10'
                  }`}
                >
                  {/* Drag handle */}
                  <td
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    className="w-[22px] border-r border-border-subtle text-center align-middle cursor-grab active:cursor-grabbing select-none"
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

                  {/* Enable checkbox */}
                  <td className="text-center border-r border-border-subtle">
                    <input
                      type="checkbox"
                      checked={field.enabled}
                      onChange={(e) => handleRowChange(index, { enabled: e.target.checked })}
                      className="accent-accent cursor-pointer"
                    />
                  </td>

                  {/* Key input */}
                  <td className="border-r border-border-subtle px-0 relative">
                    <div className="flex items-center w-full h-full">
                      <VariableInput
                        value={field.key}
                        onChange={(val) => handleRowChange(index, { key: val })}
                        placeholder="Key"
                        readOnly={!field.enabled}
                        className="flex-1 h-full bg-transparent px-3 text-sm focus:bg-bg-surface focus:outline-none"
                      />
                      {isEmptyKey && (
                        <span
                          title="Empty key will be skipped from request"
                          className="mr-1 shrink-0"
                        >
                          <Icons.AlertCircle size={12} className="stroke-warning" />
                        </span>
                      )}
                      {isDuplicate && (
                        <span title="Duplicate key name" className="mr-1 shrink-0">
                          <Icons.AlertCircle size={12} className="stroke-info" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Value / File input */}
                  <td className="border-r border-border-subtle px-0 relative">
                    {field.isFile ? (
                      <div className="flex items-center gap-2 px-2 h-full w-full overflow-hidden">
                        <button
                          onClick={() => handleSelectFile(index)}
                          className="shrink-0 px-2 py-0.5 bg-bg-panel border border-border-default hover:border-accent text-xs font-semibold rounded-sm text-text-secondary flex items-center gap-1 transition-all"
                        >
                          <Icons.File size={11} />
                          {field.filePath ? 'Change' : 'Select'}
                        </button>
                        {field.filePath ? (
                          <span
                            className="text-xs font-mono text-text-primary truncate"
                            title={field.filePath}
                          >
                            {meta?.name || field.filePath}
                            {meta && (
                              <span className="ml-1.5 px-1 bg-bg-muted border border-border-subtle rounded-sm text-[9px] text-text-muted">
                                {meta.ext}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-xs text-text-muted italic">No file selected</span>
                        )}
                        {isMissingFile && (
                          <span title="File path is empty" className="shrink-0 ml-auto mr-1">
                            <Icons.AlertCircle size={12} className="stroke-error" />
                          </span>
                        )}
                      </div>
                    ) : (
                      <VariableInput
                        value={field.value}
                        onChange={(val) => handleRowChange(index, { value: val })}
                        placeholder="Value"
                        readOnly={!field.enabled}
                        className="w-full h-full bg-transparent px-3 text-sm focus:bg-bg-surface focus:outline-none"
                      />
                    )}
                  </td>

                  {/* Type selector */}
                  <td className="border-r border-border-subtle px-2 align-middle">
                    <select
                      value={field.isFile ? 'file' : 'text'}
                      onChange={(e) =>
                        handleRowChange(index, { isFile: e.target.value === 'file' })
                      }
                      className="w-full bg-transparent text-xs text-text-primary border-0 focus:outline-none cursor-pointer py-0.5"
                    >
                      <option value="text">Text</option>
                      <option value="file">File</option>
                    </select>
                  </td>

                  {/* Delete button */}
                  <td className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(index)
                      }}
                      className="text-text-muted hover:text-error transition-colors flex items-center justify-center w-full h-full"
                      title="Remove row"
                    >
                      <Icons.X size={14} />
                    </button>
                  </td>
                </tr>
              )
            })}

            {/* Inline add-row — identical to KeyValueEditor */}
            <tr className="h-[28px] hover:bg-bg-muted/10 transition-colors">
              <td colSpan={6}>
                <button
                  onClick={handleAdd}
                  className="w-full h-full px-[54px] text-left text-xs font-semibold text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5"
                >
                  <Icons.Plus size={12} />
                  Add form field
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FormDataEditor
