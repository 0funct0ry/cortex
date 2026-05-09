import React from 'react'
import { Button } from './ui/button'
import { FolderOpen, Plus, Settings } from 'lucide-react'

interface WorkspaceHeaderProps {
  name: string
  onOpen: () => void
  onCreate: () => void
  onAddCollection: () => void
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  name,
  onOpen,
  onCreate,
  onAddCollection,
}) => {
  return (
    <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-md border border-slate-800 px-6 py-4 rounded-2xl shadow-xl">
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-emerald-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
          <Settings className="w-5 h-5 text-white animate-pulse-slow" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">{name}</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
            Active Workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpen}
          className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Open
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreate}
          className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          New
        </Button>
        <div className="w-px h-6 bg-slate-800 mx-2" />
        <Button
          size="sm"
          onClick={onAddCollection}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-600/20 px-4 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Collection
        </Button>
      </div>
    </div>
  )
}
