# prompt.md — One-shot recreation prompt for UpTooled

Use this prompt to recreate the UpTooled project from scratch in phases
that mirror how it actually evolved. Each phase ends in a working state.

---

## Goal

Build **UpTooled**: a static, zero-backend gallery of single-file browser
tools. Every tool is one self-contained HTML page (inline CSS/JS, CDN
libraries allowed) that runs entirely client-side. The gallery indexes
tools automatically from their meta tags, previews them live in iframes,
aggregates the author's external tool sites from a CSV manifest, and
includes an in-browser editor that reads/writes the repository through
the GitHub Contents API. Deploy target: Netlify (build runs the
generator, publishes the repo root). No accounts, no server processing,
privacy-first.

## Exact stack

- **Site shell:** plain HTML/CSS/JS — no framework, no bundler, no
  separate JS files (all gallery logic inlined in `index.html`).
- **Styling:** MUI CSS from CDN (`cdn.muicss.com/mui-latest/css/mui.min.css`),
  Google Fonts **Inter** (300–800), Font Awesome 6.4.0, CSS custom
  properties for theming.
- **Editor:** CodeMirror 5.65.5 (CDN, htmlmixed/js/css modes, solarized
  theme asset) + standalone **Prettier 2.8.8** (CDN, parser-html +
  parser-postcss) behind a toolbar button.
- **Build:** one Node script `generate.js` using Node's built-in `fetch`
  and `fs`; no dependencies. `package.json` scripts: `generate`
  (`node generate.js`), `dev` (`npx serve .`). No tests, no linter.
- **Hosting:** `netlify.toml` with `command = "node generate.js"`,
  `publish = "."`.
- **Tool-side libraries (CDN, per tool):** Tailwind CDN, html2canvas,
  SortableJS, JSZip, exifr, @google/genai, Firebase web SDK.
- **No environment variables.** All credentials are runtime user input.

## Data model

1. **`tools/*.html`** — the tools. Contract: each file carries
   `<title>`, `<meta name="description">`, `<meta name="keywords">`;
   the generator reads exactly these.
2. **`tools.json`** (generated) — array of
   `{ file: "tools/<name>.html", title, description, keywords: string[],
   related: string[] }` where `related` lists up to 3 other tool paths by
   shared keyword-token overlap score.
3. **`external-sites.csv`** — manifest rows `url,cache` where only a
   leading `y` in `cache` enables caching; keep rows sorted, keep the
   trailing newline.
4. **`external-sites.json`** (generated) — array of
   `{ file: <url>, title, description, keywords }` harvested from the
   fetched pages; fetch failures degrade to fallback entries keyed by
   `file`.
5. **`site-cache/`** — on-disk HTML cache for cached CSV entries
   (gitignored).

## Generator algorithm (`generate.js`)

- Scan `tools/*.html`; regex-extract title/description/keywords metas.
- Related: tokenize keywords (lowercase, split on whitespace); for each
  pair count shared tokens; keep top 3 with count > 0, sorted desc.
- Fetch external sites concurrently (`Promise.all`), reusing/writing
  `site-cache/<sanitized-url>.html` per the cache flag; regex the same
  metas from the HTML.
- Write both JSON files pretty-printed with trailing newlines.

## Pages

### `index.html` — the gallery

- Preloads `tools.json` and `external-sites.json`; merges both into one
  searchable list.
- **Grid state (default):** responsive card grid; each card contains a
  live iframe of the tool plus name; cards ~600px wide with 420px frames.
- **Viewer state (on selection):** full-height iframe; above it the
  tool's title, description, keyword tags, "Similar:" related-tool links
  (from `related`), and an Edit button navigating to
  `edit.html?file=<encoded path>` (shown only when a GitHub token exists
  in localStorage).
- **Routing:** selected tool encoded in the URL hash (`#<encoded path>`),
  restored on load and hashchange, cleared when returning to grid; Back
  button returns to grid.
- **Search:** full-screen overlay (floating search button trigger)
  filtering across title/description/keywords of local + external tools.
