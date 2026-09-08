# 014 — Tools may carry their own visual identity

- **Date:** 2025-11-27
- **Commits:** `c57de18` (RawCrop brutalist resizer redesign); also
  `03dbe73` (brutalist latest-json), `b26f5d3` (warm cedar/terracotta
  dropnglow)
- **Status:** Accepted

## Context

Earlier tools were restyled toward consistent, Tailwind-ish utility
looks. The Image Resizer was rebuilt in a deliberately loud
neo-brutalist style (black borders, hard shadows, monospace display
font) branded "RawCrop" — later softened to "ImageCrop" when the SEO
title reverted (`cfdc171`, `fdbf053`).

## Decision

Tools are allowed — encouraged — to express their own visual identity
instead of conforming to the gallery's design system. The shell
(index/edit) keeps the system from decision 010.

## Alternatives

- Enforce shell consistency inside tools — rejected: kills personality
  and experimentation; the gallery chrome already provides coherence.

## Consequences

- The gallery is visually varied; each tool's design can serve its
  audience (e.g., a sauna business workbook feels warm, a dev tool feels
  terminal-brutalist).
- SEO branding inside tools (RawCrop/latestjson) sometimes fights the
  catalog title, requiring follow-up renames.
