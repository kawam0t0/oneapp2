import { NextResponse } from "next/server"
import { getConnection } from "@/lib/db"

/**
 * POST /api/sync-monthly-summary
 * invoice_monthly_summary テーブルを最新データで更新するバッチAPI
 * Cloud Scheduler から毎日夜間に呼び出す想定
 * 手動実行も可能
 */
export async function POST(request: Request) {
  // 簡易認証: Authorization ヘッダーで保護
  const authHeader = request.headers.get("authorization")
  const secret = process.env.BATCH_SECRET || ""
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const connection = await getConnection()
  try {
    // 直近13ヶ月分を再集計してUPSERT（source_count・on_file_count・keyed_count・total_salesも更新）
    const [invoiceResult] = await connection.execute(
      `INSERT INTO invoice_monthly_summary
         (\`year_month\`, store, total_count, source_count, on_file_count, keyed_count, total_sales)
       SELECT
         DATE_FORMAT(Date, '%Y-%m') AS \`year_month\`,
         store,
         COUNT(*) AS total_count,
         SUM(CASE WHEN source = '請求書'             THEN 1 ELSE 0 END) AS source_count,
         SUM(CASE WHEN card_entry_method = 'ON_FILE' THEN 1 ELSE 0 END) AS on_file_count,
         SUM(CASE WHEN card_entry_method = 'KEYED'   THEN 1 ELSE 0 END) AS keyed_count,
         SUM(total_net_amount) AS total_sales
       FROM invoice
       WHERE Date >= DATE_SUB(CURDATE(), INTERVAL 13 MONTH)
       GROUP BY DATE_FORMAT(Date, '%Y-%m'), store
       ON DUPLICATE KEY UPDATE
         total_count   = VALUES(total_count),
         source_count  = VALUES(source_count),
         on_file_count = VALUES(on_file_count),
         keyed_count   = VALUES(keyed_count),
         total_sales   = VALUES(total_sales)`
    ) as any[]

    const invoiceAffected = (invoiceResult as any).affectedRows ?? 0
    console.log(`[sync-monthly-summary] invoice: Updated ${invoiceAffected} rows`)

    // onetime_monthly_summary を更新（2025-06以降 + 直近13ヶ月）
    const [onetimeResult] = await connection.execute(
      `INSERT INTO onetime_monthly_summary (\`year_month\`, store, total_count, total_sales)
       SELECT 
         DATE_FORMAT(date, '%Y-%m') AS \`year_month\`,
         store,
         COUNT(*) AS total_count,
         SUM(total_net_amount) AS total_sales
       FROM onetime
       WHERE date >= '2025-06-01'
         AND date >= DATE_SUB(CURDATE(), INTERVAL 13 MONTH)
         AND IFNULL(card_entry_method, '') != 'KEYED'
       GROUP BY DATE_FORMAT(date, '%Y-%m'), store
       ON DUPLICATE KEY UPDATE
         total_count = VALUES(total_count),
         total_sales = VALUES(total_sales)`
    ) as any[]

    const onetimeAffected = (onetimeResult as any).affectedRows ?? 0
    console.log(`[sync-monthly-summary] onetime: Updated ${onetimeAffected} rows`)

    return NextResponse.json({
      success: true,
      invoice: { affectedRows: invoiceAffected },
      onetime: { affectedRows: onetimeAffected },
      updatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("[sync-monthly-summary] Error:", error?.message)
    return NextResponse.json({ error: error?.message }, { status: 500 })
  } finally {
    await connection.end()
  }
}

// GET: 現在の集計テーブルの状態確認用
export async function GET() {
  const connection = await getConnection()
  try {
    const [invoiceRows] = await connection.execute(
      `SELECT \`year_month\`, COUNT(*) as store_count, SUM(total_count) as total
       FROM invoice_monthly_summary
       GROUP BY \`year_month\`
       ORDER BY \`year_month\` DESC
       LIMIT 13`
    )
    const [onetimeRows] = await connection.execute(
      `SELECT \`year_month\`, COUNT(*) as store_count, SUM(total_count) as total_count, SUM(total_sales) as total_sales
       FROM onetime_monthly_summary
       GROUP BY \`year_month\`
       ORDER BY \`year_month\` DESC
       LIMIT 13`
    )
    return NextResponse.json({ invoice: invoiceRows, onetime: onetimeRows })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  } finally {
    await connection.end()
  }
}
