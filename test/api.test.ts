import { describe, it, expect, vi, beforeEach } from "vitest";
import { createGate, checkGateStatus } from "../src/core/api";

describe("createGate", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends correct request to gates endpoint", async () => {
    const mockResponse = {
      gate_id: "gate_123",
      price_usd: "0.01",
      splitter: "0xabc",
      collector: "0xdef",
      network: "base",
      asset: "USDC",
      verify_url: "https://xenarch.dev/v1/gates/gate_123/verify",
      expires: "2026-03-15T08:00:00Z",
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 402,
        ok: false,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await createGate(
      "https://xenarch.dev/v1",
      "st_test",
      "https://example.com/article"
    );

    expect(fetch).toHaveBeenCalledWith("https://xenarch.dev/v1/gates", {
      method: "POST",
      headers: {
        "X-Site-Token": "st_test",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "https://example.com/article",
        detection_method: "ua_match",
      }),
    });

    expect(result.gate_id).toBe("gate_123");
    expect(result.price_usd).toBe("0.01");
  });

  it("throws on non-402 error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 500,
        ok: false,
        json: () => Promise.resolve({}),
      })
    );

    await expect(
      createGate("https://xenarch.dev/v1", "st_test", "https://example.com")
    ).rejects.toThrow("Gate creation failed: 500");
  });

  it("rejects invalid API URL protocol", async () => {
    await expect(
      createGate("javascript:alert(1)", "st_test", "https://example.com")
    ).rejects.toThrow("Invalid API URL");
  });

  it("rejects response with missing required fields", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 402,
        ok: false,
        json: () => Promise.resolve({ gate_id: "gate_123" }),
      })
    );

    await expect(
      createGate("https://xenarch.dev/v1", "st_test", "https://example.com")
    ).rejects.toThrow('Invalid response: missing or empty "price_usd"');
  });
});

describe("checkGateStatus", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches gate status", async () => {
    const mockStatus = {
      gate_id: "gate_123",
      status: "pending",
      price_usd: "0.01",
      paid_at: null,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStatus),
      })
    );

    const result = await checkGateStatus("https://xenarch.dev/v1", "gate_123");
    expect(result.status).toBe("pending");
    expect(fetch).toHaveBeenCalledWith(
      "https://xenarch.dev/v1/gates/gate_123"
    );
  });
});
