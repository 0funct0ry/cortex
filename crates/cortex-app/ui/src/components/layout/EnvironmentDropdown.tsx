import React, { useRef, useEffect, useState } from 'react'
import * as Icons from '../ui/Icons'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { useCollectionEnvironmentStore } from '../../stores/collectionEnvironmentStore'
import { useTabs } from '../../contexts/TabsContext'
import { getTagColor } from '../../utils/tagColors'
import { CreateEnvironmentModal } from './EnvironmentsTab'

interface EnvironmentDropdownProps {
  onClose: () => void
}

type DropdownTab = 'collection' | 'global'

const EnvironmentDropdown: React.FC<EnvironmentDropdownProps> = ({ onClose }) => {
  const {
    environments,
    activeEnvironmentName,
    setActiveEnvironment,
    setEditingEnvironment,
    updateVariables,
    envColors,
  } = useEnvironmentStore()
  const {
    collectionEnvironments,
    activeCollectionEnvName,
    loadCollectionEnvironments,
    setActiveCollectionEnvironment,
    setEditingCollectionEnvironment,
  } = useCollectionEnvironmentStore()

  const { openTab, activeTab } = useTabs()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Determine the active collection from the current tab
  const collectionPath = activeTab?.collectionId ?? null
  const collectionEnvs = collectionPath ? (collectionEnvironments[collectionPath] ?? []) : []
  const activeCollEnvName = collectionPath
    ? (activeCollectionEnvName[collectionPath] ?? null)
    : null

  // Default to collection tab when inside a collection, otherwise global
  const [activeDropdownTab, setActiveDropdownTab] = useState<DropdownTab>(
    collectionPath ? 'collection' : 'global'
  )

  // Must be declared before the click-outside effect that reads it
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createModalKey, setCreateModalKey] = useState(0)

  // Load collection environments when the dropdown opens for a collection tab
  useEffect(() => {
    if (collectionPath) {
      loadCollectionEnvironments(collectionPath)
    }
  }, [collectionPath, loadCollectionEnvironments])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close while the create modal is open — it renders outside dropdownRef via portal
      if (createModalOpen) return
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose, createModalOpen])

  // ── Navigation helpers ────────────────────────────────────────────────────

  const openEnvironmentsTab = (focusEnv?: string | null) => {
    if (focusEnv !== undefined) setEditingEnvironment(focusEnv)
    openTab({
      type: 'environments',
      name: 'Global Environments',
      requestPath: null,
      collectionId: null,
      collectionPath: null,
      folderPath: null,
      method: '',
    })
  }

  const openCollectionEnvsTab = (focusEnv?: string) => {
    if (!collectionPath) return
    if (focusEnv) setEditingCollectionEnvironment(collectionPath, focusEnv)
    const colName =
      collectionPath
        .split('/')
        .pop()
        ?.replace(/\.collection\.json$/i, '') ?? collectionPath
    openTab({
      type: 'collection-environments',
      name: `Environments - ${colName}`,
      collectionPath,
      collectionId: collectionPath,
      requestPath: null,
      folderPath: null,
      method: '',
    })
  }

  // ── Action handlers ───────────────────────────────────────────────────────

  const handleCreateGlobal = () => {
    setCreateModalKey((k) => k + 1)
    setCreateModalOpen(true)
  }

  const handleCreateGlobalConfirm = async (name: string) => {
    await updateVariables(name, [])
    setEditingEnvironment(name)
    setActiveEnvironment(name)
    openEnvironmentsTab(name)
    setCreateModalOpen(false)
    onClose()
  }

  const handleCreateCollection = () => {
    openCollectionEnvsTab()
    onClose()
  }

  const handleImportGlobal = () => {
    openEnvironmentsTab(null)
    onClose()
  }

  const handleImportCollection = () => {
    openCollectionEnvsTab()
    onClose()
  }

  // ── Render helpers ────────────────────────────────────────────────────────

  const ColorDot: React.FC<{ envName: string }> = ({ envName }) => {
    const colorName = envColors[envName] ?? null
    const colorBg = colorName ? getTagColor(colorName).bg : null
    if (colorBg) {
      return (
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colorBg }} />
      )
    }
    return <div className="w-2.5 shrink-0" />
  }

  const EmptyState: React.FC<{ onCreateClick: () => void; onImportClick: () => void }> = ({
    onCreateClick,
    onImportClick,
  }) => (
    <div className="px-3 py-4 flex flex-col items-center gap-2 text-center">
      <p className="text-xs font-medium text-text-secondary">Ready to get started?</p>
      <p className="text-[11px] text-text-muted leading-relaxed">
        Create an environment to manage variables across your requests.
      </p>
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={onCreateClick}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
        >
          <Icons.Plus size={11} />
          Create
        </button>
        <button
          onClick={onImportClick}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-bg-muted text-text-secondary hover:text-text-primary hover:bg-bg-highlight transition-colors"
        >
          <Icons.Upload size={11} />
          Import
        </button>
      </div>
    </div>
  )

  // ── Global tab content ────────────────────────────────────────────────────

  const renderGlobalTabContent = () => (
    <>
      {/* No Environment */}
      <button
        onClick={() => {
          setActiveEnvironment(null)
          onClose()
        }}
        className="w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-bg-highlight transition-colors group"
      >
        <div className="flex items-center gap-2">
          {!activeEnvironmentName ? (
            <Icons.Check size={14} className="text-accent shrink-0" />
          ) : (
            <div className="w-[14px]" />
          )}
          <span
            className={
              !activeEnvironmentName ? 'text-text-primary font-medium' : 'text-text-secondary'
            }
          >
            No Environment
          </span>
        </div>
      </button>

      {environments.length === 0 ? (
        <EmptyState onCreateClick={handleCreateGlobal} onImportClick={handleImportGlobal} />
      ) : (
        <>
          {environments.map((env) => (
            <div
              key={env.name}
              className="w-full flex items-center justify-between hover:bg-bg-highlight transition-colors group"
            >
              <button
                onClick={() => {
                  setActiveEnvironment(env.name)
                  onClose()
                }}
                className="flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-sm text-left"
              >
                {activeEnvironmentName === env.name ? (
                  <Icons.Check size={14} className="text-accent shrink-0" />
                ) : (
                  <div className="w-[14px] shrink-0" />
                )}
                <ColorDot envName={env.name} />
                <span
                  className={`truncate ${
                    activeEnvironmentName === env.name
                      ? 'text-text-primary font-medium'
                      : 'text-text-secondary'
                  }`}
                >
                  {env.name}
                </span>
              </button>
              <button
                onClick={() => {
                  setEditingEnvironment(env.name)
                  openEnvironmentsTab(env.name)
                  onClose()
                }}
                className="p-1.5 mr-1 text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-all"
                title="Edit environment"
              >
                <Icons.Sliders size={14} />
              </button>
            </div>
          ))}

          <div className="h-[1px] bg-border-subtle my-1" />
          <div className="flex items-center gap-1 px-3 py-1">
            <button
              onClick={handleCreateGlobal}
              className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-highlight rounded transition-colors"
            >
              <Icons.Plus size={11} />
              Create
            </button>
            <button
              onClick={handleImportGlobal}
              className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-highlight rounded transition-colors"
            >
              <Icons.Upload size={11} />
              Import
            </button>
            <div className="flex-1" />
            <button
              onClick={() => {
                openEnvironmentsTab(null)
                onClose()
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-text-muted hover:text-text-primary hover:bg-bg-highlight rounded transition-colors"
            >
              <Icons.Sliders size={11} />
              Manage
            </button>
          </div>
        </>
      )}
    </>
  )

  // ── Collection tab content ────────────────────────────────────────────────

  const renderCollectionTabContent = () => (
    <>
      {/* No Environment */}
      <button
        onClick={() => {
          if (collectionPath) setActiveCollectionEnvironment(collectionPath, null)
          onClose()
        }}
        className="w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-bg-highlight transition-colors group"
      >
        <div className="flex items-center gap-2">
          {!activeCollEnvName ? (
            <Icons.Check size={14} className="text-accent shrink-0" />
          ) : (
            <div className="w-[14px]" />
          )}
          <span
            className={!activeCollEnvName ? 'text-text-primary font-medium' : 'text-text-secondary'}
          >
            No Environment
          </span>
        </div>
      </button>

      {collectionEnvs.length === 0 ? (
        <EmptyState onCreateClick={handleCreateCollection} onImportClick={handleImportCollection} />
      ) : (
        <>
          {collectionEnvs.map((env) => (
            <div
              key={env.name}
              className="w-full flex items-center justify-between hover:bg-bg-highlight transition-colors group"
            >
              <button
                onClick={() => {
                  if (collectionPath) setActiveCollectionEnvironment(collectionPath, env.name)
                  onClose()
                }}
                className="flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-sm text-left"
              >
                {activeCollEnvName === env.name ? (
                  <Icons.Check size={14} className="text-accent shrink-0" />
                ) : (
                  <div className="w-[14px] shrink-0" />
                )}
                <ColorDot envName={env.name} />
                <span
                  className={`truncate ${
                    activeCollEnvName === env.name
                      ? 'text-text-primary font-medium'
                      : 'text-text-secondary'
                  }`}
                >
                  {env.name}
                </span>
              </button>
              <button
                onClick={() => {
                  openCollectionEnvsTab(env.name)
                  onClose()
                }}
                className="p-1.5 mr-1 text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-all"
                title="Edit environment"
              >
                <Icons.Sliders size={14} />
              </button>
            </div>
          ))}

          <div className="h-[1px] bg-border-subtle my-1" />
          <div className="flex items-center gap-1 px-3 py-1">
            <button
              onClick={handleCreateCollection}
              className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-highlight rounded transition-colors"
            >
              <Icons.Plus size={11} />
              Create
            </button>
            <button
              onClick={handleImportCollection}
              className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-highlight rounded transition-colors"
            >
              <Icons.Upload size={11} />
              Import
            </button>
            <div className="flex-1" />
            <button
              onClick={() => {
                openCollectionEnvsTab()
                onClose()
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-text-muted hover:text-text-primary hover:bg-bg-highlight rounded transition-colors"
            >
              <Icons.Sliders size={11} />
              Manage
            </button>
          </div>
        </>
      )}
    </>
  )

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-1 w-60 bg-bg-overlay border border-border-subtle rounded-md shadow-lg z-50 py-1"
    >
      {/* Tab bar */}
      <div className="flex items-center px-2 pt-1 pb-0 gap-1">
        {collectionPath && (
          <button
            onClick={() => setActiveDropdownTab('collection')}
            className={`flex-1 py-1 text-xs font-semibold rounded-t transition-colors ${
              activeDropdownTab === 'collection'
                ? 'text-text-primary border-b-2 border-accent'
                : 'text-text-muted hover:text-text-secondary border-b-2 border-transparent'
            }`}
          >
            Collection
          </button>
        )}
        <button
          onClick={() => setActiveDropdownTab('global')}
          className={`flex-1 py-1 text-xs font-semibold rounded-t transition-colors ${
            activeDropdownTab === 'global'
              ? 'text-text-primary border-b-2 border-accent'
              : 'text-text-muted hover:text-text-secondary border-b-2 border-transparent'
          }`}
        >
          Global
        </button>
      </div>

      <div className="h-[1px] bg-border-subtle mb-1" />

      {activeDropdownTab === 'collection' && collectionPath
        ? renderCollectionTabContent()
        : renderGlobalTabContent()}

      <CreateEnvironmentModal
        key={createModalKey}
        isOpen={createModalOpen}
        existingNames={environments.map((e) => e.name)}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateGlobalConfirm}
      />
    </div>
  )
}

export default EnvironmentDropdown
