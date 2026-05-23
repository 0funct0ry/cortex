import React, { useState, useMemo } from 'react'
import * as Icons from '../ui/Icons'
import Dialog from '../ui/Dialog'
import { useEnvironmentStore } from '../../stores/environmentStore'
import type { CollectionDraft } from '../../stores/collectionViewStore'

interface CollectionSecretsTabProps {
  draft: CollectionDraft
  collectionPath: string
}

interface SecretItem {
  id: string // Unique key
  name: string
  scope: string
  value: string
}

const CollectionSecretsTab: React.FC<CollectionSecretsTabProps> = ({ draft }) => {
  const { environments } = useEnvironmentStore()
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({})
  const [confirmRevealItem, setConfirmRevealItem] = useState<SecretItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Gathers all secrets from collection variables and active environments
  const secretsList = useMemo(() => {
    const list: SecretItem[] = []

    // 1. Secrets in Collection variables
    if (draft.variables) {
      draft.variables.forEach((v) => {
        if (v.secret) {
          const valStr = typeof v.value === 'string' ? v.value : JSON.stringify(v.value)
          list.push({
            id: `collection-${v.name}`,
            name: v.name,
            scope: 'Collection',
            value: valStr,
          })
        }
      })
    }

    // 2. Secrets in Workspace Environments
    environments.forEach((env) => {
      if (env.variables) {
        env.variables.forEach((v) => {
          if (v.secret) {
            const valStr = typeof v.value === 'string' ? v.value : JSON.stringify(v.value)
            list.push({
              id: `env-${env.name}-${v.name}`,
              name: v.name,
              scope: `Environment (${env.name})`,
              value: valStr,
            })
          }
        })
      }
    })

    return list
  }, [draft.variables, environments])

  // Filtered secrets based on search query
  const filteredSecrets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return secretsList
    return secretsList.filter(
      (s) => s.name.toLowerCase().includes(query) || s.scope.toLowerCase().includes(query)
    )
  }, [secretsList, searchQuery])

  const handleRevealClick = (item: SecretItem) => {
    if (revealedKeys[item.id]) {
      // Hide back
      setRevealedKeys((prev) => ({ ...prev, [item.id]: false }))
    } else {
      // Request confirmation
      setConfirmRevealItem(item)
    }
  }

  const handleConfirmReveal = () => {
    if (!confirmRevealItem) return
    setRevealedKeys((prev) => ({ ...prev, [confirmRevealItem.id]: true }))
    setConfirmRevealItem(null)
  }

  return (
    <div className="flex-grow overflow-hidden bg-bg-base flex flex-col h-full">
      {/* Search and notes header */}
      <div className="p-4 border-b border-border-subtle bg-bg-panel/20 shrink-0 flex items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-2 bg-bg-surface border border-border-default hover:border-border-strong rounded px-2.5 h-8 w-72 transition-colors">
          <Icons.Search size={13} className="text-text-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search secrets by name or scope..."
            className="w-full bg-transparent border-none text-xs text-text-primary outline-none placeholder:text-text-muted/80 h-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-text-muted hover:text-text-secondary"
            >
              <Icons.X size={11} />
            </button>
          )}
        </div>

        <div className="text-[10px] text-text-muted italic max-w-md text-right leading-normal">
          Secrets are stored locally and never uploaded. This view is read-only — edit secrets in
          Vars or Environments.
        </div>
      </div>

      {/* Secrets list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {filteredSecrets.length === 0 ? (
          <div className="border border-dashed border-border-default rounded-lg py-12 flex flex-col items-center justify-center text-text-muted select-none gap-2">
            <Icons.EyeOff size={28} className="stroke-text-muted/60" />
            <span className="text-sm font-medium">No secret variables found.</span>
            <span className="text-xs max-w-sm text-center">
              Secret variables defined in Collection Vars or Environments will appear here.
            </span>
          </div>
        ) : (
          <div className="border border-border-subtle rounded-lg overflow-hidden bg-bg-panel/10 max-w-4xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-bg-panel/40 border-b border-border-subtle text-text-secondary font-semibold uppercase tracking-wider select-none">
                  <th className="px-4 py-2.5">Secret Variable Name</th>
                  <th className="px-4 py-2.5">Source Scope</th>
                  <th className="px-4 py-2.5">Value</th>
                  <th className="px-4 py-2.5 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-text-primary">
                {filteredSecrets.map((item) => (
                  <tr key={item.id} className="hover:bg-bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-semibold font-mono text-accent">{item.name}</td>
                    <td className="px-4 py-3 font-medium text-text-secondary">{item.scope}</td>
                    <td className="px-4 py-3 font-mono">
                      {revealedKeys[item.id] ? (
                        <span className="bg-bg-highlight px-1.5 py-0.5 rounded text-text-primary">
                          {item.value}
                        </span>
                      ) : (
                        <span className="text-text-muted select-none">••••••••</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRevealClick(item)}
                        className={`inline-flex items-center gap-1 h-6 px-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          revealedKeys[item.id]
                            ? 'bg-bg-muted border border-border-default hover:bg-bg-surface text-text-secondary hover:text-text-primary'
                            : 'bg-accent hover:bg-accent-hover text-accent-fg shadow-sm'
                        }`}
                      >
                        {revealedKeys[item.id] ? (
                          <>
                            <Icons.EyeOff size={10} />
                            Hide
                          </>
                        ) : (
                          <>
                            <Icons.Eye size={10} />
                            Reveal
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog
        isOpen={confirmRevealItem !== null}
        onClose={() => setConfirmRevealItem(null)}
        onConfirm={handleConfirmReveal}
        title="Reveal Secret"
        description={`Are you sure you want to reveal the plain-text value of secret "${
          confirmRevealItem ? confirmRevealItem.name : ''
        }"? It will be shown on screen until you navigate away.`}
        confirmLabel="Reveal"
      />
    </div>
  )
}

export default CollectionSecretsTab
