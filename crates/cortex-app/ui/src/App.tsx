import React from 'react'
import TopNav from './components/layout/TopNav'
import PanelShell from './components/layout/PanelShell'
import StatusBar from './components/layout/StatusBar'
import { TabsProvider } from './contexts/TabsContext'
import WelcomeScreen from './components/layout/WelcomeScreen'
import { useWorkspaceStore } from './stores/workspaceStore'

import { listen } from '@tauri-apps/api/event'
import { useResponseStore, type ResponsePayload } from './stores/responseStore'

function App() {
  const { setResponse } = useResponseStore()
  const { activeWorkspace, loadLastWorkspace } = useWorkspaceStore()

  React.useEffect(() => {
    loadLastWorkspace()
  }, [loadLastWorkspace])

  React.useEffect(() => {
    const unlisten = listen<ResponsePayload>('response', (event) => {
      console.log('Received response:', event.payload)
      setResponse(event.payload.requestId, event.payload)
    })

    return () => {
      unlisten.then((fn) => fn())
    }
  }, [setResponse])

  return (
    <TabsProvider>
      <div
        className={`h-screen w-screen grid ${
          activeWorkspace ? 'grid-rows-[36px_1fr_22px]' : 'grid-rows-[1fr_22px]'
        } overflow-hidden bg-bg-base text-text-primary font-sans selection:bg-accent/30`}
      >
        {activeWorkspace && <TopNav />}
        {activeWorkspace ? <PanelShell /> : <WelcomeScreen />}
        <StatusBar />
      </div>
    </TabsProvider>
  )
}

export default App
