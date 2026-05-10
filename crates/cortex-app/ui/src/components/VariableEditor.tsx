import React, { useState } from 'react'
import { Plus, Trash2, X, Check } from 'lucide-react'

interface VariableEditorProps {
  initialVariables: Record<string, string>
  onSave: (variables: Record<string, string>) => void
  onClose: () => void
  title: string
}

export const VariableEditor: React.FC<VariableEditorProps> = ({
  initialVariables,
  onSave,
  onClose,
  title,
}) => {
  const [vars, setVars] = useState<{ key: string; value: string }[]>(
    Object.entries(initialVariables).map(([key, value]) => ({ key, value }))
  )

  const handleAdd = () => {
    setVars([...vars, { key: '', value: '' }])
  }

  const handleRemove = (index: number) => {
    setVars(vars.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: 'key' | 'value', val: string) => {
    const newVars = [...vars]
    newVars[index][field] = val
    setVars(newVars)
  }

  const handleSave = () => {
    const result: Record<string, string> = {}
    vars.forEach((v) => {
      if (v.key.trim()) {
        result[v.key.trim()] = v.value
      }
    })
    onSave(result)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              Variable Management
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {vars.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-xl">
              <p className="text-sm text-slate-500 italic">No variables defined yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_1fr_40px] gap-4 px-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Key
                </span>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Value
                </span>
                <span />
              </div>
              {vars.map((v, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_1fr_40px] gap-4 group">
                  <input
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="VAR_NAME"
                    value={v.key}
                    onChange={(e) => handleChange(idx, 'key', e.target.value)}
                  />
                  <input
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="value"
                    value={v.value}
                    onChange={(e) => handleChange(idx, 'value', e.target.value)}
                  />
                  <button
                    onClick={() => handleRemove(idx)}
                    className="flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors py-2"
          >
            <Plus className="w-3 h-3" /> Add Variable
          </button>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-600/20 transition-all"
          >
            <Check className="w-3 h-3" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
