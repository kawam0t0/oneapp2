"use client"

import type React from "react"

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
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

const STORE_SPREADSHEETS: Record<string, { common: string; store: string }> = {
  "SPLASH'N'GO!前橋50号店": {
    common: "https://docs.google.com/spreadsheets/d/1ABKj53q3O4gVxd__6PyYWcxDkl8XpdIJdyGM9E50z0w/edit?usp=sharing",
    store: "https://docs.google.com/spreadsheets/d/1aW1T-sdZNnJ80yUcr5b6ZI8phabOBQTmiPQauLYT-bY/edit?usp=sharing",
  },
  "SPLASH'N'GO!伊勢崎韮塚店": {
    common: "https://docs.google.com/spreadsheets/d/1ABKj53q3O4gVxd__6PyYWcxDkl8XpdIJdyGM9E50z0w/edit?usp=sharing",
    store: "https://docs.google.com/spreadsheets/d/18CatauVqEfVvcG4bsC2xa4dXbuz9MnkuhfRNrHQ-EWM/edit?usp=sharing",
  },
  "SPLASH'N'GO!高崎棟高店": {
    common: "https://docs.google.com/spreadsheets/d/1ABKj53q3O4gVxd__6PyYWcxDkl8XpdIJdyGM9E50z0w/edit?usp=sharing",
    store: "https://docs.google.com/spreadsheets/d/1KD9v1CVWW-6Bpy23_aHGybCPU6euN6OFxr07bCrTssk/edit?usp=sharing",
  },
  "SPLASH'N'GO!新前橋店": {
    common: "https://docs.google.com/spreadsheets/d/1ABKj53q3O4gVxd__6PyYWcxDkl8XpdIJdyGM9E50z0w/edit?usp=sharing",
    store: "https://docs.google.com/spreadsheets/d/1V3m-_6pKHrhvv01kOlusufXqsDFC1wXqWG12JcurcM4/edit?usp=sharing",
  },
  "SPLASH'N'GO!足利緑町店": {
    common: "https://docs.google.com/spreadsheets/d/1ABKj53q3O4gVxd__6PyYWcxDkl8XpdIJdyGM9E50z0w/edit?usp=sharing",
    store: "https://docs.google.com/spreadsheets/d/1Rjg7oOhylXWsD7oFoqX4gIo6l_MkshSlyAEg_NrzTw8/edit?usp=sharing",
  },
  "SPLASH'N'GO!太田新田店": {
    common: "https://docs.google.com/spreadsheets/d/1ABKj53q3O4gVxd__6PyYWcxDkl8XpdIJdyGM9E50z0w/edit?usp=sharing",
    store: "https://docs.google.com/spreadsheets/d/15LnujbB0gF08zMsNpGPpUUtb_LsKFohgRP9cNIGeiLk/edit?usp=sharing",
  },
}

const ADMIN_SPREADSHEETS = {
  common: "https://docs.google.com/spreadsheets/d/1ABKj53q3O4gVxd__6PyYWcxDkl8XpdIJdyGM9E50z0w/edit?usp=sharing",
}

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
    isSpreadsheet: true,
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
    adminOnly: true,
  },
  {
    name: "メンテナンス",
    href: "/maintenance",
    icon: Wrench,
    external: false,
  },
  {
    name: "部品交換履歴",
    href: "/parts-replacement",
    icon: Settings,
    external: false,
  },
  {
    name: "日報",
    href: "/daily-report",
    icon: ClipboardList,
    external: false,
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
  const [isSpreadsheetSubmenuOpen, setIsSpreadsheetSubmenuOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useAuth()

  const isAdmin = session?.store_id === 0 || session?.store_name === "admin"

  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
  }

  const handleCommonSpreadsheetClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (session?.store_name) {
      const urls = STORE_SPREADSHEETS[session.store_name]
      if (urls) {
        window.open(urls.common, "_blank")
      } else if (isAdmin) {
        window.open(ADMIN_SPREADSHEETS.common, "_blank")
      }
    } else if (isAdmin) {
      window.open(ADMIN_SPREADSHEETS.common, "_blank")
    }
    setIsOpen(false)
  }

  const handleStoreSpreadsheetClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (session?.store_name) {
      const urls = STORE_SPREADSHEETS[session.store_name]
      if (urls) {
        window.open(urls.store, "_blank")
      }
    }
    setIsOpen(false)
  }

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.adminOnly && !isAdmin) {
      return false
    }
    return true
  })

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

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredMenuItems.map((item) => {
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

            if (item.isSpreadsheet) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setIsSpreadsheetSubmenuOpen(!isSpreadsheetSubmenuOpen)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left",
                      "text-white hover:bg-blue-500",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{item.name}</span>
                    {isSpreadsheetSubmenuOpen ? (
                      <ChevronUp className="h-4 w-4 text-blue-200" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-blue-200" />
                    )}
                  </button>

                  {isSpreadsheetSubmenuOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <button
                        onClick={handleCommonSpreadsheetClick}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-blue-500 transition-colors w-full text-left text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>移動ラベル</span>
                      </button>
                      <button
                        onClick={handleStoreSpreadsheetClick}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-blue-500 transition-colors w-full text-left text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>各店舗シート</span>
                      </button>
                    </div>
                  )}
                </div>
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
