import { Text } from '@tilo/ui/components/text';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useCSSVariable } from 'uniwind';

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type TimerRingProps = {
  /** Remaining time in seconds. */
  remaining: number;
  /** Fraction of the session still left, 0–1. */
  progress: number;
  caption: string;
};

function formatClock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Hairline progress ring with tabular timer digits, from the Stitch Focus screen. */
export function TimerRing({ remaining, progress, caption }: TimerRingProps) {
  const [track, primary] = useCSSVariable(['--color-accent', '--color-primary']) as string[];

  return (
    <View className="h-64 w-64 items-center justify-center">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
      >
        <Circle cx={50} cy={50} r={RADIUS} fill="none" stroke={track} strokeWidth={1.5} />
        <Circle
          cx={50}
          cy={50}
          r={RADIUS}
          fill="none"
          stroke={primary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
        />
      </Svg>
      <Text
        variant="timer-display-mobile"
        accessibilityLabel={`${formatClock(remaining)} remaining`}
      >
        {formatClock(remaining)}
      </Text>
      <Text
        variant="label-sm"
        className="mt-space-xs uppercase tracking-[1.1px] text-muted-foreground"
      >
        {caption}
      </Text>
    </View>
  );
}
