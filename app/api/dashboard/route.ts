import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST || "34.67.209.187",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "your_username",
    password: process.env.DB_PASSWORD || "your_password",
    database: process.env.DB_NAME || "your_database_name",
    ssl: {
      rejectUnauthorized: false,
    },
  })
}

const categorizeItem = (details: string): string | null => {
  if (!details) return "その他"
  if (details.includes("高崎棟高店バキューム")) return null
  if (details.includes("セラミック祭り")) return "セラミック祭り" // セラミック祭りカテゴリを追加
  if (details.includes("サブスク")) return "サブスク"
  if (details.includes("リピ")) return "リピート"
  if (details.includes("新規")) return "新規"
  if (details.includes("⇒")) return "コースアップ"
  if (details.includes("ポイント")) return "ポイント"
  if (details.includes("キャンペーン")) return "キャンペーン"
  if (details.includes("無料券")) return "無料券"
  return details
}

const categorizeCourse = (details: string): string | null => {
  if (!details) return null
  if (details.includes("プレミアム") || details.includes("月額980円")) return "プレミアム"
  if (details.includes("プラス")) return "プラス"
  if (details.includes("ナイアガラ")) return "ナイアガラ"
  if (details.includes("セラミック")) return "セラミック"
  return null
}

const aggregateData = (rows: any[]) => {
  const storeMap = new Map<string, { items: { [key: string]: number }; total: number }>()

  rows.forEach((row) => {
    const store = row.store
    const item = categorizeItem(row.details)
    const count = row.count

    if (!store || store === "0" || store.toString().trim() === "") {
      return
    }

    if (item === null) {
      return
    }

    if (!storeMap.has(store)) {
      storeMap.set(store, { items: {}, total: 0 })
    }

    const storeData = storeMap.get(store)!
    storeData.items[item] = (storeData.items[item] || 0) + count
    storeData.total += count
  })

  return Array.from(storeMap.entries()).map(([store, data]) => ({
    store,
    items: data.items,
    total: data.total,
  }))
}

