import { Stack } from 'expo-router';

import { HeaderAvatar } from '@/components/HeaderAvatar';
import { useNativeHeaderOptions } from './useNativeHeaderOptions';

/** Native stack for one tab, so each tab gets the platform header and push/back behavior. */
export function TabStack({ title }: { title: string }) {
  const headerOptions = useNativeHeaderOptions();

  return (
    <Stack screenOptions={{ ...headerOptions, headerRight: () => <HeaderAvatar /> }}>
      <Stack.Screen name="index" options={{ title }} />
    </Stack>
  );
}
