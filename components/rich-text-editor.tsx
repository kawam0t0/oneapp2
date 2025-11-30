"use client"

import type React from "react"
import { useRef } from "react"
import { ImagePlus, X } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  imageUrl: string
  onImageChange: (url: string) => void
}

export function RichTextEditor({ value, onChange, imageUrl, onImageChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 画像をBase64に変換してアップロード
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("画像サイズは5MB以下にしてください")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        onImageChange(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  // 画像を削除
  const removeImage = () => {
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {/* ツールバー - 画像添付のみ */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
          title="画像を添付"
        >
          <ImagePlus className="h-5 w-5 text-gray-700" />
          <span className="text-sm text-gray-600">画像を添付</span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>

      {/* シンプルなテキストエリア */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[150px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-colors bg-white resize-y"
        placeholder="お知らせの本文を入力してください..."
      />

      {/* 画像プレビュー */}
      {imageUrl && (
        <div className="relative inline-block">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="添付画像プレビュー"
            className="max-w-full max-h-48 rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
