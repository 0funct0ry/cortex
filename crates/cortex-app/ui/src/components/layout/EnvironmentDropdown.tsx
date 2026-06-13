import React, { useRef, useEffect } from 'react'
import * as Icons from '../ui/Icons'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { useCollectionEnvironmentStore } from '../../stores/collectionEnvironmentStore'
import { useTabs } from '../../contexts/TabsContext'
import { toast } from '../../stores/toastStore'
import { getTagColor } from '../../utils/tagColors'

interface EnvironmentDropdownProps {
  onClose: () => void
}

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

  // Load collection environments when the dropdown opens for a collection tab
  useEffect(() => {
    if (collectionPath) {
      loadCollectionEnvironments(collectionPath)
    }
  }, [collectionPath, loadCollectionEnvironments])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleSelect = (name: string | null) => {
    setActiveEnvironment(name)
    onClose()
  }

  const openEnvironmentsTab = (focusGlobal = false) => {
    if (focusGlobal) {
      setEditingEnvironment('__global__')
    }
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
    if (focusEnv) {
      setEditingCollectionEnvironment(collectionPath, focusEnv)
    }
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

  const handleEdit = (name: string) => {
    setEditingEnvironment(name)
    openEnvironmentsTab()
    onClose()
  }

  const handleEditCollectionEnv = (name: string) => {
    openCollectionEnvsTab(name)
    onClose()
  }

  const handleCreate = async () => {
    const name = window.prompt('Enter environment name:')
    if (name) {
      if (environments.find((e) => e.name === name)) {
        toast.error('Environment already exists')
        return
      }
      await updateVariables(name, [])
      setEditingEnvironment(name)
      openEnvironmentsTab()
      setActiveEnvironment(name)
    }
    onClose()
  }

  const handleCreateCollectionEnv = () => {
    openCollectionEnvsTab()
    onClose()
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-1 w-56 bg-bg-overlay border border-border-subtle rounded-md shadow-lg z-50 py-1"
    >
      <div className="px-3 py-1.5 text-[11px] font-bold text-text-muted uppercase tracking-wider">
        Environments
      </div>

      <button
        onClick={() => handleSelect(null)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-bg-highlight transition-colors group"
      >
        <div className="flex items-center gap-2">
          {!activeEnvironmentName ? (
            <Icons.Check size={14} className="text-accent" />
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

      {environments.map((env) => {
        const colorName = envColors[env.name] ?? null
        const colorBg = colorName ? getTagColor(colorName).bg : null
        return (
          <div
            key={env.name}
            className="w-full flex items-center justify-between hover:bg-bg-highlight transition-colors group"
          >
            <button
              onClick={() => handleSelect(env.name)}
              className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm text-left"
            >
              {activeEnvironmentName === env.name ? (
                <Icons.Check size={14} className="text-accent" />
              ) : (
                <div className="w-[14px]" />
              )}
              {colorBg ? (
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: colorBg }}
                />
              ) : (
                <div className="w-2.5" />
              )}
              <span
                className={
                  activeEnvironmentName === env.name
                    ? 'text-text-primary font-medium'
                    : 'text-text-secondary'
                }
              >
                {env.name}
              </span>
            </button>
            <button
              onClick={() => handleEdit(env.name)}
              className="p-1.5 mr-1 text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-all"
              title="Edit environment"
            >
              <Icons.Sliders size={14} />
            </button>
          </div>
        )
      })}

      {/* Collection section — only when a collection tab is active */}
      {collectionPath && (
        <>
          <div className="h-[1px] bg-border-subtle my-1" />
          <div className="px-3 py-1.5 text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Collection
          </div>

          {/* Deselect collection env */}
          <button
            onClick={() => {
              setActiveCollectionEnvironment(collectionPath, null)
              onClose()
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-bg-highlight transition-colors"
          >
            {!activeCollEnvName ? (
              <Icons.Check size={14} className="text-accent" />
            ) : (
              <div className="w-[14px]" />
            )}
            <span
              className={
                !activeCollEnvName ? 'text-text-primary font-medium' : 'text-text-secondary'
              }
            >
              None
            </span>
          </button>

          {collectionEnvs.map((env) => (
            <div
              key={env.name}
              className="w-full flex items-center justify-between hover:bg-bg-highlight transition-colors group"
            >
              <button
                onClick={() => {
                  setActiveCollectionEnvironment(collectionPath, env.name)
                  onClose()
                }}
                className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm text-left"
              >
                {activeCollEnvName === env.name ? (
                  <Icons.Check size={14} className="text-accent" />
                ) : (
                  <div className="w-[14px]" />
                )}
                <span
                  className={
                    activeCollEnvName === env.name
                      ? 'text-text-primary font-medium'
                      : 'text-text-secondary'
                  }
                >
                  {env.name}
                </span>
              </button>
              <button
                onClick={() => handleEditCollectionEnv(env.name)}
                className="p-1.5 mr-1 text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-all"
                title="Edit environment"
              >
                <Icons.Sliders size={14} />
              </button>
            </div>
          ))}

          {collectionEnvs.length === 0 && (
            <div className="px-3 py-1.5 flex items-center gap-2 text-xs text-text-muted">
              <span>No environments</span>
              <span className="text-border-subtle">·</span>
              <button
                onClick={handleCreateCollectionEnv}
                className="text-accent hover:text-accent-hover transition-colors"
              >
                Create
              </button>
            </div>
          )}
        </>
      )}

      <div className="h-[1px] bg-border-subtle my-1" />

      <button
        onClick={() => {
          openEnvironmentsTab(true)
          onClose()
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-highlight transition-colors"
      >
        <Icons.Globe size={14} />
        <span>Global Environment</span>
      </button>

      <div className="h-[1px] bg-border-subtle my-1" />

      <button
        onClick={handleCreate}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-highlight transition-colors"
      >
        <Icons.Plus size={14} />
        <span>Create New</span>
      </button>

      <button
        onClick={() => {
          setEditingEnvironment(null)
          openEnvironmentsTab()
          onClose()
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-highlight transition-colors"
      >
        <Icons.Sliders size={14} />
        <span>Manage Environments</span>
      </button>
    </div>
  )
}

export default EnvironmentDropdown
