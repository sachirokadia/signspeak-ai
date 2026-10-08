import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useServiceWorker-FNXF9_Bm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Skip link — first Tab stop on the page, jumps straight to the main
* content. Invisible until focused.
*/
function SkipLink({ targetId = "main-content" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: `#${targetId}`,
		className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground",
		children: "Skip to main content"
	});
}
/**
* Registers /sw.js once. Returns true when a worker is in control —
* the thing that makes the offline claim real.
*/
function useServiceWorker() {
	const [controlled, setControlled] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!("serviceWorker" in navigator)) return;
		let cancelled = false;
		navigator.serviceWorker.register("/sw.js").then(() => {
			if (!cancelled) setControlled(true);
		}).catch(() => {
			if (!cancelled) setControlled(false);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	return controlled;
}
//#endregion
export { useServiceWorker as n, SkipLink as t };
