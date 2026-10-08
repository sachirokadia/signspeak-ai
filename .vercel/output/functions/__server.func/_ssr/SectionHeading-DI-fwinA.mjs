import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Reveal } from "./Reveal-BREbqJbe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SectionHeading-DI-fwinA.js
var import_jsx_runtime = require_jsx_runtime();
function SectionHeading({ eyebrow, title, description, align = "center" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
		className: align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
		children: [
			eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
				children: eyebrow
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 text-3xl font-semibold text-balance sm:text-4xl",
				children: title
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-base leading-relaxed text-muted-foreground text-pretty",
				children: description
			}) : null
		]
	});
}
//#endregion
export { SectionHeading as t };
