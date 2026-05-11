import React, { useState } from 'react'
import { commands, type CollectionItem, type RequestFileWrapper } from '../bindings'
import {
  Folder as FolderIcon,
  FileText,
  Trash2,
  Edit2,
  AlertCircle,
  Plus,
  X,
  Check,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Mini modal primitives (no external deps)
// ---------------------------------------------------------------------------

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-sm mx-4 p-5 space-y-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  </div>
)

// ---------------------------------------------------------------------------
// Dialog state types
// ---------------------------------------------------------------------------

type DialogState =
  | { kind: 'none' }
  | { kind: 'create'; parentPath: string }
  | { kind: 'rename'; itemPath: string; currentName: string }
  | { kind: 'delete'; itemPath: string; itemName: string }

// ---------------------------------------------------------------------------
// Dialog components
// ---------------------------------------------------------------------------

interface CreateDialogProps {
  onConfirm: (name: string) => void
  onClose: () => void
}

const CreateDialog: React.FC<CreateDialogProps> = ({ onConfirm, onClose }) => {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onConfirm(trimmed)
  }

  return (
    <Modal title="New Request" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            Request Name
          </label>
          <input
            autoFocus
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
            placeholder="e.g. get-users"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            <Plus className="w-3 h-3" /> Create
          </button>
        </div>
      </form>
    </Modal>
  )
}

interface RenameDialogProps {
  currentName: string
  onConfirm: (newName: string) => void
  onClose: () => void
}

const RenameDialog: React.FC<RenameDialogProps> = ({ currentName, onConfirm, onClose }) => {
  const [name, setName] = useState(currentName)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onConfirm(trimmed)
  }

  return (
    <Modal title="Rename" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            New Name
          </label>
          <input
            autoFocus
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            <Check className="w-3 h-3" /> Rename
          </button>
        </div>
      </form>
    </Modal>
  )
}

interface DeleteDialogProps {
  itemName: string
  onConfirm: () => void
  onClose: () => void
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ itemName, onConfirm, onClose }) => (
  <Modal title="Move to Trash" onClose={onClose}>
    <p className="text-sm text-slate-300">
      Are you sure you want to move <span className="font-semibold text-white">"{itemName}"</span>{' '}
      to the Trash?
    </p>
    <p className="text-xs text-slate-500">This action can be undone from your system Trash.</p>
    <div className="flex gap-2 justify-end pt-1">
      <button
        onClick={onClose}
        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-md transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors"
      >
        <Trash2 className="w-3 h-3" /> Move to Trash
      </button>
    </div>
  </Modal>
)

// ---------------------------------------------------------------------------
// Error toast
// ---------------------------------------------------------------------------

interface ErrorToastProps {
  message: string
  onClose: () => void
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-900/90 border border-red-700 text-red-200 text-xs px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm max-w-sm">
    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="text-red-400 hover:text-white">
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
)

export const SuccessToast: React.FC<ErrorToastProps> = ({ message, onClose }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-emerald-900/90 border border-emerald-700 text-emerald-200 text-xs px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm max-w-sm">
    <Check className="w-4 h-4 shrink-0 text-emerald-400" />
    <span className="flex-1">{message}</span>
    <button onClick={onClose} className="text-emerald-400 hover:text-white">
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
)

// ---------------------------------------------------------------------------
// Main CollectionExplorer
// ---------------------------------------------------------------------------

interface CollectionExplorerProps {
  rootPath: string
  items: CollectionItem[]
  onRefresh: () => void
  onSelectRequest?: (req: RequestFileWrapper) => void
}

