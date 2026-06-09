import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginApi } from '../api/authApi'
import type { SessionUser } from '../types/api'

type AuthContextValue = {
  user: SessionUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'sales_manager_react_session'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      setUser(JSON.parse(raw) as SessionUser)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email: string, password: string) {
        setLoading(true)
        try {
          const session = await loginApi(email, password)
          setUser(session)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
        } finally {
          setLoading(false)
        }
      },
      logout() {
        setUser(null)
        localStorage.removeItem(STORAGE_KEY)
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
