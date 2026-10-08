import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { C as Keyboard, D as Gauge, c as Shield, k as Earth, r as Volume2, z as Camera } from "../_libs/lucide-react.mjs";
import { t as Reveal } from "./Reveal-BREbqJbe.mjs";
import { t as SectionHeading } from "./SectionHeading-DI-fwinA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/HowItWorks-D6Xkq1-Q.js
var import_jsx_runtime = require_jsx_runtime();
var featureList = [
	{
		icon: Camera,
		title: "Real-time gesture detection",
		body: "Hand landmarks are tracked at up to 60fps, so signs are recognised the moment they are formed — no pauses, no capture button."
	},
	{
		icon: Keyboard,
		title: "Gesture to text",
		body: "Recognised signs are assembled into fluent sentences with smart punctuation and context-aware phrase completion."
	},
	{
		icon: Volume2,
		title: "Natural voice output",
		body: "Speak translated text aloud with adjustable voice, pitch and speed, or send it straight to a conversation partner."
	},
	{
		icon: Gauge,
		title: "Visible confidence",
		body: "Every prediction shows a live confidence score, so users always know when to confirm rather than guess."
	},
	{
		icon: Shield,
		title: "Private by design",
		body: "Inference runs locally in the browser. Video frames are processed and discarded — nothing is uploaded or stored."
	},
	{
		icon: Earth,
		title: "Multi-vocabulary support",
		body: "ASL, BSL and custom gesture packs, including personal signs you can record and train in a few seconds."
	}
];
function Features() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-5 py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Features",
			title: "Built for conversations that can't wait",
			description: "Everything needed to turn movement into meaning — precise, transparent and comfortable to use all day."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
			children: featureList.map((feature, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * .06,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "group h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(feature.icon, {
								className: "h-5 w-5",
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-5 text-base font-semibold",
							children: feature.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: feature.body
						})
					]
				})
			}, feature.title))
		})]
	});
}
var steps = [
	{
		step: "01",
		title: "Enable the camera",
		body: "Grant one-time camera access. The feed stays on your device and can be paused or mirrored at any moment."
	},
	{
		step: "02",
		title: "Sign naturally",
		body: "The model tracks 21 hand landmarks per frame and matches the motion against your active gesture vocabulary."
	},
	{
		step: "03",
		title: "Read and speak",
		body: "Words appear instantly with a confidence score, then play aloud in the voice you chose — or copy them anywhere."
	}
];
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "How it works",
				title: "Three steps from gesture to conversation",
				description: "No calibration sessions, no wearables, no waiting. Open the dashboard and start talking."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-5 md:grid-cols-3",
				children: steps.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * .1,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-full rounded-2xl border border-border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient font-display text-3xl font-semibold",
								children: item.step
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 text-lg font-semibold",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: item.body
							})
						]
					})
				}, item.step))
			})]
		})
	});
}
//#endregion
export { HowItWorks as n, Features as t };
