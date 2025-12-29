"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface News {
  id: number
  title: string
  message: string
  published_at: string
}

export function WhatsNew() {
  const router = useRouter()
  const [news, setNews] = useState<News | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const startAnimation = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await fetch("/api/news/latest")
        const data = await response.json()
        if (data.news) {
          setNews(data.news)
          startAnimation()
        }
      } catch (error) {
        console.error("Failed to fetch latest news:", error)
      }
    }

    fetchLatestNews()
  }, [startAnimation])

  useEffect(() => {
    if (!news) return

    const interval = setInterval(() => {
      startAnimation()
    }, 10000)

    return () => clearInterval(interval)
  }, [news, startAnimation])

  if (!news) {
    return null
  }

  const handleClick = () => {
    router.push(`/news?id=${news.id}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    date.setHours(date.getHours() + 9)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 md:gap-3 group cursor-pointer hover:opacity-80 transition-opacity"
      >
        <span className="bg-red-500 text-white text-xs md:text-base font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-md animate-pulse shadow-lg whitespace-nowrap">
          NEW
        </span>
        <span
          className={`text-white text-sm md:text-lg font-extrabold transition-all duration-700 ease-out line-clamp-1 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          {news.title}
        </span>
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          {/* 黄色いヘッダー */}
          <div className="bg-yellow-400 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">お知らせ詳細</h2>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* コンテンツ */}
          <div className="px-6 py-5">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{news.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{news && formatDate(news.published_at)}</p>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{news.message || "詳細はありません"}</p>
          </div>

          {/* 黒い閉じるボタン */}
          <div className="px-6 pb-6">
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
            >
              閉じる
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
