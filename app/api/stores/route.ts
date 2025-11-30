import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST || "34.67.209.187",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
  })
}

export async function GET() {
  let connection
  try {
    connection = await getConnection()
    const [rows] = await connection.execute("SELECT id, store_name FROM stores ORDER BY id")
    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Failed to fetch stores:", error)
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}
