"use client"

import { AppLayout } from "@/components/app-layout"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"


// ---- 店舗データ定義 ----

const STORES = {
  fo: {
    id: "fo",
    label: "藤岡大塚店",
    campaignLabel: "FOキャンペーン",
    courseColors: {
      "プレミアム": "#3b82f6",
      "プラス":     "#10b981",
      "ナイアガラ": "#f59e0b",
      "デラックス": "#8b5cf6",
    } as Record<string, string>,
    membershipData: [
      { course: "プレミアム", during: 735, after: 628, cancelled: 98  },
      { course: "プラス",     during: 825, after: 589, cancelled: 150 },
      { course: "ナイアガラ", during: 397, after: 310, cancelled: 42  },
      { course: "デラックス", during: 366, after: 194, cancelled: 50  },
    ],
    courseChanges: [
      { from: "プレミアム", to: "プラス",     count: 7  },
      { from: "プレミアム", to: "ナイアガラ",  count: 1  },
      { from: "プラス",     to: "プレミアム",  count: 59 },
      { from: "プラス",     to: "ナイアガラ",  count: 1  },
      { from: "ナイアガラ", to: "プレミアム",  count: 34 },
      { from: "ナイアガラ", to: "プラス",      count: 2  },
      { from: "デラックス", to: "プレミアム",  count: 35 },
      { from: "デラックス", to: "プラス",      count: 27 },
      { from: "デラックス", to: "ナイアガラ",  count: 37 },
    ],
  },
  kc: {
    id: "kc",
    label: "鹿児島中山店",
    campaignLabel: "KCキャンペーン",
    courseColors: {
      "プレミアム": "#3b82f6",
      "プラス":     "#10b981",
    } as Record<string, string>,
    membershipData: [
      { course: "プレミアム", during: 1273, after: 1187, cancelled: 86  },
      { course: "プラス",     during: 1041, after: 874,  cancelled: 167 },
    ],
    courseChanges: [
      { from: "プレミアム", to: "プラス",     count: 39  },
      { from: "プラス",     to: "プレミアム", count: 125 },
    ],
  },
} as const

type StoreKey = keyof typeof STORES

// ---- ツールチップ ----

const MembershipTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-bold text-gray-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}：{p.value.toLocaleString()}人
        </p>
      ))}
      {payload.length === 2 && (
        <p className="text-red-500 font-semibold mt-1 border-t border-gray-100 pt-1">
          退会：{(payload[0].value - payload[1].value).toLocaleString()}人
        </p>
      )}
    </div>
  )
}

const ChangeTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-bold text-gray-700 mb-2">{label} からの変更先</p>
      {payload.filter((p: any) => p.value > 0).map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          → {p.name}：{p.value}人
        </p>
      ))}
    </div>
  )
}

// ---- サマリーカード ----

function SummaryCard({
  label, value, sub, color,
}: {
  label: string; value: string; sub: string; color: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  )
}

// ---- 店舗セクション ----

function StoreSection({ store }: { store: typeof STORES[StoreKey] }) {
  const { campaignLabel, courseColors, membershipData, courseChanges } = store

  const totalDuring    = membershipData.reduce((s, d) => s + d.during,    0)
  const totalCancelled = membershipData.reduce((s, d) => s + d.cancelled, 0)
  // キャンペーン後合計 = キャンペーン中 - 退会者のみ（コース変更者は退会ではないので引かない）
  const totalAfter     = totalDuring - totalCancelled
  const retentionRate  = ((totalAfter / totalDuring) * 100).toFixed(1)
  const totalChanges   = courseChanges.reduce((s, d) => s + d.count, 0)

  return (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          label={`${campaignLabel}中 合計`}
          value={`${totalDuring.toLocaleString()}人`}
          sub="全コース合計"
          color="text-blue-600"
        />
        <SummaryCard
          label={`${campaignLabel}後 合計`}
          value={`${totalAfter.toLocaleString()}人`}
          sub="全コース合計"
          color="text-green-600"
        />
        <SummaryCard
          label="退会人数 合計"
          value={`${totalCancelled.toLocaleString()}人`}
          sub="全コース合計"
          color="text-red-500"
        />
        <SummaryCard
          label="継続率"
          value={`${retentionRate}%`}
          sub={`${totalDuring.toLocaleString()}人 → ${totalAfter.toLocaleString()}人`}
          color="text-purple-600"
        />
      </div>

      {/* グラフ1：コース別 会員数比較 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-700 mb-1">コース別 会員数比較</h2>
        <p className="text-xs text-gray-400 mb-5">{campaignLabel}中 → キャンペーン後の推移</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={membershipData.map((d) => ({
              name: d.course,
              "キャンペーン中": d.during,
              "キャンペーン後": d.after,
            }))}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            barCategoryGap="30%"
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip content={<MembershipTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="キャンペーン中" fill="#93c5fd" radius={[4, 4, 0, 0]} />
            <Bar dataKey="キャンペーン後"  fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* コース別退会カード */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {membershipData.map((d) => (
            <div key={d.course} className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
              <p className="text-xs text-gray-500 mb-1">{d.course}</p>
              <p className="text-xl font-black text-red-500">{d.cancelled}人</p>
              <p className="text-xs text-red-400 mt-0.5">
                退会率 {((d.cancelled / d.during) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ���ース変更内訳 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-700 mb-1">コース変更内訳</h2>
        <p className="text-xs text-gray-400 mb-5">
          合計{totalChanges}件
        </p>

        {/* コース変更 詳細テーブル */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium">変更元</th>
                <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium">変更先</th>
                <th className="text-right py-2 px-3 text-xs text-gray-400 font-medium">人数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courseChanges.filter((c) => c.count > 0).map((c, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-2 px-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: courseColors[c.from] ?? "#6b7280" }}
                    >
                      {c.from}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: courseColors[c.to] ?? "#6b7280" }}
                    >
                      {c.to}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-gray-700">{c.count}人</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200">
                <td colSpan={2} className="py-2 px-3 text-xs text-gray-500 font-bold">合計</td>
                <td className="py-2 px-3 text-right font-black text-gray-800">{totalChanges}人</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

// ---- ページ本体 ----

export default function CampaignAfterPage() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* ヘッダー */}
        <div>
          <h1 className="text-2xl font-black text-gray-800">キャンペーンその後</h1>
          <p className="text-sm text-gray-500 mt-1">キャンペーン終了後のコース別会員数変化・コース変更分析</p>
        </div>

        {/* 2店舗 横並び比較 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {(Object.keys(STORES) as StoreKey[]).map((key) => (
            <div key={key} className="space-y-4">
              {/* 店舗ヘッダー */}
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                <h2 className="text-lg font-black text-gray-800">{STORES[key].label}</h2>
                <span className="text-xs font-semibold text-white bg-blue-500 rounded-full px-2.5 py-0.5">
                  {STORES[key].campaignLabel}
                </span>
              </div>
              <StoreSection store={STORES[key]} />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
