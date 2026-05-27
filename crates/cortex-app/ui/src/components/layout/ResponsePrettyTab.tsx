import React, { useState, useMemo } from 'react'
import type { ResponsePayload } from '../../stores/responseStore'
import CodeEditor from '../ui/CodeEditor'
import * as Icons from '../ui/Icons'
import { commands } from '../../bindings'

interface ResponsePrettyTabProps {
  response: ResponsePayload
}

type DetectedFormat = 'json' | 'xml' | 'html' | 'javascript' | 'text' | 'binary'

interface FormatDetectionResult {
  format: DetectedFormat
  label: string
  source: 'content-type' | 'body-inspection'
}

const HTML_VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

const MAX_BODY_SIZE = 5 * 1024 * 1024 // 5 MB
const BINARY_SCAN_SIZE = 8 * 1024 // 8 KB

function isBinaryContent(body: string): boolean {
  const sample = body.slice(0, BINARY_SCAN_SIZE)
  if (sample.includes('\0')) return true
  let nonPrintable = 0
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i)
    if (code < 9 || (code > 13 && code < 32) || code === 127) {
      nonPrintable++
    }
  }
  return nonPrintable / sample.length > 0.3
}

/** Inspect the raw body bytes to guess the format, independent of any Content-Type header. */
function inspectBodyFormat(body: string): FormatDetectionResult {
  if (!body || isBinaryContent(body)) {
    return { format: 'binary', label: 'Binary', source: 'body-inspection' }
  }
  const trimmed = body.trim()
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed)
      return { format: 'json', label: 'JSON', source: 'body-inspection' }
    } catch {
      // not valid JSON — fall through
    }
  }
  const lower = trimmed.toLowerCase()
  if (lower.startsWith('<!doctype html') || lower.startsWith('<html')) {
    return { format: 'html', label: 'HTML', source: 'body-inspection' }
  }
  if (trimmed.startsWith('<?xml') || /^<[a-zA-Z]/.test(trimmed)) {
    return { format: 'xml', label: 'XML', source: 'body-inspection' }
  }
  return { format: 'text', label: 'Text', source: 'body-inspection' }
}

function detectFormat(headers: Record<string, string>, body: string): FormatDetectionResult {
  const rawContentType = headers['content-type'] || headers['Content-Type'] || ''
  const mimeType = rawContentType.split(';')[0].trim().toLowerCase()

  if (mimeType) {
    // Specific structured types — trust the Content-Type header directly
    if (mimeType.includes('json') || mimeType.endsWith('+json')) {
      return { format: 'json', label: 'JSON', source: 'content-type' }
    }
    if (mimeType === 'text/html' || mimeType.startsWith('application/xhtml')) {
      return { format: 'html', label: 'HTML', source: 'content-type' }
    }
    if (mimeType.includes('xml') || mimeType.endsWith('+xml')) {
      return { format: 'xml', label: 'XML', source: 'content-type' }
    }
    if (mimeType.includes('javascript')) {
      return { format: 'javascript', label: 'JavaScript', source: 'content-type' }
    }

    // Definitive binary types — trust the Content-Type header directly
    if (
      mimeType.startsWith('image/') ||
      mimeType.startsWith('audio/') ||
      mimeType.startsWith('video/') ||
      mimeType === 'application/octet-stream' ||
      mimeType === 'application/pdf' ||
      mimeType === 'application/zip' ||
      mimeType === 'application/gzip'
    ) {
      return { format: 'binary', label: 'Binary', source: 'content-type' }
    }

    // Generic text types (text/plain, text/csv, …) — the header only tells us it's *text*,
    // not which kind. Run body inspection: if it finds JSON/XML/HTML, report that as
    // "(detected)"; if nothing specific is found, confirm as plain Text from the header
    // (no "(detected)" suffix, since the Content-Type did tell us it's text).
    if (mimeType.startsWith('text/')) {
      const inspected = inspectBodyFormat(body)
      if (inspected.format !== 'text' && inspected.format !== 'binary') {
        return inspected // source is already 'body-inspection'
      }
      return { format: 'text', label: 'Text', source: 'content-type' }
    }
  }

  // No recognisable Content-Type — full body inspection
  return inspectBodyFormat(body)
}

function prettyPrintMarkup(source: string, voidElements?: Set<string>): string {
  try {
    const INDENT = '  '
    const lines: string[] = []
    let indent = 0

    const normalized = source.replace(/>\s+</g, '><').replace(/></g, '>\n<')

    for (const raw of normalized.split('\n')) {
      const line = raw.trim()
      if (!line) continue

      const isClosingTag = /^<\/[a-zA-Z]/.test(line)
      const isSelfClosing = /\/>$/.test(line)
      const isOpeningTag = /^<[a-zA-Z]/.test(line) && !isClosingTag
      const isDoctype = /^<!/i.test(line)
      const isProcessing = /^<\?/.test(line)
      const isComment = /^<!--/.test(line)

      if (isClosingTag) {
        indent = Math.max(0, indent - 1)
        lines.push(INDENT.repeat(indent) + line)
      } else if (isSelfClosing || isDoctype || isProcessing || isComment) {
        lines.push(INDENT.repeat(indent) + line)
      } else if (isOpeningTag) {
        lines.push(INDENT.repeat(indent) + line)
        const tagName = line.match(/^<([a-zA-Z][a-zA-Z0-9-]*)/)?.[1]?.toLowerCase()
        const hasInlineClose = tagName ? new RegExp(`</${tagName}>`, 'i').test(line) : false
        if (tagName && !voidElements?.has(tagName) && !hasInlineClose) {
          indent++
        }
      } else {
        lines.push(INDENT.repeat(indent) + line)
      }
    }

    return lines.join('\n')
  } catch {
    return source
  }
}