- **Mobile:** app-like layout, floating action buttons
  (back/search/info/edit) at 48px with per-action accent colors; header
  and search chrome hidden in viewer state.
- **Theming:** dark-first CSS custom properties
  (`--bg #0a0e1a`, `--surface #0f1623`, `--panel #131b2e`, `--elev`,
  `--text`, `--muted`, `--border`, `--primary #6366f1`,
  `--primary-light/dark`, `--accent #22d3ee`, `--success/--warning/--danger`,
  `--radius 16/12/20px`, layered `--shadow-1..3`, `--shadow-glow`) with an
  overriding `@media (prefers-color-scheme: light)` block mapping to a
  slate/light palette; Inter font; glassmorphism panels; `color-mix()`
  hover states; focus-visible outlines; prefers-reduced-motion support;
  iOS safe-area padding. Topbar branded **UpTooled**.

### `edit.html` + `edit.js` — the in-browser repo editor

- **Auth:** token input (GitHub PAT), stored in `localStorage`
  (`gh_token`); auth panel gates the editor; credentials validated by
  fetching `external-sites.csv`; 401/403 offers re-auth. Repo/owner
  hardcoded in `edit.js`.
- **API:** GitHub Contents API
  (`GET/PUT/DELETE https://api.github.com/repos/<owner>/<repo>/contents/<path>`)
  with `Authorization: token <pat>`, API v3 Accept header, per-segment
  path encoding, base64 content with UTF-8-safe encode/decode helpers,
  blob-SHA on update. Optional `allow404` load yields an empty editor for
  new files.
- **Sidebar:** file list (external-sites.csv + tools/ from the API) as a
  mobile off-canvas drawer with scrim and auto-close on select; new-file
  field.
- **Editing:** CodeMirror with mode by extension; theme follows
  `prefers-color-scheme` (matchMedia with `addEventListener` + fallback);
  deferred `editor.refresh()` after unhide/content-load.
- **Actions:** Save, Rename, Delete, New file; iframe **live preview**
  of unsaved content via blob URLs; `?file=` bookmarking; **Prettier**
  button (HTML/CSS) on the main toolbar; toast popups instead of
  `alert()`.
- **CSV mode:** friendly table editing for `external-sites.csv`.

## The tools to include

1. **Calendar Timeline Visualizer** — editable project timelines:
   title, start month/year, phases (add/remove/reorder via SortableJS),
   Month/Week/Day views, units-per-row wrapping, flexible durations
   ("3m"/"10d" parsed to days), color-coded gradient segments,
   contrast-aware labels, on-screen legend, PNG (html2canvas) and
   style-complete SVG export, dark-mode toggle persisted in
   localStorage, SEO/OG/Twitter metas, Tailwind CDN.
2. **Image Resizer and Cropper** — multi-image queue, thumbnail sidebar,
   zoom (slider + wheel + pinch + Safari gesture events) and pan on
   canvas, paste-from-clipboard, blank-canvas/background-only mode,
   custom background color (hex input), icon size presets with base and
   1.5x multipliers, ZIP export (JSZip), neo-brutalist "ImageCrop"
   styling with SEO/OG/Twitter metas.
3. **Poster Creator** — block-text poster designer: 17 Google Fonts with
   dropdown previews, primary/secondary style groups plus per-item editor
   (ctrl-click modal: text/font/color/bold/italic) with a custom-flag so
   global changes skip customized items, background image with drag and
   proportional resize, opacity sliders, strikethrough/drop-shadow
   (x/y/blur/color), rgba() text inputs, background color swatches,
   margin readout, 50-state undo/redo snapshotting control-panel state,
   PNG and JPEG export, "Poster Lab" indigo controls sidebar.
4. **Masonry Image Collage Generator** — image/video uploads (files or
   folders), layout presets (width/columns/gap/background), live canvas
   preview, PNG/JPEG download, Imgur share, lightbox, inline video
   controls with frame capture.
