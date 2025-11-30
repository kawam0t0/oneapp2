import mysql from "mysql2/promise"
import { NextResponse } from "next/server"

const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST || "34.67.209.187",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "your_username",
    password: process.env.DB_PASSWORD || "your_password",
    database: process.env.DB_NAME || "your_database",
    ssl: {
      rejectUnauthorized: false,
    },
  })
}

// イベント取得
export async function GET(request: Request) {
  let connection
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year") || new Date().getFullYear()
    const month = searchParams.get("month") || new Date().getMonth() + 1

    // 月の最初と最後の日を計算
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`

    connection = await getConnection()
    const [rows] = await connection.execute(
      "SELECT id, title, DATE_FORMAT(date, '%Y-%m-%d') as date, color FROM calendar_events WHERE date BETWEEN ? AND ? ORDER BY date ASC",
      [startDate, endDate],
    )

    console.log("[v0] Fetched events from DB:", rows)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Calendar fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}

// イベント追加
export async function POST(request: Request) {
  let connection
  try {
    const { title, date, color } = await request.json()
    console.log("[v0] Adding event:", { title, date, color })

    if (!title || !date) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 })
    }

    connection = await getConnection()
    const [result] = await connection.execute("INSERT INTO calendar_events (title, date, color) VALUES (?, ?, ?)", [
      title,
      date,
      color || "#3b82f6",
    ])

    console.log("[v0] Event added successfully:", result)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Calendar add error:", error)
    return NextResponse.json({ error: "Failed to add event" }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}
