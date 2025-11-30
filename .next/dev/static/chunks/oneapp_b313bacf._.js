(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/oneapp/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/oneapp/components/sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/components/auth-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const menuItems = [
    {
        name: "ダッシュボード",
        href: "/",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"],
        external: false
    },
    {
        name: "スプレッドシート",
        href: "/spreadsheet",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"],
        external: false
    },
    {
        name: "行事カレンダー",
        href: "/calendar",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"],
        external: false
    },
    {
        name: "日報",
        href: "https://www.appsheet.com/start/43947cc3-3995-4964-9245-9131aa293b5e",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"],
        external: true
    },
    {
        name: "備品発注",
        href: "https://kawam0t0-orderwebapp20250502.vercel.app/login",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
        external: true
    },
    {
        name: "シフト",
        href: "https://connect.airregi.jp/login?client_id=SFT&redirect_uri=https%3A%2F%2Fconnect.airregi.jp%2Foauth%2Fauthorize%3Fclient_id%3DSFT%26redirect_uri%3Dhttps%253A%252F%252Fairshift.jp%252Fsft%252Fcallback%26response_type%3Dcode%26state%3DredirectTo%253A%25252Fsft%25252F",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"],
        external: true
    }
];
function Sidebar() {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { session, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const handleLogout = async ()=>{
        setIsOpen(false);
        await logout();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(true),
                className: "fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md",
                "aria-label": "メニューを開く",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                    className: "h-6 w-6 text-gray-700"
                }, void 0, false, {
                    fileName: "[project]/oneapp/components/sidebar.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/oneapp/components/sidebar.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 z-40",
                onClick: ()=>setIsOpen(false)
            }, void 0, false, {
                fileName: "[project]/oneapp/components/sidebar.tsx",
                lineNumber: 80,
                columnNumber: 18
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed top-0 left-0 z-50 h-full w-64 bg-yellow-400 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col", isOpen ? "translate-x-0" : "-translate-x-full"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between p-4 border-b border-yellow-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-lg font-bold text-gray-900",
                                children: "ONEAPP"
                            }, void 0, false, {
                                fileName: "[project]/oneapp/components/sidebar.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsOpen(false),
                                className: "p-1 rounded-md hover:bg-yellow-500",
                                "aria-label": "メニューを閉じる",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-5 w-5 text-gray-700"
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/components/sidebar.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/oneapp/components/sidebar.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/oneapp/components/sidebar.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    session && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-3 border-b border-yellow-500 bg-yellow-300",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 text-gray-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/components/sidebar.tsx",
                                    lineNumber: 102,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium truncate",
                                    children: session.store_name
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/components/sidebar.tsx",
                                    lineNumber: 103,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/oneapp/components/sidebar.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/oneapp/components/sidebar.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex-1 p-4 space-y-2",
                        children: menuItems.map((item)=>{
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            if (item.external) {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: item.href,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 hover:bg-yellow-500 transition-colors"),
                                    onClick: ()=>setIsOpen(false),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/oneapp/components/sidebar.tsx",
                                            lineNumber: 125,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex-1",
                                            children: item.name
                                        }, void 0, false, {
                                            fileName: "[project]/oneapp/components/sidebar.tsx",
                                            lineNumber: 126,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                            className: "h-4 w-4 text-gray-600"
                                        }, void 0, false, {
                                            fileName: "[project]/oneapp/components/sidebar.tsx",
                                            lineNumber: 127,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.name, true, {
                                    fileName: "[project]/oneapp/components/sidebar.tsx",
                                    lineNumber: 115,
                                    columnNumber: 17
                                }, this);
                            }
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", isActive ? "bg-gray-900 text-white font-semibold" : "text-gray-800 hover:bg-yellow-500"),
                                onClick: ()=>setIsOpen(false),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/components/sidebar.tsx",
                                        lineNumber: 142,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/components/sidebar.tsx",
                                        lineNumber: 143,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, item.name, true, {
                                fileName: "[project]/oneapp/components/sidebar.tsx",
                                lineNumber: 133,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/oneapp/components/sidebar.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-t border-yellow-500",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleLogout,
                            className: "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-800 hover:bg-red-500 hover:text-white transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/components/sidebar.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "ログアウト"
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/components/sidebar.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/oneapp/components/sidebar.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/oneapp/components/sidebar.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/oneapp/components/sidebar.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(Sidebar, "lDXJbl8qc0us6+fuGC99e4/uDKE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/oneapp/components/notification-detail-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationDetailDialog",
    ()=>NotificationDetailDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function NotificationDetailDialog({ notification, isOpen, onClose }) {
    _s();
    const [isImageExpanded, setIsImageExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ESCキーで閉じる
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationDetailDialog.useEffect": ()=>{
            const handleEsc = {
                "NotificationDetailDialog.useEffect.handleEsc": (e)=>{
                    if (e.key === "Escape") {
                        if (isImageExpanded) {
                            setIsImageExpanded(false);
                        } else {
                            onClose();
                        }
                    }
                }
            }["NotificationDetailDialog.useEffect.handleEsc"];
            if (isOpen) {
                document.addEventListener("keydown", handleEsc);
                document.body.style.overflow = "hidden";
            }
            return ({
                "NotificationDetailDialog.useEffect": ()=>{
                    document.removeEventListener("keydown", handleEsc);
                    document.body.style.overflow = "";
                }
            })["NotificationDetailDialog.useEffect"];
        }
    }["NotificationDetailDialog.useEffect"], [
        isOpen,
        onClose,
        isImageExpanded
    ]);
    // ダイアログが閉じたら画像拡大も閉じる
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationDetailDialog.useEffect": ()=>{
            if (!isOpen) {
                setIsImageExpanded(false);
            }
        }
    }["NotificationDetailDialog.useEffect"], [
        isOpen
    ]);
    if (!isOpen || !notification) return null;
    const formatDate = (dateString)=>{
        const date = new Date(dateString);
        return date.toLocaleDateString("ja-JP", {
            timeZone: "Asia/Tokyo",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
                        onClick: onClose
                    }, void 0, false, {
                        fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between p-4 border-b border-gray-200 bg-yellow-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-bold text-gray-900 text-lg",
                                        children: "お知らせ詳細"
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                        lineNumber: 76,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onClose,
                                        className: "p-1.5 rounded-md hover:bg-yellow-500 transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-5 w-5 text-gray-900"
                                        }, void 0, false, {
                                            fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                        lineNumber: 77,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 overflow-y-auto max-h-[calc(90vh-80px)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-bold text-gray-900 mb-2",
                                        children: notification.title
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                        lineNumber: 84,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-500 mb-4",
                                        children: formatDate(notification.created_at)
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                        lineNumber: 85,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-gray-700 whitespace-pre-wrap",
                                        children: notification.message
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                        lineNumber: 88,
                                        columnNumber: 13
                                    }, this),
                                    notification.image_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 mb-2",
                                                children: "画像をダブルクリックで拡大表示"
                                            }, void 0, false, {
                                                fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                                lineNumber: 92,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: notification.image_url || "/placeholder.svg",
                                                alt: "添付画像",
                                                className: "w-full rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity",
                                                onDoubleClick: ()=>setIsImageExpanded(true)
                                            }, void 0, false, {
                                                fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                                lineNumber: 93,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 border-t border-gray-200 bg-gray-50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors",
                                    children: "閉じる"
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            isImageExpanded && notification.image_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[200] flex items-center justify-center bg-black/90",
                onClick: ()=>setIsImageExpanded(false),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsImageExpanded(false),
                        className: "absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "h-6 w-6 text-white"
                        }, void 0, false, {
                            fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: notification.image_url || "/placeholder.svg",
                        alt: "拡大画像",
                        className: "max-w-[95vw] max-h-[95vh] object-contain rounded-lg",
                        onClick: (e)=>e.stopPropagation()
                    }, void 0, false, {
                        fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm",
                        children: "クリックまたはESCキーで閉じる"
                    }, void 0, false, {
                        fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/oneapp/components/notification-detail-dialog.tsx",
                lineNumber: 116,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(NotificationDetailDialog, "YGksEl2EMt/2w5oDnyWBQicrLC0=");
_c = NotificationDetailDialog;
var _c;
__turbopack_context__.k.register(_c, "NotificationDetailDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/oneapp/components/notification-bell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationBell",
    ()=>NotificationBell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$notification$2d$detail$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/components/notification-detail-dialog.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function NotificationBell() {
    _s();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [unreadCount, setUnreadCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [selectedNotification, setSelectedNotification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isDialogOpen, setIsDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 通知を取得
    const fetchNotifications = async ()=>{
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setNotifications(data);
                    setUnreadCount(data.filter((n)=>!n.is_read).length);
                }
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };
    // 全て既読にする
    const markAllAsRead = async ()=>{
        try {
            const res = await fetch("/api/notifications/read-all", {
                method: "POST"
            });
            if (res.ok) {
                setNotifications((prev)=>prev.map((n)=>({
                            ...n,
                            is_read: true
                        })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };
    // 個別の通知を既読にする
    const markAsRead = async (id)=>{
        try {
            await fetch(`/api/notifications/${id}/read`, {
                method: "POST"
            });
            setNotifications((prev)=>prev.map((n)=>n.id === id ? {
                        ...n,
                        is_read: true
                    } : n));
            setUnreadCount((prev)=>Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };
    // 通知をクリックして詳細を表示
    const handleNotificationClick = (notification)=>{
        setSelectedNotification(notification);
        setIsDialogOpen(true);
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationBell.useEffect": ()=>{
            fetchNotifications();
        }
    }["NotificationBell.useEffect"], []);
    // ドロップダウン外クリックで閉じる
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationBell.useEffect": ()=>{
            const handleClickOutside = {
                "NotificationBell.useEffect.handleClickOutside": (event)=>{
                    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setIsOpen(false);
                    }
                }
            }["NotificationBell.useEffect.handleClickOutside"];
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "NotificationBell.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["NotificationBell.useEffect"];
        }
    }["NotificationBell.useEffect"], []);
    const formatDate = (dateString)=>{
        if (!dateString) return "";
        try {
            // MySQLの日付形式 "YYYY-MM-DD HH:mm:ss" をパース
            const cleanDateString = dateString.replace(" ", "T");
            const date = new Date(cleanDateString);
            // Invalid Date チェック
            if (isNaN(date.getTime())) {
                console.log("[v0] Invalid date string:", dateString);
                return "";
            }
            return date.toLocaleDateString("ja-JP", {
                timeZone: "Asia/Tokyo",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch (error) {
            console.log("[v0] Date parse error:", error);
            return "";
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                ref: dropdownRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsOpen(!isOpen),
                        className: "relative p-2 rounded-full hover:bg-gray-100 transition-colors",
                        "aria-label": "お知らせ",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                className: "h-6 w-6 text-gray-700"
                            }, void 0, false, {
                                fileName: "[project]/oneapp/components/notification-bell.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold",
                                children: unreadCount > 9 ? "9+" : unreadCount
                            }, void 0, false, {
                                fileName: "[project]/oneapp/components/notification-bell.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/oneapp/components/notification-bell.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between p-4 border-b border-gray-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-bold text-gray-900",
                                        children: "お知らせ"
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/components/notification-bell.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/notifications/create",
                                                className: "p-1.5 rounded-md hover:bg-yellow-100 text-yellow-600",
                                                title: "お知らせを作成",
                                                onClick: ()=>setIsOpen(false),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                    className: "h-5 w-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/oneapp/components/notification-bell.tsx",
                                                    lineNumber: 147,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/oneapp/components/notification-bell.tsx",
                                                lineNumber: 141,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setIsOpen(false),
                                                className: "p-1.5 rounded-md hover:bg-gray-100",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "h-5 w-5 text-gray-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/oneapp/components/notification-bell.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/oneapp/components/notification-bell.tsx",
                                                lineNumber: 149,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/oneapp/components/notification-bell.tsx",
                                        lineNumber: 140,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/oneapp/components/notification-bell.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-h-80 overflow-y-auto",
                                children: notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 text-center text-gray-500",
                                    children: "お知らせはありません"
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/components/notification-bell.tsx",
                                    lineNumber: 158,
                                    columnNumber: 17
                                }, this) : notifications.map((notification)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleNotificationClick(notification),
                                        className: `w-full text-left p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${!notification.is_read ? "bg-yellow-50" : ""}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start gap-2",
                                            children: [
                                                !notification.is_read && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "mt-1.5 h-2 w-2 bg-red-500 rounded-full flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/oneapp/components/notification-bell.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold text-gray-900 text-sm",
                                                            children: notification.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/oneapp/components/notification-bell.tsx",
                                                            lineNumber: 173,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-600 text-sm mt-1 line-clamp-2",
                                                            children: notification.message.replace(/<[^>]*>/g, "")
                                                        }, void 0, false, {
                                                            fileName: "[project]/oneapp/components/notification-bell.tsx",
                                                            lineNumber: 174,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-400 text-xs mt-2 block",
                                                            children: formatDate(notification.created_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/oneapp/components/notification-bell.tsx",
                                                            lineNumber: 177,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/oneapp/components/notification-bell.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/oneapp/components/notification-bell.tsx",
                                            lineNumber: 168,
                                            columnNumber: 21
                                        }, this)
                                    }, notification.id, false, {
                                        fileName: "[project]/oneapp/components/notification-bell.tsx",
                                        lineNumber: 161,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/oneapp/components/notification-bell.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this),
                            notifications.length > 0 && unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 border-t border-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: markAllAsRead,
                                    className: "w-full py-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium",
                                    children: "すべて既読にする"
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/components/notification-bell.tsx",
                                    lineNumber: 188,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/oneapp/components/notification-bell.tsx",
                                lineNumber: 187,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/oneapp/components/notification-bell.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/oneapp/components/notification-bell.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$notification$2d$detail$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotificationDetailDialog"], {
                notification: selectedNotification,
                isOpen: isDialogOpen,
                onClose: ()=>{
                    setIsDialogOpen(false);
                    setSelectedNotification(null);
                }
            }, void 0, false, {
                fileName: "[project]/oneapp/components/notification-bell.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(NotificationBell, "7lG+tavADxR5po2tCxoywFMqQM0=");
_c = NotificationBell;
var _c;
__turbopack_context__.k.register(_c, "NotificationBell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/oneapp/components/app-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppLayout",
    ()=>AppLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/components/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$notification$2d$bell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/components/notification-bell.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function AppLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {}, void 0, false, {
                fileName: "[project]/oneapp/components/app-layout.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-h-screen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-end",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10"
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/components/app-layout.tsx",
                                    lineNumber: 23,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1"
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/components/app-layout.tsx",
                                    lineNumber: 24,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$notification$2d$bell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotificationBell"], {}, void 0, false, {
                                    fileName: "[project]/oneapp/components/app-layout.tsx",
                                    lineNumber: 25,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/oneapp/components/app-layout.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/oneapp/components/app-layout.tsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 p-4",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/oneapp/components/app-layout.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/oneapp/components/app-layout.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/oneapp/components/app-layout.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = AppLayout;
var _c;
__turbopack_context__.k.register(_c, "AppLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/oneapp/lib/japanese-holidays.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// 日本の祝日データ（2024年〜2030年）
// 春分の日・秋分の日は天文学的計算に基づく
__turbopack_context__.s([
    "getHolidayInfo",
    ()=>getHolidayInfo,
    "getHolidayName",
    ()=>getHolidayName,
    "getJapaneseHolidays",
    ()=>getJapaneseHolidays
]);
// 固定祝日
const FIXED_HOLIDAYS = [
    {
        month: 1,
        day: 1,
        name: "元日"
    },
    {
        month: 2,
        day: 11,
        name: "建国記念の日"
    },
    {
        month: 2,
        day: 23,
        name: "天皇誕生日"
    },
    {
        month: 4,
        day: 29,
        name: "昭和の日"
    },
    {
        month: 5,
        day: 3,
        name: "憲法記念日"
    },
    {
        month: 5,
        day: 4,
        name: "みどりの日"
    },
    {
        month: 5,
        day: 5,
        name: "こどもの日"
    },
    {
        month: 8,
        day: 11,
        name: "山の日"
    },
    {
        month: 11,
        day: 3,
        name: "文化の日"
    },
    {
        month: 11,
        day: 23,
        name: "勤労感謝の日"
    }
];
const STORE_CLOSED_DAYS = [
    {
        month: 1,
        day: 2,
        name: "店休日"
    },
    {
        month: 1,
        day: 3,
        name: "店休日"
    }
];
const YEARLY_NOTICES = [
    {
        month: 12,
        day: 31,
        name: "18時迄営業"
    }
];
const YEARLY_ORDERS = [
    {
        months: [
            2,
            5
        ],
        name: "Tシャツ発注日"
    },
    {
        months: [
            8,
            11
        ],
        name: "パーカー発注日"
    },
    {
        months: [
            9
        ],
        name: "ベンチコート発注日"
    }
];
// dayOfWeek: 0=日, 1=月, 2=火, 3=水, 4=木, 5=金, 6=土
const STORE_REGULAR_HOLIDAYS = [
    {
        week: 1,
        dayOfWeek: 2,
        name: "足利緑町店定休日",
        color: "#8b5cf6"
    },
    {
        week: 1,
        dayOfWeek: 3,
        name: "前橋50号店定休日",
        color: "#3b82f6"
    },
    {
        week: 2,
        dayOfWeek: 2,
        name: "高崎棟高店定休日",
        color: "#eab308"
    },
    {
        week: 2,
        dayOfWeek: 3,
        name: "伊勢崎韮塚店定休日",
        color: "#22c55e"
    },
    {
        week: 3,
        dayOfWeek: 2,
        name: "太田新田店定休日",
        color: "#f97316"
    },
    {
        week: 3,
        dayOfWeek: 3,
        name: "新前橋店定休日",
        color: "#ec4899"
    }
];
// ハッピーマンデー祝日
const HAPPY_MONDAY_HOLIDAYS = [
    {
        month: 1,
        week: 2,
        name: "成人の日"
    },
    {
        month: 7,
        week: 3,
        name: "海の日"
    },
    {
        month: 9,
        week: 3,
        name: "敬老の日"
    },
    {
        month: 10,
        week: 2,
        name: "スポーツの日"
    }
];
// 春分の日・秋分の日（年ごとに異なる）
const EQUINOX_DAYS = {
    2024: {
        spring: 20,
        autumn: 22
    },
    2025: {
        spring: 20,
        autumn: 23
    },
    2026: {
        spring: 20,
        autumn: 23
    },
    2027: {
        spring: 21,
        autumn: 23
    },
    2028: {
        spring: 20,
        autumn: 22
    },
    2029: {
        spring: 20,
        autumn: 23
    },
    2030: {
        spring: 20,
        autumn: 23
    }
};
// 第n月曜日の日付を取得
function getNthMonday(year, month, n) {
    const firstDay = new Date(year, month - 1, 1);
    const firstMonday = firstDay.getDay() === 1 ? 1 : (8 - firstDay.getDay() + 1) % 7 || 7;
    return firstMonday + (n - 1) * 7;
}
function getNthDayOfWeek(year, month, week, dayOfWeek) {
    const firstDay = new Date(year, month - 1, 1);
    const firstDayOfWeek = firstDay.getDay();
    let firstTargetDay = dayOfWeek - firstDayOfWeek + 1;
    if (firstTargetDay <= 0) {
        firstTargetDay += 7;
    }
    return firstTargetDay + (week - 1) * 7;
}
function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function getHolidayDatesSet(year) {
    const holidayDates = new Set();
    for (const h of FIXED_HOLIDAYS){
        holidayDates.add(`${year}-${String(h.month).padStart(2, "0")}-${String(h.day).padStart(2, "0")}`);
    }
    for (const h of HAPPY_MONDAY_HOLIDAYS){
        const day = getNthMonday(year, h.month, h.week);
        holidayDates.add(`${year}-${String(h.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    }
    const equinox = EQUINOX_DAYS[year];
    if (equinox) {
        holidayDates.add(`${year}-03-${String(equinox.spring).padStart(2, "0")}`);
        holidayDates.add(`${year}-09-${String(equinox.autumn).padStart(2, "0")}`);
    }
    return holidayDates;
}
function getSubstituteHolidays(year, holidays) {
    const substitutes = [];
    const holidayDates = new Set(holidays.map((h)=>h.date));
    for (const holiday of holidays){
        const date = new Date(holiday.date);
        if (date.getDay() === 0) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            while(holidayDates.has(formatDate(nextDay)) || nextDay.getDay() === 0){
                nextDay.setDate(nextDay.getDate() + 1);
            }
            substitutes.push({
                date: formatDate(nextDay),
                name: "振替休日",
                type: "holiday"
            });
            holidayDates.add(formatDate(nextDay));
        }
    }
    return substitutes;
}
function getKokuninNoKyujitsu(year, holidays) {
    const kokuminHolidays = [];
    const holidayDates = new Set(holidays.map((h)=>h.date));
    const equinox = EQUINOX_DAYS[year];
    if (equinox) {
        const keirouDay = getNthMonday(year, 9, 3);
        const autumnDay = equinox.autumn;
        if (autumnDay - keirouDay === 2) {
            const betweenDate = `${year}-09-${String(keirouDay + 1).padStart(2, "0")}`;
            if (!holidayDates.has(betweenDate)) {
                kokuminHolidays.push({
                    date: betweenDate,
                    name: "国民の休日",
                    type: "holiday"
                });
            }
        }
    }
    return kokuminHolidays;
}
function getStoreRegularHolidays(year, holidayDates) {
    const storeHolidays = [];
    const allClosedDates = new Set();
    // 各月について定休日を計算
    for(let month = 1; month <= 12; month++){
        for (const store of STORE_REGULAR_HOLIDAYS){
            const day = getNthDayOfWeek(year, month, store.week, store.dayOfWeek);
            const lastDayOfMonth = new Date(year, month, 0).getDate();
            if (day > lastDayOfMonth) continue;
            const targetDate = new Date(year, month - 1, day);
            let dateStr = formatDate(targetDate);
            while(holidayDates.has(dateStr) || allClosedDates.has(dateStr)){
                targetDate.setDate(targetDate.getDate() + 1);
                dateStr = formatDate(targetDate);
            }
            // この日を定休日として登録
            allClosedDates.add(dateStr);
            storeHolidays.push({
                date: dateStr,
                name: store.name,
                type: "store-closed",
                color: store.color
            });
        }
    }
    return storeHolidays;
}
function getLastDayOfMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
function getOrderDays(year) {
    const orders = [];
    for (const order of YEARLY_ORDERS){
        for (const month of order.months){
            const lastDay = getLastDayOfMonth(year, month);
            orders.push({
                date: `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
                name: order.name,
                type: "order",
                color: "#22c55e"
            });
        }
    }
    return orders;
}
function getJapaneseHolidays(year) {
    const holidays = [];
    for (const h of FIXED_HOLIDAYS){
        holidays.push({
            date: `${year}-${String(h.month).padStart(2, "0")}-${String(h.day).padStart(2, "0")}`,
            name: h.name,
            type: "holiday"
        });
    }
    for (const h of HAPPY_MONDAY_HOLIDAYS){
        const day = getNthMonday(year, h.month, h.week);
        holidays.push({
            date: `${year}-${String(h.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
            name: h.name,
            type: "holiday"
        });
    }
    const equinox = EQUINOX_DAYS[year];
    if (equinox) {
        holidays.push({
            date: `${year}-03-${String(equinox.spring).padStart(2, "0")}`,
            name: "春分の日",
            type: "holiday"
        });
        holidays.push({
            date: `${year}-09-${String(equinox.autumn).padStart(2, "0")}`,
            name: "秋分の日",
            type: "holiday"
        });
    }
    const substitutes = getSubstituteHolidays(year, holidays);
    holidays.push(...substitutes);
    const kokuminHolidays = getKokuninNoKyujitsu(year, holidays);
    holidays.push(...kokuminHolidays);
    for (const s of STORE_CLOSED_DAYS){
        const dateStr = `${year}-${String(s.month).padStart(2, "0")}-${String(s.day).padStart(2, "0")}`;
        if (!holidays.some((h)=>h.date === dateStr)) {
            holidays.push({
                date: dateStr,
                name: s.name,
                type: "closed"
            });
        }
    }
    for (const n of YEARLY_NOTICES){
        holidays.push({
            date: `${year}-${String(n.month).padStart(2, "0")}-${String(n.day).padStart(2, "0")}`,
            name: n.name,
            type: "notice"
        });
    }
    const orderDays = getOrderDays(year);
    holidays.push(...orderDays);
    const holidayDatesSet = getHolidayDatesSet(year);
    for (const sub of substitutes){
        holidayDatesSet.add(sub.date);
    }
    for (const kokumin of kokuminHolidays){
        holidayDatesSet.add(kokumin.date);
    }
    const storeRegularHolidays = getStoreRegularHolidays(year, holidayDatesSet);
    holidays.push(...storeRegularHolidays);
    return holidays.sort((a, b)=>a.date.localeCompare(b.date));
}
function getHolidayName(date) {
    const year = Number.parseInt(date.slice(0, 4));
    const holidays = getJapaneseHolidays(year);
    const holiday = holidays.find((h)=>h.date === date);
    return holiday ? holiday.name : null;
}
function getHolidayInfo(date) {
    const year = Number.parseInt(date.slice(0, 4));
    const holidays = getJapaneseHolidays(year);
    return holidays.find((h)=>h.date === date) || null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/oneapp/app/calendar/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalendarPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$app$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/components/app-layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/oneapp/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$lib$2f$japanese$2d$holidays$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/oneapp/lib/japanese-holidays.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const COLORS = [
    {
        name: "赤",
        value: "#ef4444"
    },
    {
        name: "青",
        value: "#3b82f6"
    },
    {
        name: "緑",
        value: "#22c55e"
    },
    {
        name: "黄",
        value: "#eab308"
    },
    {
        name: "紫",
        value: "#a855f7"
    },
    {
        name: "ピンク",
        value: "#ec4899"
    },
    {
        name: "オレンジ",
        value: "#f97316"
    }
];
function CalendarPage() {
    _s();
    const [currentDate, setCurrentDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [events, setEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newEventTitle, setNewEventTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [newEventColor, setNewEventColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(COLORS[0].value);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedDateForDetail, setSelectedDateForDetail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedDateEvents, setSelectedDateEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalendarPage.useEffect": ()=>{
            setCurrentDate(new Date());
            setIsClient(true);
        }
    }["CalendarPage.useEffect"], []);
    const getHolidayEvents = (date)=>{
        const year = date.getFullYear();
        const holidays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$lib$2f$japanese$2d$holidays$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getJapaneseHolidays"])(year);
        const prevYearHolidays = year > 2024 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$lib$2f$japanese$2d$holidays$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getJapaneseHolidays"])(year - 1) : [];
        const nextYearHolidays = year < 2030 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$lib$2f$japanese$2d$holidays$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getJapaneseHolidays"])(year + 1) : [];
        const allHolidays = [
            ...prevYearHolidays,
            ...holidays,
            ...nextYearHolidays
        ];
        return allHolidays.map((h, index)=>{
            const isHoliday = h.type === "holiday";
            const isClosed = h.type === "closed";
            const isStoreClosed = h.type === "store-closed";
            const isNotice = h.type === "notice";
            const isOrder = h.type === "order";
            let eventColor = "#ef4444";
            if (h.color) {
                eventColor = h.color;
            } else if (isClosed || isStoreClosed) {
                eventColor = "#6b7280";
            } else if (isNotice) {
                eventColor = "#3b82f6";
            } else if (isOrder) {
                eventColor = "#22c55e";
            }
            return {
                id: -index - 1,
                title: h.name,
                date: h.date,
                color: eventColor,
                isHoliday,
                isClosed,
                isStoreClosed,
                isNotice,
                isOrder
            };
        });
    };
    const fetchEvents = async (date)=>{
        console.log("[v0] fetchEvents called for:", date.getFullYear(), date.getMonth() + 1);
        try {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const url = `/api/calendar?year=${year}&month=${month}`;
            console.log("[v0] Fetching from URL:", url);
            const res = await fetch(url);
            console.log("[v0] API response status:", res.status);
            const holidayEvents = getHolidayEvents(date);
            console.log("[v0] Holiday events count:", holidayEvents.length);
            if (res.ok) {
                const data = await res.json();
                console.log("[v0] API returned data:", JSON.stringify(data));
                console.log("[v0] Is array:", Array.isArray(data));
                console.log("[v0] Data length:", Array.isArray(data) ? data.length : "N/A");
                if (Array.isArray(data)) {
                    data.forEach((event, i)=>{
                        console.log(`[v0] DB Event ${i}:`, event.id, event.title, event.date, event.color);
                    });
                    const allEvents = [
                        ...holidayEvents,
                        ...data
                    ];
                    console.log("[v0] Total events to display:", allEvents.length);
                    setEvents(allEvents);
                } else {
                    console.log("[v0] Data is not an array, using only holidays");
                    setEvents(holidayEvents);
                }
            } else {
                const errorText = await res.text();
                console.log("[v0] API response not ok:", errorText);
                setEvents(holidayEvents);
            }
        } catch (error) {
            console.error("[v0] Failed to fetch events:", error);
            if (date) {
                setEvents(getHolidayEvents(date));
            }
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalendarPage.useEffect": ()=>{
            if (currentDate) {
                fetchEvents(currentDate);
            }
        }
    }["CalendarPage.useEffect"], [
        currentDate
    ]);
    const changeMonth = (delta)=>{
        if (!currentDate) return;
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    };
    const goToToday = ()=>{
        setCurrentDate(new Date());
    };
    const generateCalendarDays = (date)=>{
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        const days = [];
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for(let i = startDay - 1; i >= 0; i--){
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                isCurrentMonth: false
            });
        }
        for(let i = 1; i <= daysInMonth; i++){
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }
        const remainingDays = 42 - days.length;
        for(let i = 1; i <= remainingDays; i++){
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            });
        }
        return days;
    };
    const formatDateKey = (date)=>{
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };
    const openAddModal = (date)=>{
        setSelectedDate(formatDateKey(date));
        setNewEventTitle("");
        setNewEventColor(COLORS[0].value);
        setIsModalOpen(true);
    };
    const addEvent = async ()=>{
        if (!newEventTitle.trim() || !selectedDate) {
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch("/api/calendar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: newEventTitle.trim(),
                    date: selectedDate,
                    color: newEventColor
                })
            });
            if (res.ok) {
                setIsModalOpen(false);
                setNewEventTitle("");
                // イベントを再取得
                if (currentDate) {
                    await fetchEvents(currentDate);
                    // 詳細モーダルを更新して再表示
                    const holidayEvents = getHolidayEvents(currentDate);
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth() + 1;
                    const fetchRes = await fetch(`/api/calendar?year=${year}&month=${month}`);
                    if (fetchRes.ok) {
                        const data = await fetchRes.json();
                        if (Array.isArray(data)) {
                            const allEvents = [
                                ...holidayEvents,
                                ...data
                            ];
                            const updatedDayEvents = allEvents.filter((e)=>e.date === selectedDate);
                            setSelectedDateForDetail(selectedDate);
                            setSelectedDateEvents(updatedDayEvents);
                            setIsDetailModalOpen(true);
                        }
                    }
                }
            } else {
                const errorData = await res.json();
                alert(`イベントの追加に失敗しました: ${errorData.error || "不明なエラー"}`);
            }
        } catch (error) {
            console.error("Failed to add event:", error);
            alert("イベントの追加に失敗しました。ネットワーク接続を確認してください。");
        } finally{
            setIsLoading(false);
        }
    };
    const deleteEvent = async (event, e)=>{
        e.stopPropagation();
        if (event.isHoliday || event.isClosed || event.isStoreClosed || event.isNotice || event.isOrder) return;
        if (!confirm("このイベントを削除しますか？")) return;
        try {
            const res = await fetch(`/api/calendar/${event.id}`, {
                method: "DELETE"
            });
            if (res.ok && currentDate) {
                fetchEvents(currentDate);
            }
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };
    const openDetailModal = (date, dayEvents)=>{
        const dateKey = formatDateKey(date);
        setSelectedDateForDetail(dateKey);
        setSelectedDateEvents(dayEvents);
        setIsDetailModalOpen(true);
    };
    const openAddModalFromDetail = ()=>{
        setIsDetailModalOpen(false);
        if (selectedDateForDetail) {
            setSelectedDate(selectedDateForDetail);
            setNewEventTitle("");
            setNewEventColor(COLORS[0].value);
            setIsModalOpen(true);
        }
    };
    const deleteEventFromDetail = async (event)=>{
        if (event.isHoliday || event.isClosed || event.isStoreClosed || event.isNotice || event.isOrder) return;
        if (!confirm("このイベントを削除しますか？")) return;
        try {
            const res = await fetch(`/api/calendar/${event.id}`, {
                method: "DELETE"
            });
            if (res.ok && currentDate) {
                fetchEvents(currentDate);
                setSelectedDateEvents((prev)=>prev.filter((e)=>e.id !== event.id));
            }
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };
    const formatDateDisplay = (dateStr)=>{
        const date = new Date(dateStr);
        const weekDayNames = [
            "日",
            "月",
            "火",
            "水",
            "木",
            "金",
            "土"
        ];
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${weekDayNames[date.getDay()]}）`;
    };
    const getEventStyle = (event)=>{
        if (event.isHoliday) {
            return {
                className: "text-red-700",
                style: {
                    backgroundColor: "#fee2e2"
                }
            };
        }
        if (event.isClosed || event.isStoreClosed) {
            return {
                className: "text-gray-700",
                style: {
                    backgroundColor: "#e5e7eb"
                }
            };
        }
        if (event.isNotice) {
            return {
                className: "text-blue-700",
                style: {
                    backgroundColor: "#dbeafe"
                }
            };
        }
        if (event.isOrder) {
            return {
                className: "text-green-700",
                style: {
                    backgroundColor: "#dcfce7"
                }
            };
        }
        return {
            className: "text-white",
            style: {
                backgroundColor: event.color
            }
        };
    };
    const weekDays = [
        "日",
        "月",
        "火",
        "水",
        "木",
        "金",
        "土"
    ];
    if (!isClient || !currentDate) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$app$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppLayout"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-yellow-50 p-4 md:p-6 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-yellow-700",
                    children: "読み込み中..."
                }, void 0, false, {
                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                    lineNumber: 341,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/oneapp/app/calendar/page.tsx",
                lineNumber: 340,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/oneapp/app/calendar/page.tsx",
            lineNumber: 339,
            columnNumber: 7
        }, this);
    }
    const days = generateCalendarDays(currentDate);
    const today = new Date();
    const todayKey = formatDateKey(today);
    const holidayDates = new Set(events.filter((e)=>e.isHoliday).map((e)=>e.date));
    const closedDates = new Set(events.filter((e)=>e.isClosed).map((e)=>e.date));
    const storeClosedDates = new Set(events.filter((e)=>e.isStoreClosed).map((e)=>e.date));
    const noticeDates = new Set(events.filter((e)=>e.isNotice).map((e)=>e.date));
    const orderDates = new Set(events.filter((e)=>e.isOrder).map((e)=>e.date));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$components$2f$app$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppLayout"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-yellow-50 p-4 md:p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-sm border-2 border-yellow-400 p-4 mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: goToToday,
                                    className: "px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors",
                                    children: "今日"
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                    lineNumber: 364,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>changeMonth(-1),
                                            className: "p-2 hover:bg-yellow-100 rounded-lg transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                className: "h-5 w-5 text-yellow-700"
                                            }, void 0, false, {
                                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                lineNumber: 375,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/oneapp/app/calendar/page.tsx",
                                            lineNumber: 371,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>changeMonth(1),
                                            className: "p-2 hover:bg-yellow-100 rounded-lg transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                className: "h-5 w-5 text-yellow-700"
                                            }, void 0, false, {
                                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                lineNumber: 378,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/oneapp/app/calendar/page.tsx",
                                            lineNumber: 377,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                    lineNumber: 370,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-xl font-bold text-gray-900",
                                    children: [
                                        currentDate.getFullYear(),
                                        "年",
                                        currentDate.getMonth() + 1,
                                        "月"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                    lineNumber: 381,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/oneapp/app/calendar/page.tsx",
                            lineNumber: 363,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                        lineNumber: 362,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                    lineNumber: 361,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-sm border-2 border-yellow-400 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-7 bg-yellow-400",
                            children: weekDays.map((day, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `py-3 text-center text-sm font-bold ${index === 0 ? "text-red-600" : index === 6 ? "text-blue-600" : "text-gray-900"}`,
                                    children: day
                                }, day, false, {
                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                    lineNumber: 393,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/oneapp/app/calendar/page.tsx",
                            lineNumber: 391,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-7",
                            children: days.map((day, index)=>{
                                const dateKey = formatDateKey(day.date);
                                const dayEvents = events.filter((e)=>e.date === dateKey);
                                const isToday = dateKey === todayKey;
                                const dayOfWeek = day.date.getDay();
                                const isHoliday = holidayDates.has(dateKey);
                                const isClosed = closedDates.has(dateKey);
                                const isStoreClosed = storeClosedDates.has(dateKey);
                                const isNotice = noticeDates.has(dateKey);
                                const isOrder = orderDates.has(dateKey);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>openDetailModal(day.date, dayEvents),
                                    className: `min-h-[80px] md:min-h-[120px] border-b border-r border-yellow-200 p-1 cursor-pointer ${!day.isCurrentMonth ? "bg-yellow-50/50" : "bg-white"} hover:bg-yellow-50 transition-colors`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-sm w-7 h-7 flex items-center justify-center rounded-full ${isToday ? "bg-yellow-400 text-gray-900 font-bold shadow-md" : !day.isCurrentMonth ? "text-gray-400" : isHoliday || dayOfWeek === 0 ? "text-red-500 font-semibold" : dayOfWeek === 6 ? "text-blue-500 font-semibold" : isClosed || isStoreClosed || isNotice || isOrder ? "text-gray-600" : "text-gray-700"}`,
                                                    children: day.date.getDate()
                                                }, void 0, false, {
                                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                    lineNumber: 426,
                                                    columnNumber: 21
                                                }, this),
                                                dayEvents.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "md:hidden text-xs bg-yellow-400 text-gray-900 rounded-full px-1.5 py-0.5 font-medium",
                                                    children: dayEvents.length
                                                }, void 0, false, {
                                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                    lineNumber: 444,
                                                    columnNumber: 23
                                                }, this),
                                                day.isCurrentMonth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        openAddModal(day.date);
                                                    },
                                                    className: "hidden md:block p-1 hover:bg-yellow-200 rounded opacity-0 hover:opacity-100 transition-all",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        className: "h-4 w-4 text-yellow-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                        lineNumber: 456,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/oneapp/app/calendar/page.tsx",
                                            lineNumber: 425,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "hidden md:block space-y-1",
                                            children: [
                                                dayEvents.slice(0, 3).map((event)=>{
                                                    const eventStyle = getEventStyle(event);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `group flex items-center gap-1 px-1.5 py-0.5 rounded text-xs truncate ${eventStyle.className}`,
                                                        style: eventStyle.style,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "truncate flex-1",
                                                                children: event.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                                lineNumber: 469,
                                                                columnNumber: 27
                                                            }, this),
                                                            !event.isHoliday && !event.isClosed && !event.isStoreClosed && !event.isNotice && !event.isOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>deleteEvent(event, e),
                                                                className: "opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                    className: "h-3 w-3"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                                    lineNumber: 479,
                                                                    columnNumber: 33
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                                lineNumber: 475,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, event.id, true, {
                                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                        lineNumber: 464,
                                                        columnNumber: 25
                                                    }, this);
                                                }),
                                                dayEvents.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-yellow-700 px-1 font-medium",
                                                    children: [
                                                        "+",
                                                        dayEvents.length - 3,
                                                        "件"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                    lineNumber: 486,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/oneapp/app/calendar/page.tsx",
                                            lineNumber: 460,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                    lineNumber: 418,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/oneapp/app/calendar/page.tsx",
                            lineNumber: 405,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                    lineNumber: 389,
                    columnNumber: 9
                }, this),
                isDetailModalOpen && selectedDateForDetail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow-xl w-full max-w-md border-2 border-yellow-400 max-h-[80vh] flex flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between p-4 border-b border-yellow-200 bg-yellow-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-bold text-gray-900",
                                        children: formatDateDisplay(selectedDateForDetail)
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                        lineNumber: 500,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setIsDetailModalOpen(false),
                                        className: "p-1 hover:bg-yellow-500 rounded transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-5 w-5 text-gray-900"
                                        }, void 0, false, {
                                            fileName: "[project]/oneapp/app/calendar/page.tsx",
                                            lineNumber: 505,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                        lineNumber: 501,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                lineNumber: 499,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto p-4",
                                children: selectedDateEvents.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500 text-center py-8",
                                    children: "この日にイベントはありません"
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                    lineNumber: 510,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: selectedDateEvents.map((event)=>{
                                        const eventStyle = getEventStyle(event);
                                        const isDeletable = !event.isHoliday && !event.isClosed && !event.isStoreClosed && !event.isNotice && !event.isOrder;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `flex items-center justify-between p-3 rounded-lg ${eventStyle.className}`,
                                            style: eventStyle.style,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium",
                                                    children: event.title
                                                }, void 0, false, {
                                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                    lineNumber: 523,
                                                    columnNumber: 27
                                                }, this),
                                                isDeletable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>deleteEventFromDetail(event),
                                                    className: "p-1 hover:bg-black/10 rounded transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                        lineNumber: 529,
                                                        columnNumber: 31
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                    lineNumber: 525,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, event.id, true, {
                                            fileName: "[project]/oneapp/app/calendar/page.tsx",
                                            lineNumber: 518,
                                            columnNumber: 25
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                    lineNumber: 512,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                lineNumber: 508,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 border-t border-yellow-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: openAddModalFromDetail,
                                    className: "w-full py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/oneapp/app/calendar/page.tsx",
                                            lineNumber: 543,
                                            columnNumber: 19
                                        }, this),
                                        "イベントを追加"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                                    lineNumber: 539,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                lineNumber: 538,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                        lineNumber: 498,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                    lineNumber: 497,
                    columnNumber: 11
                }, this),
                isModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow-xl w-full max-w-md border-2 border-yellow-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between p-4 border-b border-yellow-200 bg-yellow-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-bold text-gray-900",
                                        children: "イベントを追加"
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                        lineNumber: 556,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setIsModalOpen(false),
                                        className: "p-1 hover:bg-yellow-500 rounded transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-5 w-5 text-gray-900"
                                        }, void 0, false, {
                                            fileName: "[project]/oneapp/app/calendar/page.tsx",
                                            lineNumber: 561,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                        lineNumber: 557,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                lineNumber: 555,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "日付"
                                            }, void 0, false, {
                                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                lineNumber: 566,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: selectedDate || "",
                                                onChange: (e)=>setSelectedDate(e.target.value),
                                                className: "w-full px-3 py-2 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                            }, void 0, false, {
                                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                lineNumber: 567,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                        lineNumber: 565,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "タイトル"
                                            }, void 0, false, {
                                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                lineNumber: 575,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: newEventTitle,
                                                onChange: (e)=>setNewEventTitle(e.target.value),
                                                placeholder: "イベント名を入力",
                                                className: "w-full px-3 py-2 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                                            }, void 0, false, {
                                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                lineNumber: 576,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                        lineNumber: 574,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "色"
                                            }, void 0, false, {
                                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                lineNumber: 585,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2 flex-wrap",
                                                children: COLORS.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setNewEventColor(color.value),
                                                        className: `w-8 h-8 rounded-full border-2 transition-transform ${newEventColor === color.value ? "border-gray-900 scale-110 shadow-md" : "border-gray-300"}`,
                                                        style: {
                                                            backgroundColor: color.value
                                                        },
                                                        title: color.name
                                                    }, color.value, false, {
                                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                        lineNumber: 588,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                                lineNumber: 586,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                        lineNumber: 584,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                lineNumber: 564,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 p-4 border-t border-yellow-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: addEvent,
                                        disabled: isLoading || !newEventTitle.trim(),
                                        className: "flex-1 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                                        children: isLoading ? "追加中..." : "追加"
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                        lineNumber: 602,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$oneapp$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setIsModalOpen(false),
                                        className: "px-4 py-2 border-2 border-yellow-400 text-yellow-700 font-semibold rounded-lg hover:bg-yellow-50 transition-colors",
                                        children: "キャンセル"
                                    }, void 0, false, {
                                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                                        lineNumber: 609,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/oneapp/app/calendar/page.tsx",
                                lineNumber: 601,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/oneapp/app/calendar/page.tsx",
                        lineNumber: 554,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/oneapp/app/calendar/page.tsx",
                    lineNumber: 553,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/oneapp/app/calendar/page.tsx",
            lineNumber: 359,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/oneapp/app/calendar/page.tsx",
        lineNumber: 358,
        columnNumber: 5
    }, this);
}
_s(CalendarPage, "zZdJNfPmy/GuEPfN75omtFRO+eM=");
_c = CalendarPage;
var _c;
__turbopack_context__.k.register(_c, "CalendarPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=oneapp_b313bacf._.js.map