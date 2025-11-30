"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface Notification {
  id: number
  title: string
  message: string
  image_url?: string
  created_at: string
  is_read: boolean
}

interface NotificationDetailDialogProps {
  notification: Notification | null
  isOpen: boolean
  onClose: () => void
}

export function NotificationDetailDialog({ notification, isOpen, onClose }: NotificationDetailDialogProps) {
  const [isImageExpanded, setIsImageExpanded] = useState(false)

  // ESCキーで閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isImageExpanded) {
          setIsImageExpanded(false)
        } else {
          onClose()
        }
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose, isImageExpanded])

  // ダイアログが閉じたら画像拡大も閉じる
  useEffect(() => {
    if (!isOpen) {
      setIsImageExpanded(false)
    }
  }, [isOpen])

  if (!isOpen || !notification) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        {/* ダイアログ */}
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-yellow-400">
            <h2 className="font-bold text-gray-900 text-lg">お知らせ詳細</h2>
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-yellow-500 transition-colors">
              <X className="h-5 w-5 text-gray-900" />
            </button>
          </div>

          {/* コンテンツ */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{notification.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{formatDate(notification.created_at)}</p>

            {/* 本文（プレーンテキストとして表示、改行を保持） */}
            <div className="text-gray-700 whitespace-pre-wrap">{notification.message}</div>

            {notification.image_url && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">画像をダブルクリックで拡大表示</p>
                <img
                  src={notification.image_url || "/placeholder.svg"}
                  alt="添付画像"
                  className="w-full rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                  onDoubleClick={() => setIsImageExpanded(true)}
                />
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>

      {isImageExpanded && notification.image_url && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
          onClick={() => setIsImageExpanded(false)}
        >
          <button
            onClick={() => setIsImageExpanded(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <img
            src={notification.image_url || "/placeholder.svg"}
            alt="拡大画像"
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            クリックまたはESCキーで閉じる
          </p>
        </div>
      )}
    </>
  )
}
