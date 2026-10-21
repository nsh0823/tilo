import { tva, isWeb } from '@gluestack-ui/utils/nativewind-utils';

import { typography } from '../text/styles';

const baseStyle = isWeb
  ? 'font-sans tracking-sm bg-transparent border-0 box-border display-inline list-none margin-0 padding-0 position-relative text-start no-underline whitespace-pre-wrap word-wrap-break-word'
  : '';

export const headingStyle = tva({
  base: `text-foreground font-heading my-0 ${baseStyle}`,
  variants: {
    isTruncated: {
      true: 'truncate',
    },
    bold: {
      true: 'font-geist-semibold',
    },
    underline: {
      true: 'underline',
    },
    strikeThrough: {
      true: 'line-through',
    },
    sub: {
      true: 'text-xs',
    },
    italic: {
      true: 'italic',
    },
    highlight: {
      true: 'bg-yellow-500',
    },
    // Sizes map onto the Kanso headline/display roles.
    size: {
      '5xl': typography['display-xl'],
      '4xl': typography['display-xl-mobile'],
      '3xl': typography['headline-lg'],
      '2xl': typography['headline-lg-mobile'],
      xl: typography['headline-md'],
      lg: typography['headline-md'],
      md: typography['headline-sm'],
      sm: typography['headline-sm'],
      xs: typography['label-md'],
    },
  },
});
