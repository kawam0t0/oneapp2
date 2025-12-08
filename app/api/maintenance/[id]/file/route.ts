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

// PDFファイルのダウンロード
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const conn = await getConnection()
    const [rows] = await conn.execute("SELECT file_name, file_data FROM maintenance_records WHERE id = ?", [id])
    await conn.end()

    const records = rows as any[]
    if (records.length === 0 || !records[0].file_data) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const { file_name, file_data } = records[0]

    return new NextResponse(file_data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(file_name)}"`,
      },
    })
  } catch (error) {
    console.error("Error fetching file:", error)
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 })
  }
}
