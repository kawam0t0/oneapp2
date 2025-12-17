//import { google } from "googleapis"

// Google Sheets APIクライアントを取得
export async function getGoogleSheetsClient() {
  // 環境変数からサービスアカウントの認証情報を取得
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}")

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const authClient = await auth.getClient()
  const sheets = google.sheets({ version: "v4", auth: authClient as any })

  return sheets
}

// スプレッドシートにデータを追加
export async function appendToDailyReportSheet(data: {
  storeName: string
  date: string
  weather: string
  totalCount: number
  cashSales: number
  itemData: Record<string, number>
  comments?: string
}) {
  const spreadsheetId = "1tGg9j238HkbW0vlwCfls1U9Hf5lFrvnKvuUm7OosUJU"
  const sheetName = "日報入力"

  // アイテム名から列へのマッピング
  const getItemValue = (itemName: string): number => {
    return data.itemData[itemName] || 0
  }

  // ポイントを含むアイテムの合計を計算
  const getPointsTotal = (): number => {
    let total = 0
    for (const [itemName, count] of Object.entries(data.itemData)) {
      if (itemName.includes("ポイント")) {
        total += count
      }
    }
    return total
  }

  // 社員・その他を含むアイテムの合計を計算
  const getStaffOtherTotal = (): number => {
    let total = 0
    for (const [itemName, count] of Object.entries(data.itemData)) {
      if (itemName.includes("社員") || itemName.includes("その他")) {
        total += count
      }
    }
    return total
  }

  // スプレッドシートに追加する行データ（B列からAF列まで）
  const rowData = [
    data.storeName, // B列: 店舗名
    data.date, // C列: 日付
    data.weather, // D列: 天気
    data.totalCount, // E列: 総台数
    data.cashSales, // F列: 現金売上
    getItemValue("新規プレミアム"), // G列
    getItemValue("新規コーティングプラス") || getItemValue("新規プラス"), // H列
    getItemValue("新規ナイアガラ"), // I列
    getItemValue("新規セラミック"), // J列
    getItemValue("リピプレミアム"), // K列
    getItemValue("リピプラス"), // L列
    getItemValue("リピナイアガラ"), // M列
    getItemValue("リピセラミック"), // N列
    getItemValue("サブスクプレミアム"), // O列
    getItemValue("サブスクコーティングプラス") || getItemValue("サブスクプラス"), // P列
    getItemValue("サブスクナイアガラ"), // Q列
    getItemValue("サブスクセラミック"), // R列
    getItemValue("プレミアム⇨プラス") || getItemValue("プレミアム→プラス"), // S列
    getItemValue("プレミアム⇨ナイアガラ") || getItemValue("プレミアム→ナイアガラ"), // T列
    getItemValue("プレミアム⇨タートル") || getItemValue("プレミアム→タートル"), // U列
    getItemValue("プラス⇨ナイアガラ") || getItemValue("プラス→ナイアガラ"), // V列
    getItemValue("プラス⇨タートル") || getItemValue("プラス→タートル"), // W列
    getItemValue("ナイアガラ⇨タートル") || getItemValue("ナイアガラ→タートル"), // X列
    getPointsTotal(), // Y列: ポイント（ポイントを含む商品の合計）
    getStaffOtherTotal(), // Z列: 社員・その他
    getItemValue("バキューム"), // AA列
    "", // AB列: 空白（その他300の前）
    getItemValue("その他300"), // AC列
    getItemValue("セラミック祭り"), // AD列
    "", // AE列: 空白（所感の前）
    data.comments || "", // AF列: 所感
  ]

  console.log("[v0 Google Sheets] Appending row to sheet:", sheetName)
  console.log("[v0 Google Sheets] Row data:", rowData)

  try {
    const sheets = await getGoogleSheetsClient()

    // スプレッドシートに行を追加
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!B:AF`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowData],
      },
    })

    console.log("[v0 Google Sheets] Successfully appended data to sheet")
    return { success: true }
  } catch (error) {
    console.error("[v0 Google Sheets] Error appending to sheet:", error)
    throw error
  }
}
