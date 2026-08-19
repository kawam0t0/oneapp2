import { NextResponse } from "next/server"
import { getConnection } from "@/lib/db"

export const runtime = 'nodejs'

// シンプルなメモリキャッシュ（30秒）
// 同時アクセス時のDB負荷を削減しつつ、ほぼリアルタイムを維持
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 30 * 1000 // 30秒

function getCached(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

const categorizeItem = (details: string): string | null => {
  if (!details) return "その他"
  if (details.includes("高崎棟高店バキューム")) return null
  if (details.includes("セラミック祭り")) return "セラミック祭り"
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
  // セラミックとデラックスは同じコース。表示名は「デラックス」に統一
  if (details.includes("セラミック") || details.includes("デラックス")) return "デラックス"
  return null
}

function normalizeStoreName(name: string): string {
  // \s* でスペースあり・なし両方を「スプラッシュンゴー」に統一
  // 例: "スプラッシュンゴー 鹿児島中山店" → "スプラッシュンゴー鹿児島中山店"
  //     "スプラッシュンゴー鹿児島中山店"  → "スプラッシュンゴー鹿児島中山店"（変化なし）
  return name.replace(/^スプラッシュンゴー\s*/, "スプラッシュンゴー")
}

const aggregateData = (rows: any[]) => {
  const storeMap = new Map<string, { items: { [key: string]: number }; total: number }>()

  rows.forEach((row) => {
    const store = row.store ? normalizeStoreName(row.store.toString()) : row.store
    const details = row.details
    const count = row.count

    if (!store || store === "0" || store.toString().trim() === "") {
      return
    }

    if (!storeMap.has(store)) {
      storeMap.set(store, { items: {}, total: 0 })
    }
    const storeData = storeMap.get(store)!
    storeData.total += count

    if (!details || typeof details !== "string") {
      storeData.items["その他"] = (storeData.items["その他"] || 0) + count
      return
    }

    const items = details.split(",").map((item: string) => item.trim())

    items.forEach((itemDetail: string) => {
      const item = categorizeItem(itemDetail)

      if (item === null) {
        return
      }

      storeData.items[item] = (storeData.items[item] || 0) + count
    })
  })

  const result = Array.from(storeMap.entries()).map(([store, data]) => {
    return {
      store,
      items: data.items,
      total: data.total,
    }
  })

  return result
}

const STORE_ORDER = [
  "SPLASH'N'GO!前橋50号店",
  "SPLASH'N'GO!伊勢崎韮塚店",
  "SPLASH'N'GO!高崎棟高店",
  "SPLASH'N'GO!足利緑町店",
  "SPLASH'N'GO!新前橋店",
  "SPLASH'N'GO!太田新田店",
  "スプラッシュンゴー鹿児島中山店",
  "スプラッシュンゴー藤岡大塚店",
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "2025-11"
    const categoriesOnly = searchParams.get("categories") === "true"

    // キャッシュキーを生成
    const cacheKey = `dashboard-${period}-${categoriesOnly}`
    
    // キャッシュがあれば即座に返す（DB触らない）
    const cachedData = getCached(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    const [year, month] = period.split("-")

    const startDate = `${year}-${month}-01`
    const endDate = new Date(Number.parseInt(year), Number.parseInt(month), 0).getDate()
    const endDateStr = `${year}-${month}-${endDate}`

    const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000)
    const todayStr = `${nowJST.getUTCFullYear()}-${String(nowJST.getUTCMonth() + 1).padStart(2, "0")}-${String(nowJST.getUTCDate()).padStart(2, "0")}`

    const yesterdayJST = new Date(nowJST.getTime() - 24 * 60 * 60 * 1000)
    const yesterdayStr = `${yesterdayJST.getUTCFullYear()}-${String(yesterdayJST.getUTCMonth() + 1).padStart(2, "0")}-${String(yesterdayJST.getUTCDate()).padStart(2, "0")}`
    const currentDay = nowJST.getUTCDate()

    const connection = await getConnection()

    if (categoriesOnly) {
      const [categoryRows] = await connection.execute(
        `SELECT store, details, COUNT(*) as count 
         FROM invoice 
         WHERE Date >= ? AND Date <= ?
         GROUP BY store, details`,
        [startDate, endDateStr],
      )

      await connection.end()

      const storeMap = new Map<string, { courses: Map<string, number>; total: number }>()
      ;(categoryRows as any[]).forEach((row) => {
        // normalizeStoreName でスペースあり・なし両表記を統一する
        const store = row.store ? normalizeStoreName(row.store.toString()) : row.store
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

      const responseData = {
        storeCategories,
      }
      
      // キャッシュに保存
      setCache(cacheKey, responseData)

      return NextResponse.json(responseData)
    }

    // onetime_monthly_summary から高速取得（集計テーブル経由）
    // 旧: onetimeテーブル直接GROUP BY → フルスキャン・重い
    // 新: 事前集計テーブルを参照 → 数十行スキャン・数ms
    const yearMonth = `${year}-${month}`
    const [monthlyRows] = await connection.execute(
      `SELECT store, total_count as count
       FROM onetime_monthly_summary
       WHERE \`year_month\` = ?`,
      [yearMonth],
    )

    const [todayRows] = await connection.execute(
      `SELECT store, COUNT(*) as count 
       FROM onetime 
       WHERE date = ?
       AND IFNULL(card_entry_method, '') != 'KEYED'
       GROUP BY store`,
      [todayStr],
    )

    const [yesterdayRows] = await connection.execute(
      `SELECT store, COUNT(*) as count 
       FROM onetime 
       WHERE date = ?
       AND IFNULL(card_entry_method, '') != 'KEYED'
       GROUP BY store`,
      [yesterdayStr],
    )

    const [monthlyOnetimeSales] = await connection.execute(
      `SELECT store, total_sales
       FROM onetime_monthly_summary
       WHERE \`year_month\` = ?`,
      [yearMonth],
    )

    const [todayOnetimeSales] = await connection.execute(
      `SELECT store, SUM(total_net_amount) as total_sales
       FROM onetime 
       WHERE date = ?
       AND IFNULL(card_entry_method, '') != 'KEYED'
       GROUP BY store`,
      [todayStr],
    )

    const [todaySubscSales] = await connection.execute(
      `SELECT store, SUM(total_net_amount) as total_sales
       FROM invoice 
       WHERE Date = ?
       GROUP BY store`,
      [todayStr],
    )

    // invoice_monthly_summaryから高速取得（集計テーブル経由）
    // 旧クエリ: invoiceテーブルを直接GROUP BY → 平均171,462行スキャン・567ms
    // 新クエリ: 事前集計テーブルを参照 → 数十行スキャン・数ms
    const twelveMonthsAgoDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1 - 11, 1)
    const graphStartYearMonth = `${twelveMonthsAgoDate.getFullYear()}-${String(twelveMonthsAgoDate.getMonth() + 1).padStart(2, "0")}`
    const graphEndYearMonth = `${year}-${month}`

    const [invoiceRows] = await connection.execute(
      `SELECT 
         \`year_month\` as month,
         store,
         total_count as count
       FROM invoice_monthly_summary
       WHERE \`year_month\` >= ?
         AND \`year_month\` <= ?
       ORDER BY \`year_month\` ASC, store`,
      [graphStartYearMonth, graphEndYearMonth],
    )

    // 当月・前月の year_month を算出
    const currentYearMonth = `${year}-${month}`
    const prevMonthNum = Number.parseInt(month) === 1 ? 12 : Number.parseInt(month) - 1
    const prevYearNum  = Number.parseInt(month) === 1 ? Number.parseInt(year) - 1 : Number.parseInt(year)
    const prevYearMonth = `${prevYearNum}-${String(prevMonthNum).padStart(2, "0")}`

    // 当月: invoice_monthly_summary から高速取得（集計テーブル経由）
    // 旧: invoiceテーブル直接CASE集計 → 20,583行スキャン・97ms
    // 新: 事前集計テーブルを参照 → 数十行スキャン・数ms
    const [currentInvoiceRows] = await connection.execute(
      `SELECT store, source_count, on_file_count, keyed_count, total_sales
       FROM invoice_monthly_summary
       WHERE \`year_month\` = ?`,
      [currentYearMonth],
    )

    // 前月: invoice_monthly_summary から高速取得（集計テーブル経由）
    const [prevInvoiceRows] = await connection.execute(
      `SELECT store, source_count, on_file_count, keyed_count
       FROM invoice_monthly_summary
       WHERE \`year_month\` = ?`,
      [prevYearMonth],
    )

    await connection.end()

    const monthlyData = aggregateData(monthlyRows as any[])
    const todayData = aggregateData(todayRows as any[])
    const yesterdayData = aggregateData(yesterdayRows as any[])

    const monthlyOnetimeSalesMap = new Map<string, number>()
    ;(monthlyOnetimeSales as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        monthlyOnetimeSalesMap.set(normalizeStoreName(row.store), Number(row.total_sales) || 0)
      }
    })

    const todayOnetimeSalesMap = new Map<string, number>()
    ;(todayOnetimeSales as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        todayOnetimeSalesMap.set(normalizeStoreName(row.store), Number(row.total_sales) || 0)
      }
    })

    const todaySubscSalesMap = new Map<string, number>()
    ;(todaySubscSales as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        todaySubscSalesMap.set(normalizeStoreName(row.store), Number(row.total_sales) || 0)
      }
    })

    // 当月: currentInvoiceRows から source・ON_FILE・KEYED・売上 を一括展開
    const monthlySubscSalesMap = new Map<string, number>()
    const currentSourceMap = new Map<string, number>()
    const currentOnFileMap = new Map<string, number>()
    const currentKeyedMap = new Map<string, number>()
    ;(currentInvoiceRows as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        const key = normalizeStoreName(row.store)
        monthlySubscSalesMap.set(key, Number(row.total_sales) || 0)
        currentSourceMap.set(key, Number(row.source_count) || 0)
        currentOnFileMap.set(key, Number(row.on_file_count) || 0)
        currentKeyedMap.set(key, Number(row.keyed_count) || 0)
      }
    })

    // 前月: prevInvoiceRows から source・ON_FILE・KEYED を一括展開
    const prevSourceMap = new Map<string, number>()
    const prevOnFileMap = new Map<string, number>()
    const prevKeyedMap = new Map<string, number>()
    ;(prevInvoiceRows as any[]).forEach((row) => {
      if (row.store && row.store !== "0" && row.store.trim() !== "") {
        const key = normalizeStoreName(row.store)
        prevSourceMap.set(key, Number(row.source_count) || 0)
        prevOnFileMap.set(key, Number(row.on_file_count) || 0)
        prevKeyedMap.set(key, Number(row.keyed_count) || 0)
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
      const rawStore = row.store
      const count = Number(row.count)

      if (!rawStore || rawStore === "0" || rawStore.toString().trim() === "") {
        return
      }

      const store = normalizeStoreName(rawStore.toString())

      if (!invoiceDataMap.has(month)) {
        invoiceDataMap.set(month, {})
      }

      // 同�����舗名に正規化された複数の表記（例: スペースあり・なし）を合算する
      const existing = invoiceDataMap.get(month)![store] || 0
      invoiceDataMap.get(month)![store] = existing + count
    })

    const invoiceMonthly = Array.from(invoiceDataMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, stores]) => ({
        month,
        ...stores,
      }))

    const responseData = {
      monthly: monthlyData,
      today: todayData,
      yesterday: yesterdayData,
      invoiceMonthly,
      storeSales,
      memberChanges,
    }

    // キャッシュに保存
    setCache(cacheKey, responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "データベース接続エラー", details: String(error) }, { status: 500 })
  }
}
