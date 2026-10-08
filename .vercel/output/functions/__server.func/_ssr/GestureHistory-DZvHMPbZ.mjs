import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as Volume2, w as History } from "../_libs/lucide-react.mjs";
import { i as cn, t as Button } from "./Navbar-DqEYdomU.mjs";
import { i as AnimatePresence } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GestureHistory-DZvHMPbZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SEED_HISTORY = [
	{
		id: "s1",
		gesture: "Open Palm",
		phrase: "Hello",
		confidence: .97,
		at: /* @__PURE__ */ new Date(Date.now() - 36e4)
	},
	{
		id: "s2",
		gesture: "Pinch Draw",
		phrase: "How are you?",
		confidence: .93,
		at: /* @__PURE__ */ new Date(Date.now() - 84e4)
	},
	{
		id: "s3",
		gesture: "Flat Hand → Chin",
		phrase: "Thank you",
		confidence: .99,
		at: /* @__PURE__ */ new Date(Date.now() - 246e4)
	},
	{
		id: "s4",
		gesture: "Two Hands Rise",
		phrase: "I need help",
		confidence: .88,
		at: /* @__PURE__ */ new Date(Date.now() - 378e4)
	},
	{
		id: "s5",
		gesture: "Wave",
		phrase: "Goodbye",
		confidence: .95,
		at: /* @__PURE__ */ new Date(Date.now() - 72e5)
	}
];
function formatTime(date) {
	return date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit"
	});
}
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
function GestureHistory({ entries, className = "", height = "h-80" }) {
	function replay(entry) {
		if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
		const utterance = new SpeechSynthesisUtterance(entry.phrase);
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(utterance);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `glass-panel rounded-3xl ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center gap-2 border-b border-border px-6 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, {
					className: "h-4 w-4 text-muted-foreground",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Gesture history"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-auto text-xs text-muted-foreground",
					children: [entries.length, " entries"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
			className: height,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "divide-y divide-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					initial: false,
					children: entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.li, {
						layout: true,
						initial: {
							opacity: 0,
							y: -10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: { opacity: 0 },
						transition: { duration: .3 },
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-6 py-4 transition-colors hover:bg-surface",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: entry.phrase
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 truncate text-xs text-muted-foreground",
								children: [
									entry.gesture,
									" · ",
									formatTime(entry.at)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground",
								children: [Math.round(entry.confidence * 100), "%"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": `Replay ${entry.phrase}`,
								className: "min-h-11 min-w-11 rounded-full",
								onClick: () => replay(entry),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
							})]
						})]
					}, entry.id))
				}), entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-6 py-10 text-center text-sm text-muted-foreground",
					children: "Recognised phrases will appear here."
				}) : null]
			})
		})]
	});
}
//#endregion
export { SEED_HISTORY as n, formatTime as r, GestureHistory as t };
