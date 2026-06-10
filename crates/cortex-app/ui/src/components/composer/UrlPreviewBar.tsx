import React, { useState, useMemo } from 'react'
import { useRequestStore, rfc3986Encode } from '../../stores/requestStore'
import * as Icons from '../ui/Icons'
import Tooltip from '../ui/Tooltip'

interface UrlPreviewBarProps {
  requestId: string
}

function resolveTemplateString(
  template: string,
  resolvedVars: Record<string, { value: unknown; secret?: boolean }> | undefined,
  maskSecrets = false
): string {
  if (!template) return ''
  return template.replace(/\{\{([^{}]+)\}\}/g, (match, varName) => {
    const trimmed = varName.trim()
    const resolved = resolvedVars?.[trimmed]
    if (trimmed.startsWith('$')) {
      return match
    }
    if (resolved !== undefined) {
      if (maskSecrets && resolved.secret) return '••••••••'
      if (typeof resolved.value === 'object' && resolved.value !== null) {
        return JSON.stringify(resolved.value)
      }
      return String(resolved.value)
    }
    return match
  })
}

function hasSecretVariables(
  template: string,
  resolvedVars: Record<string, { value: unknown; secret?: boolean }> | undefined
): boolean {
  if (!template || !resolvedVars) return false
  const matches = template.match(/\{\{([^{}]+)\}\}/g)
  if (!matches) return false
  return matches.some((m) => {
    const name = m.slice(2, -2).trim()
    return resolvedVars[name]?.secret === true
  })
}

const UrlPreviewBar: React.FC<UrlPreviewBarProps> = ({ requestId }) => {
  const [copied, setCopied] = useState(false)
  const tabState = useRequestStore(
    (s) => s.requestStates[requestId] || s.getRequestState(requestId)
  )
  const resolvedVars = useRequestStore((s) => s.resolvedVariables[requestId])

  const { displayUrl, copyUrl, containsSecrets } = useMemo(() => {
    if (!tabState) return { displayUrl: '', copyUrl: '', containsSecrets: false }

    const rawUrl = tabState.url.trim()
    if (!rawUrl) return { displayUrl: '', copyUrl: '', containsSecrets: false }

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

    const enabledParams = tabState.params.filter(
      (p) => p.enabled && (p.key.trim() !== '' || p.value.trim() !== '')
    )

    const secretsInUrl =
      hasSecretVariables(rawBase, resolvedVars) ||
      hasSecretVariables(rawFragment, resolvedVars) ||
      enabledParams.some(
        (p) => hasSecretVariables(p.key, resolvedVars) || hasSecretVariables(p.value, resolvedVars)
      )

    function buildUrl(mask: boolean) {
      const resolvedBase = resolveTemplateString(rawBase, resolvedVars, mask)
      const resolvedFragment = resolveTemplateString(rawFragment, resolvedVars, mask)

      if (enabledParams.length > 0) {
        const queryString = enabledParams
          .map((p) => {
            const resolvedKey = resolveTemplateString(p.key, resolvedVars, mask)
            const k =
              mask && hasSecretVariables(p.key, resolvedVars)
                ? resolvedKey
                : rfc3986Encode(resolvedKey)
            if (p.is_valueless) return k
            const resolvedValue = resolveTemplateString(p.value, resolvedVars, mask)
            const v =
              mask && hasSecretVariables(p.value, resolvedVars)
                ? resolvedValue
                : rfc3986Encode(resolvedValue)
            return `${k}=${v}`
          })
          .join('&')
        return `${resolvedBase}?${queryString}${resolvedFragment}`
      }

      return `${resolvedBase}${resolvedFragment}`
    }

    return {
      displayUrl: buildUrl(true),
      copyUrl: buildUrl(false),
      containsSecrets: secretsInUrl,
    }
  }, [tabState, resolvedVars])

  const handleCopy = async () => {
    if (!copyUrl) return
    try {
      await navigator.clipboard.writeText(copyUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy resolved URL', err)
    }
  }

  if (!displayUrl) return null

  return (
    <div className="h-7 border-b border-border-subtle bg-bg-panel/40 flex items-center px-3 gap-2 shrink-0 select-none text-[11px] transition-colors duration-150">
      <div className="flex items-center gap-1.5 shrink-0 text-text-muted font-semibold tracking-wider uppercase pr-2 border-r border-border-subtle h-3.5 select-none">
        <Icons.Eye size={11} className="text-accent" />
        <span>Preview</span>
      </div>

      <div className="flex-1 font-mono text-text-secondary truncate select-text pr-4 hover:text-text-primary transition-colors cursor-text">
        {displayUrl}
      </div>

      {containsSecrets && (
        <Tooltip content="Secret values are masked in the preview">
          <Icons.EyeOff size={11} className="text-warning shrink-0" />
        </Tooltip>
      )}

      <Tooltip
        content={
          copied
            ? 'Copied!'
            : containsSecrets
              ? 'Copy URL (includes secret values)'
              : 'Copy resolved URL'
        }
      >
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
