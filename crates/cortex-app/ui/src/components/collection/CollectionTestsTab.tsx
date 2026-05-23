import React from 'react'
import * as Icons from '../ui/Icons'
import CodeEditor from '../ui/CodeEditor'
import type { CollectionDraft } from '../../stores/collectionViewStore'

interface CollectionTestsTabProps {
  tests: CollectionDraft['tests']
  onChange: (tests: string) => void
}

const CollectionTestsTab: React.FC<CollectionTestsTabProps> = ({ tests, onChange }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor value={tests} onChange={onChange} language="javascript" />
      </div>

      {/* Last run results (placeholder) */}
      <div className="shrink-0 border-t border-border-subtle">
        <div className="px-4 py-2 flex items-center gap-2 bg-bg-panel/40">
          <Icons.Check size={13} className="text-text-muted" />
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Last Run Results
          </span>
        </div>
        <div className="px-4 pb-3">
          <p className="text-xs text-text-muted italic">No test runs yet.</p>
        </div>
      </div>
    </div>
  )
}

export default CollectionTestsTab
