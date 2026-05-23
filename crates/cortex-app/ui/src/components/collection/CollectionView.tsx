import React, { useEffect, useRef, useCallback } from 'react'
import * as Icons from '../ui/Icons'
import { useTabs } from '../../contexts/TabsContext'
import { useCollectionStore } from '../../stores/collectionStore'
import { useCollectionViewStore, type CollectionDraft } from '../../stores/collectionViewStore'
import CollectionOverviewTab from './CollectionOverviewTab'
import CollectionHeadersTab from './CollectionHeadersTab'
import CollectionVarsTab from './CollectionVarsTab'
import CollectionAuthTab from './CollectionAuthTab'
import CollectionScriptTab from './CollectionScriptTab'
import CollectionTestsTab from './CollectionTestsTab'
import type { Collection, Variable } from '../../bindings'

interface CollectionViewProps {
  collectionPath: string
  tabId: string
}

type SubTab = CollectionDraft['activeSubTab']

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'headers', label: 'Headers' },
  { id: 'vars', label: 'Vars' },
  { id: 'auth', label: 'Auth' },
  { id: 'script', label: 'Script' },
  { id: 'tests', label: 'Tests' },
]

const CollectionView: React.FC<CollectionViewProps> = ({ collectionPath, tabId }) => {
  const { activeTabId, setDirty } = useTabs()
  const { collections, loadCollection } = useCollectionStore()
  const { drafts, initDraft, updateDraft, saveDraft, clearDraft } = useCollectionViewStore()

  const draft = drafts[collectionPath]
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wasActiveRef = useRef(false)
  const isSavingRef = useRef(false)

  // Load collection + init draft on mount
  useEffect(() => {
    const load = async () => {
      let col: Collection | undefined = collections[collectionPath]
      if (!col) {
        await loadCollection(collectionPath)
        col = useCollectionViewStore.getState().drafts[collectionPath]
          ? undefined
          : useCollectionStore.getState().collections[collectionPath]
      }
      if (col && !useCollectionViewStore.getState().drafts[collectionPath]) {
        initDraft(collectionPath, col)
      }
    }
    load()
  }, [collectionPath]) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-init draft once collection data arrives
  useEffect(() => {
    const col = collections[collectionPath]
    if (col && !drafts[collectionPath]) {
      initDraft(collectionPath, col)
    }
  }, [collections, collectionPath, drafts, initDraft])

  const doSave = useCallback(async () => {
    if (isSavingRef.current) return
    isSavingRef.current = true
    try {
      await saveDraft(collectionPath)
      setDirty(tabId, false)
    } finally {
      isSavingRef.current = false
    }
  }, [collectionPath, tabId, saveDraft, setDirty])

  const scheduleAutoSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(doSave, 500)
  }, [doSave])

  // Auto-save when this tab becomes inactive
  useEffect(() => {
    if (wasActiveRef.current && activeTabId !== tabId) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
      doSave()
    }
    wasActiveRef.current = activeTabId === tabId
  }, [activeTabId, tabId, doSave])

  // Cancel timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      clearDraft(collectionPath)
    }
  }, [collectionPath, clearDraft])

  const handleUpdate = useCallback(
    (updates: Partial<CollectionDraft>) => {
      updateDraft(collectionPath, updates)
      setDirty(tabId, true)
      scheduleAutoSave()
    },
    [collectionPath, tabId, updateDraft, setDirty, scheduleAutoSave]
  )

  if (!draft) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const activeSubTab = draft.activeSubTab

  const renderContent = () => {
    switch (activeSubTab) {
      case 'overview':
        return (
          <CollectionOverviewTab
            draft={draft}
            collectionPath={collectionPath}
            onChange={(updates) => handleUpdate(updates)}
          />
        )
      case 'headers':
        return (
          <CollectionHeadersTab
            headers={draft.headers}
            onChange={(headers) => handleUpdate({ headers })}
          />
        )
      case 'vars':
        return (
          <CollectionVarsTab
            variables={draft.variables}
            onChange={(variables: Variable[]) => handleUpdate({ variables })}
          />
        )
      case 'auth':
        return <CollectionAuthTab auth={draft.auth} onChange={(auth) => handleUpdate({ auth })} />
      case 'script':
        return (
          <CollectionScriptTab
            scripts={draft.scripts}
            onChange={(scripts) => handleUpdate({ scripts })}
          />
        )
      case 'tests':
        return (
          <CollectionTestsTab tests={draft.tests} onChange={(tests) => handleUpdate({ tests })} />
        )
    }
  }

  return (
    <div className="flex flex-col h-full bg-bg-base">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-11 border-b border-border-subtle bg-bg-panel shrink-0">
        <Icons.Settings size={15} className="text-accent shrink-0" />
        <span className="text-sm font-semibold text-text-primary truncate flex-1">
          {draft.name}
        </span>
        <button
          onClick={doSave}
          className="flex items-center gap-1.5 h-7 px-3 text-xs font-medium bg-accent hover:bg-accent-hover text-accent-fg rounded transition-colors"
        >
          <Icons.Download size={12} />
          Save
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center border-b border-border-subtle bg-bg-panel shrink-0 px-1">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => updateDraft(collectionPath, { activeSubTab: tab.id })}
            className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
              activeSubTab === tab.id
                ? 'text-text-primary border-accent'
                : 'text-text-muted border-transparent hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">{renderContent()}</div>
    </div>
  )
}

export default CollectionView
