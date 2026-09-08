# 012 — Editor UX: live preview, bookmarkable URLs, Prettier

- **Date:** 2025-08-03
- **Commits:** `3772e8d` (preview + URL bookmarking), `9eefd72`
  (Prettier button + CSS formatting), `4570090` (toast popups)
- **Status:** Accepted

## Context

Editing blind (no preview) with `alert()` feedback made the web editor
feel crude; large single-file tools drift in formatting over time.

## Decision

Add an iframe **live preview** of the edited file (blob URLs for unsaved
content), encode the open file in the edit page URL (`?file=`) for
bookmarking, replace `alert()` with auto-dismissing toasts, and add a
toolbar **Prettier button** (standalone Prettier 2.8.8 from CDN, HTML +
CSS parsers) for one-click formatting.

## Alternatives

- Save-then-preview in a new tab — rejected: breaks the mobile flow.
- Format-on-save — rejected: surprising destructive-ish rewrites.

## Consequences

- The formatting button led to a wave of `style(tools): prettier-format`
  commits normalizing tool files.
- Web-editor saves occasionally produced empty commits (kept as
  artifacts) — the UX cannot prevent every footgun.
