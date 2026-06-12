import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useCollectionRunnerStore, type RequestRunResult } from '../../stores/collectionRunnerStore'
import { useEnvironmentStore } from '../../stores/environmentStore'
import { useCollectionEnvironmentStore } from '../../stores/collectionEnvironmentStore'
import MethodBadge from '../ui/MethodBadge'
import * as Icons from '../ui/Icons'

function StatusIcon({ result }: { result: RequestRunResult | undefined; isRunning: boolean }) {
  if (!result)
    return <span className="w-4 h-4 rounded-full bg-bg-muted border border-border-subtle" />
  if (result.error && !result.status)
    return <span className="w-4 h-4 flex items-center justify-center text-error text-xs">✕</span>
  const ok = result.status !== null && result.status >= 200 && result.status < 300
  return (
    <span
      className={`w-4 h-4 flex items-center justify-center text-xs font-bold ${ok ? 'text-success' : 'text-error'}`}
    >
      {ok ? '✓' : '✕'}
    </span>
  )
}

function RunningSpinner() {
  return (
    <span className="w-4 h-4 flex items-center justify-center">
      <span className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </span>
  )
}

function ResultRow({ result, requestName }: { result: RequestRunResult; requestName: string }) {
  const [expanded, setExpanded] = React.useState(false)
  const ok = result.status !== null && result.status >= 200 && result.status < 300
  const hasError = result.error && !ok

  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-bg-muted transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className={`text-xs font-medium ${ok ? 'text-success' : 'text-error'}`}>
          {ok ? '✓' : '✕'}
        </span>
        <span className="flex-1 text-xs text-text-primary truncate">{requestName}</span>
        {result.iteration > 1 && (
          <span className="text-xs text-text-tertiary">#{result.iteration}</span>
        )}
        {result.status !== null && (
          <span className={`text-xs font-mono font-medium ${ok ? 'text-success' : 'text-error'}`}>
            {result.status}
          </span>
        )}
        {result.durationMs !== null && (
          <span className="text-xs text-text-tertiary">{result.durationMs}ms</span>
        )}
        <Icons.ChevronDown
          className={`w-3 h-3 text-text-tertiary transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <div className="px-3 pb-2 bg-bg-base">
          {hasError ? (
            <p className="text-xs text-error font-mono whitespace-pre-wrap break-all">
              {result.error}
            </p>
          ) : (
            <p className="text-xs text-text-secondary">
              {result.statusText ?? 'No status text'} — {result.durationMs ?? '?'}ms
            </p>
          )}
        </div>
      )}
    </div>
  )
}

const CollectionRunnerPanel: React.FC = () => {
  const {
    isOpen,
    scope,
    items,
    selected,
    options,
    results,
    runStatus,
    currentIndex,
    close,
    toggleSelected,
    selectAll,
    deselectAll,
    setOption,
    startRun,
    abortRun,
  } = useCollectionRunnerStore()

  const { environments } = useEnvironmentStore()
  const { collectionEnvironments } = useCollectionEnvironmentStore()
  const collectionEnvs = scope ? (collectionEnvironments[scope.collectionPath] ?? []) : []
  const runRef = useRef(false)

  // Sync environment option when store opens
  useEffect(() => {
    if (isOpen) {
      const { activeEnvironmentName } = useEnvironmentStore.getState()
      setOption('environmentName', activeEnvironmentName)
    }
  }, [isOpen, setOption])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  if (!isOpen || !scope) return null

  const selectedItems = items.filter((i) => selected.has(i.path))
  const allSelected = items.length > 0 && selected.size === items.length

  // Flatten results into ordered rows for the right panel
  const resultRows: Array<{ path: string; name: string; result: RequestRunResult }> = []
  for (const item of selectedItems) {
    const itemResults = results[item.path] ?? []
    for (const r of itemResults) {
      resultRows.push({ path: item.path, name: item.name, result: r })
    }
  }

  const passCount = resultRows.filter(
    (r) => r.result.status !== null && r.result.status >= 200 && r.result.status < 300
  ).length
  const failCount = resultRows.filter(
    (r) => r.result.error || (r.result.status !== null && r.result.status >= 400)
  ).length

  const handleRun = () => {
    if (runRef.current) return
    runRef.current = true
    startRun().finally(() => {
      runRef.current = false
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-stretch justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 animate-in fade-in duration-200"
        onClick={close}
      />

      {/* Panel */}
      <div className="relative flex flex-col w-[720px] max-w-full h-full bg-bg-overlay border-l border-border-subtle shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 h-12 border-b border-border-subtle shrink-0">
          <span className="text-sm font-semibold text-text-primary truncate flex-1">
            Run — {scope.label}
          </span>
          <span className="text-xs text-text-tertiary capitalize">{scope.type}</span>
          <button
            onClick={close}
            className="p-1 rounded hover:bg-bg-muted text-text-secondary hover:text-text-primary transition-colors"
            title="Close (Esc)"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>

        {/* Options bar */}
        <div className="flex items-center gap-4 px-4 py-2 border-b border-border-subtle bg-bg-base shrink-0 flex-wrap">
          <label className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span>Iterations</span>
            <input
              type="number"
              min={1}
              max={100}
              value={options.iterations}
              onChange={(e) =>
                setOption('iterations', Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="w-14 h-6 px-1.5 rounded border border-border-subtle bg-bg-input text-text-primary text-xs focus:outline-none focus:border-accent"
              disabled={runStatus === 'running'}
            />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span>Delay (ms)</span>
            <input
              type="number"
              min={0}
              max={30000}
              step={100}
              value={options.delayMs}
              onChange={(e) => setOption('delayMs', Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-20 h-6 px-1.5 rounded border border-border-subtle bg-bg-input text-text-primary text-xs focus:outline-none focus:border-accent"
              disabled={runStatus === 'running'}
            />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span>Environment</span>
            <select
              value={options.environmentName ?? ''}
              onChange={(e) => setOption('environmentName', e.target.value || null)}
              className="h-6 px-1.5 rounded border border-border-subtle bg-bg-input text-text-primary text-xs focus:outline-none focus:border-accent"
              disabled={runStatus === 'running'}
            >
              <option value="">None</option>
              {environments.map((env) => (
                <option key={env.name} value={env.name}>
                  {env.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span>Collection Env</span>
            <select
              value={options.collectionEnvironmentName ?? ''}
              onChange={(e) => setOption('collectionEnvironmentName', e.target.value || null)}
              className="h-6 px-1.5 rounded border border-border-subtle bg-bg-input text-text-primary text-xs focus:outline-none focus:border-accent"
              disabled={runStatus === 'running'}
            >
              <option value="">None</option>
              {collectionEnvs.map((env) => (
                <option key={env.name} value={env.name}>
                  {env.name}
                </option>
              ))}
            </select>
          </label>

          <div className="ml-auto">
            {runStatus === 'running' ? (
              <button
                onClick={abortRun}
                className="h-7 px-4 text-xs font-medium rounded-md bg-error text-text-inverse hover:bg-error/90 transition-colors"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={handleRun}
                disabled={selectedItems.length === 0}
                className="h-7 px-4 text-xs font-medium rounded-md bg-accent text-accent-fg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {runStatus === 'completed' ? 'Run Again' : 'Run'}
              </button>
            )}
          </div>
        </div>

        {/* Body — two columns */}
        <div className="flex flex-1 min-h-0">
          {/* Left: request list */}
          <div className="flex flex-col w-56 shrink-0 border-r border-border-subtle">
            {/* Select all toggle */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-bg-muted/50">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => (allSelected ? deselectAll() : selectAll())}
                className="rounded border-border-subtle accent-accent"
                disabled={runStatus === 'running'}
              />
              <span className="text-xs text-text-secondary">
                {selected.size} / {items.length} selected
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.map((item, idx) => {
                const isCurrentlyRunning = runStatus === 'running' && currentIndex === idx
                const itemResults = results[item.path] ?? []
                const lastResult = itemResults[itemResults.length - 1]
                return (
                  <div
                    key={item.path}
                    className={`flex items-center gap-2 px-3 py-1.5 hover:bg-bg-muted transition-colors ${
                      isCurrentlyRunning ? 'bg-accent/10' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(item.path)}
                      onChange={() => toggleSelected(item.path)}
                      className="rounded border-border-subtle accent-accent shrink-0"
                      disabled={runStatus === 'running'}
                    />
                    {isCurrentlyRunning ? (
                      <RunningSpinner />
                    ) : (
                      <StatusIcon result={lastResult} isRunning={false} />
                    )}
                    <MethodBadge method={item.method} className="text-[10px] shrink-0" />
                    <span className="text-xs text-text-primary truncate flex-1">{item.name}</span>
                  </div>
                )
              })}
              {items.length === 0 && (
                <div className="px-3 py-6 text-xs text-text-tertiary text-center">
                  No requests in this {scope.type}
                </div>
              )}
            </div>
          </div>

          {/* Right: results */}
          <div className="flex flex-col flex-1 min-w-0">
            {resultRows.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-text-tertiary">
                {runStatus === 'idle' ? 'Results will appear here after running' : 'Running…'}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {resultRows.map((row, i) => (
                  <ResultRow
                    key={`${row.path}-${row.result.iteration}-${i}`}
                    result={row.result}
                    requestName={row.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-4 px-4 h-9 border-t border-border-subtle bg-bg-base shrink-0 text-xs">
          <span className={`font-medium ${passCount > 0 ? 'text-success' : 'text-text-tertiary'}`}>
            {passCount} passed
          </span>
          <span className={`font-medium ${failCount > 0 ? 'text-error' : 'text-text-tertiary'}`}>
            {failCount} failed
          </span>
          <span className="text-text-tertiary">
            {resultRows.length} total result{resultRows.length !== 1 ? 's' : ''}
          </span>
          {runStatus === 'running' && (
            <span className="text-accent animate-pulse ml-auto">Running…</span>
          )}
          {runStatus === 'completed' && (
            <span className="text-text-tertiary ml-auto">Completed</span>
          )}
          {runStatus === 'aborted' && <span className="text-warning ml-auto">Aborted</span>}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CollectionRunnerPanel
