import { NextResponse } from "next/server"
import { getConnection } from "@/lib/db"

// DB接続失敗時のフォールバック（admin含む）
const FALLBACK_STORES = [
  { id: 0,  store_name: "admin" },
  { id: 1,  store_name: "SPLASH'N'GO!前橋50号店" },
  { id: 2,  store_name: "SPLASH'N'GO!伊勢崎韮塚店" },
  { id: 3,  store_name: "SPLASH'N'GO!高崎棟高店" },
  { id: 4,  store_name: "SPLASH'N'GO!足利緑町店" },
  { id: 5,  store_name: "SPLASH'N'GO!新前橋店" },
  { id: 6,  store_name: "SPLASH'N'GO!太田新田店" },
  { id: 9,  store_name: "スプラッシュンゴー鹿児島中山店" },
  { id: 10, store_name: "スプラッシュンゴー藤岡大塚店" },
]

export async function GET() {
  let connection
  try {
    connection = await getConnection()
    const [rows] = await connection.execute("SELECT id, store_name FROM stores ORDER BY id")
    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Failed to fetch stores from DB, using fallback:", error)
    return NextResponse.json(FALLBACK_STORES)
  } finally {
    if (connection) {
      try { await connection.end() } catch {}
    }
  }
}
