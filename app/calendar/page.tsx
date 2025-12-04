"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ChevronLeft, ChevronRight, X, Trash2 } from "lucide-react"
import { AppLayout } from "@/components/app-layout"

interface CalendarEvent {
  id?: number
  title: string
  date: string
  color: string
  isClosed?: boolean
  isStoreClosed?: boolean
  isNotice?: boolean
  isOrder?: boolean
  is_global?: boolean
  store_id?: number
  store_name?: string // 店舗名を追加
}

const STORE_COLOR_MAP: { [key: string]: string } = {
  前橋50号: "#3b82f6",
  伊勢崎韮塚: "#22c55e",
  高崎棟高: "#f97316",
  足利緑町: "#ef4444",
  新前橋: "#a855f7",
  太田新田: "#06b6d4",
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState("")
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [dbEvents, setDbEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentStoreName, setCurrentStoreName] = useState<string>("")

  const getHolidayEvents = useCallback((date: Date): CalendarEvent[] => {
    const year = date.getFullYear()
    const holidays: CalendarEvent[] = [
      { title: "元日", date: `${year}-01-01`, color: "#ef4444", isClosed: true, is_global: true },
      { title: "成人の日", date: `${year}-01-13`, color: "#f97316", isNotice: true, is_global: true },
      { title: "建国記念の日", date: `${year}-02-11`, color: "#f97316", isNotice: true, is_global: true },
      { title: "天皇誕生日", date: `${year}-02-23`, color: "#f97316", isNotice: true, is_global: true },
      { title: "春分の日", date: `${year}-03-20`, color: "#f97316", isNotice: true, is_global: true },
      { title: "昭和の日", date: `${year}-04-29`, color: "#f97316", isNotice: true, is_global: true },
      { title: "憲法記念日", date: `${year}-05-03`, color: "#f97316", isNotice: true, is_global: true },
      { title: "みどりの日", date: `${year}-05-04`, color: "#f97316", isNotice: true, is_global: true },
      { title: "こどもの日", date: `${year}-05-05`, color: "#f97316", isNotice: true, is_global: true },
      { title: "海の日", date: `${year}-07-21`, color: "#f97316", isNotice: true, is_global: true },
      { title: "山の日", date: `${year}-08-11`, color: "#f97316", isNotice: true, is_global: true },
      { title: "敬老の日", date: `${year}-09-15`, color: "#f97316", isNotice: true, is_global: true },
      { title: "秋分の日", date: `${year}-09-23`, color: "#f97316", isNotice: true, is_global: true },
      { title: "スポーツの日", date: `${year}-10-14`, color: "#f97316", isNotice: true, is_global: true },
      { title: "文化の日", date: `${year}-11-03`, color: "#f97316", isNotice: true, is_global: true },
      { title: "勤労感謝の日", date: `${year}-11-23`, color: "#f97316", isNotice: true, is_global: true },
      { title: "大晦日", date: `${year}-12-31`, color: "#ef4444", isClosed: true, is_global: true },
    ]

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)



    return holidays
  }, [])

  const fetchEvents = useCallback(async (date: Date) => {
    try {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const res = await fetch(`/api/calendar?year=${year}&month=${month}`)
      if (res.ok) {
        const data = await res.json()
        setDbEvents(data)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    }
  }, [])

  const handlePrevMonth = useCallback(() => {
    if (currentDate) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }
  }, [currentDate])

  const handleNextMonth = useCallback(() => {
    if (currentDate) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }
  }, [currentDate])

  const handleDateClick = useCallback((date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    setSelectedDate(dateStr)
    setIsModalOpen(true)
  }, [])

  const handleDeleteEvent = useCallback(
    async (eventId: number) => {
      if (!confirm("このイベントを削除しますか？")) return

      try {
        const res = await fetch(`/api/calendar/${eventId}`, {
          method: "DELETE",
        })

        if (res.ok) {
          if (currentDate) {
            await fetchEvents(currentDate)
          }
        }
      } catch (error) {
        console.error("Failed to delete event:", error)
      }
    },
    [currentDate, fetchEvents],
  )

  const addEvent = useCallback(async () => {
    if (!newEventTitle.trim() || !selectedDate) {
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEventTitle.trim(),
          date: selectedDate,
        }),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setNewEventTitle("")

        if (currentDate) {
          await fetchEvents(currentDate)
        }
      }
    } catch (error) {
      console.error("Failed to add event:", error)
    } finally {
      setIsLoading(false)
    }
  }, [newEventTitle, selectedDate, currentDate, fetchEvents])

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session")
        if (res.ok) {
          const data = await res.json()
          setCurrentStoreName(data.store_name || "")
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      }
    }
    fetchSession()
  }, [])

  useEffect(() => {
    setCurrentDate(new Date())
  }, [])

  useEffect(() => {
    if (currentDate) {
      fetchEvents(currentDate)
    }
  }, [currentDate, fetchEvents])

  useEffect(() => {
    if (currentDate) {
      const holidayEvents = getHolidayEvents(currentDate)
      setEvents([...holidayEvents, ...dbEvents])
    }
  }, [currentDate, dbEvents, getHolidayEvents])

  const calendarData = useMemo(() => {
    if (!currentDate) return null

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const startDayOfWeek = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    const prevMonthLastDay = new Date(year, month, 0).getDate()
    const nextMonthDays = 42 - (startDayOfWeek + daysInMonth)

    const calendarDays = []

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      })
    }

    for (let day = 1; day <= nextMonthDays; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day),
      })
    }

    return { year, month, today, calendarDays }
  }, [currentDate])

  const getEventsForDate = useCallback(
    (date: Date) => {
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      return events.filter((event) => event.date === dateStr)
    },
    [events],
  )

  const currentStoreColor = STORE_COLOR_MAP[currentStoreName] || "#3b82f6"
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"]

  const isOtherStoreClosedDay = (event: CalendarEvent) => {
    return event.title.includes("定休日") && event.store_name && event.store_name !== currentStoreName
  }

  const getEventDisplayTitle = (event: CalendarEvent) => {
    if (event.title.includes("定休日") && event.store_name) {
      return `${event.store_name}定休日`
    }
    return event.title
  }

  if (!currentDate || !calendarData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </AppLayout>
    )
  }

  const { year, month, today, calendarDays } = calendarData

  return (
    <AppLayout>
      <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
        {/* ヘッダー */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6 text-blue-600" />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {year}年 {month + 1}月
            </h2>
            <button onClick={handleNextMonth} className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
              <ChevronRight className="w-6 h-6 text-blue-600" />
            </button>
          </div>
          {currentStoreName && (
            <div className="mt-2 text-center">
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: currentStoreColor }}
              >
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {currentStoreName}のカレンダー
              </span>
            </div>
          )}
        </div>

        {/* カレンダーグリッド */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 overflow-hidden">
          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 bg-blue-600 text-white">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`py-3 text-center font-bold text-sm ${
                  index === 0 ? "text-red-200" : index === 6 ? "text-blue-200" : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 日付グリッド */}
          <div className="grid grid-cols-7">
            {calendarDays.map((dayInfo, index) => {
              const dayEvents = getEventsForDate(dayInfo.date)
              const isToday =
                dayInfo.isCurrentMonth &&
                dayInfo.date.getDate() === today.getDate() &&
                dayInfo.date.getMonth() === today.getMonth() &&
                dayInfo.date.getFullYear() === today.getFullYear()
              const dayOfWeek = dayInfo.date.getDay()
              const isClosed = dayEvents.some((e) => e.isClosed || e.isStoreClosed)

              return (
                <div
                  key={index}
                  onClick={() => dayInfo.isCurrentMonth && handleDateClick(dayInfo.date)}
                  className={`min-h-[100px] md:min-h-[120px] p-1 border-b border-r border-gray-100 cursor-pointer transition-colors ${
                    !dayInfo.isCurrentMonth ? "bg-gray-50 text-gray-400" : isClosed ? "bg-gray-100" : "hover:bg-blue-50"
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full mb-1 ${
                        isToday
                          ? "bg-blue-600 text-white"
                          : dayOfWeek === 0
                            ? "text-red-500"
                            : dayOfWeek === 6
                              ? "text-blue-500"
                              : "text-gray-700"
                      }`}
                    >
                      {dayInfo.day}
                    </span>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      {dayEvents.slice(0, 3).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="text-xs px-1 py-0.5 rounded truncate text-white font-medium"
                          style={{ backgroundColor: event.color }}
                          title={getEventDisplayTitle(event)}
                        >
                          {getEventDisplayTitle(event)}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 px-1">+{dayEvents.length - 3}件</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* イベント追加モーダル */}
        {isModalOpen && selectedDate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-2 border-blue-200">
              <div className="p-4 border-b border-blue-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{selectedDate} のイベント</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* 既存のイベント一覧 */}
              <div className="p-4 border-b border-blue-100 max-h-48 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-700 mb-2">登録済みイベント</h4>
                {events.filter((e) => e.date === selectedDate).length > 0 ? (
                  <div className="space-y-2">
                    {events
                      .filter((e) => e.date === selectedDate)
                      .map((event, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg"
                          style={{ backgroundColor: `${event.color}20` }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
                            <span className="text-sm font-medium text-gray-800">{getEventDisplayTitle(event)}</span>
                          </div>
                          {event.id && !event.is_global && !isOtherStoreClosedDay(event) && (
                            <button
                              onClick={() => handleDeleteEvent(event.id!)}
                              className="p-1 hover:bg-red-100 rounded-full transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">イベントはありません</p>
                )}
              </div>

              {/* 新規イベント追加フォーム */}
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">イベント名</label>
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="イベント名を入力"
                    className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">イベントの色</label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: currentStoreColor }}
                    />
                    <span className="text-sm text-gray-600">{currentStoreName}の店舗カラーが自動適用されます</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-blue-200 flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={addEvent}
                  disabled={isLoading || !newEventTitle.trim()}
                  className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "追加中..." : "追加"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
