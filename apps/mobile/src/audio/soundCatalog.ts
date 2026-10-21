/**
 * Bundled audio (PRD §3.5, §6.4). Metadata is static app data; the files ship in
 * `assets/sounds`. Every asset needs a `licenseNote` before it ships (AUD-07).
 */

export type SoundCategory = 'relaxation' | 'lofi' | 'whiteNoise' | 'lullaby' | 'jazzy' | 'study';

export type SoundAsset = {
  id: string;
  title: string;
  category: SoundCategory;
  /** PRD `assetUri`: the Metro asset module from `require`, playable by expo-audio. */
  source: number;
  durationSeconds: number | null;
  isLoopable: boolean;
  licenseNote: string;
};

// Filenames follow Pixabay's download pattern (<uploader>-<slug>-<id>.mp3). The source page and
// license terms are not confirmed yet; check each one before release (PRD §7.2).
const PIXABAY_UNCONFIRMED =
  'Presumed Pixabay Content License from the filename; source page not yet confirmed.';

export const FOCUS_SOUNDS: readonly SoundAsset[] = [
  {
    id: 'lofi-sunny-cafe',
    title: 'Sunny Café',
    category: 'lofi',
    source: require('../../assets/sounds/focus/alex-morgan-lofi-sunny-cafe-568156.mp3'),
    durationSeconds: 124,
    isLoopable: true,
    licenseNote: `${PIXABAY_UNCONFIRMED} Uploader alex-morgan, id 568156.`,
  },
  {
    id: 'lofi-relaxing',
    title: 'Relaxing Lo-fi',
    category: 'lofi',
    source: require('../../assets/sounds/focus/velariomusic-lofi-relaxing-598427.mp3'),
    durationSeconds: 145,
    isLoopable: true,
    licenseNote: `${PIXABAY_UNCONFIRMED} Uploader velariomusic, id 598427.`,
  },
  {
    id: 'jazz-rainy-night',
    title: 'Rainy Night Jazz',
    category: 'jazzy',
    source: require('../../assets/sounds/focus/alex-morgan-chillhop-jazz-rainy-night-552793.mp3'),
    durationSeconds: 180,
    isLoopable: true,
    licenseNote: `${PIXABAY_UNCONFIRMED} Uploader alex-morgan, id 552793.`,
  },
  {
    id: 'calming-rain',
    title: 'Calming Rain',
    category: 'relaxation',
    source: require('../../assets/sounds/focus/celeronbeats-calming-rain-resonance-for-sleep-571921.mp3'),
    durationSeconds: 185,
    isLoopable: true,
    licenseNote: `${PIXABAY_UNCONFIRMED} Uploader celeronbeats, id 571921.`,
  },
  {
    id: 'rainfall-remedy',
    title: 'Rainfall Remedy',
    category: 'relaxation',
    source: require('../../assets/sounds/focus/meditativetiger-rainfall-remedy-healing-frequencies-tinnitus-healer-367360.mp3'),
    durationSeconds: 262,
    isLoopable: true,
    licenseNote: `${PIXABAY_UNCONFIRMED} Uploader meditativetiger, id 367360.`,
  },
  {
    id: 'sleeping-baby',
    title: 'Sleeping Baby',
    category: 'lullaby',
    source: require('../../assets/sounds/focus/adelinahalimah-sleeping-baby-562491.mp3'),
    durationSeconds: 168,
    isLoopable: true,
    licenseNote: `${PIXABAY_UNCONFIRMED} Uploader adelinahalimah, id 562491.`,
  },
  {
    id: 'baby-lullaby',
    title: 'Baby Lullaby',
    category: 'lullaby',
    source: require('../../assets/sounds/focus/hitslab-baby-sleeping-lullaby-music-592859.mp3'),
    durationSeconds: 183,
    isLoopable: true,
    licenseNote: `${PIXABAY_UNCONFIRMED} Uploader hitslab, id 592859.`,
  },
];

/** PRD §6.4 categories describe music, so cue sounds carry no category. */
export const BEEP_CUE: Omit<SoundAsset, 'category'> = {
  id: 'cue-beep',
  title: 'Beep',
  source: require('../../assets/sounds/cues/u_edtmwfwu7c-beep-329314.mp3'),
  durationSeconds: 1,
  isLoopable: false,
  licenseNote: `${PIXABAY_UNCONFIRMED} Uploader u_edtmwfwu7c, id 329314.`,
};

export const SOUND_CATEGORY_LABEL: Record<SoundCategory, string> = {
  relaxation: 'Relaxation',
  lofi: 'Lo-fi',
  whiteNoise: 'White Noise',
  lullaby: 'Lullaby',
  jazzy: 'Jazzy',
  study: 'Study',
};

export function findFocusSound(id: string | null | undefined): SoundAsset | undefined {
  return id ? FOCUS_SOUNDS.find((sound) => sound.id === id) : undefined;
}
