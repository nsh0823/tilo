'use client';
import { typography } from '../text/styles';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/core/icon/creator';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { tva, useStyleContext, withStyleContext } from '@gluestack-ui/utils/nativewind-utils';
import { withUniwind } from 'uniwind';
import React from 'react';
import { Text, View } from 'react-native';
import { Svg } from 'react-native-svg';

const SCOPE = 'BADGE';

const badgeStyle = tva({
  base: 'flex-row items-center justify-center gap-0.5 rounded-full px-1.5 py-0.5',
  variants: {
    variant: {
      default: 'bg-primary',
      secondary: 'bg-secondary',
      muted: 'bg-muted',
      destructive: 'bg-destructive dark:bg-destructive/60',
      outline: 'border border-border dark:border-border/90 bg-transparent',
    },
  },
});

const badgeTextStyle = tva({
  base: typography['label-sm'],
  parentVariants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-muted-foreground',
      muted: 'text-foreground',
      destructive: 'text-white',
      outline: 'text-foreground',
    },
  },
});

const badgeIconStyle = tva({
  base: 'fill-none h-3 w-3 pointer-events-none',
  parentVariants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-muted-foreground',
      muted: 'text-foreground',
      destructive: 'text-white',
      outline: 'text-foreground',
    },
  },
});

const ContextView = withStyleContext(View, SCOPE);

type IBadgeProps = React.ComponentPropsWithoutRef<typeof ContextView> &
  VariantProps<typeof badgeStyle>;
function Badge({
  children,
  variant = 'default',
  className,
  ...props
}: { className?: string } & IBadgeProps) {
  return (
    <ContextView
      className={badgeStyle({ variant, class: className })}
      {...props}
      context={{ variant }}
    >
      {children}
    </ContextView>
  );
}

type IBadgeTextProps = React.ComponentPropsWithoutRef<typeof Text> &
  VariantProps<typeof badgeTextStyle>;

const BadgeText = React.forwardRef<React.ComponentRef<typeof Text>, IBadgeTextProps>(
  function BadgeText({ children, className, ...props }, ref) {
    const { variant: parentVariant } = useStyleContext(SCOPE);
    return (
      <Text
        ref={ref}
        className={badgeTextStyle({
          parentVariants: {
            variant: parentVariant,
          },
          class: className,
        })}
        {...props}
      >
        {children}
      </Text>
    );
  },
);

type IBadgeIconProps = React.ComponentPropsWithoutRef<typeof PrimitiveIcon> &
  VariantProps<typeof badgeIconStyle> & {
    size?: number;
  };

const StyledUIIcon = withUniwind(UIIcon);

const BadgeIcon = React.forwardRef<React.ComponentRef<typeof Svg>, IBadgeIconProps>(
  function BadgeIcon({ className, size, ...props }, ref) {
    const { variant: parentVariant } = useStyleContext(SCOPE);

    if (typeof size === 'number') {
      return (
        <StyledUIIcon
          ref={ref}
          {...props}
          className={badgeIconStyle({ class: className })}
          size={size}
        />
      );
    } else if ((props?.height !== undefined || props?.width !== undefined) && size === undefined) {
      return <StyledUIIcon ref={ref} {...props} className={badgeIconStyle({ class: className })} />;
    }
    return (
      <StyledUIIcon
        className={badgeIconStyle({
          parentVariants: {
            variant: parentVariant,
          },
          class: className,
        })}
        {...props}
        ref={ref}
      />
    );
  },
);

Badge.displayName = 'Badge';
BadgeText.displayName = 'BadgeText';
BadgeIcon.displayName = 'BadgeIcon';

export { Badge, BadgeIcon, BadgeText };
