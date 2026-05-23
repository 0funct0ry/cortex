import React from 'react'
import VariableEditor from '../composer/VariableEditor'
import type { CollectionDraft } from '../../stores/collectionViewStore'
import type { Variable } from '../../bindings'

interface CollectionVarsTabProps {
  variables: CollectionDraft['variables']
  onChange: (variables: Variable[]) => void
}

const CollectionVarsTab: React.FC<CollectionVarsTabProps> = ({ variables, onChange }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <VariableEditor variables={variables} onChange={onChange} title="Collection Variables" />
    </div>
  )
}

export default CollectionVarsTab
