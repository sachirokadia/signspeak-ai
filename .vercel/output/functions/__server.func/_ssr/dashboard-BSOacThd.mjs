import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { A as Download, N as Copy, a as Trash2, h as Pause, m as Play, n as WifiOff, r as Volume2, s as Siren, t as X, y as MessageSquareText } from "../_libs/lucide-react.mjs";
import { r as Navbar, t as Button } from "./Navbar-DqEYdomU.mjs";
import { i as AnimatePresence } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as Label } from "./label-sLQh1eXl.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useServiceWorker, t as SkipLink } from "./useServiceWorker-FNXF9_Bm.mjs";
import { t as WebcamPanel } from "./landmarks-D6NK4_y0.mjs";
import { n as PerformanceHUD, r as useGesturePipeline } from "./useGesturePipeline--wvkKH1P.mjs";
import { t as speak } from "./speech-CRDnlBSF.mjs";
import { n as Switch, t as Slider } from "./switch-DHNdwtX3.mjs";
import { n as SEED_HISTORY, r as formatTime, t as GestureHistory } from "./GestureHistory-DZvHMPbZ.mjs";
import { n as saveHistory, t as loadHistory } from "./historyStore-B5Ktctdd.mjs";
import { i as loadCustomPredictor } from "./customGestures-DmtUdBqY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BSOacThd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Small banner shown while the browser reports no connectivity. */
function OfflineIndicator() {
	const [online, setOnline] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		setOnline(navigator.onLine);
		const goOffline = () => setOnline(false);
		const goOnline = () => setOnline(true);
		window.addEventListener("offline", goOffline);
		window.addEventListener("online", goOnline);
		return () => {
			window.removeEventListener("offline", goOffline);
			window.removeEventListener("online", goOnline);
		};
	}, []);
	if (online) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "status",
		className: "flex items-center justify-center gap-2 bg-amber-400/95 px-4 py-2 text-center text-xs font-medium text-amber-950",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, {
			className: "h-3.5 w-3.5",
			"aria-hidden": "true"
		}), "You're offline — gesture translation keeps working on-device."]
	});
}
function TranslationPanel({ transcript, current, autoSpeak, onAutoSpeakChange, rate, onRateChange, onClear, active, onToggle }) {
	const confidence = current ? Math.round(current.confidence * 100) : 0;
	function speak() {
		if (!transcript.trim()) {
			toast("Nothing to speak yet", { description: "Start signing to build a sentence." });
			return;
		}
		if (typeof window === "undefined" || !("speechSynthesis" in window)) {
			toast("Speech output unavailable", { description: "This browser doesn't support speech synthesis." });
			return;
		}
		const utterance = new SpeechSynthesisUtterance(transcript);
		utterance.rate = rate;
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(utterance);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "glass-panel rounded-3xl p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "truncate text-sm font-semibold",
								children: "Live translation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: "Updates as each sign is recognised"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "shrink-0 rounded-full",
							onClick: () => onToggle(!active),
							children: [active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "mr-1.5 h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-1.5 h-3.5 w-3.5" }), active ? "Pause" : "Resume"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"aria-live": "polite",
						className: "mt-5 min-h-32 rounded-2xl border border-border bg-background/70 p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl leading-relaxed font-medium text-pretty",
							children: transcript || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Waiting for your first gesture…"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: speak,
								className: "bg-brand h-11 rounded-full px-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "mr-1.5 h-4 w-4" }), "Speak"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "h-11 rounded-full px-5",
								onClick: () => {
									navigator.clipboard?.writeText(transcript);
									toast("Copied to clipboard");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1.5 h-4 w-4" }), "Copy"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "h-11 rounded-full px-5",
								onClick: onClear,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1.5 h-4 w-4" }), "Clear"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "glass-panel rounded-3xl p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Detected gesture"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
							mode: "wait",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
								initial: {
									opacity: 0,
									y: 8
								},
								animate: {
									opacity: 1,
									y: 0
								},
								exit: {
									opacity: 0,
									y: -8
								},
								transition: { duration: .28 },
								className: "font-display mt-3 text-2xl font-semibold",
								children: current?.gesture ?? "—"
							}, current?.id ?? "none")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: current ? `Recognised at ${formatTime(current.at)}` : "No gesture in frame"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "glass-panel rounded-3xl p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold",
								children: "Confidence"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-gradient font-display text-2xl font-semibold",
								children: [confidence, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-2 overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								className: "bg-brand h-full rounded-full",
								animate: { width: `${confidence}%` },
								transition: {
									duration: .5,
									ease: [
										.22,
										1,
										.36,
										1
									]
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: confidence >= 90 ? "High certainty — safe to speak automatically." : confidence > 0 ? "Moderate certainty — confirm before speaking." : "Waiting for a prediction."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "glass-panel rounded-3xl p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Voice output"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "auto-speak",
							className: "text-sm font-medium",
							children: "Speak each phrase automatically"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							id: "auto-speak",
							checked: autoSpeak,
							onCheckedChange: onAutoSpeakChange
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "rate",
								className: "text-sm font-medium",
								children: "Speech rate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [rate.toFixed(1), "×"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							id: "rate",
							className: "mt-3",
							value: [rate],
							min: .5,
							max: 1.8,
							step: .1,
							onValueChange: ([value]) => onRateChange(value ?? 1)
						})]
					})
				]
			})
		]
	});
}
/**
* Composes confirmed gestures into a speakable sentence. Each stable
* gesture appends a word chip; the user curates the message, then speaks it.
*/
function SentenceBuilder({ words, onRemoveWord, onClear, onSpeak }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": "sentence-heading",
		className: "glass-panel rounded-3xl p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				id: "sentence-heading",
				className: "flex items-center gap-2 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquareText, {
					className: "h-4 w-4",
					"aria-hidden": "true"
				}), "Sentence builder"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					className: "rounded-full",
					onClick: onClear,
					disabled: words.length === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
						className: "mr-1.5 h-3.5 w-3.5",
						"aria-hidden": "true"
					}), "Clear"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "rounded-full",
					onClick: onSpeak,
					disabled: words.length === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
						className: "mr-1.5 h-3.5 w-3.5",
						"aria-hidden": "true"
					}), "Speak sentence"]
				})]
			})]
		}), words.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs leading-relaxed text-muted-foreground",
			children: "Sign gestures and they will appear here as words. Remove any you don't want, then speak the whole sentence aloud."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			role: "list",
			"aria-label": "Composed sentence",
			children: words.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				role: "listitem",
				className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-background py-1.5 pl-3.5 pr-2 text-sm",
				children: [w.text, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onRemoveWord(w.id),
					"aria-label": `Remove word ${w.text}`,
					className: "grid h-5 w-5 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "h-3 w-3",
						"aria-hidden": "true"
					})
				})]
			}, w.id))
		})]
	});
}
var APP_LANGS = [{
	id: "en",
	label: "English",
	speechLang: "en-US"
}, {
	id: "hi",
	label: "हिन्दी",
	speechLang: "hi-IN"
}];
/** Phrase keys used by GestureDefinition.phraseKey. */
var PHRASES = {
	en: {
		hello: "Hello",
		yes: "Yes",
		"im-okay": "I'm okay",
		water: "Water, please",
		"that-one": "That one",
		"thank-you": "Thank you",
		help: "I need help",
		call: "Please call someone",
		repeat: "Can you repeat that?",
		goodbye: "Goodbye"
	},
	hi: {
		hello: "नमस्ते",
		yes: "हाँ",
		"im-okay": "मैं ठीक हूँ",
		water: "पानी चाहिए",
		"that-one": "वह वाला",
		"thank-you": "धन्यवाद",
		help: "मुझे मदद चाहिए",
		call: "कृपया किसी को बुलाइए",
		repeat: "क्या आप दोहरा सकते हैं?",
		goodbye: "अलविदा"
	}
};
function speechLangFor(lang) {
	return APP_LANGS.find((l) => l.id === lang)?.speechLang ?? "en-US";
}
/** Resolve a phrase key, falling back to the English phrase and then the key. */
function resolvePhrase(phraseKey, fallback, lang) {
	return PHRASES[lang]?.[phraseKey] ?? PHRASES.en[phraseKey] ?? fallback;
}
var EMERGENCY_KEYS = [
	"help",
	"call",
	"water",
	"repeat"
];
/**
* One-tap essential phrases for urgent moments — big targets, immediate
* speech, no camera needed.
*/
function EmergencyPhrasebook({ lang }) {
	const say = (key, fallback) => {
		speak(resolvePhrase(key, fallback, lang), {
			lang: speechLangFor(lang),
			rate: .95
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": "emergency-heading",
		className: "glass-panel rounded-3xl border-destructive/20 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				id: "emergency-heading",
				className: "flex items-center gap-2 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Siren, {
					className: "h-4 w-4 text-destructive",
					"aria-hidden": "true"
				}), "Emergency phrases"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-2 gap-2",
				children: EMERGENCY_KEYS.map((key) => {
					const text = resolvePhrase(key, key, lang);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "h-auto min-h-14 flex-col gap-1 rounded-2xl px-3 py-2.5 text-sm font-medium",
						onClick: () => say(key, key),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
							className: "h-4 w-4 opacity-70",
							"aria-hidden": "true"
						}), text]
					}, key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] text-muted-foreground",
				children: "Spoken immediately in the selected language."
			})
		]
	});
}
function csvCell(value) {
	const s = String(value);
	return /[",\n]/.test(s) ? `"${s.replace(/"/g, "\"\"")}"` : s;
}
/** Download gesture history as CSV — for therapists, teachers, carers. */
function exportHistoryCsv(entries) {
	const header = [
		"timestamp",
		"gesture",
		"phrase",
		"confidence"
	];
	const rows = entries.map((e) => [
		csvCell(e.at instanceof Date ? e.at.toISOString() : String(e.at)),
		csvCell(e.gesture),
		csvCell(e.phrase),
		csvCell(Math.round(e.confidence * 100) / 100)
	].join(","));
	const csv = [header.join(","), ...rows].join("\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `signspeak-history-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 5e3);
}
/** Download the gesture history as CSV — for therapists and teachers. */
function ExportHistoryButton({ entries }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		size: "sm",
		className: "rounded-full",
		disabled: entries.length === 0,
		onClick: () => exportHistoryCsv(entries),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
			className: "mr-1.5 h-3.5 w-3.5",
			"aria-hidden": "true"
		}), "Export CSV"]
	});
}
var KEY = "signspeak-settings-v1";
var DEFAULTS = { lang: "en" };
function load() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return DEFAULTS;
		return { lang: JSON.parse(raw).lang === "hi" ? "hi" : "en" };
	} catch {
		return DEFAULTS;
	}
}
/** App settings (currently: interface/spoken language), persisted locally. */
function useSettings() {
	const [settings, setSettings] = (0, import_react.useState)(DEFAULTS);
	(0, import_react.useEffect)(() => {
		setSettings(load());
	}, []);
	return {
		settings,
		setLang: (0, import_react.useCallback)((lang) => {
			setSettings((prev) => {
				const next = {
					...prev,
					lang
				};
				try {
					localStorage.setItem(KEY, JSON.stringify(next));
				} catch {}
				return next;
			});
		}, [])
	};
}
/**
* Speech only fires for gestures at or above this confidence — the
* confidence-gating half of the Decision Engine, applied at the output.
*/
var SPEAK_CONFIDENCE_THRESHOLD = .8;
var NAV_LINKS = [
	{
		to: "/studio",
		label: "Gesture Studio"
	},
	{
		to: "/learn",
		label: "Learn"
	},
	{
		to: "/conversation",
		label: "Conversation"
	},
	{
		to: "/insights",
		label: "Insights"
	},
	{
		to: "/privacy",
		label: "Privacy"
	}
];
function Dashboard() {
	const [active, setActive] = (0, import_react.useState)(false);
	const [videoEl, setVideoEl] = (0, import_react.useState)(null);
	const [entries, setEntries] = (0, import_react.useState)(SEED_HISTORY);
	const [current, setCurrent] = (0, import_react.useState)(null);
	const [transcript, setTranscript] = (0, import_react.useState)("");
	const [autoSpeak, setAutoSpeak] = (0, import_react.useState)(false);
	const [rate, setRate] = (0, import_react.useState)(1);
	const [sentenceWords, setSentenceWords] = (0, import_react.useState)([]);
	const [customPredict, setCustomPredict] = (0, import_react.useState)(null);
	const { settings, setLang } = useSettings();
	const autoSpeakRef = (0, import_react.useRef)(autoSpeak);
	const rateRef = (0, import_react.useRef)(rate);
	const settingsRef = (0, import_react.useRef)(settings);
	autoSpeakRef.current = autoSpeak;
	rateRef.current = rate;
	settingsRef.current = settings;
	useServiceWorker();
	const hydrated = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const stored = loadHistory();
		if (stored.length > 0) setEntries(stored);
		hydrated.current = true;
	}, []);
	(0, import_react.useEffect)(() => {
		if (hydrated.current) saveHistory(entries);
	}, [entries]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		loadCustomPredictor().then((p) => {
			if (!cancelled && p) setCustomPredict(() => p);
		}).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, []);
	const handleStableGesture = (0, import_react.useCallback)((g) => {
		const lang = settingsRef.current.lang;
		const phrase = resolvePhrase(g.gesture.phraseKey, g.gesture.phrase, lang);
		const entry = {
			id: crypto.randomUUID(),
			gesture: g.gesture.label,
			phrase,
			confidence: g.confidence,
			at: g.at
		};
		setCurrent(entry);
		setEntries((prev) => [entry, ...prev].slice(0, 200));
		setTranscript((prev) => prev ? `${prev} ${phrase}` : phrase);
		setSentenceWords((prev) => [...prev, {
			id: entry.id,
			text: phrase
		}].slice(-30));
		if (autoSpeakRef.current && g.confidence >= SPEAK_CONFIDENCE_THRESHOLD) speak(phrase, {
			rate: rateRef.current,
			lang: speechLangFor(lang)
		});
	}, []);
	const { live, metrics } = useGesturePipeline(videoEl, active, {
		onStableGesture: handleStableGesture,
		customPredict: customPredict ?? void 0
	});
	const handleVideoReady = (0, import_react.useCallback)((video) => {
		setVideoEl(video);
	}, []);
	const speakLang = speechLangFor(settings.lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipLink, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineIndicator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main-content",
				className: "mx-auto max-w-7xl px-5 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "truncate text-2xl font-semibold sm:text-3xl",
								children: "Translation dashboard"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Sign in front of the camera — text and speech follow instantly."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 flex-wrap items-center gap-2",
							children: [
								NAV_LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: l.to,
									className: "hidden rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground md:inline-block",
									children: l.label
								}, l.to)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex rounded-full border border-border bg-background/70 p-0.5 backdrop-blur",
									role: "group",
									"aria-label": "Spoken language",
									children: APP_LANGS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setLang(l.id),
										"aria-pressed": settings.lang === l.id,
										className: `rounded-full px-3 py-1 text-xs font-medium transition-colors ${settings.lang === l.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
										children: l.id === "en" ? "EN" : "हिं"
									}, l.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur",
									children: active ? "Session active" : "Session idle"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-5 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GestureHistory, {
									entries,
									height: "h-72"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportHistoryButton, { entries })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TranslationPanel, {
								transcript,
								current,
								autoSpeak,
								onAutoSpeakChange: setAutoSpeak,
								rate,
								onRateChange: setRate,
								onClear: () => {
									setTranscript("");
									setCurrent(null);
								},
								active,
								onToggle: setActive
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmergencyPhrasebook, { lang: settings.lang })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"aria-live": "polite",
						className: "sr-only",
						children: current ? `Detected ${current.gesture}: ${current.phrase}, confidence ${Math.round(current.confidence * 100)} percent.` : ""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SentenceBuilder, {
							words: sentenceWords,
							onRemoveWord: (id) => setSentenceWords((prev) => prev.filter((w) => w.id !== id)),
							onClear: () => setSentenceWords([]),
							onSpeak: () => speak(sentenceWords.map((w) => w.text).join(" "), {
								rate: rateRef.current,
								lang: speakLang
							})
						})
					})
				]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
