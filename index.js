// Minimal search and render for tools
async function init() {
  const res = await fetch('tools.json');
  const tools = await res.json();
  const container = document.getElementById('tool-container');
  const search = document.getElementById('search');

  function matches(tool, q) {
    q = q.toLowerCase();
    return tool.title.toLowerCase().includes(q) ||
           tool.description.toLowerCase().includes(q) ||
           (tool.keywords || []).some(k => k.toLowerCase().includes(q));
  }

  function render(list) {
    container.innerHTML = '';
    list.forEach(tool => {
      const col = document.createElement('div');
      col.className = 'mui-col-md-4 mui-col-sm-6 mui-col-xs-12';
      const panel = document.createElement('div');
      panel.className = 'mui-panel tool-card';
      const iframe = document.createElement('iframe');
      iframe.src = tool.file;
      iframe.className = 'tool-frame';
      const title = document.createElement('h3');
      title.textContent = tool.title;
      const desc = document.createElement('p');
      desc.textContent = tool.description;
      panel.appendChild(iframe);
      panel.appendChild(title);
      panel.appendChild(desc);
      if (tool.keywords && tool.keywords.length) {
        const keys = document.createElement('small');
        keys.textContent = 'Keywords: ' + tool.keywords.join(', ');
        panel.appendChild(keys);
      }
      col.appendChild(panel);
      container.appendChild(col);
    });
  }

  function filter() {
    const q = search.value.trim();
    render(q ? tools.filter(t => matches(t, q)) : tools);
  }

  search.addEventListener('input', filter);
  render(tools);
}

document.addEventListener('DOMContentLoaded', init);
