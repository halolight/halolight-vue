import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Tab {
  id: string
  title: string
  path: string
  icon?: string
  closable?: boolean
}

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<Tab[]>([
    { id: 'home', title: '首页', path: '/', closable: false },
  ])
  const activeTabId = ref('home')

  function addTab(tab: Omit<Tab, 'id'>) {
    const existingTab = tabs.value.find((t) => t.path === tab.path)
    if (existingTab) {
      activeTabId.value = existingTab.id
      return existingTab
    }

    const newTab: Tab = {
      ...tab,
      id: `tab-${Date.now()}`,
      closable: tab.closable ?? true,
    }
    tabs.value.push(newTab)
    activeTabId.value = newTab.id
    return newTab
  }

  function removeTab(tabId: string) {
    const index = tabs.value.findIndex((t) => t.id === tabId)
    if (index === -1) return

    const tab = tabs.value[index]
    if (!tab || tab.closable === false) return

    tabs.value.splice(index, 1)

    if (activeTabId.value === tabId && tabs.value.length > 0) {
      const newActiveIndex = Math.min(index, tabs.value.length - 1)
      const newActiveTab = tabs.value[newActiveIndex]
      if (newActiveTab) {
        activeTabId.value = newActiveTab.id
      }
    }
  }

  function setActiveTab(tabId: string) {
    const tab = tabs.value.find((t) => t.id === tabId)
    if (tab) {
      activeTabId.value = tabId
    }
  }

  function getTabByPath(path: string) {
    return tabs.value.find((t) => t.path === path)
  }

  function updateTab(tabId: string, updates: Partial<Omit<Tab, 'id'>>) {
    const tab = tabs.value.find((t) => t.id === tabId)
    if (tab) {
      Object.assign(tab, updates)
    }
  }

  function clearTabs() {
    tabs.value = tabs.value.filter((t) => t.closable === false)
    const firstTab = tabs.value[0]
    if (firstTab) {
      activeTabId.value = firstTab.id
    }
  }

  return {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    setActiveTab,
    getTabByPath,
    updateTab,
    clearTabs,
  }
})
