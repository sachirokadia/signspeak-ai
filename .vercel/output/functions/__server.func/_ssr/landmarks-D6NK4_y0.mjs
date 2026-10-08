import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { B as CameraOff, d as RefreshCcw, l as ScanLine, z as Camera } from "../_libs/lucide-react.mjs";
import { t as Button } from "./Navbar-DqEYdomU.mjs";
import { n as Zo, t as Pc } from "../_libs/mediapipe__tasks-vision.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/landmarks-D6NK4_y0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Owns the getUserMedia lifecycle for a <video> element. Attach the returned
* ref to the video element; the stream starts/stops with `active`.
*/
function useCamera(active) {
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)("");
	const stop = (0, import_react.useCallback)(() => {
		streamRef.current?.getTracks().forEach((track) => track.stop());
		streamRef.current = null;
		if (videoRef.current) videoRef.current.srcObject = null;
		setStatus("idle");
		setError("");
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function start() {
			setStatus("starting");
			setError("");
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: "user",
						width: { ideal: 1280 },
						height: { ideal: 720 }
					},
					audio: false
				});
				if (cancelled) {
					stream.getTracks().forEach((t) => t.stop());
					return;
				}
				streamRef.current = stream;
				const video = videoRef.current;
				if (video) {
					video.srcObject = stream;
					await video.play().catch(() => {});
					if (video.readyState < 2 || video.videoWidth === 0) await new Promise((resolve) => {
						const onReady = () => {
							video.removeEventListener("loadeddata", onReady);
							resolve();
						};
						video.addEventListener("loadeddata", onReady);
						window.setTimeout(resolve, 3e3);
					});
				}
				if (!cancelled) setStatus("live");
			} catch {
				if (cancelled) return;
				setStatus("error");
				setError("Camera access was blocked. Enable permissions in your browser to start translating.");
			}
		}
		if (active) start();
		else stop();
		return () => {
			cancelled = true;
		};
	}, [active, stop]);
	(0, import_react.useEffect)(() => stop, [stop]);
	return {
		videoRef,
		status,
		error,
		stop
	};
}
function WebcamPanel({ active, onToggle, onVideoReady }) {
	const { videoRef, status, error } = useCamera(active);
	const [mirrored, setMirrored] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		onVideoReady(status === "live" ? videoRef.current : null);
	}, [
		status,
		videoRef,
		onVideoReady
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "glass-panel flex flex-col overflow-hidden rounded-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4 sm:flex sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "truncate text-sm font-semibold",
					children: "Live camera"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-muted-foreground",
					children: status === "live" ? "Tracking 21 hand landmarks · on-device" : status === "starting" ? "Requesting camera…" : "Camera is off"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "icon",
					"aria-label": "Mirror camera",
					className: "min-h-11 min-w-11 rounded-full",
					onClick: () => setMirrored((m) => !m),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => onToggle(!active),
					className: `h-11 rounded-full px-5 ${active ? "" : "bg-brand"}`,
					variant: active ? "outline" : "default",
					children: [active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "mr-1.5 h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "mr-1.5 h-4 w-4" }), active ? "Stop" : "Start camera"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[4/3] w-full overflow-hidden bg-foreground/90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				playsInline: true,
				muted: true,
				"aria-label": "Live webcam feed",
				className: `h-full w-full object-cover transition-opacity duration-500 ${status === "live" ? "opacity-100" : "opacity-0"} ${mirrored ? "scale-x-[-1]" : ""}`
			}), status !== "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_35%_30%,oklch(0.6_0.18_262/0.45),transparent_65%),radial-gradient(circle_at_70%_75%,oklch(0.55_0.22_293/0.4),transparent_65%)] px-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, {
								className: "h-5 w-5",
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm font-medium text-white",
							children: status === "error" ? error : "Turn on the camera to begin real-time translation."
						}),
						status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "mt-4 rounded-full",
							onClick: () => onToggle(true),
							children: "Try again"
						}) : null
					]
				})
			}) : null]
		})]
	});
}
/**
* HandTracker — singleton wrapper around MediaPipe's HandLandmarker
* (Tasks Vision, VIDEO running mode, WASM delegate).
*
* Everything runs on-device. By default the WASM runtime and model load from
* CDN on first use; set VITE_MEDIAPIPE_WASM_URL / VITE_HAND_LANDMARKER_MODEL_URL
* (or call configureHandTracker) to self-host them — required for the
* strictest privacy posture and the offline PWA.
*/
var DEFAULT_WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm";
var DEFAULT_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
var assetConfig = {};
function resolveAssetUrls() {
	return {
		wasmUrl: assetConfig.wasmUrl ?? {
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SSR": true,
			"TSS_DEV_SERVER": "false",
			"TSS_DEV_SSR_STYLES_BASEPATH": "/",
			"TSS_DEV_SSR_STYLES_ENABLED": "true",
			"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
			"TSS_INLINE_CSS_ENABLED": "false",
			"TSS_ROUTER_BASEPATH": "",
			"TSS_SERVER_FN_BASE": "/_serverFn/"
		}["VITE_MEDIAPIPE_WASM_URL"] ?? DEFAULT_WASM_URL,
		modelUrl: assetConfig.modelUrl ?? {
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SSR": true,
			"TSS_DEV_SERVER": "false",
			"TSS_DEV_SSR_STYLES_BASEPATH": "/",
			"TSS_DEV_SSR_STYLES_ENABLED": "true",
			"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
			"TSS_INLINE_CSS_ENABLED": "false",
			"TSS_ROUTER_BASEPATH": "",
			"TSS_SERVER_FN_BASE": "/_serverFn/"
		}["VITE_HAND_LANDMARKER_MODEL_URL"] ?? DEFAULT_MODEL_URL
	};
}
var HandTracker = class {
	landmarker = null;
	loading = null;
	lastVideoTime = -1;
	status = "idle";
	error = null;
	async ensureLoaded() {
		if (this.landmarker) return;
		if (this.loading) {
			await this.loading;
			return;
		}
		this.status = "loading";
		this.error = null;
		this.loading = (async () => {
			try {
				const { wasmUrl, modelUrl } = resolveAssetUrls();
				const vision = await Zo.forVisionTasks(wasmUrl);
				this.landmarker = await Pc.createFromOptions(vision, {
					baseOptions: {
						modelAssetPath: modelUrl,
						delegate: "GPU"
					},
					runningMode: "VIDEO",
					numHands: 1,
					minHandDetectionConfidence: .5,
					minHandPresenceConfidence: .5,
					minTrackingConfidence: .5
				});
				this.status = "ready";
			} catch (e) {
				this.status = "error";
				this.error = e instanceof Error ? e.message : "Failed to load hand tracking model";
				throw e;
			} finally {
				this.loading = null;
			}
		})();
		await this.loading;
	}
	/**
	* Run detection on the current video frame. Returns null when there is no
	* new frame, no hand is visible, or the model isn't ready.
	*/
	detect(video) {
		if (!this.landmarker || this.status !== "ready") return null;
		if (video.readyState < 2 || video.videoWidth === 0) return null;
		if (video.currentTime === this.lastVideoTime) return null;
		this.lastVideoTime = video.currentTime;
		const start = performance.now();
		try {
			const hand = this.landmarker.detectForVideo(video, performance.now()).landmarks?.[0];
			if (!hand) return null;
			return {
				landmarks: hand.map((p) => ({
					x: p.x,
					y: p.y,
					z: p.z
				})),
				inferenceMs: performance.now() - start
			};
		} catch {
			return null;
		}
	}
	dispose() {
		this.landmarker?.close();
		this.landmarker = null;
		this.status = "idle";
		this.lastVideoTime = -1;
	}
};
var handTracker = new HandTracker();
var FINGER_JOINTS = {
	index: {
		pip: 6,
		tip: 8
	},
	middle: {
		pip: 10,
		tip: 12
	},
	ring: {
		pip: 14,
		tip: 16
	},
	pinky: {
		pip: 18,
		tip: 20
	}
};
function dist(a, b) {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	const dz = (a.z - b.z) * .5;
	return Math.hypot(dx, dy, dz);
}
/**
* Classify each finger as extended/folded by comparing tip-vs-PIP distance
* from the wrist. Returns a crispness score (0..1) describing how decisively
* the hand matches the reported states — used to derive confidence.
*/
function analyseFingers(lm) {
	const wrist = lm[0];
	const scores = [];
	const states = {};
	for (const [name, j] of Object.entries(FINGER_JOINTS)) {
		const tipD = dist(lm[j.tip], wrist);
		const pipD = dist(lm[j.pip], wrist);
		const ratio = tipD / Math.max(pipD, 1e-6);
		const extended = ratio > 1.12;
		const folded = ratio < .98;
		const crisp = extended ? Math.min(1, (ratio - 1.12) / .25) : folded ? Math.min(1, (.98 - ratio) / .2) : 0;
		states[name] = extended;
		scores.push(extended || folded ? .5 + crisp * .5 : .25);
	}
	const pinkyMcp = lm[17];
	const tRatio = dist(lm[4], pinkyMcp) / Math.max(dist(lm[2], pinkyMcp), 1e-6);
	states.thumb = tRatio > 1.15;
	scores.push(Math.min(1, .5 + Math.abs(tRatio - 1.15) / .3));
	return {
		states,
		crispness: scores.reduce((a, b) => a + b, 0) / scores.length
	};
}
/**
* Wrist-centred, scale-invariant feature vector (63 dims). Reserved for the
* trainable classifier in the Gesture Studio (Phase 3) — kept here so the
* feature definition stays stable across phases.
*/
function normaliseLandmarks(lm) {
	const wrist = lm[0];
	const scale = Math.max(dist(lm[9], wrist), 1e-6);
	const out = [];
	for (const p of lm) out.push((p.x - wrist.x) / scale, (p.y - wrist.y) / scale, (p.z - wrist.z) / scale);
	return out;
}
/** Thumb-tip to index-tip distance, normalised by hand size. */
function pinchDistance(lm) {
	const wrist = lm[0];
	return dist(lm[4], lm[8]) / Math.max(dist(lm[9], wrist), 1e-6);
}
//#endregion
export { pinchDistance as a, normaliseLandmarks as i, analyseFingers as n, handTracker as r, WebcamPanel as t };
