import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import { cookies } from "next/headers"
// import { appendToDailyReportSheet } from "@/lib/google-sheets"

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

// 今日のアイテム別データ数を取得
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const storeName = session.store_name

    const connection = await getConnection()

    // 今日の日付 (JST)
    const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000)
    const todayStr = `${nowJST.getUTCFullYear()}-${String(nowJST.getUTCMonth() + 1).padStart(2, "0")}-${String(nowJST.getUTCDate()).padStart(2, "0")}`

    console.log("[v0 API] Fetching item data for store:", storeName, "date:", todayStr)

    // 今日のアイテム別データを取得（まずは全件取得してから分割処理）
    const [itemRows] = await connection.execute(
      `SELECT details
       FROM onetime 
       WHERE store = ? AND date = ?
       AND (card_entry_method IS NULL OR card_entry_method != 'KEYED')`,
      [storeName, todayStr],
    )

    // カンマで分割して個別のアイテムとしてカウント
    const itemData: Record<string, number> = {}

    for (const row of itemRows as any[]) {
      const details = row.details || ""
      const items = details
        .split(",")
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0)

      for (const item of items) {
        if (itemData[item]) {
          itemData[item]++
        } else {
          itemData[item] = 1
        }
      }
    }

    // 今日の総台数を取得
    const [totalRows] = await connection.execute(
      `SELECT COUNT(*) as total
       FROM onetime 
       WHERE store = ? AND date = ?
       AND (card_entry_method IS NULL OR card_entry_method != 'KEYED')`,
      [storeName, todayStr],
    )

    const totalCount = (totalRows as any[])[0]?.total || 0

    // 既存の日報があるか確認
    const [existingReport] = await connection.execute(
      `SELECT * FROM daily_reports WHERE store_name = ? AND report_date = ?`,
      [storeName, todayStr],
    )

    await connection.end()

    console.log("[v0 API] Item data (split by comma):", itemData)
    console.log("[v0 API] Total count:", totalCount)

    return NextResponse.json({
      storeName,
      date: todayStr,
      totalCount,
      itemData,
      existingReport: (existingReport as any[])[0] || null,
    })
  } catch (error) {
    console.error("[v0 API] Error fetching daily report data:", error)
    return NextResponse.json({ error: "データ取得エラー", details: String(error) }, { status: 500 })
  }
}

// 日報を保存
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const body = await request.json()
    const { storeName, date, weather, totalCount, cashSales, itemData, comments } = body

    console.log("[v0 API] Saving daily report:", { storeName, date, weather, totalCount, cashSales, comments })

    const connection = await getConnection()

    // UPSERTで保存（既存があれば更新、なければ挿入）
    await connection.execute(
      `INSERT INTO daily_reports (store_name, report_date, weather, total_count, cash_sales, item_data, comments)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         weather = VALUES(weather),
         total_count = VALUES(total_count),
         cash_sales = VALUES(cash_sales),
         item_data = VALUES(item_data),
         comments = VALUES(comments),
         updated_at = CURRENT_TIMESTAMP`,
      [storeName, date, weather, totalCount, cashSales, JSON.stringify(itemData), comments || null],
    )

    await connection.end()

    console.log("[v0 API] Daily report saved successfully to database")

    /*
    try {
      await appendToDailyReportSheet({
        storeName,
        date,
        weather,
        totalCount,
        cashSales,
        itemData,
        comments,
      })
      console.log("[v0 API] Daily report saved successfully to Google Sheets")
    } catch (sheetsError) {
      console.error("[v0 API] Error saving to Google Sheets (non-critical):", sheetsError)
      // Google Sheetsへの保存が失敗してもDBには保存されているのでエラーにしない
    }
    */

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0 API] Error saving daily report:", error)
    return NextResponse.json({ error: "保存エラー", details: String(error) }, { status: 500 })
  }
}
