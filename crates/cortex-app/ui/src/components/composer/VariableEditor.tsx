import React, { useState } from 'react'
import * as Icons from '../ui/Icons'
import type { Variable } from '../../bindings'

interface VariableEditorProps {
  variables: Variable[]
  onChange: (variables: Variable[]) => void
  title?: string
  readOnly?: boolean
}

const VariableEditor: React.FC<VariableEditorProps> = ({
  variables,
  onChange,
  title = 'Variables',
  readOnly = false,
}) => {
  // Tracks which secret-flagged rows are temporarily revealed
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set())

  const handleVariableChange = (index: number, updates: Partial<Variable>) => {
    if (readOnly) return
    const newVariables = [...variables]
    newVariables[index] = { ...newVariables[index], ...updates }
    // If unsetting secret, also clear the revealed state
    if (updates.secret === false) {
      setRevealedRows((prev) => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
    }
    onChange(newVariables)
  }

  const handleDelete = (index: number) => {
    if (readOnly) return
    const newVariables = variables.filter((_, i) => i !== index)
    // Shift revealed row indices down
    setRevealedRows((prev) => {
      const next = new Set<number>()
      prev.forEach((i) => {
        if (i < index) next.add(i)
        else if (i > index) next.add(i - 1)
      })
      return next
    })
    onChange(newVariables)
  }

  const handleAdd = () => {
    if (readOnly) return
    onChange([...variables, { name: '', value: '', enabled: true, secret: false }])
  }

  const toggleReveal = (index: number) => {
    setRevealedRows((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const handleValueKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Tab' && !e.shiftKey && index === variables.length - 1) {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="flex flex-col h-full bg-bg-surface overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle shrink-0">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            {title}
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse table-fixed">
          <thead className="sticky top-0 z-10 bg-bg-surface">
            <tr className="border-b border-border-subtle h-8">
              <th className="w-8 border-r border-border-subtle"></th>
              <th className="text-left px-3 text-[11px] font-bold text-text-muted uppercase border-r border-border-subtle w-1/3">
                Name
              </th>
              <th className="text-left px-3 text-[11px] font-bold text-text-muted uppercase border-r border-border-subtle">
                Value
              </th>
              <th className="w-16 text-center px-3 text-[11px] font-bold text-text-muted uppercase border-r border-border-subtle">
                Secret
              </th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {variables.map((variable, index) => {
              const isRevealed = revealedRows.has(index)
              const showAsPassword = variable.secret && !isRevealed

              return (
                <tr
                  key={index}
                  className={`group border-b border-border-subtle h-[32px] transition-colors ${
                    readOnly
                      ? 'opacity-60 cursor-default bg-bg-muted/20'
                      : !variable.enabled
                        ? 'bg-bg-muted text-text-muted opacity-60 hover:bg-bg-muted/80'
                        : 'hover:bg-bg-muted/30'
                  }`}
                >
                  {/* Enabled checkbox */}
                  <td className="text-center border-r border-border-subtle px-0">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={variable.enabled ?? true}
                        onChange={(e) => handleVariableChange(index, { enabled: e.target.checked })}
                        disabled={readOnly}
                        className="accent-accent w-3.5 h-3.5 disabled:cursor-default"
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="border-r border-border-subtle px-0">
                    {readOnly ? (
                      <span className="block w-full px-3 text-sm font-mono truncate text-text-secondary">
                        {variable.name}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={variable.name}
                        onChange={(e) => handleVariableChange(index, { name: e.target.value })}
                        placeholder="Variable name"
                        className="w-full h-full bg-transparent px-3 text-sm font-mono focus:bg-bg-highlight focus:outline-none placeholder:text-text-muted/40"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                    )}
                  </td>

                  {/* Value — with optional eye reveal button overlay */}
                  <td className="border-r border-border-subtle px-0">
                    <div className="relative flex items-center h-full">
                      {readOnly ? (
                        <span className="block w-full px-3 text-sm font-mono truncate text-text-secondary">
                          {showAsPassword ? '••••••••' : String(variable.value)}
                        </span>
                      ) : (
                        <input
                          type={showAsPassword ? 'password' : 'text'}
                          value={String(variable.value)}
                          onChange={(e) => handleVariableChange(index, { value: e.target.value })}
                          onKeyDown={(e) => handleValueKeyDown(e, index)}
                          placeholder={variable.secret ? '••••••••' : 'Value'}
                          className="w-full h-full bg-transparent px-3 pr-8 text-sm font-mono focus:bg-bg-highlight focus:outline-none placeholder:text-text-muted/40"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                        />
                      )}
                      {/* Temporary reveal button — only shown when secret=true */}
                      {variable.secret && !readOnly && (
                        <button
                          onClick={() => toggleReveal(index)}
                          tabIndex={-1}
                          className={`absolute right-1 p-1 rounded transition-colors ${
                            isRevealed
                              ? 'text-accent bg-accent/10 hover:bg-accent/20'
                              : 'text-text-muted hover:text-text-primary hover:bg-bg-muted'
                          }`}
                          title={isRevealed ? 'Hide value' : 'Reveal value temporarily'}
                        >
                          {isRevealed ? <Icons.EyeOff size={12} /> : <Icons.Eye size={12} />}
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Secret checkbox */}
                  <td className="border-r border-border-subtle px-0">
                    <div className="flex items-center justify-center h-full">
                      <input
                        type="checkbox"
                        checked={variable.secret ?? false}
                        onChange={(e) => handleVariableChange(index, { secret: e.target.checked })}
                        disabled={readOnly}
                        title={variable.secret ? 'Marked as secret' : 'Mark as secret'}
                        className="accent-accent w-3.5 h-3.5 disabled:cursor-default"
                      />
                    </div>
                  </td>

                  {/* Delete */}
                  <td className="px-0">
                    <div className="flex items-center justify-center h-full">
                      {!readOnly && (
                        <button
                          onClick={() => handleDelete(index)}
                          className="p-1 text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-error/10"
                        >
                          <Icons.X size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {!readOnly && (
              <tr className="h-[32px]">
                <td colSpan={5} className="p-0">
                  <button
                    onClick={handleAdd}
                    className="w-full h-full px-11 text-left text-sm text-text-muted hover:text-text-primary hover:bg-bg-muted transition-colors flex items-center"
                  >
                    <Icons.Plus size={12} className="mr-2" />
                    Add variable
                  </button>
                </td>
              </tr>
            )}
            {readOnly && variables.length === 0 && (
              <tr className="h-[32px]">
                <td colSpan={5} className="px-4 py-2 text-xs text-text-muted text-center">
                  No variables defined
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VariableEditor
