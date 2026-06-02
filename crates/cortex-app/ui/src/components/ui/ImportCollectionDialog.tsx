import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import * as Icons from './Icons'
import { useUIStore } from '../../stores/uiStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { commands } from '../../bindings'
import { toast } from '../../stores/toastStore'

type Step = 'preview' | 'conflict' | 'importing'

interface Preview {
  collectionName: string
  requestCount: number
  filePath: string
  destDir: string | null
}

const ImportCollectionDialog: React.FC = () => {
  const { importCollectionDialog, closeImportCollectionDialog } = useUIStore()
  const { activeWorkspacePath, loadWorkspace } = useWorkspaceStore()

  const [step, setStep] = useState<Step>('preview')
  const [preview, setPreview] = useState<Preview | null>(null)
  const [conflictPath, setConflictPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [picking, setPicking] = useState(false)

  const { isOpen, format } = importCollectionDialog

  const pickAndPreview = async () => {
    if (!format) return
    setPicking(true)
    setError(null)
    try {
      const isZip = format === 'zip'
      const filterName = isZip ? 'Cortex Archive' : 'Cortex Bundle'
      const ext = isZip ? 'zip' : 'yaml'

      const pickRes = await commands.pickFile('Import Collection', filterName, ext)
      if (pickRes.status !== 'ok' || !pickRes.data) {
        closeImportCollectionDialog()
        return
      }

      const filePath = pickRes.data
      const previewRes = isZip
        ? await commands.previewImportZip(filePath)
        : await commands.previewImportBundle(filePath)

      if (previewRes.status !== 'ok') {
        setError(previewRes.error)
        setPicking(false)
        return
      }

      setPreview({
        collectionName: previewRes.data.collection_name,
        requestCount: previewRes.data.request_count,
        filePath,
        destDir: null,
      })
    } catch (e) {
      setError(String(e))
    } finally {
      setPicking(false)
    }
  }

  // When the dialog opens, immediately trigger the file picker
  useEffect(() => {
    if (!isOpen || !format) return

    // We use a small timeout to avoid "setState synchronously within an effect" warning
    // and to ensure the modal transition has started before the native picker opens.
    const timer = setTimeout(() => {
      setStep('preview')
      setPreview(null)
      setConflictPath(null)
      setError(null)
      pickAndPreview()
    }, 10)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handlePickDestination = async () => {
    if (!preview) return
    setPicking(true)
    setError(null)
    try {
      const dirRes = await commands.pickDirectory('Choose destination folder')
      if (dirRes.status !== 'ok' || !dirRes.data) {
        setPicking(false)
        return
      }
      await runExtract(preview.filePath, dirRes.data, false)
    } catch (e) {
      setError(String(e))
      setPicking(false)
    }
  }

  const runExtract = async (filePath: string, destDir: string, replace: boolean) => {
    if (!format) return
    setStep('importing')
    setError(null)
    try {
      const isZip = format === 'zip'
      const extractRes = isZip
        ? await commands.extractCollectionZip(filePath, destDir, replace)
        : await commands.extractCollectionBundle(filePath, destDir, replace)

      if (extractRes.status !== 'ok') {
        const err = extractRes.error
        if (err.startsWith('CONFLICT:')) {
          const conflicted = err.slice('CONFLICT:'.length)
          setPreview((p) => (p ? { ...p, destDir } : p))
          setConflictPath(conflicted)
          setStep('conflict')
          setPicking(false)
          return
        }
        setError(err)
        setStep('preview')
        setPicking(false)
        return
      }

      const newCollectionPath = extractRes.data

      if (activeWorkspacePath) {
        const addRes = await commands.addCollectionToWorkspace(
          activeWorkspacePath,
          newCollectionPath
        )
        if (addRes.status === 'ok') {
          await loadWorkspace(activeWorkspacePath)
        }
      }

      closeImportCollectionDialog()
      const name = preview?.collectionName ?? 'Collection'
      toast.success(`"${name}" imported successfully`)
    } catch (e) {
      setError(String(e))
      setStep('preview')
      setPicking(false)
    }
  }

  const handleReplaceConflict = async () => {
    if (!preview?.filePath || !preview.destDir) return
    setPicking(true)
    await runExtract(preview.filePath, preview.destDir, true)
  }

  const handleCancelConflict = () => {
    setStep('preview')
    setConflictPath(null)
  }

  if (!isOpen) return null

  const formatLabel = format === 'zip' ? 'ZIP archive' : 'YAML bundle'

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={closeImportCollectionDialog}
      />
      <div className="relative w-full max-w-md bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h3 className="text-base font-semibold text-text-primary">
            Import from {format === 'zip' ? 'ZIP Archive' : 'YAML Bundle'}
          </h3>
          <button
            onClick={closeImportCollectionDialog}
            className="p-1 hover:bg-bg-muted rounded text-text-muted hover:text-text-primary transition-colors"
          >
            <Icons.X size={16} />
          </button>
        </div>

        <div className="px-5 pb-5">
          {/* Loading / picking state */}
          {picking && !preview && (
            <div className="flex items-center gap-3 py-6 text-text-muted text-sm">
              <Icons.Loader size={15} className="animate-spin shrink-0" />
              {step === 'importing' ? 'Importing collection…' : `Reading ${formatLabel}…`}
            </div>
          )}

          {/* Error without preview */}
          {error && !preview && (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <Icons.AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300 break-all">{error}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={closeImportCollectionDialog}
                  className="h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Preview step */}
          {preview && step === 'preview' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border-subtle bg-bg-surface p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-bg-muted rounded-md shrink-0">
                    <Icons.Folder size={14} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {preview.collectionName}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {preview.requestCount} request{preview.requestCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {error && <p className="text-xs text-red-400 break-all">{error}</p>}

              <p className="text-xs text-text-muted">
                Choose the folder where this collection will be created.
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeImportCollectionDialog}
                  className="h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePickDestination}
                  disabled={picking}
                  className="flex items-center gap-2 h-8 px-4 text-sm font-medium bg-accent hover:bg-accent/90 text-white rounded transition-colors disabled:opacity-60"
                >
                  {picking ? (
                    <>
                      <Icons.Loader size={13} className="animate-spin" />
                      Importing…
                    </>
                  ) : (
                    <>
                      <Icons.Download size={13} />
                      Choose destination…
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Conflict step */}
          {step === 'conflict' && conflictPath && (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <Icons.AlertTriangle size={14} className="text-yellow-300 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-yellow-300">Directory already exists</p>
                  <p className="text-xs text-text-muted break-all">{conflictPath}</p>
                  <p className="text-xs text-text-muted">
                    Replacing will overwrite the existing collection directory.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelConflict}
                  className="h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReplaceConflict}
                  disabled={picking}
                  className="flex items-center gap-2 h-8 px-4 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded transition-colors disabled:opacity-60"
                >
                  {picking ? (
                    <>
                      <Icons.Loader size={13} className="animate-spin" />
                      Replacing…
                    </>
                  ) : (
                    'Replace'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Importing step */}
          {step === 'importing' && picking && (
            <div className="flex items-center gap-3 py-6 text-text-muted text-sm">
              <Icons.Loader size={15} className="animate-spin shrink-0" />
              Importing collection…
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ImportCollectionDialog
