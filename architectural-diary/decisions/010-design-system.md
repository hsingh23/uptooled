# 010 — Dark-first design system with CSS custom properties

- **Date:** 2025-08-03
- **Commits:** `49b7eae` (visual refresh), `1b482bf` (extended to the
  final gallery), plus follow-ups `9a5fe9d`, `ed63e85`
- **Status:** Accepted

## Context

After two months of functional work the site was a patchwork of MUI
defaults and ad-hoc styling, with a botched earlier "modern UI overhaul"
(`997c156` era) that mixed conventions.

## Decision

One design system for `index.html` and `edit.html`: Inter typography,
dark-first palette on CSS custom properties (`--bg`, `--surface`,
`--primary`, ...), an overriding `@media (prefers-color-scheme: light)`
block, 12–20px radii, layered shadows, Font Awesome icons, glassmorphism
panels, `color-mix()` hovers, focus-visible outlines,
prefers-reduced-motion support, and iOS safe-area padding.

## Alternatives

- Light-first — rejected: the tool audience skews dark-mode.
- Theme toggle in UI — rejected: automatic scheme following was enough.

## Consequences

- Consistent, maintainable theming; light mode needs no JS.
- Tools themselves do not inherit the system (see 014) — only the shell
  pages do.
- CodeMirror theme sync was required to match (009).
