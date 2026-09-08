# 004 — External sites aggregated from a CSV with HTML cache

- **Date:** 2025-06-08
- **Commits:** `9a3a124`, `4cf3eee` (first entry), many `chore(data):`
  updates through 2026-01
- **Status:** Accepted

## Context

The gallery should also surface the author's tools hosted elsewhere
(privacyfirstapps.org properties, replit, lovable, netlify sites). Their
metadata is not in this repo.

## Decision

`external-sites.csv` lists external URLs with a `cache` flag (`y`/n).
`generate.js` fetches each URL (reusing `site-cache/*.html` when enabled),
extracts title/description/keywords, and writes `external-sites.json`;
the gallery merges these entries into the same searchable list as local
tools.

## Alternatives

- Manual JSON entries — rejected: duplicates the generator's job.
- Link-only list without metadata — rejected: no search/discovery value.

## Consequences

- Adding an external tool is a one-line CSV edit editable from the web
  editor.
- Cache flag semantics are strict (only leading `y` counts — a `true`
  value silently disables caching, fixed in `617d230`'s era).
- Builds depend on third-party site availability; failures degrade to
  fallback entries rather than failing the build.
