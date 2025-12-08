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

// 1週間以内の最新お知らせを取得
export async function GET() {
  let connection
  try {
    connection = await getConnection()

    // 1週間以内に作成されたお知らせを取得（最新1件）
    const [rows] = await connection.execute(
      `SELECT id, title, created_at 
       FROM notifications 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       ORDER BY created_at DESC 
       LIMIT 1`,
    )

    const notifications = rows as any[]

    if (notifications.length > 0) {
      return NextResponse.json({ notification: notifications[0] })
    } else {
      return NextResponse.json({ notification: null })
    }
  } catch (error) {
    console.error("Latest notification fetch error:", error)
    return NextResponse.json({ notification: null })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}
