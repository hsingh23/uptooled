# UpTooled — Architectural Diary

A narrative history and decision record for the UpTooled tool gallery,
reconstructed from its git history (145 commits, June 2025 – June 2026).
Commit hashes reference the current (message-rewritten) history; see
[`../CHANGELOG.md`](../CHANGELOG.md) for the commit-by-commit view.

## How to read this

- Start with the **history in five acts** below for the arc of the project.
- Use the **decision index** to jump to a specific choice: each entry links
  to a detail file with context, alternatives, and consequences.
- Status meanings: **Accepted** (still true today), **Superseded** (replaced
  by a later decision, linked), **Reverted** (backed out).

## History in five acts

### Act I — A tool and an index (2025-06-08)

The repo opens with a single self-contained HTML page, the Calendar
Timeline Visualizer (`f9f437f`). Within hours the pattern is set: tools are
zero-dependency single files, and the site around them exists to index and
preview them. A Node generator (`cec7bba`) harvests each tool's
`<title>`/description/keywords meta tags into `tools.json`, a GitHub Action
regenerates it on push, and a landing page lists tools with live iframe
previews and search. The first iteration is React (UMD) + Material UI; it is
replaced almost immediately by a vanilla-JS + MUI-CSS page (`e783d86`,
merged `24e7f70`). A CNAME for `tools.roomtolearn.org` is added and removed
the same day (`c2147be`, `f2d06fb`). More tools land: Image Resizer and
Cropper (`fe89364`), Poster Creator (`3709d68`), Masonry Collage Generator
(`b37497e`).

### Act II — Pipeline and editor (2025-06-08 → 06-11)

The gallery gains a second data source: `external-sites.csv` lists other
tool sites, which a second generator fetches (with an on-disk cache) into
`external-sites.json` (`9a3a124`). Then the two generators are merged into
one `generate.js`, the GitHub Action is deleted, and Netlify takes over the
build (`0e8de65`) — the site becomes a pure static deploy with build-time
metadata generation. On the same day, the in-browser editor appears
(`da44fe1`): `edit.html`/`edit.js` load and save repo files through the
GitHub Contents API. It is rapidly upgraded to CodeMirror with a file
sidebar and an auth gate (`c7a6536`), gains rename/delete (`e62a038`),
centralized API error handling (`bbcb5b6`), 404-tolerant loading for new
files with toast feedback (`4570090`), and a mobile off-canvas drawer.

### Act III — Related tools, revert, and re-land (2025-06-10)

Keyword-based "similar tools" links land (`3603938`/`1eed463`) bundled with
a responsive layout rework. The bundle is too much: the whole thing is
reverted (`2f71759`) and the feature re-landed cleanly (`2627e91`) with the
scoring moved into `generate.js` — the front end only renders what the
generator computes. This is the project's defining lesson: metadata belongs
in the build, not in the client.

### Act IV — Design system and simplification (2025-08-03)

A sweeping visual refresh (`49b7eae`) introduces the current dark-first
design system: Inter typography, CSS custom properties, a
`prefers-color-scheme: light` override, Font Awesome icons, glassmorphism.
At the same time the codebase shrinks: the Dexie/IndexedDB screenshot
pipeline that once cached iframe previews (`73959c8`, later lazy-loaded via
IntersectionObserver in `1b440b3`) is deleted outright (`1b482bf`) — cards
render live iframes again — and `index.js` is inlined into `index.html`
(`ed63e85`). The sidebar becomes a full-screen search overlay (`9a5fe9d`).
The editor matures in parallel: Unicode-safe base64 (`997c156`), CodeMirror
theme sync (`07405f5`, fixed for deprecations in `7bf988b`), live preview
with bookmarkable URLs (`3772e8d`), and a Prettier button (`9eefd72`).

### Act V — Portfolio churn and polish (2025-08 → 2026-06)

