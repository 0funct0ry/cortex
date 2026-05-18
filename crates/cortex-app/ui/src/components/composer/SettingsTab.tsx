import React, { useState, useEffect } from 'react'
import { useRequestStore } from '../../stores/requestStore'
import { commands, type AppSettings } from '../../bindings'
import VariableInput from './VariableInput'

interface SettingsTabProps {
  requestId: string
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ requestId }) => {
  const tabState = useRequestStore((s) => s.requestStates[requestId])
  const updateRequest = useRequestStore((s) => s.updateRequest)
  const resolvedVariables = useRequestStore((s) => s.resolvedVariables[requestId] || {})

  const [appSettings, setAppSettings] = useState<AppSettings | null>(null)
  const [unit, setUnit] = useState<'ms' | 's'>('ms')

  useEffect(() => {
    commands.getAppSettings().then(setAppSettings).catch(console.error)
  }, [])

  const timeoutValue = tabState?.settings?.timeout || ''
  const redirectBehavior = tabState?.settings?.redirectBehavior || 'default'
  const hasPlaceholder = timeoutValue.includes('{{')

  // Auto-detect unit if timeout value ends with 000 and is not empty
  useEffect(() => {
    if (timeoutValue && !hasPlaceholder) {
      const num = parseFloat(timeoutValue)
      if (!isNaN(num) && num > 0 && num % 1000 === 0 && unit === 'ms') {
        // Keep in ms but allow toggle
      }
    }
  }, [timeoutValue, hasPlaceholder, unit])

  if (!tabState) return null

  const getDisplayValue = () => {
    if (hasPlaceholder) return timeoutValue
    if (unit === 's' && timeoutValue) {
      const num = parseFloat(timeoutValue)
      if (!isNaN(num)) return String(num / 1000)
    }
    return timeoutValue
  }

  const handleTimeoutChange = (val: string) => {
    let rawVal = val
    if (val.includes('{{')) {
      // Force unit back to ms for variable placeholders
      setUnit('ms')
      updateRequest(requestId, {
        settings: {
          ...tabState.settings,
          timeout: val,
          redirectBehavior,
        },
      })
      return
    }

    if (unit === 's' && val !== '') {
      const num = parseFloat(val)
      if (!isNaN(num)) {
        rawVal = String(num * 1000)
      }
    }

    updateRequest(requestId, {
      settings: {
        ...tabState.settings,
        timeout: rawVal,
        redirectBehavior,
      },
    })
  }

  const handleUnitToggle = (newUnit: 'ms' | 's') => {
    if (hasPlaceholder) return
    setUnit(newUnit)
  }

  const handleRedirectChange = (behavior: 'default' | 'follow' | 'manual') => {
    updateRequest(requestId, {
      settings: {
        ...tabState.settings,
        timeout: timeoutValue,
        redirectBehavior: behavior,
      },
    })
  }

  const handleResetTimeout = () => {
    updateRequest(requestId, {
      settings: {
        ...tabState.settings,
        timeout: '',
        redirectBehavior,
      },
    })
  }

  // Variable Resolution Logic
  const getResolvedValue = (): {
    value: number | null
    error: string | null
    warning: string | null
    text: string
  } => {
    if (!timeoutValue) {
      const def = appSettings?.timeout ?? 30000
      return {
        value: def,
        error: null,
        warning: null,
        text: `Using app-level default: ${def.toLocaleString()} ms (${def / 1000} seconds)`,
      }
    }

    let resolvedStr = timeoutValue
    const placeholderRegex = /\{\{([^{}]+)\}\}/g
    let match
    let unresolved = false

    while ((match = placeholderRegex.exec(resolvedStr)) !== null) {
      const varName = match[1].trim()
      const resolvedVar = resolvedVariables[varName]
      if (resolvedVar) {
        resolvedStr = resolvedStr.replace(match[0], String(resolvedVar.value))
      } else {
        unresolved = true
        break
      }
    }

    if (unresolved) {
      return {
        value: null,
        error: null,
        warning: null,
        text: `Contains unresolved placeholders: "${timeoutValue}"`,
      }
    }

    const numeric = parseFloat(resolvedStr)
    if (isNaN(numeric) || numeric < 0) {
      return {
        value: null,
        error: 'Timeout must be a valid positive integer',
        warning: null,
        text: `Resolves to invalid number: "${resolvedStr}"`,
      }
    }

    if (numeric === 0) {
      return {
        value: 0,
        error: 'Timeout value cannot be zero. Zero-timeout is not meaningful.',
        warning: null,
        text: 'Resolves to: 0 ms (Zero duration is invalid)',
      }
    }

    const isLong = numeric > 3600000
    return {
      value: numeric,
      error: null,
      warning: isLong
        ? 'Soft warning: Timeout is greater than 1 hour (might cause slow responsiveness)'
        : null,
      text: `Resolves to: ${numeric.toLocaleString()} ms (${numeric / 1000} seconds)`,
    }
  }

  const resolution = getResolvedValue()

  const defaultRedirectLabel =
    appSettings?.redirect_behavior === 'follow' ? 'Follow redirects' : 'Do not follow redirects'

  return (
    <div className="p-6 max-w-2xl flex flex-col gap-6 text-text-primary">
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-1">Request Settings</h2>
        <p className="text-xs text-text-secondary">
          Configure network settings specifically for this request. Override the global defaults.
        </p>
      </div>

      {/* Timeout Configuration */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="timeout-input"
            className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
          >
            Timeout Limit
          </label>
          {timeoutValue && (
            <button
              onClick={handleResetTimeout}
              className="text-[11px] text-accent hover:text-accent-hover transition-colors font-medium hover:underline"
            >
              Use default
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Input field wrapper */}
          <div
            className={`flex-1 max-w-sm flex items-center bg-bg-surface border ${
              resolution.error
                ? 'border-error/80 focus-within:border-error focus-within:ring-error/20'
                : resolution.warning
                  ? 'border-warning/80 focus-within:border-warning focus-within:ring-warning/20'
                  : 'border-border-default focus-within:border-border-strong focus-within:ring-accent/20'
            } focus-within:ring-1 rounded-md h-8 overflow-hidden transition-all`}
          >
            <VariableInput
              value={getDisplayValue()}
              onChange={handleTimeoutChange}
              placeholder={
                appSettings?.timeout !== undefined
                  ? String(unit === 's' ? appSettings.timeout / 1000 : appSettings.timeout)
                  : '30000'
              }
              id="timeout-input"
              className="h-full py-0"
            />
          </div>

          {/* Unit Toggle Segmented Buttons */}
          <div className="flex rounded-md bg-bg-muted p-[2px] h-8 select-none shrink-0 border border-border-subtle">
            <button
              disabled={hasPlaceholder}
              onClick={() => handleUnitToggle('ms')}
              className={`px-3 text-xs font-semibold rounded-[4px] transition-all ${
                hasPlaceholder
                  ? 'opacity-40 cursor-not-allowed text-text-muted'
                  : unit === 'ms'
                    ? 'bg-bg-surface text-text-primary shadow-sm border border-border-subtle/30'
                    : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              ms
            </button>
            <button
              disabled={hasPlaceholder}
              onClick={() => handleUnitToggle('s')}
              className={`px-3 text-xs font-semibold rounded-[4px] transition-all ${
                hasPlaceholder
                  ? 'opacity-40 cursor-not-allowed text-text-muted'
                  : unit === 's'
                    ? 'bg-bg-surface text-text-primary shadow-sm border border-border-subtle/30'
                    : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              s
            </button>
          </div>
        </div>

        {/* Resolved Hint & Helper Messages */}
        <div className="flex flex-col gap-1">
          <div className="text-[11px] text-text-muted font-mono">{resolution.text}</div>

          {resolution.error && (
            <div className="text-xs text-error font-medium flex items-center gap-1 mt-1 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
              {resolution.error}
            </div>
          )}

          {resolution.warning && !resolution.error && (
            <div className="text-xs text-warning font-medium flex items-center gap-1 mt-1 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
              {resolution.warning}
            </div>
          )}

          {hasPlaceholder && (
            <div className="text-[10px] text-text-muted italic mt-0.5">
              Note: Segmented seconds converter is disabled while variables are present. Use raw
              milliseconds.
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-border-subtle" />

      {/* Redirect Behavior Configuration */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Redirect Behavior
        </label>

        <div className="flex rounded-md bg-bg-muted p-[2px] h-9 select-none w-fit border border-border-subtle max-w-full overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleRedirectChange('default')}
            className={`px-4 text-xs font-semibold rounded-[4px] transition-all whitespace-nowrap ${
              redirectBehavior === 'default'
                ? 'bg-bg-surface text-text-primary shadow-sm border border-border-subtle/30'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Use default ({defaultRedirectLabel})
          </button>
          <button
            onClick={() => handleRedirectChange('follow')}
            className={`px-4 text-xs font-semibold rounded-[4px] transition-all whitespace-nowrap ${
              redirectBehavior === 'follow'
                ? 'bg-bg-surface text-text-primary shadow-sm border border-border-subtle/30'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Follow all redirects
          </button>
          <button
            onClick={() => handleRedirectChange('manual')}
            className={`px-4 text-xs font-semibold rounded-[4px] transition-all whitespace-nowrap ${
              redirectBehavior === 'manual'
                ? 'bg-bg-surface text-text-primary shadow-sm border border-border-subtle/30'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Do not follow redirects
          </button>
        </div>

        <p className="text-[11px] text-text-muted mt-1 leading-relaxed max-w-md">
          {redirectBehavior === 'default' &&
            `Currently inheriting default redirect policy: "${defaultRedirectLabel}".`}
          {redirectBehavior === 'follow' &&
            'Cortex will automatically traverse up to 10 redirects, keeping a history of each hop in the response.'}
          {redirectBehavior === 'manual' &&
            'Cortex will stop execution at the first 3xx response. You can view the target redirection endpoint under the Location header.'}
        </p>
      </div>
    </div>
  )
}

export default SettingsTab
