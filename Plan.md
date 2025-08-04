Below are focused fixes and upgrades you can drop into your project. They address:
1) The Unicode btoa error when saving in edit.html/edit.js
2) Substantial UI/UX improvements for both edit and index pages (clean layout, responsive, dark-mode friendly, refined components)

Part 1 — Fix: Unicode-safe base64 for GitHub API (btoa error)
Root cause
btoa only supports Latin1. When your file content includes non-ASCII characters, btoa throws an “InvalidCharacterError”.

Solution
Use UTF-8 safe base64 helpers for both encoding (save) and decoding (load). Replace direct btoa/atob uses with these helpers.

In edit.js, add these helpers at the top (after variable declarations):
```javascript
function base64EncodeUtf8(str) {
  // UTF-8 safe base64 encoding
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  utf8Bytes.forEach(b => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function base64DecodeUtf8(b64) {
  // UTF-8 safe base64 decoding
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}
```

Then change the two spots:

A) In loadFile(path):
Replace:
```javascript
editor.setValue(atob(data.content.replace(/\n/g, '')));
```
With:
```javascript
editor.setValue(base64DecodeUtf8(data.content.replace(/\n/g, '')));
```

B) In saveCurrentFile():
Replace:
```javascript
content: btoa(editor.getValue())
```
With:
```javascript
content: base64EncodeUtf8(editor.getValue())
```

C) In renameCurrentFile():
Replace:
```javascript
content: btoa(editor.getValue()),
```
With:
```javascript
content: base64EncodeUtf8(editor.getValue()),
```

This eliminates the Unicode error and ensures round‑trip safety.

Part 2 — UI/UX upgrades
Goals
- Cleaner, modern layout
- Better spacing, typography, buttons
- Responsive grid/cards
- Consistent color system, subtle shadows, hover states
- Optional dark mode (auto via prefers-color-scheme)
- More polished “viewer” experience with improved info panel and controls

2A) index.html style overhaul
Replace the <style> block in index.html with:
```html
<style>
  :root {
    --bg: #ffffff;
    --surface: #fafafa;
    --text: #1f2937;
    --muted: #6b7280;
    --primary: #2563eb;
    --primary-contrast: #ffffff;
    --border: #e5e7eb;
    --card-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    --radius: 10px;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0b0f14;
      --surface: #121821;
      --text: #e5e7eb;
      --muted: #9ca3af;
      --primary: #3b82f6;
      --primary-contrast: #0b0f14;
      --border: #1f2937;
      --card-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
    }
  }
  * { box-sizing: border-box; }
  html, body {
    height: 100%;
  }
  body {
    margin: 0;
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(180deg, var(--bg), var(--surface));
    color: var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
      Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }
  #sidebar {
    width: 320px;
    border-right: 1px solid var(--border);
    overflow-y: auto;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(8px);
  }
  @media (prefers-color-scheme: dark) {
    #sidebar { background: rgba(18, 24, 33, 0.5); }
  }
  #main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  #grid-view {
    display: grid;
    gap: 1rem;
    padding: 1.25rem;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    overflow: auto;
  }
  @media (min-width: 1200px) {
    #grid-view {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .mui-textfield input#search {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 10px;
    padding: 0.6rem 0.8rem;
    height: 42px;
  }
  .mui-textfield input#search::placeholder {
    color: var(--muted);
  }
  #tool-list {
    margin-top: 0.75rem;
  }
  #tool-list li a {
    display: block;
    padding: 0.5rem 0.4rem;
    color: var(--text);
    text-decoration: none;
    border-radius: 8px;
  }
  #tool-list li a:hover {
    background: var(--surface);
  }

  .tool-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.75rem;
    box-shadow: var(--card-shadow);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .tool-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(0,0,0,0.12);
  }
  .card-frame {
    width: 100%;
    height: 200px;
    border: 0;
    border-radius: 8px;
    object-fit: cover;
    background: #0b0f14;
  }
  .tool-card h3 {
    margin: 0.25rem 0 0.1rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text);
  }
  .tool-card p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--muted);
  }

  #viewer {
    display: none;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
  }
  #viewer-controls {
    padding: 0.6rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    gap: 0.5rem;
    align-items: center;
    background: rgba(255,255,255,0.6);
    backdrop-filter: blur(6px);
    position: sticky;
    top: 0;
    z-index: 2;
  }
  @media (prefers-color-scheme: dark) {
    #viewer-controls { background: rgba(18,24,33,0.6); }
  }
  .mui-btn {
    border-radius: 8px !important;
    height: 34px;
    line-height: 34px;
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
    background: var(--surface);
  }
  #tool-title {
    margin: 0 0 0.25rem;
    font-size: 1.1rem;
    font-weight: 700;
  }
  #tool-description {
    margin: 0.25rem 0;
    color: var(--muted);
  }
  #tool-keywords {
    color: var(--muted);
  }

  @media (max-width: 768px) {
    body { flex-direction: column; }
    #sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 3;
    }
  }
</style>
```

2B) index.js small UX improvements
Keep your logic intact. Two small changes improve perceived speed and stability of thumbnails and the viewer.

1) For faster first paint on grid, show screenshot image immediately if available and avoid flicker:

