// Render sidebar list and iframe viewer for tools

// Dexie database for storing screenshots
const db = new Dexie('toolScreens');
db.version(1).stores({ shots: '&file,data,timestamp' });

async function getScreenshot(file) {
  try {
    const rec = await db.shots.get(file);
    return rec ? rec.data : null;
  } catch (e) {
    console.error("Failed to get screenshot from DB", e);
    return null;
  }
}

async function saveScreenshot(file, data) {
  if (data) {
    await db.shots.put({ file, data, timestamp: Date.now() });
  }
}

async function captureScreenshot(iframe) {
  try {
    const doc = iframe.contentWindow.document;
    // Give a brief moment for styles to apply, especially in complex tools
    await new Promise(resolve => setTimeout(resolve, 50)); 
    const canvas = await html2canvas(doc.body, {
      useCORS: true,
      backgroundColor: window.getComputedStyle(doc.body).backgroundColor
    });
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Unable to capture screenshot for', iframe.src, err);
    return null;
  }
}

const screenshotQueue = [];
let isProcessingQueue = false;

async function processScreenshotQueue() {
    if (isProcessingQueue || screenshotQueue.length === 0) {
        return;
    }
    isProcessingQueue = true;
    
    const { tool, img, iframe } = screenshotQueue.shift();

    try {
        const existingShot = await getScreenshot(tool.file);
        if (existingShot) {
            img.src = existingShot;
            img.style.display = 'block';
            iframe.remove(); // No need for the iframe anymore
        } else {
            // Only load iframe if no screenshot exists
            iframe.src = tool.file;
            iframe.style.display = 'block';
            await new Promise((resolve, reject) => {
                iframe.onload = async () => {
                    try {
                        const data = await captureScreenshot(iframe);
                        await saveScreenshot(tool.file, data);
                        if (data) {
                            img.src = data;
                            img.style.display = 'block';
                        }
                        iframe.style.display = 'none';
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                };
                iframe.onerror = reject;
            });
        }
    } catch (e) {
        console.error(`Failed to process screenshot for ${tool.file}`, e);
    } finally {
        isProcessingQueue = false;
        // Process next item after a short delay
        setTimeout(processScreenshotQueue, 200);
    }
}


function enqueueScreenshot(tool, img, iframe) {
    screenshotQueue.push({ tool, img, iframe });
    if (!isProcessingQueue) {
        processScreenshotQueue();
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
    keywords: s.keywords || [],
    related: s.related || []
  })));

  await db.open();

  // Main UI elements
  const searchEl = document.getElementById('search');
  const listEl = document.getElementById('tool-list');
  const gridEl = document.getElementById('grid-view');
  const viewerContainerEl = document.getElementById('viewer-container');
  const viewerTitleEl = document.getElementById('viewer-title');
  const frameEl = document.getElementById('tool-frame');
  const placeholderEl = document.getElementById('viewer-placeholder');
  const titleEl = document.getElementById('tool-title');
  const descEl = document.getElementById('tool-description');
  const keysEl = document.getElementById('tool-keywords');
  const backBtn = document.getElementById('back-button');
  const toggleInfoBtn = document.getElementById('toggle-info');
  const infoEl = document.getElementById('tool-info');
  const editFileBtn = document.getElementById('edit-file');
  let selectedTool = null;
  
  // Command Palette elements
  const commandPalette = document.getElementById('commandPalette');
  const commandPaletteSearch = document.getElementById('commandPalette-search');
  const commandPaletteResults = document.getElementById('commandPalette-results');
  let paletteSelectedIndex = -1;

  function matches(tool, q) {
    q = q.toLowerCase();
    const fullText = [tool.title, tool.description, ...(tool.keywords || [])].join(' ').toLowerCase();
    return fullText.includes(q);
  }

  function renderList(list) {
    listEl.innerHTML = '';
    list.forEach(tool => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = tool.title;
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
    const screenshotTasks = [];

    for (const tool of list) {
        const card = document.createElement('article');
        card.className = 'tool-card';

        const windowFrame = document.createElement('div');
        windowFrame.className = 'card-window';
        const windowHeader = document.createElement('div');
        windowHeader.className = 'card-window-header';
        windowHeader.innerHTML = '<span></span><span></span><span></span>';
        const windowContent = document.createElement('div');
        windowContent.className = 'card-window-content';
        
        const img = document.createElement('img');
        img.className = 'card-frame';
        img.style.display = 'block'; // Display by default, can show a placeholder state
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Transparent 1x1 GIF
        
        const iframe = document.createElement('iframe');
        iframe.className = 'card-frame';
        iframe.style.display = 'none';
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin'); // Security hardening

        screenshotTasks.push({tool, img, iframe});
        
        windowContent.appendChild(img);
        windowContent.appendChild(iframe); // Keep iframe in DOM for loading
        windowFrame.appendChild(windowHeader);
        windowFrame.appendChild(windowContent);
        
        const cardBody = document.createElement('div');
        cardBody.className = 'tool-card-body';
        const title = document.createElement('h5');
        title.textContent = tool.title;
        const desc = document.createElement('p');
        desc.textContent = tool.description || '';
        
        cardBody.appendChild(title);
        cardBody.appendChild(desc);
        card.appendChild(windowFrame);
        card.appendChild(cardBody);
        card.addEventListener('click', () => selectTool(tool));
        gridEl.appendChild(card);
    }
    
    // Start processing queue after a delay
    setTimeout(() => {
        screenshotTasks.forEach(task => enqueueScreenshot(task.tool, task.img, task.iframe));
    }, 10000); // 10-second delay
  }

  function showGrid() {
    viewerContainerEl.style.display = 'none';
    gridEl.style.display = 'grid';
    if (location.hash) {
      history.replaceState(null, '', location.pathname);
    }
  }

  function showViewer() {
    gridEl.style.display = 'none';
    viewerContainerEl.style.display = 'flex';
    if (localStorage.getItem('gh_token')) {
      editFileBtn.style.display = 'inline-block';
    } else {
      editFileBtn.style.display = 'none';
    }
  }

  async function selectTool(tool, updateHash = true) {
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
    viewerTitleEl.textContent = tool.title;
    titleEl.textContent = tool.title;
    descEl.textContent = tool.description || '';
    keysEl.textContent =
      tool.keywords && tool.keywords.length
        ? 'Keywords: ' + tool.keywords.join(', ')
        : '';
    
    // Render related tools
    const relatedToolsContainer = document.getElementById('related-tools-container');
    const relatedGridEl = document.getElementById('related-tools-grid');
    relatedGridEl.innerHTML = '';

    if (tool.related && tool.related.length > 0) {
        for (const relatedTool of tool.related) {
            const relatedCard = document.createElement('div');
            relatedCard.className = 'related-tool-card';
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'related-tool-card-info';
            infoDiv.innerHTML = `<strong>${relatedTool.title}</strong>`;
            
            const img = document.createElement('img');
            img.className = 'related-tool-card-img';
            const relatedShot = await getScreenshot(relatedTool.file);
            if (relatedShot) {
                img.src = relatedShot;
            }
            
            relatedCard.appendChild(infoDiv);
            relatedCard.appendChild(img);
            relatedCard.onclick = (e) => {
                e.preventDefault();
                const fullRelatedTool = allTools.find(t => t.file === relatedTool.file);
                if (fullRelatedTool) selectTool(fullRelatedTool);
            };
            relatedGridEl.appendChild(relatedCard);
        }
        relatedToolsContainer.style.display = 'block';
    } else {
        relatedToolsContainer.style.display = 'none';
    }

    showViewer();
    if (updateHash) {
      location.hash = encodeURIComponent(tool.file);
    }
  }

  function filterAndRender() {
    const q = searchEl.value.trim();
    const filtered = q ? allTools.filter(t => matches(t, q)) : allTools;
    renderList(filtered);
    renderGrid(filtered);
    if (filtered.length === 0) {
      gridEl.innerHTML = '<p>No tools found.</p>';
    }
    showGrid();
  }
  
  // --- Command Palette Logic ---
  function openCommandPalette() {
    commandPalette.showModal();
    commandPaletteSearch.value = '';
    renderPaletteResults('');
    commandPaletteSearch.focus();
  }

  function closeCommandPalette() {
    commandPalette.close();
  }

  function renderPaletteResults(query) {
    const q = query.toLowerCase();
    const results = q ? allTools.filter(t => matches(t, q)) : allTools;
    commandPaletteResults.innerHTML = '';
    paletteSelectedIndex = -1;

    results.slice(0, 50).forEach((tool, index) => {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'palette-result';
        a.dataset.index = index;
        a.dataset.file = tool.file;

        const titleHtml = q ? tool.title.replace(new RegExp(q, 'gi'), (match) => `<mark>${match}</mark>`) : tool.title;
        const descHtml = q && tool.description ? tool.description.replace(new RegExp(q, 'gi'), (match) => `<mark>${match}</mark>`) : tool.description;

        a.innerHTML = `<strong>${titleHtml}</strong><br><small>${descHtml || 'No description'}</small>`;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            selectTool(tool);
            closeCommandPalette();
        });
        commandPaletteResults.appendChild(a);
    });
    updatePaletteSelection();
  }

  function updatePaletteSelection() {
    const results = commandPaletteResults.querySelectorAll('.palette-result');
    results.forEach((el, i) => {
        el.setAttribute('aria-selected', i === paletteSelectedIndex);
    });
    if (paletteSelectedIndex !== -1 && results[paletteSelectedIndex]) {
        results[paletteSelectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function handlePaletteKeyDown(e) {
    const results = commandPaletteResults.querySelectorAll('.palette-result');
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        paletteSelectedIndex = (paletteSelectedIndex + 1) % results.length;
        updatePaletteSelection();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        paletteSelectedIndex = (paletteSelectedIndex - 1 + results.length) % results.length;
        updatePaletteSelection();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (paletteSelectedIndex !== -1 && results[paletteSelectedIndex]) {
            results[paletteSelectedIndex].click();
        } else if (results.length > 0) {
            results[0].click(); // Select first result if none is highlighted
        }
    }
  }

  // --- Event Listeners ---
  searchEl.addEventListener('input', filterAndRender);
  backBtn.addEventListener('click', showGrid);
  toggleInfoBtn.addEventListener('click', () => {
    if (infoEl.style.display === 'none') {
      infoEl.style.display = 'block';
    } else {
      infoEl.style.display = 'none';
    }
  });

  editFileBtn.addEventListener('click', () => {
    if (selectedTool) {
      location.href = `edit.html?file=${encodeURIComponent(selectedTool.file)}`;
    }
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
  
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      openCommandPalette();
    }
    if (e.key === 'Escape' && commandPalette.open) {
      closeCommandPalette();
    }
  });

  commandPaletteSearch.addEventListener('input', (e) => renderPaletteResults(e.target.value));
  commandPaletteSearch.addEventListener('keydown', handlePaletteKeyDown);

  // --- Initial Load ---
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
