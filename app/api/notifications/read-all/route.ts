import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

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

// 全てのお知らせを既読にする
export async function POST() {
  let connection
  try {
    connection = await getConnection()

    await connection.execute("UPDATE notifications SET is_read = true WHERE is_read = false")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Mark all read error:", error)
    return NextResponse.json({ error: "Failed to mark all as read" }, { status: 500 })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}
