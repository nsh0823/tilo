import type { NativeStackNavigationOptions } from 'expo-router/native-stack';
import { useCSSVariable } from 'uniwind';

/**
 * Native-stack header options in Kanso tokens. Headers and back buttons stay native
 * (docs/DESIGN.md › Native Navigation); only colors and fonts are themed.
 */
export function useNativeHeaderOptions(): NativeStackNavigationOptions {
  const [background, foreground, primary] = useCSSVariable([
    '--color-background',
    '--color-foreground',
    '--color-primary',
  ]) as string[];

  return {
    headerShadowVisible: false,
    headerStyle: { backgroundColor: background },
    headerTintColor: primary,
    headerTitleStyle: { fontFamily: 'Geist_500Medium', color: foreground },
    headerBackButtonDisplayMode: 'minimal',
    contentStyle: { backgroundColor: background },
  };
}
