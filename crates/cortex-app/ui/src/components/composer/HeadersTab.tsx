import React, { useMemo } from 'react'
import KeyValueEditor from './KeyValueEditor'
import { useRequestStore } from '../../stores/requestStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useTabs } from '../../contexts/TabsContext'
import { getEffectiveAuth } from './AuthTab'

import type { CollectionItem, Folder } from '../../bindings'

interface HeadersTabProps {
  requestId: string
}

const HeadersTab: React.FC<HeadersTabProps> = ({ requestId }) => {
  const { getRequestState, updateRequest } = useRequestStore()
  const { collections } = useCollectionStore()
  const { tabs } = useTabs()

  const tab = tabs.find((t) => t.id === requestId)
  const requestData = getRequestState(requestId)

  const inheritedAndAuthHeaders = useMemo(() => {
    const headersMap: Record<string, { key: string; value: string; description: string }> = {}

    // Load from Collection & Folders if available
    if (tab && tab.collectionId) {
      const collection = collections[tab.collectionId]
      if (collection) {
        // 1. Load from Collection
        if (collection.manifest?.headers) {
          for (const [k, v] of Object.entries(collection.manifest.headers)) {
            headersMap[k.toLowerCase()] = {
              key: k,
              value: String(v),
              description: 'Inherited from Collection',
            }
          }
        }

        // 2. Load from Folder ancestors
        const requestPath = tab.requestPath || ''
        const colPath = collection.path
        const ancestors: Folder[] = []
        const parts = requestPath.split('/')
        parts.pop() // remove request file

        const findFolderByPath = (items: CollectionItem[], path: string): Folder | null => {
          for (const item of items) {
            if (item.type === 'Folder') {
              if (item.data.path === path) return item.data
              const found = findFolderByPath(item.data.items || [], path)
              if (found) return found
            }
          }
          return null
        }

        let currentPath = parts.join('/')
        while (currentPath.startsWith(colPath) && currentPath !== colPath) {
          const folder = findFolderByPath(collection.items || [], currentPath)
          if (folder) {
            ancestors.unshift(folder) // Parent first, child last
          }
          const p = currentPath.split('/')
          p.pop()
          currentPath = p.join('/')
        }

        for (const folder of ancestors) {
          if (folder.manifest?.headers) {
            for (const [k, v] of Object.entries(folder.manifest.headers)) {
              headersMap[k.toLowerCase()] = {
                key: k,
                value: String(v),
                description: `Inherited from Folder: ${folder.name}`,
              }
            }
          }
        }
      }
    }

    // Convert map to list
    const list = Object.values(headersMap).map((h) => ({
      key: h.key,
      value: h.value,
      description: h.description,
    }))

    // 3. Inject active Auth-managed headers
    const localAuth = requestData?.auth || { type: 'none', config: {} }
    const { auth: effectiveAuth } = getEffectiveAuth(requestId, tabs, collections, localAuth)
    const effectiveConfig = (effectiveAuth.config || {}) as Record<string, string>

    if (effectiveAuth.type === 'bearer_token') {
      const tokenVal = effectiveConfig.token || ''
      const displayVal = tokenVal.includes('{{') ? `Bearer ${tokenVal}` : 'Bearer ••••••••'
      list.push({
        key: 'Authorization',
        value: displayVal,
        description: 'Auth-managed',
      })
    } else if (
      effectiveAuth.type === 'api_key' &&
      (effectiveConfig.addTo === 'header' || !effectiveConfig.addTo)
    ) {
      const keyName = effectiveConfig.key || 'X-API-Key'
      const keyVal = effectiveConfig.value || ''
      const displayVal = keyVal.includes('{{') ? keyVal : '••••••••'
      list.push({
        key: keyName,
        value: displayVal,
        description: 'Auth-managed',
      })
    }

    return list
  }, [tab, collections, tabs, requestData, requestId])

  const presets = useMemo(() => {
    if (tab && tab.collectionId) {
      const collection = collections[tab.collectionId]
      return collection?.manifest?.presets || []
    }
    return []
  }, [tab, collections])

  const handleApplyPreset = (presetFields: { key: string; value: string; enabled: boolean }[]) => {
    const currentHeaders = [...requestData.headers]
    let cleanHeaders = currentHeaders
    if (cleanHeaders.length === 1 && !cleanHeaders[0].key && !cleanHeaders[0].value) {
      cleanHeaders = []
    }
    presetFields.forEach((field) => {
      const idx = cleanHeaders.findIndex((h) => h.key.toLowerCase() === field.key.toLowerCase())
      if (idx !== -1) {
        cleanHeaders[idx] = {
          ...cleanHeaders[idx],
          value: field.value,
          enabled: field.enabled,
        }
      } else {
        cleanHeaders.push({
          key: field.key,
          value: field.value,
          enabled: field.enabled,
        })
      }
    })
    if (cleanHeaders.length === 0) {
      cleanHeaders = [{ key: '', value: '', enabled: true }]
    }
    updateRequest(requestId, { headers: cleanHeaders })
  }

  return (
    <div className="h-full">
      <KeyValueEditor
        title="Headers"
        entries={requestData.headers}
        onChange={(headers) => updateRequest(requestId, { headers })}
        addButtonLabel="Add header"
        readOnlyTitle="Inherited & Auth-managed"
        readOnlyEntries={inheritedAndAuthHeaders}
        isHeaders={true}
        presets={presets}
        onApplyPreset={handleApplyPreset}
      />
    </div>
  )
}

export default HeadersTab
