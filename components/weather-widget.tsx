"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, CloudFog, Droplets, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"

// 店舗の緯度経度をクライアント側に直接定義（サーバー経由不要）
const STORE_COORDINATES: Record<number, { name: string; latitude: number; longitude: number }> = {
  1:  { name: "SPLASH'N'GO!前橋50号店",      latitude: 36.3716000, longitude: 139.0804000 },
  2:  { name: "SPLASH'N'GO!伊勢崎韮塚店",    latitude: 36.3110000, longitude: 139.1956000 },
  3:  { name: "SPLASH'N'GO!高崎棟高店",      latitude: 36.3223000, longitude: 139.0125000 },
  4:  { name: "SPLASH'N'GO!足利緑町店",      latitude: 36.3410000, longitude: 139.4492000 },
  5:  { name: "SPLASH'N'GO!新前橋店",        latitude: 36.4090000, longitude: 139.0631000 },
  6:  { name: "SPLASH'N'GO!太田新田店",      latitude: 36.3079000, longitude: 139.3739000 },
  9:  { name: "スプラッシュンゴー鹿児島中山店", latitude: 31.5968000, longitude: 130.5571000 },
  10: { name: "スプラッシュンゴー藤岡大塚店",  latitude: 36.2485124, longitude: 139.0581352 },
}

const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "快晴", 1: "晴れ", 2: "晴れ時々曇り", 3: "曇り",
  45: "霧", 48: "霧氷",
  51: "霧雨", 53: "霧雨", 55: "強い霧雨",
  61: "小雨", 63: "雨", 65: "強い雨",
  71: "小雪", 73: "雪", 75: "大雪", 77: "みぞれ",
  80: "にわか雨", 81: "強いにわか雨", 82: "激しいにわか雨",
  85: "にわか雪", 86: "強いにわか雪",
  95: "雷雨", 96: "雹を伴う雷雨", 99: "強い雹を伴う雷雨",
}

interface WeatherDay {
  date: string
  dayOfWeek: string
  maxTemp: number
  minTemp: number
  weatherCode: number
  weather: string
  precipitationProbability: number
  windSpeed: number
}

interface HourlyWeather {
  time: number
  temp: number
  weatherCode: number
  weather: string
  precipitation: number
  windSpeed: number
}

interface WeatherData {
  storeName: string
  forecast: WeatherDay[]
  hourly: HourlyWeather[]
}

interface WeatherWidgetProps {
  storeId: number
  dark?: boolean
}

const DAY_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"]

