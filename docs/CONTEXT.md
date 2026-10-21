# Current context

_Rewrite this whole file at the end of each session. Keep it under ~30 lines._

**Last updated:** 2026-10-22

## Phase

PRD §8 step 1–2: technical approach confirmed for playback (`expo-audio`); timer engine built and unit-tested.

## State

- Focus and Intervals timers run on the deadline-based engine (`src/timer`), with bundled music (looped) and beep cues (`src/audio`).
- Music is picked per timer via `SoundPicker`; the selection persists. Mini-player removed (AUD-04 now unmet).
- Session 2026-10-22-3 work is committed (005d3a9) and pushed. Sound files are gitignored (public repo, unconfirmed licenses), so clones and CI lack them.

## In progress

- (none)

## Next

1. Test audio on physical iOS and Android devices: looping, beeps, background/lock screen, mixing.
2. Confirm the license for each bundled sound (Pixabay presumed) and update each `licenseNote`.
3. Persist `TimerSession` so a running timer survives a restart; persist interval preferences (INT-14).
4. Voice cues (TTS) when the voice assets/approach are ready.

## Blockers / open questions

- No audible sound in the iOS simulator, though the player reports it is playing; not yet diagnosed.

- AUD-04: bring the mini-player back, or change the PRD?
- Audio mixing policy (DECISIONS open item 4); current mode is provisional.
- Untracked root `app.json` with an EAS projectId: origin unknown.
