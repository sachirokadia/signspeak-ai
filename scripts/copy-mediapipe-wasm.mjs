/**
 * Copy the MediaPipe Tasks Vision WASM runtime from node_modules into
 * public/wasm/ so it is served same-origin, version-matched with the
 * installed JS, and cacheable by the service worker for offline use.
 *
 * Runs on `postinstall` (covers dev and build). The output is gitignored —
 * it is a build artifact, not source.
 */
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Package root is deterministic: node_modules/@mediapipe/tasks-vision.
const srcDir = join(process.cwd(), "node_modules", "@mediapipe", "tasks-vision", "wasm");
const destDir = join(process.cwd(), "public", "wasm");

mkdirSync(destDir, { recursive: true });

const files = readdirSync(srcDir).filter((f) => f.endsWith(".js") || f.endsWith(".wasm"));
let copied = 0;
for (const f of files) {
  const src = join(srcDir, f);
  const dest = join(destDir, f);
  if (existsSync(src)) {
    cpSync(src, dest);
    copied++;
  }
}

if (copied === 0) {
  throw new Error(`No WASM files found in ${srcDir}`);
}
console.log(`[mediapipe] copied ${copied} WASM files to public/wasm/`);
