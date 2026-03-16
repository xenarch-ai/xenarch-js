import { describe, it, expect, afterEach } from "vitest";
import { showOverlay, removeOverlay } from "../src/gate/overlay";
import type { GateResponse } from "../src/core/api";

const mockGate: GateResponse = {
  gate_id: "gate_test123",
  price_usd: "0.05",
  splitter: "0x1234567890abcdef1234567890abcdef12345678",
  collector: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  network: "base",
  asset: "USDC",
  verify_url: "https://xenarch.bot/v1/gates/gate_test123/verify",
  expires: "2026-03-15T08:00:00Z",
};

describe("overlay", () => {
  afterEach(() => {
    removeOverlay();
  });

  it("creates overlay element", () => {
    showOverlay(mockGate);
    const overlay = document.getElementById("xenarch-gate-overlay");
    expect(overlay).not.toBeNull();
  });

  it("displays price", () => {
    showOverlay(mockGate);
    const overlay = document.getElementById("xenarch-gate-overlay");
    expect(overlay?.textContent).toContain("$0.05");
  });

  it("displays gate id", () => {
    showOverlay(mockGate);
    const overlay = document.getElementById("xenarch-gate-overlay");
    expect(overlay?.textContent).toContain("gate_test123");
  });

  it("displays network and splitter", () => {
    showOverlay(mockGate);
    const overlay = document.getElementById("xenarch-gate-overlay");
    expect(overlay?.textContent).toContain("base");
    expect(overlay?.textContent).toContain(mockGate.splitter);
  });

  it("injects styles", () => {
    showOverlay(mockGate);
    const styles = document.getElementById("xenarch-gate-styles");
    expect(styles).not.toBeNull();
  });

  it("removes overlay and styles", () => {
    showOverlay(mockGate);
    removeOverlay();
    expect(document.getElementById("xenarch-gate-overlay")).toBeNull();
    expect(document.getElementById("xenarch-gate-styles")).toBeNull();
  });

  it("escapes malicious content in gate fields (XSS prevention)", () => {
    const maliciousGate: GateResponse = {
      ...mockGate,
      splitter: '<img src=x onerror="alert(1)">',
      collector: '<script>alert("xss")</script>',
      network: '"><svg onload=alert(1)>',
    };
    showOverlay(maliciousGate);
    const overlay = document.getElementById("xenarch-gate-overlay");
    expect(overlay?.innerHTML).not.toContain("<img");
    expect(overlay?.innerHTML).not.toContain("<script");
    expect(overlay?.innerHTML).not.toContain("<svg");
    // But the text content should still be visible as escaped text
    expect(overlay?.textContent).toContain('<img src=x onerror="alert(1)">');
  });
});
