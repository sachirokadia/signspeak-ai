/**
 * debug.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for the debug mode flag.
 *
 * When DEBUG_MODE is false (production builds):
 *   - DebugPanel is never rendered or evaluated.
 *   - Vite's tree-shaker eliminates the DebugPanel module from the bundle
 *     because it is only imported inside an `if (DEBUG_MODE)` branch.
 *   - Zero runtime overhead: no extra state, no extra renders, no timers.
 *
 * To enable the debug panel:
 *   1. Set DEBUG_MODE = true  (development sessions), OR
 *   2. Set VITE_DEBUG_MODE=true in a .env.local file and use the env-driven
 *      variant below.
 *
 * import.meta.env.DEV is injected by Vite:
 *   - true  during `npm run dev`
 *   - false during `npm run build`
 *
 * Keeping this as a named boolean export (not an inline expression) means
 * the flag is visible in grep / search and easy to toggle for QA sessions.
 */

/**
 * DEBUG_MODE
 * Controls visibility of the landmark debug panel on the dashboard.
 * Defaults to Vite's development mode flag — automatically off in production.
 *
 * Override to `true` to force the panel on regardless of build mode.
 * Override to `false` to force the panel off in all environments.
 */
export const DEBUG_MODE: boolean = import.meta.env.DEV;
