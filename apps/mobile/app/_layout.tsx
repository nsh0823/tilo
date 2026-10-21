import '../global.css';

import {
  Geist_300Light,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  useFonts,
} from '@expo-google-fonts/geist';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useNativeHeaderOptions } from '@/navigation/useNativeHeaderOptions';
import { AppProviders } from '@/providers/AppProviders';

// The MVP is local-first with no account (docs/DECISIONS.md), so the app opens straight into the tabs.
function RootNavigator() {
  const headerOptions = useNativeHeaderOptions();

  return (
    <Stack screenOptions={{ ...headerOptions, headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Geist_300Light,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });
  if (!fontsLoaded) return null;

  return (
    <AppProviders>
      <RootNavigator />
      <StatusBar style="auto" />
    </AppProviders>
  );
}
