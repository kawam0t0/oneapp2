import { type NextRequest, NextResponse } from "next/server"
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

// メンテナンス履歴の取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")

    if (!storeId) {
      return NextResponse.json({ error: "Store ID is required" }, { status: 400 })
    }

    const conn = await getConnection()
    const [rows] = await conn.execute(
      `SELECT id, store_id, title, file_name, 
       DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+09:00'), '%Y-%m-%d %H:%i:%s') as created_at
       FROM maintenance_records 
       WHERE store_id = ? 
       ORDER BY created_at DESC`,
      [storeId],
    )
    await conn.end()

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching maintenance records:", error)
    return NextResponse.json({ error: "Failed to fetch maintenance records" }, { status: 500 })
  }
}

// メンテナンス履歴の追加
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const storeId = formData.get("storeId") as string
    const title = formData.get("title") as string
    const file = formData.get("file") as File | null

    if (!storeId || !title) {
      return NextResponse.json({ error: "Store ID and title are required" }, { status: 400 })
    }

    let fileName: string | null = null
    let fileBuffer: Buffer | null = null

    if (file) {
      fileName = file.name
      const arrayBuffer = await file.arrayBuffer()
      fileBuffer = Buffer.from(arrayBuffer)
    }

    const conn = await getConnection()
    const [result] = await conn.execute(
      `INSERT INTO maintenance_records (store_id, title, file_name, file_data) VALUES (?, ?, ?, ?)`,
      [storeId, title, fileName, fileBuffer],
    )
    await conn.end()

    return NextResponse.json({
      success: true,
      id: (result as any).insertId,
    })
  } catch (error) {
    console.error("Error creating maintenance record:", error)
    return NextResponse.json({ error: "Failed to create maintenance record" }, { status: 500 })
  }
}

// メンテナンス履歴の削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const conn = await getConnection()
    await conn.execute("DELETE FROM maintenance_records WHERE id = ?", [id])
    await conn.end()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting maintenance record:", error)
    return NextResponse.json({ error: "Failed to delete maintenance record" }, { status: 500 })
  }
}
