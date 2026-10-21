# Tilo — Product Requirements Document (MVP)

**Document status:** Initial implementation spec  
**Product:** Tilo  
**Platforms:** iOS and Android  
**Primary navigation:** Tasks → Intervals → Focus  
**Design reference:** `DESIGN.md` and the supplied Tilo screen mockups

---

## 1. Product Overview

### 1.1 Summary

Tilo is a minimal productivity app that combines three everyday experiences in one calm interface:

1. **Tasks** — capture, organize, and complete to-dos.
2. **Intervals** — run an audio-guided timer for activities where users do not want to keep checking the screen, such as showering or exercising.
3. **Focus** — run a focus session, optionally linked to a task and accompanied by background audio.

Tilo's distinguishing feature is the **audio-guided interval timer**. Users choose a duration and cue schedule, then rely on tones or spoken announcements to understand the passage of time without looking at their phone.

The app should feel quiet, lightweight, and dependable rather than competitive or gamified.

### 1.2 Problem

People often need to manage tasks, focus for a set period, or keep track of time while their hands and attention are occupied. Typical task apps and timers can require repeated screen interaction, while music and timer tools often live in separate places.

Tilo brings these needs together and makes audio cues a first-class way to experience time.

### 1.3 Product goals

- Make capturing and completing tasks fast and uncomplicated.
- Let users start a focus session with minimal setup.
- Make an interval timer usable without continuously watching the screen.
- Keep timer behavior understandable and reliable, including after interruptions.
- Provide optional built-in ambient audio without making sound selection a separate primary destination.
- Maintain a consistent, ultra-minimal monochrome design across the app.

### 1.4 Non-goals for MVP

- Social features, collaboration, or shared task lists.
- AI task planning or task generation.
- Complex project management, dependencies, or subtasks.
- Gamification, streaks, badges, leaderboards, or competitive statistics.
- Streaming music subscriptions or user-uploaded audio.
- Account-based cloud sync and multi-device synchronization.
- Advanced analytics, productivity scoring, or extensive historical reporting.
- A separate Sounds, Activity, Dashboard, or Settings tab.

---

## 2. Product Principles

1. **Three primary destinations only.** Bottom navigation must be ordered left-to-right: **Tasks, Intervals, Focus**.
2. **One obvious primary action.** Each main screen should make the next action clear.
3. **Audio-first time awareness.** Interval timer cues must be configurable and useful when the screen is not being watched.
4. **Reliability over animation.** Timer correctness and audio behavior matter more than decorative motion.
5. **Minimal cognitive load.** Use restrained typography, generous whitespace, and no unnecessary visual decoration.
6. **Progressive disclosure.** Keep common settings visible and put less frequently used options under “More Preferences.”
7. **User control.** Users can pause, stop, silence, or adjust audio; avoid surprising sound behavior.
8. **Task-to-focus connection.** Users can associate a focus session with a task, but task selection should remain optional.
9. **Honest platform behavior.** Clearly handle OS restrictions, audio interruptions, and permissions rather than implying background behavior is guaranteed on every device.
10. **Local-first MVP.** Core tasks, preferences, and session state should work without requiring an account or backend.

---

## 3. MVP Scope and Requirements

Priority definitions:

- **P0 — Required:** Must be complete for the first usable release.
- **P1 — Optional follow-up:** Defer unless implementation is straightforward and does not threaten P0 reliability.

### 3.1 App shell and navigation

| ID     | Priority | Requirement                                                        | Acceptance criteria                                                                                  |
| ------ | -------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| NAV-01 | P0       | Provide exactly three bottom navigation tabs.                      | Tabs appear in this order: Tasks, Intervals, Focus. No other primary tabs exist.                     |
| NAV-02 | P0       | Preserve the selected tab while navigating within the app.         | Returning to a tab restores its current screen state where appropriate.                              |
| NAV-03 | P0       | Provide a shared visual system and consistent header treatment.    | Main screens use consistent typography, spacing, icon style, and selected-tab styling.               |
| NAV-04 | P0       | Respect device safe areas.                                         | Header, bottom navigation, mini-player, and controls are not obscured by notches or home indicators. |
| NAV-05 | P0       | Provide access to relevant settings without adding a Settings tab. | Settings are reached through an in-context control or a secondary screen/sheet.                      |

