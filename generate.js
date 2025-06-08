const fs = require('fs');
const path = require('path');

async function generateTools() {
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
    return { file: `tools/${file}`, title, description, keywords };
  });
  fs.writeFileSync(path.join(__dirname, 'tools.json'), JSON.stringify(tools, null, 2) + '\n');
}

function sanitizeFilename(url) {
  return url.replace(/[^a-z0-9]/gi, '_');
}

function parseCSV(data) {
  const lines = data.trim().split(/\r?\n/).filter(Boolean);
  const headers = lines.shift().split(',').map(h => h.trim().toLowerCase());
  const urlIdx = headers.indexOf('url');
  const cacheIdx = headers.indexOf('cache');
  return lines.map(line => {
    const cols = line.split(',');
    const url = cols[urlIdx] ? cols[urlIdx].trim() : '';
    const cacheFlag = cols[cacheIdx] ? cols[cacheIdx].trim().toLowerCase() : 'n';
    return { url, cache: cacheFlag.startsWith('y') };
  }).filter(r => r.url);
}

async function fetchSite(url, useCache, cacheDir) {
  const cacheFile = path.join(cacheDir, sanitizeFilename(url) + '.html');
  let html;
  if (useCache && fs.existsSync(cacheFile)) {
    html = fs.readFileSync(cacheFile, 'utf8');
  } else {
    const res = await fetch(url);
    html = await res.text();
    if (useCache) {
      fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(cacheFile, html);
    }
  }
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : url;
  const descMatch = html.match(/<meta[^>]+name=['"]description['"][^>]+content=['"]([^'"]*)['"][^>]*>/i);
  const description = descMatch ? descMatch[1].trim() : '';
  const keyMatch = html.match(/<meta[^>]+name=['"]keywords['"][^>]+content=['"]([^'"]*)['"][^>]*>/i);
  const keywords = keyMatch ? keyMatch[1].split(',').map(k => k.trim()).filter(Boolean) : [];
  return { url, title, description, keywords };
}

async function generateExternalSites() {
  const csvPath = path.join(__dirname, 'external-sites.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('external-sites.csv not found');
    return [];
  }
  const cacheDir = path.join(__dirname, 'site-cache');
  const csvData = fs.readFileSync(csvPath, 'utf8');
  const entries = parseCSV(csvData);
  const tasks = entries.map(e => fetchSite(e.url, e.cache, cacheDir));
  const sites = await Promise.all(tasks);
  fs.writeFileSync(path.join(__dirname, 'external-sites.json'), JSON.stringify(sites, null, 2) + '\n');
  return sites;
}

async function main() {
  await generateTools();
  await generateExternalSites();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
