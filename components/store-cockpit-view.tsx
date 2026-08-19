"use client"

import { useState, useEffect } from "react"
import { WeatherWidget } from "@/components/weather-widget"
import { useAuth } from "@/components/auth-provider"


interface StoreData {
  store: string
  total: number
  items?: Record<string, number>
}

// 全店舗の固定リスト（月間・本日データが0でも必ず表示）
const ALL_STORES = [
  "SPLASH'N'GO!前橋50号店",
  "SPLASH'N'GO!伊勢崎韮塚店",
  "SPLASH'N'GO!高崎棟高店",
  "SPLASH'N'GO!足利緑町店",
  "SPLASH'N'GO!新前橋店",
  "SPLASH'N'GO!太田新田店",
  "スプラッシュンゴー鹿児島中山店",
  "スプラッシュンゴー藤岡大塚店",
]

// MediaMTX直接接続マッピング（camera.splashbrothers.co.jp経由）
const CAMERA_MAP: Record<string, string> = {
  "SPLASH'N'GO!前橋50号店":    "https://camera.splashbrothers.co.jp/store1/",
  "SPLASH'N'GO!伊勢崎韮塚店":  "https://camera.splashbrothers.co.jp/store2/",
  "SPLASH'N'GO!高崎棟高店":    "https://camera.splashbrothers.co.jp/store3/",
  "SPLASH'N'GO!足利緑町店":    "https://camera.splashbrothers.co.jp/store4/",
  "SPLASH'N'GO!新前橋店":      "https://camera.splashbrothers.co.jp/store5/",
  "SPLASH'N'GO!太田新田店":    "https://camera.splashbrothers.co.jp/store6/",
  "スプラッシュンゴー鹿児島中山店": "https://camera.splashbrothers.co.jp/store7/",
  "スプラッシュンゴー藤岡大塚店":   "https://camera.splashbrothers.co.jp/store8/",
}

// 既知店舗のFEEDコードマッピング
const FEED_CODE_MAP: Record<string, string> = {
  "SPLASH'N'GO!前橋50号店": "FEED-MSG",
  "SPLASH'N'GO!新前橋店": "FEED-SNM",
  "SPLASH'N'GO!高崎棟高店": "FEED-TKT",
  "SPLASH'N'GO!伊勢崎韮塚店": "FEED-ISZ",
  "SPLASH'N'GO!太田新田店": "FEED-OTA",
  "SPLASH'N'GO!足利緑町店": "FEED-AWK",
}

// ブランド名プレフィックスを除去して店舗名のみを返す
function makeShortName(storeName: string): string {
  return storeName
    .replace(/^SPLASH'N'GO!/, "")
    .replace(/^スプラッシュンゴー[　\s]*/, "")
    .replace(/^スプラッシュ'ン'ゴー[　\s]*/, "")
    .trim()
}

function makeFeedCode(storeName: string): string {
  if (FEED_CODE_MAP[storeName]) return FEED_CODE_MAP[storeName]
  // ブランド名を除去してからコードを生成
  const short = makeShortName(storeName)
  const code = short
    .replace(/[^\u30A0-\u30FFa-zA-Z0-9]/g, "")
    .slice(0, 4)
    .toUpperCase()
  return `FEED-${code || "STR"}`
}

function WeatherBadge({ temp }: { temp: number | null }) {
  if (temp === null) return <div className="h-6" />
  return (
    <div className="flex items-center gap-1">
      <span className="text-yellow-400 text-base">☀</span>
      <span className="text-gray-900 font-semibold text-sm">{temp}°C</span>
    </div>
  )
}

