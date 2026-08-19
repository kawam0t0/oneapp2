import { NextResponse } from "next/server"

// 店舗の緯度経度をコードに直接定義（DBアクセス不要）
// 新店舗追加時はここに追記してください
const STORE_COORDINATES: Record<string, { name: string; latitude: number; longitude: number }> = {
  "1": { name: "SPLASH'N'GO!前橋50号店",    latitude: 36.3716000, longitude: 139.0804000 },
  "2": { name: "SPLASH'N'GO!伊勢崎韮塚店",  latitude: 36.3110000, longitude: 139.1956000 },
  "3": { name: "SPLASH'N'GO!高崎棟高店",    latitude: 36.3223000, longitude: 139.0125000 },
  "4": { name: "SPLASH'N'GO!足利緑町店",    latitude: 36.3410000, longitude: 139.4492000 },
  "5": { name: "SPLASH'N'GO!新前橋店",      latitude: 36.4090000, longitude: 139.0631000 },
  "6": { name: "SPLASH'N'GO!太田新田店",    latitude: 36.3079000, longitude: 139.3739000 },
  "9": { name: "スプラッシュンゴー鹿児島中山店", latitude: 31.5968000, longitude: 130.5571000 },
  "10": { name: "スプラッシュンゴー藤岡大塚店", latitude: 36.2485124, longitude: 139.0581352 },
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("store_id")

    if (!storeId) {
      return NextResponse.json({ error: "store_id is required" }, { status: 400 })
    }

    const store = STORE_COORDINATES[storeId]
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Open-Meteo APIから天気予報を取得
    // weathercode と weather_code 両方のパラメータ名に対応（API仕様変更対策）
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${store.latitude}&longitude=${store.longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m&timezone=Asia/Tokyo&forecast_days=7`
    const weatherResponse = await fetch(weatherUrl, { cache: "no-store" })
    if (!weatherResponse.ok) {
      const errText = await weatherResponse.text()
      console.error("[weather API] Open-Meteo error:", weatherResponse.status, errText)
      return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
    }

    const weatherData = await weatherResponse.json()

    // weather_code / weathercode 両対応
    const daily = weatherData.daily
    const hourly = weatherData.hourly
    const dailyWeatherCode = daily.weather_code ?? daily.weathercode ?? []
    const hourlyWeatherCode = hourly.weather_code ?? hourly.weathercode ?? []
    const hourlyWindSpeed = hourly.wind_speed_10m ?? hourly.windspeed_10m ?? []
    const dailyWindSpeed = daily.wind_speed_10m_max ?? daily.windspeed_10m_max ?? []

    // 天気コードを日本語に変換
    const getWeatherDescription = (code: number): string => {
      const weatherCodes: Record<number, string> = {
        0: "快晴",
        1: "晴れ",
        2: "一部曇り",
        3: "曇り",
        45: "霧",
        48: "霧",
        51: "小雨",
        53: "雨",
        55: "強雨",
        61: "小雨",
        63: "雨",
        65: "強雨",
        71: "小雪",
        73: "雪",
        75: "大雪",
        77: "みぞれ",
        80: "にわか雨",
        81: "にわか雨",
        82: "強いにわか雨",
        85: "にわか雪",
        86: "にわか雪",
        95: "雷雨",
        96: "雷雨",
        99: "雷雨",
      }
      return weatherCodes[code] || "不明"
    }

    // 曜日を取得
    const getDayOfWeek = (dateString: string): string => {
      const days = ["日", "月", "火", "水", "木", "金", "土"]
      const date = new Date(dateString)
      return days[date.getDay()]
    }

    // レスポンスデータを整形
    const forecast = daily.time.map((date: string, index: number) => ({
      date,
      dayOfWeek: getDayOfWeek(date),
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index]),
      weatherCode: dailyWeatherCode[index] ?? 0,
      weather: getWeatherDescription(dailyWeatherCode[index] ?? 0),
      precipitationProbability: daily.precipitation_probability_max[index] || 0,
      windSpeed: Math.round(dailyWindSpeed[index] || 0),
    }))

    // 今日の1時間ごとのデータを取得
    // Open-MeteoはJSTのローカル時刻文字列（例: "2026-03-21T09:00"）を返すので
    // 先頭10文字（YYYY-MM-DD）で日付比較する
    const nowJST = new Date(Date.now() + 9 * 60 * 60 * 1000)
    const todayDateStr = nowJST.toISOString().split("T")[0]

    const hourlyData = hourly.time
      .map((time: string, index: number) => {
        // "2026-03-21T09:00" の先頭10文字を取得
        const dateStr = time.substring(0, 10)
        const hour = parseInt(time.substring(11, 13), 10)
        if (dateStr === todayDateStr) {
          return {
            time: hour,
            temp: Math.round(hourly.temperature_2m[index]),
            weatherCode: hourlyWeatherCode[index] ?? 0,
            weather: getWeatherDescription(hourlyWeatherCode[index] ?? 0),
            precipitation: hourly.precipitation_probability[index] || 0,
            windSpeed: Math.round(hourlyWindSpeed[index] || 0),
          }
        }
        return null
      })
      .filter((item: any) => item !== null)

    return NextResponse.json({
      storeName: store.name,
      forecast,
      hourly: hourlyData,
    })
  } catch (error) {
    console.error("[weather API] Internal server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
