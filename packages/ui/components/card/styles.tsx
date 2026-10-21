import { tva, isWeb } from '@gluestack-ui/utils/nativewind-utils';
const baseStyle = isWeb ? 'flex flex-col relative z-0' : '';

export const cardStyle = tva({
  base: `${baseStyle} flex-col bg-card border border-border rounded-lg`,
  variants: {
    size: {
      default: 'p-space-md gap-space-sm',
      lg: 'p-space-lg gap-space-md',
      sm: 'p-3 gap-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
