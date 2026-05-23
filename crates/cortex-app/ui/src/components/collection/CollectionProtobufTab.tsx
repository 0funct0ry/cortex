import React from 'react'
import * as Icons from '../ui/Icons'
import { commands } from '../../bindings'
import type { CollectionProtobuf, CollectionProtoFile, CollectionImportPath } from '../../bindings'

interface CollectionProtobufTabProps {
  protobuf: CollectionProtobuf
  onChange: (protobuf: CollectionProtobuf) => void
  onSave: () => void
}

const getFileName = (path: string) => path.split(/[/\\]/).pop() || ''
const getDirName = (path: string) => path.split(/[/\\]/).filter(Boolean).pop() || ''

const CollectionProtobufTab: React.FC<CollectionProtobufTabProps> = ({
  protobuf,
  onChange,
  onSave,
}) => {
  const protoFiles = protobuf.proto_files ?? []
  const importPaths = protobuf.import_paths ?? []

  const handleAddProtoFile = async () => {
    try {
      const selected = await commands.pickFile(
        'Select Proto File',
        'Protocol Buffer Files (*.proto)',
        'proto'
      )
      if (selected && selected.status === 'ok' && selected.data) {
        const path = selected.data
        const file = getFileName(path)

        // Avoid duplicates
        if (protoFiles.some((p) => p.path === path)) return

        const newProto: CollectionProtoFile = { file, path }
        onChange({
          ...protobuf,
          proto_files: [...protoFiles, newProto],
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddImportPath = async () => {
    try {
      const selected = await commands.pickDirectory('Select Proto Import Path')
      if (selected && selected.status === 'ok' && selected.data) {
        const path = selected.data
        const directory = getDirName(path)

        // Avoid duplicates
        if (importPaths.some((p) => p.path === path)) return

        const newImport: CollectionImportPath = { directory, path }
        onChange({
          ...protobuf,
          import_paths: [...importPaths, newImport],
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleRemoveProtoFile = (index: number) => {
    const updated = protoFiles.filter((_, idx) => idx !== index)
    onChange({
      ...protobuf,
      proto_files: updated.length > 0 ? updated : null,
    })
  }

  const handleRemoveImportPath = (index: number) => {
    const updated = importPaths.filter((_, idx) => idx !== index)
    onChange({
      ...protobuf,
      import_paths: updated.length > 0 ? updated : null,
    })
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-bg-base flex flex-col justify-between">
      <div className="p-6 max-w-4xl space-y-8 flex-grow">
        {/* Proto Files Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 select-none">
            <h3 className="text-sm font-semibold text-text-primary">
              Proto Files ({protoFiles.length})
            </h3>
            <div className="relative group">
              <Icons.Info
                size={13}
                className="text-text-muted hover:text-text-secondary cursor-help"
              />
              <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 hidden group-hover:block w-72 p-3 bg-bg-overlay border border-border-subtle rounded shadow-xl text-left leading-normal text-text-secondary text-[11px] z-30">
                Proto files registered here are available to all gRPC requests in this collection.
              </div>
            </div>
          </div>

          {protoFiles.length === 0 ? (
            <div className="border border-dashed border-border-default rounded-lg py-8 flex flex-col items-center justify-center text-text-muted gap-1.5 select-none">
              <Icons.File size={22} className="stroke-text-muted/60" />
              <span className="text-xs font-medium">No proto files added</span>
            </div>
          ) : (
            <div className="border border-border-subtle rounded-lg overflow-hidden bg-bg-panel/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-bg-panel/40 border-b border-border-subtle text-text-secondary font-semibold uppercase tracking-wider select-none">
                    <th className="px-4 py-2">File</th>
                    <th className="px-4 py-2">Path</th>
                    <th className="px-4 py-2 w-16 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-text-primary">
                  {protoFiles.map((file, idx) => (
                    <tr key={idx} className="hover:bg-bg-muted/10 transition-colors">
                      <td className="px-4 py-2.5 font-semibold">{file.file}</td>
                      <td className="px-4 py-2.5 font-mono text-text-muted select-all truncate max-w-[400px]">
                        {file.path}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => handleRemoveProtoFile(idx)}
                          className="text-text-muted hover:text-error transition-colors p-1"
                        >
                          <Icons.Trash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={handleAddProtoFile}
            className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-semibold transition-colors mt-2"
          >
            <Icons.Plus size={12} />
            Add Proto File
          </button>
        </div>

        {/* Import Paths Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 select-none">
            <h3 className="text-sm font-semibold text-text-primary">
              Import Paths ({importPaths.length})
            </h3>
            <div className="relative group">
              <Icons.Info
                size={13}
                className="text-text-muted hover:text-text-secondary cursor-help"
              />
              <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 hidden group-hover:block w-72 p-3 bg-bg-overlay border border-border-subtle rounded shadow-xl text-left leading-normal text-text-secondary text-[11px] z-30">
                Import paths tell the proto compiler where to find imported .proto dependencies.
              </div>
            </div>
          </div>

          {importPaths.length === 0 ? (
            <div className="border border-dashed border-border-default rounded-lg py-8 flex flex-col items-center justify-center text-text-muted gap-1.5 select-none">
              <Icons.Folder size={22} className="stroke-text-muted/60" />
              <span className="text-xs font-medium">No import paths added</span>
            </div>
          ) : (
            <div className="border border-border-subtle rounded-lg overflow-hidden bg-bg-panel/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-bg-panel/40 border-b border-border-subtle text-text-secondary font-semibold uppercase tracking-wider select-none">
                    <th className="px-4 py-2">Directory</th>
                    <th className="px-4 py-2">Path</th>
                    <th className="px-4 py-2 w-16 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-text-primary">
                  {importPaths.map((path, idx) => (
                    <tr key={idx} className="hover:bg-bg-muted/10 transition-colors">
                      <td className="px-4 py-2.5 font-semibold">{path.directory}</td>
                      <td className="px-4 py-2.5 font-mono text-text-muted select-all truncate max-w-[400px]">
                        {path.path}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => handleRemoveImportPath(idx)}
                          className="text-text-muted hover:text-error transition-colors p-1"
                        >
                          <Icons.Trash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={handleAddImportPath}
            className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-semibold transition-colors mt-2"
          >
            <Icons.Plus size={12} />
            Add Import Path
          </button>
        </div>
      </div>

      {/* Save Button Footer */}
      <div className="bg-bg-panel border-t border-border-subtle p-4 flex justify-end shrink-0 select-none">
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 h-8.5 px-4 text-xs font-semibold bg-accent hover:bg-accent-hover text-accent-fg rounded transition-all shadow-sm"
        >
          <Icons.Download size={13} />
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default CollectionProtobufTab
