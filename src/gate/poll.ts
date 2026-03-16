import { checkGateStatus } from "../core/api";
import { removeOverlay } from "./overlay";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_DURATION_MS = 600_000; // 10 minutes

/**
 * Poll gate status until payment is confirmed, then remove the overlay.
 */
export function startPolling(apiUrl: string, gateId: string): void {
  const startTime = Date.now();

  const poll = async () => {
    if (Date.now() - startTime > MAX_POLL_DURATION_MS) {
      return; // stop polling after timeout
    }

    try {
      const status = await checkGateStatus(apiUrl, gateId);
      if (status.status === "paid") {
        removeOverlay();
        sessionStorage.setItem(`xenarch_gate_${gateId}`, "paid");
        return;
      }
    } catch {
      // silently retry on network errors
    }

    setTimeout(poll, POLL_INTERVAL_MS);
  };

  setTimeout(poll, POLL_INTERVAL_MS);
}
