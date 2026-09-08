# 005 — In-browser editor over the GitHub Contents API

- **Date:** 2025-06-08
- **Commits:** `da44fe1` (edit page for CSV/tool files), `c7a6536`
  (CodeMirror rebuild, PR #13), `e62a038` (hardcode repo + rename/delete),
  `bbcb5b6` (auth flow), `4570090` (404s + popups)
- **Status:** Accepted

## Context

The maintainer wanted to fix tools from any device, including phones,
without a laptop and git. GitHub's web UI is clumsy for large single-file
HTML tools and cannot edit CSVs comfortably.

## Decision

Ship `edit.html` + `edit.js`: a CodeMirror-based editor that loads/saves
any repo file via the GitHub Contents API using a user-supplied personal
access token (kept in `localStorage`). The target repo/owner are hardcoded.
It supports create (via 404-tolerant load), rename, delete, and CSV
editing. The gallery's Edit button deep-links `edit.html?file=<path>`.

## Alternatives

- GitHub web UI — rejected (poor for big files).
- Netlify CMS/Decap — rejected: needs config/identity plumbing; this is
  one page with zero backend.
- OAuth flow — rejected: no server to hold secrets.

## Consequences

- Editing from mobile works; many later commits were made this way
  (including the six empty saves kept as artifacts).
- Token handling is entirely client-side; scope discipline is the user's
  responsibility (no secrets live in the repo).
- Hardcoded repo makes forks need an edit to `edit.js`.
