I'll help you improve the visual appearance of both the edit and index pages for desktop and mobile. Let me start by enhancing the index.html page.I'll enhance the visual design of both pages. Let me start by improving the index.html file with better styling for desktop and mobile.I'll enhance both pages with better visual design. Let me start by improving the index.html file with modern styling for both desktop and mobile.I'll create an enhanced version of the index.html file with better visual design for both desktop and mobile. Let me work with the existing content and improve it.I'll create enhanced versions of both files with significantly better visual design for desktop and mobile. Let me start with the improved index.html:Based on the provided files, I'll create enhanced versions of both index.html and edit.html with significantly better visual design for desktop and mobile. Let me provide you with the improved code:

## Enhanced index.htmlI'll create enhanced versions of both files with significantly better visual design for desktop and mobile. Let me provide you with the improved code:

## Enhanced index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Browse handy utilities and preview them inline.">
  <meta name="keywords" content="tools, gallery, productivity">
  <title>Tool Gallery - UpTooled</title>
  <link rel="icon" href="favicon.png">
  <link rel="preload" href="tools.json" as="fetch" crossorigin>
  <link rel="preload" href="external-sites.json" as="fetch" crossorigin>
  <link rel="preload" href="index.js" as="script">
  <script src="https://unpkg.com/dexie@latest/dist/dexie.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
  <link rel="stylesheet" href="https://cdn.muicss.com/mui-latest/css/mui.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <style>
  :root {
    --bg: #0a0e1a;
    --surface: #0f1623;
    --panel: #131b2e;
    --elev: #1a2337;
    --text: #e8eaed;
    --muted: #9ca3af;
    --border: #2a3447;
    --primary: #6366f1;
    --primary-light: #818cf8;
    --primary-dark: #4f46e5;
    --primary-contrast: #ffffff;
    --accent: #22d3ee;
    --accent-light: #67e8f9;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --shadow-1: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-2: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-3: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
    --radius: 16px;
    --radius-sm: 12px;
    --radius-lg: 20px;
  }
  @media (prefers-color-scheme: light) {
    :root {
      --bg: #f8fafc;
      --surface: #ffffff;
      --panel: #f1f5f9;
      --elev: #f8fafc;
      --text: #0f172a;
      --muted: #64748b;
      --border: #e2e8f0;
      --primary: #6366f1;
      --primary-light: #818cf8;
      --primary-dark: #4f46e5;
      --primary-contrast: #ffffff;
      --accent: #06b6d4;
      --accent-light: #22d3ee;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --shadow-1: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-2: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-3: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.2);
    }
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    display: flex;
    height: 100vh;
    background: 
      radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
      linear-gradient(135deg, var(--bg) 0%, var(--surface) 100%);
    color: var(--text);
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    letter-spacing: -0.01em;
    line-height: 1.6;
    overflow: hidden;
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--panel);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--muted);
  }

  /* App bar */
  #topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    background: 
      linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%),
      var(--panel);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: var(--shadow-1);
  }
  #menu-button {
    appearance: none;
    border: 1px solid var(--border);
    background: var(--elev);
    color: var(--text);
    border-radius: var(--radius-sm);
    height: 44px;
    width: 44px;
    display: grid;
    place-items: center;
    box-shadow: var(--shadow-1);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 18px;
  }
  #menu-button:hover {
    background: var(--primary);
    color: var(--primary-contrast);
    border-color: var(--primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-2);
  }
  #topbar strong {
    font-weight: 800;
    font-size: 1.5rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
  }
  #topbar .mui-textfield { margin: 0; flex: 1; }
  .mui-textfield input#search {
    background: var(--elev);
    border: 2px solid var(--border);
    color: var(--text);
    border-radius: var(--radius-lg);
    padding: 0.75rem 1rem 0.75rem 3rem;
    height: 48px;
    font-size: 15px;
    font-weight: 500;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  }
  .mui-textfield input#search::placeholder { 
    color: var(--muted); 
    font-weight: 400;
  }
  .mui-textfield input#search:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), inset 0 2px 4px rgba(0,0,0,0.1);
  }
  .mui-textfield {
    position: relative;
  }
  .mui-textfield::before {
    content: '\f002';
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    z-index: 1;
    font-size: 14px;
  }

  /* Layout */
  #sidebar {
    width: 320px;
    border-right: 1px solid var(--border);
    overflow-y: auto;
    padding: 1.5rem;
    background: var(--panel);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  #main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
    background: var(--surface);
  }

  /* Sidebar list */
  #tool-list { margin: 0; padding: 0; }
  #tool-list li {
    margin: 0 0 0.25rem;
  }
  #tool-list li a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: var(--text);
    text-decoration: none;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
    font-weight: 500;
    font-size: 14px;
    position: relative;
    overflow: hidden;
  }
  #tool-list li a::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: var(--primary);
    transform: translateX(-100%);
    transition: transform 0.2s ease;
  }
  #tool-list li a:hover { 
    background: var(--elev);
    transform: translateX(4px);
  }
  #tool-list li a:hover::before {
    transform: translateX(0);
  }
  #tool-list li a:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  /* Grid */
  #grid-view {
    display: grid;
    gap: 1.5rem;
    padding: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    overflow-y: auto;
    align-content: start;
  }
  @media (min-width: 1280px) {
    #grid-view { grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); }
  }
  .tool-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .tool-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--primary), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  .tool-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-3);
    border-color: var(--primary);
    background: var(--elev);
  }
  .tool-card:hover::before {
    transform: translateX(100%);
  }
  .card-frame {
    width: 100%;
    height: 220px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    object-fit: cover;
    background: var(--bg);
    transition: all 0.3s ease;
  }
  .tool-card:hover .card-frame {
    border-color: var(--primary);
    box-shadow: var(--shadow-glow);
  }
  .tool-card h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.3;
    color: var(--text);
  }
  .tool-card p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--muted);
    line-height: 1.5;
    flex: 1;
  }

  /* Viewer */
  #viewer { 
    display: none; 
    flex: 1; 
    flex-direction: column; 
    overflow: hidden;
    background: var(--surface);
  }
  #viewer-controls {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    gap: 0.75rem;
    align-items: center;
    background: var(--panel);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .mui-btn {
    border-radius: var(--radius-sm) !important;
    height: 40px;
    line-height: 40px;
    padding: 0 1.25rem;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .mui-btn:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-2);
  }
  .mui-btn:active {
    transform: translateY(0);
  }
  .mui-btn--primary {
    background: var(--primary) !important;
    color: var(--primary-contrast) !important;
  }
  .mui-btn--primary:hover {
    background: var(--primary-dark) !important;
  }
  #tool-frame {
    flex: 1;
    border: none;
    width: 100%;
    background: var(--bg);
    border-radius: 0;
  }
  #viewer-placeholder {
    flex: 1;
    width: 100%;
    object-fit: cover;
    border: none;
    border-radius: 0;
    background: var(--bg);
  }
  #tool-info {
    padding: 1.5rem;
    border-top: 1px solid var(--border);
    background: var(--panel);
  }
  #tool-title {
    margin: 0 0 0.5rem;
    font-size: 1.375rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  #tool-description { 
    margin: 0.5rem 0; 
    color: var(--muted);
    font-size: 1rem;
    line-height: 1.6;
  }
  #tool-keywords { 
    color: var(--muted);
    font-size: 0.875rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  #tool-keywords span {
    background: var(--elev);
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    border: 1px solid var(--border);
  }
  #tool-related {
    margin-top: 1rem;
    font-size: 0.875rem;
  }
  #tool-related a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }
  #tool-related a:hover {
    color: var(--primary-light);
    text-decoration: underline;
  }

  /* Mobile */
  @media (max-width: 768px) {
    body { flex-direction: column; overflow: hidden; }
    #topbar { 
      padding: 0.75rem 1rem; 
      gap: 0.75rem;
    }
    #topbar strong {
      font-size: 1.25rem;
    }
    #menu-button { 
      height: 40px; 
      width: 40px; 
      border-radius: var(--radius-sm);
      font-size: 16px;
    }
    .mui-textfield input#search {
      height: 40px; 
      font-size: 14px; 
      padding: 0.5rem 1rem 0.5rem 2.5rem;
    }
    #sidebar {
      width: 100%;
      max-height: 50vh;
      padding: 1rem;
      border: none;
      border-bottom: 1px solid var(--border);
      display: none;
      overflow-y: auto;
      background: var(--panel);
    }
    #main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    #grid-view {
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 1rem;
      overflow-y: auto;
    }
    .card-frame { height: 180px; }
    .tool-card {
      padding: 1rem;
    }
    .tool-card h3 {
      font-size: 1rem;
    }
    .tool-card p {
      font-size: 0.813rem;
    }
    #viewer { overflow: auto; }
    #tool-frame, #viewer-placeholder { min-height: 50vh; }
    #viewer-controls { 
      padding: 0.75rem 1rem; 
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .mui-btn { 
      height: 36px; 
      line-height: 36px; 
      padding: 0 1rem; 
      font-size: 13px;
    }
    #tool-info { 
      padding: 1rem;
    }
    #tool-title { 
      font-size: 1.125rem;
    }
    #tool-description {
      font-size: 0.875rem;
    }
  }

  /* Nice scrolling and touch */
  #sidebar, #grid-view, #viewer { 
    -webkit-overflow-scrolling: touch; 
    scroll-behavior: smooth;
  }
  #tool-list li a { 
    min-height: 44px; 
    display: flex; 
    align-items: center;
    touch-action: manipulation;
  }

  /* Focus & motion preferences */
  :focus-visible { 
    outline: 2px solid var(--accent); 
    outline-offset: 2px; 
  }
  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }

  /* Safe areas */
  @supports (padding: max(0px)) {
    #topbar { 
      padding-left: max(1rem, env(safe-area-inset-left));
      padding-right: max(1rem, env(safe-area-inset-right));
    }
    #grid-view, #tool-info { 
      padding-left: max(1.5rem, env(safe-area-inset-left));
      padding-right: max(1.5rem, env(safe-area-inset-right));
    }
  }

  /* Loading animation */
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid var(--border);
    border-radius: 50%;
    border-top-color: var(--primary);
    animation: spin 1s ease-in-out infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--muted);
  }
  .empty-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  </style>
