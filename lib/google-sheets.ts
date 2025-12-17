import { google } from "googleapis"

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

  const cleanStoreName = data.storeName.replace(/SPLASH'N'GO!/g, "").trim()

  const formattedDate = data.date.replace(/-/g, "/")

  const getItemValueByPartialMatch = (searchTerm: string): number => {
    for (const [itemName, count] of Object.entries(data.itemData)) {
      if (itemName.includes(searchTerm)) {
        return count
      }
    }
    return 0
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

  const valueOrEmpty = (value: number): number | string => {
    return value > 0 ? value : ""
  }

  const rowData = [
    "", // A列: 空白（IDは自動採番される想定）
    cleanStoreName, // B列: 店舗名（SPLASH'N'GO!を除去）
    formattedDate, // C列: 日付（YYYY/MM/DD形式）
    data.weather, // D列: 天気
    data.totalCount, // E列: 総台数
    data.cashSales, // F列: 現金売上
    valueOrEmpty(getItemValueByPartialMatch("新規プレミアム")), // G列
    valueOrEmpty(getItemValueByPartialMatch("新規コーティングプラス") || getItemValueByPartialMatch("新規プラス")), // H列
    valueOrEmpty(getItemValueByPartialMatch("新規ナイアガラ")), // I列
    valueOrEmpty(getItemValueByPartialMatch("新規セラミック")), // J列
    valueOrEmpty(getItemValueByPartialMatch("リピプレミアム")), // K列
    valueOrEmpty(getItemValueByPartialMatch("リピコーティングプラス") || getItemValueByPartialMatch("リピプラス")), // L列
    valueOrEmpty(getItemValueByPartialMatch("リピナイアガラ")), // M列
    valueOrEmpty(getItemValueByPartialMatch("リピセラミック")), // N列
    valueOrEmpty(getItemValueByPartialMatch("サブスクプレミアム")), // O列
    valueOrEmpty(
      getItemValueByPartialMatch("サブスクコーティングプラス") || getItemValueByPartialMatch("サブスクプラス"),
    ), // P列
    valueOrEmpty(getItemValueByPartialMatch("サブスクナイアガラ")), // Q列
    valueOrEmpty(getItemValueByPartialMatch("サブスクセラミック")), // R列
    valueOrEmpty(getItemValueByPartialMatch("プレミアム⇨プラス") || getItemValueByPartialMatch("プレミアム→プラス")), // S列
    valueOrEmpty(
      getItemValueByPartialMatch("プレミアム⇨ナイアガラ") || getItemValueByPartialMatch("プレミアム→ナイアガラ"),
    ), // T列
    valueOrEmpty(
      getItemValueByPartialMatch("プレミアム⇨タートル") || getItemValueByPartialMatch("プレミアム→タートル"),
    ), // U列
    valueOrEmpty(getItemValueByPartialMatch("プラス⇨ナイアガラ") || getItemValueByPartialMatch("プラス→ナイアガラ")), // V列
    valueOrEmpty(getItemValueByPartialMatch("プラス⇨タートル") || getItemValueByPartialMatch("プラス→タートル")), // W列
    valueOrEmpty(
      getItemValueByPartialMatch("ナイアガラ⇨タートル") || getItemValueByPartialMatch("ナイアガラ→タートル"),
    ), // X列
    valueOrEmpty(getPointsTotal()), // Y列: ポイント（ポイントを含む商品の合計）
    valueOrEmpty(getStaffOtherTotal()), // Z列: 社員・その他
    valueOrEmpty(getItemValueByPartialMatch("バキューム")), // AA列
    "", // AB列: 空白（その他300の前）
    valueOrEmpty(getItemValueByPartialMatch("その他300")), // AC列
    valueOrEmpty(getItemValueByPartialMatch("セラミック祭り")), // AD列
    "", // AE列: 空白（所感の前）
    data.comments || "", // AF列: 所感
  ]

  console.log("[v0 Google Sheets] Appending row to sheet:", sheetName)
  console.log("[v0 Google Sheets] Cleaned store name:", cleanStoreName)
  console.log("[v0 Google Sheets] Formatted date:", formattedDate)
  console.log("[v0 Google Sheets] Row data length:", rowData.length)
  console.log("[v0 Google Sheets] First 5 columns:", rowData.slice(0, 5))

  try {
    const sheets = await getGoogleSheetsClient()

    // スプレッドシートに行を追加
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:AF`,
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
