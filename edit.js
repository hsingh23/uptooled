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
  const currentPathEl = document.getElementById('current-path');
  const textArea = document.getElementById('file-content');

  const shas = {};
  let editor;
  let currentPath = '';

  // Initialize CodeMirror
  editor = CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    mode: 'text/plain'
  });

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

  function repoUrl(path) {
    return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`;
  }

  function showAuth() {
    authSection.style.display = 'block';
    editorSection.style.display = 'none';
  }

  function hideAuth() {
    authSection.style.display = 'none';
    editorSection.style.display = 'flex';
  }

  async function apiRequest(path, options = {}) {
    const opts = Object.assign({}, options);
    opts.headers = Object.assign({}, authHeaders(), options.headers || {});
    try {
      const res = await fetch(repoUrl(path), opts);
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          if (confirm('GitHub authentication failed. Update token?')) {
            showAuth();
            return null;
          }
        }
        const text = await res.text();
        alert(`Request failed (${res.status}): ${text}`);
        return null;
      }
      return res;
    } catch (err) {
      alert('Network error: ' + err.message);
      console.error(err);
      return null;
    }
  }

  async function initRepo() {
    hideAuth();
    const listed = await listFiles();
    if (listed) {
      loadFile('external-sites.csv');
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
    } else {
      editor.setOption('mode', 'text/plain');
    }
  }

  async function loadFile(path) {
    currentPath = path;
    currentPathEl.textContent = path;
    setModeFromPath(path);
    const res = await apiRequest(path);
    if (!res) return;
    if (res.status === 404) {
      editor.setValue('');
      shas[path] = null;
      return;
    }
    const data = await res.json();
    editor.setValue(atob(data.content.replace(/\n/g, '')));
    shas[path] = data.sha;
  }

  async function saveCurrentFile() {
    if (!currentPath) return;
    const body = {
      message: `Update ${currentPath}`,
      content: btoa(editor.getValue())
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
    alert('Saved');
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
    currentPathEl.textContent = '';
    delete shas[currentPath];
    currentPath = '';
    alert('Deleted');
  }

  async function renameCurrentFile() {
    if (!currentPath) return;
    const currentName = currentPath.split('/').pop();
    const newName = prompt('New file name', currentName);
    if (!newName || newName === currentName) return;
    const newPath = currentPath.replace(currentName, newName);
    const body = {
      message: `Rename ${currentPath} to ${newPath}`,
      content: btoa(editor.getValue()),
      sha: shas[currentPath],
      path: newPath
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
    currentPathEl.textContent = newPath;
    alert('Renamed');
  }

  saveFileBtn.addEventListener('click', saveCurrentFile);
  deleteFileBtn.addEventListener('click', deleteCurrentFile);
  renameFileBtn.addEventListener('click', renameCurrentFile);

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
