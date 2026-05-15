import React, { useState } from 'react'
import { useRequestStore } from '../../stores/requestStore'
import * as Icons from '../ui/Icons'

interface AuthTabProps {
  requestId: string
}

const AUTH_TYPES = [
  { id: 'none', label: 'None' },
  { id: 'api-key', label: 'API Key' },
  { id: 'bearer', label: 'Bearer Token' },
  { id: 'basic', label: 'Basic' },
  { id: 'digest', label: 'Digest' },
  { id: 'oauth2', label: 'OAuth 2.0' },
  { id: 'aws', label: 'AWS SigV4' },
]

const AuthTab: React.FC<AuthTabProps> = ({ requestId }) => {
  const { getRequestState, updateRequest } = useRequestStore()
  const requestData = getRequestState(requestId)
  const auth = requestData.auth
  const config = (auth.config || {}) as Record<string, string>

  const [showSecret, setShowSecret] = useState(false)

  const handleTypeChange = (type: string) => {
    updateRequest(requestId, { auth: { ...auth, type } })
  }

  const handleConfigChange = (key: string, value: string) => {
    updateRequest(requestId, {
      auth: {
        ...auth,
        config: { ...(auth.config as Record<string, string>), [key]: value },
      },
    })
  }

  const renderForm = () => {
    switch (auth.type) {
      case 'none':
        return (
          <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
            No authentication configured
          </div>
        )
      case 'bearer':
        return (
          <div className="p-4 space-y-4 max-w-lg">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Token
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={config.token || ''}
                  onChange={(e) => handleConfigChange('token', e.target.value)}
                  className="w-full bg-bg-surface border border-border-default rounded-sm px-3 py-1.5 text-sm font-mono focus:border-accent focus:outline-none pr-10"
                  placeholder="Bearer token"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showSecret ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        )
      case 'basic':
        return (
          <div className="p-4 space-y-4 max-w-lg">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={config.username || ''}
                onChange={(e) => handleConfigChange('username', e.target.value)}
                className="w-full bg-bg-surface border border-border-default rounded-sm px-3 py-1.5 text-sm font-mono focus:border-accent focus:outline-none"
                placeholder="Username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={config.password || ''}
                  onChange={(e) => handleConfigChange('password', e.target.value)}
                  className="w-full bg-bg-surface border border-border-default rounded-sm px-3 py-1.5 text-sm font-mono focus:border-accent focus:outline-none pr-10"
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showSecret ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        )
      case 'api-key':
        return (
          <div className="p-4 space-y-4 max-w-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Key
                </label>
                <input
                  type="text"
                  value={config.key || ''}
                  onChange={(e) => handleConfigChange('key', e.target.value)}
                  className="w-full bg-bg-surface border border-border-default rounded-sm px-3 py-1.5 text-sm font-mono focus:border-accent focus:outline-none"
                  placeholder="X-API-Key"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Add to
                </label>
                <select
                  value={config.addTo || 'header'}
                  onChange={(e) => handleConfigChange('addTo', e.target.value)}
                  className="w-full bg-bg-surface border border-border-default rounded-sm px-3 py-1.5 text-sm focus:border-accent focus:outline-none cursor-pointer"
                >
                  <option value="header">Header</option>
                  <option value="query">Query Param</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Value
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={config.value || ''}
                  onChange={(e) => handleConfigChange('value', e.target.value)}
                  className="w-full bg-bg-surface border border-border-default rounded-sm px-3 py-1.5 text-sm font-mono focus:border-accent focus:outline-none pr-10"
                  placeholder="Value"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showSecret ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        )
      case 'aws':
        return (
          <div className="p-4 space-y-4 max-w-lg">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Access Key
              </label>
              <input
                type="text"
                value={config.accessKey || ''}
                onChange={(e) => handleConfigChange('accessKey', e.target.value)}
                className="w-full bg-bg-surface border border-border-default rounded-sm px-3 py-1.5 text-sm font-mono focus:border-accent focus:outline-none"
                placeholder="AKIA..."
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Secret Key
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={config.secretKey || ''}
                  onChange={(e) => handleConfigChange('secretKey', e.target.value)}
                  className="w-full bg-bg-surface border border-border-default rounded-sm px-3 py-1.5 text-sm font-mono focus:border-accent focus:outline-none pr-10"
                  placeholder="Secret Key"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showSecret ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Region
                </label>
                <input
                  type="text"
                  value={config.region || ''}
                  onChange={(e) => handleConfigChange('region', e.target.value)}
                  className="w-full bg-bg-surface border border-border-default rounded-sm px-3 py-1.5 text-sm font-mono focus:border-accent focus:outline-none"
                  placeholder="us-east-1"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Service
                </label>
                <input
                  type="text"
                  value={config.service || ''}
                  onChange={(e) => handleConfigChange('service', e.target.value)}
                  className="w-full bg-bg-surface border border-border-default rounded-sm px-3 py-1.5 text-sm font-mono focus:border-accent focus:outline-none"
                  placeholder="execute-api"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        )
      case 'oauth2':
        return (
          <div className="p-8 text-center space-y-4">
            <Icons.Settings size={48} className="mx-auto text-text-muted animate-spin-slow" />
            <div className="text-sm text-text-primary font-medium">
              OAuth 2.0 implementation is coming soon
            </div>
            <p className="text-xs text-text-muted max-w-xs mx-auto">
              We are working on a robust OAuth 2.0 flow manager for Epic 04.
            </p>
          </div>
        )
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-text-muted text-sm italic">
            Configuration for {auth.type} is not yet implemented
          </div>
        )
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-8 border-b border-border-subtle flex items-center px-4 shrink-0 bg-bg-panel/50">
        <select
          value={auth.type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer"
        >
          {AUTH_TYPES.map((t) => (
            <option key={t.id} value={t.id} className="bg-bg-overlay">
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 overflow-y-auto">{renderForm()}</div>
    </div>
  )
}

export default AuthTab
