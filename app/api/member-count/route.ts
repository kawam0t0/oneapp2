import { NextResponse } from "next/server"
import { getGoogleSheetsClient } from "@/lib/google-sheets"

const SPREADSHEET_ID = "10vdLWG9Ll-exDvIMTX93xx4_42x0bgYVZGY5OHvRbG0"

// 店舗名 → シート名のマッピング
const STORE_SHEET_MAP: Record<string, string> = {
  "前橋50号店":   "39m50",
  "伊勢崎韮塚店": "39ise",
  "高崎棟高店":   "39tm",
  "足利緑町店":   "39am",
  "新前橋店":     "39sm",
  "太田新田店":   "39on",
  "藤岡大塚店":   "39fo",
  // 鹿児島中山店はキャンペーン対象外のため除外
}

// サーバー側キャッシュ（5秒）: Google Sheets APIへのリクエストを抑制
let cache: { data: Record<string, number>; timestamp: number } | null = null
const CACHE_TTL = 5 * 1000 // 5秒

export async function GET() {
  // キャッシュが有効な場合はそのまま返す
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  try {
    const sheets = await getGoogleSheetsClient()

    // 全店舗を並列取得
    const results = await Promise.allSettled(
      Object.entries(STORE_SHEET_MAP).map(async ([storeName, sheetName]) => {
        const res = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A:A`,
        })
        const values = res.data.values ?? []
        const count = values.filter((row) => row[0] !== undefined && row[0] !== "").length
        return { storeName, count }
      })
    )

    const data: Record<string, number> = {}
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        data[result.value.storeName] = result.value.count
      }
    })

    // キャッシュ更新
    cache = { data, timestamp: Date.now() }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] member-count API error:", error)
    // エラー時はキャッシュがあれば古いデータを返す
    if (cache) return NextResponse.json(cache.data)
    return NextResponse.json({ error: "Failed to fetch member counts" }, { status: 500 })
  }
}
