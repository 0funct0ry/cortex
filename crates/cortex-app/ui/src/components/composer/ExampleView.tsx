import React, { useState, useEffect } from 'react'
import { toast } from '../../stores/toastStore'
import { commands, type RequestExample, type ExampleHeader } from '../../bindings'
import { useCollectionStore } from '../../stores/collectionStore'
import { useTabs } from '../../contexts/TabsContext'
import CodeEditor from '../ui/CodeEditor'
import MethodBadge from '../ui/MethodBadge'

interface ExampleViewProps {
  requestPath: string
  exampleId: string
}

type ActiveResponseTab = 'response' | 'headers'

const ExampleView: React.FC<ExampleViewProps> = ({ requestPath, exampleId }) => {
  const loadCollection = useCollectionStore((s) => s.loadCollection)
  const collections = useCollectionStore((s) => s.collections)
  const { tabs, updateTab } = useTabs()

  const [example, setExample] = useState<RequestExample | null>(null)
  const [requestName, setRequestName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editHeaders, setEditHeaders] = useState<ExampleHeader[]>([])
  const [editBody, setEditBody] = useState('')
  const [saving, setSaving] = useState(false)

  const [activeResponseTab, setActiveResponseTab] = useState<ActiveResponseTab>('response')

  // Find example in collections to keep name in sync with sidebar
  const liveExample = (() => {
    for (const col of Object.values(collections)) {
      if (!col) continue
      const findInItems = (items: typeof col.items): RequestExample | null => {
        for (const item of items) {
          if (item.type === 'Request' && item.data.path === requestPath) {
            return item.data.content?.examples?.find((e) => e.id === exampleId) ?? null
          }
          if (item.type === 'Folder') {
            const found = findInItems(item.data.items)
            if (found !== null) return found
          }
        }
        return null
      }
      const found = findInItems(col.items)
      if (found) return found
    }
    return null
  })()

  const displayName = isEditing ? editName : (liveExample?.name ?? example?.name ?? '')

  // Load example from the request file
  useEffect(() => {
    let isMounted = true

    setTimeout(() => {
      if (isMounted) {
        setError(null)
        setIsEditing(false)
        setLoading(true)
      }
    }, 0)
    commands.loadRequest(requestPath).then((res) => {
      if (!isMounted) return
      setLoading(false)
      if (res.status !== 'ok') {
        setError(res.error as string)
        return
      }
      const wrapper = res.data
      if (wrapper.error) {
        setError(wrapper.error)
        return
      }
      setRequestName(wrapper.name)
      const found = wrapper.content?.examples?.find((e) => e.id === exampleId) ?? null
      if (!found) {
        setError('Example not found')
        return
      }
      setExample(found)
    })
    return () => {
      isMounted = false
    }
  }, [requestPath, exampleId])

  const enterEdit = () => {
    if (!example) return
    setEditName(example.name)
    setEditDescription(example.description ?? '')
    setEditHeaders(example.headers ? [...example.headers.map((h) => ({ ...h }))] : [])
    setEditBody(extractBodyText(example))
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

  const saveEdit = async () => {
    if (!example) return
    setSaving(true)
    const updatedExample: RequestExample = {
      ...example,
      name: editName.trim() || example.name,
      description: editDescription.trim() || undefined,
      headers: editHeaders.filter((h) => h.key.trim()),
      body: buildBodyFromText(editBody, example),
    }
    const result = await commands.updateExample(requestPath, updatedExample)
    setSaving(false)
    if (result.status !== 'ok') {
      toast.error(`Save failed: ${result.error}`)
      return
    }
    setExample(updatedExample)
    setIsEditing(false)
    // Update the tab title if the name changed
    const matchingTab = tabs.find(
      (t) => t.type === 'example' && t.requestPath === requestPath && t.exampleId === exampleId
    )
    if (matchingTab) updateTab(matchingTab.id, { name: updatedExample.name })
    // Reload collection so the tree picks up the new name
    const colPath = findCollectionPath(requestPath, collections)
    if (colPath) await loadCollection(colPath)
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-success-muted text-success border-success/20'
    if (status >= 300 && status < 400) return 'bg-warning-muted text-warning border-warning/20'
    return 'bg-error-muted text-error border-error/20'
  }

  const inferLanguage = (ex: RequestExample): 'json' | 'xml' | 'html' | 'text' => {
    const contentType = ex.headers?.find((h) => h.key.toLowerCase() === 'content-type')?.value ?? ''
    if (contentType.includes('json')) return 'json'
    if (contentType.includes('xml')) return 'xml'
    if (contentType.includes('html')) return 'html'
    return 'text'
  }

  const inferResponseLanguage = (ex: RequestExample): 'json' | 'xml' | 'html' | 'text' => {
    const contentType =
      ex.response?.headers?.['content-type'] ?? ex.response?.headers?.['Content-Type'] ?? ''
    if (contentType.includes('json')) return 'json'
    if (contentType.includes('xml')) return 'xml'
    if (contentType.includes('html')) return 'html'
    return 'text'
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
        Loading example…
      </div>
    )
  }

  if (error || !example) {
    return (
      <div className="flex-1 flex items-center justify-center text-error text-sm">
        {error ?? 'Example not found'}
      </div>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: Request side */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden border-r border-border-subtle">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-surface shrink-0">
          <div className="flex flex-col gap-0.5 min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="truncate max-w-[140px]">{requestName}</span>
              <span>/</span>
              {isEditing ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-5 bg-bg-surface border border-border-default focus:border-accent rounded px-1 text-xs text-text-primary outline-none min-w-[120px]"
                  autoFocus
                />
              ) : (
                <span className="text-text-primary font-medium truncate max-w-[180px]">
                  {displayName}
                </span>
              )}
            </div>
            {/* Description */}
            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="mt-1 bg-bg-surface border border-border-default focus:border-accent rounded px-2 py-1 text-xs text-text-secondary outline-none resize-none w-full"
              />
            ) : (
              example.description && (
                <p className="text-xs text-text-secondary mt-0.5">{example.description}</p>
              )
            )}
          </div>
          {/* Edit / Save / Cancel buttons */}
          <div className="flex items-center gap-2 shrink-0 ml-3">
            {isEditing ? (
              <>
                <button
                  onClick={cancelEdit}
                  className="h-7 px-3 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="h-7 px-3 text-xs font-medium bg-accent hover:bg-accent-hover text-accent-fg rounded disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </>
            ) : (
              <button
                onClick={enterEdit}
                className="h-7 px-3 text-xs font-medium border border-border-default hover:bg-bg-muted text-text-secondary rounded transition-colors"
              >
                Edit Example
              </button>
            )}
          </div>
        </div>

        {/* URL bar (read-only) */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border-subtle bg-bg-surface shrink-0">
          <MethodBadge method={example.method} />
          <span className="text-sm text-text-primary font-mono truncate">{example.url}</span>
        </div>

        {/* Headers */}
        <div className="flex flex-col flex-1 overflow-auto px-4 py-3 gap-4">
          <section>
            <h3 className="text-xs font-semibold text-text-muted uppercase mb-2">Headers</h3>
            {isEditing ? (
              <EditableHeadersTable headers={editHeaders} onChange={setEditHeaders} />
            ) : (
              <ReadOnlyHeadersTable headers={example.headers ?? []} />
            )}
          </section>

          <section>
            <h3 className="text-xs font-semibold text-text-muted uppercase mb-2">Body</h3>
            <div className="border border-border-default rounded overflow-hidden min-h-[100px]">
              <CodeEditor
                value={isEditing ? editBody : extractBodyText(example)}
                onChange={isEditing ? setEditBody : () => {}}
                language={inferLanguage(example)}
                readOnly={!isEditing}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Right: Response side */}
      <div className="flex flex-col w-[40%] min-w-[280px] max-w-[500px] overflow-hidden bg-bg-base">
        {/* Response meta bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border-subtle bg-bg-surface shrink-0">
          {example.response ? (
            <>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(example.response.status)}`}
              >
                {example.response.status} {example.response.status_text}
              </span>
            </>
          ) : (
            <span className="text-xs text-text-muted">No response captured</span>
          )}
        </div>

        {example.response && (
          <>
            {/* Response tabs */}
            <div className="flex border-b border-border-subtle bg-bg-surface shrink-0">
              {(['response', 'headers'] as ActiveResponseTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveResponseTab(tab)}
                  className={`px-4 py-2 text-xs font-medium capitalize transition-colors border-b-2 -mb-px ${
                    activeResponseTab === tab
                      ? 'border-accent text-text-primary'
                      : 'border-transparent text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {tab === 'response' ? 'Response' : 'Headers'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto">
              {activeResponseTab === 'response' ? (
                <div className="h-full border-0">
                  <CodeEditor
                    value={example.response.body ?? ''}
                    onChange={() => {}}
                    language={inferResponseLanguage(example)}
                    readOnly
                  />
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border-subtle bg-bg-surface">
                      <th className="text-left px-3 py-2 font-medium text-text-muted">Key</th>
                      <th className="text-left px-3 py-2 font-medium text-text-muted">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(example.response.headers ?? {}).map(([k, v]) => (
                      <tr key={k} className="border-b border-border-subtle/50 hover:bg-bg-muted/50">
                        <td className="px-3 py-1.5 font-mono text-text-secondary">{k}</td>
                        <td className="px-3 py-1.5 font-mono text-text-primary break-all">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const ReadOnlyHeadersTable: React.FC<{ headers: ExampleHeader[] }> = ({ headers }) => {
  if (headers.length === 0) {
    return <p className="text-xs text-text-muted italic">No headers</p>
  }
  return (
    <table className="w-full text-xs border border-border-default rounded overflow-hidden">
      <thead>
        <tr className="bg-bg-surface border-b border-border-subtle">
          <th className="w-6 px-2 py-1.5" />
          <th className="text-left px-3 py-1.5 font-medium text-text-muted">Key</th>
          <th className="text-left px-3 py-1.5 font-medium text-text-muted">Value</th>
        </tr>
      </thead>
      <tbody>
        {headers.map((h, i) => (
          <tr
            key={i}
            className={`border-b border-border-subtle/50 ${!h.enabled ? 'opacity-40' : ''}`}
          >
            <td className="px-2 py-1.5 text-center">
              <input
                type="checkbox"
                checked={h.enabled}
                readOnly
                disabled
                className="cursor-default"
              />
            </td>
            <td className="px-3 py-1.5 font-mono text-text-secondary">{h.key}</td>
            <td className="px-3 py-1.5 font-mono text-text-primary">{h.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const EditableHeadersTable: React.FC<{
  headers: ExampleHeader[]
  onChange: (headers: ExampleHeader[]) => void
}> = ({ headers, onChange }) => {
  const addRow = () => onChange([...headers, { key: '', value: '', enabled: true }])
  const removeRow = (i: number) => onChange(headers.filter((_, idx) => idx !== i))
  const updateRow = (i: number, patch: Partial<ExampleHeader>) =>
    onChange(headers.map((h, idx) => (idx === i ? { ...h, ...patch } : h)))

  return (
    <div className="flex flex-col gap-1">
      {headers.map((h, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={h.enabled}
            onChange={(e) => updateRow(i, { enabled: e.target.checked })}
          />
          <input
            value={h.key}
            onChange={(e) => updateRow(i, { key: e.target.value })}
            placeholder="Key"
            className="flex-1 h-7 bg-bg-surface border border-border-default focus:border-accent rounded px-2 text-xs text-text-primary outline-none"
          />
          <input
            value={h.value}
            onChange={(e) => updateRow(i, { value: e.target.value })}
            placeholder="Value"
            className="flex-1 h-7 bg-bg-surface border border-border-default focus:border-accent rounded px-2 text-xs text-text-primary outline-none"
          />
          <button
            onClick={() => removeRow(i)}
            className="text-text-muted hover:text-error transition-colors p-1"
            title="Remove header"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addRow}
        className="mt-1 text-xs text-accent hover:text-accent-hover transition-colors self-start"
      >
        + Add header
      </button>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractBodyText(example: RequestExample): string {
  if (!example.body) return ''
  const b = example.body
  if (b.raw_text) return b.raw_text
  if (b.json) return b.json
  if (b.text) return b.text
  return ''
}

function buildBodyFromText(text: string, original: RequestExample): RequestExample['body'] {
  if (!original.body) {
    return text ? { active_type: 'raw_text', raw_text: text } : undefined
  }
  if (original.body.active_type === 'json' || original.body.json) {
    return { ...original.body, json: text }
  }
  return { ...original.body, raw_text: text }
}

function findCollectionPath(
  requestPath: string,
  collections: Record<string, import('../../bindings').Collection | null>
): string | null {
  for (const [colPath, col] of Object.entries(collections)) {
    if (!col) continue
    const search = (items: typeof col.items): boolean => {
      for (const item of items) {
        if (item.type === 'Request' && item.data.path === requestPath) return true
        if (item.type === 'Folder' && search(item.data.items)) return true
      }
      return false
    }
    if (search(col.items)) return colPath
  }
  return null
}

export default ExampleView
