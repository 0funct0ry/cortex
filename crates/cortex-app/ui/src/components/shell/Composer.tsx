import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Terminal,
  Send,
  Globe,
  History,
  Trash2,
  Loader2,
  CheckCircle2,
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
  const [isSending, setIsSending] = useState(false)
  const [history, setHistory] = useState<RequestHistoryEntry[]>([])

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

  // Sync initial URL when active tab switches
  useEffect(() => {
    const tabId = tab?.id
    if (tabId) {
      // Pre-fill a realistic default or keep existing tab state if empty
      setTimeout(() => {
        setUrl((prev) => prev || 'https://api.example.com/v1/users/{{$randomNanoId}}')
      }, 0)
    }
  }, [tab?.id])

  const handleSend = async () => {
    if (!tab || !url) return
    setIsSending(true)
    try {
      const res = await commands.sendRequest(
        tab.name,
        tab.method,
        url,
        workspacePath ?? null,
        collectionPath ?? null,
        environmentName ?? null
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

        {/* Placeholder for headers / body / params */}
        <div className="flex flex-col items-center justify-center h-48 border border-slate-800 border-dashed rounded-3xl bg-slate-900/10 group hover:bg-slate-900/20 transition-all duration-500">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700 group-hover:border-slate-600 group-hover:scale-110 transition-all">
            <Terminal className="w-6 h-6 text-slate-500 group-hover:text-slate-300" />
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-tight">
            Headers, Body, and Scripts coming soon...
          </p>
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

                    {/* Captured Dynamic Variables Panel */}
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
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
