// Render sidebar list and iframe viewer for tools

// Dexie database for storing screenshots
const db = new Dexie('toolScreens');
db.version(1).stores({ shots: '&file,data,timestamp' });

async function getScreenshot(file) {
  const rec = await db.shots.get(file);
  return rec ? rec.data : null;
}

async function saveScreenshot(file, data) {
  if (data) {
    await db.shots.put({ file, data, timestamp: Date.now() });
  }
}

async function saveFailure(file) {
  await db.shots.put({ file: file + '#failed', data: '1', timestamp: Date.now() });
}

async function hasFailure(file) {
  return !!(await db.shots.get(file + '#failed'));
}

async function captureScreenshot(iframe) {
  try {
    const doc = iframe.contentWindow.document;
    const canvas = await html2canvas(doc.body);
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Unable to capture screenshot for', iframe.src, err);
    await saveFailure(iframe.src);
    return null;
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
    keywords: s.keywords || []
  })));

  await db.open();

  const searchEl = document.getElementById('search');
  const listEl = document.getElementById('tool-list');
  const gridEl = document.getElementById('grid-view');
  const viewerEl = document.getElementById('viewer');
  const frameEl = document.getElementById('tool-frame');
  const placeholderEl = document.getElementById('viewer-placeholder');
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
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(async entry => {
          if (!entry.isIntersecting) return;
          const card = entry.target;
          const { file } = card.dataset;
          const img = card.querySelector('img.card-frame');
          const iframe = card.querySelector('iframe.card-frame');

          // If we already captured, unobserve
          if (img.dataset.ready === '1') {
            io.unobserve(card);
            return;
          }

          // Load iframe, capture, swap to image, then unload iframe
          iframe.style.display = 'block';
          iframe.onload = async () => {
            const data = await captureScreenshot(iframe);
            await saveScreenshot(file, data);
            if (data) {
              img.src = data;
              img.style.display = 'block';
              img.dataset.ready = '1';
            }
            iframe.src = 'about:blank'; // free resources
            iframe.style.display = 'none';
            io.unobserve(card);
          };
          iframe.src = file;
        });
      },
      { root: gridEl, rootMargin: '200px 0px', threshold: 0.05 }
    );

    for (const tool of list) {
      const card = document.createElement('div');
      card.className = 'tool-card';
      card.dataset.file = tool.file;

      const img = document.createElement('img');
      img.className = 'card-frame';
      img.style.display = 'none';

      const iframe = document.createElement('iframe');
      iframe.className = 'card-frame';
      iframe.style.display = 'none';

      const cached = await getScreenshot(tool.file);
      const failed = await hasFailure(tool.file);
      if (cached) {
        img.src = cached;
        img.style.display = 'block';
        img.dataset.ready = '1';
      }

      const title = document.createElement('h3');
      title.textContent = tool.title;
      const desc = document.createElement('p');
      desc.textContent = tool.description || '';

      card.appendChild(img);
      card.appendChild(iframe);
      card.appendChild(title);
      card.appendChild(desc);
      card.addEventListener('click', () => selectTool(tool));
      gridEl.appendChild(card);

      // Start observing card for lazy iframe loading only if not ready and not failed
      if (!cached && !failed) io.observe(card);
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
      editFileBtn.style.display = 'inline-block';
    } else {
      editFileBtn.style.display = 'none';
    }
  }

  async function selectTool(tool, updateHash = true) {
    if (isMobile()) setSidebarVisible(false);
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
    titleEl.textContent = tool.title;
    descEl.textContent = tool.description || '';
    keysEl.textContent =
      tool.keywords && tool.keywords.length
        ? 'Keywords: ' + tool.keywords.join(', ')
        : '';
    relatedEl.innerHTML = '';
    if (tool.related && tool.related.length) {
      relatedEl.appendChild(document.createTextNode('Similar: '));
      tool.related.forEach((file, idx) => {
        const relTool = allTools.find(t => t.file === file);
        if (relTool) {
          const link = document.createElement('a');
          link.href = '#';
          link.textContent = relTool.title;
          link.addEventListener('click', e => {
            e.preventDefault();
            selectTool(relTool);
          });
          if (idx > 0) relatedEl.appendChild(document.createTextNode(', '));
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
    if (filtered.length) {
      renderGrid(filtered);
      showGrid();
    } else {
      gridEl.innerHTML = '<p>No tool found</p>';
      showGrid();
    }
  }

  function setInfoVisible(show) {
    infoEl.style.display = show ? 'block' : 'none';
    toggleInfoBtn.textContent = show ? 'Hide Info' : 'Show Info';
  }

  searchEl.addEventListener('input', filter);
  backBtn.addEventListener('click', showGrid);
  
  setInfoVisible(!isMobile()); // collapsed on mobile by default
  
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
