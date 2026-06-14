import React, { useState } from 'react'
import * as Icons from '../ui/Icons'
import EnvironmentDropdown from './EnvironmentDropdown'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { useCollectionEnvironmentStore } from '../../stores/collectionEnvironmentStore'
import { useTabs } from '../../contexts/TabsContext'
import { getTagColor } from '../../utils/tagColors'

const EnvironmentSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { activeEnvironmentName, setEditingEnvironment, envColors } = useEnvironmentStore()
  const { activeCollectionEnvName } = useCollectionEnvironmentStore()
  const { openTab, activeTab } = useTabs()

  const collectionPath = activeTab?.collectionId ?? null
  const activeCollEnvName = collectionPath
    ? (activeCollectionEnvName[collectionPath] ?? null)
    : null

  const handleEdit = () => {
    if (activeCollEnvName && collectionPath) {
      // Edit the active collection environment
      setEditingEnvironment(activeCollEnvName)
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
    } else if (activeEnvironmentName) {
      setEditingEnvironment(activeEnvironmentName)
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
  }

  return (
    <div className="relative h-full flex items-center">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center min-w-0 rounded-full border border-border-subtle transition-colors ${
            isOpen ? 'bg-bg-muted' : 'hover:bg-bg-muted'
          }`}
        >
          {/* Left segment — collection scope */}
          <span className="flex items-center gap-1.5 px-2.5 py-1 min-w-0">
            <Icons.Layers className="text-text-muted shrink-0" size={12} />
            {activeCollEnvName && envColors[activeCollEnvName] && (
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: getTagColor(envColors[activeCollEnvName]).bg }}
              />
            )}
            {activeCollEnvName ? (
              <span className="text-xs font-medium text-text-primary truncate max-w-[140px]">
                {activeCollEnvName}
              </span>
            ) : (
              <span className="text-xs italic text-text-muted">No environment</span>
            )}
          </span>

          {/* Divider */}
          <span className="w-px self-stretch bg-border-subtle shrink-0" />

          {/* Right segment — global scope */}
          <span className="flex items-center gap-1.5 px-2.5 py-1 min-w-0">
            <Icons.Globe className="text-text-muted shrink-0" size={12} />
            {activeEnvironmentName && envColors[activeEnvironmentName] && (
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: getTagColor(envColors[activeEnvironmentName]).bg }}
              />
            )}
            {activeEnvironmentName ? (
              <span className="text-xs font-medium text-text-primary truncate max-w-[140px]">
                {activeEnvironmentName}
              </span>
            ) : (
              <span className="text-xs italic text-text-muted">No environment</span>
            )}
            <Icons.ChevronDown
              className={`text-text-muted shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              size={10}
            />
          </span>
        </button>

        <button
          onClick={handleEdit}
          disabled={!activeCollEnvName && !activeEnvironmentName}
          className={`p-1 rounded transition-colors text-text-muted hover:text-text-primary hover:bg-bg-muted ${!activeCollEnvName && !activeEnvironmentName ? 'opacity-30 cursor-not-allowed' : ''}`}
          title={
            activeCollEnvName || activeEnvironmentName
              ? `Edit ${activeCollEnvName ?? activeEnvironmentName}`
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
