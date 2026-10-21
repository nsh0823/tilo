'use client';
import { createButton } from '@gluestack-ui/core/button/creator';
import { UIIcon } from '@gluestack-ui/core/icon/creator';
import {
  tva,
  useStyleContext,
  withStyleContext,
  type VariantProps,
} from '@gluestack-ui/utils/nativewind-utils';
import { withUniwind } from 'uniwind';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { typography } from '../text/styles';
const SCOPE = 'BUTTON';
const Root = withStyleContext(Pressable, SCOPE);
const StyledUIIcon = withUniwind(UIIcon);
const UIButton = createButton({
  Root: Root,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: StyledUIIcon,
});
// Kanso pills (docs/DESIGN.md): primary is a solid pill that dims on press,
// secondary is a tonal pill that darkens on press. No borders or shadows.
const buttonStyle = tva({
  base: 'rounded-full flex-row items-center justify-center data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[focus-visible=true]:web:ring-ring data-[disabled=true]:opacity-40 gap-1.5',
  variants: {
    variant: {
      default: 'bg-primary data-[active=true]:opacity-80 data-[hover=true]:opacity-90',
      secondary: 'bg-secondary data-[active=true]:bg-accent data-[hover=true]:bg-accent',
      outline: 'border border-border bg-transparent data-[active=true]:bg-secondary',
      ghost: 'bg-transparent data-[active=true]:bg-secondary data-[hover=true]:bg-secondary',
      destructive: 'bg-destructive data-[active=true]:opacity-80',
      link: 'data-[hover=true]:underline data-[active=true]:underline',
    },
    size: {
      default: 'h-12 px-6',
      sm: 'h-9 px-4',
      lg: 'h-14 px-6',
      icon: 'h-8 w-8',
      'icon-lg': 'h-12 w-12',
    },
  },
});
const buttonTextStyle = tva({
  base: 'web:select-none',
  parentVariants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      outline: 'text-foreground',
      ghost: 'text-muted-foreground',
      destructive: 'text-white',
      link: 'text-foreground',
    },
    size: {
      default: typography['headline-sm'],
      sm: typography['label-md'],
      lg: typography['headline-sm'],
      icon: typography['label-md'],
      'icon-lg': typography['label-md'],
    },
  },
});

const buttonSpinnerStyle = tva({
  base: '',
  parentVariants: {
    size: {
      default: 'h-4 w-4',
      sm: 'h-3 w-3',
      lg: 'h-5 w-5',
      icon: 'h-4 w-4',
      'icon-lg': 'h-5 w-5',
    },
  },
});

const buttonIconStyle = tva({
  base: 'fill-none pointer-events-none shrink-0',
  parentVariants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      outline: 'text-foreground',
      ghost: 'text-muted-foreground',
      destructive: 'text-white',
      link: 'text-foreground',
    },
    size: {
      default: 'h-5 w-5',
      sm: 'h-4 w-4',
      lg: 'h-5 w-5',
      icon: 'h-4 w-4',
      'icon-lg': 'h-5 w-5',
    },
  },
});
const buttonGroupStyle = tva({
  base: '',
  variants: {
    space: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-5',
      '2xl': 'gap-6',
      '3xl': 'gap-7',
      '4xl': 'gap-8',
    },
    isAttached: {
      true: 'gap-0',
    },
    flexDirection: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    },
  },
});
type IButtonProps = Omit<React.ComponentPropsWithoutRef<typeof UIButton>, 'context'> &
  VariantProps<typeof buttonStyle> & { className?: string };
const Button = React.forwardRef<React.ElementRef<typeof UIButton>, IButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <UIButton
        ref={ref}
        {...props}
        className={buttonStyle({ variant, size, class: className })}
        context={{ variant, size }}
      />
    );
  },
);
type IButtonTextProps = React.ComponentPropsWithoutRef<typeof UIButton.Text> &
  VariantProps<typeof buttonTextStyle> & { className?: string };
const ButtonText = React.forwardRef<React.ElementRef<typeof UIButton.Text>, IButtonTextProps>(
  ({ className, size, ...props }, ref) => {
    const { size: parentSize, variant: parentVariant } = useStyleContext(SCOPE);
    return (
      <UIButton.Text
        ref={ref}
        {...props}
        className={buttonTextStyle({
          parentVariants: {
            size: parentSize,
            variant: parentVariant,
          },
          size,
          class: className,
        })}
      />
    );
  },
);
const ButtonSpinner = React.forwardRef<
  React.ElementRef<typeof UIButton.Spinner>,
  React.ComponentPropsWithoutRef<typeof UIButton.Spinner>
>(({ className, ...props }, ref) => {
  const { size: parentSize } = useStyleContext(SCOPE);
  return (
    <UIButton.Spinner
      ref={ref}
      {...props}
      className={buttonSpinnerStyle({ parentVariants: { size: parentSize }, class: className })}
    />
  );
});
type IButtonIcon = React.ComponentPropsWithoutRef<typeof UIButton.Icon> &
  VariantProps<typeof buttonIconStyle> & {
    className?: string | undefined;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };
const ButtonIcon = React.forwardRef<React.ElementRef<typeof UIButton.Icon>, IButtonIcon>(
  ({ className, size, ...props }, ref) => {
    const { size: parentSize, variant: parentVariant } = useStyleContext(SCOPE);
    if (typeof size === 'number') {
      return (
        <UIButton.Icon
          ref={ref}
          {...props}
          className={buttonIconStyle({ class: className })}
          size={size}
        />
      );
    } else if ((props.height !== undefined || props.width !== undefined) && size === undefined) {
      return (
        <UIButton.Icon ref={ref} {...props} className={buttonIconStyle({ class: className })} />
      );
    }
    return (
      <UIButton.Icon
        {...props}
        className={buttonIconStyle({
          parentVariants: {
            size: parentSize,
            variant: parentVariant,
          },
          size,
          class: className,
        })}
        ref={ref}
      />
    );
  },
);
type IButtonGroupProps = React.ComponentPropsWithoutRef<typeof UIButton.Group> &
  VariantProps<typeof buttonGroupStyle>;
const ButtonGroup = React.forwardRef<React.ElementRef<typeof UIButton.Group>, IButtonGroupProps>(
  ({ className, space = 'md', isAttached = false, flexDirection = 'column', ...props }, ref) => {
    return (
      <UIButton.Group
        className={buttonGroupStyle({
          class: className,
          space,
          isAttached,
          flexDirection,
        })}
        {...props}
        ref={ref}
      />
    );
  },
);
Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonSpinner.displayName = 'ButtonSpinner';
ButtonIcon.displayName = 'ButtonIcon';
ButtonGroup.displayName = 'ButtonGroup';
export { Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText };
