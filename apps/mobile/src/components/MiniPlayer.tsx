import { Icon } from '@tilo/ui/components/icon';
import { Text } from '@tilo/ui/components/text';
import { AudioLines, Pause, Play } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

/**
 * Ambient-sound mini-player. Rendered as the native tab bar's bottom accessory, so the
 * platform supplies the container; this is only the row. Playback isn't wired up yet.
 */
export function MiniPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <View className="h-full flex-row items-center justify-between gap-space-sm px-space-md">
      <View className="flex-1 flex-row items-center gap-space-sm">
        <Icon as={AudioLines} size="md" className="text-foreground" />
        <View className="flex-1">
          <Text variant="label-md" numberOfLines={1}>
            Deep Solitude
          </Text>
          <Text variant="label-sm" className="text-muted-foreground" numberOfLines={1}>
            Binaural 432Hz
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause ambient sound' : 'Play ambient sound'}
        onPress={() => setIsPlaying((playing) => !playing)}
        className="h-8 w-8 items-center justify-center rounded-full bg-primary active:opacity-80"
      >
        <Icon as={isPlaying ? Pause : Play} size="sm" className="text-primary-foreground" />
      </Pressable>
    </View>
  );
}
