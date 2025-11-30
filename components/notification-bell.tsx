"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, X, Plus } from "lucide-react"
import Link from "next/link"
import { NotificationDetailDialog } from "./notification-detail-dialog"

interface Notification {
  id: number
  title: string
  message: string
  image_url?: string
  created_at: string
  is_read: boolean
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 通知を取得
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setNotifications(data)
          setUnreadCount(data.filter((n: Notification) => !n.is_read).length)
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  // 全て既読にする
  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", { method: "POST" })
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  // 個別の通知を既読にする
  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" })
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  // 通知をクリックして詳細を表示
  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsDialogOpen(true)
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return ""

    try {
      // MySQLの日付形式 "YYYY-MM-DD HH:mm:ss" をパース
      const cleanDateString = dateString.replace(" ", "T")
      const date = new Date(cleanDateString)

      // Invalid Date チェック
      if (isNaN(date.getTime())) {
        console.log("[v0] Invalid date string:", dateString)
        return ""
      }

      return date.toLocaleDateString("ja-JP", {
        timeZone: "Asia/Tokyo",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.log("[v0] Date parse error:", error)
      return ""
    }
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* ベルアイコン */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="お知らせ"
        >
          <Bell className="h-6 w-6 text-gray-700" />
          {/* 未読バッジ */}
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* ドロップダウン */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">お知らせ</h3>
              <div className="flex items-center gap-2">
                <Link
                  href="/notifications/create"
                  className="p-1.5 rounded-md hover:bg-yellow-100 text-yellow-600"
                  title="お知らせを作成"
                  onClick={() => setIsOpen(false)}
                >
                  <Plus className="h-5 w-5" />
                </Link>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-md hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* 通知リスト */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">お知らせはありません</div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                      !notification.is_read ? "bg-yellow-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!notification.is_read && (
                        <span className="mt-1.5 h-2 w-2 bg-red-500 rounded-full flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {notification.message.replace(/<[^>]*>/g, "")}
                        </p>
                        <span className="text-gray-400 text-xs mt-2 block">{formatDate(notification.created_at)}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* フッター */}
            {notifications.length > 0 && unreadCount > 0 && (
              <div className="p-3 border-t border-gray-200">
                <button
                  onClick={markAllAsRead}
                  className="w-full py-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  すべて既読にする
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 詳細ダイアログ */}
      <NotificationDetailDialog
        notification={selectedNotification}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedNotification(null)
        }}
      />
    </>
  )
}