### 3.2 Tasks

| ID      | Priority | Requirement                        | Acceptance criteria                                                                                     |
| ------- | -------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| TASK-01 | P0       | Create a task.                     | User can enter a title and save it; blank titles cannot be saved.                                       |
| TASK-02 | P0       | View incomplete tasks.             | Incomplete tasks appear in a clear list with readable titles.                                           |
| TASK-03 | P0       | Complete and reopen a task.        | Tapping the checkbox updates completion state immediately; completed tasks are visually differentiated. |
| TASK-04 | P0       | Edit a task.                       | User can update its title and any supported optional fields.                                            |
| TASK-05 | P0       | Delete a task.                     | User can delete a task, with confirmation if deletion is destructive or difficult to reverse.           |
| TASK-06 | P0       | Support optional due date/time.    | User can set, change, or clear a due date/time.                                                         |
| TASK-07 | P0       | Support optional priority.         | User can choose a priority or leave it unset. Priority must not rely on color alone.                    |
| TASK-08 | P0       | Support optional notes.            | User can add and edit notes without making them required.                                               |
| TASK-09 | P0       | Persist task data locally.         | Tasks remain after app restart.                                                                         |
| TASK-10 | P0       | Start a focus session from a task. | A task can be selected for a focus session; the user can also start without selecting one.              |

**MVP simplification:** Task lists, tags, recurring tasks, subtasks, and advanced filtering are out of scope unless explicitly added later.

### 3.3 Focus timer

| ID     | Priority | Requirement                                      | Acceptance criteria                                                                                                                                                      |
| ------ | -------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FOC-01 | P0       | Offer quick durations.                           | Provide 25-minute, 50-minute, and custom duration options.                                                                                                               |
| FOC-02 | P0       | Start a focus session.                           | Starting creates a session and displays a running countdown.                                                                                                             |
| FOC-03 | P0       | Pause and resume.                                | Remaining time is preserved accurately across pause/resume.                                                                                                              |
| FOC-04 | P0       | End a session early.                             | User can stop/end a running or paused session after an intentional action.                                                                                               |
| FOC-05 | P0       | Complete a session.                              | At zero, the timer enters a completed state and does not continue into negative time.                                                                                    |
| FOC-06 | P0       | Associate an optional task.                      | The active screen displays the selected task; no task is valid.                                                                                                          |
| FOC-07 | P0       | Offer optional built-in background audio.        | User can choose a bundled sound or run the timer silently.                                                                                                               |
| FOC-08 | P0       | Provide active, paused, and completed UI states. | Each state has clear text and appropriate controls.                                                                                                                      |
| FOC-09 | P0       | Persist session outcome locally.                 | Completed and ended sessions can be stored locally for basic history/debugging, without requiring an Activity tab.                                                       |
| FOC-10 | P0       | Handle app lifecycle and interruptions.          | Timer calculations remain correct after backgrounding, locking, or returning to the app. Audio behavior follows platform capabilities and is tested on physical devices. |

### 3.4 Audio-guided interval timer

