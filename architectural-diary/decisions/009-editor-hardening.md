# 009 — Editor hardening: CodeMirror + UTF-8-safe GitHub operations

- **Date:** 2025-06-10 → 2025-08-03
- **Commits:** `c7a6536` (CodeMirror + sidebar + auth gate),
  `997c156` (Unicode-safe base64, API v3 header, mode highlighting),
  `07405f5` (CodeMirror theme follows color scheme), `7bf988b`
  (matchMedia addEventListener fix), `07405f5`/`4570090` (refresh fixes)
- **Status:** Accepted

## Context

Saving non-ASCII content through `btoa`/`atob` corrupts or throws; the
GitHub Contents API expects base64 with a v3 Accept header. CodeMirror
mis-renders when unhidden from `display:none` or when content is set while
hidden.

## Decision

UTF-8-safe base64 encode/decode helpers wrap every file operation;
requests send the GitHub API v3 Accept header; CodeMirror modes cover
html/js/css/json; deferred `editor.refresh()` calls fix unhide/load
rendering; the editor theme follows `prefers-color-scheme` via
`matchMedia` (with the modern `addEventListener` API).

## Alternatives

- Plain textarea — rejected: unusable for 2,000-line tool files.
- Server-side commit proxy — rejected: no backend by design.

## Consequences

- The editor reliably round-trips international text.
- A family of refresh bugs had to be fixed one by one — worth knowing
  before touching the show/hide logic.
