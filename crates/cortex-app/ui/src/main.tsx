import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'

// Suppress the WebView default context menu (Reload / Inspect Element).
// The app renders its own context menus via ContextMenu.tsx; the native one
// should never appear.
document.addEventListener('contextmenu', (e) => e.preventDefault())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
)
