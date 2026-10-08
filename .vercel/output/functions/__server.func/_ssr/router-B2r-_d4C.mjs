import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createFileRoute, b as useRouter, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRouteWithContext, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B2r-_d4C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BuehnbU7.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "SignSpeak AI — Gesture to speech, in real time" },
			{
				name: "description",
				content: "SignSpeak AI converts hand gestures into live text and natural speech using your webcam — private, on-device and accessible."
			},
			{
				name: "author",
				content: "SignSpeak AI"
			},
			{
				property: "og:title",
				content: "SignSpeak AI — Gesture to speech, in real time"
			},
			{
				property: "og:description",
				content: "AI-powered accessibility platform that turns hand gestures into text and speech."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "bottom-right" })]
	});
}
var $$splitComponentImporter$11 = () => import("./routes-CDqMIHjC.mjs");
var title$11 = "SignSpeak AI — Turn hand gestures into text and speech";
var description$11 = "SignSpeak AI reads sign language through your webcam and converts it into live text and natural speech, privately and on-device.";
var Route$11 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: title$11 },
		{
			name: "description",
			content: description$11
		},
		{
			property: "og:title",
			content: title$11
		},
		{
			property: "og:description",
			content: description$11
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./about-D67ZyMxs.mjs");
var title$10 = "About — SignSpeak AI";
var description$10 = "Why we built SignSpeak AI: closing the interpreter gap with private, on-device gesture recognition designed with the Deaf community.";
var Route$10 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: title$10 },
		{
			name: "description",
			content: description$10
		},
		{
			property: "og:title",
			content: title$10
		},
		{
			property: "og:description",
			content: description$10
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./contact-BXoBna6N.mjs");
var title$9 = "Contact — SignSpeak AI";
var description$9 = "Talk to the SignSpeak AI team about accessibility partnerships, clinical deployments, custom gesture packs or support.";
var Route$9 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: title$9 },
		{
			name: "description",
			content: description$9
		},
		{
			property: "og:title",
			content: title$9
		},
		{
			property: "og:description",
			content: description$9
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./conversation-BTEvZWg-.mjs");
var title$8 = "Conversation mode — SignSpeak AI";
var description$8 = "Two-way communication: sign language to speech on one side, spoken replies transcribed on the other.";
var Route$8 = createFileRoute("/conversation")({
	head: () => ({ meta: [
		{ title: title$8 },
		{
			name: "description",
			content: description$8
		},
		{
			property: "og:title",
			content: title$8
		},
		{
			property: "og:description",
			content: description$8
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./dashboard-e6-f1awh.mjs");
var title$7 = "Dashboard — SignSpeak AI";
var description$7 = "Translate hand gestures in real time: live webcam feed, detected gesture, confidence score, voice output and gesture history.";
/**
* Speech only fires for gestures at or above this confidence — the
* confidence-gating half of the Decision Engine, applied at the output.
*/
var Route$7 = createFileRoute("/dashboard")({
	head: () => ({ meta: [
		{ title: title$7 },
		{
			name: "description",
			content: description$7
		},
		{
			property: "og:title",
			content: title$7
		},
		{
			property: "og:description",
			content: description$7
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
/**
* The dashboard is entirely browser-dependent (camera, WebRTC, IndexedDB,
* Web Speech). It renders client-only: the server emits a lightweight
* placeholder, avoiding SSR of the browser-only module graph entirely.
*/
var $$splitComponentImporter$6 = () => import("./features-j29Eoka-.mjs");
var title$6 = "Features — SignSpeak AI";
var description$6 = "Real-time gesture detection, gesture-to-text, natural voice output, live confidence scores and on-device privacy.";
var Route$6 = createFileRoute("/features")({
	head: () => ({ meta: [
		{ title: title$6 },
		{
			name: "description",
			content: description$6
		},
		{
			property: "og:title",
			content: title$6
		},
		{
			property: "og:description",
			content: description$6
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./history-BKqru57V.mjs");
var title$5 = "History — SignSpeak AI";
var description$5 = "Review every translated phrase, its source gesture, confidence score and time — and replay any of them as speech.";
var Route$5 = createFileRoute("/history")({
	head: () => ({ meta: [
		{ title: title$5 },
		{
			name: "description",
			content: description$5
		},
		{
			property: "og:title",
			content: title$5
		},
		{
			property: "og:description",
			content: description$5
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./insights-G1rr_By-.mjs");
var title$4 = "Insights — SignSpeak AI";
var description$4 = "Your signing activity: gestures per day, confidence trends and most-used signs.";
var Route$4 = createFileRoute("/insights")({
	head: () => ({ meta: [
		{ title: title$4 },
		{
			name: "description",
			content: description$4
		},
		{
			property: "og:title",
			content: title$4
		},
		{
			property: "og:description",
			content: description$4
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./learn-B47o3BKI.mjs");
var title$3 = "Learn mode — SignSpeak AI";
var description$3 = "Practice hand gestures with live feedback: hold each sign steady to score.";
var Route$3 = createFileRoute("/learn")({
	head: () => ({ meta: [
		{ title: title$3 },
		{
			name: "description",
			content: description$3
		},
		{
			property: "og:title",
			content: title$3
		},
		{
			property: "og:description",
			content: description$3
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./privacy-D_Ln881u.mjs");
var title$2 = "Privacy — SignSpeak AI";
var description$2 = "How SignSpeak AI handles your data: on-device inference, zero uploads, local-only storage.";
var Route$2 = createFileRoute("/privacy")({
	head: () => ({ meta: [
		{ title: title$2 },
		{
			name: "description",
			content: description$2
		},
		{
			property: "og:title",
			content: title$2
		},
		{
			property: "og:description",
			content: description$2
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./settings-8k1-vWYK.mjs");
var title$1 = "Settings — SignSpeak AI";
var description$1 = "Tune recognition sensitivity, gesture vocabulary, voice output, accessibility preferences and data retention.";
var Route$1 = createFileRoute("/settings")({
	head: () => ({ meta: [
		{ title: title$1 },
		{
			name: "description",
			content: description$1
		},
		{
			property: "og:title",
			content: title$1
		},
		{
			property: "og:description",
			content: description$1
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./studio-CnJSX1YV.mjs");
var title = "Gesture Studio — SignSpeak AI";
var description = "Teach SignSpeak your own gestures: record samples from your webcam, train an on-device classifier, and test it live.";
var Route = createFileRoute("/studio")({
	head: () => ({ meta: [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$11.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$12
	}),
	AboutRoute: Route$10.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$12
	}),
	ContactRoute: Route$9.update({
		id: "/contact",
		path: "/contact",
		getParentRoute: () => Route$12
	}),
	ConversationRoute: Route$8.update({
		id: "/conversation",
		path: "/conversation",
		getParentRoute: () => Route$12
	}),
	DashboardRoute: Route$7.update({
		id: "/dashboard",
		path: "/dashboard",
		getParentRoute: () => Route$12
	}),
	FeaturesRoute: Route$6.update({
		id: "/features",
		path: "/features",
		getParentRoute: () => Route$12
	}),
	HistoryRoute: Route$5.update({
		id: "/history",
		path: "/history",
		getParentRoute: () => Route$12
	}),
	InsightsRoute: Route$4.update({
		id: "/insights",
		path: "/insights",
		getParentRoute: () => Route$12
	}),
	LearnRoute: Route$3.update({
		id: "/learn",
		path: "/learn",
		getParentRoute: () => Route$12
	}),
	PrivacyRoute: Route$2.update({
		id: "/privacy",
		path: "/privacy",
		getParentRoute: () => Route$12
	}),
	SettingsRoute: Route$1.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$12
	}),
	StudioRoute: Route.update({
		id: "/studio",
		path: "/studio",
		getParentRoute: () => Route$12
	})
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
