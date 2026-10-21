import type * as Playback from '@/audio/playback';

type MockPlayer = {
  source: unknown;
  loop: boolean;
  play: jest.Mock;
  pause: jest.Mock;
  replace: jest.Mock;
  seekTo: jest.Mock;
};

const mockPlayers: MockPlayer[] = [];
const mockSetAudioMode = jest.fn(() => Promise.resolve());

jest.mock('expo-audio', () => ({
  setAudioModeAsync: (...args: unknown[]) => mockSetAudioMode(...(args as [])),
  createAudioPlayer: (source: unknown) => {
    const player: MockPlayer = {
      source,
      loop: false,
      play: jest.fn(),
      pause: jest.fn(),
      replace: jest.fn((next: unknown) => {
        player.source = next;
      }),
      seekTo: jest.fn(() => Promise.resolve()),
    };
    mockPlayers.push(player);
    return player;
  },
}));

function player() {
  const [first] = mockPlayers;
  if (!first) throw new Error('No audio player was created');
  return first;
}

// The module keeps singleton mockPlayers, so each test loads a fresh copy.
let playback: typeof Playback;
beforeEach(() => {
  mockPlayers.length = 0;
  mockSetAudioMode.mockClear();
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- a fresh module per test
    playback = require('@/audio/playback');
  });
});

describe('music playback (FOC-07, INT-10, AUD-06)', () => {
  it('loops the selected track so it repeats until the timer ends', async () => {
    await playback.playMusic('focus', 'calming-rain');
    expect(mockPlayers).toHaveLength(1);
    expect(player().loop).toBe(true);
    expect(player().play).toHaveBeenCalledTimes(1);
    expect(mockSetAudioMode).toHaveBeenCalledWith(
      expect.objectContaining({ playsInSilentMode: true, shouldPlayInBackground: true }),
    );
  });

  it('uses a single player across timers, so two tracks never play at once', async () => {
    await playback.playMusic('focus', 'calming-rain');
    await playback.playMusic('interval', 'lofi-relaxing');
    expect(mockPlayers).toHaveLength(1);
    expect(player().replace).toHaveBeenCalledTimes(1);
  });

  it("ignores another timer's pause and stop", async () => {
    await playback.playMusic('interval', 'lofi-relaxing');
    playback.pauseMusic('focus');
    await playback.stopMusic('focus');
    expect(player().pause).not.toHaveBeenCalled();
  });

  it('pauses and resumes the same track without reloading it', async () => {
    await playback.playMusic('focus', 'calming-rain');
    playback.pauseMusic('focus');
    await playback.playMusic('focus', 'calming-rain');
    expect(player().pause).toHaveBeenCalledTimes(1);
    expect(player().replace).not.toHaveBeenCalled();
    expect(player().play).toHaveBeenCalledTimes(2);
  });

  it('rewinds on stop so the next session starts from the top', async () => {
    await playback.playMusic('focus', 'calming-rain');
    await playback.stopMusic('focus');
    expect(player().pause).toHaveBeenCalled();
    expect(player().seekTo).toHaveBeenCalledWith(0);
  });

  it('drops a play that is still waiting on the audio mode when the timer pauses', async () => {
    const pending = playback.playMusic('focus', 'calming-rain');
    playback.pauseMusic('focus');
    await pending;
    expect(mockPlayers).toHaveLength(0);
  });

  it('does not play an unknown sound id', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    await playback.playMusic('focus', 'missing-track');
    expect(mockPlayers).toHaveLength(0);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('missing-track'));
    warn.mockRestore();
  });

  it('still plays when the audio mode cannot be set, and logs why', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    mockSetAudioMode.mockImplementationOnce(() => Promise.reject(new Error('session busy')));
    await playback.playMusic('focus', 'calming-rain');
    expect(player().play).toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('audio mode'), expect.any(Error));
    warn.mockRestore();
  });
});

describe('beep cue', () => {
  it('rewinds and replays one shared cue player', async () => {
    await playback.playBeep();
    await playback.playBeep();
    expect(mockPlayers).toHaveLength(1);
    expect(player().seekTo).toHaveBeenCalledWith(0);
    expect(player().play).toHaveBeenCalledTimes(2);
  });
});
