import React from 'react'

interface ShellProps {
  topBar: React.ReactNode
  sidebar: React.ReactNode
  main: React.ReactNode
  isSidebarOpen: boolean
}

export const Shell: React.FC<ShellProps> = ({ topBar, sidebar, main, isSidebarOpen }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* Top Bar */}
      <header className="h-14 border-b border-slate-800 flex items-center shrink-0 z-20 bg-[#020617]/80 backdrop-blur-md">
        {topBar}
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-72' : 'w-0'
          } border-r border-slate-800 transition-all duration-300 ease-in-out overflow-hidden flex flex-col bg-[#030712] z-10 shrink-0`}
        >
          {sidebar}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-0">{main}</main>
      </div>
    </div>
  )
}
