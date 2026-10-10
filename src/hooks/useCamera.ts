"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus = "idle" | "starting" | "live" | "error";

/**
 * Owns the getUserMedia lifecycle for a <video> element. Attach the returned
 * ref to the video element; the stream starts/stops with `active`.
 */
export function useCamera(active: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
    setError("");
  }, []);

  /** Re-run the start sequence (e.g. after the user fixes permissions). */
  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      setStatus("starting");
      setError("");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          // Play with one retry — some browsers drop the user-gesture
          // context across the getUserMedia await, rejecting the first play().
          try {
            await video.play();
          } catch {
            await new Promise((r) => setTimeout(r, 250));
            await video.play().catch(() => {});
          }
          // Wait until dimensions are known so tracking never starts blind.
          if (video.readyState < 2 || video.videoWidth === 0) {
            await new Promise<void>((resolve) => {
              const onReady = () => {
                video.removeEventListener("loadeddata", onReady);
                resolve();
              };
              video.addEventListener("loadeddata", onReady);
              // Safety net: don't hang forever on a stuck stream.
              window.setTimeout(resolve, 3000);
            });
          }
        }
        if (!cancelled) setStatus("live");
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        const name = e instanceof DOMException ? e.name : "";
        setError(
          name === "NotAllowedError"
            ? "Camera permission was denied. Allow camera access in your browser's site settings, then try again."
            : name === "NotFoundError"
              ? "No camera was found on this device. Connect a camera and try again."
              : name === "NotReadableError"
                ? "The camera is already in use by another app. Close the other app and try again."
                : name === "OverconstrainedError"
                  ? "This camera doesn't support the requested settings. Try again — we'll fall back automatically."
                  : name === "SecurityError"
                    ? "Camera access needs a secure (HTTPS) connection. Please use the https:// site address."
                    : "Camera access was blocked. Enable permissions in your browser to start translating.",
        );
      }
    }

    if (active) void start();
    else stop();

    return () => {
      cancelled = true;
    };
  }, [active, retryCount, stop]);

  // Always release the camera on unmount.
  useEffect(() => stop, [stop]);

  return { videoRef, status, error, stop, retry };
}
