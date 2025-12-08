import { type NextRequest, NextResponse } from "next/server"
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

// お知らせ一覧を取得
export async function GET() {
  let connection
  try {
    connection = await getConnection()

    // 公開されているお知らせを新しい順に取得
    const [rows] = await connection.execute(
      `SELECT 
        id, 
        title, 
        message, 
        image_url,
        is_published,
        DATE_FORMAT(CONVERT_TZ(published_at, '+00:00', '+09:00'), '%Y-%m-%d %H:%i:%s') as published_at,
        DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+09:00'), '%Y-%m-%d %H:%i:%s') as created_at
      FROM news 
      WHERE is_published = 1 
      ORDER BY published_at DESC`,
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Failed to fetch news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}

// お知らせを作成
export async function POST(request: NextRequest) {
  let connection
  try {
    const body = await request.json()
    const { title, message, image_url } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    connection = await getConnection()

    const [result] = await connection.execute(
      `INSERT INTO news (title, message, image_url, is_published, published_at) 
       VALUES (?, ?, ?, 1, NOW())`,
      [title, message || "", image_url || null],
    )

    return NextResponse.json({
      success: true,
      id: (result as any).insertId,
    })
  } catch (error) {
    console.error("Failed to create news:", error)
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}
