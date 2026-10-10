import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Hostinger runs the repository as an application, independently of GitHub Pages.
const root = path.dirname(fileURLToPath(import.meta.url));
const env = {
  ...process.env,
  SITE_ORIGIN: process.env.SITE_ORIGIN || 'https://samana-south-haven-2.com',
  SITE_INDEXABLE: process.env.SITE_INDEXABLE || 'true',
};
for (const file of ['build.mjs', 'check.mjs']) {
  const result = spawnSync(process.execPath, [file], { cwd: root, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
