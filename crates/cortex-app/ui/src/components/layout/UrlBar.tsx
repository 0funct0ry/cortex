import React from 'react'
import * as Icons from '../ui/Icons'

const UrlBar: React.FC = () => {
  return (
    <div className="h-10 border-b border-border-subtle flex items-center px-3 gap-3 shrink-0 bg-bg-panel">
      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-method-get/12 text-method-get border border-method-get/20 text-[11px] font-bold uppercase cursor-pointer hover:bg-method-get/20 transition-colors">
        GET
        <Icons.ChevronDown size={10} />
      </div>

      <div className="flex-1 h-7 bg-bg-surface border border-border-default rounded flex items-center px-3 font-mono text-[12px] text-text-primary focus-within:border-accent transition-colors overflow-hidden">
        <span className="text-text-muted select-none mr-1">http://localhost:8080/api/v1/</span>
        <span className="text-text-primary outline-none flex-1 truncate">resource</span>
      </div>

      <button className="h-7 px-4 rounded bg-accent text-accent-fg font-bold text-[11px] hover:bg-accent-hover transition-colors shadow-sm">
        Send
      </button>

      <div className="flex items-center gap-1">
        <button
          title="Code Snippet"
          className="p-1.5 rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors"
        >
          <Icons.MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  )
}

export default UrlBar
