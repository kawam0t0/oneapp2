"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn } from "lucide-react"

interface Store {
  id: number
  store_name: string
}

export default function LoginPage() {
  const router = useRouter()
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isAdminSelected = selectedStore === "0"

  useEffect(() => {
    // 店舗一覧を取得
    const fetchStores = async () => {
      try {
        const res = await fetch("/api/stores")
        if (res.ok) {
          const data = await res.json()
          setStores(data)
        }
      } catch (error) {
        console.error("Failed to fetch stores:", error)
      }
    }
    fetchStores()
  }, [])

  useEffect(() => {
    if (isAdminSelected) {
      setEmail("")
    }
  }, [isAdminSelected])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: selectedStore,
          email: isAdminSelected ? "" : email, // adminの場合は空文字
          password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push("/")
      } else {
        setError(data.error || "ログインに失敗しました")
      }
    } catch (error) {
      setError("ログインに失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  const isSubmitDisabled = isLoading || !selectedStore || !password || (!isAdminSelected && !email)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ロゴ・タイトル - 青色ベースに変更 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl font-bold text-white">ONE</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ONEAPP</h1>
          <p className="text-gray-600 mt-2">店舗管理システムにログイン</p>
        </div>

        {/* ログインフォーム - 青色ベースに変更 */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-400 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            {/* 店舗選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">店舗名</label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-900 appearance-none cursor-pointer"
              >
                <option value="">店舗を選択してください</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.store_name}
                  </option>
                ))}
              </select>
            </div>

            {!isAdminSelected && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={!isAdminSelected}
                  placeholder="example@example.com"
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
            )}

            {/* パスワード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="パスワードを入力"
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* ログインボタン - 青色に変更 */}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  ログイン
                </>
              )}
            </button>
          </form>
        </div>

        {/* フッター */}
        <p className="text-center text-gray-500 text-sm mt-6">&copy; 2025 ONEAPP. All rights reserved.</p>
      </div>
    </div>
  )
}