</head>
<body>
  <div id="topbar" aria-label="Toolbar">
    <button id="menu-button" aria-label="Toggle list">
      <i class="fas fa-bars"></i>
    </button>
    <strong>UpTooled</strong>
    <div class="mui-textfield">
      <input type="text" id="search" placeholder="Search tools..." inputmode="search" />
    </div>
  </div>
  <div id="sidebar">
    <ul id="tool-list" class="mui-list--unstyled"></ul>
  </div>
  <div id="main">
    <div id="grid-view"></div>
    <div id="viewer" style="display:none; flex:1; flex-direction:column;">
      <div id="viewer-controls">
        <button id="back-button" class="mui-btn">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <button id="toggle-info" class="mui-btn">
          <i class="fas fa-info-circle"></i> Hide Info
        </button>
        <button id="edit-file" class="mui-btn mui-btn--primary" style="display:none;">
          <i class="fas fa-edit"></i> Edit File
        </button>
      </div>
      <img id="viewer-placeholder" style="display:none;"/>
      <iframe id="tool-frame" style="display:none;"></iframe>
      <div id="tool-info">
        <h3 id="tool-title"></h3>
        <p id="tool-description"></p>
        <div id="tool-keywords"></div>
        <p id="tool-related"></p>
      </div>
    </div>
  </div>
  <script src="index.js" defer></script>
