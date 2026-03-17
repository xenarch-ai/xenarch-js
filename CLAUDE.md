# xenarch-js

Client-side JavaScript snippet for publishers. Detects AI agent visitors and triggers the payment gate. Delivered as a single file via Cloudflare CDN.

## Stack

- TypeScript source, esbuild bundler
- Output: single `dist/l.js` (<9KB gzipped)

## Commands

- Build: `npm run build`
- Dev: `npm run dev` (watch mode)
- Test: `npm test`

## Key Directories

```
src/
  detection/    — bot detection signatures (update when new bots appear)
  gate/         — payment gate UI
  core/         — initialization and config
dist/
  l.js          — built output (tracked in git, deployed to CDN)
```

## Deploy

Push `dist/l.js` to Cloudflare CDN. The snippet is loaded by publishers via:
```html
<script src="https://cdn.xenarch.dev/l.js" data-site-id="..."></script>
```

## Workflow

See root `../CLAUDE.md` for branching, PR, and commit conventions.

## Architecture

See `../Information/design/detection.md` for detection approach.
