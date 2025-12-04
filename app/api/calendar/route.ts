import mysql from "mysql2/promise"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST || "34.67.209.187",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "your_username",
    password: process.env.DB_PASSWORD || "your_password",
    database: process.env.DB_NAME || "your_database",
    ssl: {
      rejectUnauthorized: false,
    },
  })
}

const STORE_COLOR_MAP: { [key: string]: string } = {
  前橋50号: "#3b82f6",
  伊勢崎韮塚: "#22c55e",
  高崎棟高: "#f97316",
  足利緑町: "#ef4444",
  新前橋: "#a855f7",
  太田新田: "#06b6d4",
}

const STORE_ID_TO_NAME: { [key: number]: string } = {
  1: "前橋50号",
  2: "伊勢崎韮塚",
  3: "高崎棟高",
  4: "足利緑町",
  5: "新前橋",
  6: "太田新田",
}

// weekOfMonth: 第何週か (1-5)
// dayOfWeek: 曜日 (0=日, 1=月, 2=火, 3=水, 4=木, 5=金, 6=土)
const STORE_HOLIDAY_RULES: { storeName: string; weekOfMonth: number; dayOfWeek: number }[] = [
  { storeName: "足利緑町", weekOfMonth: 1, dayOfWeek: 2 }, // 第一火曜日
  { storeName: "前橋50号", weekOfMonth: 1, dayOfWeek: 3 }, // 第一水曜日
  { storeName: "高崎棟高", weekOfMonth: 2, dayOfWeek: 2 }, // 第二火曜日
  { storeName: "伊勢崎韮塚", weekOfMonth: 2, dayOfWeek: 3 }, // 第二水曜日
  { storeName: "太田新田", weekOfMonth: 3, dayOfWeek: 2 }, // 第三火曜日
  { storeName: "新前橋", weekOfMonth: 3, dayOfWeek: 3 }, // 第三水曜日
]

const ORDER_DAY_RULES: { month: number; title: string; color: string }[] = [
  { month: 2, title: "Tシャツ発注日", color: "#10b981" },
  { month: 5, title: "Tシャツ発注日", color: "#10b981" },
  { month: 8, title: "パーカー発注日", color: "#8b5cf6" },
  { month: 9, title: "ベンチコート発注日", color: "#f59e0b" },
  { month: 11, title: "パーカー発注日", color: "#8b5cf6" },
]

