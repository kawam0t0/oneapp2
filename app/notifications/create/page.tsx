"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateNotificationPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim() || !message.trim()) {
      setError("タイトルと本文を入力してください")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, image_url: imageUrl }),
      })

      if (res.ok) {
        router.push("/")
      } else {
        const data = await res.json()
        setError(data.error || "投稿に失敗しました")
      }
    } catch (err) {
      setError("投稿に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* 戻るリンク */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Link>

        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">お知らせを作成</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                タイトル
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-colors"
                placeholder="お知らせのタイトルを入力"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">本文</label>
              <RichTextEditor value={message} onChange={setMessage} imageUrl={imageUrl} onImageChange={setImageUrl} />
              <p className="mt-2 text-xs text-gray-500">画像は5MB以下のファイルを添付できます。</p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "投稿中..." : "お知らせを投稿"}
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