5. **Invoice** — invoice generator with company/client/service forms,
   coupon discounts (friend/student) with preview row, localStorage
   draft persistence, auto invoice numbers and dates, hours×rate
   recalculation, PDF via print, optional Gemini fill-from-description
   using a user-entered API key (never stored).
6. **colors.html** — palette generator: extract dominant colors from
   images, harmony suggestions, scheme export.
7. **test.html (Geo Location Extractor)** — File System Access folder
   scan, EXIF GPS/timestamps via exifr, JSON download, all client-side.
8. **todos.html** — localStorage to-do app.
9. **habit-tracker.html** — weekly habit tracker on Firebase web SDK
   (client-side config; access control in Firebase rules).
10. **latest-json.html** — paste a package.json; query npm/Bun/Yarn
    registries in parallel; compare installed ranges vs latest; rewrite
    and copy; brutalist styling.
11. **dance.html** — content page "Injury Prevention for the Chicago
    Dancer" with animated accordions.
12. **dropnglow.html** — decision workbook for a mobile sauna business:
    status-tracked decisions, IndexedDB persistence, generated report,
    warm cedar/terracotta palette.

## Build order (mirror the history)

1. **Tool first:** build the Calendar Timeline Visualizer as a single
   HTML file. Then add the generator + `tools.json` + a simple landing
   page listing tools with iframe previews and keyword search.
2. **Gallery shell:** card grid by default; viewer on selection; hash
   deep-links; merge external sites into the list.
3. **Pipeline:** add the external-sites CSV fetcher with caching; merge
   the two generators into one `generate.js`; move the build to Netlify
   and delete any CI workflow.
4. **Editor:** plain textarea + token → CodeMirror + sidebar + auth
   gate → rename/delete/hardcoded repo → centralized API errors and
   re-auth → 404-tolerant loads + toasts → UTF-8-safe base64 → preview +
   `?file=` + Prettier → mobile drawer → CodeMirror theme sync.
5. **Design system:** apply the dark-first token set, glassmorphism,
   search overlay, inlined script, floating action buttons.
6. **Tool portfolio:** add the remaining tools (each its own commit),
   regenerate the catalog after each; apply focused refinement PRs
   (durations, zoom modes, poster controls).
7. **Related tools:** compute keyword overlap in the generator (top 3),
   render "Similar:" links in the viewer.

## APIs by name

- **GitHub Contents API** — `api.github.com/repos/<owner>/<repo>/contents/<path>`
  (GET list/read, PUT create/update with base64 + blob SHA, DELETE).
  Auth: `Authorization: token <PAT>` supplied by the user in the UI.
- **Gemini API** (Invoice tool only) — user enters their own key at
  runtime; sent as `x-goog-api-key`.
- **npm/Bun/Yarn registry APIs** (latest-json tool) — public, unauthenticated.
- **Imgur** (collage share) — per its public upload endpoint.
- No environment variables exist; no server-side endpoints exist.

## Acceptance criteria

1. `npm run generate` exits 0, writes `tools.json` and
   `external-sites.json` with trailing newlines, computes correct
   `related` arrays, and survives a fetch failure with a fallback entry.
2. Serving the root shows the grid; search finds tools by keyword;
   selecting a card shows the viewer with tags, related links, and Edit
   button (with token); the hash restores state after reload; Back
   returns to the grid; external tools appear in search.
3. Dark mode by default; light mode follows `prefers-color-scheme` with
   no flash; layout is usable at 360px width (drawer, floating buttons).
4. `edit.html` gates on auth; loads/saves a tool file round-trip
   byte-identical including non-ASCII; create (404 path), rename, and
   delete work; Prettier formats HTML; preview renders unsaved content;
   `?file=` reopens the file; toasts replace alerts.
5. Each tool opens standalone from `tools/<file>.html` and functions
   per its description above (timelines export correct PNG/SVG; resizer
   pastes, zooms, and exports ZIP; poster undo/redo covers panel state).
6. Netlify deploy runs the generator and serves the updated catalog.
7. No secrets in the repo; tokens/keys only ever live in localStorage
   or runtime form fields.
