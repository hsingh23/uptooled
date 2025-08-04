// Render sidebar list and iframe viewer for tools

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

  const searchEl = document.getElementById('search');
  const listEl = document.getElementById('tool-list');
  const gridEl = document.getElementById('grid-view');
  const viewerEl = document.getElementById('viewer');
  const frameEl = document.getElementById('tool-frame');
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

  function renderGrid(list) {
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

    for (const tool of list) {
      const card = document.createElement('div');
      card.className = 'tool-card';
      card.dataset.file = tool.file;
      
      const iframe = document.createElement('iframe');
      iframe.className = 'card-frame';
      iframe.src = tool.file;
      
      const title = document.createElement('h3');
      title.textContent = tool.title;
      
      const desc = document.createElement('p');
      desc.textContent = tool.description || '';
      
      card.appendChild(iframe);
      card.appendChild(title);
      card.appendChild(desc);
      
      card.addEventListener('click', () => selectTool(tool));
      gridEl.appendChild(card);
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

  function selectTool(tool, updateHash = true) {
    if (isMobile()) setSidebarVisible(false);
    
    selectedTool = tool;
    frameEl.src = tool.file;
    frameEl.style.display = 'block';
    
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
