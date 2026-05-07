import { env } from "../config/env.js";
import { getSentinelHubToken } from "./auth.js";

const allowedPaths = new Set([
  "/api/v1/catalog/1.0.0/search",
  "/api/v1/process",
  "/api/v1/statistics",
]);

function assertAllowedPath(path) {
  if (!allowedPaths.has(path)) {
    const error = new Error("Sentinel Hub path is not allowed.");
    error.status = 400;
    throw error;
  }
}

export async function proxySentinelHubRequest(path, body) {
  assertAllowedPath(path);

  const token = await getSentinelHubToken();
  let response;
  try {
    response = await fetch(`${env.sentinelHub.baseUrl}${path}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (cause) {
    const error = new Error("Failed to reach Sentinel Hub.");
    error.status = 502;
    error.details = cause.message;
    throw error;
  }

  const contentType = response.headers.get("content-type") ?? "application/json";
  const buffer = Buffer.from(await response.arrayBuffer());

  if (!response.ok) {
    const error = new Error("Sentinel Hub request failed.");
    error.status = response.status;
    error.details = buffer.toString("utf8");
    throw error;
  }

  return {
    contentType,
    body: buffer,
  };
}
