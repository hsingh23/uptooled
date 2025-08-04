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

async function captureScreenshot(iframe) {
  try {
    const doc = iframe.contentWindow.document;
    const canvas = await html2canvas(doc.body);
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Unable to capture screenshot for', iframe.src, err);
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
  let selectedTool = null;

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
    for (const tool of list) {
      const card = document.createElement('div');
      card.className = 'tool-card';

      const img = document.createElement('img');
      img.className = 'card-frame';
      img.style.display = 'none';

      const iframe = document.createElement('iframe');
      iframe.className = 'card-frame';
      iframe.style.display = 'none';

      const shot = await getScreenshot(tool.file);
      if (shot) {
        img.src = shot;
        img.style.display = 'block';
      } else {
        // If no shot yet, start loading iframe for capture
        iframe.style.display = 'block';
      }
      iframe.addEventListener('load', async () => {
        // Once iframe loads, capture and cache, then swap to image to reduce CPU
        const data = await captureScreenshot(iframe);
        await saveScreenshot(tool.file, data);
        if (data) {
          img.src = data;
          img.style.display = 'block';
          iframe.style.display = 'none';
        }
      });
      iframe.src = tool.file;

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
    }
  }

  function showGrid() {
    viewerEl.style.display = 'none';
    gridEl.style.display = 'grid';
    if (location.hash) {
      history.replaceState(null, '', location.pathname);
    }
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

  searchEl.addEventListener('input', filter);
  backBtn.addEventListener('click', showGrid);
  toggleInfoBtn.addEventListener('click', () => {
    if (infoEl.style.display === 'none') {
      infoEl.style.display = 'block';
      toggleInfoBtn.textContent = 'Hide Info';
    } else {
      infoEl.style.display = 'none';
      toggleInfoBtn.textContent = 'Show Info';
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
