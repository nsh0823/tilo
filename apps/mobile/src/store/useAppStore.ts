import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { findFocusSound } from '@/audio/soundCatalog';

export type ColorMode = 'light' | 'dark' | 'system';

type AppState = {
  colorMode: ColorMode;
  /** Background music per timer (FOC-07, INT-10); null runs the timer silently. */
  focusSoundAssetId: string | null;
  intervalSoundAssetId: string | null;
  setColorMode: (mode: ColorMode) => void;
  setFocusSoundAssetId: (id: string | null) => void;
  setIntervalSoundAssetId: (id: string | null) => void;
};

const COLOR_MODES: readonly unknown[] = ['light', 'dark', 'system'] satisfies ColorMode[];

/** Only ids still in the bundled catalog survive; anything else falls back to silence. */
export function toKnownSoundId(id: unknown): string | null {
  return typeof id === 'string' && findFocusSound(id) ? id : null;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      colorMode: 'system',
      focusSoundAssetId: null,
      intervalSoundAssetId: null,
      setColorMode: (colorMode) => set({ colorMode }),
      setFocusSoundAssetId: (id) => set({ focusSoundAssetId: toKnownSoundId(id) }),
      setIntervalSoundAssetId: (id) => set({ intervalSoundAssetId: toKnownSoundId(id) }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ colorMode, focusSoundAssetId, intervalSoundAssetId }) => ({
        colorMode,
        focusSoundAssetId,
        intervalSoundAssetId,
      }),
      // Stored data may be corrupt or from an older catalog: validate each field, keep defaults otherwise.
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as Record<string, unknown>;
        return {
          ...current,
          colorMode: COLOR_MODES.includes(stored.colorMode)
            ? (stored.colorMode as ColorMode)
            : current.colorMode,
          focusSoundAssetId: toKnownSoundId(stored.focusSoundAssetId),
          intervalSoundAssetId: toKnownSoundId(stored.intervalSoundAssetId),
        };
      },
    },
  ),
);
