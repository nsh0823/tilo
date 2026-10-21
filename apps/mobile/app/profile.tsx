import { Button, ButtonText } from '@tilo/ui/components/button';
import { Card } from '@tilo/ui/components/card';
import { SegmentedControl, SegmentedControlItem } from '@tilo/ui/components/segmented-control';
import { Text } from '@tilo/ui/components/text';
import { ScrollView, View } from 'react-native';

import { useSession, useSignOut } from '@/hooks/useAuth';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';
import { useAppStore, type ColorMode } from '@/store/useAppStore';

const COLOR_MODES: { value: ColorMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function ProfileScreen() {
  const { session } = useSession();
  const profile = useCurrentProfile();
  const signOut = useSignOut();
  const { colorMode, setColorMode } = useAppStore();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-space-lg px-margin-mobile pb-space-xl pt-space-sm"
    >
      <Card>
        <Text variant="label-sm" className="uppercase text-muted-foreground">
          Account
        </Text>
        <View>
          <Text variant="headline-sm">
            {profile.data?.username ?? (profile.isLoading ? 'Loading…' : 'No username set')}
          </Text>
          <Text variant="body-md" className="text-muted-foreground">
            {session?.user.email}
          </Text>
        </View>
      </Card>

      <View className="gap-space-sm">
        <Text variant="label-md" className="uppercase text-muted-foreground">
          Appearance
        </Text>
        <SegmentedControl
          value={colorMode}
          onValueChange={(mode) => setColorMode(mode as ColorMode)}
          size="lg"
          className="self-stretch"
        >
          {COLOR_MODES.map(({ value, label }) => (
            <SegmentedControlItem key={value} value={value} className="flex-1">
              {label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </View>

      <Button variant="secondary" onPress={() => signOut.mutate()}>
        <ButtonText className="text-destructive">Sign Out</ButtonText>
      </Button>
    </ScrollView>
  );
}
