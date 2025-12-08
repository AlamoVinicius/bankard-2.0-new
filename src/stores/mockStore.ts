import { create } from 'zustand'

interface MockState {
  isMockEnabled: boolean
  apiUrl: string
  enableMock: () => void
  disableMock: () => void
  setApiUrl: (url: string) => void
}

/**
 * Mock Store
 * Manages mock data mode state and API configuration with Zustand
 * Settings are NOT persisted - they reset on every reload
 * User must configure the application on each session
 */
export const useMockStore = create<MockState>()((set) => ({
  isMockEnabled: false,
  apiUrl: 'https://localhost:7162', // Default API URL

  /**
   * Enable mock data mode
   */
  enableMock: () => {
    set({ isMockEnabled: true })
  },

  /**
   * Disable mock data mode
   */
  disableMock: () => {
    set({ isMockEnabled: false })
  },

  /**
   * Set API base URL
   */
  setApiUrl: (url: string) => {
    set({ apiUrl: url })
  },
}))
