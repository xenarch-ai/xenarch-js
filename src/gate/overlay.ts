import type { GateResponse } from "../core/api";

const OVERLAY_ID = "xenarch-gate-overlay";

const STYLES = `
  #${OVERLAY_ID} {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #fff;
  }
  #${OVERLAY_ID} .xn-card {
    background: #1a1a2e;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 32px;
    max-width: 420px;
    width: 90%;
    text-align: center;
  }
  #${OVERLAY_ID} .xn-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px;
  }
  #${OVERLAY_ID} .xn-subtitle {
    font-size: 14px;
    color: #aaa;
    margin: 0 0 24px;
  }
  #${OVERLAY_ID} .xn-price {
    font-size: 32px;
    font-weight: 700;
    color: #4ade80;
    margin: 0 0 24px;
  }
  #${OVERLAY_ID} .xn-details {
    text-align: left;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 16px;
    margin: 0 0 24px;
    font-size: 12px;
    line-height: 1.8;
    word-break: break-all;
  }
  #${OVERLAY_ID} .xn-label {
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  #${OVERLAY_ID} .xn-status {
    font-size: 14px;
    color: #facc15;
  }
  #${OVERLAY_ID} .xn-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(250, 204, 21, 0.3);
    border-top-color: #facc15;
    border-radius: 50%;
    animation: xn-spin 0.8s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }
  @keyframes xn-spin {
    to { transform: rotate(360deg); }
  }
`;

/** Create a detail row with a label and safe text value. */
function detailRow(label: string, value: string): HTMLDivElement {
  const row = document.createElement("div");
  const span = document.createElement("span");
  span.className = "xn-label";
  span.textContent = label;
  row.appendChild(span);
  row.appendChild(document.createTextNode(" " + value));
  return row;
}

/**
 * Create and show the payment gate overlay.
 * Uses DOM APIs (textContent) instead of innerHTML to prevent XSS.
 */
export function showOverlay(gate: GateResponse): void {
  // Inject styles
  if (!document.getElementById("xenarch-gate-styles")) {
    const style = document.createElement("style");
    style.id = "xenarch-gate-styles";
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  // Build overlay with safe DOM APIs
  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;

  const card = document.createElement("div");
  card.className = "xn-card";

  const title = document.createElement("p");
  title.className = "xn-title";
  title.textContent = "This content requires payment";

  const subtitle = document.createElement("p");
  subtitle.className = "xn-subtitle";
  subtitle.textContent = "AI agent access via Xenarch";

  const price = document.createElement("p");
  price.className = "xn-price";
  price.textContent = `$${gate.price_usd}`;

  const details = document.createElement("div");
  details.className = "xn-details";
  details.appendChild(detailRow("Network:", gate.network));
  details.appendChild(detailRow("Asset:", gate.asset || "USDC"));
  details.appendChild(detailRow("Splitter:", gate.splitter));
  details.appendChild(detailRow("Collector:", gate.collector));
  details.appendChild(detailRow("Gate ID:", gate.gate_id));

  const status = document.createElement("p");
  status.className = "xn-status";
  const spinner = document.createElement("span");
  spinner.className = "xn-spinner";
  status.appendChild(spinner);
  status.appendChild(document.createTextNode("Waiting for payment\u2026"));

  card.append(title, subtitle, price, details, status);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

/**
 * Remove the payment gate overlay.
 */
export function removeOverlay(): void {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) overlay.remove();
  const styles = document.getElementById("xenarch-gate-styles");
  if (styles) styles.remove();
}
