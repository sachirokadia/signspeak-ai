import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as Logo } from "./Navbar-DqEYdomU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Footer-CVa6tLP-.js
var import_jsx_runtime = require_jsx_runtime();
var groups = [{
	title: "Product",
	links: [
		{
			to: "/features",
			label: "Features"
		},
		{
			to: "/dashboard",
			label: "Dashboard"
		},
		{
			to: "/history",
			label: "History"
		},
		{
			to: "/settings",
			label: "Settings"
		}
	]
}, {
	title: "Company",
	links: [{
		to: "/about",
		label: "About"
	}, {
		to: "/contact",
		label: "Contact"
	}]
}];
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground",
					children: "Real-time gesture recognition that turns hand signs into text and natural speech — built for non-verbal communication, on any device with a camera."
				})]
			}), groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: group.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2.5",
				children: group.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: link.to,
					className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
					children: link.label
				}) }, link.to))
			})] }, group.title))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" SignSpeak AI. Communication belongs to everyone."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "WCAG 2.2 AA · On-device inference · Privacy first" })]
			})
		})]
	});
}
//#endregion
export { Footer as t };
