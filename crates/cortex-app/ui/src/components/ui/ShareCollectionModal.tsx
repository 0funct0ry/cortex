import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import * as Icons from './Icons'
import { useUIStore } from '../../stores/uiStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { commands } from '../../bindings'
import { toast } from '../../stores/toastStore'

type Tab = 'git' | 'export'
type ExportFormat = 'zip' | 'yaml'
type GitStatus = 'loading' | 'initialized' | 'not_initialized' | 'error'

// ── Root modal ────────────────────────────────────────────────────────────────

const ShareCollectionModal: React.FC = () => {
  const { shareModal, closeShareModal } = useUIStore()
  const { collections, loadCollection } = useCollectionStore()
  const [activeTab, setActiveTab] = useState<Tab>('git')
  const [gitStatus, setGitStatus] = useState<GitStatus>('loading')
  const [gitError, setGitError] = useState<string | null>(null)
  const [gitInitializing, setGitInitializing] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat>('zip')
  const [exportError, setExportError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const { collectionPath, collectionName } = shareModal

  const secretCount = React.useMemo(() => {
    if (!collectionPath) return 0
    const col = collections[collectionPath]
    return col?.manifest.variables?.filter((v) => v.secret).length ?? 0
  }, [collections, collectionPath])

  const checkGit = useCallback(async () => {
    if (!collectionPath) return
    setGitStatus('loading')
    setGitError(null)
    try {
      const res = await commands.checkGitInitialized(collectionPath)
      if (res.status === 'ok') {
        setGitStatus(res.data ? 'initialized' : 'not_initialized')
      } else {
        setGitStatus('error')
        setGitError(res.error)
      }
    } catch (e) {
      setGitStatus('error')
      setGitError(String(e))
    }
  }, [collectionPath])

  useEffect(() => {
    if (shareModal.isOpen && activeTab === 'git') {
      // Use timeout to avoid "setState synchronously within an effect"
      const timer = setTimeout(() => {
        checkGit()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [shareModal.isOpen, activeTab, checkGit])

  useEffect(() => {
    if (shareModal.isOpen) {
      // Use timeout to avoid "setState synchronously within an effect"
      setTimeout(() => {
        setActiveTab('git')
        setExportFormat('zip')
        setExportError(null)
        setGitError(null)
      }, 0)
    }
  }, [shareModal.isOpen])

  const handleGitInit = async () => {
    if (!collectionPath) return
    setGitInitializing(true)
    setGitError(null)
    try {
      const res = await commands.gitInitCollection(collectionPath)
      if (res.status === 'ok') {
        setGitStatus('initialized')
        // Reload the collection so is_git_repo flips to true → indicator appears in sidebar
        loadCollection(collectionPath)
      } else {
        setGitError(res.error)
      }
    } catch (e) {
      setGitError(String(e))
    } finally {
      setGitInitializing(false)
    }
  }

  const handleProceed = async () => {
    if (!collectionPath || !collectionName) return

    const slugName = collectionName.replace(/\s+/g, '-')
    const date = new Date().toISOString().split('T')[0]
    const isZip = exportFormat === 'zip'
    const filterName = isZip ? 'Cortex Archive' : 'Cortex Bundle'
    const ext = isZip ? 'zip' : 'yaml'
    const defaultName = `${slugName}-${date}.${ext}`

    try {
      const saveRes = await commands.saveFile('Export Collection', filterName, ext, defaultName)
      if (saveRes.status !== 'ok' || !saveRes.data) return

      const destPath = saveRes.data
      setExporting(true)
      setExportError(null)

      const exportRes = isZip
        ? await commands.exportCollectionZip(collectionPath, destPath)
        : await commands.exportCollectionBundle(collectionPath, destPath)

      if (exportRes.status === 'ok') {
        closeShareModal()
        const filename = destPath.split('/').pop() ?? destPath
        toast.success(`Exported to "${filename}"`)
      } else {
        setExportError(exportRes.error)
      }
    } catch (e) {
      setExportError(String(e))
    } finally {
      setExporting(false)
    }
  }

  if (!shareModal.isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={closeShareModal}
      />
      <div className="relative w-full max-w-lg bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
          <h3 className="text-base font-semibold text-text-primary">Share Collection</h3>
          <button
            onClick={closeShareModal}
            className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
          >
            <Icons.X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-subtle px-5 shrink-0">
          {(['git', 'export'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              {tab === 'git' ? 'Git' : 'Export'}
            </button>
          ))}
        </div>

        {/* Tab body */}
        <div className="overflow-y-auto flex-1 p-5">
          {activeTab === 'git' ? (
            <GitTab
              gitStatus={gitStatus}
              gitError={gitError}
              gitInitializing={gitInitializing}
              onInit={handleGitInit}
            />
          ) : (
            <ExportTab
              exportFormat={exportFormat}
              onFormatChange={setExportFormat}
              secretCount={secretCount}
              onProceed={handleProceed}
              exporting={exporting}
              exportError={exportError}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Git tab ───────────────────────────────────────────────────────────────────

interface GitTabProps {
  gitStatus: GitStatus
  gitError: string | null
  gitInitializing: boolean
  onInit: () => void
}

const GitTab: React.FC<GitTabProps> = ({ gitStatus, gitError, gitInitializing, onInit }) => (
  <div className="space-y-4">
    <p className="text-sm text-text-secondary leading-relaxed">
      Cortex collections are plain-text YAML files — perfect for version control. Store your APIs
      alongside your code.
    </p>

    <div className="rounded-lg border border-border-subtle bg-bg-surface p-4 space-y-3">
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Why Git?</p>
      <ul className="space-y-2">
        {[
          'Full history of every API change',
          'Collaborate with your team via pull requests',
          'Sync collections across machines',
          'Keep APIs versioned with your codebase',
        ].map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-sm text-text-secondary">
            <Icons.Check size={13} className="text-accent mt-0.5 shrink-0" />
            {benefit}
          </li>
        ))}
      </ul>
    </div>

    <div className="rounded-lg border border-border-subtle bg-bg-surface p-4">
      {gitStatus === 'loading' && (
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Icons.Loader size={14} className="animate-spin shrink-0" />
          Checking repository status…
        </div>
      )}

      {gitStatus === 'not_initialized' && (
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">
            Initialize a Git repository in this collection's directory to start tracking changes.
          </p>
          <button
            onClick={onInit}
            disabled={gitInitializing}
            className="flex items-center gap-2 h-8 px-4 text-sm font-medium bg-accent hover:bg-accent/90 text-white rounded transition-colors disabled:opacity-60"
          >
            {gitInitializing ? (
              <>
                <Icons.Loader size={13} className="animate-spin" />
                Initializing…
              </>
            ) : (
              <>
                <Icons.Branch size={13} />
                Initialize Git Repository
              </>
            )}
          </button>
          {gitError && <p className="text-xs text-red-400 font-mono break-all">{gitError}</p>}
        </div>
      )}

      {gitStatus === 'initialized' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-text-primary font-medium">
            <Icons.Check size={14} className="text-green-400 shrink-0" />
            Git repository already initialized
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Push to GitHub, GitLab, Gitea, or Bitbucket and share the repository URL with your team.
          </p>
        </div>
      )}

      {gitStatus === 'error' && (
        <div className="space-y-2">
          <p className="text-sm text-red-400">Failed to check Git status</p>
          {gitError && <p className="text-xs text-text-muted font-mono break-all">{gitError}</p>}
        </div>
      )}
    </div>
  </div>
)

// ── Export tab ────────────────────────────────────────────────────────────────

interface ExportTabProps {
  exportFormat: ExportFormat
  onFormatChange: (f: ExportFormat) => void
  secretCount: number
  onProceed: () => void
  exporting: boolean
  exportError: string | null
}

const ExportTab: React.FC<ExportTabProps> = ({
  exportFormat,
  onFormatChange,
  secretCount,
  onProceed,
  exporting,
  exportError,
}) => (
  <div className="space-y-5">
    {/* Native format cards */}
    <div className="space-y-2.5">
      <FormatCard
        selected={exportFormat === 'zip'}
        onClick={() => onFormatChange('zip')}
        title="Cortex Collection (ZIP)"
        badge="Recommended"
        caption="Full folder structure with individual .crx and .yaml files."
        bullets={[
          'Folder structure preserved',
          'Collaborate via pull requests after extraction',
          'Open directly in Cortex after unzipping',
        ]}
        bestFor="Team collaboration, version control, long-term storage"
      />
      <FormatCard
        selected={exportFormat === 'yaml'}
        onClick={() => onFormatChange('yaml')}
        title="Single File (.yaml)"
        badge="Quick share"
        caption="Entire collection bundled into one YAML file."
        bullets={[
          'Everything in a single file',
          'Paste into a gist or attach to an issue',
          'Import directly into Cortex',
        ]}
        bestFor="Quick sharing as a single file (email, Slack, GitHub Gist)"
      />
    </div>

    {/* Other Formats (disabled preview) */}
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
        Other Formats
      </p>
      <div className="space-y-2">
        {[
          { title: 'Postman', caption: 'Export for Postman (coming in Epic 10)' },
          {
            title: 'OpenAPI Specification',
            caption: 'Export as OpenAPI spec (coming in Epic 10)',
          },
        ].map(({ title, caption }) => (
          <div
            key={title}
            title="Coming soon"
            className="flex items-center gap-3 p-3 rounded-lg border border-border-subtle bg-bg-surface opacity-40 cursor-not-allowed select-none"
          >
            <div className="p-1.5 bg-bg-muted rounded-md shrink-0">
              <Icons.Code size={13} className="text-text-muted" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">{title}</div>
              <div className="text-xs text-text-muted">{caption}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Secret variable warning */}
    {secretCount > 0 && (
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">
        <Icons.AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          This collection contains{' '}
          <span className="font-semibold">
            {secretCount} secret variable{secretCount !== 1 ? 's' : ''}
          </span>
          . Their values will be redacted in the export.
        </p>
      </div>
    )}

    {/* Export error */}
    {exportError && <p className="text-xs text-red-400 break-all">{exportError}</p>}

    {/* Proceed */}
    <div className="flex justify-end">
      <button
        onClick={onProceed}
        disabled={exporting}
        className="flex items-center gap-2 h-8 px-5 text-sm font-medium bg-accent hover:bg-accent/90 text-white rounded transition-colors disabled:opacity-60"
      >
        {exporting ? (
          <>
            <Icons.Loader size={13} className="animate-spin" />
            Exporting…
          </>
        ) : (
          'Proceed'
        )}
      </button>
    </div>
  </div>
)

// ── Format card ───────────────────────────────────────────────────────────────

interface FormatCardProps {
  selected: boolean
  onClick: () => void
  title: string
  badge: string
  caption: string
  bullets: string[]
  bestFor: string
}

const FormatCard: React.FC<FormatCardProps> = ({
  selected,
  onClick,
  title,
  badge,
  caption,
  bullets,
  bestFor,
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 rounded-lg border transition-all ${
      selected
        ? 'border-accent bg-accent/5'
        : 'border-border-subtle bg-bg-surface hover:border-border-default hover:bg-bg-muted'
    }`}
  >
    <div className="flex items-start justify-between gap-2 mb-1.5">
      <span className="text-sm font-semibold text-text-primary">{title}</span>
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-bg-muted text-text-muted shrink-0">
        {badge}
      </span>
    </div>
    <p className="text-xs text-text-muted mb-2">{caption}</p>
    <ul className="space-y-1 mb-2">
      {bullets.map((b) => (
        <li key={b} className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span className="w-1 h-1 rounded-full bg-text-muted shrink-0" />
          {b}
        </li>
      ))}
    </ul>
    <p className="text-[11px] text-text-muted">
      <span className="font-medium">Best for:</span> {bestFor}
    </p>
  </button>
)

export default ShareCollectionModal