function getJapaneseHolidays(year: number): Set<string> {
  const holidays = new Set<string>()

  const addHoliday = (y: number, m: number, d: number) => {
    holidays.add(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`)
  }

  // 固定祝日
  addHoliday(year, 1, 1) // 元日
  addHoliday(year, 2, 11) // 建国記念の日
  addHoliday(year, 2, 23) // 天皇誕生日
  addHoliday(year, 4, 29) // 昭和の日
  addHoliday(year, 5, 3) // 憲法記念日
  addHoliday(year, 5, 4) // みどりの日
  addHoliday(year, 5, 5) // こどもの日
  addHoliday(year, 8, 11) // 山の日
  addHoliday(year, 11, 3) // 文化の日
  addHoliday(year, 11, 23) // 勤労感謝の日

  // ハッピーマンデー - getNthMondayOfMonth を使用
  // 成人の日: 1月第2月曜日
  const seijinNoHi = getNthMondayOfMonth(year, 1, 2)
  addHoliday(year, 1, seijinNoHi)

  // 海の日: 7月第3月曜日
  const umiNoHi = getNthMondayOfMonth(year, 7, 3)
  addHoliday(year, 7, umiNoHi)

  // 敬老の日: 9月第3月曜日
  const keirouNoHi = getNthMondayOfMonth(year, 9, 3)
  addHoliday(year, 9, keirouNoHi)

  // スポーツの日: 10月第2月曜日
  const sportsNoHi = getNthMondayOfMonth(year, 10, 2)
  addHoliday(year, 10, sportsNoHi)

  // 春分の日（3月20日または21日）
  const shunbun = calculateShunbun(year)
  addHoliday(year, 3, shunbun)

  // 秋分の日（9月22日または23日）
  const shubun = calculateShubun(year)
  addHoliday(year, 9, shubun)

  // 国民の休日（祝日と祝日に挟まれた平日）
  // 9月の敬老の日と秋分の日の間
  if (shubun - keirouNoHi === 2) {
    addHoliday(year, 9, keirouNoHi + 1)
  }

  // 祝日が日曜日の場合、次の平日（祝日でない日）が振替休日
  const holidayArray = Array.from(holidays).sort()
  for (const dateStr of holidayArray) {
    const date = new Date(dateStr + "T00:00:00")
    if (date.getDay() === 0) {
      // 日曜日の場合、次の平日を探す
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)

      // 次の日が既に祝日なら、さらに次の日を探す
      let maxIterations = 7
      while (maxIterations > 0) {
        const nextDateStr = formatDate(nextDay)
        if (!holidays.has(nextDateStr)) {
          holidays.add(nextDateStr)
          break
        }
        nextDay.setDate(nextDay.getDate() + 1)
        maxIterations--
      }
    }
  }

  return holidays
}

function getNthMondayOfMonth(year: number, month: number, n: number): number {
  // その月の1日
  const firstDay = new Date(year, month - 1, 1)
  const firstDayOfWeek = firstDay.getDay() // 0=日, 1=月, ..., 6=土

  // 最初の月曜日は何日か
  let firstMonday: number
  if (firstDayOfWeek === 0) {
    // 1日が日曜日なら、2日が月曜日
    firstMonday = 2
  } else if (firstDayOfWeek === 1) {
    // 1日が月曜日
    firstMonday = 1
  } else {
    // それ以外の場合、次の月曜日を計算
    firstMonday = 1 + (8 - firstDayOfWeek)
  }

  // 第N月曜日
  return firstMonday + (n - 1) * 7
}

function calculateShunbun(year: number): number {
  if (year >= 1900 && year <= 2099) {
    return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4))
  }
  return 21 // デフォルト
}

function calculateShubun(year: number): number {
  if (year >= 1900 && year <= 2099) {
    return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4))
  }
  return 23 // デフォルト
}

// 第N週の特定曜日の日付を取得（定休日用）
function getNthDayOfMonth(year: number, month: number, dayOfWeek: number, weekOfMonth: number): string {
  const firstDay = new Date(year, month - 1, 1)
  const firstDayOfWeek = firstDay.getDay()

  let day = 1 + ((dayOfWeek - firstDayOfWeek + 7) % 7) + (weekOfMonth - 1) * 7

  // 月の最終日を超えないようにチェック
  const lastDay = new Date(year, month, 0).getDate()
  if (day > lastDay) {
    day = day - 7 // 前の週に戻す
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

// 日付をフォーマット
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getNextWeekday(date: Date, holidays: Set<string>, excludeDates: Set<string>): Date {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + 1)

  let maxIterations = 30 // 無限ループ防止
  while (maxIterations > 0) {
    const dateStr = formatDate(nextDate)
    const dayOfWeek = nextDate.getDay()

    // 土日でなく、祝日でなく、既に使用されていない日を探す
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.has(dateStr) && !excludeDates.has(dateStr)) {
      break
    }
    nextDate.setDate(nextDate.getDate() + 1)
    maxIterations--
  }

  return nextDate
}

function getPreviousWeekday(date: Date, holidays: Set<string>): Date {
  const prevDate = new Date(date)

  let maxIterations = 30
  while (maxIterations > 0) {
    const dateStr = formatDate(prevDate)
    const dayOfWeek = prevDate.getDay()

    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.has(dateStr)) {
      break
    }
    prevDate.setDate(prevDate.getDate() - 1)
    maxIterations--
  }

  return prevDate
}

function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 0)
}

function generateOrderDayEvents(year: number, month: number): any[] {
  const events: any[] = []
  const holidays = getJapaneseHolidays(year)

  for (const rule of ORDER_DAY_RULES) {
    if (rule.month === month) {
      const lastDay = getLastDayOfMonth(year, month)
      const orderDate = getPreviousWeekday(lastDay, holidays)

      events.push({
        id: `order-${rule.title}-${formatDate(orderDate)}`,
        title: rule.title,
        date: formatDate(orderDate),
        color: rule.color,
        store_id: null,
        is_global: true,
        store_name: null,
        is_generated_holiday: false,
      })
    }
  }

  return events
}

function generateStoreHolidayEvents(year: number, month: number): any[] {
  const events: any[] = []

  // 当年の祝日を取得
  const holidays = getJapaneseHolidays(year)

  // 既に割り当てられた日付を追跡
  const assignedDates = new Set<string>()

  // 定休日を順番に処理（第一火曜→第一水曜→第二火曜...の順）
  const sortedRules = [...STORE_HOLIDAY_RULES].sort((a, b) => {
    if (a.weekOfMonth !== b.weekOfMonth) return a.weekOfMonth - b.weekOfMonth
    return a.dayOfWeek - b.dayOfWeek
  })

  for (const rule of sortedRules) {
    // 本来の定休日を計算
    const originalDateStr = getNthDayOfMonth(year, month, rule.dayOfWeek, rule.weekOfMonth)
    const originalDate = new Date(originalDateStr + "T00:00:00")

    // 月の範囲内かチェック
    if (originalDate.getMonth() + 1 !== month) {
      continue
    }

    let finalDate: Date
    let finalDateStr: string

    // 本来の日付が: 祝日、土日、または既に他店舗に割り当て済みかチェック
    const isHoliday = holidays.has(originalDateStr)
    const isWeekend = originalDate.getDay() === 0 || originalDate.getDay() === 6
    const isAlreadyAssigned = assignedDates.has(originalDateStr)

    if (isHoliday || isWeekend || isAlreadyAssigned) {
      // 次の平日に振り替え
      finalDate = getNextWeekday(originalDate, holidays, assignedDates)
      finalDateStr = formatDate(finalDate)
    } else {
      finalDate = originalDate
      finalDateStr = originalDateStr
    }

    // この日付を使用済みとしてマーク
    assignedDates.add(finalDateStr)

    // 対象月のイベントのみ追加
    if (finalDate.getMonth() + 1 === month) {
      events.push({
        id: `holiday-${rule.storeName}-${finalDateStr}`,
        title: `${rule.storeName}定休日`,
        date: finalDateStr,
        color: STORE_COLOR_MAP[rule.storeName],
        store_id: null,
        is_global: true,
        store_name: rule.storeName,
        is_generated_holiday: true,
      })
    }
  }

  return events
}

function getStoreColorById(storeId: number): string {
  const storeName = STORE_ID_TO_NAME[storeId]
  return storeName ? STORE_COLOR_MAP[storeName] : "#6b7280"
}

async function getSessionStore() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")
  if (!sessionCookie) return null
  try {
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

async function checkColumnExists(connection: mysql.Connection): Promise<boolean> {
  try {
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'calendar_events' AND COLUMN_NAME = 'store_id'`,
      [process.env.DB_NAME || "your_database"],
    )
    return (columns as any[]).length > 0
  } catch {
    return false
  }
}

