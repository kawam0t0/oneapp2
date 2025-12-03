"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Calendar } from "lucide-react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface CampaignData {
  ashikaga: {
    storeName: string
    period: string
    posItems: { details: string; count: number }[]
    continueCount: number
    continuePeriod: string
    continueLabel: string
    weeklySubsc: { [week: number]: number }
    weeklyPos: { [week: number]: number }
  }
  shinmaebashi: {
    storeName: string
    period: string
    posItems: { details: string; count: number }[]
    limitedCount: number
    limitedLabel: string
    weeklySubsc: { [week: number]: number }
    weeklyPos: { [week: number]: number }
  }
  otaShinta: {
    storeName: string
    period: string
    posItems: { details: string; count: number }[]
    subscItems: { details: string; count: number }[]
    subscLabel: string
    subscNetTotal?: number
    weeklySubsc: { [week: number]: number }
    weeklyPos: { [week: number]: number }
  }
}

const groupItems = (items: { details: string; count: number }[]) => {
  const groups: { [key: string]: number } = {}

  items.forEach((item) => {
    const details = item.details

    // ノーカウント条件
    if (details.includes("キャッシュバック")) return
    if (details === "【期間限定】月額139円コーティングプラス (通常)") return
    if (details === "【期間限定】月額139円プレミアムスタンダード (通常)") return
    if (details === "新前橋無料券 (通常)") return
    if (details.includes("任意の金額")) return

    let groupName: string

    if (details.includes("インスタ")) {
      groupName = "インスタ"
    } else if (details.includes("新規")) {
      groupName = "新規"
    } else if (details.includes("リピ")) {
      groupName = "リピート"
    } else if (details.includes("社員")) {
      groupName = "社員"
    } else if (details.includes("サブスク")) {
      groupName = "サブスク"
    } else if (details.includes("ポイント")) {
      groupName = "ポイント"
    } else if (details.includes("チラシ")) {
      groupName = "チラシ"
    } else if (details.includes("⇒") || details.includes("→")) {
      groupName = "コースアップ"
    } else if (details.includes("キャンペーン")) {
      groupName = "キャンペーン"
    } else if (details.includes("プラン")) {
      groupName = "その他"
    } else if (details.includes("新前橋無料券") || details.includes("太田新田無料券")) {
      groupName = "その他"
    } else {
      groupName = details
    }

    if (groups[groupName]) {
      groups[groupName] += item.count
    } else {
      groups[groupName] = item.count
    }
  })

  return Object.entries(groups)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))
}

