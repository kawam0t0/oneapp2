"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import { getJapaneseHolidays, type Holiday } from "@/lib/japanese-holidays"

interface CalendarEvent {
  id: number
  title: string
  date: string
  color: string
  isHoliday?: boolean
  isClosed?: boolean
  isStoreClosed?: boolean
  isNotice?: boolean
  isOrder?: boolean
}

const COLORS = [
  { name: "赤", value: "#ef4444" },
  { name: "青", value: "#3b82f6" },
  { name: "緑", value: "#22c55e" },
  { name: "黄", value: "#eab308" },
  { name: "紫", value: "#a855f7" },
  { name: "ピンク", value: "#ec4899" },
  { name: "オレンジ", value: "#f97316" },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventColor, setNewEventColor] = useState(COLORS[0].value)
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedDateForDetail, setSelectedDateForDetail] = useState<string | null>(null)
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    setCurrentDate(new Date())
    setIsClient(true)
  }, [])

  const getHolidayEvents = (date: Date): CalendarEvent[] => {
    const year = date.getFullYear()
    const holidays: Holiday[] = getJapaneseHolidays(year)

    const prevYearHolidays: Holiday[] = year > 2024 ? getJapaneseHolidays(year - 1) : []
    const nextYearHolidays: Holiday[] = year < 2030 ? getJapaneseHolidays(year + 1) : []

    const allHolidays: Holiday[] = [...prevYearHolidays, ...holidays, ...nextYearHolidays]

    return allHolidays.map((h: Holiday, index: number) => {
      const isHoliday = h.type === "holiday"
      const isClosed = h.type === "closed"
      const isStoreClosed = h.type === "store-closed"
      const isNotice = h.type === "notice"
      const isOrder = h.type === "order"

      let eventColor = "#ef4444"
      if (h.color) {
        eventColor = h.color
      } else if (isClosed || isStoreClosed) {
        eventColor = "#6b7280"
      } else if (isNotice) {
        eventColor = "#3b82f6"
      } else if (isOrder) {
        eventColor = "#22c55e"
      }

      return {
        id: -index - 1,
        title: h.name,
        date: h.date,
        color: eventColor,
        isHoliday,
        isClosed,
        isStoreClosed,
        isNotice,
        isOrder,
      }
    })
  }

  const fetchEvents = async (date: Date) => {
    try {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const url = `/api/calendar?year=${year}&month=${month}`

      const res = await fetch(url)

      const holidayEvents = getHolidayEvents(date)

      if (res.ok) {
        const data = await res.json()

        if (Array.isArray(data)) {
          const allEvents = [...holidayEvents, ...data]
          setEvents(allEvents)
        } else {
          setEvents(holidayEvents)
        }
      } else {
        setEvents(holidayEvents)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
      if (date) {
        setEvents(getHolidayEvents(date))
      }
    }
  }

  useEffect(() => {
    if (currentDate) {
      fetchEvents(currentDate)
    }
  }, [currentDate])

  const changeMonth = (delta: number) => {
    if (!currentDate) return
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDay = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days: { date: Date; isCurrentMonth: boolean }[] = []

    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      })
    }

    return days
  }

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  const openAddModal = (date: Date) => {
    setSelectedDate(formatDateKey(date))
    setNewEventTitle("")
    setNewEventColor(COLORS[0].value)
    setIsModalOpen(true)
  }

  const addEvent = async () => {
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
          color: newEventColor,
        }),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setNewEventTitle("")

        if (currentDate) {
          await fetchEvents(currentDate)

          const holidayEvents = getHolidayEvents(currentDate)
          const year = currentDate.getFullYear()
          const month = currentDate.getMonth() + 1
          const fetchRes = await fetch(`/api/calendar?year=${year}&month=${month}`)
          if (fetchRes.ok) {
            const data = await fetchRes.json()
            if (Array.isArray(data)) {
              const allEvents = [...holidayEvents, ...data]
              const updatedDayEvents = allEvents.filter((e) => e.date === selectedDate)
              setSelectedDateForDetail(selectedDate)
              setSelectedDateEvents(updatedDayEvents)
              setIsDetailModalOpen(true)
            }
          }
        }
      } else {
        const errorData = await res.json()
        alert(`イベントの追加に失敗しました: ${errorData.error || "不明なエラー"}`)
      }
    } catch (error) {
      console.error("Failed to add event:", error)
      alert("イベントの追加に失敗しました。ネットワーク接続を確認してください。")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteEvent = async (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    if (event.isHoliday || event.isClosed || event.isStoreClosed || event.isNotice || event.isOrder) return
    if (!confirm("このイベントを削除しますか？")) return

    try {
      const res = await fetch(`/api/calendar/${event.id}`, { method: "DELETE" })
      if (res.ok && currentDate) {
        fetchEvents(currentDate)
      }
    } catch (error) {
      console.error("Failed to delete event:", error)
    }
  }

  const openDetailModal = (date: Date, dayEvents: CalendarEvent[]) => {
    const dateKey = formatDateKey(date)
    setSelectedDateForDetail(dateKey)
    setSelectedDateEvents(dayEvents)
    setIsDetailModalOpen(true)
  }

  const openAddModalFromDetail = () => {
    setIsDetailModalOpen(false)
    if (selectedDateForDetail) {
      setSelectedDate(selectedDateForDetail)
      setNewEventTitle("")
      setNewEventColor(COLORS[0].value)
      setIsModalOpen(true)
    }
  }

  const deleteEventFromDetail = async (event: CalendarEvent) => {
    if (event.isHoliday || event.isClosed || event.isStoreClosed || event.isNotice || event.isOrder) return
    if (!confirm("このイベントを削除しますか？")) return

    try {
      const res = await fetch(`/api/calendar/${event.id}`, { method: "DELETE" })
      if (res.ok && currentDate) {
        fetchEvents(currentDate)
        setSelectedDateEvents((prev) => prev.filter((e) => e.id !== event.id))
      }
    } catch (error) {
      console.error("Failed to delete event:", error)
    }
  }

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr)
    const weekDayNames = ["日", "月", "火", "水", "木", "金", "土"]
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${weekDayNames[date.getDay()]}）`
  }

  const getEventStyle = (event: CalendarEvent) => {
    if (event.isHoliday) {
      return {
        className: "text-red-700",
        style: { backgroundColor: "#fee2e2" },
      }
    }
    if (event.isClosed || event.isStoreClosed) {
      return {
        className: "text-gray-700",
        style: { backgroundColor: "#e5e7eb" },
      }
    }
    if (event.isNotice) {
      return {
        className: "text-blue-700",
        style: { backgroundColor: "#dbeafe" },
      }
    }
    if (event.isOrder) {
      return {
        className: "text-green-700",
        style: { backgroundColor: "#dcfce7" },
      }
    }
    return {
      className: "text-white",
      style: { backgroundColor: event.color },
    }
  }

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"]

  if (!isClient || !currentDate) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-blue-50 p-4 md:p-6 flex items-center justify-center">
          <div className="text-blue-700">読み込み中...</div>
        </div>
      </AppLayout>
    )
  }

  const days = generateCalendarDays(currentDate)
  const today = new Date()
  const todayKey = formatDateKey(today)

  const holidayDates = new Set(events.filter((e) => e.isHoliday).map((e) => e.date))
  const closedDates = new Set(events.filter((e) => e.isClosed).map((e) => e.date))
  const storeClosedDates = new Set(events.filter((e) => e.isStoreClosed).map((e) => e.date))
  const noticeDates = new Set(events.filter((e) => e.isNotice).map((e) => e.date))
  const orderDates = new Set(events.filter((e) => e.isOrder).map((e) => e.date))

  return (
    <AppLayout>
      <div className="min-h-screen bg-blue-50 p-4 md:p-6">
        {/* ヘッダー - 青色ベースに変更 */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-blue-400 p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                今日
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                  <ChevronLeft className="h-5 w-5 text-blue-700" />
                </button>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                  <ChevronRight className="h-5 w-5 text-blue-700" />
                </button>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
              </h1>
            </div>
          </div>
        </div>

        {/* カレンダー - 青色ベースに変更 */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-blue-400 overflow-hidden">
          {/* 曜日ヘッダー - 青色背景 */}
          <div className="grid grid-cols-7 bg-blue-600">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`py-3 text-center text-sm font-bold ${
                  index === 0 ? "text-red-300" : index === 6 ? "text-blue-200" : "text-white"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 日付グリッド */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dateKey = formatDateKey(day.date)
              const dayEvents = events.filter((e) => e.date === dateKey)
              const isToday = dateKey === todayKey
              const dayOfWeek = day.date.getDay()
              const isHoliday = holidayDates.has(dateKey)
              const isClosed = closedDates.has(dateKey)
              const isStoreClosed = storeClosedDates.has(dateKey)
              const isNotice = noticeDates.has(dateKey)
              const isOrder = orderDates.has(dateKey)

              return (
                <div
                  key={index}
                  onClick={() => openDetailModal(day.date, dayEvents)}
                  className={`min-h-[80px] md:min-h-[120px] border-b border-r border-blue-200 p-1 cursor-pointer ${
                    !day.isCurrentMonth ? "bg-blue-50/50" : "bg-white"
                  } hover:bg-blue-50 transition-colors`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday
                          ? "bg-blue-600 text-white font-bold shadow-md"
                          : !day.isCurrentMonth
                            ? "text-gray-400"
                            : isHoliday || dayOfWeek === 0
                              ? "text-red-500 font-semibold"
                              : dayOfWeek === 6
                                ? "text-blue-500 font-semibold"
                                : isClosed || isStoreClosed || isNotice || isOrder
                                  ? "text-gray-600"
                                  : "text-gray-700"
                      }`}
                    >
                      {day.date.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="md:hidden text-xs bg-blue-600 text-white rounded-full px-1.5 py-0.5 font-medium">
                        {dayEvents.length}
                      </span>
                    )}
                    {day.isCurrentMonth && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openAddModal(day.date)
                        }}
                        className="hidden md:block p-1 hover:bg-blue-200 rounded opacity-0 hover:opacity-100 transition-all"
                      >
                        <Plus className="h-4 w-4 text-blue-600" />
                      </button>
                    )}
                  </div>
                  <div className="hidden md:block space-y-1">
                    {dayEvents.slice(0, 3).map((event) => {
                      const eventStyle = getEventStyle(event)
                      return (
                        <div
                          key={event.id}
                          className={`group flex items-center gap-1 px-1.5 py-0.5 rounded text-xs truncate ${eventStyle.className}`}
                          style={eventStyle.style}
                        >
                          <span className="truncate flex-1">{event.title}</span>
                          {!event.isHoliday &&
                            !event.isClosed &&
                            !event.isStoreClosed &&
                            !event.isNotice &&
                            !event.isOrder && (
                              <button
                                onClick={(e) => deleteEvent(event, e)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                        </div>
                      )
                    })}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-blue-700 px-1 font-medium">+{dayEvents.length - 3}件</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 詳細モーダル - 青色ベースに変更 */}
        {isDetailModalOpen && selectedDateForDetail && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md border-2 border-blue-400 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-blue-600">
                <h2 className="text-lg font-bold text-white">{formatDateDisplay(selectedDateForDetail)}</h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1 hover:bg-blue-700 rounded transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {selectedDateEvents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">この日にイベントはありません</p>
                ) : (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => {
                      const eventStyle = getEventStyle(event)
                      const isDeletable =
                        !event.isHoliday && !event.isClosed && !event.isStoreClosed && !event.isNotice && !event.isOrder
                      return (
                        <div
                          key={event.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${eventStyle.className}`}
                          style={eventStyle.style}
                        >
                          <span className="font-medium">{event.title}</span>
                          {isDeletable && (
                            <button
                              onClick={() => deleteEventFromDetail(event)}
                              className="p-1 hover:bg-black/10 rounded transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-blue-200">
                <button
                  onClick={openAddModalFromDetail}
                  className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  イベントを追加
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 追加モーダル - 青色ベースに変更 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md border-2 border-blue-400">
              <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-blue-600">
                <h2 className="text-lg font-bold text-white">イベントを追加</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-blue-700 rounded transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
                  <p className="text-gray-900">{selectedDate && formatDateDisplay(selectedDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="イベント名を入力"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">色</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewEventColor(color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          newEventColor === color.value ? "border-gray-900 scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
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
