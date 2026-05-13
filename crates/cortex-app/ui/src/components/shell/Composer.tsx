import React, { useState, useEffect, useCallback } from 'react'
import {
  Sparkles,
  Terminal,
  Send,
  Globe,
  History,
  Trash2,
  Loader2,
  CheckCircle2,
  Plus,
  Layers,
  AlertTriangle,
  Database,
  Zap,
} from 'lucide-react'
import { type Tab } from './TabBar'
import { getMethodColor } from '../../lib/methods'
import { cn } from '../../lib/utils'
import { TemplateInput } from '../TemplateInput'
import { commands, type RequestHistoryEntry } from '../../bindings'

interface ComposerProps {
  tab?: Tab
  workspacePath?: string
  collectionPath?: string
  environmentName?: string
  /** Incremented by App whenever variables are saved so TemplateInput re-resolves. */
  variableRevision?: number
}

export const Composer: React.FC<ComposerProps> = ({
  tab,
  workspacePath,
  collectionPath,
  environmentName,
  variableRevision,
}) => {
  const [url, setUrl] = useState('')
  const [body, setBody] = useState('{\n  "payload": {{myJsonObject}}\n}')
  const [headers, setHeaders] = useState<
    Array<{ id: string; key: string; value: string; enabled: boolean }>
  >([
    { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
    { id: '2', key: 'Authorization', value: 'Bearer {{API_KEY}}', enabled: true },
    { id: '3', key: '{{CUSTOM_HEADER}}', value: 'dynamic-val', enabled: true },
  ])
  const [headersPreview, setHeadersPreview] = useState<{
    headers: Array<{ key: string; value: string }>
    warnings: string[]
  } | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [history, setHistory] = useState<RequestHistoryEntry[]>([])

  // GraphQL Introspection Special Context State
  const [gqlEndpoint, setGqlEndpoint] = useState('https://api.example.com/graphql/{{GRAPHQL_ENV}}')
  const [gqlHeaders, setGqlHeaders] = useState<
    Array<{ id: string; key: string; value: string; enabled: boolean }>
  >([{ id: 'gql-1', key: 'Authorization', value: 'Bearer {{API_KEY}}', enabled: true }])
  const [isIntrospecting, setIsIntrospecting] = useState(false)
  const [introspectionResult, setIntrospectionResult] = useState<{
    status: 'success' | 'error'
    message: string
    schema?: string
  } | null>(null)
  const [autoIntrospect, setAutoIntrospect] = useState(false)

  // Live Preview of Headers Engine
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!tab) return
      try {
        const payload = headers.map(({ key, value, enabled }) => ({ key, value, enabled }))
        const res = await commands.previewRequestHeaders(
          payload,
          workspacePath ?? null,
          collectionPath ?? null,
          environmentName ?? null,
          tab.path ?? null
        )
        if (res.status === 'ok') {
          setHeadersPreview(res.data)
        }
      } catch (e) {
        console.error('[Composer] preview headers error:', e)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [headers, workspacePath, collectionPath, environmentName, tab, tab?.path, variableRevision])

  // Fetch request history logs on load and when context switches
  const loadHistory = async () => {
    try {
      const logs = await commands.getRequestHistory()
      setTimeout(() => setHistory(logs), 0)
    } catch (e) {
      console.error('[Composer] failed to load history:', e)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [workspacePath, collectionPath, environmentName])

  // Sync initial URL and Body when active tab switches
  useEffect(() => {
    const tabId = tab?.id
    if (tabId) {
      setTimeout(() => {
        setUrl((prev) => prev || 'https://api.example.com/v1/users/{{$randomNanoId}}')
        setBody(
          (prev) =>
            prev ||
            '{\n  "id": "{{$randomNanoId}}",\n  "timestamp": "{{$randomTimestamp}}",\n  "data": {{myJsonObject}}\n}'
        )
      }, 0)
    }
  }, [tab?.id])

  const handleSend = async () => {
    if (!tab || !url) return
    setIsSending(true)
    try {
      const mappedHeaders = headers.map(({ key, value, enabled }) => ({ key, value, enabled }))
      const payload = {
        request_name: tab.name,
        method: tab.method,
        url,
        headers: mappedHeaders,
        body: body ?? null,
      }
      const res = await commands.sendRequest(
        payload,
        workspacePath ?? null,
        collectionPath ?? null,
        environmentName ?? null,
        tab.path ?? null
      )
      if (res.status === 'ok') {
        // Prepend new history record locally or reload list
        setHistory((prev) => [res.data, ...prev])
      } else {
        console.error('[Composer] send error:', res.error)
      }
    } catch (e) {
      console.error('[Composer] exception during send:', e)
    } finally {
      setIsSending(false)
    }
  }

  const handleClearHistory = async () => {
    try {
      await commands.clearRequestHistory()
      setHistory([])
    } catch (e) {
      console.error('[Composer] clear history error:', e)
    }
  }

  const handleIntrospect = useCallback(
    async (isAuto = false) => {
      if (!tab || !gqlEndpoint) return
      setIsIntrospecting(true)
      setIntrospectionResult(null)
      try {
        const mappedHeaders = gqlHeaders.map(({ key, value, enabled }) => ({ key, value, enabled }))
        const payload = {
          endpoint_url: gqlEndpoint,
          headers: mappedHeaders,
        }
        const res = await commands.introspectGraphql(
          payload,
          workspacePath ?? null,
          collectionPath ?? null,
          environmentName ?? null,
          tab.path ?? null
        )
        if (res.status === 'ok') {
          setIntrospectionResult({
            status: 'success',
            message: isAuto
              ? 'Automatic introspection succeeded.'
              : 'Introspection successful! Schema retrieved.',
            schema: res.data.response_body ?? undefined,
          })
          setHistory((prev) => [res.data, ...prev])
        } else {
          setIntrospectionResult({
            status: 'error',
            message: res.error,
          })
        }
      } catch (e: unknown) {
        setIntrospectionResult({
          status: 'error',
          message:
            typeof e === 'string'
              ? e
              : e && typeof e === 'object' && 'message' in e
                ? String(e.message)
                : 'Introspection failed due to unresolved template variables.',
        })
      } finally {
        setIsIntrospecting(false)
      }
    },
    [tab, gqlEndpoint, gqlHeaders, workspacePath, collectionPath, environmentName]
  )

  useEffect(() => {
    if (autoIntrospect && gqlEndpoint) {
      const timer = setTimeout(() => {
        handleIntrospect(true)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [gqlEndpoint, autoIntrospect, handleIntrospect])

  if (!tab) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <div className="w-20 h-20 bg-slate-900/50 rounded-3xl flex items-center justify-center mb-8 border border-slate-800 shadow-2xl mx-auto group hover:border-blue-500/50 transition-all duration-500">
            <Sparkles className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Welcome to Cortex</h2>
          <p className="text-slate-500 text-sm max-w-sm leading-relaxed mx-auto">
            The next-generation API client for agentic workflows. Select a request from the sidebar
            or start with a scratch tab.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[#020617] overflow-y-auto animate-in fade-in duration-500 relative">
      <div className="p-8 space-y-8 max-w-6xl w-full mx-auto">
        {/* Method + Name */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'text-xs font-black uppercase px-2 py-0.5 rounded-md shadow-sm',
              getMethodColor(tab.method)
            )}
          >
            {tab.method}
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight">{tab.name}</h1>
        </div>

        {/* URL Bar */}
        <div className="flex items-start gap-2">
          <TemplateInput
            value={url}
            onChange={setUrl}
            placeholder="https://api.example.com/v1/{{resource}}"
            workspacePath={workspacePath}
            collectionPath={collectionPath}
            environmentName={environmentName}
            variableRevision={variableRevision}
            icon={
              <Globe className="w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            }
          />
          <button
            type="button"
            disabled={isSending || !url}
            onClick={handleSend}
            className={cn(
              'bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-95 transition-all shrink-0',
              isSending ? 'cursor-wait' : ''
            )}
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send
              </>
            )}
          </button>
        </div>

        {/* ── Request Headers Panel ── */}
        <div className="space-y-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-white tracking-tight">Request Headers</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setHeaders((prev) => [
                  ...prev,
                  { id: crypto.randomUUID(), key: '', value: '', enabled: true },
                ])
              }}
              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-500/20 transition-all"
            >
              <Plus className="w-3 h-3" /> Add Header
            </button>
          </div>

          {/* Table/List */}
          <div className="space-y-2">
            {headers.map((h) => (
              <div key={h.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={h.enabled}
                  onChange={(e) => {
                    const val = e.target.checked
                    setHeaders((prev) =>
                      prev.map((item) => (item.id === h.id ? { ...item, enabled: val } : item))
                    )
                  }}
                  className="mt-3.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer w-4 h-4 shrink-0"
                  title="Enable Header"
                />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <TemplateInput
                    value={h.key}
                    onChange={(val) => {
                      setHeaders((prev) =>
                        prev.map((item) => (item.id === h.id ? { ...item, key: val } : item))
                      )
                    }}
                    placeholder="Key (e.g. Content-Type or {{VAR}})"
                    workspacePath={workspacePath}
                    collectionPath={collectionPath}
                    environmentName={environmentName}
                    variableRevision={variableRevision}
                    inputClassName="py-2 text-xs"
                  />
                  <TemplateInput
                    value={h.value}
                    onChange={(val) => {
                      setHeaders((prev) =>
                        prev.map((item) => (item.id === h.id ? { ...item, value: val } : item))
                      )
                    }}
                    placeholder="Value"
                    workspacePath={workspacePath}
                    collectionPath={collectionPath}
                    environmentName={environmentName}
                    variableRevision={variableRevision}
                    inputClassName="py-2 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHeaders((prev) => prev.filter((item) => item.id !== h.id))
                  }}
                  className="mt-2.5 p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all shrink-0"
                  title="Delete Header"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {headers.length === 0 && (
              <p className="text-[11px] text-slate-600 italic text-center py-2">
                No custom headers configured.
              </p>
            )}
          </div>

          {/* Live Preview Block */}
          {headersPreview && (
            <div className="mt-3 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3 animate-in fade-in duration-300">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Final Sent Request Headers Preview
              </span>
              {headersPreview.warnings.length > 0 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Resolution Warnings</span>
                  </div>
                  {headersPreview.warnings.map((w, i) => (
                    <p key={i} className="text-[11px] text-amber-300/90 leading-relaxed font-mono">
                      {w}
                    </p>
                  ))}
                </div>
              )}
              {headersPreview.headers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {headersPreview.headers.map((rh, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800/50"
                    >
                      <span
                        className="text-[11px] font-mono font-bold text-blue-400 truncate"
                        title={rh.key}
                      >
                        {rh.key}
                      </span>
                      <span
                        className="text-[11px] font-mono text-slate-300 truncate max-w-[180px]"
                        title={rh.value}
                      >
                        {rh.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-600 italic">No final headers to send.</p>
              )}
            </div>
          )}
        </div>

        {/* Request Body (JSON) Panel */}
        <div className="space-y-3 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="text-xs font-bold text-white tracking-tight">
                Request Body (JSON)
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Supports array/object interpolation
            </span>
          </div>
          <TemplateInput
            value={body}
            onChange={setBody}
            placeholder="{\n  &#34;key&#34;: &#34;{{variable}}&#34;\n}"
            workspacePath={workspacePath}
            collectionPath={collectionPath}
            environmentName={environmentName}
            variableRevision={variableRevision}
            multiline
            rows={6}
          />
        </div>

        {/* ── GraphQL Schema Introspection (Special Operation Context) ── */}
        <div className="space-y-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Database className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-white tracking-tight block">
                  GraphQL Schema Introspection
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Special context pipeline • deduplicated variables without runtime bleed
                </span>
              </div>
            </div>

            {/* Auto Introspect Switch */}
            <label className="flex items-center gap-2 cursor-pointer bg-slate-900/60 border border-slate-800/60 px-3 py-1.5 rounded-xl hover:border-slate-700/60 transition-all shrink-0">
              <input
                type="checkbox"
                checked={autoIntrospect}
                onChange={(e) => setAutoIntrospect(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Auto-introspect
              </span>
            </label>
          </div>

          {/* Endpoint URL Input + Manual Trigger Button */}
          <div className="flex items-start gap-2">
            <TemplateInput
              value={gqlEndpoint}
              onChange={setGqlEndpoint}
              placeholder="https://api.example.com/graphql/{{env}}"
              workspacePath={workspacePath}
              collectionPath={collectionPath}
              environmentName={environmentName}
              variableRevision={variableRevision}
              icon={<Globe className="w-4 h-4 text-amber-500/70" />}
            />
            <button
              type="button"
              disabled={isIntrospecting || !gqlEndpoint}
              onClick={() => handleIntrospect(false)}
              className={cn(
                'bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold text-xs shadow-lg shadow-amber-600/10 active:scale-95 transition-all shrink-0',
                isIntrospecting ? 'cursor-wait' : ''
              )}
            >
              {isIntrospecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Introspecting...
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5" /> Introspect
                </>
              )}
            </button>
          </div>

          {/* Special Context Custom Headers Header */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Introspection Headers
              </span>
              <button
                type="button"
                onClick={() => {
                  setGqlHeaders((prev) => [
                    ...prev,
                    { id: crypto.randomUUID(), key: '', value: '', enabled: true },
                  ])
                }}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Header
              </button>
            </div>

            {gqlHeaders.map((h) => (
              <div key={h.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={h.enabled}
                  onChange={(e) => {
                    const val = e.target.checked
                    setGqlHeaders((prev) =>
                      prev.map((item) => (item.id === h.id ? { ...item, enabled: val } : item))
                    )
                  }}
                  className="mt-3 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer w-3.5 h-3.5 shrink-0"
                />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <TemplateInput
                    value={h.key}
                    onChange={(val) => {
                      setGqlHeaders((prev) =>
                        prev.map((item) => (item.id === h.id ? { ...item, key: val } : item))
                      )
                    }}
                    placeholder="Header Key"
                    workspacePath={workspacePath}
                    collectionPath={collectionPath}
                    environmentName={environmentName}
                    variableRevision={variableRevision}
                    inputClassName="py-1.5 text-xs"
                  />
                  <TemplateInput
                    value={h.value}
                    onChange={(val) => {
                      setGqlHeaders((prev) =>
                        prev.map((item) => (item.id === h.id ? { ...item, value: val } : item))
                      )
                    }}
                    placeholder="Header Value"
                    workspacePath={workspacePath}
                    collectionPath={collectionPath}
                    environmentName={environmentName}
                    variableRevision={variableRevision}
                    inputClassName="py-1.5 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setGqlHeaders((prev) => prev.filter((item) => item.id !== h.id))
                  }}
                  className="mt-2 text-slate-500 hover:text-red-400 p-1 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Results Alert Banner */}
          {introspectionResult && (
            <div
              className={cn(
                'mt-3 p-4 rounded-xl border animate-in fade-in duration-300 space-y-2',
                introspectionResult.status === 'error'
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              )}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                {introspectionResult.status === 'error' ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Introspection Prerequisite Error</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Introspection Successful</span>
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed font-mono whitespace-pre-wrap">
                {introspectionResult.message}
              </p>
              {introspectionResult.schema && (
                <div className="mt-2 pt-2 border-t border-emerald-500/10 max-h-40 overflow-y-auto font-mono text-[10px] text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-900">
                  {introspectionResult.schema}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Request Execution History Pane ── */}
        <div className="space-y-4 pt-6 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <History className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Request Execution History
                </h3>
                <p className="text-[11px] text-slate-500">
                  Live captured variables generated per request sent
                </p>
              </div>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-xs font-semibold text-slate-500 hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-8 text-center border border-slate-900 rounded-2xl bg-slate-950/30">
              <p className="text-xs text-slate-600 italic">
                No request history captured yet. Click Send to log dynamic variables.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const capturedEntries = Object.entries(item.captured_variables)
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-3 transition-all hover:border-slate-700/80"
                  >
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-[200px]">
                        <span
                          className={cn(
                            'text-[10px] font-black uppercase px-2 py-0.5 rounded shrink-0',
                            getMethodColor(item.method)
                          )}
                        >
                          {item.method}
                        </span>
                        <span
                          className="text-xs font-mono text-slate-300 font-medium truncate"
                          title={item.rendered_url}
                        >
                          {item.rendered_url}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {item.status_code && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {item.status_code} OK
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(item.executed_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Evaluated Headers & Captured Variables Panel */}
                    <div className="space-y-3">
                      {item.warnings && item.warnings.length > 0 && (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Execution Warnings</span>
                          </div>
                          {item.warnings.map((w, i) => (
                            <p
                              key={i}
                              className="text-[11px] text-amber-300/90 leading-relaxed font-mono"
                            >
                              {w}
                            </p>
                          ))}
                        </div>
                      )}

                      {item.headers && Object.keys(item.headers).length > 0 && (
                        <div className="bg-slate-950/80 border border-slate-800/60 rounded-xl p-3 space-y-2">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                            Final Evaluated Headers Sent
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries(item.headers).map(([k, v]) => (
                              <div
                                key={k}
                                className="flex items-center justify-between gap-2 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800/40"
                              >
                                <span
                                  className="text-[11px] font-mono font-bold text-blue-400 truncate"
                                  title={k}
                                >
                                  {k}
                                </span>
                                <span
                                  className="text-[11px] font-mono text-slate-300 truncate max-w-[180px]"
                                  title={v}
                                >
                                  {v}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {capturedEntries.length > 0 ? (
                        <div className="bg-slate-950/80 border border-slate-800/60 rounded-xl p-3 space-y-2">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                            Captured Variables Evaluated at Runtime
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {capturedEntries.map(([name, val]) => (
                              <div
                                key={name}
                                className="flex items-center justify-between gap-2 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800/40"
                              >
                                <span className="text-[11px] font-mono font-bold text-rose-400 truncate">
                                  {'{{'}
                                  {name}
                                  {'}}'}
                                </span>
                                <span
                                  className="text-[11px] font-mono text-slate-300 truncate max-w-[180px]"
                                  title={val}
                                >
                                  {val}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-600 italic px-1">
                          No variables interpolated in this request.
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
