'use client';
import { typography } from '../text/styles';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { UIIcon } from '@gluestack-ui/core/icon/creator';
import {
  tva,
  useStyleContext,
  withStyleContext,
  type VariantProps,
} from '@gluestack-ui/utils/nativewind-utils';
import { withUniwind } from 'uniwind';

const SCOPE = 'CHIP';

const Root = withStyleContext(Pressable, SCOPE);
const StyledUIIcon = withUniwind(UIIcon);

// Kanso chips: `sm` is the quick-action pill (Due, Priority, …); `tile` is the selectable
// option block used in option grids (cue frequency, audio cue). Selected = solid primary.
const chipStyle = tva({
  base: 'flex-row items-center web:outline-none data-[disabled=true]:opacity-40',
  variants: {
    size: {
      sm: 'gap-1 rounded-full px-2.5 py-1',
      tile: 'min-h-10 gap-2 rounded-md px-3 py-2.5',
    },
    isSelected: {
      true: 'bg-primary',
      false: 'bg-secondary data-[active=true]:bg-accent',
    },
  },
});

const chipTextStyle = tva({
  base: '',
  parentVariants: {
    size: {
      sm: typography['label-sm'],
      tile: typography['label-md'],
    },
    isSelected: {
      true: 'text-primary-foreground',
      false: 'text-muted-foreground',
    },
  },
});

const chipIconStyle = tva({
  base: 'fill-none pointer-events-none shrink-0',
  parentVariants: {
    size: {
      sm: 'h-[13px] w-[13px]',
      tile: 'h-4 w-4',
    },
    isSelected: {
      true: 'text-primary-foreground',
      false: 'text-muted-foreground',
    },
  },
});

type IChipProps = Omit<React.ComponentPropsWithoutRef<typeof Root>, 'context'> &
  VariantProps<typeof chipStyle> & { className?: string };

const Chip = React.forwardRef<React.ComponentRef<typeof Root>, IChipProps>(function Chip(
  { className, size = 'sm', isSelected = false, ...props },
  ref,
) {
  return (
    <Root
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ selected: !!isSelected, disabled: !!props.disabled }}
      {...props}
      className={chipStyle({ size, isSelected, class: className })}
      context={{ size, isSelected }}
    />
  );
});

type IChipTextProps = React.ComponentPropsWithoutRef<typeof Text> & { className?: string };

const ChipText = React.forwardRef<React.ComponentRef<typeof Text>, IChipTextProps>(
  function ChipText({ className, ...props }, ref) {
    const { size, isSelected } = useStyleContext(SCOPE);
    return (
      <Text
        ref={ref}
        {...props}
        className={chipTextStyle({ parentVariants: { size, isSelected }, class: className })}
      />
    );
  },
);

type IChipIconProps = React.ComponentPropsWithoutRef<typeof StyledUIIcon> & {
  className?: string;
  as?: React.ElementType;
};

function ChipIcon({ className, ...props }: IChipIconProps) {
  const { size, isSelected } = useStyleContext(SCOPE);
  return (
    <StyledUIIcon
      {...props}
      className={chipIconStyle({ parentVariants: { size, isSelected }, class: className })}
    />
  );
}

Chip.displayName = 'Chip';
ChipText.displayName = 'ChipText';
ChipIcon.displayName = 'ChipIcon';

export { Chip, ChipIcon, ChipText };
