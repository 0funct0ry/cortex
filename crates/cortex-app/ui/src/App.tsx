import React from 'react'
import TopNav from './components/layout/TopNav'
import PanelShell from './components/layout/PanelShell'
import StatusBar from './components/layout/StatusBar'

function App() {
  return (
    <div className="h-screen w-screen grid grid-rows-[36px_1fr_22px] overflow-hidden bg-bg-base text-text-primary font-sans selection:bg-accent/30">
      <TopNav />
      <PanelShell />
      <StatusBar />
    </div>
  )
}

export default App
