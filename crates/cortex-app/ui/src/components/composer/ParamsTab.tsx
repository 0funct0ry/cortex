import React, { useMemo } from 'react'
import KeyValueEditor from './KeyValueEditor'
import { useRequestStore } from '../../stores/requestStore'

interface ParamsTabProps {
  requestId: string
}

const ParamsTab: React.FC<ParamsTabProps> = ({ requestId }) => {
  const { getRequestState, updateRequest } = useRequestStore()
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
    }))
  }, [requestData.url])

  return (
    <div className="h-full">
      <KeyValueEditor
        title="Query"
        entries={requestData.params}
        onChange={(params) => updateRequest(requestId, { params })}
        readOnlyTitle="Path"
        readOnlyEntries={pathParams}
        readOnlyTooltip="Path parameters are automatically extracted from the URL"
        caseSensitiveKeys={true}
      />
    </div>
  )
}

export default ParamsTab
