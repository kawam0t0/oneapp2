"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CalendarEvent {
  id: string
  title: string
  date: string
  color: string
  store_name?: string
  is_generated_holiday?: boolean
  is_maintenance_week?: boolean
}

export function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [storeName, setStoreName] = useState("")
  const [storeId, setStoreId] = useState<number | null>(null)

  useEffect(() => {
    // セッションから店舗情報を取得
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        console.log("[v0] Session data:", data)
        if (data?.store_name) {
          // 例: "SPLASH'N'GO!前橋50号店" → "前橋50号"
          const fullName = data.store_name as string
          const shortName = fullName.replace("SPLASH'N'GO!", "").replace("店", "").trim()
          console.log("[v0] Store name extracted:", shortName, "from", fullName)
          setStoreName(shortName)
        }
        if (data?.store_id) {
          setStoreId(data.store_id)
        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!storeId || !storeName) return

    // カレンダーイベントを取得
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1

    fetch(`/api/calendar?year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((data: CalendarEvent[]) => {
        if (Array.isArray(data)) {
          console.log("[v0] All events:", data.length)

          const holidayEvents = data.filter((event) => event.is_generated_holiday === true)
          console.log(
            "[v0] Holiday events:",
            holidayEvents.map((e) => e.title),
          )
          console.log("[v0] Looking for store:", storeName)

          // 自店舗の定休日（タイトルに自店舗名が含まれる）
          const filteredEvents = data.filter((event) => {
            const isMyStoreHoliday = event.is_generated_holiday === true && event.title?.includes(storeName)
            // 自店舗のメンテナンス週間
            const isMyMaintenanceWeek = event.is_maintenance_week === true

            if (isMyStoreHoliday) {
              console.log("[v0] Found my store holiday:", event.title)
            }

            return isMyStoreHoliday || isMyMaintenanceWeek
          })
          console.log("[v0] Filtered events:", filteredEvents.length)
          setEvents(filteredEvents)
        }
      })
      .catch(console.error)
  }, [currentDate, storeId, storeName])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // 月の最初の日と最後の日
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  // カレンダーの開始日（前月の日曜日から）
  const startDay = new Date(firstDayOfMonth)
  startDay.setDate(startDay.getDate() - startDay.getDay())

  // カレンダーの終了日（翌月の土曜日まで）
  const endDay = new Date(lastDayOfMonth)
  endDay.setDate(endDay.getDate() + (6 - endDay.getDay()))

  // カレンダーの日付を生成
  const days: Date[] = []
  const current = new Date(startDay)
  while (current <= endDay) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  // 週ごとにグループ化
  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatDateKey = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  const getEventsForDate = (date: Date) => {
    const dateKey = formatDateKey(date)
    return events.filter((event) => event.date === dateKey)
  }

  const today = new Date()
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month
  }

  const dayNames = ["日", "月", "火", "水", "木", "金", "土"]

  // イベントタイトルを短縮
  const shortenTitle = (title: string) => {
    if (title.includes("定休日")) {
      return ""
    }
    if (title.includes("メンテナンス")) {
      return ""
    }
    return title.substring(0, 2)
  }

  return (
    <Card className="p-3 shadow-lg border-blue-100">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h3 className="text-sm font-bold text-gray-800">
          {year}年 {month + 1}月
        </h3>
        <Button variant="outline" size="sm" className="h-6 text-xs px-2 bg-transparent" onClick={goToToday}>
          今日
        </Button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-1 ${
              index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー本体 */}
      <div className="space-y-0.5">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((date, dayIndex) => {
              const dateEvents = getEventsForDate(date)
              const isSunday = dayIndex === 0
              const isSaturday = dayIndex === 6

              return (
                <div
                  key={dayIndex}
                  className={`relative min-h-[40px] p-0.5 text-center border-t border-gray-100 ${
                    !isCurrentMonth(date) ? "bg-gray-50" : ""
                  }`}
                >
                  {/* 日付 */}
                  <div
                    className={`text-xs mb-0.5 ${
                      isToday(date)
                        ? "bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto"
                        : !isCurrentMonth(date)
                          ? "text-gray-300"
                          : isSunday
                            ? "text-red-500"
                            : isSaturday
                              ? "text-blue-500"
                              : "text-gray-700"
                    }`}
                  >
                    {date.getDate()}
                  </div>

                  {/* イベント（最大2つまで表示） */}
                  <div className="space-y-0.5">
                    {dateEvents.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="text-[8px] leading-tight px-0.5 py-0.5 rounded truncate text-white font-medium"
                        style={{
                          backgroundColor: event.is_generated_holiday
                            ? "#ef4444"
                            : event.is_maintenance_week
                              ? "#22c55e"
                              : event.color,
                        }}
                        title={event.title}
                      >
                        {shortenTitle(event.title)}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* 凡例 */}
      <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-2 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-red-500"></div>
          <span className="text-gray-600">定休日</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-green-500"></div>
          <span className="text-gray-600">メンテ週間</span>
        </div>
      </div>
    </Card>
  )
}
