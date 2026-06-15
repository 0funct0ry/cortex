import React, { useMemo, useState, useEffect, useRef } from 'react'
import CodeEditor from '../ui/CodeEditor'
import KeyValueEditor from './KeyValueEditor'
import FormDataEditor from './FormDataEditor'
import { useRequestStore } from '../../stores/requestStore'
import { useTabs } from '../../contexts/TabsContext'
import * as Icons from '../ui/Icons'
import { commands } from '../../bindings'

interface BodyTabProps {
  requestId: string
}

const RAW_SUBTYPES = [
  { id: 'text', label: 'Text' },
  { id: 'html', label: 'HTML' },
  { id: 'xml', label: 'XML' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'other', label: 'Other' },
]

function normalizeJson5(raw: string): { normalized: string; wasNormalized: boolean } {
  const cleaned = raw
    // Remove single line comments
    .replace(/\/\/.*/g, '')
    // Remove multi line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove trailing commas before closing braces/brackets
    .replace(/,(\s*[}\]])/g, '$1')

  const wasNormalized = cleaned.trim() !== raw.trim()
  return { normalized: cleaned, wasNormalized }
}

const getContentTypeForBodyType = (type: string, rawSubtype?: string) => {
  switch (type) {
    case 'json':
      return 'application/json'
    case 'form-data':
      return 'multipart/form-data'
    case 'url-encoded':
      return 'application/x-www-form-urlencoded'
    case 'raw':
      switch (rawSubtype) {
        case 'html':
          return 'text/html'
        case 'xml':
          return 'application/xml'
        case 'javascript':
          return 'application/javascript'
        default:
          return 'text/plain'
      }
    case 'file':
      return 'application/octet-stream'
    default:
      return null
  }
}

