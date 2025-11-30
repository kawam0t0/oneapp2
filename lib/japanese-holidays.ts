// 日本の祝日データ（2024年〜2030年）
// 春分の日・秋分の日は天文学的計算に基づく

export interface Holiday {
  date: string
  name: string
  type: "holiday" | "closed" | "store-closed" | "notice" | "order" // noticeタイプを追加
  color?: string // 店舗ごとの色を追加
}

// 固定祝日
const FIXED_HOLIDAYS: { month: number; day: number; name: string }[] = [
  { month: 1, day: 1, name: "元日" },
  { month: 2, day: 11, name: "建国記念の日" },
  { month: 2, day: 23, name: "天皇誕生日" },
  { month: 4, day: 29, name: "昭和の日" },
  { month: 5, day: 3, name: "憲法記念日" },
  { month: 5, day: 4, name: "みどりの日" },
  { month: 5, day: 5, name: "こどもの日" },
  { month: 8, day: 11, name: "山の日" },
  { month: 11, day: 3, name: "文化の日" },
  { month: 11, day: 23, name: "勤労感謝の日" },
]

const STORE_CLOSED_DAYS: { month: number; day: number; name: string }[] = [
  { month: 1, day: 2, name: "店休日" },
  { month: 1, day: 3, name: "店休日" },
]

const YEARLY_NOTICES: { month: number; day: number; name: string }[] = [{ month: 12, day: 31, name: "18時迄営業" }]

const YEARLY_ORDERS: { months: number[]; name: string }[] = [
  { months: [2, 5], name: "Tシャツ発注日" },
  { months: [8, 11], name: "パーカー発注日" },
  { months: [9], name: "ベンチコート発注日" },
]

// dayOfWeek: 0=日, 1=月, 2=火, 3=水, 4=木, 5=金, 6=土
const STORE_REGULAR_HOLIDAYS: { week: number; dayOfWeek: number; name: string; color: string }[] = [
  { week: 1, dayOfWeek: 2, name: "足利緑町店定休日", color: "#8b5cf6" }, // 紫
  { week: 1, dayOfWeek: 3, name: "前橋50号店定休日", color: "#3b82f6" }, // 青
  { week: 2, dayOfWeek: 2, name: "高崎棟高店定休日", color: "#eab308" }, // 黄色
  { week: 2, dayOfWeek: 3, name: "伊勢崎韮塚店定休日", color: "#22c55e" }, // 緑
  { week: 3, dayOfWeek: 2, name: "太田新田店定休日", color: "#f97316" }, // オレンジ
  { week: 3, dayOfWeek: 3, name: "新前橋店定休日", color: "#ec4899" }, // ピンク
]

// ハッピーマンデー祝日
const HAPPY_MONDAY_HOLIDAYS: { month: number; week: number; name: string }[] = [
  { month: 1, week: 2, name: "成人の日" },
  { month: 7, week: 3, name: "海の日" },
  { month: 9, week: 3, name: "敬老の日" },
  { month: 10, week: 2, name: "スポーツの日" },
]

// 春分の日・秋分の日（年ごとに異なる）
const EQUINOX_DAYS: { [year: number]: { spring: number; autumn: number } } = {
  2024: { spring: 20, autumn: 22 },
  2025: { spring: 20, autumn: 23 },
  2026: { spring: 20, autumn: 23 },
  2027: { spring: 21, autumn: 23 },
  2028: { spring: 20, autumn: 22 },
  2029: { spring: 20, autumn: 23 },
  2030: { spring: 20, autumn: 23 },
}

// 第n月曜日の日付を取得
function getNthMonday(year: number, month: number, n: number): number {
  const firstDay = new Date(year, month - 1, 1)
  const firstMonday = firstDay.getDay() === 1 ? 1 : (8 - firstDay.getDay() + 1) % 7 || 7
  return firstMonday + (n - 1) * 7
}

