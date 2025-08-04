I can give you a focused visual refresh without changing your data or logic. Below are drop‑in updates for index.html and edit.html that:

- Add a compact, sticky app bar with branding and actions
- Improve spacing, typography, and elevation
- Make cards denser yet more polished; better hover and focus states
- Improve mobile layout: collapsible sidebar, larger tap targets, sticky viewer controls, safe-areas, and iOS momentum scrolling
- Dark/light theming tuned for contrast
- Subtle animations and reduced layout shift
- Accessibility tweaks (focus outlines, prefers-reduced-motion)

Replace only the <style> blocks in index.html and edit.html with the ones below. No JS changes required.

index.html (replace the entire <style>...</style> section)
```html
<style>
  :root {
    --bg: #0b0f14;
    --surface: #0f1520;
    --panel: #0f1520;
    --elev: #121a27;
    --text: #e6edf3;
    --muted: #9aa4af;
    --border: #1f2937;
    --primary: #6ea8fe;
    --primary-contrast: #0b0f14;
    --accent: #22d3ee;
    --shadow-1: 0 6px 18px rgba(0,0,0,0.35);
    --shadow-2: 0 10px 30px rgba(0,0,0,0.45);
    --radius: 12px;
  }
  @media (prefers-color-scheme: light) {
    :root {
      --bg: #f7f9fc;
      --surface: #ffffff;
      --panel: #ffffff;
      --elev: #f9fafb;
      --text: #0f172a;
      --muted: #667085;
      --border: #e5e7eb;
      --primary: #2563eb;
      --primary-contrast: #ffffff;
      --accent: #0ea5e9;
      --shadow-1: 0 6px 18px rgba(0,0,0,0.08);
      --shadow-2: 0 14px 36px rgba(0,0,0,0.12);
    }
  }

  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    display: flex;
    height: 100vh;
    background: radial-gradient(1200px 600px at 20% -10%, rgba(34,211,238,0.08), transparent 40%),
                radial-gradient(1000px 600px at 120% 10%, rgba(99,102,241,0.08), transparent 40%),
                linear-gradient(180deg, var(--bg), var(--surface));
    color: var(--text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
      Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    letter-spacing: 0.1px;
  }

  /* App bar */
  #topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.9rem;
    border-bottom: 1px solid var(--border);
    background:
      linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0)) ,
      color-mix(in srgb, var(--panel) 90%, transparent);
    backdrop-filter: blur(10px);
  }
  #menu-button {
    appearance: none;
    border: 1px solid var(--border);
    background: var(--elev);
    color: var(--text);
    border-radius: 12px;
    height: 40px;
    width: 44px;
    display: grid;
    place-items: center;
    box-shadow: var(--shadow-1);
  }
  #topbar .mui-textfield { margin: 0; }
  .mui-textfield input#search {
    background: var(--elev);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 12px;
    padding: 0.65rem 0.9rem;
    height: 44px;
    box-shadow: inset 0 -1px 0 rgba(255,255,255,0.03);
  }
  .mui-textfield input#search::placeholder { color: var(--muted); }

  /* Layout */
  #sidebar {
    width: 320px;
    border-right: 1px solid var(--border);
    overflow-y: auto;
    padding: 1rem;
    background: var(--panel);
  }
  #main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  /* Sidebar list */
  #tool-list { margin: 0.25rem 0 0; padding: 0; }
  #tool-list li a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 0.5rem;
    color: var(--text);
    text-decoration: none;
    border-radius: 10px;
    transition: background 140ms ease, transform 140ms ease;
  }
  #tool-list li a:hover { background: color-mix(in srgb, var(--elev) 86%, transparent); }
  #tool-list li a:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  /* Grid */
  #grid-view {
    display: grid;
    gap: 1.1rem;
    padding: 1.1rem 1.2rem 1.4rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    overflow: auto;
  }
  @media (min-width: 1280px) {
    #grid-view { grid-template-columns: repeat(3, 1fr); }
  }

  .tool-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.75rem;
    box-shadow: var(--shadow-1);
    transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    cursor: pointer;
  }
  .tool-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-2);
    border-color: color-mix(in srgb, var(--primary) 35%, var(--border));
  }
  .card-frame {
    width: 100%;
    height: 200px;
    border: 0;
    border-radius: 10px;
    object-fit: cover;
    background: #0b0f14;
  }
  .tool-card h3 {
    margin: 0.15rem 0 0.05rem;
    font-size: 1.02rem;
    font-weight: 700;
    letter-spacing: 0.1px;
  }
  .tool-card p {
    margin: 0;
    font-size: 0.92rem;
    color: var(--muted);
  }

  /* Viewer */
  #viewer { display: none; flex: 1; flex-direction: column; overflow: hidden; }
  #viewer-controls {
    padding: 0.55rem 0.7rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    gap: 0.5rem;
    align-items: center;
    background: color-mix(in srgb, var(--panel) 92%, transparent);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .mui-btn {
    border-radius: 10px !important;
    height: 36px;
    line-height: 36px;
    padding: 0 12px;
  }
  .mui-btn--primary {
    background: var(--primary) !important;
    color: var(--primary-contrast) !important;
  }
  #tool-frame {
    flex: 1;
    border: 0;
    width: 100%;
    background: #0b0f14;
  }
  #viewer-placeholder {
    flex: 1;
    width: 100%;
    object-fit: cover;
    border: 0;
    border-radius: 0;
    background: #0b0f14;
  }
  #tool-info {
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--border);
    background: var(--panel);
  }
  #tool-title {
    margin: 0 0 0.25rem;
    font-size: 1.12rem;
    font-weight: 800;
  }
  #tool-description { margin: 0.25rem 0; color: var(--muted); }
  #tool-keywords { color: var(--muted); }

  /* Mobile */
  @media (max-width: 768px) {
    body { flex-direction: column; overflow: hidden; }
    #topbar { padding: 0.5rem 0.65rem; }
    #menu-button { height: 38px; width: 42px; border-radius: 10px; }
    .mui-textfield input#search {
      height: 40px; font-size: 16px; padding: 0.55rem 0.75rem;
    }
    #sidebar {
      width: 100%;
      max-height: 55vh;
      padding: 0.75rem;
      border: 0;
      border-bottom: 1px solid var(--border);
      display: none;
      overflow: auto;
      background: var(--panel);
    }
    #main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    #grid-view {
      grid-template-columns: 1fr;
      gap: 0.8rem;
      padding: 0.75rem;
      overflow: auto;
    }
    .card-frame { height: 160px; }
    #viewer { overflow: auto; }
    #tool-frame, #viewer-placeholder { min-height: 60vh; }
    #viewer-controls { padding: 0.45rem 0.55rem; gap: 0.45rem; }
    .mui-btn { height: 34px; line-height: 34px; padding: 0 10px; font-size: 14px; }
    #tool-info { padding: 0.8rem; }
    #tool-title { font-size: 1rem; }
  }

  /* Nice scrolling and touch */
  #sidebar, #grid-view, #viewer { -webkit-overflow-scrolling: touch; }
  #tool-list li a { min-height: 40px; display: flex; align-items: center; }

  /* Focus & motion preferences */
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }

  /* Safe areas */
  @supports (padding: max(0px)) {
    #topbar { padding-left: max(0.6rem, env(safe-area-inset-left));
              padding-right: max(0.6rem, env(safe-area-inset-right)); }
    #grid-view, #tool-info { padding-left: max(1rem, env(safe-area-inset-left));
                              padding-right: max(1rem, env(safe-area-inset-right)); }
  }
</style>
```

