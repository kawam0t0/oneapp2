import { NextResponse } from "next/server"
import mysql from "mysql2/promise"
import { cookies } from "next/headers"

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

export async function POST(request: Request) {
  let connection
  try {
    const { store_id, email, password } = await request.json()

    if (store_id === 0 || store_id === "0") {
      // adminログインの場合
      if (!password) {
        return NextResponse.json({ error: "パスワードを入力してください" }, { status: 400 })
      }

      connection = await getConnection()

      // adminユーザーの認証（メールアドレスなし）
      const [rows] = (await connection.execute("SELECT id, store_name FROM stores WHERE id = 0 AND password = ?", [
        password,
      ])) as [any[], any]

      if (rows.length === 0) {
        return NextResponse.json({ error: "パスワードが正しくありません" }, { status: 401 })
      }

      const store = rows[0]

      // セッションをクッキーに保存
      const cookieStore = await cookies()
      cookieStore.set(
        "session",
        JSON.stringify({
          store_id: store.id,
          store_name: store.store_name,
          email: null,
          is_admin: true,
          logged_in_at: new Date().toISOString(),
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7日間
          path: "/",
        },
      )

      return NextResponse.json({
        success: true,
        store_name: store.store_name,
        is_admin: true,
      })
    }

    if (!store_id || !email || !password) {
      return NextResponse.json({ error: "店舗、メールアドレス、パスワードを入力してください" }, { status: 400 })
    }

    connection = await getConnection()

    // 店舗ID、メールアドレス、パスワードの組み合わせを確認
    const [rows] = (await connection.execute(
      "SELECT id, store_name, mail FROM stores WHERE id = ? AND mail = ? AND password = ?",
      [store_id, email, password],
    )) as [any[], any]

    if (rows.length === 0) {
      return NextResponse.json({ error: "店舗、メールアドレス、またはパスワードが正しくありません" }, { status: 401 })
    }

    const store = rows[0]

    // セッションをクッキーに保存
    const cookieStore = await cookies()
    cookieStore.set(
      "session",
      JSON.stringify({
        store_id: store.id,
        store_name: store.store_name,
        email: store.mail,
        is_admin: false,
        logged_in_at: new Date().toISOString(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7日間
        path: "/",
      },
    )

    return NextResponse.json({
      success: true,
      store_name: store.store_name,
      is_admin: false,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "ログイン処理中にエラーが発生しました" }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}
