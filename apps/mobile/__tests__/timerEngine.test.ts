import {
  advance,
  createTimer,
  getElapsedMs,
  getRemainingMs,
  pause,
  reset,
  start,
} from '@/timer/timerEngine';

const MIN = 60_000;
const T0 = 1_000_000;

describe('timerEngine (FOC-02..05, INT-08)', () => {
  it('rejects zero, negative and non-finite durations', () => {
    expect(() => createTimer(0)).toThrow(RangeError);
    expect(() => createTimer(-1)).toThrow(RangeError);
    expect(() => createTimer(Number.NaN)).toThrow(RangeError);
    expect(() => createTimer(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });

  it('starts idle with the full duration remaining', () => {
    const timer = createTimer(10 * MIN);
    expect(timer.status).toBe('idle');
    expect(getRemainingMs(timer, T0)).toBe(10 * MIN);
    expect(getElapsedMs(timer, T0)).toBe(0);
  });

  it('counts down from the deadline, not from ticks', () => {
    const running = start(createTimer(10 * MIN), T0);
    expect(running.deadlineAt).toBe(T0 + 10 * MIN);
    // One read after a long gap (e.g. the app was backgrounded) is still exact.
    expect(getRemainingMs(running, T0 + 7 * MIN + 500)).toBe(3 * MIN - 500);
  });

  it('freezes remaining time while paused and resumes from it (FOC-03)', () => {
    const running = start(createTimer(10 * MIN), T0);
    const paused = pause(running, T0 + 4 * MIN);
    expect(paused.status).toBe('paused');
    expect(getRemainingMs(paused, T0 + 60 * MIN)).toBe(6 * MIN);

    const resumed = start(paused, T0 + 60 * MIN);
    expect(resumed.status).toBe('running');
    expect(getRemainingMs(resumed, T0 + 61 * MIN)).toBe(5 * MIN);
  });

  it('never goes negative (FOC-05)', () => {
    const running = start(createTimer(MIN), T0);
    expect(getRemainingMs(running, T0 + 5 * MIN)).toBe(0);
  });

  it('does not report more than the duration if the clock moves backwards', () => {
    const running = start(createTimer(MIN), T0);
    expect(getRemainingMs(running, T0 - 10 * MIN)).toBe(MIN);
  });

  it('completes exactly once', () => {
    const running = start(createTimer(MIN), T0);
    expect(advance(running, T0 + 30_000).didComplete).toBe(false);

    const first = advance(running, T0 + MIN);
    expect(first.didComplete).toBe(true);
    expect(first.state.status).toBe('completed');

    const second = advance(first.state, T0 + 2 * MIN);
    expect(second.didComplete).toBe(false);
    expect(second.state).toBe(first.state);
  });

  it('does not complete while paused, even long past the old deadline', () => {
    const paused = pause(start(createTimer(MIN), T0), T0 + 10_000);
    expect(advance(paused, T0 + 10 * MIN).didComplete).toBe(false);
  });

  it('leaves a timer that hit zero for advance to complete, rather than pausing it', () => {
    const running = start(createTimer(MIN), T0);
    expect(pause(running, T0 + MIN)).toBe(running);
  });

  it('ignores start on a running or completed timer and pause on a non-running one', () => {
    const running = start(createTimer(MIN), T0);
    expect(start(running, T0 + 1000)).toBe(running);
    const completed = advance(running, T0 + MIN).state;
    expect(start(completed, T0 + 2 * MIN)).toBe(completed);
    const idle = createTimer(MIN);
    expect(pause(idle, T0)).toBe(idle);
  });

  it('reset (cancel) returns a fresh idle timer of the same duration (FOC-04)', () => {
    const paused = pause(start(createTimer(10 * MIN), T0), T0 + MIN);
    const fresh = reset(paused);
    expect(fresh).toEqual(createTimer(10 * MIN));
  });
});