function getNthDayOfWeek(year: number, month: number, week: number, dayOfWeek: number): number {
  const firstDay = new Date(year, month - 1, 1)
  const firstDayOfWeek = firstDay.getDay()

  let firstTargetDay = dayOfWeek - firstDayOfWeek + 1
  if (firstTargetDay <= 0) {
    firstTargetDay += 7
  }

  return firstTargetDay + (week - 1) * 7
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function getHolidayDatesSet(year: number): Set<string> {
  const holidayDates = new Set<string>()

  for (const h of FIXED_HOLIDAYS) {
    holidayDates.add(`${year}-${String(h.month).padStart(2, "0")}-${String(h.day).padStart(2, "0")}`)
  }

  for (const h of HAPPY_MONDAY_HOLIDAYS) {
    const day = getNthMonday(year, h.month, h.week)
    holidayDates.add(`${year}-${String(h.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`)
  }

  const equinox = EQUINOX_DAYS[year]
  if (equinox) {
    holidayDates.add(`${year}-03-${String(equinox.spring).padStart(2, "0")}`)
    holidayDates.add(`${year}-09-${String(equinox.autumn).padStart(2, "0")}`)
  }

  return holidayDates
}

function getSubstituteHolidays(year: number, holidays: Holiday[]): Holiday[] {
  const substitutes: Holiday[] = []
  const holidayDates = new Set(holidays.map((h) => h.date))

  for (const holiday of holidays) {
    const date = new Date(holiday.date)
    if (date.getDay() === 0) {
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      while (holidayDates.has(formatDate(nextDay)) || nextDay.getDay() === 0) {
        nextDay.setDate(nextDay.getDate() + 1)
      }
      substitutes.push({
        date: formatDate(nextDay),
        name: "振替休日",
        type: "holiday",
      })
      holidayDates.add(formatDate(nextDay))
    }
  }

  return substitutes
}

function getKokuninNoKyujitsu(year: number, holidays: Holiday[]): Holiday[] {
  const kokuminHolidays: Holiday[] = []
  const holidayDates = new Set(holidays.map((h) => h.date))

  const equinox = EQUINOX_DAYS[year]
  if (equinox) {
    const keirouDay = getNthMonday(year, 9, 3)
    const autumnDay = equinox.autumn

    if (autumnDay - keirouDay === 2) {
      const betweenDate = `${year}-09-${String(keirouDay + 1).padStart(2, "0")}`
      if (!holidayDates.has(betweenDate)) {
        kokuminHolidays.push({
          date: betweenDate,
          name: "国民の休日",
          type: "holiday",
        })
      }
    }
  }

  return kokuminHolidays
}

function getStoreRegularHolidays(year: number, holidayDates: Set<string>): Holiday[] {
  const storeHolidays: Holiday[] = []
  const allClosedDates = new Set<string>()

  // 各月について定休日を計算
  for (let month = 1; month <= 12; month++) {
    for (const store of STORE_REGULAR_HOLIDAYS) {
      const day = getNthDayOfWeek(year, month, store.week, store.dayOfWeek)

      const lastDayOfMonth = new Date(year, month, 0).getDate()
      if (day > lastDayOfMonth) continue

      const targetDate = new Date(year, month - 1, day)
      let dateStr = formatDate(targetDate)

      while (holidayDates.has(dateStr) || allClosedDates.has(dateStr)) {
        targetDate.setDate(targetDate.getDate() + 1)
        dateStr = formatDate(targetDate)
      }

      // この日を定休日として登録
      allClosedDates.add(dateStr)

      storeHolidays.push({
        date: dateStr,
        name: store.name,
        type: "store-closed",
        color: store.color,
      })
    }
  }

  return storeHolidays
}

function getLastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function getOrderDays(year: number): Holiday[] {
  const orders: Holiday[] = []

  for (const order of YEARLY_ORDERS) {
    for (const month of order.months) {
      const lastDay = getLastDayOfMonth(year, month)
      orders.push({
        date: `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
        name: order.name,
        type: "order",
        color: "#22c55e", // 緑色
      })
    }
  }

  return orders
}

// 指定年の祝日一覧を取得
export function getJapaneseHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = []

  for (const h of FIXED_HOLIDAYS) {
    holidays.push({
      date: `${year}-${String(h.month).padStart(2, "0")}-${String(h.day).padStart(2, "0")}`,
      name: h.name,
      type: "holiday",
    })
  }

  for (const h of HAPPY_MONDAY_HOLIDAYS) {
    const day = getNthMonday(year, h.month, h.week)
    holidays.push({
      date: `${year}-${String(h.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      name: h.name,
      type: "holiday",
    })
  }

  const equinox = EQUINOX_DAYS[year]
  if (equinox) {
    holidays.push({
      date: `${year}-03-${String(equinox.spring).padStart(2, "0")}`,
      name: "春分の日",
      type: "holiday",
    })
    holidays.push({
      date: `${year}-09-${String(equinox.autumn).padStart(2, "0")}`,
      name: "秋分の日",
      type: "holiday",
    })
  }

  const substitutes = getSubstituteHolidays(year, holidays)
  holidays.push(...substitutes)

  const kokuminHolidays = getKokuninNoKyujitsu(year, holidays)
  holidays.push(...kokuminHolidays)

  for (const s of STORE_CLOSED_DAYS) {
    const dateStr = `${year}-${String(s.month).padStart(2, "0")}-${String(s.day).padStart(2, "0")}`
    if (!holidays.some((h) => h.date === dateStr)) {
      holidays.push({
        date: dateStr,
        name: s.name,
        type: "closed",
      })
    }
  }

  for (const n of YEARLY_NOTICES) {
    holidays.push({
      date: `${year}-${String(n.month).padStart(2, "0")}-${String(n.day).padStart(2, "0")}`,
      name: n.name,
      type: "notice",
    })
  }

  const orderDays = getOrderDays(year)
  holidays.push(...orderDays)

  const holidayDatesSet = getHolidayDatesSet(year)
  for (const sub of substitutes) {
    holidayDatesSet.add(sub.date)
  }
  for (const kokumin of kokuminHolidays) {
    holidayDatesSet.add(kokumin.date)
  }

  const storeRegularHolidays = getStoreRegularHolidays(year, holidayDatesSet)
  holidays.push(...storeRegularHolidays)

  return holidays.sort((a, b) => a.date.localeCompare(b.date))
}

// 指定日が祝日かチェック
export function getHolidayName(date: string): string | null {
  const year = Number.parseInt(date.slice(0, 4))
  const holidays = getJapaneseHolidays(year)
  const holiday = holidays.find((h) => h.date === date)
  return holiday ? holiday.name : null
}

export function getHolidayInfo(date: string): Holiday | null {
  const year = Number.parseInt(date.slice(0, 4))
  const holidays = getJapaneseHolidays(year)
  return holidays.find((h) => h.date === date) || null
}
