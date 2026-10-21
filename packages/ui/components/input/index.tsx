'use client';
import React from 'react';
import { createInput } from '@gluestack-ui/core/input/creator';
import { View, Pressable, TextInput } from 'react-native';
import { tva, withStyleContext } from '@gluestack-ui/utils/nativewind-utils';
import { withUniwind } from 'uniwind';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { UIIcon } from '@gluestack-ui/core/icon/creator';

import { typography } from '../text/styles';

const SCOPE = 'INPUT';

const StyledUIIcon = withUniwind(UIIcon);

const UIInput = createInput({
  Root: withStyleContext(View, SCOPE),
  Icon: StyledUIIcon,
  Slot: Pressable,
  Input: TextInput,
});

// Kanso inputs (docs/DESIGN.md): underline by default, hairline turning to primary on focus.
// `filled` is the tonal field used inside sheets; `unstyled` sits inside custom containers.
const inputStyle = tva({
  base: 'w-full flex-row items-center gap-2 overflow-hidden data-[focus=true]:outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
  variants: {
    variant: {
      underlined:
        'min-h-11 border-b border-border data-[focus=true]:border-primary data-[invalid=true]:border-destructive',
      filled:
        'min-h-11 rounded-md bg-secondary px-4 data-[invalid=true]:border data-[invalid=true]:border-destructive',
      unstyled: '',
    },
  },
});

const inputIconStyle = tva({
  base: 'justify-center items-center text-muted-foreground fill-none h-4 w-4',
});

const inputSlotStyle = tva({
  base: 'justify-center items-center web:disabled:cursor-not-allowed',
});

const inputFieldStyle = tva({
  base: `flex-1 h-full py-2 text-foreground placeholder:text-subtle web:outline-none web:cursor-text web:data-[disabled=true]:cursor-not-allowed ${typography['body-md']}`,
});

type IInputProps = React.ComponentProps<typeof UIInput> &
  VariantProps<typeof inputStyle> & { className?: string };
const Input = React.forwardRef<React.ComponentRef<typeof UIInput>, IInputProps>(function Input(
  { className, variant = 'underlined', ...props },
  ref,
) {
  return (
    <UIInput
      ref={ref}
      {...props}
      className={inputStyle({ variant, class: className })}
      context={{ variant }}
    />
  );
});

type IInputIconProps = React.ComponentProps<typeof UIInput.Icon> &
  VariantProps<typeof inputIconStyle> & {
    className?: string;
    height?: number;
    width?: number;
  };

const InputIcon = React.forwardRef<React.ComponentRef<typeof UIInput.Icon>, IInputIconProps>(
  function InputIcon({ className, ...props }, ref) {
    return <UIInput.Icon ref={ref} {...props} className={inputIconStyle({ class: className })} />;
  },
);

type IInputSlotProps = React.ComponentProps<typeof UIInput.Slot> &
  VariantProps<typeof inputSlotStyle> & { className?: string };

const InputSlot = React.forwardRef<React.ComponentRef<typeof UIInput.Slot>, IInputSlotProps>(
  function InputSlot({ className, ...props }, ref) {
    return (
      <UIInput.Slot
        ref={ref}
        {...props}
        className={inputSlotStyle({
          class: className,
        })}
      />
    );
  },
);

type IInputFieldProps = React.ComponentProps<typeof UIInput.Input> &
  VariantProps<typeof inputFieldStyle> & { className?: string };

const InputField = React.forwardRef<React.ComponentRef<typeof UIInput.Input>, IInputFieldProps>(
  function InputField({ className, ...props }, ref) {
    return (
      <UIInput.Input
        ref={ref}
        {...props}
        className={inputFieldStyle({
          class: className,
        })}
      />
    );
  },
);

Input.displayName = 'Input';
InputIcon.displayName = 'InputIcon';
InputSlot.displayName = 'InputSlot';
InputField.displayName = 'InputField';

export { Input, InputField, InputIcon, InputSlot };
