"use client"

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// 藤岡大塚店: 37日間、鹿児島中山店: 32日間
// 藤岡大塚の37日目までKSCは32日分のみ
const DAILY_DATA: {
  day: string
  kscWeather: string | null
  kscIn: number | null
  kscCar: number | null
  foWeather: string | null
  foIn: number | null
  foCar: number | null
}[] = [
  { day: "1日目",  kscWeather: "晴/曇", kscIn: 91,  kscCar: 452, foWeather: "晴",    foIn: 32,  foCar: 448 },
  { day: "2日目",  kscWeather: "晴",    kscIn: 68,  kscCar: 464, foWeather: "晴",    foIn: 31,  foCar: 430 },
  { day: "3日目",  kscWeather: "曇",    kscIn: 43,  kscCar: 459, foWeather: "曇/雨", foIn: 17,  foCar: 320 },
  { day: "4日目",  kscWeather: "雨",    kscIn: 83,  kscCar: 468, foWeather: "晴",    foIn: 17,  foCar: 401 },
  { day: "5日目",  kscWeather: "晴",    kscIn: 56,  kscCar: 449, foWeather: "曇",    foIn: 14,  foCar: 367 },
  { day: "6日目",  kscWeather: "雨",    kscIn: 31,  kscCar: 430, foWeather: "曇/雨", foIn: 10,  foCar: 288 },
  { day: "7日目",  kscWeather: "雨",    kscIn: 36,  kscCar: 395, foWeather: "曇/雨", foIn: 15,  foCar: 189 },
  { day: "8日目",  kscWeather: "晴",    kscIn: 29,  kscCar: 460, foWeather: "晴",    foIn: 30,  foCar: 426 },
  { day: "9日目",  kscWeather: "晴",    kscIn: 22,  kscCar: 465, foWeather: "晴",    foIn: 18,  foCar: 378 },
  { day: "10日目", kscWeather: "晴/曇", kscIn: 34,  kscCar: 505, foWeather: "晴",    foIn: 21,  foCar: 427 },
  { day: "11日目", kscWeather: "晴/曇", kscIn: 46,  kscCar: 520, foWeather: "晴",    foIn: 12,  foCar: 423 },
  { day: "12日目", kscWeather: "晴/曇", kscIn: 21,  kscCar: 390, foWeather: "晴",    foIn: 37,  foCar: 436 },
  { day: "13日目", kscWeather: "晴",    kscIn: 19,  kscCar: 426, foWeather: "晴",    foIn: 26,  foCar: 418 },
  { day: "14日目", kscWeather: "雨",    kscIn: 20,  kscCar: 328, foWeather: "晴/雨", foIn: 28,  foCar: 357 },
  { day: "15日目", kscWeather: "晴",    kscIn: 48,  kscCar: 458, foWeather: "晴",    foIn: 48,  foCar: 454 },
  { day: "16日目", kscWeather: "晴/雨", kscIn: 31,  kscCar: 421, foWeather: "晴",    foIn: 77,  foCar: 417 },
  { day: "17日目", kscWeather: "晴/雨", kscIn: 47,  kscCar: 460, foWeather: "晴",    foIn: 54,  foCar: 431 },
  { day: "18日目", kscWeather: "晴",    kscIn: 52,  kscCar: 522, foWeather: "晴",    foIn: 38,  foCar: 380 },
  { day: "19日目", kscWeather: "曇",    kscIn: 53,  kscCar: 450, foWeather: "晴",    foIn: 49,  foCar: 342 },
  { day: "20日目", kscWeather: "晴",    kscIn: 46,  kscCar: 438, foWeather: "晴/雨", foIn: 49,  foCar: 422 },
  { day: "21日目", kscWeather: "晴",    kscIn: 41,  kscCar: 451, foWeather: "晴",    foIn: 51,  foCar: 452 },
  { day: "22日目", kscWeather: "曇/雨", kscIn: 57,  kscCar: 430, foWeather: "晴",    foIn: 63,  foCar: 459 },
  { day: "23日目", kscWeather: "曇/雨", kscIn: 40,  kscCar: 403, foWeather: "曇",    foIn: 71,  foCar: 444 },
  { day: "24日目", kscWeather: "晴",    kscIn: 65,  kscCar: 494, foWeather: "晴",    foIn: 51,  foCar: 430 },
  { day: "25日目", kscWeather: "雨",    kscIn: 105, kscCar: 498, foWeather: "晴",    foIn: 32,  foCar: 409 },
  { day: "26日目", kscWeather: "曇",    kscIn: 84,  kscCar: 485, foWeather: "晴",    foIn: 37,  foCar: 354 },
  { day: "27日目", kscWeather: "雨",    kscIn: 62,  kscCar: 457, foWeather: "曇/雨", foIn: 15,  foCar: 183 },
  { day: "28日目", kscWeather: "晴",    kscIn: 73,  kscCar: 453, foWeather: "曇",    foIn: 34,  foCar: 360 },
  { day: "29日目", kscWeather: "晴",    kscIn: 93,  kscCar: 483, foWeather: "曇",    foIn: 58,  foCar: 452 },
  { day: "30日目", kscWeather: "晴",    kscIn: 112, kscCar: 568, foWeather: "曇",    foIn: 69,  foCar: 462 },
  { day: "31日目", kscWeather: "晴/雨", kscIn: 257, kscCar: 583, foWeather: "晴",    foIn: 70,  foCar: 447 },
  { day: "32日目", kscWeather: "雨",    kscIn: 527, kscCar: 563, foWeather: "晴/曇", foIn: 67,  foCar: 402 },
  // 33日目以降はKSCなし
  { day: "33日目", kscWeather: null, kscIn: null, kscCar: null, foWeather: "晴/曇", foIn: 82,  foCar: 420 },
  { day: "34日目", kscWeather: null, kscIn: null, kscCar: null, foWeather: "曇",    foIn: 106, foCar: 441 },
  { day: "35日目", kscWeather: null, kscIn: null, kscCar: null, foWeather: "晴",    foIn: 140, foCar: 471 },
  { day: "36日目", kscWeather: null, kscIn: null, kscCar: null, foWeather: "晴",    foIn: 239, foCar: 479 },
  { day: "37日目", kscWeather: null, kscIn: null, kscCar: null, foWeather: "晴",    foIn: 561, foCar: 480 },
]

