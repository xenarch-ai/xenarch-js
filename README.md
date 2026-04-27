> **🅿️ PARKED — 2026-04-27**
>
> This repository is parked and read-only. The client-side payment-gate snippet is no longer maintained.
>
> **Why:** server-side enforcement (Xenarch SDK middleware, Cloudflare Worker, WordPress + Joomla plugins) covers ~75–90% of publishers. Client-side JS is bypassable by any agent that doesn't execute JavaScript and is documented in `architecture-v3.md` as "UX enhancement, not a security boundary." Maintenance cost outweighed the marginal coverage.
>
> **Unpark conditions** (revisit if any become true):
> - Cooperative browser agents (Operator, Computer Use, etc.) ship with USDC-on-Base wallets and the overlay → pay flow becomes a real conversion path
> - Managed-platform publishers (Wix, Squarespace) become a priority ICP with measurable demand
> - A new client-side detection signal emerges that the server can't get on its own
>
> **Decision record:** [Linear XEN-147](https://linear.app/xtro/issue/XEN-147)
>
> The source and built `dist/l.js` (5.6KB) remain in git for future resurrection. To unpark: unarchive the GitHub repo, remove this banner, restore plugin frontend hooks.

---

# xenarch-js

Client-side bot detection and payment gate for Xenarch publishers.

A lightweight (<9KB) JavaScript snippet that detects AI agent visitors and presents a payment gate powered by the Xenarch network.

## Usage

Add to your site:

```html
<script src="https://cdn.xenarch.dev/l.js" data-site-id="YOUR_SITE_ID"></script>
```

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT
