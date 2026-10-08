"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Minimal typing for the Web Speech API (incl. webkit prefix). */
type RecognitionResultItem = {
  readonly transcript: string;
  readonly isFinal: boolean;
  readonly 0: { readonly transcript: string };
  readonly length: number;
};

type RecognitionEventLike = {
  readonly resultIndex: number;
  readonly results: ArrayLike<RecognitionResultItem>;
};

type RecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: RecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => RecognitionInstance;
    webkitSpeechRecognition?: new () => RecognitionInstance;
  }
}

export type SpeechRecStatus = "idle" | "listening" | "error" | "unsupported";

/**
 * Wraps the Web Speech API for the conversation partner's side.
 * Final transcripts are delivered via onFinal; interim text is exposed
 * for a live "hearing…" indicator.
 */
export function useSpeechRecognition(
  opts: { lang?: string; onFinal?: (text: string) => void } = {},
) {
  const [status, setStatus] = useState<SpeechRecStatus>("idle");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");
  const recRef = useRef<RecognitionInstance | null>(null);
  const cbRef = useRef(opts.onFinal);
  cbRef.current = opts.onFinal;
  const langRef = useRef(opts.lang ?? "en-US");
  langRef.current = opts.lang ?? "en-US";

  const supported =
    typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const stop = useCallback(() => {
    recRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) {
      setStatus("unsupported");
      return;
    }
    // Stop any previous session before starting a new one.
    recRef.current?.abort();
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = langRef.current;
    rec.onresult = (event) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i]!;
        const text = item[0].transcript;
        if (item.isFinal) {
          const trimmed = text.trim();
          if (trimmed) cbRef.current?.(trimmed);
        } else {
          interimText += text;
        }
      }
      setInterim(interimText);
    };
    rec.onerror = (event) => {
      setError(event.error);
      setStatus("error");
    };
    rec.onend = () => {
      setStatus((s) => (s === "listening" ? "idle" : s));
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

  useEffect(() => () => recRef.current?.abort(), []);

  return { status, interim, error, supported, start, stop };
}
