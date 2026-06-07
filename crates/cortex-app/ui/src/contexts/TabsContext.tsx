import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type TabType = 'request' | 'environments' | 'collection' | 'folder' | 'example'

export interface Tab {
  id: string
  type: TabType
  requestPath: string | null // path to .crx file, null for scratch tabs
  collectionId: string | null
  collectionPath: string | null // absolute disk path, singleton key for collection tabs
  folderPath: string | null // absolute disk path, singleton key for folder settings tabs
  exampleId?: string | null // stable example UUID, used for example tabs
  method: string
  name: string
  isDirty: boolean
}

interface TabsContextType {
  tabs: Tab[]
  activeTabId: string | null
  activeTab: Tab | null
  openTab: (tab: Omit<Tab, 'id' | 'isDirty'>) => string
  closeTab: (id: string) => void
  /** Close all tabs matching a predicate in one atomic state update. */
  closeTabsWhere: (predicate: (tab: Tab) => boolean) => void
  activateTab: (id: string) => void
  setDirty: (id: string, isDirty: boolean) => void
  updateTab: (id: string, updates: Partial<Omit<Tab, 'id'>>) => void
  reorderTabs: (startIndex: number, endIndex: number) => void
  duplicateTab: (id: string) => void
  closeOtherTabs: (id: string) => void
  closeTabsToTheRight: (id: string) => void
  promoteTab: (id: string, requestPath: string, name: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

const STORAGE_KEY_TABS = 'cortex.tabs.list'
const STORAGE_KEY_ACTIVE_TAB = 'cortex.tabs.activeId'

export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TABS)
    if (saved) {
      try {
        // Migrate older persisted tabs that may not have collectionPath
        return JSON.parse(saved).map((t: Tab) => ({
          ...t,
          collectionPath: t.collectionPath ?? null,
          folderPath: t.folderPath ?? null,
          exampleId: t.exampleId ?? null,
        }))
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
      // Check for singleton tabs
      if (tabData.type === 'environments') {
        const existingTab = tabs.find((t) => t.type === 'environments')
        if (existingTab) {
          activateTab(existingTab.id)
          return existingTab.id
        }
      }

      // Collection tabs are singleton per collection path
      if (tabData.type === 'collection' && tabData.collectionPath) {
        const existingTab = tabs.find(
          (t) => t.type === 'collection' && t.collectionPath === tabData.collectionPath
        )
        if (existingTab) {
          activateTab(existingTab.id)
          return existingTab.id
        }
      }

      // Folder settings tabs are singleton per folder path
      if (tabData.type === 'folder' && tabData.folderPath) {
        const existingTab = tabs.find(
          (t) => t.type === 'folder' && t.folderPath === tabData.folderPath
        )
        if (existingTab) {
          activateTab(existingTab.id)
          return existingTab.id
        }
      }

      // Check if request tab already exists (by requestPath if not null)
      if (tabData.type === 'request' && tabData.requestPath) {
        const existingTab = tabs.find((t) => t.requestPath === tabData.requestPath)
        if (existingTab) {
          activateTab(existingTab.id)
          return existingTab.id
        }
      }

      // Example tabs are singleton per requestPath + exampleId
      if (tabData.type === 'example' && tabData.requestPath && tabData.exampleId) {
        const existingTab = tabs.find(
          (t) =>
            t.type === 'example' &&
            t.requestPath === tabData.requestPath &&
            t.exampleId === tabData.exampleId
        )
        if (existingTab) {
          activateTab(existingTab.id)
          return existingTab.id
        }
      }

      const newTab: Tab = {
        ...tabData,
        id: crypto.randomUUID(),
        isDirty: false,
        exampleId: tabData.exampleId ?? null,
      }

      setTabs((prev) => [...prev, newTab])
      setActiveTabId(newTab.id)
      return newTab.id
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

  const closeTabsWhere = useCallback(
    (predicate: (tab: Tab) => boolean) => {
      setTabs((prev) => {
        const remaining = prev.filter((t) => !predicate(t))
        // If the active tab is being removed, activate the nearest remaining tab
        const activeIsClosing = prev.some((t) => t.id === activeTabId && predicate(t))
        if (activeIsClosing) {
          if (remaining.length > 0) {
            // Prefer the tab that was immediately before the first closed tab
            const firstClosedIndex = prev.findIndex((t) => predicate(t))
            const newActiveIndex = Math.max(0, firstClosedIndex - 1)
            const newActive = remaining[Math.min(newActiveIndex, remaining.length - 1)]
            setActiveTabId(newActive.id)
          } else {
            setActiveTabId(null)
          }
        }
        return remaining
      })
    },
    [activeTabId]
  )

  const setDirty = useCallback((id: string, isDirty: boolean) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, isDirty } : t)))
  }, [])

  const updateTab = useCallback((id: string, updates: Partial<Omit<Tab, 'id'>>) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
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

  const promoteTab = useCallback((id: string, requestPath: string, name: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, requestPath, name, isDirty: false } : t))
    )
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
      // Cmd+N to open new quick (scratch) tab — must not have Shift (that's Cmd+Shift+N → New Request)
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'n') {
        e.preventDefault()
        openTab({
          type: 'request',
          requestPath: null,
          collectionId: null,
          collectionPath: null,
          folderPath: null,
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
        closeTabsWhere,
        activateTab,
        setDirty,
        updateTab,
        reorderTabs,
        duplicateTab,
        closeOtherTabs,
        closeTabsToTheRight,
        promoteTab,
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
