---
name: GlobePay Global Travel & Finance
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#44474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#4e6077'
  primary: '#00050e'
  on-primary: '#ffffff'
  primary-container: '#0b1f33'
  on-primary-container: '#7587a0'
  inverse-primary: '#b5c8e3'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000601'
  on-tertiary: '#ffffff'
  tertiary-container: '#00240a'
  on-tertiary-container: '#009a43'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#b5c8e3'
  on-primary-fixed: '#081d30'
  on-primary-fixed-variant: '#36485e'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  disclaimer-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The design system is rooted in **Premium Minimalism**, blending the precision of high-end fintech with the clarity required for international travel. The aesthetic prioritizes "Apple-level" simplicity: high-quality typography, intentional whitespace, and a focus on essential information.

The brand personality is **Trustworthy, Modern, and Global**. It avoids unnecessary decorative elements, opting instead for a "Functional Luxury" approach where depth and motion guide the user through complex financial data. To maintain compliance and clarity, the UI consistently emphasizes the "Estimated" nature of values and "Information Only" status of transactions through subtle, persistent labeling.

## Colors

This design system utilizes a sophisticated, low-vibrancy palette to instill confidence. 

- **Primary (Deep Navy):** Reserved for core branding, navigation backgrounds, and high-level headers to establish authority.
- **Action (Soft Blue):** Used exclusively for interactive elements like primary buttons and active states.
- **Success/Warning/Error:** Used sparingly for status indicators and alerts, ensuring they stand out against the neutral background.
- **Information Context:** Use `text_secondary` for all "Estimated" or "Disclaimer" text to ensure it is readable but subordinate to primary financial figures.

## Typography

The typography system relies on **Inter** for its neutral, systematic, and highly legible characteristics across various alphabets. 

**Hierarchy Rules:**
- Use **Display** and **Headline** levels for currency amounts and primary destination names.
- Use **Label-md** for button text and section headers.
- Use **Disclaimer-sm** in `text_secondary` color for all "Estimated value" and "Payment information only" notes. These should be placed immediately below or adjacent to dynamic financial values.
- Apply negative letter-spacing to larger headlines to maintain a premium, tightly-kerned look.

## Layout & Spacing

The design system employs a **Fluid Grid** model with a maximum container width for desktop to maintain readability.

- **Desktop:** 12-column grid, 24px gutters, and 40px margins.
- **Mobile:** 4-column grid, 16px gutters, and 16px margins.
- **Rhythm:** All spacing must be a multiple of the 8px `base` unit. 
- **Whitespace:** Use `lg` and `xl` spacing between major sections (e.g., separating "Travel Itinerary" from "Financial Summary") to create a sense of calm and premium quality.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Ambient Shadows**. 

- **Surface 0 (Background):** #F7F9FC.
- **Surface 1 (Cards):** Pure White (#FFFFFF).
- **Shadows:** Use extremely soft, diffused shadows for cards. 
    - *Example:* `0px 4px 20px rgba(11, 31, 51, 0.05)`.
- **Borders:** All cards and interactive inputs should feature a 1px solid border in a slightly darker neutral than the background (e.g., #E5E7EB) to provide definition without adding visual weight.
- **Interactions:** On hover, cards should slightly lift (increase shadow spread) rather than change color.

## Shapes

The shape language is consistently **Rounded**, conveying friendliness and modern tech-forwardness.

- **Cards & Major Containers:** 16px (rounded-lg).
- **Buttons & Inputs:** 8px (standard roundedness).
- **Small Elements (Chips/Tags):** Full pill-shape for travel categories (e.g., "Flight," "Hotel").
- **Iconography:** Icons should use a 1.5pt or 2pt stroke weight with slightly rounded terminals to match the UI's geometry.

## Components

### Buttons
- **Primary:** Background #3B82F6, Text #FFFFFF. 56px height for mobile to ensure a large touch target.
- **Secondary:** Background Transparent, Border 1px #E5E7EB, Text #111827.
- **Disclaimer Button:** Small text-only buttons for "View Breakdown" or "Estimated Info."

### Cards
- **Financial Cards:** White background, 16px radius, subtle border. Must contain a footer area for "Estimated" disclaimers.
- **Travel Cards:** Feature a small 40x40px icon placeholder in the top-left using a soft tint of the primary color.

### Inputs
- **Text Fields:** 12px padding, 8px radius. Label floats above the field in `label-md`. 
- **Currency Input:** Large text alignment to the right, with a fixed "Estimated" tag in the leading position.

### Status Indicators
- **Chips:** Small, pill-shaped tags for status (e.g., "Pending Information"). Use 10% opacity of the status color for the background and 100% opacity for the text.

### Feedback Systems
- **Information Banners:** A full-width banner at the top of travel quotes stating: "Information displayed is for planning purposes only. This is not a transaction processing receipt."