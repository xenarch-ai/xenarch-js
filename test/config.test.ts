import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getConfig } from "../src/core/config";

describe("getConfig", () => {
  let script: HTMLScriptElement;

  beforeEach(() => {
    script = document.createElement("script");
    script.src = "https://cdn.xenarch.dev/l.js";
    document.head.appendChild(script);
  });

  afterEach(() => {
    script.remove();
  });

  it("reads data-site-id from script tag", () => {
    script.setAttribute("data-site-id", "st_test123");
    const config = getConfig();
    expect(config?.siteId).toBe("st_test123");
  });

  it("returns null when no data-site-id", () => {
    const config = getConfig();
    expect(config).toBeNull();
  });

  it("defaults api url to xenarch.dev", () => {
    script.setAttribute("data-site-id", "st_test");
    const config = getConfig();
    expect(config?.apiUrl).toBe("https://xenarch.dev/v1");
  });

  it("reads custom api url", () => {
    script.setAttribute("data-site-id", "st_test");
    script.setAttribute("data-api-url", "http://localhost:8000/v1");
    const config = getConfig();
    expect(config?.apiUrl).toBe("http://localhost:8000/v1");
  });

  it("reads price override", () => {
    script.setAttribute("data-site-id", "st_test");
    script.setAttribute("data-price", "50");
    const config = getConfig();
    expect(config?.price).toBe(50);
  });

  it("returns null when no l.js script tag found", () => {
    script.remove();
    const config = getConfig();
    expect(config).toBeNull();
  });

  it("rejects invalid API URL protocol", () => {
    script.setAttribute("data-site-id", "st_test");
    script.setAttribute("data-api-url", "javascript:alert(1)");
    const config = getConfig();
    expect(config).toBeNull();
  });

  it("ignores invalid price values", () => {
    script.setAttribute("data-site-id", "st_test");
    script.setAttribute("data-price", "not-a-number");
    const config = getConfig();
    expect(config?.price).toBeUndefined();
  });

  it("rejects negative price", () => {
    script.setAttribute("data-site-id", "st_test");
    script.setAttribute("data-price", "-5");
    const config = getConfig();
    expect(config?.price).toBeUndefined();
  });
});
