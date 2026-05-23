import React, { useState } from 'react'
import * as Icons from '../ui/Icons'
import KeyValueEditor from '../composer/KeyValueEditor'
import Dialog from '../ui/Dialog'
import type { CollectionPreset, HeaderEntry } from '../../bindings'

interface CollectionPresetsTabProps {
  presets: CollectionPreset[]
  onChange: (presets: CollectionPreset[]) => void
}

const CollectionPresetsTab: React.FC<CollectionPresetsTabProps> = ({ presets, onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [renamingIndex, setRenamingIndex] = useState<number | null>(null)
  const [renameText, setRenameText] = useState('')
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const activePreset = presets[selectedIndex]

  const handleAddPreset = () => {
    const name = `Preset ${presets.length + 1}`
    const newPreset: CollectionPreset = {
      name,
      fields: [{ key: '', value: '', enabled: true }],
    }
    const updated = [...presets, newPreset]
    onChange(updated)
    setSelectedIndex(updated.length - 1)
  }

  const handleRenameStart = (index: number) => {
    setRenamingIndex(index)
    setRenameText(presets[index].name)
  }

  const handleRenameConfirm = (index: number) => {
    const text = renameText.trim()
    if (!text) return
    const updated = [...presets]
    updated[index] = { ...updated[index], name: text }
    onChange(updated)
    setRenamingIndex(null)
  }

  const handleDeleteConfirm = () => {
    if (deleteIndex === null) return
    const updated = presets.filter((_, idx) => idx !== deleteIndex)
    onChange(updated)
    setSelectedIndex(
      Math.max(0, selectedIndex >= updated.length ? updated.length - 1 : selectedIndex)
    )
    setDeleteIndex(null)
  }

  const handleFieldsChange = (fields: HeaderEntry[]) => {
    if (selectedIndex < 0 || selectedIndex >= presets.length) return
    const updated = [...presets]
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      fields: fields.map((f) => ({ key: f.key, value: f.value, enabled: f.enabled })),
    }
    onChange(updated)
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden divide-x divide-border-subtle bg-bg-base">
      {/* Sidebar List */}
      <div className="w-60 flex flex-col shrink-0 bg-bg-panel/40 overflow-y-auto custom-scrollbar p-3 gap-2">
        <span className="text-[10px] font-semibold tracking-wider text-text-secondary uppercase px-2 mb-1">
          Presets
        </span>

        <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          {presets.length === 0 ? (
            <div className="text-xs text-text-muted italic px-2 py-4 select-none">
              No presets defined.
            </div>
          ) : (
            presets.map((preset, idx) => (
              <div
                key={idx}
                className={`group flex items-center justify-between h-8 px-2 rounded cursor-pointer transition-all ${
                  selectedIndex === idx
                    ? 'bg-bg-highlight text-text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-muted/40'
                }`}
                onClick={() => setSelectedIndex(idx)}
              >
                {renamingIndex === idx ? (
                  <input
                    type="text"
                    value={renameText}
                    onChange={(e) => setRenameText(e.target.value)}
                    onBlur={() => handleRenameConfirm(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameConfirm(idx)
                      if (e.key === 'Escape') setRenamingIndex(null)
                    }}
                    autoFocus
                    className="flex-1 bg-bg-surface border border-accent rounded px-1.5 h-6 text-xs text-text-primary outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className="text-xs font-medium truncate flex-grow"
                    onDoubleClick={() => handleRenameStart(idx)}
                  >
                    {preset.name}
                  </span>
                )}

                <div className="hidden group-hover:flex items-center gap-1.5 shrink-0 ml-2">
                  {renamingIndex !== idx && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRenameStart(idx)
                      }}
                      className="text-text-muted hover:text-text-primary p-0.5"
                    >
                      <Icons.Edit size={11} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteIndex(idx)
                    }}
                    className="text-text-muted hover:text-error p-0.5"
                  >
                    <Icons.Trash size={11} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={handleAddPreset}
          className="flex items-center justify-center gap-1.5 h-8 w-full border border-dashed border-border-default hover:border-accent hover:text-accent rounded text-xs font-medium text-text-secondary transition-all"
        >
          <Icons.Plus size={12} />
          Add Preset
        </button>
      </div>

      {/* Detail Pane */}
      <div className="flex-grow overflow-hidden flex flex-col">
        {activePreset ? (
          <div className="flex-grow flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="h-9 border-b border-border-subtle flex items-center px-4 justify-between bg-bg-panel/40 shrink-0 select-none">
              <span className="text-[10px] font-semibold tracking-wider text-text-secondary uppercase">
                Preset Fields: {activePreset.name}
              </span>
            </div>

            {/* Key Value Table */}
            <div className="flex-1 overflow-hidden">
              <KeyValueEditor
                title="Preset Fields"
                entries={activePreset.fields}
                onChange={handleFieldsChange}
                addButtonLabel="Add field"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-sm gap-2 select-none">
            <Icons.Sliders size={24} className="stroke-text-muted/60" />
            <span>Select or create a preset to configure it</span>
          </div>
        )}
      </div>

      <Dialog
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Preset"
        description={`Are you sure you want to delete preset "${
          deleteIndex !== null && presets[deleteIndex] ? presets[deleteIndex].name : ''
        }"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

export default CollectionPresetsTab
