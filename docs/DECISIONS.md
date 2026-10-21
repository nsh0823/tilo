# Decisions

Append-only log. Each entry: date, decision, why. To reverse a decision, add a new entry rather than editing the old one.
Open questions live at the bottom until they're decided. Then move them up as a dated entry.

## Decided

### 2026-10-22 — Framework: Expo (React Native) in a Turborepo + pnpm monorepo

- **Why:** One codebase for iOS and Android; this is how the repo was set up. Resolves the framework half of PRD §9.1. The audio-library half is still open (below).

### 2026-10-22 — Timer engine is deadline/timestamp-based

- **Why:** PRD §3.4 and §6.3. Interval ticks drift and stop when the app is backgrounded; timestamps let the timer be rebuilt correctly after backgrounding, lock, or restart.

### 2026-10-22 — Cues missed during a pause are skipped, not replayed

- **Why:** PRD §3.4 MVP default. The schedule resumes from the resumed timer state, and foregrounding never replays a cue that already fired.

### 2026-10-22 — No sign-in for the MVP; Supabase stays dormant

- **Decision:** Option (a). Removed the `(auth)` routes, `Stack.Protected` gating, the profile screen and the header avatar; the app opens straight into the tabs. The Supabase client (`src/services/supabase.ts`), `LargeSecureStore` and `packages/api` stay in the repo but nothing in the app imports them.
- **Why:** PRD §1.4, §2.10 and §6: the MVP is local-first and needs no account or backend. Keeping the client avoids redoing the setup for post-MVP sync.
- **Consequence:** No MVP feature is built on Supabase; tasks and preferences persist locally. The light/dark toggle lived on the profile screen, so the app follows the system appearance until in-context settings exist (PRD NAV-05).

## Open

### PRD §9 items

1. Audio libraries: which Expo/RN packages handle background playback, mixing, and TTS.
2. Background announcements: can cues and TTS fire reliably with the screen locked on both platforms with available APIs, or do they need native modules?
3. Voice: supported TTS voices/languages and offline behavior. Don't promise offline speech until verified.
4. Audio mixing policy: music vs. cues vs. calls, Bluetooth, and other apps.
5. Local storage: Zustand + AsyncStorage is already in place. Confirm it's enough for tasks and sessions, or choose something else (e.g. SQLite).
6. Sound catalog: pick and license the initial bundle.
7. Timer limits: maximum custom duration and validation rules (PRD minimum is 1–60 min for intervals).
8. Design tokens: reconcile the duplicate values in PRD §5.2 / `DESIGN.md` into one canonical map.
