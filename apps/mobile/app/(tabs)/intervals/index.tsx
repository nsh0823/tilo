import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from '@tilo/ui/components/accordion';
import { Button, ButtonIcon, ButtonText } from '@tilo/ui/components/button';
import { Card } from '@tilo/ui/components/card';
import { Chip, ChipText } from '@tilo/ui/components/chip';
import { Icon } from '@tilo/ui/components/icon';
import { SegmentedControl, SegmentedControlItem } from '@tilo/ui/components/segmented-control';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@tilo/ui/components/slider';
import { Switch } from '@tilo/ui/components/switch';
import { Text } from '@tilo/ui/components/text';
import {
  ChevronDown,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Square,
} from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { pauseMusic, playBeep, playMusic, reportPlaybackError, stopMusic } from '@/audio/playback';
import { SoundPicker } from '@/components/SoundPicker';
import { TimerRing } from '@/components/TimerRing';
import { useCountdown } from '@/hooks/useCountdown';
import { useAppStore } from '@/store/useAppStore';
import { buildCueSchedule, takeDueCues } from '@/timer/cueSchedule';

const MIN_MINUTES = 1;
const MAX_MINUTES = 45;

const PRESETS = {
  shower: { label: 'Shower', minutes: 10, action: 'Start Shower Timer' },
  workout: { label: 'Workout', minutes: 25, action: 'Start Workout Routine' },
  custom: { label: 'Custom', minutes: 15, action: 'Start Custom Timer' },
} as const;
type Preset = keyof typeof PRESETS;

const FREQUENCIES = [
  { value: '30', label: 'Every 30s', short: '30 sec' },
  { value: '60', label: 'Every 1 min', short: '1 min' },
  { value: '120', label: 'Every 2 min', short: '2 min' },
  { value: 'custom', label: 'Custom', short: 'custom interval' },
] as const;

const MIN_CUSTOM_INTERVAL = 1;
const MAX_CUSTOM_INTERVAL = 30;

// Only the beep cue has a sound so far; voice and haptic cues are not built yet.
const CUES = [
  { label: 'Beep', isAvailable: true },
  { label: 'Voice', isAvailable: false },
  { label: 'Haptic', isAvailable: false },
] as const;

const STATUS_LABEL = { idle: 'Ready', running: 'Running', paused: 'Paused', completed: 'Done' };

const beep = () => playBeep().catch(reportPlaybackError('Playing a beep cue'));
const endMusic = () => stopMusic('interval').catch(reportPlaybackError('Stopping interval music'));

