"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { NotificationBell } from "./notification-bell"
import { WhatsNew } from "./whats-new"
import { Phone } from "lucide-react"
import { useAuth } from "./auth-provider"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { session } = useAuth()
  const isAdmin = session?.store_id === 0 || session?.store_name === "admin"

  return (
    <div className={`min-h-screen ${isAdmin ? "bg-gray-50" : "bg-sky-50"}`}>
      {/* サイドバー */}
      <Sidebar />

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header
          className={`sticky top-0 z-30 shadow-lg px-4 py-3 md:py-5 ${
            isAdmin
              ? "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600"
              : "bg-sky-800 border-b border-sky-700"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 md:ml-16 relative">
              {/* 通知ベル（スマホでは絶対配置で右上に） */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 md:hidden">
                <NotificationBell />
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <div className={`backdrop-blur-sm rounded-full p-2 md:p-3 ${isAdmin ? "bg-white/20" : "bg-white/10"}`}>
                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs md:text-sm ${isAdmin ? "text-blue-100" : "text-sky-200"}`}>
                    トラブル発生時はこちらへ
                  </span>
                  <span className="font-bold text-white text-base md:text-xl">0800-111-6378</span>
                </div>
              </div>
            </div>

            {/* お知らせ */}
            <div className="flex justify-center md:flex-1">
              <WhatsNew />
            </div>

            {/* 通知ベル（タブレット以上のみ表示） */}
            <div className="hidden md:block">
              <NotificationBell />
            </div>
          </div>
        </header>

        {/* ページコンテンツ */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}
