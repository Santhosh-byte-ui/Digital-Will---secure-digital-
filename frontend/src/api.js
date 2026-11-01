const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_BASE_URL;

  if (typeof configured === "string" && configured.trim()) {
    return configured.trim().replace(/\/$/, "");
  }

  // Explicit local development fallback
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }

  // In production builds without VITE_API_BASE_URL configured, default to same-origin relative root
  // and log a clear diagnostic warning to avoid routing to obsolete hosted services.
  if (typeof window !== "undefined") {
    console.warn(
      "[Digital-Will API] VITE_API_BASE_URL is not set. Defaulting API requests to same-origin.",
    );
  }

  return "";
};

export const API_BASE_URL = getApiBaseUrl();

export const apiFetch = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch (error) {
    window.dispatchEvent(
      new CustomEvent("digital-will:api-error", {
        detail: {
          message:
            "Cannot reach the service. Check your connection and try again.",
        },
      }),
    );
    throw error;
  }

  if (response.status === 401 && localStorage.getItem("token")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("digital-will:unauthorized"));
  } else if (!response.ok && response.status !== 401) {
    window.dispatchEvent(
      new CustomEvent("digital-will:api-error", {
        detail: { message: `The request failed (HTTP ${response.status}).` },
      }),
    );
  }

  return response;
};
