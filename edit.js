(function() {
  const tokenInput = document.getElementById('token');
  const ownerInput = document.getElementById('owner');
  const repoInput = document.getElementById('repo');
  const saveAuthBtn = document.getElementById('save-auth');
  const csvArea = document.getElementById('csv-content');
  const loadCsvBtn = document.getElementById('load-csv');
  const saveCsvBtn = document.getElementById('save-csv');
  const toolPathInput = document.getElementById('tool-path');
  const toolArea = document.getElementById('tool-content');
  const loadToolBtn = document.getElementById('load-tool');
  const saveToolBtn = document.getElementById('save-tool');

  const shas = {};

  // Populate from localStorage
  tokenInput.value = localStorage.getItem('gh_token') || '';
  ownerInput.value = localStorage.getItem('gh_owner') || '';
  repoInput.value = localStorage.getItem('gh_repo') || '';

  saveAuthBtn.addEventListener('click', () => {
    localStorage.setItem('gh_token', tokenInput.value.trim());
    localStorage.setItem('gh_owner', ownerInput.value.trim());
    localStorage.setItem('gh_repo', repoInput.value.trim());
    alert('Auth info saved');
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

  async function loadFile(path, area) {
    const res = await fetch(repoUrl(path), { headers: authHeaders() });
    if (res.status === 404) {
      area.value = '';
      shas[path] = null;
      return;
    }
    if (!res.ok) {
      alert('Failed to load file: ' + res.status);
      return;
    }
    const data = await res.json();
    area.value = atob(data.content.replace(/\n/g, ''));
    shas[path] = data.sha;
  }

  async function saveFile(path, area, message) {
    const body = {
      message,
      content: btoa(area.value),
    };
    if (shas[path]) body.sha = shas[path];
    const res = await fetch(repoUrl(path), {
      method: 'PUT',
      headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      alert('Save failed: ' + text);
      return;
    }
    const data = await res.json();
    shas[path] = data.content.sha;
    alert('Saved');
  }

  loadCsvBtn.addEventListener('click', () => loadFile('external-sites.csv', csvArea));
  saveCsvBtn.addEventListener('click', () => saveFile('external-sites.csv', csvArea, 'Update external sites'));

  loadToolBtn.addEventListener('click', () => {
    const path = toolPathInput.value.trim();
    if (path) loadFile(path, toolArea);
  });
  saveToolBtn.addEventListener('click', () => {
    const path = toolPathInput.value.trim();
    if (path) saveFile(path, toolArea, `Update ${path}`);
  });
})();
