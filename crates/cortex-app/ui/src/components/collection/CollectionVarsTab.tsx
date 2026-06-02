import React from 'react'
import VariableEditor from '../composer/VariableEditor'
import * as Icons from '../ui/Icons'
import type { CollectionDraft } from '../../stores/collectionViewStore'
import type { Variable } from '../../bindings'

interface CollectionVarsTabProps {
  variables: CollectionDraft['variables']
  onChange: (variables: Variable[]) => void
}

const CollectionVarsTab: React.FC<CollectionVarsTabProps> = ({ variables, onChange }) => {
  const redactedCount =
    variables?.filter((v) => v.secret && typeof v.value === 'string' && v.value === '__REDACTED__')
      .length ?? 0

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {redactedCount > 0 && (
        <div className="mx-4 mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">
          <Icons.AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            <span className="font-semibold">
              {redactedCount} secret variable{redactedCount !== 1 ? 's' : ''}
            </span>{' '}
            were redacted in this export. Fill in their values below.
          </p>
        </div>
      )}
      <VariableEditor variables={variables} onChange={onChange} title="Collection Variables" />
    </div>
  )
}

export default CollectionVarsTab
