import { NextResponse } from "next/server"
import { getConnection } from "@/lib/db"
import type { RowDataPacket } from "mysql2"

// store_name からブランドプレフィックスを除去（cockpit側と同じロジック）
function normalizeStoreName(name: string): string {
  return name
    .replace(/^SPLASH'N'GO!/, "")
    .replace(/^スプラッシュンゴー[　\s]*/, "")
    .replace(/^スプラッシュ'ン'ゴー[　\s]*/, "")
    .trim()
}

export async function GET() {
  let connection
  try {
    connection = await getConnection()

    // 全店舗の緯度経度を取得
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT id, store_name, latitude, longitude FROM stores WHERE latitude IS NOT NULL AND longitude IS NOT NULL"
    )

    if (rows.length === 0) {
      return NextResponse.json({})
    }

    // 各店舗の現在気温をOpen-Meteo APIから並列取得
    const results = await Promise.all(
      rows.map(async (store) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${store.latitude}&longitude=${store.longitude}&current_weather=true&timezone=Asia/Tokyo`
          const res = await fetch(url)
          if (!res.ok) return { storeName: store.store_name, temp: null }
          const data = await res.json()
          const temp = data.current_weather ? Math.round(data.current_weather.temperature) : null
          return { storeName: store.store_name, temp }
        } catch {
          return { storeName: store.store_name, temp: null }
        }
      })
    )

    // store_name と正規化済み名（ブランド除去後）の両方をキーにして返す
    // → cockpit側のmonthlyDataのstore値がどちらの形式でもマッチできる
    const tempMap: Record<string, number | null> = {}
    for (const r of results) {
      tempMap[r.storeName] = r.temp
      const normalized = normalizeStoreName(r.storeName)
      if (normalized !== r.storeName) {
        tempMap[normalized] = r.temp
      }
    }

    return NextResponse.json(tempMap)
  } catch (error) {
    console.error("All-stores weather API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}
