"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

interface SingleStoreMaintenanceImageGeneratorProps {
  isOpen: boolean
  onClose: () => void
  storeName: string
}

export function SingleStoreMaintenanceImageGenerator({
  isOpen,
  onClose,
  storeName,
}: SingleStoreMaintenanceImageGeneratorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 店舗名から"SPLASH'N'GO!"を削除
  const cleanStoreName = storeName.replace(/SPLASH'N'GO!\s*/gi, "")

  useEffect(() => {
    if (isOpen && selectedDate) {
      generateImage()
    }
  }, [isOpen, selectedDate])

  const generateImage = () => {
    const canvas = canvasRef.current
    if (!canvas || !selectedDate) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // キャンバスサイズ設定 (2000x1414px)
    canvas.width = 2000
    canvas.height = 1414

    // 背景 - 青枠
    ctx.fillStyle = "#1e3a8a"
    ctx.fillRect(0, 0, 2000, 1414)

    // 内側 - 白背景
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(40, 40, 1920, 1334)

    // タイトル背景 - 青
    ctx.fillStyle = "#1e3a8a"
    ctx.fillRect(40, 40, 1920, 200)

    // タイトルテキスト
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 80px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("洗車機メンテナンスに伴う", 1000, 100)
    ctx.fillText("休業のお知らせ", 1000, 180)

    // 日付部分
    const month = selectedDate.getMonth() + 1
    const day = selectedDate.getDate()
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][selectedDate.getDay()]

    ctx.fillStyle = "#dc2626"
    ctx.font = "bold 180px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`${month}月${day}日（${dayOfWeek}）`, 1000, 550)

    // メッセージ
    ctx.fillStyle = "#dc2626"
    ctx.font = "bold 100px sans-serif"
    ctx.fillText("終日お休みとさせていただきます！", 1000, 800)

    // 下部メッセージ
    ctx.fillStyle = "#1e3a8a"
    ctx.font = "bold 40px sans-serif"
    ctx.fillText("⚠️翌日より通常通り営業開始となります。", 1000, 1050)
    ctx.font = "bold 42px sans-serif"
    ctx.fillText("お客様にはご不便をおかけしますが、ご理解とご協力をお願い申し上げます！", 1000, 1150)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `メンテナンス休業_${cleanStoreName}_${format(selectedDate || new Date(), "yyyyMMdd")}.png`
      link.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">メンテナンス画像生成 - {cleanStoreName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 日付選択 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">休業日を選択</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: ja }) : "日付を選択"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={ja} />
              </PopoverContent>
            </Popover>
          </div>

          {/* プレビュー */}
          <div className="space-y-2">
            <label className="text-sm font-medium">プレビュー</label>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <canvas ref={canvasRef} className="w-full h-auto" />
            </div>
          </div>

          {/* ダウンロードボタン */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              閉じる
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
