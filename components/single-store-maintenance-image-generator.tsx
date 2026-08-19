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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedDate])

  const generateImage = async () => {
    const canvas = canvasRef.current
    if (!canvas || !selectedDate) return

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

    // キャンバスサイズ設定 (2000x1414px)
    canvas.width = 2000
    canvas.height = 1414

    // 背景全体 - 青色 (#0025CC)
    ctx.fillStyle = "#0025CC"
    ctx.fillRect(0, 0, 2000, 1414)

    // タイトル部分 - 上部青バー
    ctx.fillStyle = "#0025CC"
    ctx.fillRect(0, 0, 2000, 350)

    // タイトルテキスト - 白文字（日本語フォント）
    ctx.fillStyle = "#ffffff"
    ctx.font = "90px LogoGUltra, 'Hiragino Kaku Gothic ProN', sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("洗車機メンテナンスに伴う", 1000, 135)
    ctx.fillText("休業のお知らせ", 1000, 235)

    // 白い背景部分（中央から下）
    ctx.fillStyle = "#f5f5f0"
    ctx.fillRect(0, 350, 2000, 1134)

    // 日付部分 - 数字と日本語を分けて描画
    const month = selectedDate.getMonth() + 1
    const day = selectedDate.getDate()
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][selectedDate.getDay()]

    ctx.fillStyle = "#ff3131"
    ctx.textAlign = "center"
    ctx.textBaseline = "alphabetic"
    
    // 日付テキスト全体の幅を計算して中央配置
    const dateText = `${month}月${day}日(${dayOfWeek})`
    const numFont = "300px AvantGarde, sans-serif"
    const textFont = "300px LogoGUltra, 'Hiragino Kaku Gothic ProN', sans-serif"
    
    // 文字を1つずつ描画して数字と日本語でフォントを切り替え
    const chars = dateText.split('')
    const totalWidth = chars.reduce((sum, char) => {
      ctx.font = /[0-9]/.test(char) ? numFont : textFont
      return sum + ctx.measureText(char).width
    }, 0)
    
    // ベースラインを揃えるためalphabeticを使用し、Y座標を固定
    const baselineY = 730
    
    // 中央配置のための開始X座標
    ctx.textAlign = "left"
    let currentX = 1000 - totalWidth / 2
    for (const char of chars) {
      ctx.font = /[0-9]/.test(char) ? numFont : textFont
      ctx.fillText(char, currentX, baselineY)
      currentX += ctx.measureText(char).width
    }

    // メッセージ - 赤文字（日本語フォント）
    ctx.fillStyle = "#ff3131"
    ctx.font = "100px LogoGUltra, 'Hiragino Kaku Gothic ProN', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("終日お休みとさせていただきます！", 1000, 950)

    // 下部メッセージ - 青文字（日本語フォント）
    ctx.fillStyle = "#0025CC"
    ctx.font = "55px LogoGUltra, 'Hiragino Kaku Gothic ProN', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("⚠️翌日より通常通り営業開始となります。", 1000, 1180)
    ctx.fillText("お客様にはご不便をおかけしますが、ご理解とご協力をお願い申し上げます！", 1000, 1260)
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