export function FujiokaOsukaDetail() {
  const kscRows = DAILY_DATA.filter((r) => r.kscIn !== null)
  const foRows  = DAILY_DATA.filter((r) => r.foIn  !== null)

  const kscTotal    = kscRows.reduce((s, r) => s + (r.kscIn  ?? 0), 0)
  const kscCarTotal = kscRows.reduce((s, r) => s + (r.kscCar ?? 0), 0)
  const foTotal     = foRows.reduce((s, r)  => s + (r.foIn   ?? 0), 0)
  const foCarTotal  = foRows.reduce((s, r)  => s + (r.foCar  ?? 0), 0)

  // 相関係数を計算
  const pearson = (xs: number[], ys: number[]) => {
    const n = xs.length
    const mx = xs.reduce((a, b) => a + b, 0) / n
    const my = ys.reduce((a, b) => a + b, 0) / n
    const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0)
    const den = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0) * ys.reduce((s, y) => s + (y - my) ** 2, 0))
    return den === 0 ? 0 : num / den
  }
  const kscR = pearson(kscRows.map(r => r.kscCar ?? 0), kscRows.map(r => r.kscIn ?? 0))
  const foR  = pearson(foRows.map(r  => r.foCar  ?? 0), foRows.map(r  => r.foIn  ?? 0))

  // 確定値で上書き（日別データの合計と若干異なる場合がある）
  const KSC_MEMBER_TOTAL = 2314
  const KSC_CAR_TOTAL    = 14828
  const FO_MEMBER_TOTAL  = 2323
  const FO_CAR_TOTAL     = 14899

  const summaryItems = [
    { label: "KSC 入会数 合計", value: `${KSC_MEMBER_TOTAL.toLocaleString()}人`, avg: (KSC_MEMBER_TOTAL / kscRows.length).toFixed(1), color: "text-blue-600" },
    { label: "KSC 台数 合計",   value: `${KSC_CAR_TOTAL.toLocaleString()}台`,   avg: (KSC_CAR_TOTAL / kscRows.length).toFixed(1),   color: "text-sky-600" },
    { label: "FO 入会数 合計",  value: `${FO_MEMBER_TOTAL.toLocaleString()}人`,  avg: (FO_MEMBER_TOTAL / foRows.length).toFixed(1),  color: "text-purple-600" },
    { label: "FO 台数 合計",    value: `${FO_CAR_TOTAL.toLocaleString()}台`,     avg: (FO_CAR_TOTAL / foRows.length).toFixed(1),     color: "text-violet-500" },
  ]

  return (
    <div className="mt-6 space-y-6">

      {/* サマリー */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryItems.map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
            <p className={`text-2xl font-black tabular-nums ${item.color}`}>{item.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">平均 {item.avg}/日</p>
          </div>
        ))}
      </div>

      {/* 複合グラフ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">KSC・藤岡大塚 日別 入会数 / 台数推移</h3>
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={DAILY_DATA} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} interval={3} tickLine={false} />
            <YAxis yAxisId="left"  orientation="left"  tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} label={{ value: "台数",   angle: -90, position: "insideLeft",  fontSize: 10, fill: "#9ca3af" }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} label={{ value: "入会数", angle: 90,  position: "insideRight", fontSize: 10, fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              formatter={(value: number, name: string) => {
                const labels: { [key: string]: string } = { kscCar: "KSC台数", kscIn: "KSC入会数", foCar: "藤岡台数", foIn: "藤岡入会数" }
                return [value != null ? value.toLocaleString() : "—", labels[name] ?? name]
              }}
            />
            <Legend formatter={(value) => {
              const labels: { [key: string]: string } = { kscCar: "KSC台数（棒）", kscIn: "KSC入会数（線）", foCar: "藤岡台数（棒）", foIn: "藤岡入会数（線）" }
              return <span className="text-xs text-gray-600">{labels[value] ?? value}</span>
            }} />
            <Bar  yAxisId="left"  dataKey="kscCar" fill="#93c5fd" radius={[2,2,0,0]} maxBarSize={8} name="kscCar" />
            <Bar  yAxisId="left"  dataKey="foCar"  fill="#c4b5fd" radius={[2,2,0,0]} maxBarSize={8} name="foCar" />
            <Line yAxisId="right" type="monotone" dataKey="kscIn" stroke="#2563eb" strokeWidth={2} dot={false} connectNulls={false} name="kscIn" />
            <Line yAxisId="right" type="monotone" dataKey="foIn"  stroke="#7c3aed" strokeWidth={2} dot={false} name="foIn" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 相関インジケーター */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">台数と入会数の相関</h3>
        <p className="text-xs text-gray-400 mb-4">入会数が多い日ほど台数も伸びる傾向があるか</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "鹿児島中山（KSC）", r: kscR, color: "text-blue-600" },
            { label: "藤岡大塚（FO）",    r: foR,  color: "text-purple-600" },
          ].map(({ label, r, color }) => {
            const strength = r >= 0.5 ? "強い相関あり" : r >= 0.3 ? "中程度の相関" : "相関は弱い"
            const bar      = r >= 0.5 ? "bg-green-500"  : r >= 0.3 ? "bg-yellow-400" : "bg-gray-300"
            const badge    = r >= 0.5 ? "bg-green-50 text-green-700 border-green-200"
                           : r >= 0.3 ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                           : "bg-gray-50 text-gray-500 border-gray-200"
            const barWidth = `${Math.min(Math.abs(r) * 100, 100).toFixed(0)}%`
            return (
              <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className={`text-xs font-semibold mb-3 ${color}`}>{label}</p>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-4xl font-black tabular-nums text-gray-800">{r.toFixed(2)}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border mb-1 ${badge}`}>{strength}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className={`h-2 rounded-full transition-all ${bar}`} style={{ width: barWidth }} />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>0（相関なし）</span>
                  <span>1（完全相関）</span>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-[10px] text-gray-400 mt-3">
          相関係数r（0〜1）。0.5以上: 強い正の相関、0.3〜0.5: 中程度、0.3未満: 弱い相関
        </p>
      </div>

      {/* 日別データテーブル */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">日別データ一覧</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500">
                <th className="px-4 py-3 text-left" rowSpan={2}>日付</th>
                <th className="px-4 py-2 text-center bg-blue-50 text-blue-700" colSpan={3}>鹿児島中山（KSC）</th>
                <th className="px-4 py-2 text-center bg-purple-50 text-purple-700" colSpan={3}>藤岡大塚（FO）</th>
              </tr>
              <tr className="bg-gray-50 text-xs text-gray-400 border-b border-gray-100">
                <th className="px-4 py-2 text-center bg-blue-50/50">天気</th>
                <th className="px-4 py-2 text-right bg-blue-50/50">入会数</th>
                <th className="px-4 py-2 text-right bg-blue-50/50">台数</th>
                <th className="px-4 py-2 text-center bg-purple-50/50">天気</th>
                <th className="px-4 py-2 text-right bg-purple-50/50">入会数</th>
                <th className="px-4 py-2 text-right bg-purple-50/50">台数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DAILY_DATA.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 text-gray-500 text-xs font-medium">{row.day}</td>
                  <td className="px-4 py-2 text-center text-xs text-gray-500">{row.kscWeather ?? "—"}</td>
                  <td className="px-4 py-2 text-right font-semibold text-blue-600">{row.kscIn ?? "—"}</td>
                  <td className="px-4 py-2 text-right text-gray-700">{row.kscCar?.toLocaleString() ?? "—"}</td>
                  <td className="px-4 py-2 text-center text-xs text-gray-500">{row.foWeather ?? "—"}</td>
                  <td className="px-4 py-2 text-right font-semibold text-purple-600">{row.foIn ?? "—"}</td>
                  <td className="px-4 py-2 text-right text-gray-700">{row.foCar?.toLocaleString() ?? "—"}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold border-t-2 border-gray-200 text-xs">
                <td className="px-4 py-3 text-gray-600">Total</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-blue-700">{kscTotal.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-700">{kscCarTotal.toLocaleString()}</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-purple-700">{foTotal.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-700">{foCarTotal.toLocaleString()}</td>
              </tr>
              <tr className="bg-gray-50 text-xs text-gray-500">
                <td className="px-4 py-2">Average</td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-right">{(kscTotal / kscRows.length).toFixed(1)}</td>
                <td className="px-4 py-2 text-right">{(kscCarTotal / kscRows.length).toFixed(1)}</td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-right">{(foTotal / foRows.length).toFixed(1)}</td>
                <td className="px-4 py-2 text-right">{(foCarTotal / foRows.length).toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
