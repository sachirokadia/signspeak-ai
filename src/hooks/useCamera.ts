"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Every possible camera status.
 *
 * Designed for extensibility — adding "paused" in a future milestone only
 * requires inserting it here and handling it in the state machine below.
 *
 * idle        — no session; initial state after stop()
 * requesting  — getUserMedia call is in-flight (permission dialog may be open)
 * live        — stream is attached, frames are flowing
 * error       — recoverable: user denied permission; they can retry
 * unavailable — unrecoverable: no hardware, wrong protocol, or unsupported API
 */
export type CameraStatus =
  | "idle"
  | "requesting"
  | "live"
  | "error"
  | "unavailable";

/**
 * Permission state sourced from the Permissions API (optional).
 * "unknown" is the safe default when the API is absent or query fails.
 */
export type CameraPermissionState = "granted" | "denied" | "prompt" | "unknown";

/** The facing direction passed to getUserMedia constraints. */
export type FacingMode = "user" | "environment";

/**
 * CameraState — the single object passed to onCameraStateChange.
 * Keeping everything in one object makes future additions (e.g. "paused",
 * "deviceId", "resolution") a non-breaking extension — callers only
 * destructure what they need.
 */
export interface CameraState {
  status: CameraStatus;
  fps: number;
  permissionState: CameraPermissionState;
  mirrored: boolean;
  facingMode: FacingMode;
  errorMessage: string;
}

/** Public API returned by useCamera. */
export interface UseCameraReturn {
  /** Attach this ref to the <video> element in your component. */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Current camera state — drives all UI. */
  cameraState: CameraState;
  /** Start the camera. No-op if already requesting or live. */
  start: () => Promise<void>;
  /** Stop the camera and release all tracks. Idempotent. */
  stop: () => void;
  /** Flip horizontal mirror. Works at any status (persisted in state). */
  toggleMirror: () => void;
  /**
   * Switch between front and rear camera.
   * Stops the current stream, flips facingMode, restarts.
   * Only meaningful on mobile devices with multiple cameras.
   */
  switchCamera: () => Promise<void>;
}

/** Options accepted by useCamera. */
export interface UseCameraOptions {
  /**
   * Called every time any part of CameraState changes.
   * Use this to sync session-level state in the parent (e.g. driving the
   * simulation loop on/off, updating the page badge).
   */
  onCameraStateChange?: (state: CameraState) => void;
  /** Initial facing mode. Defaults to "user" (front camera). */
  initialFacingMode?: FacingMode;
  /** Initial mirror state. Defaults to true (mirrors front-camera selfie view). */
  initialMirrored?: boolean;
}

// ─── Error mapping ────────────────────────────────────────────────────────────

/**
 * Map well-known DOMException names to user-friendly messages.
 * Raw browser error text is never exposed to the UI.
 */
function mapCameraError(error: unknown): {
  status: CameraStatus;
  message: string;
} {
  if (!(error instanceof DOMException)) {
    return {
      status: "unavailable",
      message: "An unexpected error occurred. Please try again.",
    };
  }

  switch (error.name) {
    case "NotAllowedError":
      return {
        status: "error",
        message:
          "Camera access was denied. Please allow camera access in your browser settings and try again.",
      };
    case "NotFoundError":
      return {
        status: "unavailable",
        message:
          "No camera was found on this device. Connect a camera and try again.",
      };
    case "NotReadableError":
      return {
        status: "unavailable",
        message:
          "The camera is in use by another application. Close it and try again.",
      };
    case "AbortError":
      return {
        status: "idle",
        // Treat abort as a silent cancellation — no error message needed.
        message: "",
      };
    case "SecurityError":
      return {
        status: "unavailable",
        message:
          "Camera access is blocked by a security policy. This page must be served over HTTPS.",
      };
    case "OverconstrainedError":
      return {
        status: "unavailable",
        message:
          "The requested camera configuration is not supported by this device.",
      };
    default:
      return {
        status: "unavailable",
        message: "Could not access the camera. Please try again.",
      };
  }
}

// ─── FPS counter ──────────────────────────────────────────────────────────────

/**
 * FPS_UPDATE_INTERVAL_MS
 * How often (ms) the FPS value is written to React state.
 * 500ms means at most 2 re-renders per second from FPS updates,
 * keeping React render pressure negligible while keeping the display fresh.
 */
