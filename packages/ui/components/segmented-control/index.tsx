'use client';
import { typography } from '../text/styles';
import React, { createContext, useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import { tva, type VariantProps } from '@gluestack-ui/utils/nativewind-utils';

// Kanso segmented filter (docs/DESIGN.md): tonal pill track; the selected segment is a solid
// primary pill. `md` is the 36px track from the spec, `lg` the 40px preset switcher.
const segmentedControlStyle = tva({
  base: 'flex-row items-center self-start rounded-full bg-secondary p-1 gap-1',
});

const segmentedControlItemStyle = tva({
  base: 'items-center justify-center rounded-full px-space-md web:outline-none data-[disabled=true]:opacity-40',
  variants: {
    size: {
      md: 'h-7',
      lg: 'h-8',
    },
    isSelected: {
      true: 'bg-primary',
      false: 'bg-transparent',
    },
  },
});

const segmentedControlItemTextStyle = tva({
  base: typography['label-md'],
  variants: {
    isSelected: {
      true: 'text-primary-foreground',
      false: 'text-muted-foreground',
    },
  },
});

type Size = NonNullable<VariantProps<typeof segmentedControlItemStyle>['size']>;

type SegmentedControlContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  size: Size;
};

const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

type ISegmentedControlProps = React.ComponentProps<typeof View> & {
  value: string;
  onValueChange: (value: string) => void;
  size?: Size;
  className?: string;
};

const SegmentedControl = React.forwardRef<React.ComponentRef<typeof View>, ISegmentedControlProps>(
  function SegmentedControl({ value, onValueChange, size = 'md', className, ...props }, ref) {
    return (
      <SegmentedControlContext.Provider value={{ value, onValueChange, size }}>
        <View
          ref={ref}
          accessibilityRole="tablist"
          {...props}
          className={segmentedControlStyle({ class: className })}
        />
      </SegmentedControlContext.Provider>
    );
  },
);

type ISegmentedControlItemProps = Omit<React.ComponentProps<typeof Pressable>, 'children'> & {
  value: string;
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
};

const SegmentedControlItem = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  ISegmentedControlItemProps
>(function SegmentedControlItem({ value, children, className, textClassName, ...props }, ref) {
  const context = useContext(SegmentedControlContext);
  if (!context) throw new Error('SegmentedControlItem must be used inside SegmentedControl');

  const isSelected = context.value === value;
  return (
    <Pressable
      ref={ref}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected, disabled: !!props.disabled }}
      onPress={() => context.onValueChange(value)}
      {...props}
      className={segmentedControlItemStyle({ size: context.size, isSelected, class: className })}
    >
      {typeof children === 'string' ? (
        <Text className={segmentedControlItemTextStyle({ isSelected, class: textClassName })}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
});

SegmentedControl.displayName = 'SegmentedControl';
SegmentedControlItem.displayName = 'SegmentedControlItem';

export { SegmentedControl, SegmentedControlItem };
