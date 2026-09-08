# 007 — Preview caching: Dexie screenshots added, then removed

- **Date:** 2025-06-10 → 2025-08-03
- **Commits:** `73959c8` (cache previews as IndexedDB screenshots, PR #16),
  `1b440b3` (IntersectionObserver lazy loading + failure memoization),
  `1b482bf` (remove the whole pipeline)
- **Status:** Superseded (by removal in `1b482bf`)

## Context

Grid cards rendering live iframes meant every tool booted on page load —
expensive (CPU, memory, CDN hits) and flaky when a tool crashed. A Dexie
(IndexedDB) store captured each card's iframe to a screenshot once and
reused it; later, IntersectionObserver limited captures to near-viewport
cards and memoized failures.

## Decision

First: cache screenshots in IndexedDB. Then: remove the entire pipeline
(`1b482bf`) and render live iframes directly again.

## Alternatives

- Keep lazy loading only — rejected as needless complexity for the
  portfolio size; screenshots were never refreshed on tool update,
  showing stale previews.
- Static thumbnails per tool — rejected: manual work.

## Consequences

- Cards always reflect the live tool; no stale screenshots.
- Grid cost scales with tool count; acceptable at current size (dozens).
- Dexie remains in `.gitignore`-free history only; the gallery itself has
  no storage dependencies anymore.
