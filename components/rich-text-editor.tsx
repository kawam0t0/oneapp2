"use client"

import type React from "react"
import { useRef } from "react"
import { ImagePlus, X } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  imageUrls: string[]
  onImagesChange: (urls: string[]) => void
}

export function RichTextEditor({ value, onChange, imageUrls, onImagesChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    console.log("[v0] handleImageUpload triggered")
    console.log("[v0] files:", files)
    console.log("[v0] files.length:", files?.length)

    if (!files || files.length === 0) {
      console.log("[v0] No files selected")
      return
    }

    console.log("[v0] Selected files count:", files.length)
    console.log(
      "[v0] File names:",
      Array.from(files).map((f) => f.name),
    )

    const newImages: string[] = []
    let processedCount = 0

    Array.from(files).forEach((file, index) => {
      console.log(`[v0] Processing file ${index + 1}/${files.length}: ${file.name}, size: ${file.size}`)

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} は5MB以下にしてください`)
        processedCount++
        console.log(`[v0] File ${file.name} exceeded size limit`)
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        newImages.push(base64)
        processedCount++
        console.log(`[v0] File ${index + 1} processed. Total processed: ${processedCount}/${files.length}`)

        // 全ファイルの処理が完了したら更新
        if (processedCount === files.length) {
          console.log("[v0] All files processed. Current imageUrls:", imageUrls.length)
          console.log("[v0] New images:", newImages.length)
          const updatedUrls = [...imageUrls, ...newImages]
          console.log("[v0] Updated imageUrls:", updatedUrls.length)
          onImagesChange(updatedUrls)
        }
      }
      reader.readAsDataURL(file)
    })

    // ファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (index: number) => {
    console.log(`[v0] Removing image at index ${index}`)
    const newUrls = imageUrls.filter((_, i) => i !== index)
    console.log(`[v0] imageUrls count after removal: ${newUrls.length}`)
    onImagesChange(newUrls)
  }

  console.log("[v0] RichTextEditor rendered. imageUrls count:", imageUrls.length)

  return (
    <div className="space-y-4">
      {/* ツールバー - 画像添付のみ */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => {
            console.log("[v0] Image upload button clicked")
            fileInputRef.current?.click()
          }}
          className="p-2 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
          title="画像を添付"
        >
          <ImagePlus className="h-5 w-5 text-gray-700" />
          <span className="text-sm text-gray-600">画像を添付</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple // 複数選択を許可
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* シンプルなテキストエリア */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[150px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-colors bg-white resize-y"
        placeholder="お知らせの本文を入力してください..."
      />

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative inline-block">
              <img
                src={url || "/placeholder.svg"}
                alt={`添付画像${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
