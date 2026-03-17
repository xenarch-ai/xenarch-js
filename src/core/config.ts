export interface XenarchConfig {
  siteId: string;
  apiUrl: string;
  price?: number;
}

/**
 * Read configuration from the l.js script tag's data attributes.
 * Finds the script tag by looking for src containing "l.js".
 */
export function getConfig(): XenarchConfig | null {
  const scripts = document.querySelectorAll("script[src]");
  let scriptTag: HTMLScriptElement | null = null;

  for (const s of scripts) {
    const el = s as HTMLScriptElement;
    if (el.src && el.src.includes("l.js")) {
      scriptTag = el;
      break;
    }
  }

  if (!scriptTag) return null;

  const siteId = scriptTag.getAttribute("data-site-id");
  if (!siteId) return null;

  const rawApiUrl =
    scriptTag.getAttribute("data-api-url") || "https://xenarch.dev/v1";

  // Validate API URL protocol
  let apiUrl: string;
  try {
    const parsed = new URL(rawApiUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    apiUrl = rawApiUrl;
  } catch {
    return null;
  }

  const priceAttr = scriptTag.getAttribute("data-price");
  let price: number | undefined;
  if (priceAttr) {
    const parsed = parseInt(priceAttr, 10);
    price = !isNaN(parsed) && parsed >= 0 && parsed <= 100_00 ? parsed : undefined;
  }

  return { siteId, apiUrl, price };
}
