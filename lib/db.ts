import mysql from "mysql2/promise"

export const getConnection = async () => {
  const socketPath = process.env.INSTANCE_UNIX_SOCKET
  const dbUser = process.env.DB_USER
  const dbName = process.env.DB_NAME
  const dbHost = process.env.DB_HOST

  console.log("[v0] DB Connection Debug:")
  console.log("[v0] INSTANCE_UNIX_SOCKET:", socketPath ? "SET" : "UNDEFINED")
  console.log("[v0] DB_USER:", dbUser ? "SET" : "UNDEFINED")
  console.log("[v0] DB_NAME:", dbName ? "SET" : "UNDEFINED")
  console.log("[v0] DB_HOST:", dbHost ? "SET" : "UNDEFINED")
  console.log("[v0] Node ENV:", process.env.NODE_ENV)

  if (socketPath) {
    // Cloud Run環境: Cloud SQL Auth Proxy経由（Unixソケット）
    console.log("[v0] Using Unix Socket connection to:", socketPath)
    return await mysql.createConnection({
      socketPath: socketPath,
      user: dbUser || "your_username",
      password: process.env.DB_PASSWORD || "your_password",
      database: dbName || "your_database",
    })
  } else if (process.env.NODE_ENV === "production") {
    // 本番環境なのに INSTANCE_UNIX_SOCKET がない場合は エラー
    throw new Error(
      "INSTANCE_UNIX_SOCKET environment variable is not set. Cloud Run deployment requires this variable."
    )
  } else {
    // ローカル開発環境: TCP接続
    console.log("[v0] Using TCP connection")
    return await mysql.createConnection({
      host: dbHost || "34.67.209.187",
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      user: dbUser || "your_username",
      password: process.env.DB_PASSWORD || "your_password",
      database: dbName || "your_database",
      ssl: {
        rejectUnauthorized: false,
      },
    })
  }
}

export async function query(sql: string, params?: any[]) {
  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(sql, params)
    return rows
  } finally {
    await conn.end()
  }
}
