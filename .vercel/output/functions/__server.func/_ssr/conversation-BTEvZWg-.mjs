import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as MicOff, g as Mic, r as Volume2 } from "../_libs/lucide-react.mjs";
import { r as Navbar, t as Button } from "./Navbar-DqEYdomU.mjs";
import { n as useServiceWorker, t as SkipLink } from "./useServiceWorker-FNXF9_Bm.mjs";
import { t as WebcamPanel } from "./landmarks-DRiN0tYA.mjs";
import { n as PerformanceHUD, r as useGesturePipeline } from "./useGesturePipeline-DxMvLYaA.mjs";
import { t as speak } from "./speech-CRDnlBSF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conversation-BTEvZWg-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Wraps the Web Speech API for the conversation partner's side.
* Final transcripts are delivered via onFinal; interim text is exposed
* for a live "hearing…" indicator.
*/
function useSpeechRecognition(opts = {}) {
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [interim, setInterim] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const recRef = (0, import_react.useRef)(null);
	const cbRef = (0, import_react.useRef)(opts.onFinal);
	cbRef.current = opts.onFinal;
	const langRef = (0, import_react.useRef)(opts.lang ?? "en-US");
	langRef.current = opts.lang ?? "en-US";
	const supported = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
	const stop = (0, import_react.useCallback)(() => {
		recRef.current?.stop();
	}, []);
	const start = (0, import_react.useCallback)(() => {
		const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
		if (!Ctor) {
			setStatus("unsupported");
			return;
		}
		recRef.current?.abort();
		const rec = new Ctor();
		rec.continuous = true;
		rec.interimResults = true;
		rec.lang = langRef.current;
		rec.onresult = (event) => {
			let interimText = "";
			for (let i = event.resultIndex; i < event.results.length; i++) {
				const item = event.results[i];
				const text = item[0].transcript;
				if (item.isFinal) {
					const trimmed = text.trim();
					if (trimmed) cbRef.current?.(trimmed);
				} else interimText += text;
			}
			setInterim(interimText);
		};
		rec.onerror = (event) => {
			setError(event.error);
			setStatus("error");
		};
		rec.onend = () => {
			setStatus((s) => s === "listening" ? "idle" : s);
			setInterim("");
		};
		recRef.current = rec;
		setError("");
		setInterim("");
		setStatus("listening");
		try {
			rec.start();
		} catch {
			setStatus("error");
		}
	}, []);
	(0, import_react.useEffect)(() => () => recRef.current?.abort(), []);
	return {
		status,
		interim,
		error,
		supported,
		start,
		stop
	};
}
function ConversationPage() {
	const [active, setActive] = (0, import_react.useState)(false);
	const [videoEl, setVideoEl] = (0, import_react.useState)(null);
	const [log, setLog] = (0, import_react.useState)([]);
	const logRef = (0, import_react.useRef)(null);
	useServiceWorker();
	const pushLog = (0, import_react.useCallback)((speaker, text) => {
		const trimmed = text.trim();
		if (!trimmed) return;
		setLog((prev) => [...prev.slice(-49), {
			id: crypto.randomUUID(),
			speaker,
			text: trimmed,
			at: /* @__PURE__ */ new Date()
		}]);
	}, []);
	const handleStableGesture = (0, import_react.useCallback)((g) => pushLog("signer", g.phrase), [pushLog]);
	const { live, metrics } = useGesturePipeline(videoEl, active, { onStableGesture: handleStableGesture });
	const rec = useSpeechRecognition({ onFinal: (0, import_react.useCallback)((text) => pushLog("partner", text), [pushLog]) });
	const handleVideoReady = (0, import_react.useCallback)((video) => {
		setVideoEl(video);
	}, []);
	(0, import_react.useEffect)(() => {
		const el = logRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [log]);
	const lastSignerMessage = [...log].reverse().find((e) => e.speaker === "signer");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipLink, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main-content",
				className: "mx-auto max-w-7xl px-5 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold sm:text-3xl",
						children: "Conversation mode"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-2xl text-sm text-muted-foreground",
						children: "You sign, they speak — both sides land in one shared transcript."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-5 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WebcamPanel, {
								active,
								onToggle: setActive,
								onVideoReady: handleVideoReady
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceHUD, {
								metrics,
								live,
								active
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-labelledby": "partner-heading",
							className: "glass-panel flex flex-col rounded-3xl p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									id: "partner-heading",
									className: "text-sm font-semibold",
									children: "Conversation partner"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: rec.supported ? "Tap the microphone and speak — your words are transcribed live." : "Speech recognition isn't supported in this browser. Try Chrome or Edge."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center gap-3",
									children: [rec.status === "listening" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										className: "h-11 rounded-full px-5",
										onClick: rec.stop,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, {
											className: "mr-1.5 h-4 w-4",
											"aria-hidden": "true"
										}), "Stop listening"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "h-11 rounded-full px-5",
										disabled: !rec.supported,
										onClick: rec.start,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {
											className: "mr-1.5 h-4 w-4",
											"aria-hidden": "true"
										}), "Start listening"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										role: "status",
										children: rec.status === "listening" ? rec.interim || "Listening…" : rec.status === "error" ? `Mic error: ${rec.error || "unknown"}` : "Mic idle"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 flex-1" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "h-11 self-start rounded-full px-5",
									disabled: !lastSignerMessage,
									onClick: () => {
										if (lastSignerMessage) speak(lastSignerMessage.text);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
										className: "mr-1.5 h-4 w-4",
										"aria-hidden": "true"
									}), "Voice last signed message"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "log-heading",
						className: "mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "log-heading",
							className: "sr-only",
							children: "Conversation transcript"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: logRef,
							"aria-live": "polite",
							className: "glass-panel h-72 overflow-y-auto rounded-3xl p-5",
							children: log.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Nothing said yet — sign or speak to begin the conversation."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "flex flex-col gap-3",
								children: log.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: `max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${e.speaker === "signer" ? "self-start bg-primary/10" : "self-end bg-muted"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
										children: e.speaker === "signer" ? "Signed" : "Spoken"
									}), e.text]
								}, e.id))
							})
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { ConversationPage as component };
