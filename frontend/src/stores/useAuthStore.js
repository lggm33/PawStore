import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

const useAuthStore = create(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      login: (datos, token) => set({ usuario: datos, token }),
      logout: () => set({ usuario: null, token: null }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token && isTokenExpired(state.token)) {
          state.logout()
        }
      },
    }
  )
)

export default useAuthStore
