import React, { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { commands } from '../../bindings'
import type { ImportAction, ImportDecision, ImportFileEntry } from '../../bindings'
import { useCollectionStore } from '../../stores/collectionStore'
import { toast } from '../../stores/toastStore'

// ─── Types ────────────────────────────────────────────────────────────────────

type ConflictChoice = 'skip' | 'replace' | 'rename'

interface FileRow extends ImportFileEntry {
  conflictChoice: ConflictChoice
  renameValue: string
}

type Step = 'pick' | 'preview' | 'summary'

interface ImportFolderDialogProps {
  isOpen: boolean
  onClose: () => void
  targetPath: string | null
  targetType: 'collection' | 'folder' | null
  collectionPath: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDecisions(rows: FileRow[]): ImportDecision[] {
  return rows.map((row) => {
    let action: ImportAction
    if (row.parse_error) {
      action = { type: 'Skip' }
    } else if (row.conflictChoice === 'skip') {
      action = { type: 'Skip' }
    } else if (row.conflictChoice === 'replace') {
      action = { type: 'Replace' }
    } else {
      action = { type: 'Rename', value: row.renameValue || `${row.name} (imported)` }
    }
    return { rel_path: row.rel_path, action }
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ row: FileRow }> = ({ row }) => {
  if (row.parse_error) {
    return (
      <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 shrink-0">
        Error
      </span>
    )
  }
  if (row.conflicts) {
    return (
      <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400 shrink-0">
        Conflict
      </span>
    )
  }
  return (
    <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 shrink-0">
      OK
    </span>
  )
}

// ─── Main Dialog ──────────────────────────────────────────────────────────────

const ImportFolderDialog: React.FC<ImportFolderDialogProps> = ({
  isOpen,
  onClose,
  targetPath,
  collectionPath,
}) => {
  const { loadCollection } = useCollectionStore()

  const [step, setStep] = useState<Step>('pick')
  const [sourceDir, setSourceDir] = useState<string | null>(null)
  const [rows, setRows] = useState<FileRow[]>([])
  const [skippedNonCrx, setSkippedNonCrx] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [summaryImported, setSummaryImported] = useState(0)
  const [summarySkipped, setSummarySkipped] = useState(0)
  const [summaryFailed, setSummaryFailed] = useState<[string, string][]>([])

  const handlePickFolder = useCallback(async () => {
    const res = await commands.pickDirectory('Choose folder to import from')
    if (res.status !== 'ok' || !res.data) return

    const dir = res.data
    setSourceDir(dir)
    setIsScanning(true)

    try {
      const scanRes = await commands.scanImportFolder(dir, targetPath ?? '')
      if (scanRes.status !== 'ok') {
        toast.error(`Scan failed: ${scanRes.error}`)
        return
      }

      const { files, skipped_non_crx } = scanRes.data
      setSkippedNonCrx(skipped_non_crx)
      setRows(
        files.map((f) => ({
          ...f,
          conflictChoice: f.conflicts ? 'skip' : 'replace',
          renameValue: f.conflicts ? `${f.name} (imported)` : '',
        }))
      )
      setStep('preview')
    } catch (e) {
      toast.error(`Scan error: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setIsScanning(false)
    }
  }, [targetPath])

  const handleImport = useCallback(async () => {
    if (!sourceDir || !targetPath) return
    setIsImporting(true)

    try {
      const decisions = buildDecisions(rows)
      const res = await commands.bulkImportFolder(sourceDir, targetPath, decisions)
      if (res.status !== 'ok') {
        toast.error(`Import failed: ${res.error}`)
        return
      }

      const { imported, skipped, failed } = res.data
      setSummaryImported(imported)
      setSummarySkipped(skipped)
      setSummaryFailed(failed)
      setStep('summary')

      if (collectionPath) {
        await loadCollection(collectionPath)
      }
    } catch (e) {
      toast.error(`Import error: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setIsImporting(false)
    }
  }, [sourceDir, targetPath, rows, collectionPath, loadCollection])

  const handleOverlayKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  const importableCount = rows.filter((r) => !r.parse_error && r.conflictChoice !== 'skip').length

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onKeyDown={handleOverlayKeyDown}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-10 bg-bg-panel border border-border-subtle rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle shrink-0">
          <h2 className="text-sm font-semibold text-text-primary">Import from folder</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
          {step === 'pick' && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <p className="text-sm text-text-secondary text-center max-w-sm">
                Select a directory on your filesystem. All <code className="text-accent">.crx</code>{' '}
                files (including nested subdirectories) will be scanned and previewed before import.
              </p>
              <button
                onClick={handlePickFolder}
                disabled={isScanning}
                className="px-4 py-2 rounded-lg bg-accent text-accent-fg text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
              >
                {isScanning ? 'Scanning…' : 'Choose folder…'}
              </button>
            </div>
          )}

          {step === 'preview' && (
            <div className="flex flex-col gap-3">
              {/* Source path */}
              <div className="text-xs text-text-muted bg-bg-base rounded-lg px-3 py-2 font-mono truncate">
                {sourceDir}
              </div>

              {/* Stats row */}
              <div className="flex gap-4 text-xs text-text-secondary">
                <span>
                  {rows.length} .crx file{rows.length !== 1 ? 's' : ''} found
                </span>
                {skippedNonCrx > 0 && (
                  <span className="text-text-muted">{skippedNonCrx} non-.crx skipped</span>
                )}
              </div>

              {rows.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-6">
                  No .crx files found in the selected folder.
                </p>
              ) : (
                <div className="border border-border-subtle rounded-lg overflow-hidden">
                  {rows.map((row, idx) => (
                    <div
                      key={row.rel_path}
                      className={`px-3 py-2.5 flex flex-col gap-1.5 ${idx !== 0 ? 'border-t border-border-subtle' : ''} ${row.parse_error ? 'opacity-60' : ''}`}
                    >
                      {/* File path + badge */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono text-text-primary truncate flex-1">
                          {row.rel_path}
                        </span>
                        <StatusBadge row={row} />
                      </div>

                      {/* Parse error message */}
                      {row.parse_error && (
                        <p className="text-xs text-red-400 font-mono">{row.parse_error}</p>
                      )}

                      {/* Conflict resolution */}
                      {!row.parse_error && row.conflicts && (
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs text-text-muted">
                            A file with this name already exists:
                          </span>
                          <div className="flex gap-2">
                            {(['skip', 'replace', 'rename'] as ConflictChoice[]).map((choice) => (
                              <label
                                key={choice}
                                className="flex items-center gap-1.5 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={`conflict-${row.rel_path}`}
                                  checked={row.conflictChoice === choice}
                                  onChange={() =>
                                    setRows((prev) =>
                                      prev.map((r, i) =>
                                        i === idx ? { ...r, conflictChoice: choice } : r
                                      )
                                    )
                                  }
                                  className="accent-accent"
                                />
                                <span className="text-xs text-text-secondary capitalize">
                                  {choice}
                                </span>
                              </label>
                            ))}
                          </div>
                          {row.conflictChoice === 'rename' && (
                            <input
                              type="text"
                              value={row.renameValue}
                              onChange={(e) =>
                                setRows((prev) =>
                                  prev.map((r, i) =>
                                    i === idx ? { ...r, renameValue: e.target.value } : r
                                  )
                                )
                              }
                              placeholder="New name…"
                              className="flex-1 min-w-[140px] px-2 py-0.5 text-xs rounded border border-border-strong bg-bg-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'summary' && (
            <div className="flex flex-col gap-4 py-4">
              <div className="flex gap-6 justify-center text-sm">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-bold text-green-400">{summaryImported}</span>
                  <span className="text-text-muted text-xs">Imported</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-bold text-text-secondary">{summarySkipped}</span>
                  <span className="text-text-muted text-xs">Skipped</span>
                </div>
                {summaryFailed.length > 0 && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-bold text-red-400">{summaryFailed.length}</span>
                    <span className="text-text-muted text-xs">Failed</span>
                  </div>
                )}
              </div>

              {summaryFailed.length > 0 && (
                <div className="border border-border-subtle rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-bg-base border-b border-border-subtle">
                    <span className="text-xs font-medium text-text-secondary">Failed files</span>
                  </div>
                  {summaryFailed.map(([relPath, err]) => (
                    <div
                      key={relPath}
                      className="px-3 py-2 border-t border-border-subtle first:border-t-0"
                    >
                      <p className="text-xs font-mono text-text-primary">{relPath}</p>
                      <p className="text-xs text-red-400 mt-0.5">{err}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border-subtle shrink-0">
          {step === 'pick' && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          )}

          {step === 'preview' && (
            <>
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePickFolder}
                disabled={isScanning || isImporting}
                className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary border border-border-subtle rounded-lg transition-colors disabled:opacity-50"
              >
                Change folder
              </button>
              <button
                onClick={handleImport}
                disabled={importableCount === 0 || isImporting}
                className="px-4 py-1.5 text-sm font-medium rounded-lg bg-accent text-accent-fg hover:bg-accent/90 disabled:opacity-50 transition-colors"
              >
                {isImporting
                  ? 'Importing…'
                  : `Import ${importableCount} file${importableCount !== 1 ? 's' : ''}`}
              </button>
            </>
          )}

          {step === 'summary' && (
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm font-medium rounded-lg bg-accent text-accent-fg hover:bg-accent/90 transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ImportFolderDialog
