// Render sidebar list and iframe viewer for tools
async function init() {
  const res = await fetch('tools.json');
  const tools = await res.json();

  const searchEl = document.getElementById('search');
  const listEl = document.getElementById('tool-list');
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

  function selectTool(tool) {
    frameEl.src = tool.file;
    titleEl.textContent = tool.title;
    descEl.textContent = tool.description || '';
    keysEl.textContent =
      tool.keywords && tool.keywords.length
        ? 'Keywords: ' + tool.keywords.join(', ')
        : '';
  }

  function filter() {
    const q = searchEl.value.trim();
    const filtered = q ? tools.filter(t => matches(t, q)) : tools;
    renderList(filtered);
    if (filtered.length) {
      selectTool(filtered[0]);
    } else {
      frameEl.src = '';
      titleEl.textContent = 'No tool found';
      descEl.textContent = '';
      keysEl.textContent = '';
    }
  }

  searchEl.addEventListener('input', filter);
  renderList(tools);
  if (tools.length) selectTool(tools[0]);
}

document.addEventListener('DOMContentLoaded', init);
