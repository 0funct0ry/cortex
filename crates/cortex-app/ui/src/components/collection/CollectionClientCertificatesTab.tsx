import React, { useState } from 'react'
import * as Icons from '../ui/Icons'
import Dialog from '../ui/Dialog'
import { commands } from '../../bindings'
import type { CollectionClientCertificate } from '../../bindings'

interface CollectionClientCertificatesTabProps {
  certificates: CollectionClientCertificate[]
  onChange: (certificates: CollectionClientCertificate[]) => void
}

const getFileName = (filePath: string | null | undefined): string => {
  if (!filePath) return ''
  return filePath.split(/[/\\]/).pop() || ''
}

const CollectionClientCertificatesTab: React.FC<CollectionClientCertificatesTabProps> = ({
  certificates,
  onChange,
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [hostname, setHostname] = useState('')
  const [certFile, setCertFile] = useState('')
  const [keyFile, setKeyFile] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [showPassphraseIndex, setShowPassphraseIndex] = useState<number | null>(null)

  const handlePickCert = async () => {
    try {
      const selected = await commands.pickFile('Select Certificate File', 'Certificate Files', '*')
      if (selected && selected.status === 'ok' && selected.data) {
        setCertFile(selected.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handlePickKey = async () => {
    try {
      const selected = await commands.pickFile('Select Key File', 'Key Files', '*')
      if (selected && selected.status === 'ok' && selected.data) {
        setKeyFile(selected.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSaveCertificate = () => {
    if (!hostname.trim() || !certFile.trim()) return

    const newCert: CollectionClientCertificate = {
      hostname: hostname.trim(),
      cert_file: certFile.trim(),
      key_file: keyFile.trim() || null,
      passphrase: passphrase.trim() || null,
      enabled: true,
    }

    onChange([...certificates, newCert])
    resetForm()
  }

  const resetForm = () => {
    setHostname('')
    setCertFile('')
    setKeyFile('')
    setPassphrase('')
    setIsAdding(false)
  }

  const handleDeleteConfirm = () => {
    if (deleteIndex === null) return
    const updated = certificates.filter((_, idx) => idx !== deleteIndex)
    onChange(updated)
    setDeleteIndex(null)
  }

  const handleToggleCertificate = (index: number) => {
    const updated = [...certificates]
    updated[index] = { ...updated[index], enabled: !updated[index].enabled }
    onChange(updated)
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-bg-base flex flex-col">
      <div className="p-6 max-w-4xl space-y-6 flex-grow">
        {/* Header toolbar */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-text-primary">Client Certificates</h3>
            <p className="text-xs text-text-muted">
              Configure client TLS certificates to attach during handshakes with matching hostnames.
            </p>
          </div>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold bg-accent hover:bg-accent-hover text-accent-fg rounded transition-colors shadow-sm"
            >
              <Icons.Plus size={13} />
              Add Certificate
            </button>
          )}
        </div>

        {/* Sub-form */}
        {isAdding && (
          <div className="p-4 bg-bg-panel/40 border border-border-default rounded-lg space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Add Client Certificate
              </span>
              <button
                onClick={resetForm}
                className="text-text-muted hover:text-text-secondary transition-colors"
              >
                <Icons.X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Hostname / Pattern (e.g. *.internal.example.com)
                </label>
                <input
                  type="text"
                  value={hostname}
                  onChange={(e) => setHostname(e.target.value)}
                  placeholder="*.example.com"
                  className="w-full h-8.5 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-xs text-text-primary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Certificate File (.pem, .crt, .p12, .pfx)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={certFile}
                    placeholder="No file chosen"
                    className="flex-grow h-8 px-2.5 bg-bg-muted border border-border-subtle rounded text-xs text-text-secondary outline-none truncate"
                  />
                  <button
                    onClick={handlePickCert}
                    className="h-8 px-3 text-xs font-medium border border-border-default hover:border-accent rounded bg-bg-panel text-text-secondary hover:text-text-primary transition-all shrink-0"
                  >
                    Browse...
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Key File (Optional for PEM; combined for PKCS#12)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={keyFile}
                    placeholder="No file chosen"
                    className="flex-grow h-8 px-2.5 bg-bg-muted border border-border-subtle rounded text-xs text-text-secondary outline-none truncate"
                  />
                  <button
                    onClick={handlePickKey}
                    className="h-8 px-3 text-xs font-medium border border-border-default hover:border-accent rounded bg-bg-panel text-text-secondary hover:text-text-primary transition-all shrink-0"
                  >
                    Browse...
                  </button>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Passphrase (If encrypted PEM key or PKCS#12 archive)
                </label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Passphrase"
                  className="w-full h-8.5 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-xs text-text-primary outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={resetForm}
                className="h-8 px-4 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCertificate}
                disabled={!hostname.trim() || !certFile.trim()}
                className="h-8 px-4 text-xs font-medium bg-accent hover:bg-accent-hover text-accent-fg rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Certificate
              </button>
            </div>
          </div>
        )}

        {/* Certificates list */}
        {certificates.length === 0 ? (
          <div className="border border-dashed border-border-default rounded-lg py-12 flex flex-col items-center justify-center text-text-muted select-none gap-2">
            <Icons.Settings size={28} className="stroke-text-muted/60" />
            <span className="text-sm font-medium">No client certificates added.</span>
            <span className="text-xs max-w-sm text-center">
              Add TLS client certificates to authenticate this API client with protected servers.
            </span>
          </div>
        ) : (
          <div className="border border-border-subtle rounded-lg overflow-hidden bg-bg-panel/10">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-bg-panel/40 border-b border-border-subtle text-text-secondary font-semibold uppercase tracking-wider select-none">
                  <th className="px-4 py-2.5">Hostname</th>
                  <th className="px-4 py-2.5">Certificate File</th>
                  <th className="px-4 py-2.5">Key File</th>
                  <th className="px-4 py-2.5">Passphrase</th>
                  <th className="px-4 py-2.5 w-16">Enabled</th>
                  <th className="px-4 py-2.5 w-16 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-text-primary">
                {certificates.map((cert, idx) => (
                  <tr key={idx} className="hover:bg-bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-mono">{cert.hostname}</td>
                    <td className="px-4 py-3 truncate max-w-[150px]" title={cert.cert_file}>
                      {getFileName(cert.cert_file)}
                    </td>
                    <td
                      className="px-4 py-3 truncate max-w-[150px]"
                      title={cert.key_file ?? undefined}
                    >
                      {cert.key_file ? (
                        getFileName(cert.key_file)
                      ) : (
                        <span className="text-text-muted italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px]">
                      {cert.passphrase ? (
                        <div className="flex items-center gap-1.5">
                          <span>{showPassphraseIndex === idx ? cert.passphrase : '••••••••'}</span>
                          <button
                            onClick={() =>
                              setShowPassphraseIndex(showPassphraseIndex === idx ? null : idx)
                            }
                            className="text-text-muted hover:text-text-secondary p-0.5"
                          >
                            {showPassphraseIndex === idx ? (
                              <Icons.EyeOff size={11} />
                            ) : (
                              <Icons.Eye size={11} />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-text-muted italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleCertificate(idx)}
                        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          cert.enabled ? 'bg-accent' : 'bg-bg-muted border-border-default'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            cert.enabled ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setDeleteIndex(idx)}
                        className="text-text-muted hover:text-error transition-colors p-1"
                      >
                        <Icons.Trash size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Local-only security footer note */}
      <div className="bg-bg-panel/40 border-t border-border-subtle p-4 flex items-center gap-2 select-none shrink-0 text-xs text-text-muted">
        <Icons.Info size={14} className="stroke-text-muted" />
        <span>Certificates are stored locally on disk and never uploaded anywhere.</span>
      </div>

      <Dialog
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Certificate"
        description={`Are you sure you want to remove the client certificate for "${
          deleteIndex !== null && certificates[deleteIndex]
            ? certificates[deleteIndex].hostname
            : ''
        }"?`}
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  )
}

export default CollectionClientCertificatesTab
