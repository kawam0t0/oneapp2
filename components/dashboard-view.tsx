"use client"

import type React from "react"
import { MiniCalendar } from "@/components/mini-calendar"
import { useAuth } from "@/components/auth-provider" // useAuthを追加
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts"

interface StoreData {
  store: string
  items: { [key: string]: number }
  total: number
}

interface DailyData {
  date: string
  count: number
}

interface InvoiceMonthlyData {
  month: string
  [store: string]: number | string
}

interface StoreCategoryData {
  store: string
  categories: {
    name: string
    value: number
    percentage: string
  }[]
  total: number
}

interface StoreSalesData {
  store: string
  monthlyOnetime: number
  todayOnetime: number
  monthlySubsc: number
  todaySubsc: number
}

interface MemberChangeData {
  store: string
  currentCount: number
  prevCount: number
  change: number
}

interface ApiResponse {
  monthly: StoreData[]
  today: StoreData[]
  yesterday?: StoreData[] // 前日データを追加
  daily?: DailyData[]
  invoiceMonthly?: InvoiceMonthlyData[]
  storeCategories?: StoreCategoryData[]
  storeSales?: StoreSalesData[]
  memberChanges?: MemberChangeData[]
  error?: string
}

const STORE_ORDER = [
  "SPLASH'N'GO!前橋50号店",
  "SPLASH'N'GO!伊勢崎韮塚店",
  "SPLASH'N'GO!高崎棟高店",
  "SPLASH'N'GO!足利緑町店",
  "SPLASH'N'GO!新前橋店",
  "SPLASH'N'GO!太田新田店",
]

const STORE_SHORT_NAMES: { [key: string]: string } = {
  "SPLASH'N'GO!前橋50号店": "前橋50号",
  "SPLASH'N'GO!伊勢崎韮塚店": "伊勢崎韮塚",
  "SPLASH'N'GO!高崎棟高店": "高崎棟高",
  "SPLASH'N'GO!足利緑町店": "足利緑町",
  "SPLASH'N'GO!新前橋店": "新前橋",
  "SPLASH'N'GO!太田新田店": "太田新田",
}

const STORE_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

const STORE_COLOR_MAP: { [key: string]: string } = {
  "SPLASH'N'GO!前橋50号店": "#3b82f6", // 青
  "SPLASH'N'GO!伊勢崎韮塚店": "#22c55e", // 緑
  "SPLASH'N'GO!高崎棟高店": "#f59e0b", // オレンジ
  "SPLASH'N'GO!足利緑町店": "#ef4444", // 赤
  "SPLASH'N'GO!新前橋店": "#8b5cf6", // 紫
  "SPLASH'N'GO!太田新田店": "#06b6d4", // シアン
}

const CATEGORY_COLORS: { [key: string]: string } = {
  サブスク: "#3b82f6",
  リピート: "#22c55e",
  新規: "#22c55e",
  コースアップ: "#0ea5e9",
  ポイント: "#8b5cf6",
  キャンペーン: "#ec4899",
  無料券: "#6b7280",
  セラミック: "#f59e0b",
  セラミック祭り: "#f59e0b",
  その他: "#9ca3af",
}

const COURSE_COLORS: { [key: string]: string } = {
  プレミアム: "#6366f1", // インディゴ
  プラス: "#10b981", // 緑
  ナイアガラ: "#06b6d4", // シアン
  セラミック: "#f59e0b", // オレンジ
  タートル: "#8b5cf6", // 紫
  スタンダード: "#ec4899", // ピンク
  ベーシック: "#14b8a6", // ティール
  その他: "#9ca3af", // グレー
}

const handleLegendClick = (dataKey: string, setHiddenStores: React.Dispatch<React.SetStateAction<Set<string>>>) => {
  setHiddenStores((prev) => {
    const newSet = new Set(prev)
    if (newSet.has(dataKey)) {
      newSet.delete(dataKey)
    } else {
      newSet.add(dataKey)
    }
    return newSet
  })
}

