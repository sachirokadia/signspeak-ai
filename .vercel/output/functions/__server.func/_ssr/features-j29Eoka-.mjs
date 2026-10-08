import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as Navbar, t as Button } from "./Navbar-DqEYdomU.mjs";
import { t as Footer } from "./Footer-CVa6tLP-.mjs";
import { t as Reveal } from "./Reveal-BREbqJbe.mjs";
import { n as HowItWorks, t as Features } from "./HowItWorks-D6Xkq1-Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/features-j29Eoka-.js
var import_jsx_runtime = require_jsx_runtime();
function FeaturesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "bg-soft border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-3xl px-5 py-20 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-4xl font-semibold text-balance sm:text-5xl",
								children: ["A translation engine you can ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "see working"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground text-pretty",
								children: "Every part of SignSpeak AI is tuned for the moment between forming a sign and being heard."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								className: "bg-brand mt-8 h-12 rounded-full px-6 shadow-soft transition-transform hover:scale-[1.02]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard",
									children: "Try it live"
								})
							})
						] })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Features, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { FeaturesPage as component };