| ID     | Priority | Requirement                                       | Acceptance criteria                                                                                                                                |
| ------ | -------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| INT-01 | P0       | Offer interval timer presets.                     | Provide Shower, Workout, and Custom presets.                                                                                                       |
| INT-02 | P0       | Default Shower preset to 10 minutes.              | Selecting Shower sets duration to 10 minutes, cue interval to every 1 minute, remaining-time announcements, short beep, and background music off.  |
| INT-03 | P0       | Configure timer duration.                         | User can increase/decrease duration and use a duration slider or equivalent control. MVP supports at least 1–60 minutes.                           |
| INT-04 | P0       | Configure cue frequency.                          | User can select every 30 seconds, every 1 minute, every 2 minutes, or a custom interval.                                                           |
| INT-05 | P0       | Configure announcement content.                   | User can select remaining time, elapsed time, or both.                                                                                             |
| INT-06 | P0       | Configure cue style.                              | Provide short beep, distinct-pitch beep, spoken announcement where supported, and silent modes.                                                    |
| INT-07 | P0       | Configure final cue and completion sound.         | User can enable or disable a final-minute cue and a completion sound.                                                                              |
| INT-08 | P0       | Start, pause, resume, and stop an interval timer. | Controls behave consistently and the timer never becomes negative.                                                                                 |
| INT-09 | P0       | Display active timer state.                       | Show remaining time prominently, a progress indicator, and pause/stop actions.                                                                     |
| INT-10 | P0       | Support optional background audio.                | User can choose a bundled sound or leave music off.                                                                                                |
| INT-11 | P0       | Separate music and cue volume.                    | Where platform audio architecture permits, users can adjust music volume separately from announcement/cue volume.                                  |
| INT-12 | P0       | Handle screen lock/background behavior.           | Timer state stays correct after backgrounding. Background audio/cues are implemented using supported platform APIs and limitations are documented. |
| INT-13 | P0       | Prevent duplicate or stale cues.                  | Pause/resume, app foregrounding, and interruptions must not trigger duplicate announcements for the same scheduled cue.                            |
| INT-14 | P0       | Persist last-used preferences.                    | Reopening the screen restores the last selected duration/cue preferences or the chosen preset defaults.                                            |
| INT-15 | P0       | Give feedback on timer completion.                | Timer enters a completed state and plays the configured completion cue if enabled and allowed by current audio state.                              |

**Timer behavior rules**

- Use a timestamp/deadline-based timer engine as the source of truth. Do not rely on a repeating JavaScript interval to determine elapsed time.
- Define whether a cue scheduled during a pause is skipped or rescheduled; the MVP default should be to skip missed cues and resume the schedule from the resumed timer state.
- Ensure cue events are derived from elapsed/remaining time and are not replayed merely because the app returns to the foreground.
- Spoken time announcements must use clear, concise wording, such as “9 minutes remaining,” when the selected mode is remaining time.
- Test audio focus, silent mode, Bluetooth/headphones, calls, app backgrounding, and screen lock on real iOS and Android devices.
- If an OS restriction prevents a requested background cue, handle it gracefully and document the limitation rather than promising unsupported behavior.

### 3.5 Built-in sounds and mini-player

| ID     | Priority | Requirement                                    | Acceptance criteria                                                                                                                   |
| ------ | -------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| AUD-01 | P0       | Include a small bundled audio library.         | Include a limited, licensed set of built-in audio assets for the MVP.                                                                 |
| AUD-02 | P0       | Support initial sound categories.              | Include Relaxation, Lo-fi, White Noise, Lullabies, Jazzy, and Study categories where suitable assets are available.                   |
| AUD-03 | P0       | Play and pause a selected sound.               | Playback controls clearly reflect playing/paused state.                                                                               |
| AUD-04 | P0       | Keep playback controls accessible across tabs. | When audio is playing, show a compact mini-player above the bottom navigation.                                                        |
| AUD-05 | P0       | Persist audio selection/preferences.           | Selected sound and volume preferences persist locally.                                                                                |
| AUD-06 | P0       | Handle audio conflicts.                        | Define and test behavior when focus music, interval cues, and other system audio overlap. Do not allow accidental duplicate playback. |
| AUD-07 | P0       | Respect user control and licensing.            | Audio assets have appropriate usage rights; user can pause/stop playback easily.                                                      |

**MVP boundary:** Use bundled audio only. No streaming provider, account, audio upload, or large music catalog is required. A limited initial library is preferable to delaying core timer reliability.

### 3.6 Settings and persistence

| ID     | Priority | Requirement                                 | Acceptance criteria                                                                                                       |
| ------ | -------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| SET-01 | P0       | Store preferences locally.                  | Default durations, cue style, cue interval, announcement mode, selected sound, and volume settings persist after restart. |
| SET-02 | P0       | Make preferences available in context.      | Users can adjust relevant settings from Focus or Intervals without navigating to a fourth tab.                            |
| SET-03 | P0       | Support a silent experience.                | Users can run both timer types without app-generated music or cues where applicable.                                      |
| SET-04 | P0       | Provide accessible labels.                  | Interactive controls have meaningful screen-reader labels and state descriptions.                                         |
| SET-05 | P0       | Handle invalid or interrupted state safely. | App restart or interruption cannot leave the timer permanently stuck in a running UI state with incorrect time.           |

