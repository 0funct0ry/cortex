import React from 'react'
import * as Icons from '../ui/Icons'

const EmptyComposerState: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-bg-base select-none animate-in fade-in duration-300">
      <div className="opacity-10 mb-14">
        <Icons.Rocket size={160} strokeWidth={0.5} className="rotate-45" />
      </div>

      <div className="w-full max-w-[380px] space-y-4">
        <div className="flex items-center justify-between group px-4">
          <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors tracking-tight">
            Send Request
          </span>
          <div className="flex items-center bg-bg-surface/40 px-3 py-1 rounded-md border border-border-subtle/20 shadow-sm transition-colors group-hover:bg-bg-surface/60 group-hover:border-border-subtle/40">
            <span className="text-xs font-mono text-text-muted group-hover:text-text-primary">
              Cmd + Enter
            </span>
          </div>
        </div>

        <div className="h-px bg-border-subtle/20 mx-4" />

        <div className="flex items-center justify-between group px-4">
          <div>
            <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors tracking-tight">
              New Request
            </span>
            <p className="text-[11px] text-text-muted mt-0.5">Save to a collection</p>
          </div>
          <div className="flex items-center bg-bg-surface/40 px-3 py-1 rounded-md border border-border-subtle/20 shadow-sm transition-colors group-hover:bg-bg-surface/60 group-hover:border-border-subtle/40">
            <span className="text-xs font-mono text-text-muted group-hover:text-text-primary">
              Cmd + ⇧N
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between group px-4">
          <div>
            <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors tracking-tight">
              New Transient Request
            </span>
            <p className="text-[11px] text-text-muted mt-0.5">Pick protocol, never saved</p>
          </div>
          <div className="flex items-center bg-bg-surface/40 px-3 py-1 rounded-md border border-border-subtle/20 shadow-sm transition-colors group-hover:bg-bg-surface/60 group-hover:border-border-subtle/40">
            <span className="text-xs font-mono text-text-muted group-hover:text-text-primary">
              Cmd + B
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between group px-4">
          <div>
            <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors tracking-tight">
              New Quick Request
            </span>
            <p className="text-[11px] text-text-muted mt-0.5">Instant HTTP GET, never saved</p>
          </div>
          <div className="flex items-center bg-bg-surface/40 px-3 py-1 rounded-md border border-border-subtle/20 shadow-sm transition-colors group-hover:bg-bg-surface/60 group-hover:border-border-subtle/40">
            <span className="text-xs font-mono text-text-muted group-hover:text-text-primary">
              Cmd + N
            </span>
          </div>
        </div>

        <div className="h-px bg-border-subtle/20 mx-4" />

        <div className="flex items-center justify-between group px-4">
          <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors tracking-tight">
            Edit Environments
          </span>
          <div className="flex items-center bg-bg-surface/40 px-3 py-1 rounded-md border border-border-subtle/20 shadow-sm transition-colors group-hover:bg-bg-surface/60 group-hover:border-border-subtle/40">
            <span className="text-xs font-mono text-text-muted group-hover:text-text-primary">
              Cmd + E
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyComposerState
