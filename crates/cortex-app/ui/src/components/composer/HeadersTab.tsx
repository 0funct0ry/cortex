import React, { useMemo } from 'react'
import KeyValueEditor from './KeyValueEditor'
import { useRequestStore } from '../../stores/requestStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useTabs } from '../../contexts/TabsContext'
import type { HeaderEntry } from '../../bindings'

interface HeadersTabProps {
  requestId: string
}

const HeadersTab: React.FC<HeadersTabProps> = ({ requestId }) => {
  const { getRequestState, updateRequest } = useRequestStore()
  const { collections } = useCollectionStore()
  const { tabs } = useTabs()

  const tab = tabs.find((t) => t.id === requestId)
  const requestData = getRequestState(requestId)

  const [isBulkEdit, setIsBulkEdit] = React.useState(false)

  const inheritedHeaders = useMemo(() => {
    if (!tab || !tab.collectionId) return []
    const collection = collections[tab.collectionId]
    if (!collection || !collection.manifest.headers) return []

    return Object.entries(collection.manifest.headers).map(([key, value]) => ({
      key,
      value: String(value),
    }))
  }, [tab, collections])

  const handleBulkChange = (value: string) => {
    const lines = value.split('\n')
    const newHeaders: HeaderEntry[] = lines
      .map((line) => {
        const colonIndex = line.indexOf(':')
        if (colonIndex === -1) {
          const key = line.trim()
          if (!key) return null
          return { key, value: '', enabled: true }
        }
        const key = line.slice(0, colonIndex).trim()
        const value = line.slice(colonIndex + 1).trim()
        if (!key && !value) return null
        return { key, value, enabled: true }
      })
      .filter((h): h is HeaderEntry => h !== null)

    updateRequest(requestId, { headers: newHeaders })
  }

  return (
    <div className="h-full">
      <KeyValueEditor
        title="Headers"
        entries={requestData.headers}
        onChange={(headers) => updateRequest(requestId, { headers })}
        isBulkEdit={isBulkEdit}
        onToggleBulkEdit={() => setIsBulkEdit(!isBulkEdit)}
        onBulkEditChange={handleBulkChange}
        addButtonLabel="Add header"
        readOnlyTitle="Inherited"
        readOnlyEntries={inheritedHeaders}
      />
    </div>
  )
}

export default HeadersTab
