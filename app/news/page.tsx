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
import { useAuth } from "@/components/auth-provider" // useAuthを追加
import { NotificationDetailDialog } from "@/components/notification-detail-dialog"

interface News {
  id: number
  title: string
  message: string
  image_url?: string | string[] // 文字列または配列に対応
  published_at: string
}

export default function NewsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const highlightId = searchParams.get("id")
  const { session } = useAuth() // セッション情報を取得

  const isAdmin = session?.store_id === 0 || session?.store_name === "admin"

  const [newsList, setNewsList] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [pdfFiles, setPdfFiles] = useState<File[]>([])
  const [pdfPreviews, setPdfPreviews] = useState<string[]>([])
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    console.log("[v0] Selected files count:", files.length)

    const newFiles = Array.from(files)
    const newImagePreviews: string[] = []
    const newPdfPreviews: string[] = []
    const newImageFiles: File[] = []
    const newPdfFiles: File[] = []

    newFiles.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} は10MB以下にしてください`)
        return
      }

      if (file.type === "application/pdf") {
        newPdfFiles.push(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          newPdfPreviews.push(reader.result as string)
          if (newImagePreviews.length + newPdfPreviews.length === newFiles.length) {
            setPdfPreviews((prev) => [...prev, ...newPdfPreviews])
            setPdfFiles((prev) => [...prev, ...newPdfFiles])
            console.log("[v0] Total PDFs:", [...pdfPreviews, ...newPdfPreviews].length)
          }
        }
        reader.readAsDataURL(file)
      } else if (file.type.startsWith("image/")) {
        newImageFiles.push(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          newImagePreviews.push(reader.result as string)
          if (newImagePreviews.length + newPdfPreviews.length === newFiles.length) {
            setImagePreviews((prev) => [...prev, ...newImagePreviews])
            setImageFiles((prev) => [...prev, ...newImageFiles])
            console.log("[v0] Total images:", [...imagePreviews, ...newImagePreviews].length)
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleRemoveImage = (index: number) => {
    console.log("[v0] Removing image at index:", index)
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemovePdf = (index: number) => {
    console.log("[v0] Removing PDF at index:", index)
    setPdfFiles((prev) => prev.filter((_, i) => i !== index))
    setPdfPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCreateNews = async () => {
    if (!newTitle.trim()) return

    setSubmitting(true)
    try {
      const allFiles = [...imagePreviews, ...pdfPreviews]
      console.log("[v0] Creating news with files:", allFiles.length)

      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          message: newMessage,
          image_urls: allFiles.length > 0 ? allFiles : undefined,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] News created successfully:", result)
        setIsCreateOpen(false)
        setNewTitle("")
        setNewMessage("")
        setImageFiles([])
        setImagePreviews([])
        setPdfFiles([])
        setPdfPreviews([])
        fetchNews()
      } else {
        console.error("[v0] Failed to create news:", await response.text())
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
          {isAdmin && (
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              新規作成
            </Button>
          )}
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
                          src={
                            (Array.isArray(news.image_url) ? news.image_url[0] : news.image_url) || "/placeholder.svg"
                          }
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

      <NotificationDetailDialog
        notification={selectedNews}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* 作成ダイアログ */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <DialogTitle className="sr-only">お知らせを作成</DialogTitle>
          <div className="bg-blue-600 px-6 py-4 flex-shrink-0">
            <h2 className="text-lg font-bold text-white">お知らせを作成</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
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
              <Label className="text-gray-700 font-medium">画像・PDF（任意・複数選択可）</Label>
              <div className="mt-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">クリックして画像・PDFを選択（複数可）</p>
                    <p className="text-xs text-gray-400 mt-1">各10MB以下</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={`img-${index}`} className="relative">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`画像${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {pdfPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {pdfPreviews.map((_, index) => (
                      <div key={`pdf-${index}`} className="relative">
                        <div className="w-full h-24 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center">
                          <svg className="w-8 h-8 text-red-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
                          </svg>
                          <span className="text-xs text-red-700">PDF {index + 1}</span>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemovePdf(index)}
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="px-6 pb-6 flex gap-3 flex-shrink-0">
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
