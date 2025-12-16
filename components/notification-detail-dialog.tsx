"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface Notification {
  id: number
  title: string
  message: string
  image_url?: string | string[]
  created_at: string
  is_read: boolean
}

interface NotificationDetailDialogProps {
  notification: Notification | null
  isOpen: boolean
  onClose: () => void
}

export function NotificationDetailDialog({ notification, isOpen, onClose }: NotificationDetailDialogProps) {
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null)

  // ESCキーで閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (expandedImageIndex !== null) {
          setExpandedImageIndex(null)
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
  }, [isOpen, onClose, expandedImageIndex])

  useEffect(() => {
    if (!isOpen) {
      setExpandedImageIndex(null)
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

  const isPDF = (url: string) => {
    return (
      url.includes("application/pdf") || url.toLowerCase().endsWith(".pdf") || url.startsWith("data:application/pdf")
    )
  }

  const handleImageDoubleClick = (index: number, url: string) => {
    console.log("[v0] Image double clicked:", { index, url: url.substring(0, 50) })
    if (!isPDF(url)) {
      setExpandedImageIndex(index)
      console.log("[v0] Expanding image at index:", index)
    } else {
      console.log("[v0] Skipping PDF file")
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        {/* ダイアログ */}
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600">
            <h2 className="font-bold text-white text-lg">お知らせ詳細</h2>
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-blue-700 transition-colors">
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* コンテンツ */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{notification.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{formatDate(notification.created_at)}</p>

            {/* 本文 */}
            <div className="text-gray-700 whitespace-pre-wrap">{notification.message}</div>

            {notification.image_url && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">画像をダブルクリックで拡大表示</p>
                {Array.isArray(notification.image_url) ? (
                  <div className="grid grid-cols-2 gap-2">
                    {notification.image_url.map((url, index) => (
                      <div key={index}>
                        {isPDF(url) ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
                          >
                            <svg className="w-12 h-12 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">PDF {index + 1}</span>
                            <span className="text-xs text-gray-500 mt-1">クリックで開く</span>
                          </a>
                        ) : (
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`添付画像${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                            onDoubleClick={() => handleImageDoubleClick(index, url)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {isPDF(notification.image_url) ? (
                      <a
                        href={notification.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
                      >
                        <svg className="w-12 h-12 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">PDFファイル</span>
                        <span className="text-xs text-gray-500 mt-1">クリックで開く</span>
                      </a>
                    ) : (
                      <img
                        src={notification.image_url || "/placeholder.svg"}
                        alt="添付画像"
                        className="w-full rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                        onDoubleClick={() => handleImageDoubleClick(0, notification.image_url as string)}
                      />
                    )}
                  </>
                )}
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

      {expandedImageIndex !== null && notification.image_url && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
          onClick={() => setExpandedImageIndex(null)}
        >
          <button
            onClick={() => setExpandedImageIndex(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {Array.isArray(notification.image_url) && notification.image_url.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setExpandedImageIndex((prev) =>
                    prev === null ? 0 : prev > 0 ? prev - 1 : notification.image_url!.length - 1,
                  )
                }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              >
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setExpandedImageIndex((prev) =>
                    prev === null ? 0 : prev < notification.image_url!.length - 1 ? prev + 1 : 0,
                  )
                }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              >
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <img
            src={
              (Array.isArray(notification.image_url)
                ? notification.image_url[expandedImageIndex]
                : notification.image_url) || "/placeholder.svg"
            }
            alt="拡大画像"
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
            {Array.isArray(notification.image_url) && notification.image_url.length > 1 && (
              <p className="text-white/90 text-sm mb-1">
                {expandedImageIndex + 1} / {notification.image_url.length}
              </p>
            )}
            <p className="text-white/70 text-sm">クリックまたはESCキーで閉じる</p>
          </div>
        </div>
      )}
    </>
  )
}
