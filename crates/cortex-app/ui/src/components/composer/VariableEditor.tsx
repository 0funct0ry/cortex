import React from 'react'
import * as Icons from '../ui/Icons'
import type { Variable } from '../../bindings'

interface VariableEditorProps {
  variables: Variable[]
  onChange: (variables: Variable[]) => void
  title?: string
}

const VariableEditor: React.FC<VariableEditorProps> = ({
  variables,
  onChange,
  title = 'Variables',
}) => {
  const handleVariableChange = (index: number, updates: Partial<Variable>) => {
    const newVariables = [...variables]
    newVariables[index] = { ...newVariables[index], ...updates }
    onChange(newVariables)
  }

  const handleDelete = (index: number) => {
    const newVariables = variables.filter((_, i) => i !== index)
    onChange(newVariables)
  }

  const handleAdd = () => {
    onChange([...variables, { name: '', value: '', enabled: true, secret: false }])
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
              <th className="w-20 text-center px-3 text-[11px] font-bold text-text-muted uppercase">
                Secret
              </th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {variables.map((variable, index) => (
              <tr
                key={index}
                className={`group border-b border-border-subtle h-[32px] hover:bg-bg-muted/30 transition-colors ${
                  !variable.enabled ? 'bg-bg-muted text-text-muted opacity-60' : ''
                }`}
              >
                <td className="text-center border-r border-border-subtle px-0">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={variable.enabled ?? true}
                      onChange={(e) => handleVariableChange(index, { enabled: e.target.checked })}
                      className="accent-accent w-3.5 h-3.5"
                    />
                  </div>
                </td>
                <td className="border-r border-border-subtle px-0">
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
                </td>
                <td className="border-r border-border-subtle px-0">
                  <input
                    type={variable.secret ? 'password' : 'text'}
                    value={String(variable.value)}
                    onChange={(e) => handleVariableChange(index, { value: e.target.value })}
                    placeholder={variable.secret ? '••••••••' : 'Value'}
                    className="w-full h-full bg-transparent px-3 text-sm font-mono focus:bg-bg-highlight focus:outline-none placeholder:text-text-muted/40"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </td>
                <td className="px-0">
                  <div className="flex items-center justify-center h-full">
                    <button
                      onClick={() => handleVariableChange(index, { secret: !variable.secret })}
                      className={`p-1 rounded-md transition-all ${
                        variable.secret
                          ? 'text-accent bg-accent/10 hover:bg-accent/20'
                          : 'text-text-muted hover:text-text-primary hover:bg-bg-muted'
                      }`}
                      title={variable.secret ? 'Hide secret' : 'Show secret'}
                    >
                      {variable.secret ? <Icons.EyeOff size={14} /> : <Icons.Eye size={14} />}
                    </button>
                  </div>
                </td>
                <td className="px-0">
                  <div className="flex items-center justify-center h-full">
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-1 text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-error/10"
                    >
                      <Icons.X size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VariableEditor
