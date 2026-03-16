import { isBot } from "./detection/detect";
import { getConfig } from "./core/config";
import { createGate } from "./core/api";
import { showOverlay } from "./gate/overlay";
import { startPolling } from "./gate/poll";

async function init(): Promise<void> {
  // 1. Check if bot — if not, exit immediately (zero human impact)
  if (!isBot()) return;

  // 2. Parse config from script tag
  const config = getConfig();
  if (!config) return;

  // 3. Create gate via API
  try {
    const gate = await createGate(
      config.apiUrl,
      config.siteId,
      window.location.href
    );

    // 4. Show overlay with payment instructions
    showOverlay(gate);

    // 5. Poll until paid, then remove overlay
    startPolling(config.apiUrl, gate.gate_id);
  } catch {
    // Silently fail — l.js is Tier 3 enforcement, not a security boundary
  }
}

// Auto-init when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