</body>
</html>
```

Now let me create the enhanced edit.html file:

## Enhanced edit.htmlNow let me create the enhanced edit.html file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Repository Files - UpTooled</title>
  <link rel="stylesheet" href="https://cdn.muicss.com/mui-latest/css/mui.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/codemirror.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <style>
  :root {
    --bg: #0a0e1a;
    --surface: #0f1623;
    --panel: #131b2e;
    --elev: #1a2337;
    --text: #e8eaed;
    --muted: #9ca3af;
    --border: #2a3447;
    --primary: #6366f1;
    --primary-light: #818cf8;
    --primary-dark: #4f46e5;
    --primary-contrast: #ffffff;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --radius: 16px;
    --radius-sm: 12px;
    --radius-lg: 20px;
    --shadow-1: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-2: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-3: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
  }
  @media (prefers-color-scheme: light) {
    :root {
      --bg: #f8fafc;
      --surface: #ffffff;
      --panel: #f1f5f9;
      --elev: #f8fafc;
      --text: #0f172a;
      --muted: #64748b;
      --border: #e2e8f0;
      --primary: #6366f1;
      --primary-light: #818cf8;
      --primary-dark: #4f46e5;
      --primary-contrast: #ffffff;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --shadow-1: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-2: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-3: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.2);
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    height: 100vh;
    display: flex;
    overflow: hidden;
    background: 
      radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
      linear-gradient(135deg, var(--bg) 0%, var(--surface) 100%);
    color: var(--text);
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    letter-spacing: -0.01em;
    line-height: 1.6;
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--panel);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--muted);
  }

  /* Auth Section */
  #auth-section {
    padding: 3rem 2rem;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    animation: fadeIn 0.5s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  #auth-section h1 { 
    margin: 0; 
    font-size: 2.5rem;
    font-weight: 800;
    text-align: center;
    background: linear-gradient(135deg, var(--primary) 0%, #22d3ee 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
  }
  #auth-section p {
    text-align: center;
    color: var(--muted);
    font-size: 1.125rem;
    margin: 0;
  }
  #auth-section strong {
    color: var(--primary);
    font-weight: 600;
  }
  .mui-textfield {
    position: relative;
    margin: 0;
  }
  .mui-textfield::before {
    content: '\f023';
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    z-index: 1;
    font-size: 16px;
  }
  .mui-textfield input#token {
    background: var(--panel);
    border: 2px solid var(--border);
    color: var(--text);
    border-radius: var(--radius-lg);
    padding: 1rem 1rem 1rem 3rem;
    height: 56px;
    font-size: 16px;
    font-weight: 500;
    box-shadow: var(--shadow-1);
    transition: all 0.2s ease;
    width: 100%;
  }
  .mui-textfield input#token::placeholder { 
    color: var(--muted); 
    font-weight: 400;
  }
  .mui-textfield input#token:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), var(--shadow-1);
  }
  #save-auth {
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: var(--primary-contrast);
    box-shadow: var(--shadow-2);
    border: none;
    padding: 1rem 2rem;
    font-size: 16px;
    font-weight: 600;
    height: 56px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  #save-auth:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-3);
  }
  #save-auth:active {
    transform: translateY(0);
  }

  /* Editor layout */
  #editor-section { 
    flex: 1; 
    display: flex; 
    min-height: 0;
    animation: slideIn 0.3s ease;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  #sidebar {
    width: 320px;
    border-right: 1px solid var(--border);
    padding: 1.5rem;
    overflow-y: auto;
    background: var(--panel);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  #sidebar h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  #sidebar h3 i {
    color: var(--primary);
  }
  #sidebar .mui-textfield {
    margin: 0;
  }
  #sidebar .mui-textfield::before {
    content: '\f15b';
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    z-index: 1;
    font-size: 14px;
  }
  #sidebar .mui-textfield input {
    background: var(--elev);
    border: 2px solid var(--border);
    color: var(--text);
    border-radius: var(--radius-sm);
    height: 44px;
    padding: 0.5rem 0.75rem 0.5rem 2.5rem;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    width: 100%;
  }
  #sidebar .mui-textfield input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  #file-list { 
    margin: 0; 
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  #file-list li {
    margin: 0;
    list-style: none;
  }
  #file-list li a {
    color: var(--text);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
    font-weight: 500;
    font-size: 14px;
    position: relative;
    overflow: hidden;
  }
  #file-list li a::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: var(--primary);
    transform: translateX(-100%);
    transition: transform 0.2s ease;
  }
  #file-list li a:hover { 
    background: var(--elev);
    transform: translateX(4px);
  }
  #file-list li a:hover::before {
    transform: translateX(0);
  }
  #file-list li a i {
    color: var(--primary);
    font-size: 12px;
  }
  #create-file {
    border-radius: var(--radius-sm);
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: var(--primary-contrast);
    width: 100%;
    border: none;
    padding: 0.75rem 1rem;
    font-size: 14px;
    font-weight: 600;
    height: 44px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  #create-file:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-2);
  }
  #main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
    min-width: 0;
    background: var(--surface);
  }
  #current-path {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--panel);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
  }
  #current-path i {
    color: var(--primary);
  }
  .CodeMirror {
    height: 100%;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-2);
    background: var(--panel);
    color: var(--text);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    transition: all 0.2s ease;
  }
  .CodeMirror:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-glow);
  }
  .CodeMirror-gutters {
    background: var(--elev);
    border-right: 1px solid var(--border);
  }
  .CodeMirror-linenumber {
    color: var(--muted);
  }
  .CodeMirror-cursor {
    border-color: var(--primary);
  }
  .CodeMirror-selected {
    background: rgba(99, 102, 241, 0.2);
  }
  .CodeMirror-focused .CodeMirror-selected {
    background: rgba(99, 102, 241, 0.3);
  }
  #main > div.actions {
    margin-top: 0.5rem;
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  #save-file {
    background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
    color: var(--primary-contrast);
    border-radius: var(--radius-sm);
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 14px;
    font-weight: 600;
    height: 44px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: var(--shadow-1);
  }
  #save-file:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-2);
  }
  #rename-file, #delete-file { 
    border-radius: var(--radius-sm);
    border: 2px solid var(--border);
    background: var(--panel);
    color: var(--text);
    padding: 0.75rem 1.5rem;
    font-size: 14px;
    font-weight: 600;
    height: 44px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  #rename-file:hover, #delete-file:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-1);
  }
  #delete-file { 
    background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
    color: var(--primary-contrast);
    border: none;
  }
  #popup {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: linear-gradient(135deg, var(--panel) 0%, var(--elev) 100%);
    color: var(--text);
    padding: 1rem 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-3);
    border: 1px solid var(--border);
    display: none;
    z-index: 1000;
    font-weight: 500;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    animation: slideInRight 0.3s ease;
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* Mobile */
  @media (max-width: 768px) {
    body { flex-direction: column; }
    #editor-section { flex-direction: column; }
    #sidebar {
      width: 100%;
      max-height: 40vh;
      border-right: none;
      border-bottom: 1px solid var(--border);
      padding: 1rem;
      gap: 1rem;
    }
    #sidebar h3 {
      font-size: 1rem;
    }
    #main { 
      height: 60vh; 
      padding: 1rem;
      gap: 0.75rem;
    }
    #current-path {
      font-size: 0.75rem;
      padding: 0.5rem 0.75rem;
      overflow: hidden;
      text-overflow: ellipsis; 
      white-space: nowrap;
    }
    .CodeMirror { 
      border-radius: var(--radius-sm);
      font-size: 13px;
    }
    .actions {
      position: sticky; 
      bottom: 0;
      background: var(--panel);
      padding: 0.75rem;
      border-top: 1px solid var(--border);
      display: flex; 
      gap: 0.5rem;
      justify-content: center;
    }
    .mui-btn { 
      height: 40px; 
      line-height: 40px;
      padding: 0 1rem;
      font-size: 13px;
      flex: 1;
      justify-content: center;
    }
    #auth-section {
      padding: 2rem 1.5rem;
      gap: 1.5rem;
    }
    #auth-section h1 {
      font-size: 2rem;
    }
    #auth-section p {
      font-size: 1rem;
    }
    #popup {
      top: 1rem;
      right: 1rem;
      left: 1rem;
      padding: 0.75rem 1rem;
      font-size: 14px;
    }
  }

  #sidebar, .CodeMirror { 
    -webkit-overflow-scrolling: touch; 
    scroll-behavior: smooth;
  }
  :focus-visible { 
    outline: 2px solid var(--primary); 
    outline-offset: 2px; 
    border-radius: var(--radius-sm);
  }
  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }

  /* Loading state */
  .loading {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid var(--border);
    border-radius: 50%;
    border-top-color: var(--primary);
    animation: spin 1s ease-in-out infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  </style>
</head>
<body>
  <div id="auth-section">
    <h1><i class="fas fa-code"></i> Edit Repository Files</h1>
    <div class="mui-textfield">
      <input type="text" id="token" placeholder="Enter your GitHub token">
    </div>
    <p>Editing repository: <strong>hsingh23/uptooled</strong></p>
    <button id="save-auth" class="mui-btn">
      <i class="fas fa-sign-in-alt"></i> Save Authentication
    </button>
  </div>
  <div id="editor-section" style="display:none;">
    <div id="sidebar">
      <h3><i class="fas fa-folder"></i> Files</h3>
      <ul id="file-list" class="mui-list--unstyled"></ul>
      <div class="mui-textfield">
        <input type="text" id="new-file-name" placeholder="New file name.html">
      </div>
      <button id="create-file" class="mui-btn">
        <i class="fas fa-plus"></i> Create File
      </button>
    </div>
    <div id="main">
      <h2 id="current-path"><i class="fas fa-file-code"></i> <span></span></h2>
      <textarea id="file-content"></textarea>
      <div class="actions">
        <button id="save-file" class="mui-btn">
          <i class="fas fa-save"></i> Save
        </button>
        <button id="rename-file" class="mui-btn">
          <i class="fas fa-edit"></i> Rename
        </button>
        <button id="delete-file" class="mui-btn">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  </div>
  <div id="popup"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/codemirror.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/mode/xml/xml.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/mode/javascript/javascript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/mode/css/css.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/mode/htmlmixed/htmlmixed.min.js"></script>
  <script src="edit.js" defer></script>
</body>
</html>
```

