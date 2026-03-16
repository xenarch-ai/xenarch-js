export interface GateResponse {
  gate_id: string;
  price_usd: string;
  splitter: string;
  collector: string;
  network: string;
  asset: string;
  verify_url: string;
  expires: string;
}

export interface GateStatus {
  gate_id: string;
  status: string;
  price_usd: string;
  paid_at: string | null;
}

/** Validate that a URL uses https (or http for localhost dev). */
function validateApiUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("Invalid protocol");
    }
    return url;
  } catch {
    throw new Error(`Invalid API URL: ${url}`);
  }
}

/** Runtime check that required string fields exist on API response. */
function assertString(obj: Record<string, unknown>, key: string): string {
  const val = obj[key];
  if (typeof val !== "string" || val.length === 0) {
    throw new Error(`Invalid response: missing or empty "${key}"`);
  }
  return val;
}

function validateGateResponse(data: unknown): GateResponse {
  if (!data || typeof data !== "object") throw new Error("Invalid response");
  const obj = data as Record<string, unknown>;
  return {
    gate_id: assertString(obj, "gate_id"),
    price_usd: assertString(obj, "price_usd"),
    splitter: assertString(obj, "splitter"),
    collector: assertString(obj, "collector"),
    network: assertString(obj, "network"),
    asset: typeof obj.asset === "string" ? obj.asset : "",
    verify_url: assertString(obj, "verify_url"),
    expires: assertString(obj, "expires"),
  };
}

function validateGateStatus(data: unknown): GateStatus {
  if (!data || typeof data !== "object") throw new Error("Invalid response");
  const obj = data as Record<string, unknown>;
  return {
    gate_id: assertString(obj, "gate_id"),
    status: assertString(obj, "status"),
    price_usd: assertString(obj, "price_usd"),
    paid_at: typeof obj.paid_at === "string" ? obj.paid_at : null,
  };
}

/**
 * Create a payment gate for the current URL.
 * Expects a 402 response with payment instructions.
 */
export async function createGate(
  apiUrl: string,
  siteToken: string,
  url: string
): Promise<GateResponse> {
  const validUrl = validateApiUrl(apiUrl);
  const res = await fetch(`${validUrl}/gates`, {
    method: "POST",
    headers: {
      "X-Site-Token": siteToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, detection_method: "ua_match" }),
  });

  if (res.status !== 402 && !res.ok) {
    throw new Error(`Gate creation failed: ${res.status}`);
  }

  return validateGateResponse(await res.json());
}

/**
 * Check the status of an existing gate.
 */
export async function checkGateStatus(
  apiUrl: string,
  gateId: string
): Promise<GateStatus> {
  const validUrl = validateApiUrl(apiUrl);
  const encodedId = encodeURIComponent(gateId);
  const res = await fetch(`${validUrl}/gates/${encodedId}`);

  if (!res.ok) {
    throw new Error(`Gate status check failed: ${res.status}`);
  }

  return validateGateStatus(await res.json());
}
