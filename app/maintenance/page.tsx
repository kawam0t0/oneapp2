"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, FileText, Download, ArrowLeft } from "lucide-react"

interface MaintenanceRecord {
  id: number
  store_id: number
  store_name?: string
  title: string
  file_name: string | null
  created_at: string
}

interface Store {
  id: number
  store_name: string
}

export default function MaintenancePage() {
  const router = useRouter()
  const [storeName, setStoreName] = useState<string>("")
  const [storeId, setStoreId] = useState<number | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [records, setRecords] = useState<MaintenanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [title, setTitle] = useState<string>("")
  const [selectedStoreId, setSelectedStoreId] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const titleOptions = ["マンスリーメンテナンス結果報告", "定期メンテナンス結果報告"]

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session")
        if (res.ok) {
          const data = await res.json()
          setStoreName(data.store_name || "")
          setStoreId(data.store_id || null)
          setSelectedStoreId(data.store_id?.toString() || "")
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      }
    }
    fetchSession()
    fetchStores()
  }, [])

  useEffect(() => {
    if (storeId) {
      fetchRecords()
    }
  }, [storeId])

  const fetchStores = async () => {
    try {
      const response = await fetch("/api/stores")
      if (response.ok) {
        const data = await response.json()
        setStores(data)
      }
    } catch (error) {
      console.error("Error fetching stores:", error)
    }
  }

  const fetchRecords = async () => {
    try {
      const response = await fetch(`/api/maintenance?storeId=${storeId}`)
      if (response.ok) {
        const data = await response.json()
        setRecords(data)
      }
    } catch (error) {
      console.error("Error fetching records:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !selectedStoreId) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("storeId", selectedStoreId)
      formData.append("title", title)
      if (file) {
        formData.append("file", file)
      }

      const response = await fetch("/api/maintenance", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setTitle("")
        setFile(null)
        setIsDialogOpen(false)
        fetchRecords()
      }
    } catch (error) {
      console.error("Error creating record:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    // 日本時間（JST、UTC+9）に変換
    const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000)
    return jstDate.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    })
  }

  if (!storeName) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              戻る
            </Button>
            <CardTitle className="text-2xl font-bold">メンテナンス履歴</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                メンテナンスを追加
              </Button>
            </DialogTrigger>
            <DialogContent className="border-t-4 border-t-blue-600">
              <DialogHeader className="bg-blue-50 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
                <DialogTitle className="text-blue-800">メンテナンス履歴を追加</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="store" className="text-blue-800 font-medium">
                    店舗
                  </Label>
                  <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="店舗を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.store_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-blue-800 font-medium">
                    題名
                  </Label>
                  <Select value={title} onValueChange={setTitle}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="題名を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {titleOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-blue-800 font-medium">
                    PDFファイル（任意）
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {file && <p className="text-sm text-blue-600">選択済み: {file.name}</p>}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSubmitting || !title || !selectedStoreId}
                  >
                    {isSubmitting ? "登録中..." : "登録"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              現在の店舗: <span className="font-semibold">{storeName}</span>
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p>読み込み中...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mb-4" />
              <p>メンテナンス履歴がありません</p>
              <p className="text-sm">「メンテナンスを追加」ボタンから追加してください</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>題名</TableHead>
                  <TableHead>ファイル</TableHead>
                  <TableHead>登録日時</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.title}</TableCell>
                    <TableCell>
                      {record.file_name ? (
                        <a
                          href={`/api/maintenance/${record.id}/file`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <Download className="w-4 h-4" />
                          {record.file_name}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(record.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