export function WeatherWidget({ storeId, dark = false }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showHourlyModal, setShowHourlyModal] = useState(false)

  useEffect(() => {
    let cancelled = false
    let retryTimer: ReturnType<typeof setTimeout> | null = null

    const fetchWeather = async (attempt: number) => {
      try {
        setLoading(true)
        setError(null)

        const store = STORE_COORDINATES[storeId]
        if (!store) throw new Error("店舗情報が見つかりません")

        // ブラウザから直接Open-Meteo APIを叩く（サーバー経由なし）
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${store.latitude}&longitude=${store.longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m&timezone=Asia%2FTokyo&forecast_days=7`
        const response = await fetch(url)
        if (!response.ok) throw new Error("天気情報の取得に失敗しました")
        const data = await response.json()

        // dailyデータを整形
        const forecast: WeatherDay[] = data.daily.time.map((dateStr: string, i: number) => {
          const d = new Date(dateStr)
          return {
            date: dateStr,
            dayOfWeek: DAY_OF_WEEK[d.getDay()],
            maxTemp: Math.round(data.daily.temperature_2m_max[i]),
            minTemp: Math.round(data.daily.temperature_2m_min[i]),
            weatherCode: data.daily.weather_code[i],
            weather: WEATHER_CODE_LABELS[data.daily.weather_code[i]] ?? "不明",
            precipitationProbability: data.daily.precipitation_probability_max[i] ?? 0,
            windSpeed: Math.round(data.daily.wind_speed_10m_max[i]),
          }
        })

        // hourlyデータを今日の分のみ整形
        const todayStr = data.daily.time[0]
        const hourly: HourlyWeather[] = data.hourly.time
          .map((t: string, i: number) => ({ t, i }))
          .filter(({ t }: { t: string }) => t.startsWith(todayStr))
          .map(({ t, i }: { t: string; i: number }) => ({
            time: parseInt(t.slice(11, 13)),
            temp: Math.round(data.hourly.temperature_2m[i]),
            weatherCode: data.hourly.weather_code[i],
            weather: WEATHER_CODE_LABELS[data.hourly.weather_code[i]] ?? "不明",
            precipitation: data.hourly.precipitation_probability[i] ?? 0,
            windSpeed: Math.round(data.hourly.wind_speed_10m[i]),
          }))

        if (!cancelled) {
          setWeather({ storeName: store.name, forecast, hourly })
          setLoading(false)
        }
      } catch (err) {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : "エラーが発生しました"
        setError(msg)
        setLoading(false)
        if (attempt < 5) {
          const delay = Math.min(3000 * Math.pow(2, attempt), 48000)
          retryTimer = setTimeout(() => {
            if (!cancelled) fetchWeather(attempt + 1)
          }, delay)
        }
      }
    }

    fetchWeather(0)

    return () => {
      cancelled = true
      if (retryTimer) clearTimeout(retryTimer)
    }
  }, [storeId, retryCount])

  // 天気コードからアイコンを取得（一般的な天気予報の色）
  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="h-5 w-5 text-orange-500" /> // 晴れ：オレンジ
    if (code === 2 || code === 3) return <Cloud className="h-5 w-5 text-gray-500" /> // 曇り：グレー
    if (code === 45 || code === 48) return <CloudFog className="h-5 w-5 text-gray-400" /> // 霧：薄グレー
    if (code >= 51 && code <= 57) return <CloudDrizzle className="h-5 w-5 text-blue-500" /> // 小雨：青
    if (code >= 61 && code <= 67) return <CloudRain className="h-5 w-5 text-blue-600" /> // 雨：濃い青
    if (code >= 71 && code <= 77) return <CloudSnow className="h-5 w-5 text-cyan-400" /> // 雪：水色
    if (code >= 80 && code <= 82) return <CloudRain className="h-5 w-5 text-blue-600" /> // 強い雨：濃い青
    if (code >= 85 && code <= 86) return <CloudSnow className="h-5 w-5 text-cyan-400" /> // 雪：水色
    if (code >= 95 && code <= 99) return <CloudRain className="h-5 w-5 text-indigo-700" /> // 雷雨：濃い青紫
    return <Cloud className="h-5 w-5 text-gray-500" /> // デフォルト：グレー
  }

  if (loading) {
    return (
      <Card className={dark ? "bg-[#141822] border-white/10 text-white" : ""}>
        <CardHeader>
          <CardTitle className={dark ? "text-white" : ""}>週間天気予報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-center py-8 ${dark ? "text-gray-400" : "text-gray-500"}`}>読み込み中...</div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card className={dark ? "bg-[#141822] border-white/10 text-white" : ""}>
        <CardHeader>
          <CardTitle className={dark ? "text-white" : ""}>週間天気予報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="text-red-500 text-sm">{error || "データが取得できませんでした"}</div>
            <div className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>自動再試行中...</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRetryCount((c) => c + 1)}
              className="text-xs"
            >
              今すぐ再試行
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className={dark ? "bg-[#141822] border-white/10" : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"}>
        <CardHeader className="pb-3">
          <CardTitle className={dark ? "text-white" : "text-blue-900"}>週間天気予報</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-7 gap-1.5 md:gap-2">
            {weather.forecast.map((day, index) => (
              <div
                key={day.date}
                onClick={() => index === 0 && setShowHourlyModal(true)}
                className={`flex flex-col items-center p-1.5 md:p-2 rounded-lg transition-all ${
                  index === 0
                    ? dark
                      ? "bg-blue-600 text-white shadow-md cursor-pointer hover:bg-blue-700"
                      : "bg-blue-600 text-white shadow-md cursor-pointer hover:bg-blue-700"
                    : dark
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-white/70 hover:bg-white hover:shadow-sm"
                }`}
              >
                <div
                  className={`text-[10px] md:text-xs font-medium mb-1 ${
                    index === 0 ? "text-blue-100" : dark ? "text-gray-300" : "text-blue-900"
                  }`}
                >
                  {index === 0 ? "今日" : `${day.dayOfWeek}曜`}
                </div>
                <div className="mb-1">{getWeatherIcon(day.weatherCode)}</div>
                <div className="flex gap-1 items-center mb-1">
                  <div className={`text-[10px] md:text-xs font-semibold ${index === 0 ? "text-white" : "text-red-500"}`}>
                    {day.maxTemp}°
                  </div>
                  <div className={`text-[10px] md:text-xs ${index === 0 ? "text-blue-200" : dark ? "text-blue-400" : "text-blue-600"}`}>
                    {day.minTemp}°
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-0.5 md:gap-2 items-center text-[9px] md:text-[10px]">
                  <div className="flex items-center gap-0.5">
                    <Droplets className={`hidden md:block h-3 w-3 ${index === 0 ? "text-blue-200" : dark ? "text-blue-400" : "text-blue-500"}`} />
                    <span className={index === 0 ? "text-blue-100" : dark ? "text-gray-400" : "text-blue-700"}>
                      {day.precipitationProbability}%
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Wind className={`hidden md:block h-3 w-3 ${index === 0 ? "text-blue-200" : dark ? "text-blue-400" : "text-blue-500"}`} />
                    <span className={index === 0 ? "text-blue-100" : dark ? "text-gray-400" : "text-blue-700"}>
                      {day.windSpeed}m/s
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 1時間ごとの天気モーダル（横スクロール） */}
      <Dialog open={showHourlyModal} onOpenChange={setShowHourlyModal}>
        <DialogContent className={`max-w-4xl ${dark ? "bg-[#141822] border-white/10 text-white" : ""}`}>
          <DialogHeader>
            <DialogTitle className={dark ? "text-white" : "text-blue-900"}>今日の時間別天気予報</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto pb-2">
            {weather.hourly && weather.hourly.length > 0 ? (
              <div className="inline-flex flex-col min-w-full">
                {/* 時間行 */}
                <div className="flex">
                  <div className={`w-16 flex-shrink-0 p-2 text-sm font-medium border-b-2 ${dark ? "text-gray-300 border-white/20" : "text-blue-900 border-blue-200"}`}>時</div>
                  {weather.hourly.map((hour) => (
                    <div key={`time-${hour.time}`} className={`w-20 flex-shrink-0 p-2 text-center text-lg font-bold border-b-2 ${dark ? "text-white border-white/20" : "text-blue-900 border-blue-200"}`}>
                      {hour.time}
                    </div>
                  ))}
                </div>
                {/* 天気行 */}
                <div className="flex">
                  <div className={`w-16 flex-shrink-0 p-2 text-sm font-medium border-b ${dark ? "text-gray-300 border-white/10" : "text-blue-900 border-blue-100"}`}>天気</div>
                  {weather.hourly.map((hour) => (
                    <div key={`weather-${hour.time}`} className={`w-20 flex-shrink-0 p-2 flex items-center justify-center border-b ${dark ? "border-white/10" : "border-blue-100"}`}>
                      {getWeatherIcon(hour.weatherCode)}
                    </div>
                  ))}
                </div>
                {/* 降水確率行 */}
                <div className="flex">
                  <div className={`w-16 flex-shrink-0 p-2 text-sm font-medium border-b ${dark ? "text-gray-300 border-white/10" : "text-blue-900 border-blue-100"}`}>降水</div>
                  {weather.hourly.map((hour) => (
                    <div key={`precip-${hour.time}`} className={`w-20 flex-shrink-0 p-2 flex items-center justify-center gap-1 text-sm border-b ${dark ? "text-blue-400 border-white/10" : "text-blue-700 border-blue-100"}`}>
                      <Droplets className={`h-4 w-4 ${dark ? "text-blue-400" : "text-blue-500"}`} />
                      {hour.precipitation}%
                    </div>
                  ))}
                </div>
                {/* 気温行 */}
                <div className="flex">
                  <div className={`w-16 flex-shrink-0 p-2 text-sm font-medium border-b ${dark ? "text-gray-300 border-white/10" : "text-blue-900 border-blue-100"}`}>気温</div>
                  {weather.hourly.map((hour) => (
                    <div key={`temp-${hour.time}`} className={`w-20 flex-shrink-0 p-2 text-center text-sm font-semibold border-b ${dark ? "text-white border-white/10" : "text-blue-900 border-blue-100"}`}>
                      {hour.temp}°C
                    </div>
                  ))}
                </div>
                {/* 風速行 */}
                <div className="flex">
                  <div className={`w-16 flex-shrink-0 p-2 text-sm font-medium ${dark ? "text-gray-300" : "text-blue-900"}`}>風</div>
                  {weather.hourly.map((hour) => (
                    <div key={`wind-${hour.time}`} className={`w-20 flex-shrink-0 p-2 flex items-center justify-center gap-1 text-sm ${dark ? "text-blue-400" : "text-blue-700"}`}>
                      <Wind className={`h-4 w-4 ${dark ? "text-blue-400" : "text-blue-500"}`} />
                      {hour.windSpeed}m/s
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`p-4 text-center text-sm ${dark ? "text-gray-500" : "text-gray-500"}`}>
                時間別データを取得できませんでした
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
