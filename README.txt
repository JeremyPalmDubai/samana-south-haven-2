SAMANA South Haven 2

Multilingual property website: English, French, Spanish, Dutch, German and Portuguese.
48 pages, developer imagery and vector logo extracted from the supplied brochures, floor plans, AED/USD prices, Tally lead form, country buying guides, responsive layouts and reduced-motion support.

Live site: https://jeremypalmdubai.github.io/samana-south-haven-2/

GitHub Pages publishes automatically from main using .github/workflows/pages.yml.
build.mjs generates pages from src/locales.json and src/config.json. The compiled Tailwind CSS and optimized images are kept in dist/assets. The deployment has no runtime package dependencies.

For stylesheet changes: install the package.json dependencies, then run npm run build. Commit the generated dist/assets/styles.css.
For local preview: node build.mjs and serve dist with a static server. SITE_ORIGIN and SITE_INDEXABLE=true generate public canonical URLs, hreflang and sitemaps. URL subdirectories such as GitHub Pages project paths are supported.

Prices supplied 9 October 2026. USD amounts are indicative at AED 3.6725/USD. One-bedroom prices, payment schedule and handover are on request. Availability requires confirmation. Visas depend on authority requirements and approval.

The Tally form kdD946 remains in English; translate its fields in Tally. No external navigation links are emitted by the website; the embedded Tally branding is controlled by the provider.

Assets and project names retain their respective owners' rights. No licence to third-party media is implied.

SEO deployment
The workflow uses the active GitHub Pages base URL for canonical URLs, hreflang, robots.txt and all sitemaps. sitemap.xml indexes sitemap-pages.xml (48 pages, six languages plus x-default) and sitemap-images.xml (images actually present on each page). The 404 page is noindex.

Prepared domain: https://samana-south-haven-2.com
seo-domain/ contains the prepared domain-specific sitemap and robots files. These are reference files, not deployed under the current GitHub Pages URL. DNS and the Pages custom-domain setting have not been changed. Once the domain is connected in GitHub Pages, rerun Publish website to generate all pages and SEO files for the active domain automatically.

Redesign: Belleza display type inspired by the brochure, with Onest body type and self-hosted font files (licences in dist/assets). Six apartment plans, individual floor keyplans, complete brochure sheets, two amenity plans, location map, accessible zoom/download viewer, six-language filtering and an apartment-first home page. The social preview is the project hero as a 1200 x 630 JPEG, declared in Open Graph and Twitter metadata on every page.

Hostinger Node.js deployment
Framework: Other. Node.js: 22 or 24. Project root: repository root. Build command: npm run build:hostinger. Start command: npm start. Entry file: server.js in the project root. Generated website folder: dist. Do not change the application root to dist; the server needs the source generator at startup. The app listens on 0.0.0.0 and PORT (default 3000), generates all 48 pages before serving and uses https://samana-south-haven-2.com by default. SITE_ORIGIN and SITE_INDEXABLE can override this. Compiled styles are already committed; this deployment path needs no runtime dependencies. The separate GitHub Pages workflow continues to use its own active origin.