export const CollectionExplorer: React.FC<CollectionExplorerProps> = ({
  rootPath,
  items,
  onRefresh,
  onSelectRequest,
}) => {
  const [dialog, setDialog] = useState<DialogState>({ kind: 'none' })
  const [error, setError] = useState<string | null>(null)

  const closeDialog = () => setDialog({ kind: 'none' })

  const handleCreate = async (name: string) => {
    const state = dialog
    if (state.kind !== 'create') return
    closeDialog()
    try {
      const res = await commands.createRequest(name, state.parentPath)
      if (res.status === 'ok') {
        onRefresh()
      } else {
        setError(`Create failed: ${res.error}`)
      }
    } catch (e) {
      setError(`IPC Error: ${e}`)
    }
  }

  const handleRename = async (newName: string) => {
    const state = dialog
    if (state.kind !== 'rename') return
    closeDialog()
    try {
      const res = await commands.renameItem(state.itemPath, newName)
      if (res.status === 'ok') {
        onRefresh()
      } else {
        setError(`Rename failed: ${res.error}`)
      }
    } catch (e) {
      setError(`IPC Error: ${e}`)
    }
  }

  const handleDelete = async () => {
    const state = dialog
    if (state.kind !== 'delete') return
    closeDialog()
    try {
      const res = await commands.deleteItem(state.itemPath)
      if (res.status === 'ok') {
        onRefresh()
      } else {
        setError(`Delete failed: ${res.error}`)
      }
    } catch (e) {
      setError(`IPC Error: ${e}`)
    }
  }

  return (
    <>
      {/* Dialogs */}
      {dialog.kind === 'create' && <CreateDialog onConfirm={handleCreate} onClose={closeDialog} />}
      {dialog.kind === 'rename' && (
        <RenameDialog
          currentName={dialog.currentName}
          onConfirm={handleRename}
          onClose={closeDialog}
        />
      )}
      {dialog.kind === 'delete' && (
        <DeleteDialog itemName={dialog.itemName} onConfirm={handleDelete} onClose={closeDialog} />
      )}

      {/* Error toast */}
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}

      {/* Explorer tree */}
      <div className="space-y-1">
        <div className="flex items-center justify-end mb-2 pb-2 border-b border-slate-800/50 px-2">
          <button
            onClick={() => setDialog({ kind: 'create', parentPath: rootPath })}
            className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition-colors cursor-pointer p-1 rounded hover:bg-slate-800/50"
          >
            <Plus className="w-3 h-3" /> New Request
          </button>
        </div>

        {items.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-slate-600 italic">Empty collection</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <ItemNode key={idx} item={item} onSetDialog={setDialog} onSelect={onSelectRequest} />
          ))
        )}
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// ItemNode — tree node renderer
// ---------------------------------------------------------------------------

interface ItemNodeProps {
  item: CollectionItem
  onSetDialog: (d: DialogState) => void
  onSelect?: (req: RequestFileWrapper) => void
}

const ItemNode: React.FC<ItemNodeProps> = ({ item, onSetDialog, onSelect }) => {
  const [isOpen, setIsOpen] = useState(true)

  if (item.type === 'Folder') {
    const folder = item.data
    return (
      <div className="space-y-1">
        <div
          className="flex items-center justify-between group px-2 py-1 hover:bg-slate-800/50 rounded-md transition-colors cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <FolderIcon
              className={`w-3.5 h-3.5 ${isOpen ? 'text-emerald-400' : 'text-slate-500'} pointer-events-none`}
            />
            <span className="text-xs font-medium text-slate-300 pointer-events-none">
              {folder.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSetDialog({ kind: 'create', parentPath: folder.path })
              }}
              className="p-1.5 text-slate-500 hover:text-emerald-400 rounded hover:bg-slate-700 transition-colors"
              title="New Request"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSetDialog({ kind: 'rename', itemPath: folder.path, currentName: folder.name })
              }}
              className="p-1.5 text-slate-500 hover:text-blue-400 rounded hover:bg-slate-700 transition-colors"
              title="Rename"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSetDialog({ kind: 'delete', itemPath: folder.path, itemName: folder.name })
              }}
              className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-slate-700 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="pl-3 border-l border-slate-800/50 ml-3.5 space-y-1 mt-1">
            {folder.items.map((child, idx) => (
              <ItemNode key={idx} item={child} onSetDialog={onSetDialog} onSelect={onSelect} />
            ))}
            {folder.items.length === 0 && (
              <span className="text-[10px] text-slate-600 italic px-2">Empty folder</span>
            )}
          </div>
        )}
      </div>
    )
  } else {
    const req = item.data
    return (
      <div
        className="flex items-center justify-between group px-2 py-1 hover:bg-slate-800/50 rounded-md transition-colors cursor-pointer"
        onClick={() => onSelect?.(req)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {req.error ? (
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-blue-500/70 shrink-0" />
          )}
          <div className="flex flex-col min-w-0">
            <span className={`text-xs truncate ${req.error ? 'text-red-400' : 'text-slate-300'}`}>
              {req.name}
            </span>
            {req.error && (
              <span className="text-[9px] text-red-500/70 truncate font-mono">{req.error}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              onSetDialog({ kind: 'rename', itemPath: req.path, currentName: req.name })
            }
            className="p-1.5 text-slate-500 hover:text-blue-400 rounded hover:bg-slate-700 transition-colors"
            title="Rename"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSetDialog({ kind: 'delete', itemPath: req.path, itemName: req.name })}
            className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-slate-700 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }
}
