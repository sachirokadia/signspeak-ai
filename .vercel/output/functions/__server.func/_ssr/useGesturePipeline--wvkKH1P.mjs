import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { H as Activity } from "../_libs/lucide-react.mjs";
import { i as cn } from "./Navbar-DqEYdomU.mjs";
import { a as pinchDistance, n as analyseFingers, r as handTracker } from "./landmarks-D6NK4_y0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useGesturePipeline--wvkKH1P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** True when the OS requests reduced motion — animations must stay still. */
function useReducedMotion() {
	const [reduced, setReduced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(query.matches);
		const onChange = (e) => setReduced(e.matches);
		query.addEventListener("change", onChange);
		return () => query.removeEventListener("change", onChange);
	}, []);
	return reduced;
}
function statusTone(status, reduced) {
	switch (status) {
		case "ready": return "bg-emerald-400";
		case "loading": return reduced ? "bg-amber-400" : "bg-amber-400 animate-pulse";
		case "error": return "bg-rose-500";
		default: return "bg-muted-foreground/40";
	}
}
/**
* Live telemetry overlay for the gesture pipeline: FPS, inference latency,
* model state and the current per-frame prediction. These are the numbers to
* quote in interviews — measured, never estimated.
*/
function PerformanceHUD({ metrics, live, active }) {
	const reducedMotion = useReducedMotion();
	if (!active) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute left-3 top-3 z-10 rounded-2xl border border-white/15 bg-black/55 px-3 py-2 text-white backdrop-blur-md",
		role: "status",
		"aria-label": "Pipeline performance",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("h-2 w-2 rounded-full", statusTone(metrics.modelStatus, reducedMotion)),
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
					className: "h-3.5 w-3.5 opacity-80",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] font-semibold tabular-nums tracking-wide",
					children: [
						metrics.fps,
						" FPS · ",
						metrics.latencyMs,
						" ms"
					]
				}),
				metrics.degraded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-200",
					children: "ECO"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1.5 min-h-4 text-[11px] tabular-nums text-white/85",
			children: metrics.modelStatus === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-rose-300",
				children: "Model failed to load"
			}) : metrics.modelStatus !== "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-white/70",
				children: "Loading hand model…"
			}) : live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				live.gesture.label,
				" · ",
				Math.round(live.confidence * 100),
				"%",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-1.5 inline-block h-1.5 w-16 overflow-hidden rounded-full bg-white/20 align-middle",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block h-full rounded-full bg-emerald-300",
						style: { width: `${Math.round(live.confidence * 100)}%` }
					})
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-white/60",
				children: "Show your hand…"
			})
		})]
	});
}
/**
* Static-gesture classifier: rule-based templates over finger states.
*
* This is intentionally a *starter* classifier — transparent, testable and
* shippable without training data. Phase 3 (Gesture Studio) adds a trainable
* on-device classifier on the normalised landmark vectors; the rule set
* below remains as the built-in "Essentials" pack.
*/
var GESTURE_DEFINITIONS = [
	{
		id: "open-palm",
		label: "Open Palm",
		phraseKey: "hello",
		phrase: "Hello"
	},
	{
		id: "fist",
		label: "Fist",
		phraseKey: "yes",
		phrase: "Yes"
	},
	{
		id: "thumbs-up",
		label: "Thumbs Up",
		phraseKey: "im-okay",
		phrase: "I'm okay"
	},
	{
		id: "peace",
		label: "Peace",
		phraseKey: "water",
		phrase: "Water, please"
	},
	{
		id: "point",
		label: "Point",
		phraseKey: "that-one",
		phrase: "That one"
	},
	{
		id: "ok-sign",
		label: "OK Sign",
		phraseKey: "thank-you",
		phrase: "Thank you"
	}
];
var byId = new Map(GESTURE_DEFINITIONS.map((g) => [g.id, g]));
/**
* Classify one frame of 21 hand landmarks. Returns null when the hand does
* not match any known template.
*/
function classifyLandmarks(lm) {
	if (!lm || lm.length < 21) return null;
	const { states, crispness } = analyseFingers(lm);
	const { thumb, index, middle, ring, pinky } = states;
	const extendedCount = [
		thumb,
		index,
		middle,
		ring,
		pinky
	].filter(Boolean).length;
	let id = null;
	if (extendedCount === 5) id = "open-palm";
	else if (extendedCount === 0) id = "fist";
	else if (thumb && !index && !middle && !ring && !pinky) id = "thumbs-up";
	else if (!thumb && index && middle && !ring && !pinky) id = "peace";
	else if (!thumb && index && !middle && !ring && !pinky) id = "point";
	else if (pinchDistance(lm) < .35 && middle && ring && pinky) id = "ok-sign";
	if (!id) return null;
	const confidence = Math.round((.55 + crispness * .45) * 100) / 100;
	return {
		gesture: byId.get(id),
		confidence,
		fingerStates: states
	};
}
var GestureDecisionEngine = class {
	stabilityFrames;
	minConfidence;
	cooldownMs;
	lastLabel = null;
	run = 0;
	lastEmittedLabel = null;
	lastEmitAt = 0;
	constructor(opts = {}) {
		this.stabilityFrames = opts.stabilityFrames ?? 8;
		this.minConfidence = opts.minConfidence ?? .75;
		this.cooldownMs = opts.cooldownMs ?? 1500;
	}
	reset() {
		this.lastLabel = null;
		this.run = 0;
	}
	/**
	* Feed one frame's prediction. Returns a StableGesture exactly once per
	* confirmed gesture, otherwise null.
	*/
	push(pred, now = Date.now()) {
		const label = pred && pred.confidence >= this.minConfidence ? pred.gesture.id : null;
		if (label && label === this.lastLabel) this.run += 1;
		else {
			this.lastLabel = label;
			this.run = label ? 1 : 0;
		}
		if (!label || !pred || this.run < this.stabilityFrames) return null;
		if (label === this.lastEmittedLabel && now - this.lastEmitAt < this.cooldownMs) return null;
		this.lastEmittedLabel = label;
		this.lastEmitAt = now;
		this.run = 0;
		return {
			gesture: pred.gesture,
			phrase: pred.gesture.phrase,
			confidence: pred.confidence,
			at: new Date(now)
		};
	}
};
var ADAPTIVE_LATENCY_MS = 90;
var ADAPTIVE_SLOW_WINDOWS = 3;
/**
* Wires camera → hand tracker → classifier → decision engine.
* Runs a single requestAnimationFrame loop; exposes the live per-frame
* prediction plus FPS / latency telemetry for the Performance HUD.
*/
function useGesturePipeline(video, active, opts = {}) {
	const [live, setLive] = (0, import_react.useState)(null);
	const [metrics, setMetrics] = (0, import_react.useState)({
		fps: 0,
		latencyMs: 0,
		modelStatus: "idle",
		degraded: false
	});
	const cbRef = (0, import_react.useRef)(opts.onStableGesture);
	cbRef.current = opts.onStableGesture;
	const optsRef = (0, import_react.useRef)(opts);
	optsRef.current = opts;
	const lastLiveKey = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		if (!active || !video) {
			setLive(null);
			lastLiveKey.current = "";
			return;
		}
		let raf = 0;
		let cancelled = false;
		const o = optsRef.current;
		const engine = new GestureDecisionEngine({
			stabilityFrames: o.stabilityFrames ?? 8,
			minConfidence: o.minConfidence ?? .75,
			cooldownMs: o.cooldownMs ?? 1500
		});
		let frames = 0;
		let windowStart = performance.now();
		let latencyEma = 0;
		let slowWindows = 0;
		let degraded = false;
		setMetrics((m) => ({
			...m,
			modelStatus: handTracker.status === "ready" ? "ready" : "loading",
			modelError: void 0
		}));
		function maybeDegradeQuality() {
			if (degraded) return;
			const track = video.srcObject?.getVideoTracks()[0];
			if (!track?.applyConstraints) return;
			degraded = true;
			track.applyConstraints({
				width: { ideal: 640 },
				height: { ideal: 360 }
			}).catch(() => {});
			setMetrics((m) => ({
				...m,
				degraded: true
			}));
		}
		function loop() {
			if (cancelled) return;
			const result = handTracker.detect(video);
			if (result) {
				latencyEma = latencyEma === 0 ? result.inferenceMs : latencyEma * .8 + result.inferenceMs * .2;
				const currentOpts = optsRef.current;
				const pred = classifyLandmarks(result.landmarks) ?? currentOpts.customPredict?.(result.landmarks) ?? null;
				const key = pred ? `${pred.gesture.id}:${Math.round(pred.confidence * 20)}` : "none";
				if (key !== lastLiveKey.current) {
					lastLiveKey.current = key;
					setLive(pred);
				}
				const stable = engine.push(pred);
				if (stable) cbRef.current?.(stable);
				frames += 1;
			}
			const now = performance.now();
			if (now - windowStart >= 1e3) {
				const fps = Math.round(frames * 1e3 / (now - windowStart));
				const latencyMs = Math.round(latencyEma);
				setMetrics((m) => ({
					...m,
					fps,
					latencyMs
				}));
				slowWindows = latencyMs > ADAPTIVE_LATENCY_MS ? slowWindows + 1 : 0;
				if (slowWindows >= ADAPTIVE_SLOW_WINDOWS) {
					slowWindows = 0;
					maybeDegradeQuality();
				}
				frames = 0;
				windowStart = now;
			}
			raf = requestAnimationFrame(loop);
		}
		async function boot() {
			try {
				await handTracker.ensureLoaded();
				if (cancelled) return;
				setMetrics((m) => ({
					...m,
					modelStatus: "ready"
				}));
				loop();
			} catch {
				if (!cancelled) setMetrics((m) => ({
					...m,
					modelStatus: "error",
					modelError: handTracker.error ?? "Model failed to load"
				}));
			}
		}
		boot();
		return () => {
			cancelled = true;
			cancelAnimationFrame(raf);
		};
	}, [active, video]);
	return {
		live,
		metrics
	};
}
//#endregion
export { PerformanceHUD as n, useGesturePipeline as r, GESTURE_DEFINITIONS as t };
