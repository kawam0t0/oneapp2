"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Plus, ImageIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface News {
  id: number
  title: string
  message: string
  image_url?: string
  published_at: string
}

export default function NewsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const highlightId = searchParams.get("id")

  const [newsList, setNewsList] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news")
      if (response.ok) {
        const data = await response.json()
        setNewsList(data)

        if (highlightId) {
          const targetNews = data.find((n: News) => n.id === Number.parseInt(highlightId))
          if (targetNews) {
            setSelectedNews(targetNews)
            setIsDetailOpen(true)
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch news:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [highlightId])

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString.replace(" ", "T"))
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleNewsClick = (news: News) => {
    setSelectedNews(news)
    setIsDetailOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleCreateNews = async () => {
    if (!newTitle.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          message: newMessage,
          image_url: imagePreview,
        }),
      })

      if (response.ok) {
        setIsCreateOpen(false)
        setNewTitle("")
        setNewMessage("")
        setImageFile(null)
        setImagePreview(null)
        fetchNews()
      }
    } catch (error) {
      console.error("Failed to create news:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              戻る
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">お知らせ一覧</h1>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            新規作成
          </Button>
        </div>

        {/* お知らせリスト */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">読み込み中...</div>
        ) : newsList.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">お知らせはありません</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {newsList.map((news) => (
              <Card
                key={news.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  highlightId && Number.parseInt(highlightId) === news.id ? "ring-2 ring-yellow-400 bg-yellow-50" : ""
                }`}
                onClick={() => handleNewsClick(news)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {new Date(news.published_at.replace(" ", "T")) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">NEW</span>
                        )}
                        <h3 className="font-bold text-lg text-gray-900">{news.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {news.message || "詳細はクリックして確認してください"}
                      </p>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(news.published_at)}
                      </div>
                    </div>
                    {news.image_url && (
                      <div className="ml-4 flex-shrink-0">
                        <img
                          src={news.image_url || "/placeholder.svg"}
                          alt=""
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 詳細ダイアログ */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          <DialogTitle className="sr-only">お知らせ詳細</DialogTitle>
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-lg font-bold text-white">お知らせ詳細</h2>
          </div>
          <div className="px-6 py-5">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedNews?.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{selectedNews && formatDate(selectedNews.published_at)}</p>
            {selectedNews?.image_url && (
              <div className="mb-4">
                <img
                  src={selectedNews.image_url || "/placeholder.svg"}
                  alt=""
                  className="w-full max-h-64 object-contain rounded-lg"
                />
              </div>
            )}
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {selectedNews?.message || "詳細はありません"}
            </p>
          </div>
          <div className="px-6 pb-6">
            <Button
              onClick={() => setIsDetailOpen(false)}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
            >
              閉じる
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 作成ダイアログ */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          <DialogTitle className="sr-only">お知らせを作成</DialogTitle>
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-lg font-bold text-white">お知らせを作成</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-700 font-medium">
                タイトル <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="お知らせのタイトルを入力"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-gray-700 font-medium">
                本文
              </Label>
              <Textarea
                id="message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="お知らせの内容を入力"
                rows={5}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-700 font-medium">画像（任意）</Label>
              <div className="mt-1">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="プレビュー"
                      className="w-full max-h-48 object-contain rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2"
                    >
                      削除
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">クリックして画像を選択</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1">
              キャンセル
            </Button>
            <Button
              onClick={handleCreateNews}
              disabled={!newTitle.trim() || submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting ? "作成中..." : "作成"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