### 3.7 P1 candidates after MVP

- Recurring tasks, tags, and multiple custom task lists.
- More timer presets and user-created named presets.
- Custom spoken announcement wording or additional languages.
- Home-screen widgets and OS shortcuts.
- Basic weekly focus summary.
- Cloud backup and cross-device sync.
- More sound assets and layered ambient audio.

---

## 4. Core User Flows

### Flow A — Capture and complete a task

1. User opens **Tasks**.
2. User taps the add-task field/action.
3. User enters a task title.
4. User optionally sets due date/time, priority, or notes.
5. User saves the task.
6. The task appears in the incomplete task list.
7. User taps the checkbox to complete it.
8. The task moves to or appears in the completed section with a checked state and strikethrough.
9. User can reopen or edit the task if needed.

**Success:** A task can be created and completed quickly without leaving the Tasks tab.

### Flow B — Start a focus session

1. User opens **Focus**.
2. User selects 25 minutes, 50 minutes, or a custom duration.
3. User optionally selects a task.
4. User optionally selects a built-in soundscape or leaves audio off.
5. User taps **Start Focus**.
6. The active screen shows the countdown and selected task.
7. User can pause, resume, or end the session.
8. At zero, the session enters the completed state.
9. The outcome is stored locally.

**Success:** The user can begin a focus session with minimal decisions and the timer remains accurate through app lifecycle changes.

### Flow C — Use the Shower interval preset

1. User opens **Intervals**.
2. User selects **Shower**.
3. The screen displays 10 minutes, every-1-minute cues, remaining-time mode, short beep, and music off.
4. User changes any setting if desired.
5. User taps **Start Shower Timer** or **Start Timer**.
6. The active interval screen displays the remaining time and progress.
7. The app emits the configured cue at each scheduled point, even when the screen is not being watched, to the extent supported by the OS and implementation.
8. User can pause/resume or stop.
9. At zero, the timer completes and plays the completion cue if enabled.

**Success:** A user can set up and start a shower timer in a few taps and can understand elapsed time from audio cues.

### Flow D — Customize interval announcements

1. User opens **Intervals** and selects **Custom**.
2. User chooses duration.
3. User chooses cue frequency.
4. User chooses remaining time, elapsed time, or both.
5. User chooses beep, distinct-pitch beeps, spoken announcements, or silent.
6. User optionally configures final-minute cue, completion sound, background audio, and volumes.
7. User starts the timer.
8. The active screen reflects the chosen configuration.

**Success:** Configuration choices are respected throughout the session and are restored according to the persistence rules.

### Flow E — Play ambient audio while navigating

1. User starts a bundled sound from the Focus or Intervals context.
2. The mini-player appears above the bottom navigation.
3. User switches among Tasks, Intervals, and Focus.
4. Mini-player continues to show the current sound and playback state.
5. User can pause/resume or stop playback from the mini-player.
6. If a timer cue occurs, it is audible and handled according to the app’s defined audio-mixing policy.

**Success:** Audio state is consistent across tabs and there is no accidental duplicate playback.

---

## 5. Initial UI Design System

The provided `DESIGN.md` is the detailed visual reference. This section records the implementation-level essentials.

### 5.1 Brand and visual direction

- **Brand:** Tilo
- **Style:** Ultra-minimal monochrome; calm, precise, functional.
- **Reference screens:** Tasks, Intervals setup, and Focus timer screens supplied with this PRD.
- **Avoid:** Bright accent colors, gradients, decorative illustrations, excessive shadows, gamification, and unnecessary visual noise.
- **Primary navigation:** Tasks → Intervals → Focus.

### 5.2 Color tokens

