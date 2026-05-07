import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 8787),
  corsOrigins: (process.env.CORS_ORIGINS ?? process.env.CORS_ORIGIN ??
    "http://127.0.0.1:5173,http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  sentinelHub: {
    clientId: process.env.SENTINEL_HUB_CLIENT_ID,
    clientSecret: process.env.SENTINEL_HUB_CLIENT_SECRET,
    baseUrl: process.env.SENTINEL_HUB_BASE_URL ?? "https://services.sentinel-hub.com",
    tokenUrl: process.env.SENTINEL_HUB_TOKEN_URL ??
      "https://services.sentinel-hub.com/auth/realms/main/protocol/openid-connect/token",
  },
};

export function assertSentinelHubConfig() {
  if (!env.sentinelHub.clientId || !env.sentinelHub.clientSecret) {
    const error = new Error("Sentinel Hub credentials are not configured.");
    error.status = 500;
    error.details = "Set SENTINEL_HUB_CLIENT_ID and SENTINEL_HUB_CLIENT_SECRET in backend/.env.";
    throw error;
  }
}
