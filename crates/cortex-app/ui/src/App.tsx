import React from 'react'
import TopNav from './components/layout/TopNav'
import PanelShell from './components/layout/PanelShell'
import StatusBar from './components/layout/StatusBar'
import { TabsProvider } from './contexts/TabsContext'

function App() {
  return (
    <TabsProvider>
      <div className="h-screen w-screen grid grid-rows-[36px_1fr_22px] overflow-hidden bg-bg-base text-text-primary font-sans selection:bg-accent/30">
        <TopNav />
        <PanelShell />
        <StatusBar />
      </div>
    </TabsProvider>
  )
}

export default App
