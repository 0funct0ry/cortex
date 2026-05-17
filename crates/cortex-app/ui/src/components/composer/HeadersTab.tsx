import React, { useMemo } from 'react'
import KeyValueEditor from './KeyValueEditor'
import { useRequestStore } from '../../stores/requestStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useTabs } from '../../contexts/TabsContext'

interface HeadersTabProps {
  requestId: string
}

const HeadersTab: React.FC<HeadersTabProps> = ({ requestId }) => {
  const { getRequestState, updateRequest } = useRequestStore()
  const { collections } = useCollectionStore()
  const { tabs } = useTabs()

  const tab = tabs.find((t) => t.id === requestId)
  const requestData = getRequestState(requestId)

  const inheritedHeaders = useMemo(() => {
    if (!tab || !tab.collectionId) return []
    const collection = collections[tab.collectionId]
    if (!collection || !collection.manifest.headers) return []

    return Object.entries(collection.manifest.headers).map(([key, value]) => ({
      key,
      value: String(value),
    }))
  }, [tab, collections])

  return (
    <div className="h-full">
      <KeyValueEditor
        title="Headers"
        entries={requestData.headers}
        onChange={(headers) => updateRequest(requestId, { headers })}
        addButtonLabel="Add header"
        readOnlyTitle="Inherited"
        readOnlyEntries={inheritedHeaders}
        isHeaders={true}
      />
    </div>
  )
}

export default HeadersTab
