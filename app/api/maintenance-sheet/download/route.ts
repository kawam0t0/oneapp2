import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getConnection } from "@/lib/db"

// メンテシートダウンロード
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const connection = await getConnection()
    const [rows] = await connection.execute(
      "SELECT file_name, file_data FROM maintenance_sheets ORDER BY uploaded_at DESC LIMIT 1"
    )
    await connection.end()

    const sheets = rows as Array<{
      filename: string
      file_data: Buffer
    }>

    if (sheets.length === 0) {
      return NextResponse.json({ error: "ファイルが見つかりません" }, { status: 404 })
    }

    const sheet = sheets[0]

    // PDFファイルとして返す（ファイル名は「メンテナンスシート.pdf」に固定）
    return new NextResponse(sheet.file_data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="maintenance-sheet.pdf"; filename*=UTF-8''${encodeURIComponent("メンテナンスシート.pdf")}`,
      },
    })
  } catch (error) {
    console.error("[v0 API] Error downloading maintenance sheet:", error)
    return NextResponse.json({ error: "ダウンロードに失敗しました" }, { status: 500 })
  }
}