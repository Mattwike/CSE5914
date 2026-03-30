import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { request } from '../services/api'

interface User {
  user_id: string
  email: string
}

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      setIsLoading(false)
      return
    }

    request('/account/me', {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((data: User) => {
        setToken(storedToken)
        setUser(data)
      })
      .catch((err) => {
        localStorage.removeItem('token')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  function login(newToken: string, newUser: User) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
