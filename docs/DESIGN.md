---
name: Kanso Monochrome
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e3e2e2'
  on-secondary-container: '#646464'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 56px
    fontWeight: '300'
    lineHeight: 64px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '300'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  timer-display:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: '300'
    lineHeight: 80px
    letterSpacing: -0.04em
  timer-display-mobile:
    fontFamily: Geist
    fontSize: 56px
    fontWeight: '300'
    lineHeight: 64px
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies austere Japanese minimalism merged with functional Swiss utility. Built for high-cognitive-load focus environments, the interface strips away all non-essential visual stimulation to induce a state of pristine editorial calm. It targets knowledge workers, writers, architects, and deep-work practitioners who find conventional multi-colored gamified productivity suites distracting and fatiguing.

The visual expression relies exclusively on pure monochrome balance, meticulous spatial cadence, hairline boundaries, and rigorous micro-typographic hierarchy. There are no vibrant accent colors, gradients, decorative illustrations, or skeuomorphic shadows. Every interaction feels deliberate, tactile, and silent—treating empty space not as absence, but as an active structural frame for the user's intent.

## Colors

The palette is strictly achromatic, leveraging light values to distinguish actionable components from passive structural foundations:

- **Canvas & Base**: Pure White (`#FFFFFF`) serves as the primary canvas to maximize clarity and physical sheet metaphor.
- **Subtle Surfaces**: Soft Alabaster (`#F5F5F5`) provides tonal separation for segmented chip tracks, card backings, and audio player surfaces without producing visual weight.
- **Structural Dividers**: Hairline Slate (`#E5E5E5`) delineates lists and contextual groups with hairline precision.
- **Primary Typography & Dominant Actions**: Near-Black (`#111111`) commands high-contrast attention for primary copy, icons, and filled pill buttons.
- **Secondary Typography & Metadata**: Medium Neutral (`#777777`) offers soft contrast for contextual timestamps, descriptions, and passive metadata.
- **Disabled & Inactive Elements**: Muted Silver (`#BDBDBD`) marks unselected icons, trailing chevrons, and unfulfilled states.

## Typography

Typography relies entirely on **Geist**, prioritizing geometric discipline and neutral character shapes.

- **Tabular Figures**: Timers, stopwatches, audio duration timestamps, and sequence counters must enable OpenType tabular numbers (`font-variant-numeric: tabular-nums; tnum`) to avoid layout jitter during time-tracking loops.
- **Large Scales**: Display and timer typography use a light (`300`) weight to maintain an airy, unhurried demeanor despite massive physical dimensions.
- **Optical Tracking**: Tight negative tracking is enforced on headings and display values to bind glyphs cohesively, while small labels receive subtle positive tracking (`+0.01em` to `+0.04em`) to ensure instant legibility against muted tones.

## Layout & Spacing

The layout employs a single-column, content-first fluid flow for handheld viewports, scaling up to a 4-column restrained grid on tablets (max width 640px) to prevent over-extension of line lengths:

- **Screen Boundaries**: Mobile screens preserve a strict `1.25rem` (20px) horizontal safe canvas padding. Tablets expand margins dynamically while anchoring primary productivity streams centered on the viewport.
- **Vertical Hierarchy**: Spacing scales on a strict 4px/8px modular cadence. Inter-component boundaries favor ample breathing room (`space-lg` to `space-xl`) between distinct functional domains, juxtaposed against dense micro-spacing (`space-xs` to `space-sm`) inside interactive units.
- **Safe Area Anchors**: Bottom navigation and sticky floating items must respect native device home indicators with exact padding increments, isolating the floating audio mini-player precisely `0.5rem` above the tab bar.

## Elevation & Depth

Visual hierarchy rejects drop shadows, blurs, and pseudo-skeuomorphic depth entirely. Elevation is created through layered tonal contrast and sharp hairline boundaries:

- **Surface Tiers**:
  - `Level 0 (Canvas)`: Pure White (`#FFFFFF`).
  - `Level 1 (Subtle Containers & Groupings)`: Alabaster (`#F5F5F5`).
  - `Level 2 (Inverted Action Surfaces)`: Near-Black (`#111111`).
