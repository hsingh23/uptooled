# 002 — Generated catalog from meta tags; vanilla JS over React

- **Date:** 2025-06-08
- **Commits:** `cec7bba` (generator + CI + React landing), `e783d86`/`24e7f70`
  (vanilla replacement, PR #2)
- **Status:** Accepted

## Context

The gallery needs an index of tools (title, description, keywords) without
maintaining it by hand. The first implementation shipped a React (UMD) +
Material UI landing page with a `generate-tools.js` Node script and a
GitHub Action committing `tools.json` on push.

## Decision

1. The catalog is **generated**, never hand-edited: `generate.js` parses
   each tool's `<title>`, `description` meta, and `keywords` meta into
   `tools.json`.
2. The landing page is **vanilla JS + MUI CSS** (from CDN) — the React UMD
   build was replaced within the same day (PR #2).

## Alternatives

- Hand-maintained JSON — rejected: drifts immediately.
- Client-side directory scan — impossible on static hosting.

## Consequences

- Adding a tool = adding one file with good meta tags + regenerate.
- SEO metadata and catalog data share one source of truth.
- The catalog can only be as good as the tools' meta tags (empty entries
  for `test.html` show the failure mode).
