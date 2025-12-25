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
import { AppLayout } from "@/components/app-layout" // AppLayoutをインポートしてヘッダーを表示

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
  { value: "ハイプレッシャー", label: "ハイプレッシャー" },
  { value: "リアプレッシャー", label: "リアプレッシャー" },
  { value: "ホイールブラシ", label: "ホイールブラシ" },
  { value: "フロントショートブラシ", label: "フロントショートブラシ" },
  { value: "バックショートブラシ", label: "バックショートブラシ" },
  { value: "トップブラシ", label: "トップブラシ" },
  { value: "ミドルブラシ", label: "ミドルブラシ" },
  { value: "レフトブラシ", label: "レフトブラシ" },
  { value: "ライトブラシ", label: "ライトブラシ" },
  { value: "昇降ブロワー", label: "昇降ブロワー" },
  { value: "ブロワー", label: "ブロワー" },
  { value: "センサー", label: "センサー" },
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

interface PartsReplacement {
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

export default function PartsReplacementPage() {
  const router = useRouter()
  const [storeName, setStoreName] = useState<string>("")
  const [storeId, setStoreId] = useState<number | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [partRows, setPartRows] = useState<PartRow[]>([
    {
      id: Date.now().toString(),
      position: "",
      partCategory: "",
      partName: "",
      quantity: 1,
      notes: "",
    },
  ])
  const [records, setRecords] = useState<PartsReplacement[]>([])
  const [filteredRecords, setFilteredRecords] = useState<PartsReplacement[]>([])
  const [loading, setLoading] = useState(true)

  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({})

  const [searchKeyword, setSearchKeyword] = useState("")
  const [filterStoreId, setFilterStoreId] = useState<number | null>(null)
  const [filterStartDate, setFilterStartDate] = useState<string>("")
  const [filterEndDate, setFilterEndDate] = useState<string>("")
  const [showWarrantyOnly, setShowWarrantyOnly] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await fetch("/api/auth/session")
        if (!sessionRes.ok) {
          console.error("Failed to fetch session")
          setLoading(false)
          return
        }

        const sessionData = await sessionRes.json()
        const fetchedStoreName = sessionData.store_name || ""
        const fetchedStoreId = sessionData.store_id ?? null
        const fetchedIsAdmin = fetchedStoreId === 0

        setStoreName(fetchedStoreName)
        setStoreId(fetchedStoreId)
        setSelectedStoreId(fetchedStoreId)
        setIsAdmin(fetchedIsAdmin)

        if (fetchedStoreId !== null) {
          const recordsRes = await fetch(`/api/parts-replacement?storeId=${fetchedStoreId}`)
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
        setLoading(false)
      }
    }

    fetchData()
    fetchStores()
  }, [])

  useEffect(() => {
    setFilteredRecords(records)
  }, [records])

  useEffect(() => {
    let filtered = [...records]

    if (searchKeyword) {
      filtered = filtered.filter(
        (record) =>
          record.part_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          record.store_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          record.notes?.toLowerCase().includes(searchKeyword.toLowerCase()),
      )
    }

    if (filterStoreId !== null) {
      filtered = filtered.filter((record) => record.store_id === filterStoreId)
    }

    if (filterStartDate) {
      filtered = filtered.filter((record) => record.replaced_at >= filterStartDate)
    }
    if (filterEndDate) {
      filtered = filtered.filter((record) => record.replaced_at <= filterEndDate)
    }

    if (showWarrantyOnly) {
      filtered = filtered.filter((record) => record.is_under_warranty)
    }

    setFilteredRecords(filtered)
  }, [records, searchKeyword, filterStoreId, filterStartDate, filterEndDate, showWarrantyOnly])

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
      setLoading(true)
      const response = await fetch(`/api/parts-replacement?storeId=${storeId}`)
      if (response.ok) {
        const data = await response.json()
        setRecords(data)
      }
    } catch (error) {
      console.error("Error fetching records:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStoreId || !selectedDate) {
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

    try {
      const response = await fetch("/api/parts-replacement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId: selectedStoreId,
          replacedAt: selectedDate.toISOString().split("T")[0],
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
            id: Date.now().toString(),
            position: "",
            partCategory: "",
            partName: "",
            quantity: 1,
            notes: "",
          },
        ])
        setSelectedDate(new Date())
        setIsAddDialogOpen(false)
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
        id: Date.now().toString(),
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

  const handleAddOpen = () => {
    setSelectedStoreId(storeId)
    setSelectedDate(new Date())
    setPartRows([
      {
        id: Date.now().toString(),
        position: "",
        partCategory: "",
        partName: "",
        quantity: 1,
        notes: "",
      },
    ])
    setIsAddDialogOpen(true)
  }

  const toggleNotes = (recordId: number) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }))
  }

  const getNotesLineCount = (notes: string | null) => {
    if (!notes) return 0
    return notes.split("\n").length
  }

  const renderNotes = (notes: string | null, recordId: number) => {
    if (!notes) return "-"

    const lines = notes.split("\n")
    const isExpanded = expandedNotes[recordId]
    const shouldCollapse = lines.length > 3

    if (shouldCollapse && !isExpanded) {
      return (
        <div className="space-y-1">
          <div className="whitespace-pre-wrap">{lines.slice(0, 3).join("\n")}</div>
          <button
            onClick={() => toggleNotes(recordId)}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            もっと見る
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-1">
        <div className="whitespace-pre-wrap">{notes}</div>
        {shouldCollapse && (
          <button
            onClick={() => toggleNotes(recordId)}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            閉じる
          </button>
        )}
      </div>
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
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">部品交換履歴</h1>
            <p className="text-sm text-gray-500 mt-1">{isAdmin ? "全店舗" : storeName}の部品交換履歴を管理</p>
          </div>

          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto" onClick={handleAddOpen}>
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
                      <Select
                        value={selectedStoreId?.toString()}
                        onValueChange={(value) => setSelectedStoreId(Number.parseInt(value))}
                      >
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
                        value={selectedDate.toISOString().split("T")[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
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
                          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                            一式
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">備考</Label>
                          <Textarea
                            value={row.notes}
                            onChange={(e) => updatePartRow(row.id, "notes", e.target.value)}
                            placeholder="備考を入力（複数行可）"
                            rows={4}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      onClick={() => setIsAddDialogOpen(false)}
                      variant="outline"
                      className="border-gray-300 w-full sm:w-auto"
                    >
                      キャンセル
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                      {partRows.length}件を登録
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
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="border-gray-200"
                />
              </div>

              {isAdmin && (
                <div className="space-y-2">
                  <Label>店舗</Label>
                  <Select
                    value={filterStoreId?.toString()}
                    onValueChange={(value) => setFilterStoreId(value === "all" ? null : Number.parseInt(value))}
                  >
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
              {(searchKeyword || filterStoreId !== null || filterStartDate || filterEndDate || showWarrantyOnly) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchKeyword("")
                    setFilterStoreId(null)
                    setFilterStartDate("")
                    setFilterEndDate("")
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

        {loading ? (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">一式</td>
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
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                        {renderNotes(record.notes, record.id)}
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
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
                      <span className="text-gray-900 text-sm">一式</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-500 font-medium min-w-[60px]">交換日:</span>
                      <span className="text-gray-900 text-sm">{formatDate(record.replaced_at)}</span>
                    </div>
                    {record.notes && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-500 font-medium min-w-[60px]">備考:</span>
                        <div className="text-gray-900 text-sm break-words flex-1">
                          {renderNotes(record.notes, record.id)}
                        </div>
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
    </AppLayout>
  )
}
