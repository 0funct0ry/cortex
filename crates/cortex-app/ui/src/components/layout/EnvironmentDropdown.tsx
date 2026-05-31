import React, { useRef, useEffect } from 'react'
import * as Icons from '../ui/Icons'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { useTabs } from '../../contexts/TabsContext'
import { toast } from '../../stores/toastStore'

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
  } = useEnvironmentStore()
  const { openTab } = useTabs()
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const openEnvironmentsTab = () => {
    openTab({
      type: 'environments',
      name: 'Environments',
      requestPath: null,
      collectionId: null,
      collectionPath: null,
      folderPath: null,
      method: '',
    })
  }

  const handleEdit = (name: string) => {
    setEditingEnvironment(name)
    openEnvironmentsTab()
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

      {environments.map((env) => (
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
      ))}

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
