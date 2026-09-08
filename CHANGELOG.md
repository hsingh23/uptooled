# Changelog

All notable changes to **UpTooled** (the tool gallery), newest first.

> Note: hashes reference the current (message-rewritten) history. In
> September 2026 the commit messages on `main` were rewritten in place
> (messages only — trees and history shape are unchanged) to replace
> generic web-editor messages such as "Update tools/X.html" with
> descriptive conventional-commit messages. Content of every commit is
> identical to the pre-rewrite history.

Entries are `date · short-hash · type: subject` with a short summary.
Types: feat, fix, refactor, docs, chore, style, test, perf, build.

## 2026-06-13 · `112da5c` · chore: empty save of dropnglow.html
- Records no changes — the tree is byte-identical to the commit's parent (empty diff) despite the "Update tools/dropnglow.html" message.
- Committed 17 seconds after the file was added, mirroring the no-op saves seen in the 2025-11-27 image-resizer session.

## 2026-06-13 · `b26f5d3` · feat: add Drop N' Glow decision workbook page
- Adds tools/dropnglow.html (1464 lines), a single-file "Drop N' Glow Decision Workbook" for planning a mobile sauna business: strategy, pricing (with competitor/market reference tables), waivers, bookings, memberships, operations, and launch decisions.
- Decisions carry status (open/research/decided), selectable choices, and evidence sources; state persists in IndexedDB (dropnglow_decision_workbook_v1) and a generated decision report renders on demand.
- Styled with a warm cedar/terracotta palette rather than the site's brutalist look.

## 2026-01-06 · `03dbe73` · feat: add parallel NPM dependency updater page
- Adds tools/latest-json.html (795 lines), "PARALLEL NPM UPDATER" — a client-side brutalist-styled page where users paste a package.json and it queries the npm, Bun, and Yarn registries in parallel to compare installed ranges against latest versions and rewrite the dependencies.
- Includes toast notifications, copy-to-clipboard of the updated JSON, registry status badges, and SEO metadata branding it as latestjson.privacyfirstapps.org with a "no data sent to our servers" privacy note.

## 2026-01-04 · `188a7ad` · chore: add htmltomarkdown.replit.app to sites CSV
- Second external-sites.csv edit within 15 minutes (4+/3-): adds https://htmltomarkdown.replit.app, upgrades the stitchpro.privacyfirstapps.org row from http to https, and reorders the bottom rows (easy-otp moved to last).
- No other content changes.

## 2026-01-04 · `ff92b6e` · chore: refresh external sites CSV
- Edits external-sites.csv (4+/2-): removes tempo.privacyfirstapps.org and adds easy-otp.privacyfirstapps.org, http://stitchpro.privacyfirstapps.org, and https://fast-qr.lovable.app, all with cache=true.
- The CSV feeds generate.js, which regenerates external-sites.json for the site's external-tools directory.

## 2025-12-24 · `90ad665` · chore: remove StitchMastery symbol viewer page
- Deletes tools/Stitchmastery.html (2219 lines) about eleven hours after it was added and reformatted, removing the knitting symbol viewer/exporter from the repository.
- It is the only file touched; the page disappears from the generated tools.json catalog on the next build.

## 2025-12-24 · `58d6bc7` · style: prettier-format Stitchmastery.html
- Reformats tools/Stitchmastery.html (2189+/2164-, six seconds after the file was added).
- The whitespace-agnostic diff shrinks to ~62/37 lines and consists entirely of formatting artifacts — double quotes, self-closing tags, CSS rule expansion, attribute wrapping.
- No behavioral, markup-content, or data changes.

## 2025-12-24 · `3bbd678` · feat: add StitchMastery symbol viewer/exporter page
- Adds tools/Stitchmastery.html (2194 lines), a "StitchMastery Symbol Viewer & Exporter" for knitting chart symbol fonts.
- Loads six StitchMastery TTF faces from a jsDelivr CDN, parses an embedded CSV mapping Unicode codepoints to suggested stitch uses, renders searchable/filterable symbol grids with font-family checkboxes (Dash, Dot, and cable variants), stores per-symbol name corrections in IndexedDB with copy-as-JSON export, and offers bulk "Download SVGs" of the selected symbols.

## 2025-12-21 · `b0a4e80` · chore: add files.privacyfirstapps.org to sites CSV
- Appends the row https://files.privacyfirstapps.org/,true to external-sites.csv, the manifest that generate.js compiles into external-sites.json for the site's external-tools directory.
- Also incidentally fixes the missing trailing newline on what was previously the last row (txt-to-srt).

## 2025-11-27 · `976f1eb` · chore: empty save of Image Resizer and Cropper.html
- Records no changes — the tree is byte-identical to the commit's parent (empty diff) despite the "Update tools/Image Resizer and Cropper.html" message.
- Third of three no-op saves during the 2025-11-27 web-editor session on this file.

## 2025-11-27 · `4295c50` · chore: empty save of Image Resizer and Cropper.html
- Records no changes — the tree is byte-identical to the commit's parent (empty diff) despite the "Update tools/Image Resizer and Cropper.html" message.
- Second of three no-op saves during the 2025-11-27 web-editor session on this file.

## 2025-11-27 · `fdbf053` · style: format resizer meta tags, rename RawCrop branding
- Prettier-formats the SEO meta block added moments earlier in tools/Image Resizer and Cropper.html (multi-line attributes, self-closing tags; 41+/18-) and renames the visible branding: the headline changes from "RawCrop" to "ImageCrop" and the tagline from "The Brutalist Image Resizer." to "Resize and crop to your heart's desire.".

## 2025-11-27 · `92edabb` · chore: empty save of Image Resizer and Cropper.html
- Records no changes — the tree is byte-identical to the commit's parent (git diff against parent is empty), despite the "Update tools/Image Resizer and Cropper.html" message.
- One of a rapid-fire series of GitHub web-editor commits touching this file within minutes on 2025-11-27.

## 2025-11-27 · `cfdc171` · chore: broaden image resizer metadata, add OG/Twitter cards
- Replaces the brutalist-flavored metadata in tools/Image Resizer and Cropper.html: restores the title from "RawCrop | Brutalist Image Resizer" to "Image Resizer and Cropper", rewrites description/keywords to target favicon, app-icon, and social-asset use cases, and adds Open Graph and Twitter card tags pointing at tools.privacyfirstapps.org with placehold.co preview images.
- No markup, styling, or script changes.

## 2025-11-27 · `c57de18` · feat: redesign image resizer with brutalist RawCrop UI
- Rewrites tools/Image Resizer and Cropper.html (847+/1221-, 1247→873 lines) from the rounded gray/blue Tailwind look to a high-contrast neo-brutalist "RawCrop" design: thick black borders, hard offset shadows, monospace display type, yellow accent, restyled upload dropzone and image queue.
- The core canvas workflow (upload, size presets/custom dimensions, zoom/pan, background color, download) is preserved in a new 12-column grid layout; the localStorage-persisted "dismiss instructions" behavior and some gesture-handler wiring from the old version are dropped.

## 2025-11-27 · `4471450` · style: prettier-format Invoice.html
- Passes tools/Invoice.html through a Prettier-style reformat (1228+/1151-; whitespace-agnostic diff is only ~144/67, itself mostly attribute re-wrapping, quote style, and self-closing tags).
- The only substantive change swaps the fallback business defaults from "Celerity Tech Consulting" / celeritytechconsulting.com / Chicago, IL / CT-2025-001 to generic placeholders "Stellar Tech Solutions" / stellartech.example.com / San Francisco, CA / STS-2025-001.
- The Gemini-API invoice generator logic is otherwise unchanged.

