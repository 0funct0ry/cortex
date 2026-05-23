import React, { useState } from 'react'
import * as Icons from '../ui/Icons'
import CodeEditor from '../ui/CodeEditor'
import type { CollectionDraft } from '../../stores/collectionViewStore'

interface CollectionScriptTabProps {
  scripts: CollectionDraft['scripts']
  onChange: (scripts: CollectionDraft['scripts']) => void
}

const CollectionScriptTab: React.FC<CollectionScriptTabProps> = ({ scripts, onChange }) => {
  const [activeSubTab, setActiveSubTab] = useState<'pre' | 'post'>('pre')

  return (
    <div className="flex flex-col h-full">
      {/* Sub-tab bar */}
      <div className="flex items-center gap-0 border-b border-border-subtle px-4 shrink-0">
        {(['pre', 'post'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
              activeSubTab === tab
                ? 'text-text-primary border-accent'
                : 'text-text-muted border-transparent hover:text-text-secondary'
            }`}
          >
            {tab === 'pre' ? 'Pre-request' : 'Post-response'}
          </button>
        ))}

        {/* Run button (stubbed) */}
        <div className="ml-auto pb-1">
          <button
            disabled
            title="Script execution coming in a future release"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-bg-muted text-text-muted cursor-not-allowed select-none"
          >
            <Icons.Play size={12} />
            Run
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor
          value={activeSubTab === 'pre' ? scripts.pre : scripts.post}
          onChange={(val) =>
            onChange(activeSubTab === 'pre' ? { ...scripts, pre: val } : { ...scripts, post: val })
          }
          language="javascript"
        />
      </div>

      {/* Footer note */}
      <div className="shrink-0 px-4 py-2 border-t border-border-subtle bg-bg-panel/40">
        <p className="text-xs text-text-muted">
          Scripts defined here run for every request in the collection, in addition to any
          request-level scripts.
        </p>
      </div>
    </div>
  )
}

export default CollectionScriptTab
