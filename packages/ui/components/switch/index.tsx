'use client';
import React from 'react';
import { Switch as RNSwitch } from 'react-native';
import { createSwitch } from '@gluestack-ui/core/switch/creator';
import { withStyleContext } from '@gluestack-ui/utils/nativewind-utils';
import { useCSSVariable } from 'uniwind';

const UISwitch = createSwitch({
  Root: withStyleContext(RNSwitch),
});

// The platform switch stays native; only its colors come from the Kanso tokens
// (on: primary track, off: accent track, card-colored thumb).
type ISwitchProps = React.ComponentProps<typeof UISwitch>;
const Switch = React.forwardRef<React.ComponentRef<typeof UISwitch>, ISwitchProps>(
  function Switch(props, ref) {
    const [primary, accent, card] = useCSSVariable([
      '--color-primary',
      '--color-accent',
      '--color-card',
    ]) as string[];
    return (
      <UISwitch
        ref={ref}
        trackColor={{ true: primary, false: accent }}
        thumbColor={card}
        ios_backgroundColor={accent}
        {...props}
      />
    );
  },
);

Switch.displayName = 'Switch';
export { Switch };
