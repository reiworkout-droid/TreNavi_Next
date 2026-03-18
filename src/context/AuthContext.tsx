"use client"

import { createContext, useContext, useEffect, useState } from "react"

const API = process.env.NEXT_PUBLIC_API_URL

type User = {
  id: number
  name: string
  email: string
  trainer?: Trainer | null
}

type Trainer = {
  id: number
  user_id: number
}

type AuthContextType = {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // user取得
  const refreshUser = async () => {

    try {

      const res = await fetch(`${API}/api/user`, {
        credentials: "include"
      })

      if (!res.ok) throw new Error()

      const data = await res.json()

      setUser(data)

    } catch {

      setUser(null)

    } finally {

      setLoading(false)

    }
  }

  // 初回ロード
  useEffect(() => {
    refreshUser()
  }, [])

  // ログアウト
  const logout = async () => {

    await fetch(`${API}/sanctum/csrf-cookie`, {
      credentials: "include"
    })

    const xsrfToken = decodeURIComponent(
      document.cookie
        .split("; ")
        .find(row => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1] || ""
    )

    await fetch(`${API}/api/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-XSRF-TOKEN": xsrfToken,
        "Accept": "application/json"
      }
    })

    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {

  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}