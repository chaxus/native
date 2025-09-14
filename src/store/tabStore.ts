import { create } from 'zustand'

interface TabState {
  currentTab: string
  setCurrentTab: (tab: string) => void
  isWebViewVisible: boolean
  setWebViewVisible: (visible: boolean) => void
}

export const useTabStore = create<TabState>((set) => ({
  currentTab: 'index',
  setCurrentTab: (tab: string) => set({ currentTab: tab }),
  isWebViewVisible: false,
  setWebViewVisible: (visible: boolean) => set({ isWebViewVisible: visible }),
}))