| Token            | Value                 | Use                                                          |
| ---------------- | --------------------- | ------------------------------------------------------------ |
| `background`     | `#F9F9F9`             | Main app canvas, based on the supplied `DESIGN.md` token set |
| `surface`        | `#FFFFFF`             | Cards and primary content surfaces                           |
| `surface-subtle` | `#F3F3F3` / `#F5F5F5` | Segmented tracks, mini-player, secondary controls            |
| `text-primary`   | `#1A1C1C` / `#111111` | Main text, icons, primary actions                            |
| `text-secondary` | `#5E5E5E` / `#777777` | Supporting copy and metadata                                 |
| `border`         | `#E5E5E5` / `#C4C7C7` | Dividers and subtle outlines                                 |
| `disabled`       | `#BDBDBD`             | Inactive and disabled controls                               |
| `primary-action` | `#000000`             | Primary button backgrounds                                   |
| `on-primary`     | `#FFFFFF`             | Text/icons on primary buttons                                |
| `error`          | `#BA1A1A`             | Errors only; use sparingly                                   |

**Implementation note:** `DESIGN.md` contains both a token palette (`#F9F9F9`, `#F3F3F3`, etc.) and prose describing a closely related palette (`#FFFFFF`, `#F5F5F5`, `#E5E5E5`, `#111111`, `#777777`). Resolve these into a single canonical token map before implementation; do not introduce extra colors.

### 5.3 Typography

- Primary typeface: **Geist**, or the closest supported cross-platform equivalent if unavailable.
- Use light weight for large timer numerals.
- Enable tabular numerals for countdowns and durations to prevent visual jitter.
- Suggested mobile timer display: approximately 56px, weight 300, 64px line height.
- Screen title: approximately 26px, weight 500, 32px line height.
- Body text: 14–16px.
- Metadata: 11–13px, ensuring readable contrast and size.
- Use consistent line height and restrained letter spacing.

### 5.4 Spacing, shape, and elevation

- Use a 4px-based spacing scale, with common gaps of 4, 8, 16, 24, and 40px.
- Mobile horizontal content inset: approximately 20px.
- Structural cards: 14–16px corner radius.
- Primary/secondary pill buttons and segmented controls: full pill radius.
- Prefer thin borders and tonal contrast over shadows.
- Avoid blur and glassmorphism.
- Respect top and bottom safe areas.
- Ensure the mini-player sits above the bottom navigation and never covers primary actions.

### 5.5 Components

**Bottom navigation**

- Exactly three items: Tasks, Intervals, Focus.
- Fixed at the bottom with safe-area support and a subtle top divider.
- Active item uses near-black icon/text; inactive items use a muted neutral.
- No badges or extra destinations.

**Primary button**

- Near-black fill, white label, pill radius.
- Minimum target height: 48px.
- Clear pressed, disabled, and loading states where applicable.

**Secondary button / selector**

- Soft gray surface with near-black text.
- Selected segmented option uses black fill and white text.

**Task row**

- Minimum touch-friendly row height around 56px.
- Circular checkbox around 22px.
- Completed task uses a checkmark, subdued text, and strikethrough.
- Due time and priority are secondary metadata; do not rely on color alone.

**Timer display**

- Large centered tabular numerals.
- A subtle progress ring/bar may be used.
- Countdown remains the strongest visual element on active timer screens.
- Pause and stop actions must be easy to locate and tap.

**Interval setup**

- Duration and Start action receive the strongest visual emphasis.
- Common cue frequency choices are visible; less frequent options may live under “More Preferences.”
- Keep controls grouped under Duration, Cue Frequency, Audio Cue, and More Preferences.

**Audio mini-player**

- Visible above bottom navigation while audio is playing.
- Shows current sound title and play/pause.
- Use an opaque surface, subtle border, and no decorative artwork.
- Avoid overlapping navigation or timer controls.

### 5.6 Screen-specific design notes

**Tasks**

- Today heading/date and task progress.
- Fast add-task entry.
- Incomplete tasks first, completed tasks in a collapsible or clearly separated section.
- Optional task metadata kept visually quiet.
- A task action may link directly to starting a focus session.

**Intervals**

- Heading: “Interval Timer”; supporting line: “Audio cues for screen-free routines.”
- Preset selector: Shower, Workout, Custom.
- Large duration selector and clear Start button.
- Cue Frequency and Audio Cue groups.
- Less common options under “More Preferences.”
- Shower defaults must be obvious before starting.

**Focus**

