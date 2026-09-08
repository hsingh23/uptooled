# UpTooled

**UpTooled** is a static, zero-backend gallery of single-file browser tools.
Every tool is one self-contained HTML page (HTML + CSS + JS inline) that runs
entirely in the visitor's browser — no accounts, no server-side processing,
no data leaving the device. The gallery indexes the tools automatically,
previews them live in iframes, and can even edit the repository's files
in the browser through the GitHub Contents API.

Hosted on **Netlify** (build runs `node generate.js`, publishes the repo root).

## Why

- **Privacy first.** Tools are static pages; file and image processing happens
  client-side. Nothing is uploaded anywhere.
- **Zero friction.** No build framework, no bundler, no dependencies to
  install for the site itself — just HTML files and one small Node build
  script that generates metadata.
- **Edit from anywhere.** The bundled `edit.html` editor talks to the GitHub
  API with a personal access token, so tool pages and the data CSV can be
  edited from a phone or borrowed machine and committed straight to `main`.
- **Discoverable.** Each tool ships its own SEO metadata; the generator
  harvests `title`/`description`/`keywords` meta tags into `tools.json`,
  and external tool sites are aggregated the same way from a CSV manifest.

## Features

- **Tool gallery** (`index.html`)
  - Responsive card grid with live iframe previews; click a card to open the
    full-height viewer with title, description, and keyword tags.
  - Full-screen search overlay across titles, descriptions, and keywords.
  - Deep links: the selected tool is encoded in the URL hash and restored
    on load.
  - "Similar tools" links computed from shared keyword tokens.
  - External tools (other sites) merged into the same searchable list from
    `external-sites.json`.
  - Dark-first design system with automatic light mode via
    `prefers-color-scheme`; mobile-first layout with floating action buttons
    (back / search / info / edit).
- **In-browser repo editor** (`edit.html` + `edit.js`)
  - CodeMirror 5 editor with syntax highlighting (HTML/JS/CSS/JSON modes)
    and theme that follows the color scheme.
  - Loads and saves any file in the repo through the GitHub Contents API
    (base64, blob-SHA aware); create, rename, and delete files.
  - GitHub personal access token stored in `localStorage`; auth panel gates
    the editor; 401/403 triggers a re-auth prompt.
  - CSV editing for `external-sites.csv`, live preview of the edited page,
    bookmarkable `edit.html?file=<path>` URLs, and a Prettier button for
    one-click HTML/CSS formatting.
  - UTF-8-safe base64 encode/decode so non-ASCII content saves correctly.
- **Build pipeline** (`generate.js`)
  - Scans `tools/*.html` for `title`, `description`, and `keywords` meta
    tags and writes `tools.json`.
  - Scores keyword-token overlap between tools to fill each entry's
    `related` list (top 3).
  - Fetches every URL in `external-sites.csv` (with optional on-disk HTML
    caching under `site-cache/`), extracts the same metadata, and writes
    `external-sites.json`.
- **The tools themselves** (see `tools/`)
  - Calendar Timeline Visualizer — color-coded project timelines with
    month/week/day views, flexible durations, PNG/SVG export.
  - Image Resizer and Cropper — multi-image resize/crop with zoom, pan,
    paste, size presets, and ZIP export.
  - Poster Creator — block-text poster designer with fonts, swatches,
    per-item styling, undo/redo, and image/JPEG export.
  - Masonry Image Collage Generator — image/video collages with layout
    presets and PNG/JPEG download.
  - Invoice — AI-assisted invoice generator (bring your own Gemini API
    key) with localStorage drafts and PDF-via-print.
  - Plus: color palette extractor (`colors.html`), geolocation/EXIF
    extractor (`test.html`), todos, habit tracker (Firebase), a parallel
    npm dependency updater (`latest-json.html`), a decision workbook
    (`dropnglow.html`), and a dance injury-prevention guide (`dance.html`).

## Stack

| Layer | Choice |
| --- | --- |
| Site | Plain HTML/CSS/JS — no framework, no bundler |
| Styling | MUI CSS (CDN), Inter font, Font Awesome 6.4.0, CSS custom properties |
| Editor | CodeMirror 5.65.5, Prettier 2.8.8 (standalone, CDN) |
| Build | Node script (`generate.js`), Node's built-in `fetch` |
| Hosting | Netlify (`netlify.toml`: `command = "node generate.js"`, `publish = "."`) |
| Tool libraries (per-tool, CDN) | Tailwind CDN, html2canvas, SortableJS, JSZip, Dexie, exifr, @google/genai, Firebase web SDK |

## Quickstart

```bash
npm install        # nothing to install — package.json has no deps
npm run generate   # regenerate tools.json + external-sites.json
npm run dev        # serve the repo root (npx serve .)
```

- **Dev:** edit files, run `npm run generate` when tool metadata changes,
  and open the served `index.html`.
- **Test:** there is no test suite; verify changes by loading the site
  locally and exercising the affected tool or page.
- **Build/deploy:** pushes to `main` are built by Netlify (which runs the
  generator); there is no CI workflow in the repo anymore.

## Repository structure

```
.
├── index.html            # gallery: grid, viewer, search overlay
├── edit.html / edit.js   # in-browser GitHub repo editor
├── generate.js           # metadata generator (tools.json, external-sites.json)
├── tools.json            # generated tool index (title/desc/keywords/related)
├── external-sites.csv    # manifest of external tool sites (url, cache)
├── external-sites.json   # generated metadata for external sites
├── netlify.toml          # Netlify build config
├── package.json          # npm scripts: generate, dev
└── tools/                # the tools — one self-contained HTML file each
```

## Configuration

There are **no environment variables**. The editor asks for a GitHub
personal access token (scope: repo contents) in the UI and keeps it in
`localStorage`. The `Invoice` tool similarly asks for a Gemini API key at
runtime. Neither is stored in the repository. The habit tracker embeds a
Firebase web SDK config in its page (standard client-side Firebase setup).

## Documentation

- [`CHANGELOG.md`](CHANGELOG.md) — every commit, newest first.
- [`AGENTS.md`](AGENTS.md) — working conventions for agents and contributors.
- [`architectural-diary/`](architectural-diary/) — the project's decision
  record and history narrative.
- [`prompt.md`](prompt.md) — a one-shot prompt to recreate this project.

## License

MIT (see `package.json`).