Replace the section inside renderGrid where you add listeners with:
```javascript
const shot = await getScreenshot(tool.file);
if (shot) {
  img.src = shot;
  img.style.display = 'block';
} else {
  // If no shot yet, start loading iframe for capture
  iframe.style.display = 'block';
}
iframe.addEventListener('load', async () => {
  // Once iframe loads, capture and cache, then swap to image to reduce CPU
  const data = await captureScreenshot(iframe);
  await saveScreenshot(tool.file, data);
  if (data) {
    img.src = data;
    img.style.display = 'block';
    iframe.style.display = 'none';
  }
});
iframe.src = tool.file;
```

2) For viewer, similar approach: show placeholder immediately if we have it; after capture, keep the frame but ensure we store a new screenshot.

In selectTool, leave your logic but ensure we don’t set frameEl.style.display = 'none' if we already have a fast placeholder; your current logic is fine—no change required beyond styles.

2C) edit.html style overhaul
Replace the <style> block in edit.html with:
```html
<style>
  :root {
    --bg: #0b0f14;
    --surface: #0f1520;
    --panel: #121a27;
    --text: #e5e7eb;
    --muted: #9ca3af;
    --border: #1f2937;
    --primary: #60a5fa;
    --danger: #ef4444;
    --card-shadow: 0 10px 30px rgba(0,0,0,0.4);
    --radius: 12px;
  }
  @media (prefers-color-scheme: light) {
    :root {
      --bg: #f7f9fc;
      --surface: #ffffff;
      --panel: #ffffff;
      --text: #1f2937;
      --muted: #6b7280;
      --border: #e5e7eb;
      --primary: #2563eb;
      --danger: #dc2626;
      --card-shadow: 0 8px 24px rgba(0,0,0,0.08);
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
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
      Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }
  #auth-section {
    padding: 2rem;
    width: 100%;
    max-width: 740px;
    margin: 0 auto;
  }
  #auth-section h1 { margin-top: 0; }
  .mui-textfield input#token {
    background: var(--panel);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 10px;
    padding: 0.7rem 0.9rem;
    height: 44px;
  }
  #save-auth {
    border-radius: 10px;
    background: var(--primary);
    color: white;
  }

  #editor-section {
    flex: 1;
    display: flex;
    gap: 0;
  }
  #sidebar {
    width: 280px;
    border-right: 1px solid var(--border);
    padding: 1rem;
    overflow-y: auto;
    background: var(--panel);
  }
  #sidebar .mui-textfield input {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 10px;
    height: 40px;
    padding: 0.5rem 0.75rem;
  }
  #create-file {
    border-radius: 8px;
    background: var(--primary);
    color: #fff;
  }
  #file-list li a {
    color: var(--text);
    text-decoration: none;
    display: block;
    padding: 0.4rem 0.3rem;
    border-radius: 8px;
  }
  #file-list li a:hover {
    background: rgba(255,255,255,0.05);
  }

  #main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
  }
  #current-path {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--muted);
  }
  .CodeMirror {
    height: 100%;
    border: 1px solid var(--border);
    border-radius: 10px;
    box-shadow: var(--card-shadow);
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
    border-radius: 8px;
  }
  #rename-file, #delete-file {
    border-radius: 8px;
  }
  #delete-file {
    background: var(--danger);
    color: #fff;
  }
  #popup {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(17,24,39,0.95);
    color: #fff;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.35);
    display: none;
    z-index: 1000;
  }
</style>
```

And slightly adjust the action button container in edit.html:
Replace
```html
<div style="margin-top:0.5rem;">
```
with
```html
<div class="actions">
```

2D) Minor UX niceties in edit.js
- Enhance popup messages on save/delete/rename with emojis for quick visual feedback
- Keep as-is if you prefer minimalist notifications. If you want, update the showPopup lines:
```javascript
showPopup('✅ Saved');
...
showPopup('🗑️ Deleted');
...
showPopup('✏️ Renamed');
```

Part 3 — Optional robustness tweaks
1) GitHub API headers
Add Accept header for v3 to be explicit in apiRequest:
```javascript
opts.headers = Object.assign(
  { Accept: 'application/vnd.github.v3+json' },
  authHeaders(),
  opts.headers || {}
);
```

2) File mode detection
You can expand setModeFromPath to include .json, .js, .css for better highlighting:
```javascript
function setModeFromPath(path) {
  if (path.endsWith('.html')) {
    editor.setOption('mode', 'htmlmixed');
  } else if (path.endsWith('.js')) {
    editor.setOption('mode', 'javascript');
  } else if (path.endsWith('.css')) {
    editor.setOption('mode', 'css');
  } else if (path.endsWith('.json')) {
    editor.setOption('mode', { name: 'javascript', json: true });
  } else {
    editor.setOption('mode', 'text/plain');
  }
}
```

3) External sites thumbnails in index.js
Some sites may disallow framing. Your code already handles try/catch in captureScreenshot; the placeholder fallback is fine. If you want to visually indicate unavailable previews, set a neutral background image or message when capture fails.

Summary of exact code changes to make now
- edit.js: add base64EncodeUtf8/base64DecodeUtf8 and swap in load/save/rename; optionally add Accept header and enhanced setModeFromPath.
- index.html: replace style with the larger theme block above.
- index.js: tweak renderGrid to prefer cached screenshots and swap after capture.
- edit.html: replace style with the larger theme block above and change the action buttons wrapper to class="actions".

Once you apply these, saving files with any Unicode content will work, and both pages will look considerably more modern and polished. If you want me to produce full patched files with the changes merged verbatim, say “generate patched files,” and I’ll output the complete file contents.