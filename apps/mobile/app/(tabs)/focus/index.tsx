import { Badge, BadgeText } from '@tilo/ui/components/badge';
import { Button, ButtonIcon, ButtonText } from '@tilo/ui/components/button';
import { Card } from '@tilo/ui/components/card';
import { Icon } from '@tilo/ui/components/icon';
import { SegmentedControl, SegmentedControlItem } from '@tilo/ui/components/segmented-control';
import { Text } from '@tilo/ui/components/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CircleCheck, Droplet, Pause, Play, RotateCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { TimerRing } from '@/components/TimerRing';

// "Custom" uses the Stitch prototype's 45-minute value until a duration picker exists.
const DURATIONS = { '25': 25, '50': 50, custom: 45 } as const;
type DurationKey = keyof typeof DURATIONS;

export default function FocusScreen() {
  const router = useRouter();
  const { task } = useLocalSearchParams<{ task?: string }>();
  const [durationKey, setDurationKey] = useState<DurationKey>('25');
  const total = DURATIONS[durationKey] * 60;
  const [remaining, setRemaining] = useState(total);
  const [isStarted, setIsStarted] = useState(false);
  // The countdown stops on its own at zero; `isStarted` only records the user's intent.
  const isRunning = isStarted && remaining > 0;

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setRemaining((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const selectDuration = (key: string) => {
    setDurationKey(key as DurationKey);
    setRemaining(DURATIONS[key as DurationKey] * 60);
    setIsStarted(false);
  };

  const reset = () => {
    setRemaining(total);
    setIsStarted(false);
  };

  const status = isRunning
    ? 'Running'
    : remaining === total
      ? 'Ready'
      : remaining
        ? 'Paused'
        : 'Done';

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
          <BadgeText>{status}</BadgeText>
        </Badge>
      </View>

      <View className="my-space-md items-center py-space-sm">
        <TimerRing
          remaining={remaining}
          progress={total ? remaining / total : 0}
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
        <Button className="flex-1" onPress={() => (remaining ? setIsStarted(!isRunning) : reset())}>
          <ButtonIcon as={isRunning ? Pause : Play} />
          <ButtonText>{isRunning ? 'Pause' : remaining ? 'Start Focus' : 'Restart'}</ButtonText>
        </Button>
        {remaining !== total ? (
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

        <Card className="flex-row items-center gap-space-sm">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <Icon as={Droplet} size="md" />
          </View>
          <View className="min-w-0 flex-1">
            <Text variant="label-sm" className="uppercase text-muted-foreground">
              Soundscape
            </Text>
            <Text variant="body-md" className="font-geist-medium" numberOfLines={1}>
              Rain & White Noise
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
