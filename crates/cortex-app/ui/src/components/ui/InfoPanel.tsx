import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { commands } from '../../bindings'
import type { ItemInfo } from '../../bindings'

interface InfoPanelProps {
  isOpen: boolean
  onClose: () => void
  path: string
  type: 'folder' | 'request'
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

const InfoPanel: React.FC<InfoPanelProps> = ({ isOpen, onClose, path, type }) => {
  const [info, setInfo] = useState<ItemInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    commands.getItemInfo(path).then((res) => {
      if (cancelled) return
      if (res.status === 'ok') {
        setInfo(res.data)
      } else {
        setError(res.error)
      }
    })
    return () => {
      cancelled = true
      setInfo(null)
      setError(null)
    }
  }, [isOpen, path])

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const rows: { label: string; value: string }[] = info
    ? [
        { label: 'Path', value: info.path },
        { label: 'Size', value: formatBytes(info.size_bytes) },
        ...(info.created ? [{ label: 'Created', value: formatTimestamp(info.created) }] : []),
        ...(info.modified ? [{ label: 'Modified', value: formatTimestamp(info.modified) }] : []),
        ...(info.method != null ? [{ label: 'Method', value: info.method }] : []),
        ...(info.url != null ? [{ label: 'URL', value: info.url }] : []),
        ...(info.direct_request_count != null
          ? [{ label: 'Direct requests', value: String(info.direct_request_count) }]
          : []),
        ...(info.direct_folder_count != null
          ? [{ label: 'Subfolders', value: String(info.direct_folder_count) }]
          : []),
        ...(info.item_count != null
          ? [{ label: 'Total requests', value: String(info.item_count) }]
          : []),
      ]
    : []

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-base font-semibold text-text-primary mb-4">
          {type === 'folder' ? 'Folder Info' : 'Request Info'}
        </h3>

        {error ? (
          <p className="text-sm text-error mb-4">{error}</p>
        ) : !info ? (
          <p className="text-sm text-text-muted mb-4">Loading…</p>
        ) : (
          <table className="w-full text-sm border-collapse mb-4">
            <tbody>
              {rows.map(({ label, value }) => (
                <tr key={label} className="border-b border-border-subtle last:border-0">
                  <td className="py-1.5 pr-4 text-text-muted font-medium w-24 align-top">
                    {label}
                  </td>
                  <td className="py-1.5 text-text-primary break-all">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default InfoPanel
