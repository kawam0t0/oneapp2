import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || "34.67.209.187",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "webapp",
    password: process.env.DB_PASSWORD || "and0and1and2and3",
    database: process.env.DB_NAME || "square2124",
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

    // 1週間以内の最新お知らせを1件取得
    const [rows] = await connection.execute(
      `SELECT 
        id, 
        title, 
        message,
        DATE_FORMAT(CONVERT_TZ(published_at, '+00:00', '+09:00'), '%Y-%m-%d %H:%i:%s') as published_at
      FROM news 
      WHERE is_published = 1 
        AND published_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY published_at DESC 
      LIMIT 1`,
    )

    const newsArray = rows as any[]

    if (newsArray.length > 0) {
      return NextResponse.json({ news: newsArray[0] })
    }

    return NextResponse.json({ news: null })
  } catch (error) {
    console.error("Failed to fetch latest news:", error)
    return NextResponse.json({ news: null })
  } finally {
    if (connection) await connection.end()
  }
}
