import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import {
  advance,
  createTimer,
  getElapsedMs,
  getRemainingMs,
  pause as pauseTimer,
  reset as resetTimer,
  start as startTimer,
  type TimerState,
} from '@/timer/timerEngine';

/** How often a running timer re-renders. It only drives the display; time comes from the deadline. */
const RENDER_INTERVAL_MS = 250;

type CountdownOptions = {
  /** Duration of the first session; change it later with `reset(durationMs)`. */
  initialDurationMs: number;
  /** Called on every refresh of a running timer, with the session's elapsed time. */
  onTick?: (elapsedMs: number) => void;
  /** Called exactly once when a session reaches zero. */
  onComplete?: () => void;
};

/** React binding for the timer engine: holds the state and refreshes it while running. */
export function useCountdown({ initialDurationMs, onTick, onComplete }: CountdownOptions) {
  const [timer, setTimer] = useState<TimerState>(() => createTimer(initialDurationMs));
  const [now, setNow] = useState(Date.now);
  // Mirrors `timer` so a refresh sees the latest state even between renders.
  const timerRef = useRef(timer);
  const callbacks = useRef({ onTick, onComplete });
  useEffect(() => {
    callbacks.current = { onTick, onComplete };
  });

  const update = useCallback((next: TimerState) => {
    timerRef.current = next;
    setTimer(next);
    setNow(Date.now());
  }, []);

  const refresh = useCallback(() => {
    const t = Date.now();
    const { state, didComplete } = advance(timerRef.current, t);
    if (state !== timerRef.current) {
      timerRef.current = state;
      setTimer(state);
    }
    setNow(t);
    callbacks.current.onTick?.(getElapsedMs(state, t));
    if (didComplete) callbacks.current.onComplete?.();
  }, []);

  useEffect(() => {
    if (timer.status !== 'running') return;
    const id = setInterval(refresh, RENDER_INTERVAL_MS);
    // JS timers stop in the background; catch up as soon as the app is visible again.
    const subscription = AppState.addEventListener('change', (appState) => {
      if (appState === 'active') refresh();
    });
    return () => {
      clearInterval(id);
      subscription.remove();
    };
  }, [timer.status, refresh]);

  return {
    status: timer.status,
    durationMs: timer.durationMs,
    remainingMs: getRemainingMs(timer, now),
    start: useCallback(() => update(startTimer(timerRef.current, Date.now())), [update]),
    pause: useCallback(() => update(pauseTimer(timerRef.current, Date.now())), [update]),
    /** Ends the session; pass a duration to also change it. */
    reset: useCallback(
      (nextDurationMs?: number) =>
        update(nextDurationMs ? createTimer(nextDurationMs) : resetTimer(timerRef.current)),
      [update],
    ),
  };
}