The tool set keeps evolving: colors extractor (`48643be`), a Gemini-powered
Invoice generator (`fc27f12`), the RawCrop brutalist resizer redesign
(`c57de18`), experiments that come and go (Dictation `0d0ace9`→`33a8d1b`,
zofia `fbc365d`, StitchMastery `3bbd678`→`90ad665`), and late additions
latest-json (`03dbe73`) and Drop N' Glow (`b26f5d3`). Established tools get
focused refinement PRs — flexible timeline durations, pinch/wheel zoom,
poster styling controls. The web-editor workflow leaves its mark: many
"Update tools/X.html" commits, including six empty saves kept as historical
artifacts.

## Decision index

| # | Date | Commit(s) | Decision | Status | Detail |
| --- | --- | --- | --- | --- | --- |
| 1 | 2025-06-08 | `f9f437f` | Tools are self-contained single HTML files | Accepted | [001-single-file-tools.md](decisions/001-single-file-tools.md) |
| 2 | 2025-06-08 | `cec7bba`, `24e7f70` | Generated catalog (tools.json) from meta tags; vanilla JS over React | Accepted | [002-generated-catalog.md](decisions/002-generated-catalog.md) |
| 3 | 2025-06-08 | `9a3a124`, `0e8de65` | Netlify build-time generation; no CI workflow | Accepted | [003-netlify-build.md](decisions/003-netlify-build.md) |
| 4 | 2025-06-08 | `9a3a124` | External sites aggregated from CSV with HTML cache | Accepted | [004-external-sites.md](decisions/004-external-sites.md) |
| 5 | 2025-06-08 | `da44fe1` | In-browser editor over GitHub Contents API | Accepted | [005-github-editor.md](decisions/005-github-editor.md) |
| 6 | 2025-06-08 | `ea72c29`, `d049224` | Gallery layout: grid by default, viewer on selection | Accepted | [006-gallery-layout.md](decisions/006-gallery-layout.md) |
| 7 | 2025-06-10 | `73959c8`, `1b482bf` | Preview caching: Dexie screenshots added, later removed | Superseded | [007-preview-caching.md](decisions/007-preview-caching.md) |
| 8 | 2025-06-10 | `3603938`, `2f71759`, `2627e91` | Related tools computed in the generator, not the client | Accepted | [008-related-tools.md](decisions/008-related-tools.md) |
| 9 | 2025-06-11 | `c7a6536`, `997c156` | Editor: CodeMirror + UTF-8-safe GitHub file ops | Accepted | [009-editor-hardening.md](decisions/009-editor-hardening.md) |
| 10 | 2025-08-03 | `49b7eae`, `1b482bf` | Dark-first design system with CSS custom properties | Accepted | [010-design-system.md](decisions/010-design-system.md) |
| 11 | 2025-08-03 | `ed63e85`, `9a5fe9d` | No separate JS: inline into index.html; search overlay | Accepted | [011-inline-script.md](decisions/011-inline-script.md) |
| 12 | 2025-08-03 | `3772e8d`, `9eefd72` | Editor UX: live preview, bookmarkable URLs, Prettier | Accepted | [012-editor-ux.md](decisions/012-editor-ux.md) |
| 13 | 2025-06→12 | `0d0ace9`, `3bbd678` et al. | Portfolio churn: tools are cheap to add and delete | Accepted | [013-portfolio-churn.md](decisions/013-portfolio-churn.md) |
| 14 | 2025-11-27 | `c57de18` | Tools may carry their own visual identity (RawCrop) | Accepted | [014-tool-visual-identity.md](decisions/014-tool-visual-identity.md) |

## Maintenance notes

- The pre-rewrite history is preserved locally on branch
  `backup/pre-docs-20260908` (not pushed). Old short hashes in external
  references (PR discussions) map to rewritten commits by position.
- `Plan.md` at the repo root is a historical AI planning transcript from the
  August 2025 redesign, kept for reference only.
