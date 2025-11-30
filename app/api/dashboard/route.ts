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

    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

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

      // 店舗順にソートして結果を作成
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

    await connection.end()

    const monthlyData = aggregateData(monthlyRows as any[])
    const todayData = aggregateData(todayRows as any[])

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
      invoiceMonthly,
    })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "データベース接続エラー", details: String(error) }, { status: 500 })
  }
}