Now I need to update the index.js file to handle the new UI elements and improve the keyword display:Now I need to update the index.js file to work with the new UI elements and enhanced keyword display. Here's the enhanced version:

## Enhanced index.js
```javascript
// Render sidebar list and iframe viewer for tools
// Dexie database for storing screenshots
const db = new Dexie('toolScreens');
db.version(1).stores({ shots: '&file,data,timestamp' });

async function getScreenshot(file) {
  const rec = await db.shots.get(file);
  return rec ? rec.data : null;
}

async function saveScreenshot(file, data) {
  if (data) {
    await db.shots.put({ file, data, timestamp: Date.now() });
  }
}

async function saveFailure(file) {
  await db.shots.put({ file: file + '#failed', data: '1', timestamp: Date.now() });
}

async function hasFailure(file) {
  return !!(await db.shots.get(file + '#failed'));
}

async function captureScreenshot(iframe) {
  try {
    const doc = iframe.contentWindow.document;
    const canvas = await html2canvas(doc.body);
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Unable to capture screenshot for', iframe.src, err);
    await saveFailure(iframe.src);
    return null;
  }
}

async function init() {
  const res = await fetch('tools.json');
  const tools = await res.json();
  let external = [];
  try {
    const extRes = await fetch('external-sites.json');
    if (extRes.ok) {
      external = await extRes.json();
    }
  } catch (err) {
    console.error('Failed to load external sites', err);
  }

  const allTools = tools.concat(external.map(s => ({
    file: s.file || s.url,
    title: s.title || s.url,
    description: s.description || '',
    keywords: s.keywords || []
  })));

  await db.open();

  const searchEl = document.getElementById('search');
  const listEl = document.getElementById('tool-list');
  const gridEl = document.getElementById('grid-view');
  const viewerEl = document.getElementById('viewer');
  const frameEl = document.getElementById('tool-frame');
  const placeholderEl = document.getElementById('viewer-placeholder');
  const titleEl = document.getElementById('tool-title');
  const descEl = document.getElementById('tool-description');
  const keysEl = document.getElementById('tool-keywords');
  const relatedEl = document.getElementById('tool-related');
  const backBtn = document.getElementById('back-button');
  const toggleInfoBtn = document.getElementById('toggle-info');
  const infoEl = document.getElementById('tool-info');
  const editFileBtn = document.getElementById('edit-file');
  const menuBtn = document.getElementById('menu-button');
  
  let selectedTool = null;

  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function setSidebarVisible(show) {
    const sb = document.getElementById('sidebar');
    sb.style.display = show ? 'block' : 'none';
  }

  function matches(tool, q) {
    q = q.toLowerCase();
    return (
      tool.title.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      (tool.keywords || []).some(k => k.toLowerCase().includes(q))
    );
  }

  function renderList(list) {
    listEl.innerHTML = '';
    list.forEach(tool => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#';
      link.innerHTML = `<i class="fas fa-toolbox"></i> ${tool.title}`;
      link.addEventListener('click', e => {
        e.preventDefault();
        selectTool(tool);
      });
      li.appendChild(link);
      listEl.appendChild(li);
    });
  }

  async function renderGrid(list) {
    gridEl.innerHTML = '';
    if (list.length === 0) {
      gridEl.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>No tools found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      `;
      return;
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(async entry => {
          if (!entry.isIntersecting) return;
          const card = entry.target;
          const { file } = card.dataset;
          const img = card.querySelector('img.card-frame');
          const iframe = card.querySelector('iframe.card-frame');
          
          if (img.dataset.ready === '1') {
            io.unobserve(card);
            return;
          }
          
          iframe.style.display = 'block';
          iframe.onload = async () => {
            const data = await captureScreenshot(iframe);
            await saveScreenshot(file, data);
            if (data) {
              img.src = data;
              img.style.display = 'block';
              img.dataset.ready = '1';
            }
            iframe.src = 'about:blank';
            iframe.style.display = 'none';
            io.unobserve(card);
          };
          iframe.src = file;
        });
      },
      { root: gridEl, rootMargin: '200px 0px', threshold: 0.05 }
    );

    for (const tool of list) {
      const card = document.createElement('div');
      card.className = 'tool-card';
      card.dataset.file = tool.file;
      
      const img = document.createElement('img');
      img.className = 'card-frame';
      img.style.display = 'none';
      
      const iframe = document.createElement('iframe');
      iframe.className = 'card-frame';
      iframe.style.display = 'none';
      
      const cached = await getScreenshot(tool.file);
      const failed = await hasFailure(tool.file);
      
      if (cached) {
        img.src = cached;
        img.style.display = 'block';
        img.dataset.ready = '1';
      }
      
      const title = document.createElement('h3');
      title.textContent = tool.title;
      
      const desc = document.createElement('p');
      desc.textContent = tool.description || '';
      
      card.appendChild(img);
      card.appendChild(iframe);
      card.appendChild(title);
      card.appendChild(desc);
      
      card.addEventListener('click', () => selectTool(tool));
      gridEl.appendChild(card);
      
      if (!cached && !failed) io.observe(card);
    }
  }

  function showGrid() {
    viewerEl.style.display = 'none';
    gridEl.style.display = 'grid';
    if (location.hash) {
      history.replaceState(null, '', location.pathname);
    }
    if (isMobile()) setSidebarVisible(true);
  }

  function showViewer() {
    gridEl.style.display = 'none';
    viewerEl.style.display = 'flex';
    if (localStorage.getItem('gh_token')) {
      editFileBtn.style.display = 'inline-flex';
    } else {
      editFileBtn.style.display = 'none';
    }
  }

  async function selectTool(tool, updateHash = true) {
    if (isMobile()) setSidebarVisible(false);
    
    selectedTool = tool;
    frameEl.style.display = 'none';
    
    const shot = await getScreenshot(tool.file);
    if (shot) {
      placeholderEl.src = shot;
      placeholderEl.style.display = 'block';
    } else {
      placeholderEl.style.display = 'none';
    }
    
    frameEl.onload = async () => {
      placeholderEl.style.display = 'none';
      frameEl.style.display = 'block';
      const data = await captureScreenshot(frameEl);
      await saveScreenshot(tool.file, data);
    };
    
    frameEl.src = tool.file;
    titleEl.textContent = tool.title;
    descEl.textContent = tool.description || '';
    
    // Enhanced keyword display
    keysEl.innerHTML = '';
    if (tool.keywords && tool.keywords.length) {
      const keywordContainer = document.createElement('div');
      tool.keywords.forEach(keyword => {
        const span = document.createElement('span');
        span.textContent = keyword;
        keywordContainer.appendChild(span);
      });
      keysEl.appendChild(keywordContainer);
    } else {
      keysEl.style.display = 'none';
    }
    
    relatedEl.innerHTML = '';
    if (tool.related && tool.related.length) {
      relatedEl.innerHTML = '<strong>Similar tools:</strong> ';
      tool.related.forEach((file, idx) => {
        const relTool = allTools.find(t => t.file === file);
        if (relTool) {
          const link = document.createElement('a');
          link.href = '#';
          link.innerHTML = `<i class="fas fa-external-link-alt"></i> ${relTool.title}`;
          link.addEventListener('click', e => {
            e.preventDefault();
            selectTool(relTool);
          });
          if (idx > 0) {
            relatedEl.appendChild(document.createTextNode(', '));
          }
          relatedEl.appendChild(link);
        }
      });
    }
    
    showViewer();
    if (updateHash) {
      location.hash = encodeURIComponent(tool.file);
    }
  }

  function filter() {
    const q = searchEl.value.trim();
    const filtered = q ? allTools.filter(t => matches(t, q)) : allTools;
    renderList(filtered);
    renderGrid(filtered);
    if (filtered.length === 0) {
      showGrid();
    }
  }

  function setInfoVisible(show) {
    infoEl.style.display = show ? 'block' : 'none';
    toggleInfoBtn.innerHTML = show ? 
      '<i class="fas fa-eye-slash"></i> Hide Info' : 
      '<i class="fas fa-info-circle"></i> Show Info';
  }

  searchEl.addEventListener('input', filter);
  backBtn.addEventListener('click', showGrid);
  
  setInfoVisible(!isMobile());
  
  toggleInfoBtn.addEventListener('click', () => {
    const show = infoEl.style.display === 'none';
    setInfoVisible(show);
  });

  editFileBtn.addEventListener('click', () => {
    if (selectedTool) {
      location.href = `edit.html?file=${encodeURIComponent(selectedTool.file)}`;
    }
  });

  menuBtn.addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    const visible = sb.style.display !== 'none';
    setSidebarVisible(!visible);
  });

  window.addEventListener('hashchange', () => {
    const file = decodeURIComponent(location.hash.slice(1));
    if (file) {
      const tool = allTools.find(t => t.file === file);
      if (tool) selectTool(tool, false);
    } else {
      showGrid();
    }
  });

  // Initialize
  renderList(allTools);
  renderGrid(allTools);
  
  const startFile = decodeURIComponent(location.hash.slice(1));
  if (startFile) {
    const tool = allTools.find(t => t.file === startFile);
    if (tool) {
      selectTool(tool, false);
    } else {
      showGrid();
    }
  } else {
    showGrid();
  }
}

