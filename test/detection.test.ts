import { describe, it, expect } from "vitest";
import { isBot } from "../src/detection/detect";
import { BOT_SIGNATURES } from "../src/detection/signatures";

describe("isBot", () => {
  it("detects all 21 known bot signatures", () => {
    for (const sig of BOT_SIGNATURES) {
      const ua = `Mozilla/5.0 (compatible; ${sig}/1.0)`;
      expect(isBot(ua)).toBe(true);
    }
    expect(BOT_SIGNATURES).toHaveLength(21);
  });

  it("is case-insensitive", () => {
    expect(isBot("mozilla/5.0 gptbot/1.0")).toBe(true);
    expect(isBot("CLAUDEBOT")).toBe(true);
  });

  it("returns false for human browsers", () => {
    expect(
      isBot(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      )
    ).toBe(false);
  });

  it("returns false for empty or missing user agent", () => {
    expect(isBot("")).toBe(false);
  });

  it("detects bot when signature is part of a longer string", () => {
    expect(isBot("some-prefix-GPTBot-suffix")).toBe(true);
  });
});
