import { buildCueSchedule, CUE_LATE_TOLERANCE_MS, takeDueCues } from '@/timer/cueSchedule';

const MIN = 60_000;

describe('buildCueSchedule (INT-04, INT-07)', () => {
  it('places a cue every interval, excluding the end of the session', () => {
    const cues = buildCueSchedule({
      durationMs: 3 * MIN,
      intervalMs: MIN,
      finalMinuteCueEnabled: false,
    });
    expect(cues).toEqual([
      { atMs: MIN, kind: 'interval' },
      { atMs: 2 * MIN, kind: 'interval' },
    ]);
  });

  it('merges the final-minute cue with an interval cue at the same time', () => {
    const cues = buildCueSchedule({
      durationMs: 3 * MIN,
      intervalMs: MIN,
      finalMinuteCueEnabled: true,
    });
    expect(cues).toEqual([
      { atMs: MIN, kind: 'interval' },
      { atMs: 2 * MIN, kind: 'finalMinute' },
    ]);
  });

  it('adds the final-minute cue in order when it falls between interval cues', () => {
    const cues = buildCueSchedule({
      durationMs: 5 * MIN + 30_000,
      intervalMs: 2 * MIN,
      finalMinuteCueEnabled: true,
    });
    expect(cues.map((cue) => cue.atMs)).toEqual([2 * MIN, 4 * MIN, 4 * MIN + 30_000]);
    expect(cues[2]?.kind).toBe('finalMinute');
  });

  it('skips the final-minute cue for sessions of a minute or less', () => {
    expect(
      buildCueSchedule({ durationMs: MIN, intervalMs: 30_000, finalMinuteCueEnabled: true }),
    ).toEqual([{ atMs: 30_000, kind: 'interval' }]);
  });

  it('returns no cues when the interval is at least the duration', () => {
    expect(
      buildCueSchedule({ durationMs: MIN, intervalMs: 2 * MIN, finalMinuteCueEnabled: false }),
    ).toEqual([]);
  });

  it('returns no cues for zero, negative or NaN inputs', () => {
    expect(
      buildCueSchedule({ durationMs: 0, intervalMs: MIN, finalMinuteCueEnabled: true }),
    ).toEqual([]);
    expect(
      buildCueSchedule({ durationMs: MIN, intervalMs: 0, finalMinuteCueEnabled: true }),
    ).toEqual([]);
    expect(
      buildCueSchedule({ durationMs: MIN, intervalMs: -1, finalMinuteCueEnabled: true }),
    ).toEqual([]);
    expect(
      buildCueSchedule({ durationMs: Number.NaN, intervalMs: MIN, finalMinuteCueEnabled: true }),
    ).toEqual([]);
  });
});

describe('takeDueCues (INT-13)', () => {
  const schedule = buildCueSchedule({
    durationMs: 10 * MIN,
    intervalMs: MIN,
    finalMinuteCueEnabled: false,
  });

  it('fires nothing before the first cue', () => {
    expect(takeDueCues(schedule, 0, MIN - 1)).toEqual({ due: [], cursor: 0 });
  });

  it('fires a cue once when it comes due, and never again', () => {
    const first = takeDueCues(schedule, 0, MIN + 250);
    expect(first.due).toEqual([{ atMs: MIN, kind: 'interval' }]);
    expect(first.cursor).toBe(1);

    // Later refreshes (or a return to the foreground) at the same elapsed time replay nothing.
    expect(takeDueCues(schedule, first.cursor, MIN + 500)).toEqual({ due: [], cursor: 1 });
  });

  it('continues after a pause from where elapsed time stopped', () => {
    // Paused at 1:30 elapsed; elapsed time does not move while paused, so resuming
    // continues the schedule and the 2:00 cue fires at 2:00 of session time.
    const atPause = takeDueCues(schedule, 0, 90_000);
    const afterResume = takeDueCues(schedule, atPause.cursor, 2 * MIN + 100);
    expect(afterResume.due).toEqual([{ atMs: 2 * MIN, kind: 'interval' }]);
  });

  it('drops cues that are stale after the app was suspended, without a burst', () => {
    // Suspended from 1:00 to 4:30: the 2:00, 3:00 and 4:00 cues are late and consumed silently.
    const result = takeDueCues(schedule, 1, 4 * MIN + 30_000);
    expect(result.due).toEqual([]);
    expect(result.cursor).toBe(4);
  });

  it('still plays a cue that is only slightly late', () => {
    const result = takeDueCues(schedule, 0, MIN + CUE_LATE_TOLERANCE_MS);
    expect(result.due).toHaveLength(1);
  });

  it('handles an exhausted schedule and a negative cursor', () => {
    expect(takeDueCues(schedule, schedule.length, 10 * MIN)).toEqual({
      due: [],
      cursor: schedule.length,
    });
    expect(takeDueCues(schedule, -5, MIN).cursor).toBe(1);
    expect(takeDueCues([], 0, MIN)).toEqual({ due: [], cursor: 0 });
  });
});
