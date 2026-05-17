import React, { useState, useMemo } from 'react'
import { useRequestStore, rfc3986Encode } from '../../stores/requestStore'
import * as Icons from '../ui/Icons'
import Tooltip from '../ui/Tooltip'

interface UrlPreviewBarProps {
  requestId: string
}

function resolveTemplateString(
  template: string,
  resolvedVars: Record<string, { value: unknown }> | undefined
): string {
  if (!template) return ''
  return template.replace(/\{\{([^{}]+)\}\}/g, (match, varName) => {
    const trimmed = varName.trim()
    const resolved = resolvedVars?.[trimmed]
    if (trimmed.startsWith('$')) {
      // Keep dynamic variables unresolved/literal in preview as they are generated at send-time
      return match
    }
    if (resolved !== undefined) {
      if (typeof resolved.value === 'object' && resolved.value !== null) {
        return JSON.stringify(resolved.value)
      }
      return String(resolved.value)
    }
    return match // Keep unresolved placeholders intact
  })
}

const UrlPreviewBar: React.FC<UrlPreviewBarProps> = ({ requestId }) => {
  const [copied, setCopied] = useState(false)
  const tabState = useRequestStore(
    (s) => s.requestStates[requestId] || s.getRequestState(requestId)
  )
  const resolvedVars = useRequestStore((s) => s.resolvedVariables[requestId])

  const resolvedUrl = useMemo(() => {
    if (!tabState) return ''

    const rawUrl = tabState.url.trim()
    if (!rawUrl) return ''

    // Parse base, query, and fragment parts from raw URL
    const queryIndex = rawUrl.indexOf('?')
    const fragmentIndex = rawUrl.indexOf('#')

    let rawBase = rawUrl
    let rawFragment = ''

    if (queryIndex !== -1) {
      rawBase = rawUrl.slice(0, queryIndex)
    } else if (fragmentIndex !== -1) {
      rawBase = rawUrl.slice(0, fragmentIndex)
    }

    if (fragmentIndex !== -1) {
      rawFragment = rawUrl.slice(fragmentIndex)
    }

    // 1. Resolve base URL and fragment variables
    const resolvedBase = resolveTemplateString(rawBase, resolvedVars)
    const resolvedFragment = resolveTemplateString(rawFragment, resolvedVars)

    // 2. Resolve and encode query parameters from structured store
    const enabledParams = tabState.params.filter(
      (p) => p.enabled && (p.key.trim() !== '' || p.value.trim() !== '')
    )

    if (enabledParams.length > 0) {
      const queryString = enabledParams
        .map((p) => {
          const resolvedKey = resolveTemplateString(p.key, resolvedVars)
          const k = rfc3986Encode(resolvedKey)

          if (p.is_valueless) {
            return k
          }

          const resolvedValue = resolveTemplateString(p.value, resolvedVars)
          const v = rfc3986Encode(resolvedValue)
          return `${k}=${v}`
        })
        .join('&')

      return `${resolvedBase}?${queryString}${resolvedFragment}`
    }

    return `${resolvedBase}${resolvedFragment}`
  }, [tabState, resolvedVars])

  const handleCopy = async () => {
    if (!resolvedUrl) return
    try {
      await navigator.clipboard.writeText(resolvedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy resolved URL', err)
    }
  }

  if (!resolvedUrl) return null

  return (
    <div className="h-7 border-b border-border-subtle bg-bg-panel/40 flex items-center px-3 gap-2 shrink-0 select-none text-[11px] transition-colors duration-150">
      <div className="flex items-center gap-1.5 shrink-0 text-text-muted font-semibold tracking-wider uppercase pr-2 border-r border-border-subtle h-3.5 select-none">
        <Icons.Eye size={11} className="text-accent" />
        <span>Preview</span>
      </div>

      <div className="flex-1 font-mono text-text-secondary truncate select-text pr-4 hover:text-text-primary transition-colors cursor-text">
        {resolvedUrl}
      </div>

      <Tooltip content={copied ? 'Copied!' : 'Copy resolved URL'}>
        <button
          onClick={handleCopy}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-bg-muted text-text-muted hover:text-text-primary transition-all duration-150 active:scale-95"
        >
          {copied ? <Icons.Check size={11} className="text-success" /> : <Icons.Copy size={11} />}
        </button>
      </Tooltip>
    </div>
  )
}

export default UrlPreviewBar
