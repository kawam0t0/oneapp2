import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

// ローカル環境で環境変数を設定してください
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

// お知らせ一覧を取得
export async function GET() {
  let connection
  try {
    connection = await getConnection()

    const [rows] = await connection.execute(
      "SELECT id, title, message, image_url, created_at, is_read FROM notifications ORDER BY created_at DESC LIMIT 50",
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Notifications fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// 新しいお知らせを投稿
export async function POST(request: Request) {
  let connection
  try {
    const { title, message, image_url } = await request.json()

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 })
    }

    connection = await getConnection()

    const jstNow = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" }).replace("T", " ")

    await connection.execute(
      "INSERT INTO notifications (title, message, image_url, created_at, is_read) VALUES (?, ?, ?, ?, false)",
      [title, message, image_url || null, jstNow],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Notification create error:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}
