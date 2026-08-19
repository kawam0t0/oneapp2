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

// KSCは32日、ONは53日。KSCのない日はnull
const DAILY_DATA: {
  day: string
  kscWeather: string | null
  kscIn: number | null
  kscCar: number | null
  onWeather: string | null
  onIn: number | null
  onCar: number | null
}[] = [
  { day: "1日目",  kscWeather: "晴/曇", kscIn: 91,  kscCar: 452, onWeather: "晴/曇", onIn: 43, onCar: 241 },
  { day: "2日目",  kscWeather: "晴",    kscIn: 68,  kscCar: 464, onWeather: "晴",    onIn: 38, onCar: 305 },
  { day: "3日目",  kscWeather: "曇",    kscIn: 43,  kscCar: 459, onWeather: "雨",    onIn: 26, onCar: 215 },
  { day: "4日目",  kscWeather: "雨",    kscIn: 83,  kscCar: 468, onWeather: "晴",    onIn: 32, onCar: 362 },
  { day: "5日目",  kscWeather: "晴",    kscIn: 56,  kscCar: 449, onWeather: "晴",    onIn: 23, onCar: 350 },
  { day: "6日目",  kscWeather: "雨",    kscIn: 31,  kscCar: 430, onWeather: "曇/雨", onIn: 10, onCar: 152 },
  { day: "7日目",  kscWeather: "雨",    kscIn: 36,  kscCar: 395, onWeather: "曇/雨", onIn:  9, onCar: 184 },
  { day: "8日目",  kscWeather: "晴",    kscIn: 29,  kscCar: 460, onWeather: "曇/雨", onIn:  4, onCar:  74 },
  { day: "9日目",  kscWeather: "晴",    kscIn: 22,  kscCar: 465, onWeather: "晴",    onIn: 18, onCar: 338 },
  { day: "10日目", kscWeather: "晴/曇", kscIn: 34,  kscCar: 505, onWeather: "晴",    onIn: 25, onCar: 372 },
  { day: "11日目", kscWeather: "晴/曇", kscIn: 46,  kscCar: 520, onWeather: "曇/雨", onIn: 28, onCar: 301 },
  { day: "12日目", kscWeather: "晴/曇", kscIn: 21,  kscCar: 390, onWeather: "晴",    onIn:  9, onCar: 236 },
  { day: "13日目", kscWeather: "晴",    kscIn: 19,  kscCar: 426, onWeather: "晴",    onIn: 11, onCar: 136 },
  { day: "14日目", kscWeather: "雨",    kscIn: 20,  kscCar: 328, onWeather: "晴/曇", onIn: 11, onCar: 145 },
  { day: "15日目", kscWeather: "晴",    kscIn: 48,  kscCar: 458, onWeather: "晴",    onIn: 13, onCar: 235 },
  { day: "16日目", kscWeather: "晴/雨", kscIn: 31,  kscCar: 421, onWeather: "晴",    onIn: 13, onCar: 162 },
  { day: "17日目", kscWeather: "晴/雨", kscIn: 47,  kscCar: 460, onWeather: "曇/雨", onIn:  5, onCar: 126 },
  { day: "18日目", kscWeather: "晴",    kscIn: 52,  kscCar: 522, onWeather: "雨",    onIn: 11, onCar: 177 },
  { day: "19日目", kscWeather: "曇",    kscIn: 53,  kscCar: 450, onWeather: "晴",    onIn: 15, onCar: 284 },
  { day: "20日目", kscWeather: "晴",    kscIn: 46,  kscCar: 438, onWeather: "晴",    onIn: 10, onCar: 216 },
  { day: "21日目", kscWeather: "晴",    kscIn: 41,  kscCar: 451, onWeather: "晴",    onIn: 11, onCar: 222 },
  { day: "22日目", kscWeather: "曇/雨", kscIn: 57,  kscCar: 430, onWeather: "晴",    onIn: 28, onCar: 159 },
  { day: "23日目", kscWeather: "曇/雨", kscIn: 40,  kscCar: 403, onWeather: "曇",    onIn:  6, onCar:  80 },
  { day: "24日目", kscWeather: "晴",    kscIn: 65,  kscCar: 494, onWeather: "晴",    onIn: 51, onCar: 318 },
  { day: "25日目", kscWeather: "雨",    kscIn: 105, kscCar: 498, onWeather: "晴",    onIn: 51, onCar: 291 },
  { day: "26日目", kscWeather: "曇",    kscIn: 84,  kscCar: 485, onWeather: "晴",    onIn: 37, onCar: 257 },
  { day: "27日目", kscWeather: "雨",    kscIn: 62,  kscCar: 457, onWeather: "晴",    onIn: 21, onCar: 167 },
  { day: "28日目", kscWeather: "晴",    kscIn: 73,  kscCar: 453, onWeather: "晴",    onIn: 16, onCar: 143 },
  { day: "29日目", kscWeather: "晴",    kscIn: 93,  kscCar: 483, onWeather: "晴",    onIn:  1, onCar: 148 },
  { day: "30日目", kscWeather: "晴",    kscIn: 112, kscCar: 568, onWeather: "晴",    onIn: 15, onCar: 147 },
  { day: "31日目", kscWeather: "晴/雨", kscIn: 257, kscCar: 583, onWeather: "晴",    onIn: 25, onCar: 247 },
  { day: "32日目", kscWeather: "雨",    kscIn: 527, kscCar: 563, onWeather: "雨",    onIn: 11, onCar:  99 },
  // 33日目以降はKSCなし
  { day: "33日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 14, onCar: 206 },
  { day: "34日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 12, onCar: 155 },
  { day: "35日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn:  9, onCar: 166 },
  { day: "36日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn:  8, onCar: 107 },
  { day: "37日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 14, onCar: 197 },
  { day: "38日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 35, onCar: 327 },
  { day: "39日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 24, onCar: 254 },
  { day: "40日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 11, onCar: 189 },
  { day: "41日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "定休日", onIn:  3, onCar:   0 },
  { day: "42日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn:  8, onCar: 165 },
  { day: "43日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn:  6, onCar: 172 },
  { day: "44日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 16, onCar: 196 },
  { day: "45日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 31, onCar: 311 },
  { day: "46日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 24, onCar: 279 },
  { day: "47日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 21, onCar: 259 },
  { day: "48日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "曇/雨", onIn:  3, onCar:  80 },
  { day: "49日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 14, onCar: 214 },
  { day: "50日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 29, onCar: 233 },
  { day: "51日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 24, onCar: 240 },
  { day: "52日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 44, onCar: 349 },
  { day: "53日目", kscWeather: null, kscIn: null, kscCar: null, onWeather: "晴",    onIn: 136, onCar: 368 },
]

export function KagoshimaDetail() {
  const kscRows = DAILY_DATA.filter((r) => r.kscIn !== null)
  const onRows  = DAILY_DATA.filter((r) => r.onIn  !== null)

  const kscTotal    = kscRows.reduce((s, r) => s + (r.kscIn  ?? 0), 0)
  const kscCarTotal = kscRows.reduce((s, r) => s + (r.kscCar ?? 0), 0)
  const onTotal     = onRows.reduce((s, r)  => s + (r.onIn   ?? 0), 0)
  const onCarTotal  = onRows.reduce((s, r)  => s + (r.onCar  ?? 0), 0)

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
  const onR  = pearson(onRows.map(r  => r.onCar  ?? 0), onRows.map(r  => r.onIn  ?? 0))

  const summaryItems = [
    { label: "KSC 入会数 合計", value: `${kscTotal.toLocaleString()}人`,     avg: (kscTotal / kscRows.length).toFixed(1),    color: "text-blue-600" },
    { label: "KSC 台数 合計",   value: `${kscCarTotal.toLocaleString()}台`,  avg: (kscCarTotal / kscRows.length).toFixed(1), color: "text-sky-600" },
    { label: "ON 入会数 合計",  value: `${onTotal.toLocaleString()}人`,      avg: (onTotal / onRows.length).toFixed(1),      color: "text-orange-500" },
    { label: "ON 台数 合計",    value: `${onCarTotal.toLocaleString()}台`,   avg: (onCarTotal / onRows.length).toFixed(1),   color: "text-amber-500" },
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
        <h3 className="text-sm font-semibold text-gray-700 mb-4">KSC・ON 日別 入会数 / 台数推移</h3>
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={DAILY_DATA} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} interval={3} tickLine={false} />
            <YAxis yAxisId="left"  orientation="left"  tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} label={{ value: "台数",   angle: -90, position: "insideLeft",  fontSize: 10, fill: "#9ca3af" }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} label={{ value: "入会数", angle: 90,  position: "insideRight", fontSize: 10, fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              formatter={(value: number, name: string) => {
                const labels: { [key: string]: string } = { kscCar: "KSC台数", kscIn: "KSC入会数", onCar: "ON台数", onIn: "ON入会数" }
                return [value != null ? value.toLocaleString() : "—", labels[name] ?? name]
              }}
            />
            <Legend formatter={(value) => {
              const labels: { [key: string]: string } = { kscCar: "KSC台数（棒）", kscIn: "KSC入会数（線）", onCar: "ON台数（棒）", onIn: "ON入会数（線）" }
              return <span className="text-xs text-gray-600">{labels[value] ?? value}</span>
            }} />
            <Bar  yAxisId="left"  dataKey="kscCar" fill="#93c5fd" radius={[2,2,0,0]} maxBarSize={8}  name="kscCar" />
            <Bar  yAxisId="left"  dataKey="onCar"  fill="#fcd34d" radius={[2,2,0,0]} maxBarSize={8}  name="onCar" />
            <Line yAxisId="right" type="monotone" dataKey="kscIn" stroke="#2563eb" strokeWidth={2} dot={false} connectNulls={false} name="kscIn" />
            <Line yAxisId="right" type="monotone" dataKey="onIn"  stroke="#f97316" strokeWidth={2} dot={false} name="onIn" />
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
            { label: "太田新田（ON）",    r: onR,  color: "text-orange-500" },
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
                  <span className="text-4xl font-black tabular-nums text-gray-800">
                    {r.toFixed(2)}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border mb-1 ${badge}`}>
                    {strength}
                  </span>
                </div>
                {/* ゲージバー */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all ${bar}`}
                    style={{ width: barWidth }}
                  />
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
                <th className="px-4 py-2 text-center bg-amber-50 text-amber-700" colSpan={3}>太田新田（ON）</th>
              </tr>
              <tr className="bg-gray-50 text-xs text-gray-400 border-b border-gray-100">
                <th className="px-4 py-2 text-center bg-blue-50/50">天気</th>
                <th className="px-4 py-2 text-right bg-blue-50/50">入会数</th>
                <th className="px-4 py-2 text-right bg-blue-50/50">台数</th>
                <th className="px-4 py-2 text-center bg-amber-50/50">天気</th>
                <th className="px-4 py-2 text-right bg-amber-50/50">入会数</th>
                <th className="px-4 py-2 text-right bg-amber-50/50">台数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DAILY_DATA.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 text-gray-500 text-xs font-medium">{row.day}</td>
                  <td className="px-4 py-2 text-center text-xs text-gray-500">{row.kscWeather ?? "—"}</td>
                  <td className="px-4 py-2 text-right font-semibold text-blue-600">{row.kscIn ?? "—"}</td>
                  <td className="px-4 py-2 text-right text-gray-700">{row.kscCar?.toLocaleString() ?? "—"}</td>
                  <td className="px-4 py-2 text-center text-xs text-gray-500">{row.onWeather ?? "—"}</td>
                  <td className="px-4 py-2 text-right font-semibold text-orange-500">{row.onIn ?? "—"}</td>
                  <td className="px-4 py-2 text-right text-gray-700">{row.onCar?.toLocaleString() ?? "—"}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold border-t-2 border-gray-200 text-xs">
                <td className="px-4 py-3 text-gray-600">Total</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-blue-700">{kscTotal.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-700">{kscCarTotal.toLocaleString()}</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-orange-600">{onTotal.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-700">{onCarTotal.toLocaleString()}</td>
              </tr>
              <tr className="bg-gray-50 text-xs text-gray-500">
                <td className="px-4 py-2">Average</td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-right">{(kscTotal / kscRows.length).toFixed(1)}</td>
                <td className="px-4 py-2 text-right">{(kscCarTotal / kscRows.length).toFixed(1)}</td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-right">{(onTotal / onRows.length).toFixed(1)}</td>
                <td className="px-4 py-2 text-right">{(onCarTotal / onRows.length).toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
