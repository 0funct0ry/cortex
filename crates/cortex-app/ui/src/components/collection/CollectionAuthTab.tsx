import React, { useState } from 'react'
import * as Icons from '../ui/Icons'
import { VariableInput } from '../composer/VariableInput'
import type { CollectionDraft } from '../../stores/collectionViewStore'

interface CollectionAuthTabProps {
  auth: CollectionDraft['auth']
  onChange: (auth: CollectionDraft['auth']) => void
}

const CollectionAuthTab: React.FC<CollectionAuthTabProps> = ({ auth, onChange }) => {
  const [isBearerMasked, setIsBearerMasked] = useState(true)
  const [isApiKeyMasked, setIsApiKeyMasked] = useState(true)
  const [isBasicPasswordMasked, setIsBasicPasswordMasked] = useState(true)
  const [isDigestPasswordMasked, setIsDigestPasswordMasked] = useState(true)
  const [isAwsSecretMasked, setIsAwsSecretMasked] = useState(true)
  const [isAwsSessionTokenMasked, setIsAwsSessionTokenMasked] = useState(true)
  const [isClientSecretMasked, setIsClientSecretMasked] = useState(true)
  const [isOAuthPasswordMasked, setIsOAuthPasswordMasked] = useState(true)

  const config = auth.config

  const handleTypeChange = (type: string) => {
    onChange({ type, config: {} })
  }

  const handleConfigChange = (key: string, value: unknown) => {
    onChange({ ...auth, config: { ...config, [key]: value } })
  }

  const c = (key: string): string => String(config[key] ?? '')

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="p-4 space-y-4 max-w-2xl">
        {/* Info banner */}
        <div className="flex items-start gap-2.5 bg-accent/8 border border-accent/20 rounded-md px-3 py-2.5">
          <Icons.Info size={14} className="text-accent mt-0.5 shrink-0" />
          <p className="text-xs text-text-secondary">
            Auth configured here is inherited by all requests unless overridden at the request
            level.
          </p>
        </div>

        {/* Auth type selector */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Auth Type
          </label>
          <select
            value={auth.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors cursor-pointer"
          >
            <option value="none">No Auth</option>
            <option value="api_key">API Key</option>
            <option value="bearer_token">Bearer Token</option>
            <option value="basic">Basic Auth</option>
            <option value="digest">Digest Auth</option>
            <option value="oauth2">OAuth 2.0</option>
            <option value="aws_sigv4">AWS SigV4</option>
          </select>
        </div>

        {/* No Auth */}
        {auth.type === 'none' && (
          <div className="h-[120px] flex items-center justify-center border border-dashed border-border-subtle rounded-lg p-6 bg-bg-panel/10">
            <span className="text-xs text-text-muted text-center max-w-[280px]">
              No authentication method configured. Choose a type above to set collection-level auth.
            </span>
          </div>
        )}

        {/* API Key Form */}
        {auth.type === 'api_key' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Key Name
              </label>
              <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                <VariableInput
                  value={c('key')}
                  onChange={(val) => handleConfigChange('key', val)}
                  placeholder="e.g. X-API-Key"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Key Value
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={c('value')}
                    onChange={(val) => handleConfigChange('value', val)}
                    placeholder="e.g. secret_value or {{my_key}}"
                    masked={isApiKeyMasked}
                    type={isApiKeyMasked ? 'password' : 'text'}
                  />
                </div>
                <button
                  onClick={() => setIsApiKeyMasked(!isApiKeyMasked)}
                  className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                  title={isApiKeyMasked ? 'Show value' : 'Hide value'}
                >
                  {isApiKeyMasked ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Add To
              </label>
              <select
                value={c('addTo') || 'header'}
                onChange={(e) => handleConfigChange('addTo', e.target.value)}
                className="w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors cursor-pointer"
              >
                <option value="header">Header</option>
                <option value="query">Query Parameter</option>
              </select>
            </div>
          </div>
        )}

        {/* Bearer Token Form */}
        {auth.type === 'bearer_token' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Token
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={c('token')}
                    onChange={(val) => handleConfigChange('token', val)}
                    placeholder="e.g. secret_token or {{my_token}}"
                    masked={isBearerMasked}
                    type={isBearerMasked ? 'password' : 'text'}
                  />
                </div>
                <button
                  onClick={() => setIsBearerMasked(!isBearerMasked)}
                  className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                  title={isBearerMasked ? 'Show token' : 'Hide token'}
                >
                  {isBearerMasked ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Basic Auth Form */}
        {auth.type === 'basic' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                <VariableInput
                  value={c('username')}
                  onChange={(val) => handleConfigChange('username', val)}
                  placeholder="Username or {{username_var}}"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={c('password')}
                    onChange={(val) => handleConfigChange('password', val)}
                    placeholder="Password or {{password_var}}"
                    masked={isBasicPasswordMasked}
                    type={isBasicPasswordMasked ? 'password' : 'text'}
                  />
                </div>
                <button
                  onClick={() => setIsBasicPasswordMasked(!isBasicPasswordMasked)}
                  className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                  title={isBasicPasswordMasked ? 'Show password' : 'Hide password'}
                >
                  {isBasicPasswordMasked ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Digest Auth Form */}
        {auth.type === 'digest' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                <VariableInput
                  value={c('username')}
                  onChange={(val) => handleConfigChange('username', val)}
                  placeholder="Username or {{username_var}}"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={c('password')}
                    onChange={(val) => handleConfigChange('password', val)}
                    placeholder="Password or {{password_var}}"
                    masked={isDigestPasswordMasked}
                    type={isDigestPasswordMasked ? 'password' : 'text'}
                  />
                </div>
                <button
                  onClick={() => setIsDigestPasswordMasked(!isDigestPasswordMasked)}
                  className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                  title={isDigestPasswordMasked ? 'Show password' : 'Hide password'}
                >
                  {isDigestPasswordMasked ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OAuth 2.0 Form */}
        {auth.type === 'oauth2' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Grant Type
              </label>
              <select
                value={c('grantType') || 'authorization_code'}
                onChange={(e) => handleConfigChange('grantType', e.target.value)}
                className="w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors cursor-pointer"
              >
                <option value="authorization_code">Authorization Code</option>
                <option value="client_credentials">Client Credentials</option>
                <option value="password">Resource Owner Password</option>
                <option value="implicit">Implicit</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Client ID
                </label>
                <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={c('clientId')}
                    onChange={(val) => handleConfigChange('clientId', val)}
                    placeholder="Client ID or {{client_id}}"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Client Secret
                </label>
                <div className="flex gap-2">
                  <div className="flex-grow h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                    <VariableInput
                      value={c('clientSecret')}
                      onChange={(val) => handleConfigChange('clientSecret', val)}
                      placeholder="Optional Secret or {{client_secret}}"
                      masked={isClientSecretMasked}
                      type={isClientSecretMasked ? 'password' : 'text'}
                    />
                  </div>
                  <button
                    onClick={() => setIsClientSecretMasked(!isClientSecretMasked)}
                    className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0"
                    title={isClientSecretMasked ? 'Show secret' : 'Hide secret'}
                  >
                    {isClientSecretMasked ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                  </button>
                </div>
              </div>
            </div>
            {(c('grantType') === 'authorization_code' ||
              c('grantType') === 'implicit' ||
              c('grantType') === '') && (
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Authorization Endpoint
                </label>
                <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={c('authEndpoint')}
                    onChange={(val) => handleConfigChange('authEndpoint', val)}
                    placeholder="https://example.com/oauth/authorize"
                  />
                </div>
              </div>
            )}
            {c('grantType') !== 'implicit' && (
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Token Endpoint
                </label>
                <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={c('tokenEndpoint')}
                    onChange={(val) => handleConfigChange('tokenEndpoint', val)}
                    placeholder="https://example.com/oauth/token"
                  />
                </div>
              </div>
            )}
            {c('grantType') === 'password' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Username
                  </label>
                  <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                    <VariableInput
                      value={c('username')}
                      onChange={(val) => handleConfigChange('username', val)}
                      placeholder="Username or {{username}}"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-grow h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                      <VariableInput
                        value={c('password')}
                        onChange={(val) => handleConfigChange('password', val)}
                        placeholder="Password or {{password}}"
                        masked={isOAuthPasswordMasked}
                        type={isOAuthPasswordMasked ? 'password' : 'text'}
                      />
                    </div>
                    <button
                      onClick={() => setIsOAuthPasswordMasked(!isOAuthPasswordMasked)}
                      className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0"
                      title={isOAuthPasswordMasked ? 'Show password' : 'Hide password'}
                    >
                      {isOAuthPasswordMasked ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Scope
                </label>
                <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={c('scope')}
                    onChange={(val) => handleConfigChange('scope', val)}
                    placeholder="e.g. read write offline_access"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Token Prefix
                </label>
                <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={c('tokenHeaderPrefix')}
                    onChange={(val) => handleConfigChange('tokenHeaderPrefix', val)}
                    placeholder="Bearer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AWS SigV4 Form */}
        {auth.type === 'aws_sigv4' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                AWS Region
              </label>
              <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                <VariableInput
                  value={c('region')}
                  onChange={(val) => handleConfigChange('region', val)}
                  placeholder="us-east-1 or {{aws_region}}"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Service Name
              </label>
              <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                <VariableInput
                  value={c('service')}
                  onChange={(val) => handleConfigChange('service', val)}
                  placeholder="s3, execute-api, iam or {{aws_service}}"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Access Key ID
              </label>
              <div className="h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                <VariableInput
                  value={c('accessKeyId')}
                  onChange={(val) => handleConfigChange('accessKeyId', val)}
                  placeholder="AKIAIOSFODNN7EXAMPLE or {{aws_access_key}}"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Secret Access Key
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={c('secretAccessKey')}
                    onChange={(val) => handleConfigChange('secretAccessKey', val)}
                    placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY or {{aws_secret_key}}"
                    masked={isAwsSecretMasked}
                    type={isAwsSecretMasked ? 'password' : 'text'}
                  />
                </div>
                <button
                  onClick={() => setIsAwsSecretMasked(!isAwsSecretMasked)}
                  className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0"
                  title={isAwsSecretMasked ? 'Show secret key' : 'Hide secret key'}
                >
                  {isAwsSecretMasked ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Session Token (Optional)
              </label>
              <div className="flex gap-2">
                <div className="flex-1 h-9 border border-border-default hover:border-border-strong rounded focus-within:border-accent bg-bg-surface overflow-hidden">
                  <VariableInput
                    value={c('sessionToken')}
                    onChange={(val) => handleConfigChange('sessionToken', val)}
                    placeholder="Session token (optional) or {{aws_session_token}}"
                    masked={isAwsSessionTokenMasked}
                    type={isAwsSessionTokenMasked ? 'password' : 'text'}
                  />
                </div>
                <button
                  onClick={() => setIsAwsSessionTokenMasked(!isAwsSessionTokenMasked)}
                  className="h-9 w-9 bg-bg-muted hover:bg-bg-highlight border border-border-default hover:border-border-strong rounded flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0"
                  title={isAwsSessionTokenMasked ? 'Show session token' : 'Hide session token'}
                >
                  {isAwsSessionTokenMasked ? <Icons.Eye size={16} /> : <Icons.EyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionAuthTab
