/**
 * Interval cue scheduling (PRD §3.4, INT-04/07/13). Cues are positioned on the session's elapsed
 * time, so a pause simply stops the clock; nothing is "missed" while paused. A cursor records
 * which cues have been consumed, so each cue fires at most once.
 */

export type CueKind = 'interval' | 'finalMinute';

export type Cue = {
  /** Elapsed time (ms) at which the cue is due. */
  atMs: number;
  kind: CueKind;
};

export type CueConfig = {
  durationMs: number;
  /** Gap between interval cues. */
  intervalMs: number;
  finalMinuteCueEnabled: boolean;
};

const FINAL_MINUTE_MS = 60_000;

/**
 * Cues that are this late (e.g. the app was suspended in the background) are dropped instead of
 * played, so returning to the foreground never produces a burst of stale beeps.
 */
export const CUE_LATE_TOLERANCE_MS = 2_000;

/** All cues for a session, sorted by time. The end of the session is the completion cue, not here. */
export function buildCueSchedule({
  durationMs,
  intervalMs,
  finalMinuteCueEnabled,
}: CueConfig): Cue[] {
  if (!(durationMs > 0) || !(intervalMs > 0)) return [];

  const cues: Cue[] = [];
  for (let at = intervalMs; at < durationMs; at += intervalMs) {
    cues.push({ atMs: at, kind: 'interval' });
  }

  const finalAt = durationMs - FINAL_MINUTE_MS;
  if (finalMinuteCueEnabled && finalAt > 0) {
    // One cue per moment: the final-minute cue replaces an interval cue at the same time.
    const sameTime = cues.findIndex((cue) => cue.atMs === finalAt);
    if (sameTime >= 0) cues[sameTime] = { atMs: finalAt, kind: 'finalMinute' };
    else cues.push({ atMs: finalAt, kind: 'finalMinute' });
  }

  return cues.sort((a, b) => a.atMs - b.atMs);
}

/**
 * Consumes every cue due by `elapsedMs`, starting at `cursor`. Returns the cues to play now
 * (late ones are skipped) and the new cursor.
 */
export function takeDueCues(
  schedule: readonly Cue[],
  cursor: number,
  elapsedMs: number,
): { due: Cue[]; cursor: number } {
  let next = Math.max(0, cursor);
  const due: Cue[] = [];
  for (let cue = schedule[next]; cue && cue.atMs <= elapsedMs; cue = schedule[++next]) {
    if (elapsedMs - cue.atMs <= CUE_LATE_TOLERANCE_MS) due.push(cue);
  }
  return { due, cursor: next };
}