function generateNewYearsEveEvent(year: number, month: number): any[] {
  const events: any[] = []

  // 12月のみ大晦日イベントを追加
  if (month === 12) {
    events.push({
      id: `nye-${year}-12-31`,
      title: "18時まで営業",
      date: `${year}-12-31`,
      color: "#ef4444", // 赤色
      store_id: null,
      is_global: true,
      store_name: null,
      is_generated_holiday: false,
    })
  }

  return events
}

// イベント取得
export async function GET(request: Request) {
  let connection
  try {
    const { searchParams } = new URL(request.url)
    const year = Number(searchParams.get("year") || new Date().getFullYear())
    const month = Number(searchParams.get("month") || new Date().getMonth() + 1)

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`

    const session = await getSessionStore()
    const storeId = session?.store_id

    console.log("[v0] GET Calendar - Session storeId:", storeId)

    connection = await getConnection()

    const hasStoreIdColumn = await checkColumnExists(connection)

    let rows
    if (hasStoreIdColumn) {
      ;[rows] = await connection.execute(
        `SELECT id, title, DATE_FORMAT(date, '%Y-%m-%d') as date, color, store_id, is_global 
         FROM calendar_events 
         WHERE date BETWEEN ? AND ? 
         AND (is_global = TRUE OR is_global = 1 OR store_id = ?)
         AND title NOT LIKE '%定休日%'
         AND title NOT LIKE '%発注日%'
         ORDER BY date ASC`,
        [startDate, endDate, storeId],
      )
    } else {
      ;[rows] = await connection.execute(
        `SELECT id, title, DATE_FORMAT(date, '%Y-%m-%d') as date, color 
         FROM calendar_events 
         WHERE date BETWEEN ? AND ?
         AND title NOT LIKE '%定休日%'
         AND title NOT LIKE '%発注日%'
         ORDER BY date ASC`,
        [startDate, endDate],
      )
    }

    const dbEvents = (rows as any[]).map((row) => {
      const eventStoreId = row.store_id || null
      const storeName = eventStoreId ? STORE_ID_TO_NAME[eventStoreId] || null : null
      // is_global が 0 または false の場合は false、それ以外は true
      const isGlobal = row.is_global === 1 || row.is_global === true

      console.log("[v0] DB Event:", {
        id: row.id,
        title: row.title,
        store_id: row.store_id,
        raw_is_global: row.is_global,
        converted_is_global: isGlobal,
        currentStoreId: storeId,
      })

      return {
        ...row,
        store_id: eventStoreId,
        is_global: isGlobal,
        store_name: storeName,
        is_generated_holiday: false,
      }
    })

    const holidayEvents = generateStoreHolidayEvents(year, month)
    const orderDayEvents = generateOrderDayEvents(year, month)
    const newYearsEveEvents = generateNewYearsEveEvent(year, month)

    // DBイベントと自動生成イベントを結合
    const allEvents = [...dbEvents, ...holidayEvents, ...orderDayEvents, ...newYearsEveEvents]

    // 日付順でソート
    allEvents.sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json(allEvents)
  } catch (error) {
    console.error("Calendar fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}

// イベント追加
export async function POST(request: Request) {
  let connection
  try {
    const { title, date, color } = await request.json()

    if (!title || !date) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 })
    }

    const session = await getSessionStore()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const storeId = session.store_id
    const storeName = session.store_name
    const storeColor = STORE_COLOR_MAP[storeName] || color || "#3b82f6"

    connection = await getConnection()

    const hasStoreIdColumn = await checkColumnExists(connection)

    if (hasStoreIdColumn) {
      await connection.execute(
        "INSERT INTO calendar_events (title, date, color, store_id, is_global) VALUES (?, ?, ?, ?, FALSE)",
        [title, date, storeColor, storeId],
      )
    } else {
      await connection.execute("INSERT INTO calendar_events (title, date, color) VALUES (?, ?, ?)", [
        title,
        date,
        storeColor,
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Calendar add error:", error)
    return NextResponse.json({ error: "Failed to add event" }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}

// イベント削除
export async function DELETE(request: Request) {
  let connection
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    // 自動生成されたイベント（定休日、発注日）は削除不可
    if (id.startsWith("holiday-") || id.startsWith("order-") || id.startsWith("nye-")) {
      return NextResponse.json({ error: "Cannot delete generated events" }, { status: 400 })
    }

    const session = await getSessionStore()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    connection = await getConnection()

    const hasStoreIdColumn = await checkColumnExists(connection)

    if (hasStoreIdColumn) {
      const [result] = await connection.execute(
        "DELETE FROM calendar_events WHERE id = ? AND (store_id = ? OR is_global = FALSE)",
        [id, session.store_id],
      )

      if ((result as any).affectedRows === 0) {
        return NextResponse.json({ error: "Event not found or cannot be deleted" }, { status: 404 })
      }
    } else {
      await connection.execute("DELETE FROM calendar_events WHERE id = ?", [id])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Calendar delete error:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}
