(function() {
  const tokenInput = document.getElementById('token');
  const ownerInput = document.getElementById('owner');
  const repoInput = document.getElementById('repo');
  const saveAuthBtn = document.getElementById('save-auth');

  const authSection = document.getElementById('auth-section');
  const editorSection = document.getElementById('editor-section');
  const fileList = document.getElementById('file-list');
  const createFileBtn = document.getElementById('create-file');
  const newFileInput = document.getElementById('new-file-name');
  const saveFileBtn = document.getElementById('save-file');
  const currentPathEl = document.getElementById('current-path');
  const textArea = document.getElementById('file-content');
  const startPath = decodeURIComponent(location.hash.slice(1));

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
  ownerInput.value = localStorage.getItem('gh_owner') || '';
  repoInput.value = localStorage.getItem('gh_repo') || '';

  saveAuthBtn.addEventListener('click', () => {
    localStorage.setItem('gh_token', tokenInput.value.trim());
    localStorage.setItem('gh_owner', ownerInput.value.trim());
    localStorage.setItem('gh_repo', repoInput.value.trim());
    testAuth();
  });

  function authHeaders() {
    const token = tokenInput.value.trim();
    return token ? { Authorization: `token ${token}` } : {};
  }

  function repoUrl(path) {
    const owner = ownerInput.value.trim();
    const repo = repoInput.value.trim();
    return `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  }

  async function testAuth() {
    try {
      const res = await fetch(repoUrl('external-sites.csv'), { headers: authHeaders() });
      if (res.ok) {
        authSection.style.display = 'none';
        editorSection.style.display = 'flex';
        await listFiles();
        loadFile(startPath || 'external-sites.csv');
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

  saveFileBtn.addEventListener('click', saveCurrentFile);

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
  if (tokenInput.value && ownerInput.value && repoInput.value) {
    testAuth();
  }
})();
