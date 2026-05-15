import React from 'react'

const ComposerTabs: React.FC = () => {
  const tabs = [
    { id: 'params', label: 'Params' },
    { id: 'body', label: 'Body', dot: true },
    { id: 'headers', label: 'Headers', badge: '1' },
    { id: 'auth', label: 'Auth', dot: true },
    { id: 'vars', label: 'Vars' },
    { id: 'script', label: 'Script' },
    { id: 'assert', label: 'Assert' },
    { id: 'tests', label: 'Tests' },
    { id: 'docs', label: 'Docs' },
    { id: 'file', label: 'File' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div className="h-9 border-b border-border-subtle bg-bg-panel flex items-center px-2 overflow-x-auto no-scrollbar shrink-0">
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              tab.id === 'params'
                ? 'bg-bg-surface text-accent'
                : 'text-text-muted hover:text-text-primary hover:bg-bg-muted'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="text-[9px] bg-accent/20 text-accent px-1 rounded-full leading-none py-0.5">
                {tab.badge}
              </span>
            )}
            {tab.dot && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
          </button>
        ))}
      </div>
      <div className="ml-auto px-2 text-text-muted hover:text-text-primary cursor-pointer">
        <span className="text-xs">»</span>
      </div>
    </div>
  )
}

export default ComposerTabs