## 2025-11-05 · `3360f1d` · feat: add Firebase-backed weekly habit tracker page
- Adds tools/habit-tracker.html (1723 lines), a "Habit Tracker — Weekly Rhythm" single-page app built with Tailwind, Chart.js, and Lottie.
- Features Firebase email/password auth and Realtime Database sync (cool-90147.firebaseio.com), weekly-streak and monthly-average stats, weekly and monthly trend charts, and an auth modal gating the tracker.
- Ships full SEO/Open Graph/Twitter metadata and JSON-LD targeting habits.roomtolearn.org, plus an inline SVG favicon.

## 2025-11-04 · `fc6b1f7` · feat: add localStorage-backed todos app page
- Adds a new single-file todo app (336 lines) styled in the site's 2px-border neo-brutalist look (Inter + Space Mono, Lucide icons, hard offset shadows).
- Supports add, inline edit, toggle, delete, clear-completed, all/pending/completed filter tabs, drag-to-reorder, and total/done/pending stat cards.
- State persists to localStorage under a single key.

## 2025-10-17 · `7dbd342` · feat: add dance injury prevention crash course page
- Creates tools/dance.html (356 lines, a new file despite the "Update" message): a Tailwind CSS + Inter-font content page titled "Injury Prevention for the Chicago Dancer." It has a hero section, a "Practicing Self-Care" section with an animated accordion (warm-up/cool-down, physical therapy, nutrition & sleep, cross-training, mental health, body work), and a dark-themed cross-training section.
- Vanilla JS drives the accordion open/close with a rotating plus icon.

## 2025-10-01 · `a7c741b` · feat: Merge PR #36: image resizer editor layout update
- Merge commit (authored by Harsh Singh, committed by GitHub) integrating branch hsingh23/codex/update-image-resizer-ui-layout — commit 76757f1, branched from 5fac10e — into main as pull request #36.
- The merged change is confined to tools/Image Resizer and Cropper.html (100 insertions, 58 deletions): two-column editor grid, viewport-height canvas, and a select-based target-size picker.
- Clean, effectively fast-forward merge.

## 2025-10-01 · `6bd07e6` · feat: restructure resizer editor layout and size picker
- Updates tools/Image Resizer and Cropper.html (100 insertions, 58 deletions) after PR #34.
- Rebuilds the editor as a two-column grid at XL breakpoints (grid-cols-1 xl:grid-cols-2) with a viewport-height canvas (h-[60vh], min 320px, max 85vh) replacing the fixed-height tiers, and tightens the side panel.
- Replaces the target-size button group (highlightActiveSizeButton) with a dropdown select kept in sync with the custom width/height inputs (syncTargetSizeSelect, handleTargetSizeSelectChange).

## 2025-10-01 · `7b4e9a3` · feat: Merge PR #34: image resizer zoom and layout improvements
- Merge commit (authored by Harsh Singh, committed by GitHub) integrating branch hsingh23/codex/improve-image-resizer-ui-and-preview — commits 50079a3 and 350491b, branched from 03471be — into main as pull request #34.
- Combined effect on tools/Image Resizer and Cropper.html relative to main: pinch, wheel, and Safari-gesture zoom with clamped/synced zoom state, a redesigned taller-canvas layout, and removal of the bulk/ZIP download helpers.

## 2025-10-01 · `e54fd05` · feat: add wheel and gesture zoom, redesign resizer layout
- Updates tools/Image Resizer and Cropper.html (159 insertions, 173 deletions) on top of 50079a3.
- Adds mouse-wheel/trackpad zoom (handleWheelZoom with exponential intensity) and Safari gesture-event zoom (handleGestureStart/Change/End) alongside the existing pinch support.
- Restructures the page layout — taller canvas (360/480/640px tiers), wider gutters, restyled full-width-to-auto download buttons, and a sectioned editor placeholder.

## 2025-10-01 · `5708fec` · feat: Merge PR #33: poster creator UI improvements
- Merge commit (authored by Harsh Singh, committed by GitHub) integrating branch hsingh23/codex/improve-ui-and-ux-for-poster-creator — commit f012e53, which branched from 03471be — into main as pull request #33.
- The merged change is confined to tools/Poster Creator.html (358 insertions, 170 deletions): restyled "Poster Lab" controls sidebar, indigo palette, grid-layout quick actions, and new quick-styling controls (color swatches with live preview, margin readout).
- Clean merge on top of 53cefa8.

## 2025-10-01 · `cb0c5ad` · feat: Merge PR #32: flexible durations and legend in calendar visualizer
- Merge commit (authored by Harsh Singh, committed by GitHub) integrating branch hsingh23/codex/add-duration-specifications-in-calendar-visualizer — commit 3e2d535, which branched from 03471be — into main as pull request #32.
- The merged change is confined to tools/Calendar Timeline Visualizer.html (364 insertions, 98 deletions): friendly duration parsing (days/weeks/months), a day-unit timeline engine with contrast-aware segments, and a new on-screen legend.
- Clean merge with no conflicts.

## 2025-10-01 · `22cd335` · feat: add pinch zoom to image resizer
- Updates tools/Image Resizer and Cropper.html (216 insertions, 96 deletions).
- Adds two-finger pinch-to-zoom on the crop canvas via getTouchDistance/getTouchMidpoint with midpoint-anchored zoom origins and initial-pinch state tracking.
- Introduces MIN_ZOOM/MAX_ZOOM constants with clampZoom() and updateZoomDisplay() so the slider and percentage readout stay synchronized, sets touch-action: none on the canvas, and relabels the zoom panel with clearer hints.

## 2025-10-01 · `0a2fe4a` · feat: restyle poster creator controls and add color swatches
- Reworks tools/Poster Creator.html (358 insertions, 170 deletions), focusing on the controls sidebar.
- The panel gets a rounded "Poster Lab" branded header, an indigo/slate palette with rounded-xl inputs, a restyled pro-tip callout, and quick actions reorganized into a two-column grid.
- Functionally it adds background color swatches with a live color preview, an RGBA/hex entry hint, and a margin readout badge next to the margin slider.

## 2025-10-01 · `e25a5d2` · feat: accept flexible durations in calendar timeline visualizer
- Overhauls tools/Calendar Timeline Visualizer.html (364 insertions, 98 deletions).
- Phase durations move from an integer month count to a parseDurationInput() parser accepting friendly values like "3m" or "10d", normalized to days (durationDays) with friendly re-formatting.
- The timeline engine is rebuilt around day units (buildDayUnits, assignPhasesToDays, compressSegments) feeding month/week/day views, with gradient segments, luminance-based contrast-aware text colors, and tooltips.

## 2025-09-24 · `d7faad1` · feat: Merge PR #31: paste support and blank canvas in image tool
- Merge commit (authored by Harsh Singh, committed by GitHub) bringing branch hsingh23/codex/update-image-resizer-to-allow-blank-images — i.e. commit 0c306a9, which branched from ce87d32 — into main as pull request #31.
- The merge is clean, with the combined change confined to tools/Image Resizer and Cropper.html (173 insertions, 59 deletions): clipboard paste support plus background-only/blank-canvas mode.
- Fast-forward-equivalent integration of reviewed Codex-generated work.

## 2025-09-21 · `4afbbc1` · feat: accept pasted images and blank canvas in image resizer
- Updates tools/Image Resizer and Cropper.html (173 insertions, 59 deletions).
- Adds a document-level `paste` event handler (handlePasteEvent) that imports images straight from the clipboard, and refactors file ingestion into a shared processImageFile() helper with fallback names like `pasted-image-<timestamp>` plus success/error toasts.
- Also adds setBackgroundOnlyMode(), a "Background Only Mode" that lets the editor operate on a blank canvas with a default target size when no image is loaded, remembering and restoring the previously active image.

