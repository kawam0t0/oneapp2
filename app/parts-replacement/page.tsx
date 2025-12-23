"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Package, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PartsReplacementRecord {
  id: number
  store_id: number
  store_name?: string
  position: string
  part_category: string
  part_name: string
  quantity: number
  notes: string | null
  replaced_at: string
  created_at: string
  warranty_remaining_days?: number
  is_under_warranty?: boolean
}

interface Store {
  id: number
  store_name: string
}

const PART_CATEGORIES = [
  { value: "リデューサー", label: "リデューサー" },
  { value: "モーター", label: "モーター" },
  { value: "電磁弁", label: "電磁弁" },
  { value: "その他", label: "その他" },
]

const POSITIONS = [
  { value: "助手席", label: "助手席" },
  { value: "運転席", label: "運転席" },
]

interface PartRow {
  id: string
  position: "助手席" | "運転席" | ""
  partCategory: string
  partName: string
  quantity: number
  notes: string
}

export default function PartsReplacementPage() {
  const router = useRouter()
  const [storeName, setStoreName] = useState<string>("")
  const [storeId, setStoreId] = useState<number | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [records, setRecords] = useState<PartsReplacementRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<PartsReplacementRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false) // Declare setIsAdmin here

  const [partRows, setPartRows] = useState<PartRow[]>([
    {
      id: crypto.randomUUID(),
      position: "",
      partCategory: "",
      partName: "",
      quantity: 1,
      notes: "",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [searchStoreId, setSearchStoreId] = useState<string>("all")
  const [searchDateFrom, setSearchDateFrom] = useState("")
  const [searchDateTo, setSearchDateTo] = useState("")
  const [selectedStoreId, setSelectedStoreId] = useState<string>("")
  const [showWarrantyOnly, setShowWarrantyOnly] = useState(false)
  const [replacedAt, setReplacedAt] = useState<string>(new Date().toISOString().split("T")[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        if (fetchedStoreId !== null) {
          const recordsRes = await fetch(`/api/parts-replacement?storeId=${fetchedStoreId}`)
          if (recordsRes.ok) {
            const recordsData = await recordsRes.json()
            setRecords(recordsData)
            setFilteredRecords(recordsData)
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

  useEffect(() => {
    let filtered = [...records]

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (searchStoreId && searchStoreId !== "all") {
      filtered = filtered.filter((record) => record.store_id.toString() === searchStoreId)
    }

    if (searchDateFrom) {
      filtered = filtered.filter((record) => record.replaced_at >= searchDateFrom)
    }
    if (searchDateTo) {
      filtered = filtered.filter((record) => record.replaced_at <= searchDateTo)
    }

    if (showWarrantyOnly) {
      filtered = filtered.filter((record) => record.is_under_warranty)
    }

    setFilteredRecords(filtered)
  }, [records, searchTerm, searchStoreId, searchDateFrom, searchDateTo, showWarrantyOnly])

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
      const response = await fetch(`/api/parts-replacement?storeId=${storeId}`)
      if (response.ok) {
        const data = await response.json()
        setRecords(data)
        setFilteredRecords(data)
      }
    } catch (error) {
      console.error("Error fetching records:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStoreId || !replacedAt) {
      toast({
        title: "エラー",
        description: "店舗と交換日を入力してください",
        variant: "destructive",
      })
      return
    }

    for (const row of partRows) {
      if (!row.partCategory || (row.partCategory === "その他" && !row.partName)) {
        toast({
          title: "エラー",
          description: "全ての部品のカテゴリを入力してください",
          variant: "destructive",
        })
        return
      }
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/parts-replacement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId: Number.parseInt(selectedStoreId),
          replacedAt,
          parts: partRows.map((row) => ({
            position: row.position,
            partCategory: row.partCategory,
            partName: row.partCategory === "その他" ? row.partName : row.partCategory,
            quantity: row.quantity || 1,
            notes: row.notes.trim() || null,
          })),
        }),
      })

      if (response.ok) {
        toast({
          title: "登録成功",
          description: `${partRows.length}件の部品交換履歴を登録しました`,
        })
        setPartRows([
          {
            id: crypto.randomUUID(),
            position: "",
            partCategory: "",
            partName: "",
            quantity: 1,
            notes: "",
          },
        ])
        setReplacedAt(new Date().toISOString().split("T")[0])
        setIsDialogOpen(false)
        fetchRecords()
      } else {
        const errorData = await response.json()
        toast({
          title: "登録失敗",
          description: errorData.error || "登録に失敗しました",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error submitting parts replacement:", error)
      toast({
        title: "エラー",
        description: "登録中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (recordId: number) => {
    if (!confirm("この部品交換履歴を削除してもよろしいですか？")) {
      return
    }

    try {
      const response = await fetch(`/api/parts-replacement?id=${recordId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "削除成功",
          description: "部品交換履歴を削除しました",
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const addPartRow = () => {
    setPartRows([
      ...partRows,
      {
        id: crypto.randomUUID(),
        position: "",
        partCategory: "",
        partName: "",
        quantity: 1,
        notes: "",
      },
    ])
  }

  const removePartRow = (id: string) => {
    if (partRows.length === 1) {
      toast({
        title: "エラー",
        description: "最低1つの部品が必要です",
        variant: "destructive",
      })
      return
    }
    setPartRows(partRows.filter((row) => row.id !== id))
  }

  const updatePartRow = (id: string, field: keyof PartRow, value: string | number) => {
    setPartRows(
      partRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    )
  }

  if (!storeName) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">部品交換履歴</h1>
          <p className="text-sm text-gray-500 mt-1">{isAdmin ? "全店舗" : storeName}の部品交換履歴を管理</p>
        </div>

        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                部品交換を報告
              </Button>
            </DialogTrigger>
            <DialogContent className="border-t-4 border-t-blue-600 max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="bg-blue-50 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
                <DialogTitle className="text-blue-800">部品交換履歴を追加</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="store" className="text-blue-800 font-medium">
                      店舗 <span className="text-red-500">*</span>
                    </Label>
                    <Select value={storeId?.toString() || ""} onValueChange={setSelectedStoreId}>
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
                    <Label htmlFor="replacedAt" className="text-blue-800 font-medium">
                      交換日 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="replacedAt"
                      type="date"
                      value={replacedAt}
                      onChange={(e) => setReplacedAt(e.target.value)}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-800">交換部品</h3>
                    <Button
                      type="button"
                      onClick={addPartRow}
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      部品を追加
                    </Button>
                  </div>

                  {partRows.map((row, index) => (
                    <div key={row.id} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white relative">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-700">部品 #{index + 1}</h4>
                        {partRows.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removePartRow(row.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">位置</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            onClick={() => updatePartRow(row.id, "position", "助手席")}
                            variant={row.position === "助手席" ? "default" : "outline"}
                            className={`w-full text-sm ${
                              row.position === "助手席" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300"
                            }`}
                          >
                            助手席
                          </Button>
                          <Button
                            type="button"
                            onClick={() => updatePartRow(row.id, "position", "運転席")}
                            variant={row.position === "運転席" ? "default" : "outline"}
                            className={`w-full text-sm ${
                              row.position === "運転席" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300"
                            }`}
                          >
                            運転席
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          部品カテゴリ <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={row.partCategory}
                          onValueChange={(value) => updatePartRow(row.id, "partCategory", value)}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="カテゴリを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {PART_CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {row.partCategory === "その他" && (
                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">
                            部品名 <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={row.partName}
                            onChange={(e) => updatePartRow(row.id, "partName", e.target.value)}
                            placeholder="部品名を入力"
                            className="border-gray-300 focus:border-blue-500"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">数量</Label>
                        <Input
                          type="number"
                          min="1"
                          value={row.quantity}
                          onChange={(e) => updatePartRow(row.id, "quantity", Number.parseInt(e.target.value) || 1)}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">備考</Label>
                        <Textarea
                          value={row.notes}
                          onChange={(e) => updatePartRow(row.id, "notes", e.target.value)}
                          placeholder="備考を入力"
                          rows={2}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    variant="outline"
                    className="border-gray-300 w-full sm:w-auto"
                  >
                    キャンセル
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  >
                    {isSubmitting ? "登録中..." : `${partRows.length}件を登録`}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">検索・フィルター</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>キーワード検索</Label>
              <Input
                placeholder="部品名、店舗名、備考で検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-200"
              />
            </div>

            {isAdmin && (
              <div className="space-y-2">
                <Label>店舗</Label>
                <Select value={searchStoreId} onValueChange={setSearchStoreId}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder="全店舗" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全店舗</SelectItem>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id.toString()}>
                        {store.store_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>交換日（開始）</Label>
              <Input
                type="date"
                value={searchDateFrom}
                onChange={(e) => setSearchDateFrom(e.target.value)}
                className="border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label>交換日（終了）</Label>
              <Input
                type="date"
                value={searchDateTo}
                onChange={(e) => setSearchDateTo(e.target.value)}
                className="border-gray-200"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={showWarrantyOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowWarrantyOnly(!showWarrantyOnly)}
              className={showWarrantyOnly ? "bg-red-600 hover:bg-red-700" : ""}
            >
              保証期間中のみ
            </Button>
            {(searchTerm || searchStoreId !== "all" || searchDateFrom || searchDateTo || showWarrantyOnly) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setSearchStoreId("all")
                  setSearchDateFrom("")
                  setSearchDateTo("")
                  setShowWarrantyOnly(false)
                }}
              >
                <X className="w-4 h-4 mr-1" />
                クリア
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          {isAdmin ? (
            <span className="font-semibold">全店舗の履歴を表示中</span>
          ) : (
            <>
              現在の店舗: <span className="font-semibold">{storeName}</span>
            </>
          )}
          {showWarrantyOnly && <span className="ml-2 text-green-700 font-semibold">（保証期間中のみ）</span>}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <p>読み込み中...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Package className="w-12 h-12 mb-4" />
          <p>部品交換履歴がありません</p>
          <p className="text-sm">「部品交換を報告」ボタンから追加してください</p>
        </div>
      ) : (
        <>
          {/* デスクトップ表示 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      店舗名
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    位置
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    部品カテゴリ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    部品名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    数量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    交換日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    保証状況
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    備考
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録日時
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.store_name || "-"}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.part_category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.part_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.replaced_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {record.is_under_warranty ? (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          保証期間中 (残り{record.warranty_remaining_days}日)
                        </Badge>
                      ) : (
                        <Badge variant="secondary">保証期間外</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm max-w-xs truncate text-gray-500">
                      {record.notes || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.created_at)}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* スマホ表示 */}
          <div className="md:hidden space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className={`bg-white rounded-lg p-4 border-2 shadow-sm ${
                  record.is_under_warranty ? "border-green-200" : "border-blue-100"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    {isAdmin && record.store_name && (
                      <div className="mb-2 bg-blue-50 inline-block px-2 py-1 rounded">
                        <span className="text-xs font-medium text-blue-700">{record.store_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {record.position}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {record.part_category}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1 break-words">{record.part_name}</h3>
                    {record.is_under_warranty ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-xs mb-2">
                        保証期間中 (残り{record.warranty_remaining_days}日)
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs mb-2">
                        保証期間外
                      </Badge>
                    )}
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2 flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 font-medium min-w-[60px]">数量:</span>
                    <span className="text-gray-900 text-sm">{record.quantity}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 font-medium min-w-[60px]">交換日:</span>
                    <span className="text-gray-900 text-sm">{formatDate(record.replaced_at)}</span>
                  </div>
                  {record.notes && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-500 font-medium min-w-[60px]">備考:</span>
                      <span className="text-gray-900 text-sm break-words flex-1">{record.notes}</span>
                    </div>
                  )}
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
    </div>
  )
}
