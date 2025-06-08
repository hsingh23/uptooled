(function() {
  const tokenInput = document.getElementById('token');
  const saveAuthBtn = document.getElementById('save-auth');
  const loadCsvBtn = document.getElementById('load-csv'); // Will be repurposed
  const toolPathInput = document.getElementById('tool-path'); // Will be repurposed
  const fileBrowserContainer = document.getElementById('file-browser');
  const loadToolFromPathBtn = document.getElementById('load-tool-from-path');
  const saveActiveTabBtn = document.getElementById('save-active-tab');
  const tabBar = document.getElementById('tab-bar');
  const tabContentContainer = document.getElementById('tab-content-container');
  const noActiveTabMessage = document.getElementById('no-active-tab-message');

  let tabs = []; // Array to store tab data { id, title, path, editor, sha, fileType }
  let activeTabId = null;

  // Populate from localStorage
  tokenInput.value = localStorage.getItem('gh_token') || '';

  function generateTabId() {
    return 'tab-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  function createTab(filePath, fileType, initialContent = '') {
    const tabId = generateTabId();
    const fileName = filePath.split('/').pop() || 'untitled';

    // Tab Link
    const li = document.createElement('li');
    li.className = 'mui-tabs__item'; // MUI class for tab item
    const a = document.createElement('a');
    a.dataset.muiToggle = 'tab'; // Required by MUI for tab functionality
    a.dataset.muiTarget = `#${tabId}`; // Link to the pane
    a.textContent = fileName;

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = ' &times;'; // Using times symbol for 'x'
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginLeft = '5px';
    closeBtn.onclick = (e) => {
        e.stopPropagation(); // Prevent tab switch when clicking close
        closeTab(tabId);
    };
    a.appendChild(closeBtn);
    li.appendChild(a);
    tabBar.appendChild(li);

    // Tab Content Pane
    const contentDiv = document.createElement('div');
    contentDiv.id = tabId;
    contentDiv.className = 'mui-tabs__pane'; // MUI class for tab pane
    const textArea = document.createElement('textarea');
    contentDiv.appendChild(textArea);
    tabContentContainer.appendChild(contentDiv);

    const editor = CodeMirror.fromTextArea(textArea, {
        lineNumbers: true,
        mode: fileType === 'csv' ? 'text/plain' : (filePath.endsWith('.js') ? 'javascript' : (filePath.endsWith('.css') ? 'css' : 'htmlmixed')),
        theme: 'material'
    });
    editor.setValue(initialContent);

    const tabData = { id: tabId, title: fileName, path: filePath, editor, sha: null, fileType };
    tabs.push(tabData);

    // Manually activate the new tab (MUI's JS might be needed for full auto behavior)
    // For now, just switch to it. If mui.js is loaded, it might pick this up.
    // We call mui.tabs.activate() later if needed, or rely on switchTab.

    li.addEventListener('click', (e) => {
      // If MUI is handling tabs, this might not be strictly necessary
      // but ensures our switchTab logic runs.
      // Prevent default if 'a' is clicked, to stop it from navigating to '#'
      if (e.target.tagName === 'A') e.preventDefault();
      switchTab(tabId);
    });

    if (noActiveTabMessage) noActiveTabMessage.style.display = 'none';
    switchTab(tabId); // Switch to the new tab

    return tabData;
  }

  function switchTab(tabId) {
    if (!tabs.find(t => t.id === tabId)) {
        // If target tab doesn't exist (e.g., was just closed and this is a followup), do nothing or switch to first.
        if (tabs.length > 0) {
            activeTabId = null; // Clear activeTabId before switching to the first available
            switchTab(tabs[0].id);
        } else {
            activeTabId = null;
            if (noActiveTabMessage) noActiveTabMessage.style.display = 'block';
            toolPathInput.value = '';
        }
        return;
    }

    tabs.forEach(tab => {
        const pane = document.getElementById(tab.id);
        const tabLinkLi = tabBar.querySelector(`a[data-mui-target="#${tab.id}"]`)?.parentNode;

        if (!pane || !tabLinkLi) {
            console.warn(`Could not find pane or tab link for tabId: ${tab.id}`);
            return;
        }

        if (tab.id === tabId) {
            pane.classList.add('mui--is-active');
            tabLinkLi.classList.add('mui--is-active');
            activeTabId = tabId;
            const currentTab = tabs.find(t => t.id === activeTabId);
            if (currentTab) { // currentTab should always be found here
                toolPathInput.value = currentTab.path;
                currentTab.editor.refresh(); // Refresh CodeMirror instance
            }
        } else {
            pane.classList.remove('mui--is-active');
            tabLinkLi.classList.remove('mui--is-active');
        }
    });
    if (tabs.length === 0 && noActiveTabMessage) {
        noActiveTabMessage.style.display = 'block';
        toolPathInput.value = '';
    } else if (noActiveTabMessage) {
        noActiveTabMessage.style.display = 'none';
    }
  }

  function closeTab(tabIdToClose) {
    const tabIndex = tabs.findIndex(t => t.id === tabIdToClose);
    if (tabIndex === -1) return;

    const tabData = tabs[tabIndex];
    tabBar.querySelector(`a[data-mui-target="#${tabData.id}"]`)?.parentNode.remove();
    document.getElementById(tabData.id)?.remove();
    tabs.splice(tabIndex, 1);

    if (activeTabId === tabIdToClose) {
        activeTabId = null; // Clear activeTabId before switching
        if (tabs.length > 0) {
            // Switch to the previous tab or the first tab if closing the first one
            switchTab(tabs[Math.max(0, tabIndex - 1)]?.id || (tabs.length > 0 ? tabs[0].id : null));
        } else {
            // No tabs left
            if (noActiveTabMessage) noActiveTabMessage.style.display = 'block';
            toolPathInput.value = ''; // Clear path input
        }
    } else if (tabs.length === 0) {
        if (noActiveTabMessage) noActiveTabMessage.style.display = 'block';
        toolPathInput.value = '';
    }
    // If closed tab was not active, the active tab remains the same, no need to switch unless it was the only one.
     if (tabs.length === 0 && noActiveTabMessage) { // Ensure message shows if all tabs are closed
        noActiveTabMessage.style.display = 'block';
        toolPathInput.value = '';
    }
  }

  saveAuthBtn.addEventListener('click', () => {
    localStorage.setItem('gh_token', tokenInput.value.trim());
    alert('Auth info saved');
  });

  function authHeaders() {
    const token = tokenInput.value.trim();
    return token ? { Authorization: `token ${token}` } : {};
  }

  function repoUrl(path) {
    const owner = "hsingh23";
    const repo = "uptooled";
    return `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  }

  async function loadFileIntoTab(filePath, fileType, initialContentProvided = false, initialContent = '') {
    // Check if tab for this path already exists
    const existingTab = tabs.find(t => t.path === filePath);
    if (existingTab) {
      switchTab(existingTab.id);
      return;
    }

    // If initial content is not provided, fetch it. Otherwise, create tab directly.
    if (!initialContentProvided) {
      const res = await fetch(repoUrl(filePath), { headers: authHeaders() });
      if (res.status === 404) {
        // File not found on GitHub, open as new file in a new tab
        const newTab = createTab(filePath, fileType, ''); // Pass empty string for new files
        newTab.sha = null; // Explicitly null for new files
        alert(`File not found on GitHub: ${filePath}. Opened as a new file.`);
        return newTab;
      }
      if (!res.ok) {
        alert('Failed to load file: ' + res.status);
        return;
      }
      const data = await res.json();
      const fileContent = atob(data.content.replace(/\n/g, ''));
      const tab = createTab(filePath, fileType, fileContent);
      tab.sha = data.sha; // Store SHA with the tab
      return tab;
    } else {
      // Content is provided (e.g. for a new untitled file, though current plan doesn't use this flow)
      const tab = createTab(filePath, fileType, initialContent);
      tab.sha = null; // New file, so no SHA yet
      return tab;
    }
  }

  async function saveActiveTabData() {
    if (!activeTabId) {
      alert('No active tab to save.');
      return;
    }
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (!activeTab) {
      alert('Error: Active tab data not found.');
      return;
    }

    const content = activeTab.editor.getValue();
    if (!content && activeTab.path !== 'external-sites.csv') { // Allow saving empty external-sites.csv
      // Optional: confirm if user wants to save an empty file for other types
      // if (!confirm(`Save empty file ${activeTab.path}?`)) return;
    }

    const message = `Update ${activeTab.path}`; // Simple commit message
    const body = {
      message,
      content: btoa(content), // Base64 encode content
    };
    if (activeTab.sha) {
      body.sha = activeTab.sha; // Include SHA if it's an existing file being updated
    }

    const res = await fetch(repoUrl(activeTab.path), {
      method: 'PUT',
      headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(`Save failed: ${errorData.message || res.status}`);
      return;
    }
    const data = await res.json();
    activeTab.sha = data.content.sha; // Update SHA for the tab
    alert(`File ${activeTab.path} saved successfully.`);
  }

  loadCsvBtn.addEventListener('click', () => {
    loadFileIntoTab('external-sites.csv', 'csv');
  });

  loadToolFromPathBtn.addEventListener('click', () => {
    const path = toolPathInput.value.trim();
    if (path) {
      // Basic check if it's a full path or just a filename
      if (!path.startsWith('tools/') && !path.includes('/')) {
        loadFileIntoTab(`tools/${path}`, 'tool');
      } else {
        loadFileIntoTab(path, 'tool');
      }
    } else {
      alert('Please enter a file path.');
    }
  });

  saveActiveTabBtn.addEventListener('click', () => {
    saveActiveTabData();
  });

  if (localStorage.getItem('gh_token')) {
    document.getElementById('token-container').style.display = 'none';
    saveAuthBtn.style.display = 'none';
    loadFileBrowser(); // Call file browser loader if token exists
    loadFileIntoTab('external-sites.csv', 'csv'); // Automatically load CSV
  } else {
    // If no token, perhaps prompt or ensure the file browser shows a message
    // The loadFileBrowser function itself handles showing a message if no token
    loadFileBrowser();
  }

  async function loadFileBrowser() {
    const token = localStorage.getItem('gh_token'); // Use directly from localStorage as tokenInput might be hidden
    if (!token) {
      // Optionally, display a message in the file browser area if no token is available
      fileBrowserContainer.innerHTML = '<p>GitHub token not set. Please set it above to browse files.</p>';
      return;
    }

    const owner = 'hsingh23'; // Hardcoded
    const repo = 'uptooled'; // Hardcoded
    const path = 'tools';
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;

    const res = await fetch(url, { headers: authHeaders() }); // authHeaders should still work
    if (!res.ok) {
      alert('Failed to load file browser: ' + res.status);
      fileBrowserContainer.innerHTML = '<p>Error loading files.</p>';
      return;
    }
    const files = await res.json();

    if (files && files.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'mui-list--unstyled'; // Optional styling
      let foundHtmlFiles = false;
      files.forEach(file => {
        if (file.type === 'file' && file.name.endsWith('.html')) { // Filter for .html files
          foundHtmlFiles = true;
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#';
          a.textContent = file.name;
          a.dataset.filePath = file.path; // Store full path for loading
          a.addEventListener('click', (event) => {
            event.preventDefault();
            const filePath = event.target.dataset.filePath;
            loadFileIntoTab(filePath, 'tool'); // Use new function
          });
          li.appendChild(a);
          ul.appendChild(li);
        }
      });
      fileBrowserContainer.innerHTML = ''; // Clear previous content (e.g., loading message)
      if (foundHtmlFiles) {
        fileBrowserContainer.appendChild(ul);
      } else {
        fileBrowserContainer.innerHTML = '<p>No .html files found in the tools directory.</p>';
      }
    } else {
      fileBrowserContainer.innerHTML = '<p>No files found in the tools directory.</p>';
    }
  }
})();
