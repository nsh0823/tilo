import { Badge, BadgeText } from '@tilo/ui/components/badge';
import { Button, ButtonIcon, ButtonText } from '@tilo/ui/components/button';
import { Card } from '@tilo/ui/components/card';
import { Icon } from '@tilo/ui/components/icon';
import { SegmentedControl, SegmentedControlItem } from '@tilo/ui/components/segmented-control';
import { Text } from '@tilo/ui/components/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CircleCheck, Pause, Play, RotateCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { pauseMusic, playMusic, reportPlaybackError, stopMusic } from '@/audio/playback';
import { SoundPicker } from '@/components/SoundPicker';
import { TimerRing } from '@/components/TimerRing';
import { useCountdown } from '@/hooks/useCountdown';
import { useAppStore } from '@/store/useAppStore';

// "Custom" uses the Stitch prototype's 45-minute value until a duration picker exists.
const DURATIONS = { '25': 25, '50': 50, custom: 45 } as const;
type DurationKey = keyof typeof DURATIONS;

const STATUS_LABEL = { idle: 'Ready', running: 'Running', paused: 'Paused', completed: 'Done' };

const startMusic = (soundId: string | null) => {
  if (soundId) playMusic('focus', soundId).catch(reportPlaybackError('Starting focus music'));
};
const endMusic = () => stopMusic('focus').catch(reportPlaybackError('Stopping focus music'));

export default function FocusScreen() {
  const router = useRouter();
  const { task } = useLocalSearchParams<{ task?: string }>();
  const [durationKey, setDurationKey] = useState<DurationKey>('25');
  const soundId = useAppStore((state) => state.focusSoundAssetId);
  const setSoundId = useAppStore((state) => state.setFocusSoundAssetId);
  const timer = useCountdown({
    initialDurationMs: DURATIONS[durationKey] * 60_000,
    onComplete: endMusic,
  });
  const isRunning = timer.status === 'running';

  // Music must not outlive the screen that started it.
  useEffect(() => () => void endMusic(), []);

  const selectDuration = (key: string) => {
    setDurationKey(key as DurationKey);
    timer.reset(DURATIONS[key as DurationKey] * 60_000);
    endMusic();
  };

  const reset = () => {
    timer.reset();
    endMusic();
  };

  const toggle = () => {
    if (timer.status === 'completed') return reset();
    if (isRunning) {
      timer.pause();
      pauseMusic('focus');
    } else {
      timer.start();
      startMusic(soundId);
    }
  };

  const selectSound = (id: string | null) => {
    setSoundId(id);
    if (!isRunning) return;
    if (id) startMusic(id);
    else endMusic();
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="px-margin-mobile pb-space-xl"
    >
      <View className="flex-row items-center justify-between py-space-sm">
        <View className="flex-row items-center gap-space-xs">
          <View className="h-2 w-2 rounded-full bg-primary" />
          <Text variant="label-md" className="uppercase">
            Focus Session
          </Text>
        </View>
        <Badge variant="secondary" className="px-space-sm">
          <BadgeText>{STATUS_LABEL[timer.status]}</BadgeText>
        </Badge>
      </View>

      <View className="my-space-md items-center py-space-sm">
        <TimerRing
          remaining={Math.ceil(timer.remainingMs / 1000)}
          progress={timer.remainingMs / timer.durationMs}
          caption="Interval"
        />
        <SegmentedControl
          value={durationKey}
          onValueChange={selectDuration}
          className="mt-space-md self-center"
        >
          <SegmentedControlItem value="25">25 min</SegmentedControlItem>
          <SegmentedControlItem value="50">50 min</SegmentedControlItem>
          <SegmentedControlItem value="custom">Custom</SegmentedControlItem>
        </SegmentedControl>
      </View>

      <View className="mb-space-lg flex-row gap-space-sm">
        <Button className="flex-1" onPress={toggle}>
          <ButtonIcon as={isRunning ? Pause : Play} />
          <ButtonText>
            {isRunning
              ? 'Pause'
              : timer.status === 'paused'
                ? 'Resume'
                : timer.status === 'completed'
                  ? 'Restart'
                  : 'Start Focus'}
          </ButtonText>
        </Button>
        {timer.status !== 'idle' ? (
          <Button
            variant="secondary"
            size="icon-lg"
            onPress={reset}
            accessibilityLabel="Reset timer"
          >
            <ButtonIcon as={RotateCcw} />
          </Button>
        ) : null}
      </View>

      <View className="gap-space-sm">
        <Card className="flex-row items-center justify-between">
          <View className="min-w-0 flex-1 flex-row items-center gap-space-sm">
            <Icon as={CircleCheck} size="lg" className="text-muted-foreground" />
            <View className="min-w-0 flex-1">
              <Text variant="label-sm" className="uppercase text-muted-foreground">
                Active Intent
              </Text>
              <Text variant="body-md" className="font-geist-medium" numberOfLines={1}>
                {task ?? 'No task selected'}
              </Text>
            </View>
          </View>
          <Button variant="ghost" size="sm" onPress={() => router.navigate('/')}>
            <ButtonText>{task ? 'Change' : 'Choose'}</ButtonText>
          </Button>
        </Card>

        <SoundPicker value={soundId} onChange={selectSound} />
      </View>
    </ScrollView>
  );
}
