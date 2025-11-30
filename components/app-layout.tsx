"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { NotificationBell } from "./notification-bell"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* サイドバー */}
      <Sidebar />

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* ヘッダー（通知アイコン用） */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-end">
            {/* ハンバーガーメニュー分のスペーサー */}
            <div className="w-10" />
            <div className="flex-1" />
            <NotificationBell />
          </div>
        </header>

        {/* ページコンテンツ */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}