const FPS_UPDATE_INTERVAL_MS = 500;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCamera(options: UseCameraOptions = {}): UseCameraReturn {
  const {
    onCameraStateChange,
    initialFacingMode = "user",
    initialMirrored = true,
  } = options;

  // ── Core state ──────────────────────────────────────────────────────────────

  const [status, setStatus] = useState<CameraStatus>("idle");
  const [fps, setFps] = useState(0);
  const [permissionState, setPermissionState] =
    useState<CameraPermissionState>("unknown");
  const [mirrored, setMirrored] = useState(initialMirrored);
  const [facingMode, setFacingMode] = useState<FacingMode>(initialFacingMode);
  const [errorMessage, setErrorMessage] = useState("");

  // ── Refs ────────────────────────────────────────────────────────────────────

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastFpsUpdateRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  /**
   * onCameraStateChange is stored in a ref so the FPS rAF loop and other
   * callbacks can call the latest version without being captured in stale
   * closures or triggering re-renders when the prop reference changes.
   */
  const onChangeRef = useRef(onCameraStateChange);
  useEffect(() => {
    onChangeRef.current = onCameraStateChange;
  }, [onCameraStateChange]);

  // ── Notify parent ────────────────────────────────────────────────────────────

  /**
   * Assemble the full CameraState and fire onCameraStateChange.
   * Accepts a partial override so individual state updates don't require
   * reading all other state values (which may not have flushed yet).
   */
  const notify = useCallback(
    (overrides: Partial<CameraState>) => {
      // Read current state values through closures — this is intentional.
      // notify() is always called synchronously alongside a setState() call
      // so the values are the ones being committed in this render cycle.
      const state: CameraState = {
        status,
        fps,
        permissionState,
        mirrored,
        facingMode,
        errorMessage,
        ...overrides,
      };
      onChangeRef.current?.(state);
    },
    [status, fps, permissionState, mirrored, facingMode, errorMessage],
  );

  // ── FPS counter ──────────────────────────────────────────────────────────────

  /**
   * stopFpsCounter — cancels the rAF loop and resets counters.
   * Safe to call if the loop is not running.
   */
  const stopFpsCounter = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    frameCountRef.current = 0;
    lastFpsUpdateRef.current = 0;
  }, []);

  /**
   * startFpsCounter — starts the rAF loop.
   * Counts frames per 500ms window and writes to state at that rate.
   * The loop is automatically suspended by the Page Visibility handler below
   * and resumed when the page becomes visible again.
   */
  const startFpsCounter = useCallback(() => {
    stopFpsCounter();

    const tick = (timestamp: number) => {
      frameCountRef.current += 1;

      if (lastFpsUpdateRef.current === 0) {
        lastFpsUpdateRef.current = timestamp;
      }

      const elapsed = timestamp - lastFpsUpdateRef.current;
      if (elapsed >= FPS_UPDATE_INTERVAL_MS) {
        const currentFps = Math.round(
          (frameCountRef.current / elapsed) * 1000,
        );
        setFps(currentFps);
        notify({ fps: currentFps });
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = timestamp;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
  }, [stopFpsCounter, notify]);

  // ── Stop ─────────────────────────────────────────────────────────────────────

  const stop = useCallback(() => {
    // Release all MediaStream tracks
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    // Detach from video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    stopFpsCounter();
    setFps(0);
    setStatus("idle");
    setErrorMessage("");
    notify({ status: "idle", fps: 0, errorMessage: "" });
  }, [stopFpsCounter, notify]);

  // ── Start ─────────────────────────────────────────────────────────────────────

  const start = useCallback(async () => {
    // Guard: prevent concurrent start calls
    if (status === "requesting" || status === "live") return;

    // ── 1. Protocol check ─────────────────────────────────────────────────────
    // Browsers block camera access on non-secure origins except localhost.
    if (
      typeof window !== "undefined" &&
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      const msg =
        "Camera requires a secure connection (HTTPS). This page is being served over HTTP.";
      setStatus("unavailable");
      setErrorMessage(msg);
      notify({ status: "unavailable", errorMessage: msg });
      return;
    }

    // ── 2. API availability check ─────────────────────────────────────────────
    // navigator.mediaDevices can be undefined on HTTP or very old browsers.
    // navigator.mediaDevices.getUserMedia can be undefined on old iOS WebKit.
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      const msg =
        "Camera API is not supported in this browser. Try a modern browser such as Chrome, Firefox, or Safari.";
      setStatus("unavailable");
      setErrorMessage(msg);
      notify({ status: "unavailable", errorMessage: msg });
      return;
    }

    // ── 3. Transition to requesting ───────────────────────────────────────────
    setStatus("requesting");
    setErrorMessage("");
    notify({ status: "requesting", errorMessage: "" });

    // ── 4. Request stream ─────────────────────────────────────────────────────
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
    } catch (err) {
      const { status: errStatus, message: errMessage } = mapCameraError(err);
      setStatus(errStatus);
      setErrorMessage(errMessage);
      notify({ status: errStatus, errorMessage: errMessage });
      return;
    }

    // ── 5. Attach to video element ────────────────────────────────────────────
    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      // play() is called imperatively — more reliable than the autoplay
      // attribute, especially on Safari/iOS where autoplay is restricted.
      try {
        await videoRef.current.play();
      } catch {
        // play() rejection is benign if the component unmounted mid-start.
        // If the stream is still assigned, we continue normally.
      }
    }

    // ── 6. Go live ────────────────────────────────────────────────────────────
    setStatus("live");
    notify({ status: "live" });
    startFpsCounter();
  }, [status, facingMode, notify, startFpsCounter]);

  // ── toggleMirror ──────────────────────────────────────────────────────────────

  const toggleMirror = useCallback(() => {
    setMirrored((prev) => {
      const next = !prev;
      notify({ mirrored: next });
      return next;
    });
  }, [notify]);

  // ── switchCamera ──────────────────────────────────────────────────────────────

  const switchCamera = useCallback(async () => {
    const nextFacing: FacingMode =
      facingMode === "user" ? "environment" : "user";

    // Stop existing stream first
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    stopFpsCounter();

    setFacingMode(nextFacing);
    // start() reads facingMode from state; since setState is async we
    // directly call getUserMedia here with the next value rather than
    // relying on the updated state being visible inside start().
    setStatus("requesting");
    notify({ facingMode: nextFacing, status: "requesting" });

    if (
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: nextFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
    } catch (err) {
      const { status: errStatus, message: errMessage } = mapCameraError(err);
      setStatus(errStatus);
      setErrorMessage(errMessage);
      notify({ status: errStatus, errorMessage: errMessage });
      return;
    }

    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      try {
        await videoRef.current.play();
      } catch {
        // benign
      }
    }

    setStatus("live");
    notify({ status: "live", facingMode: nextFacing });
    startFpsCounter();
  }, [facingMode, notify, startFpsCounter, stopFpsCounter]);

  // ── Permissions API (optional) ────────────────────────────────────────────────

  /**
   * Attempt to read the camera permission state on mount.
   * The Permissions API is treated as a progressive enhancement:
   *   - If the API doesn't exist, we leave permissionState as "unknown"
   *   - If the query fails for any reason, we leave it as "unknown"
   *   - We also listen for changes (e.g. user revokes while session is live)
   * None of this is required for the camera to function.
   */
  useEffect(() => {
    if (
      typeof navigator === "undefined" ||
      !navigator.permissions ||
      typeof navigator.permissions.query !== "function"
    ) {
      return; // API absent — safe to ignore
    }

    let permStatus: PermissionStatus | null = null;

    navigator.permissions
      .query({ name: "camera" as PermissionName })
      .then((result) => {
        permStatus = result;

        const update = (state: PermissionState) => {
          const mapped: CameraPermissionState =
            state === "granted" || state === "denied" || state === "prompt"
              ? state
              : "unknown";
          setPermissionState(mapped);
          notify({ permissionState: mapped });
        };

        update(result.state);

        result.addEventListener("change", () => update(result.state));
      })
      .catch(() => {
        // Browser threw on query (e.g. Firefox in some contexts) — ignore.
      });

    return () => {
      permStatus?.removeEventListener("change", () => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once on mount

  // ── Page Visibility API ───────────────────────────────────────────────────────

  /**
   * Suspend the FPS counter when the document is hidden (tab switched,
   * window minimised) and resume when it becomes visible again.
   * This prevents stale frame counts from accumulating while invisible
   * and avoids waking the GPU compositor unnecessarily.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Suspend — cancel rAF but keep stream alive
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = 0;
      } else {
        // Resume — only restart counter if stream is still live
        if (status === "live") {
          startFpsCounter();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [status, startFpsCounter]);

  // ── Full cleanup on unmount ────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      stopFpsCounter();
    };
  }, [stopFpsCounter]);

  // ── Assembled return value ────────────────────────────────────────────────────

  const cameraState: CameraState = {
    status,
    fps,
    permissionState,
    mirrored,
    facingMode,
    errorMessage,
  };

  return {
    videoRef,
    cameraState,
    start,
    stop,
    toggleMirror,
    switchCamera,
  };
}
