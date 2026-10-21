import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetScrollView,
} from '@tilo/ui/components/actionsheet';
import { Card } from '@tilo/ui/components/card';
import { Icon } from '@tilo/ui/components/icon';
import { Text } from '@tilo/ui/components/text';
import { Check, ChevronRight, Music, VolumeX } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { FOCUS_SOUNDS, SOUND_CATEGORY_LABEL, findFocusSound } from '@/audio/soundCatalog';

type SoundPickerProps = {
  /** Selected sound id; null means no music. */
  value: string | null;
  onChange: (id: string | null) => void;
};

const OPTIONS = [
  { id: null, title: 'No music', detail: 'Timer runs silently' },
  ...FOCUS_SOUNDS.map((sound) => ({
    id: sound.id,
    title: sound.title,
    detail: SOUND_CATEGORY_LABEL[sound.category],
  })),
];

/** Soundscape card that opens a sheet of the bundled tracks (FOC-07, INT-10). */
export function SoundPicker({ value, onChange }: SoundPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = findFocusSound(value);

  const choose = (id: string | null) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Background music: ${selected?.title ?? 'None'}`}
        accessibilityHint="Opens the list of sounds"
        onPress={() => setIsOpen(true)}
        className="active:opacity-80"
      >
        <Card className="flex-row items-center gap-space-sm">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <Icon as={selected ? Music : VolumeX} size="md" />
          </View>
          <View className="min-w-0 flex-1">
            <Text variant="label-sm" className="uppercase text-muted-foreground">
              Soundscape
            </Text>
            <Text variant="body-md" className="font-geist-medium" numberOfLines={1}>
              {selected?.title ?? 'No music'}
            </Text>
          </View>
          <Icon as={ChevronRight} size="md" className="text-muted-foreground" />
        </Card>
      </Pressable>

      <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <Text variant="label-sm" className="uppercase text-muted-foreground">
            Soundscape
          </Text>
          <ActionsheetScrollView>
            {OPTIONS.map((option) => {
              const isSelected = option.id === (selected?.id ?? null);
              return (
                <ActionsheetItem
                  key={option.id ?? 'none'}
                  onPress={() => choose(option.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  className="min-h-11"
                >
                  <View className="min-w-0 flex-1">
                    <ActionsheetItemText className={isSelected ? 'font-geist-semibold' : undefined}>
                      {option.title}
                    </ActionsheetItemText>
                    <Text variant="body-sm" className="text-muted-foreground">
                      {option.detail}
                    </Text>
                  </View>
                  {isSelected ? <Icon as={Check} size="md" className="text-foreground" /> : null}
                </ActionsheetItem>
              );
            })}
          </ActionsheetScrollView>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
