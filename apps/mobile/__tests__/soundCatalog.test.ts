import { BEEP_CUE, FOCUS_SOUNDS, findFocusSound } from '@/audio/soundCatalog';

describe('sound catalog (AUD-01, AUD-07)', () => {
  it('has unique ids', () => {
    const ids = FOCUS_SOUNDS.map((sound) => sound.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('records a license note and a bundled source for every asset', () => {
    for (const sound of [...FOCUS_SOUNDS, BEEP_CUE]) {
      expect(sound.licenseNote.trim()).not.toBe('');
      expect(sound.source).toBeDefined();
    }
  });

  it('marks music as loopable so it can repeat for the whole timer', () => {
    expect(FOCUS_SOUNDS.every((sound) => sound.isLoopable)).toBe(true);
  });

  it('finds sounds by id and returns undefined for unknown or empty ids', () => {
    expect(findFocusSound('calming-rain')?.title).toBe('Calming Rain');
    expect(findFocusSound('nope')).toBeUndefined();
    expect(findFocusSound(null)).toBeUndefined();
    expect(findFocusSound('')).toBeUndefined();
  });
});
