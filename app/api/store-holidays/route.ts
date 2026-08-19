import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getConnection } from "@/lib/db"

// 定休日一覧取得
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")
    const year = searchParams.get("year")
    const month = searchParams.get("month")

    const connection = await getConnection()

    let query = "SELECT id, store_id, holiday_date, created_at, created_by FROM store_holidays"
    const params: (string | number)[] = []
    const conditions: string[] = []

    if (storeId) {
      conditions.push("store_id = ?")
      params.push(storeId)
    }

    if (year && month) {
      conditions.push("YEAR(holiday_date) = ? AND MONTH(holiday_date) = ?")
      params.push(parseInt(year), parseInt(month))
    } else if (year) {
      conditions.push("YEAR(holiday_date) = ?")
      params.push(parseInt(year))
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY holiday_date ASC"

    const [rows] = await connection.execute(query, params)
    await connection.end()

    return NextResponse.json({ holidays: rows })
  } catch (error) {
    console.error("[v0 API] Error fetching store holidays:", error)
    return NextResponse.json({ error: "定休日の取得に失敗しました" }, { status: 500 })
  }
}

// 定休日追加（adminのみ）
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)

    // adminのみ許可
    if (String(session.role).toLowerCase() !== "admin" && session.store_name !== "admin") {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 })
    }

    const body = await request.json()
    const { store_id, holiday_date } = body
    const storeId = store_id
    const holidayDate = holiday_date

    if (!storeId || !holidayDate) {
      return NextResponse.json({ error: "店舗IDと日付は必須です" }, { status: 400 })
    }

    const connection = await getConnection()

    await connection.execute(
      "INSERT INTO store_holidays (store_id, holiday_date, created_by) VALUES (?, ?, ?)",
      [storeId, holidayDate, session.email || "admin"]
    )

    await connection.end()

    return NextResponse.json({ success: true, message: "定休日を追加しました" })
  } catch (error: unknown) {
    console.error("[v0 API] Error adding store holiday:", error)
    
    // 重複エラーの場合
    if (error && typeof error === "object" && "code" in error && error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "この日付は既に登録されています" }, { status: 409 })
    }
    
    return NextResponse.json({ error: "定休日の追加に失敗しました" }, { status: 500 })
  }
}

// 定休日削除（adminのみ）
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)

    // adminのみ許可
    if (String(session.role).toLowerCase() !== "admin" && session.store_name !== "admin") {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "IDは必須です" }, { status: 400 })
    }

    const connection = await getConnection()

    await connection.execute("DELETE FROM store_holidays WHERE id = ?", [id])

    await connection.end()

    return NextResponse.json({ success: true, message: "定休日を削除しました" })
  } catch (error) {
    console.error("[v0 API] Error deleting store holiday:", error)
    return NextResponse.json({ error: "定休日の削除に失敗しました" }, { status: 500 })
  }
}
