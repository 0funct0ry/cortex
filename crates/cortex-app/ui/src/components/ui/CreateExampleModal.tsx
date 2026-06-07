import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { toast } from '../../stores/toastStore'
import { commands, type RequestExample, type ExampleHeader } from '../../bindings'
import { useUIStore } from '../../stores/uiStore'
import { useRequestStore } from '../../stores/requestStore'
import { useResponseStore } from '../../stores/responseStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useTabs } from '../../contexts/TabsContext'

const CreateExampleModal: React.FC = () => {
  const { createExampleModal, closeCreateExampleModal } = useUIStore()
  const { isOpen, requestPath } = createExampleModal

  const { tabs } = useTabs()
  const getRequestState = useRequestStore((s) => s.getRequestState)
  const getResponse = useResponseStore((s) => s.getResponse)
  const loadCollection = useCollectionStore((s) => s.loadCollection)
  const collections = useCollectionStore((s) => s.collections)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  // Compute the next default name when modal opens
  useEffect(() => {
    if (!isOpen || !requestPath) return

    // Find the request file to count existing examples
    let existingCount = 0
    for (const col of Object.values(collections)) {
      if (!col) continue
      const countInItems = (items: typeof col.items): number => {
        for (const item of items) {
          if (item.type === 'Request' && item.data.path === requestPath) {
            return item.data.content?.examples?.length ?? 0
          }
          if (item.type === 'Folder') {
            const found = countInItems(item.data.items)
            if (found >= 0) return found
          }
        }
        return -1
      }
      const count = countInItems(col.items)
      if (count >= 0) {
        existingCount = count
        break
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(`Example ${existingCount + 1}`)
    setDescription('')
    setTimeout(() => nameRef.current?.select(), 50)
  }, [isOpen, requestPath, collections])

  if (!isOpen || !requestPath) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !requestPath) return

    setSubmitting(true)

    // Find the tab for this requestPath to snapshot its state
    const tab = tabs.find((t) => t.type === 'request' && t.requestPath === requestPath)
    const tabId = tab?.id

    // Build the request snapshot from the composer state (if the request is open in a tab)
    const requestState = tabId ? getRequestState(tabId) : null
    const responsePayload = tabId ? getResponse(tabId) : null

    const headers: ExampleHeader[] = requestState
      ? requestState.headers
          .filter((h) => h.key.trim())
          .map((h) => ({ key: h.key, value: h.value, enabled: h.enabled }))
      : []

    // Build body snapshot
    let bodySnapshot: RequestExample['body'] = undefined
    if (requestState) {
      const b = requestState.body
      if (b.type === 'raw' || b.type === 'json') {
        bodySnapshot = {
          active_type: b.type === 'json' ? 'json' : 'raw_text',
          raw_text: b.type === 'json' ? b.json : b.rawText,
          raw_subtype: b.rawSubtype,
        }
      } else if (b.type === 'form-data') {
        bodySnapshot = {
          active_type: 'form_data',
          form_data: b.formFields.map((f) => ({
            key: f.key,
            value: f.value,
            is_file: f.isFile,
            file_path: f.filePath,
            enabled: f.enabled,
          })),
        }
      } else if (b.type === 'url-encoded') {
        bodySnapshot = {
          active_type: 'url_encoded',
          url_encoded: b.urlEncodedFields.map((f) => ({
            key: f.key,
            value: f.value,
            enabled: f.enabled,
          })),
        }
      }
    }

    // Build response snapshot
    let responseSnapshot: RequestExample['response'] = undefined
    if (responsePayload && !responsePayload.error) {
      responseSnapshot = {
        status: responsePayload.status,
        status_text: responsePayload.statusText,
        headers: responsePayload.headers,
        body: responsePayload.body || undefined,
      }
    }

    // Load current request from disk if no tab is open (to get method/url)
    let method = requestState?.method ?? 'GET'
    let url = requestState?.url ?? ''
    if (!requestState) {
      const loaded = await commands.loadRequest(requestPath)
      if (loaded.status === 'ok' && loaded.data.content) {
        method = loaded.data.content.method
        url = loaded.data.content.url
      }
    }

    const example: RequestExample = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      method,
      url,
      headers: headers.length > 0 ? headers : undefined,
      body: bodySnapshot,
      response: responseSnapshot,
    }

    const result = await commands.createExample(requestPath, example)
    setSubmitting(false)

    if (result.status !== 'ok') {
      toast.error(`Failed to create example: ${result.error}`)
      return
    }

    // Reload the collection so the tree updates
    const collectionPath = tab?.collectionId ?? findCollectionPath(requestPath, collections)
    if (collectionPath) {
      await loadCollection(collectionPath)
    }

    closeCreateExampleModal()
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
        onClick={closeCreateExampleModal}
      />
      <div className="relative w-full max-w-md bg-bg-overlay border border-border-subtle rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-base font-semibold text-text-primary mb-4">Create Response Example</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase">
              Example Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example 1"
              className="w-full h-8 bg-bg-surface border border-border-default focus:border-accent rounded px-2 text-sm text-text-primary outline-none transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={3}
              className="w-full bg-bg-surface border border-border-default focus:border-accent rounded px-2 py-1.5 text-sm text-text-primary outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeCreateExampleModal}
              className="h-8 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-muted rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || submitting}
              className="h-8 px-4 text-sm font-medium bg-accent hover:bg-accent-hover text-accent-fg rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Example'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

function findCollectionPath(
  requestPath: string,
  collections: Record<string, import('../../bindings').Collection | null>
): string | null {
  for (const [colPath, col] of Object.entries(collections)) {
    if (!col) continue
    const search = (items: typeof col.items): boolean => {
      for (const item of items) {
        if (item.type === 'Request' && item.data.path === requestPath) return true
        if (item.type === 'Folder' && search(item.data.items)) return true
      }
      return false
    }
    if (search(col.items)) return colPath
  }
  return null
}

export default CreateExampleModal
