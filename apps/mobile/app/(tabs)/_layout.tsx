import { NativeTabs } from 'expo-router/native-tabs';
import { useCSSVariable } from 'uniwind';

// Native tab bar (UITabBar / Material bottom navigation), tinted with Kanso tokens:
// active items in primary, inactive in the muted silver, no badges.
export default function TabsLayout() {
  const [primary, subtle, background] = useCSSVariable([
    '--color-primary',
    '--color-subtle',
    '--color-background',
  ]) as string[];

  return (
    <NativeTabs
      tintColor={primary}
      iconColor={{ default: subtle, selected: primary }}
      labelStyle={{
        default: { fontFamily: 'Geist_500Medium', color: subtle },
        selected: { fontFamily: 'Geist_500Medium', color: primary },
      }}
      backgroundColor={background}
    >
      <NativeTabs.Trigger name="(tasks)">
        <NativeTabs.Trigger.Label>Tasks</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'checkmark.circle', selected: 'checkmark.circle.fill' }}
          md="check_circle"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="intervals">
        <NativeTabs.Trigger.Label>Intervals</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="timer" md="timelapse" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="focus">
        <NativeTabs.Trigger.Label>Focus</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="scope" md="center_focus_strong" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
