import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { M as Cpu, a as Trash2, j as Database, z as Camera } from "../_libs/lucide-react.mjs";
import { r as Navbar } from "./Navbar-DqEYdomU.mjs";
import { n as useServiceWorker, t as SkipLink } from "./useServiceWorker-FNXF9_Bm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-D_Ln881u.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Privacy dashboard — shows exactly what happens to the user's data.
* The whole point is verifiability: every claim here maps to real code.
*/
var FLOW = [
	{
		icon: Camera,
		title: "Camera frame",
		body: "Captured at 30 fps by getUserMedia. Never uploaded, never stored."
	},
	{
		icon: Cpu,
		title: "21 hand landmarks",
		body: "MediaPipe extracts anonymous skeleton points on-device (WASM). The pixels are discarded with the frame."
	},
	{
		icon: Database,
		title: "Stays on your device",
		body: "Gesture history, custom gestures and settings live in this browser's local storage only."
	},
	{
		icon: Trash2,
		title: "Nothing to delete remotely",
		body: "There is no account and no server copy. Clearing site data erases everything."
	}
];
function PrivacyDashboard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": "privacy-heading",
		className: "glass-panel rounded-3xl p-6 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "privacy-heading",
					className: "text-lg font-semibold",
					children: "Your data, visualised"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300",
					role: "status",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-1.5 w-1.5 rounded-full bg-emerald-500",
						"aria-hidden": "true"
					}), "0 bytes uploaded this session"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: FLOW.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "relative rounded-2xl border border-border bg-background/60 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-2.5 left-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground",
							"aria-hidden": "true",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(step.icon, {
							className: "h-5 w-5 text-primary",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 text-sm font-semibold",
							children: step.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted-foreground",
							children: step.body
						})
					]
				}, step.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-xs text-muted-foreground",
				children: "Network requests during a session are limited to loading the app itself and the open-source hand-tracking model — both cached after first load for offline use. Audit it yourself in DevTools → Network."
			})
		]
	});
}
function PrivacyPage() {
	useServiceWorker();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipLink, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main-content",
				className: "mx-auto max-w-5xl px-5 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold sm:text-3xl",
						children: "Privacy by architecture"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-muted-foreground",
						children: "SignSpeak AI was designed so there is nothing sensitive to leak: recognition happens entirely on your device. This page shows the complete data flow — no fine print."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacyDashboard, {})
					})
				]
			})
		]
	});
}
//#endregion
export { PrivacyPage as component };
