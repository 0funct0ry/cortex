import React, { useState } from 'react'
import * as Icons from '../ui/Icons'
import EnvironmentDropdown from './EnvironmentDropdown'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { useTabs } from '../../contexts/TabsContext'
import { getTagColor } from '../../utils/tagColors'

const EnvironmentSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { activeEnvironmentName, setEditingEnvironment, envColors } = useEnvironmentStore()
  const { openTab } = useTabs()

  const handleEdit = () => {
    if (activeEnvironmentName) {
      setEditingEnvironment(activeEnvironmentName)
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
  }

  const activeColor = activeEnvironmentName ? (envColors[activeEnvironmentName] ?? null) : null

  return (
    <div className="relative h-full flex items-center">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors text-sm font-medium group ${
            isOpen
              ? 'bg-bg-muted text-text-primary'
              : 'hover:bg-bg-muted text-text-secondary hover:text-text-primary'
          }`}
        >
          {activeColor ? (
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: getTagColor(activeColor).bg }}
            />
          ) : (
            <Icons.Globe className="text-text-muted group-hover:text-text-secondary" size={14} />
          )}
          <span className="truncate max-w-[120px]">
            {activeEnvironmentName || 'No Environment'}
          </span>
          <Icons.ChevronDown className="text-text-muted" size={10} />
        </button>

        <button
          onClick={handleEdit}
          disabled={!activeEnvironmentName}
          className={`p-1 rounded transition-colors text-text-muted hover:text-text-primary hover:bg-bg-muted ${!activeEnvironmentName ? 'opacity-30 cursor-not-allowed' : ''}`}
          title={
            activeEnvironmentName
              ? `Edit ${activeEnvironmentName}`
              : 'Select an environment to edit'
          }
        >
          <Icons.Sliders size={14} />
        </button>
      </div>

      {isOpen && <EnvironmentDropdown onClose={() => setIsOpen(false)} />}
    </div>
  )
}

export default EnvironmentSwitcher
