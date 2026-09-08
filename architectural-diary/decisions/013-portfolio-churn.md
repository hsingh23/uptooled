# 013 — Portfolio churn: tools are cheap to add and delete

- **Date:** 2025-06 → 2026-06
- **Commits:** added/deleted: `hello arta` (deleted same day), Dictation
  `0d0ace9` → `33a8d1b`, zofia `fbc365d` (deleted), StitchMastery
  `3bbd678` → `90ad665`; kept additions: `48643be` colors, `0292c3f` geo,
  `fc27f12` invoice, `03dbe73` latest-json, `b26f5d3` dropnglow
- **Status:** Accepted

## Context

Tools range from durable utilities to one-off prototypes (a link-grid
mock for a friend's site, a knitting-symbol font viewer, a Gemini
dictation app). The single-file architecture makes each addition or
removal a single commit.

## Decision

Treat the `tools/` directory as a portfolio with churn: add freely,
delete freely, no deprecation process. The catalog follows automatically
on regenerate.

## Alternatives

- Keep everything — rejected: clutter and stale unmaintained pages.
- Archive directory — considered, not adopted.

## Consequences

- The gallery stays current but its tool count oscillates; external
  references to deleted tools break (Stitchmastery links).
- Renames also churned (Poster Creator → Quick Block Text Poster → back),
  which confuses history archaeology.
