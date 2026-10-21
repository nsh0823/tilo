import { act, renderHook } from '@testing-library/react-native';
import { AppState, type AppStateStatus } from 'react-native';

import { useCountdown } from '@/hooks/useCountdown';

const MIN = 60_000;

let appStateListener: ((state: AppStateStatus) => void) | undefined;

beforeEach(() => {
  jest.useFakeTimers({ now: 1_000_000 });
  appStateListener = undefined;
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, listener) => {
    appStateListener = listener as (state: AppStateStatus) => void;
    return { remove: jest.fn() } as unknown as ReturnType<typeof AppState.addEventListener>;
  });
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

async function setup(initialDurationMs = MIN) {
  const onTick = jest.fn();
  const onComplete = jest.fn();
  const hook = await renderHook(() => useCountdown({ initialDurationMs, onTick, onComplete }));
  return { ...hook, onTick, onComplete };
}

describe('useCountdown (FOC-02..05, INT-08, INT-12)', () => {
  it('starts, counts down and reports elapsed time', async () => {
    const { result, onTick } = await setup();
    await act(() => result.current.start());
    expect(result.current.status).toBe('running');

    await act(() => jest.advanceTimersByTime(10_000));
    expect(result.current.remainingMs).toBe(50_000);
    expect(onTick).toHaveBeenLastCalledWith(10_000);
  });

  it('pauses and resumes without losing time', async () => {
    const { result } = await setup();
    await act(() => result.current.start());
    await act(() => jest.advanceTimersByTime(20_000));
    await act(() => result.current.pause());
    await act(() => jest.advanceTimersByTime(5 * MIN));
    expect(result.current.status).toBe('paused');
    expect(result.current.remainingMs).toBe(40_000);

    await act(() => result.current.start());
    await act(() => jest.advanceTimersByTime(10_000));
    expect(result.current.remainingMs).toBe(30_000);
  });

  it('completes once at zero and stops refreshing', async () => {
    const { result, onComplete, onTick } = await setup();
    await act(() => result.current.start());
    await act(() => jest.advanceTimersByTime(MIN + 5_000));
    expect(result.current.status).toBe('completed');
    expect(result.current.remainingMs).toBe(0);
    expect(onComplete).toHaveBeenCalledTimes(1);

    const ticks = onTick.mock.calls.length;
    await act(() => jest.advanceTimersByTime(MIN));
    expect(onTick).toHaveBeenCalledTimes(ticks);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('cancels back to an idle timer, optionally with a new duration', async () => {
    const { result, onComplete } = await setup();
    await act(() => result.current.start());
    await act(() => jest.advanceTimersByTime(10_000));
    await act(() => result.current.reset());
    expect(result.current.status).toBe('idle');
    expect(result.current.remainingMs).toBe(MIN);

    await act(() => result.current.reset(5 * MIN));
    expect(result.current.remainingMs).toBe(5 * MIN);
    await act(() => jest.advanceTimersByTime(10 * MIN));
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('catches up from the deadline when the app returns to the foreground', async () => {
    const { result, onComplete } = await setup(10 * MIN);
    await act(() => result.current.start());
    // Simulate a suspended JS thread: the clock moves but no interval callbacks run.
    jest.setSystemTime(Date.now() + 4 * MIN);
    await act(() => appStateListener?.('active'));
    expect(result.current.remainingMs).toBe(6 * MIN);

    jest.setSystemTime(Date.now() + 30 * MIN);
    await act(() => appStateListener?.('active'));
    expect(result.current.status).toBe('completed');
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
