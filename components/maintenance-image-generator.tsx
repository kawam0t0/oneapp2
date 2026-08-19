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
        // id >= 1の店舗のみを取得、鹿児島中山店は除外
        const filteredStores = data.filter(
          (store: Store) => store.id >= 1 && !store.store_name.includes("鹿児島中山店")
        )
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
    return storeName
      .replace(/SPLASH'N'GO!?\s*/gi, "")
      .replace(/スプラッシュンゴー[-－]?\s*/g, "")
      .replace(/スプラッシュンゴー\s*/g, "")
      .trim()
  }

  const formatDateWithWeekday = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = WEEKDAY_MAP[date.getDay()]
    return `${month}月${day}日(${weekday})`
  }

  const generateImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // カスタムフォントを読み込む
    try {
      const logoFontUltra = new FontFace("LogoGUltra", "url(/fonts/LogoGStd-Ultra.otf)")
      const avantGardeFont = new FontFace("AvantGarde", "url(/fonts/ITCAvantGardeStd-Bold.ttf)")
      await Promise.all([logoFontUltra.load(), avantGardeFont.load()])
      document.fonts.add(logoFontUltra)
      document.fonts.add(avantGardeFont)
    } catch (e) {
      console.error("Font loading failed:", e)
    }

    // キャンバスサイズを設定
    canvas.width = 2000
    canvas.height = 1414

    // 背景全体 - 青色 (#0025CC)
    ctx.fillStyle = "#0025CC"
    ctx.fillRect(0, 0, 2000, 1414)

    // 内側 - 白背景（薄いベージュ）
    ctx.fillStyle = "#f5f5f0"
    ctx.fillRect(40, 40, 1920, 1334)

    // タイトル「洗車機メンテナンスに伴う休業のお知らせ」- 赤文字 (#ff3131)
    ctx.fillStyle = "#ff3131"
    ctx.font = "75px LogoGUltra, 'Hiragino Kaku Gothic ProN', sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("洗車機メンテナンスに伴う", 1000, 130)
    ctx.fillText("休業のお知らせ", 1000, 220)

    const sortedStores = [...stores].sort((a, b) => {
      const dateA = storeDates[a.id]
      const dateB = storeDates[b.id]
      if (!dateA && !dateB) return 0
      if (!dateA) return 1
      if (!dateB) return -1
      return dateA.getTime() - dateB.getTime()
    })

    // ---- 2列レイアウト設定 ----
    // canvas: 2000 x 1414
    // 左右マージン: 60px、列間ギャップ: 40px
    // 1列の幅: (2000 - 60*2 - 40) / 2 = 920px
    // 各列内訳: 店舗名楕円(290px) + ギャップ(20px) + 日付テキスト(610px) = 920px
    const colCount   = 2
    const marginX    = 60
    const colGap     = 40
    const colWidth   = (2000 - marginX * 2 - colGap) / colCount  // 920
    const labelW     = 290
    const labelH     = 78
    const labelR     = 39
    const dateStartX = labelW + 24    // 楕円右端 + 余白（列内相対座標）
    const rowCount   = Math.ceil(sortedStores.length / colCount)

    // 行間を均等配分: タイトル下 280px ～ フッター上 1260px
    const areaTop    = 290
    const areaBottom = 1250
    const areaHeight = areaBottom - areaTop
    const rowHeight  = rowCount > 0 ? Math.floor(areaHeight / rowCount) : 160
    const rowPadding = Math.floor(rowHeight * 0.5)   // 行内の垂直中心

    for (let index = 0; index < sortedStores.length; index++) {
      const store  = sortedStores[index]
      const col    = index % colCount
      const row    = Math.floor(index / colCount)
      const colX   = marginX + col * (colWidth + colGap)   // 列の左端X
      const rowY   = areaTop + row * rowHeight + rowPadding  // 行の垂直中心Y
      const date   = storeDates[store.id]

      // 店舗名楕円（青）
      ctx.fillStyle = "#0025CC"
      ctx.beginPath()
      ctx.roundRect(colX, rowY - labelH / 2, labelW, labelH, labelR)
      ctx.fill()

      // 店舗名テキスト（白）
      ctx.fillStyle    = "#FFFFFF"
      ctx.font         = "44px LogoGUltra, 'Hiragino Kaku Gothic ProN', sans-serif"
      ctx.textAlign    = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(removeStorePrefix(store.store_name), colX + labelW / 2, rowY)

      // 日付テキスト（赤）
      const fontSize = Math.min(95, Math.floor(rowHeight * 0.70))
      const numFont  = `${fontSize}px AvantGarde, sans-serif`
      const txtFont  = `${fontSize}px LogoGUltra, 'Hiragino Kaku Gothic ProN', sans-serif`

      if (date) {
        ctx.fillStyle    = "#ff3131"
        ctx.textAlign    = "left"
        ctx.textBaseline = "alphabetic"
        const dateText   = formatDateWithWeekday(date)
        const baselineY  = rowY + fontSize * 0.35
        let currentX     = colX + dateStartX

        for (const char of dateText.split("")) {
          ctx.font = /[0-9]/.test(char) ? numFont : txtFont
          ctx.fillText(char, currentX, baselineY)
          currentX += ctx.measureText(char).width
        }
      } else {
        ctx.fillStyle    = "#9CA3AF"
        ctx.font         = `44px LogoGUltra, 'Hiragino Kaku Gothic ProN', sans-serif`
        ctx.textAlign    = "left"
        ctx.textBaseline = "middle"
        ctx.fillText("日付を選択", colX + dateStartX, rowY)
      }
    }

    // 下部メッセージ - 青文字 (#0025CC)
    ctx.fillStyle = "#0025CC"
    ctx.font = "42px LogoGUltra, 'Hiragino Kaku Gothic ProN', sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    const message = "お客様にはご不便をおかけしますが、ご理解とご協力をお願い申し上げます！"
    ctx.fillText(message, 1000, 1300)
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
