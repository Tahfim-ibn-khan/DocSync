const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function api(endpoint, options = {}) {
  if (!BASE_URL) {
    throw new Error("Missing BASE_URL. Check your environment variables.");
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { token }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${BASE_URL}/api/v1${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API error");
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}
