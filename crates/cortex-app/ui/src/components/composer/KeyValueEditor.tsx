import React from 'react'
import * as Icons from '../ui/Icons'
import type { HeaderEntry } from '../../bindings'

interface KeyValueEditorProps {
  entries: HeaderEntry[]
  onChange: (entries: HeaderEntry[]) => void
  namePlaceholder?: string
  valuePlaceholder?: string
  title?: string
  onBulkEditChange?: (value: string) => void
  isBulkEdit?: boolean
  onToggleBulkEdit?: () => void
  readOnlyEntries?: { key: string; value: string }[]
  readOnlyTitle?: string
  readOnlyTooltip?: string
  addButtonLabel?: string
}

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  entries,
  onChange,
  namePlaceholder = 'Key',
  valuePlaceholder = 'Value',
  title,
  onBulkEditChange,
  isBulkEdit = false,
  onToggleBulkEdit,
  readOnlyEntries,
  readOnlyTitle,
  readOnlyTooltip,
  addButtonLabel = 'Add parameter',
}) => {
  const [localBulkValue, setLocalBulkValue] = React.useState('')
  const [prevIsBulkEdit, setPrevIsBulkEdit] = React.useState(false)

  if (isBulkEdit !== prevIsBulkEdit) {
    setPrevIsBulkEdit(isBulkEdit)
    if (isBulkEdit) {
      setLocalBulkValue(entries.map((e) => `${e.key}: ${e.value}`).join('\n'))
    }
  }

  const handleLocalBulkChange = (value: string) => {
    setLocalBulkValue(value)
    if (onBulkEditChange) {
      onBulkEditChange(value)
    }
  }
  const handleEntryChange = (index: number, updates: Partial<HeaderEntry>) => {
    const newEntries = [...entries]
    newEntries[index] = { ...newEntries[index], ...updates }
    onChange(newEntries)
  }

  const handleDelete = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index)
    onChange(newEntries)
  }

  const handleAdd = () => {
    onChange([...entries, { key: '', value: '', enabled: true }])
  }

  if (isBulkEdit && onBulkEditChange) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle shrink-0">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            {title}
          </span>
          <button onClick={onToggleBulkEdit} className="text-xs text-text-link hover:underline">
            Key-Value Edit
          </button>
        </div>
        <textarea
          value={localBulkValue}
          onChange={(e) => handleLocalBulkChange(e.target.value)}
          className="flex-1 w-full bg-transparent p-4 font-mono text-sm resize-none focus:outline-none"
          placeholder="key: value"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle shrink-0">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          {title}
        </span>
        {onToggleBulkEdit && (
          <button onClick={onToggleBulkEdit} className="text-xs text-text-link hover:underline">
            Bulk Edit
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-subtle h-7">
              <th className="w-[30px] border-r border-border-subtle"></th>
              <th className="text-left px-3 text-[11px] font-medium text-text-muted uppercase border-r border-border-subtle w-1/3">
                {namePlaceholder}
              </th>
              <th className="text-left px-3 text-[11px] font-medium text-text-muted uppercase">
                {valuePlaceholder}
              </th>
              <th className="w-[30px]"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr
                key={index}
                className={`group border-b border-border-subtle h-[28px] ${
                  !entry.enabled ? 'bg-bg-muted text-text-muted' : ''
                }`}
              >
                <td className="text-center border-r border-border-subtle">
                  <input
                    type="checkbox"
                    checked={entry.enabled}
                    onChange={(e) => handleEntryChange(index, { enabled: e.target.checked })}
                    className="accent-accent"
                  />
                </td>
                <td className="border-r border-border-subtle px-0">
                  <input
                    type="text"
                    value={entry.key}
                    onChange={(e) => handleEntryChange(index, { key: e.target.value })}
                    placeholder={namePlaceholder}
                    className="w-full h-full bg-transparent px-3 text-sm font-mono focus:bg-bg-surface focus:outline-none"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </td>
                <td className="px-0">
                  <input
                    type="text"
                    value={entry.value}
                    onChange={(e) => handleEntryChange(index, { value: e.target.value })}
                    placeholder={valuePlaceholder}
                    className="w-full h-full bg-transparent px-3 text-sm font-mono focus:bg-bg-surface focus:outline-none"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </td>
                <td className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-text-muted hover:text-error transition-colors"
                  >
                    <Icons.X size={14} />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="h-[28px]">
              <td colSpan={4}>
                <button
                  onClick={handleAdd}
                  className="w-full h-full px-11 text-left text-sm text-text-muted hover:text-text-primary hover:bg-bg-muted transition-colors"
                >
                  + {addButtonLabel}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {readOnlyEntries && readOnlyEntries.length > 0 && (
          <div className="mt-4">
            <div className="px-4 py-2 border-y border-border-subtle bg-bg-muted flex items-center gap-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                {readOnlyTitle}
              </span>
              {readOnlyTooltip && (
                <div className="text-text-muted hover:text-text-primary cursor-help">
                  <Icons.Info size={12} />
                </div>
              )}
            </div>
            <table className="w-full border-collapse">
              <tbody>
                {readOnlyEntries.map((entry, index) => (
                  <tr
                    key={index}
                    className="border-b border-border-subtle h-[28px] text-text-muted italic bg-bg-muted/50"
                  >
                    <td className="w-[30px] border-r border-border-subtle"></td>
                    <td className="border-r border-border-subtle px-3 text-sm font-mono w-1/3">
                      {entry.key}
                    </td>
                    <td className="px-3 text-sm font-mono">{entry.value}</td>
                    <td className="w-[30px]"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default KeyValueEditor
