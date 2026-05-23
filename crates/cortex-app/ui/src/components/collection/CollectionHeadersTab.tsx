import React from 'react'
import * as Icons from '../ui/Icons'
import KeyValueEditor from '../composer/KeyValueEditor'
import type { CollectionDraft } from '../../stores/collectionViewStore'

interface CollectionHeadersTabProps {
  headers: CollectionDraft['headers']
  onChange: (headers: CollectionDraft['headers']) => void
}

const CollectionHeadersTab: React.FC<CollectionHeadersTabProps> = ({ headers, onChange }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="flex items-start gap-2.5 bg-accent/8 border border-accent/20 rounded-md px-3 py-2.5 mx-4 mt-4">
        <Icons.Info size={14} className="text-accent mt-0.5 shrink-0" />
        <p className="text-xs text-text-secondary">
          These headers are sent with every request in this collection unless overridden at the
          request level.
        </p>
      </div>
      <KeyValueEditor
        entries={headers}
        onChange={onChange}
        isHeaders={true}
        title="Default Headers"
        addButtonLabel="Add header"
        namePlaceholder="Header"
        valuePlaceholder="Value"
      />
    </div>
  )
}

export default CollectionHeadersTab
