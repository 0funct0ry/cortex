import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import * as Icons from './Icons'
import { useUIStore } from '../../stores/uiStore'
import { commands } from '../../bindings'
import type { HtmlTheme, OpenApiFormat } from '../../bindings'
import { toast } from '../../stores/toastStore'

type ActiveTab = 'html' | 'markdown' | 'other'
type OtherFormat = 'openapi-yaml' | 'openapi-json' | 'blueprint'

// ── Root component ────────────────────────────────────────────────────────────

const GenerateDocsModal: React.FC = () => {
  const { generateDocsModal, closeGenerateDocsModal } = useUIStore()

  // Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('html')

  // HTML options
  const [htmlTheme, setHtmlTheme] = useState<HtmlTheme>('cortex')
  const [htmlTryItOut, setHtmlTryItOut] = useState(true)
  const [htmlResolveVars, setHtmlResolveVars] = useState(false)
  const [htmlIncludeScripts, setHtmlIncludeScripts] = useState(false)
  const [htmlIncludeTags, setHtmlIncludeTags] = useState(true)

  // Markdown options
  const [mdResolveVars, setMdResolveVars] = useState(false)
  const [mdCollapseExamples, setMdCollapseExamples] = useState(true)
  const [mdIncludeScripts, setMdIncludeScripts] = useState(false)
  const [mdIncludeTags, setMdIncludeTags] = useState(true)
  const [mdHeadingOffset, setMdHeadingOffset] = useState(1)

  // Other formats
  const [otherFormat, setOtherFormat] = useState<OtherFormat>('openapi-yaml')

  // Action state
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const { collectionPath, collectionName } = generateDocsModal

  // Reset on open
  useEffect(() => {
    if (generateDocsModal.isOpen) {
      const id = setTimeout(() => {
        setActiveTab('html')
        setGenError(null)
        setCopied(false)
        setSaveError(null)
      }, 0)
      return () => clearTimeout(id)
    }
  }, [generateDocsModal.isOpen])

  // ── Generation (on-demand) ──────────────────────────────────────────────────

  const runGeneration = useCallback(async (): Promise<string | null> => {
    if (!collectionPath) return null
    setGenerating(true)
    setGenError(null)
    setSaveError(null)

    try {
      let res: { status: 'ok'; data: string } | { status: 'error'; error: string }

      if (activeTab === 'html') {
        res = await commands.generateDocsHtml(collectionPath, {
          theme: htmlTheme,
          includeTryItOut: htmlTryItOut,
          resolveNonSecretVars: htmlResolveVars,
          includeScripts: htmlIncludeScripts,
          includeTags: htmlIncludeTags,
        })
      } else if (activeTab === 'markdown') {
        res = await commands.generateDocsMarkdown(collectionPath, {
          resolveNonSecretVars: mdResolveVars,
          collapseExamples: mdCollapseExamples,
          includeScripts: mdIncludeScripts,
          includeTags: mdIncludeTags,
          headingOffset: mdHeadingOffset,
        })
      } else {
        if (otherFormat === 'openapi-yaml') {
          res = await commands.generateDocsOpenapi(collectionPath, {
            format: 'yaml' as OpenApiFormat,
          })
        } else if (otherFormat === 'openapi-json') {
          res = await commands.generateDocsOpenapi(collectionPath, {
            format: 'json' as OpenApiFormat,
          })
        } else {
          res = await commands.generateDocsApiBlueprint(collectionPath)
        }
      }

      if (res.status === 'ok') {
        return res.data
      } else {
        setGenError(res.error)
        return null
      }
    } catch (e) {
      setGenError(String(e))
      return null
    } finally {
      setGenerating(false)
    }
  }, [
    collectionPath,
    activeTab,
    htmlTheme,
    htmlTryItOut,
    htmlResolveVars,
    htmlIncludeScripts,
    htmlIncludeTags,
    mdResolveVars,
    mdCollapseExamples,
    mdIncludeScripts,
    mdIncludeTags,
    mdHeadingOffset,
    otherFormat,
  ])

  // ── Copy / Save ─────────────────────────────────────────────────────────────

  const handleCopy = async () => {
    const output = await runGeneration()
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const handleSave = async () => {
    if (!collectionPath || !collectionName) return

    const slug = collectionName.replace(/\s+/g, '-').toLowerCase()
    const date = new Date().toISOString().split('T')[0]

    let title: string
    let filterName: string
    let ext: string
    let defaultName: string

    if (activeTab === 'html') {
      const themeLabel = htmlTheme === 'scalar' ? 'scalar' : 'docs'
      title = 'Save HTML Documentation'
      filterName = 'HTML File'
      ext = 'html'
      defaultName = `${slug}-${themeLabel}-${date}.html`
    } else if (activeTab === 'markdown') {
      title = 'Save Markdown Documentation'
      filterName = 'Markdown Document'
      ext = 'md'
      defaultName = `${slug}-docs-${date}.md`
    } else {
      if (otherFormat === 'openapi-yaml') {
        title = 'Save OpenAPI Specification'
        filterName = 'OpenAPI Specification'
        ext = 'yaml'
        defaultName = `${slug}-openapi-${date}.yaml`
      } else if (otherFormat === 'openapi-json') {
        title = 'Save OpenAPI Specification'
        filterName = 'OpenAPI Specification'
        ext = 'json'
        defaultName = `${slug}-openapi-${date}.json`
      } else {
        title = 'Save API Blueprint'
        filterName = 'API Blueprint'
        ext = 'apib'
        defaultName = `${slug}-${date}.apib`
      }
    }

    try {
      const saveRes = await commands.saveFile(title, filterName, ext, defaultName)
      if (saveRes.status !== 'ok' || !saveRes.data) return
      const destPath = saveRes.data

      setSaving(true)
      const output = await runGeneration()
      if (!output) return

      const writeRes = await commands.writeTextFile(destPath, output)
      if (writeRes.status === 'ok') {
        closeGenerateDocsModal()
        const filename = destPath.split('/').pop() ?? destPath
        toast.success(`Saved "${filename}"`)
      } else {
        setSaveError(writeRes.error)
      }
    } catch (e) {
      setSaveError(String(e))
    } finally {
      setSaving(false)
    }
  }

  if (!generateDocsModal.isOpen) return null

  const isBusy = generating || saving

  // ── Render ──────────────────────────────────────────────────────────────────

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={closeGenerateDocsModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[540px] bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border-subtle shrink-0">
          <div className="flex items-center gap-2">
            <Icons.Code size={15} className="text-text-muted" />
            <h3 className="text-base font-semibold text-text-primary">Generate Documentation</h3>
            {collectionName && <span className="text-sm text-text-muted">— {collectionName}</span>}
          </div>
          <button
            onClick={closeGenerateDocsModal}
            className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
          >
            <Icons.X size={16} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border-subtle px-5 shrink-0">
          {(['html', 'markdown', 'other'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setGenError(null)
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              {tab === 'html' ? 'HTML' : tab === 'markdown' ? 'Markdown' : 'Other Formats'}
            </button>
          ))}
        </div>

        {/* Options */}
        <div className="overflow-y-auto flex-1 p-5">
          {activeTab === 'html' && (
            <HtmlOptionsPanel
              theme={htmlTheme}
              onThemeChange={setHtmlTheme}
              tryItOut={htmlTryItOut}
              onTryItOutChange={setHtmlTryItOut}
              resolveVars={htmlResolveVars}
              onResolveVarsChange={setHtmlResolveVars}
              includeScripts={htmlIncludeScripts}
              onIncludeScriptsChange={setHtmlIncludeScripts}
              includeTags={htmlIncludeTags}
              onIncludeTagsChange={setHtmlIncludeTags}
            />
          )}
          {activeTab === 'markdown' && (
            <MarkdownOptionsPanel
              resolveVars={mdResolveVars}
              onResolveVarsChange={setMdResolveVars}
              collapseExamples={mdCollapseExamples}
              onCollapseExamplesChange={setMdCollapseExamples}
              includeScripts={mdIncludeScripts}
              onIncludeScriptsChange={setMdIncludeScripts}
              includeTags={mdIncludeTags}
              onIncludeTagsChange={setMdIncludeTags}
              headingOffset={mdHeadingOffset}
              onHeadingOffsetChange={setMdHeadingOffset}
            />
          )}
          {activeTab === 'other' && (
            <OtherFormatsPanel format={otherFormat} onFormatChange={setOtherFormat} />
          )}
        </div>

        {/* Inline errors */}
        {genError && (
          <div className="shrink-0 px-5 py-2 bg-red-500/10 border-t border-red-500/30 text-red-400 text-xs">
            Generation failed: {genError}
          </div>
        )}
        {saveError && (
          <div className="shrink-0 px-5 py-2 bg-red-500/10 border-t border-red-500/30 text-red-400 text-xs">
            Save failed: {saveError}
          </div>
        )}

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3 border-t border-border-subtle bg-bg-surface">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={isBusy}
              className="flex items-center gap-1.5 h-7 px-3 text-xs font-medium text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-default rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {generating && !saving ? (
                <>
                  <Icons.Loader size={12} className="animate-spin" />
                  Generating…
                </>
              ) : copied ? (
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
              onClick={handleSave}
              disabled={isBusy}
              className="flex items-center gap-1.5 h-7 px-3 text-xs font-medium bg-accent hover:bg-accent/90 text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving || (generating && saving) ? (
                <>
                  <Icons.Loader size={12} className="animate-spin" />
                  {generating ? 'Generating…' : 'Saving…'}
                </>
              ) : (
                <>
                  <Icons.Download size={12} />
                  Save to File
                </>
              )}
            </button>
          </div>

          <button
            onClick={closeGenerateDocsModal}
            disabled={isBusy}
            className="h-7 px-3 text-xs font-medium text-text-muted hover:text-text-primary border border-border-subtle hover:border-border-default rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── HTML options panel ────────────────────────────────────────────────────────

interface HtmlOptionsPanelProps {
  theme: HtmlTheme
  onThemeChange: (t: HtmlTheme) => void
  tryItOut: boolean
  onTryItOutChange: (v: boolean) => void
  resolveVars: boolean
  onResolveVarsChange: (v: boolean) => void
  includeScripts: boolean
  onIncludeScriptsChange: (v: boolean) => void
  includeTags: boolean
  onIncludeTagsChange: (v: boolean) => void
}

const HtmlOptionsPanel: React.FC<HtmlOptionsPanelProps> = ({
  theme,
  onThemeChange,
  tryItOut,
  onTryItOutChange,
  resolveVars,
  onResolveVarsChange,
  includeScripts,
  onIncludeScriptsChange,
  includeTags,
  onIncludeTagsChange,
}) => (
  <div className="space-y-5">
    <div>
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
        Theme
      </p>
      <div className="space-y-1.5">
        <ThemeCard
          selected={theme === 'cortex'}
          onClick={() => onThemeChange('cortex')}
          label="Cortex"
          description="Self-contained, works offline"
        />
        <ThemeCard
          selected={theme === 'scalar'}
          onClick={() => onThemeChange('scalar')}
          label="Scalar"
          description="Requires internet (CDN)"
        />
        {theme === 'scalar' && (
          <p className="text-[11px] text-purple-400 px-1">
            This theme fetches the Scalar library from a CDN. An internet connection is required to
            render it.
          </p>
        )}
        {[
          { label: 'Redoc', description: 'Three-panel OpenAPI layout' },
          { label: 'Stoplight Elements', description: 'Component-based layout' },
          { label: 'ReadMe.io', description: 'ReadMe-compatible page' },
        ].map((t) => (
          <div
            key={t.label}
            title="Coming soon"
            className="p-2 rounded-md border border-border-subtle opacity-40 cursor-not-allowed select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-primary">{t.label}</span>
              <span className="text-[10px] text-text-muted bg-bg-muted px-1 py-0.5 rounded">
                Soon
              </span>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">{t.description}</p>
          </div>
        ))}
      </div>
    </div>

    <div>
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
        Options
      </p>
      <div className="space-y-2">
        <Toggle label="Include try it out" value={tryItOut} onChange={onTryItOutChange} />
        <Toggle
          label="Resolve non-secret variables"
          value={resolveVars}
          onChange={onResolveVarsChange}
        />
        <Toggle label="Include scripts" value={includeScripts} onChange={onIncludeScriptsChange} />
        <Toggle label="Include tags" value={includeTags} onChange={onIncludeTagsChange} />
      </div>
    </div>
  </div>
)

// ── Markdown options panel ────────────────────────────────────────────────────

interface MarkdownOptionsPanelProps {
  resolveVars: boolean
  onResolveVarsChange: (v: boolean) => void
  collapseExamples: boolean
  onCollapseExamplesChange: (v: boolean) => void
  includeScripts: boolean
  onIncludeScriptsChange: (v: boolean) => void
  includeTags: boolean
  onIncludeTagsChange: (v: boolean) => void
  headingOffset: number
  onHeadingOffsetChange: (v: number) => void
}

const MarkdownOptionsPanel: React.FC<MarkdownOptionsPanelProps> = ({
  resolveVars,
  onResolveVarsChange,
  collapseExamples,
  onCollapseExamplesChange,
  includeScripts,
  onIncludeScriptsChange,
  includeTags,
  onIncludeTagsChange,
  headingOffset,
  onHeadingOffsetChange,
}) => (
  <div className="space-y-5">
    <div>
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
        Options
      </p>
      <div className="space-y-2">
        <Toggle
          label="Resolve non-secret variables"
          value={resolveVars}
          onChange={onResolveVarsChange}
        />
        <Toggle
          label="Collapse examples"
          value={collapseExamples}
          onChange={onCollapseExamplesChange}
        />
        <Toggle label="Include scripts" value={includeScripts} onChange={onIncludeScriptsChange} />
        <Toggle label="Include tags" value={includeTags} onChange={onIncludeTagsChange} />
      </div>
    </div>
    <div>
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
        Heading offset
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onHeadingOffsetChange(Math.max(0, headingOffset - 1))}
          className="w-6 h-6 flex items-center justify-center rounded border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-default disabled:opacity-40"
          disabled={headingOffset === 0}
        >
          −
        </button>
        <span className="text-sm text-text-primary w-4 text-center">{headingOffset}</span>
        <button
          onClick={() => onHeadingOffsetChange(Math.min(3, headingOffset + 1))}
          className="w-6 h-6 flex items-center justify-center rounded border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-default disabled:opacity-40"
          disabled={headingOffset === 3}
        >
          +
        </button>
        <span className="text-[11px] text-text-muted">shift heading levels</span>
      </div>
    </div>
  </div>
)

