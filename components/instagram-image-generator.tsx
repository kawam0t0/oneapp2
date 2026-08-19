"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { staffImage, logoImage } from "@/assets/images" // Import staffImage and logoImage

interface InstagramImageGeneratorProps {
  isOpen: boolean
  onClose: () => void
  storeName: string
}

export function InstagramImageGenerator({
  isOpen,
  onClose,
  storeName,
}: InstagramImageGeneratorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isGenerating, setIsGenerating] = useState(false)
  const canvas2Ref = useRef<HTMLCanvasElement>(null)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [template2Image, setTemplate2Image] = useState<HTMLImageElement | null>(null)

  // 店舗名から"SPLASH'N'GO!"を削除
  const cleanStoreName = storeName.replace(/SPLASH'N'GO!\s*/gi, "")

  useEffect(() => {
    // カスタムフォントを読み込み
    const loadFonts = async () => {
      try {
        const logoFont = new FontFace("LogoGUltra", "url(/fonts/LogoGStd-Ultra.otf)")
        await logoFont.load()
        document.fonts.add(logoFont)
        setFontsLoaded(true)
      } catch (e) {
        console.error("Font loading failed:", e)
        setFontsLoaded(true)
      }
    }
    loadFonts()

    // テンプレート画像2を読み込み
    const template2Img = new Image()
    template2Img.crossOrigin = "anonymous"
    template2Img.onload = () => setTemplate2Image(template2Img)
    template2Img.onerror = () => console.error("Template 2 image not found")
    template2Img.src = "/instagram-template-2.png"
  }, [])

  useEffect(() => {
    if (isOpen && selectedDate && fontsLoaded) {
      if (template2Image) {
        generateImage2()
      }
    }
  }, [isOpen, selectedDate, fontsLoaded, template2Image])

  const generateImage1 = () => {
    // 1枚目は使用しないため削除
  }

  const generateImage2 = () => {
    const canvas = canvas2Ref.current
    if (!canvas || !selectedDate || !template2Image) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 出力サイズを1080×1080pxに統一
    const outputSize = 1080
    canvas.width = outputSize
    canvas.height = outputSize

    // テンプレート画像をリサイズして描画
    ctx.drawImage(template2Image, 0, 0, outputSize, outputSize)

    // 日付エリアを白で塗りつぶし（テンプレートの10月10日を消す）
    ctx.fillStyle = "#ffffff"
    const fillWidth = (860 / template2Image.width) * outputSize
    const fillHeight = (200 / template2Image.height) * outputSize
    const fillX = (108 / template2Image.width) * outputSize
    const fillY = (500 / template2Image.height) * outputSize
    ctx.fillRect(fillX, fillY, fillWidth, fillHeight)

    // 日付を描画
    const month = selectedDate.getMonth() + 1
    const day = selectedDate.getDate()
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][selectedDate.getDay()]
    const dateText = `${month}月${day}日(${dayOfWeek})`
    
    ctx.textAlign = "left"
    ctx.textBaseline = "alphabetic"
    ctx.fillStyle = "#000000"
    
    const scaleFactor = outputSize / template2Image.width
    const numFont = `bold ${Math.round(150 * scaleFactor)}px LogoGUltra, sans-serif`
    const textFont = `bold ${Math.round(80 * scaleFactor)}px LogoGUltra, 'Hiragino Kaku Gothic ProN', sans-serif`
    const baselineY = (540 * scaleFactor)
    
    // 全体の幅を計算して中央配置
    let totalWidth = 0
    for (const char of dateText.split('')) {
      ctx.font = /[0-9]/.test(char) ? numFont : textFont
      totalWidth += ctx.measureText(char).width
    }
    
    // 文字間にスペースを追加
    const letterSpacing = 12 * scaleFactor
    totalWidth += letterSpacing * (dateText.length - 1)
    
    let currentX = (canvas.width - totalWidth) / 2
    for (const char of dateText.split('')) {
      ctx.font = /[0-9]/.test(char) ? numFont : textFont
      ctx.fillText(char, currentX, baselineY)
      currentX += ctx.measureText(char).width + letterSpacing
    }

    // 日付の下に黄色い線を追加
    ctx.fillStyle = "#ffd800"
    const lineY = baselineY + (20 * scaleFactor)
    const lineHeight = 30 * scaleFactor
    ctx.fillRect((canvas.width - totalWidth) / 2, lineY, totalWidth, lineHeight)
  }

  const handleDownload = async () => {
    setIsGenerating(true)
    
    try {
      // 2枚目のダウンロード（1080×1080px）
      const canvas2 = canvas2Ref.current
      if (canvas2) {
        canvas2.toBlob((blob) => {
          if (!blob) return
          const url2 = URL.createObjectURL(blob)
          const link2 = document.createElement("a")
          link2.href = url2
          link2.download = `インスタ_${cleanStoreName}_${format(selectedDate || new Date(), "yyyyMMdd")}.png`
          link2.click()
          URL.revokeObjectURL(url2)
        })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">インスタ画像生成 - {cleanStoreName}</DialogTitle>
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

          {/* プレビュー（2枚目のみ） */}
          <div className="space-y-2">
            <label className="text-sm font-medium">プレビュー（1080×1080px）</label>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <canvas ref={canvas2Ref} className="w-full h-auto" />
            </div>
            <p className="text-xs text-muted-foreground">
              フォント: LogoGStd-Ultra / サイズ: 1080×1080px
            </p>
          </div>

          {/* ダウンロードボタン */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              閉じる
            </Button>
            <Button 
              onClick={handleDownload} 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              disabled={isGenerating}
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? "ダウンロード中..." : "ダウンロード"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
