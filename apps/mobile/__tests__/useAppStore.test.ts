import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from '@testing-library/react-native';

import { useAppStore } from '@/store/useAppStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

async function rehydrateFrom(state: unknown) {
  await AsyncStorage.setItem('app-store', JSON.stringify({ state, version: 0 }));
  await useAppStore.persist.rehydrate();
}

describe('useAppStore', () => {
  it('defaults to the system color mode', () => {
    expect(useAppStore.getState().colorMode).toBe('system');
  });

  it('updates the color mode', () => {
    act(() => useAppStore.getState().setColorMode('dark'));
    expect(useAppStore.getState().colorMode).toBe('dark');
  });

  it('defaults both timers to no music', () => {
    expect(useAppStore.getState().focusSoundAssetId).toBeNull();
    expect(useAppStore.getState().intervalSoundAssetId).toBeNull();
  });

  it('stores a known sound per timer and rejects unknown ids (AUD-05)', () => {
    act(() => useAppStore.getState().setFocusSoundAssetId('calming-rain'));
    act(() => useAppStore.getState().setIntervalSoundAssetId('not-a-sound'));
    expect(useAppStore.getState().focusSoundAssetId).toBe('calming-rain');
    expect(useAppStore.getState().intervalSoundAssetId).toBeNull();
  });

  it('restores valid persisted selections after a restart', async () => {
    await rehydrateFrom({
      colorMode: 'light',
      focusSoundAssetId: 'lofi-relaxing',
      intervalSoundAssetId: 'jazz-rainy-night',
    });
    expect(useAppStore.getState()).toMatchObject({
      colorMode: 'light',
      focusSoundAssetId: 'lofi-relaxing',
      intervalSoundAssetId: 'jazz-rainy-night',
    });
  });

  it('falls back to defaults when persisted data is corrupt or outdated', async () => {
    act(() => useAppStore.getState().setColorMode('system'));
    await rehydrateFrom({ colorMode: 'neon', focusSoundAssetId: 42, intervalSoundAssetId: 'gone' });
    expect(useAppStore.getState()).toMatchObject({
      colorMode: 'system',
      focusSoundAssetId: null,
      intervalSoundAssetId: null,
    });
  });
});