function formatBody(body: string, format: DetectedFormat): string {
  if (!body) return body
  try {
    if (format === 'json') {
      return JSON.stringify(JSON.parse(body), null, 2)
    }
    if (format === 'xml') {
      return prettyPrintMarkup(body)
    }
    if (format === 'html') {
      return prettyPrintMarkup(body, HTML_VOID_ELEMENTS)
    }
  } catch {
    // fallback to original
  }
  return body
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const FORMAT_OPTIONS: { value: DetectedFormat | 'auto'; label: string }[] = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'html', label: 'HTML' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'text', label: 'Plain Text' },
  { value: 'binary', label: 'Binary' },
]

const ResponsePrettyTab: React.FC<ResponsePrettyTabProps> = ({ response }) => {
  // Store the override alongside the requestId it applies to so it automatically
  // resets when a new response arrives — no useEffect needed.
  const [overrideState, setOverrideState] = useState<{
    requestId: string
    format: DetectedFormat
  } | null>(null)

  const manualOverride =
    overrideState?.requestId === response.requestId ? overrideState.format : null

  const setManualOverride = (format: DetectedFormat | null) => {
    setOverrideState(format ? { requestId: response.requestId, format } : null)
  }

  const detection = useMemo(
    () => detectFormat(response.headers, response.body),
    [response.headers, response.body]
  )

  const effectiveFormat = manualOverride ?? detection.format

  const formattedBody = useMemo(
    () => formatBody(response.body, effectiveFormat),
    [response.body, effectiveFormat]
  )

  const isTooLarge = response.bodySize > MAX_BODY_SIZE

  const handleSaveToFile = async () => {
    const contentType = response.headers['content-type'] || response.headers['Content-Type'] || ''
    const ext = contentType.startsWith('image/')
      ? (contentType.split('/')[1]?.split(';')[0] ?? 'bin')
      : 'bin'
    const result = await commands.saveFile('Save Response', 'All Files', '*', `response.${ext}`)
    if (result.status === 'ok' && result.data) {
      await commands.writeTextFile(result.data, response.body)
    }
  }

  const editorLang: 'json' | 'xml' | 'html' | 'javascript' | 'text' =
    effectiveFormat === 'binary' || effectiveFormat === 'text' ? 'text' : effectiveFormat

  if (isTooLarge) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-bg-muted p-4 rounded-full mb-4">
          <Icons.Info size={32} className="text-text-muted" />
        </div>
        <h3 className="text-text-primary font-medium mb-2">Response body too large to display</h3>
        <p className="text-text-muted text-sm max-w-xs mb-6">
          The response body is {(response.bodySize / (1024 * 1024)).toFixed(1)} MB, which exceeds
          the display limit of 5 MB.
        </p>
        <button
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-accent-fg rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          onClick={handleSaveToFile}
        >
          <Icons.Download size={16} />
          Download Response
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-muted border-b border-border-subtle text-xs shrink-0">
        <span className="text-text-muted">Format:</span>
        <span className="px-1.5 py-0.5 rounded bg-bg-surface border border-border-subtle text-text-primary font-medium">
          {detection.label}
        </span>
        {detection.source === 'body-inspection' && (
          <span className="text-text-muted">(detected)</span>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <label htmlFor="format-override" className="text-text-muted">
            Override:
          </label>
          <select
            id="format-override"
            value={manualOverride ?? 'auto'}
            onChange={(e) => {
              const val = e.target.value
              setManualOverride(val === 'auto' ? null : (val as DetectedFormat))
            }}
            className="bg-bg-surface border border-border-subtle rounded px-2 py-0.5 text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {FORMAT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {effectiveFormat === 'binary' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-bg-muted p-4 rounded-full mb-4">
            <Icons.File size={32} className="text-text-muted" />
          </div>
          <h3 className="text-text-primary font-medium mb-2">Binary or non-displayable content</h3>
          <div className="text-text-muted text-sm space-y-1 mb-6">
            <p>
              <span className="font-medium text-text-secondary">Content-Type: </span>
              {response.headers['content-type'] || response.headers['Content-Type'] || 'Unknown'}
            </p>
            <p>
              <span className="font-medium text-text-secondary">Size: </span>
              {formatBytes(response.bodySize)}
            </p>
          </div>
          <button
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-accent-fg rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            onClick={handleSaveToFile}
          >
            <Icons.Download size={16} />
            Save to file
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            value={formattedBody}
            onChange={() => {}}
            language={editorLang}
            readOnly={true}
          />
        </div>
      )}
    </div>
  )
}

export default ResponsePrettyTab
