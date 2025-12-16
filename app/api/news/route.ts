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

    console.log("[v0 API] Fetched news count:", (rows as any[]).length)

    // image_urlをJSON配列としてパース
    const newsWithParsedImages = (rows as any[]).map((row) => {
      console.log(`[v0 API] News ID ${row.id} image_url type:`, typeof row.image_url)
      console.log(`[v0 API] News ID ${row.id} image_url preview:`, row.image_url?.substring(0, 100))

      let parsedImageUrl = null
      if (row.image_url) {
        try {
          parsedImageUrl = typeof row.image_url === "string" ? JSON.parse(row.image_url) : row.image_url
          console.log(
            `[v0 API] News ID ${row.id} parsed image_url:`,
            Array.isArray(parsedImageUrl) ? `Array(${parsedImageUrl.length})` : typeof parsedImageUrl,
          )
        } catch (e) {
          console.error(`[v0 API] Failed to parse image_url for news ID ${row.id}:`, e)
          parsedImageUrl = row.image_url
        }
      }

      return {
        ...row,
        image_url: parsedImageUrl,
      }
    })

    return NextResponse.json(newsWithParsedImages)
  } catch (error) {
    console.error("[v0 API] Failed to fetch news:", error)
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
    const { title, message, image_urls } = body

    console.log("[v0 API] Received news creation request")
    console.log("[v0 API] Title:", title)
    console.log("[v0 API] Image URLs count:", image_urls?.length || 0)
    console.log(
      "[v0 API] Image URLs preview:",
      image_urls?.map((url: string) => url.substring(0, 50) + "..."),
    )

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    connection = await getConnection()

    const imageUrlsJson = image_urls && image_urls.length > 0 ? JSON.stringify(image_urls) : null

    console.log("[v0 API] Saving to DB, image_url JSON:", imageUrlsJson?.substring(0, 100) + "...")

    const [result] = await connection.execute(
      `INSERT INTO news (title, message, image_url, is_published, published_at) 
       VALUES (?, ?, ?, 1, NOW())`,
      [title, message || "", imageUrlsJson],
    )

    const insertId = (result as any).insertId
    console.log("[v0 API] News created with ID:", insertId)

    return NextResponse.json({
      success: true,
      id: insertId,
    })
  } catch (error) {
    console.error("[v0 API] Failed to create news:", error)
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}