edit.html (replace the entire <style>...</style> section)
```html
<style>
  :root {
    --bg: #0b0f14;
    --surface: #0f1520;
    --panel: #0f1520;
    --elev: #121a27;
    --text: #e6edf3;
    --muted: #98a2b3;
    --border: #1f2937;
    --primary: #6ea8fe;
    --danger: #ef4444;
    --radius: 12px;
    --shadow-1: 0 8px 26px rgba(0,0,0,0.35);
  }
  @media (prefers-color-scheme: light) {
    :root {
      --bg: #f7f9fc;
      --surface: #ffffff;
      --panel: #ffffff;
      --elev: #f8fafc;
      --text: #0f172a;
      --muted: #667085;
      --border: #e5e7eb;
      --primary: #2563eb;
      --danger: #dc2626;
      --shadow-1: 0 10px 30px rgba(0,0,0,0.08);
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    height: 100vh;
    display: flex;
    overflow: hidden;
    background: linear-gradient(180deg, var(--bg), var(--surface));
    color: var(--text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
      Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }

  /* Auth */
  #auth-section {
    padding: 2rem;
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
  }
  #auth-section h1 { margin-top: 0; letter-spacing: 0.2px; }
  .mui-textfield input#token {
    background: var(--panel);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 12px;
    padding: 0.75rem 0.95rem;
    height: 46px;
    box-shadow: inset 0 -1px 0 rgba(255,255,255,0.03);
  }
  #save-auth {
    border-radius: 12px;
    background: var(--primary);
    color: #fff;
    box-shadow: var(--shadow-1);
  }

  /* Editor layout */
  #editor-section { flex: 1; display: flex; min-height: 0; }
  #sidebar {
    width: 300px;
    border-right: 1px solid var(--border);
    padding: 1rem;
    overflow-y: auto;
    background: var(--panel);
  }
  #sidebar .mui-textfield input {
    background: var(--elev);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 10px;
    height: 40px;
    padding: 0.5rem 0.75rem;
  }
  #file-list { margin: 0; padding: 0; }
  #file-list li a {
    color: var(--text);
    text-decoration: none;
    display: block;
    padding: 0.45rem 0.35rem;
    border-radius: 10px;
  }
  #file-list li a:hover { background: color-mix(in srgb, var(--elev) 86%, transparent); }

  #create-file {
    border-radius: 10px;
    background: var(--primary);
    color: #fff;
    width: 100%;
  }

  #main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.6rem;
    min-width: 0;
  }
  #current-path {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 700;
    color: var(--muted);
  }
  .CodeMirror {
    height: 100%;
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow-1);
    background: #0b0f14;
    color: #e5e7eb;
  }
  #main > div.actions {
    margin-top: 0.5rem;
    display: flex;
    gap: 0.5rem;
  }
  #save-file {
    background: var(--primary);
    color: #fff;
    border-radius: 10px;
  }
  #rename-file, #delete-file { border-radius: 10px; }
  #delete-file { background: var(--danger); color: #fff; }

  #popup {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(17,24,39,0.95);
    color: #fff;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.35);
    display: none;
    z-index: 1000;
  }

  /* Mobile */
  @media (max-width: 768px) {
    body { flex-direction: column; }
    #editor-section { flex-direction: column; }
    #sidebar {
      width: 100%;
      max-height: 42vh;
      border-right: none;
      border-bottom: 1px solid var(--border);
    }
    #main { height: 58vh; padding: 0.8rem; }
    #current-path {
      font-size: 0.95rem;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .CodeMirror { border-radius: 10px; }
    .actions {
      position: sticky; bottom: 0;
      background: var(--panel);
      padding: 0.55rem 0.15rem;
      border-top: 1px solid var(--border);
      display: flex; gap: 0.5rem;
    }
    .mui-btn { height: 38px; line-height: 38px; }
  }

  #sidebar, .CodeMirror { -webkit-overflow-scrolling: touch; }
  :focus-visible { outline: 2px solid #22d3ee; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }
</style>
```

That’s it—just CSS swaps. If you want a logo/title beside the menu button, change the topbar HTML to:
- Add <strong style="font-weight:800; letter-spacing:0.2px;">UpTooled</strong> after the menu button.

Want me to also add a dark/light toggle button and remember the choice?