import { env, assertSentinelHubConfig } from "../config/env.js";

let cachedToken = null;

export async function getSentinelHubToken() {
  assertSentinelHubConfig();

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30000) {
    return cachedToken.accessToken;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.sentinelHub.clientId,
    client_secret: env.sentinelHub.clientSecret,
  });

  const response = await fetch(env.sentinelHub.tokenUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const details = await response.text();
    const error = new Error("Failed to authenticate with Sentinel Hub.");
    error.status = response.status;
    error.details = details;
    throw error;
  }

  const token = await response.json();
  cachedToken = {
    accessToken: token.access_token,
    expiresAt: now + token.expires_in * 1000,
  };

  return cachedToken.accessToken;
}
