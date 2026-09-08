# 001 — Tools are self-contained single HTML files

- **Date:** 2025-06-08
- **Commits:** `f9f437f` (first tool), `fe89364`, `3709d68`, `b37497e` (early tools)
- **Status:** Accepted

## Context

The repository needed a unit of delivery for "a tool". Options ranged from
a proper app (framework, router, build) to a page-per-tool wiki to
bookmarklets. The author wanted utilities that could be dropped into any
static host, shared as a single file, and edited trivially.

## Decision

Every tool is one HTML file under `tools/` containing all of its HTML, CSS,
and JavaScript. Third-party libraries are pulled from CDNs at runtime
(Tailwind, html2canvas, SortableJS, JSZip, Dexie, exifr, @google/genai,
Firebase). Client-side persistence (localStorage/IndexedDB) is allowed
inside the tool.

## Alternatives

- React/Svelte per tool — rejected: build complexity per utility is not
  worth it (and the site-level React experiment was itself replaced, see
  002).
- Server-backed tools — rejected: privacy-first, no-backend posture.

## Consequences

- Tools are trivially deployable, diffable, and editable in the web editor
  (005).
- Each tool can take its own visual identity (014) at the cost of
  inconsistent styling across tools.
- No shared component reuse between tools; common patterns are copied.
- CDN dependencies make tools dependent on third-party availability.
