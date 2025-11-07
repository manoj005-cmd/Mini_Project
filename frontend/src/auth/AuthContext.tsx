import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

type User = { id: string; email: string; username: string }

type AuthContextType = {
  token: string | null
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt'))
  const [user, setUser] = useState<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  )

  useEffect(() => {
    if (token) localStorage.setItem('jwt', token)
    else localStorage.removeItem('jwt')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' })
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })
    return instance
  }, [token])

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password })
    setToken(res.data.token)
    setUser(res.data.user)
  }

  async function register(email: string, password: string, username: string) {
    const res = await api.post('/auth/register', { email, password, username })
    setToken(res.data.token)
    setUser(res.data.user)
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  const value = { token, user, login, register, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}




