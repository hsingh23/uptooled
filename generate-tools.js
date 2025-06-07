const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'tools');
const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

const tools = toolFiles.map(file => {
  const fullPath = path.join(toolsDir, file);
  const html = fs.readFileSync(fullPath, 'utf8');
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : path.parse(file).name;
  const descMatch = html.match(/<meta[^>]+name=['"]description['"][^>]+content=['"]([^'"]*)['"][^>]*>/i);
  const description = descMatch ? descMatch[1].trim() : '';
  const keyMatch = html.match(/<meta[^>]+name=['"]keywords['"][^>]+content=['"]([^'"]*)['"][^>]*>/i);
  const keywords = keyMatch ? keyMatch[1].split(',').map(k => k.trim()).filter(Boolean) : [];
  return {
    file: `tools/${file}`,
    title,
    description,
    keywords
  };
});

fs.writeFileSync(path.join(__dirname, 'tools.json'), JSON.stringify(tools, null, 2));
