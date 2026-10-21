'use client';
import { typography } from '../text/styles';
import { createCheckbox } from '@gluestack-ui/core/checkbox/creator';
import { UIIcon } from '@gluestack-ui/core/icon/creator';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { tva, withStyleContext } from '@gluestack-ui/utils/nativewind-utils';
import { withUniwind } from 'uniwind';
import React from 'react';
import type { TextProps, ViewProps } from 'react-native';
import { Platform, Pressable, Text, View } from 'react-native';

const IndicatorWrapper = React.forwardRef<React.ComponentRef<typeof View>, ViewProps>(
  function IndicatorWrapper({ ...props }, ref) {
    return <View {...props} ref={ref} />;
  },
);

const LabelWrapper = React.forwardRef<React.ComponentRef<typeof Text>, TextProps>(
  function LabelWrapper({ ...props }, ref) {
    return <Text {...props} ref={ref} />;
  },
);

const StyledUIIcon = withUniwind(UIIcon);

function IconWrapper(props: React.ComponentPropsWithoutRef<typeof StyledUIIcon>) {
  return <StyledUIIcon {...props} />;
}

const SCOPE = 'CHECKBOX';

const UICheckbox = createCheckbox({
  // @ts-expect-error : internal implementation for r-19/react-native-web
  Root: Platform.OS === 'web' ? withStyleContext(View, SCOPE) : withStyleContext(Pressable, SCOPE),
  Group: View,
  Icon: IconWrapper,
  Label: LabelWrapper,
  Indicator: IndicatorWrapper,
});

const checkboxStyle = tva({
  base: 'group/checkbox flex-row items-center justify-start gap-4 web:cursor-pointer data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
});

const checkboxIndicatorStyle = tva({
  base: 'justify-center items-center w-[22px] h-[22px] shrink-0 rounded-full border-[1.5px] border-subtle bg-transparent web:outline-none web:data-[focus-visible=true]:ring-2 web:data-[focus-visible=true]:ring-ring data-[hover=true]:border-primary data-[active=true]:border-primary data-[checked=true]:bg-primary data-[checked=true]:border-primary data-[invalid=true]:border-destructive data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
});

const checkboxLabelStyle = tva({
  base: `text-foreground web:select-none web:cursor-pointer data-[checked=true]:line-through data-[checked=true]:text-muted-foreground data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 ${typography['body-md']}`,
});

const checkboxIconStyle = tva({
  base: 'text-primary-foreground fill-none h-[14px] w-[14px]',
});

const CheckboxGroup = UICheckbox.Group;

type ICheckboxProps = React.ComponentPropsWithoutRef<typeof UICheckbox> &
  VariantProps<typeof checkboxStyle>;

const Checkbox = React.forwardRef<React.ComponentRef<typeof UICheckbox>, ICheckboxProps>(
  function Checkbox({ className, ...props }, ref) {
    return (
      <UICheckbox
        className={checkboxStyle({ class: className })}
        {...props}
        context={{}}
        ref={ref}
      />
    );
  },
);

type ICheckboxIndicatorProps = React.ComponentPropsWithoutRef<typeof UICheckbox.Indicator> &
  VariantProps<typeof checkboxIndicatorStyle>;

const CheckboxIndicator = React.forwardRef<
  React.ComponentRef<typeof UICheckbox.Indicator>,
  ICheckboxIndicatorProps
>(function CheckboxIndicator({ className, ...props }, ref) {
  return (
    <UICheckbox.Indicator
      className={checkboxIndicatorStyle({ class: className })}
      {...props}
      ref={ref}
    />
  );
});

type ICheckboxLabelProps = React.ComponentPropsWithoutRef<typeof UICheckbox.Label> &
  VariantProps<typeof checkboxLabelStyle>;
const CheckboxLabel = React.forwardRef<
  React.ComponentRef<typeof UICheckbox.Label>,
  ICheckboxLabelProps
>(function CheckboxLabel({ className, ...props }, ref) {
  return (
    <UICheckbox.Label className={checkboxLabelStyle({ class: className })} {...props} ref={ref} />
  );
});

type ICheckboxIconProps = React.ComponentPropsWithoutRef<typeof UICheckbox.Icon> &
  VariantProps<typeof checkboxIconStyle>;

const CheckboxIcon = React.forwardRef<
  React.ComponentRef<typeof UICheckbox.Icon>,
  ICheckboxIconProps
>(function CheckboxIcon({ className, ...props }, ref) {
  return (
    <UICheckbox.Icon {...props} className={checkboxIconStyle({ class: className })} ref={ref} />
  );
});

Checkbox.displayName = 'Checkbox';
CheckboxIndicator.displayName = 'CheckboxIndicator';
CheckboxLabel.displayName = 'CheckboxLabel';
CheckboxIcon.displayName = 'CheckboxIcon';

export { Checkbox, CheckboxGroup, CheckboxIcon, CheckboxIndicator, CheckboxLabel };
