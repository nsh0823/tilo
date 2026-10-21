import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

import { BEEP_CUE, findFocusSound } from './soundCatalog';

/**
 * App-wide playback: one music player and one cue player, so two timers can never play two
 * tracks at once (AUD-06). Music belongs to whichever timer started it last; another timer's
 * pause/stop leaves it alone.
 */

export type MusicOwner = 'focus' | 'interval';

let music: AudioPlayer | null = null;
let musicOwner: MusicOwner | null = null;
let musicSoundId: string | null = null;
/** Bumped by every play/pause/stop, so a play that resolves after a later pause is dropped. */
let musicRequest = 0;
let cue: AudioPlayer | null = null;
let audioModeReady: Promise<void> | null = null;

function ensureAudioMode() {
  // Provisional until the mixing policy is decided (docs/DECISIONS.md, open item 4): play in
  // silent mode and in the background, and mix with other apps' audio.
  audioModeReady ??= setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionMode: 'mixWithOthers',
  }).catch((error: unknown) => {
    audioModeReady = null;
    console.warn(
      '[audio] Could not set the audio mode; playback may stop in the background.',
      error,
    );
  });
  return audioModeReady;
}

/** Plays (or resumes) a bundled track on a loop, so it repeats until the timer ends. */
export async function playMusic(owner: MusicOwner, soundId: string): Promise<void> {
  const sound = findFocusSound(soundId);
  if (!sound) {
    console.warn(`[audio] Unknown sound "${soundId}"; music not started.`);
    return;
  }
  musicOwner = owner;
  const request = ++musicRequest;
  await ensureAudioMode();
  if (request !== musicRequest) return;

  if (!music) {
    music = createAudioPlayer(sound.source);
  } else if (musicSoundId !== soundId) {
    music.replace(sound.source);
  }
  music.loop = true;
  musicSoundId = soundId;
  music.play();
}

export function pauseMusic(owner: MusicOwner): void {
  if (musicOwner !== owner) return;
  musicRequest += 1;
  music?.pause();
}

/** Stops the owner's music and rewinds it, so the next session starts the track from the top. */
export async function stopMusic(owner: MusicOwner): Promise<void> {
  if (musicOwner !== owner) return;
  musicRequest += 1;
  musicOwner = null;
  if (!music) return;
  music.pause();
  await music.seekTo(0);
}

export async function playBeep(): Promise<void> {
  await ensureAudioMode();
  cue ??= createAudioPlayer(BEEP_CUE.source);
  await cue.seekTo(0);
  cue.play();
}

/** Logs failed playback with context; a missed sound must never break the timer. */
export function reportPlaybackError(action: string) {
  return (error: unknown) => console.warn(`[audio] ${action} failed.`, error);
}
