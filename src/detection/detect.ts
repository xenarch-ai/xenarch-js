import { BOT_SIGNATURES } from "./signatures";

/**
 * Check if the current browser's User-Agent matches a known AI bot.
 * Case-insensitive substring match against known signatures.
 */
export function isBot(userAgent?: string): boolean {
  const ua = userAgent ?? navigator.userAgent;
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return BOT_SIGNATURES.some((sig) => lower.includes(sig.toLowerCase()));
}
