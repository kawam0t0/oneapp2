module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/oneapp/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/oneapp/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/oneapp/components/dashboard-view.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/mysql2/promise.js [app-rsc] (ecmascript)");
;
;
// MySQL接続設定
const getConnection = async ()=>{
    return await __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].createConnection({
        host: process.env.DB_HOST || "34.67.209.187",
        port: Number.parseInt(process.env.DB_PORT || "3306"),
        user: process.env.DB_USER || "your_username",
        password: process.env.DB_PASSWORD || "your_password",
        database: process.env.DB_NAME || "your_database_name",
        ssl: {
            rejectUnauthorized: false
        }
    });
};
const categorizeItem = (details)=>{
    if (!details) return "その他";
    if (details.includes("高崎棟高店バキューム")) return null;
    if (details.includes("サブスク")) return "サブスク";
    if (details.includes("リピ")) return "リピート";
    if (details.includes("新規")) return "新規";
    if (details.includes("⇒")) return "コースアップ";
    if (details.includes("ポイント")) return "ポイント";
    if (details.includes("キャンペーン")) return "キャンペーン";
    if (details.includes("無料券")) return "無料券";
    return details;
};
const aggregateData = (rows)=>{
    const storeMap = new Map();
    rows.forEach((row)=>{
        const store = row.store;
        const item = categorizeItem(row.details);
        const count = row.count;
        if (!store || store === "0" || store.toString().trim() === "") {
            return;
        }
        if (item === null) {
            return;
        }
        if (!storeMap.has(store)) {
            storeMap.set(store, {
                items: {},
                total: 0
            });
        }
        const storeData = storeMap.get(store);
        storeData.items[item] = (storeData.items[item] || 0) + count;
        storeData.total += count;
    });
    return Array.from(storeMap.entries()).map(([store, data])=>({
            store,
            items: data.items,
            total: data.total
        }));
};
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const period = searchParams.get("period") || "2025-11";
        const [year, month] = period.split("-");
        // 指定された年月の開始日と終了日を計算
        const startDate = `${year}-${month}-01`;
        const endDate = new Date(Number.parseInt(year), Number.parseInt(month), 0).getDate();
        const endDateStr = `${year}-${month}-${endDate}`;
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        console.log("[v0] Fetching data for period:", period);
        console.log("[v0] Date range:", startDate, "to", endDateStr);
        console.log("[v0] Today:", todayStr);
        const connection = await getConnection();
        const [monthlyRows] = await connection.execute(`SELECT store, details, COUNT(*) as count 
       FROM onetime 
       WHERE date >= ? AND date <= ?
       AND (card_entry_method IS NULL OR card_entry_method != 'KEYED')
       GROUP BY store, details
       ORDER BY store, details`, [
            startDate,
            endDateStr
        ]);
        const [todayRows] = await connection.execute(`SELECT store, details, COUNT(*) as count 
       FROM onetime 
       WHERE date = ?
       AND (card_entry_method IS NULL OR card_entry_method != 'KEYED')
       GROUP BY store, details
       ORDER BY store, details`, [
            todayStr
        ]);
        await connection.end();
        const monthlyData = aggregateData(monthlyRows);
        const todayData = aggregateData(todayRows);
        console.log("[v0] Found", monthlyData.length, "stores for monthly data");
        console.log("[v0] Found", todayData.length, "stores for today data");
        return __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
            monthly: monthlyData,
            today: todayData
        });
    } catch (error) {
        console.error("[v0] Database error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "データベース接続エラー",
            details: String(error)
        }, {
            status: 500
        });
    }
}
}),
"[project]/oneapp/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$dashboard$2d$view$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/components/dashboard-view.tsx [app-rsc] (ecmascript)");
;
;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$dashboard$2d$view$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/oneapp/app/page.tsx",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
}),
"[project]/oneapp/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/oneapp/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__45741ae1._.js.map