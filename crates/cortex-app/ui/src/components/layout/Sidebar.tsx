import React from 'react'
import SidebarHeader from './SidebarHeader'
import SidebarTree from './SidebarTree'
import SidebarFooter from './SidebarFooter'

const Sidebar: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-bg-panel border-r border-border-subtle">
      <SidebarHeader />
      <div className="flex-1 overflow-hidden flex flex-col">
        <SidebarTree />
      </div>
      <SidebarFooter />
    </div>
  )
}

export default Sidebar
