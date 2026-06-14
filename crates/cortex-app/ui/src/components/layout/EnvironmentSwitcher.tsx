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

  // The primary label is the collection env (if in a collection), else the global env
  const primaryName = activeCollEnvName ?? activeEnvironmentName
  const primaryColor = primaryName ? (envColors[primaryName] ?? null) : null

  // Show a globe badge when both scopes are active simultaneously
  const bothActive = !!(activeCollEnvName && activeEnvironmentName)

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
          className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors text-sm font-medium group ${
            isOpen
              ? 'bg-bg-muted text-text-primary'
              : 'hover:bg-bg-muted text-text-secondary hover:text-text-primary'
          }`}
        >
          {primaryColor ? (
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: getTagColor(primaryColor).bg }}
            />
          ) : (
            <Icons.Globe className="text-text-muted group-hover:text-text-secondary" size={14} />
          )}
          <span className="truncate max-w-[120px]">{primaryName || 'No Environment'}</span>
          {/* Globe badge when global env is also active alongside a collection env */}
          {bothActive && (
            <span
              className="flex items-center text-text-muted"
              title={`Global env also active: ${activeEnvironmentName}`}
            >
              <Icons.Globe size={10} />
            </span>
          )}
          <Icons.ChevronDown className="text-text-muted" size={10} />
        </button>

        <button
          onClick={handleEdit}
          disabled={!primaryName}
          className={`p-1 rounded transition-colors text-text-muted hover:text-text-primary hover:bg-bg-muted ${!primaryName ? 'opacity-30 cursor-not-allowed' : ''}`}
          title={primaryName ? `Edit ${primaryName}` : 'Select an environment to edit'}
        >
          <Icons.Sliders size={14} />
        </button>
      </div>

      {isOpen && <EnvironmentDropdown onClose={() => setIsOpen(false)} />}
    </div>
  )
}

export default EnvironmentSwitcher
