import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,
        login: (user) => set({ isAuthenticated: true, user }),
        logout: () => set({ isAuthenticated: false, user: null }),
      }),
      { name: 'auth-storage' }
    ),
    { name: 'auth' }
  )
)

export default useAuthStore
