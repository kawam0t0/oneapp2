"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface Session {
  store_id: number
  store_name: string
  email: string
  logged_in_at: string
}

interface AuthContextType {
  session: Session | null
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  logout: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session")
        if (res.ok) {
          const data = await res.json()
          if (data.authenticated) {
            setSession(data)
          } else {
            setSession(null)
            if (pathname !== "/login") {
              router.push("/login")
            }
          }
        } else {
          setSession(null)
          if (pathname !== "/login") {
            router.push("/login")
          }
        }
      } catch (error) {
        console.error("Session check failed:", error)
        setSession(null)
        if (pathname !== "/login") {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [pathname, router])

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setSession(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // ログインページは認証チェックをスキップ
  if (pathname === "/login") {
    return <AuthContext.Provider value={{ session, isLoading: false, logout }}>{children}</AuthContext.Provider>
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!session) {
    return null
  }

  return <AuthContext.Provider value={{ session, isLoading, logout }}>{children}</AuthContext.Provider>
}