const STORE_ORDER = [
  "SPLASH'N'GO!前橋50号店",
  "SPLASH'N'GO!伊勢崎韮塚店",
  "SPLASH'N'GO!高崎棟高店",
  "SPLASH'N'GO!足利緑町店",
  "SPLASH'N'GO!新前橋店",
  "SPLASH'N'GO!太田新田店",
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "2025-11"
    const categoriesOnly = searchParams.get("categories") === "true"

    const [year, month] = period.split("-")

    const startDate = `${year}-${month}-01`
    const endDate = new Date(Number.parseInt(year), Number.parseInt(month), 0).getDate()
    const endDateStr = `${year}-${month}-${endDate}`

    const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000)
    const todayStr = `${nowJST.getUTCFullYear()}-${String(nowJST.getUTCMonth() + 1).padStart(2, "0")}-${String(nowJST.getUTCDate()).padStart(2, "0")}`

    // 前日の日付を計算
    const yesterdayJST = new Date(nowJST.getTime() - 24 * 60 * 60 * 1000)
    const yesterdayStr = `${yesterdayJST.getUTCFullYear()}-${String(yesterdayJST.getUTCMonth() + 1).padStart(2, "0")}-${String(yesterdayJST.getUTCDate()).padStart(2, "0")}`
    const currentDay = nowJST.getUTCDate()

    const connection = await getConnection()

    if (categoriesOnly) {
      console.log("[v0] Categories only request for period:", startDate, "to", endDateStr)

      const [categoryRows] = await connection.execute(
        `SELECT store, details, COUNT(*) as count 
         FROM invoice 
         WHERE Date >= ? AND Date <= ?
         GROUP BY store, details`,
        [startDate, endDateStr],
      )

      console.log("[v0] Raw category rows count:", (categoryRows as any[]).length)
      console.log("[v0] Sample rows:", (categoryRows as any[]).slice(0, 5))

      await connection.end()

      const storeMap = new Map<string, { courses: Map<string, number>; total: number }>()
      ;(categoryRows as any[]).forEach((row) => {
        const store = row.store
        const course = categorizeCourse(row.details)
        const count = Number(row.count)

        if (!store || store === "0" || store.toString().trim() === "" || !course) {
          return
        }

        if (!storeMap.has(store)) {
          storeMap.set(store, { courses: new Map(), total: 0 })
        }

        const storeData = storeMap.get(store)!
        storeData.courses.set(course, (storeData.courses.get(course) || 0) + count)
        storeData.total += count
      })

      console.log("[v0] Processed stores:", Array.from(storeMap.keys()))

      const storeCategories = STORE_ORDER.filter((store) => storeMap.has(store)).map((store) => {
        const data = storeMap.get(store)!
        const categories = Array.from(data.courses.entries())
          .map(([name, value]) => ({
            name,
            value,
            percentage: data.total > 0 ? ((value / data.total) * 100).toFixed(1) : "0",
          }))
          .sort((a, b) => b.value - a.value)

        return {
          store,
          categories,
          total: data.total,
        }
      })

      console.log("[v0] Final storeCategories:", storeCategories)

      return NextResponse.json({
        storeCategories,
      })
    }

    // 通常のリクエスト処理
    const [monthlyRows] = await connection.execute(
      `SELECT store, details, COUNT(*) as count 
       FROM onetime 
       WHERE date >= ? AND date <= ?
       AND (card_entry_method IS NULL OR card_entry_method != 'KEYED')
       GROUP BY store, details
       ORDER BY store, details`,
      [startDate, endDateStr],
    )

    const [todayRows] = await connection.execute(
      `SELECT store, details, COUNT(*) as count 
       FROM onetime 
       WHERE date = ?
       AND (card_entry_method IS NULL OR card_entry_method != 'KEYED')
       GROUP BY store, details
       ORDER BY store, details`,
      [todayStr],
    )

    const [yesterdayRows] = await connection.execute(
      `SELECT store, details, COUNT(*) as count 
       FROM onetime 
       WHERE date = ?
       AND (card_entry_method IS NULL OR card_entry_method != 'KEYED')
       GROUP BY store, details
       ORDER BY store, details`,
      [yesterdayStr],
    )

    const [monthlyOnetimeSales] = await connection.execute(
      `SELECT store, SUM(total_net_amount) as total_sales
       FROM onetime 
       WHERE date >= ? AND date <= ?
       AND (card_entry_method IS NULL OR card_entry_method != 'KEYED')
       GROUP BY store`,
      [startDate, endDateStr],
    )

    const [todayOnetimeSales] = await connection.execute(
      `SELECT store, SUM(total_net_amount) as total_sales
       FROM onetime 
       WHERE date = ?
       AND (card_entry_method IS NULL OR card_entry_method != 'KEYED')
       GROUP BY store`,
      [todayStr],
    )

    const [monthlySubscSales] = await connection.execute(
      `SELECT store, SUM(total_net_amount) as total_sales
       FROM invoice 
       WHERE Date >= ? AND Date <= ?
       GROUP BY store`,
      [startDate, endDateStr],
    )

    const [todaySubscSales] = await connection.execute(
      `SELECT store, SUM(total_net_amount) as total_sales
       FROM invoice 
       WHERE Date = ?
       GROUP BY store`,
      [todayStr],
    )

    const [invoiceRows] = await connection.execute(
      `SELECT 
         DATE_FORMAT(Date, '%Y-%m') as month,
         store,
         COUNT(*) as count
       FROM invoice
       WHERE Date >= DATE_SUB(?, INTERVAL 11 MONTH)
         AND Date <= LAST_DAY(?)
       GROUP BY DATE_FORMAT(Date, '%Y-%m'), store
       ORDER BY month ASC, store`,
      [startDate, endDateStr],
    )

    // 今月1日〜今日までの会員数
    const currentMonthStart = `${year}-${month}-01`
    const currentMonthEnd = `${year}-${month}-${String(currentDay).padStart(2, "0")}`

    // 前月1日〜前月の同日までの会員数
    const prevMonth = Number.parseInt(month) === 1 ? 12 : Number.parseInt(month) - 1
    const prevYear = Number.parseInt(month) === 1 ? Number.parseInt(year) - 1 : Number.parseInt(year)
    const prevMonthStart = `${prevYear}-${String(prevMonth).padStart(2, "0")}-01`
    const prevMonthEnd = `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(currentDay).padStart(2, "0")}`

    // 今月: source = '請求書' のデータ数
    const [currentSourceCount] = await connection.execute(
      `SELECT store, COUNT(*) as count
       FROM invoice 
       WHERE Date >= ? AND Date <= ?
       AND source = '請求書'
       GROUP BY store`,
      [currentMonthStart, currentMonthEnd],
    )

    // 今月: card_entry_method = 'ON_FILE' のデータ数
    const [currentOnFileCount] = await connection.execute(
      `SELECT store, COUNT(*) as count
       FROM invoice 
       WHERE Date >= ? AND Date <= ?
       AND card_entry_method = 'ON_FILE'
       GROUP BY store`,
      [currentMonthStart, currentMonthEnd],
    )

    // 今月: card_entry_method = 'KEYED' のデータ数
    const [currentKeyedCount] = await connection.execute(
      `SELECT store, COUNT(*) as count
       FROM invoice 
       WHERE Date >= ? AND Date <= ?
       AND card_entry_method = 'KEYED'
       GROUP BY store`,
      [currentMonthStart, currentMonthEnd],
    )

    // 前月: source = '請求書' のデータ数
    const [prevSourceCount] = await connection.execute(
      `SELECT store, COUNT(*) as count
       FROM invoice 
       WHERE Date >= ? AND Date <= ?
       AND source = '請求書'
       GROUP BY store`,
      [prevMonthStart, prevMonthEnd],
    )

    // 前月: card_entry_method = 'ON_FILE' のデータ数
    const [prevOnFileCount] = await connection.execute(
      `SELECT store, COUNT(*) as count
       FROM invoice 
       WHERE Date >= ? AND Date <= ?
       AND card_entry_method = 'ON_FILE'
       GROUP BY store`,
      [prevMonthStart, prevMonthEnd],
    )

    // 前月: card_entry_method = 'KEYED' のデータ数
    const [prevKeyedCount] = await connection.execute(
      `SELECT store, COUNT(*) as count
       FROM invoice 
       WHERE Date >= ? AND Date <= ?
       AND card_entry_method = 'KEYED'
       GROUP BY store`,
      [prevMonthStart, prevMonthEnd],
    )

    await connection.end()

    const monthlyData = aggregateData(monthlyRows as any[])
    const todayData = aggregateData(todayRows as any[])
    const yesterdayData = aggregateData(yesterdayRows as any[]) // 前日データも集計

    const monthlyOnetimeSalesMap = new Map<string, number>()
    ;(monthlyOnetimeSales as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        monthlyOnetimeSalesMap.set(row.store, Number(row.total_sales) || 0)
      }
    })

    const todayOnetimeSalesMap = new Map<string, number>()
    ;(todayOnetimeSales as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        todayOnetimeSalesMap.set(row.store, Number(row.total_sales) || 0)
      }
    })

    const monthlySubscSalesMap = new Map<string, number>()
    ;(monthlySubscSales as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        monthlySubscSalesMap.set(row.store, Number(row.total_sales) || 0)
      }
    })

    const todaySubscSalesMap = new Map<string, number>()
    ;(todaySubscSales as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        todaySubscSalesMap.set(row.store, Number(row.total_sales) || 0)
      }
    })

    const currentSourceMap = new Map<string, number>()
    ;(currentSourceCount as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        currentSourceMap.set(row.store, Number(row.count) || 0)
      }
    })

    const currentOnFileMap = new Map<string, number>()
    ;(currentOnFileCount as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        currentOnFileMap.set(row.store, Number(row.count) || 0)
      }
    })

    const currentKeyedMap = new Map<string, number>()
    ;(currentKeyedCount as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        currentKeyedMap.set(row.store, Number(row.count) || 0)
      }
    })

    const prevSourceMap = new Map<string, number>()
    ;(prevSourceCount as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        prevSourceMap.set(row.store, Number(row.count) || 0)
      }
    })

    const prevOnFileMap = new Map<string, number>()
    ;(prevOnFileCount as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        prevOnFileMap.set(row.store, Number(row.count) || 0)
      }
    })

    const prevKeyedMap = new Map<string, number>()
    ;(prevKeyedCount as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        prevKeyedMap.set(row.store, Number(row.count) || 0)
      }
    })

    const storeSales = STORE_ORDER.map((store) => ({
      store,
      monthlyOnetime: monthlyOnetimeSalesMap.get(store) || 0,
      todayOnetime: todayOnetimeSalesMap.get(store) || 0,
      monthlySubsc: monthlySubscSalesMap.get(store) || 0,
      todaySubsc: todaySubscSalesMap.get(store) || 0,
    }))

    const memberChanges = STORE_ORDER.map((store) => {
      const currentTotal =
        (currentSourceMap.get(store) || 0) + (currentOnFileMap.get(store) || 0) + (currentKeyedMap.get(store) || 0)

      const prevTotal =
        (prevSourceMap.get(store) || 0) + (prevOnFileMap.get(store) || 0) + (prevKeyedMap.get(store) || 0)

      return {
        store,
        currentCount: currentTotal,
        prevCount: prevTotal,
        change: currentTotal - prevTotal,
      }
    })

    const invoiceDataMap = new Map<string, { [store: string]: number }>()
    ;(invoiceRows as any[]).forEach((row) => {
      const month = row.month
      const store = row.store
      const count = Number(row.count)

      if (!store || store === "0" || store.toString().trim() === "") {
        return
      }

      if (!invoiceDataMap.has(month)) {
        invoiceDataMap.set(month, {})
      }

      invoiceDataMap.get(month)![store] = count
    })

    const invoiceMonthly = Array.from(invoiceDataMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, stores]) => ({
        month,
        ...stores,
      }))

    return NextResponse.json({
      monthly: monthlyData,
      today: todayData,
      yesterday: yesterdayData, // 前日データを追加
      invoiceMonthly,
      storeSales,
      memberChanges, // 会員数増減データを追加
    })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "データベース接続エラー", details: String(error) }, { status: 500 })
  }
}