export default function CampaignPage() {
  const [data, setData] = useState<CampaignData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())

  const campaignInfo = {
    足利緑町店: {
      days: 35,
      promotions: ["無料開放", "39_2ヶ月間", "PRタイムズ", "チラシ（2.5万部）"],
    },
    新前橋店: {
      days: 43,
      promotions: [
        "39_1ヶ月間",
        "PRタイムズ",
        "チラシ（5万部）",
        "モテコ",
        "インスタけーちゃん",
        "インスタよここ",
        "インスタにわつる",
      ],
    },
    太田新田店: {
      days: 52,
      promotions: [
        "初回100円",
        "39_1ヶ月間",
        "PRタイムズ",
        "チラシ（1.35万部）※ジョイフォン",
        "インスタけーちゃん",
        "インスタ歩き方",
      ],
    },
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/campaign")
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (error) {
        console.error("Failed to fetch campaign data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-6 flex items-center justify-center">
          <div className="flex items-center gap-3 text-blue-700">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">読み込み中...</span>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!data) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-6 flex items-center justify-center">
          <div className="text-red-500 font-medium">データの取得に失敗しました</div>
        </div>
      </AppLayout>
    )
  }

  const calculateTotal = (items: { count: number }[]) => {
    return items.reduce((sum, item) => sum + item.count, 0)
  }

  const stores = [
    {
      name: "足利緑町店",
      period: data.ashikaga.period,
      total: 11900,
      subscCount: data.ashikaga.continueCount,
      subscPeriod: data.ashikaga.continuePeriod,
      groups: groupItems(data.ashikaga.posItems),
      weeklySubsc: data.ashikaga.weeklySubsc || {},
      weeklyPos: data.ashikaga.weeklyPos || {},
      campaignDays: campaignInfo.足利緑町店.days,
      promotions: campaignInfo.足利緑町店.promotions,
    },
    {
      name: "新前橋店",
      period: data.shinmaebashi.period,
      total: calculateTotal(data.shinmaebashi.posItems),
      subscCount: data.shinmaebashi.limitedCount,
      groups: groupItems(data.shinmaebashi.posItems),
      weeklySubsc: data.shinmaebashi.weeklySubsc || {},
      weeklyPos: data.shinmaebashi.weeklyPos || {},
      campaignDays: campaignInfo.新前橋店.days,
      promotions: campaignInfo.新前橋店.promotions,
    },
    {
      name: "太田新田店",
      period: data.otaShinta.period,
      total: calculateTotal(data.otaShinta.posItems),
      subscCount: data.otaShinta.subscNetTotal ?? calculateTotal(data.otaShinta.subscItems),
      groups: groupItems(data.otaShinta.posItems),
      weeklySubsc: data.otaShinta.weeklySubsc || {},
      weeklyPos: data.otaShinta.weeklyPos || {},
      campaignDays: campaignInfo.太田新田店.days,
      promotions: campaignInfo.太田新田店.promotions,
    },
  ]

  const maxWeeksSubsc = Math.max(...stores.map((store) => Math.max(...Object.keys(store.weeklySubsc).map(Number), 0)))
  const maxWeeksPos = Math.max(...stores.map((store) => Math.max(...Object.keys(store.weeklyPos).map(Number), 0)))
  const maxWeeks = Math.max(maxWeeksSubsc, maxWeeksPos)

  const weeklyChartData = []
  for (let week = 1; week <= maxWeeks; week++) {
    const weekLabel =
      ["第一週", "第二週", "第三週", "第四週", "第五週", "第六週", "第七週", "第八週", "第九週", "第十週"][week - 1] ||
      `第${week}週`
    weeklyChartData.push({
      week: weekLabel,
      足利緑町店: stores[0].weeklySubsc[week] || 0,
      新前橋店: stores[1].weeklySubsc[week] || 0,
      太田新田店: stores[2].weeklySubsc[week] || 0,
      足利緑町店_台数: stores[0].weeklyPos[week] || 0,
      新前橋店_台数: stores[1].weeklyPos[week] || 0,
      太田新田店_台数: stores[2].weeklyPos[week] || 0,
    })
  }

  const grandTotal = stores.reduce((sum, store) => sum + store.total, 0)
  const totalSubsc = stores.reduce((sum, store) => sum + store.subscCount, 0)

  const handleLegendClick = (dataKey: string) => {
    setHiddenSeries((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey)
      } else {
        newSet.add(dataKey)
      }
      return newSet
    })
  }

  const renderLegend = (props: any) => {
    const { payload } = props
    return (
      <div className="flex flex-wrap justify-center gap-4 pt-5">
        {payload.map((entry: any, index: number) => {
          const isHidden = hiddenSeries.has(entry.dataKey)
          const displayName = entry.value.replace("_台数", "")
          return (
            <button
              key={`legend-${index}`}
              onClick={() => handleLegendClick(entry.dataKey)}
              className={`flex items-center gap-2 px-2 py-1 rounded transition-opacity ${
                isHidden ? "opacity-40" : "opacity-100"
              } hover:bg-gray-100`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className={`text-sm ${isHidden ? "line-through text-gray-400" : "text-gray-700"}`}>
                {displayName}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">キャンペーン結果比較</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-blue-200">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">キャンペーン期間比較</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5">
                    <h2 className="text-xl font-bold text-white">{store.name}</h2>
                    <p className="text-white/80 text-sm mt-1">{store.period}</p>
                    <p className="text-white/90 text-sm mt-1 font-medium">キャンペーン日数：{store.campaignDays}日間</p>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">プロモーション</p>
                      <div className="flex flex-wrap gap-1.5">
                        {store.promotions.map((promo, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                          >
                            {promo}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">合計台数</p>
                        <p className="text-2xl font-bold text-blue-600">{store.total.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">台</p>
                        <p className="text-xs text-gray-500 mt-1">
                          平均{" "}
                          <span className="font-medium text-blue-600">
                            {(store.total / store.campaignDays).toFixed(1)}
                          </span>{" "}
                          台/日
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">サブスク入会</p>
                        <p className="text-2xl font-bold text-green-600">{store.subscCount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">人</p>
                        <p className="text-xs text-gray-500 mt-1">
                          平均{" "}
                          <span className="font-medium text-green-600">
                            {(store.subscCount / store.campaignDays).toFixed(1)}
                          </span>{" "}
                          人/日
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-3">アイテム内訳</p>
                      <div className="space-y-2">
                        {store.groups.map((group, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-400" />
                              <span className="text-sm text-gray-600">{group.name}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{group.count.toLocaleString()}台</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">週別サブスク入会数・合計台数推移</h2>
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-blue-200 rounded" />
                <span>棒グラフ: サブスク入会数</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-blue-600" />
                <span>折れ線: 合計台数</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4">※ 凡例をクリックすると表示/非表示を切り替えられます</p>
            <div className="h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weeklyChartData} margin={{ top: 20, right: 60, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#666" }} axisLine={{ stroke: "#e5e7eb" }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: "#666" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickFormatter={(value) => `${value}人`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: "#666" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickFormatter={(value) => `${value}台`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number, name: string) => {
                      if (hiddenSeries.has(name)) return [null, null]
                      const unit = name.includes("台数") ? "台" : "人"
                      const displayName = name.replace("_台数", "")
                      return [`${value.toLocaleString()}${unit}`, displayName]
                    }}
                  />
                  <Legend content={renderLegend} />
                  {/* 足利緑町店（棒グラフのみ） */}
                  <Bar
                    yAxisId="left"
                    dataKey="足利緑町店"
                    fill="#93c5fd"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                    hide={hiddenSeries.has("足利緑町店")}
                  />
                  {/* 新前橋店（棒グラフ + 折れ線グラフ） */}
                  <Bar
                    yAxisId="left"
                    dataKey="新前橋店"
                    fill="#6ee7b7"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                    hide={hiddenSeries.has("新前橋店")}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="新前橋店_台数"
                    stroke="#6ee7b7"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "#6ee7b7" }}
                    activeDot={{ r: 4 }}
                    hide={hiddenSeries.has("新前橋店_台数")}
                  />
                  {/* 太田新田店（棒グラフ + 折れ線グラフ） */}
                  <Bar
                    yAxisId="left"
                    dataKey="太田新田店"
                    fill="#c4b5fd"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                    hide={hiddenSeries.has("太田新田店")}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="太田新田店_台数"
                    stroke="#c4b5fd"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "#c4b5fd" }}
                    activeDot={{ r: 4 }}
                    hide={hiddenSeries.has("太田新田店_台数")}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
