import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get("q") || ""

    if (!searchQuery || searchQuery.trim() === "") {
      return NextResponse.json({ customers: [] })
    }

    // customer_ref_idとcustomer_nameで部分一致検索
    const sql = `
      SELECT 
        customer_ref_id,
        customer_name,
        car_info,
        car_color,
        last_details
      FROM customers
      WHERE 
        (customer_ref_id LIKE ? OR customer_name LIKE ?)
        AND (customer_ref_id IS NOT NULL OR customer_name IS NOT NULL)
      ORDER BY customer_name ASC
      LIMIT 100
    `

    const searchPattern = `%${searchQuery}%`
    const customers = await query(sql, [searchPattern, searchPattern])

    return NextResponse.json({ customers })
  } catch (error) {
    console.error("顧客検索エラー:", error)
    return NextResponse.json({ error: "顧客検索に失敗しました" }, { status: 500 })
  }
}