- Prominent circular or linear timer progress visualization.
- Quick duration selection: 25 min, 50 min, Custom.
- One prominent Start Focus action.
- Optional Active Intent/task card and soundscape selection.
- Active timer state replaces setup controls with countdown, pause/resume, and end controls.

### 5.7 Accessibility and interaction

- Use accessible labels and state announcements for icon-only buttons.
- Provide touch targets of at least 44 × 44pt where practical.
- Maintain sufficient contrast for text and controls.
- Do not communicate priority, completion, or selection by color alone.
- Support system text scaling without clipping key controls.
- Respect reduced-motion preferences.
- Avoid requiring precise slider interaction as the only way to set a duration; include +/- or numeric controls.

---

## 6. Core Data Model

The MVP should be local-first and avoid a backend unless a later requirement establishes the need.

### 6.1 `Task`

| Field         | Type                 | Required | Description                      |
| ------------- | -------------------- | -------- | -------------------------------- |
| `id`          | string/UUID          | Yes      | Stable task identifier           |
| `title`       | string               | Yes      | Task name; trimmed and non-empty |
| `notes`       | string or null       | No       | Optional task notes              |
| `dueAt`       | ISO datetime or null | No       | Optional due date/time           |
| `priority`    | enum or null         | No       | `low`, `normal`, `high`          |
| `isCompleted` | boolean              | Yes      | Completion state                 |
| `createdAt`   | ISO datetime         | Yes      | Creation timestamp               |
| `updatedAt`   | ISO datetime         | Yes      | Last modification timestamp      |
| `completedAt` | ISO datetime or null | No       | Completion timestamp             |

### 6.2 `TimerPreset`

Represents a built-in or user-selected configuration. Named custom preset persistence can be deferred, but the built-in preset configurations must be available.

| Field                    | Type            | Required | Description                             |
| ------------------------ | --------------- | -------- | --------------------------------------- |
| `id`                     | string          | Yes      | Stable preset identifier, e.g. `shower` |
| `name`                   | string          | Yes      | Display name                            |
| `kind`                   | enum            | Yes      | `interval` or `focus`                   |
| `durationSeconds`        | integer         | Yes      | Initial timer duration                  |
| `cueIntervalSeconds`     | integer or null | No       | Interval cue cadence                    |
| `announcementMode`       | enum or null    | No       | `remaining`, `elapsed`, `both`          |
| `cueStyle`               | enum or null    | No       | `beep`, `pitched`, `voice`, `silent`    |
| `finalMinuteCueEnabled`  | boolean         | Yes      | Whether final-minute cue is enabled     |
| `completionSoundEnabled` | boolean         | Yes      | Whether completion sound is enabled     |
| `soundAssetId`           | string or null  | No       | Optional bundled background sound       |
| `musicVolume`            | number          | Yes      | Normalized volume, 0–1                  |
| `cueVolume`              | number          | Yes      | Normalized volume, 0–1                  |

### 6.3 `TimerSession`

A record of an active or completed focus/interval session.

| Field                     | Type                 | Required | Description                                   |
| ------------------------- | -------------------- | -------- | --------------------------------------------- |
| `id`                      | string/UUID          | Yes      | Stable session identifier                     |
| `kind`                    | enum                 | Yes      | `focus` or `interval`                         |
| `status`                  | enum                 | Yes      | `running`, `paused`, `completed`, `cancelled` |
| `taskId`                  | string or null       | No       | Linked task for focus sessions                |
| `presetId`                | string or null       | No       | Preset used, if any                           |
| `plannedDurationSeconds`  | integer              | Yes      | Configured total duration                     |
| `remainingSecondsAtPause` | integer or null      | No       | Snapshot for paused state, if needed          |
| `startedAt`               | ISO datetime         | Yes      | Initial start timestamp                       |
| `deadlineAt`              | ISO datetime or null | No       | End deadline while running                    |
| `pausedAt`                | ISO datetime or null | No       | Current/last pause time                       |
| `endedAt`                 | ISO datetime or null | No       | Completion/cancellation timestamp             |
| `actualDurationSeconds`   | integer or null      | No       | Actual active time                            |
| `createdAt`               | ISO datetime         | Yes      | Record creation time                          |

