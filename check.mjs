import fs from 'node:fs';import assert from 'node:assert/strict';import path from 'node:path';
const routes=JSON.parse(fs.readFileSync('routes.json'));const C=JSON.parse(fs.readFileSync('src/config.json'));const basePath=process.env.SITE_ORIGIN?new URL(process.env.SITE_ORIGIN).pathname.replace(/\/$/,''):'';const titles=new Set();let links=0;
for(const route of routes){const html=fs.readFileSync(path.join('dist',route.path,'index.html'),'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route.path);assert(html.includes(`<html lang="${route.lang}">`));assert(!html.includes('undefined'));assert(!html.includes('[object Object]'));const title=html.match(/<title>(.*?)<\/title>/s)[1];assert(!titles.has(route.lang+title),`duplicate title ${title}`);titles.add(route.lang+title);assert.equal((html.match(/hreflang=/g)||[]).length,13);assert(html.includes('tally.so/embed/kdD946'));const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);const faq=schema.find(s=>s['@type']==='FAQPage');if(faq)assert.equal(faq.mainEntity.length,6);
for(const m of html.matchAll(/(?:href|src)="(\/[^"#]*)(#[^"]*)?"/g)){const target=basePath&&m[1].startsWith(basePath+'/')?m[1].slice(basePath.length):m[1],hash=m[2];const dest=target.endsWith('/')?path.join('dist',target,'index.html'):path.join('dist',target);assert(fs.existsSync(dest),`${route.path}: missing ${dest}`);if(hash&&dest.endsWith('.html'))assert(fs.readFileSync(dest,'utf8').includes(`id="${hash.slice(1)}"`),`missing anchor ${hash}`);links++}}
assert.equal(routes.length,48);assert.equal(Math.round(644000/C.aedPerUsd),175357);assert.equal(Math.round(1314000/C.aedPerUsd),357794);assert.equal(C.studioFloors.length,6);assert.equal(C.twoBed.units.length,5);
console.log(`PASS: ${routes.length} pages; ${links} internal links/assets; unique titles; languages/hreflang; FAQ JSON-LD; Tally; representative AED/USD calculations.`);

const origin=(process.env.SITE_ORIGIN||C.origin||'').replace(/\/$/,'');
if(origin){
 const index=fs.readFileSync('dist/sitemap.xml','utf8');
 for(const name of ['sitemap-pages.xml','sitemap-images.xml'])assert(index.includes(`<loc>${origin}/${name}</loc>`));
 const pages=fs.readFileSync('dist/sitemap-pages.xml','utf8');
 assert.equal((pages.match(/<url>/g)||[]).length,routes.length);
 assert.equal((pages.match(/<xhtml:link /g)||[]).length,routes.length*7);
 for(const route of routes){
  assert(pages.includes(`<loc>${origin+route.path}</loc>`));
  const html=fs.readFileSync(path.join('dist',route.path,'index.html'),'utf8');
  assert(html.includes(`<link rel="canonical" href="${origin+route.path}">`));
 }
 assert(fs.readFileSync('dist/robots.txt','utf8').includes(`Sitemap: ${origin}/sitemap.xml`));
 assert(fs.readFileSync('dist/404.html','utf8').includes('noindex,follow'));
 console.log('PASS: sitemap index, 48 URLs, 336 language alternatives, canonical URLs, robots.txt and 404 indexing.');
}

for(const route of routes){
 const html=fs.readFileSync(path.join('dist',route.path,'index.html'),'utf8');
 if(route.key==='plans'){
  assert.equal((html.match(/data-plan-group=/g)||[]).length,6);
  assert(html.includes('amenities-first-plan.webp')&&html.includes('amenities-roof-plan.webp'));
 }
 if(route.key==='r1')assert.equal((html.match(/data-plan-group=/g)||[]).length,4);
 for(const match of html.matchAll(/href="([^"]+)" data-plan /g))assert(match[1].endsWith('.webp'));
}
console.log('PASS: six plans and two amenity sheets in every language; all four one-bedroom variants.');

for(const route of routes){const html=fs.readFileSync(path.join('dist',route.path,'index.html'),'utf8');for(const tag of ['og:image','twitter:image'])assert(html.includes(`content="${origin}/assets/social-hero.jpg"`));assert(html.includes('property="og:image:width" content="1200"'));assert(html.includes('property="og:image:height" content="630"'));}assert(fs.existsSync('dist/assets/social-hero.jpg'));console.log('PASS: social hero metadata on all 48 pages.');
