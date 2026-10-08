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

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
    setError("");
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
          await video.play().catch(() => {});
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
      } catch {
        if (cancelled) return;
        setStatus("error");
        setError(
          "Camera access was blocked. Enable permissions in your browser to start translating.",
        );
      }
    }

    if (active) void start();
    else stop();

    return () => {
      cancelled = true;
    };
  }, [active, stop]);

  // Always release the camera on unmount.
  useEffect(() => stop, [stop]);

  return { videoRef, status, error, stop };
}
