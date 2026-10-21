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

## Open

### Supabase/auth scaffold vs. local-first MVP

The repo ships with Supabase, an `(auth)` route group gated by `Stack.Protected`, and `LargeSecureStore` sessions. The PRD (§1.4, §2.10, §6) says the MVP needs no account and no backend.
Options: (a) remove auth gating for MVP and leave the Supabase packages dormant for post-MVP sync; (b) remove Supabase entirely for now; (c) keep auth (conflicts with the PRD).
**Until decided:** don't build any MVP feature on Supabase, and don't remove the scaffold without asking.

### PRD §9 items

1. Audio libraries: which Expo/RN packages handle background playback, mixing, and TTS.
2. Background announcements: can cues and TTS fire reliably with the screen locked on both platforms with available APIs, or do they need native modules?
3. Voice: supported TTS voices/languages and offline behavior. Don't promise offline speech until verified.
4. Audio mixing policy: music vs. cues vs. calls, Bluetooth, and other apps.
5. Local storage: Zustand + AsyncStorage is already in place. Confirm it's enough for tasks and sessions, or choose something else (e.g. SQLite).
6. Sound catalog: pick and license the initial bundle.
7. Timer limits: maximum custom duration and validation rules (PRD minimum is 1–60 min for intervals).
8. Design tokens: reconcile the duplicate values in PRD §5.2 / `DESIGN.md` into one canonical map.
