# 011 — No separate JS: inline into index.html; full-screen search overlay

- **Date:** 2025-08-03
- **Commits:** `ed63e85` (inline index.js, toolbar layout), `9a5fe9d`
  (search overlay replacing the sidebar)
- **Status:** Accepted

## Context

The gallery had grown an `index.js` alongside `index.html`, plus a
sidebar tool list. During the design refresh the structure was simplified.

## Decision

Delete `index.js` and inline all gallery logic in `index.html`'s script
tag. Replace the sidebar tool list with a **full-screen search overlay**
(triggered by a floating search button); desktop gets a horizontally
scrolling toolbar of tool cards.

## Alternatives

- Keep modular JS — rejected for this scale; one file matches the
  project's single-file philosophy.
- Keep sidebar — rejected: duplicated navigation with the grid.

## Consequences

- `index.html` is large but self-contained; edits never desync HTML and JS.
- Search became the primary navigation — keyword meta quality now directly
  drives findability.
