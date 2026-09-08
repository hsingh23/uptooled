# AGENTS.md — working guide for UpTooled

A static, framework-free gallery of single-file browser tools with a
Node metadata generator and a GitHub-backed in-browser editor. Read
[`README.md`](README.md) first for the product overview.

## Commands

```bash
npm run generate   # node generate.js — rebuild tools.json + external-sites.json
npm run dev        # serve the repo root (npx serve .) for local preview
```

- There are no tests, no linter, and no bundler. Verification is manual:
  serve the site and exercise the changed page (see "Verifying changes").
- Netlify runs `node generate.js` on deploy (`netlify.toml`); anything that
  changes a tool's `<title>`/meta description/keywords must be followed by a
  regenerate so the catalog stays in sync.

## Architecture map

```
tools/*.html ──(generate.js: parse <title>/meta)──> tools.json
                                                        │
external-sites.csv ──(generate.js: fetch + cache)──> external-sites.json
                                                        │
index.html ◄── fetches both JSON files, merges entries ──┘
   └─ grid of iframe previews -> hash-routed viewer -> edit.html?file=<path>

edit.html/edit.js ◄── GitHub Contents API (token from localStorage)
```

- **`index.html`** — the whole gallery is this one file (JS inlined; the old
  `index.js` was removed). Loads `tools.json` + `external-sites.json`,
  renders card grids with live iframes, a full-screen search overlay,
  hash-based deep links, related-tools links, and an Edit button that
  navigates to the editor.
- **`edit.html` / `edit.js`** — CodeMirror editor over the GitHub Contents
  API: load/save/create/rename/delete repo files, base64 with UTF-8-safe
  helpers, blob-SHA updates, optional-404 loading for new files, Prettier
  formatting button, iframe preview, `?file=` bookmarking. Repo/owner are
  hardcoded in `edit.js`; the token comes from the user via the auth panel.
- **`generate.js`** — build step (see diagram). Also computes each tool's
  `related` list by keyword-token overlap and tolerates fetch failures with
  fallback entries.
- **`tools/`** — one self-contained HTML file per tool. Tools may pull
  CDN libraries (Tailwind, html2canvas, SortableJS, JSZip, Dexie, exifr,
  @google/genai, Firebase) and persist state in localStorage/IndexedDB.

## Conventions

- **New tool = new single HTML file in `tools/`.** Include `<title>`, a
  `description` meta, and a `keywords` meta — the generator reads exactly
  these three. Then run `npm run generate` and commit the updated
  `tools.json`.
- **Commit messages:** conventional commits (`feat(tools): ...`,
  `fix(edit): ...`, `chore(data): ...` for CSV/catalog updates). Merge
  commits read `Merge PR #N: <description>`.
- **Catalog files are generated:** never hand-edit `tools.json` or
  `external-sites.json`; edit the sources (`tools/*.html`,
  `external-sites.csv`) and regenerate.
- **`external-sites.csv`** rows are `url,cache` with cache `y`/`n` (only a
  leading `y` counts as cache-on). Keep rows sorted; keep the trailing
  newline.
- **No secrets in the repo.** API keys are entered at runtime in the UI
  (GitHub PAT, Gemini key). Do not commit tokens.
- **Styling:** CSS custom properties (`--bg`, `--primary`, ...) defined in
  `index.html`/`edit.html`; dark-first with a `prefers-color-scheme: light`
  override block. Follow the existing token names when touching UI.

## Gotchas

- **Empty commits happen.** The web-based editor occasionally produced
  commits with identical trees ("empty save of ..."). Don't try to "fix"
  them; they are historical artifacts.
- **Renamed-back files.** Several tools were renamed and later renamed back
  (e.g. Poster Creator → Quick Block Text Poster → Poster Creator; Calendar
  Timeline Visualizer2 → Calendar Timeline Visualizer). Trust the current
  filenames, not old commit messages.
- **`tools/test.html` is a real tool** (Geo Location Extractor), not a
  scratch file.
- **The gallery previously used Dexie/IndexedDB screenshot caching and a
  separate `index.js`** — both were removed. Don't reintroduce them without
  reading [`architectural-diary/`](architectural-diary/) first.
- **A related-tools feature was reverted once** (PR #22) because it bundled
  an unwanted layout rework, then re-landed cleanly (PR #23) as generator
  scoring. Related tools belong in `generate.js`, not in the front end.
- **GitHub Actions was removed** when the project moved to Netlify; the
  generator now runs at deploy time only.
- **Firebase config in `habit-tracker.html`** is client-side by design;
  access control lives in Firebase rules, not in this repo.
- **`Plan.md`** is a historical AI-planning transcript kept for reference;
  it does not describe the current architecture.

## Verifying changes

1. `npm run generate` — must exit 0 and only touch `tools.json` /
   `external-sites.json` as expected.
2. `npm run dev`, then check:
   - `index.html` loads, search finds tools by keyword, hash deep link
     (`#<encoded path>`) restores the viewer, related links navigate.
   - `edit.html` auth panel appears without a token; with a token the file
     list loads, a file opens, and Save/Prettier/preview work (use a throwaway
     repo or branch when testing writes).
   - The changed tool still opens directly from `tools/<file>.html`.
3. If you changed `edit.js` save paths, verify a round-trip with non-ASCII
   content (the UTF-8 base64 helpers exist for a reason).
4. Netlify will re-run the generator on push; confirm `tools.json` was
   regenerated locally first to avoid a dirty deploy diff.

## Pointers

- [`CHANGELOG.md`](CHANGELOG.md) — commit-by-commit history (newest first).
- [`architectural-diary/main.md`](architectural-diary/main.md) — narrative
  history and the decision index; read before making structural changes.
- [`prompt.md`](prompt.md) — full recreation spec (stack, phases, data
  model, acceptance criteria).
