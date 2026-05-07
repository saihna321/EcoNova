import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "./apiConfig";

export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = details.status;
    this.statusText = details.statusText;
    this.body = details.body;
  }
}

function buildUrl(baseUrl, path) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  if (contentType.startsWith("image/")) {
    return response.blob();
  }
  return response.text();
}

function makeAbortReason(message, name = "AbortError") {
  if (typeof DOMException === "function") {
    return new DOMException(message, name);
  }

  const error = new Error(message);
  error.name = name;
  return error;
}

export async function request(path, options = {}) {
  const {
    baseUrl = API_BASE_URL,
    body,
    headers = {},
    method = "GET",
    signal,
    timeoutMs = REQUEST_TIMEOUT_MS,
  } = options;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort(makeAbortReason(`Request timed out after ${timeoutMs}ms.`, "TimeoutError"));
  }, timeoutMs);

  if (signal) {
    signal.addEventListener(
      "abort",
      () => controller.abort(signal.reason ?? makeAbortReason("Request was cancelled.")),
      { once: true }
    );
  }

  try {
    const isJsonBody = body && !(body instanceof FormData);
    const response = await fetch(buildUrl(baseUrl, path), {
      method,
      headers: {
        ...(isJsonBody ? { "content-type": "application/json" } : {}),
        ...headers,
      },
      body: isJsonBody ? JSON.stringify(body) : body,
      signal: controller.signal,
    });
    const parsedBody = await parseResponse(response);

    if (!response.ok) {
      throw new ApiError(`Request failed: ${response.status} ${response.statusText}`, {
        status: response.status,
        statusText: response.statusText,
        body: parsedBody,
      });
    }

    return parsedBody;
  } catch (error) {
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      throw new ApiError(error.message || "Request was cancelled.", {
        statusText: error.name,
      });
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
