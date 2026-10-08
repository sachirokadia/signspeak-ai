import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as Navbar } from "./Navbar-DqEYdomU.mjs";
import { t as Footer } from "./Footer-CVa6tLP-.mjs";
import { n as SEED_HISTORY, t as GestureHistory } from "./GestureHistory-DZvHMPbZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-BKqru57V.js
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const total = SEED_HISTORY.length;
	const average = Math.round(SEED_HISTORY.reduce((sum, e) => sum + e.confidence, 0) / total * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-4xl px-5 py-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-semibold",
						children: "Conversation history"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Stored locally on this device. Clear it any time from Settings."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-3",
						children: [
							["Phrases translated", String(total)],
							["Average confidence", `${average}%`],
							["Storage", "This device only"]
						].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display mt-1.5 text-xl font-semibold",
								children: value
							})]
						}, label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GestureHistory, {
						entries: SEED_HISTORY,
						className: "mt-6",
						height: "h-[26rem]"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { HistoryPage as component };
