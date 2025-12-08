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
        <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-lg px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 ml-16">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-blue-100 text-sm">トラブル発生時はこちらへ</span>
                <span className="font-bold text-white text-xl">050-1732-5755</span>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <WhatsNew />
            </div>

            <NotificationBell />
          </div>
        </header>

        {/* ページコンテンツ */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}
