import React from 'react'
import CodeEditor from '../ui/CodeEditor'
import KeyValueEditor from './KeyValueEditor'
import { useRequestStore } from '../../stores/requestStore'
import * as Icons from '../ui/Icons'

interface BodyTabProps {
  requestId: string
}

const BODY_TYPES = [
  { id: 'none', label: 'None' },
  { id: 'json', label: 'JSON' },
  { id: 'xml', label: 'XML' },
  { id: 'text', label: 'Text' },
  { id: 'graphql', label: 'GraphQL' },
  { id: 'form-data', label: 'Form-Data' },
  { id: 'multipart', label: 'Multipart' },
  { id: 'binary', label: 'Binary' },
]

const BodyTab: React.FC<BodyTabProps> = ({ requestId }) => {
  const { getRequestState, updateRequest } = useRequestStore()
  const requestData = getRequestState(requestId)
  const body = requestData.body

  const handleTypeChange = (type: string) => {
    updateRequest(requestId, { body: { ...body, type } })
  }

  const handlePrettify = () => {
    if (body.type === 'json' && body.text) {
      try {
        const parsed = JSON.parse(body.text)
        const prettified = JSON.stringify(parsed, null, 2)
        updateRequest(requestId, { body: { ...body, text: prettified } })
      } catch (e) {
        console.error('Failed to prettify JSON', e)
      }
    }
  }

  const renderContent = () => {
    switch (body.type) {
      case 'none':
        return (
          <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
            This request does not have a body
          </div>
        )
      case 'json':
      case 'xml':
      case 'text':
      case 'graphql':
        return (
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={body.text}
              onChange={(text) => updateRequest(requestId, { body: { ...body, text } })}
              language={body.type === 'json' ? 'json' : body.type === 'xml' ? 'xml' : 'text'}
              autoFocus
            />
          </div>
        )
      case 'form-data':
      case 'multipart':
        return (
          <div className="flex-1 overflow-y-auto">
            <KeyValueEditor
              title={body.type === 'form-data' ? 'Form Data' : 'Multipart'}
              entries={body.form}
              onChange={(form) => updateRequest(requestId, { body: { ...body, form } })}
            />
          </div>
        )
      case 'binary':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 bg-bg-muted rounded-full flex items-center justify-center text-text-muted mb-4">
              <Icons.File size={32} />
            </div>
            <button className="px-4 py-2 bg-bg-surface border border-border-default rounded-md text-sm hover:border-accent transition-colors">
              Select File
            </button>
            {body.file && <div className="mt-4 text-xs text-text-muted">Selected: {body.file}</div>}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-8 border-b border-border-subtle flex items-center px-4 gap-4 shrink-0 bg-bg-panel/50">
        <select
          value={body.type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer"
        >
          {BODY_TYPES.map((t) => (
            <option key={t.id} value={t.id} className="bg-bg-overlay">
              {t.label}
            </option>
          ))}
        </select>

        {(body.type === 'json' || body.type === 'xml') && (
          <button
            onClick={handlePrettify}
            className="text-[11px] text-text-link hover:underline uppercase font-medium tracking-wider"
          >
            Prettify
          </button>
        )}
      </div>
      {renderContent()}
    </div>
  )
}

export default BodyTab
