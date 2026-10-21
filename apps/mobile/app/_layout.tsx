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

import { useSession } from '@/hooks/useAuth';
import { useNativeHeaderOptions } from '@/navigation/useNativeHeaderOptions';
import { AppProviders } from '@/providers/AppProviders';

function RootNavigator() {
  const { session, isLoading } = useSession();
  const headerOptions = useNativeHeaderOptions();
  if (isLoading) return null;

  return (
    <Stack screenOptions={{ ...headerOptions, headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" options={{ headerShown: true, title: 'Profile' }} />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
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
