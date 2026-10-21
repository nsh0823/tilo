import { tva, isWeb } from '@gluestack-ui/utils/nativewind-utils';

const baseStyle = isWeb
  ? 'font-sans tracking-sm my-0 bg-transparent border-0 box-border display-inline list-none margin-0 padding-0 position-relative text-start no-underline whitespace-pre-wrap word-wrap-break-word'
  : '';

// Kanso Monochrome type scale (docs/DESIGN.md). Tracking is in px because Uniwind resolves
// `em` against the root font size, not the element's. Weight is picked by font family.
export const typography = {
  'display-xl': 'font-geist-light text-[56px] leading-[64px] tracking-[-2.24px]',
  'display-xl-mobile': 'font-geist-light text-[40px] leading-[48px] tracking-[-1.2px]',
  'headline-lg': 'font-geist-medium text-[32px] leading-[40px] tracking-[-0.8px]',
  'headline-lg-mobile': 'font-geist-medium text-[26px] leading-[32px] tracking-[-0.52px]',
  'headline-md': 'font-geist-medium text-[20px] leading-[28px] tracking-[-0.3px]',
  'headline-sm': 'font-geist-semibold text-[16px] leading-[24px] tracking-[-0.16px]',
  'body-lg': 'font-geist text-[16px] leading-[24px] tracking-[-0.16px]',
  'body-md': 'font-geist text-[14px] leading-[20px] tracking-[0px]',
  'body-sm': 'font-geist text-[12px] leading-[16px] tracking-[0.12px]',
  'label-md': 'font-geist-medium text-[13px] leading-[16px] tracking-[0.13px]',
  'label-sm': 'font-geist-medium text-[11px] leading-[14px] tracking-[0.44px]',
  'timer-display': 'font-geist-light text-[72px] leading-[80px] tracking-[-2.88px] tabular-nums',
  'timer-display-mobile':
    'font-geist-light text-[56px] leading-[64px] tracking-[-1.68px] tabular-nums',
} as const;

export type TypographyVariant = keyof typeof typography;

export const textStyle = tva({
  base: `text-foreground font-body ${baseStyle}`,

  variants: {
    isTruncated: {
      true: 'web:truncate',
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
    size: {
      '2xs': 'text-2xs',
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    },
    // Declared after `size` so a type role overrides the default size.
    variant: typography,
    sub: {
      true: 'text-xs',
    },
    italic: {
      true: 'italic',
    },
    highlight: {
      true: 'bg-yellow-500',
    },
  },
});
