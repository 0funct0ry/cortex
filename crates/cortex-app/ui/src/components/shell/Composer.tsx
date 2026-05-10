import React, { useState, useEffect, useRef } from 'react'
import { Sparkles, Terminal, Globe, Send, AlertTriangle } from 'lucide-react'
import { type Tab } from './TabBar'
import { getMethodColor } from '../../lib/methods'
import { cn } from '../../lib/utils'
import { commands, type ResolvedVariable } from '../../bindings'
import { VariablePreview } from '../VariablePreview'

interface ComposerProps {
  tab?: Tab
  workspacePath?: string
  collectionPath?: string
  environmentName?: string
}

export const Composer: React.FC<ComposerProps> = ({
  tab,
  workspacePath,
  collectionPath,
  environmentName,
}) => {
  const [url, setUrl] = useState('')
  const [resolvedUrl, setResolvedUrl] = useState('')
  const [warnings, setWarnings] = useState<string[]>([])
  const [hoveredVar, setHoveredVar] = useState<{ name: string; x: number; y: number } | null>(null)
  const [resolvedVars, setResolvedVars] = useState<Record<string, ResolvedVariable>>({})

  const urlInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (tab?.path && !tab.isScratch) {
      // In a real app, we'd load the request content here
      // For now, let's just use the URL from the tab if it exists
      // (Wait, Tab doesn't have URL, RequestFile does)
    }
  }, [tab])

  useEffect(() => {
    const resolve = async () => {
      if (!url) {
        setResolvedUrl('')
        setWarnings([])
        return
      }

      try {
        const res = await commands.previewTemplate(
          url,
          workspacePath || null,
          collectionPath || null,
          environmentName || null
        )
        if (res.status === 'ok') {
          setResolvedUrl(res.data.text)
          setWarnings(res.data.warnings.map((w) => w.name))
        }

        // Also get all resolved variables for the popover
        const varsRes = await commands.getResolvedVariables(
          workspacePath || null,
          collectionPath || null,
          environmentName || null
        )
        if (varsRes.status === 'ok') {
          setResolvedVars(varsRes.data)
        }
      } catch (e) {
        console.error('Resolution error:', e)
      }
    }

    const timer = setTimeout(resolve, 300)
    return () => clearTimeout(timer)
  }, [url, workspacePath, collectionPath, environmentName])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!urlInputRef.current) return

    const input = urlInputRef.current
    const text = url
    const pos = getCursorPositionInText(input, e)

    if (pos === -1) {
      setHoveredVar(null)
      return
    }

    // Check if we are inside a {{variable}}
    const leftText = text.substring(0, pos)
    const rightText = text.substring(pos)

    const startIdx = leftText.lastIndexOf('{{')
    const endIdx = rightText.indexOf('}}')

    if (startIdx !== -1 && endIdx !== -1) {
      // Make sure there are no other {{ or }} in between
      const middle = leftText.substring(startIdx + 2) + rightText.substring(0, endIdx)
      if (!middle.includes('{{') && !middle.includes('}}')) {
        setHoveredVar({
          name: middle.trim(),
          x: e.clientX,
          y: e.clientY,
        })
        return
      }
    }

    setHoveredVar(null)
  }

  // Helper to estimate which character is under the mouse
  const getCursorPositionInText = (input: HTMLInputElement, e: React.MouseEvent) => {
    const rect = input.getBoundingClientRect()
    const x = e.clientX - rect.left - 12 // padding
    if (x < 0) return -1

    // Very rough estimation based on average character width
    const avgCharWidth = 8 // approximate for mono font
    const pos = Math.floor(x / avgCharWidth)
    return Math.min(pos, input.value.length)
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
    <div className="flex-1 flex flex-col bg-[#020617] overflow-hidden animate-in fade-in duration-500 relative">
      <div className="p-8 space-y-8">
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
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="flex-1 relative group"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredVar(null)}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Globe className="w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                ref={urlInputRef}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-mono placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-2xl"
                placeholder="https://api.example.com/v1/{{resource}}"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              {/* Variable Preview Popover */}
              {hoveredVar && (
                <div
                  className="fixed pointer-events-none"
                  style={{ left: hoveredVar.x, top: hoveredVar.y }}
                >
                  <VariablePreview
                    name={hoveredVar.name}
                    resolved={resolvedVars[hoveredVar.name]}
                  />
                </div>
              )}
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
              <Send className="w-4 h-4" /> Send
            </button>
          </div>

          {/* Resolution Preview */}
          {url && (
            <div className="px-4 py-3 bg-slate-900/30 border border-slate-800/50 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Resolved URL
                </span>
                {warnings.length > 0 && (
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <AlertTriangle className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">
                      {warnings.length} Unresolved{' '}
                      {warnings.length === 1 ? 'Variable' : 'Variables'}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs font-mono text-slate-400 break-all leading-relaxed">
                {resolvedUrl || url}
              </p>
              {warnings.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {warnings.map((w) => (
                    <span
                      key={w}
                      className="text-[9px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded"
                    >
                      {'{{'}
                      {w}
                      {'}}'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Placeholder for other request sections */}
        <div className="flex flex-col items-center justify-center h-64 border border-slate-800 border-dashed rounded-3xl bg-slate-900/10 group hover:bg-slate-900/20 transition-all duration-500">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700 group-hover:border-slate-600 group-hover:scale-110 transition-all">
            <Terminal className="w-6 h-6 text-slate-500 group-hover:text-slate-300" />
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-tight">
            Headers, Body, and Scripts coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