**Timer implementation note:** Do not treat a UI countdown tick as the authoritative state. Persist enough timestamp/state information to reconstruct the correct remaining time after app lifecycle changes. For pause/resume, adjust the deadline or calculate remaining time from a stable clock source.

### 6.4 `SoundAsset`

Represents a bundled audio asset.

| Field             | Type            | Required | Description                                                     |
| ----------------- | --------------- | -------- | --------------------------------------------------------------- |
| `id`              | string          | Yes      | Stable asset identifier                                         |
| `title`           | string          | Yes      | Display title                                                   |
| `category`        | enum            | Yes      | `relaxation`, `lofi`, `whiteNoise`, `lullaby`, `jazzy`, `study` |
| `assetUri`        | string          | Yes      | Local bundled asset reference                                   |
| `durationSeconds` | integer or null | No       | Duration for finite tracks; null for looped/unknown             |
| `isLoopable`      | boolean         | Yes      | Whether seamless/repeated playback is intended                  |
| `licenseNote`     | string          | Yes      | Internal license/source attribution reference                   |

### 6.5 `UserPreferences`

| Field                     | Type           | Required | Description                          |
| ------------------------- | -------------- | -------- | ------------------------------------ |
| `focusDurationSeconds`    | integer        | Yes      | Default focus duration               |
| `lastIntervalPresetId`    | string         | Yes      | Last selected interval preset        |
| `intervalDurationSeconds` | integer        | Yes      | Last-used interval duration          |
| `cueIntervalSeconds`      | integer        | Yes      | Last-used cue cadence                |
| `announcementMode`        | enum           | Yes      | `remaining`, `elapsed`, `both`       |
| `cueStyle`                | enum           | Yes      | `beep`, `pitched`, `voice`, `silent` |
| `finalMinuteCueEnabled`   | boolean        | Yes      | Final-minute cue setting             |
| `completionSoundEnabled`  | boolean        | Yes      | Completion cue setting               |
| `selectedSoundAssetId`    | string or null | No       | Current/last selected sound          |
| `musicVolume`             | number         | Yes      | Normalized 0–1                       |
| `cueVolume`               | number         | Yes      | Normalized 0–1                       |
| `hapticsEnabled`          | boolean        | Yes      | Optional vibration feedback          |
| `updatedAt`               | ISO datetime   | Yes      | Last preference update               |

### 6.6 Relationships and constraints

- `TimerSession.taskId` may reference `Task.id`; deleting a task should not crash or invalidate historical session records.
- `TimerSession.presetId` may reference `TimerPreset.id`.
- `TimerPreset.soundAssetId` and `UserPreferences.selectedSoundAssetId` may reference `SoundAsset.id`.
- Store task, preference, and session data locally using an appropriate persistent store.
- Bundled sound metadata can be static app data; audio files themselves are shipped with the app.
- Validate duration and volume values at the boundary of the UI and persistence layer.

---

## 7. MVP Definition of Done (DoD)

The MVP is done only when the following criteria are met.

### 7.1 Functional completeness

- [ ] Exactly three bottom navigation tabs exist in the order **Tasks → Intervals → Focus**.
- [ ] Users can create, view, edit, complete, reopen, and delete tasks.
- [ ] Optional task due date/time, priority, and notes work and persist.
- [ ] Users can start focus sessions at 25 minutes, 50 minutes, or a custom duration.
- [ ] Focus sessions support running, pause, resume, early end, and completion states.
- [ ] Focus sessions can optionally link to a task.
- [ ] Users can select and play a bundled sound, pause/resume it, and see the mini-player across tabs.
- [ ] Intervals includes Shower, Workout, and Custom presets.
- [ ] Shower preset defaults to 10 minutes, every 1 minute, remaining-time mode, short beep, and music off.
- [ ] Users can configure interval duration, cue cadence, announcement mode, cue style, final-minute cue, completion sound, and optional music.
- [ ] Both timer types handle app backgrounding and foregrounding without countdown drift or negative time.
- [ ] Preferences and core data persist after app restart.
- [ ] The app provides a graceful, understandable response to audio interruptions and unsupported platform behavior.

### 7.2 Timer and audio reliability

