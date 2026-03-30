Design tokens for the frontend

This document lists the primary CSS custom properties (tokens) used across the app and guidance for usage.

Color
- `--color-scarlet` / `--color-primary` - Primary brand color (Ohio State scarlet). Use for CTA backgrounds, links, and strong emphasis.
- `--color-primary-dark` - Hover/active state for primary color.
- `--color-surface` - Card and surface backgrounds.
- `--color-bg` - Page background.
- `--color-border` - Subtle borders and separators.
- `--color-text` / `--color-text-muted` - Primary and muted text colors.

Spacing
- `--space-xxs`..`--space-xl` - Use these for margin/padding to keep consistent rhythm.

Typography
- `--font-sans` - Primary font stack.
- `--font-size-*` - Use heading tokens in `typography.css` for scale.

Breakpoints
- `--bp-sm`, `--bp-md`, `--bp-lg`, `--bp-xl` - Mobile-first breakpoints; prefer CSS grid with `minmax` over many media queries.

Motion
- `--motion-fast`, `--motion-base`, `--motion-slow` - Use for transitions and animations. Respect `prefers-reduced-motion`.
- `--easing-*` - Use easing tokens for consistent motion feel.

Accessibility
- `--focus-ring` - Use for focus outlines on interactive controls.

Guidance
- Prefer semantic tokens (e.g., use `--color-primary` instead of raw hex). Keep tokens as single source of truth in `variables.css`.
- Add new tokens here and update `variables.css` accordingly.
