// Render sidebar list and iframe viewer for tools
async function init() {
  const res = await fetch('tools.json');
  const tools = await res.json();

  const searchEl = document.getElementById('search');
  const listEl = document.getElementById('tool-list');
  const gridEl = document.getElementById('grid-view');
  const viewerEl = document.getElementById('viewer');
  const frameEl = document.getElementById('tool-frame');
  const titleEl = document.getElementById('tool-title');
  const descEl = document.getElementById('tool-description');
  const keysEl = document.getElementById('tool-keywords');

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

  function renderGrid(list) {
    gridEl.innerHTML = '';
    list.forEach(tool => {
      const card = document.createElement('div');
      card.className = 'tool-card';
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
    });
  }

  function showGrid() {
    viewerEl.style.display = 'none';
    gridEl.style.display = 'grid';
  }

  function showViewer() {
    gridEl.style.display = 'none';
    viewerEl.style.display = 'flex';
  }

  function selectTool(tool) {
    frameEl.src = tool.file;
    titleEl.textContent = tool.title;
    descEl.textContent = tool.description || '';
    keysEl.textContent =
      tool.keywords && tool.keywords.length
        ? 'Keywords: ' + tool.keywords.join(', ')
        : '';
    showViewer();
  }

  function filter() {
    const q = searchEl.value.trim();
    const filtered = q ? tools.filter(t => matches(t, q)) : tools;
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
  renderList(tools);
  renderGrid(tools);
  showGrid();
}

document.addEventListener('DOMContentLoaded', init);
