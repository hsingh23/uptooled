# 006 — Gallery layout: grid by default, viewer on selection

- **Date:** 2025-06-08
- **Commits:** `ea72c29` (sidebar viewer, PR #4), `d049224` (grid default,
  PR #5), `81f23d7` (hash deep-links, PR #9)
- **Status:** Accepted

## Context

The gallery cycled between two layouts within hours: a two-pane
sidebar-list + viewer, then a card grid, then grid-with-viewer.

## Decision

Landing state is a **responsive grid of tool cards with live iframe
previews**; selecting a card opens the **full-height viewer** with title,
description, keyword tags, related links, and an Edit button. The
selection is encoded in the URL hash (`#<encoded path>`) so views are
bookmarkable and restorable; Back returns to the grid.

## Alternatives

- Sidebar list always visible — tried first; wastes space on mobile.
- Modal previews — rejected: tools are interactive full pages.

## Consequences

- Deep links drive shareability; the hash is the only routing state.
- Live iframes in cards make the grid heavy with many tools (see 007 for
  the caching detour).
