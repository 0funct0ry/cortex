import React from 'react'
import TopNav from './components/layout/TopNav'
import PanelShell from './components/layout/PanelShell'
import StatusBar from './components/layout/StatusBar'
import { TabsProvider } from './contexts/TabsContext'

import { listen } from '@tauri-apps/api/event'
import { useResponseStore, type ResponsePayload } from './stores/responseStore'

function App() {
  const { setResponse } = useResponseStore()

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
      <div className="h-screen w-screen grid grid-rows-[36px_1fr_22px] overflow-hidden bg-bg-base text-text-primary font-sans selection:bg-accent/30">
        <TopNav />
        <PanelShell />
        <StatusBar />
      </div>
    </TabsProvider>
  )
}

export default App
