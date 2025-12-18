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
import { Plus, FileText, Download, ArrowLeft, ImageIcon, Trash2 } from "lucide-react"
import { MaintenanceImageGenerator } from "@/components/maintenance-image-generator"
import { SingleStoreMaintenanceImageGenerator } from "@/components/single-store-maintenance-image-generator"
import { useToast } from "@/hooks/use-toast"

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
  const [isImageGeneratorOpen, setIsImageGeneratorOpen] = useState(false)
  const [isSingleStoreImageGeneratorOpen, setIsSingleStoreImageGeneratorOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const titleOptions = ["マンスリーメンテナンス結果報告", "定期メンテナンス結果報告"]

  const { toast } = useToast()

  const handleDelete = async (recordId: number) => {
    if (!confirm("このメンテナンス履歴を削除してもよろしいですか？")) {
      return
    }

    try {
      const response = await fetch(`/api/maintenance?id=${recordId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "削除成功",
          description: "メンテナンス履歴を削除しました",
        })
        fetchRecords()
      } else {
        const errorData = await response.json()
        toast({
          title: "削除失敗",
          description: errorData.error || "削除に失敗しました",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting record:", error)
      toast({
        title: "エラー",
        description: "削除中にエラーが発生しました",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // セッション取得
        const sessionRes = await fetch("/api/auth/session")
        if (!sessionRes.ok) {
          console.error("Failed to fetch session")
          setIsLoading(false)
          return
        }

        const sessionData = await sessionRes.json()
        const fetchedStoreName = sessionData.store_name || ""
        const fetchedStoreId = sessionData.store_id ?? null
        const fetchedIsAdmin = fetchedStoreId === 0

        setStoreName(fetchedStoreName)
        setStoreId(fetchedStoreId)
        setSelectedStoreId(fetchedStoreId?.toString() || "")
        setIsAdmin(fetchedIsAdmin)

        // レコード取得
        if (fetchedStoreId !== null) {
          const recordsRes = await fetch(`/api/maintenance?storeId=${fetchedStoreId}`)
          if (recordsRes.ok) {
            const recordsData = await recordsRes.json()
            setRecords(recordsData)
          } else {
            console.error("Failed to fetch records")
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    fetchStores()
  }, [])

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
    if (storeId === null) return

    try {
      setIsLoading(true)
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
    <div className="container mx-auto p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 space-y-0">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              戻る
            </Button>
            <CardTitle className="text-xl md:text-2xl font-bold">メンテナンス履歴</CardTitle>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {isAdmin ? (
              <Button
                onClick={() => setIsImageGeneratorOpen(true)}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                メンテ画像生成
              </Button>
            ) : (
              <Button
                onClick={() => setIsSingleStoreImageGeneratorOpen(true)}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                メンテ画像生成
              </Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {isAdmin ? (
                <span className="font-semibold">全店舗の履歴を表示中</span>
              ) : (
                <>
                  現在の店舗: <span className="font-semibold">{storeName}</span>
                </>
              )}
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
            <>
              {/* デスクトップ表示 */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isAdmin && <TableHead>店舗名</TableHead>}
                      <TableHead>題名</TableHead>
                      <TableHead>ファイル</TableHead>
                      <TableHead>登録日時</TableHead>
                      {isAdmin && <TableHead className="text-right">操作</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        {isAdmin && <TableCell className="font-medium">{record.store_name || "-"}</TableCell>}
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
                        {isAdmin && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* スマホ表示 */}
              <div className="md:hidden space-y-4">
                {records.map((record) => (
                  <div key={record.id} className="bg-white rounded-lg p-4 border-2 border-blue-100 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        {isAdmin && record.store_name && (
                          <div className="mb-2 bg-blue-50 inline-block px-2 py-1 rounded">
                            <span className="text-xs font-medium text-blue-700">{record.store_name}</span>
                          </div>
                        )}
                        <h3 className="font-bold text-gray-900 text-base mb-1 break-words">{record.title}</h3>
                      </div>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 ml-2 flex-shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-500 font-medium min-w-[60px]">ファイル:</span>
                        <div className="flex-1 min-w-0">
                          {record.file_name ? (
                            <a
                              href={`/api/maintenance/${record.id}/file`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm break-all"
                            >
                              <Download className="w-4 h-4 flex-shrink-0" />
                              <span className="break-all">{record.file_name}</span>
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-500 font-medium min-w-[60px]">登録日時:</span>
                        <span className="text-gray-900 text-sm">{formatDate(record.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <MaintenanceImageGenerator isOpen={isImageGeneratorOpen} onClose={() => setIsImageGeneratorOpen(false)} />
      )}

      {!isAdmin && (
        <SingleStoreMaintenanceImageGenerator
          isOpen={isSingleStoreImageGeneratorOpen}
          onClose={() => setIsSingleStoreImageGeneratorOpen(false)}
          storeName={storeName}
        />
      )}
    </div>
  )
}