- **Low-Contrast Outlines**: Cards, list sections, and dialogs are bound by a 1px solid hairline (`#E5E5E5`). No directional light sources or diffuse drop shadows are permitted.
- **Floating Overlays**: Floating chrome (such as the persistent bottom navigation and audio mini-player) renders over a pure white backing bounded by a crisp top hairline border (`#E5E5E5`), rejecting background blurs in favor of distinct opaque separation.

## Shapes

The geometric architecture uses two defined radii:

- **Structural Containers (`rounded-lg`, 14px–16px)**: Applied uniformly to task cards, surface groups, time setting modules, and bottom sheet containers. This creates a soft, modern silhouette that remains orderly in vertical stacks.
- **Interactive Controls (Full Pill, `9999px`)**: Applied strictly to action buttons, chip filters, playback pills, segmented switch selectors, and search inputs.
- **Iconography Geometry**: All system icons adopt a fixed 1.5px stroke width with rounded caps and joins, built within a 20px or 24px square bounding box. Fills are forbidden unless indicating an active toggle.

## Components

### Buttons & Chips

- **Primary Pill**: Background `#111111`, text `#FFFFFF`, full pill radius (`9999px`), height 48px, horizontal padding `1.5rem`. No border. Tap state gently drops opacity to `0.8`.
- **Secondary Pill**: Background `#F5F5F5`, text `#111111`, full pill radius, height 48px. Tap state shifts background to `#E5E5E5`.
- **Segmented Filter Chips**: Track background `#F5F5F5`, radius `9999px`, height 36px. Unselected item text `#777777`. Selected item receives solid `#111111` pill fill with `#FFFFFF` text.

### Circular Task Checkboxes

- **Unchecked**: 22px diameter circle with 1.5px border `#BDBDBD`, background transparent. Hover or tap down shifts border to `#111111`.
- **Checked**: 22px diameter circle filled with solid `#111111`. Inside the circle, an ultra-crisp white check icon (1.5px stroke) appears centered, accompanying an immediate strikethrough and `#777777` color transition on the adjacent task label.

### Lists & Input Fields

- **Task List Rows**: Height min 56px, separated by 1px hairline border `#E5E5E5`. No chevron indicators unless navigating to a nested child screen.
- **Text Inputs**: Minimalist borderless or underline styling. Active input field features a 1px bottom border transition from `#E5E5E5` to `#111111`. Placeholder text set in `#BDBDBD`.

### Audio Mini-Player (Ambient Sounds)

- **Positioning**: Pinned persistently `0.5rem` above the bottom tab navigation bar, inset `1.25rem` from canvas edges.
- **Form**: 14px border radius, background `#F5F5F5`, 1px border `#E5E5E5`, height 54px, flex layout.
- **Contents**: Left: Sound wave icon (1.5px stroke) and sound title (e.g., "White Noise", "Rainfall") set in `label-md`. Right: Compact play/pause toggle in a 32px solid `#111111` pill with pure white glyph.

### Native Navigation

All navigation chrome is rendered by the platform, never rebuilt from custom views:

- **Stacks**: Use native stack navigators (Expo Router `Stack`, backed by `react-native-screens`) so push/pop transitions, swipe-back gestures, and modal presentations match the OS.
- **Headers & Back Buttons**: Use the native header and its built-in back button. Do not hide the header to draw a custom back arrow or title bar; customize only through native header options (title, tint color, large title, header buttons).
- **Bottom Tabs**: Use native tabs (Expo Router `NativeTabs`) so the tab bar renders as a `UITabBar` on iOS and a Material bottom navigation bar on Android.
- **Styling Scope**: Apply this system's tokens only through the options the native components expose (tint, label, and icon colors; fonts where supported). Where a platform convention conflicts with a spec in this document (heights, borders, blur, transitions), the platform wins.

### Bottom Navigation Bar

- **Form**: Rendered natively (see **Native Navigation**) and anchored to the screen bottom; height and safe-area handling follow the platform. Where the platform allows, use a `#FFFFFF` background with a 1px `#E5E5E5` top edge.
- **Destinations**: 4 fixed items: **Tasks**, **Timer**, **Sounds**, **Activity**.
- **Item States**: Active item displays 1.5px outlined icon in `#111111` with `label-sm` label below. Inactive items display identical icons and text in `#BDBDBD`. Zero badges or bright indicator dots; active status is revealed purely through high-contrast tone.