export default function DashboardView() {
  const { session } = useAuth() // セッション情報を取得

  const isAdmin = session?.store_id === 0 || session?.store_name === "admin"

  const getCurrentMonth = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  }

  const getPreviousMonth = () => {
    const now = new Date()
    now.setMonth(now.getMonth() - 1)
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  }

  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentMonth())
  const [monthlyData, setMonthlyData] = useState<StoreData[]>([])
  const [todayData, setTodayData] = useState<StoreData[]>([])
  const [yesterdayData, setYesterdayData] = useState<StoreData[]>([]) // 前日データのstate追加
  const [dailyData, setDailyData] = useState<DailyData[]>([])
  const [invoiceMonthlyData, setInvoiceMonthlyData] = useState<InvoiceMonthlyData[]>([])
  const [storeCategories, setStoreCategories] = useState<StoreCategoryData[]>([])
  const [storeSales, setStoreSales] = useState<StoreSalesData[]>([])
  const [memberChanges, setMemberChanges] = useState<MemberChangeData[]>([]) // 会員数増減のstate追加
  const [initialLoading, setInitialLoading] = useState(true) // 初回ロードとリフレッシュを区別するための状態を追加
  const [loading, setLoading] = useState(false)
  const categoryPeriod = getPreviousMonth()
  const [hiddenStores, setHiddenStores] = useState(new Set<string>()) // hiddenStoresのstate追加

  const generatePeriods = () => {
    const periods = []
    for (let year = 2025; year <= 2030; year++) {
      for (let month = 1; month <= 12; month++) {
        periods.push(`${year}-${String(month).padStart(2, "0")}`)
      }
    }
    return periods
  }

  const periods = generatePeriods()

  useEffect(() => {
    fetchData()

    const interval = setInterval(() => {
      fetchData()
    }, 30000) // 30秒 = 30000ミリ秒

    // クリーンアップ: コンポーネントがアンマウントされたら停止
    return () => clearInterval(interval)
  }, [selectedPeriod])

  useEffect(() => {
    fetchCategoryData()

    const interval = setInterval(() => {
      fetchCategoryData()
    }, 30000)

    return () => clearInterval(interval)
  }, [categoryPeriod])

  const fetchData = async () => {
    if (initialLoading) {
      setLoading(true)
    }
    try {
      const response = await fetch(`/api/dashboard?period=${selectedPeriod}`)
      const result: ApiResponse = await response.json()

      if (result.error || !result.monthly || !result.today) {
        setMonthlyData([])
        setTodayData([])
        setYesterdayData([])
        setDailyData([])
        setInvoiceMonthlyData([])
        setStoreSales([])
        setMemberChanges([])
        return
      }

      const filteredMonthly = result.monthly.filter(
        (store: StoreData) => store.store && store.store !== "0" && store.store.trim() !== "",
      )
      const filteredToday = result.today.filter(
        (store: StoreData) => store.store && store.store !== "0" && store.store.trim() !== "",
      )
      const filteredYesterday = (result.yesterday || []).filter(
        (store: StoreData) => store.store && store.store !== "0" && store.store.trim() !== "",
      )

      const sortByOrder = (data: StoreData[]) => {
        return [...data].sort((a, b) => {
          const indexA = STORE_ORDER.indexOf(a.store)
          const indexB = STORE_ORDER.indexOf(b.store)
          if (indexA === -1 && indexB === -1) return 0
          if (indexA === -1) return 1
          if (indexB === -1) return -1
          return indexA - indexB
        })
      }

      setMonthlyData(sortByOrder(filteredMonthly))
      setTodayData(sortByOrder(filteredToday))
      setYesterdayData(sortByOrder(filteredYesterday))
      setDailyData(result.daily || [])
      setInvoiceMonthlyData(result.invoiceMonthly || [])
      setStoreSales(result.storeSales || [])
      setMemberChanges(result.memberChanges || [])
    } catch (error) {
      setMonthlyData([])
      setTodayData([])
      setYesterdayData([])
      setDailyData([])
      setInvoiceMonthlyData([])
      setStoreSales([])
      setMemberChanges([])
    } finally {
      if (initialLoading) {
        setInitialLoading(false)
      }
      setLoading(false)
    }
  }

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(`/api/dashboard?period=${categoryPeriod}&categories=true`)
      const result: ApiResponse = await response.json()

      if (result.storeCategories) {
        setStoreCategories(result.storeCategories)
      } else {
        setStoreCategories([])
      }
    } catch (error) {
      console.error("Error fetching category data:", error)
      setStoreCategories([])
    }
  }

  const formatPeriodLabel = (period: string) => {
    const [year, month] = period.split("-")
    return `${year}年${Number.parseInt(month)}月`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const monthlyTotal = monthlyData.reduce((sum, store) => sum + store.total, 0)

  if (initialLoading && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 p-6 flex items-center justify-center">
        <div className="text-blue-700 text-lg">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="px-3 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Period Selector */}
          <Card className="overflow-hidden border-blue-100 bg-gradient-to-r from-blue-600 to-blue-500 shadow-xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold text-white md:text-2xl">DASHBOARD</h2>
                  <p className="text-sm text-blue-100">店舗別洗車実績レポート</p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:w-auto">
                  <Button
                    onClick={() => {
                      fetchData()
                      fetchCategoryData()
                    }}
                    variant="outline"
                    size="sm"
                    className="w-auto self-start border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
                  >
                    <RefreshCw className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                    更新
                  </Button>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="border-2 border-blue-300/30 bg-white text-gray-900 font-semibold shadow-md text-sm sm:text-base">
                      <SelectValue placeholder="期間を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period} value={period}>
                          {formatPeriodLabel(period)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* 左側: 店舗カード */}
            <div className="flex-1">
              {/* 店舗別詳細カード - 青色ベースに変更 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthlyData.map((store, index) => {
                  const todayStore = todayData.find((s) => s.store === store.store)
                  const yesterdayStore = yesterdayData.find((s) => s.store === store.store) // 前日データを取得
                  const percentage = monthlyTotal > 0 ? ((store.total / monthlyTotal) * 100).toFixed(1) : "0"
                  const sales = storeSales.find((s) => s.store === store.store)
                  const memberChange = memberChanges.find((m) => m.store === store.store)

                  return (
                    <Card
                      key={store.store}
                      className="border-2 border-blue-200 bg-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: STORE_COLORS[index % STORE_COLORS.length] }}
                          />
                          <h3 className="text-base font-bold text-gray-900">
                            {STORE_SHORT_NAMES[store.store] || store.store}
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          {/* 月間 */}
                          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                            <p className="text-xs text-blue-700 mb-1 font-medium">月間</p>
                            <div className="mb-2">
                              <div className="flex items-baseline gap-1">
                                <p className="text-2xl font-bold text-blue-600">{store.total}</p>
                                <p className="text-xs text-blue-600">台</p>
                              </div>
                              <div className="flex items-center gap-1 mt-1 h-[20px]">
                                <span className="text-[10px] text-transparent">前日:</span>
                                <span className="text-sm font-semibold text-transparent">0</span>
                                <span className="text-[10px] text-transparent">台</span>
                              </div>
                            </div>
                            {isAdmin && sales && (
                              <div className="border-t border-blue-200 pt-2">
                                <p className="text-lg font-bold text-blue-700">
                                  {formatCurrency(sales.monthlyOnetime + sales.monthlySubsc)}
                                </p>
                                <div className="flex gap-2 mt-1">
                                  <p className="text-[10px] text-blue-500">
                                    OT: {formatCurrency(sales.monthlyOnetime)}
                                  </p>
                                  <p className="text-[10px] text-blue-500">SC: {formatCurrency(sales.monthlySubsc)}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* 本日 */}
                          <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                            <p className="text-xs text-green-700 mb-1 font-medium">本日</p>
                            <div className="mb-2">
                              <div className="flex items-baseline gap-1">
                                <p className="text-2xl font-bold text-green-600">{todayStore?.total || 0}</p>
                                <p className="text-xs text-green-600">台</p>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-[10px] text-gray-400">前日:</span>
                                <span className="text-sm font-semibold text-gray-600">
                                  {yesterdayStore?.total || 0}
                                </span>
                                <span className="text-[10px] text-gray-500">台</span>
                              </div>
                            </div>
                            {isAdmin && sales && (
                              <div className="border-t border-green-200 pt-2">
                                <p className="text-lg font-bold text-green-700">
                                  {formatCurrency(sales.todayOnetime + sales.todaySubsc)}
                                </p>
                                <div className="flex gap-2 mt-1">
                                  <p className="text-[10px] text-green-500">OT: {formatCurrency(sales.todayOnetime)}</p>
                                  <p className="text-[10px] text-green-500">SC: {formatCurrency(sales.todaySubsc)}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {memberChange && (
                          <div className="mb-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
                            <p className="text-xs text-gray-600 mb-1 font-medium">会員数の増減（前月比）</p>
                            <div className="flex items-center gap-2">
                              {memberChange.change > 0 ? (
                                <>
                                  <TrendingUp className="w-5 h-5 text-green-500" />
                                  <span className="text-xl font-bold text-green-600">+{memberChange.change}</span>
                                </>
                              ) : memberChange.change < 0 ? (
                                <>
                                  <TrendingDown className="w-5 h-5 text-red-500" />
                                  <span className="text-xl font-bold text-red-600">{memberChange.change}</span>
                                </>
                              ) : (
                                <>
                                  <Minus className="w-5 h-5 text-gray-400" />
                                  <span className="text-xl font-bold text-gray-500">±0</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* カテゴリ内訳 */}
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">カテゴリ内訳</p>
                          <div className="space-y-1.5">
                            {(() => {
                              const entries = Object.entries(store.items).sort((a, b) => b[1] - a[1])
                              const ceramicEntry = entries.find(([name]) => name === "セラミック祭り")
                              const topEntries = entries.slice(0, 5)

                              // セラミック祭りがあり、かつtop5に含まれていない場合は追加
                              if (ceramicEntry && !topEntries.some(([name]) => name === "セラミック祭り")) {
                                topEntries.pop() // 最後の要素を削除
                                topEntries.push(ceramicEntry) // セラミック祭りを追加
                              }

                              return topEntries.map(([itemName, count]) => {
                                const todayCount = todayStore?.items?.[itemName] || 0
                                return (
                                  <div key={itemName} className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">{itemName}</span>
                                    <span className="text-xs font-semibold text-blue-600">
                                      {count}台<span className="text-green-600 ml-1">({todayCount})</span>
                                    </span>
                                  </div>
                                )
                              })
                            })()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* 右側: ミニカレンダー */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="sticky top-4">
                <MiniCalendar />
              </div>
            </div>
          </div>

          {/* 店舗別月額会員数 折れ線グラフ - 青色ベースに変更 */}
          <Card className="border-2 border-blue-200 bg-white shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">店舗別月額会員数</h3>
              <div className="h-80">
                {invoiceMonthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={invoiceMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        axisLine={{ stroke: "#3b82f6" }}
                        tickFormatter={(value: string) => {
                          const [year, month] = value.split("-")
                          return `${year}年${month}月`
                        }}
                      />
                      <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#3b82f6" }} />
                      <Tooltip
                        formatter={(value: number, name: string) => [`${value}人`, STORE_SHORT_NAMES[name] || name]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "2px solid #3b82f6",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                        labelFormatter={(label: string) => {
                          const [year, month] = label.split("-")
                          return `${year}年${month}月`
                        }}
                      />
                      <Legend
                        formatter={(value) => STORE_SHORT_NAMES[value] || value}
                        onClick={(e) => handleLegendClick(e.dataKey as string, setHiddenStores)}
                        wrapperStyle={{ cursor: "pointer" }}
                      />
                      {STORE_ORDER.map((store) => (
                        <Line
                          key={store}
                          type="monotone"
                          dataKey={store}
                          stroke={STORE_COLOR_MAP[store]}
                          strokeWidth={2}
                          dot={{ fill: STORE_COLOR_MAP[store], strokeWidth: 1, r: 2 }}
                          activeDot={{ r: 4 }}
                          hide={hiddenStores.has(store)}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">データがありません</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 店舗別コース構成比 - 青色ベースに変更 */}
          <Card className="border-2 border-blue-200 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900">店舗別コース構成比</h3>
                <div className="px-4 py-2 bg-blue-100 rounded-lg border border-blue-300">
                  <span className="text-blue-700 font-semibold">{formatPeriodLabel(categoryPeriod)}</span>
                </div>
              </div>

              {storeCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {storeCategories.map((storeData, storeIndex) => (
                    <div
                      key={storeData.store}
                      className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-4 border border-blue-200 shadow-sm"
                    >
                      {/* 店舗名ヘッダー */}
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: STORE_COLORS[storeIndex % STORE_COLORS.length] }}
                        />
                        <h4 className="font-bold text-gray-800">
                          {STORE_SHORT_NAMES[storeData.store] || storeData.store}
                        </h4>
                        <span className="ml-auto text-sm text-gray-500">計 {storeData.total}人</span>
                      </div>

                      {/* ドーナツチャート */}
                      <div className="h-48 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={storeData.categories}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={70}
                              paddingAngle={3}
                              dataKey="value"
                              stroke="none"
                            >
                              {storeData.categories.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COURSE_COLORS[entry.name] || "#9ca3af"}
                                  className="drop-shadow-sm"
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number, name: string) => [`${value}人`, name]}
                              contentStyle={{
                                backgroundColor: "white",
                                border: "2px solid #3b82f6",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                fontSize: "12px",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        {/* 中央にトータル表示 */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-800">{storeData.total}</p>
                            <p className="text-xs text-gray-500">人</p>
                          </div>
                        </div>
                      </div>

                      {/* カテゴリ凡例 */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {storeData.categories.map((category) => (
                          <div key={category.name} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: COURSE_COLORS[category.name] || "#9ca3af" }}
                            />
                            <span className="text-xs text-gray-600 truncate">{category.name}</span>
                            <span className="text-xs font-semibold text-gray-800 ml-auto">{category.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">データがありません</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
