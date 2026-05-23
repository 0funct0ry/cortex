import React, { useMemo } from 'react'
import KeyValueEditor from './KeyValueEditor'
import { useRequestStore } from '../../stores/requestStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useTabs } from '../../contexts/TabsContext'
import { getEffectiveAuth } from './AuthTab'

interface ParamsTabProps {
  requestId: string
}

const ParamsTab: React.FC<ParamsTabProps> = ({ requestId }) => {
  const { getRequestState, updateRequest } = useRequestStore()
  const { collections } = useCollectionStore()
  const { tabs } = useTabs()

  const requestData = getRequestState(requestId)

  const pathParams = useMemo(() => {
    const url = requestData.url || ''

    // Strip protocol
    let urlWithoutProtocol = url
    const protocolMatch = url.match(/^[a-zA-Z]+:\/\//)
    if (protocolMatch) {
      urlWithoutProtocol = url.slice(protocolMatch[0].length)
    }

    // Extract path part (everything after the first single slash, before query parameters)
    const firstSlashIndex = urlWithoutProtocol.indexOf('/')
    if (firstSlashIndex === -1) return []

    let pathPart = urlWithoutProtocol.slice(firstSlashIndex)
    const queryIndex = pathPart.indexOf('?')
    if (queryIndex !== -1) {
      pathPart = pathPart.slice(0, queryIndex)
    }

    const matches = pathPart.match(/:[a-zA-Z0-9_]+|\{[a-zA-Z0-9_]+\}/g)
    if (!matches) return []

    // Deduplicate and clean up
    return Array.from(new Set(matches)).map((m) => ({
      key: m.startsWith(':') ? m.slice(1) : m.slice(1, -1),
      value: '',
      description: 'Path parameter',
    }))
  }, [requestData.url])

  const authParams = useMemo(() => {
    const localAuth = requestData?.auth || { type: 'none', config: {} }
    const { auth: effectiveAuth } = getEffectiveAuth(requestId, tabs, collections, localAuth)
    const effectiveConfig = (effectiveAuth.config || {}) as Record<string, string>

    if (effectiveAuth.type === 'api_key' && effectiveConfig.addTo === 'query') {
      const keyName = effectiveConfig.key || 'api_key'
      const keyVal = effectiveConfig.value || ''
      const displayVal = keyVal.includes('{{') ? keyVal : '••••••••'
      return [
        {
          key: keyName,
          value: displayVal,
          description: 'Auth-managed',
        },
      ]
    }

    return []
  }, [requestId, tabs, collections, requestData])

  const combinedReadOnly = useMemo(() => {
    return [...pathParams, ...authParams]
  }, [pathParams, authParams])

  const tab = tabs.find((t) => t.id === requestId)

  const presets = useMemo(() => {
    if (tab && tab.collectionId) {
      const collection = collections[tab.collectionId]
      return collection?.manifest?.presets || []
    }
    return []
  }, [tab, collections])

  const handleApplyPreset = (presetFields: { key: string; value: string; enabled: boolean }[]) => {
    const currentParams = [...requestData.params]
    let cleanParams = currentParams
    if (cleanParams.length === 1 && !cleanParams[0].key && !cleanParams[0].value) {
      cleanParams = []
    }
    presetFields.forEach((field) => {
      const idx = cleanParams.findIndex((p) => p.key === field.key)
      if (idx !== -1) {
        cleanParams[idx] = {
          ...cleanParams[idx],
          value: field.value,
          enabled: field.enabled,
        }
      } else {
        cleanParams.push({
          key: field.key,
          value: field.value,
          enabled: field.enabled,
        })
      }
    })
    if (cleanParams.length === 0) {
      cleanParams = [{ key: '', value: '', enabled: true }]
    }
    updateRequest(requestId, { params: cleanParams })
  }

  return (
    <div className="h-full">
      <KeyValueEditor
        title="Query"
        entries={requestData.params}
        onChange={(params) => updateRequest(requestId, { params })}
        readOnlyTitle="Path & Auth-managed"
        readOnlyEntries={combinedReadOnly}
        readOnlyTooltip="Path parameters are parsed from the URL. Auth parameters are configured in the Auth tab."
        caseSensitiveKeys={true}
        presets={presets}
        onApplyPreset={handleApplyPreset}
      />
    </div>
  )
}

export default ParamsTab