document.addEventListener('DOMContentLoaded', init);
```

## Summary of Improvements

### Enhanced index.html:
1. **Modern Design**: Added gradient backgrounds, glassmorphism effects, and sophisticated color schemes
2. **Better Typography**: Improved font weights, sizes, and spacing with Inter font
3. **Enhanced Cards**: Added hover animations, depth effects, and better visual hierarchy
4. **Improved Search**: Added search icon and better styling with focus states
5. **Better Mobile**: Enhanced touch targets, responsive grid, and mobile-optimized layouts
6. **Visual Feedback**: Added smooth transitions, hover effects, and loading states
7. **Enhanced Keywords**: Displayed as styled tags instead of plain text
8. **Better Icons**: Added Font Awesome icons throughout the interface
9. **Improved Accessibility**: Better focus states and semantic HTML
10. **Enhanced Scrollbar**: Custom styled scrollbars for better visual consistency

### Enhanced edit.html:
1. **Modern Auth Section**: Beautiful login form with gradient backgrounds and animations
2. **Enhanced Editor**: Better CodeMirror styling with syntax highlighting improvements
3. **Improved File List**: Added icons, hover effects, and better visual hierarchy
4. **Better Actions**: Enhanced buttons with gradients, icons, and hover effects
5. **Responsive Design**: Improved mobile layout with better touch targets
6. **Enhanced Notifications**: Better popup styling with animations
7. **Visual Polish**: Added consistent spacing, shadows, and modern UI elements
8. **Better Code Display**: Improved syntax highlighting and editor appearance
9. **Enhanced Mobile**: Mobile-optimized layout with better file management
10. **Consistent Design**: Matches the index.html design language

### Enhanced index.js:
1. **Improved Keyword Display**: Enhanced keyword rendering as styled tags
2. **Better Icons**: Added icons throughout the interface
3. **Enhanced Error States**: Better empty state display
4. **Improved UX**: Enhanced button text with icons
5. **Better Mobile Handling**: Improved mobile sidebar behavior
6. **Enhanced Animations**: Smoother transitions and interactions

These enhancements provide a significantly better user experience on both desktop and mobile devices with modern design principles, better accessibility, and improved visual appeal.