# tilo

Minimal, monochrome productivity app for iOS and Android with three tabs: **Tasks → Intervals → Focus**.
Its core feature is the audio-guided interval timer: tones or spoken cues let people track time without looking at the screen (showering, working out).
The MVP is local-first: no account, no backend, no sync.

Expo (SDK 58) app in a Turborepo + pnpm monorepo.

<!-- Keep this file for rules that stay true. No progress, status, or TODOs here — those go in docs/CONTEXT.md. -->

@docs/CONTEXT.md

## Docs map

| File                | What it is                                                                                           | When to read                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `docs/PRD.md`       | Product spec: requirement IDs (NAV/TASK/FOC/INT/AUD/SET), flows, data model, MVP DoD, open decisions | Before any feature work — read the section for the area you're touching        |
| `docs/DESIGN.md`    | Visual reference (tokens, type, components)                                                          | Before UI work. If it's missing, ask for it — don't invent styles              |
| `docs/DECISIONS.md` | Decisions made + open questions, with reasons                                                        | Before changing architecture or anything listed there; log new decisions there |
| `docs/CONTEXT.md`   | Current phase, in-progress work, next steps (auto-loaded above)                                      | Rewrite at the end of each session                                             |
| `docs/SESSIONS.md`  | Append-only log per session: critical changes, tests, error handling, refactoring, security          | Update during every session (see "Session log"); read by `/report`             |

## Layout

- `apps/mobile` — Expo Router app. Routes in `app/` (`(tabs)` group with native tabs, one native stack per tab); everything else in `src/` (imported as `@/…`). No sign-in for the MVP (see `docs/DECISIONS.md`).
- `packages/ui` — gluestack-ui v5 components (Uniwind styling). Import as `@tilo/ui/components/<name>`.
- `packages/api` — Supabase client factory and TanStack Query hooks. Platform-agnostic: the app passes in its storage.
- `packages/types` — Shared models and generated Supabase `Database` types.
- `packages/config` — Shared ESLint (flat), Prettier, and tsconfig base.
- `supabase/` — Local Supabase CLI config and migrations.

## Commands (repo root)

```bash
pnpm dev                        # expo start
pnpm lint | typecheck | test
pnpm format
pnpm supabase start             # local Supabase (needs Docker)
pnpm gen:types                  # regenerate packages/types/src/supabase.ts from the local DB
pnpm --filter mobile test:e2e   # Maestro flows in apps/mobile/e2e
```

## Tech Stack & Architecture

- Expo SDK 58, Expo Router, TypeScript; Turborepo + pnpm workspaces.
- UI: gluestack-ui v5 primitives + Uniwind `className`. Uniwind is Tailwind v4 (CSS config, no `tailwind.config.js`). Theme tokens (`bg-background`, `text-foreground`, …) live in `apps/mobile/global.css`, which also `@source`s `packages/ui`.
- State: client/UI state in Zustand (`src/store`, persisted to AsyncStorage); server state in TanStack Query hooks (`packages/api` or `src/hooks`).
- Backend: Supabase scaffold exists (local via CLI), but the MVP is local-first. See the Supabase entry in `docs/DECISIONS.md` before building anything on it.
- Safe area: `SafeAreaProvider` is in `AppProviders`; screens use `SafeAreaView` from `@/components/SafeAreaView` (or `useSafeAreaInsets` from `react-native-safe-area-context`).
- Uniwind only applies `className` to React Native core components. Wrap third-party components with `withUniwind` (see `src/components/SafeAreaView.tsx`), or their classes are silently dropped.
- Tests: Jest + jest-expo + RNTL 14 (`render`/`fireEvent` are async — `await` them); Maestro for e2e.
- These library versions are recent. For their APIs, check the installed source in `node_modules` or current docs instead of relying on memory; if still unsure, say so rather than guess.

### App architecture rules

- Keep task, timer, audio, and persistence logic separate from UI and from each other. Timer and cue scheduling are pure, unit-testable modules with no React imports.
- Timer engine: deadline/timestamp-based. Remaining time is always computed from stored timestamps, never from counting ticks. `setInterval` may only drive re-renders.
- Cues are derived from elapsed/remaining time. Each scheduled cue fires at most once: returning to the foreground never replays it, and cues missed during a pause are skipped (PRD §3.4).
- Timers never go negative, and completion fires exactly once per session.
- Persist enough session state to rebuild the correct timer after a restart; the app must never come back stuck in a stale "running" state.
- Validate durations and volumes at the UI/persistence boundary.
- Use the PRD §6 data model names (`Task`, `TimerPreset`, `TimerSession`, `SoundAsset`, `UserPreferences`).

## Security & Code Conventions

- Use pnpm only. Add app deps with `pnpm --filter mobile exec expo install <pkg>` so versions match the Expo SDK; use `pnpm --filter <workspace> add` for the other packages.
- Add gluestack components from inside `packages/ui`: `npx gluestack-ui@latest add <name> --use-pnpm`. The CLI finds `components/gluestack-ui-provider` there and writes the component and its deps into this package.
- Supabase is dormant for the MVP: nothing in the app imports `src/services/supabase.ts`, so the app runs without `.env.local`. When sync returns, sessions persist through `LargeSecureStore` (`apps/mobile/src/services/secureStore.ts`), never AsyncStorage.
- Env: `EXPO_PUBLIC_*` vars in `apps/mobile/.env.local` (see `.env.example`), read only via `src/env.ts`, which throws when a variable is missing.
- `EXPO_PUBLIC_*` values are bundled into the app and are public. Never put the Supabase service-role key or any other secret there. Never commit `.env.local`.
- `src/uniwind-types.d.ts` is regenerated by Metro; keep it committed so CI can typecheck without running Metro.
- Don't hand-edit `packages/types/src/supabase.ts`; regenerate it with `pnpm gen:types`.
- Packages that ship untranspiled code go in the `transpiled` list in `apps/mobile/jest.config.js`.

