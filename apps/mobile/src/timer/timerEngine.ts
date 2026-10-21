/**
 * Deadline-based countdown (PRD §3.4, §6.3). Remaining time is always derived from stored
 * timestamps, so the state survives backgrounding and never depends on how often the UI ticks.
 * Every function is pure: callers pass `now` (epoch ms).
 */

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export type TimerState = {
  status: TimerStatus;
  durationMs: number;
  /** Epoch ms when a running timer hits zero; null unless running. */
  deadlineAt: number | null;
  /** Remaining time frozen at pause; null unless paused. */
  remainingAtPauseMs: number | null;
};

export function createTimer(durationMs: number): TimerState {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    throw new RangeError(`Timer duration must be a positive number of ms, got ${durationMs}`);
  }
  return { status: 'idle', durationMs, deadlineAt: null, remainingAtPauseMs: null };
}

export function getRemainingMs(state: TimerState, now: number): number {
  switch (state.status) {
    case 'idle':
      return state.durationMs;
    case 'paused':
      return state.remainingAtPauseMs ?? state.durationMs;
    case 'completed':
      return 0;
    case 'running':
      return Math.min(state.durationMs, Math.max(0, (state.deadlineAt ?? now) - now));
  }
}

export function getElapsedMs(state: TimerState, now: number): number {
  return state.durationMs - getRemainingMs(state, now);
}

/** Starts an idle timer, or resumes a paused one. Other states are returned unchanged. */
export function start(state: TimerState, now: number): TimerState {
  if (state.status !== 'idle' && state.status !== 'paused') return state;
  return {
    ...state,
    status: 'running',
    deadlineAt: now + getRemainingMs(state, now),
    remainingAtPauseMs: null,
  };
}

export function pause(state: TimerState, now: number): TimerState {
  if (state.status !== 'running') return state;
  const remaining = getRemainingMs(state, now);
  // A timer paused exactly at zero has finished; let `advance` complete it instead.
  if (remaining === 0) return state;
  return { ...state, status: 'paused', deadlineAt: null, remainingAtPauseMs: remaining };
}

/** Stops the session and returns to a fresh idle timer of the same duration. */
export function reset(state: TimerState): TimerState {
  return createTimer(state.durationMs);
}

/**
 * Moves a running timer to `completed` once its deadline has passed. `didComplete` is true only
 * on that transition, so completion side effects fire exactly once per session.
 */
export function advance(
  state: TimerState,
  now: number,
): { state: TimerState; didComplete: boolean } {
  if (state.status !== 'running' || getRemainingMs(state, now) > 0) {
    return { state, didComplete: false };
  }
  return {
    state: { ...state, status: 'completed', deadlineAt: null, remainingAtPauseMs: null },
    didComplete: true,
  };
}
