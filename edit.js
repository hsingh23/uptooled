(function() {
    const tokenInput = document.getElementById('token');
    const saveAuthBtn = document.getElementById('save-auth');
    const toolPathInput = document.getElementById('tool-path');
    const loadToolFromPathBtn = document.getElementById('load-tool-from-path');
    const saveActiveTabBtn = document.getElementById('save-active-tab');
    const tabBar = document.getElementById('tab-bar');
    const tabContentContainer = document.getElementById('tab-content-container');
    const noActiveTabMessage = document.getElementById('no-active-tab-message');

    const sidebarFileList = document.getElementById('sidebar-file-list');
    const tokenErrorMessage = document.getElementById('token-error-message');

    let tabs = [];
    let activeTabId = null;

    function repoUrl(path) {
        const owner = 'hsingh23';
        const repo = 'uptooled';
        return `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
    }
    function generateTabId() { return 'tab-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9); }
    function authHeaders() {
        const token = localStorage.getItem('gh_token');
        // GitHub now recommends "Bearer" for PATs, though "token" also works.
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async function populateSidebarFiles() {
        // Add CSV link first
        sidebarFileList.innerHTML = '<ul><li><a href="#" id="load-csv-sidebar-link" data-path="external-sites.csv" class="sidebar-link">external-sites.csv</a></li></ul><hr style="margin: 0.5rem 0;" /><h3 style="font-size:0.9rem; color:#495057; margin:0.8rem 0 0.4rem 0; font-weight:600;">Tools:</h3><ul id="tools-ul"></ul>';
        document.getElementById('load-csv-sidebar-link').addEventListener('click', (e) => {
            e.preventDefault();
            loadFileIntoTab('external-sites.csv', 'csv');
        });

        const toolsUl = document.getElementById('tools-ul');
        toolsUl.innerHTML = '<li><em>Loading...</em></li>';
        const url = repoUrl('tools');

        try {
            const res = await fetch(url, { headers: authHeaders() });
            if (!res.ok) {
                const errorText = await res.text().catch(()=> "Failed to get error details");
                throw new Error(`GitHub API error: ${res.status} - ${errorText}`);
            }
            const files = await res.json();
            toolsUl.innerHTML = '';
            if (files && Array.isArray(files) && files.length > 0) {
                files.filter(file => file.type === 'file' && (file.name.endsWith('.html') || file.name.endsWith('.js') || file.name.endsWith('.css')))
                     .sort((a, b) => a.name.localeCompare(b.name)) // Sort files alphabetically
                     .forEach(file => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = '#'; a.textContent = file.name; a.dataset.filePath = file.path; a.classList.add('sidebar-link');
                    a.addEventListener('click', (event) => {
                        event.preventDefault();
                        const filePath = event.target.dataset.filePath;
                        toolPathInput.value = filePath;
                        loadFileIntoTab(filePath, 'tool');
                    });
                    li.appendChild(a); toolsUl.appendChild(li);
                });
                if (toolsUl.childElementCount === 0) toolsUl.innerHTML = '<li><em>No compatible tool files found.</em></li>';
            } else {
                toolsUl.innerHTML = '<li><em>No tool files found or directory is empty.</em></li>';
            }
        } catch (error) {
            console.error('Failed to load tool files for sidebar:', error);
            toolsUl.innerHTML = `<li><em style="color:#d9534f;">Error loading tools. Check console.</em></li>`;
            tokenErrorMessage.textContent = `Failed to load files. ${String(error.message).substring(0, 200)}. Check token/permissions.`;
        }
    }

    function updateSidebarActiveState(activePath) {
        const links = sidebarFileList.querySelectorAll('a.sidebar-link');
        links.forEach(link => {
            if (link.dataset.filePath === activePath || (link.id === 'load-csv-sidebar-link' && activePath === 'external-sites.csv')) {
                link.classList.add('active-file');
            } else {
                link.classList.remove('active-file');
            }
        });
    }

    function createTab(filePath, fileType, initialContent = '') {
        const tabId = generateTabId();
        const fileName = filePath.split('/').pop() || "untitled";

        const li = document.createElement('li');
        li.className = 'mui-tabs__item';
        const a = document.createElement('a');
        a.dataset.muiTab = `#${tabId}`; // MUI uses this to associate link with pane

        const titleSpan = document.createElement('span');
        titleSpan.textContent = fileName;
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;'; // 'x' symbol
        closeBtn.className = 'tab-close-btn';
        closeBtn.title = 'Close tab';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); e.preventDefault(); // Prevent tab switch and default link behavior
            closeTab(tabId);
        });
        a.appendChild(titleSpan); a.appendChild(closeBtn);
        li.appendChild(a);
        tabBar.appendChild(li);

        const contentDiv = document.createElement('div');
        contentDiv.id = tabId; contentDiv.className = 'mui-tabs__pane';
        const textArea = document.createElement('textarea');
        contentDiv.appendChild(textArea);
        tabContentContainer.appendChild(contentDiv);

        let mode = 'htmlmixed';
        if (fileType === 'csv') mode = 'text/plain';
        else if (filePath.endsWith('.js')) mode = 'javascript';
        else if (filePath.endsWith('.css')) mode = 'css';

        const editor = CodeMirror.fromTextArea(textArea, {
            lineNumbers: true, mode, theme: 'material',
            viewportMargin: Infinity // Auto-adjust height
        });
        editor.setValue(initialContent);

        // Ensure CodeMirror editor takes up available space in the tab pane
        contentDiv.style.display = 'flex'; contentDiv.style.flexDirection = 'column';
        contentDiv.style.flexGrow = '1'; // Pane itself should grow
        editor.getWrapperElement().style.flexGrow = '1'; // CodeMirror wrapper should grow

        const tabData = { id: tabId, title: fileName, path: filePath, editor, sha: null, fileType };
        tabs.push(tabData);

        li.addEventListener('click', (e) => { e.preventDefault(); switchTab(tabId); });

        noActiveTabMessage.style.display = 'none';
        switchTab(tabId); // Activate the new tab
        return tabData;
    }

    function switchTab(tabId) {
        activeTabId = tabId;
        let currentTab = null;
        tabs.forEach(tab => {
            const pane = document.getElementById(tab.id);
            const tabLinkAnchor = tabBar.querySelector(`a[data-mui-tab="#${tab.id}"]`);
            if (!tabLinkAnchor || !pane) {
                console.warn("Tab or pane not found for ID:", tab.id);
                return;
            }
            const tabLinkLi = tabLinkAnchor.parentNode;

            if (tab.id === tabId) {
                pane.classList.add('mui--is-active');
                pane.style.display = 'flex'; // Ensure it's visible and flex takes effect
                tabLinkLi.classList.add('mui--is-active');
                currentTab = tab;
                // Refresh CodeMirror instance, slight delay can help with layout issues
                setTimeout(() => {
                    if (tab.editor) tab.editor.refresh();
                }, 0);
            } else {
                pane.classList.remove('mui--is-active');
                pane.style.display = 'none';
                tabLinkLi.classList.remove('mui--is-active');
            }
        });

        if (currentTab) {
            toolPathInput.value = currentTab.path;
            updateSidebarActiveState(currentTab.path);
        } else {
            toolPathInput.value = ''; // Clear if no tab is active (e.g. all closed)
            updateSidebarActiveState(null);
        }
        noActiveTabMessage.style.display = tabs.length > 0 && activeTabId ? 'none' : 'block';
    }

    function closeTab(tabId) {
        const tabIndex = tabs.findIndex(t => t.id === tabId);
        if (tabIndex === -1) return;

        const tabData = tabs[tabIndex];
        // Remove CodeMirror instance and its wrapper if it exists
        if (tabData.editor) {
            tabData.editor.getWrapperElement().remove();
        }
        // Remove tab pane
        const paneElement = document.getElementById(tabData.id);
        if (paneElement) paneElement.remove();
        // Remove tab link
        const tabLinkAnchor = tabBar.querySelector(`a[data-mui-tab="#${tabData.id}"]`);
        if (tabLinkAnchor) tabLinkAnchor.parentNode.remove();

        tabs.splice(tabIndex, 1);

        if (activeTabId === tabId) { // If the closed tab was active
            activeTabId = null; // Reset activeTabId before switching
            if (tabs.length > 0) {
                // Switch to the previous tab or the first tab if closing the first one
                const newActiveIndex = Math.max(0, tabIndex - 1);
                switchTab(tabs[newActiveIndex] ? tabs[newActiveIndex].id : (tabs[0] ? tabs[0].id : null) );
            }
        }
        // This needs to be outside the previous if, to correctly show message when last tab is closed
        if (tabs.length === 0) {
             noActiveTabMessage.style.display = 'block';
             toolPathInput.value = '';
             updateSidebarActiveState(null);
             activeTabId = null; // Ensure activeTabId is null if no tabs are left
        }
    }

    async function loadFileIntoTab(filePath, fileType, initialContentProvided = false, initialContent = '') {
        const existingTab = tabs.find(t => t.path === filePath);
        if (existingTab) {
            switchTab(existingTab.id);
            return;
        }
        if (tabs.length >= 10) { // Limit number of open tabs
            tokenErrorMessage.textContent = "Max tabs reached (10). Please close some tabs to open new ones.";
            setTimeout(() => { if (tokenErrorMessage.textContent === "Max tabs reached (10). Please close some tabs to open new ones.") tokenErrorMessage.textContent = ""; }, 3000);
            return;
        }

        if (initialContentProvided) { // For creating a new, unsaved file with some initial content
            createTab(filePath, fileType, initialContent);
            return;
        }

        // Existing file loading logic
        try {
            const res = await fetch(repoUrl(filePath), { headers: authHeaders() });
            let content = ''; let sha = null;

            if (res.status === 404) { // File not found, treat as new file
                console.log(`File ${filePath} not found on GitHub. Creating a new tab for it.`);
                // No alert needed here, will be opened as an empty new file
            } else if (res.ok) {
                const data = await res.json();
                if (data.content) { // Ensure content exists
                    const
                    contentAsUTF8 = new TextDecoder("utf-8").decode(Uint8Array.from(atob(data.content.replace(/\n/g, '')), c => c.charCodeAt(0)));
                    content = contentAsUTF8;
                }
                sha = data.sha;
            } else { // Other errors during fetch
                const errorText = await res.text().catch(() => "Failed to get error details");
                throw new Error(`Failed to load ${filePath}: ${res.status} - ${String(errorText).substring(0,150)}`);
            }
            const tabData = createTab(filePath, fileType, content);
            if(tabData) tabData.sha = sha; // Store SHA for existing files
        } catch (error) {
            console.error(error);
            tokenErrorMessage.textContent = error.message;
        }
    }

    async function saveActiveTabData() {
        if (!activeTabId) {
            tokenErrorMessage.textContent = "No active tab to save.";
            setTimeout(() => { if(tokenErrorMessage.textContent === "No active tab to save.") tokenErrorMessage.textContent = '';}, 3000);
            return;
        }
        const activeTab = tabs.find(t => t.id === activeTabId);
        if (!activeTab) {
            tokenErrorMessage.textContent = "Active tab not found.";
            return;
        }

        const contentToSave = activeTab.editor.getValue();
        const commitMessage = `Update ${activeTab.path}`;

        saveActiveTabBtn.disabled = true; saveActiveTabBtn.textContent = 'Saving...';
        try {
            // Convert content to Base64 correctly for UTF-8
            const base64Content = btoa(unescape(encodeURIComponent(contentToSave)));

            const body = { message: commitMessage, content: base64Content };
            if (activeTab.sha) body.sha = activeTab.sha; // Include SHA if updating an existing file

            const res = await fetch(repoUrl(activeTab.path), {
                method: 'PUT',
                headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const errorText = await res.text().catch(()=> "Failed to get error details");
                throw new Error(`Save failed: ${res.status} - ${String(errorText).substring(0,150)}`);
            }
            const data = await res.json();
            activeTab.sha = data.content.sha; // Update SHA after successful save
            tokenErrorMessage.textContent = `${activeTab.title} saved successfully!`;
            setTimeout(() => { if(tokenErrorMessage.textContent === `${activeTab.title} saved successfully!`) tokenErrorMessage.textContent = '';}, 3000);
        } catch (error) {
            console.error('Save failed:', error);
            tokenErrorMessage.textContent = `Save failed: ${error.message}`;
        } finally {
            saveActiveTabBtn.disabled = false; saveActiveTabBtn.textContent = 'Save Active Tab';
        }
    }

    // Event listener for "Save and Verify Token" button
    saveAuthBtn.addEventListener('click', async () => {
        const tokenValue = tokenInput.value.trim();
        if (!tokenValue) { tokenErrorMessage.textContent = 'Token cannot be empty.'; return; }
        localStorage.setItem('gh_token', tokenValue);
        tokenErrorMessage.textContent = 'Verifying token...';
        saveAuthBtn.disabled = true; tokenInput.disabled = true;
        try {
            // Attempt to fetch user data as a way to verify the token's validity and permissions
            const res = await fetch(`https://api.github.com/user`, { headers: authHeaders() });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({message: "Token validation request failed."}));
                throw new Error(`Token validation failed: ${res.status} ${String(errorData.message).substring(0,100)}`);
            }
            tokenErrorMessage.textContent = 'Token verified and saved!';
            setTimeout(() => { if (tokenErrorMessage.textContent === 'Token verified and saved!') tokenErrorMessage.textContent = ''; }, 3000);
            document.getElementById('token-container').style.display = 'none';
            saveAuthBtn.style.display = 'none';
            await populateSidebarFiles(); // Load file list into sidebar
            // Automatically load external-sites.csv if not already open
            const csvTabExists = tabs.some(tab => tab.path === 'external-sites.csv');
            if (!csvTabExists) await loadFileIntoTab('external-sites.csv', 'csv');
            else if (tabs.length === 1 && tabs[0].path === 'external-sites.csv') updateSidebarActiveState('external-sites.csv'); // Ensure sidebar state is correct if it's the only tab
        } catch (error) {
            localStorage.removeItem('gh_token'); // Remove invalid token
            tokenErrorMessage.textContent = `Error: ${error.message}. Please check token and permissions.`;
            document.getElementById('token-container').style.display = 'block'; // Show token input again
            saveAuthBtn.style.display = 'block';
        } finally {
            saveAuthBtn.disabled = false; tokenInput.disabled = false;
        }
    });

    // Event listener for "Open/Create" button
    loadToolFromPathBtn.addEventListener('click', () => {
        let pathValue = toolPathInput.value.trim();
        if (pathValue) {
            // If just a filename like "MyTool.html", assume it's in "tools/"
            if (!pathValue.includes('/') && (pathValue.endsWith('.html') || pathValue.endsWith('.js') || pathValue.endsWith('.css'))) {
                pathValue = 'tools/' + pathValue;
            }
            loadFileIntoTab(pathValue, 'tool'); // 'tool' type for syntax highlighting, etc.
            toolPathInput.value = ''; // Clear input after loading
        } else {
            tokenErrorMessage.textContent = "Please enter a file path.";
            setTimeout(() => { if (tokenErrorMessage.textContent === "Please enter a file path.") tokenErrorMessage.textContent = ''; }, 3000);
        }
    });

    saveActiveTabBtn.addEventListener('click', saveActiveTabData);

    // Initial application setup
    async function initializeApp() {
        if (localStorage.getItem('gh_token')) {
            tokenInput.value = localStorage.getItem('gh_token');
            tokenErrorMessage.textContent = 'Verifying stored token...';
            document.getElementById('token-container').style.display = 'block'; // Show initially for verification
            saveAuthBtn.style.display = 'block'; // Show initially for verification
            saveAuthBtn.disabled = true; tokenInput.disabled = true; // Disable while verifying
            try {
                const res = await fetch(`https://api.github.com/user`, { headers: authHeaders() });
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({message: "Token validation request failed."}));
                    throw new Error(`Stored token invalid: ${res.status} ${String(errorData.message).substring(0,100)}`);
                }
                tokenErrorMessage.textContent = ''; // Clear verification message
                document.getElementById('token-container').style.display = 'none'; // Hide on success
                saveAuthBtn.style.display = 'none'; // Hide on success
                await populateSidebarFiles();
                const csvTabExists = tabs.some(tab => tab.path === 'external-sites.csv');
                if (!csvTabExists) await loadFileIntoTab('external-sites.csv', 'csv');
                else if(tabs.length === 1 && tabs[0].path === 'external-sites.csv') updateSidebarActiveState('external-sites.csv');
            } catch (error) {
                localStorage.removeItem('gh_token');
                tokenErrorMessage.textContent = `Error with stored token: ${error.message}. Please re-enter.`;
                // Keep token input visible if stored token is invalid
            } finally {
                saveAuthBtn.disabled = false; tokenInput.disabled = false; // Re-enable after attempt
            }
        } else {
            // No token stored, prompt user to enter one
            document.getElementById('token-container').style.display = 'block';
            saveAuthBtn.style.display = 'block';
            tokenErrorMessage.textContent = 'GitHub token required to load and save files.';
            sidebarFileList.innerHTML = '<p style="padding:0.5rem; font-size:0.85rem; color:#6c757d;"><em>Enter GitHub token to browse files.</em></p>';
        }
    }
    initializeApp();
})();
