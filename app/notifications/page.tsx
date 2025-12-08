"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Bell, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Notification {
  id: number
  title: string
  message: string
  created_at: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const highlightId = searchParams.get("id")

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications")
        const data = await response.json()
        setNotifications(data.notifications || [])

        // URLにidが指定されていたら、そのお知らせを選択
        if (highlightId) {
          const found = (data.notifications || []).find((n: Notification) => n.id === Number.parseInt(highlightId))
          if (found) {
            setSelectedNotification(found)
          }
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [highlightId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    // 日本時間に変換
    const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000)
    return jstDate.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-600" />
          お知らせ一覧
        </h1>
      </div>

      {selectedNotification && (
        <Card className="mb-6 border-blue-500 border-2">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-xl text-blue-800">{selectedNotification.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              {formatDate(selectedNotification.created_at)}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="whitespace-pre-wrap">{selectedNotification.message}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">お知らせはありません</CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedNotification?.id === notification.id ? "ring-2 ring-blue-500" : ""
              } ${highlightId && Number.parseInt(highlightId) === notification.id ? "bg-blue-50" : ""}`}
              onClick={() => setSelectedNotification(notification)}
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{notification.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{notification.message}</p>
                  </div>
                  <div className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                    {formatDate(notification.created_at)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
