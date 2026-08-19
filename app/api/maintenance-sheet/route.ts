import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getConnection } from "@/lib/db"

// メンテシート一覧取得
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const connection = await getConnection()
    const [rows] = await connection.execute(
      "SELECT id, file_name, file_size, uploaded_at, uploaded_by FROM maintenance_sheets ORDER BY uploaded_at DESC LIMIT 1"
    )
    await connection.end()

    const sheets = rows as Array<{
      id: number
      file_name: string
      file_size: number
      uploaded_at: Date
      uploaded_by: string
    }>

    if (sheets.length === 0) {
      return NextResponse.json({ sheet: null })
    }

    return NextResponse.json({ sheet: sheets[0] })
  } catch (error) {
    console.error("[v0 API] Error fetching maintenance sheet:", error)
    return NextResponse.json({ error: "データの取得に失敗しました" }, { status: 500 })
  }
}

// メンテシートアップロード
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    
    // adminのみアップロード可能
    if (!session.is_admin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "PDFファイルのみアップロード可能です" }, { status: 400 })
    }

    // ファイルをバイナリに変換
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const connection = await getConnection()

    // 既存のシートを削除（最新1件のみ保持）
    await connection.execute("DELETE FROM maintenance_sheets")

    // 新しいシートを挿入
    await connection.execute(
      "INSERT INTO maintenance_sheets (file_name, file_data, file_size, uploaded_by) VALUES (?, ?, ?, ?)",
      [file.name, buffer, file.size, session.email || "admin"]
    )

    await connection.end()

    return NextResponse.json({ success: true, message: "アップロードが完了しました" })
  } catch (error) {
    console.error("[v0 API] Error uploading maintenance sheet:", error)
    return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 })
  }
}

// メンテシート削除
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    
    // adminのみ削除可能
    if (!session.is_admin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 })
    }

    const connection = await getConnection()
    await connection.execute("DELETE FROM maintenance_sheets")
    await connection.end()

    return NextResponse.json({ success: true, message: "削除が完了しました" })
  } catch (error) {
    console.error("[v0 API] Error deleting maintenance sheet:", error)
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 })
  }
}
