import { createContext, useContext, createSignal, ParentComponent, Accessor } from 'solid-js'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: Accessor<User | null>
  isAuthenticated: Accessor<boolean>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>()

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<User | null>(null)
  const isAuthenticated = () => user() !== null

  const login = async (email: string, password: string) => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    setUser(data.user)
    localStorage.setItem('token', data.token)
  }

  const logout = async () => {
    await fetch('/auth/logout', { method: 'POST' })
    setUser(null)
    localStorage.removeItem('token')
  }

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      const response = await fetch('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        return true
      }
    } catch {
      // Auth check failed
    }
    setUser(null)
    return false
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, checkAuth }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
