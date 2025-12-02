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

    if (details.includes("新規")) {
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
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6 flex items-center justify-center">
          <div className="flex items-center gap-3 text-amber-700">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">読み込み中...</span>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!data) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6 flex items-center justify-center">
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
    },
    {
      name: "新前橋店",
      period: data.shinmaebashi.period,
      total: calculateTotal(data.shinmaebashi.posItems),
      subscCount: data.shinmaebashi.limitedCount,
      groups: groupItems(data.shinmaebashi.posItems),
      weeklySubsc: data.shinmaebashi.weeklySubsc || {},
      weeklyPos: data.shinmaebashi.weeklyPos || {},
    },
    {
      name: "太田新田店",
      period: data.otaShinta.period,
      total: calculateTotal(data.otaShinta.posItems),
      subscCount: data.otaShinta.subscNetTotal ?? calculateTotal(data.otaShinta.subscItems),
      groups: groupItems(data.otaShinta.posItems),
      weeklySubsc: data.otaShinta.weeklySubsc || {},
      weeklyPos: data.otaShinta.weeklyPos || {},
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

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">キャンペーン結果比較</h1>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-amber-200">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-gray-600">キャンペーン期間比較</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gradient-to-r from-amber-400 to-yellow-400 p-5">
                    <h2 className="text-xl font-bold text-white">{store.name}</h2>
                    <p className="text-white/80 text-sm mt-1">{store.period}</p>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-amber-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">合計台数</p>
                        <p className="text-2xl font-bold text-amber-600">{store.total.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">台</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">サブスク入会</p>
                        <p className="text-2xl font-bold text-green-600">{store.subscCount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">人</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-3">アイテム内訳</p>
                      <div className="space-y-2">
                        {store.groups.slice(0, 6).map((group, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-amber-400" />
                              <span className="text-sm text-gray-600">{group.name}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{group.count.toLocaleString()}台</span>
                          </div>
                        ))}
                        {store.groups.length > 6 && (
                          <p className="text-xs text-gray-400 text-center pt-2">他 {store.groups.length - 6} 件</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">週別サブスク入会数・合計台数推移</h2>
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-amber-200 rounded" />
                <span>棒グラフ: サブスク入会数</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-amber-600" />
                <span>折れ線: 合計台数</span>
              </div>
            </div>
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
                      const unit = name.includes("台数") ? "台" : "人"
                      const displayName = name.replace("_台数", "")
                      return [`${value.toLocaleString()}${unit}`, displayName]
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="circle"
                    formatter={(value: string) => value.replace("_台数", "")}
                  />
                  {/* 足利緑町店（棒グラフのみ） */}
                  <Bar yAxisId="left" dataKey="足利緑町店" fill="#fdba74" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  {/* 新前橋店（棒グラフ + 折れ線グラフ） */}
                  <Bar yAxisId="left" dataKey="新前橋店" fill="#86efac" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="新前橋店_台数"
                    stroke="#86efac"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "#86efac" }}
                    activeDot={{ r: 4 }}
                  />
                  {/* 太田新田店（棒グラフ + 折れ線グラフ） */}
                  <Bar yAxisId="left" dataKey="太田新田店" fill="#93c5fd" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="太田新田店_台数"
                    stroke="#93c5fd"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "#93c5fd" }}
                    activeDot={{ r: 4 }}
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
