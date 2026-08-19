import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { appendToDailyReportSheet } from "@/lib/google-sheets"
import { getConnection } from "@/lib/db"

export const runtime = 'nodejs'
export const maxDuration = 60 // タイムアウトを60秒に延長（Proプランで有効）

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
  鹿児島中山店:
    "https://script.google.com/macros/s/AKfycbz33cwAx6mc1zGUTYlvjYD9ihgyFE9cbzrO2Sxkv4GtEU4WtZnXA94VtYJUxMlWgON9/exec",
  藤岡大塚店:
    "https://script.google.com/macros/s/AKfycbySrfmInBii3JIaCLuvfvI4A_FPD5_Ris9bM4JKvJSQ7JJk9IgWsL0F6bLfHOPi1tmbTg/exec",
}

// store_name からブランドプレフィックスを除去
function normalizeStoreName(name: string): string {
  // SPLASH'N'GO! (英語表記) を除去
  if (name.startsWith("SPLASH")) {
    const exclamationIndex = name.includes("!") ? name.indexOf("!") : name.includes("！") ? name.indexOf("！") : -1
    if (exclamationIndex !== -1) {
      return name.substring(exclamationIndex + 1).trim()
    }
  }
  // スプラッシュンゴー (日本語表記) を除去
  return name
    .replace(/^スプラッシュンゴー[　\s]*/, "")
    .replace(/^スプラッシュ'ン'ゴー[　\s]*/, "")
    .trim()
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
    // onetimeテーブルのstoreカラムに合わせて正規化
    const storeKey = normalizeStoreName(storeName)

    // クエリパラメータで日付を受け取れるようにする（未指定なら今日）
    const url = new URL(request.url)
    const dateParam = url.searchParams.get("date")

    const connection = await getConnection()

    // 日付の決定 (JST)
    let todayStr: string
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      todayStr = dateParam
    } else {
      const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000)
      todayStr = `${nowJST.getUTCFullYear()}-${String(nowJST.getUTCMonth() + 1).padStart(2, "0")}-${String(nowJST.getUTCDate()).padStart(2, "0")}`
    }

    console.log("[v0 API] Fetching item data for store:", storeName, "storeKey:", storeKey, "date:", todayStr)

    // 部分一致（LIKE）でクエリ: スペースや表記揺れに対応
    const likePattern = `%${storeKey}%`

    // アイテム別データを取得
    const [itemRows] = await connection.execute(
      `SELECT details
       FROM onetime 
       WHERE store LIKE ? AND date = ?
       AND (card_entry_method IS NULL OR card_entry_method != 'KEYED')`,
      [likePattern, todayStr],
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

    // 総台数も部分一致で取得
    const [totalRows] = await connection.execute(
      `SELECT COUNT(*) as total
       FROM onetime 
       WHERE store LIKE ? AND date = ?
       AND (card_entry_method IS NULL OR card_entry_method != 'KEYED')`,
      [likePattern, todayStr],
    )

    const totalCount = (totalRows as any[])[0]?.total || 0

    // 既存の日報があるか確認（store_nameはフルネームで保存）
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
  console.log("[v0 API] ========== POST /api/daily-report 開始 ==========")
  try {
    console.log("[v0 API] Cookieを取得中...")
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      console.log("[v0 API] セッションなし - 401エラー")
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    console.log("[v0 API] セッションあり、bodyを取得中...")
    const body = await request.json()
    const { storeName, date, weather, totalCount, cashSales, itemData, comments } = body

    console.log("[v0 API] ========== 日報データ受信 ==========")
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
      // normalizeStoreName を使って統一的に店舗名を正規化
      const cleanStoreName = normalizeStoreName(storeName)
      const storeGasWebhookUrl = STORE_GAS_WEBHOOKS[cleanStoreName]

      console.log("[v0 API] ========== GAS Webhook呼び出し開始 ==========")
      console.log("[v0 API] 元の店舗名:", storeName)
      console.log("[v0 API] クリーンな店舗名:", cleanStoreName)
      console.log("[v0 API] 店舗別GAS URL:", storeGasWebhookUrl)

      if (storeGasWebhookUrl) {
        console.log("[v0 API] 店舗別GAS Webhookを実行中...")

        // Google Sheetsへの書き込みが反映されるまで3秒待機
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Google Chat API直接かGAS経由かを判定（リクエストボディのみ分岐）
        const isDirectGoogleChat = storeGasWebhookUrl.includes("chat.googleapis.com")
        let requestBody: any
        if (isDirectGoogleChat) {
          requestBody = {
            text: `【日報提出通知】\n店舗: ${cleanStoreName}\n日付: ${date}\n日報が提出されました。`,
          }
        } else {
          requestBody = {
            storeName,
            date,
            trigger: "daily_report_submitted",
          }
        }

        const storeGasResponse = await fetch(storeGasWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          body: JSON.stringify(requestBody),
        })

        const responseText = await storeGasResponse.text()
        console.log("[v0 API] GAS response status:", storeGasResponse.status)
        console.log("[v0 API] GAS response text:", responseText)

        // JSONとしてパース試行（失敗してもGAS自体は実行されている）
        try {
          const storeGasResult = JSON.parse(responseText)
          if (storeGasResult.success) {
            console.log("[v0 API] ========== 店舗別GAS実行成功：Google Chat通知送信完了 ==========")
          } else {
            console.error("[v0 API] 店舗別GAS実行エラー:", storeGasResult.error)
          }
        } catch {
          // GASがHTMLやリダイレクトを返した場合でも、GASは実行されている
          console.log("[v0 API] GASレスポンスはJSONではありませんが、GASは実行されました")
        }
      } else {
        console.log(`[v0 API] 店舗「${cleanStoreName}」のGAS WebhookURLが設定されていません。`)
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
