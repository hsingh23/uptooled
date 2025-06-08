// Render sidebar list and iframe viewer for tools
async function init() {
  const resTools = await fetch('tools.json?v=' + new Date().getTime());
  const localTools = await resTools.json();

  let externalSites = []; // Default to empty array
  try {
    const resExternal = await fetch('external-sites.json?v=' + new Date().getTime());
    if (resExternal.ok) {
      externalSites = await resExternal.json();
    } else {
      console.error('Failed to load external-sites.json:', resExternal.status);
    }
  } catch (error) {
    console.error('Error fetching external-sites.json:', error);
  }

  const allTools = [
    ...localTools.map(tool => ({ ...tool, isExternal: false, id: tool.file })),
    ...externalSites.filter(site => { // Add filter
      if (site && typeof site.url === 'string' && site.url.trim() !== '') {
        return true;
      }
      console.warn('Filtered out external site due to missing or invalid URL:', site);
      return false;
    }).map(site => ({
      ...site,
      file: site.url,
      isExternal: true,
      id: site.url
    }))
  ];

  const dom = {
    searchEl: document.getElementById('search'),
    listEl: document.getElementById('tool-list'),
    gridEl: document.getElementById('grid-view'),
    viewerEl: document.getElementById('viewer'),
    frameEl: document.getElementById('tool-frame'),
    viewerTitleEl: document.getElementById('tool-title'), // Renamed
    viewerDescEl: document.getElementById('tool-description'), // Renamed
    viewerKeysEl: document.getElementById('tool-keywords'), // Renamed
    backBtn: document.getElementById('back-button'),
    toggleInfoBtn: document.getElementById('toggle-info'),
    infoEl: document.getElementById('tool-info')
  };

  /**
   * Checks if a tool matches a given search query.
   * @param {object} tool The tool object.
   * @param {string} q The search query.
   * @returns {boolean} True if the tool matches, false otherwise.
   */
  function matches(tool, q) {
    q = q.toLowerCase();
    const title = tool.title || '';
    const description = tool.description || '';
    // Ensure keywords is an array and all its elements are strings before calling toLowerCase()
    const keywords = Array.isArray(tool.keywords) ? tool.keywords.map(k => String(k || '')) : [];

    return (
      title.toLowerCase().includes(q) ||
      description.toLowerCase().includes(q) ||
      keywords.some(k => k.toLowerCase().includes(q))
    );
  }

  function renderList(list) {
    dom.listEl.innerHTML = ''; // Use dom object
    list.forEach(tool => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#'; // Will be prevented
      link.textContent = tool.title;
      link.dataset.toolId = tool.id; // Store ID for selection
      link.addEventListener('click', e => {
          e.preventDefault();
          // Find tool by ID from allTools and call selectTool
          const selectedTool = allTools.find(t => t.id === e.target.dataset.toolId);
          if (selectedTool) selectTool(selectedTool);
      });
      li.appendChild(link);
      dom.listEl.appendChild(li); // Use dom object
    });
  }

  function renderGrid(list) {
    dom.gridEl.innerHTML = ''; // Clear previous grid items
    list.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.setAttribute('role', 'button'); // Accessibility
        card.setAttribute('tabindex', '0'); // Accessibility

        const previewArea = document.createElement('div');
        previewArea.className = 'card-preview-area';

        if (tool.isExternal) {
            const icon = document.createElement('span');
            icon.className = 'external-icon';
            icon.textContent = '🔗'; // Placeholder icon for external link
            previewArea.appendChild(icon);
        } else {
            const iframe = document.createElement('iframe');
            iframe.className = 'card-frame';
            iframe.src = tool.file;
            iframe.setAttribute('loading', 'lazy'); // Lazy load iframes
            iframe.setAttribute('title', tool.title + " preview"); // Accessibility
            // Consider adding sandbox attribute if content is untrusted
            // iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
            previewArea.appendChild(iframe);
        }
        card.appendChild(previewArea);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'tool-card-content';

        const titleElCard = document.createElement('h3'); // Renamed to avoid conflict with dom.viewerTitleEl
        titleElCard.textContent = tool.title;
        contentDiv.appendChild(titleElCard);

        const descElCard = document.createElement('p'); // Renamed
        descElCard.textContent = tool.description || 'No description available.';
        contentDiv.appendChild(descElCard);

        card.appendChild(contentDiv);

        card.addEventListener('click', () => selectTool(tool));
        card.addEventListener('keypress', (e) => { // Accessibility for keyboard users
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // Prevent space from scrolling page
                selectTool(tool);
            }
        });
        dom.gridEl.appendChild(card);
    });
  }

  function showGrid() {
    dom.viewerEl.style.display = 'none'; // Use dom object
    dom.gridEl.style.display = 'grid'; // Use dom object
    if (location.hash) {
      history.replaceState(null, '', location.pathname);
    }
  }

  function showViewer() {
    dom.gridEl.style.display = 'none'; // Use dom object
    dom.viewerEl.style.display = 'flex'; // Use dom object
  }

  function selectTool(tool, updateHash = true) {
    console.log('Selecting tool:', tool); // Log the entire tool object

    if (tool && typeof tool.file === 'string' && tool.file.trim() !== '') {
      if (tool.isExternal) {
        if (!tool.file.startsWith('http://') && !tool.file.startsWith('https://')) {
          console.error('External tool URL does not start with http(s):', tool.file);
          // Optionally handle this more gracefully in the UI
        }
      }
      dom.frameEl.src = tool.file;
      console.log(`Set iframe src to: "${tool.file}" for tool: "${tool.title}"`);
    } else {
      console.error('Invalid or empty tool.file for tool:', tool.title, tool);
      dom.frameEl.src = 'about:blank'; // Set to a blank page to indicate error
      dom.viewerTitleEl.textContent = tool.title || "Error";
      dom.viewerDescEl.textContent = "Could not load this tool: Invalid file path or URL.";
      dom.viewerKeysEl.textContent = "";
      showViewer(); // Make sure viewer is shown to display the error
      if (updateHash) {
         location.hash = encodeURIComponent(tool.id || tool.title || 'error');
      }
      return; // Stop further processing for this invalid tool
    }

    dom.viewerTitleEl.textContent = tool.title;
    dom.viewerDescEl.textContent = tool.description || '';
    dom.viewerKeysEl.textContent =
      tool.keywords && Array.isArray(tool.keywords) && tool.keywords.length // Added Array.isArray check
        ? 'Keywords: ' + tool.keywords.join(', ')
        : '';
    showViewer();
    if (updateHash) {
      location.hash = encodeURIComponent(tool.id);
    }
  }

  function filter() {
    const q = dom.searchEl.value.trim(); // Use dom object
    const filtered = q ? allTools.filter(t => matches(t, q)) : allTools;
    renderList(filtered);
    if (filtered.length) {
      renderGrid(filtered);
      showGrid();
    } else {
      dom.gridEl.innerHTML = '<p>No tool found</p>'; // Use dom object
      showGrid();
    }
  }

  dom.searchEl.addEventListener('input', filter); // Use dom object
  dom.backBtn.addEventListener('click', showGrid); // Use dom object
  dom.toggleInfoBtn.addEventListener('click', () => { // Use dom object
    if (dom.infoEl.style.display === 'none') { // Use dom object
      dom.infoEl.style.display = 'block'; // Use dom object
      dom.toggleInfoBtn.textContent = 'Hide Info'; // Use dom object
    } else {
      dom.infoEl.style.display = 'none'; // Use dom object
      dom.toggleInfoBtn.textContent = 'Show Info'; // Use dom object
    }
  });

  window.addEventListener('hashchange', () => {
    const id = decodeURIComponent(location.hash.slice(1)); // id from hash
    if (id) {
      const tool = allTools.find(t => t.id === id); // Use allTools and id
      if (tool) selectTool(tool, false);
    } else {
      showGrid();
    }
  });

  renderList(allTools); // Use allTools
  renderGrid(allTools); // Use allTools

  const startId = decodeURIComponent(location.hash.slice(1)); // id from hash
  if (startId) {
    const tool = allTools.find(t => t.id === startId); // Use allTools and id
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