export default function IntervalsScreen() {
  const [preset, setPreset] = useState<Preset>('shower');
  const [minutes, setMinutes] = useState<number>(PRESETS.shower.minutes);
  const [frequency, setFrequency] = useState<string>('60');
  const [customInterval, setCustomInterval] = useState(5);
  const [finalCountdown, setFinalCountdown] = useState(true);
  const soundId = useAppStore((state) => state.intervalSoundAssetId);
  const setSoundId = useAppStore((state) => state.setIntervalSoundAssetId);

  const intervalSeconds = frequency === 'custom' ? customInterval * 60 : Number(frequency);
  const schedule = useMemo(
    () =>
      buildCueSchedule({
        durationMs: minutes * 60_000,
        intervalMs: intervalSeconds * 1000,
        finalMinuteCueEnabled: finalCountdown,
      }),
    [minutes, intervalSeconds, finalCountdown],
  );
  // Index of the next cue to fire. Elapsed time freezes while paused, so resuming continues
  // from here; each cue is consumed once and never replayed (INT-13).
  const cueCursor = useRef(0);

  const timer = useCountdown({
    initialDurationMs: minutes * 60_000,
    onTick: (elapsedMs) => {
      const { due, cursor } = takeDueCues(schedule, cueCursor.current, elapsedMs);
      cueCursor.current = cursor;
      if (due.length) beep();
    },
    onComplete: () => {
      beep();
      endMusic();
    },
  });
  const isRunning = timer.status === 'running';

  // Music must not outlive the screen that started it.
  useEffect(() => () => void endMusic(), []);

  const setDuration = (value: number) => {
    const next = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(value)));
    setMinutes(next);
    timer.reset(next * 60_000);
  };

  const selectPreset = (value: string) => {
    setPreset(value as Preset);
    setDuration(PRESETS[value as Preset].minutes);
  };

  const setCustom = (value: number) =>
    setCustomInterval(Math.min(MAX_CUSTOM_INTERVAL, Math.max(MIN_CUSTOM_INTERVAL, value)));

  const frequencyLabel =
    frequency === 'custom'
      ? `${customInterval} min`
      : FREQUENCIES.find((f) => f.value === frequency)?.short;

  const start = () => {
    if (timer.status === 'idle') cueCursor.current = 0;
    timer.start();
    if (soundId)
      playMusic('interval', soundId).catch(reportPlaybackError('Starting interval music'));
  };

  const pause = () => {
    timer.pause();
    pauseMusic('interval');
  };

  const stop = () => {
    timer.reset();
    endMusic();
  };

  const selectSound = (id: string | null) => {
    setSoundId(id);
    if (!isRunning) return;
    if (id) playMusic('interval', id).catch(reportPlaybackError('Switching interval music'));
    else endMusic();
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-space-lg px-margin-mobile pb-space-lg pt-space-xs"
    >
      <View>
        <Text variant="headline-lg-mobile">Interval Timer</Text>
        <Text variant="body-md" className="mt-1 text-muted-foreground">
          Audio cues for screen-free routines
        </Text>
      </View>

      {/* Settings lock while a session exists, so the cue schedule can't change mid-run. */}
      {timer.status === 'idle' ? (
        <SegmentedControl
          value={preset}
          onValueChange={selectPreset}
          size="lg"
          className="self-stretch"
        >
          {(Object.keys(PRESETS) as Preset[]).map((key) => (
            <SegmentedControlItem key={key} value={key} className="flex-1">
              {PRESETS[key].label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      ) : null}

      {timer.status !== 'idle' ? (
        <Card size="lg" className="items-center">
          <TimerRing
            remaining={Math.ceil(timer.remainingMs / 1000)}
            progress={timer.remainingMs / timer.durationMs}
            caption={STATUS_LABEL[timer.status]}
          />
          <Text variant="body-sm" className="text-muted-foreground">
            Beep every {frequencyLabel}
          </Text>
          <View className="w-full max-w-xs flex-row gap-space-sm">
            {timer.status === 'completed' ? (
              <Button size="lg" className="flex-1" onPress={stop}>
                <ButtonIcon as={RotateCcw} />
                <ButtonText>Start Over</ButtonText>
              </Button>
            ) : (
              <>
                <Button size="lg" className="flex-1" onPress={isRunning ? pause : start}>
                  <ButtonIcon as={isRunning ? Pause : Play} />
                  <ButtonText>{isRunning ? 'Pause' : 'Resume'}</ButtonText>
                </Button>
                <Button
                  variant="secondary"
                  size="icon-lg"
                  onPress={stop}
                  accessibilityLabel="Stop timer"
                >
                  <ButtonIcon as={Square} className="text-foreground" />
                </Button>
              </>
            )}
          </View>
        </Card>
      ) : (
        <Card size="lg" className="items-center">
          <View className="w-full max-w-xs flex-row items-center justify-between">
            <Button
              variant="secondary"
              size="icon-lg"
              onPress={() => setDuration(minutes - 1)}
              accessibilityLabel="Decrease time"
            >
              <ButtonIcon as={Minus} className="text-foreground" />
            </Button>
            <View className="flex-row items-baseline gap-1">
              <Text variant="timer-display-mobile">{minutes}</Text>
              <Text variant="headline-md" className="text-muted-foreground">
                min
              </Text>
            </View>
            <Button
              variant="secondary"
              size="icon-lg"
              onPress={() => setDuration(minutes + 1)}
              accessibilityLabel="Increase time"
            >
              <ButtonIcon as={Plus} className="text-foreground" />
            </Button>
          </View>

          <View className="w-full max-w-xs gap-1.5 px-1">
            <Slider
              value={minutes}
              minValue={MIN_MINUTES}
              maxValue={MAX_MINUTES}
              step={1}
              onChange={setDuration}
              accessibilityLabel="Duration in minutes"
              className="h-6"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <View className="flex-row justify-between">
              {['1m', '15m', '30m', '45m'].map((tick) => (
                <Text key={tick} variant="label-sm" className="text-muted-foreground">
                  {tick}
                </Text>
              ))}
            </View>
          </View>

          <Button size="lg" className="mt-1 h-14 w-full max-w-xs flex-col gap-0" onPress={start}>
            <View className="flex-row items-center gap-1.5">
              <ButtonIcon as={Play} />
              <ButtonText>{PRESETS[preset].action}</ButtonText>
            </View>
            <Text variant="label-sm" className="font-geist text-primary-muted">
              {minutes} min • Beep every {frequencyLabel}
            </Text>
          </Button>
        </Card>
      )}

      <SoundPicker value={soundId} onChange={selectSound} />

      {timer.status === 'idle' ? (
        <>
          <Card className="gap-space-md">
            <View className="gap-2">
              <Text variant="headline-sm">Cue Frequency</Text>
              <View className="flex-row flex-wrap gap-space-xs">
                {FREQUENCIES.map((f) => (
                  <Chip
                    key={f.value}
                    size="tile"
                    isSelected={frequency === f.value}
                    onPress={() => setFrequency(f.value)}
                    className="basis-[48%] grow justify-between"
                  >
                    <ChipText>{f.label}</ChipText>
                    {frequency === f.value ? (
                      <View className="h-2 w-2 rounded-full bg-primary-foreground" />
                    ) : null}
                  </Chip>
                ))}
              </View>
              {frequency === 'custom' ? (
                <View className="flex-row items-center justify-between">
                  <Text variant="label-md">Every</Text>
                  <View className="flex-row items-center gap-space-sm">
                    <Button
                      variant="secondary"
                      size="icon"
                      onPress={() => setCustom(customInterval - 1)}
                      isDisabled={customInterval <= MIN_CUSTOM_INTERVAL}
                      accessibilityLabel="Decrease cue interval"
                    >
                      <ButtonIcon as={Minus} className="text-foreground" />
                    </Button>
                    <Text variant="label-md" className="min-w-14 text-center tabular-nums">
                      {customInterval} min
                    </Text>
                    <Button
                      variant="secondary"
                      size="icon"
                      onPress={() => setCustom(customInterval + 1)}
                      isDisabled={customInterval >= MAX_CUSTOM_INTERVAL}
                      accessibilityLabel="Increase cue interval"
                    >
                      <ButtonIcon as={Plus} className="text-foreground" />
                    </Button>
                  </View>
                </View>
              ) : null}
            </View>

            <View className="gap-2 border-t border-border pt-space-sm">
              <Text variant="headline-sm">Audio Cue</Text>
              <View className="flex-row gap-space-xs">
                {CUES.map((c) => (
                  <Chip
                    key={c.label}
                    size="tile"
                    isSelected={c.isAvailable}
                    disabled={!c.isAvailable}
                    accessibilityLabel={c.isAvailable ? c.label : `${c.label}, not available yet`}
                    className={`flex-1 justify-center ${c.isAvailable ? '' : 'opacity-40'}`}
                  >
                    <ChipText>{c.label}</ChipText>
                  </Chip>
                ))}
              </View>
              <Text variant="body-sm" className="text-muted-foreground">
                Voice and haptic cues are coming later.
              </Text>
            </View>
          </Card>

          <Card className="p-0">
            <Accordion type="single" isCollapsible>
              <AccordionItem value="preferences">
                <AccordionHeader>
                  <AccordionTrigger className="p-space-md">
                    {() => (
                      <>
                        <View className="min-w-0 flex-1 flex-row items-center gap-2">
                          <Icon
                            as={SlidersHorizontal}
                            size="md"
                            className="text-muted-foreground"
                          />
                          <AccordionTitleText>More Preferences</AccordionTitleText>
                        </View>
                        <AccordionIcon as={ChevronDown} />
                      </>
                    )}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent className="gap-space-md border-t border-border p-space-md">
                  <PreferenceRow
                    title="Announce remaining time"
                    description="Needs voice cues, coming later"
                    value={false}
                    isDisabled
                  />
                  <PreferenceRow
                    title="Final-minute cue"
                    description="A beep when 1 minute is left"
                    value={finalCountdown}
                    onValueChange={setFinalCountdown}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </>
      ) : null}
    </ScrollView>
  );
}

type PreferenceRowProps = {
  title: string;
  description: string;
  value: boolean;
  onValueChange?: (value: boolean) => void;
  isDisabled?: boolean;
};

function PreferenceRow({
  title,
  description,
  value,
  onValueChange,
  isDisabled,
}: PreferenceRowProps) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <View className="flex-1">
        <Text variant="label-md">{title}</Text>
        <Text variant="body-sm" className="text-muted-foreground">
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        isDisabled={isDisabled}
        accessibilityLabel={title}
      />
    </View>
  );
}
