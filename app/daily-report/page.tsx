"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Check, Store, Calendar, Cloud, Car, DollarSign, Package, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const WEATHER_OPTIONS = ["晴", "曇", "雨", "晴/曇", "曇/雨", "晴/雨"]

const WEATHER_ICONS: { [key: string]: string } = {
  晴: "☀️",
  曇: "☁️",
  雨: "🌧️",
  "晴/曇": "⛅",
  "曇/雨": "🌦️",
  "晴/雨": "🌤️",
}

export default function DailyReportPage() {
  const router = useRouter()
  const { session } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState<"input" | "confirm">("input")
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // フォームデータ
  const [storeName, setStoreName] = useState("")
  const [date, setDate] = useState("")
  const [weather, setWeather] = useState("")
  const [totalCount, setTotalCount] = useState("")
  const [cashSales, setCashSales] = useState("")
  const [itemData, setItemData] = useState<{ [key: string]: number }>({})
  const [comments, setComments] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/daily-report", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        const data = await response.json()

        console.log("[v0] Fetched daily report data:", data)

        setStoreName(data.storeName)
        setDate(data.date)
        setTotalCount(data.totalCount.toString())
        setItemData(data.itemData)

        if (data.existingReport) {
          setWeather(data.existingReport.weather || "")
          setCashSales(data.existingReport.cash_sales || "")
          setComments(data.existingReport.comments || "")
        }

        setLoading(false)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleItemChange = (itemName: string, value: string) => {
    setItemData((prev) => ({
      ...prev,
      [itemName]: Number.parseInt(value) || 0,
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/daily-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          date,
          weather,
          totalCount: Number.parseInt(totalCount) || 0,
          cashSales: Number.parseFloat(cashSales) || 0,
          itemData,
          comments,
        }),
      })

      if (response.ok) {
        alert("日報を送信しました")
        router.push("/")
      } else {
        alert("送信に失敗しました")
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("[v0] Error submitting report:", error)
      alert("送信エラーが発生しました")
      setIsSubmitting(false)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!weather) {
      newErrors.weather = "天気を選択してください"
    }

    if (!totalCount || totalCount === "0") {
      newErrors.totalCount = "総台数を入力してください"
    }

    if (!cashSales) {
      newErrors.cashSales = "現金売上を入力してください"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      setStep("confirm")
    } else {
      toast({
        title: "入力エラー",
        description: "必要事項を入力してください",
        variant: "destructive",
      })
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">ログインしてください</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => setStep("input")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            入力画面に戻る
          </Button>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg p-8">
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <Check className="h-6 w-6" />
                日報確認
              </CardTitle>
              <p className="text-blue-100 text-sm mt-2">送信前に内容をご確認ください</p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  基本情報
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                    <Store className="h-5 w-5 text-gray-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">店舗名</p>
                      <p className="text-lg font-bold text-gray-900">{storeName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                    <Calendar className="h-5 w-5 text-gray-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">日付</p>
                      <p className="text-lg font-bold text-gray-900">{date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                    <Cloud className="h-5 w-5 text-gray-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">天気</p>
                      <p className="text-lg font-bold text-gray-900">{weather}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  売上情報
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                    <Car className="h-5 w-5 text-gray-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">総台数</p>
                      <p className="text-lg font-bold text-gray-900">{totalCount}台</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                    <DollarSign className="h-5 w-5 text-gray-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">現金売上</p>
                      <p className="text-lg font-bold text-gray-900">
                        ¥{Number.parseFloat(cashSales).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  アイテム別データ数
                </h3>
                <div className="space-y-2">
                  {Object.entries(itemData)
                    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB, "ja"))
                    .map(([itemName, count]) => (
                      <div
                        key={itemName}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-gray-700 font-medium">{itemName}</span>
                        <span className="font-bold text-blue-600 text-lg">{count}件</span>
                      </div>
                    ))}
                </div>
              </div>

              {comments && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    今日の所感
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{comments}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("input")}
                  disabled={isSubmitting}
                  className="flex-1 h-12 border-2 hover:bg-gray-50"
                >
                  戻る
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>送信中...</>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      送信
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          ホームに戻る
        </Button>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg p-8">
            <CardTitle className="text-3xl font-bold">日報入力</CardTitle>
            <p className="text-blue-100 text-sm mt-2">必要な情報を入力してください</p>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                基本情報
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="store" className="flex items-center gap-2 text-gray-700 mb-2">
                    <Store className="h-4 w-4" />
                    店舗名
                  </Label>
                  <Input id="store" value={storeName} disabled className="bg-gray-50 border-gray-300 font-medium" />
                </div>

                <div>
                  <Label htmlFor="date" className="flex items-center gap-2 text-gray-700 mb-2">
                    <Calendar className="h-4 w-4" />
                    日付
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    disabled
                    className="bg-gray-50 border-gray-300 font-medium"
                  />
                </div>

                <div>
                  <Label htmlFor="weather" className="flex items-center gap-2 text-gray-700 mb-2">
                    <Cloud className="h-4 w-4" />
                    天気 <span className="text-red-500 text-sm">*必須</span>
                  </Label>
                  <Select value={weather} onValueChange={setWeather}>
                    <SelectTrigger
                      id="weather"
                      className={`bg-white ${errors.weather ? "border-red-500 border-2" : "border-gray-300"}`}
                    >
                      <SelectValue placeholder="天気を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {WEATHER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {WEATHER_ICONS[option]} {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.weather && <p className="text-red-500 text-sm mt-1">{errors.weather}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                売上情報
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalCount" className="flex items-center gap-2 text-gray-700 mb-2">
                    <Car className="h-4 w-4" />
                    総台数 <span className="text-red-500 text-sm">*必須</span>
                  </Label>
                  <Input
                    id="totalCount"
                    type="number"
                    value={totalCount}
                    onChange={(e) => setTotalCount(e.target.value)}
                    placeholder="0"
                    className={`bg-white text-lg font-semibold ${errors.totalCount ? "border-red-500 border-2" : "border-gray-300"}`}
                  />
                  {errors.totalCount && <p className="text-red-500 text-sm mt-1">{errors.totalCount}</p>}
                </div>

                <div>
                  <Label htmlFor="cashSales" className="flex items-center gap-2 text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4" />
                    現金売上 <span className="text-red-500 text-sm">*必須</span>
                  </Label>
                  <Input
                    id="cashSales"
                    type="number"
                    value={cashSales}
                    onChange={(e) => setCashSales(e.target.value)}
                    placeholder="0"
                    className={`bg-white text-lg font-semibold ${errors.cashSales ? "border-red-500 border-2" : "border-gray-300"}`}
                  />
                  {errors.cashSales && <p className="text-red-500 text-sm mt-1">{errors.cashSales}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                アイテム別データ数
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(itemData)
                  .sort(([nameA], [nameB]) => nameA.localeCompare(nameB, "ja"))
                  .map(([itemName, count]) => (
                    <div key={itemName}>
                      <Label htmlFor={itemName} className="text-sm text-gray-700 mb-2 block font-medium">
                        {itemName}
                      </Label>
                      <Input
                        id={itemName}
                        type="number"
                        value={count}
                        onChange={(e) => handleItemChange(itemName, e.target.value)}
                        className="border-gray-300 text-lg font-semibold"
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                所感(任意)
              </h3>
              <div>
                <Label htmlFor="comments" className="text-gray-700 mb-2 block"></Label>
                <textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full min-h-[120px] p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y text-gray-700 leading-relaxed"
                  rows={5}
                />
              </div>
            </div>

            <Button
              onClick={handleNext}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-lg"
            >
              確認画面へ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
