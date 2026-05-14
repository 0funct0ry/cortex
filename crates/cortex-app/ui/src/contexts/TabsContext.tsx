import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface Tab {
  id: string
  requestPath: string | null // path to .crx file, null for scratch tabs
  collectionId: string | null
  method: string
  name: string
  isDirty: boolean
}

interface TabsContextType {
  tabs: Tab[]
  activeTabId: string | null
  activeTab: Tab | null
  openTab: (tab: Omit<Tab, 'id' | 'isDirty'>) => void
  closeTab: (id: string) => void
  activateTab: (id: string) => void
  setDirty: (id: string, isDirty: boolean) => void
  reorderTabs: (startIndex: number, endIndex: number) => void
  duplicateTab: (id: string) => void
  closeOtherTabs: (id: string) => void
  closeTabsToTheRight: (id: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

const STORAGE_KEY_TABS = 'cortex.tabs.list'
const STORAGE_KEY_ACTIVE_TAB = 'cortex.tabs.activeId'

export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TABS)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load tabs from localStorage', e)
      }
    }
    return []
  })

  const [activeTabId, setActiveTabId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_TAB)
  })

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TABS, JSON.stringify(tabs))
  }, [tabs])

  useEffect(() => {
    if (activeTabId) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, activeTabId)
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_TAB)
    }
  }, [activeTabId])

  const activateTab = useCallback((id: string) => {
    setActiveTabId(id)
  }, [])

  const openTab = useCallback(
    (tabData: Omit<Tab, 'id' | 'isDirty'>) => {
      // Check if tab already exists (by requestPath if not null)
      if (tabData.requestPath) {
        const existingTab = tabs.find((t) => t.requestPath === tabData.requestPath)
        if (existingTab) {
          activateTab(existingTab.id)
          return
        }
      }

      const newTab: Tab = {
        ...tabData,
        id: crypto.randomUUID(),
        isDirty: false,
      }

      setTabs((prev) => [...prev, newTab])
      setActiveTabId(newTab.id)
    },
    [tabs, activateTab]
  )

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const tabIndex = prev.findIndex((t) => t.id === id)
        if (tabIndex === -1) return prev

        const newTabs = prev.filter((t) => t.id !== id)

        // If closing active tab, activate neighbor
        if (id === activeTabId) {
          if (newTabs.length > 0) {
            const nextTabIndex = Math.max(0, tabIndex - 1)
            setActiveTabId(newTabs[nextTabIndex].id)
          } else {
            setActiveTabId(null)
          }
        }

        return newTabs
      })
    },
    [activeTabId]
  )

  const setDirty = useCallback((id: string, isDirty: boolean) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, isDirty } : t)))
  }, [])

  const reorderTabs = useCallback((startIndex: number, endIndex: number) => {
    setTabs((prev) => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }, [])

  const duplicateTab = useCallback(
    (id: string) => {
      const tabToDuplicate = tabs.find((t) => t.id === id)
      if (!tabToDuplicate) return

      const newTab: Tab = {
        ...tabToDuplicate,
        id: crypto.randomUUID(),
        name: `${tabToDuplicate.name} (Copy)`,
        isDirty: false, // Copy starts clean
      }

      setTabs((prev) => {
        const index = prev.findIndex((t) => t.id === id)
        const newTabs = [...prev]
        newTabs.splice(index + 1, 0, newTab)
        return newTabs
      })
      setActiveTabId(newTab.id)
    },
    [tabs]
  )

  const closeOtherTabs = useCallback((id: string) => {
    setTabs((prev) => prev.filter((t) => t.id === id))
    setActiveTabId(id)
  }, [])

  const closeTabsToTheRight = useCallback((id: string) => {
    setTabs((prev) => {
      const index = prev.findIndex((t) => t.id === id)
      if (index === -1) return prev
      return prev.slice(0, index + 1)
    })
    setActiveTabId(id)
  }, [])

  const activeTab = tabs.find((t) => t.id === activeTabId) || null

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+W to close active tab
      if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        if (activeTabId) {
          e.preventDefault()
          closeTab(activeTabId)
        }
      }

      // Cmd+1-9 to switch tabs
      if ((e.metaKey || e.ctrlKey) && /^[1-9]$/.test(e.key)) {
        const index = parseInt(e.key) - 1
        if (index < tabs.length) {
          e.preventDefault()
          setActiveTabId(tabs[index].id)
        }
      }

      // Cmd+Shift+] and Cmd+Shift+[ to cycle
      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        if (e.key === '}' || e.key === ']') {
          e.preventDefault()
          const currentIndex = tabs.findIndex((t) => t.id === activeTabId)
          const nextIndex = (currentIndex + 1) % tabs.length
          setActiveTabId(tabs[nextIndex].id)
        } else if (e.key === '{' || e.key === '[') {
          e.preventDefault()
          const currentIndex = tabs.findIndex((t) => t.id === activeTabId)
          const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length
          setActiveTabId(tabs[prevIndex].id)
        }
      }
      // Cmd+N to open new scratch tab
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        openTab({
          requestPath: null,
          collectionId: null,
          name: 'Untitled',
          method: 'GET',
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [tabs, activeTabId, closeTab, openTab])

  return (
    <TabsContext.Provider
      value={{
        tabs,
        activeTabId,
        activeTab,
        openTab,
        closeTab,
        activateTab,
        setDirty,
        reorderTabs,
        duplicateTab,
        closeOtherTabs,
        closeTabsToTheRight,
      }}
    >
      {children}
    </TabsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTabs = () => {
  const context = useContext(TabsContext)
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider')
  }
  return context
}