## 2025-08-28 · `6d0b7ea` · chore: empty save of Invoice.html
- Empty commit — the tree is identical to its parent f250ae2 (zero-line diff, `git show` reports no file stats).
- The message claims "Update tools/Invoice.html" but no content changed.
- Most likely an accidental re-save via the GitHub web editor that produced no effective diff.

## 2025-08-28 · `118cf4c` · feat: persist invoice drafts and handle discounts
- Rewrites tools/Invoice.html (1144 insertions, 812 deletions) the same day it was created.
- Substantive additions include a localStorage-backed draft system (safe wrapper plus save/load for every form field), auto-generated invoice numbers (generateInvoiceNumber), default invoice/due dates, calculated-rate helpers, and discount handling that shows a discount row in the preview for friend/student coupons.
- The diff also normalizes the file's odd double-blank-line formatting, which inflates the line counts.

## 2025-08-28 · `fc27f12` · feat: add AI-powered invoice generator
- Creates tools/Invoice.html (859 lines, a new file despite the "Update" message): a single-page "AI-Powered Invoice Generator" with forms for company/client details, invoice number and dates, service description, hours and rate, payment method/terms, and coupon codes (FRIEND20/STUDENT50/LOYALTY15).
- It renders a live invoice preview and offers a print-based PDF download.
- It integrates the Gemini 2.5 Flash API (key entered by the user) to auto-extract invoice fields from natural-language input.

## 2025-08-21 · `e095391` · chore: list tempo.privacyfirstapps.org in external-sites.csv
- Adds a single CSV row `https://tempo.privacyfirstapps.org/,true` to external-sites.csv, inserted in alphabetical order between ical-genius.privacyfirstapps.org and txt-to-srt.netlify.app.
- The `true` cache flag matches the neighboring entries.
- This catalog appears to drive which externally hosted tools are listed/aggregated by the site.

## 2025-08-21 · `44db452` · chore: remove zofia.html prototype page
- Removes tools/zofia.html in its entirety (116 deletions), exactly reversing the file added in 7b56396 the previous day.
- No other files are touched, so no dangling references remain.
- The tree simply loses the prototype page.

## 2025-08-20 · `fbc365d` · feat: add zofia.html link-grid mock page
- Creates tools/zofia.html, a new 116-line static page (despite the "Update" message) with a black background and a responsive CSS grid of six identical white cards.
- Each card holds a blurred gray placeholder image and links to zzzoofia.com pages (home, contact, novus, about, shows, Smithsonian Folkways).
- The page is plain HTML/CSS with no JavaScript and no integration with the rest of the site.

## 2025-08-20 · `90aae5e` · build: Add development script to package.json for local server
- Adds a "dev": "npx serve ." script to package.json alongside the existing generate script, so `npm run dev` starts a local static file server for the repo root.

## 2025-08-19 · `766d55e` · fix: Fix background color preservation and add hex color input
- Two changes to tools/Image Resizer and Cropper.html.
- First, removes the automatic reset to #FFFFFF when entering background-only mode without a stored version, so the current background color is preserved when toggling the mode.
- Second, adds a #hexColorInput text field beside the color picker with real-time two-way sync, #RRGGBB regex validation, an error toast plus value revert on invalid blur input, and monospace styling.

## 2025-08-19 · `e1894fa` · fix: Fix image dragging functionality
- Follow-up fix in tools/Image Resizer and Cropper.html so dragging works in the new background-only mode: startPan's guard now passes when originalImageToDraw is null if isBackgroundOnlyMode is set, and applyPanConstraints returns early in background-only mode since there is no image to constrain.
- Image-mode behavior is unchanged.

## 2025-08-19 · `91ac69d` · fix: Fix dragging functionality for small images
- Fixes panning in tools/Image Resizer and Cropper.html for images smaller than the canvas.
- Removes the startPan early-return that disabled dragging entirely for small images, and rewrites applyPanConstraints so small images can be positioned anywhere from edge to edge (min 0-drawWidth to max canvas width/height) while large images remain constrained to keep at least part visible.

## 2025-08-19 · `c56dae9` · feat: Add background-only mode option
- Adds a "Background only (no image)" checkbox to tools/Image Resizer and Cropper.html with an isBackgroundOnlyMode state.
- When enabled, the tool uses a sentinel activeImageId, skips image loading/zoom logic, renders a solid background color on the canvas, stores per-size versions separately in window.backgroundOnlyVersions, and updates download handlers to export background-only images individually or in a ZIP.
- Existing image-mode logic is branched behind an else path with guards updated to allow a null image.

## 2025-08-19 · `c7fb03a` · feat: Add multiple aspect ratio sizes with base and 1.5x multiplier options
- Extends the PREDEFINED_SIZES list in tools/Image Resizer and Cropper.html with eight new presets covering 16:9, 9:16, 4:3, and 3:4 aspect ratios at base and 1.5x resolutions (e.g. 1600x900/2400x1350), grouped with comments.
- Also replaces the placeholder example.com og:url and twitter:url meta values with the real tools.privacyfirstapps.org URL for this tool.

## 2025-08-03 · `5e663ef` · chore: empty duplicate save of Poster Creator.html
- An empty commit whose tree is identical to its parent f27aa23a9ebfecd7f01d3362aabfc231dbb4e3c2 (git diff-tree shows no file changes).
- It was created one second after the parent, almost certainly an accidental duplicate commit with nothing staged.

## 2025-08-03 · `666088c` · style: reformat Poster Creator with Prettier
- Reformats tools/Poster Creator.html (1148 insertions, 838 deletions) with deep re-indentation, double quotes, and Prettier-style multi-line element attributes (split input/select/button tags, `><input` artifact patterns).
- The sets of element IDs and JS functions before and after are identical; no logic changes.

## 2025-08-03 · `66327d0` · docs: Update header text to emphasize privacy and data protection
- Changes the index.html header title from "UpTooled" to "Privacy First Tools" and rewrites the tagline from "Browse handy utilities and preview them inline" to "Browse handy utilities on a website that doesn't track you or sell any of your data".