export default function StoreCockpitView() {
  const { session } = useAuth()
  const [monthlyData, setMonthlyData] = useState<StoreData[]>([])
  const [todayData, setTodayData] = useState<StoreData[]>([])
  const [storeTemps, setStoreTemps] = useState<Record<string, number | null>>({})
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchDashboardData()
    fetchAllStoreTemps()
    const interval = setInterval(() => {
      fetchDashboardData()
      fetchAllStoreTemps()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // 39キャンペーン終了のため会員数取得を停止
  // 復活時は以下のコードのコメントを外す
  /*
  useEffect(() => {
    const fetchMemberCounts = async () => {
      try {
        const res = await fetch("/api/member-count")
        if (res.ok) {
          const data = await res.json()
          setMemberCounts(data)
        }
      } catch {}
    }
    fetchMemberCounts()
    const interval = setInterval(fetchMemberCounts, 5000)
    return () => clearInterval(interval)
  }, [])
  */

  const fetchAllStoreTemps = async () => {
    try {
      const res = await fetch("/api/weather/all-stores")
      const data = await res.json()
      setStoreTemps(data)
    } catch {}
  }

  // adminと同じロジック: monthly から店舗リストを生成し、today で本日台数を取得
  const fetchDashboardData = async () => {
    try {
      const now = new Date()
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
      const res = await fetch(`/api/dashboard?period=${period}`)
      const result = await res.json()
      if (result.error || !result.monthly || !result.today) return
      const filtered = (data: StoreData[]) =>
        data.filter((s) => s.store && s.store !== "0" && s.store.trim() !== "")
      setMonthlyData(filtered(result.monthly))
      setTodayData(filtered(result.today))
    } catch {}
  }

  // adminと同じ: monthly にある店舗ループで today の合計を引く
  const getTodayTotal = (storeName: string): number | string => {
    const normalizedName = makeShortName(storeName)
    const found = todayData.find((s) => makeShortName(s.store) === normalizedName)
    return found?.total ?? 0
  }

  // 月間の合計を取得
  const getMonthlyTotal = (storeName: string): number | string => {
    const normalizedName = makeShortName(storeName)
    const found = monthlyData.find((s) => makeShortName(s.store) === normalizedName)
    return found?.total ?? 0
  }

  // 数字にカンマフォーマットを適用
  const formatNumber = (value: number | string): string => {
    if (typeof value === "string") return value
    return value.toLocaleString("ja-JP")
  }

  // 藤岡大塚店を常に先頭固定（OPEN記念）、次にログイン店舗、残りはALL_STORESの順序
  const PINNED_STORE = "スプラッシュンゴー藤岡大塚店"
  const sortedStores = ALL_STORES.map((name) => ({ store: name })).sort((a, b) => {
    const aIsPinned = a.store === PINNED_STORE
    const bIsPinned = b.store === PINNED_STORE
    if (aIsPinned && !bIsPinned) return -1
    if (!aIsPinned && bIsPinned) return 1
    const myStore = session?.store_name ?? ""
    if (!myStore) return 0
    const aMatch =
      a.store === myStore ||
      makeShortName(a.store) === makeShortName(myStore)
    const bMatch =
      b.store === myStore ||
      makeShortName(b.store) === makeShortName(myStore)
    if (aMatch && !bMatch) return -1
    if (!aMatch && bMatch) return 1
    return 0
  })

  // 全店舗合計
  const totalDaily = todayData.reduce((sum, s) => sum + (s.total ?? 0), 0)
  const totalMonthly = monthlyData.reduce((sum, s) => sum + (s.total ?? 0), 0)

  return (
    <div className="min-h-screen bg-sky-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-10 md:px-8">
        {/* ヘッダー */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-sky-600 text-xs font-semibold tracking-widest uppercase mb-2">
              Real-Time Operation Display
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-gray-900">
              SPLASH <span className="text-sky-500">COCKPIT</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-md leading-relaxed">
              今現状はリアルタイム配信を中止しておりますが、ゆくゆくは配信予定です！
            </p>
          </div>
          {/* 全店舗合計サマリー */}
          <div className="flex items-stretch gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-200 shrink-0">
            <div className="flex flex-col items-center justify-center px-6 py-4 bg-white gap-1 min-w-[100px]">
              <p className="text-gray-400 text-[9px] font-semibold tracking-widest uppercase">Daily Total</p>
              <p className="text-sky-500 text-3xl font-black tabular-nums leading-none">{formatNumber(totalDaily)}</p>
              <p className="text-gray-400 text-[10px]">台</p>
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-4 bg-white gap-1 min-w-[100px]">
              <p className="text-gray-400 text-[9px] font-semibold tracking-widest uppercase">Monthly</p>
              <p className="text-gray-700 text-3xl font-black tabular-nums leading-none">{formatNumber(totalMonthly)}</p>
              <p className="text-gray-400 text-[10px]">台</p>
            </div>
          </div>
        </div>

        {/* 週間天気予報 */}
        {session?.store_id && (
          <div className="mb-8">
            <WeatherWidget storeId={session.store_id} dark={false} />
          </div>
        )}

        {/* 店舗カードグリッド - ログイン店舗を先頭、以降は元の順序 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedStores.map((storeEntry) => {
            const storeName = storeEntry.store
            const shortName = makeShortName(storeName)
            const feedCode = makeFeedCode(storeName)
            const cameraSrc = CAMERA_MAP[storeName] ?? null
            return (
              <div
                key={storeName}
                className="rounded-2xl overflow-hidden border border-sky-200 bg-white shadow-md flex flex-col"
              >
                {/* カードヘッダー */}
                <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    LIVE
                  </span>
                  <span className="text-gray-400 text-xs font-mono tracking-widest">
                    {feedCode}
                  </span>
                </div>

                {/* 動画エリア: camera.splashbrothers.co.jp への直接iframe */}
                <div className="aspect-video w-full bg-gray-900 relative overflow-hidden">
                  {cameraSrc ? (
                    <iframe
                      src={cameraSrc}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      配信準備中
                    </div>
                  )}
                </div>

                  {/* 店舗��報フッター */}
                <div className="px-4 py-4 flex flex-col gap-3 flex-1">
                  {/* 上段: Store Location（左）/ 39CAMPAIN + DAILY TOTAL（右・同一ベースラインで横並び） */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="shrink-0">
                      <p className="text-sky-600 text-[10px] font-semibold tracking-widest uppercase mb-0.5">
                        Store Location
                      </p>
                      <p className="text-gray-900 text-xl font-bold">{shortName}</p>
                    </div>
                    <div className="flex items-baseline gap-3">
                      {/* 39キャンペーン: 一旦表示を中止。復活時はこのブロックを復活させる */}
                      {/* {(() => {
                        const cardShortName = makeShortName(storeName)
                        const count = memberCounts[cardShortName + "店"] ?? memberCounts[cardShortName] ?? null
                        return (
                          <div className="text-right">
                            <p className="text-yellow-600 text-[9px] font-semibold tracking-widest uppercase mb-0.5">39 Campaign</p>
                            <p className="text-yellow-500 text-3xl font-black tabular-nums">
                              {count != null ? count.toLocaleString() : "-"}
                              <span className="text-yellow-400 text-[11px] font-medium ml-0.5">人</span>
                            </p>
                          </div>
                        )
                      })()} */}
                      <div className="text-right">
                        <p className="text-gray-400 text-[10px] font-semibold tracking-widest uppercase mb-0.5">Daily Total</p>
                        <p className="text-sky-600 text-3xl font-black tabular-nums">{getTodayTotal(storeName)}</p>
                      </div>
                    </div>
                  </div>
                  {/* 下段: Monthly / Yearly */}
                  <div className="flex gap-4 justify-end">
                    <div className="text-center">
                      <p className="text-gray-400 font-semibold text-[11px] uppercase">Monthly</p>
                      <p className="text-gray-600 font-bold text-lg">{formatNumber(getMonthlyTotal(storeName))}</p>
                    </div>
                  </div>

                  {/* 気温: monthly側のstore名 → 正規化名の順でlookup */}
                  <WeatherBadge
                    temp={
                      storeTemps[storeName] ??
                      storeTemps[shortName] ??
                      null
                    }
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