- [ ] Timer logic is based on timestamps/deadlines rather than a repeating UI interval.
- [ ] Pause/resume does not lose or add elapsed time beyond a documented tolerance.
- [ ] Completion occurs once per session.
- [ ] A scheduled cue is not duplicated when the app returns to the foreground.
- [ ] Missed cues during pause/background restrictions follow the documented scheduling policy.
- [ ] Music and cue volume controls behave as specified on supported devices.
- [ ] Audio assets are bundled, tested, and appropriately licensed.
- [ ] Background audio/cue behavior is tested on at least one physical iOS device and one physical Android device before claiming support.

### 7.3 UX and visual quality

- [ ] All three primary screens follow the same design system and supplied screen references.
- [ ] No extra primary navigation tabs are introduced.
- [ ] Primary actions are visually clear and reachable.
- [ ] The mini-player does not cover content, timer controls, or bottom navigation.
- [ ] Layouts work on small and large phone viewports.
- [ ] Loading, empty, selected, disabled, running, paused, and completed states are designed where applicable.
- [ ] Icon-only controls have accessible labels.
- [ ] Text and controls remain usable with system text scaling.
- [ ] The interface does not rely on color alone to communicate state.

### 7.4 Engineering quality

- [ ] Core task and timer logic has automated unit tests.
- [ ] Timer tests cover start, pause, resume, completion, cancellation, background/foreground transitions, and cue scheduling.
- [ ] Main flows have integration or end-to-end coverage where practical.
- [ ] No known P0 defects remain.
- [ ] Errors are handled without data loss or a permanently stuck timer.
- [ ] Local persistence is verified across a full app restart.
- [ ] iOS and Android builds are verified on physical devices.
- [ ] Project setup, environment requirements, and known platform audio limitations are documented.

### 7.5 MVP release gate

Do not call the MVP ready solely because the screens look correct. Release readiness requires the main user flows to work end-to-end, timer state to remain accurate through interruptions, and the interval timer's audio behavior to be verified on real devices.

---

## 8. Suggested Implementation Order

1. **Confirm the technical approach and platform constraints.** Validate what background audio and timed cues require on iOS and Android before committing to the implementation.
2. **Build and test the timer engine.** Implement timestamp-based start/pause/resume/completion and cue scheduling first.
3. **Build the three-tab app shell.** Add Tasks, Intervals, Focus navigation and shared components.
4. **Implement task CRUD and persistence.**
5. **Implement Focus timer and task association.**
6. **Implement Interval setup, presets, active state, and cue configuration.**
7. **Integrate bundled sounds and the shared mini-player.**
8. **Test interruptions and real-device audio behavior.**
9. **Complete accessibility, visual QA, automated tests, and release checklist.**

---

## 9. Open Decisions

These items should be decided during implementation rather than silently assumed:

1. **Framework:** Confirm the cross-platform framework and audio libraries before implementation.
2. **Background announcements:** Determine whether built-in sound cues and spoken announcements can meet the required background/screen-lock behavior on both platforms using available APIs, or whether native modules are required.
3. **Voice announcements:** Confirm the supported text-to-speech voices/languages and offline behavior. Do not promise offline speech until verified.
4. **Audio mixing:** Define the exact behavior when music, timer cues, calls, Bluetooth devices, and other apps compete for audio focus.
5. **Data storage:** Choose a local persistence solution appropriate to the selected framework.
6. **Sound catalog:** Select and license a small initial bundle of audio assets.
7. **Timer limits:** Confirm maximum custom duration and validation rules.
8. **Design token reconciliation:** Canonicalize the near-identical color values in `DESIGN.md` before implementation.

---

## 10. Instructions for the Implementation Agent

Use this PRD and the supplied `DESIGN.md` and screen mockups as the product and visual source of truth.

- Preserve the three-tab order: **Tasks → Intervals → Focus**.
- Do not add features or tabs outside the MVP without asking first.
- Prioritize correct timer state and audio behavior over visual effects.
- Build reusable components and keep task, timer, audio, and persistence logic separated.
- Do not claim background timer announcements work until verified on physical iOS and Android devices.
- When a requirement is ambiguous, consult the Open Decisions section and ask before making a product-level change.
- Keep a concise implementation checklist and tests aligned with the requirement IDs in this document.
