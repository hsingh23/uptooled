(function() {
  const tokenInput = document.getElementById('token');
  const saveAuthBtn = document.getElementById('save-auth');
  const OWNER = 'hsingh23';
  const REPO = 'uptooled';
  const authSection = document.getElementById('auth-section');
  const editorSection = document.getElementById('editor-section');
  const fileList = document.getElementById('file-list');
  const createFileBtn = document.getElementById('create-file');
  const newFileInput = document.getElementById('new-file-name');
  const saveFileBtn = document.getElementById('save-file');
  const renameFileBtn = document.getElementById('rename-file');
  const deleteFileBtn = document.getElementById('delete-file');
  const previewFileBtn = document.getElementById('preview-file');
  const backToToolsBtn = document.getElementById('back-to-tools');
  const currentPathEl = document.getElementById('current-path');
  const textArea = document.getElementById('file-content');
  const popupEl = document.getElementById('popup');
  const previewModal = document.getElementById('preview-modal');
  const previewIframe = document.getElementById('preview-iframe');
  const previewClose = document.querySelector('.preview-close');
  const prettifyBtn = document.getElementById('prettify-btn');
  const prettifyMainBtn = document.getElementById('prettify-main');
  const shas = {};
  let editor;
  let currentPath = '';
  const requestedFile = new URLSearchParams(location.search).get('file');
  
  // Mobile sidebar toggle elements
  const mobileToggle = document.querySelector('.mobile-file-toggle');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const sidebar = document.getElementById('sidebar');
  
  // Mobile sidebar toggle functionality
  function initMobileToggle() {
    if (mobileToggle && mobileOverlay && sidebar) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.contains('mobile-open');
        
        if (isOpen) {
          closeMobileSidebar();
        } else {
          openMobileSidebar();
        }
      });
      
      mobileOverlay.addEventListener('click', closeMobileSidebar);
    }
  }
  
  function openMobileSidebar() {
    sidebar.classList.add('mobile-open');
    mobileOverlay.classList.add('active');
    mobileToggle.classList.add('open');
    mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
  }
  
  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    mobileOverlay.classList.remove('active');
    mobileToggle.classList.remove('open');
    mobileToggle.innerHTML = '<i class="fas fa-folder"></i>';
  }
  
  function base64EncodeUtf8(str) {
    // UTF-8 safe base64 encoding
    const utf8Bytes = new TextEncoder().encode(str);
    let binary = '';
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
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
  
  // Detect color scheme for theme
  function getColorScheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  
  // Initialize CodeMirror
  editor = CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    mode: 'text/plain',
    theme: getColorScheme() === 'light' ? 'solarized light' : 'solarized dark'
  });
  
  // Listen for color scheme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleColorSchemeChange = () => {
      editor.setOption('theme', getColorScheme() === 'light' ? 'solarized light' : 'solarized dark');
    };
    
    // Use addEventListener instead of deprecated addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleColorSchemeChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleColorSchemeChange);
    }
  }
  
  // Populate from localStorage
  tokenInput.value = localStorage.getItem('gh_token') || '';
  
  saveAuthBtn.addEventListener('click', () => {
    localStorage.setItem('gh_token', tokenInput.value.trim());
    initRepo();
  });
  
  function authHeaders() {
    const token = tokenInput.value.trim();
    return token ? { Authorization: `token ${token}` } : {};
  }
  
  function showPopup(msg) {
    if (!popupEl) return alert(msg);
    popupEl.textContent = msg;
    popupEl.style.display = 'block';
    clearTimeout(showPopup._t);
    showPopup._t = setTimeout(() => {
      popupEl.style.display = 'none';
    }, 4000);
  }
  
  function repoUrl(path) {
    const encoded = path
      .split('/')
      .map(seg => encodeURIComponent(seg))
      .join('/');
    return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encoded}`;
  }
  
  function showAuth() {
    authSection.style.display = 'block';
    editorSection.style.display = 'none';
  }
  
  function hideAuth() {
    authSection.style.display = 'none';
    editorSection.style.display = 'flex';
    
    // Refresh CodeMirror after making it visible
    setTimeout(() => {
      if (editor) {
        editor.refresh();
      }
    }, 10);
  }
  
  async function apiRequest(path, options = {}) {
    const opts = Object.assign({}, options);
    const allow404 = !!opts.allow404;
    delete opts.allow404;
    opts.headers = Object.assign(
      { Accept: 'application/vnd.github.v3+json' },
      authHeaders(),
      opts.headers || {}
    );
    try {
      const res = await fetch(repoUrl(path), opts);
      if (!res.ok && !(allow404 && res.status === 404)) {
        if (res.status === 401 || res.status === 403) {
          if (confirm('GitHub authentication failed. Update token?')) {
            showAuth();
            return null;
          }
        }
        const text = await res.text();
        showPopup(`Request failed (${res.status}): ${text}`);
        return null;
      }
      return res;
    } catch (err) {
      showPopup('Network error: ' + err.message);
      console.error(err);
      return null;
    }
  }
  
  async function initRepo() {
    hideAuth();
    initMobileToggle(); // Initialize mobile sidebar toggle
    const listed = await listFiles();
    if (listed) {
      if (requestedFile) {
        loadFile(requestedFile);
      } else {
        loadFile('external-sites.csv');
      }
    }
  }
  
  async function listFiles() {
    fileList.innerHTML = '';
    const csvItem = document.createElement('li');
    const csvLink = document.createElement('a');
    csvLink.href = '#';
    csvLink.textContent = 'external-sites.csv';
    csvLink.addEventListener('click', e => { e.preventDefault(); loadFile('external-sites.csv'); });
    csvItem.appendChild(csvLink);
    fileList.appendChild(csvItem);
    
    const res = await apiRequest('tools');
    if (!res) return false;
    const items = await res.json();
    items.forEach(it => {
      if (it.type === 'file') {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = it.name;
        a.addEventListener('click', e => { e.preventDefault(); loadFile('tools/' + it.name); });
        li.appendChild(a);
        fileList.appendChild(li);
      }
    });
    return true;
  }
  
  function setModeFromPath(path) {
    if (path.endsWith('.html')) {
      editor.setOption('mode', 'htmlmixed');
    } else if (path.endsWith('.js')) {
      editor.setOption('mode', 'javascript');
    } else if (path.endsWith('.css')) {
      editor.setOption('mode', 'css');
    } else if (path.endsWith('.json')) {
      editor.setOption('mode', { name: 'javascript', json: true });
    } else if (path.endsWith('.csv')) {
      editor.setOption('mode', 'text/plain');
    } else {
      editor.setOption('mode', 'text/plain');
    }
  }
  
  function updateUrlWithFile(path) {
    const url = new URL(window.location);
    if (path) {
      url.searchParams.set('file', path);
    } else {
      url.searchParams.delete('file');
    }
    window.history.replaceState({}, '', url);
  }

  async function loadFile(path) {
    currentPath = path;
    currentPathEl.querySelector('span').textContent = path;
    setModeFromPath(path);
    updateUrlWithFile(path);
    
    // Close mobile sidebar when file is selected
    if (window.innerWidth <= 768) {
      closeMobileSidebar();
    }
    
    const res = await apiRequest(path, { allow404: true });
    if (!res) return;
    if (res.status === 404) {
      editor.setValue('');
      shas[path] = null;
      
      // Refresh CodeMirror after setting empty content
      setTimeout(() => {
        if (editor) {
          editor.refresh();
        }
      }, 10);
      return;
    }
    const data = await res.json();
    editor.setValue(base64DecodeUtf8(data.content.replace(/\n/g, '')));
    shas[path] = data.sha;
    
    // Refresh CodeMirror after setting content
    setTimeout(() => {
      if (editor) {
        editor.refresh();
      }
    }, 10);
  }

  function openPreviewModal() {
    if (!currentPath) {
      showPopup('No file selected for preview');
      return;
    }
    
    const content = editor.getValue();
    if (!content.trim()) {
      showPopup('No content to preview');
      return;
    }
    
    // Create a blob URL for the HTML content
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    previewIframe.src = url;
    previewModal.classList.add('active');
    
    // Clean up the blob URL after the iframe loads
    previewIframe.onload = () => {
      setTimeout(() => URL.revokeObjectURL(url), 100);
    };
  }

  function closePreviewModal() {
    previewModal.classList.remove('active');
    previewIframe.src = '';
  }

  function prettifyCode() {
    if (!window.prettier) {
      showPopup('Prettier library not loaded');
      return;
    }
    
    try {
      const content = editor.getValue();
      if (!content.trim()) {
        showPopup('No content to prettify');
        return;
      }
      
      const formatted = prettier.format(content, {
        parser: 'html',
        plugins: prettierPlugins,
        tabWidth: 2,
        useTabs: false,
        printWidth: 100,
        htmlWhitespaceSensitivity: 'css',
        singleQuote: false,
        bracketSameLine: false,
        vueIndentScriptAndStyle: true
      });
      
      editor.setValue(formatted);
      showPopup('Code prettified!');
      
      // Update URL since content changed
      updateUrlWithFile(currentPath);
    } catch (error) {
      showPopup('Error prettifying code: ' + error.message);
    }
  }

  function backToTools() {
    // Navigate back to the main tools page with the current file selected
    const baseUrl = new URL('/', window.location.origin).toString();
    if (currentPath) {
      // Extract just the filename for the tools page
      const filename = currentPath.split('/').pop();
      if (filename && filename !== 'external-sites.csv') {
        // Use hash-based routing with URL encoding like the tools page expects
        const encodedPath = encodeURIComponent(currentPath);
        window.location.href = `${baseUrl}#${encodedPath}`;
        return;
      }
    }
    // If no specific file or it's external-sites.csv, just go to the main page
    window.location.href = baseUrl;
  }
  
  async function saveCurrentFile() {
    if (!currentPath) return;
    const body = {
      message: `Update ${currentPath}`,
      content: base64EncodeUtf8(editor.getValue())
    };
    if (shas[currentPath]) body.sha = shas[currentPath];
    const res = await apiRequest(currentPath, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res) return;
    const data = await res.json();
    shas[currentPath] = data.content.sha;
    showPopup('Saved');
  }
  
  async function deleteCurrentFile() {
    if (!currentPath) return;
    if (!confirm(`Delete ${currentPath}?`)) return;
    const res = await apiRequest(currentPath, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Delete ${currentPath}`,
        sha: shas[currentPath]
      })
    });
    if (!res) return;
    const item = [...fileList.querySelectorAll('a')].find(a => a.textContent === currentPath.split('/').pop());
    if (item) item.parentElement.remove();
    editor.setValue('');
    currentPathEl.querySelector('span').textContent = '';
    delete shas[currentPath];
    currentPath = '';
    updateUrlWithFile(''); // Clear URL param when no file
    showPopup('Deleted');
  }
  
  async function renameCurrentFile() {
    if (!currentPath) return;
    const currentName = currentPath.split('/').pop();
    const newName = prompt('New file name', currentName);
    if (!newName || newName === currentName) return;
    const newPath = currentPath.replace(currentName, newName);
    const body = {
      message: `Rename ${currentPath} to ${newPath}`,
      content: base64EncodeUtf8(editor.getValue()),
      sha: shas[currentPath]
    };
    const res = await apiRequest(currentPath, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res) return;
    const data = await res.json();
    const link = [...fileList.querySelectorAll('a')].find(a => a.textContent === currentName);
    if (link) {
      link.textContent = newName;
      link.onclick = e => { e.preventDefault(); loadFile(newPath); };
    }
    delete shas[currentPath];
    shas[newPath] = data.content.sha;
    currentPath = newPath;
    currentPathEl.querySelector('span').textContent = newPath;
    showPopup('Renamed');
  }
  
  saveFileBtn.addEventListener('click', saveCurrentFile);
  deleteFileBtn.addEventListener('click', deleteCurrentFile);
  renameFileBtn.addEventListener('click', renameCurrentFile);
  previewFileBtn.addEventListener('click', openPreviewModal);
  previewClose.addEventListener('click', closePreviewModal);
  prettifyBtn.addEventListener('click', prettifyCode);
  prettifyMainBtn.addEventListener('click', prettifyCode);
  backToToolsBtn.addEventListener('click', backToTools);
  
  // Close modal when clicking outside
  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
      closePreviewModal();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal.classList.contains('active')) {
      closePreviewModal();
    }
  });
  
  // Update URL when content changes
  editor.on('change', () => {
    // Debounce URL updates to avoid too many history entries
    clearTimeout(editor._urlUpdateTimeout);
    editor._urlUpdateTimeout = setTimeout(() => {
      if (currentPath) {
        updateUrlWithFile(currentPath);
      }
    }, 1000);
  });
  createFileBtn.addEventListener('click', () => {
    const name = newFileInput.value.trim();
    if (!name) return;
    const path = 'tools/' + name;
    if (![...fileList.querySelectorAll('a')].some(a => a.textContent === name)) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = name;
      a.addEventListener('click', e => { e.preventDefault(); loadFile(path); });
      li.appendChild(a);
      fileList.appendChild(li);
    }
    newFileInput.value = '';
    loadFile(path);
  });
  
  // Initialize on load
  if (tokenInput.value) {
    initRepo();
  } else {
    showAuth();
  }
})();