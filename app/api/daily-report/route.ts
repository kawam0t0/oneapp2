import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import { cookies } from "next/headers"
import { appendToDailyReportSheet } from "@/lib/google-sheets"

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

const STORE_GAS_WEBHOOKS: Record<string, string> = {
  足利緑町店:
    "https://script.google.com/macros/s/AKfycbyH_IGw6Eh3g0AJS426BVpuubITdM-6dML9cB05uuX4FOhZP80U5nwpBYU1RMKgzZ9-/exec",
  伊勢崎韮塚店:
    "https://script.google.com/macros/s/AKfycbyRIadsTcLoG9TNlGbOJe0ts0hISQoKq3_l35PwGl1YwDf_x6ffTUNUOufD61SrMb8zVg/exec",
  太田新田店:
    "https://script.google.com/macros/s/AKfycbx-BNjjvYmoYk2jB7ay8T-FW6TQA4_cP1Oao5QG0KTIHJeELu9vaOsO7So1ZeHgaiL1/exec",
  新前橋店:
    "https://script.google.com/macros/s/AKfycbxHY1jxdddvUboCOW-plKsV5Aq-MVYcWq701D64UPc723usyDVUaJzV-YLvTAWTcSOflg/exec",
  高崎棟高店:
    "https://script.google.com/macros/s/AKfycbzet5L_wh-JJCurr-VNhRW9fk-K6LbIKHsGziSs7f2RVuxS7KQQfvH7LbvaFC9jW46DyQ/exec",
  前橋50号店:
    "https://script.google.com/macros/s/AKfycbySpi2lwyQx5Vcc_VgytgrjLAvSMP-6W54j2-Aual16HTRMpJlEkB7qMCBJzpTiGy5eHA/exec",
}

const M50_LINE_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwquB2hNkzW4yIH7XmVnSolfGbNzmFJvlVgD_FeZK0z73NpEqbKWIGQduAFgG7u9n3b/exec"

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

    return NextResponse.json(
      {
        storeName,
        date: todayStr,
        totalCount,
        itemData,
        existingReport: (existingReport as any[])[0] || null,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
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

    try {
      console.log("[v0 API] ========== Google Sheets書き込み開始 ==========")
      console.log("[v0 API] 環境変数GOOGLE_SERVICE_ACCOUNT_KEY存在:", !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY)

      await appendToDailyReportSheet({
        storeName,
        date,
        weather,
        totalCount,
        cashSales,
        itemData,
        comments,
      })
      console.log("[v0 API] ========== Google Sheets書き込み成功 ==========")
    } catch (sheetsError) {
      console.error("[v0 API] ========== Google Sheetsエラー ==========")
      console.error("[v0 API] Error saving to Google Sheets:", sheetsError)
      console.error("[v0 API] Error message:", (sheetsError as Error).message)
      console.error("[v0 API] Error stack:", (sheetsError as Error).stack)
    }

    try {
      const cleanStoreName = storeName.replace(/SPLASH'N'GO!/g, "").trim()
      const storeGasWebhookUrl = STORE_GAS_WEBHOOKS[cleanStoreName]

      console.log("[v0 API] ========== GAS Webhook呼び出し開始 ==========")
      console.log("[v0 API] 元の店舗名:", storeName)
      console.log("[v0 API] クリーンな店舗名:", cleanStoreName)
      console.log("[v0 API] 店舗別GAS URL:", storeGasWebhookUrl)

      if (storeGasWebhookUrl) {
        console.log("[v0 API] 店舗別GAS Webhookを実行中...")

        const storeGasResponse = await fetch(storeGasWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeName,
            date,
            trigger: "daily_report_submitted",
          }),
        })

        const storeGasResult = await storeGasResponse.json()

        if (storeGasResult.success) {
          console.log("[v0 API] ========== 店舗別GAS実行成功：Google Chat通知送信完了 ==========")
        } else {
          console.error("[v0 API] 店舗別GAS実行エラー:", storeGasResult.error)
        }
      } else {
        console.log(`[v0 API] 店舗「${cleanStoreName}」のGAS WebhookURLが設定されていません。`)
      }

      if (cleanStoreName === "前橋50号店" && M50_LINE_WEBHOOK_URL) {
        console.log("[v0 API] 前橋50号店専用LINE通知GASを実行中...")

        try {
          const m50LineResponse = await fetch(M50_LINE_WEBHOOK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              storeName,
              date,
              trigger: "daily_report_submitted",
            }),
          })

          const m50LineResult = await m50LineResponse.json()

          if (m50LineResult.success) {
            console.log("[v0 API] ========== 前橋50号店LINE通知送信完了 ==========")
          } else {
            console.error("[v0 API] 前橋50号店LINE通知エラー:", m50LineResult.error)
          }
        } catch (m50Error) {
          console.error("[v0 API] 前橋50号店LINE通知GAS呼び出しエラー:", m50Error)
        }
      }
    } catch (gasError) {
      console.error("[v0 API] ========== GAS呼び出しエラー ==========")
      console.error("[v0 API] Error calling GAS webhook:", gasError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0 API] Error saving daily report:", error)
    return NextResponse.json({ error: "保存エラー", details: String(error) }, { status: 500 })
  }
}