const BodyTab: React.FC<BodyTabProps> = ({ requestId }) => {
  const { getRequestState, updateRequest } = useRequestStore()
  const { activeTabId } = useTabs()
  const resolvedVariables = useRequestStore((s) =>
    activeTabId ? s.resolvedVariables[activeTabId] : undefined
  )
  const requestData = getRequestState(requestId)
  const body = requestData.body

  // Local state
  const [normalizationNotice, setNormalizationNotice] = useState<string | null>(null)
  const [wordWrap, setWordWrap] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const handleTypeChange = (newType: string) => {
    const oldDefaultCt = getContentTypeForBodyType(body.type, body.rawSubtype)
    const newDefaultCt = getContentTypeForBodyType(newType, body.rawSubtype)

    let updatedHeaders = [...requestData.headers]

    // Remove old auto Content-Type
    if (oldDefaultCt) {
      updatedHeaders = updatedHeaders.filter(
        (h) =>
          !(
            h.key.toLowerCase() === 'content-type' &&
            h.value.toLowerCase() === oldDefaultCt.toLowerCase()
          )
      )
    }

    // Set new default Content-Type if it is not 'none' and there's no manual custom override
    if (newType !== 'none' && newDefaultCt) {
      const hasCt = updatedHeaders.some((h) => h.key.toLowerCase() === 'content-type')
      if (!hasCt) {
        updatedHeaders.push({
          key: 'Content-Type',
          value: newDefaultCt,
          enabled: true,
        })
      }
    }

    updateRequest(requestId, {
      headers: updatedHeaders,
      body: {
        ...body,
        type: newType as 'none' | 'json' | 'form-data' | 'url-encoded' | 'raw' | 'file',
      },
    })
    setDropdownOpen(false)
  }

  const handleRawSubtypeChange = (newSubtype: string) => {
    const oldDefaultCt = getContentTypeForBodyType('raw', body.rawSubtype)
    const newDefaultCt = getContentTypeForBodyType('raw', newSubtype)

    let updatedHeaders = [...requestData.headers]

    if (oldDefaultCt) {
      updatedHeaders = updatedHeaders.filter(
        (h) =>
          !(
            h.key.toLowerCase() === 'content-type' &&
            h.value.toLowerCase() === oldDefaultCt.toLowerCase()
          )
      )
    }

    if (newDefaultCt) {
      const hasCt = updatedHeaders.some((h) => h.key.toLowerCase() === 'content-type')
      if (!hasCt) {
        updatedHeaders.push({
          key: 'Content-Type',
          value: newDefaultCt,
          enabled: true,
        })
      }
    }

    updateRequest(requestId, {
      headers: updatedHeaders,
      body: {
        ...body,
        rawSubtype: newSubtype as 'text' | 'html' | 'xml' | 'javascript' | 'other',
      },
    })
  }

  const handleJsonPrettify = () => {
    if (!body.json) return
    const { normalized, wasNormalized } = normalizeJson5(body.json)
    try {
      const parsed = JSON.parse(normalized)
      const prettified = JSON.stringify(parsed, null, 2)
      updateRequest(requestId, { body: { ...body, json: prettified } })
      if (wasNormalized) {
        setNormalizationNotice('JSON5 comments & trailing commas normalized to strict JSON')
        setTimeout(() => setNormalizationNotice(null), 4000)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleJsonMinify = () => {
    if (!body.json) return
    const { normalized, wasNormalized } = normalizeJson5(body.json)
    try {
      const parsed = JSON.parse(normalized)
      const minified = JSON.stringify(parsed)
      updateRequest(requestId, { body: { ...body, json: minified } })
      if (wasNormalized) {
        setNormalizationNotice('JSON5 comments & trailing commas normalized to strict JSON')
        setTimeout(() => setNormalizationNotice(null), 4000)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handlePickBinaryFile = async () => {
    try {
      const selected = await commands.pickFile('Select Binary Body File', 'All Files', '*')
      if (selected && selected.status === 'ok' && selected.data) {
        updateRequest(requestId, { body: { ...body, filePath: selected.data } })
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Count indicators for active format options
  const hasJsonContent = !!(body.json && body.json.trim() !== '')
  const hasFormDataContent = !!(
    body.formFields && body.formFields.some((f) => f.key.trim() || f.value.trim() || f.filePath)
  )
  const hasUrlEncodedContent = !!(
    body.urlEncodedFields && body.urlEncodedFields.some((f) => f.key.trim() || f.value.trim())
  )
  const hasRawContent = !!(body.rawText && body.rawText.trim() !== '')
  const hasFileContent = !!(body.filePath && body.filePath.trim() !== '')

  const currentLabel = useMemo(() => {
    switch (body.type) {
      case 'none':
        return 'No Body'
      case 'json':
        return 'JSON'
      case 'form-data':
        return 'Multipart Form'
      case 'url-encoded':
        return 'Form URL Encoded'
      case 'raw':
        return 'Raw'
      case 'file':
        return 'File / Binary'
      default:
        return 'No Body'
    }
  }, [body.type])

  const renderContent = () => {
    switch (body.type) {
      case 'none':
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-sm gap-2 select-none">
            <Icons.Info size={24} className="stroke-text-muted/60" />
            <span>This request does not have a body</span>
          </div>
        )

      case 'json':
        return (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div className="h-9 border-b border-border-subtle flex items-center justify-between px-4 shrink-0 bg-bg-panel/40">
              <span className="text-[10px] font-semibold tracking-wider text-text-secondary uppercase">
                JSON Editor
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleJsonPrettify}
                  className="px-2 py-0.5 bg-bg-panel border border-border-default hover:border-accent hover:text-text-primary text-[10px] font-semibold uppercase tracking-wider rounded-sm text-text-secondary transition-all"
                  title="Format JSON with indentations"
                >
                  Prettify
                </button>
                <button
                  onClick={handleJsonMinify}
                  className="px-2 py-0.5 bg-bg-panel border border-border-default hover:border-accent hover:text-text-primary text-[10px] font-semibold uppercase tracking-wider rounded-sm text-text-secondary transition-all"
                  title="Minify JSON spacing"
                >
                  Minify
                </button>
              </div>
            </div>

            {normalizationNotice && (
              <div className="bg-success-muted/10 border-b border-success-muted/20 px-4 py-1.5 text-xs text-success flex items-center gap-1.5 select-none shrink-0 font-medium animate-fadeIn">
                <Icons.Check size={12} className="stroke-success" />
                {normalizationNotice}
              </div>
            )}

            <div className="flex-grow overflow-hidden">
              <CodeEditor
                value={body.json}
                onChange={(val) => updateRequest(requestId, { body: { ...body, json: val } })}
                language="json"
                autoFocus
                resolvedVariables={resolvedVariables}
              />
            </div>
          </div>
        )

      case 'form-data':
        return (
          <div className="flex-1 overflow-hidden">
            <FormDataEditor
              fields={body.formFields}
              onChange={(fields) =>
                updateRequest(requestId, { body: { ...body, formFields: fields } })
              }
            />
          </div>
        )

      case 'url-encoded':
        return (
          <div className="flex-1 overflow-hidden">
            <KeyValueEditor
              title="URL-Encoded Parameters"
              entries={body.urlEncodedFields}
              onChange={(fields) =>
                updateRequest(requestId, { body: { ...body, urlEncodedFields: fields } })
              }
              namePlaceholder="Key"
              valuePlaceholder="Value"
              addButtonLabel="Add parameter"
            />
          </div>
        )

      case 'raw': {
        const rawSubtype = body.rawSubtype || 'text'
        const byteCount = new Blob([body.rawText]).size
        const charCount = body.rawText.length

        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-9 border-b border-border-subtle flex items-center justify-between px-4 shrink-0 bg-bg-panel/40">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold tracking-wider text-text-secondary uppercase select-none">
                  Raw Subtype:
                </span>
                <select
                  value={rawSubtype}
                  onChange={(e) => handleRawSubtypeChange(e.target.value)}
                  className="bg-bg-surface text-xs text-text-primary border border-border-default focus:border-border-strong rounded-sm focus:outline-none py-0.5 px-1.5 cursor-pointer"
                >
                  {RAW_SUBTYPES.map((t) => (
                    <option key={t.id} value={t.id} className="bg-bg-overlay">
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setWordWrap(!wordWrap)}
                className={`px-2 py-1 border rounded-sm text-[10px] font-semibold uppercase tracking-wider transition-all ${
                  wordWrap
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-default bg-bg-panel text-text-secondary hover:border-accent hover:text-text-primary'
                }`}
              >
                Wrap Lines
              </button>
            </div>

            <div className="flex-grow overflow-hidden">
              <CodeEditor
                value={body.rawText}
                onChange={(val) => updateRequest(requestId, { body: { ...body, rawText: val } })}
                language={
                  rawSubtype === 'javascript' ? 'javascript' : rawSubtype === 'xml' ? 'xml' : 'text'
                }
                wordWrap={wordWrap}
                autoFocus
                resolvedVariables={resolvedVariables}
              />
            </div>

            {/* Bytes and Characters counter footer */}
            <div className="h-6 border-t border-border-subtle bg-bg-panel flex items-center justify-end px-4 text-[10px] text-text-muted gap-4 font-mono select-none">
              <span>{charCount} chars</span>
              <span>{byteCount} bytes</span>
            </div>
          </div>
        )
      }

      case 'file': {
        const filePath = body.filePath || ''
        const parts = filePath.split(/[/\\]/)
        const fileName = parts[parts.length - 1] || 'file'
        const fileExt = fileName.split('.').pop()?.toLowerCase() || ''
        const fileMime =
          fileExt === 'json'
            ? 'application/json'
            : fileExt === 'xml'
              ? 'application/xml'
              : fileExt === 'png'
                ? 'image/png'
                : fileExt === 'jpg' || fileExt === 'jpeg'
                  ? 'image/jpeg'
                  : 'application/octet-stream'

        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-bg-surface font-sans">
            <div className="max-w-md w-full bg-bg-panel border border-border-subtle rounded-md p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-bg-muted rounded-full flex items-center justify-center text-text-muted mb-4 border border-border-subtle">
                <Icons.File size={22} />
              </div>

              <h3 className="text-sm font-semibold text-text-primary mb-1">Binary File Body</h3>
              <p className="text-xs text-text-muted mb-4 max-w-[280px]">
                Select a file to stream directly as the request body. Placeholders will not be
                resolved in the binary stream.
              </p>

              {/* Path Display */}
              {body.filePath ? (
                <div className="w-full bg-bg-surface border border-border-subtle rounded-sm p-3 mb-4 text-left font-mono">
                  <div
                    className="text-xs font-semibold text-text-primary truncate"
                    title={body.filePath || undefined}
                  >
                    {fileName}
                  </div>
                  <div className="text-[10px] text-text-muted truncate mt-1">
                    Path: {body.filePath}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 select-none">
                    <span className="px-1 py-0.5 bg-bg-muted border border-border-subtle rounded-sm text-[9px] text-text-muted">
                      {fileExt.toUpperCase() || 'UNKNOWN'}
                    </span>
                    <span className="px-1 py-0.5 bg-bg-muted border border-border-subtle rounded-sm text-[9px] text-text-muted">
                      {fileMime}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full py-4 border border-dashed border-border-default rounded-sm text-xs text-text-muted italic mb-4">
                  No file selected
                </div>
              )}

              {/* Filter selection inputs */}
              <div className="w-full flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider shrink-0 select-none">
                  Filter:
                </span>
                <input
                  type="text"
                  placeholder="e.g. *.json, *.bin"
                  value={body.fileFilter}
                  onChange={(e) =>
                    updateRequest(requestId, { body: { ...body, fileFilter: e.target.value } })
                  }
                  className="flex-grow bg-bg-surface border border-border-default focus:border-border-strong rounded-sm px-2 py-1 text-xs font-mono text-text-primary focus:outline-none"
                />
              </div>

              <button
                onClick={handlePickBinaryFile}
                className="w-full py-2 bg-accent hover:bg-accent-hover text-accent-fg font-semibold rounded text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Icons.Upload size={12} />
                {body.filePath ? 'Change File' : 'Select Binary File'}
              </button>
            </div>
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-bg-surface">
      {/* Sticky top Selector bar with dropdown trigger */}
      <div className="h-9 border-b border-border-subtle flex items-center px-4 shrink-0 bg-bg-panel select-none relative z-20">
        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            Body Type:
          </span>

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-bg-surface border border-border-default hover:border-accent rounded-sm text-xs font-semibold text-accent transition-all cursor-pointer min-w-[120px] justify-between"
          >
            <span>{currentLabel}</span>
            <Icons.ChevronDown size={10} className="stroke-accent" />
          </button>

          {/* Premium Custom Dropdown list */}
          {dropdownOpen && (
            <div className="absolute top-full left-[68px] mt-1 w-52 bg-bg-overlay border border-border-subtle rounded shadow-lg py-1.5 z-30 font-sans">
              {/* FORM group */}
              <div className="px-3 py-0.5 text-[9px] font-bold text-text-muted uppercase tracking-wider select-none opacity-60">
                Form
              </div>
              <button
                onClick={() => handleTypeChange('form-data')}
                className="w-full px-3 py-1 flex items-center justify-between text-xs text-text-primary hover:bg-bg-highlight transition-all"
              >
                <div className="flex items-center gap-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-text-secondary"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M21 9H3" />
                    <path d="M21 15H3" />
                    <path d="M10 3v18" />
                  </svg>
                  <span>Multipart Form</span>
                  {body.type !== 'form-data' && hasFormDataContent && (
                    <span
                      className="w-1.5 h-1.5 bg-accent rounded-full shrink-0 animate-pulse ml-1"
                      title="Contains saved data"
                    />
                  )}
                </div>
                {body.type === 'form-data' && <Icons.Check size={12} className="stroke-accent" />}
              </button>
              <button
                onClick={() => handleTypeChange('url-encoded')}
                className="w-full px-3 py-1 flex items-center justify-between text-xs text-text-primary hover:bg-bg-highlight transition-all"
              >
                <div className="flex items-center gap-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-text-secondary"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span>Form URL Encoded</span>
                  {body.type !== 'url-encoded' && hasUrlEncodedContent && (
                    <span
                      className="w-1.5 h-1.5 bg-accent rounded-full shrink-0 animate-pulse ml-1"
                      title="Contains saved data"
                    />
                  )}
                </div>
                {body.type === 'url-encoded' && <Icons.Check size={12} className="stroke-accent" />}
              </button>

              <div className="border-b border-border-subtle my-1" />

              {/* RAW group */}
              <div className="px-3 py-0.5 text-[9px] font-bold text-text-muted uppercase tracking-wider select-none opacity-60">
                Raw
              </div>
              <button
                onClick={() => handleTypeChange('json')}
                className="w-full px-3 py-1 flex items-center justify-between text-xs text-text-primary hover:bg-bg-highlight transition-all"
              >
                <div className="flex items-center gap-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-text-secondary"
                  >
                    <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1" />
                    <path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1" />
                  </svg>
                  <span>JSON</span>
                  {body.type !== 'json' && hasJsonContent && (
                    <span
                      className="w-1.5 h-1.5 bg-accent rounded-full shrink-0 animate-pulse ml-1"
                      title="Contains saved data"
                    />
                  )}
                </div>
                {body.type === 'json' && <Icons.Check size={12} className="stroke-accent" />}
              </button>
              <button
                onClick={() => handleTypeChange('raw')}
                className="w-full px-3 py-1 flex items-center justify-between text-xs text-text-primary hover:bg-bg-highlight transition-all"
              >
                <div className="flex items-center gap-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-text-secondary"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  <span>Raw Text / XML / HTML</span>
                  {body.type !== 'raw' && hasRawContent && (
                    <span
                      className="w-1.5 h-1.5 bg-accent rounded-full shrink-0 animate-pulse ml-1"
                      title="Contains saved data"
                    />
                  )}
                </div>
                {body.type === 'raw' && <Icons.Check size={12} className="stroke-accent" />}
              </button>

              <div className="border-b border-border-subtle my-1" />

              {/* OTHER group */}
              <div className="px-3 py-0.5 text-[9px] font-bold text-text-muted uppercase tracking-wider select-none opacity-60">
                Other
              </div>
              <button
                onClick={() => handleTypeChange('file')}
                className="w-full px-3 py-1 flex items-center justify-between text-xs text-text-primary hover:bg-bg-highlight transition-all"
              >
                <div className="flex items-center gap-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-text-secondary"
                  >
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                  <span>File / Binary</span>
                  {body.type !== 'file' && hasFileContent && (
                    <span
                      className="w-1.5 h-1.5 bg-accent rounded-full shrink-0 animate-pulse ml-1"
                      title="Contains saved data"
                    />
                  )}
                </div>
                {body.type === 'file' && <Icons.Check size={12} className="stroke-accent" />}
              </button>

              <div className="border-b border-border-subtle my-1" />

              {/* NO BODY group */}
              <button
                onClick={() => handleTypeChange('none')}
                className="w-full px-3 py-1.5 flex items-center justify-between text-xs text-text-primary hover:bg-bg-highlight transition-all"
              >
                <div className="flex items-center gap-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-text-secondary"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span>No Body</span>
                </div>
                {body.type === 'none' && <Icons.Check size={12} className="stroke-accent" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor Content Area */}
      {renderContent()}
    </div>
  )
}

export default BodyTab
