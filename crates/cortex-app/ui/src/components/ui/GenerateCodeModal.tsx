import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import * as Icons from './Icons'
import { useUIStore } from '../../stores/uiStore'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { commands } from '../../bindings'
import CodeEditor from './CodeEditor'
import {
  generateCode,
  resolveVariables,
  type CodeLang,
  type ResolvedRequest,
} from '../../utils/codeGen'

const LANG_KEY = 'cortex.code-gen.last-language'

const LANG_OPTIONS: { value: CodeLang; label: string }[] = [
  { value: 'curl', label: 'cURL' },
  { value: 'fetch', label: 'JavaScript (fetch)' },
  { value: 'python', label: 'Python (requests)' },
  { value: 'go', label: 'Go (net/http)' },
  { value: 'rust', label: 'Rust (reqwest)' },
]

function readLastLang(): CodeLang {
  const saved = localStorage.getItem(LANG_KEY)
  return (LANG_OPTIONS.find((o) => o.value === saved)?.value ?? 'curl') as CodeLang
}

const GenerateCodeModal: React.FC = () => {
  const { generateCodeModal, closeGenerateCodeModal } = useUIStore()
  const { requestPath, requestName } = generateCodeModal

  const [selectedLang, setSelectedLang] = useState<CodeLang>(readLastLang)
  const [resolvedReq, setResolvedReq] = useState<ResolvedRequest | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load request when modal opens
  useEffect(() => {
    if (!generateCodeModal.isOpen || !requestPath) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolvedReq(null)
    setLoadError(null)
    setCopied(false)
    setLoading(true)

    commands.loadRequest(requestPath).then((res) => {
      setLoading(false)
      if (res.status !== 'ok') {
        setLoadError(String(res.error))
        return
      }
      const wrapper = res.data
      if (wrapper.error) {
        setLoadError(wrapper.error)
        return
      }
      const content = wrapper.content
      if (!content) {
        setLoadError('Request file is empty.')
        return
      }

      // Build variable map from active environment (non-secret, enabled vars only)
      const envStore = useEnvironmentStore.getState()
      const activeEnv = envStore.environments.find((e) => e.name === envStore.activeEnvironmentName)
      const varMap: Record<string, string> = {}
      activeEnv?.variables
        .filter((v) => v.enabled !== false && !v.secret)
        .forEach((v) => {
          varMap[v.name] = String(v.value ?? '')
        })

      const resolve = (s: string) => resolveVariables(s, varMap)

      // Headers: disk format is Record<string, string> | null
      const rawHeaders = content.headers ?? {}
      const resolvedHeaders: Record<string, string> = {}
      for (const [k, v] of Object.entries(rawHeaders)) {
        resolvedHeaders[resolve(k)] = resolve(v)
      }

      // Params
      const rawParams = content.params ?? {}
      const resolvedParams: Record<string, string> = {}
      for (const [k, v] of Object.entries(rawParams)) {
        resolvedParams[resolve(k)] = resolve(v)
      }

      // Body — map from the RequestBody disk shape (active_type + typed fields)
      const diskBody = content.body
      type BodyType = ResolvedRequest['bodyType']
      let bodyType: BodyType = 'none'
      let bodyJson = ''
      let bodyRaw = ''
      let bodyRawSubtype = 'text'
      let formFields: ResolvedRequest['formFields'] = []
      let urlEncodedFields: ResolvedRequest['urlEncodedFields'] = []
      let bodyFilePath: string | null = null

      if (diskBody) {
        const t = diskBody.active_type ?? null
        if (t === 'json') {
          bodyType = 'json'
          bodyJson = resolve(diskBody.json ?? '')
        } else if (t === 'text' || t === 'raw') {
          bodyType = 'raw'
          bodyRaw = resolve(diskBody.raw_text ?? diskBody.text ?? '')
          bodyRawSubtype = diskBody.raw_subtype ?? 'text'
        } else if (t === 'form_data' || t === 'form-data') {
          bodyType = 'form-data'
          formFields = (diskBody.form_data ?? []).map((f) => ({
            key: resolve(f.key),
            value: resolve(f.value),
            isFile: f.is_file,
            filePath: f.file_path,
          }))
        } else if (t === 'url_encoded' || t === 'url-encoded') {
          bodyType = 'url-encoded'
          urlEncodedFields = (diskBody.url_encoded ?? []).map((f) => ({
            key: resolve(f.key),
            value: resolve(f.value),
          }))
        } else if (t === 'file') {
          bodyType = 'file'
          bodyFilePath = diskBody.file_path ?? null
        }
      }

      // Strip any query string already baked into the saved URL — params come from content.params
      const baseUrl = resolve(content.url).split('?')[0]

      setResolvedReq({
        method: content.method,
        url: baseUrl,
        headers: resolvedHeaders,
        queryParams: resolvedParams,
        bodyType,
        bodyJson,
        bodyRaw,
        bodyRawSubtype,
        formFields,
        urlEncodedFields,
        bodyFilePath,
      })
    })
  }, [generateCodeModal.isOpen, requestPath])

  const generatedCode = useMemo(() => {
    if (!resolvedReq) return ''
    return generateCode(selectedLang, resolvedReq)
  }, [selectedLang, resolvedReq])

  const handleLangChange = useCallback((lang: CodeLang) => {
    setSelectedLang(lang)
    localStorage.setItem(LANG_KEY, lang)
  }, [])

  const handleCopy = useCallback(async () => {
    if (!generatedCode) return
    await navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [generatedCode])

  const cmLang = selectedLang === 'fetch' ? 'javascript' : 'text'

  if (!generateCodeModal.isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={closeGenerateCodeModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[640px] bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border-subtle shrink-0">
          <div className="flex items-center gap-2">
            <Icons.Code size={15} className="text-text-muted" />
            <h3 className="text-base font-semibold text-text-primary">Generate Code</h3>
            {requestName && <span className="text-sm text-text-muted">— {requestName}</span>}
          </div>
          <button
            onClick={closeGenerateCodeModal}
            className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
          >
            <Icons.X size={16} />
          </button>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border-subtle shrink-0">
          <label className="text-xs text-text-muted shrink-0">Language</label>
          <select
            value={selectedLang}
            onChange={(e) => handleLangChange(e.target.value as CodeLang)}
            className="h-7 px-2 text-xs bg-bg-muted border border-border-subtle rounded text-text-primary focus:outline-none focus:border-accent transition-colors cursor-pointer"
          >
            {LANG_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Code output */}
        <div className="flex-1 overflow-auto min-h-[200px] max-h-[420px]">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-text-muted text-sm gap-2">
              <Icons.Loader size={14} className="animate-spin" />
              Loading request…
            </div>
          ) : loadError ? (
            <div className="p-5 text-red-400 text-xs">Failed to load request: {loadError}</div>
          ) : (
            <CodeEditor
              value={generatedCode}
              onChange={() => {}}
              language={cmLang}
              readOnly
              wordWrap
            />
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3 border-t border-border-subtle bg-bg-surface">
          <button
            onClick={handleCopy}
            disabled={loading || !!loadError || !generatedCode}
            className="flex items-center gap-1.5 h-7 px-3 text-xs font-medium text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-default rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? (
              <>
                <Icons.Check size={12} className="text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Icons.Copy size={12} />
                Copy to Clipboard
              </>
            )}
          </button>

          <button
            onClick={closeGenerateCodeModal}
            className="h-7 px-3 text-xs font-medium text-text-muted hover:text-text-primary border border-border-subtle hover:border-border-default rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default GenerateCodeModal
