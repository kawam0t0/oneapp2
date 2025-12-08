"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileSpreadsheet,
  ClipboardList,
  Package,
  CalendarDays,
  Menu,
  X,
  ExternalLink,
  LogOut,
  Store,
  Trophy,
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

const menuItems = [
  {
    name: "ダッシュボード",
    href: "/",
    icon: LayoutDashboard,
    external: false,
  },
  {
    name: "スプレッドシート",
    href: "/spreadsheet",
    icon: FileSpreadsheet,
    external: false,
  },
  {
    name: "カレンダー",
    href: "/calendar",
    icon: CalendarDays,
    external: false,
  },
  {
    name: "キャンペーン",
    href: "/campaign",
    icon: Trophy,
    external: false,
  },
  {
    name: "メンテナンス",
    href: "/maintenance",
    icon: Wrench,
    external: false,
  },
  {
    name: "日報",
    href: "https://www.appsheet.com/start/43947cc3-3995-4964-9245-9131aa293b5e",
    icon: ClipboardList,
    external: true,
  },
  {
    name: "備品発注",
    href: "https://kawam0t0-orderwebapp20250502.vercel.app/login",
    icon: Package,
    external: true,
  },
  {
    name: "シフト",
    href: "https://connect.airregi.jp/login?client_id=SFT&redirect_uri=https%3A%2F%2Fconnect.airregi.jp%2Foauth%2Fauthorize%3Fclient_id%3DSFT%26redirect_uri%3Dhttps%253A%252F%252Fairshift.jp%252Fsft%252Fcallback%26response_type%3Dcode%26state%3DredirectTo%253A%25252Fsft%25252F",
    icon: ExternalLink,
    external: true,
  },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useAuth()

  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        aria-label="メニューを開く"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-blue-600 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-500">
          <h1 className="text-lg font-bold text-white">ONEAPP</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-blue-500"
            aria-label="メニューを閉じる"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {session && (
          <div className="px-4 py-3 border-b border-blue-500 bg-blue-700">
            <div className="flex items-center gap-2 text-white">
              <Store className="h-4 w-4" />
              <span className="text-sm font-medium truncate">{session.store_name}</span>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-blue-500 transition-colors",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.name}</span>
                  <ExternalLink className="h-4 w-4 text-blue-200" />
                </a>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive ? "bg-white text-blue-600 font-semibold" : "text-white hover:bg-blue-500",
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white hover:bg-red-500 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>ログアウト</span>
          </button>
        </div>
      </aside>
    </>
  )
}
