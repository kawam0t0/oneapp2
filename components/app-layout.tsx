"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { NotificationBell } from "./notification-bell"
import { WhatsNew } from "./whats-new"
import { Phone } from "lucide-react"

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
        <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-lg px-4 py-3 md:py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* 電話番号とお知らせを横並びに */}
            <div className="flex items-center justify-between md:justify-start gap-2 md:gap-3 md:ml-16">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 md:p-3">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-blue-100 text-xs md:text-sm">トラブル発生時はこちらへ</span>
                  <span className="font-bold text-white text-base md:text-xl">050-1732-5755</span>
                </div>
              </div>

              {/* スマホでは通知ベルをここに配置 */}
              <div className="md:hidden">
                <NotificationBell />
              </div>
            </div>

            {/* お知らせ（スマホでは下に配置、タブレット以上では中央） */}
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