### UI conventions

- Monochrome only. Use theme tokens from `global.css`; never hard-code hex values or add colors outside the token map.
- Timer numerals: light weight, tabular numerals (no jitter).
- Never convey state (priority, completion, selection) by color alone.
- Icon-only controls get accessibility labels. Touch targets are at least 44×44pt, and primary buttons at least 48px tall.
- Any duration control offers +/- or numeric input, not only a slider.
- Respect reduced motion and system text scaling.
- The mini-player sits above the tab bar and never covers controls or navigation.

## Critical Guardrails

Ask before:

- Deleting files, or resetting/wiping data (e.g. `supabase db reset`).
- Writing or changing a migration in `supabase/migrations`. Schema changes go in a new migration; never edit one that has already been applied.
- Anything that leaves this machine: `git push`, opening PRs, deploys.
- Adding a tab, screen destination, or feature outside the PRD MVP scope (§1.4 non-goals, §3.7 P1 items).
- Resolving anything listed as open in `docs/DECISIONS.md` or PRD §9. Propose options with trade-offs; don't silently pick one.
- Adding or removing an account/login requirement, or making any MVP feature depend on the network.
- Adding audio assets. Each one needs a known license, recorded in `SoundAsset.licenseNote`.

Never:

- Change the tab order (Tasks → Intervals → Focus) or add a fourth tab.
- Claim background audio/cues, lock-screen behavior, or audio mixing works until it has been verified on a physical iOS **and** Android device. Simulator results don't count.
- Run `eas build` or link Maestro Cloud (for now).

Scope:

- Fix what was asked. If the real cause is elsewhere, point it out and ask before expanding the change.
- Reliability beats visuals: never trade timer/audio correctness for animation or polish.

## Quality checklist (every change)

Work through each area for every change. If an area doesn't apply, say so in the session log; never skip it silently.

- **Testing**
  - New or changed logic gets unit tests (Jest) in the same change: the happy path, edge cases (empty, zero, max, invalid input), and failure paths.
  - A bug fix starts with a test that reproduces it.
  - User-flow changes update the Maestro flow in `apps/mobile/e2e`.
  - UI changes are run in the simulator (iOS, and Android when available), and the screens actually viewed are named. Lint, typecheck and Jest don't catch layout or routing bugs.
  - Report test counts from the real command output (e.g. Jest's `Tests: N passed`), never estimated.
- **Review**
  - Before reporting, read the full diff (`git diff`, including untracked files) as a reviewer would, checking correctness, leftover debug code, dead code, and rule violations in this file.
  - For substantial changes, offer `/code-review`; for anything touching storage, env, permissions, or network, offer `/security-review`.
- **Fixing and finding errors**
  - Find the root cause before changing code.
  - After a fix, rerun the failing check and confirm it now passes.
  - If a check can't be run, say "not verified".
- **Error handling**
  - Never swallow errors: no empty `catch`, and no `.catch(() => {})` without a comment saying why.
  - Errors the user can act on get a visible, plain-language message; unexpected ones are logged with context.
  - Async work handles rejection.
  - Persisted or external data is validated before use; corrupt storage falls back to defaults instead of crashing.
  - The root layout must keep an error boundary.
- **Refactoring**
  - Refactor only behavior that tests pin down. If there are no tests, add them first.
  - Keep refactors in separate commits from behavior changes, and never mix them into a bug fix without saying so.
- **Security**
  - No secrets in code, logs, or `EXPO_PUBLIC_*`.
  - Check `.gitignore` covers new local files.
  - New deps: check they're maintained, and run `pnpm audit` after adding them.
  - Validate input at boundaries.
  - Request no permission without a feature that needs it.
  - Flag anything that would send data off the device; the MVP is local-first.

## Definition of Done (DoD)

A task is done only when:

- `pnpm lint`, `pnpm typecheck`, and `pnpm test` pass. When reporting, list the commands actually run and their result. Anything not run or not checked is reported as "not verified", not as done.
- The requirement IDs it covers are named (e.g. `INT-13`), and tests reference them.
- Timer/cue changes → unit tests cover start, pause, resume, complete, cancel, background/foreground, and no duplicate cues.
- Persistence changes → behavior after a full app restart is checked, or flagged as not checked.
- Audio/background changes → state which devices it was tested on. Without a physical-device test, it's "not verified on device".
- Schema changed → migration added, `pnpm gen:types` run, updated types committed.
- A user flow changed → the matching Maestro flow is updated, and either run or flagged as not run.
- New deps were added with the commands above.
- A decision was made → logged in `docs/DECISIONS.md`.
- The current session's entry in `docs/SESSIONS.md` is updated.

The full MVP release gate is PRD §7. Screens looking right is not "done".

## Session log (`docs/SESSIONS.md`)

One entry per Claude Code session, newest at the bottom. Create the entry when the first task of the session is finished, and update it after every task after that, not only at the end, since a session can end without warning.

- **Append-only.** Never rewrite a past session's entry. A correction goes in the current entry under "Corrections to earlier sessions".
- **Evidence only.** Record what actually happened in this session: commands actually run, real results, commit hashes. Never write what was planned, assumed, or "should" pass.
- **No empty fields.** Every field is filled. "None" or "Not done — <reason>" is a valid value; a blank or missing field is not.
- **Keep the format.** Use the template at the top of `docs/SESSIONS.md` exactly; `/report` (`~/.claude/commands/report.md`) parses it.
