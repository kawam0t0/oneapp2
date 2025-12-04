import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST || "34.67.209.187",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "your_username",
    password: process.env.DB_PASSWORD || "your_password",
    database: process.env.DB_NAME || "your_database_name",
    ssl: {
      rejectUnauthorized: false,
    },
  })
}

const parseDateToString = (dateValue: any): string => {
  if (dateValue instanceof Date) {
    const year = dateValue.getFullYear()
    const month = String(dateValue.getMonth() + 1).padStart(2, "0")
    const day = String(dateValue.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }
  return String(dateValue).split("T")[0]
}

const getWeeklyData = async (
  connection: mysql.Connection,
  table: string,
  store: string | null,
  startDate: string,
  endDate: string,
  condition: string,
) => {
  let query: string
  let params: any[]

  if (store) {
    query = `
      SELECT Date, COUNT(*) as count 
      FROM ${table} 
      WHERE store = ? AND Date >= ? AND Date <= ? AND ${condition}
      GROUP BY Date
      ORDER BY Date
    `
    params = [store, startDate, endDate]
  } else {
    query = `
      SELECT Date, COUNT(*) as count 
      FROM ${table} 
      WHERE Date >= ? AND Date <= ? AND ${condition}
      GROUP BY Date
      ORDER BY Date
    `
    params = [startDate, endDate]
  }

  const [rows] = await connection.execute(query, params)

  const startParts = startDate.split("-")
  const startYear = Number.parseInt(startParts[0])
  const startMonth = Number.parseInt(startParts[1]) - 1
  const startDay = Number.parseInt(startParts[2])
  const startDateObj = new Date(Date.UTC(startYear, startMonth, startDay))

  const weeklyData: { [week: number]: number } = {}
  ;(rows as any[]).forEach((row) => {
    const rowDateStr = parseDateToString(row.Date)
    const rowParts = rowDateStr.split("-")
    const rowYear = Number.parseInt(rowParts[0])
    const rowMonth = Number.parseInt(rowParts[1]) - 1
    const rowDay = Number.parseInt(rowParts[2])
    const rowDateObj = new Date(Date.UTC(rowYear, rowMonth, rowDay))

    const diffDays = Math.floor((rowDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24))
    const weekNum = diffDays < 0 ? 1 : Math.floor(diffDays / 7) + 1

    if (!weeklyData[weekNum]) {
      weeklyData[weekNum] = 0
    }
    weeklyData[weekNum] += Number(row.count)
  })

  return weeklyData
}

const getOtaShintaWeeklyData = async (connection: mysql.Connection, startDate: string, endDate: string) => {
  const [subscRows] = await connection.execute(
    `
      SELECT Date, COUNT(*) as count 
      FROM otanitta_campaign 
      WHERE Date >= ? AND Date <= ? 
        AND source = '請求書' 
        AND details LIKE '%期間限定%'
      GROUP BY Date
      ORDER BY Date
    `,
    [startDate, endDate],
  )

  const [refundRows] = await connection.execute(
    `
      SELECT Date, COUNT(*) as count 
      FROM otanitta_campaign 
      WHERE Date >= ? AND Date <= ? 
        AND payment_or_refund = '払い戻し' 
        AND details LIKE '%プラン%'
      GROUP BY Date
      ORDER BY Date
    `,
    [startDate, endDate],
  )

  const startParts = startDate.split("-")
  const startYear = Number.parseInt(startParts[0])
  const startMonth = Number.parseInt(startParts[1]) - 1
  const startDay = Number.parseInt(startParts[2])
  const startDateObj = new Date(Date.UTC(startYear, startMonth, startDay))

  const weeklySubsc: { [week: number]: number } = {}
  const weeklyRefund: { [week: number]: number } = {}
  ;(subscRows as any[]).forEach((row) => {
    const rowDateStr = parseDateToString(row.Date)
    const rowParts = rowDateStr.split("-")
    const rowYear = Number.parseInt(rowParts[0])
    const rowMonth = Number.parseInt(rowParts[1]) - 1
    const rowDay = Number.parseInt(rowParts[2])
    const rowDateObj = new Date(Date.UTC(rowYear, rowMonth, rowDay))

    const diffDays = Math.floor((rowDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24))
    const weekNum = diffDays < 0 ? 1 : Math.floor(diffDays / 7) + 1

    if (!weeklySubsc[weekNum]) {
      weeklySubsc[weekNum] = 0
    }
    weeklySubsc[weekNum] += Number(row.count)
  })
  ;(refundRows as any[]).forEach((row) => {
    const rowDateStr = parseDateToString(row.Date)
    const rowParts = rowDateStr.split("-")
    const rowYear = Number.parseInt(rowParts[0])
    const rowMonth = Number.parseInt(rowParts[1]) - 1
    const rowDay = Number.parseInt(rowParts[2])
    const rowDateObj = new Date(Date.UTC(rowYear, rowMonth, rowDay))

    const diffDays = Math.floor((rowDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24))
    const weekNum = diffDays < 0 ? 1 : Math.floor(diffDays / 7) + 1

    if (!weeklyRefund[weekNum]) {
      weeklyRefund[weekNum] = 0
    }
    weeklyRefund[weekNum] += Number(row.count)
  })

  const allWeeks = new Set([...Object.keys(weeklySubsc), ...Object.keys(weeklyRefund)].map(Number))
  const result: { [week: number]: number } = {}

  allWeeks.forEach((week) => {
    const subsc = weeklySubsc[week] || 0
    const refund = weeklyRefund[week] || 0
    result[week] = subsc - refund
  })

  return result
}

export async function GET() {
  let connection
  try {
    connection = await getConnection()

    // 足利緑町店: キャンペーン期間 2024/04/26〜2024/05/31, source = POSレジ
    const [ashikagaPosRows] = await connection.execute(`
      SELECT details, COUNT(*) as count 
      FROM transactions 
      WHERE store = 'SPLASH\\'N\\'GO!足利緑町店' 
        AND Date >= '2024-04-26' 
        AND Date <= '2024-05-31'
        AND source = 'POSレジ'
      GROUP BY details
      ORDER BY count DESC
    `)

    // 足利緑町店: 継続 2024/6/1〜2024/06/30, source = 請求書, details に「月額39円」
    const [ashikagaContinueRows] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM transactions 
      WHERE store = 'SPLASH\\'N\\'GO!足利緑町店' 
        AND Date >= '2024-06-01' 
        AND Date <= '2024-06-30'
        AND source = '請求書'
        AND details LIKE '%月額39円%'
    `)

    // 新前橋店: キャンペーン期間 2025/04/18〜2025/05/31, source = POSレジ
    const [shinmaebashiPosRows] = await connection.execute(`
      SELECT details, COUNT(*) as count 
      FROM transactions 
      WHERE store = 'SPLASH\\'N\\'GO!新前橋店' 
        AND Date >= '2025-04-18' 
        AND Date <= '2025-05-31'
        AND source = 'POSレジ'
      GROUP BY details
      ORDER BY count DESC
    `)

    // 新前橋店: 期間限定 2025/04/18〜2025/05/31, details に「期間限定」
    const [shinmaebashiLimitedRows] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM transactions 
      WHERE store = 'SPLASH\\'N\\'GO!新前橋店' 
        AND Date >= '2025-04-18' 
        AND Date <= '2025-05-31'
        AND details LIKE '%期間限定%'
    `)

    // 太田新田店: キャンペーン期間 2025/10/09〜2025/11/30
    const [otaShintaPosRows] = await connection.execute(`
      SELECT details, COUNT(*) as count 
      FROM otanitta_campaign 
      WHERE Date >= '2025-10-09' 
        AND Date <= '2025-11-30'
        AND source = 'POSレジ'
      GROUP BY details
      ORDER BY count DESC
    `)

    // 太田新田店: サブスク継続
    const [otaShintaSubscRows] = await connection.execute(`
      SELECT details, COUNT(*) as count 
      FROM otanitta_campaign
      WHERE Date >= '2025-10-09' 
        AND Date <= '2025-11-30'
        AND source = '請求書'
        AND details LIKE '%期間限定%'
      GROUP BY details
      ORDER BY count DESC
    `)

    const [otaShintaRefundRows] = await connection.execute(`
      SELECT details, COUNT(*) as count 
      FROM otanitta_campaign
      WHERE Date >= '2025-10-09' 
        AND Date <= '2025-11-30'
        AND payment_or_refund = '払い戻し'
        AND details LIKE '%プラン%'
      GROUP BY details
      ORDER BY count DESC
    `)

    // 週別サブスク入会数
    const ashikagaWeekly = await getWeeklyData(
      connection,
      "transactions",
      "SPLASH'N'GO!足利緑町店",
      "2024-06-01",
      "2024-06-30",
      "source = '請求書' AND details LIKE '%月額39円%'",
    )

    const shinmaebashiWeekly = await getWeeklyData(
      connection,
      "transactions",
      "SPLASH'N'GO!新前橋店",
      "2025-04-18",
      "2025-05-31",
      "details LIKE '%期間限定%'",
    )

    const otaShintaWeekly = await getOtaShintaWeeklyData(connection, "2025-10-09", "2025-11-30")

    const ashikagaWeeklyPos = await getWeeklyData(
      connection,
      "transactions",
      "SPLASH'N'GO!足利緑町店",
      "2024-04-26",
      "2024-05-31",
      "source = 'POSレジ'",
    )

    const shinmaebashiWeeklyPos = await getWeeklyData(
      connection,
      "transactions",
      "SPLASH'N'GO!新前橋店",
      "2025-04-18",
      "2025-05-31",
      "source = 'POSレジ'",
    )

    const otaShintaWeeklyPos = await getWeeklyData(
      connection,
      "otanitta_campaign",
      null,
      "2025-10-09",
      "2025-11-30",
      "source = 'POSレジ'",
    )

    await connection.end()

    const ashikagaContinueCount = (ashikagaContinueRows as any[])[0]?.count || 0
    const shinmaebashiLimitedCount = (shinmaebashiLimitedRows as any[])[0]?.count || 0

    const subscTotal = (otaShintaSubscRows as any[]).reduce((sum: number, row: any) => sum + Number(row.count), 0)
    const refundTotal = (otaShintaRefundRows as any[]).reduce((sum: number, row: any) => sum + Number(row.count), 0)
    const subscNetTotal = subscTotal - refundTotal

    return NextResponse.json({
      ashikaga: {
        storeName: "SPLASH'N'GO!足利緑町店",
        period: "2024/06/01〜2024/06/30",
        posItems: ashikagaPosRows as any[],
        continueCount: ashikagaContinueCount,
        continueLabel: "キャンペーン期間中台数",
        weeklySubsc: ashikagaWeekly,
        weeklyPos: ashikagaWeeklyPos,
      },
      shinmaebashi: {
        storeName: "SPLASH'N'GO!新前橋店",
        period: "2025/04/18〜2025/05/31",
        posItems: shinmaebashiPosRows as any[],
        limitedCount: shinmaebashiLimitedCount,
        limitedLabel: "キャンペーン期間中台数",
        weeklySubsc: shinmaebashiWeekly,
        weeklyPos: shinmaebashiWeeklyPos,
      },
      otaShinta: {
        storeName: "SPLASH'N'GO!太田新田店",
        period: "2025/10/09〜2025/11/30",
        posItems: otaShintaPosRows as any[],
        subscItems: otaShintaSubscRows as any[],
        subscLabel: "キャンペーン期間中台数",
        subscTotal: subscTotal,
        refundTotal: refundTotal,
        subscNetTotal: subscNetTotal,
        weeklySubsc: otaShintaWeekly,
        weeklyPos: otaShintaWeeklyPos,
      },
    })
  } catch (error) {
    console.error("Campaign API error:", error)
    if (connection) {
      await connection.end()
    }
    return NextResponse.json({ error: "Failed to fetch campaign data" }, { status: 500 })
  }
}
