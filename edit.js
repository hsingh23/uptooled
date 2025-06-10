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
    testAuth();
  });

  function authHeaders() {
    const token = tokenInput.value.trim();
    return token ? { Authorization: `token ${token}` } : {};
  }

  function repoUrl(path) {
    return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`;
  }

  async function testAuth() {
    try {
      const res = await fetch(repoUrl('external-sites.csv'), { headers: authHeaders() });
      if (res.ok) {
        authSection.style.display = 'none';
        editorSection.style.display = 'flex';
        await listFiles();
        loadFile('external-sites.csv');
      } else {
        authSection.style.display = 'block';
        editorSection.style.display = 'none';
        alert('Authentication failed');
      }
    } catch (err) {
      console.error(err);
      alert('Authentication request failed');
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

    try {
      const res = await fetch(repoUrl('tools'), { headers: authHeaders() });
      if (!res.ok) return;
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
    } catch (err) {
      console.error('Failed to list files', err);
    }
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
    const res = await fetch(repoUrl(path), { headers: authHeaders() });
    if (res.status === 404) {
      editor.setValue('');
      shas[path] = null;
      return;
    }
    if (!res.ok) {
      alert('Failed to load file: ' + res.status);
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
    const res = await fetch(repoUrl(currentPath), {
      method: 'PUT',
      headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text();
      alert('Save failed: ' + text);
      return;
    }
    const data = await res.json();
    shas[currentPath] = data.content.sha;
    alert('Saved');
  }

  async function deleteCurrentFile() {
    if (!currentPath) return;
    if (!confirm(`Delete ${currentPath}?`)) return;
    const res = await fetch(repoUrl(currentPath), {
      method: 'DELETE',
      headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify({
        message: `Delete ${currentPath}`,
        sha: shas[currentPath]
      })
    });
    if (!res.ok) {
      const text = await res.text();
      alert('Delete failed: ' + text);
      return;
    }
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
    const res = await fetch(repoUrl(currentPath), {
      method: 'PUT',
      headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text();
      alert('Rename failed: ' + text);
      return;
    }
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

  // Try auth on load if token present
  if (tokenInput.value) {
    testAuth();
  }
})();
