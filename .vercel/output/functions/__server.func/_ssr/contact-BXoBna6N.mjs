import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { S as Mail, v as MessageSquare, x as MapPin } from "../_libs/lucide-react.mjs";
import { i as cn, r as Navbar, t as Button } from "./Navbar-DqEYdomU.mjs";
import { t as Footer } from "./Footer-CVa6tLP-.mjs";
import { t as Reveal } from "./Reveal-BREbqJbe.mjs";
import { t as Label } from "./label-sLQh1eXl.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-BXoBna6N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var details = [
	{
		icon: Mail,
		label: "Email",
		value: "hello@signspeak.ai"
	},
	{
		icon: MessageSquare,
		label: "Support",
		value: "Weekdays, 9:00–18:00 CET"
	},
	{
		icon: MapPin,
		label: "Studio",
		value: "Lisbon · Remote-first team"
	}
];
function Contact() {
	const [sending, setSending] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "bg-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-4xl font-semibold text-balance",
							children: ["Let's make your space ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient",
								children: "accessible"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 leading-relaxed text-muted-foreground text-pretty",
							children: "Whether you run a clinic, a classroom or a service desk, we'll help you deploy SignSpeak AI and train custom gestures for your context."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-10 space-y-4",
							children: details.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
										className: "h-5 w-5",
										"aria-hidden": "true"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: item.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-sm font-medium",
										children: item.value
									})]
								})]
							}, item.label))
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: .1,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "glass-panel rounded-3xl p-7",
							onSubmit: (event) => {
								event.preventDefault();
								setSending(true);
								window.setTimeout(() => {
									setSending(false);
									toast("Message sent", { description: "We'll reply within one business day." });
									event.target.reset();
								}, 700);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-5 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "name",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										name: "name",
										required: true,
										className: "mt-2 h-11",
										placeholder: "Alex Moreau"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										name: "email",
										type: "email",
										required: true,
										className: "mt-2 h-11",
										placeholder: "alex@clinic.org"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "organisation",
										children: "Organisation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "organisation",
										name: "organisation",
										className: "mt-2 h-11",
										placeholder: "Riverside Community Clinic"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "message",
										children: "How can we help?"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "message",
										name: "message",
										required: true,
										rows: 5,
										className: "mt-2",
										placeholder: "Tell us about your setting and the people you support…"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: sending,
									className: "bg-brand mt-6 h-12 w-full rounded-full text-[15px]",
									children: sending ? "Sending…" : "Send message"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-center text-xs text-muted-foreground",
									children: "We never share your details. Replies come from a real person."
								})
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Contact as component };
