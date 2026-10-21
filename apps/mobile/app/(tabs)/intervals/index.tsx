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
import { ChevronDown, Minus, Play, Plus, SlidersHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

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

const CUES = ['Beep', 'Voice', 'Haptic'] as const;

export default function IntervalsScreen() {
  const [preset, setPreset] = useState<Preset>('shower');
  const [minutes, setMinutes] = useState<number>(PRESETS.shower.minutes);
  const [frequency, setFrequency] = useState<string>('60');
  const [cue, setCue] = useState<(typeof CUES)[number]>('Beep');
  const [announceRemaining, setAnnounceRemaining] = useState(true);
  const [finalCountdown, setFinalCountdown] = useState(true);

  const setDuration = (value: number) =>
    setMinutes(Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(value))));

  const selectPreset = (value: string) => {
    setPreset(value as Preset);
    setDuration(PRESETS[value as Preset].minutes);
  };

  const frequencyLabel = FREQUENCIES.find((f) => f.value === frequency)?.short;

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

        <Button size="lg" className="mt-1 h-14 w-full max-w-xs flex-col gap-0">
          <View className="flex-row items-center gap-1.5">
            <ButtonIcon as={Play} />
            <ButtonText>{PRESETS[preset].action}</ButtonText>
          </View>
          <Text variant="label-sm" className="font-geist text-primary-muted">
            {minutes} min • {cue} every {frequencyLabel}
          </Text>
        </Button>
      </Card>

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
        </View>

        <View className="gap-2 border-t border-border pt-space-sm">
          <Text variant="headline-sm">Audio Cue</Text>
          <View className="flex-row gap-space-xs">
            {CUES.map((c) => (
              <Chip
                key={c}
                size="tile"
                isSelected={cue === c}
                onPress={() => setCue(c)}
                className="flex-1 justify-center"
              >
                <ChipText className={cue === c ? undefined : 'text-foreground'}>{c}</ChipText>
              </Chip>
            ))}
          </View>
        </View>
      </Card>

      <Card className="p-0">
        <Accordion type="single" isCollapsible>
          <AccordionItem value="preferences">
            <AccordionHeader>
              <AccordionTrigger className="p-space-md">
                {({ isExpanded }: { isExpanded: boolean }) => (
                  <>
                    <View className="flex-row items-center gap-2">
                      <Icon as={SlidersHorizontal} size="md" className="text-muted-foreground" />
                      <AccordionTitleText>More Preferences</AccordionTitleText>
                    </View>
                    <AccordionIcon
                      as={ChevronDown}
                      className={isExpanded ? 'rotate-180' : undefined}
                    />
                  </>
                )}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className="gap-space-md border-t border-border p-space-md">
              <PreferenceRow
                title="Announce remaining time"
                description="Acoustic countdown updates"
                value={announceRemaining}
                onValueChange={setAnnounceRemaining}
              />
              <PreferenceRow
                title="Final-minute countdown"
                description="Rhythmic pulses under 60s"
                value={finalCountdown}
                onValueChange={setFinalCountdown}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </ScrollView>
  );
}

type PreferenceRowProps = {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function PreferenceRow({ title, description, value, onValueChange }: PreferenceRowProps) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <View className="flex-1">
        <Text variant="label-md">{title}</Text>
        <Text variant="body-sm" className="text-muted-foreground">
          {description}
        </Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} accessibilityLabel={title} />
    </View>
  );
}
