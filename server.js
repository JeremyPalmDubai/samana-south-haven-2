import http from 'node:http';
import fs from 'node:fs';
import { stat, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
const directory = path.join(root, 'dist');
// The repository contains source + assets; generate HTML before accepting traffic.
// This also replaces any preview or GitHub-subdirectory URLs with Hostinger URLs.
const build = spawnSync(process.execPath, ['hostinger-build.mjs'], { cwd: root, stdio: 'inherit', env: process.env });
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status || 1);
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer from 1 to 65535');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.xml':'application/xml; charset=utf-8', '.txt':'text/plain; charset=utf-8', '.webp':'image/webp', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.ttf':'font/ttf', '.woff2':'font/woff2', '.ico':'image/x-icon' };
const inside = file => file === directory || file.startsWith(directory + path.sep);
const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow:'GET, HEAD' }); res.end('Method not allowed'); return;
  }
  let pathname, query;
  try {
    const url = new URL(req.url, 'http://localhost');
    pathname = decodeURIComponent(url.pathname); query = url.search;
    if (pathname.includes('\0') || pathname.includes('\\')) throw new Error('Invalid path');
  } catch { res.writeHead(400); res.end('Bad request'); return; }
  let file = path.resolve(directory, '.' + pathname), status = 200;
  if (!inside(file) || pathname.split('/').some(part => part.startsWith('.'))) {
    res.writeHead(404); res.end('Not found'); return;
  }
  try {
    let info;
    try { info = await stat(file); } catch (error) { if (!['ENOENT','ENOTDIR'].includes(error.code)) throw error; }
    if (info?.isDirectory()) {
      if (!pathname.endsWith('/')) {
        // Build a local-only redirect, never use the untrusted Host header.
        res.writeHead(308, { Location: encodeURI(pathname).replace(/^\/+/, '/') + '/' + query }); res.end(); return;
      }
      file = path.join(file, 'index.html');
    }
    try { info = await stat(file); } catch (error) { if (!['ENOENT','ENOTDIR'].includes(error.code)) throw error; info = null; }
    if (!info?.isFile()) { file = path.join(directory, '404.html'); info = await stat(file); status = 404; }
    if (!inside(await realpath(file))) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(status, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': status === 200 && pathname.startsWith('/assets/') ? 'public, max-age=3600' : 'no-cache',
    });
    if (req.method === 'HEAD') { res.end(); return; }
    const stream = fs.createReadStream(file);
    stream.on('error', () => res.destroy()); stream.pipe(res);
  } catch (error) {
    console.error('Static response failed:', error.code || error.message);
    if (!res.headersSent) res.writeHead(500); res.end('Internal server error');
  }
});
server.listen(port, '0.0.0.0', () => console.log(`SAMANA website listening on 0.0.0.0:${port}`));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 10000).unref();
});