## 2025-08-03 · `9eefd72` · feat: Add Prettier button to main toolbar and enhance CSS formatting
- Adds a second Prettify button (#prettify-main) to the editor's main toolbar alongside Save/Rename/Preview/Delete, wired to the same prettifyCode handler, and loads Prettier's parser-postcss.js for CSS-in-HTML support.
- Expands the prettier.format options with htmlWhitespaceSensitivity: 'css', singleQuote: false, bracketSameLine: false, and vueIndentScriptAndStyle: true for better embedded CSS/JS formatting.

## 2025-08-03 · `de1cbd1` · style: normalize indentation and quotes in timeline tool
- A second formatting pass over tools/Calendar Timeline Visualizer.html (164 insertions, 129 deletions) that deepens CSS/JS indentation and normalizes string quotes (e.g. 'Inter' to "Inter").
- Every changed line pair is whitespace- or quote-only; no logic, markup structure, or IDs change.

## 2025-08-03 · `c07454f` · style: reformat Calendar Timeline Visualizer
- Reformats tools/Calendar Timeline Visualizer.html (1101 insertions, 901 deletions) with consistent indentation and multi-line attribute formatting, characteristic of an automated formatter (Prettier).
- The set of functions and element IDs is unchanged; the description and keywords SEO meta tags are removed while the Open Graph/Twitter tags remain.

## 2025-08-03 · `3772e8d` · feat: add file preview and bookmarkable edit URLs
- Adds a full-screen preview modal to the edit page that renders the current file's HTML via a blob URL in an iframe, closable via Escape, click-outside, or the close button.
- Integrates Prettier 2.8.8 (standalone + HTML parser) to format editor content via a Prettify button.
- Adds a Back to Tools button using hash-based routing, and updates the ?file= URL query parameter (debounced, via replaceState) when files load, change, or are deleted so files can be bookmarked.

## 2025-08-03 · `ae25852` · feat: add dark mode toggle and SEO to timeline visualizer
- Rewrites tools/Calendar Timeline Visualizer.html (897 insertions, 527 deletions) to add a dark mode toggle persisted in localStorage with a body.dark-mode CSS override layer, SEO/Open Graph/Twitter meta tags, the Inter font, and a checkbox-based theme switch in the UI.
- The file is also re-indented throughout (leading whitespace stripped), which inflates the diff.
- Core timeline generation, phase drag-and-drop, and PNG/SVG export logic are unchanged.

## 2025-08-03 · `7bf988b` · fix: use addEventListener for matchMedia color scheme changes
- Refactors the prefers-color-scheme listener in edit.js to call mediaQuery.addEventListener('change', ...) with a fallback to the deprecated addListener for older browsers.
- This keeps the CodeMirror theme switching working in modern browsers where addListener is deprecated (and eventually removed).
- Despite the commit message, the diff contains no sidebar toggle functionality.

## 2025-08-03 · `3db679b` · style: use muted color at full opacity for sidebar placeholders
- Adds a CSS rule in edit.html targeting #sidebar .mui-textfield input::placeholder to set color to var(--muted) and opacity to 1.
- This makes placeholder text in the sidebar input fields clearly visible instead of the browser-default semi-transparent gray.

## 2025-08-03 · `07405f5` · feat: Add dynamic theme support for CodeMirror based on user color scheme preference
- Loads the solarized CodeMirror theme CSS in edit.html and adds a getColorScheme() helper in edit.js based on prefers-color-scheme.
- The editor initializes with 'solarized light' or 'solarized dark' accordingly, and a matchMedia listener updates the theme live when the OS preference changes.

## 2025-08-03 · `64c6b0a` · fix: refresh CodeMirror after unhide and load
- Adds editor.refresh() calls (deferred via setTimeout) in three places in edit.js: after showing the editor section in hideAuth(), after clearing content on a 404, and after loading file content.
- CodeMirror fails to render correctly when initialized or updated while its container is hidden, so these refreshes force a re-render.
- The 10ms timeout lets the browser complete layout before the refresh.

## 2025-08-03 · `8079e16` · feat: add off-canvas file sidebar for mobile
- Turns edit.html's mobile layout into a slide-in drawer: the sidebar becomes position:fixed at left:-100% with a .mobile-open state, backed by a .mobile-overlay scrim and a fixed circular .mobile-file-toggle button that swaps folder/close icons. edit.js adds initMobileToggle with open/close helpers, auto-closes the drawer when a file is selected on narrow viewports, and moves the action buttons into a fixed bottom bar.
- Desktop is unaffected.

## 2025-08-03 · `e21c268` · style: align search icons; add slide-on-hover to floating buttons
- Small CSS-only tweak: moves the Font Awesome search icons from 1rem/0.75rem to 1.25rem/1rem left offsets in index.html and edit.html to align inside wider inputs, and adds translateX(20px) plus solid 0.9-alpha hover fills to all floating button variants so they scoot toward the content on hover.

## 2025-08-03 · `e3f6cdf` · style: restore solid button hovers; unclamp tool-info height
- Two-line fix in index.html: restores solid hover backgrounds (rgba alpha 0.9) on .floating-btn that the previous commit had reduced to near-invisible 0.05 alpha, and removes the max-height:60vh/overflow-y:auto clamp on #tool-info so the panel shows full content.

## 2025-08-03 · `3d64a87` · style: use display:none for hidden chrome; ghost floating buttons
- Changes #header.hidden and #search-container.hidden from transform/opacity animation to plain display:none, and inverts the floating buttons from solid colored fills to translucent 0.1-alpha "ghost" backgrounds with 0.05-alpha hovers.
- Floating controls shift off-canvas (left:-20px), the info panel uses var(--panel) with 60vh max-height and a top shadow, and keyword tags get bolder styling.

## 2025-08-03 · `fb8ed8c` · style: hide header/search in viewer; color-code floating buttons
- Adds .hidden classes (translateY/opacity transition) to #header and #search-container, toggled by showGrid/showViewer so the chrome slides away when a tool is opened.
- Floating action buttons grow to 48px and gain per-action colors (back red, search green, info amber, edit purple) with matching hover shadows; the info panel becomes more opaque.

## 2025-08-03 · `9a5fe9d` · refactor: replace sidebar list with full-screen search overlay
- Rebuilds index.html (-359/+308) around a new full-screen #search-overlay with #search-container, renderSearchResults, and floating search/info buttons replacing the old sidebar list and toggle logic, plus responsive tweaks.
- In edit.js, mostly whitespace normalization plus a micro-optimization replacing forEach with an indexed loop in base64EncodeUtf8.

## 2025-08-03 · `ed63e85` · refactor: inline index.js, switch to toolbar layout
- Deletes index.js entirely (246 lines) and moves its behavior inline into index.html, which gains 327 net lines: body becomes a flex column with a centered topbar, a new #content-wrapper, and a desktop media query that turns the sidebar into a horizontally scrolling toolbar.
- Tool cards are fixed at 600px height with 420px frames, and the index.js preload hint is dropped.

## 2025-08-03 · `1b482bf` · refactor: drop Dexie pipeline, render live iframes
- Strips the Dexie IndexedDB store and html2canvas screenshot pipeline out of index.js (~180 lines changed) so tool cards always render live iframes instead of captured images.
- Simultaneously overhauls index.html and edit.html with the modern design system, Font Awesome icons, keyword tags, and glassmorphism effects; Plan.md grows substantially.

## 2025-08-03 · `49b7eae` · style: apply dark-first visual refresh across index and edit pages
- Restyles index.html and edit.html (640 insertions, 534 deletions) with a dark-first design system: Inter font family, gradient backgrounds with radial overlays, 12px radii, refined shadows, color-mix() hover states, focus-visible outlines, prefers-reduced-motion support, iOS safe-area padding, and "UpTooled" branding in the topbar.
- Plan.md is updated alongside.

## 2025-08-03 · `9235295` · feat: add favicon.png and reference it in index.html
- Adds a 79,563-byte favicon.png to the repo root and inserts <link rel="icon" href="favicon.png"> in index.html's head.
- This is the entire change despite the message claiming broad functionality and performance work.

## 2025-08-03 · `1b440b3` · feat: lazy-load tool previews and improve mobile UX
- Reworks the gallery for mobile: mobile-first CSS with sticky topbar and menu toggle, an IntersectionObserver in index.js that lazily loads card iframes only when scrolled near (rootMargin 200px) and unloads them after screenshot capture, and Dexie-backed failure memoization (saveFailure/hasFailure) to stop retrying iframe captures that crash.
- Also stacks the edit page with sticky action buttons, auto-closes the sidebar on tool selection, and rewrites Plan.md.

## 2025-08-03 · `997c156` · fix: handle Unicode safely in GitHub file operations; refresh UI
- Adds UTF-8-safe base64EncodeUtf8/base64DecodeUtf8 helpers in edit.js and replaces raw btoa/atob in loadFile, saveCurrentFile, and renameCurrentFile, fixing crashes when saving files containing non-Latin1 characters.
- Also adds the GitHub API v3 Accept header, extends CodeMirror syntax highlighting to js/css/json, and rewrites Plan.md plus index/edit HTML with a CSS-variable theme, dark/light support, and mobile-responsive polish (909 insertions across 5 files).

## 2025-08-03 · `33a8d1b` · chore: remove Gemini-powered Dictation tool page
- Deletes the 1501-line tools/Dictation.html page, an AI dictation and note-polishing app powered by the Gemini API.
- No other files reference it in this commit.

## 2025-08-03 · `48643be` · feat: add color palette generator at tools/colors.html
- Adds a new 940-line self-contained tool, "Color Palette Generator", at tools/colors.html.
- It extracts colors from images, suggests color harmonies, and exports design schemes, with full SEO/Open Graph/Twitter metadata, Font Awesome styling, and a gradient-themed layout consistent with the other Privacy First Apps tools.

## 2025-07-24 · `2c3660e` · chore: add txt-to-srt.netlify.app to sites CSV
- Appends https://txt-to-srt.netlify.app/,true to external-sites.csv (also adds a trailing newline to the previous row).
- Registers a new external tool site for the gallery to surface.

## 2025-07-20 · `4c4d296` · chore: re-add images.mavo.stream to sites CSV
- Adds the https://images.mavo.stream/,true row back into external-sites.csv so the file now lists webcomponents, images.mavo.stream, and ical-genius.
- This effectively reverts the removal made minutes earlier in 74a36ad8.

## 2025-07-20 · `1430337` · chore: swap mavo site for ical-genius in sites CSV
- Swaps the external-sites.csv row for https://images.mavo.stream/ for https://ical-genius.privacyfirstapps.org/, keeping cache=true.
- The CSV drives which external sites the gallery links/embeds.

## 2025-07-17 · `0292c3f` · feat: add client-side geolocation extractor at tools/test.html
- Adds a new 208-line single-page tool (tools/test.html) titled "Geolocation Data Extractor".
- It uses the File System Access API (showDirectoryPicker) and the exifr library to scan a folder of photos client-side, extract GPS coordinates and timestamps from EXIF, and offer a JSON download.
- Includes a warning that video geolocation is unavailable due to browser limits.

## 2025-06-11 · `1010ca2` · fix: Merge PR #29: fix new-file loading and popup feedback
- GitHub-generated merge of PR #29 from codex/fix-edit-pages-api-and-alert-handling, landing 04bcb41 on main.
- The editor now treats 404 responses as an empty new file (allow404 in apiRequest), encodes each path segment of the GitHub contents URL, and replaces blocking alerts with an auto-dismissing toast popup added to edit.html.

## 2025-06-11 · `d4002dd` · chore: rename Dictation.html to "Dictation App.html"
- Pure file rename with no content change, committed 22 seconds after the file was added in d141806: tools/Dictation.html becomes tools/Dictation App.html.
- GitHub web UI generated the default rename message.

## 2025-06-11 · `0d0ace9` · feat: add Gemini-powered dictation tool
- Adds a new 1501-line self-contained tool, tools/Dictation.html: an AI dictation and note-polishing app using the @google/genai SDK (via esm.sh import map) and marked for markdown output.
- Includes dark/light theming, a live audio waveform visualizer, recording interface, tabbed UI, and extensive SEO/Open Graph meta tags.
- Committed via the GitHub web UI with a default "Update <file>" message despite being a new file; no trailing newline at end of file.

## 2025-06-11 · `4570090` · fix: allow 404 on load and replace alerts with popups
- edit.js/apiRequest gains an allow404 option so loadFile treats a 404 as an empty new file instead of an error, enabling creation of files that do not yet exist. repoUrl now encodes each path segment separately (fixing names with spaces).
- All alert() feedback (save/delete/rename/errors) is replaced by a transient #popup toast added in edit.html.

## 2025-06-10 · `bbd32cc` · chore: rename Calendar Timeline Visualizer to Visualizer2
- Pure file rename with no content change: tools/Calendar Timeline Visualizer.html becomes tools/Calendar Timeline Visualizer2.html.
- Committed via the GitHub web UI, which generated the 82-character default rename message.
- Note the gallery metadata (tools.json) still references the original filename, so the entry goes stale until regenerated.

## 2025-06-10 · `2627e91` · feat: Merge PR #23: restore keyword-based related tools
- GitHub-generated merge of PR #23 from sjp6au-codex/update-script-to-show-related-tools, landing commit e7711e0 after the PR #22 revert.
- Re-introduces the keyword-matching related-tools feature only (generate.js scoring, tools.json related arrays, "Similar:" link rendering; 64 insertions) without the reverted layout rework.

## 2025-06-10 · `959ecb9` · fix: Merge PR #26: revert related-tools feature
- GitHub-generated merge of PR #26 (branch revert-22-codex/update-script-to-show-related-tools), landing revert commit 0492f4e on main.
- Removes PR #22's keyword-based related tools, tools.json changes, and the accompanying responsive layout rework, restoring the prior "Tool Gallery" UI (186 deletions, 23 insertions).

## 2025-06-10 · `2f71759` · fix: Revert "Show similar tools using keyword matches"
- Reverts the entire content of PR #22: removes the keyword-matching code from generate.js, the related arrays and title trims from tools.json, the "Similar:" link rendering from index.js, and also rolls back the whole responsive layout rework (app bar, off-canvas sidebar, Material icons, related-card grid, info collapse controls) back to the previous "Tool Gallery" design.
- The message has no "This reverts commit" body and does not mention that the layout rework was reverted along with the feature.

## 2025-06-10 · `b90a602` · feat: Merge PR #22: show similar tools using keyword matches
- GitHub-generated merge of PR #22 from codex/update-script-to-show-related-tools.
- First-parent diff (~186 insertions) combines the keyword-matching related-tools feature (generate.js, tools.json, link rendering) with the responsive layout rework from 62370ca: app bar, collapsible mobile sidebar, Material icons, and related-tool screenshot cards.
- This merge was reverted shortly afterwards in PR #26.

## 2025-06-10 · `1eed463` · feat: add related-tools links based on shared keywords
- Identical change to f9c9f79 (same diff against its base): generate.js scores shared keyword tokens and writes top-three related tools into tools.json, and index.js renders clickable "Similar:" links in the viewer info panel.
- This is the related-tools work re-applied on the pre-revert base as branch sjp6au-codex/update-script-to-show-related-tools, later merged as PR #23 after PR #22 was reverted.

## 2025-06-10 · `0084347` · feat: rework responsive layout and related-tools display
- Major index.html/index.js rework (142 insertions, 41 deletions): adds a "Privacy First Tools" top app bar with a hamburger toggle, makes the sidebar slide off-canvas on mobile (auto-hidden in viewer mode), swaps text buttons for Material icons, and replaces the plain "Similar:" link list with a screenshot-card grid (renderRelated) beside the description.
- Also adds collapse/expand controls for the tool info panel (close button plus floating FAB).

## 2025-06-10 · `3603938` · feat: add related-tools links based on shared keywords
- Teaches generate.js to compute related tools by scoring shared keyword tokens between tools and storing the top three matches per tool in tools.json. index.js renders these as clickable "Similar:" links in the viewer info panel (new #tool-related paragraph in index.html), and two SEO-style tool titles in tools.json are trimmed to plain names.
- This commit was later re-landed as e7711e0 after PR #22 was reverted.

## 2025-06-10 · `9c14398` · feat: Merge PR #18: add edit link and token-based file loading
- GitHub-generated merge of PR #18 from codex/add-github-token-check-and-file-edit-option.
- Brings b1866f0's changes into main: an "Edit File" button in the viewer (visible only with a stored GitHub token), navigation to edit.html?file=<path>, and editor-side loading of the requested file.

## 2025-06-10 · `e28ac2b` · fix: correct Calendar Timeline Visualizer heading
- One-line change in tools/Calendar Timeline Visualizer.html: the contenteditable h1 heading changes from "Project Timeline Generator" to "Calendar Timeline to Image Visualizer".
- Committed via the GitHub web UI (default "Update <file>" message).

## 2025-06-10 · `efc8976` · feat: add Edit File button and edit.html?file= support
- Adds an "Edit File" button to the gallery viewer controls (index.html), shown only when a gh_token is in localStorage; clicking it navigates to edit.html?file=<selected tool path> (index.js tracks selectedTool). edit.js reads the file query parameter and opens that file in the editor instead of the default external-sites.csv.

## 2025-06-10 · `bcc263e` · feat: Merge PR #15: add file rename/delete options to editor
- GitHub-generated merge of PR #15 from codex/update-github-repository-configuration-and-file-operations.
- First-parent diff is edit.html (+9) and edit.js (175 lines, +120/-55): the branch hardcodes the target repo, adds rename and delete file operations to the edit page UI, and includes the auth-flow/error-handling rework (apiRequest helper) from commit 6f80b2e.

## 2025-06-10 · `bbcb5b6` · fix: centralize GitHub API requests and error handling
- Reworks edit.js (66 insertions, 59 deletions) to introduce a shared apiRequest() helper used by loadFile, saveCurrentFile, deleteCurrentFile, renameCurrentFile and listFiles.
- The helper attaches auth headers, offers a re-auth prompt on 401/403, and surfaces request/network failures.
- Startup logic is also reworked: showAuth()/hideAuth() control the panels, a saved token triggers initRepo() directly, and the auth panel is shown when no token exists.

## 2025-06-10 · `c242e69` · feat: Merge PR #16: add iframe preview caching with Dexie
- GitHub-generated merge of PR #16 from codex/add-iframe-image-caching-with-dexie into main.
- Adds iframe/tool-preview caching built on Dexie (IndexedDB): index.js gains ~76 lines of cache logic and index.html is adjusted (preloads/cache hooks), 82 insertions across the two files.
- The merge itself carries no hand-written changes beyond the branch contents.

## 2025-06-10 · `73959c8` · perf: cache tool previews
- Adds preview caching to the tool gallery using Dexie (IndexedDB database 'toolScreens' keyed by file) and html2canvas: once a tool iframe loads, its contents are captured to a PNG data URL and stored.
- Grid cards and the viewer show the cached screenshot immediately while the iframe loads behind it, then swap to the live iframe, and card iframes only load when there is no cached shot.
- Also adds a #viewer-placeholder img and object-fit styling for the captured images.

## 2025-06-10 · `ae457b9` · chore: Rename tools/Poster Creator.html to tools/Quick Block Text Poster.html
- Pure rename (100% similarity, no content change): tools/Poster Creator.html becomes tools/Quick Block Text Poster.html.
- Since tool names/URLs derive from filenames, the tool's displayed name and path change accordingly.
- The commit-style message with no body is typical of GitHub's rename-button commits.

## 2025-06-10 · `09f371d` · chore: Delete tools/hello arta.html
- Removes the one-line placeholder file tools/hello arta.html (the "Hello I'm harsh" / "Yolo" test page).
- The file disappears from the tools directory and the site's tool listing.

## 2025-06-10 · `e62a038` · feat: Hardcode repo and add rename/delete
- Removes the owner/repo input fields from the editor and hardcodes the target as hsingh23/uptooled (shown as static text); auto-auth now only needs a stored token.
- Adds Rename and Delete buttons next to Save: delete issues a GitHub Contents API DELETE with the blob SHA after a confirm() and cleans up the sidebar entry, while rename prompts for a new name and PUTs the content to the new path, updating the sidebar link and SHA tracking.

## 2025-06-10 · `57f998d` · chore: add "Yolo" title to hello arta placeholder page
- One-line edit to tools/hello arta.html: prepends "<title>Yolo</title>" before the existing heading, giving the placeholder page a browser tab title of "Yolo".
- Again consistent with a save made through the edit.js editor (no EOF newline).

## 2025-06-10 · `e2abc74` · chore: change hello arta greeting from arta to harsh
- One-line edit to tools/hello arta.html: the heading text changes from "Hello I'm arta" to "Hello I'm harsh".
- Nothing else changes; the file still lacks an EOF newline, consistent with edits made through the edit.js GitHub-contents editor.

## 2025-06-10 · `ab8ad9a` · feat: Merge PR #13 rebuilding the editor with CodeMirror
- Merge commit (via GitHub) bringing branch codex/improve-editing-page-with-github-token-and-ui-enhancements into main.
- Contains commit 25c2c06, which rebuilds edit.html/edit.js with CodeMirror syntax highlighting, a sidebar file list (external-sites.csv plus tools/ from the GitHub API), new-file creation, and credential validation that gates access to the editor.

## 2025-06-10 · `0f5467b` · fix: Merge PR #14 fixing gallery index scrolling
- Merge commit (via GitHub) bringing branch codex/enable-scrolling-in-index-hdl into main.
- Contains the single commit 4055f73, which changes the index.html body from overflow: hidden to overflow-x: hidden / overflow-y: auto so the tools grid can scroll vertically.

## 2025-06-10 · `d7ba787` · fix: Enable scrolling on main grid
- One-line CSS fix in index.html: the body previously had overflow: hidden with height 100vh, which clipped the tools grid when it exceeded the viewport.
- Changes it to overflow-x: hidden; overflow-y: auto so the main grid can scroll vertically.

## 2025-06-10 · `c7a6536` · feat: rebuild editor with CodeMirror, file sidebar, auth gate
- Reworks the edit.html/edit.js repo editor: replaces plain textareas with CodeMirror (line numbers, htmlmixed/xml/js/css modes selected by file extension), and adds a sidebar that lists external-sites.csv plus all files in tools/ fetched from the GitHub API, with a field to add new tool files.
- Saving auth now validates credentials by fetching external-sites.csv and only reveals the editor on success, auto-loading the CSV; stored credentials auto-authenticate on page load.

## 2025-06-08 · `7e495bd` · feat: add placeholder "hello arta" tool page
- Creates a new one-line file tools/hello arta.html containing only "<h1>Hello I'm arta</h1>" (no EOF newline).
- This makes the page appear in the site's tools listing.
- The commit message says "Update" but the file is actually new — typical of a file created via the GitHub Contents API PUT from the edit.js editor.

## 2025-06-08 · `e649937` · chore: simplify Image Resizer and Cropper page title
- One-line change to the Image Resizer and Cropper tool's <title> tag: replaces "Free Image Resizer & Cropper - Online Tool" with "Image Resizer and Cropper".
- Description and keyword meta tags are unchanged.

## 2025-06-08 · `facbe70` · chore: simplify Masonry Collage Generator page title
- One-line change to the Masonry Image Collage Generator tool's <title> tag: replaces the SEO-styled "Free Masonry Image Collage Generator | Create & Download Collages" with the plain "Masonry Image Collage Generator".
- No other meta tags are touched.

## 2025-06-08 · `3b18412` · chore: remove trailing newline in external-sites.csv
- One-line data change to external-sites.csv: the final line (https://images.mavo.stream/,true) loses its trailing newline, so the file now ends without an EOF newline.
- Likely produced by the new edit.js GitHub-contents editor, whose base64 round-trip writes back exactly the textarea content.

## 2025-06-08 · `07e11b0` · feat: Merge PR #10 adding poster undo/redo and external-sites loading
- Merge commit (via GitHub) bringing branch codex/add-undo-redo-with-shortcuts-and-buttons into main.
- Combines two feature commits: undo/redo with keyboard shortcuts and buttons in the Poster Creator, and support for loading external sites (new external-sites.json, plus changes to generate.js, index.html, index.js, and a large Poster Creator update — 291 insertions across 5 files).

## 2025-06-08 · `ad59524` · feat: Merge PR #11 adding the CSV/tool file editor
- Merge commit (via GitHub) bringing branch codex/create-/edit-page-for-editing-csv-and-html-files into main.
- Introduces edit.html and edit.js (129 lines), a browser-based editor that loads and saves external-sites.csv and tool HTML files through the GitHub Contents API using credentials stored in localStorage.

## 2025-06-08 · `031f976` · feat: granular color/shadow controls, UI-aware undo/redo
- Overhauls the Poster Creator tool's styling controls: replaces the color picker + opacity slider pairs with single rgba() text inputs for background, primary, secondary, and per-item editor colors, and expands the simple shadow checkbox into x/y/blur/color shadow fields.
- Undo/redo now snapshots the full UI control state (text, margin, fonts, colors, shadow params) so control-panel changes are revertible, and undo/redo buttons disable when their stack is empty.
- Also removes the fullscreen button and its canvas-sizing logic.

## 2025-06-08 · `da44fe1` · feat: Add edit page for CSV and tool files
- Adds a new edit.html page and edit.js script that provide a browser-based editor for repository files.
- The page lets the user store GitHub credentials (token/owner/repo in localStorage), load and save external-sites.csv, and load/save arbitrary tool HTML files via the GitHub Contents API.
- Saves use base64-encoded content with blob SHA tracking for updates.

## 2025-06-08 · `6de32b1` · feat: add poster undo/redo and merge external sites into gallery
- Two related changes.
- In the poster tool, adds Undo/Redo buttons backed by 50-deep cloneable state stacks, snapshotting state on text/style/drag changes and on drag end.
- In the gallery, index.js now also fetches external-sites.json and merges those entries into the searchable tool list, and generate.js makes fetch failures non-fatal by returning a fallback entry keyed by `file` instead of `url`; commits a first generated external-sites.json.

## 2025-06-08 · `d5952e0` · chore: add images.mavo.stream to external sites list
- One-line addition of https://images.mavo.stream/ (cache flag true) to external-sites.csv so the generator fetches and indexes that site's metadata into external-sites.json.

## 2025-06-08 · `77fa725` · chore: Merge PR #8: update poster controls
- Merge commit bringing the codex/update-poster-controls branch into main, combining the poster tool work from 2d8fecb, dc0d154, and 7f6e035 (background image, JPEG export, per-item editor, opacity/strike/shadow styling, expanded fonts) plus the tools.json title update — 297 net insertions across the poster tool and its metadata.

## 2025-06-08 · `181f39f` · feat: add opacity, strike, and shadow styling to poster editor
- Adds opacity sliders for the background, primary/secondary text, and per-item editor (via a new hexToRgba helper and ctx.globalAlpha), plus strikethrough and drop-shadow toggles rendered on the canvas.
- Greatly expands the Google Fonts link and FONT_LIST with ~13 use-case categories (YouTube thumbnails, wedding invitations, etc.), and updates tools.json so the gallery title reflects the earlier rename to "Quick Block Text Poster".

## 2025-06-08 · `7318cf7` · fix: use 'y' cache flag to re-enable caching for webcomponents
- One-line change to external-sites.csv setting the webcomponents entry's cache flag from n to true.
- However, generate.js's parser only treats values starting with 'y' as cache-enabled, so 'true' effectively leaves caching disabled — the flag value does not match the parser's expectations.

## 2025-06-08 · `862a3aa` · chore: disable site cache for webcomponents entry
- One-line change to external-sites.csv flipping the cache flag for https://hsingh23.github.io/webcomponents/ from y to n, so the generator re-fetches the live page on each build instead of using site-cache/.

## 2025-06-08 · `be6c33e` · chore: Merge PR #9: enhance viewer navigation and controls
- Merge commit bringing the codex/update-navigation-and-hide-bottom-panel branch into main, applying the index.html/index.js changes from 37282f4: hash-based deep linking, a Back button, and the Show/Hide Info toggle in the tool viewer.

## 2025-06-08 · `f60fd4e` · feat: add per-item style editor to poster tool
- Adds a ctrl-click item editor modal to the poster tool for editing an individual text item's content, font, color, bold, and italic, with a Reset that returns the item to its primary/secondary style group.
- Introduces a `custom` flag so global style control changes only restyle non-customized items (or the current selection), and refines selection behavior so shift-click toggling and empty-canvas clicks don't clear multi-selections unintentionally.

## 2025-06-08 · `81f23d7` · feat: add hash deep-linking and viewer controls
- Adds a viewer control bar to index.html with Back and Hide Info buttons. index.js now encodes the selected tool's file path in the URL hash on selection, restores the correct tool from the hash on page load and on hashchange, and clears the hash via history.replaceState when returning to the grid — making individual tools bookmarkable and shareable.

## 2025-06-08 · `27a327a` · feat: add background image and JPEG export to poster tool
- Enhances tools/Poster Creator.html with a background image upload that becomes a draggable/resizable canvas object layered above the background color, and a working Download JPEG button using canvas.toBlob.
- Reworks hit-testing and multi-select (shift toggling, background included in the item list), fixes resize scaling for non-text items, renames the tool's title/heading to "Quick Block Text Poster", and resets selection state correctly on mouseup/mouseleave/touchend.

## 2025-06-08 · `61a24a8` · chore: point external-sites.csv at webcomponents site
- One-line change to external-sites.csv swapping the placeholder https://example.com entry for https://hsingh23.github.io/webcomponents/, with caching still enabled (y).

## 2025-06-08 · `2cb277a` · chore: Merge PR #6: add timeline view options and export fix
- Merge commit bringing the codex/add-customizable-timeline-view-options branch into main.
- Applies the Calendar Timeline Visualizer changes from 07a7ee1: month/week/day view toggles, units-per-row configuration, row-based rendering, and the export clipping fix.

## 2025-06-08 · `e1366e5` · chore: Merge PR #7: automate site metadata generation
- Merge commit bringing the codex/add-external-site-processing-with-caching branch into main.
- Combines the external-site generator work from 2ae455a with the Netlify consolidation from 91557ec, netting a single generate.js, netlify.toml, external-sites.csv, and removal of the old GitHub Actions workflow and generate-tools.js.

## 2025-06-08 · `0e8de65` · build: merge generators into generate.js and build on Netlify
- Merges generate-tools.js and generate-external-sites.js into a single generate.js whose main() runs both tools.json and external-sites.json generation, and deletes the separate scripts.
- Removes the GitHub Actions generate_tools.yml workflow in favor of a new netlify.toml that runs `node generate.js` with the repo root as the publish directory, and collapses the npm scripts to a single `generate` entry.

## 2025-06-08 · `9a3a124` · build: add external site metadata generator and run it in CI
- Adds generate-external-sites.js, which reads external-sites.csv (seeded with example.com), fetches each URL, extracts title/description/keywords meta tags, and writes external-sites.json; supports an on-disk site-cache/ directory for caching fetched HTML.
- Updates the GitHub Actions workflow to run both generators and commit the combined output, and adds the generate:external npm script plus a .gitignore entry for site-cache/.

## 2025-06-08 · `28f7534` · chore: regenerate tools.json for Masonry Collage Generator
- Bot commit from the GitHub Actions "Generate site data" workflow that regenerates tools.json after the new Masonry Image Collage Generator tool was added.
- Appends a 17-line entry with the tool's file path, title, description, and SEO keywords scraped from the HTML meta tags.

## 2025-06-08 · `b37497e` · feat: add Masonry Image Collage Generator
- Adds a new 971-line single-file tool, tools/Masonry Image Collage Generator.html, that lets users upload images/videos (files or folders) into a responsive masonry grid preview and compose them into a downloadable collage.
- It includes collage presets (width/columns/gap/background), canvas-based PNG/JPEG generation, an Imgur share option, image lightbox, and inline video playback controls with frame capture for video thumbnails.

## 2025-06-08 · `c12c614` · feat: add week/day views and units-per-row to timeline visualizer
- Adds Month/Week/Day view toggle buttons to the Calendar Timeline Visualizer that subdivide months into 4 weeks or 30 days, plus a configurable "Units per Row" input that wraps the timeline grid instead of grouping by year.
- Also reworks renderTimeline to chunk cells into rows and fixes PNG/SVG export by temporarily removing the overflow-x-auto class during capture so wide timelines are captured fully.

## 2025-06-08 · `5bbd566` · chore: sync tools.json title with renamed timeline tool
- Automated generate_tools workflow commit updating the Calendar Timeline Visualizer entry's title in tools.json to "Calendar Timeline to Image Visualizer", matching the HTML title change from 38ed8d6 32 seconds earlier.

## 2025-06-08 · `d6fd3b0` · chore: rename timeline tool title to reflect image export
- One-line change: the page <title> of tools/Calendar Timeline Visualizer.html changes from "Calendar Timeline Visualizer" to "Calendar Timeline to Image Visualizer".
- The next workflow run propagated the new name into tools.json (bot commit 414e225).

## 2025-06-08 · `2092c62` · chore: regenerate tools.json with Poster Creator entry
- Automated commit by the generate_tools workflow (the first successful bot push after the permissions fix in e9dfdb8) adding a tools/Poster Creator.html entry with its title, description, and keywords to tools.json.

## 2025-06-08 · `fc83144` · fix: grant workflow write permission to commit tools.json
- Adds `permissions: contents: write` to the build job in .github/workflows/generate_tools.yml (the only change, 2 lines).
- The next workflow run immediately succeeded in pushing an updated tools.json (bot commit a0571f0, 14 seconds later).

## 2025-06-08 · `3709d68` · feat: add Poster Creator tool
- Adds a 403-line single-file poster design tool at tools/Poster Creator.html.
- Layout is controls on the left, live canvas on the right, with a loading overlay.
- Offers 17 preloaded Google Fonts (Roboto, Lobster, Playfair Display, etc.) with per-font previews in the select dropdown, plus text, color, and layout customization and poster export.

## 2025-06-08 · `7c76a2d` · feat: Merge PR #5: show grid view when no tool selected
- Merges codex/fix-github-actions-permission-error-and-update-ui (commit 068e061) into main via pull request #5, landing the default grid view with viewer-on-selection behavior and the Image Resizer and Cropper entry in tools.json.

## 2025-06-08 · `d049224` · feat: show tool grid by default, viewer on selection
- Adds a responsive grid of tool cards (auto-fit min 280px, three columns at >=1000px) with iframe previews, shown by default when no tool is selected.
- Clicking a card (or sidebar item) switches to the full-height viewer; searching now re-filters the grid instead of auto-selecting the first match. tools.json gains the Image Resizer and Cropper entry with description and keywords.

## 2025-06-08 · `fe89364` · feat: add Image Resizer and Cropper tool
- Adds a 796-line self-contained tool at tools/Image Resizer and Cropper.html.
- Supports multi-image upload with a thumbnail sidebar, an interactive canvas with zoom/pan cropping, custom background colors, and preset output sizes aimed at favicons and app icons (Chrome extension, web app, social assets); batch export as ZIP via JSZip.
- Includes SEO/OpenGraph/Twitter metadata and Tailwind styling.

## 2025-06-08 · `2fd74ff` · feat: Merge PR #4: improve tool viewer UI with sidebar layout
- Merges codex/improve-home-page-design-and-responsiveness (commit 2ae7adb) into main via pull request #4, landing the sidebar-list plus iframe-viewer gallery layout with responsive stacking and the enriched tools.json metadata.

## 2025-06-08 · `ea72c29` · feat: revamp gallery layout with sidebar viewer
- Replaces the card-grid gallery with a two-pane layout: a searchable sidebar tool list on the left and a main pane that renders the selected tool in a full-height iframe, with title, description, and keywords shown beneath.
- Clicking a sidebar item loads that tool; searches with no match clear the viewer.
- Stacks vertically under 600px. tools.json gains a real description and keywords for the Calendar Timeline Visualizer.

## 2025-06-08 · `24e7f70` · refactor: Merge PR #2: replace React gallery with static implementation
- Merges miv722-codex/create-node-github-action-for-tools-landing-page into main via pull request #2 ("Speedy static gallery").
- Net effect on main: the React/Material-UI UMD gallery landed by PR #1 is replaced by the vanilla-JS + MUI-CSS static implementation with preload hints, and generated tools.json gains a trailing newline.

## 2025-06-08 · `881cdc1` · chore: Sync codex gallery branch with main before merge
- Update merge bringing main (through 76c5f7c) into miv722-codex/create-node-github-action-for-tools-landing-page, picking up the Calendar Timeline Visualizer SEO/guide/export updates from a66a6ca and the CNAME create/delete churn, so PR #2 could merge cleanly.
- Diffstat also reflects the branch's newline-bearing generator/gallery files against the first parent.

## 2025-06-08 · `e783d86` · feat: add static gallery pipeline with newline-terminated tools.json
- Parallel implementation of the tool-gallery task on branch miv722-codex/create-node-github-action-for-tools-landing-page (also parented on faeb32d).
- Adds generate-tools.js — same title/description/keywords scanner as 5e14873 but appending a trailing newline to tools.json — plus a GitHub Actions workflow to regenerate it, package.json, .gitignore, and a gallery (index.html/index.js) rebuilt as vanilla JS with the MUI CSS framework and preload hints instead of React/Material-UI UMD bundles.

## 2025-06-08 · `f2d06fb` · chore: remove CNAME to restore default GitHub Pages URL
- Deletes the CNAME file added 75 seconds earlier in f673e2f, dropping the tools.roomtolearn.org mapping and reverting GitHub Pages to the default github.io URL.

## 2025-06-08 · `c2147be` · chore: add CNAME for tools.roomtolearn.org custom domain
- Adds a one-line GitHub Pages CNAME file mapping the site to the custom domain tools.roomtolearn.org (no trailing newline).

## 2025-06-08 · `84be255` · feat: Merge PR #1: add tool index and generation workflow
- Merges branch hsingh23/codex/create-node-github-action-for-tools-landing-page (commit 5e14873) into main via pull request #1, bringing the tools.json generator, the generate_tools GitHub Action, and the React/Material-UI gallery landing page to the mainline.
- The merge diff is exactly 5e14873's 7-file, 152-line addition.

## 2025-06-08 · `cec7bba` · feat: add tools.json generator, CI workflow, and search gallery
- Introduces the gallery infrastructure on branch codex/create-node-github-action-for-tools-landing-page. generate-tools.js scans tools/*.html for title, meta description, and keywords and writes tools.json; .github/workflows/generate_tools.yml regenerates and commits tools.json on push to main/work; index.html + index.js implement a React (UMD) + Material-UI landing page listing tools as cards with live iframe previews and search across title, description, and keywords.
- Also adds package.json and .gitignore.

## 2025-06-08 · `0a368ca` · feat: add SEO metadata, usage guide, and style-complete SVG export
- Updates the Calendar Timeline Visualizer with SEO/OpenGraph/Twitter meta tags, a collapsible "How to Use This Tool" accordion guide, and a dedicated drag-handle icon for phase rows.
- SVG export now clones all document stylesheets and the Google Fonts link into the exported foreignObject so images match on-screen rendering.
- Also includes small responsive tweaks (smaller month cells/year labels on narrow screens) and ghost-class styling.

## 2025-06-08 · `f9f437f` · feat: add Calendar Timeline Visualizer tool
- Adds a self-contained 404-line single-file HTML tool at tools/Calendar Timeline Visualizer.html.
- It is an interactive project-timeline generator: an editable title, start month/year inputs, and add/remove/reorder phases via SortableJS drag-and-drop.
- Phases render as a color-coded month-grid calendar view, and the result exports to PNG (html2canvas) or SVG.

