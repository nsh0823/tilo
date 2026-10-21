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

### 2026-10-22 — Audio playback uses `expo-audio`

- **Decision:** Music and cue playback use `expo-audio` (SDK 58 version). One shared music player and one cue player live in `apps/mobile/src/audio/playback.ts`. Music loops (`player.loop = true`), so a track shorter than the timer repeats until the timer ends. The config plugin is set to `microphonePermission: false` and `recordAudioAndroid: false`, because the app doesn't record.
- **Why:** The user asked for the bundled songs to be wired up. `expo-audio` replaces the deprecated `expo-av` audio API and supports looping, background playback and an audio-mode API. A single shared music player means two timers can never play two tracks at once (AUD-06).
- **Still open:** TTS (voice cues) is the other half of open item 1. The audio mode (`playsInSilentMode`, `shouldPlayInBackground`, `interruptionMode: 'mixWithOthers'`) is provisional until item 4 is decided.

### 2026-10-22 — Late cues are dropped, not played in a burst

- **Decision:** A cue more than 2 s past its due time (for example, because the app was suspended) is consumed silently (`CUE_LATE_TOLERANCE_MS` in `src/timer/cueSchedule.ts`).
- **Why:** PRD §3.4 and INT-13. Returning to the foreground must never replay a run of missed beeps.

### 2026-10-22 — Mini-player removed

- **Decision:** At the user's request, the placeholder "Deep Solitude" mini-player (the native tab bar's bottom accessory) was removed from all tabs.
- **Consequence:** PRD AUD-04 (a mini-player above the tab bar while audio plays) and Flow E are not met now. Music is controlled from the timer screen that started it. Whether to bring AUD-04 back, or to change the PRD, needs a decision.

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
