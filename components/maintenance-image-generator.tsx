"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Download, CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

interface Store {
  id: number
  store_name: string
}

interface MaintenanceImageGeneratorProps {
  isOpen: boolean
  onClose: () => void
}

const WEEKDAY_MAP: Record<number, string> = {
  0: "日",
  1: "月",
  2: "火",
  3: "水",
  4: "木",
  5: "金",
  6: "土",
}

export function MaintenanceImageGenerator({ isOpen, onClose }: MaintenanceImageGeneratorProps) {
  const [stores, setStores] = useState<Store[]>([])
  const [storeDates, setStoreDates] = useState<Record<number, Date | undefined>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchStores()
    }
  }, [isOpen])

  const fetchStores = async () => {
    try {
      const response = await fetch("/api/stores")
      if (response.ok) {
        const data = await response.json()
        // id >= 1の店舗のみを取得
        const filteredStores = data.filter((store: Store) => store.id >= 1)
        setStores(filteredStores)

        // 初期日付を空にする
        const initialDates: Record<number, Date | undefined> = {}
        filteredStores.forEach((store: Store) => {
          initialDates[store.id] = undefined
        })
        setStoreDates(initialDates)
      }
    } catch (error) {
      console.error("Error fetching stores:", error)
    }
  }

  const removeStorePrefix = (storeName: string) => {
    // "SPLASH'N'GO!"を削除
    return storeName.replace(/SPLASH'N'GO!?\s*/gi, "").trim()
  }

  const formatDateWithWeekday = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = WEEKDAY_MAP[date.getDay()]
    return `${month}月${day}日（${weekday}）`
  }

  const generateImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // キャンバスサイズを設定
    canvas.width = 2000
    canvas.height = 1414

    // 背景（白）
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, 2000, 1414)

    // 青い枠
    ctx.strokeStyle = "#2563EB"
    ctx.lineWidth = 40
    ctx.strokeRect(20, 20, 1960, 1374)

    // タイトル「洗車機メンテナンスに伴う休業のお知らせ」
    ctx.fillStyle = "#000000"
    ctx.font = "bold 80px sans-serif"
    ctx.textAlign = "center"
    const title1 = "洗車機メンテナンスに伴う"
    const title2 = "休業のお知らせ"
    ctx.fillText(title1, 1000, 200)
    ctx.fillText(title2, 1000, 300)

    // 各店舗と日付を描画
    const startY = 450
    const rowHeight = 140

    stores.forEach((store, index) => {
      const y = startY + index * rowHeight
      const date = storeDates[store.id]

      // 店舗名（青い丸角矩形）
      ctx.fillStyle = "#2563EB"
      ctx.beginPath()
      ctx.roundRect(200, y - 50, 350, 90, 45)
      ctx.fill()

      // 店舗名テキスト（白）
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 48px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(removeStorePrefix(store.store_name), 375, y + 10)

      // 日付（赤）
      if (date) {
        ctx.fillStyle = "#EF4444"
        ctx.font = "bold 96px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(formatDateWithWeekday(date), 750, y + 10)
      } else {
        ctx.fillStyle = "#9CA3AF"
        ctx.font = "bold 48px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText("日付を選択", 750, y + 10)
      }
    })

    // 下部メッセージ
    ctx.fillStyle = "#2563EB"
    ctx.font = "bold 36px sans-serif"
    ctx.textAlign = "center"
    const message = "お客様にはご不便をおかけしますが、ご理解とご協力をお願い申し上げます！"
    ctx.fillText(message, 1000, 1320)
  }

  useEffect(() => {
    if (isOpen && stores.length > 0) {
      generateImage()
    }
  }, [isOpen, stores, storeDates])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 全ての店舗に日付が設定されているか確認
    const allDatesSet = stores.every((store) => storeDates[store.id])
    if (!allDatesSet) {
      alert("全ての店舗の日付を選択してください")
      return
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `メンテナンス休業お知らせ_${format(new Date(), "yyyyMMdd")}.png`
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600">メンテナンス画像生成</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 日付選択 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">各店舗の休業日を選択</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stores.map((store) => (
                <div key={store.id} className="space-y-2">
                  <Label>{removeStorePrefix(store.store_name)}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {storeDates[store.id] ? (
                          format(storeDates[store.id]!, "yyyy年M月d日", { locale: ja })
                        ) : (
                          <span>日付を選択</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={storeDates[store.id]}
                        onSelect={(date) =>
                          setStoreDates((prev) => ({
                            ...prev,
                            [store.id]: date,
                          }))
                        }
                        locale={ja}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>
          </div>

          {/* プレビュー */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">プレビュー</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <canvas
                ref={canvasRef}
                className="w-full h-auto border border-gray-300 rounded"
                style={{ maxHeight: "500px" }}
              />
            </div>
          </div>

          {/* ダウンロードボタン */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              ダウンロード
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
