import { createContext, useContext, useState } from 'react'

const AUTH_STORAGE_KEY = 'pawstore-auth'

const AuthContext = createContext(null)

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

function loadAuthFromStorage() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return { usuario: null, token: null }

    const { usuario, token } = JSON.parse(raw)
    
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return { usuario: null, token: null }
    }

    return { usuario, token }
  } catch {
    return { usuario: null, token: null }
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuthFromStorage())

  function login(datos, newToken) {
    setAuth({ usuario: datos, token: newToken })
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ usuario: datos, token: newToken }))
  }

  function logout() {
    setAuth({ usuario: null, token: null })
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ usuario: auth.usuario, token: auth.token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
