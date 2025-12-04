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

  // 固定祝日
  holidays.add(`${year}-01-01`) // 元日
  holidays.add(`${year}-02-11`) // 建国記念の日
  holidays.add(`${year}-02-23`) // 天皇誕生日
  holidays.add(`${year}-04-29`) // 昭和の日
  holidays.add(`${year}-05-03`) // 憲法記念日
  holidays.add(`${year}-05-04`) // みどりの日
  holidays.add(`${year}-05-05`) // こどもの日
  holidays.add(`${year}-08-11`) // 山の日
  holidays.add(`${year}-11-03`) // 文化の日
  holidays.add(`${year}-11-23`) // 勤労感謝の日

  // ハッピーマンデー（第2月曜日など）
  // 成人の日: 1月第2月曜日
  holidays.add(getNthDayOfMonth(year, 1, 1, 2))
  // 海の日: 7月第3月曜日
  holidays.add(getNthDayOfMonth(year, 7, 1, 3))
  // 敬老の日: 9月第3月曜日
  holidays.add(getNthDayOfMonth(year, 9, 1, 3))
  // スポーツの日: 10月第2月曜日
  holidays.add(getNthDayOfMonth(year, 10, 1, 2))

  // 春分の日・秋分の日（計算による近似）
  const shunbun = Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4))
  holidays.add(`${year}-03-${String(shunbun).padStart(2, "0")}`)

  const shubun = Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4))
  holidays.add(`${year}-09-${String(shubun).padStart(2, "0")}`)

  // 振替休日の処理（祝日が日曜日の場合、翌月曜日が振替休日）
  const holidayArray = Array.from(holidays)
  for (const dateStr of holidayArray) {
    const date = new Date(dateStr)
    if (date.getDay() === 0) {
      // 日曜日
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      holidays.add(formatDate(nextDay))
    }
  }

  return holidays
}

// 第N週の特定曜日の日付を取得
function getNthDayOfMonth(year: number, month: number, dayOfWeek: number, weekOfMonth: number): string {
  const firstDay = new Date(year, month - 1, 1)
  const firstDayOfWeek = firstDay.getDay()

  const day = 1 + ((dayOfWeek - firstDayOfWeek + 7) % 7) + (weekOfMonth - 1) * 7

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

  while (
    nextDate.getDay() === 0 || // 日曜日
    nextDate.getDay() === 6 || // 土曜日
    holidays.has(formatDate(nextDate)) || // 祝日
    excludeDates.has(formatDate(nextDate)) // 既に他の店舗が使用
  ) {
    nextDate.setDate(nextDate.getDate() + 1)
  }

  return nextDate
}

function getPreviousWeekday(date: Date, holidays: Set<string>): Date {
  const prevDate = new Date(date)

  while (
    prevDate.getDay() === 0 || // 日曜日
    prevDate.getDay() === 6 || // 土曜日
    holidays.has(formatDate(prevDate)) // 祝日
  ) {
    prevDate.setDate(prevDate.getDate() - 1)
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
  const holidays = getJapaneseHolidays(year)

  // 前月と翌月の祝日も取得（月をまたぐ振替に対応）
  const prevHolidays = getJapaneseHolidays(year - (month === 1 ? 1 : 0))
  const nextHolidays = getJapaneseHolidays(year + (month === 12 ? 1 : 0))
  const allHolidays = new Set([...holidays, ...prevHolidays, ...nextHolidays])

  // 既に割り当てられた日付を追跡
  const assignedDates = new Set<string>()

  // 各店舗の定休日を計算
  for (const rule of STORE_HOLIDAY_RULES) {
    // 本来の定休日を計算
    const originalDateStr = getNthDayOfMonth(year, month, rule.dayOfWeek, rule.weekOfMonth)
    const originalDate = new Date(originalDateStr)

    // 月の範囲内かチェック
    if (originalDate.getMonth() + 1 !== month) {
      continue // 第5週などで月をまたぐ場合はスキップ
    }

    let finalDate: Date
    let finalDateStr: string

    // 祝日かどうかチェック
    if (allHolidays.has(originalDateStr) || originalDate.getDay() === 0 || originalDate.getDay() === 6) {
      // 祝日または土日の場合、次の平日に振り替え
      finalDate = getNextWeekday(originalDate, allHolidays, assignedDates)
      finalDateStr = formatDate(finalDate)
    } else if (assignedDates.has(originalDateStr)) {
      // 既に他の店舗が使用している場合、次の平日に振り替え
      finalDate = getNextWeekday(originalDate, allHolidays, assignedDates)
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

const getStoreColorById = (storeId: number): string => {
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

    connection = await getConnection()

    const hasStoreIdColumn = await checkColumnExists(connection)

    let rows
    if (hasStoreIdColumn) {
      ;[rows] = await connection.execute(
        `SELECT id, title, DATE_FORMAT(date, '%Y-%m-%d') as date, color, store_id, is_global 
         FROM calendar_events 
         WHERE date BETWEEN ? AND ? 
         AND (is_global = TRUE OR store_id = ?)
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

      return {
        ...row,
        store_id: eventStoreId,
        is_global: row.is_global !== undefined ? row.is_global : true,
        store_name: storeName,
        is_generated_holiday: false,
      }
    })

    const holidayEvents = generateStoreHolidayEvents(year, month)
    const orderDayEvents = generateOrderDayEvents(year, month)

    // DBイベントと自動生成イベントを結合
    const allEvents = [...dbEvents, ...holidayEvents, ...orderDayEvents]

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
      // 新しいスキーマ
      await connection.execute(
        "INSERT INTO calendar_events (title, date, color, store_id, is_global) VALUES (?, ?, ?, ?, FALSE)",
        [title, date, storeColor, storeId],
      )
    } else {
      // 旧スキーマ
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
