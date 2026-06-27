# gamemAIster Frontend

React 19 + TypeScript + MUI v7 + Vite frontend for a multi-TTRPG-system AI gamemaster app. State via Zustand stores (`src/stores/`), theming via MUI `createTheme()` per game system.

## Commands

- `npm run dev` — Vite dev server (port 5173, configured in `.claude/launch.json` as `gamemaister-frontend` for `preview_start`)
- `npm run build` — `tsc && vite build` (typecheck is part of the build)
- `npx tsc --noEmit -p .` — typecheck only, fast sanity check after edits
- `npm run lint` — ESLint, `--max-warnings 0`
- `npm run gen:npc-schemas` — regenerate NPC JSON schemas after editing `CharacterProps.tsx`

There is currently a pre-existing, unrelated set of ~25 `tsc` errors in `CharacterCard.tsx` (stale `styles.tsx` export names, `CharacterProps` union typing). Don't try to fix these unless asked — just confirm your own changes don't add to the count (`npx tsc --noEmit -p . 2>&1 | grep -c "error TS"`, compare before/after).

## Theme architecture

Each supported TTRPG system has its own MUI theme in `src/themes/<system>.ts`, registered in the `themeMap` in `src/theme.ts`. Shared helpers live in `src/themes/helper.ts`:

- `getSafePaletteColor(theme, ownerStateColor)` — resolves a palette color key (`"primary"`, `"secondary"`, etc., or `"textPrimary"`/`"textSecondary"`/`"inherit"`) to an actual color string, with a sensible fallback.
- Custom `Theme`/`ThemeOptions` properties declared via module augmentation: `spinButtonBackgroundImage`, `scrollbarStyles`, `logo`, `trackColors`, `titleOverlayStyle` (optional), `accentColor` (optional).
- `accentColor` is the "active state" accent for a theme (e.g. Shadowrun's cyan `#00e5ff`) — used by anything that needs to fully replace a base/instance color on focus/active/selected state (loading-modal border, input focus rings) rather than layering a second color on top of the first. Falls back to the base color when unset, so themes without a dedicated accent are unaffected. See `styles.tsx`'s `trackInputStyle`/`textfieldStyle` and `FieldContainer.tsx`'s MAIN_SEND `TextField` for the pattern: `theme.accentColor ?? <instance-base-color>`.
- New systems: add `src/themes/<name>.ts` exporting a `createTheme()` object, add it to `themeMap` in `theme.ts`, and add any new Google Fonts to the `<link>` tags in `index.html` (a theme referencing a font that isn't loaded there silently falls back to the browser default — this caused a real, hard-to-notice bug across four themes before).
- Per-instance colored text/glow: when a component sets a literal/dynamic non-palette color via `sx` (e.g. `NpcCard.tsx`'s damage-track color, computed by `getTrackColor`), any theme-level "auto-glow" text-shadow (keyed off the MUI `color` prop, not `sx`) will NOT match it automatically — add a matching `textShadow` directly in that component's `sx`, derived from the same color value.

## CSS specificity gotcha (recurring)

Several inputs across the app set their focus-border color twice: once via a per-instance `sx` override (its own base color) and once via a theme-level `MuiOutlinedInput`/`MuiInputBase` global override (the active accent). When both rules end up with **equal class-selector specificity**, the winner is decided by source order, which is fragile and was observed to pick the wrong one in practice. Prefer compound selectors like `"& .MuiOutlinedInput-root.Mui-focused"` (classes on one node) over spreading `.Mui-focused` and the target class across separate descendant levels — count actual class-selector totals on both sides before assuming a fix works.

## Verification workflow — read this before testing UI changes

The project has no backend running by default in this environment (`http://192.168.0.109:8000` is unreachable), so:

- Login still works (any username "demo" + click "Demo Login").
- Most mission/character creation flows that call the backend will fail/hang. Patch `window.fetch` to hang (`window.fetch = () => new Promise(()=>{})`) to inspect a loading state without it erroring out from under you, or directly poke the relevant Zustand store via dynamic import in `preview_eval` (e.g. `(await import("/src/stores/historyStore.tsx")).default.getState().performOptimisticUpdate(...)`) to populate state without the backend.
- `characterStore` and others persist to `localStorage`, so test data survives reloads — clean up additions you don't want kept around, or expect them on the next session.

**Do your own UI verification for every visual/styling change** using the preview tools (`preview_start`, `preview_eval`, `preview_inspect`, computed-style checks) before reporting something as done — don't ask the user to check basic things you can check yourself.

**But escalate instead of rabbit-holing.** If a live check gives a result that contradicts your code-level reasoning (CSS specificity math, a confirmed-correct generated rule, etc.) and a _second_, differently-constructed check doesn't resolve the contradiction — stop. This environment has known flakiness (`document.hasFocus()` dropping mid-session, `getComputedStyle`/stylesheet-disable not reflecting synchronously, `preview_screenshot` and `requestAnimationFrame`-based waits timing out in the background tab). Don't keep spending turns trying new probing techniques on the same question. Instead:

1. State plainly what you verified with confidence (code review, generated CSS rules, isolated reproductions) and what you couldn't confirm live, and why (name the specific flaky symptom you hit).
2. Give the user a concrete manual test: what to click/do, and what a passing ("green") result looks like — specific enough that they don't have to guess (e.g. "open the NPC accordion, click into the damage number input — the outline should turn solid cyan with no trace of the orange/green damage color mixed in").

Don't burn further tool calls re-litigating the same already-contradicted check.
