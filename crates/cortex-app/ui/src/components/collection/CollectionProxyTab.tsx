import React, { useState } from 'react'
import * as Icons from '../ui/Icons'
import type { CollectionProxy } from '../../bindings'

interface CollectionProxyTabProps {
  proxy: CollectionProxy
  onChange: (proxy: CollectionProxy) => void
}

const CollectionProxyTab: React.FC<CollectionProxyTabProps> = ({ proxy, onChange }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar bg-bg-base">
      <div className="p-6 max-w-2xl space-y-6">
        {/* Toggle block */}
        <div className="flex items-center justify-between p-4 bg-bg-panel/40 border border-border-subtle rounded-lg">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-text-primary">Enable Proxy Override</h3>
            <p className="text-xs text-text-muted">
              Overrides the global proxy setting for this collection.
            </p>
          </div>

          <button
            onClick={() => onChange({ ...proxy, enabled: !proxy.enabled })}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              proxy.enabled ? 'bg-accent' : 'bg-bg-muted border-border-default'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                proxy.enabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Configurations grid (shows only if proxy override enabled) */}
        {proxy.enabled && (
          <div className="space-y-5 animate-fadeIn">
            {/* Proxy URL */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Proxy URL
              </label>
              <input
                type="text"
                value={proxy.url}
                onChange={(e) => onChange({ ...proxy, url: e.target.value })}
                placeholder="http://proxy.example.com:8080"
                className="w-full h-9 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 text-sm text-text-primary outline-none transition-colors"
              />
            </div>

            {/* Bypass List */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Bypass List
              </label>
              <textarea
                value={proxy.bypass_list ?? ''}
                onChange={(e) => onChange({ ...proxy, bypass_list: e.target.value || null })}
                placeholder="localhost, 127.0.0.1, *.internal.net"
                rows={3}
                className="w-full bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-3 py-2 text-sm text-text-primary outline-none transition-colors font-mono"
              />
              <span className="block text-[10px] text-text-muted mt-1 select-none">
                Comma-separated hostnames or wildcards pattern to exclude from the proxy.
              </span>
            </div>

            {/* Proxy Auth Card */}
            <div className="p-4 bg-bg-panel/20 border border-border-subtle rounded-md space-y-4">
              <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider select-none">
                Proxy Authentication
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={proxy.username ?? ''}
                    onChange={(e) => onChange({ ...proxy, username: e.target.value || null })}
                    placeholder="Proxy user"
                    className="w-full h-8 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded px-2.5 text-xs text-text-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={proxy.password ?? ''}
                      onChange={(e) => onChange({ ...proxy, password: e.target.value || null })}
                      placeholder="Proxy pass"
                      className="w-full h-8 bg-bg-surface border border-border-default hover:border-border-strong focus:border-accent rounded pl-2.5 pr-8 text-xs text-text-primary outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    >
                      {showPassword ? <Icons.EyeOff size={13} /> : <Icons.Eye size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionProxyTab
