import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { R as ChartColumn } from "../_libs/lucide-react.mjs";
import { r as Navbar } from "./Navbar-DqEYdomU.mjs";
import { n as useServiceWorker, t as SkipLink } from "./useServiceWorker-FNXF9_Bm.mjs";
import { t as loadHistory } from "./historyStore-B5Ktctdd.mjs";
import { a as Line, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as CartesianGrid, r as YAxis, s as Bar, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-G1rr_By-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function dayKey(d) {
	return d.toISOString().slice(0, 10);
}
function InsightsPage() {
	const [entries, setEntries] = (0, import_react.useState)([]);
	useServiceWorker();
	(0, import_react.useEffect)(() => {
		setEntries(loadHistory());
	}, []);
	const { daily, topGestures, totals } = (0, import_react.useMemo)(() => {
		const days = [];
		for (let i = 13; i >= 0; i--) {
			const d = /* @__PURE__ */ new Date();
			d.setDate(d.getDate() - i);
			days.push({
				date: dayKey(d),
				label: d.toLocaleDateString([], {
					month: "short",
					day: "numeric"
				}),
				count: 0,
				confSum: 0
			});
		}
		const byDay = new Map(days.map((d) => [d.date, d]));
		const byGesture = /* @__PURE__ */ new Map();
		let confTotal = 0;
		for (const e of entries) {
			const at = e.at instanceof Date ? e.at : new Date(e.at);
			const bucket = byDay.get(dayKey(at));
			if (bucket) {
				bucket.count += 1;
				bucket.confSum += e.confidence;
			}
			byGesture.set(e.gesture, (byGesture.get(e.gesture) ?? 0) + 1);
			confTotal += e.confidence;
		}
		return {
			daily: days.map((d) => ({
				label: d.label,
				gestures: d.count,
				avgConfidence: d.count > 0 ? Math.round(d.confSum / d.count * 100) : null
			})),
			topGestures: [...byGesture.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([gesture, count]) => ({
				gesture,
				count
			})),
			totals: {
				gestures: entries.length,
				avgConfidence: entries.length > 0 ? Math.round(confTotal / entries.length * 100) : 0,
				daysActive: days.filter((d) => d.count > 0).length
			}
		};
	}, [entries]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipLink, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main-content",
				className: "mx-auto max-w-7xl px-5 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "flex items-center gap-2 text-2xl font-semibold sm:text-3xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, {
							className: "h-7 w-7",
							"aria-hidden": "true"
						}), "Insights"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-2xl text-sm text-muted-foreground",
						children: "Computed on-device from your saved history — nothing leaves the browser."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-5 sm:grid-cols-3",
						children: [
							{
								label: "Gestures translated",
								value: String(totals.gestures)
							},
							{
								label: "Average confidence",
								value: `${totals.avgConfidence}%`
							},
							{
								label: "Active days (14d)",
								value: String(totals.daysActive)
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass-panel rounded-3xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-3xl font-bold tabular-nums",
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: s.label
							})]
						}, s.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-5 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-labelledby": "daily-heading",
							className: "glass-panel rounded-3xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "daily-heading",
								className: "text-sm font-semibold",
								children: "Gestures per day"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-64",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
										data: daily,
										margin: {
											top: 4,
											right: 4,
											bottom: 0,
											left: -18
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												opacity: .3
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "label",
												tick: { fontSize: 11 },
												interval: 2
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												allowDecimals: false,
												tick: { fontSize: 11 }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "gestures",
												fill: "var(--primary)",
												radius: [
													6,
													6,
													0,
													0
												]
											})
										]
									})
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-labelledby": "conf-heading",
							className: "glass-panel rounded-3xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "conf-heading",
								className: "text-sm font-semibold",
								children: "Confidence trend (%)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-64",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
										data: daily,
										margin: {
											top: 4,
											right: 4,
											bottom: 0,
											left: -18
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												opacity: .3
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "label",
												tick: { fontSize: 11 },
												interval: 2
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												domain: [0, 100],
												tick: { fontSize: 11 }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "avgConfidence",
												stroke: "var(--primary)",
												strokeWidth: 2,
												dot: false,
												connectNulls: true
											})
										]
									})
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "top-heading",
						className: "glass-panel mt-5 rounded-3xl p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "top-heading",
							className: "text-sm font-semibold",
							children: "Most used gestures"
						}), topGestures.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Translate some gestures on the dashboard and they'll show up here."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-3 flex flex-col gap-2",
							children: topGestures.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mr-2 text-muted-foreground tabular-nums",
									children: [i + 1, "."]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: g.gesture })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground tabular-nums",
									children: [g.count, "×"]
								})]
							}, g.gesture))
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { InsightsPage as component };
