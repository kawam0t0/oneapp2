"use client"

import React from "react"
import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Printer, Loader2 } from "lucide-react"

interface Customer {
  customer_ref_id: string | null
  customer_name: string | null
  car_info: string | null
  car_color: string | null
  last_details: string | null
}

export default function CustomerSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState<number | null>(null)
  const [editedCustomerName, setEditedCustomerName] = useState<string>("")
  const [printStatus, setPrintStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [printMessage, setPrintMessage] = useState<string>("")
  const [selectedCustomerIndices, setSelectedCustomerIndices] = useState<number[]>([])
  const [editedCustomerData, setEditedCustomerData] = useState<{ customer_ref_id: string | null, customer_name: string | null, car_info: string | null, car_color: string | null } | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return
    }

    setIsSearching(true)
    setHasSearched(true)
    setSelectedCustomerIndex(null) // 検索時に選択をリセット
    setEditedCustomerData(null) // 編集内容もリセット

    try {
      const response = await fetch(`/api/customers/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (data.customers) {
        setCustomers(data.customers)
      } else {
        setCustomers([])
      }
    } catch (error) {
      console.error("検索エラー:", error)
      setCustomers([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleCheckboxChange = (index: number) => {
    if (selectedCustomerIndex === index) {
      setSelectedCustomerIndex(null)
      setEditedCustomerData(null)
    } else {
      setSelectedCustomerIndex(index)
      // 選択時にトリミング後のデータを初期値として設定
      const customer = customers[index]
      setEditedCustomerData({
        customer_ref_id: customer.customer_ref_id || "",
        customer_name: trimCustomerName(customer.customer_name),
        car_info: customer.car_info || "",
        car_color: customer.car_color || "",
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // 顧客名をトリミングする関数（全角カタカナと空白のみ抽出）
  const trimCustomerName = (name: string | null): string => {
    if (!name) return ""
    
    // 1. まず特殊記号とその中身を削除
    let cleaned = name
    cleaned = cleaned.replace(/【[^】]*】/g, "") // 【】とその中身
    cleaned = cleaned.replace(/『[^』]*』/g, "") // 『』とその中身
    cleaned = cleaned.replace(/\[[^\]]*\]/g, "") // []とその中身
    cleaned = cleaned.replace(/\([^)]*\)/g, "") // ()とその中身
    cleaned = cleaned.replace(/（[^）]*）/g, "") // （）とその中身
    
    // 2. スラッシュ（/）がある場合、最後のスラッシュより後ろの部分のみを使用
    if (cleaned.includes("/")) {
      cleaned = cleaned.split("/").pop() || cleaned
    }
    
    // 3. 全角カタカナ（ァ-ヶ）と長音記号と空白のみを抽出
    const katakanaOnly = cleaned.match(/[ァ-ヶー\s　]+/g)
    if (!katakanaOnly) return ""
    
    // 4. 抽出した文字列を結合し、連続するスペースを1つにまとめてトリム
    const result = katakanaOnly.join("").replace(/\s+/g, " ").trim()
    return result
  }

  const handlePrint = async () => {
    if (selectedCustomerIndex === null || !editedCustomerData) return

    try {
      setPrintStatus("sending")
      setPrintMessage("印刷ジョブを送信中...")

      // 編集されたデータを使用
      const selectedCustomers = [editedCustomerData]

      // ローカルのFastAPIサービスに送信
      const res = await fetch("http://127.0.0.1:8000/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCustomers),
      })

      if (!res.ok) {
        const text = await res.text()
        setPrintStatus("error")
        setPrintMessage(`送信失敗: ${text}`)
        return
      }

      const data = await res.json()
      setPrintStatus("success")
      setPrintMessage(
        `送信完了：${data.count ?? selectedCustomers.length}件を印刷キューへ追加しました`
      )
    } catch (e: any) {
      setPrintStatus("error")
      setPrintMessage(`送信エラー: ${e?.message ?? String(e)}`)
    }
  }

  // 選択された顧客（単一選択）
  const selectedCustomer = selectedCustomerIndex !== null ? customers[selectedCustomerIndex] : null

  // Declare the variables before using them
  const trimmedSelectedCustomers = customers.map((customer, index) => ({
    ...customer,
    customer_name: trimCustomerName(customer.customer_name)
  }))
  const selectedCustomers = customers.filter((_, index) => selectedCustomerIndices.includes(index))

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6 print:hidden">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">顧客検索</h1>
          <p className="text-gray-600">顧客ID・氏名で検索できます</p>
        </div>

        {/* 検索バー */}
        <Card className="p-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="顧客ID または 顧客名を入力"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-lg"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-6"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  検索中...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  検索
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* 検索結果 */}
        {hasSearched && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                検索結果: {customers.length}件
                {selectedCustomerIndex !== null && ` (選択中: 1件)`}
              </h2>
              <Button
                onClick={handlePrint}
                variant="outline"
                disabled={selectedCustomerIndex === null || printStatus === "sending"}
                className="gap-2 bg-transparent"
              >
                {printStatus === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    送信中...
                  </>
                ) : (
                  <>
                    <Printer className="h-4 w-4" />
                    選択した顧客を印刷
                  </>
                )}
              </Button>
            </div>

            {/* トリミング後の選択顧客プレビュー（全項目編集可能） */}
            {selectedCustomer && editedCustomerData && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">
                  印刷対象（トリミング後・全項目編集可能）
                </h3>
                <div className="bg-white p-4 rounded border border-blue-100">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        顧客ID
                      </label>
                      <input
                        type="text"
                        value={editedCustomerData.customer_ref_id}
                        onChange={(e) =>
                          setEditedCustomerData({
                            ...editedCustomerData,
                            customer_ref_id: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="顧客ID"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        顧客名
                      </label>
                      <input
                        type="text"
                        value={editedCustomerData.customer_name}
                        onChange={(e) =>
                          setEditedCustomerData({
                            ...editedCustomerData,
                            customer_name: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="顧客名"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        車種
                      </label>
                      <input
                        type="text"
                        value={editedCustomerData.car_info}
                        onChange={(e) =>
                          setEditedCustomerData({
                            ...editedCustomerData,
                            car_info: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="車種"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        カラー
                      </label>
                      <input
                        type="text"
                        value={editedCustomerData.car_color}
                        onChange={(e) =>
                          setEditedCustomerData({
                            ...editedCustomerData,
                            car_color: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="カラー"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 印刷ステータスメッセージ */}
            {printStatus !== "idle" && (
              <div
                className={`mb-4 text-sm ${
                  printStatus === "success"
                    ? "text-green-700"
                    : printStatus === "error"
                      ? "text-red-700"
                      : "text-gray-700"
                }`}
              >
                {printMessage}
              </div>
            )}

            {customers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                検索結果がありません
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 w-16">
                        選択
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        リファランスID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        顧客名
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        車種
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        カラー
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        コース名
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          selectedCustomerIndex === index ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedCustomerIndex === index}
                            onChange={() => handleCheckboxChange(index)}
                            className="w-5 h-5 cursor-pointer accent-blue-600"
                          />
                        </td>
                        <td className="py-3 px-4">
                          {customer.customer_ref_id || "-"}
                        </td>
                        <td className="py-3 px-4">
                          {customer.customer_name || "-"}
                        </td>
                        <td className="py-3 px-4">
                          {customer.car_info || "-"}
                        </td>
                        <td className="py-3 px-4">
                          {customer.car_color || "-"}
                        </td>
                        <td className="py-3 px-4">
                          {customer.last_details || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* 印刷用レイアウト */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold mb-6">顧客情報</h1>
        {selectedCustomers.length === 0 ? (
          <p>選択された顧客がありません</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 py-2 px-4 text-left">
                  リファランスID
                </th>
                <th className="border border-gray-300 py-2 px-4 text-left">
                  顧客名
                </th>
                <th className="border border-gray-300 py-2 px-4 text-left">
                  車種
                </th>
                <th className="border border-gray-300 py-2 px-4 text-left">
                  カラー
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedCustomers.map((customer, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 py-2 px-4">
                    {customer.customer_ref_id || "-"}
                  </td>
                  <td className="border border-gray-300 py-2 px-4">
                    {customer.customer_name || "-"}
                  </td>
                  <td className="border border-gray-300 py-2 px-4">
                    {customer.car_info || "-"}
                  </td>
                  <td className="border border-gray-300 py-2 px-4">
                    {customer.car_color || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppLayout>
  )
}
