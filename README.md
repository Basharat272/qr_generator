# GenQR — Free QR Code Generator

A fast, private, **free QR code generator** built with Angular. Paste any URL, generate a QR code instantly in your browser — no signup, no server, no watermarks.

## Features

- Free QR generator with PNG & SVG download
- Copy link & share (native share + social fallbacks)
- 100% client-side — your data never leaves your browser
- Dark mode, responsive, SEO-optimized
- Security headers + CSP

## Quick start

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build → dist/linkqr/browser
npm test
```

---

## Deploy for free

### Option A — Cloudflare Pages (recommended)

**Free URL:** `https://generateqr.pages.dev` (choose `generateqr` as the project name)

1. Upload or connect your project at [Cloudflare Pages](https://pages.cloudflare.com/).
2. Build settings:
   - Build command: `npm run build`
   - Build output: `dist/linkqr/browser`
3. Update `SITE_CONFIG.url` in `src/app/core/constants/seo.constants.ts` plus `src/index.html`, `public/robots.txt`, and `public/sitemap.xml` with your live URL.

SPA routing is handled via `public/_redirects`.

### Option B — Netlify

**Free URL:** `https://generateqr.netlify.app`

1. Connect your project at [netlify.com](https://www.netlify.com/).
2. Build: `npm run build`, publish directory: `dist/linkqr/browser`.
3. Set site name to `generateqr` in the Netlify dashboard.
4. Update SEO URLs as above.

### Custom domain (cheap, not free)

A domain like `generateqr.com` costs ~$10–15/year. Budget options:

| Registrar | Example | ~Price |
|-----------|---------|--------|
| Cloudflare | `generateqr.xyz` | ~$2–10/yr |
| Namecheap | `getgenqr.com` | ~$10/yr |
| Porkbun | `generateqr.app` | ~$12/yr |

Point DNS to your host and add a `CNAME` file in `public/` with your domain.

---

## SEO checklist (after deploy)

1. **Google Search Console** — add your site and submit `sitemap.xml`.
2. **Bing Webmaster Tools** — submit the same sitemap.
3. **Update `SITE_CONFIG.url`** so canonical URLs, Open Graph, and JSON-LD match your live domain.
4. **Share your link** for backlinks over time.

Already included:

- Meta title & description for target keywords
- Open Graph + Twitter cards
- JSON-LD (`WebApplication`, `FAQPage`, `WebSite`)
- `robots.txt` + `sitemap.xml`
- Semantic HTML + FAQ content section

---

## Project structure

```
src/app/
├── core/          # validators, services, SEO config
├── features/qr-generator/
└── shared/        # theme-toggle, toast, seo-content
```

## Security

| Measure | Details |
|---------|---------|
| URL allowlist | http/https only |
| CSP | Scripts restricted to self |
| Privacy | No server — QR generated client-side |
| Share links | Sanitized via DomSanitizer |

## Legacy

Original single-file prototype: `legacy/index.html`

## License

MIT
