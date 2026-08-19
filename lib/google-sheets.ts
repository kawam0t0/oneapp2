import { google } from "googleapis"

// Google Sheets APIクライアントを取得
export async function getGoogleSheetsClient() {
  // 環境変数からサービスアカウントの認証情報を取得
  const keyString = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}"
  
  let credentials
  try {
    credentials = JSON.parse(keyString)
  } catch (parseError) {
    console.error("[v0 Google Sheets] Failed to parse credentials:", parseError)
    throw parseError
  }

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

  // SPLASH'N'GO! を除去（アポストロフィの種類に依存しないよう文字列操作で処理）
  let cleanStoreName = data.storeName
  
  if (cleanStoreName.startsWith("SPLASH")) {
    // 半角感嘆符 ! (U+0021) と全角感嘆符 ！ (U+FF01) の両方に対応
    let exclamationIndex = -1
    if (cleanStoreName.includes("!")) {
      exclamationIndex = cleanStoreName.indexOf("!")
    } else if (cleanStoreName.includes("！")) {
      exclamationIndex = cleanStoreName.indexOf("！")
    }
    
    if (exclamationIndex !== -1) {
      cleanStoreName = cleanStoreName.substring(exclamationIndex + 1).trim()
    }
  }

  // スプラッシュンゴー (日本語表記) を除去
  cleanStoreName = cleanStoreName
    .replace(/^スプラッシュンゴー[　\s]*/, "")
    .replace(/^スプラッシュ'ン'ゴー[　\s]*/, "")
    .trim()

  // 日付を "YYYY/MM/DD" 形式の文字列に変換
  // USER_ENTERED で送ることでGoogleシートが日付型として自動認識する
  const formattedDate = data.date.replace(/-/g, "/")

  // 藤岡大塚店かどうか判定
  const isFujioka = cleanStoreName.includes("藤岡大塚")

  // 部分一致で合計を返す（複数キーワードの合算）
  const getItemValueByPartialMatch = (...searchTerms: string[]): number => {
    let total = 0
    for (const [itemName, count] of Object.entries(data.itemData)) {
      if (searchTerms.some((term) => itemName.includes(term))) {
        total += count
      }
    }
    return total
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
    cleanStoreName, // B列: 店舗名（SPLASH'N'GO!を除去）
    formattedDate, // C列: 日付（YYYY/MM/DD形式、USER_ENTEREDで日付型として格納）
    data.weather, // D列: 天気
    data.totalCount, // E列: 総台数
    data.cashSales, // F列: 現金売上
    // G列: 新規プレミアム / 新規キャンペーンプレミアム
    // 藤岡大塚: 藤岡大塚新規洗車パスプレミアム も含む
    valueOrEmpty(getItemValueByPartialMatch(
      "新規プレミアム", "新規キャンペーンプレミアム",
      ...(isFujioka ? ["藤岡大塚新規洗車パスプレミアム"] : []),
    )),
    // H列: 新規プラス / 新規キャンペーンプラス
    // 藤岡大塚: 藤岡大塚新規洗車パスプラス も含む
    valueOrEmpty(getItemValueByPartialMatch(
      "新規コーティングプラス", "新規プラス", "新規キャンペーンプラス",
      ...(isFujioka ? ["藤岡大塚新規洗車パスプラス"] : []),
    )),
    // I列: 新規ナイアガラ
    // 藤岡大塚: 藤岡大塚新規洗車パスナイアガラ も含む
    valueOrEmpty(getItemValueByPartialMatch(
      "新規ナイアガラ",
      ...(isFujioka ? ["藤岡大塚新規洗車パスナイアガラ"] : []),
    )),
    // J列: 新規セラミック / 新規デラックス（デラックスもセラミックとして集計）
    // 藤岡大塚: 藤岡大塚新規洗車パスデラックス も含む
    valueOrEmpty(getItemValueByPartialMatch(
      "新規セラミック", "新規デラックス",
      ...(isFujioka ? ["藤岡大塚新規洗車パスデラックス"] : []),
    )),
    // K列: リピプレミアム / リピキャンペーンプレミアム
    // 藤岡大塚: 藤岡大塚リピ洗車パスプレミアム も含む
    valueOrEmpty(getItemValueByPartialMatch(
      "リピプレミアム", "リピキャンペーンプレミアム", "リビキャンペーンプレミアム",
      ...(isFujioka ? ["藤岡大塚リピ洗車パスプレミアム"] : []),
    )),
    // L列: リピプラス / リピキャンペーンプラス
    // 藤岡大塚: 藤岡大塚リピ洗車パスプラス も含む
    valueOrEmpty(getItemValueByPartialMatch(
      "リピコーティングプラス", "リピプラス", "リピキャンペーンプラス", "リビキャンペーンプラス",
      ...(isFujioka ? ["藤岡大塚リピ洗車パスプラス"] : []),
    )),
    // M列: リピナイアガラ
    // 藤岡大塚: 藤岡大塚リピ洗車パスナイアガラ も含む
    valueOrEmpty(getItemValueByPartialMatch(
      "リピナイアガラ",
      ...(isFujioka ? ["藤岡大塚リピ洗車パスナイアガラ"] : []),
    )),
    // N列: リピセラミック / リピデラックス（デラックスもセラミックとして集計）
    // 藤岡大塚: 藤岡大塚リピ洗車パスデラックス も含む
    valueOrEmpty(getItemValueByPartialMatch(
      "リピセラミック", "リピデラックス",
      ...(isFujioka ? ["藤岡大塚リピ洗車パスデラックス"] : []),
    )),
    valueOrEmpty(getItemValueByPartialMatch("サブスクプレミアム")), // O列
    valueOrEmpty(getItemValueByPartialMatch("サブスクコーティングプラス", "サブスクプラス")), // P列
    valueOrEmpty(getItemValueByPartialMatch("サブスクナイアガラ")), // Q列
    // R列: サブスクセラミック / サブスクデラックス（デラックスもセラミックとして集計）
    valueOrEmpty(getItemValueByPartialMatch("サブスクセラミック", "サブスクデラックス")),
    // S列: コースアップ プレミアム→プラス
    valueOrEmpty(getItemValueByPartialMatch("プレミアム⇨プラス", "プレミアム→プラス")),
    // T列: コースアップ プレミアム→ナイアガラ
    valueOrEmpty(getItemValueByPartialMatch("プレミアム⇨ナイアガラ", "プレミアム→ナイアガラ")),
    // U列: コースアップ プレ�����アム→タートル
    // 藤岡大塚: 藤岡大塚洗車パスアップグレードデラックス も含む
    valueOrEmpty(getItemValueByPartialMatch(
      "プレミアム⇨タートル", "プレミアム→タートル",
      ...(isFujioka ? ["藤岡大塚洗車パスアップグレードデラックス"] : []),
    )),
    // V列: コースアップ プラス→ナイアガラ
    // 藤岡大塚: 藤岡洗車パスアップグレードナイアガラ も含む
    valueOrEmpty(getItemValueByPartialMatch(
      "プラス⇨ナイアガラ", "プラス→ナイアガラ",
      ...(isFujioka ? ["藤岡洗車パスアップグレードナイアガラ"] : []),
    )),
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

  try {
    const sheets = await getGoogleSheetsClient()

    // B列のデータ行数を取得して次の書き込み行を特定する（Read API 1回のみ）
    // append()はA1の「ID」ヘッダーを検知してA列から書き込むため使用不可
    // spreadsheets.get()（メタデータ取得）は除外してQuota超過を防ぐ
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!B:B`,
    })
    const nextRow = (getRes.data.values?.length ?? 1) + 1

    // B列から明示的にupdate（B列を書き込み開始点として固定）
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!B${nextRow}:AF${nextRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowData],
      },
    })

    return { success: true }
  } catch (error: any) {
    // Quota超過（429エラー）の場合は複数回リトライ（長い待機時間）
    if (error?.status === 429 || error?.code === 429) {
      const maxRetries = 4
      const waitTimes = [5000, 15000, 30000, 45000] // 5秒、15秒、30秒、45秒（最大95秒待機）
      let lastError = error
      
      console.log("[v0 API] Quota exceeded. Starting retry strategy with long wait times...")
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const waitTime = waitTimes[attempt - 1]
        console.log(`[v0 API] Quota exceeded, retry attempt ${attempt}/${maxRetries} - waiting ${waitTime}ms (${waitTime / 1000}秒)...`)
        
        await new Promise(resolve => setTimeout(resolve, waitTime))
        
        try {
          const sheets = await getGoogleSheetsClient()
          
          // 最後の行を取得してデータを追加
          const getRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!B:B`,
          })
          
          const nextRow = (getRes.data.values?.length ?? 0) + 1
          
          console.log(`[v0 API] Attempting to write to row ${nextRow}...`)
          
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!B${nextRow}:AF${nextRow}`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [rowData] },
          })
          
          console.log(`[v0 API] ✅ Retry successful on attempt ${attempt}! Data written to Google Sheets row ${nextRow}`)
          return { success: true }
        } catch (retryError: any) {
          lastError = retryError
          console.error(`[v0 API] Retry attempt ${attempt} failed - ${retryError?.status} ${retryError?.message}`)
          
          // 最後のリトライでもだめならスキップ
          if (attempt === maxRetries) {
            console.error(`[v0 API] ⚠️ All ${maxRetries} retries failed (total wait: ${waitTimes.reduce((a, b) => a + b) / 1000}秒)`)
            // DBには保存済みなのでここでエラーをthrowしないで継続
            break
          }
        }
      }
      
      // 複数回リトライしても失敗したら、DBには保存済みなのでエラーをログするだけで継続
      if (lastError) {
        console.warn("[v0 API] ⚠️ Google Sheets write failed after all retry attempts, but daily report is already saved to database")
        return { success: true, note: "Saved to DB, Google Sheets sync pending" }
      }
    }
    
    // 行数上限を超えた場合は1行追加してリトライ
    if (error?.status === 400 && error?.message?.includes("exceeds grid limits")) {
      const sheets = await getGoogleSheetsClient()

      // スプレッドシートのシートIDを取得して1行追加
      const meta = await sheets.spreadsheets.get({ spreadsheetId })
      const sheetMeta = meta.data.sheets?.find((s) => s.properties?.title === sheetName)
      const sheetId = sheetMeta?.properties?.sheetId ?? 0
      const currentMaxRow = sheetMeta?.properties?.gridProperties?.rowCount ?? 1

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{ appendDimension: { sheetId, dimension: "ROWS", length: 1 } }],
        },
      })

      // 1行追加後にリトライ
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!B${currentMaxRow + 1}:AF${currentMaxRow + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [rowData] },
      })

      return { success: true }
    }
    throw error
  }
}
