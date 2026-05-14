import React from 'react'

const RequestTabBar: React.FC = () => {
  return (
    <div className="h-9 bg-bg-panel border-b border-border-subtle flex items-stretch overflow-hidden shrink-0">
      <div className="flex-1 flex items-stretch overflow-x-auto scrollbar-hide">
        {/* Active Tab */}
        <div className="flex items-center px-3.5 h-full border-b-2 border-accent bg-bg-highlight text-text-primary text-[12px] border-r border-border-subtle whitespace-nowrap gap-2 group cursor-pointer">
          <span className="text-[9px] font-bold px-1 rounded bg-method-get/12 text-method-get border border-method-get/20 uppercase">
            GET
          </span>
          <span className="font-medium">Async</span>
          <span className="text-[10px] text-text-muted hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100">
            ✕
          </span>
        </div>

        {/* Inactive Tab */}
        <div className="flex items-center px-3.5 h-full text-text-secondary text-[12px] border-r border-border-subtle whitespace-nowrap gap-2 group cursor-pointer hover:bg-bg-muted/50 transition-colors">
          <span className="text-[9px] font-bold px-1 rounded bg-method-post/12 text-method-post border border-method-post/20 uppercase">
            POST
          </span>
          <span>Auth</span>
          <span className="text-[10px] text-text-muted hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100">
            ✕
          </span>
        </div>

        {/* New Tab Button */}
        <button className="flex items-center justify-center px-3 text-text-muted hover:text-text-primary transition-colors text-lg">
          +
        </button>
      </div>
    </div>
  )
}

export default RequestTabBar