// ── Other formats panel ───────────────────────────────────────────────────────

interface OtherFormatsPanelProps {
  format: OtherFormat
  onFormatChange: (f: OtherFormat) => void
}

const ACTIVE_FORMATS: { id: OtherFormat; label: string; desc: string }[] = [
  { id: 'openapi-yaml', label: 'OpenAPI YAML', desc: 'OpenAPI 3.1 specification' },
  { id: 'openapi-json', label: 'OpenAPI JSON', desc: 'OpenAPI 3.1 specification' },
  { id: 'blueprint', label: 'API Blueprint', desc: '.apib format for Apiary' },
]

const OtherFormatsPanel: React.FC<OtherFormatsPanelProps> = ({ format, onFormatChange }) => (
  <div className="space-y-5">
    <div>
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
        Format
      </p>
      <div className="space-y-1.5">
        {ACTIVE_FORMATS.map((f) => (
          <button
            key={f.id}
            onClick={() => onFormatChange(f.id)}
            className={`w-full text-left p-2.5 rounded-md border transition-colors ${
              format === f.id
                ? 'border-accent bg-accent/5'
                : 'border-border-subtle hover:border-border-default hover:bg-bg-muted'
            }`}
          >
            <div className="text-xs font-medium text-text-primary">{f.label}</div>
            <div className="text-[11px] text-text-muted mt-0.5">{f.desc}</div>
          </button>
        ))}
      </div>
    </div>

    <div>
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
        Coming Soon
      </p>
      <div className="space-y-1.5">
        {[{ label: 'RAML 1.0', desc: 'MuleSoft REST API format' }].map((f) => (
          <div
            key={f.label}
            title="Coming soon"
            className="p-2.5 rounded-md border border-border-subtle opacity-40 cursor-not-allowed select-none"
          >
            <div className="text-xs font-medium text-text-primary">{f.label}</div>
            <div className="text-[11px] text-text-muted mt-0.5">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// ── Shared sub-components ─────────────────────────────────────────────────────

const Toggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({
  label,
  value,
  onChange,
}) => (
  <label className="flex items-center justify-between gap-2 cursor-pointer group">
    <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
      {label}
    </span>
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-8 h-4 rounded-full transition-colors shrink-0 ${
        value ? 'bg-accent' : 'bg-bg-muted border border-border-subtle'
      }`}
    >
      <span
        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
          value ? 'left-4 translate-x-0.5' : 'left-0.5'
        }`}
      />
    </button>
  </label>
)

const ThemeCard: React.FC<{
  selected: boolean
  onClick: () => void
  label: string
  description: string
}> = ({ selected, onClick, label, description }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-2.5 rounded-md border transition-colors ${
      selected
        ? 'border-accent bg-accent/5'
        : 'border-border-subtle hover:border-border-default hover:bg-bg-muted'
    }`}
  >
    <div className="flex items-center gap-1.5">
      <span
        className={`w-3 h-3 rounded-full border-2 shrink-0 ${
          selected ? 'border-accent bg-accent' : 'border-border-default'
        }`}
      />
      <span className="text-xs font-medium text-text-primary">{label}</span>
    </div>
    <p className="text-[11px] text-text-muted mt-0.5 ml-4">{description}</p>
  </button>
)

export default GenerateDocsModal
