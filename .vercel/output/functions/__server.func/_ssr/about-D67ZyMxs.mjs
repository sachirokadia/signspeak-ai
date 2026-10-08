import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as Navbar, t as Button } from "./Navbar-DqEYdomU.mjs";
import { t as Footer } from "./Footer-CVa6tLP-.mjs";
import { t as Reveal } from "./Reveal-BREbqJbe.mjs";
import { t as SectionHeading } from "./SectionHeading-DI-fwinA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-D67ZyMxs.js
var import_jsx_runtime = require_jsx_runtime();
var values = [
	["Dignity first", "A translation tool should never make someone feel like a subject of study. Every interaction is designed to be quiet, quick and ordinary."],
	["Nothing leaves the device", "Camera frames are processed locally and discarded. History is stored on the device and can be wiped in one tap."],
	["Transparent by default", "Confidence scores, model versions and detected gestures are always visible — no black box speaking on your behalf."],
	["Built with, not for", "Deaf advocates, interpreters and speech therapists review every release before it ships."]
];
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "bg-soft border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-3xl px-5 py-20 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-4xl font-semibold text-balance sm:text-5xl",
							children: [
								"We're building the shortest path between",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "a gesture and being understood"
								}),
								"."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground text-pretty",
							children: "SignSpeak AI began in a hospital waiting room, where a 40-minute wait for an interpreter meant a patient couldn't describe their own pain. We thought the phone already in their pocket should be enough. Three years later, it is."
						})] })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-6xl px-5 py-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						eyebrow: "Our values",
						title: "Four principles we don't trade away"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-14 grid gap-5 sm:grid-cols-2",
						children: values.map(([heading, body], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * .07,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "h-full rounded-2xl border border-border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-semibold",
									children: heading
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2.5 text-sm leading-relaxed text-muted-foreground",
									children: body
								})]
							})
						}, heading))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "border-t border-border bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-3xl px-5 py-20 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-semibold text-balance",
								children: "Try it in your own hands"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-muted-foreground",
								children: "The dashboard works right now, in this browser, without an account."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								className: "bg-brand mt-8 h-12 rounded-full px-6 shadow-soft transition-transform hover:scale-[1.02]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard",
									children: "Open the dashboard"
								})
							})
						] })
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { About as component };
